import React, { useState, useEffect } from 'react';
import { DataTableSkeleton, Dropdown, DropdownSkeleton } from 'carbon-components-react'
import PropTypes from 'prop-types';

import { states, genres } from '../constants';
import Pagination from '../components/Pagination';
import RestaurantData from '../service/fetchData';

import '../styles/Dashboard.scss';

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterSelection, setStateSelection] = useState({label: "", abbr: "", genre: ""});
  const [filterRestBasedOnFilter, setRestBasedOnFilter] = useState([]);
  const [tempFilterList, setTempFilterList] = useState([]);
  const [restaurantsPerPage] = useState(10);

  // Fetch restaurant data
  useEffect(() => {
    const fetchRest = async () => {
      setLoading(true);
      const res = await RestaurantData.fetchRestaurantData();
      setRestaurants(res);
      setLoading(false);
    };

    fetchRest();
  }, []);

  // Render table columns
  const renderTableColumns = () => {
    const columnNames = [
      "Name",
      "City",
      "State",
      "Phone Number",
      "Website",
      "Genres"
    ];

    return columnNames.map(column => (
      <th key={column} className={column.toLowerCase()}>{column}</th>
    ))
  }

  // Alphabetize restaurant names before initial render
  const alphabetizeRestaurantNames = () => {
    const restaurantList = filterRestBasedOnFilter && filterRestBasedOnFilter.length > 0
      ? filterRestBasedOnFilter
      : restaurants;

    return restaurantList.sort((a, b) => {
      let firstRest = a.name.toUpperCase();
      let secondRest = b.name.toUpperCase();

      if (firstRest < secondRest) {
        return -1;
      }
      if (firstRest > secondRest) {
        return 1;
      }
      return 0;
    });
  }

  const showRestaurantData = (currentRestaurants) => {
    return currentRestaurants.map(restaurant => (
      <tr key={restaurant.id}>
        <td>{restaurant.name}</td>
        <td>{restaurant.city}</td>
        <td>{restaurant.state}</td>
        <td>{restaurant.telephone}</td>
        <td><a href={restaurant.website}>{restaurant.name}</a></td>
        <td>{restaurant.genre}</td>
      </tr>
    ))
  };

  // Render table rows with restaurant data
  const renderTableRows = () => {
    let alphaRestList = [];

    const indexOfLastRestaurant = currentPage * restaurantsPerPage;
    const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;

    if (restaurants && restaurants.length > 0 && !filterSelection.abbr) {
      // Refactor to remove repetitiveness
      alphaRestList = alphabetizeRestaurantNames();
      const currentRestaurants = alphaRestList.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

      return showRestaurantData(currentRestaurants);
    } else if (filterRestBasedOnFilter && filterRestBasedOnFilter.length > 0 && filterSelection.abbr) {
      alphaRestList = alphabetizeRestaurantNames();
      const currentRestaurants = alphaRestList.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

      return showRestaurantData(currentRestaurants);
    } else {
      return (
        <tr>
          <td colSpan="6">No Results found in {filterSelection.label}. Select another state.</td>
        </tr>
      );
    }
  };

  // Handle pagination
  const handlePagination = pageNum => setCurrentPage(pageNum);

  // Filter by state
  const handleStateSelection = (e) => {
    let selectedState = e && e.selectedItem ? e.selectedItem.abbr : filterSelection.abbr;

    // Resetting state filter
    if(selectedState === "ALL") {
      const filterSelectionCondition =
        filterSelection.abbr !== e.selectedItem.label &&
        filterSelection.label !== e.selectedItem.abbr &&
        filterSelection.genre;

      if(filterSelectionCondition) {
        setStateSelection({...filterSelection, label: "", abbr: ""});
        setRestBasedOnFilter(tempFilterList)
      } else {
        setStateSelection({...filterSelection, label: "", abbr: ""});
        setRestBasedOnFilter([]);
      }
    } else {
      let filteredList = restaurants.filter(state => selectedState === state.state);
      const stateFilterSelection = filterSelection.label === e.selectedItem.label && filterSelection.abbr === e.selectedItem.abbr;

      setTempFilterList(filteredList);

      if(stateFilterSelection) {
        return;
      } else {
        setStateSelection({...filterSelection, label: e.selectedItem.label, abbr: e.selectedItem.abbr});
      }
      setCurrentPage(1);
      setRestBasedOnFilter(filteredList);
    }
  }

  // Filter by genre
  const handleGenreSelection = (value) => {
    const selectedGenre = value && value.selectedItem ? value.selectedItem.label : value;

    // Resetting genre filter
    if(selectedGenre === "All") {
      // Resetting genre but still have state filter selected
      if(filterSelection.abbr && filterSelection.label) {
        setRestBasedOnFilter(tempFilterList);
      } else {
        setStateSelection({...filterSelection, genre: ""});
        setRestBasedOnFilter([]);
      }
    } else {
      const restaurantList =
        filterSelection.label && filterSelection.abbr ? filterRestBasedOnFilter : restaurants;
      // Temporarily store restaurant list for initial filtering or reset of filters
      setTempFilterList(restaurantList);

      // Filter genre object based on selection
      let filteredList = restaurantList.filter(function(obj) {
        return Object.keys(obj).some(function(key) {
          let searchObject = obj[key].includes(selectedGenre)
          if (!searchObject) {
            return 0;
          } else {
            return searchObject;
          }
        })
      })
      setStateSelection({...filterSelection, genre: selectedGenre});
      setCurrentPage(1);
      return setRestBasedOnFilter(filteredList);
    }
  }

  // Total restaurant amount of pagination based on filters settings
  const totalRestaurantsAmount = filterSelection.abbr || (filterSelection.abbr && filterSelection.genre) || filterSelection.genre
    ? filterRestBasedOnFilter.length
    : restaurants.length;

  return (
    <div className="dashboard">
      <span className="dashboard__dropdown--container">
        <h1 className="dashboard--device-title">Restaurants</h1>
        <div className="dashboard__filter--container">
          {loading ? (<DropdownSkeleton />) : (
            <Dropdown
              id="dashboard__dropdown--states"
              className="dashboard__dropdown--states dashboard__dropdown"
              label="Select state"
              items={states}
              itemToString={(item) => (item ? item.label : '')}
              onChange={e => handleStateSelection(e)}
            />
          )}
          {loading ? (<DropdownSkeleton />) : (
            <Dropdown
              id="dashboard__dropdown--genre"
              className="dashboard__dropdown--genre dashboard__dropdown"
              label="Select genre"
              items={genres}
              itemToString={(item) => (item ? item.label : '')}
              onChange={e => handleGenreSelection(e)}
            />
          )}
        </div>
      </span>
      {loading ? (<DataTableSkeleton columnCount={6} rowCount={5} open/>) : (
        <table>
          <thead>
            <tr>
              {renderTableColumns()}
            </tr>
          </thead>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
      )}
      <Pagination
        currentPage={currentPage}
        paginate={handlePagination}
        restaurantsPerPage={restaurantsPerPage}
        totalRestaurants={totalRestaurantsAmount}
      />
    </div>
  );
};

Dashboard.propTypes = {
  fetchRestaurantData: PropTypes.func,
  loading: PropTypes.bool,
};

export default Dashboard;
