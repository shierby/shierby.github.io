import axios from 'axios'

function getRepos(username) {
  let URL = `https://api.github.com/users/${username}/repos`
    return axios.get(URL);
}

function getUserInfo(username) {
    return axios.get(`https://api.github.com/users/${username}`);
}

function getLanguages(username, repoName) {
  return axios.get(`https://api.github.com/repos/${username}/${repoName}/languages`);
}

function getForks(username, repoName) {
  return axios.get(`https://api.github.com/repos/${username}/${repoName}/forks`);
}

function getContributors(username, repoName) {
  return axios.get(`https://api.github.com/repos/${username}/${repoName}/contributors`);
}

let github = {
    getGithubInfo(username){
        return axios.all([getRepos(username), getUserInfo(username)])
            .then((arr) => {
                return {
                    repos: arr[0].data,
                    info: arr[1].data
                  }
                })

    },
    getRepoInfo(username, repoName){
      console.log(username, repoName)
      return axios.all([getLanguages(username, repoName), getForks(username, repoName), getContributors(username, repoName)])
        .then((arr) => {
          return {
            languages: arr[0].data,
            forks: arr[1].data,
            contributors: arr[2].data
          }
        })

    },
};

export default github;