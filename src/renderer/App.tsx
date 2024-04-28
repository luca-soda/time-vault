import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import logo from '../../assets/logo.png'
import './App.css';

function Home() {
  const encryptFile = async () => {
    window.electron.ipcRenderer.sendMessage('encrypt-action', {
      hideFileName: false
    });
  }

  const decryptFile = async () => {
    window.electron.ipcRenderer.sendMessage('decrypt-action');
    window.electron.ipcRenderer.once('decrypt-action', (event) => {
      alert(event)
    });
  }

  return (
    <div className='w-screen h-screen'>
      <h1 className='text-3xl font-bold text-center pt-4'>Time Vault</h1>
      <div className='flex flex-row'>
        <div className='flex-1'>
          <img src={logo} className='w-full mx-auto' alt='logo' />
        </div>
        <div className='flex-1 flex-col flex'>
          <button className='btn' onClick={encryptFile}>Encrypt</button>
          <button className='btn' onClick={decryptFile}>Decrypt</button>
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
