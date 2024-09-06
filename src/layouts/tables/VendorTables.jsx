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
import { Button, TextField, Typography } from "@mui/material";
import { TextFields } from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";


const VendorTables = () => {

    const navigate = useNavigate();
    const [vendorDetailsList, setvendorDetailsList] = useState([]);
    const [editvendorDetails, seteditvendorDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loader, setloader] = useState({
        open: false
    });

    const [vtDialog, setvtDialog] = useState({
        editopen: false,
        createopen: false,
        fullWidth: false,
        maxWidth: "ld"
    });

    const Address = ({ description }) => (
        <MDBox lineHeight={1} textAlign="left">
            <MDTypography variant="caption">{description}</MDTypography>
        </MDBox>
    );

    const Name = ({ image, name, email, description }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="sm" />
            <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                    {name}
                </MDTypography>
                <MDBox lineHeight={1} textAlign="left">
                    <MDTypography variant="caption">{description}</MDTypography>
                </MDBox>
            </MDBox>
        </MDBox>
    );

    var columns = [
        { Header: "Name", accessor: "Name", width: "10%", align: "left" },
        { Header: "status", accessor: "status", width: "10%", align: "center" },
        { Header: "Mobile No", accessor: "mobileNo", width: "10%", align: "center" },
        { Header: "action", accessor: "action", width: "10%", align: "center" },
    ]

    var rows = [];
    vendorDetailsList && vendorDetailsList.length > 0 && vendorDetailsList.map((data, index) => {
        console.log("data", data)
        rows.push({
            Name:
                <Button
                    onClick={() => {

                        localStorage.setItem("vendorID", data.vendorID);
                        navigate("/dashboard-vendor");

                    }}
                    variant='text' style={{ margin: "0", padding: "0", textTransform: "none", fontWeight: "400", fontSize: "0.7rem" }}>
                    <Name image={parkey} name={data.vendorName} style={{ fontSize: 'sm' }} />
                </Button>

            ,
            mobileNo: <Address description={data.mobileNo} />,

            action: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium"
                    onClick={() => {
                        setvtDialog(prevState => ({
                            ...prevState,
                            editopen: true
                        }));
                        seteditvendorDetails(vendorDetailsList[index]);
                        console.log("details", vendorDetailsList[index]);
                    }} >
                    Edit
                </MDTypography>
            ),
            status: (
                <MDBox ml={-1}>
                    <MDBadge badgeContent={data.vendorStatus} color={data.vendorStatus === "Active" ? "success" : "error"} variant="gradient" size="sm" />
                </MDBox>
            ),
        });

    });

    const token = localStorage.getItem("token");
    useEffect(() => {
        fetchData()
    }, []);


    const fetchData = async () => {
        try {
            setloader(true);
            const response = await axios.get('https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/vendor/fetch-all-vendors', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setvendorDetailsList(response.data);
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
                    <Typography>Name :</Typography>
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
                                        Vendor Details
                                    </MDTypography>

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

export default VendorTables;