import React, { useState, useEffect } from 'react';
import { DataTableSkeleton } from 'carbon-components-react'
import PropTypes from 'prop-types';

import Pagination from '../components/Pagination';
import RestaurantData from '../service/fetchData';

import '../styles/Dashboard.scss';

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
    return restaurants.sort((a, b) => {
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

  // Render table rows with restaurant data
  const renderTableRows = () => {
    let alphaRestList = [];
    alphaRestList = alphabetizeRestaurantNames();

    const indexOfLastRestaurant = currentPage * restaurantsPerPage;
    const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
    const currentRestaurants = alphaRestList.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

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
  }

  // Handle pagination
  const handlePagination = pageNum => setCurrentPage(pageNum);

  return (
    <div className="dashboard">
      <h1 className="dashboard--device-title">Restaurants</h1>
      {loading ? (<DataTableSkeleton columnCount={6} rowCount={10} open/>) : (
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
        totalRestaurants={restaurants.length}
        />
    </div>
  );
};

Dashboard.propTypes = {
  fetchRestaurantData: PropTypes.func,
  loading: PropTypes.bool,
};

export default Dashboard;
