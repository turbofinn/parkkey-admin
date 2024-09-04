
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

// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import MuiLink from "@mui/material/Link";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import LoactionMap from "components/TFMaps/LoactionMap";

function MapCard({ image, title, }) {
    return (
        <Card>
            <MDBox p={3}>
                <MDTypography display="inline" variant="h5" textTransform="capitalize" fontWeight="bold">
                    {"Available Parking"}
                </MDTypography>
                <MDBox mt={2} mb={3}>
                    <LoactionMap />
                </MDBox>

            </MDBox>
        </Card>
    );
}

// Typechecking props for the SimpleBlogCard
MapCard.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    action: PropTypes.shape({
        type: PropTypes.oneOf(["external", "internal"]).isRequired,
        route: PropTypes.string.isRequired,
        color: PropTypes.oneOf([
            "primary",
            "secondary",
            "info",
            "success",
            "warning",
            "error",
            "dark",
            "light",
            "default",
        ]),
        label: PropTypes.string.isRequired,
    }).isRequired,
};

export default MapCard;
