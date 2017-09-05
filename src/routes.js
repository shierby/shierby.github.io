import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom';

import SearchBox from './components/SearchBox'
import Card from './components/Card'
//import Home from './components/Home'

const routes = () => (
    <Router>
        <div>
            <Route exact path="/" component={SearchBox}/>
            <Route path="/:username" component={Card}/>
        </div>
    </Router>
);

export default routes;
