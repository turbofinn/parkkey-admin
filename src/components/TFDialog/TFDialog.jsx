import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Grid } from '@mui/material';
import { TextField, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Chip } from "@mui/material";
import { useState, useEffect } from 'react';
import axios from "axios";
import ErrorDialog from "components/ErrorDialog/ErrorDialog";

export default function MaxWidthDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const matches = useMediaQuery('(max-width:600px)');

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [vehicle, setVehicle] = useState([]);
    const [TotalSpace, setTotalSpace] = useState(0);
    const [AvailableSpace, setAvailableSpace] = useState(0);
    const [Longitude, setLongitude] = useState('');
    const [Latitude, setLatitude] = useState('');
    const [TariffTime, setTariffTime] = useState(0);
    const [TariffCharge, setTariffCharge] = useState(0);
    const [Rating, setRating] = useState(0);
    const [Review, setReview] = useState('');


    const [errorchecked, setErrorcheck] = useState({
        open: false,
        close: true,
        message: ''
    });

    useEffect(() => {
        if (props && props.editparkingDetails !== null) {
            setVehicle(props.editparkingDetails.vehicleType);
            setName(props.editparkingDetails.parkingName);
            setLocation(props.editparkingDetails.location);
            setTotalSpace(props.editparkingDetails.totalSpace);
            setAvailableSpace(props.editparkingDetails.availableSpace);
            setLongitude(props.editparkingDetails.longitude);
            setLatitude(props.editparkingDetails.latitude);
            setTariffCharge(props.editparkingDetails.charges.tariffRate);
            setTariffTime(props.editparkingDetails.charges.tariffTime);
            setRating(props.editparkingDetails.rating);
            setReview(props.editparkingDetails.review);
        }
    }, []);

    const url = "https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/parking-space-onboarding";
    const token = localStorage.getItem("token");
    const vendorID = localStorage.getItem("vendorID");
    const names = [
        "Heavy",
        "Bike",
        "Car",
        "Truck",
        "Bus",
    ];
    // console.log("xy", name);
    // console.log("xy", location);
    // console.log("xy", vehicle);
    // console.log("xy", TotalSpace);
    // console.log("xy", AvailableSpace);
    // console.log("xy", Longitude);
    // console.log("xy", Latitude);
    // console.log("xy", TariffTime);
    // console.log("xy", TariffCharge);
    // console.log("xy", Rating);
    // console.log("xy", Review);
    const handleClose = () => {
        props.settfDialog(prevState => ({
            ...prevState,
            createopen: false,
            editopen: false
        }));
        props.seteditparkingDetails(() => null);
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
    const handleSubmit = async () => {
        handleLoader();
        const data = {
            vendorID: vendorID,
            vehicleType: vehicle,
            parkingName: name,
            availableSpace: AvailableSpace,
            totalSpace: TotalSpace,
            rating: Rating,
            review: Review,
            location: location,
            tariffTime: TariffTime,
            tariffCharges: TariffCharge,
            latitude: Latitude,
            longitude: Longitude
        };
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            const response = await axios.post(url, data, { headers });
            handleLoaderfalse();
            handleClose();
            props.fetchData();
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.message === "Tariff charges cannot be less than Rs. 5.") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Tariff charges cannot be less than Rs. 5"
                }));
            } else if (error.response && error.response.data && error.response.data.message === "Tariff time cannot be less than 0 hours.") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Tariff time cannot be less than 0 hours"
                }));
            } else if (error.response && error.response.data && error.response.data.message === "Available space cannot be less than 0.") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Available space cannot be less than 0"
                }));
            } else if (error.response && error.response.data && error.response.data.message === "Rating cannot be less than 0.") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Rating cannot be less than 0"
                }));
            } else if (error.response && error.response.data && error.response.data.message === "Total space cannot be less than 0.") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Total space cannot be less than 0"
                }));
            } else if (error.response && error.response.data && error.response.data.message === "Rating cannot be greater than 5.") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Rating cannot be greater than 5"
                }));
            } else if (error.response && error.response.data && error.response.data.message === "Available space cannot be greater than total space.") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Available space cannot be greater than total space"
                }));
            } else if (error.response && error.response.data && error.response.data.message === "Parking Space with same name already Exists.") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Parking Space with same name already Exists"
                }));
            }
        } finally {
            handleLoaderfalse();
        }
    }


    const handleUpdate = () => {
        handleLoader();
        const data = {
            parkingSpaceID: props.editparkingDetails.parkingSpaceID,
            vehicleType: vehicle,
            parkingName: name,
            parkingSpaceStatus: "Active",
            availableSpace: AvailableSpace,
            totalSpace: TotalSpace,
            rating: Rating,
            review: Review,
            location: location,
            tariffTime: TariffTime,
            tariffCharges: TariffCharge,
            latitude: Latitude,
            longitude: Longitude
        };
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        // const getBaseUrl = () => { return process.env.REACT_APP_IS_IN_PROD === "true" ? process.env.REACT_APP_BASE_URL_PROD : process.env.REACT_APP_BASE_URL_DEV;
        // }
        // console.log("url", getBaseUrl);
        try {
            axios.put(
                `https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/parking-space/update-parking-space-info/${props.editparkingDetails.parkingSpaceID}`,
                data,
                { headers: headers }
            )
                .then((response) => {
                    handleClose();
                    console.log(response.data);
                    handleLoader();
                    props.fetchData();
                })
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.message === "Parking Space ID Not present.") {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: "Parking Space ID Not present"
                }));
            }
        } finally {
            handleLoaderfalse();
        }
    }
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
                {props.createopen && (<DialogTitle style={{ color: '#007FFF' }} >Add New Parking</DialogTitle>)}
                {props.editopen && (<DialogTitle style={{ color: '#007FFF' }} >Edit Parking Details</DialogTitle>)}
                <DialogContent>
                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }} >
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Parking Name </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                style={{ margin: "1%", width: "100%" }}
                                label="Parking Name"
                                id="outlined-size-small"
                                placeholder="parking name"
                                size="small"
                                value={
                                    // props.editopen ? props.editparkingDetails.parkingName : ''
                                    name
                                }
                                onChange={(e) => { setName(e.target.value) }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }} >
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Location </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                style={{ margin: "1%", width: "100%" }}
                                label="location"
                                id="outlined-size-small"
                                placeholder="location"
                                size="small"
                                value={
                                    // props.editopen ? props.editparkingDetails.location : ''
                                    location
                                }
                                onChange={(e) => { setLocation(e.target.value) }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }} >
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Vehicle Type </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <FormControl sx={{ width: "100%" }}
                                placeholder="Vehicle Type"
                                size="small"
                            >
                                <InputLabel>Multiple Select</InputLabel>
                                <Select
                                    style={{ margin: "1%", width: "100%", padding: matches ? "3%" : "2%" }}
                                    multiple
                                    // value={vehicle}
                                    value={vehicle} // props.editopen && vehicle.length === 0 ? props.editparkingDetails.vehicleType :
                                    id="outlined-size-small"
                                    onChange={(e) => {
                                        setVehicle(e.target.value);
                                        console.log("vehicle", vehicle);
                                    }}
                                    renderValue={(selected) => (
                                        <Stack gap={1} direction="row" flexWrap="wrap">
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Stack>
                                    )}
                                >
                                    {names.map((name) => (
                                        <MenuItem key={name} value={name}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }}>
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Total Space </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                style={{ margin: "1%", width: "100%" }}
                                label="Total Space"
                                id="outlined-size-small"
                                placeholder="Total Space"
                                size="small"
                                value={
                                    // props.editopen ? props.editparkingDetails.totalSpace : ''
                                    TotalSpace
                                }
                                onChange={(e) => { setTotalSpace(e.target.value) }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }}>
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Available Space </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                style={{ margin: "1%", width: "100%" }}
                                label="Available Space"
                                id="outlined-size-small"
                                placeholder="Available Space"
                                size="small"
                                value={
                                    // props.editopen ? props.editparkingDetails.availableSpace : ''
                                    AvailableSpace
                                }
                                onChange={(e) => { setAvailableSpace(e.target.value) }}
                            />
                        </Grid>
                    </Grid>
                    <Grid>
                        <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }}>
                            <Grid item xs={3}>
                                <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Longitude </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    style={{ margin: "1%", width: "100%" }}
                                    label="Longitude"
                                    id="outlined-size-small"
                                    placeholder="Longitude"
                                    size="small"
                                    value={
                                        // props.editopen ? props.editparkingDetails.longitude : ''
                                        Longitude
                                    }
                                    onChange={(e) => { setLongitude(e.target.value) }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }} >
                            <Grid item xs={3}>
                                <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Latitude </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    style={{ margin: "1%", width: "100%" }}
                                    label="Latitude"
                                    id="outlined-size-small"
                                    placeholder="Latitude"
                                    size="small"
                                    value={
                                        // props.editopen ? props.editparkingDetails.latitude : ''
                                        Latitude
                                    }
                                    onChange={(e) => { setLatitude(e.target.value) }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }} >
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Tariff Time </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                style={{ margin: "1%", width: "100%" }}
                                label="Tariff Time"
                                id="outlined-size-small"
                                placeholder="Tariff Time"
                                size="small"
                                value={
                                    // props.editopen ? props.editparkingDetails.charges.tariffTime : ''
                                    TariffTime
                                }
                                onChange={(e) => { setTariffTime(e.target.value) }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }} >
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Tariff Charges </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                style={{ margin: "1%", width: "100%" }}
                                label="Tariff Charges"
                                id="outlined-size-small"
                                placeholder="Tariff Charges"
                                size="small"
                                value={
                                    // props.editopen ? props.editparkingDetails.charges.tariffRate : ''
                                    TariffCharge
                                }
                                onChange={(e) => { setTariffCharge(e.target.value) }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }} >
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Rating </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                style={{ margin: "1%", width: "100%" }}
                                label="Rating"
                                id="outlined-size-small"
                                placeholder="Rating"
                                size="small"
                                value={
                                    // props.editopen ? props.editparkingDetails.rating : ''
                                    Rating
                                }
                                onChange={(e) => { setRating(e.target.value) }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }} >
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Review </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                style={{ margin: "1%", width: "100%" }}
                                label="Review"
                                id="outlined-size-small"
                                placeholder="Review"
                                size="small"
                                value={
                                    // props.editopen ? props.editparkingDetails.review : ''
                                    Review
                                }
                                onChange={(e) => { setReview(e.target.value) }}
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
    );
}
