import DashboardAdmin from "layouts/dashboard/DashboardAdmin";
import DashboardVendor from "layouts/dashboard/DashboardVendor";
import ParkingTables from "layouts/tables/ParkingTables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import VendorTables from "layouts/tables/VendorTables";
// @mui icons
import Icon from "@mui/material/Icon";
import EmployeeTables from "layouts/tables/EmployeeTables";
import VehicleTables from "layouts/tables/VehicleTables";
import CarRepairIcon from '@mui/icons-material/CarRepair';
import DashboardParking from "layouts/dashboard/DashboardParking";
import DashboardEmployee from "layouts/dashboard/DashboardEmployee";
import ParkingTableList from "layouts/tables/ParkingTableList";
// import Test from "components/Test";
const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <DashboardAdmin />,
    role: ["Admin"],
    showInSideBar: true
  },
  {
    type: "collapse",
    name: "Dashboard Vendor",
    key: "dashboard-vendor",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard-vendor",
    component: <DashboardVendor />,
    role: ["Admin"],
    showInSideBar: false
  },
  {
    type: "collapse",
    name: "Dashboard Parking",
    key: "dashboard-parking",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard-parking",
    component: <DashboardParking />,
    role: ["Admin"],
    showInSideBar: false
  },
  {
    type: "collapse",
    name: "Dashboard Employee",
    key: "dashboard-employee",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard-employee",
    component: <DashboardEmployee />,
    role: ["Admin"],
    showInSideBar: false
  },
  {
    type: "collapse",
    name: "Employees",
    key: "Employees",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/Employees",
    component: <EmployeeTables />,
    role: ["Admin"],
    showInSideBar: true
  },
  {
    type: "collapse",
    name: "Parkings",
    key: "Parkings",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/Parkings",
    component: <ParkingTables />,
    role: ["Admin"],
    showInSideBar: true
  },
  {
    type: "collapse",
    name: "Vendors",
    key: "Vendors",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/Vendors",
    component: <VendorTables />,
    role: ["Admin"],
    showInSideBar: true
  },
  {
    type: "collapse",
    name: "Vehicles",
    key: "Vehicles",
    icon: <CarRepairIcon />,
    route: "/Vehicles",
    component: <VehicleTables />,
    role: ["Admin"],
    showInSideBar: false
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
    role: []
  },
  // {
  //   type: "collapse",
  //   name: "Test",
  //   key: "Test",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/test",
  //   component: <Test />,
  //   role: []
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    role: []
  },
  // {
  //   type: "collapse",
  //   name: "Sign In",
  //   key: "sign-in",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/authentication/sign-in",
  //   component: <SignIn />,
  //   role: []
  // },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  //   role: []
  // },
];


export default routes;
