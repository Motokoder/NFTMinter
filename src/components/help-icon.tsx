import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  button: {
      width: '25px',
      minWidth: '25px',
      height: '25px',
      minHeight: '25px',
      lineHeight: '25px',
      verticalAlign: 'middle',
      textAlign: 'center',
      borderRadius: '50%',
      padding: '0',
      border: '1px solid gray',
      position: 'relative',
      top: '-5px',
      marginLeft: '5px'
  }
}));

export default function HelpIcon(props: { text: string}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  if (!props?.text) {
      return null;
  }

  return (
    <span>
      <Button className={classes.button} aria-describedby={id} variant="contained" color="secondary" onClick={handleClick}>
        ?
      </Button>
      <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography className={classes.typography}>{props.text}</Typography>
      </Popover>
    </span>
  );
}
