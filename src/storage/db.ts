import { Dexie } from "dexie";
import { Nft } from '../models/Nft';
import { NftMedia } from '../models/NftMedia';

class NftDatabase extends Dexie {
    nfts!: Dexie.Table<Nft, number>;
    nftMedia!: Dexie.Table<NftMedia, number>;

    constructor() {
        super("NftDatabase");
        this.version(1).stores({
            //must match properties on Nft interface
            nfts: "++id,collectionAddress,tokenId,name,description",
            nftMedia: "id"
        });
    }
}

var db = new NftDatabase();

export default db;