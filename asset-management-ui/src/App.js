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
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProviderComponent>
  );
};

export default App;
