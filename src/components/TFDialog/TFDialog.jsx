"use client"

import * as React from "react"
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  TextField,
  Typography,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import ErrorDialog from "components/ErrorDialog/ErrorDialog"
import Test from "../Test"

const containerStyle = { width: "40%", height: "100px" }
const center = { lat: 37.7749, lng: -122.4194 } // Default to San Francisco

export default function MaxWidthDialog(props) {
  const [open, setOpen] = React.useState(false)
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState("sm") // Reduced width
  const matches = useMediaQuery("(max-width:600px)")

  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [vehicle, setVehicle] = useState([])
  const [TotalSpace, setTotalSpace] = useState(0)
  const [AvailableSpace, setAvailableSpace] = useState(0)
  const [Longitude, setLongitude] = useState("")
  const [Latitude, setLatitude] = useState("")
  const [TariffTime, setTariffTime] = useState(0)
  const [TariffCharge, setTariffCharge] = useState(0)
  const [Rating, setRating] = useState(0)
  const [Review, setReview] = useState("")
  const [openChargesDialog, setOpenChargesDialog] = useState(false)
  const [openAddressDialog, setOpenAddressDialog] = useState(false)
  const [parkingAddress, setParkingAddress] = useState("")
  const [coordinates, setCoordinates] = useState(center)
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [cyclicCharges, setCyclicCharges] = useState({})
  const [parkingImages, setParkingImages] = useState([]) // State for parking images

  const [errorchecked, setErrorcheck] = useState({ open: false, close: true, message: "" })

  const [selectedTab, setSelectedTab] = useState(0)
  const [tariffCharges, setTariffCharges] = useState({})
  const [isUploading, setIsUploading] = useState(false)
  const [tariffChargeDisplay, setTariffChargeDisplay] = useState("")

  useEffect(() => {
    const newTariffCharges = { ...tariffCharges }
    Object.keys(newTariffCharges).forEach((vehicleType) => {
      // Ensure newTariffCharges[vehicleType] is an array
      if (!Array.isArray(newTariffCharges[vehicleType])) {
        newTariffCharges[vehicleType] = []
      }

      newTariffCharges[vehicleType].forEach((period, idx) => {
        if (idx > 0) {
          period.startTime = newTariffCharges[vehicleType][idx - 1].endTime
        }
      })
    })
    setTariffCharges(newTariffCharges)
  }, [tariffCharges])

  useEffect(() => {
    if (props && props.editparkingDetails !== null) {
      const details = props.editparkingDetails
      setVehicle(details.vehicleType)
      setName(details.parkingName)
      setParkingAddress(details.location)
      setLocation(details.location)
      setTotalSpace(details.totalSpace)
      setAvailableSpace(details.availableSpace)
      setLongitude(details.longitude)
      setLatitude(details.latitude)

      // Parse and set tariff charges
      if (details.charges && details.charges.tariffRate) {
        try {
          const tariff = JSON.parse(details.charges.tariffRate)
          const newTariffCharges = {}

          // Ensure each vehicle type has a valid periods array
          details.vehicleType.forEach((vehicleType) => {
            if (tariff[vehicleType] && Array.isArray(tariff[vehicleType].periods)) {
              newTariffCharges[vehicleType] = tariff[vehicleType].periods
            } else {
              // Fallback to default periods if data is missing or invalid
              newTariffCharges[vehicleType] = [
                { startTime: "", endTime: "", charges: "" },
                { startTime: "", endTime: "", charges: "" },
                { startTime: "", endTime: "", charges: "" },
                { startTime: "", endTime: "", charges: "" },
              ]
            }
          })

          setTariffCharges(newTariffCharges)

          // Extract cyclic charges from the parsed tariff data
          const cyclicChargesData = {}
          Object.keys(tariff).forEach((vehicleType) => {
            if (tariff[vehicleType] && tariff[vehicleType].cyclicCharge) {
              cyclicChargesData[vehicleType] = tariff[vehicleType].cyclicCharge
            }
          })
          setCyclicCharges(cyclicChargesData)
        } catch (error) {
          console.error("Error parsing tariff data:", error)
          setTariffCharges({})
          setCyclicCharges({})
        }
      } else {
        setTariffCharges({})
        setCyclicCharges({})
      }

      setRating(details.rating)
      setReview(details.review)

      // Set address field explicitly
      setAddress(details.address)

      // Set parking images if they exist
      if (details.parkingImages) {
        try {
          const parsedImages = JSON.parse(details.parkingImages)
          console.log("Parsed Images:", parsedImages) // Debug parsed images
          setParkingImages(Array.isArray(parsedImages) ? parsedImages : [])
        } catch (error) {
          console.error("Error parsing parking images:", error)
          setParkingImages([])
        }
      } else {
        console.log("No parkingImages field in the response")
        setParkingImages([])
      }
    } else {
      // Initialize empty tariff charges for new entries
      const newTariffCharges = {}
      vehicle.forEach((vehicleType) => {
        newTariffCharges[vehicleType] = [
          { startTime: "", endTime: "", charges: "" },
          { startTime: "", endTime: "", charges: "" },
          { startTime: "", endTime: "", charges: "" },
          { startTime: "", endTime: "", charges: "" },
        ]
      })
      setTariffCharges(newTariffCharges)
      setParkingImages([]) // Reset images when creating a new parking
    }
  }, [props])

  const url = "https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/parking-space-onboarding"
  const token = localStorage.getItem("token")
  const vendorID = localStorage.getItem("vendorID")
  const names = ["Heavy", "Bike", "Car", "Truck", "Bus"]

  const handleClose = () => {
    props.settfDialog((prevState) => ({ ...prevState, createopen: false, editopen: false }))
    props.seteditparkingDetails(() => null)
  }

  const handleCloseCharges = () => setOpenChargesDialog(false)
  const handleCloseAddress = () => setOpenAddressDialog(false)

  const handleLoader = () => props.setloader((prevState) => ({ ...prevState, open: true }))
  const handleLoaderfalse = () => props.setloader((prevState) => ({ ...prevState, open: false }))

  const handleVehicleChange = (e) => {
    const selectedVehicles = e.target.value
    setVehicle(selectedVehicles)
    const newTariffCharges = { ...tariffCharges }
    selectedVehicles.forEach((vehicleType) => {
      if (!newTariffCharges[vehicleType]) {
        newTariffCharges[vehicleType] = [
          { startTime: "", endTime: "", charges: "" },
          { startTime: "", endTime: "", charges: "" },
          { startTime: "", endTime: "", charges: "" },
          { startTime: "", endTime: "", charges: "" },
        ]
      }
    })
    setTariffCharges(newTariffCharges)
  }

  const fetchPresignedUrl = async (file) => {
    const token = localStorage.getItem("token")
    const requestData = {
      type: "PARKING_IMAGE",
      mimeType: file.type,
    }

    try {
      const response = await axios.post(
        "https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/get-presigned-url",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data.url
    } catch (error) {
      console.error("Error fetching pre-signed URL:", error)
      throw error
    }
  }

  const handleImageUpload = async (e) => {
    const files = e.target.files
    if (files.length + parkingImages.length > 4) {
      alert("You can upload a maximum of 4 images.")
      return
    }

    setIsUploading(true) // Start loading

    const newImages = []
    for (const file of files) {
      try {
        const presignedUrl = await fetchPresignedUrl(file)
        console.log(presignedUrl)

        const headers = { "Content-Type": file.type }
        const response = await axios.put(presignedUrl, file, { headers })

        if (response.status === 200) {
          console.log("Image uploaded successfully", presignedUrl)
          // Extract the base URL before the query parameters
          const baseUrl = presignedUrl.split("?")[0]
          newImages.push(baseUrl)
        } else {
          console.error("Upload failed with status:", response.status)
          alert("Failed to upload image. Please try again.")
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        if (error.response) {
          console.error("Response data:", error.response.data)
          console.error("Response status:", error.response.status)
          console.error("Response headers:", error.response.headers)
        }
        alert(`Failed to upload image: ${error.message}`)
      }
    }

    setParkingImages((prevImages) => [...prevImages, ...newImages])
    setIsUploading(false)
  }

  const handleRemoveImage = (index) => {
    setParkingImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const validateForm = () => {
  if (!name.trim()) {
    return "Parking name is required.";
  }

  if (vehicle.length === 0) {
    return "Please select at least one vehicle type.";
  }

  if (!AvailableSpace || !TotalSpace) {
    return "Available space and total space are required.";
  }

  if (!address) {
    return "Parking address is required.";
  }

  if (parkingImages.length === 0) {
    return "Please upload at least one image.";
  }

  // Add additional validation for rating if needed
  if (!Rating) {
    return "Rating is required.";
  }

  return null; // No errors
};

const handleSubmit = async (latitude, longitude) => {
  const errorMessage = validateForm();
  if (errorMessage) {
    setErrorcheck({ open: true, message: errorMessage });
    return; // Stop further execution if validation fails
  }

  handleLoader();

  const formattedTariffCharges = {};
  Object.keys(tariffCharges).forEach((vehicleType) => {
    formattedTariffCharges[vehicleType] = {
      periods: tariffCharges[vehicleType],
      cyclicCharge: cyclicCharges[vehicleType] || "",
    };
  });

  const data = {
    vendorID,
    vehicleType: vehicle,
    parkingName: name,
    availableSpace: AvailableSpace,
    totalSpace: TotalSpace,
    rating: Rating,
    review: Review,
    location,
    tariffCharges: JSON.stringify(formattedTariffCharges),
    latitude,
    longitude,
    address,
    parkingImage: JSON.stringify(parkingImages),
  };

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  try {
    const response = await axios.post(url, data, { headers });
    handleLoaderfalse();
    handleClose();
    props.fetchData();
  } catch (error) {
    console.error("Error:", error);
    handleLoaderfalse();

    // Handle duplicate parking name error
    if (error.response?.data?.message?.includes("duplicate")) {
      setErrorcheck({ open: true, message: "Parking name already exists. Please choose a different name." });
    } else if (error.response?.data?.message) {
      setErrorcheck({ open: true, message: error.response.data.message });
    } else {
      setErrorcheck({ open: true, message: "An error occurred. Please try again." });
    }

    // No need to explicitly preserve parkingImages as we're not modifying it
  }
};

  // Similarly, update the handleUpdate function to preserve state on errors
  const handleUpdate = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      setErrorcheck({ open: true, message: errorMessage });
      return; // Stop further execution if validation fails
    }
  
    handleLoader();
  
    const formattedTariffCharges = {};
    Object.keys(tariffCharges).forEach((vehicleType) => {
      formattedTariffCharges[vehicleType] = {
        periods: tariffCharges[vehicleType],
        cyclicCharge: cyclicCharges[vehicleType] || "",
      };
    });
  
    const data = {
      parkingSpaceID: props.editparkingDetails.parkingSpaceID,
      vehicleType: vehicle,
      parkingName: name,
      parkingSpaceStatus: "Active",
      availableSpace: AvailableSpace,
      totalSpace: TotalSpace,
      rating: Rating,
      review: Review,
      location,
      tariffCharges: JSON.stringify(formattedTariffCharges),
      latitude: Latitude,
      longitude: Longitude,
      parkingImage: JSON.stringify(parkingImages),
    };
  
    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  
    try {
      await axios.put(
        `https://xkzd75f5kd.execute-api.ap-south-1.amazonaws.com/prod/user-management/parking-space/update-parking-space-info/${props.editparkingDetails.parkingSpaceID}`,
        data,
        { headers }
      );
      handleLoaderfalse();
      handleClose();
      props.fetchData();
    } catch (error) {
      console.error("Error:", error);
      handleLoaderfalse();
  
      // Handle duplicate parking name error
      if (error.response?.data?.message?.includes("duplicate")) {
        setErrorcheck({ open: true, message: "Parking name already exists. Please choose a different name." });
      } else if (error.response?.data?.message) {
        setErrorcheck({ open: true, message: error.response.data.message });
      } else {
        setErrorcheck({ open: true, message: "An error occurred. Please try again." });
      }
  
      // No need to explicitly preserve parkingImages as we're not modifying it
    }
  };

  const createTariffSummary = () => {
    let summary = ""
    Object.keys(tariffCharges).forEach((vehicleType) => {
      const periods = Array.isArray(tariffCharges[vehicleType])
        ? tariffCharges[vehicleType]
        : tariffCharges[vehicleType]?.periods || []

      const validPeriods = periods.filter((period) => period.startTime && period.endTime && period.charges)

      if (validPeriods.length > 0 || tariffCharges[vehicleType]?.cyclicCharge || cyclicCharges[vehicleType]) {
        summary += `${vehicleType}: `

        if (validPeriods.length > 0) {
          summary += `${validPeriods.length} periods`
        }

        const cyclicCharge = tariffCharges[vehicleType]?.cyclicCharge || cyclicCharges[vehicleType]
        if (cyclicCharge) {
          if (validPeriods.length > 0) summary += ", "
          summary += `cyclic: ${cyclicCharge}`
        }

        summary += " | "
      }
    })

    return summary.length > 0 ? summary.slice(0, -3) : "No tariff charges set"
  }

  const autocompleteRef = useRef(null)
  const API_KEY = "AIzaSyD-_p4x8ysVeIqV1H92viTaonxkBW80QYA"
  const libraries = ["places"]

  const handleMapClick = (event) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()
    setCoordinates({ lat, lng })
    setMarker({ lat, lng })
  }

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace()
    if (place?.geometry) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      setCoordinates({ lat, lng })
      setMarker({ lat, lng })
      map.setCenter({ lat, lng })

      const addressComponents = place.address_components
      const formattedAddress = place.formatted_address
      let city = ""
      let state = ""
      let postalCode = ""

      addressComponents.forEach((component) => {
        const types = component.types
        if (types.includes("locality")) city = component.long_name
        if (types.includes("administrative_area_level_1")) state = component.long_name
        if (types.includes("postal_code")) postalCode = component.long_name
      })

      setAddress(formattedAddress)
      setCity(city)
      setState(state)
      setPostalCode(postalCode)
      handleSubmit(lng, lat)
    }
  }

  const handleErrorDialogClose = () => {
    setErrorcheck(prev => ({ ...prev, open: false }));
  };

  return (
    <React.Fragment>
     {errorchecked.open && (
  <ErrorDialog 
    message={errorchecked.message} 
    setErrorcheck={handleErrorDialogClose} 
    errorchecked={errorchecked} 
  />
)}
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.createopen || props.editopen}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        {openChargesDialog && (
          <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={true}
            onClose={handleCloseCharges}
            PaperProps={{
              style: {
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            <div style={{ marginTop: "1rem", padding: "1rem" }}>
              <Typography variant="h6" style={{ marginBottom: "1rem", color: "#007FFF", fontWeight: "bold" }}>
                Set Tariff Charges
              </Typography>
              <Tabs
                value={selectedTab}
                onChange={(e, newValue) => setSelectedTab(newValue)}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    fontWeight: "medium",
                    minWidth: "80px",
                  },
                }}
              >
                {vehicle.map((vehicleType, index) => (
                  <Tab key={index} label={vehicleType} />
                ))}
              </Tabs>
              {vehicle.map((vehicleType, index) => (
                <div key={index} hidden={selectedTab !== index} style={{ padding: "1rem 0" }}>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      margin: "1rem auto",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "0.9rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #ddd",
                          padding: "0.8rem",
                          textAlign: "center",
                        }}
                      >
                        <th style={{ padding: "10px" }}>Time Period</th>
                        <th style={{ padding: "10px" }}>Total Charges</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tariffCharges[vehicleType]?.map((period, idx) => (
                        <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                          <td style={{ border: "1px solid #ddd", padding: "0.8rem", textAlign: "center" }}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <TextField
                                label="Start"
                                variant="outlined"
                                size="small"
                                value={period.startTime}
                                disabled={idx !== 0}
                                onChange={(e) => {
                                  const newTariffCharges = { ...tariffCharges }
                                  newTariffCharges[vehicleType][idx].startTime = e.target.value
                                  setTariffCharges(newTariffCharges)
                                }}
                                style={{ flex: 1 }}
                              />
                              <TextField
                                label="End"
                                variant="outlined"
                                size="small"
                                value={period.endTime}
                                onChange={(e) => {
                                  const newTariffCharges = { ...tariffCharges }
                                  newTariffCharges[vehicleType][idx].endTime = e.target.value
                                  setTariffCharges(newTariffCharges)
                                }}
                                style={{ flex: 1 }}
                              />
                            </div>
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "0.8rem", textAlign: "center" }}>
                            <TextField
                              label="Charges"
                              variant="outlined"
                              size="small"
                              value={period.charges}
                              onChange={(e) => {
                                const newTariffCharges = { ...tariffCharges }
                                newTariffCharges[vehicleType][idx].charges = e.target.value
                                setTariffCharges(newTariffCharges)
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    style={{ marginTop: "1rem", backgroundColor: "#f5f5f5", padding: "12px", borderRadius: "4px" }}
                  >
                    <Grid item xs={3}>
                      <Typography
                        variant="body1"
                        style={{ fontSize: matches ? "0.85rem" : "0.95rem", fontWeight: "medium" }}
                      >
                        Cyclic Charges
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <TextField
                        style={{ width: "100%" }}
                        label="Cyclic Charges"
                        id="outlined-size-small"
                        placeholder="Enter cyclic charges"
                        size="small"
                        value={cyclicCharges[vehicleType] || ""}
                        onChange={(e) => {
                          const newCyclicCharges = { ...cyclicCharges }
                          newCyclicCharges[vehicleType] = e.target.value
                          setCyclicCharges(newCyclicCharges)
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
              ))}
            </div>
            <DialogActions style={{ padding: "16px", borderTop: "1px solid #eee" }}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  style={{
                    color: "white",
                    backgroundColor: "#007FFF",
                    borderRadius: "4px",
                    padding: "8px 16px",
                    boxShadow: "0 2px 4px rgba(0,127,255,0.2)",
                  }}
                  onClick={() => {
                    handleCloseCharges()
                    // Force a re-render to update the tariff summary
                    setTariffCharge((prevCharge) => prevCharge + 1)
                  }}
                >
                  Save
                </Button>
                <Button onClick={handleCloseCharges} style={{ color: "#666" }}>
                  Cancel
                </Button>
              </Stack>
            </DialogActions>
          </Dialog>
        )}
        {props.createopen && (
          <DialogTitle
            style={{
              color: "#007FFF",
              borderBottom: "1px solid #eee",
              padding: "16px 24px",
              fontWeight: "bold",
            }}
          >
            Add New Parking
          </DialogTitle>
        )}
        {props.editopen && (
          <DialogTitle
            style={{
              color: "#007FFF",
              borderBottom: "1px solid #eee",
              padding: "16px 24px",
              fontWeight: "bold",
            }}
          >
            Edit Parking Details
          </DialogTitle>
        )}
        <DialogContent style={{ padding: "20px 24px" }}>
          {openAddressDialog && (
            <Test
              setOpenAddressDialog={setOpenAddressDialog}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setLocation={setLocation}
              setAddress={setAddress}
            />
          )}
          <Box sx={{ mt: 1 }}>
            {[
              { label: "Parking Name", value: name, setter: setName },
              {
                label: "Vehicle Type",
                value: vehicle,
                setter: setVehicle,
                select: true,
                options: names,
                onChange: handleVehicleChange,
              },
              { label: "Total Space", value: TotalSpace, setter: setTotalSpace },
              { label: "Available Space", value: AvailableSpace, setter: setAvailableSpace },
              {
                label: "Parking Address",
                value: address,
                setter: setAddress,
                onClick: () => setOpenAddressDialog(true),
              },
              {
                label: "Tariff Charges",
                value: createTariffSummary(),
                setter: setTariffCharge,
                onClick: () => setOpenChargesDialog(true),
                placeholder: "Click to set tariff charges",
              },
              { label: "Rating", value: Rating, setter: setRating },
              { label: "Review", value: Review, setter: setReview },
            ].map((field, index) => (
              <Grid
                container
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                style={{
                  marginTop: "8px",
                  marginBottom: "8px",
                  padding: "4px 0",
                  borderBottom: index < 7 ? "1px solid #f0f0f0" : "none",
                }}
                key={index}
              >
                <Grid item xs={12} sm={3}>
                  <Typography
                    variant="body1"
                    style={{
                      fontSize: matches ? "0.75rem" : "0.85rem",
                      fontWeight: "bold",
                      color: "#555",
                    }}
                  >
                    {field.label}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  {field.select ? (
                    <FormControl sx={{ width: "100%" }} size="small">
                      <InputLabel
                        id="vehicle-type-label"
                        sx={{
                          backgroundColor: "white",
                          px: 0.5,
                          // Ensure the label is above the chips when selected
                          "&.Mui-focused, &.MuiFormLabel-filled": {
                            transform: "translate(14px, -9px) scale(0.75)",
                          },
                        }}
                      >
                        Select Vehicle Types
                      </InputLabel>
                      <Select
                        labelId="vehicle-type-label"
                        style={{ margin: "1%", width: "100%", padding: matches ? "3%" : "2%" }}
                        multiple
                        value={field.value}
                        onChange={field.onChange}
                        renderValue={(selected) => (
                          <Stack gap={1} direction="row" flexWrap="wrap" >
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={value}
                                style={{
                                  height: "24px",
                                  backgroundColor: "#007FFF",
                                  color: "white",
                                  fontWeight: "medium",
                                  fontSize: "0.8rem",
                                }}
                              />
                            ))}
                          </Stack>
                        )}
                      >
                        {field.options.map((name) => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      style={{ width: "100%" }}
                      label={field.label}
                      id="outlined-size-small"
                      placeholder={field.placeholder || field.label}
                      size="small"
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      onClick={field.onClick}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        style: {
                          fontSize: "0.9rem",
                        },
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            ))}
          </Box>
          {/* Image Upload Section */}
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="flex-start"
            style={{
              marginTop: "16px",
              padding: "16px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <Grid item xs={12} sm={3}>
              <Typography
                variant="body1"
                style={{
                  fontSize: matches ? "0.75rem" : "0.85rem",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Parking Images
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="upload-images"
              />
              {isUploading && (
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                  <CircularProgress size={24} style={{ color: "#007FFF" }} />
                </Box>
              )}
              {/* Image Preview Section */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "0.5rem" }}>
                {parkingImages
                  .filter((img) => img)
                  .map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid #e0e0e0",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Parking image ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </Box>
                      <Button
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          color: "white",
                          backgroundColor: "rgba(0,0,0,0.5)",
                          minWidth: "28px",
                          height: "28px",
                          padding: "4px",
                          borderRadius: "50%",
                          "&:hover": {
                            backgroundColor: "rgba(255,0,0,0.7)",
                          },
                        }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </Button>
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                          padding: "4px",
                          textAlign: "center",
                          borderBottomLeftRadius: "8px",
                          borderBottomRightRadius: "8px",
                        }}
                      >
                        Image {index + 1}
                      </Typography>
                    </Box>
                  ))}
                {isUploading && (
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <CircularProgress size={32} style={{ color: "#007FFF" }} />
                  </Box>
                )}
                {parkingImages.length < 4 && !isUploading && (
                  <Box
                    component="label"
                    htmlFor="upload-images"
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "8px",
                      border: "2px dashed #007FFF",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(0,127,255,0.05)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: "rgba(0,127,255,0.1)",
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#007FFF", textAlign: "center" }}>
                      + Add Image
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666", textAlign: "center", mt: 1 }}>
                      {4 - parkingImages.length} remaining
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ padding: "16px 24px", borderTop: "1px solid #eee" }}>
          {props.createopen && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                style={{
                  color: "white",
                  backgroundColor: "#007FFF",
                  borderRadius: "4px",
                  padding: "8px 20px",
                  boxShadow: "0 2px 4px rgba(0,127,255,0.2)",
                  fontWeight: "medium",
                }}
                onClick={() => handleSubmit(Latitude, Longitude)}
              >
                Submit
              </Button>
              <Button onClick={handleClose} style={{ color: "#666" }}>
                Cancel
              </Button>
            </Stack>
          )}
          {props.editopen && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                style={{
                  color: "white",
                  backgroundColor: "#007FFF",
                  borderRadius: "4px",
                  padding: "8px 20px",
                  boxShadow: "0 2px 4px rgba(0,127,255,0.2)",
                  fontWeight: "medium",
                }}
                onClick={handleUpdate}
              >
                Update
              </Button>
              <Button onClick={handleClose} style={{ color: "#666" }}>
                Cancel
              </Button>
            </Stack>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

