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
import { Grid, Table, TableHead, TableCell, TableRow, TableBody } from '@mui/material';
import { TextField, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Chip } from "@mui/material";
import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import ErrorDialog from "components/ErrorDialog/ErrorDialog";
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import Test from '../Test';
const containerStyle = {
    width: '40%',
    height: '100px',
};

const center = {
    lat: 37.7749,
    lng: -122.4194, // Default to San Francisco
};

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
    const [openChargesDialog, setOpenChargesDialog] = useState(false);
    const [openAddressDialog, setOpenAddressDialog] = useState(false);
    const [parkingAddress, setParkingAddress] = useState('');

    const [FirstPeriodStartTime, setFirstPeriodStartTime] = useState('');
    const [FirstPeriodEndTime, setFirstPeriodEndTime] = useState('');
    const [SecondPeriodEndTime, setSecondPeriodEndTime] = useState('');
    const [ThirdPeriodEndTime, setThirdPeriodEndTime] = useState('');
    const [FourthPeriodEndTime, setFourthPeriodEndTime] = useState('');

    const [FirstPeriodCharges, setFirstPeriodCharges] = useState('');
    const [SecondPeriodCharges, setSecondPeriodCharges] = useState('');
    const [ThirdPeriodCharges, setThirdPeriodCharges] = useState('');
    const [FourthPeriodCharges, setFourthPeriodCharges] = useState('');

    const [coordinates, setCoordinates] = useState(center);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');

    console.log("Address 2 ", address)


    const [errorchecked, setErrorcheck] = useState({
        open: false,
        close: true,
        message: ''
    });

    useEffect(() => {
        if (props && props.editparkingDetails !== null) {
            setVehicle(props.editparkingDetails.vehicleType);
            setName(props.editparkingDetails.parkingName);
            setParkingAddress(props.editparkingDetails.location);
            setTotalSpace(props.editparkingDetails.totalSpace);
            setAvailableSpace(props.editparkingDetails.availableSpace);
            setLongitude(props.editparkingDetails.longitude);
            setLatitude(props.editparkingDetails.latitude);
            setTariffCharge(props.editparkingDetails.charges.tariffRate);
            setFirstPeriodStartTime((JSON.parse(props.editparkingDetails.charges.tariffRate))[0].startTime);
            setFirstPeriodEndTime((JSON.parse(props.editparkingDetails.charges.tariffRate))[0].endTime);
            setFirstPeriodCharges((JSON.parse(props.editparkingDetails.charges.tariffRate))[0].charges);
            setSecondPeriodEndTime((JSON.parse(props.editparkingDetails.charges.tariffRate))[1].endTime);
            setSecondPeriodCharges((JSON.parse(props.editparkingDetails.charges.tariffRate))[1].charges);
            setThirdPeriodEndTime((JSON.parse(props.editparkingDetails.charges.tariffRate))[2].endTime);
            setThirdPeriodCharges((JSON.parse(props.editparkingDetails.charges.tariffRate))[2].charges);
            setFourthPeriodEndTime((JSON.parse(props.editparkingDetails.charges.tariffRate))[3].endTime);
            setFourthPeriodCharges((JSON.parse(props.editparkingDetails.charges.tariffRate))[3].charges);
            setRating(props.editparkingDetails.rating);
            setReview(props.editparkingDetails.review);
            console.log("props.editparkingDetails.charges.tariffRate", props.editparkingDetails);
        }
        console.log("props.editparkingDetails.charges.tariffRate", props.editparkingDetails);
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
    const handleClose = () => {
        props.settfDialog(prevState => ({
            ...prevState,
            createopen: false,
            editopen: false
        }));
        props.seteditparkingDetails(() => null);
    };
    const handleCloseCharges = () => {
        setOpenChargesDialog(false);
    };
    const handleCloseAddress = () => {
        setOpenAddressDialog(false);
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
    const handleSubmit = async (latitude,longitude) => {
        handleLoader();
        const tariffCharges = [
            {
                startTime: FirstPeriodStartTime,
                endTime: FirstPeriodEndTime,
                charges: FirstPeriodCharges
            },
            {
                startTime: FirstPeriodEndTime,
                endTime: SecondPeriodEndTime,
                charges: SecondPeriodCharges,
            },
            {
                startTime: SecondPeriodEndTime,
                endTime: ThirdPeriodEndTime,
                charges: ThirdPeriodCharges
            },
            {
                startTime: ThirdPeriodEndTime,
                endTime: FourthPeriodEndTime,
                charges: FourthPeriodCharges
            }
        ]
        const data = {
            vendorID: vendorID,
            vehicleType: vehicle,
            parkingName: name,
            availableSpace: AvailableSpace,
            totalSpace: TotalSpace,
            rating: Rating,
            review: Review,
            location: location,
            tariffCharges: tariffCharges,
            latitude: latitude,
            longitude: longitude,
            address:address
        };
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
        console.log('data', data);

        try {
            const response = await axios.post(url, data, { headers });
            handleLoaderfalse();
            handleClose();
            props.fetchData();
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.message ) {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: error.response.data.message
                }));
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: error.response.data.message
                }));
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: error.response.data.message
                }));
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: error.response.data.message
                }));
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: error.response.data.message
                }));
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: error.response.data.message
                }));
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: error.response.data.message
                }));
            } else if (error.response && error.response.data && error.response.data.message) {
                setErrorcheck(prevState => ({
                    ...prevState,
                    open: true,
                    message: error.response.data.message
                }));
            }
        } finally {
            handleLoaderfalse();
        }
    }
    const handleUpdate = () => {
        handleLoader();
        const tariffCharges = [
            {
                startTime: FirstPeriodStartTime,
                endTime: FirstPeriodEndTime,
                charges: FirstPeriodCharges
            },
            {
                startTime: FirstPeriodEndTime,
                endTime: SecondPeriodEndTime,
                charges: SecondPeriodCharges,
            },
            {
                startTime: SecondPeriodEndTime,
                endTime: ThirdPeriodEndTime,
                charges: ThirdPeriodCharges
            },
            {
                startTime: ThirdPeriodEndTime,
                endTime: FourthPeriodEndTime,
                charges: FourthPeriodCharges
            }
        ]
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
            // tariffTime: TariffTime,
            tariffCharges: tariffCharges,
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




    const autocompleteRef = useRef(null);

    const API_KEY = 'AIzaSyD-_p4x8ysVeIqV1H92viTaonxkBW80QYA';
    const libraries = ['places'];

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setCoordinates({ lat, lng });
        setMarker({ lat, lng });
    };

    const handlePlaceSelect = () => {
        console.log('hi')
        const place = autocompleteRef.current.getPlace();
        if (place && place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setCoordinates({ lat, lng });
            setMarker({ lat, lng });
            map.setCenter({ lat, lng });

            // Extract address components
            const addressComponents = place.address_components;
            let formattedAddress = place.formatted_address;
            let city = '';
            let state = '';
            let postalCode = '';

            addressComponents.forEach((component) => {
                const types = component.types;
                if (types.includes('locality')) {
                    city = component.long_name;
                }
                if (types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                }
                if (types.includes('postal_code')) {
                    postalCode = component.long_name;
                }
            });

            setAddress(formattedAddress);
            setCity(city);
            setState(state);
            setPostalCode(postalCode);
            handleSubmit(lng, lat);
        }
    };

    const modalStyles = {
        display: openAddressDialog ? "block" : "none",
        position: "fixed",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        overflow: "auto",
        // backgroundColor: "rgba(0, 0, 0, 0.4)"
    };

    const modalContentStyles = {
        // backgroundColor: "#fff",
        margin: "15% auto",
        padding: "20px",
        border: "1px solid #888",
        width: "80%",
        textAlign: "center"
    };

    const closeButtonStyles = {
        color: "#aaa",
        float: "right",
        fontSize: "28px",
        fontWeight: "bold"
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
                {openChargesDialog &&
                    <Dialog
                        fullWidth={fullWidth}
                        maxWidth={maxWidth}
                        open={true}
                        onClose={handleCloseCharges}>
                        <table style={{
                            borderCollapse: 'collapse', width: '95%', margin: '1.5rem auto',
                            fontFamily: 'Arial, sans-serif', fontSize: '0.8rem'
                        }}>
                            <thead>
                                <tr style={{ border: '1px solid #ddd', padding: '0.8rem', textAlign: 'center' }}>
                                    <th>Time Period</th>
                                    <th>Total Charges</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '0.8rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                            <TextField label="Start" variant="outlined" size="small" onChange={(e) => { setFirstPeriodStartTime(e.target.value) }} value={FirstPeriodStartTime} />
                                            <TextField label="End" variant="outlined" size="small" onChange={(e) => { setFirstPeriodEndTime(e.target.value) }} value={FirstPeriodEndTime} />
                                        </div>
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '0.8rem', textAlign: 'center' }}>
                                        <TextField label="Charges" variant="outlined" size="small" onChange={(e) => { setFirstPeriodCharges(e.target.value) }} value={FirstPeriodCharges} />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '0.8rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                            <TextField label="Start" variant="outlined" size="small" value={FirstPeriodEndTime} disabled={true} />
                                            <TextField label="End" variant="outlined" size="small" onChange={(e) => { setSecondPeriodEndTime(e.target.value) }} value={SecondPeriodEndTime} />
                                        </div>
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '0.8rem', textAlign: 'center' }}>
                                        <TextField label="Charges" variant="outlined" size="small" onChange={(e) => { setSecondPeriodCharges(e.target.value) }} value={SecondPeriodCharges} />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '0.8rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                            <TextField label="Start" variant="outlined" size="small" value={SecondPeriodEndTime} disabled={true} />
                                            <TextField label="End" variant="outlined" size="small" onChange={(e) => { setThirdPeriodEndTime(e.target.value) }} value={ThirdPeriodEndTime} />
                                        </div>
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '0.8rem', textAlign: 'center' }}>
                                        <TextField label="Charges" variant="outlined" size="small" onChange={(e) => { setThirdPeriodCharges(e.target.value) }} value={ThirdPeriodCharges} />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '0.8rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                            <TextField label="Start" variant="outlined" size="small" value={ThirdPeriodEndTime} disabled={true} />
                                            <TextField label="End" variant="outlined" size="small" onChange={(e) => { setFourthPeriodEndTime(e.target.value) }} value={FourthPeriodEndTime} />
                                        </div>
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '0.8rem', textAlign: 'center' }}>
                                        <TextField label="Charges" variant="outlined" size="small" onChange={(e) => {
                                            var charges = `[${FirstPeriodStartTime}-${FirstPeriodEndTime} hrs : Rs ${FirstPeriodCharges}], [${FirstPeriodEndTime}-${SecondPeriodEndTime} hrs : Rs ${SecondPeriodCharges}],[${SecondPeriodEndTime}-${SecondPeriodCharges} hrs : Rs ${ThirdPeriodCharges}],[${ThirdPeriodEndTime}-${FourthPeriodCharges} hrs : Rs ${FourthPeriodCharges}]`
                                            setTariffCharge(charges)
                                             setFourthPeriodCharges(e.target.value) }} value={FourthPeriodCharges} />
                                    </td>

    
                                </tr>
                            </tbody>
                        </table>
                        <DialogActions>

                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    style={{ color: 'white' }}
                                    onClick={handleCloseCharges}>Save
                                </Button>
                            </Stack>
                        </DialogActions>
                    </Dialog>
                }

                {props.createopen && (<DialogTitle style={{ color: '#007FFF' }} >Add New Parking</DialogTitle>)}
                {props.editopen && (<DialogTitle style={{ color: '#007FFF' }} >Edit Parking Details</DialogTitle>)}
                <DialogContent>
                    {openAddressDialog &&

                        <Test setOpenAddressDialog={setOpenAddressDialog} setLatitude={setLatitude} setLongitude={setLongitude} setLocation={setLocation} setAddress={setAddress}/>

                    }
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
                                    AvailableSpace
                                }
                                onChange={(e) => { setAvailableSpace(e.target.value) }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }} >
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }} value={location}>Parking Address</Typography>
                        </Grid>
                        <Grid item xs={8}>
                           {address?
                            <TextField
                            style={{ margin: "1%", width: "100%" }}
                            label="Available Space"
                            id="outlined-size-small"
                            placeholder="Parking Address"
                            size="small"
                        
                            value={
                                address
                            }
                            onClick={() => {
                                setOpenAddressDialog(true);
                            }}
                        />
                           : <Box
                                style={{ margin: "1%", width: "100%", border: '1px solid rgba(0, 0,0,0.2)', padding: '1rem', cursor: 'pointer', borderRadius: '0.3rem' }}
                                label="parking address"
                                id="outlined-size-small"
                                placeholder="parking address"
                                size="small"
                                value = {address}
                                onClick={() => {
                                    setOpenAddressDialog(true);
                                }}
                            />}
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} justifyContent="evenly" alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }} >
                        <Grid item xs={3}>
                            <Typography variant="body1" style={{ fontSize: matches ? '0.85rem' : '0.95rem', fontFamily: 'inherit' }}>Tariff Charges </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {TariffCharge?
                             <TextField
                             style={{ margin: "1%", width: "100%" }}
                             label="Available Space"
                             id="outlined-size-small"
                             placeholder="Parking Address"
                             size="small"
                         
                             value={
                                 TariffCharge
                             }
                             onClick={() => {
                                setOpenChargesDialog(true);
                             }}
                         />
                            :
                            <Box
                                style={{ margin: "1%", width: "100%", border: '1px solid rgba(0, 0,0,0.2)', padding: '1rem', cursor: 'pointer', borderRadius: '0.3rem' }}
                                label="Tariff Charges"
                                id="outlined-size-small"
                                placeholder="Tariff Charges"
                                size="small"
                                onClick={() => {
                                    setOpenChargesDialog(true);
                                }}
                            />}
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
                                onClick={() => { handleSubmit(Latitude,Longitude) }}>Submit</Button>
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

                {/* <Test /> */}



            </Dialog>
        </React.Fragment >
    );
}
