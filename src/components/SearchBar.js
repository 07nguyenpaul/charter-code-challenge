import React from 'react';
import PropTypes from 'prop-types';
import { Close16, Search16 } from '@carbon/icons-react';

const SearchBar = ({searchValue, handleSearch, handleTextInput, clearSearch}) => {
  return (
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
  )
};

SearchBar.propTypes = {
  searchValue: PropTypes.string,
  handleSearch: PropTypes.func,
  handleTextInput: PropTypes.func,
  clearSearch: PropTypes.func
};

export default SearchBar;
