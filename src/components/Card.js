import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';
import Repos from './Repos';
import UserProfile from './UserProfile';

import github from '../api/githubAxios';

class Card extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: '',
            dataRepos: []
        };
        this.init = this.init.bind(this);
    }
    // the api request function
    init() {
      const that = this;
      const fetchAllTheRepos = (userName, repoCount) => {
        const MAX_PER_PAGE = 20;
        const baseUrl = 'https://api.github.com/users/' + userName +
          '/repos?per_page=' + MAX_PER_PAGE;

        //Start fetching every page of repos.
        const fetchPromises = [], pageCount = Math.ceil(repoCount /
          MAX_PER_PAGE);
        for (let pageI = 1; pageI <= pageCount; ++pageI) {
          const fetchPagePromise = fetch(baseUrl + '&page=' + pageI);
          fetchPromises.push(fetchPagePromise);
        }

        //This promise resolves after all the fetching is done.
        return Promise.all(fetchPromises)
          .then((responses) => {
            //Parse all the responses to JSON.
            return Promise.all( responses.map((response) => response.json()) );
          }).then((results) => {
            //Copy the results into one big array that has all the friggin repos.
            let repos = [];
            results.forEach((result) => {
              repos = repos.concat(result);
            });
            return repos;
          });
      };

        github.getGithubInfo(this.props.match.params.username)
            .then((data) => {
              const publicRepos = data.info.public_repos;
              fetchAllTheRepos(this.props.match.params.username, publicRepos).then((repos) => {
                that.setState({
                  dataRepos: repos
                })
              });
            this.setState({
                data: data.info
                })
            })
            .catch(error => {
                console.log(error.response)
                this.setState({
                    data: error.response
                })
            });
    }
    componentWillMount() {
        this.router = this.context.router;
    }

    componentDidMount() {
        this.init()
    }
    componentWillReceiveProps(nextProps) {
        this.props.match.params.username = nextProps.match.params.username;
            this.init()
    }

    render() {
        let username = this.props.match.params.username;
        //console.log(username)
        let data = this.state.data;

        if (data.statusText === 'Not Found') {
      // when username is not found...
      return <h3 className="card__notfound">User not found. Try again!</h3>
    }

    if (this.state.dataRepos) {
      // if username found, then...
      return (
        <div className="card">
            <div className="row">
                <UserProfile username={username} data={this.state.data}/>
                <Repos username={username} dataRepos={this.state.dataRepos}/>
            </div>

        </div>
      )
    } else {
          return (
            <div>
              <Spinner className="spinner" name="circle" />
            </div>
          )
    }
  }
}

Card.contextTypes = {
    router: PropTypes.object.isRequired
};



export default Card;
