import React from 'react';
import { render } from '@testing-library/react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import {spy} from 'sinon';

import {Dashboard} from './Dashboard';
import { fetchRestaurantData, getForcast } from '../actions/restaurants';
import { getMockRestaurants } from '../store/mockRestaurants';
import configureStore from '../store/configureStore';

configure({ adapter: new Adapter() });

describe('Container: Dashboard ', () => {
  spy(Dashboard.prototype, 'componentDidMount');
  const props = {
    restaurants: getMockRestaurants(),
    loading: false,
    fetchRestaurantData: jest.fn(),
  }

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Dashboard {...props}/>
    );
  });

  it('should call componentDidMount', () => {
    expect(Dashboard.prototype.componentDidMount.callCount).toEqual(1);
    expect(wrapper.instance().props.fetchRestaurantData).toHaveBeenCalledTimes(1);
  });

  it('should render accordion skeleton when loading', () => {
    const wrapper = shallow(
      <Dashboard restaurants={[]} loading={true} fetchRestaurantData={jest.fn()} />
    );

    expect(wrapper.find('.dashboard').length).toEqual(1);
    expect(wrapper.find('AccordionSkeleton').length).toEqual(1)
  });
});
