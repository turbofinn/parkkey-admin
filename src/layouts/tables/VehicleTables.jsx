import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import parkingTableData from "layouts/tables/data/parkingTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

import parkey from "assets/images/onlpLogo.png";
import MDBadge from "components/MDBadge";
import MDAvatar from "components/MDAvatar";
import { useEffect, useState } from "react";
import axios from "axios";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import VendorDialog from "components/VTDialog/VendorDialog";
import { Button, InputAdornment, OutlinedInput, TextField, Typography } from "@mui/material";
import { TextFields } from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import moment from 'moment'
import vehicleIcon from "../../assets/images/vehicle.png"
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const VehicleTables = () => {
    const [vehicleDetailsList, setvehicleDetailsList] = useState([]);
    const [editvendorDetails, seteditvendorDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setsearch] = useState('');
    const [loader, setloader] = useState({
        open: false
    });
    const [vtDialog, setvtDialog] = useState({
        editopen: false,
        createopen: false,
        fullWidth: false,
        maxWidth: "ld"
    });
    const ParkingName = ({ description }) => (
        <MDBox lineHeight={1} textAlign="left">
            <MDTypography variant="caption">{description}</MDTypography>
        </MDBox>
    );

    const Time = ({ description }) => (
        <MDBox lineHeight={1} textAlign="left">
            <MDTypography variant="caption">{moment(description).format('DD-MM-YYYY, h:mm:ss a')}</MDTypography>
        </MDBox>
    );
    const VehicleNo = ({ image, name, mobileNo, description }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="sm" />
            <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                    {name}
                </MDTypography>
                <MDBox lineHeight={1} textAlign="left">
                    <MDTypography variant="caption">{mobileNo}</MDTypography>
                </MDBox>
            </MDBox>
        </MDBox>
    );

    var columns = [
        { Header: "Vehicle No", accessor: "Vehicle No", width: "10%", align: "left" },
        { Header: "Parking Name", accessor: "Parking Name", width: "10%", align: "center" },
        { Header: "Status", accessor: "Status", width: "10%", align: "center" },


        { Header: "Entry Time", accessor: "Entry Time", width: "10%", align: "center" },
        { Header: "Exit Time", accessor: "Exit Time", width: "10%", align: "center" },
        { Header: "Employee Name", accessor: "Employee Name", width: "10%", align: "center" },
    ]

    var rows = [];
    vehicleDetailsList && vehicleDetailsList.length > 0 && vehicleDetailsList.map((data, index) => {
        console.log("vehicleDetails", data)
        rows.push({
            "Vehicle No": <VehicleNo image={vehicleIcon} name={data.vehicleNo} mobileNo={data.mobileNo} style={{ fontSize: 'sm' }} />,
            "Parking Name": <ParkingName description={data.parkingName} />,
            "Status": (
                <MDBox ml={-1}>
                    <MDBadge badgeContent={data.exitTime ? "Exited" : "Parked"} color={data.exitTime ? "success" : "error"} variant="gradient" size="sm" />
                </MDBox>
            ),
            "Entry Time": <Time description={data.entryTime} />,
            "Exit Time": <Time description={data.exitTime} />,
            "Employee Name": <ParkingName description={data.employeeName} />,
        });

    });

    const token = localStorage.getItem("token");
    useEffect(() => {
        fetchData()
    }, []);


    const fetchData = async () => {
        try {
            setloader(true);
            var data = {
                "search": search,
                "parkingID": localStorage.getItem("parkingID"),
                "vendorID": ""
            }
            const response = await axios.post('https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/fetch-vehicle-list', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setvehicleDetailsList(response.data.vehicleDetailsList);
            console.log("res", response.data);
            setLoading(false);
            setloader(false);
        } catch (error) {
            setError(error);
            setLoading(false);
            setloader(false);
        }
    };


    const createNewVendor = () => {
        return (
            <>
                <div style={{ color: "grey", width: "100%" }}>Add New Vendor</div>
                <hr />
                <div style={{ display: "flex", width: "100%" }}>
                    <Typography>Vehicle No :</Typography>
                    <TextField
                        style={{ margin: "5%" }}
                        label="Parking Name"
                        id="outlined-size-small"
                        placeholder="Parking Name"
                        size="small"
                    />
                </div>
            </>);
    }
    return (
        <>
            {loader && loader.open && (<Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                }}
            >
                <CircularProgress />
            </Box>)
            }
            {vtDialog && (vtDialog.createopen || vtDialog.editopen) && <VendorDialog
                editopen={vtDialog.editopen}
                createopen={vtDialog.createopen}
                maxWidth={vtDialog.maxWidth}
                fullWidth={vtDialog.fullWidth}
                editvendorDetails={editvendorDetails}
                seteditvendorDetails={seteditvendorDetails}
                setvtDialog={setvtDialog}
                component={createNewVendor()}
                setloader={setloader}
                fetchData={fetchData}
            />

            }
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={5}>
                        <Grid item xs={13}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Vehicle Details
                                    </MDTypography>
                                    <div style={{ display: "flex" }}>
                                        <OutlinedInput
                                            id="outlined-adornment-weight"
                                            size="small"
                                            style={{ background: "#fff" }}
                                            endAdornment={<InputAdornment position="end"><ArrowRightAltIcon onClick={() => {
                                                fetchData()
                                            }} fontSize="medium" style={{ color: "blue", cursor: "pointer" }} /></InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'weight',
                                            }}
                                            onChange={(e) => {
                                                setsearch(e.target.value)
                                            }}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    console.log("pressedKey", e.key)
                                                    fetchData()
                                                }
                                            }}
                                        />

                                        <AddLocationIcon onClick={() => {
                                            setvtDialog(prevState => ({
                                                ...prevState,
                                                createopen: true
                                            }))
                                        }}
                                            color="white" fontSize="large"
                                            sx={{
                                                '&:hover': {
                                                    cursor: 'pointer',
                                                },
                                            }} />
                                    </div>


                                </MDBox>
                                <MDBox pt={3}>
                                    {loading ?
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                position: 'absolute',
                                                left: 0,
                                                right: 0,
                                                zIndex: 9999,
                                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                            }}
                                        >
                                            <CircularProgress sx={{ color: '#0066b2' }} />
                                        </Box> :
                                        <DataTable
                                            table={{ columns, rows }}
                                            isSorted={false}
                                            entriesPerPage={false}
                                            showTotalEntries={false}
                                            noEndBorder
                                        />
                                    }
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>


                </MDBox>
            </DashboardLayout>
        </>
    );
}

export default VehicleTables;