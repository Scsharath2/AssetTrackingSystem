import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, Typography, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [openServiceNowSync, setOpenServiceNowSync] = useState(false);

  const handleServiceNowClick = () => {
    setOpenServiceNowSync(!openServiceNowSync);
  };

  return (
    <Drawer variant="permanent" sx={{ width: 240 }}>
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/configuration">
          <ListItemText primary="Configuration" />
        </ListItem>
        <ListItem button component={Link} to="/scheduling">
          <ListItemText primary="Scheduling" />
        </ListItem>


        {/* ServiceNow Sync - Clickable Header */}
        <ListItem button onClick={handleServiceNowClick}>
          <ListItemText primary="ServiceNow Sync" />
          {openServiceNowSync ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        {/* Collapsible ServiceNow Sync Pages */}
        <Collapse in={openServiceNowSync} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/servicenow/assets" sx={{ pl: 4 }}>
              <ListItemText primary="Assets" />
            </ListItem>
            <ListItem button component={Link} to="/servicenow/employees" sx={{ pl: 4 }}>
              <ListItemText primary="Employees" />
            </ListItem>
            <ListItem button component={Link} to="/servicenow/locations" sx={{ pl: 4 }}>
              <ListItemText primary="Locations" />
            </ListItem>
            <ListItem button component={Link} to="/servicenow/models" sx={{ pl: 4 }}>
              <ListItemText primary="Models" />
            </ListItem>
            <ListItem button component={Link} to="/servicenow/stock" sx={{ pl: 4 }}>
              <ListItemText primary="Stock" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;
