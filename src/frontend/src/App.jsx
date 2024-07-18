import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Register from "./Register";
import Landing from './Trader/Landing';
import Home from './Trader/Home';
import Tracking from './Trader/Tracking';
import Inventory from './Trader/Inventory';
import PalayRegister from './Trader/PalayRegister';
import PalayUpdate from './Trader/PalayUpdate';
import Facilities from './Trader/Facilities';
import WarehouseFacility from './Trader/WarehouseFacility';
import DryerFacility from './Trader/DryerFacility';
import MillerFacility from './Trader/MillerFacility';
import Profile from './Trader/Profile'



function App() {
  return(
  <Router>
    <Routes>
      <Route path="/register" element={<Register />}/>
      <Route path="/landing" element={<Landing />}/>
      <Route path="/home" element={<Home />}/>
      <Route path="/tracking" element={<Tracking />}/>
      <Route path="/inventory" element={<Inventory />}/>
      <Route path="/inventory/palay-register" element={<PalayRegister />}/>
      <Route path="/inventory/palay-update" element={<PalayUpdate />}/>
      <Route path="/facilities" element={<Facilities />}/>
      <Route path="/facilities/warehouse" element={<WarehouseFacility />}/>
      <Route path="/facilities/dryer" element={<DryerFacility />}/>
      <Route path="/facilities/miller" element={<MillerFacility />}/>
      <Route path="/profile" element={<Profile />}/>
    </Routes>
  </Router>
  );
}

export default App;
