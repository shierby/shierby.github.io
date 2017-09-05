import React, { Component } from 'react';

import SearchBox from './SearchBox'

class Home extends Component {
    render() {

        return  <div className="col-md-9">
            <nav>
                <SearchBox/>
            </nav>
        </div>
    }
}

export default Home;