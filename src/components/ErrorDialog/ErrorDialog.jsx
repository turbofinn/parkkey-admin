import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useMediaQuery, Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ErrorDialog = (props) => {
    const [close, setClose] = React.useState(true);
    const [open, setOpen] = React.useState(true);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('xs');
    const matches = useMediaQuery('(max-width:600px)');

    const handleClose = () => {
        props.setErrorcheck(prevState => ({
            ...prevState,
            open: false,
            close: true
        }));
    };

    return (
        <React.Fragment>
            {/* <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.errorchecked.open}
        onClose={props.errorchecked.close}
      >
        <DialogTitle style={{ color: '#E32636' }}>Error</DialogTitle>
        <DialogContent>
          {props.message}
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              style={{ color: 'white', backgroundColor: '#E32636' }}
              onClick={handleClose} 
            >
              Close
            </Button>
          </Stack>
        </DialogActions>
      </Dialog> */}
            <Snackbar
                open={props.errorchecked.open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {props.message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
};

export default ErrorDialog;
