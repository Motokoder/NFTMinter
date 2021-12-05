import { NftMedia } from './NftMedia';

export type Nft = {
    id?: number;
    collectionAddress: string;
    tokenId?: number;
    name?: string;
    description?: string;
    externalUrl?: string;
    arweaveHash?: string;
    media?: NftMedia
    //dataUrl?: string;

    //todo: add attributes
}