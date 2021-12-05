import { ContractInterface } from "@ethersproject/contracts";
import factoryContract from './contracts-compiled/NftFactory.json';
import collectionContract from './contracts-compiled/NftCollection.json';

export function getFactoryContractAddress(): string {
  return factoryContract.networks[5777].address;
};

export function getFactoryContractAbi() : ContractInterface {
  return factoryContract.abi;
};

export function getCollectionContractAbi() : ContractInterface {
  return collectionContract.abi;
};
