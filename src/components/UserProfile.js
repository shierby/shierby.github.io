import React, { Component } from 'react';

class UserProfile extends Component {
    render() {
        const data = this.props.data;
        return  <div className="col-md-3">
            {data.url && data.avatar_url && <a href={data.url} target="_blank"><img className="card__avatar" src={data.avatar_url} /></a>}
            {data.url && data.login && <h2 className="card__username"><a className="card__link" href={data.url} target="_blank">{data.login}</a></h2>}
                    <dl>
                        {data.name && <div><dt>Real name</dt><dd>{data.name}</dd></div>}

                        {data.location && <div><dt>Location</dt><dd>{data.location}</dd></div>}

                        {data.public_repos && <div><dt>Number of public repos</dt><dd>{data.public_repos}</dd></div>}

                        {data.followers && <div><dt>Number of followers</dt><dd>{data.followers === 0 ? '': data.followers }</dd></div>}

                    </dl>
            </div>
    }
}

export default UserProfile;