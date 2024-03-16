// import React from 'react';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
import Dashboard from './components/Dashboard'
// import Button from '@mui/material/Button';
// import { SnackbarAlert } from './common/constants';
import Items from './pages/Items';


const App = () => {
  // const [alert, setAlert] = React.useState<SnackbarAlert | null>(null);

  // const handleClick = () => {
  //   setAlert({
  //     severity: "success",
  //     message: "wah bhai wah!"
  //   });
  // };

  // const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setAlert(null);
  // };

  return (
    <div>
      <Dashboard>
        <Items />
        {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
        {/* <Snackbar open={!!alert} autoHideDuration={6000} onClose={handleClose}>
          {
            alert ? (
              <Alert
                onClose={handleClose}
                severity={alert.severity}
                sx={{width: "100%"}}
              >
                {alert.message}
              </Alert>
            ) : <></>
          }
        </Snackbar> */}
      </Dashboard>
    </div>
  )
}

export default App
