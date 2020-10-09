import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

export const mockInitialState = {
  restaurants: {
    restaurants: [],
    requesting: false
  }
};

const middlewares = [thunk];
export const mockStore = configureStore(middlewares);
