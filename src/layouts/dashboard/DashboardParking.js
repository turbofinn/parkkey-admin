import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import LoactionMap from "components/TFMaps/LoactionMap";
import MapCard from "examples/Cards/MapCard";
import { useEffect, useState } from "react";
import axios from "axios";
import ParkingTableList from "layouts/tables/ParkingTableList";
import VehicleTableList from "layouts/tables/VehicleTableList";
import RevenueStatisticsCard from "examples/Cards/StatisticsCards/RevenueStatisticsCard";

function DashboardParking() {
  const { sales, tasks } = reportsLineChartData;
  const [data, setdata] = useState({});

  useEffect(() => {
    fetchData()
}, []);

const token = localStorage.getItem("token");
const parkingID = localStorage.getItem("parkingID");
const fetchData = async () => {

  const requestedData = {

    vendorID: "",
    parkingSpaceID: parkingID,
    employeeID: ""

  }

    try {
        const response = await axios.post(`https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/fetch-analytics-for-admin`,requestedData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setdata(response.data)
        console.log(response)
    } catch (error) {
    }
};

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Total Bookings"
                count={data.currentMonthBookings}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Today's Booking"
                count={data.todaysBookings}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Monthly Revenue"
                count={data.currentMonthRevenue}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
            <RevenueStatisticsCard
                color="primary"
                icon="person_add"
                title="Today's Rvvenue"
                totalRevenue={data.todaysRevenue}
                cash={data.todaysRevenueCash}
                online={data.todaysRevenueWallet}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      
        <VehicleTableList/>
    
    
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DashboardParking;
