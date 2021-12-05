import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import collectionsSlice from './collectionsSlice';
import smartContractSlice from './smartContractSlice';

export const store = configureStore({
  reducer: {
    smartContract: smartContractSlice,
    collections: collectionsSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
