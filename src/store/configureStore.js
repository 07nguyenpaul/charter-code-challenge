import { applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers/rootReducer'
import callAPIMiddleware from './callAPIMiddleware';
import { routerMiddleware } from 'react-router-redux';
import createRootReducer from '../reducers/rootReducer';


export default function configureStore(history) {
  const middlewares = [thunkMiddleware, routerMiddleware(history), callAPIMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)
  const enhancers = [middlewareEnhancer, (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) || compose]
  const composedEnhancers = compose(...enhancers)
  const store = createStore(rootReducer, composedEnhancers)

  // Hot reloading
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/rootReducer', () => {
      store.replaceReducer(createRootReducer(history));
    });
  }

  return store
}
