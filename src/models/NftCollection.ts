import { Nft } from "./Nft";

export type NftCollection = {
    address: string,
    name: string,
    symbol: string,
    nfts?: Nft[]
}