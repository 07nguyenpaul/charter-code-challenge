import fetch from 'isomorphic-fetch';
import {
FETCH_RESTAURANT_DATA__FAILURE,
FETCH_RESTAURANT_DATA__REQUEST,
FETCH_RESTAURANT_DATA__SUCCESS,
} from './actionTypes';

export function fetchRestaurantData() {
  return async dispatch => {
    dispatch(fetchRestaurantDataRequest());
    try {
      const response = await fetch("https://code-challenge.spectrumtoolbox.com/api/restaurants", {
      headers: {
        Authorization: `Api-Key q3MNxtfep8Gt`,
      },
    });
      let body = await response.json();
      dispatch(fetchRestaurantDataSuccess(body));
    } catch (error) {
      dispatch(fetchRestaurantDataFailure());
    }
  };
}

export function fetchRestaurantDataRequest() {
  return { type: FETCH_RESTAURANT_DATA__REQUEST };
};

export function fetchRestaurantDataSuccess(restaurants) {
  return { type: FETCH_RESTAURANT_DATA__SUCCESS, restaurants };
};

export function fetchRestaurantDataFailure() {
  return { type: FETCH_RESTAURANT_DATA__FAILURE };
};

// curl -X GET \
//   'https://code-challenge.spectrumtoolbox.com/api/restaurants' \
//   -H 'authorization: Api-Key q3MNxtfep8Gt'
