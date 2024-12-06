import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from "../../App";
import Login from "../../Models/Login/Login";
import Dashboard from '../../components/Dashboard/Dashboard';
import Navbar from '../../components/Navbar/Navbar'
import DataDashboard from '../../components/DataBlock/DataDashboard';
import DataBuild from '../../components/DataBuild/DataBuild';
import InteractionFlow from '../../components/DataBuild/DataBuild';
import HorizontalFlow from '../../components/DataBuild/DataBuild';

export default function Routers() {
    return (
       
        <div
        style={{
          backgroundColor:'#1A192B',
          backgroundSize: 'cover',
          minHeight: '100vh',
        }}
      >
<Router>
<Navbar />

    <Routes >
    
  <Route exact path="/" element={<HorizontalFlow />} />


  </Routes>
  {/* <Route component={NotFound} /> This will render if no matching route is found */}
</Router>
</div>
    );
}