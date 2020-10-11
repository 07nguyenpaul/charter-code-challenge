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
  padding: 4px;
  color: #00a7e1;
  font-size 14px;
  &:first-child {
    border-radius: 3px 0 0 3px;
  }
  &:last-child {
    border-radius: 0 3px 3px 0;
  }
  a {
    text-decoration: none;
  }
  &:hover:not(.page-number--active) {
    background-color: #ddd;
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
          <PaginationItem key={number} className={currentPage === number ? "page-number--active" : "page-number"}>
            <a onClick={() => paginate(number)} href='!#' className="page-link">
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
