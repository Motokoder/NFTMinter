import axios from "axios";
import { BigNumber, ethers } from "ethers";
import {
    getFactoryContractAddress,
    getFactoryContractAbi,
    getCollectionContractAbi,
} from "../appconfig";
import { NftCollection } from "../models/NftCollection";
//import { Nft } from "../models/Nft";

const w = window as any;
let web3: any;
let provider: any;
let account: any;
let explorerBasePath = "";
let factoryContractReference: ethers.Contract;

export const watchNetworkChanges = () => {
    // Force page refreshes on network changes
    // The "any" network will allow spontaneous network changes
    const provider = new ethers.providers.Web3Provider(w.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        if (oldNetwork) {
            window.location.reload();
        }
    });

    w.ethereum.on('accountsChanged', function (accounts: string[]) {
        console.log(accounts);
        window.location.reload();
    })
};

export const loadWeb3 = async () => {
    try {
        // A Web3Provider wraps a standard Web3 provider, which is
        // what Metamask injects as window.ethereum into each page
        web3 = new ethers.providers.Web3Provider(w.ethereum);
        provider = web3.provider as any;

        await provider.enable();
        //await web3.eth.requestAccounts();

        if (!provider?.isMetaMask) {
            return "Please connect with Metamask.";
        }

        // Chain Ids:
        // Avalanche FUJI Test Network: 0xa869
        // Avalanche Main Network: 0xa86a
        // Ethereum Main Network: 0x1
        // Ethereum Kovan Test Network: 0x2a
        // Ethereum Ropsten Test Network: 0x3
        // Ethereum Rinkeby Test Network: 0x4
        // Ethereum Goerli Test Network: 0x5
        switch (provider.chainId) {
            case "0xa869":
            case "0x539": //ganache
                explorerBasePath = "https://cchain.explorer.avax-test.network";
                break;
            case "0xa86a":
                explorerBasePath = "https://cchain.explorer.avax.network";
                break;
            default:
                return "Unsupported network. Please select the Avalanche Main Network in Metamask.";
        }

        //const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        account = provider.selectedAddress;

        if (!account) {
            return "Please select an account in your Metamask wallet.";
        }
    } catch (error: any) {
        return error.message;
    }
};

const getFactoryContractReference = () => {
    if (!factoryContractReference) {
        factoryContractReference = new ethers.Contract(
            getFactoryContractAddress(),
            getFactoryContractAbi(),
            web3
        ) as ethers.Contract;

        // factoryContractReference.on(
        //     "CollectionCreated",
        //     (owner: string, contractAddress: string) => {
        //         console.log(
        //             `CollectionCreated: owner ${owner}; contractAddress ${contractAddress}`
        //         );
        //     }
        // );
    }
    return factoryContractReference;
};

const getCollectionContractReference = (address: string) => {
    return new ethers.Contract(
        address,
        getCollectionContractAbi(),
        web3
    ) as ethers.Contract;
};

export const createCollection = async (
    name: string,
    symbol: string,
    maxTokens: number
) => {
    return new Promise<{ address: string; explorerPath: string; tx: any }>(
        async (resolve, reject) => {
            try {
                // The Contract object
                const contract = getFactoryContractReference();
                const signer = web3.getSigner(account);
                const contractWithSigner = contract.connect(signer);

                const overrides = {
                    //gasLimit: estimatedGas,
                    //gasPrice,
                    value: ethers.utils.parseEther("10"),
                };

                const tx = await contractWithSigner.createCollection(
                    name,
                    symbol,
                    maxTokens,
                    overrides
                );
                console.log(tx);

                let lastTransactionHash = "";

                const receipt = await tx.wait();
                lastTransactionHash = receipt.transactionHash;
                console.log("tx.wait completed");
                console.log(receipt);

                const collectionCreatedListener = (
                    owner: string,
                    contractAddress: string,
                    event: { transactionHash: string }
                ) => {
                    if (event.transactionHash === lastTransactionHash) {
                        console.log("CollectionCreated completed");

                        // The event object contains the verbatim log data, the
                        // EventFragment and functions to fetch the block,
                        // transaction and receipt and event functions
                        console.log(`owner: ${owner}`);
                        console.log(`contractAddress: ${contractAddress}`);
                        console.log(
                            `event.transactionHash: ${event.transactionHash}`
                        );

                        lastTransactionHash = "";
                        const explorerPath = `${explorerBasePath}/address/${contractAddress}`;
                        resolve({ address: contractAddress, explorerPath, tx });

                        contract.off(
                            "CollectionCreated",
                            collectionCreatedListener
                        );
                    }
                };

                contract.on("CollectionCreated", collectionCreatedListener);
            } catch (error) {
                reject(error.message);
            }
        }
    );
};

export const listenForConfirmations = async (
    tx: any,
    confirmationsCallback: (confirmations: number) => void
) => {
    //TODO: Figure out how to listen for multiple transactions
    await tx.wait(1);
    confirmationsCallback(1);
};

export const getNftCollection = async (
    address: string
): Promise<NftCollection> => {
    const collContract = getCollectionContractReference(address);
    const name = await collContract.name();
    const symbol = await collContract.symbol();

    const nftCollection: NftCollection = {
        address,
        name,
        symbol,
        nfts: [],
    };

    //TODO: Remove after first mint
    // const signer = web3.getSigner(account);
    // const collContractWithSigner = collContract.connect(signer);
    // await collContractWithSigner.mintToken('HaugigO_TmcveVI034ViPsUi09KeRhJ_gJ4YkNHygPg');

    // const totalSupply = await collContract.totalSupply();
    // console.log(`totalSupply: ${totalSupply}`);

     const tokenIds = await collContract.tokensOfOwner(account) as BigNumber[];
    // console.log('Tokens of Owner');
    // console.log(tokenIds.map(t => t.toNumber()));

    // const ownerOfToken = await collContract.ownerOf(1);
    // console.log(`ownerOf: ${ownerOfToken}`);

    for (const tokenId of tokenIds) {
        const url = await collContract.tokenURI(tokenId) as string;
        
        console.log('*** collection contract tokenURI ***');
        console.log(url);

        var { data } = await axios.get(url);

        console.log('axios response');        

        //TODO: Figure out how to merge this with the NFT objects
        //      in IndexedDB.
        nftCollection.nfts?.push({ collectionAddress: address, tokenId: tokenId.toNumber(), dataUrl: data.image, externalUrl: data.external_url, name: data.name, description: data.description});
    }

    return nftCollection;
};

export const getNftCollections = async (): Promise<NftCollection[]> => {
    //uses the selected wallet account
    const contract = getFactoryContractReference();
    const wallets = await contract.getWallets();
    const addresses = await contract.getWalletContracts(account);

    console.log('Wallets');
    console.log(wallets);

    console.log(`Addresses for wallet ${account}`);
    console.log(addresses);

    const nftCollections: NftCollection[] = [];

    for (let address of addresses) {
        const collContract = getCollectionContractReference(address);
        const name = await collContract.name();
        const symbol = await collContract.symbol();

        const nftCollection: NftCollection = {
            address,
            name,
            symbol,
            nfts: [],
        };

        nftCollections.push(nftCollection);
    }

    nftCollections.sort((a, b) => a.name.localeCompare(b.name));

    return nftCollections;
};

// export const showEvents = async () => {
//     const contract = getFactoryContractReference();
//     const filter = {
//         address: getFactoryContractAddress(),
//         fromBlock: 0,
//         toBlock: 10000,
//         topics: [contract.interface.events.CollectionCreated],
//     };
//     const logs = await web3.getLogs(filter);
//     console.log(logs);
// };
