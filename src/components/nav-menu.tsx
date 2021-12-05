import { useHistory } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeOutlined from '@material-ui/icons/HomeOutlined';
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';
import FilterOutlinedIcon from '@material-ui/icons/FilterOutlined';
// import Divider from '@material-ui/core/Divider';

export default function NavMenu() {
    const history = useHistory();

    const navigate = (path: string) => {
        history.push(path);
    }

    return (
        <div>
            <img src="/images/logo.png" className="logo" alt="NFT Brrr logo (green Wojak minting/printing NFTs)" />
            
            {/* <Divider /> */}
            
            <List>
                <ListItem button key="home" onClick={() => navigate('/')}>
                    <ListItemIcon><HomeOutlined/></ListItemIcon>
                    <ListItemText primary="Home"/>
                </ListItem>
                <ListItem button key="estimate" onClick={() => navigate('/estimate')}>
                    <ListItemIcon><AttachMoneyOutlinedIcon/></ListItemIcon>
                    <ListItemText primary="Estimate"></ListItemText>
                </ListItem>
                <ListItem button key="my-nfts" onClick={() => navigate('/my-nfts')}>
                    <ListItemIcon><FilterOutlinedIcon/></ListItemIcon>
                    <ListItemText primary="My NFTs"></ListItemText>
                </ListItem>
            </List>
        </div>
    );
}