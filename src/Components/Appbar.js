import * as React from 'react';

import {
    Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Box, Toolbar, Button
} from "@material-ui/core"
import TransferForm from './Form';

export default function ButtonAppBar() {
const [open,setOpen] = React.useState(false);

const handleOpen = () =>{
    setOpen(true)
}

const handleClose = () =>{
    setOpen(false)
 
}

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={handleOpen} style={{float:"right"}} >Transfer</Button>
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth >
          <DialogTitle style={{textAlign:"center" }} > TRANSFER
              </DialogTitle>
          <DialogContent>
<TransferForm />
          </DialogContent>
          <DialogActions>
              <Button variant="contained" onClick={handleClose} >Close</Button>
          </DialogActions>
      </Dialog>
    </div>
  );
}

