import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, TablePagination } from '@mui/material';

const AssetManagement = () => {
    const [assets, setAssets] = useState([]);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [filter, setFilter] = useState({ field: '', value: '' });
    const [fields, setFields] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const response = await axios.get('http://localhost:3833/api/assets');
            if (Array.isArray(response.data.records)) {
                setAssets(response.data.records);
                setFilteredAssets(response.data.records);
                if (response.data.records.length > 0) {
                    setFields(Object.keys(response.data.records[0]));
                }
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (filter.field && filter.value) {
            setFilteredAssets(assets.filter(asset => 
                asset[filter.field]?.toString().toLowerCase().includes(filter.value.toLowerCase())
            ));
        } else {
            setFilteredAssets(assets);
        }
    }, [filter, assets]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container>
            <h2>Asset Management</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <Select name="field" value={filter.field} onChange={handleFilterChange} displayEmpty>
                    <MenuItem value="">Select Field</MenuItem>
                    {fields.map(field => <MenuItem key={field} value={field}>{field}</MenuItem>)}
                </Select>
                <TextField name="value" label="Filter Value" value={filter.value} onChange={handleFilterChange} />
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {fields.map(field => <TableCell key={field}>{field}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAssets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((asset, index) => (
                            <TableRow key={index}>
                                {fields.map(field => <TableCell key={field}>{asset[field]}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={filteredAssets.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </Container>
    );
};

export default AssetManagement;
