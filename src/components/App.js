import React from 'react';
import './assets/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import TopBar from './TopBar.js';
import DrawingSpace from './DrawingSpace.js';
import ToolBar from './ToolBar.js';


function App() {
  
  return (
    <div className="App">
      <TopBar />
      <DrawingSpace />
      <ToolBar />
    </div>
  );
}

export default App;
