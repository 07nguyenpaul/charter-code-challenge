import restaurantsReducer from './restaurants';
import {
  FETCH_RESTAURANT_DATA__FAILURE,
  FETCH_RESTAURANT_DATA__REQUEST,
  FETCH_RESTAURANT_DATA__SUCCESS
} from '../actions/actionTypes';

import { getMockRestaurants } from '../store/mockRestaurants';

describe('Reducer: Restaurants', () => {
  const restaurantData = getMockRestaurants();

  const initialState = {
    restaurants: [],
    requesting: false
  };

  it('should return the initial state without changing', () => {
    const expected = initialState;
    expect(restaurantsReducer(initialState, {})).toBe(expected);
  });

  it('should set "requesting" as "true" in the state for action type "FETCH_RESTAURANT_DATA__REQUEST"', () => {
    const expected = {
      restaurants: [],
      requesting: true,
    };
    const action = { type: FETCH_RESTAURANT_DATA__REQUEST };
    expect(restaurantsReducer(initialState, action)).toEqual(expected);
  });

  it('should set "restaurants" in the state for action type "FETCH_RESTAURANT_DATA__SUCCESS"', () => {
    const expected = {
      restaurants: restaurantData,
      requesting: false,
    };
    const action = { type: FETCH_RESTAURANT_DATA__SUCCESS, restaurants: restaurantData };
    expect(restaurantsReducer(initialState, action)).toEqual(expected);
  });

  it('should set "requesting" as "false" in the state for action type "FETCH_RESTAURANT_DATA__FAILURE"', () => {
    const expected = {
      restaurants: [],
      requesting: false,
    };
    const action = { type: FETCH_RESTAURANT_DATA__FAILURE };
    expect(restaurantsReducer(initialState, action)).toEqual(expected);
  });
});
