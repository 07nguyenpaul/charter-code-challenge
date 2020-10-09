import React, { Component } from 'react';
import { DataTableSkeleton } from 'carbon-components-react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchRestaurantData } from '../actions/restaurants';

import '../styles/Dashboard.scss';

export class Dashboard extends Component {
  componentDidMount() {
    this.props.fetchRestaurantData();
  }

  static getInitialProps

  renderTableColumns = () => {
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

  alphabetizeRestaurantNames = () => {
    return this.props.restaurants.sort((a, b) => {
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

  renderTableRows = () => {
    this.alphabetizeRestaurantNames();

    return this.props.restaurants.map(restaurant => (
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

  render() {
    const { loading } = this.props;

    return (
      <div className="dashboard">
        <h1 className="dashboard--device-title">Restaurants</h1>
        {loading ? (<DataTableSkeleton columnCount={6} rowCount={10} open/>) : (
          <table>
            <thead>
              <tr>
                {this.renderTableColumns()}
              </tr>
            </thead>
            <tbody>
              {this.renderTableRows()}
          </tbody>
          </table>
        )}
      </div>
    )
  }
}

Dashboard.propTypes = {
  fetchRestaurantData: PropTypes.func,
  loading: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    restaurants: state.restaurants.restaurants,
    loading: state.restaurants.requesting,
  };
}

const mapDispatchToProps = {
  fetchRestaurantData
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
