import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

const Configuration = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch the existing ServiceNow URL from the backend
        axios.get('http://localhost:3833/api/configuration')
            .then(response => {
                if (response.data && response.data.serviceNowUrl) {
                    setUrl(response.data.serviceNowUrl);
                }
            })
            .catch(error => {
                console.error('Error fetching configuration:', error);
            });
    }, []);

    const handleSave = () => {
        setLoading(true);
        axios.post('http://localhost:3833/api/configuration', { serviceNowUrl: url })
            .then(() => {
                alert('Configuration saved successfully!');
            })
            .catch(error => {
                console.error('Error saving configuration:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Typography variant="h5" gutterBottom>
                    ServiceNow Configuration
                </Typography>
                <TextField
                    label="ServiceNow URL"
                    variant="outlined"
                    fullWidth
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    margin="normal"
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSave} 
                    disabled={loading}>
                    {loading ? 'Saving...' : 'Save Configuration'}
                </Button>
            </Paper>
        </Container>
    );
};

export default Configuration;
