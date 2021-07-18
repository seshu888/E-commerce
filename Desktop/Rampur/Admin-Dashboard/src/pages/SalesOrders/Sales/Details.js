import React, { useState, useEffect, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import Card from '@material-ui/core/Card';
import { blue } from '@material-ui/core/colors';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';

import AppContext from 'context/AppContext';

import { fetchCustomerInfo, fetchCusotmersList, fetchPayments, fetchContacts, fetchAddresses } from 'api';
import LoaderComponent from 'components/LoaderComponent';

const Details = (props) => {
	const { orderItemId, category, updateOrderCustomerDetails ,customerId} = props;
	const [ customerSelectionDialogOpen, setCustomerSelectionDialogOpen ] = React.useState(false);
	const [ paymentTermsSelectionDialogOpen, setPaymentTermsSelectionDialogOpen ] = React.useState(false);
	const [ selectedDate, setSelectedDate ] = React.useState(new Date('2020-08-18T21:11:54'));

	const context = useContext(AppContext);
	const [ activeCustomers, setActiveCustomers ] = useState([]);
	const [ selectedCustomer, setSelectedCustomer ] = useState(null);
	const [ selectedCustomerValue, setSelectedCustomerValue ] = useState(null);
	const [ payments, setPayments ] = useState([]);
	const [ selectedPaymentValue, setSelectedPaymentValue ] = useState(null);
	const [ contactSelectionDialogOpen, setContactSelectionDialogOpen ] = React.useState(false);
	const [ selectedContactValue, setSelectedContactValue ] = useState(null);
	const [ selectedCustomerId, setSelectedCustomerId ] = useState(customerId);
	const [ contacts, setContacts ] = useState([]);
	const [ addressSelectionDialogOpen, setAddressSelectionDialogOpen ] = useState(false);
	const [ selectedAddressValue, setSelectedAddressValue ] = useState(null);
	const [ address, setAddress ] = useState([]);
	const [ orderId, setSelectedOrderId ] = useState(orderItemId);

	useEffect(
		() => {
			updateOrderCustomerDetails(selectedCustomer);
		},
		[ selectedCustomer ]
	);

	useEffect(() => {
		getCustomers(selectedCustomerId, orderId);
	}, []);

	const getCustomers = async (customerId, orderId) => {
		let res = await fetchCustomerInfo(customerId, orderId);

		if (res.status !== 'error') {
			setSelectedCustomer(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};
	// fetchCusotmersList
	const handleChange = (e, type) => {
		if (type === 'date') {
			setSelectedCustomer({ ...selectedCustomer, deliveryDate: moment(e).format('MMM DD YYYY hh:mm:ss') });
		} else setSelectedCustomer({ ...selectedCustomer, [e.target.name]: e.target.value });
	};

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};
	const handleCustomerSelctionDialog = () => {
		getActiveCustomers();
		setSelectedCustomerValue(selectedCustomer.customerDetails);
		setCustomerSelectionDialogOpen(true);
	};
	const getActiveCustomers = async () => {
		let res = await fetchCusotmersList(category);
		if (res.status !== 'error') {
			setActiveCustomers(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};

	const handleClose = () => {
		setCustomerSelectionDialogOpen(false);
	};
	const handleSelectedCustomer = (value) => {
		setSelectedCustomerValue(value);
	};
	const handleSaveSelectedCustomer = () => {
		let data = { ...selectedCustomer, customerId: selectedCustomerValue };
		setSelectedCustomer(data);
		handleClose();
	};

	const handlePaymentsSelectionDialog = () => {
		setPaymentTermsSelectionDialogOpen(true);
		setSelectedPaymentValue(selectedCustomer.paymentTerms);
		getPaymentTerms();
	};
	const getPaymentTerms = async () => {
		let res = await fetchPayments();

		if (res.status !== 'error') {
			setPayments(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};
	const getContacts = async () => {
		let res = await fetchContacts(selectedCustomerId);
		if (res.status !== 'error') {
			setContacts(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleClosePaymentDialog = () => {
		setPaymentTermsSelectionDialogOpen(false);
	};
	const handleSelectedPayment = (value) => {
		setSelectedPaymentValue(value);
	};
	const handleSaveSelectedPayment = () => {
		let data = { ...selectedCustomer, paymentTerms: selectedPaymentValue };

		setSelectedCustomer(data);
		setPaymentTermsSelectionDialogOpen(false);
	};
	const handleContactSelectionDialog = () => {
		getContacts(selectedCustomerId && selectedCustomerId);
		setSelectedContactValue(selectedCustomer.contactPerson);
		setContactSelectionDialogOpen(true);
	};
	const handleCloseContactDialog = () => {
		setContactSelectionDialogOpen(false);
	};
	const handleSelectedContact = (value) => {
		setSelectedContactValue(value);
	};
	const handleSaveSelectedContact = () => {
		let data = { ...selectedCustomer, contactPerson: selectedContactValue };
		setSelectedCustomer(data);
		handleCloseContactDialog();
	};

	const getAddress = async () => {
		let res = await fetchAddresses(selectedCustomerId);
		if (res.status !== 'error') {
			setAddress(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};

	const handleAddressSelectionDialog = () => {
		getAddress(selectedCustomerId && selectedCustomerId);
		setSelectedAddressValue(selectedCustomer.address);
		setAddressSelectionDialogOpen(true);
	};
	const handleCloseAddressDialog = () => {
		setAddressSelectionDialogOpen(false);
	};
	const handleSelectedAddress = (value) => {
		setSelectedAddressValue(value);
	};
	const handleSaveSelectedAddress = () => {
		let data = { ...selectedCustomer, address: selectedAddressValue };
		setSelectedCustomer(data);
		handleCloseAddressDialog();
	};

	return (
		<div>
			<div>
				<div className="container p-0">
					<div className="row p-0  ">
						<div className="col-md-9">
							<div className="row p-0 m-0 ">
								<div className="col-md-12 ">
									<p className="sectionContent" style={{ fontSize: 39 }}>
										Invoice
									</p>
									<Card>
										<TextField
											size="small"
											id="outlined-search"
											name="invoice"
											type="text"
											InputProps={{ style: { height: 30, fotSize: 14 } }}
											variant="outlined"
											onChange={(e) => handleChange(e)}
											value={selectedCustomer && selectedCustomer.invoice}
											className="w-100"
										/>
									</Card>
								</div>
								<div className="col-md-6 mt-8">
									<p className="sectionContent"> {category === 'Sales' ? 'Customers' : 'Supplier'}</p>
									<OutlinedInput
										variant="outlined"
										type="text"
										placeholder=""
										className="w-100 bg-white"
										value={
											selectedCustomer &&
											selectedCustomer.customerDetails &&
											selectedCustomer.customerDetails.customerName
										}
										inputProps={{
											style: {
												fotSize: 10,
												padding: 6
											}
										}}
										endAdornment={
											<InputAdornment position="end">
												<SearchIcon
													style={{
														opacity: 0.8,
														fontSize: '14px'
													}}
													onClick={handleCustomerSelctionDialog}
												/>
											</InputAdornment>
										}
										name="discount"
									/>
								</div>
								<div className="col-md-6 mt-8">
									<p className="sectionContent">Payment Terms</p>
									<OutlinedInput
										variant="outlined"
										type="text"
										placeholder=""
										className="w-100 bg-white"
										inputProps={{
											style: {
												fotSize: 10,
												padding: 6
											}
										}}
										value={
											selectedCustomer &&
											selectedCustomer.paymentTerms &&
											selectedCustomer.paymentTerms.paymentType
										}
										endAdornment={
											<InputAdornment position="end">
												<SearchIcon
													style={{
														opacity: 0.8,
														fontSize: '14px'
													}}
													onClick={handlePaymentsSelectionDialog}
												/>
											</InputAdornment>
										}
										name="discount"
									/>
								</div>
								<div className="col-md-6 mt-8">
									<p className="sectionContent">Contact</p>
									<OutlinedInput
										variant="outlined"
										type="text"
										placeholder=""
										className="w-100 bg-white"
										inputProps={{
											style: {
												fotSize: 10,
												padding: 6
											}
										}}
										value={
											selectedCustomer &&
											selectedCustomer.contactPerson &&
											selectedCustomer.contactPerson.contactPerson
										}
										endAdornment={
											<InputAdornment position="end">
												<SearchIcon
													style={{
														opacity: 0.8,
														fontSize: '14px'
													}}
													onClick={handleContactSelectionDialog}
												/>
											</InputAdornment>
										}
									/>
								</div>

								<div className="col-md-6 mt-8">
									<p className="sectionContent">Billing Address</p>
									<OutlinedInput
										variant="outlined"
										type="text"
										placeholder=""
										className="w-100 bg-white"
										inputProps={{
											style: {
												fotSize: 10,
												padding: 6
											}
										}}
										value={
											selectedCustomer &&
											selectedCustomer.address &&
											selectedCustomer.address.address
										}
										endAdornment={
											<InputAdornment position="end">
												<SearchIcon
													style={{
														opacity: 0.8,
														fontSize: '14px'
													}}
													onClick={handleAddressSelectionDialog}
												/>
											</InputAdornment>
										}
									/>
								</div>

								<div className="col-md-12 mt-12">
									<p className="sectionContent">
										Note To {category === 'Sales' ? 'Customers' : 'Supplier'}
									</p>
									<Card>
										<TextField
											id="outlined-multiline-static"
											multiline
											rows={2}
											name="customerNote"
											onChange={(e) => handleChange(e)}
											value={selectedCustomer && selectedCustomer.customerNote}
											variant="outlined"
											className="w-100"
										/>
									</Card>
								</div>
							</div>
						</div>
						<div className="col-md-3">
							<Card>
								<p className="border p-8 sectionSubTitle">Summary</p>
								<div className="row p-8">
									<div className="col-md-12">
										<div className="py-2 px-0">
											<div className="col-md-12 p-0">
												<p className="sectionContent">Order Delivery Due Date" </p>
												<MuiPickersUtilsProvider utils={DateFnsUtils}>
													<Grid>
														<KeyboardDatePicker
															disableToolbar
															format="MM/dd/yyyy"
															id="date-picker-inline"
															value={selectedCustomer && selectedCustomer.deliveryDate}
															onChange={(e) => handleChange(e, 'date')}
															KeyboardButtonProps={{
																'aria-label': 'change date'
															}}
														/>
													</Grid>
												</MuiPickersUtilsProvider>
											</div>
											<div className="col-md-4" />
										</div>
									</div>
									<div className="col-md-12 py-3">
										<p className="sectionContent mb-3">Priority </p>
										<FormControl variant="outlined" className="w-100">
											<Select
												labelId="demo-simple-select-outlined-label"
												id="demo-simple-select-outlined"
												style={{
													height: 40,
													minHeight: 40
												}}
												onChange={(e) => handleChange(e)}
												name="priority"
												value={selectedCustomer && selectedCustomer.priority}
											>
												<MenuItem value="High">High</MenuItem>
												<MenuItem value="Low">Low</MenuItem>
												<MenuItem value="Moderate">Moderate</MenuItem>
											</Select>
										</FormControl>
									</div>
								</div>
							</Card>
						</div>
					</div>
				</div>
				<div>
					<Dialog
						open={customerSelectionDialogOpen}
						onClose={handleClose}
						aria-labelledby="responsive-dialog-title"
						maxWidth="sm"
						fullWidth={true}
					>
						<DialogTitle className="px-4">
							<p className="sectionTitle">{category === 'Sales' ? 'Customers' : 'Suppliers'}</p>
						</DialogTitle>

						<DialogContent className="px-4">
							<TextField
								InputProps={{ style: { height: 35, fotSize: 14 } }}
								required
								id="outlined-required"
								defaultValue=""
								variant="outlined"
								className="w-100 "
							/>

							<div className="container p-0 mt-4">
								<TableContainer component={Paper}>
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell>
													<p className="sectionSubTitle">Name</p>
												</TableCell>

												<TableCell align="right">
													<p className="sectionSubTitle">Action</p>
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{activeCustomers &&
												activeCustomers.map((row) => (
													<TableRow key={row.id}>
														<TableCell
															component="th"
															scope="row"
															className="sectionContent"
														>
															{row.name}
														</TableCell>

														<TableCell align="right">
															<Button
																variant="contained"
																color="primary"
																className="sectionContent"
																onClick={() => handleSelectedCustomer(row)}
																disabled={
																	selectedCustomerValue &&
																	selectedCustomerValue.customerId === row.customerId
																}
															>
																{selectedCustomerValue &&
																selectedCustomerValue.customerId === row.customerId ? (
																	'selected'
																) : (
																	'select'
																)}
															</Button>
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</TableContainer>
							</div>
						</DialogContent>
						<DialogActions className="px-4">
							<Button
								onClick={() => setCustomerSelectionDialogOpen(false)}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="outlined"
								color="primary"
							>
								Cancel
							</Button>
							<Button
								onClick={handleSaveSelectedCustomer}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="contained"
								color="primary"
							>
								Save
							</Button>
						</DialogActions>
					</Dialog>
				</div>
				<div>
					<Dialog
						open={paymentTermsSelectionDialogOpen}
						onClose={handleClose}
						aria-labelledby="responsive-dialog-title"
						maxWidth="sm"
						fullWidth={true}
					>
						<DialogTitle className="px-4">
							<p className="sectionTitle">Payment Terms</p>
						</DialogTitle>

						<DialogContent className="px-4">
							<TextField
								InputProps={{ style: { height: 35, fotSize: 14 } }}
								required
								id="outlined-required"
								defaultValue=""
								variant="outlined"
								className="w-100 "
							/>

							<div className="container p-0 mt-4">
								<TableContainer component={Paper}>
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell className="sectionSubTitle">Payment Type</TableCell>

												<TableCell align="right" className="sectionSubTitle">
													Action
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{payments &&
												payments.map((row) => (
													<TableRow key={row.id}>
														<TableCell
															component="th"
															scope="row"
															className="sectionContent"
														>
															{row.paymentType}
														</TableCell>

														<TableCell align="right">
															<Button
																variant="contained"
																color="primary"
																className="sectionContent"
																onClick={() => handleSelectedPayment(row)}
																disabled={
																	selectedPaymentValue &&
																	selectedPaymentValue.id === row.id
																}
															>
																{selectedPaymentValue &&
																selectedPaymentValue.id === row.id ? (
																	'Selected'
																) : (
																	'Select'
																)}
															</Button>
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</TableContainer>
							</div>
						</DialogContent>
						<DialogActions className="px-4">
							<Button
								onClick={handleClosePaymentDialog}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="outlined"
								color="primary"
							>
								Cancel<span className="mb-1" />
							</Button>
							<Button
								onClick={handleSaveSelectedPayment}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="contained"
								color="primary"
							>
								<p>Save</p>
							</Button>
						</DialogActions>
					</Dialog>
				</div>

				<div>
					<Dialog
						open={contactSelectionDialogOpen}
						onClose={handleClose}
						aria-labelledby="responsive-dialog-title"
						maxWidth="sm"
						fullWidth={true}
					>
						<DialogTitle className="px-4">
							<p className="sectionTitle">Contacts</p>
						</DialogTitle>

						<DialogContent className="px-4">
							<TextField
								InputProps={{ style: { height: 35, fotSize: 14 } }}
								required
								id="outlined-required"
								defaultValue=""
								variant="outlined"
								className="w-100 "
							/>

							<div className="container p-0 mt-4">
								<TableContainer component={Paper}>
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell className="sectionSubTitle">Contact</TableCell>

												<TableCell align="right" className="sectionSubTitle">
													Action
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{contacts &&
												contacts.map((row) => (
													<TableRow key={row.id}>
														<TableCell
															component="th"
															scope="row"
															className="sectionContent"
														>
															{row.contactPerson}
														</TableCell>

														<TableCell align="right">
															<Button
																variant="contained"
																color="primary"
																className="sectionContent"
																onClick={() => handleSelectedContact(row)}
																disabled={
																	selectedContactValue &&
																	selectedContactValue.id === row.id
																}
															>
																{selectedContactValue &&
																selectedContactValue.id === row.id ? (
																	'Selected'
																) : (
																	'Select'
																)}
															</Button>
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</TableContainer>
							</div>
						</DialogContent>
						<DialogActions className="px-4">
							<Button
								onClick={handleCloseContactDialog}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="outlined"
								color="primary"
							>
								Cancel<span className="mb-1" />
							</Button>
							<Button
								onClick={handleSaveSelectedContact}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="contained"
								color="primary"
							>
								<p>Save</p>
							</Button>
						</DialogActions>
					</Dialog>
				</div>
				<div>
					<Dialog
						open={addressSelectionDialogOpen}
						onClose={handleClose}
						aria-labelledby="responsive-dialog-title"
						maxWidth="sm"
						fullWidth={true}
					>
						<DialogTitle className="px-4">
							<p className="sectionTitle">addresses</p>
						</DialogTitle>

						<DialogContent className="px-4">
							<TextField
								InputProps={{ style: { height: 35, fotSize: 14 } }}
								required
								id="outlined-required"
								defaultValue=""
								variant="outlined"
								className="w-100 "
							/>

							<div className="container p-0 mt-4">
								<TableContainer component={Paper}>
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell className="sectionSubTitle">Contact</TableCell>

												<TableCell align="right" className="sectionSubTitle">
													Action
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{address &&
												address.map((row) => (
													<TableRow key={row.id}>
														<TableCell
															component="th"
															scope="row"
															className="sectionContent"
														>
															{row.address}
														</TableCell>

														<TableCell align="right">
															<Button
																variant="contained"
																color="primary"
																className="sectionContent"
																onClick={() => handleSelectedAddress(row)}
																disabled={
																	selectedAddressValue &&
																	selectedAddressValue.addressId === row.addressId
																}
															>
																{selectedAddressValue &&
																selectedAddressValue.addressId === row.addressId ? (
																	'Selected'
																) : (
																	'Select'
																)}
															</Button>
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</TableContainer>
							</div>
						</DialogContent>
						<DialogActions className="px-4">
							<Button
								onClick={handleCloseAddressDialog}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="outlined"
								color="primary"
							>
								Cancel<span className="mb-1" />
							</Button>
							<Button
								onClick={handleSaveSelectedAddress}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="contained"
								color="primary"
							>
								<p>Save</p>
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			</div>
		</div>
	);
};
export default Details;
