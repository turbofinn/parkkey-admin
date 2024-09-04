import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Grid } from '@mui/material';
import { TextField, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from 'react';
import axios from "axios";
import ErrorDialog from "components/ErrorDialog/ErrorDialog";

const VendorDialog = (props) => {
    const [open, setOpen] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const matches = useMediaQuery('(max-width:600px)');

    const [name, setName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [errorchecked, setErrorcheck] = useState({
        open: false,
        close: true,
        message: ''
    });

    const handleClose = () => {
        props.setvtDialog(prevState => ({
            ...prevState,
            createopen: false,
            editopen: false
        }));
        props.seteditvendorDetails(() => null);
    };

    useEffect(() => {
        if (props && props.editvendorDetails !== null) {
            setName(props.editvendorDetails.vendorName);
            setMobileNo(props.editvendorDetails.mobileNo);
        }
    }, []);

    const token = localStorage.getItem("token");
    const handleSubmit = async () => {
        const url = "https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/vendor-onboarding";
        const data = {
            "vendorName": name,
            "vendorMobileNo": mobileNo,
        };
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        try {
            const response = await axios.post(url, data, { headers });
            console.log("response", response);
            handleClose();
            props.fetchData();
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.message === "Please enter vendorName and Mobile No.") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Please enter vendorName and Mobile No"
                }));
            } else if (error.response && error.response.data && error.response.data.message === "Vendor with this mobile number already present.") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Vendor with this mobile number already present"
                }));
            }
        } finally {
            // handleLoaderfalse();
        }
    }

    const handleUpdate = async () => {
        const myHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
    
        const data = {
            vendorName: name,
            mobileNo: mobileNo,
        };
    
        try {
            const response = await axios.put(`https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/vendor/update-vendor-info/${props.editvendorDetails.vendorID}`, data, { headers: myHeaders });
            console.log("response_data", response.data);
            handleClose();
            props.fetchData();
        } catch (error) {
            // console.error('Error:', error);
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message;
                if (errorMessage === "Vendor ID Not present.") {
                    setErrorcheck(prevState => ({
                        ...prevState,
                        open: true,
                        message: "Vendor ID Not present"
                    }));
                } else if (errorMessage === "Invalid mobile no.") {
                    setErrorcheck(prevState => ({
                        ...prevState,
                        open: true,
                        message: "Invalid mobile no"
                    }));
                } else if (errorMessage === "Invalid Name.") {
                    setErrorcheck(prevState => ({
                        ...prevState,
                        open: true,
                        message: "Invalid Name"
                    }));
                }
            }
        } finally {
            // Uncomment this if you have a loader to handle
            // handleLoaderfalse();
        }
    };
    
    return (
        <React.Fragment>
            {
                errorchecked.open && (<ErrorDialog message={errorchecked.message} setErrorcheck={setErrorcheck}
                    errorchecked={errorchecked} />)
            }
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={props.createopen || props.editopen}
                onClose={handleClose}
            >
                {props.createopen && (<DialogTitle style={{ color: '#007FFF' }} >Add New Vendor</DialogTitle>)}
                {props.editopen && (<DialogTitle style={{ color: '#007FFF' }} >Edit Vendor Details</DialogTitle>)}
                <DialogContent>
                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }} >
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Name</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                style={{ margin: "1%", width: "100%" }}
                                label="Name"
                                id="outlined-size-small"
                                placeholder="name"
                                size="small"
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }} >
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Mobile No. </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                style={{ margin: "1%", width: "100%" }}
                                label="mobile no"
                                id="outlined-size-small"
                                placeholder="mobile no"
                                size="small"
                                value={mobileNo}
                                onChange={(e) => { setMobileNo(e.target.value) }}
                            />
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    {props.createopen &&
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                style={{ color: 'white' }}
                                onClick={handleSubmit}>Submit</Button>
                        </Stack>
                    }
                    {props.editopen &&
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                style={{ color: 'white' }}
                                onClick={handleUpdate}>Update</Button>
                        </Stack>
                    }
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default VendorDialog;