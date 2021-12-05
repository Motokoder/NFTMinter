import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import HelpIcon from './help-icon';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  setMax,
  selectMax,
  setSymbol,
  selectSymbol,
  setName,      
  selectName,
  selectAddress,
  selectPath
} from '../app/smartContractSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function CreateSmartContractForm() {
  const dispatch = useAppDispatch();

  const max = useAppSelector(selectMax);
  const symbol = useAppSelector(selectSymbol);
  const name = useAppSelector(selectName);
  const address = useAppSelector(selectAddress);
  const path = useAppSelector(selectPath);

  const classes = useStyles();

  const handleMaxNftsChange = (event: any) => {
    let max = parseInt(event.target.value || 0);
    if (max < 1) {
      max = 1;
    } else if (max > 1000000) {
      max = 1000000;
    }
    dispatch(setMax(max));
  };

  const handleNftSymbolChange = (event: any) => {
    let newValue: string = event.target.value;
    if(newValue.match(/^[A-Za-z]*$/)) {
      dispatch(setSymbol(newValue.toUpperCase()));
    } else {
      dispatch(setSymbol(symbol));
    }
  };

  return (
    <form noValidate autoComplete="off">
      <div className={classes.root}>
        <Grid container spacing={3}>

        {!path &&
          <>
            <Grid item xs={12} sm={6}>
              <TextField style={{width: '120px'}}
                type="number"
                label="Total NFTs"
                variant="filled"
                value={max}
                InputProps={{ inputProps: { min: 1, max: 1000000 } }}
                onChange={handleMaxNftsChange}
              />
              <HelpIcon text="The number of NFTs that you will mint in your collection."/>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField style={{width: '120px'}}
                label="Symbol"
                variant="filled"
                InputProps={{ inputProps: { maxLength: 10 } }}
                value={symbol}
                onChange={handleNftSymbolChange}
              />
              <HelpIcon text="The symbol is an abbreviation that you come up with to identify your NFT collection. It's publically visible and does not need to be unique."/>
            </Grid>

            <Grid item xs={12} style={{whiteSpace: 'nowrap'}}>
              <TextField style={{width: '322px'}}
                label="Name"
                variant="filled"
                InputProps={{ inputProps: { maxLength: 220 } }}
                value={name}
                onChange={(event) => dispatch(setName(event.target.value))}
              />
              <HelpIcon text="The name should be short but descriptive. It helps to identify and organize your NFT collection. It's publically visible and does not need to be unique."/>
            </Grid>
          </>
        }

        {path &&
          <Grid item xs={12}>
              <>
                <div>
                  <Typography>
                    Contract created successfully! You can click the link to view your contract on the blockchain.
                  </Typography>
                </div>
                <div>
                  <br/>
                  <a href={path} target="_blank" rel="noreferrer">{address}</a><br/>
                </div>
              </>
          </Grid>
        }

        </Grid>
      </div>
    </form>
  );
}
