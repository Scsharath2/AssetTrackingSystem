import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProviderComponent } from "./context/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Configuration from "./pages/Configuration";
import Scheduling from "./pages/Scheduling";
import Mapping from "./pages/Mapping";
import { Box } from "@mui/material";

// Import ServiceNow Sync Pages
import AssetsSync from "./pages/ServiceNowSync/AssetsSync";
import EmployeesSync from "./pages/ServiceNowSync/EmployeesSync";
import LocationsSync from "./pages/ServiceNowSync/LocationsSync";
import ModelsSync from "./pages/ServiceNowSync/ModelsSync";
import StocksSync from "./pages/ServiceNowSync/StocksSync";

const App = () => {
  return (
    <ThemeProviderComponent>
      <Router>
        <Box display="flex">
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <ThemeToggle />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/scheduling" element={<Scheduling />} />
              <Route path="/mapping" element={<Mapping />} />

              {/* ServiceNow Sync Section */}
              <Route path="/servicenow/assets" element={<AssetsSync />} />
              <Route path="/servicenow/employees" element={<EmployeesSync />} />
              <Route path="/servicenow/locations" element={<LocationsSync />} />
              <Route path="/servicenow/models" element={<ModelsSync />} />
              <Route path="/servicenow/stocks" element={<StocksSync />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProviderComponent>
  );
};

export default App;
