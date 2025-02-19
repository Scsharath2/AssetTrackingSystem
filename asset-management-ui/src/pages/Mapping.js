import React, { useState } from "react";
import { Container, Typography, Select, MenuItem, Button, Grid, Card, CardContent } from "@mui/material";

const Mapping = () => {
  const [selectedTable, setSelectedTable] = useState("");
  const [mappings, setMappings] = useState([{ servicenowField: "", databaseField: "" }]);

  const servicenowTables = ["cmdb_ci", "incident", "task"];
  const servicenowFields = ["sys_id", "name", "status"];
  const databaseFields = ["id", "asset_name", "state"];

  const handleAddMapping = () => {
    setMappings([...mappings, { servicenowField: "", databaseField: "" }]);
  };

  const handleMappingChange = (index, field, value) => {
    const newMappings = [...mappings];
    newMappings[index][field] = value;
    setMappings(newMappings);
  };

  const handleSave = () => {
    console.log("Saved Mappings:", mappings);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Field Mapping
      </Typography>
      <Select
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
        displayEmpty
        fullWidth
      >
        <MenuItem value="" disabled>Select ServiceNow Table</MenuItem>
        {servicenowTables.map((table) => (
          <MenuItem key={table} value={table}>{table}</MenuItem>
        ))}
      </Select>

      {mappings.map((mapping, index) => (
        <Card key={index} sx={{ marginTop: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Select
                  value={mapping.servicenowField}
                  onChange={(e) => handleMappingChange(index, "servicenowField", e.target.value)}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="" disabled>Select ServiceNow Field</MenuItem>
                  {servicenowFields.map((field) => (
                    <MenuItem key={field} value={field}>{field}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={5}>
                <Select
                  value={mapping.databaseField}
                  onChange={(e) => handleMappingChange(index, "databaseField", e.target.value)}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="" disabled>Select Database Field</MenuItem>
                  {databaseFields.map((field) => (
                    <MenuItem key={field} value={field}>{field}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Button onClick={handleAddMapping} variant="outlined" sx={{ marginTop: 2 }}>
        Add Mapping
      </Button>
      <Button onClick={handleSave} variant="contained" sx={{ marginLeft: 2, marginTop: 2 }}>
        Save Mappings
      </Button>
    </Container>
  );
};

export default Mapping;
