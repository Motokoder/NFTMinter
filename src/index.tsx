import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import App from './components/app';
import './index.css';
import { watchNetworkChanges } from './services/nft-factory-proxy';

//redux
import { store } from './app/store';
import { Provider } from 'react-redux';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

watchNetworkChanges();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#5EC25F",
    },
    secondary: {
      main: "#CCCCCC",
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
);
