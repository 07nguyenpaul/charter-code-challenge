import React from 'react';
import '../styles/ApplicationGrid.scss';

const ApplicationGrid = props => (
  <div className="application-grid">{props.children}</div>
);

export default ApplicationGrid;
