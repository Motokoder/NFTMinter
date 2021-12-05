# Overview

- This project is an minter for ERC-721 compatible NFT collections on the Ethereum Virtual Machine (EVM). The EVM runs on the Ethereum blockchain and other blockchains such as Avalanche. A minter is an application for creating new NFTs on a blockchain.
- Any ERC-721 compatible NFT marketplace should be able to display the NFTs minted in these collections.
- The goal of this project is to provide an intuitive user interface for managing the workflow of uploading bulk media (images, video, sound) used for NFTs, saving the media to permanent Arweave storage, creating bulk metadata files that are also saved to Arweave, and then finally minting bulk NFTs within a custom collection.
- NFT data stored on the EVM's host blockchain is very limited and includes basic information such as the id, the owner's wallet and the URL to the metadata file.
- Historically, the media for many NFTs has been hosted on centrally controlled servers. As a result the URL to the NFT metadata has in many cases become a broken link. Since NFTs imply permanent ownership of digital assets, the storage mechanism of the accompanying digital assets must guarantee permanence.
- To solve this dilemma, this project stores the metadata file and digital assets on Arweave. Arweave is a separate blockchain designed for storing large amounts of data permanently. The URL stored on the EVM host blockchain points to the permanent storage location of the metadata file on Arweave. The metadata file will in turn point to the digital assets that are also stored on Arweave.

# Getting Started

- Install Node (latest)
- Install VS Code (latest)
- Add "solidity" VS Code extension (https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)
- Install Truffle Suite for writing and testing smart contracts (trufflesuite.com)
  - npm install --g truffle@5.1.39
- Install Ganache to run local test blockchain (trufflesuite.com/ganache)
  - Run Ganache
  - Click Quickstart to create a new Ethereum test network.
  - Select Settings (gear icon)
    - In the "Workspace" tab click the "Add Project" button. Select the truffle-config.js file.
    - In the "Accounts & Keys" tab set the "ACCOUNT DEFAULT BALANCE" to 10000 and the "TOTAL ACCOUNTS TO GENERATE" to 2 or more.
- Install the Metamask Ethereum wallet in your browser (https://metamask.io/download.html)
  - Configure Ganache network in Metamask: https://www.trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask
    - Name: Ganache (or anything you want)
    - URL: http://127.0.0.1:7545
    - Chain id: 1337
  - Select the Ganache network in Metamask.
- Import one or more accounts from Ganache into Metamask
  - Open Ganache, click the key icon to the right of an account, then copy the private key.
  - Open Metamask, click the avatar in the top right corner of the screen
    - Select Import Account
    - Paste the private key
    - Click the Import button
    - Select the imported account

# Compile and Deploy Smart Contracts to the Ganache Test Network

WARNING: You will lose all test data (NFT collections) because this command will replace the existing smart contracts on the test blockchain. Smart contracts are immutable code so they can only be replaced, creating a new address.

Note: This command creates a transaction to deploy a new smart contract so it will cost a gas fee. The wallet balance in Ganache will be reduced (not actual ETH).

`truffle migrate --reset`

If you are using Powershell in the VS Code terminal and get an execution error, try to run the following command first:

`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

# Running the App

- Start Ganache (your local Ethereum Test Network)
- run `npm start`
- browse to http://localhost:3000
- Open the Metamask wallet and login with your password.
- Select the "Ganache" network from the drop-down.
- Select the "My NFTs" menu in the app.
- Click the "CREATE NEW NFT COLLECTION" button.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

This project was bootstrapped with [Create React App TypeScript Template](https://create-react-app.dev/docs/adding-typescript/).


## Troubleshooting

------------------------------------------------------------------
### Error

<span style="color:red">Unhandled Rejection (Error): call revert exception (method="getWallets()", errorSignature=null, errorArgs=[null], reason=null, code=CALL_EXCEPTION, version=abi/5.1.0)</span>

### Solution

Deploy smart contracts to the Ganache local Ethereum network.

------------------------------------------------------------------