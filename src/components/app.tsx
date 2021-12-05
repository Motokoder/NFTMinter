import { useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import NavMenu from './nav-menu';

import Home from './home';
import Estimate from './estimate';
// import Mint from './mint';
import MyNFTs from './my-nfts';
import Collection from './collection';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const classes = useStyles();
  const location = useLocation();

  const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
  };

  const getPageTitle = () => {
    let path = location.pathname.toLowerCase().substr(1);
    const pos = path.indexOf('/');
    if (pos > -1) {
      path = path.substr(0, pos);
    }
    
    switch(path) {
      case 'estimate':
        return 'Estimate';
      case 'my-nfts':
        return 'My NFTs';
      case 'collection':
        return 'NFT Collection';
      default:
        return 'Home';
    }
  };


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {getPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="navigation menu">
        <Hidden smUp implementation="css">
          <Drawer
            container={document.body}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{ paper: classes.drawerPaper }}
            ModalProps={{ keepMounted: true }}
          >
            <NavMenu/>
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer classes={{ paper: classes.drawerPaper }} variant="permanent" open>
            <NavMenu/>
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Switch>
          <Route exact path="/">
                <Home />
            </Route>
            <Route path="/estimate">
                <Estimate />
            </Route>
            {/* <Route path="/mint">
                <Mint />
            </Route> */}
            <Route path="/my-nfts">
                <MyNFTs />
            </Route>
            <Route path="/collection/:id">
                <Collection />
            </Route>
        </Switch>

      </main>
    </div>
  );
}
