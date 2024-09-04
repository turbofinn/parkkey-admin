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

const ETDialog = (props) => {
    const [open, setOpen] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const matches = useMediaQuery('(max-width:600px)');


    const [name, setName] = useState(null);
    const [mobileNo, setMobileNo] = useState(null);
    const [gender, setGender] = useState(null);
    const [parkingName, setParkingName] = useState('');
    const [parkingList, setparkingList] = useState([]);
    const [parkingIndex, setparkingIndex] = useState('');
    const [errorchecked, setErrorcheck] = useState({
        open: false,
        close: true,
        message: ''
    });


    const handleClose = () => {
        props.setetDialog(prevState => ({
            ...prevState,
            createopen: false,
            editopen: false
        }));
        props.setEditemployee(() => null);
    };
    const handleLoader = () => {
        props.setloader(prevState => ({
            ...prevState,
            open: true
        }));
    }
    const handleLoaderfalse = () => {
        props.setloader(prevState => ({
            ...prevState,
            open: false
        }));
    }
    useEffect(() => {
        if (props && props.editemployee !== null) {
            setName(props.editemployee.employeeName);
            setMobileNo(props.editemployee.mobileNo);
            setGender(props.editemployee.gender);
            // setparkingIndex(props.)
        }
    }, []);

    const token = localStorage.getItem("token");
    const vendorID = localStorage.getItem("vendorID");

    useEffect(() => {
        fetchParkingDetails();
    }, []);
    const fetchParkingDetails = async () => {
        try {
            const response = await axios.get(`https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/vendor/fetch-all-parking-space/${vendorID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setparkingList(response.data);
            console.log("list", response.data);
        } catch (error) {
            console.log(error);
        }
    };


    const handleSubmit = async () => {
        handleLoader();
        const url = "https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/employee-onboarding";
        const data = {
            "vendorID": `${vendorID}`,
            "employeeName": name,
            "parkingSpaceID": parkingIndex,
            "mobileNo": mobileNo,
            "gender": gender
        };
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            const response = await axios.post(url, data, { headers });
            console.log("response", response);
            props.fetchData();
            handleClose();
            handleLoaderfalse();
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.message === "INVALID_INPUTS") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Invalid Inputs"
                }));
            } else if (error.response && error.response.data && error.response.data.message === "Invalid mobile Number") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Invalid mobile Number"
                }));
            } else if (error.response && error.response.data && error.response.data.message === "Invalid Gender") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Invalid Gender"
                }));
            } else if (error.response && error.response.data && error.response.data.message === "Invalid name") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Invalid name"
                }));
            } else if (error.response && error.response.data && error.response.data.message === "Employee with this mobile Number already present.") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Employee with this mobile Number already present"
                }));
            }
        } finally {
            handleLoaderfalse();
        }
    }

    const handleUpdate = async () => {
        handleLoader();
        const myHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        const data = {
            employeeName: name,
            mobileNo: mobileNo,
            gender: gender,
        };

        try {
            const response = await axios.put(
                `https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/employee/update-employee-info/${props.editemployee.employeeID}`,
                data,
                { headers: myHeaders }
            );
            console.log("response_data", response.data);
            handleClose();
            props.fetchData();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message;
                let displayMessage = '';

                switch (errorMessage) {
                    case "INVALID_INPUTS":
                        displayMessage = "Invalid Inputs";
                        break;
                    case "Emp ID Not present.":
                        displayMessage = "Emp ID Not present";
                        break;
                    case "Invalid mobile no.":
                        displayMessage = "Invalid mobile no";
                        break;
                    case "Invalid name":
                        displayMessage = "Invalid name";
                        break;
                    default:
                        displayMessage = "An error occurred";
                        break;
                }

                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: displayMessage
                }));
            } else {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "An unexpected error occurred"
                }));
            }
        } finally {
            handleLoaderfalse();
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
                {props.createopen && (<DialogTitle style={{ color: '#007FFF' }} >Add New Employee</DialogTitle>)}
                {props.editopen && (<DialogTitle style={{ color: '#007FFF' }} >Edit Employee Details</DialogTitle>)}
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


                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }}>
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Gender</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Select style={{ margin: "1%", width: "100%", padding: matches ? "3%" : "2%" }}
                                id="outlined-size-small"
                                placeholder="gender"
                                size="small"
                                value={gender}
                                onChange={(e) => { setGender(e.target.value) }}>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                {/* <MenuItem value="Others">Others</MenuItem> */}
                            </Select>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }}>
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Parking Name</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Select style={{ margin: "1%", width: "100%", padding: matches ? "3%" : "2%" }}
                                id="outlined-size-small"
                                placeholder="parking name"
                                size="small"
                                value={parkingName}
                                onChange={(e) => {
                                    setParkingName(e.target.value);
                                }}>
                                {
                                    parkingList && parkingList.map((data, index) => {
                                        return (
                                            <MenuItem value={data.parkingName} onClick={() => {
                                                setparkingIndex(data.parkingSpaceID);
                                            }}>{data.parkingName}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
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

export default ETDialog;