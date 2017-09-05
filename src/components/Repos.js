import React, { Component } from 'react';
import Spinner from 'react-spinkit';
import {Tabs, Tab} from 'material-ui/Tabs';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import {grey600, grey50} from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import Chip from 'material-ui/Chip';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import github from '../api/githubAxios';

const styles = {
  tab: {
    backgroundColor: grey50
  },
  tabs: {
    backgroundColor: grey600
  },
  menuItem: {
    marginLeft: '15px',
    height: '42px'
  }

};

function convertDate(updateDate) {
  let date = new Date(updateDate);
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return dt + '-' + month + '-' + year;
}

class Repos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      search: '',
      controlledDate: null,
      valueType: '',
      hasIssues: false,
      open: false,
      repoName: '',
      ownerName: '',
      languages: [],
      contributors: '',
      forks: ''
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleOpen = (repoName, ownerName) => {
    this.setState({
      open: true,
      repoName: repoName,
      ownerName: ownerName
    });
      github.getRepoInfo(ownerName, repoName)
        .then((data) => {
          this.setState({
            languages: data.languages,
            forks: data.forks,
            contributors: data.contributors
          })
        })
        .catch(error => {
          console.log(error.response);
          this.setState({
            languages: error.response,
            forks: error.response,
            contributors: error.response
          })
        });
    // }

  };
  handleClose = () => {
    this.setState({open: false});
  };

  handleChange = (event, index, value) => {
    //console.log(value)
    this.setState({value})
  };
  handleChangeType = (event, index, value) => {
    console.log(value)
    this.setState({valueType: value})
  }

  handleClick = () => {
    this.setState({
      hasIssues: true
    })
  };

  handleChangeDate = (event, date) => {
    console.log(date)
    this.setState({
      controlledDate: date,
    });
  };

  handleSearch (e) {
    this.setState({ search: e.target.value });
  }

  handleRequestDelete = () => {
    this.setState({
      value: '', search: '', controlledDate: null, valueType: '', hasIssues: false
    })
  };
  handleTouchTap = () => {
    this.setState({
      value: '', search: '', controlledDate: null, valueType: '', hasIssues: false
    })
  }

  menuItems() {
    let language = this.props.dataRepos.filter(function(elem, index, self) {
      //console.log(elem.language, index, self)
      return index == self.map(item => {
        return item.language
      }).indexOf(elem.language);
    }).filter(item => item.language)
    language.unshift({language: 'All'})
    return language.map((item) => (
      <MenuItem
        key={item.id}
        primaryText={item.language}
        value={item.language}/>
    ));
  }

    render() {

      let languages = this.state.languages ? Object.keys(this.state.languages) : [];
      let contributors = this.state.contributors;
      let forks = this.state.forks;
      console.log(forks);
      const actions = [
        <FlatButton
          label="Close"
          primary={true}
          onClick={this.handleClose}
        />,
      ];
      const value = this.state.value;
      const valueType = this.state.valueType;
      const selectedDate = this.state.controlledDate;
      const hasIssues = this.state.hasIssues;
      const chip = <Chip
                      className="pull-right"
                      onRequestDelete={this.handleRequestDelete}
                      onClick={this.handleTouchTap}
                      style={styles.chip}>
                      Clear filter
                    </Chip>;

      let clearFilters;

      let dataRepos = this.props.dataRepos
      let searchStr = this.state.search.trim().toLowerCase();

      if (searchStr.length > 0) {
        dataRepos = dataRepos.filter(function (letter) {
          return letter.name.toLowerCase().match(searchStr);
        });
        clearFilters = chip;
      } else if (value){
        dataRepos = dataRepos.filter(function (item) {
          if (value === 'All') {
            return item.language
          }
          return item.language === value;
        });
        clearFilters = chip;
      } else if (selectedDate) {
        dataRepos = dataRepos.filter(function (item) {
          let userDate = new Date(selectedDate)
          let updatedDate = new Date(item.updated_at)
          console.log(updatedDate);
          return userDate <= updatedDate;
        });

        clearFilters = chip;
      } else if (valueType) {
        dataRepos = dataRepos.filter(function (item) {
          if (valueType === 1) {
            return item;
          } else if (valueType === 2) {
            return item.fork === true;
          }  else if (valueType === 3) {
            return item.has_issues === true;
          }

        });
        clearFilters = chip;
      } else if (hasIssues) {
        dataRepos = dataRepos.filter(function (item) {
          return item.open_issues_count > 0;
        });
        clearFilters = chip;
      }


      let listRepos = dataRepos.map((item, index) => {
          return <li key={item.id} className="repos-list">
            <div className="repos-name">
              <h3>
                {item.name}
              </h3>
            </div>
            <div>
              <p className="repos-description">{item.description}</p>
            </div>
            <div className="repos-icons">
              <span className="mr">{item.language}</span>
              <span className="mr">
                              <i className="fa fa-star" aria-hidden="true"></i>
                {item.stargazers_count}
                              </span>
              <span className="mr">
                              <i className="fa fa-code-fork" aria-hidden="true"></i>
                {item.forks}
                              </span>
              <span className="mr">{convertDate(item.updated_at)}</span>
            </div>
            <div>
              <RaisedButton label="Dialog" onClick={this.handleOpen.bind(this, item.name, item.owner.login)}  />
            </div>
          </li>
        });

      function naturalCompare(a, b) {
        var ax = [], bx = [];

        a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
        b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

        while(ax.length && bx.length) {
          var an = ax.shift();
          var bn = bx.shift();
          var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
          if(nn) return nn;
        }

        return ax.length - bx.length;
      }
      //by name
      let repoName = this.props.dataRepos
          .sort((a,b) => naturalCompare(a.name,b.name))
          .map(item => {

            return <li key={item.id} className="repos-list">
              <div className="repos-name">
                <h3>
                  {item.name}
                </h3>
              </div>
              <div>
                <p className="repos-description">{item.description}</p>
              </div>
              <div className="repos-icons">
                <span className="mr">{item.language}</span>
                <span className="mr">
                              <i className="fa fa-star" aria-hidden="true"></i>
                  {item.stargazers_count}
                              </span>
                <span className="mr">
                              <i className="fa fa-code-fork" aria-hidden="true"></i>
                  {item.forks}
                              </span>
                <span className="mr">{convertDate(item.updated_at)}</span>
              </div>
            </li>
          });

      //stars
      let starsCount = this.props.dataRepos
        .sort((a,b) => {
          return b.stargazers_count - a.stargazers_count})
        .map(item => {
          return <li key={item.id} className="repos-list">
            <div className="repos-name">
              <h3>
                {item.name}
              </h3>
            </div>
            <div>
              <p className="repos-description">{item.description}</p>
            </div>
            <div className="repos-icons">
              <span className="mr">{item.language}</span>
              <span className="mr">
                              <i className="fa fa-star" aria-hidden="true"></i>
                {item.stargazers_count}
                              </span>
              <span className="mr">
                              <i className="fa fa-code-fork" aria-hidden="true"></i>
                {item.forks}
                              </span>
              <span className="mr">{convertDate(item.updated_at)}</span>
            </div>
          </li>
        });

      //sort by issue
      let openIssueCount = this.props.dataRepos
        .sort((a,b) => {
          return b.open_issues - a.open_issues})
        .map(item => {
          return <li key={item.id} className="repos-list">
            <div className="repos-name">
              <h3>
                {item.name}
              </h3>
            </div>
            <div>
              <p className="repos-description">{item.description}</p>
            </div>
            <div className="repos-icons">
              <span className="mr">{item.language}</span>
              <span className="mr">
                              <i className="fa fa-star" aria-hidden="true"></i>
                {item.stargazers_count}
                              </span>
              <span className="mr">
                              <i className="fa fa-code-fork" aria-hidden="true"></i>
                {item.forks}
                              </span>
              <span className="mr">{convertDate(item.updated_at)}</span>
            </div>
          </li>
        });

      //sort by date
      let updatedDate = this.props.dataRepos
        .sort((a,b) => {
          let da = new Date(a.updated_at).getTime()
          let db = new Date(b.updated_at).getTime()
          return da > db ? -1 : da < db ? 1 : 0})
        .map(item => {

          return <li key={item.id} className="repos-list">
            <div className="repos-name">
              <h3>
                {item.name}
              </h3>
            </div>
            <div>
              <p className="repos-description">{item.description}</p>
            </div>
            <div className="repos-icons">
              <span className="mr">{item.language}</span>
              <span className="mr">
                              <i className="fa fa-star" aria-hidden="true"></i>
                {item.stargazers_count}
                              </span>
              <span className="mr">
                              <i className="fa fa-code-fork" aria-hidden="true"></i>
                {item.forks}
                              </span>
              <span className="mr">{convertDate(item.updated_at)}</span>
            </div>
          </li>
        });

        return  <div className="col-md-9">
          <Tabs >
            <Tab label="Repositories" style={styles.tabs}>
              <div className="filter-repos">
                <form className="form-horizontal">
                      <div className="form-group col-md-4">
                        <label  className="sr-only">Password</label>
                        <input type="text" className="form-control"  placeholder="Search repos..." value={this.state.search} onChange={this.handleSearch} />
                      </div>
                      <div className="col-md-4">
                        <SelectField
                          hintText="Type"
                          style={styles.menuItem}
                          value={this.state.valueType}
                          onChange={this.handleChangeType}
                          autoWidth={true}
                        >
                          <MenuItem value={1} primaryText="All" />
                          <MenuItem value={2} primaryText="Forks" />
                          <MenuItem value={3} primaryText="Source" />
                        </SelectField>
                      </div>
                      <div className="col-md-4">
                        <SelectField
                          hintText="Language"
                          style={styles.menuItem}
                          value={this.state.value}
                          onChange={this.handleChange}
                          autoWidth={true}
                        >
                          {this.menuItems()}
                        </SelectField>
                      </div>
                      <div className="form-group col-md-4">
                        <DatePicker hintText="Filter by updated date" value={this.state.controlledDate} onChange={this.handleChangeDate} />
                      </div>
                      <div className="col-md-4">
                        <RaisedButton label="has open issues" onClick={this.handleClick} />
                      </div>
                      <div className="col-md-8 ">
                        {clearFilters}
                      </div>

                </form>
              </div>
              <ul id="myList">
                {listRepos}
              </ul>
              <Dialog
                title="Dialog"
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
              >
              <h3>Repo name</h3>
                <a href={`https://github.com/${this.state.ownerName}/${this.state.repoName}`}>{this.state.repoName}</a>
              <div>
                <h4>Top languages:</h4>
                <ul className="language-list">
                  {languages.slice(0, 3).map((item, index) => {
                    return (
                      <li key={index}>{item}</li>
                    )
                  })}
                </ul>
              </div>
                <div>
                  <h4>Top contributors:</h4>
                <ul className="contributors-list">
                  {contributors ? contributors.slice(0, 3).map((item, index) => {
                    return (
                      <li key={index}>
                        <a href={item.html_url} target="_blank"><img className="card__avatar" src={item.avatar_url} /></a>
                        <h2 className="card__username"><a className="card__link" href={item.html_url} target="_blank">{item.login}</a></h2>
                      </li>
                    )
                  }) : ''}
                </ul>
              </div>

              </Dialog>
            </Tab>
            <Tab label="Repo name" style={styles.tabs}>
              <ul>
                {repoName}
              </ul>
            </Tab>
            <Tab label="Stars count" style={styles.tabs}>
              <ul>
                {starsCount}
              </ul>
            </Tab>
            <Tab label="Open issues count" style={styles.tabs}>
              <ul>
                {openIssueCount}
              </ul>
            </Tab>
            <Tab label="Updated Date" style={styles.tabs}>
              <ul>
                {updatedDate}
              </ul>
            </Tab>
          </Tabs>
             </div>
    }
}

export default Repos;