import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Grid } from '@mui/material';
import { TextField, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const SuccessDialog = () => {
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [value, setValue] = React.useState('');

    const handleChange = (newValue) => {
        setValue(newValue);
    }
    const onClose = () => {

    }
    return (
        <React.Fragment>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
                onClose={onClose}
            >
                <DialogTitle>Enter your OTP</DialogTitle>
                <DialogContent>
                </DialogContent>
                <DialogActions>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            style={{ color: 'white' }}
                        >Submit</Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default SuccessDialog;