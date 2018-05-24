import superagent from 'superagent';

export const addLocation = searchResults => ({
  type: 'ADD_LOCATION',
  payload: searchResults,
});

export const addLocationAction = search => dispatch => {

  return superagent.get(`${__API_URL__}/${search.state}/${search.city}.json`)
    .then(res => {
      res.body.forecast.city = search.city;
      res.body.forecast.state = search.state;
      return res;
    })
    .then(res => {
      return dispatch(addLocation(res.body));
    })
    .catch(err => console.log(err));
};
