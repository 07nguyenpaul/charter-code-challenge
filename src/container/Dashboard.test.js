import React from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import { Provider } from 'react-redux';
// import {spy} from 'sinon';

import Dashboard from './Dashboard';
import RestaurantData from '../service/fetchData';
import { getMockRestaurants } from '../store/mockRestaurants';

configure({ adapter: new Adapter() });

describe('Container: Dashboard ', () => {
  beforeAll(() => {
    jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({
            defaultValue: getMockRestaurants()
        })
    }))
  });
  afterEach(() => {
      global.fetch.mockClear();
  });
  afterAll(() => {
      global.fetch.mockRestore();
  });

  const props = {
    restaurants: getMockRestaurants(),
    loading: false,
    currentPage: 1,
    restaurantsPerPage: 10,
    setRestaurants: jest.fn(),
    // renderTableRows: jest.fn(),
    // renderTableColumns: jest.fn(),
    // fetchRestaurantData: jest.fn(),
  }

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Dashboard {...props}/>
    );
  });

  it('should render a table skeleton while loading', () => {
    const props = {
      restaurants: getMockRestaurants(),
      loading: true,
      currentPage: 1,
      restaurantsPerPage: 10,
    }
    const wrapper = mount(<Dashboard {...props}/>);
    expect(wrapper.find('DataTableSkeleton').length).toBe(1);
  });

  it('should fetch restaurant data with useEffect hook', async () => {
  });

  it('should render 6 table columns', () => {
    expect(wrapper.find('table thead tr th').length).toBe(6);
  });

  it('should render 2 filter dropdowns', () => {
    expect(wrapper.find('Dropdown').length).toBe(2);
  });

  xit('should render restaurants', () => {
    act(() => {
      // Set restaurant state here
    });
  });

  it('should render Pagination', () => {
    expect(wrapper.find('Pagination').prop("currentPage")).toBe(1);
  });
});
