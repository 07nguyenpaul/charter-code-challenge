import {
  FETCH_RESTAURANT_DATA__FAILURE,
  FETCH_RESTAURANT_DATA__REQUEST,
  FETCH_RESTAURANT_DATA__SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  restaurants: [],
  requesting: false
};

export default function restaurants(state=initialState, action) {
  switch(action.type) {
    case FETCH_RESTAURANT_DATA__REQUEST:
      return { ...state, requesting: true };
    case FETCH_RESTAURANT_DATA__SUCCESS:
      return { ...state, restaurants: action.restaurants, requesting: false };
    case FETCH_RESTAURANT_DATA__FAILURE:
      return { ...state, requesting: false };
    default:
      return state;
  }
};
