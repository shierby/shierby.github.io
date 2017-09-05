import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './index.css';
import routes from './routes'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {grey800} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ligthBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
//import $ from 'jquery';

const muiTheme = getMuiTheme({
  palette: {
    textColor: grey800,
  }
});

injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme(ligthBaseTheme)}>
    <App/>
  </MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
