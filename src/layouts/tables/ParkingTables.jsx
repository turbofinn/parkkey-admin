"use client"

import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"

// Material Dashboard 2 React components
import MDBox from "components/MDBox"
import MDTypography from "components/MDTypography"

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"
import DataTable from "examples/Tables/DataTable"

import parkey from "assets/images/onlpLogo.png"
import MDBadge from "components/MDBadge"
import MDAvatar from "components/MDAvatar"
import { useEffect, useState } from "react"
import axios from "axios"
import AddLocationIcon from "@mui/icons-material/AddLocation"
import TFDialog from "components/TFDialog/TFDialog"
import { Button, TextField, Typography, Dialog, DialogContent } from "@mui/material"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"
import { useNavigate } from "react-router-dom"
import InfoIcon from "@mui/icons-material/Info"

function ParkingTables() {
  const navigate = useNavigate()
  const [parkingDetailsList, setparkingDetailsList] = useState([])
  const [editparkingDetails, seteditparkingDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loader, setloader] = useState({
    open: false,
  })
  const [tfDialog, settfDialog] = useState({
    editopen: false,
    createopen: false,
    fullWidth: false,
    maxWidth: "ld",
  })

  const [hoveredIndex, setHoveredIndex] = useState(null)

  const [open, setOpen] = useState(false)

  const handleMouseEnter = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [tariffDialogOpen, setTariffDialogOpen] = useState(false)
  const [currentTariffData, setCurrentTariffData] = useState(null)
  const [currentParkingName, setCurrentParkingName] = useState("")

  const handleOpenTariffDialog = (tariffRateString, parkingName) => {
    try {
      if (tariffRateString) {
        const parsedData = JSON.parse(tariffRateString)
        setCurrentTariffData(parsedData)
        setCurrentParkingName(parkingName)
        setTariffDialogOpen(true)
      } else {
        setCurrentTariffData(null)
        setCurrentParkingName(parkingName)
        setTariffDialogOpen(true)
      }
    } catch (error) {
      console.error("Error parsing tariff data:", error)
      setCurrentTariffData(null)
      setCurrentParkingName(parkingName)
      setTariffDialogOpen(true)
    }
  }

  const handleCloseTariffDialog = () => {
    setTariffDialogOpen(false)
  }

  const Name = ({ image, name, email, description }) => (
    <MDBox display="flex" textAlign="left" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDBox lineHeight={1}>
          <MDTypography
            variant="caption"
            sx={{
              cursor: "pointer",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            onMouseEnter={handleMouseEnter}
          >
            {description && description.length > 10 ? `${description.slice(0, 15)}...` : description}
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  )

  // const Address = ({ description }) => (

  // );
  var columns = [
    { Header: "Name", accessor: "Name", width: "10%", align: "left" },
    // { Header: "location", accessor: "location", width: "10%", align: "left" },
    { Header: "status", accessor: "status", width: "10%", align: "center" },
    { Header: "totalSpace", accessor: "totalSpace", width: "10%", align: "center" },
    { Header: "availableSpace", accessor: "availableSpace", width: "10%", align: "center" },
    { Header: "tariffCharges", accessor: "tariffCharges", width: "10%", align: "center" },
    { Header: "action", accessor: "action", width: "10%", align: "center" },
  ]

  var rows = []
  parkingDetailsList &&
    parkingDetailsList.length > 0 &&
    parkingDetailsList.map((data, index) => {
      console.log("data", data)
      rows.push({
        Name: (
          <Button
            onClick={() => {
              localStorage.setItem("parkingID", data.parkingSpaceID)
              navigate("/Vehicles")
            }}
            variant="text"
            style={{ margin: "0", padding: "0", textTransform: "none", fontWeight: "400", fontSize: "0.7rem" }}
          >
            <Name image={parkey} name={data.parkingName} description={data.location} style={{ fontSize: "sm" }} />
          </Button>
        ),
        // location: <Address  />,
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent={data.parkingSpaceStatus}
              color={data.parkingSpaceStatus === "Active" ? "success" : "error"}
              variant="gradient"
              size="sm"
            />
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "0.8rem" }}>charges</Typography>
              <InfoIcon
                sx={{
                  fontSize: "0.9rem",
                  color: "info.main",
                  cursor: "pointer",
                  "&:hover": {
                    color: "info.dark",
                  },
                }}
                onClick={() => handleOpenTariffDialog(data.charges?.tariffRate, data.parkingName)}
              />
            </Box>
          </MDTypography>
        ),
        action: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            onClick={() => {
              settfDialog((prevState) => ({
                ...prevState,
                editopen: true,
              }))
              seteditparkingDetails(parkingDetailsList[index])
              console.log("details", parkingDetailsList[index])
            }}
          >
            Edit
          </MDTypography>
        ),
      })
    })

  useEffect(() => {
    fetchData()
  }, [])

  const token = localStorage.getItem("token")
  const vendorID = localStorage.getItem("vendorID")
  const fetchData = async () => {
    try {
      setloader(true)
      const response = await axios.get(
        `https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/vendor/fetch-all-parking-space/${vendorID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setparkingDetailsList(response.data)
      setLoading(false)
      setloader(false)
    } catch (error) {
      setError(error)
      setLoading(false)
      setloader(false)
    }
  }

  const createNewParking = () => {
    return (
      <>
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
      </>
    )
  }

  const TariffDialog = () => {
    return (
      <Dialog
        open={tariffDialogOpen}
        onClose={handleCloseTariffDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "4px",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f7f7f7",
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Tariff Charges for {currentParkingName}
          </Typography>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          {currentTariffData ? (
            Object.keys(currentTariffData).map((vehicleType) => (
              <Box key={vehicleType} sx={{ mb: 0 }}>
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    backgroundColor: "#f7f7f7",
                    borderBottom: "1px solid #e0e0e0",
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Vehicle Type: {vehicleType}
                  </Typography>
                </Box>

                {/* Custom table with fixed layout */}
                <Box sx={{ px: 3, py: 1 }}>
                  {/* Table header */}
                  <Box
                    sx={{
                      display: "flex",
                      borderBottom: "1px solid #e0e0e0",
                      py: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        width: "33%",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      Start Time (hours)
                    </Typography>
                    <Typography
                      sx={{
                        width: "33%",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        textAlign: "center",
                      }}
                    >
                      End Time (hours)
                    </Typography>
                    <Typography
                      sx={{
                        width: "33%",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        textAlign: "right",
                      }}
                    >
                      Charges
                    </Typography>
                  </Box>

                  {/* Table rows */}
                  {currentTariffData[vehicleType].periods.map((period, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        borderBottom:
                          idx < currentTariffData[vehicleType].periods.length - 1 ? "1px solid #f0f0f0" : "none",
                        py: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          width: "33%",
                          fontSize: "0.875rem",
                        }}
                      >
                        {period.startTime || "-"}
                      </Typography>
                      <Typography
                        sx={{
                          width: "33%",
                          fontSize: "0.875rem",
                          textAlign: "center",
                        }}
                      >
                        {period.endTime || "-"}
                      </Typography>
                      <Typography
                        sx={{
                          width: "33%",
                          fontSize: "0.875rem",
                          textAlign: "right",
                        }}
                      >
                        {period.charges || "-"}
                      </Typography>
                    </Box>
                  ))}

                  {/* Cyclic charge */}
                  <Box
                    sx={{
                      pt: 2,
                      pb: 1.5,
                      borderTop: "1px solid #e0e0e0",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Cyclic Charge: {currentTariffData[vehicleType].cyclicCharge || "-"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body1" align="center" sx={{ py: 3 }}>
              No tariff data available
            </Typography>
          )}
        </DialogContent>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #e0e0e0",
            p: 2,
          }}
        >
          <Button
            onClick={handleCloseTariffDialog}
            variant="contained"
            style={{
              color: "white",
              backgroundColor: "#007FFF",
              borderRadius: "4px",
              padding: "8px 20px",
              boxShadow: "0 2px 4px rgba(0,127,255,0.2)",
              fontWeight: "medium",
            }}
          >
            Close
          </Button>
        </Box>
      </Dialog>
    )
  }

  return (
    <>
      {loader && loader.open && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {tfDialog && (tfDialog.createopen || tfDialog.editopen) && (
        <TFDialog
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
      )}
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
                    Parking Details
                  </MDTypography>

                  <AddLocationIcon
                    onClick={() => {
                      settfDialog((prevState) => ({
                        ...prevState,
                        createopen: true,
                      }))
                    }}
                    color="white"
                    fontSize="large"
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  />
                </MDBox>
                <MDBox pt={3}>
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        backgroundColor: "rgba(0, 0, 0, 0)",
                      }}
                    >
                      <CircularProgress sx={{ color: "#0066b2" }} />
                    </Box>
                  ) : (
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  )}
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <TariffDialog />
      </DashboardLayout>
    </>
  )
}

export default ParkingTables

