import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';

const Configuration = () => {
    const [serviceNowUrl, setServiceNowUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/configuration');
            if (response.data) {
                setServiceNowUrl(response.data.serviceNowUrl || '');
                setUsername(response.data.username || '');
                setPassword(response.data.password || '');
            }
        } catch (error) {
            console.error('Error fetching configuration:', error);
        }
    };

    const handleSave = async () => {
        try {
            await axios.post('http://localhost:5000/api/configuration', { serviceNowUrl, username, password });
            alert('Configuration updated successfully!');
        } catch (error) {
            console.error('Error updating configuration:', error);
            alert('Failed to update configuration.');
        }
    };

    const testConnection = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/configuration/test-connection', { serviceNowUrl, username, password });
            alert(response.data.message);
        } catch (error) {
            console.error('Error testing connection:', error);
            alert('Failed to connect to ServiceNow.');
        }
    };

    return (
        <Container>
            <Paper elevation={3} style={{ padding: 20, maxWidth: 500, margin: '20px auto' }}>
                <Typography variant="h5" gutterBottom>ServiceNow Configuration</Typography>
                <TextField label="ServiceNow URL" fullWidth value={serviceNowUrl} onChange={(e) => setServiceNowUrl(e.target.value)} margin="normal" />
                <TextField label="Username" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} margin="normal" />
                <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" />
                <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                <Button variant="contained" color="secondary" onClick={testConnection} style={{ marginLeft: 10 }}>Test Connection</Button>
            </Paper>
        </Container>
    );
};

export default Configuration;
