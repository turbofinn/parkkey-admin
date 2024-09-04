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

import { useState, useEffect } from "react";
import axios from "axios";
// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CircularProgress from '@mui/material/CircularProgress';
// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/parking.png";
import parkkey from "assets/images/parkkey.png";
import { Button, Typography } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import SuccessDialog from "components/SuccessDialog/SuccessDialog";
import Stack from '@mui/material/Stack';
import ErrorDialog from "components/ErrorDialog/ErrorDialog";
// import Switch from '@mui/material/Switch';

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [mobile, setMobile] = useState('');
  const [OTP, setOTP] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const [checked, setChecked] = useState(true);
  const [errorchecked, setErrorcheck] = useState({
    open: false,
    close: true,
    message: ''
  });

  const handleChange = (event) => {
    setChecked(event.target.checked);
    // console.log(event.target.checked);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const sendOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/login-service/send-otp',
        { mobileNo: mobile },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJncmFudF90eXBlIjoiYXV0aG9yaXphdGlvbi10b2tlbiIsInVzZXJUeXBlIjoiVkVORE9SIiwiaXNzIjoiUGFya2tleSIsInN1YiI6ImI5MDI0YTIxLWM4ZjktNDJkMC1hOTNhLWNmODc5NGRhNGQzNyIsImp0aSI6IjRmMTViNTIwLWUyNzktNGU5MS05ODUwLWI5OGFkMmU3MTU0MiIsImlhdCI6MTcxNTA1MDI0MiwiZXhwIjoyMDMwNDEwMjQyfQ.2Vamt4FXCMT25aZxwvAaOybzKYfCn18R3JIYahUp4tE'
          }
        }
      ).then((res) => {
        console.log("res", res);
        handleClick();
        setLoading(false);
      });
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data && error.response.data.message === "Invalid Mobile No.") {
        setErrorcheck(prevState => ({
          ...prevState,
          open: true,
          message: "Invalid Mobile No."
        }));

      }
    } finally {
      setLoading(false);
    }
  }

  const verifyOTP = async () => {
    if (checked) {
      try {
        setLoading(true);
        const response = await axios.post(
          'https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/login-service/verify-otp/vendor',
          {
            mobileNo: mobile,
            otp: OTP
          }
        ).then((res) => {
          if (res.data.status.code === 1001) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("refresh_token", res.data.refreshToken);
            localStorage.setItem("vendorID", res.data.vendor.vendorID);
            Navigate("/dashboard");
          } else {
            Navigate("/authentication/sign-in");
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Error:', error);
        if (error.response && error.response.data && error.response.data.message === "No vendor found in the system with this number.") {
          setErrorcheck(prevState => ({
            ...prevState,
            open: true,
            message: "No vendor found in the system with this number."
          }))
        }else if (error.response && error.response.data && error.response.data.message === "Invalid OTP."){
          setErrorcheck(prevState => ({
            ...prevState,
            open: true,
            message: "Invalid OTP"
          }))
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await axios.post(
          'https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/login-service/verify-otp/admin',
          {
            mobileNo: mobile,
            otp: OTP
          }
        ).then((res) => {
          if (res.data.status.code === 1001) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("refresh_token", res.data.refreshToken);
            localStorage.setItem("adminID", res.data.admin.adminID);
            Navigate("/dashboard");
          } else {
            Navigate("/authentication/sign-in");
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Error:', error);
        if (error.response && error.response.data && error.response.data.message === "No admin found in the system with this number.") {
          setErrorcheck(prevState => ({
            ...prevState,
            open: true,
            message: "No admin found in the system with this number."
          }))
        } else if (error.response && error.response.data && error.response.data.message === "Invalid OTP."){
          setErrorcheck(prevState => ({
            ...prevState,
            open: true,
            message: "Invalid OTP"
          }))
        }
      } finally {
        setLoading(false);
      }
    }

  }
  useEffect(() => {
    if (mobile.length == 10) {
      sendOTP();
    }
  }, [mobile]);
  return (
    <BasicLayout image={bgImage}>
      {
        errorchecked.open && (<ErrorDialog message={errorchecked.message} setErrorcheck={setErrorcheck}
          errorchecked={errorchecked} />)
      }
      <Card>
        <MDBox
          variant="gradient"
          bgColor="#fff"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          {/* <SuccessDialog/> */}
          <Snackbar open={open} autoHideDuration={8000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: '100%' }}
            >
              OTP send to your Mobile No. successfully
            </Alert>
          </Snackbar>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <img src={parkkey} style={{ width: "25%", marginLeft: "5%" }} ></img>
          </Grid>
          <Typography variant="h4" fontWeight="medium" color="#0f7002" mt={1}>
            Sign in
          </Typography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">


            <MDBox mb={2}>
              <MDInput type="Mobile No" inputProps={{ maxLength: 10 }} label="Mobile No" fullWidth
                onChange={(e) => { setMobile(e.target.value) }}
                value={mobile} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="OTP" inputProps={{ maxLength: 4 }} label="OTP" fullWidth
                onChange={(e) => { setOTP(e.target.value) }} />
            </MDBox>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography style={{ fontSize: "16px", color: "blue" }}>Admin</Typography>
              <Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
                color="blue"
              />
              <Typography style={{ fontSize: "16px", color: "green" }}>Vendor</Typography>
            </Stack>



            <MDBox mt={4} mb={1}>
              <Button style={{ color: "#fff", background: "#0f7002", cursor: "pointer" }} fullWidth
                onClick={verifyOTP}>
                {loading ?
                  <CircularProgress style={{ color: "#fff" }} size="30px" />
                  :
                  <p>Verify OTP</p>
                }
              </Button>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
