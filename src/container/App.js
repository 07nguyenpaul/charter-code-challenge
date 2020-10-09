import React from 'react';
import Footer from '../components/Footer.js';
import Dashboard from './Dashboard.js';
import ApplicationGrid from './ApplicationGrid.js';

import '../styles/_mixins/_carbon.scss';

function App() {
  return (
    <div className="App">
      <ApplicationGrid>
        <Dashboard />
        <Footer />
      </ApplicationGrid>
    </div>
  );
}

export default App;
