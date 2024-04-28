import axios from "axios";
import { dialog, ipcMain } from "electron";
import moment from "moment";
import NodeRSA from "node-rsa";
import fs from "fs";
import path from "path";

const TIME_LOCK_SERVER = "http://localhost:8000/key";

function joinBuffers(buffer1: Buffer, buffer2: Buffer): Buffer {
    const sizeBuffer = Buffer.alloc(4);
    sizeBuffer.writeUInt32BE(buffer1.length, 0);
    const combinedContent = Buffer.concat([sizeBuffer, buffer1, buffer2]);
    return combinedContent;
}

const fixRsaKey = (key: string) => key.replace("-----END RSA PUBLIC KEY-----\n", "-----END RSA PUBLIC KEY-----");

ipcMain.on("encrypt-action", async (event, options) => {
    const result = await dialog.showOpenDialog({
        properties: ["openFile"],
    });
    const response = await axios.post(TIME_LOCK_SERVER, {
        release_date: moment().add(30, "seconds").unix(),
    });
    const rsa = new NodeRSA(fixRsaKey(response.data.public_key), "pkcs1-public-pem");
    const fileContent = fs.readFileSync(result.filePaths[0], {
        encoding: null,
        flag: "r",
    });
    const encrypted = rsa.encrypt(fileContent, "buffer");
    const data = {
        uuid: response.data.uuid,
        releaseDate: response.data.release_date,
        secret: response.data.secret,
        fileName: options.hideFileName ? `secret.${path.extname(result.filePaths[0])}` : path.basename(result.filePaths[0]),
    };
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const rsaFile = joinBuffers(dataBuffer, encrypted);
    let outputPath = path.join(path.dirname(result.filePaths[0]), options.hideFileName ? `secret-${moment.now()}.rsa` : `${path.basename(result.filePaths[0], path.extname(result.filePaths[0]))}-${moment.now()}.rsa`);
    fs.writeFileSync(outputPath, rsaFile);
    event.reply("encrypt-action", result.filePaths);
});
