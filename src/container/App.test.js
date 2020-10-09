import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import App from './App';
import configureStore from '../store/configureStore';

configure({ adapter: new Adapter() });

describe('Container: App ', () => {
  const store = configureStore({});

  const wrapper = mount(
    <Provider store={store}>
      <App />
    </Provider>
  );

  it('should render without crashing', () => {
    expect(wrapper.find('App').exists()).toBe(true);
  });

  it('renders the Dashboard container', () => {
    expect(wrapper.find('Dashboard').exists()).toBe(true);
  });
});
