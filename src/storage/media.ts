import { Nft }  from '../models/Nft';
import db from './db';

export const saveNft = async (nft: Nft) => {
    if (nft.id) {
        await db.nfts.update(nft.id, {...nft});
    } else {
        await db.nfts.add(nft);
    }
};

export const getAllNfts = async (collectionAddress: string) => {
    const nfts = await db.nfts.where('collectionAddress').equals(collectionAddress).toArray();
    return nfts;
};

export const getNftById = async (id: number) => {
    const nft = db.nfts.get(id);
    return nft;
};

export const getNftsPendingUpload = async () => {
    const nfts = await db.nfts.where('url').equals('').toArray();
    return nfts;
};

export const getNftsUploaded = async () => {
    const nfts = await db.nfts.where('url').notEqual('').toArray();
    return nfts;
};
