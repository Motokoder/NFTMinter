import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
export interface SmartContractState {
  max: number,
  symbol: string,
  name: string,
  confirms: number,
  address: string,
  path: string,
}

const initialState : SmartContractState = {
  max: 1,
  symbol: '',
  name: '',
  confirms: 0,
  address: '',
  path: '',
};

export const smartContractSlice = createSlice({
  name: 'smartContract',
  initialState,
  reducers: {
    setMax: (state, action: PayloadAction<number>) => { state.max = action.payload; },
    setSymbol: (state, action: PayloadAction<string>) => { state.symbol = action.payload; },
    setName: (state, action: PayloadAction<string>) => { state.name = action.payload; },
    setConfirms: (state, action: PayloadAction<number>) => { state.confirms = action.payload; },
    setAddress: (state, action: PayloadAction<string>) => { state.address = action.payload; },
    setPath: (state, action: PayloadAction<string>) => { state.path = action.payload; },
    clearForm: (state, action: PayloadAction) => { 
      state.max = 1;
      state.symbol = '';
      state.name = '';
      state.address = '';
      state.path = '';
    }
  },
});

export const { 
  setMax,
  setSymbol,
  setName,
  setConfirms,
  setAddress,
  setPath,
  clearForm
} = smartContractSlice.actions;

export const selectMax = (state: RootState) => state.smartContract.max;
export const selectSymbol = (state: RootState) => state.smartContract.symbol;
export const selectName = (state: RootState) => state.smartContract.name;
export const selectConfirms = (state: RootState) => state.smartContract.confirms;
export const selectAddress = (state: RootState) => state.smartContract.address;
export const selectPath = (state: RootState) => state.smartContract.path;

export default smartContractSlice.reducer;
