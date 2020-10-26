import React, { useState, useEffect } from 'react';
import { DataTableSkeleton, Dropdown, DropdownSkeleton, SkeletonText } from 'carbon-components-react'
import { Close16, Search16 } from '@carbon/icons-react';
import PropTypes from 'prop-types';

import { states, genres } from '../constants';
import Pagination from '../components/Pagination';
import RestaurantData from '../service/fetchData';

import '../styles/Dashboard.scss';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRestBasedOnFilter, setRestBasedOnFilter] = useState([]);
  const [filterSelection, setStateSelection] = useState({label: "", abbr: "", genre: ""});
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [tempFilterList, setTempFilterList] = useState([]);

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
  const alphabetizeRestaurantNames = (listOfRestaurants) => {
    return listOfRestaurants.sort((a, b) => {
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

    // Default render of restuarant list with no search value and no filters
    if (!filterSelection.abbr && !searchValue && !filterSelection.genre) {
      alphaRestList = alphabetizeRestaurantNames(restaurants);
      const currentRestaurants = alphaRestList.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

      return showRestaurantData(currentRestaurants);
    } else if (filterRestBasedOnFilter && filterRestBasedOnFilter.length > 0) {
      // Render restuarant list with filters
      alphaRestList = alphabetizeRestaurantNames(filterRestBasedOnFilter);
      const currentRestaurants = alphaRestList.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

      return showRestaurantData(currentRestaurants);
    } else if ((filterRestBasedOnFilter && filterRestBasedOnFilter.length <= 0) && (searchValue || filterSelection.abbr)) {
      // Render no results if there isn't a match with search value or filter
      return (
        <tr>
          <td colSpan="6">{searchValue ? "No results found." : `No Results found in ${filterSelection.label}. Select another state.`}</td>
        </tr>
      );
    } else {
      // Default render for no results
      return (
        <tr>
          <td colSpan="6">No results found.</td>
        </tr>
      );
    };
  };

  // Handle pagination
  const handlePagination = pageNum => setCurrentPage(pageNum);

  // Filter by state
  const handleStateSelection = (e) => {
    let selectedState = e && e.selectedItem ? e.selectedItem.abbr : filterSelection.abbr;

    // Resetting state filter
    if(selectedState === "ALL") {
      const filterSelectionCondition =
        (((filterSelection.abbr !== e.selectedItem.label &&
        filterSelection.label !== e.selectedItem.abbr) &&
        filterSelection.genre) || searchValue);

      if(filterSelectionCondition) {
        // Reset state filter but tempFilterList is kept to filter genre or search
        setStateSelection({...filterSelection, label: "", abbr: ""});
        setRestBasedOnFilter(tempFilterList)
      } else {
        setStateSelection({...filterSelection, label: "", abbr: ""});
        setRestBasedOnFilter([]);
      }
    } else {
      const restaurantList = searchValue || filterSelection.genre ? tempFilterList : restaurants;
      let filteredList = restaurantList.filter(state => selectedState === state.state);
      const stateFilterSelection = filterSelection.label === e.selectedItem.label && filterSelection.abbr === e.selectedItem.abbr;

      if(!searchValue) {
        setTempFilterList(filteredList);
      }

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
  const handleGenreSelection = async (value) => {
    const selectedGenre = value && value.selectedItem ? value.selectedItem.label : value;

    // Resetting genre filter
    if(selectedGenre === "All") {
      // Resetting genre but still have state filter selected
      if((filterSelection.abbr && filterSelection.label) || searchValue) {
        setStateSelection({...filterSelection, genre: ""});
        setRestBasedOnFilter(tempFilterList);
      } else {
        setStateSelection({...filterSelection, genre: ""});
        setRestBasedOnFilter([]);
      }
    } else {
      const restaurantList =
        (filterSelection.label && filterSelection.abbr) || searchValue ? tempFilterList : restaurants;
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

  // Set search value to state
  const handleTextInput = e => {
    e.preventDefault();
    let searchValue = e.target.value;
    setSearchValue(searchValue);
  }

  // Handle restaurant search
  const handleSearch = e => {
    let results = [];
    if(e.key === "Enter") {
      let value = e.target.value;

      results = restaurants.filter(obj => {
        if(obj.genre.toLowerCase().includes(value.toLowerCase())) {
           return obj;
        } else if (obj.city.toLowerCase().includes(value.toLowerCase())) {
          return obj;
        } else if (obj.name.toLowerCase().includes(value.toLowerCase())) {
          return obj;
        } else return;
      })
      setTempFilterList(results);
      return setRestBasedOnFilter(results);
    }
  }

  // Clear search results
  const clearSearch = (e) => {
    e.preventDefault();
    setSearchValue("");
    setRestBasedOnFilter([]);
  }

  // Total restaurant amount of pagination based on filters settings
  const totalRestaurantsAmount = filterSelection.abbr || (filterSelection.abbr && filterSelection.genre) || filterSelection.genre || searchValue
    ? filterRestBasedOnFilter.length
    : restaurants.length;

  return (
    <div className="dashboard">
      <span className="dashboard__dropdown--container">
        <h1 className="dashboard--device-title">Restaurants</h1>
        <div className="dashboard__filter--container">
          {loading ? (<SkeletonText />) : (
            <div className="dashboard__search--wrapper">
              <Search16 className="search__icon"/>
              <input
                type="text"
                className="dashboard__search-input"
                role="searchbox"
                autoComplete="off"
                labeltext=""
                placeholder="Search..."
                onKeyDown={e => handleSearch(e)}
                onChange={e => handleTextInput(e)}
                value={searchValue}
              />
              <button
                className={searchValue ? "search__close-icon--display" :  "search__close-icon--hide"}
                onClick={e => clearSearch(e)}
              >
                <Close16 className="search__close-icon"/>
              </button>
            </div>
          )}
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
