import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PaginationList = styled.ul`
  display: flex;

  .page-number--active {
    background: #508da1;
    border: 1px solid #4CAF50;
    a {
      color: white;
    }
  }
`;

const PaginationItem = styled.li`
  border: 1px solid black;
  color: #00a7e1;
  font-size: 16px;
  height: 42px;
  padding: 11px 15px;
  text-align: center;
  width: 48px;
  &:first-child {
    border-radius: 2px 0 0 2px;
  }
  &:last-child {
    border-radius: 0 2px 2px 0;
  }
  &:only-child {
    border-radius: 2px;
  }
  a {
    text-decoration: none;
  }
  &:hover:not(.page-number--active) {
    background-color: #ddd;
  }
  &:hover {
    cursor: pointer;
  }
`;

const Pagination = ({ currentPage, paginate, restaurantsPerPage, totalRestaurants }) => {
  const pageNum = [];
  for (var i = 1; i <= Math.ceil(totalRestaurants / restaurantsPerPage); i++) {
    pageNum.push(i);
  };

  return (
    <nav>
      <PaginationList className="pagination">
        {pageNum.map(number => (
          <PaginationItem key={number} className={currentPage === number ? "page-number--active" : "page-number"} onClick={() => paginate(number)}>
            <a href='!#' className="page-link">
              {number}
            </a>
          </PaginationItem>
        ))}
      </PaginationList>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  paginate: PropTypes.func,
  restaurantsPerPage: PropTypes.number,
  totalRestaurants: PropTypes.number,
};

export default Pagination;
