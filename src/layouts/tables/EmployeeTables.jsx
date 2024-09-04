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
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import parkey from "assets/images/onlpLogo.png";
import MDBadge from "components/MDBadge";
import MDAvatar from "components/MDAvatar";
import { useEffect, useState } from "react";

import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

import apiService from "ApiServices/ApiService";
import axios from 'axios';
import ETDialog from "components/ETDialog/ETDialog";
import AddLocationIcon from '@mui/icons-material/AddLocation';

function EmployeeTables() {
    const [employeeDetails, setemployeeDetails] = useState(["1", "2", "3"]);
    const [loading, setLoading] = useState(true);
    const [loader, setloader] = useState({
        open: false
    });
    const [error, setError] = useState(null);
    const [editemployee, setEditemployee] = useState(null);
    const Name = ({ image, name, email }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="sm" />
            <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                    {name}
                </MDTypography>
            </MDBox>
        </MDBox>
    );
    const [etDialog, setetDialog] = useState({
        editopen:false,
        createopen: false,
        fullWidth: false,
        maxWidth: "ld"
    });
    const Address = ({ description }) => (
        <MDBox lineHeight={1} textAlign="left">
            <MDTypography variant="caption">{description}</MDTypography>
        </MDBox>
    );
    var columns = [
        { Header: "Name", accessor: "Name", width: "10%", align: "left" },
        { Header: "mobileNo", accessor: "mobileNo", width: "10%", align: "left" },
        { Header: "status", accessor: "status", width: "10%", align: "center" },
        { Header: "gender", accessor: "gender", width: "10%", align: "center" },
        { Header: "Joining Date", accessor: "doj", width: "10%", align: "center" },
        { Header: "Update Details", accessor: "action", width: "10%", align: "center" },
    ]

    var rows = [];
    employeeDetails && employeeDetails.map((data, index) => {
        rows.push({
            Name: <Name image={team2} name={data.employeeName} />,
            mobileNo: <Address description={data.mobileNo} />,
            status: (
                <MDBox ml={-1}>
                    <MDBadge badgeContent={data.employeeStatus} color={data.employeeStatus === "Active" ? "success" : "error"} variant="gradient" size="sm" />
                </MDBox>
            ),
            gender: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {data.gender}
                </MDTypography>
            ),
            doj: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {data.createdDate}
                </MDTypography>
            ),
            action: (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium"
                onClick={()=>{
                    setetDialog(prevState => ({
                        ...prevState,
                        editopen: true
                    }));
                    setEditemployee(employeeDetails[index]);
                }}>
                    Edit
                </MDTypography>
            ),
        })
    })


    const { columns: pColumns, rows: pRows } = projectsTableData();

    const createNewEmployee = () => {

    }
    useEffect(() => {
        fetchData()

    }, []);
    const token = localStorage.getItem("token");
    const vendorID = localStorage.getItem("vendorID");
    const fetchData = async () => {
        try {
            const response = await axios.get(`https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/vendor/fetch-all-employee/${vendorID}`, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            setemployeeDetails(response.data);
            setLoading(false);
            console.log("response", response.data);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    return (
        <>
            {etDialog && (etDialog.createopen || etDialog.editopen) && <ETDialog
                editopen={etDialog.editopen}
                createopen={etDialog.createopen}
                maxWidth={etDialog.maxWidth}
                fullWidth={etDialog.fullWidth}
                setetDialog={setetDialog}
                component={createNewEmployee()}
                employeeDetails={employeeDetails}
                setEditemployee={setEditemployee}
                editemployee={editemployee}
                fetchData={fetchData}
                setloader={setloader}
            />
            }
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
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
                                        Employees Details
                                    </MDTypography>
                                    <AddLocationIcon onClick={() => {
                                        setetDialog(prevState => ({
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
                                                // height: '100vh',
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
                                        />}
                                </MDBox>
                            </Card>
                        </Grid>

                    </Grid>
                </MDBox>
                {/* <div style={{ position: "fixed", bottom: "0", width: "80%", zIndex: "100", marginBottom: "1%" }}>
                    <Footer />
                </div> */}
            </DashboardLayout>
        </>
    );
}


export default EmployeeTables