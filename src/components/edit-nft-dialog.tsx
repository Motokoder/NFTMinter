import { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { saveNft } from '../storage/media';
import { Nft } from '../models/Nft';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function EditNftDialog(
    props: {
        nft: Nft,
        isOpen: boolean,
        save: (editedNft: Partial<Nft>) => void,
        close: () => void
    }) {
    const [name, setName] = useState<string>();
    const [description, setDescription] = useState<string>();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const classes = useStyles();

    useEffect(() => {
        setName(props.nft.name);
        setDescription(props.nft.description);
    }, [props.nft])

    const clearForm = () => {
        setName('');
        setDescription('');
    }

    const save = () => {
        let editedNft: Partial<Nft> = {};
        editedNft.name = name;
        editedNft.description = description;
        props.save(editedNft);
        clearForm();
        props.close();
    }

    return (
        <Dialog
            fullScreen={fullScreen}
            open={props.isOpen}
            maxWidth="xs"
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">Edit NFT</DialogTitle>
            <DialogContent style={{ overflow: "hidden" }}>
                <form noValidate autoComplete="off">
                    <div className={classes.root}>
                        <Grid container spacing={3}>
                            <>
                                <Grid item xs={12} style={{ whiteSpace: 'nowrap' }}>
                                    <TextField style={{ width: '100%' }}
                                        label="Name"
                                        variant="filled"
                                        InputProps={{ inputProps: { maxLength: 220 } }}
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12} style={{ whiteSpace: 'nowrap' }}>
                                    <TextField style={{ width: '100%' }}
                                        label="Description"
                                        variant="filled"
                                        multiline={true}
                                        rows={10}
                                        InputProps={{ inputProps: { maxLength: 1000 } }}
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                    />
                                </Grid>
                            </>
                        </Grid>
                    </div>
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={props.close}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={save}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>

    );
}
