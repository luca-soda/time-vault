
# Time Vault

<img src='https://github.com/luca-soda/time-vault/blob/main/screenshots/time-vault.png?raw=true'>

Time Vault is an Electron-based example use case utilizing the [Time-Lock microservice](https://github.com/luca-soda/time-lock), built using `electron-react-boilerplate`. This project serves as a demonstrative example of how the Time-Lock service can be integrated into applications for secure file encryption with future unlock capabilities.

**The project has hardcoded localhosts for the Time-Lock service in encrypt.ts and decrypt.ts files as it's only a demonstrative example.**

## Features

- **File Encryption**: Users can select a file and a target date. The application encrypts the file using an RSA public key provided by Time-Lock, embedding the necessary secrets to reconstruct the public key within the encrypted file itself.
- **Decryption Availability**: Upon reaching the specified date, users can decrypt the encrypted file using the `decrypt` function by requesting the private key from Time-Lock.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed [Node.js](https://nodejs.org/) and [npm](https://npmjs.com/).
- You have access to the Time-Lock microservice.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/luca-soda/time-vault
   cd time-vault
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

## Usage - Encryption

1. Launch the application.
2. Use the interface to select a file and set a decryption date.
3. Confirm to encrypt and store the file.

## Usage - Decryption
1. Launch the application
2. Use the interface to select the encrypted file.
3. Confirm to decrypt the file.

Note: The decryption process will be successful after the specified date has passed.

