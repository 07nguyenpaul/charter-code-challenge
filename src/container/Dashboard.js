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
  const [filterRestBasedOnState, setRestBasedOnState] = useState([]);
  const [filterList, setFilterList] = useState([]);
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
    const restaurantList = filterRestBasedOnState && filterRestBasedOnState.length > 0
      ? filterRestBasedOnState
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
        <td>{restaurant.website}</td>
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
      alphaRestList = alphabetizeRestaurantNames();
      const currentRestaurants = alphaRestList.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

      return showRestaurantData(currentRestaurants);
    } else if (filterRestBasedOnState && filterRestBasedOnState.length > 0 && filterSelection.abbr) {
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
  const handleStateSelection = async (e) => {
    let selectedState = e.selectedItem.abbr;

    if(selectedState === "ALL") {
      setStateSelection({...filterSelection, label: "", abbr: ""});
      setRestBasedOnState([]);
    } else {
      const filtered = restaurants.filter(state => selectedState === state.state);

      setStateSelection({...filterSelection, label: e.selectedItem.label, abbr: e.selectedItem.abbr});
      setCurrentPage(1);
      setRestBasedOnState(filtered);
    }
  }

  // Filter by genre
  const handleGenreSelection = (value) => {
    const selectedGenre = value && value.selectedItem ? value.selectedItem.label : value;
    // NOT REALLY WORKING
    if (selectedGenre && filterSelection.label === "" &&  filterSelection.abbr === "") {
      // console.log('inside first if in handleGenreSelection()');
      const filtered = restaurants.filter(function(obj) {
        // console.log(obj);
        return Object.keys(obj).some(function(key) {
          let searchObject = obj[key].includes(selectedGenre)
          if (!searchObject) {
            return 0;
          } else {
            return searchObject;
          }
        })
      })

      setCurrentPage(1);
      return setFilterList(filtered);
    } else if(selectedGenre === "All") {
      setFilterList([]);
      setStateSelection({...filterSelection, genre: ""});

      return restaurants;
    } else {
      const FL =
        filterSelection.label && filterSelection.abbr ? filterRestBasedOnState : restaurants;
        // console.log('new list to filter by', FL);

      const filtered = FL.filter(function(obj) {
        // console.log(obj);
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
      return setFilterList(filtered);
    }
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard--device-title">Restaurants</h1>
      <span className="dashboard__dropdown--container">
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
        totalRestaurants={filterSelection.abbr ? filterRestBasedOnState.length : restaurants.length}
        />
    </div>
  );
};

Dashboard.propTypes = {
  fetchRestaurantData: PropTypes.func,
  loading: PropTypes.bool,
};

export default Dashboard;
