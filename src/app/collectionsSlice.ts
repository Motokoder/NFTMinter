import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Nft } from '../models/Nft';
import { NftCollection } from '../models/NftCollection';
import { RootState } from './store';
import { getAllNfts } from '../storage/media';
export interface CollectionsState {
  collections: NftCollection[],
  currentCollection: NftCollection | null
}

const initialState : CollectionsState = {
  collections: [],
  currentCollection: null
};

export const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollections: (state, action: PayloadAction<NftCollection[]>) => {
        state.collections = action.payload;
    },
    setCurrentCollection: (state, action: PayloadAction<NftCollection | null>) => {
        state.currentCollection = action.payload;
    },
    setNewCollection: (state, action: PayloadAction<NftCollection>) => {
      state.collections.push(action.payload);
      state.collections.sort((a, b) => a.name.localeCompare(b.name));
    },
    updateCurrentCollectionNfts: (state, action: PayloadAction<Nft[]>) => {
      if (state.currentCollection) {
        state.currentCollection.nfts = action.payload
      }
    },
    updateCurrentCollectionNft: (state, action: PayloadAction<Nft>) => {
      if (state.currentCollection) {
        const current = state.currentCollection.nfts;
        if (current) {
          const pos = current.findIndex(nft => nft.id === action.payload.id);
          if (pos !== -1) {
            state.currentCollection.nfts = [...current.slice(0, pos), action.payload, ...current.slice(pos + 1)];
          }
        }
      }
    }
  },
});

export const { 
  setCollections,
  setCurrentCollection,
  setNewCollection,
  updateCurrentCollectionNfts,
  updateCurrentCollectionNft
} = collectionsSlice.actions;

export const selectCollections = (state: RootState) => state.collections.collections;
export const selectCurrentCollection = (state: RootState) => state.collections.currentCollection;

export default collectionsSlice.reducer;
