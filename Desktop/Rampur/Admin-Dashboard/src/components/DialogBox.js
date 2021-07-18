import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';



export default function DialogBox(props) {
console.log(props.bomItemsEdited)

	return (
	
			<Dialog
				open={props.bomItemsEdited}
				// onClose={props.handleWarningDialogClose}
				fullWidth={true}
				maxWidth="sm"
			>
				<DialogTitle>
					<p>Warnign Dialog</p>
				</DialogTitle>
				<DialogContent>
					<p>You have unsaved changes</p>
				</DialogContent>
				<DialogActions>
					<button>Okay</button>
				
				</DialogActions>
			</Dialog>

	);
}
// <button onClick={props.handleWarningDialogClose}>Cancel</button>