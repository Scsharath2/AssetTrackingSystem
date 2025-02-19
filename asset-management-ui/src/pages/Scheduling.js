import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const Scheduling = () => {
  const [schedules, setSchedules] = useState([]);
  const [open, setOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    name: "",
    frequency: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get("http://localhost:3833/api/schedules");
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const handleOpen = (schedule = null) => {
    if (schedule) {
      setEditingId(schedule.id);
      setScheduleData({ name: schedule.name, frequency: schedule.frequency });
    } else {
      setEditingId(null);
      setScheduleData({ name: "", frequency: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setScheduleData({ ...scheduleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:3833/api/schedules/${editingId}`, scheduleData);
      } else {
        await axios.post("http://localhost:3833/api/schedules", scheduleData);
      }
      fetchSchedules();
      handleClose();
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3833/api/schedules/${id}`);
      fetchSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Scheduling Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add New Schedule
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.name}</TableCell>
                <TableCell>{schedule.frequency}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(schedule)}>Edit</Button>
                  <Button color="secondary" onClick={() => handleDelete(schedule.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit Schedule */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingId ? "Edit Schedule" : "Add Schedule"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={scheduleData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Frequency"
            name="frequency"
            fullWidth
            value={scheduleData.frequency}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">{editingId ? "Update" : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Scheduling;
