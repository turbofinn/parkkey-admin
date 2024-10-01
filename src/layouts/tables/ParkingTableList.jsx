
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
import TFDialog from "components/TFDialog/TFDialog";
import { Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";
import { TextFields } from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";

function ParkingTableList() {
    const navigate = useNavigate();
    const [parkingDetailsList, setparkingDetailsList] = useState([]);
    const [editparkingDetails, seteditparkingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loader, setloader] = useState({
        open: false
    });
    const [tfDialog, settfDialog] = useState({

        editopen: false,
        createopen: false,
        fullWidth: false,
        maxWidth: "ld"

    });
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const Name = ({ image, name, email, description }) => (
        <MDBox display="flex" textAlign="start" lineHeight={1}>
            <MDAvatar src={image} name={name} size="sm" />
            <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                    {name}
                </MDTypography>
                <MDBox lineHeight={1} textAlign="left">
                    <MDTypography variant="caption" sx={{
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>{description && description.length > 15 ? `${description.slice(0, 20)}...` : description}</MDTypography>
                </MDBox>
            </MDBox>
        </MDBox>

    );

    // const Address = ({ description }) => (

    // );
    var columns = [
        { Header: "Name", accessor: "Name", width: "10%", align: "left" },
        { Header: "status", accessor: "status", width: "10%", align: "center" },
        { Header: "totalSpace", accessor: "totalSpace", width: "10%", align: "center" },
        { Header: "availableSpace", accessor: "availableSpace", width: "10%", align: "center" },
        { Header: "tariffCharges", accessor: "tariffCharges", width: "10%", align: "center" },
        { Header: "action", accessor: "action", width: "10%", align: "center" },
    ]

    var rows = [];
    parkingDetailsList && parkingDetailsList.length > 0 && parkingDetailsList.map((data, index) => {
        console.log("data", data)
        rows.push({

            Name:
                <Button
                    onClick={() => {
                        localStorage.setItem("parkingID", data.parkingSpaceID)
                        navigate("/dashboard-parking");
                    }}
                    variant='text' style={{ margin: "0", padding: "0", textTransform: "none", fontWeight: "400", fontSize: "0.7rem" }}>
                    <Name image={parkey} name={data.parkingName} description={data.location} style={{ fontSize: 'sm' }} />
                </Button>
            ,
            // location: <Address  />,
            status: (
                <MDBox ml={-1}>
                    <MDBadge badgeContent={data.parkingSpaceStatus} color={data.parkingSpaceStatus === "Active" ? "success" : "error"} variant="gradient" size="sm" />
                </MDBox>
            ),
            totalSpace: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {data.totalSpace}
                </MDTypography>
            ),
            availableSpace: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {data.availableSpace}
                </MDTypography>
            ),
            tariffCharges: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">

                    <Box
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        sx={{
                            transition: '0.3s',
                            width: 'fit-content',

                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '0.8rem',
                            }}
                        >
                            charges
                        </Typography>

                        <Table
                            sx={{
                                display: hoveredIndex === index ? 'block' : 'none',
                                position: 'absolute',
                                top: '50%',
                                left: '70%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: '#fff',
                                zIndex: 1,
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                maxWidth: '22vw',
                                padding: '10px',
                            }}
                        >
                            <TableRow>
                                <TableCell sx={{ fontSize: '0.8rem', textAlign: 'center' }}>
                                    Start Time
                                </TableCell>
                                <TableCell sx={{ fontSize: '0.8rem', textAlign: 'center' }}>
                                    End Time
                                </TableCell>
                                <TableCell sx={{ fontSize: '0.8rem', textAlign: 'center' }}>
                                    Charges
                                </TableCell>
                            </TableRow>
                            {data && data.charges && data.charges.tariffRate ? (
                                JSON.parse(data.charges.tariffRate).map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ fontSize: '0.8rem', textAlign: 'center' }}>
                                            {item.startTime}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.8rem', textAlign: 'center' }}>
                                            {item.endTime}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.8rem', textAlign: 'center' }}>
                                            {item.charges}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Typography variant="body2" align="center">
                                            No Data Available
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </Table>

                    </Box>

                </MDTypography>
            ),
            action: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium"
                    onClick={() => {
                        settfDialog(prevState => ({
                            ...prevState,
                            editopen: true
                        }));
                        seteditparkingDetails(parkingDetailsList[index]);
                        console.log("details", parkingDetailsList[index]);
                    }} >
                    Edit
                </MDTypography>
            ),
        })
    })

    useEffect(() => {
        fetchData()
    }, []);

    const token = localStorage.getItem("token");
    const vendorID = localStorage.getItem("vendorID");
    const fetchData = async () => {
        try {
            setloader(true);
            const response = await axios.get(`https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/vendor/fetch-all-parking-space/${vendorID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setparkingDetailsList(response.data);
            setLoading(false);
            setloader(false);
        } catch (error) {
            setError(error);
            setLoading(false);
            setloader(false);
        }
    };

    const createNewParking = () => {
        return (<>

            <div style={{ color: "grey", width: "100%" }}>Add New Parking</div>
            <hr />
            <div style={{ display: "flex", width: "100%" }}>
                <Typography>Name :</Typography>
                <TextField
                    style={{ margin: "5%" }}
                    label="Parking Name"
                    id="outlined-size-small"
                    placeholder="Parking Name"
                    size="small"
                />
            </div>
        </>)
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
            {tfDialog && (tfDialog.createopen || tfDialog.editopen) && <TFDialog
                editopen={tfDialog.editopen}
                createopen={tfDialog.createopen}
                maxWidth={tfDialog.maxWidth}
                fullWidth={tfDialog.fullWidth}
                editparkingDetails={editparkingDetails}
                seteditparkingDetails={seteditparkingDetails}
                settfDialog={settfDialog}
                component={createNewParking()}
                setloader={setloader}
                fetchData={fetchData}
            />

            }


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
                                    Parking Details
                                </MDTypography>

                                <AddLocationIcon onClick={() => {
                                    settfDialog(prevState => ({
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

        </>
    );
}


export default ParkingTableList