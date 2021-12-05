import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import CreateSmartContractForm from './create-smart-contract-form';
//import { estimateGas, deployContract } from '../services/deploy-contract';

import { loadWeb3, createCollection, listenForConfirmations } from '../services/nft-factory-proxy';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
    selectMax,
    selectSymbol,
    selectName,
    selectPath,
    setConfirms,
    setAddress,
    setPath,
    clearForm
} from '../app/smartContractSlice';
import { setNewCollection } from '../app/collectionsSlice';

export default function CreateSmartContractDialog() {
    const dispatch = useAppDispatch();

    const max = useAppSelector(selectMax);
    const symbol = useAppSelector(selectSymbol);
    const name = useAppSelector(selectName);
    const path = useAppSelector(selectPath);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCreateCollectionConfirmation = (confirmations: number) => {
        dispatch(setConfirms(confirmations));
    }

    const handleCreate = async () => {
        try {
            const loadError = await loadWeb3();
            if (loadError) {
                alert(loadError);
                return;
            }

            // const gas = await estimateGas(name, symbol, max);
            // console.log(`gas: ${gas}`);

            // //increase gaslimit by 20%
            // const gasLimit = Math.trunc(gas + (gas * 0.1));

            // const result = await deployContract(name, symbol, max, gasLimit, handleDeployConfirmation);

            const result = await createCollection(name, symbol, max);
            console.log(`contract created successfully!`);
            console.log(result.address);
            dispatch(setAddress(result.address));
            dispatch(setPath(result.explorerPath));
            dispatch(setNewCollection({name, symbol, address: result.address, nfts: []}))
            
            await listenForConfirmations(result.tx, handleCreateCollectionConfirmation);
        } catch (err) {
            console.log(`error handler:`);
            console.log(err);
            alert(err);
        }
    };

    const handleClose = () => {
        setOpen(false);
        dispatch(clearForm());
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Create New NFT Collection
            </Button>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                maxWidth="xs"

                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">New NFT Collection</DialogTitle>
                <DialogContent style={{ overflow: "hidden" }}>
                    <CreateSmartContractForm />
                </DialogContent>
                <DialogActions>
                    {!path &&
                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        onClick={handleCreate}>
                        Create
                    </Button>
                    }
                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
