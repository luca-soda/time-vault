import fs from 'fs';
import axios from 'axios';
import { dialog, ipcMain } from 'electron';
import NodeRSA from 'node-rsa';
import path from 'path';

const TIME_LOCK_SERVER = "http://localhost:8000/key";

function splitBuffer(combinedBuffer: Buffer) {
    const buffer1Length = combinedBuffer.readUInt32BE(0);

    const buffer1 = combinedBuffer.buffer.slice(4, 4 + buffer1Length);
    const buffer2 = combinedBuffer.buffer.slice(4 + buffer1Length);

    return {
        buffer1: Buffer.from(buffer1),
        buffer2: Buffer.from(buffer2),
    }
}

ipcMain.on("decrypt-action", async (event) => {
    const result = await dialog.showOpenDialog({ properties: ["openFile"] });
    const fileContent = fs.readFileSync(result.filePaths[0], { encoding: null, flag: "r" });
    const { buffer1: json, buffer2: bin } = splitBuffer(fileContent);
    const data = JSON.parse(json.toString('utf-8'));
    let response = null;
    try {
        response = await axios.post(`${TIME_LOCK_SERVER}/${data.uuid}`, {
            secret: data.secret,
        });
    } catch (e) {
        event.reply("decrypt-action", {event: 'error', message: "Too soon to decrypt the file. Please try again later.", dateTime: data.releaseDate});
        return;
    }
    const rsa = new NodeRSA(response!.data.private_key, "pkcs8-private-pem");
    const decrypted = rsa.decrypt(bin, "buffer");
    fs.writeFileSync(path.join(path.dirname(result.filePaths[0]),data.fileName), decrypted);
    event.reply("decrypt-action", { event: 'success', fileName: path.basename(result.filePaths[0]) });
});