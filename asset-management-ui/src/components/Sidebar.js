import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = () => {
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
        <ListItem button component={Link} to="/mapping">
          <ListItemText primary="Mapping" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
