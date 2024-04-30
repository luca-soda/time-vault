import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./App.css";
import { DateTimePicker, LocalizationProvider, StaticDatePicker, StaticDateTimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import moment from 'moment';

function Home() {
    const encryptFile = async () => {
        if (confirm(`Are you sure you want to encrypt with this configuration?\n\nThe file will be encrypted until ${dateTime.format("YYYY-MM-DD HH:mm:ss")}\n`)) {
            window.electron.ipcRenderer.sendMessage("encrypt-action", {
                hideFileName: false,
                releaseDate: dateTime.unix()
            });
        }
    };

    const decryptFile = async () => {
        window.electron.ipcRenderer.sendMessage("decrypt-action");
        window.electron.ipcRenderer.once("decrypt-action", (event: any) => {
            event.event === 'error' ? alert(`${event.message}\n\nThe file will be available to decrypt at ${moment(event.dateTime,'X').format('YYYY-MM-DD HH:mm:ss')}`) :
            alert(`File has been decrypted! Have fun \n\n${event.fileName}\n\n`);
        });
    };

    const [dateTime, setDate] = useState(moment());

    return (
        <div className="flex flex-1 flex-col text-black bg-white">
            <div className="h-full flex-row flex items-center justify-center mr-28">
                <div className="h-full flex-col flex justify-center -mt-10">
                    <h1 className="text-3xl font-bold text-center mt-10 orbitron-title">Time Vault</h1>
                    <img src={logo} className="w-3/6 mx-auto mt-8" alt="logo" />
                    <div className="w-3/6 mx-auto flex-col flex">
                        <button
                            onClick={encryptFile}
                            disabled={dateTime == null}
                            className="orbitron-title py-2.5 px-5 me-2 mb-2 text-sm disabled:bg-red-300 font-medium text-black focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-100 dark:text-black dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                            Encrypt
                        </button>
                        <button
                            onClick={decryptFile}
                            className="orbitron-title py-2.5 px-5 me-2 mb-2 text-sm font-medium text-black focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-100 dark:text-black dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                            Decrypt
                        </button>
                    </div>
                </div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <StaticDateTimePicker sx={{'.MuiPickersLayout-actionBar button': { opacity: 0 }}} onChange={(m) => (setDate(m ?? moment()))} maxDate={moment().add(1,'year')} value={dateTime} disablePast/>
                </LocalizationProvider>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
}
