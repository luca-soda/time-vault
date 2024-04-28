import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./App.css";

function Home() {
    const encryptFile = async () => {
        window.electron.ipcRenderer.sendMessage("encrypt-action", {
            hideFileName: false,
        });
    };

    const decryptFile = async () => {
        window.electron.ipcRenderer.sendMessage("decrypt-action");
        window.electron.ipcRenderer.once("decrypt-action", (event) => {
            alert(event);
        });
    };

    return (
        <div className="flex flex-1 flex-col bg-slate-600 text-white">
            <h1 className="text-3xl font-bold text-center pt-4">Time Vault</h1>
            <img src={logo} className="w-3/6 mx-auto mt-8" alt="logo" />
            <div className="h-full flex-col flex justify-center -mt-10">
                <div className="w-3/6 mx-auto flex-col flex">
                    <button
                        onClick={encryptFile}
                        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                        Encrypt
                    </button>
                    <button
                        onClick={decryptFile}
                        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                        Decrypt
                    </button>
                </div>
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
