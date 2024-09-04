/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import parkey from "assets/images/onlpLogo.png";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

export default function data(props) {
    console.log("xxx",props)
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

  return {
    columns: [
      { Header: "Name", accessor: "Name", width: "10%", align: "left" },
      { Header: "location", accessor: "location",width: "10%", align: "left" },
      { Header: "status", accessor: "status",width: "10%", align: "center" },
      { Header: "totalSpace", accessor: "totalSpace", width: "10%",align: "center" },
      { Header: "availableSpace", accessor: "availableSpace",width: "10%", align: "center" },
      { Header: "tariffCharges", accessor: "tariffCharges",width: "10%", align: "center" },
      { Header: "tariffTime", accessor: "tariffTime",width: "10%", align: "center" },
      { Header: "action", accessor: "action",width: "10%", align: "center" },
    ],

    rows: [
      {
        Name: <Name image={parkey} name={props.parkingSpace.parkingName}/>,
        location: <Address description={props.parkingSpace.location} />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent={props.parkingSpace.parkingSpaceStatus} color={props.parkingSpace.parkingSpaceStatus==="Active"?"success":"error"} variant="gradient" size="sm" />
          </MDBox>
        ),
        totalSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
             {props.parkingSpace}
            </MDTypography>
          ), availableSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {props.parkingSpace}
            </MDTypography>
          ),
          tariffCharges: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
             {props.parkingSpace}
            </MDTypography>
          ),
          tariffTime: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              {props.parkingSpace}
            </MDTypography>
          ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        Name: <Name image={parkey} name="Railway"/>,
        location: <Address title="Manager" description="C V Raman Nagar, Bengaluru" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Inactive" color="error" variant="gradient" size="sm" />
          </MDBox>
        ),
        totalSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              100
            </MDTypography>
          ), availableSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              25
            </MDTypography>
          ),
          tariffCharges: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              30
            </MDTypography>
          ),
          tariffTime: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              6
            </MDTypography>
          ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        Name: <Name image={parkey} name="City Hospital"/>,
        location: <Address title="Manager" description="C V Raman Nagar, Bengaluru" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        totalSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              100
            </MDTypography>
          ), availableSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              25
            </MDTypography>
          ),
          tariffCharges: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              30
            </MDTypography>
          ),
          tariffTime: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              6
            </MDTypography>
          ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        Name: <Name image={parkey} name="Cant Station"/>,
        location: <Address title="Manager" description="C V Raman Nagar, Bengaluru" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        totalSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              100
            </MDTypography>
          ), availableSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              25
            </MDTypography>
          ),
          tariffCharges: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              30
            </MDTypography>
          ),
          tariffTime: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              6
            </MDTypography>
          ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        Name: <Name image={parkey} name="Net Plus"/>,
        location: <Address title="Manager" description="C V Raman Nagar, Bengaluru" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        totalSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              100
            </MDTypography>
          ), availableSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              25
            </MDTypography>
          ),
          tariffCharges: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              30
            </MDTypography>
          ),
          tariffTime: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              6
            </MDTypography>
          ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        Name: <Name image={parkey} name="Prime Park"/>,
        location: <Address title="Manager" description="C V Raman Nagar, Bengaluru" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Inprogress" color="alert" variant="gradient" size="sm" />
          </MDBox>
        ),
        totalSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              100
            </MDTypography>
          ), availableSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              25
            </MDTypography>
          ),
          tariffCharges: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              30
            </MDTypography>
          ),
          tariffTime: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              6
            </MDTypography>
          ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
      {
        Name: <Name image={parkey} name="Car by Car"/>,
        location: <Address title="Manager" description="C V Raman Nagar, Bengaluru" />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="Active" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        totalSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              100
            </MDTypography>
          ), availableSpace: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              25
            </MDTypography>
          ),
          tariffCharges: (
            <MDTypography component="a" href="#" variant="caption" color="success" fontWeight="medium">
              30
            </MDTypography>
          ),
          tariffTime: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              6
            </MDTypography>
          ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      },
     
    ],
  };
}
