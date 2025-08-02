
import './App.css';
//import Header from './Components/Header';]
import Dashboard from './Pages/Dashboard';
import Signup from './Pages/Signup';
import {
  BrowserRouter as
  Router,
  Route,
  Routes
} from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <><ToastContainer/>
      <Router>
        <Routes>
          <Route path="/" element={<Signup/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </Router>
      </>
    </div>
  );
}

export default App;
