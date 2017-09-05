import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import './font-awesome-4.7.0/css/font-awesome.min.css'

import SearchBox from './components/SearchBox'
import Card from './components/Card'
//import Home from './components/Home'

const App = () => (
    <Router>
      <div>
        <nav>
        <SearchBox/>
        </nav>

        {/*<Route exact path="/" component={SearchBox}/>*/}
        <Route path="/:username" component={Card}/>
      </div>
    </Router>
);

export default App;
