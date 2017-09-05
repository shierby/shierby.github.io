import React, { Component } from 'react';
import PropTypes from 'prop-types'

class SearchBox extends Component {

  handleClick(e) {
    e.preventDefault()
    let username = this.refs.search.value;
    // sending the username value to parent component to fetch new data from API

    this.refs.search.value = '';
    //this.context.router.transitionTo(this.refs.search.value);
    //this.props.fetchUser(username);

    this.context.router.history.push(`/${username}`);

  }

  render() {
    return (
      <form
        className="searchbox"
        onSubmit={this.handleClick.bind(this)}>
        <input
          ref="search"
          className="searchbox__input"
          type="text"
          placeholder="type username..."/>

        <input
          type="submit"
          className="searchbox__button"
          value="Search GitHub User" />
      </form>
    )
  }
}

SearchBox.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired,
    }),
};

export default SearchBox;