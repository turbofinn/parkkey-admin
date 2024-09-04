/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
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
import { useState } from "react";



function Tables() {
  const [parkingDetailsList, setparkingDetailsList] = useState(["1","2","3"]);

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
  
const Address = ({description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );
var columns = [
  { Header: "Name", accessor: "Name", width: "10%", align: "left" },
  { Header: "location", accessor: "location",width: "10%", align: "left" },
  { Header: "status", accessor: "status",width: "10%", align: "center" },
  { Header: "totalSpace", accessor: "totalSpace", width: "10%",align: "center" },
  { Header: "availableSpace", accessor: "availableSpace",width: "10%", align: "center" },
  { Header: "tariffCharges", accessor: "tariffCharges",width: "10%", align: "center" },
  { Header: "tariffTime", accessor: "tariffTime",width: "10%", align: "center" },
  { Header: "action", accessor: "action",width: "10%", align: "center" },
]

var rows = [  ];
parkingDetailsList && parkingDetailsList.map((data,index)=>{
rows.push( {
  Name: <Name image={parkey} name={"kissssssk"}/>,
  location: <Address description={"cdcd"} />,
  status: (
    <MDBox ml={-1}>
      <MDBadge badgeContent={"dccd"} color={"dcdcs"==="Active"?"success":"error"} variant="gradient" size="sm" />
    </MDBox>
  ),
  totalSpace: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
       {"props.parkingSpace"}
      </MDTypography>
    ), availableSpace: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    {"props.parkingSpace"}
      </MDTypography>
    ),
    tariffCharges: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
       {"props.parkingSpace"}
      </MDTypography>
    ),
    tariffTime: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {"props.parkingSpace"}
      </MDTypography>
    ),
  action: (
    <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
      Edit
    </MDTypography>
  ),
})
})


  const { columns: pColumns, rows: pRows } = projectsTableData();

  return (
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
              >
                <MDTypography variant="h6" color="white">
                Employees Details
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
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
              >
                <MDTypography variant="h6" color="white">
                  Projects Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
