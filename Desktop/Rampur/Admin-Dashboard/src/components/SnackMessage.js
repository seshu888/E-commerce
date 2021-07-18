import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const SnackMessage = ({ snackMessages }) => {
	const [ messages, setMessages ] = useState(snackMessages);
	const [ messageInfo, setMessageInfo ] = useState(snackMessages && snackMessages.length ? snackMessages[0] : null);
    useEffect(
		() => {
			setMessages(snackMessages);
		},
		[ snackMessages ]
	);
	useEffect(
		() => {
			if (messages.length && !messageInfo) {
				setMessageInfo({ ...messages[0] });
				setMessages((prev) => prev.slice(1));
			} else if (messages.length && messageInfo) {
				setMessageInfo(null);
			}
		},
		[ messages, messageInfo ]
	);
	const handleExited = () => {
		setMessageInfo(null);
	};
	const handleClose = () => {
		setMessageInfo(null);
    };
    
	return (
		<Snackbar
			key={messageInfo ? messageInfo.key : undefined}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right'
			}}
			open={Boolean(messageInfo)}
			autoHideDuration={6000}
			onExited={handleExited}
			onClose={handleClose}
			message={messageInfo ? messageInfo.message : undefined}
		>
			<Alert severity={messageInfo && messageInfo.type ? messageInfo.type : 'error'}>
				{messageInfo && messageInfo.message}
			</Alert>
		</Snackbar>
	);
};
export default SnackMessage;
