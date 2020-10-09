import nock from 'nock';
import { mockInitialState, mockStore } from '../store/mockInitialStore';
import { getMockRestaurants } from '../store/mockRestaurants';

import * as actions from './restaurants';

import {
  FETCH_RESTAURANT_DATA__FAILURE,
  FETCH_RESTAURANT_DATA__REQUEST,
  FETCH_RESTAURANT_DATA__SUCCESS,
} from './actionTypes';

describe('Actions: Devices', () => {
  let store = mockStore(mockInitialState);

  afterEach(() => {
    nock.cleanAll();
  })

  it('should create FETCH_RESTAURANT_DATA__REQUEST action', () => {
    const expected = {
      "type": "FETCH_RESTAURANT_DATA__REQUEST"
    };
    expect(actions.fetchRestaurantDataRequest()).toEqual(expected);
  });

  it('should create FETCH_RESTAURANT_DATA__SUCCESS action', () => {
    const restaurantData = getMockRestaurants();
    const expected = {
      "type": "FETCH_RESTAURANT_DATA__SUCCESS", "restaurants": restaurantData
    };
    expect(actions.fetchRestaurantDataSuccess(restaurantData)).toEqual(expected);
  });

  it('should create FETCH_RESTAURANT_DATA__FAILURE actions', () => {
    const expected = {
      "type": "FETCH_RESTAURANT_DATA__FAILURE"
    };
    expect(actions.fetchRestaurantDataFailure()).toEqual(expected);
  });
});
