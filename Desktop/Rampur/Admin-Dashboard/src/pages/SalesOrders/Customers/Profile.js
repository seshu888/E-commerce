import React, { useState, useEffect, useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import EditIcon from '@material-ui/icons/Edit';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { blue } from '@material-ui/core/colors';
import Switch from '@material-ui/core/Switch';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {
	fetchCustomerDetails,
	fetchContactPersonList,
	fetchPaymentTerms,
	fetchContacts,
	createNewContact,
	fetchAddresses,
	createNewAddress,
	fetchCustomerType,
	deleteContact,
	deleteAddress
} from 'api';
import AppContext from 'context/AppContext';
import LoaderComponent from 'components/LoaderComponent';

const Profile = (props) => {
	const { customerId, updateSelectedCustomer, category } = props;
	const [ selectedSection, setSelectedSection ] = useState('');
	const [ selectedAddressForm, setSelectedAddressForm ] = useState(null);
	const [ selectedContactForm, setSelectedContactForm ] = useState(null);
	const [ selectedCustomer, setSelectedCustomer ] = useState(null);
	const [ sectionalData, setSectionalData ] = useState([]);
	const [ allSectionalData, setAllSectionalData ] = useState([]);
	const [ selectedContact, setSelectedContact ] = useState(null);
	const [ selectedPayment, setSelectedPayment ] = useState(null);
	const [ contacts, setContacts ] = useState([]);
	const [ addresses, setAddresses ] = useState([]);
	const [ createNewContactLoader, setCreateNewContactLoader ] = useState(false);
	const [ createNewAddressLoader, setCreateNewAddressLoader ] = useState(false);

	const [ selectedCustomerType, setSelectedCustomerType ] = useState(null);
	const [ customerTypes, setCustomerTypes ] = useState([]);
	const [ allCustomerTypes, setAllCustomerTypes ] = useState([]);
	const [ openCustomerTypeDialog, setOpenCustomerTypeDialog ] = useState(false);

	const context = useContext(AppContext);
	useEffect(
		() => {
			updateSelectedCustomer(selectedCustomer);
		},
		[ selectedCustomer ]
	);
	useEffect(() => {
		getCustomerDetails();
		getContacts();
		getAddresses();
	}, []);
	const getAddresses = async () => {
		let res = await fetchAddresses(customerId);
		if (res.status !== 'error') {
			setAddresses(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};
	const getContacts = async () => {
		let res = await fetchContacts(customerId);
		if (res.status !== 'error') {
			setContacts(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};
	const getCustomerDetails = async () => {
		let res = await fetchCustomerDetails(customerId);
		if (res.status !== 'error') {
			setSelectedCustomer(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};

	const handleAddressChange = (e) => {
		let type = e.target.type;

		if (type === 'checkbox') {
			let value = e.target.checked;

			setSelectedAddressForm({ ...selectedAddressForm, [e.target.name]: value ? 'Primary' : '' });
		} else {
			let value = e.target.value;
			setSelectedAddressForm({ ...selectedAddressForm, [e.target.name]: value });
		}
	};
	const handleContactChange = (e) => {
		setSelectedContactForm({ ...selectedContactForm, [e.target.name]: e.target.value });
	};

	const handleSectionClick = (section) => {
		setSelectedSection(section);
		if (section === 'contact') {
			setSelectedContact(selectedCustomer.contactPerson);
			getContactPersonList(customerId);
		} else {
			setSelectedPayment(selectedCustomer.paymentTerms);
			getPaymentTerms();
		}
	};

	const getContactPersonList = async (customerId) => {
		let res = await fetchContactPersonList(customerId);
		if (res.status !== 'error') {
			setSectionalData(res.data);
			setAllSectionalData(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};
	const getPaymentTerms = async () => {
		let res = await fetchPaymentTerms();
		if (res.status !== 'error') {
			setSectionalData(res.data);
			setAllSectionalData(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleAddressClick = (type, addressForm) => {
		if (type == 'add') {
			let obj = {
				name: '',
				address: '',
				contact: '',
				city: '',
				state: '',
				option: '',
				type: 'add'
			};
			setSelectedAddressForm(obj);
		} else {
			setSelectedAddressForm(addressForm);
		}
	};
	const handleContactClick = (type, contactForm) => {
		if (type == 'add') {
			let obj = {
				position: '',
				mobile: '',
				email: '',
				contactPerson: '',
				type: 'add'
			};
			setSelectedContactForm(obj);
		} else {
			setSelectedContactForm(contactForm);
		}
	};

	const handleAddAddress = async () => {
		if (selectedAddressForm.type == 'add') {
			setSelectedAddressForm({ selectedAddressForm });
		}
		let form = {
			customerId: customerId,

			address: selectedAddressForm
		};

		setCreateNewAddressLoader(true);
		let res = await createNewAddress(form);
		setCreateNewAddressLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			getAddresses();
			setSelectedAddressForm(null);
		} else {
			context.addSnackMessage(res);
		}
		
	};

	const handleDetailsChange = (e) => {
		let data = {
			...selectedCustomer,
			[e.target.name]: e.target.type === 'number' ?e.target.value? Number(e.target.value):'' : e.target.value
		};

		setSelectedCustomer(data);
	};

	const handleSectionSelect = (value) => {
		if (selectedSection === 'contact') {
			setSelectedContact(value);
		} else if (selectedSection === 'payment') {
			setSelectedPayment(value);
		}
	};
	const handleContactPaymentSave = () => {
		let data;
		if (selectedSection === 'contact') {
			data = { ...selectedCustomer, contactPerson: selectedContact };
		} else if (selectedSection === 'payment') {
			data = { ...selectedCustomer, paymentTerms: selectedPayment };
		}

		setSelectedCustomer(data);
		handleContactPaymentClose();
	};
	const handleContactPaymentClose = () => {
		setSelectedSection('');
		setSelectedContact(null);
		setSelectedPayment(null);
	};
	const handleAddContact = async () => {
		if (selectedContactForm.type == 'add') {
			delete selectedContactForm.type;
			setSelectedContact({ selectedContactForm });
		}
		let form = {
			customerId: customerId,

			contacts: selectedContactForm
		};

		setCreateNewContactLoader(true);
		let res = await createNewContact(form);
		setCreateNewContactLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			getContacts();
			setSelectedContactForm(null);
		} else {
			context.addSnackMessage(res);
		}
	};

	const handleClickCustomerType = () => {
		setOpenCustomerTypeDialog(true);
		setSelectedCustomerType(selectedCustomer.customerType);
		getCustomerType();
	};
	const getCustomerType = async () => {
		let res = await fetchCustomerType();
		if (res && res.status !== 'error') {
			let msg = { message: res.message, key: new Date().getTime(), type: 'success' };
			setCustomerTypes(res.data);
			setAllCustomerTypes(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};

	const handleCusotmerTypeClose = () => {
		setOpenCustomerTypeDialog(false);
		setSelectedCustomerType(null);
	};
	const handleSelectCustomerType = (value) => {
		setSelectedCustomerType(value);
	};
	const handleCustomerTypeSave = () => {
		let data = { ...selectedCustomer, customerType: selectedCustomerType };

		setSelectedCustomer(data);
		handleCusotmerTypeClose();
	};
	const handleDeleteContact = async (contact) => {
		let res = await deleteContact(contact.contactId, customerId);

		if (res && res.status !== 'error') {
			let msg = { message: res.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			getContacts();
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleDeleteAddress = async (address) => {
		let res = await deleteAddress(customerId, address.addressId);

		if (res && res.status !== 'error') {
			let msg = { message: res.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			getAddresses();
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleSearchCustomerType = (e) => {
		let text = e.target.value;
		let searchCustomerTypes = allCustomerTypes && allCustomerTypes;
		searchCustomerTypes = searchCustomerTypes.filter((item) =>
			item.code.toLowerCase().includes(text.toLowerCase())
		);
		setCustomerTypes(searchCustomerTypes);
	};
	const handleSearchPaymentContact = (e) => {
		let text = e.target.value;
		let searchPaymentContact = allSectionalData && allSectionalData;
		if (selectedSection == 'contact') {
			searchPaymentContact = searchPaymentContact.filter((item) =>
				item.contactPerson.toLowerCase().includes(text.toLowerCase())
			);
		} else if (selectedSection == 'payment') {
			searchPaymentContact = searchPaymentContact.filter((item) => {
				return item.paymentType.toLowerCase().includes(text.toLowerCase());
			});
		}
		setSectionalData(searchPaymentContact);
	};

	return (
		<div>
			{selectedCustomer && (
				<div className="container p-0 m-0">
					<div className="row">
						<div className="col-md-4">
							<Card>
								<p className="sectionSubTitle border pl-24 py-2">Details</p>
								<div className="p-8 row m-0">
									<div className="col-md-6">
										<p className="sectionContent"> Name</p>
										<Paper className="border">
											<p className="py-2 px-2">{selectedCustomer.customerName}</p>
										</Paper>
									</div>
									<div className="col-md-6">
										<p className="sectionContent">Status</p>
										<FormControl variant="outlined" className="w-100">
											<Select
												style={{
													height: 30,
													minHeight: 30
												}}
												name="status"
												value={selectedCustomer.status}
												onChange={handleDetailsChange}
											>
												<MenuItem value="Active">Active</MenuItem>
												<MenuItem value="inActive">Inactive</MenuItem>
											</Select>
										</FormControl>
									</div>
									<div className="col-md-6 mt-14">
										<p className="sectionContent">Contact Person</p>
										<OutlinedInput
											variant="outlined"
											type="text"
											placeholder=""
											className="w-100 "
											inputProps={{
												style: {
													fotSize: 10,
													padding: 6
												}
											}}
											name="contact"
											value={
												selectedCustomer && selectedCustomer.contactPerson ? (
													selectedCustomer.contactPerson.contactPerson
												) : (
													''
												)
											}
											readOnly
											onClick={() => handleSectionClick('contact')}
											endAdornment={
												<InputAdornment position="end">
													<SearchIcon
														style={{
															opacity: 0.8,
															fontSize: '14px',
															cursor: 'pointer'
														}}
													/>
												</InputAdornment>
											}
										/>
									</div>

									<div className="col-md-6 mt-14">
										<p className="sectionContent">
											{category === 'Customers' ? 'Customers Type' : 'Supplier Type'}
										</p>
										<OutlinedInput
											variant="outlined"
											type="text"
											placeholder=""
											className="w-100 "
											inputProps={{
												style: {
													fotSize: 10,
													padding: 6
												}
											}}
											value={
												selectedCustomer &&
												selectedCustomer.customerType &&
												selectedCustomer.customerType.code
											}
											name="customerType"
											readOnly
											onClick={handleClickCustomerType}
											endAdornment={
												<InputAdornment position="end">
													<SearchIcon
														style={{
															opacity: 0.8,
															fontSize: '14px',
															cursor: 'pointer'
														}}
													/>
												</InputAdornment>
											}
										/>
									</div>
									<div className="col-md-6  mt-14">
										<p className="sectionContent">Credit Limit</p>

										<TextField
											InputProps={{ style: { height: 31, fotSize: 14 } }}
											required
											type="number"
											name="creditLimit"
											value={selectedCustomer.creditLimit}
											onChange={handleDetailsChange}
											id="outlined-required"
											defaultValue=""
											variant="outlined"
										/>
									</div>

									<div className="col-md-6 mt-14">
										<p className="sectionContent">Payment Terms</p>
										<OutlinedInput
											variant="outlined"
											type="text"
											placeholder=""
											className="w-100 "
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
											readOnly
											name="Payment"
											onClick={() => handleSectionClick('payment')}
											endAdornment={
												<InputAdornment position="end">
													<SearchIcon
														style={{
															opacity: 0.8,
															fontSize: '14px',
															cursor: 'pointer'
														}}
													/>
												</InputAdornment>
											}
										/>
									</div>
									<div className="col-md-12 mt-14">
										<p className="sectionContent">Url</p>
										<OutlinedInput
											variant="outlined"
											type="text"
											name="url"
											value={selectedCustomer.url}
											onChange={handleDetailsChange}
											className="w-100 "
											inputProps={{
												style: {
													fotSize: 10,
													padding: 6
												}
											}}
											endAdornment={
												<InputAdornment position="end">
													<EditIcon
														style={{
															opacity: 0.8,
															fontSize: '14px',
															cursor: 'pointer'
														}}
													/>
												</InputAdornment>
											}
										/>
									</div>

									<div className="col-md-12 mt-12">
										<p className="sectionContent">Note </p>

										<TextField
											id="outlined-multiline-static"
											name="customerNote"
											value={selectedCustomer.customerNote}
											onChange={handleDetailsChange}
											multiline
											rows={2}
											variant="outlined"
											className="w-100"
										/>
									</div>
								</div>
							</Card>
						</div>
						<div className="col-md-8 ">
							<div>
								<Card className="spacingBetween ">
									<p className="sectionSubTitle px-12 py-2">Addresses</p>
									<div className="px-12 py-2">
										<div
											className="circle adjustingCenter"
											onClick={() => {
												handleAddressClick('add');
											}}
										>
											<AddIcon style={{ fontSize: 18 }} className="text-white cursor-pointer" />
										</div>
									</div>
								</Card>

								<div className="row py-2 pr-4 m-0">
									<div className="col-md-6 ">
										<p className="sectionSubTitle"> Name</p>
									</div>
									<div className="col-md-5 ">
										<p className="sectionSubTitle">Addresses</p>
									</div>

									<div className="col-md-1 ">
										<p className="sectionSubTitle pr-4">Actions</p>
									</div>
								</div>

								{addresses &&
									addresses.map((item, index) => (
										<Card className="row p-0 mx-0 py-2 mt-8" key={index}>
											<div className=" col-md-6 borderRight ">
												<p className="sectionContent p-0 m-0 ">{item.companyName}</p>
											</div>
											<div className=" col-md-5 borderRight  ">
												<p className="sectionContent p-0 m-0 ">{item.address} </p>
												<p className="text-10 p-0 m-0 ">
													{item.city} ,{item.state}
												</p>
											</div>

											<div className=" col-md-1 p-0  ">
												<div>
													<p
														className="text-12 editButton text-center m-1"
														onClick={() => {
															handleAddressClick('edit', item);
														}}
													>
														Edit
													</p>
													<div>
														<p
															className="text-12 editButton text-center m-1"
															onClick={() => handleDeleteAddress(item)}
														>
															Del
														</p>
													</div>
												</div>
											</div>
										</Card>
									))}
							</div>
							<div>
								<Card className="spacingBetween mt-24">
									<p className="sectionSubTitle px-12 py-2">Contacts</p>
									<div className="px-12 py-2">
										<div className="circle adjustingCenter  ">
											<AddIcon
												style={{ fontSize: 18 }}
												className="text-white cursor-pointer"
												onClick={() => handleContactClick('add')}
											/>
										</div>
									</div>
								</Card>
								<div className="row  py-2 pr-4 m-0">
									<div className="col-md-4 ">
										<p className="sectionSubTitle">Position</p>
									</div>
									<div className="col-md-4 ">
										<p className="sectionSubTitle">Phone</p>
									</div>
									<div className="col-md-3">
										<p className="sectionSubTitle">Email</p>
									</div>
									<div className="col-md-1">
										<p className="sectionSubTitle pr-4">Actions</p>
									</div>
								</div>

								{contacts &&
									contacts.map((item, index) => (
										<Card className="row p-0 mx-0 py-2 mt-8" key={index}>
											<div className=" col-md-4 borderRight ">
												<p className="sectionContent p-0 m-0 ">{item.contactPerson}</p>
												<p className="sectionContent p-0 m-0 ">{item.position}</p>
											</div>
											<div className=" col-md-4 borderRight  ">
												<p className="sectionContent p-0 m-0 ">{item.mobile} </p>
											</div>
											<div className=" col-md-3 borderRight">
												<p className="sectionContent p-0 m-0 wordBreak ">{item.email} </p>
											</div>
											<div className=" col-md-1 p-0  ">
												<div>
													<p
														className="text-12 editButton text-center m-1"
														onClick={() => handleContactClick('edit', item)}
													>
														Edit
													</p>
												</div>
												<div>
													<p
														className="text-12 editButton text-center m-1"
														onClick={() => handleDeleteContact(item)}
													>
														Del
													</p>
												</div>
											</div>
										</Card>
									))}
							</div>
						</div>
					</div>
					<Dialog
						open={Boolean(selectedAddressForm)}
						aria-labelledby="responsive-dialog-title"
						maxWidth="sm"
						fullWidth={true}
					>
						<DialogTitle>
							<p className="sectionTitle">Address Form</p>
						</DialogTitle>
						<DialogContent>
							<div className="row">
								<div className="col-md-6 mt-16">
									<p className="m-0 sectionContent mb-2">Address</p>
									<TextField
										InputProps={{ style: { height: 40, fotSize: 14 } }}
										name="address"
										value={selectedAddressForm && selectedAddressForm.address}
										fullWidth
										onChange={handleAddressChange}
										variant="outlined"
									/>
								</div>

								<div className="col-md-6 mt-16">
									<p className="m-0 sectionContent mb-2">City</p>
									<TextField
										InputProps={{ style: { height: 40, fotSize: 14 } }}
										name="city"
										value={selectedAddressForm && selectedAddressForm.city}
										fullWidth
										onChange={handleAddressChange}
										variant="outlined"
									/>
								</div>
								<div className="col-md-6 mt-16">
									<p className="m-0 sectionContent mb-2">State</p>
									<TextField
										InputProps={{ style: { height: 40, fotSize: 14 } }}
										name="state"
										value={selectedAddressForm && selectedAddressForm.state}
										fullWidth
										onChange={handleAddressChange}
										variant="outlined"
									/>
								</div>
								<div className="col-md-6  mt-16">
									<p className="m-0 sectionContent mb-2">Primary</p>
									<Switch
										checked={selectedAddressForm && selectedAddressForm.option === 'Primary'}
										onChange={handleAddressChange}
										color="primary"
										name="option"
										inputProps={{ 'aria-label': 'primary checkbox' }}
									/>
								</div>
							</div>
						</DialogContent>
						<DialogActions>
							<div className="mr-4">
								<Button
									color="primary"
									variant="outlined"
									onClick={() => {
										setSelectedAddressForm(null);
									}}
								>
									Cancel
								</Button>
							</div>

							{selectedAddressForm && selectedAddressForm.type === 'add' ? (
								<Button
									color="primary"
									variant="contained"
									className="px-5"
									disabled={
										createNewAddressLoader ||
										(selectedAddressForm &&
											(selectedAddressForm.address === '' ||
												selectedAddressForm.city === '' ||
												selectedAddressForm.state === ''))
									}
									onClick={handleAddAddress}
								>
									Add
								</Button>
							) : (
								<Button
									color="primary"
									variant="contained"
									className="px-5"
									disabled={
										createNewAddressLoader
										// (selectedAddressForm &&
										// 	(selectedAddressForm.address === '' ||
										// 		selectedAddressForm.city === ''))
									}
									onClick={handleAddAddress}
								>
									Save
								</Button>
							)}
						</DialogActions>
					</Dialog>
					<Dialog
						open={Boolean(selectedContactForm)}
						aria-labelledby="responsive-dialog-title"
						maxWidth="sm"
						fullWidth={true}
					>
						<DialogTitle>
							<p className="sectionTitle">Contact Form</p>
						</DialogTitle>
						<DialogContent>
							<div className="row">
								<div className="col-md-6">
									<p className="m-0 sectionContent mb-2">Contact Person</p>
									<TextField
										InputProps={{ style: { height: 40, fotSize: 14 } }}
										name="contactPerson"
										value={selectedContactForm && selectedContactForm.contactPerson}
										fullWidth
										onChange={handleContactChange}
										variant="outlined"
									/>
								</div>
								<div className="col-md-6">
									<p className="m-0 sectionContent mb-2">Position</p>
									<TextField
										InputProps={{ style: { height: 40, fotSize: 14 } }}
										name="position"
										value={selectedContactForm && selectedContactForm.position}
										fullWidth
										onChange={handleContactChange}
										variant="outlined"
									/>
								</div>
								<div className="col-md-6">
									<p className="m-0 sectionContent mb-2">Phone</p>
									<TextField
										InputProps={{ style: { height: 40, fotSize: 14 } }}
										name="mobile"
										value={selectedContactForm && selectedContactForm.mobile}
										fullWidth
										onChange={handleContactChange}
										className="sectionContent"
										variant="outlined"
									/>
								</div>
								<div className="col-md-6  ">
									<p className="m-0 sectionContent mb-2">Email</p>
									<TextField
										fullWidth
										InputProps={{
											style: {
												height: 40
											}
										}}
										className="sectionContent"
										variant="outlined"
										name="email"
										value={selectedContactForm && selectedContactForm.email}
										fullWidth
										onChange={handleContactChange}
									/>
								</div>
							</div>
						</DialogContent>
						<DialogActions>
							<Button color="primary" variant="outlined" onClick={() => setSelectedContactForm(null)}>
								Cancel
							</Button>

							{selectedContactForm && selectedContactForm.type === 'add' ? (
								<Button
									color="primary"
									variant="contained"
									className="px-5"
									disabled={
										createNewContactLoader ||
										(selectedContactForm &&
											(selectedContactForm.email === '' ||
												selectedContactForm.mobile === '' ||
												selectedContactForm.position === ''))
									}
									onClick={handleAddContact}
								>
									Add
								</Button>
							) : (
								<Button
									color="primary"
									variant="contained"
									className="px-5"
									disabled={
										createNewContactLoader
										// (selectedContactForm &&
										// 	(selectedContactForm.email === '' ||
										// 		selectedContactForm.mobile === '' ))
									}
									onClick={handleAddContact}
								>
									Save
								</Button>
							)}
						</DialogActions>
					</Dialog>

					<Dialog
						open={Boolean(selectedSection)}
						onClose={handleContactPaymentClose}
						aria-labelledby="responsive-dialog-title"
						maxWidth="sm"
						fullWidth={true}
					>
						<DialogTitle className="px-4">
							<p className="sectionTitle" style={{ textTransform: 'capitalize' }}>
								{selectedSection}
							</p>
						</DialogTitle>

						<DialogContent className="px-4">
							<TextField
								InputProps={{ style: { height: 35, fotSize: 14 } }}
								required
								id="outlined-required"
								onChange={handleSearchPaymentContact}
								variant="outlined"
								className="w-100 "
							/>

							<div className="container p-0 mt-4">
								<TableContainer component={Paper}>
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell className="sectionSubTitle" align="left">
													Name
												</TableCell>

												<TableCell align="right" className="sectionSubTitle pr-8">
													Action
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{sectionalData &&
												sectionalData.map((row) => (
													<TableRow key={row.id}>
														<TableCell align="left" className="sectionContent">
															{selectedSection === 'contact' ? (
																row.contactPerson
															) : (
																row.paymentType
															)}
														</TableCell>

														<TableCell align="right">
															<Button
																variant="contained"
																color="primary"
																disabled={
																	(selectedSection === 'contact' &&
																		selectedContact &&
																		selectedContact.contactPerson ===
																			row.contactPerson) ||
																	(selectedSection === 'payment' &&
																		selectedPayment &&
																		selectedPayment.paymentType === row.paymentType)
																}
																onClick={() => handleSectionSelect(row)}
															>
																{selectedSection === 'contact' ? (
																	<p
																		className="sectionContent"
																		style={{ color: 'white' }}
																	>
																		{selectedContact &&
																		selectedContact.contactPerson ===
																			row.contactPerson ? (
																			'Selected'
																		) : (
																			'Select'
																		)}
																	</p>
																) : (
																	<p
																		className="sectionContent"
																		style={{ color: 'white' }}
																	>
																		{selectedPayment &&
																		selectedPayment.paymentType ===
																			row.paymentType ? (
																			'Selected'
																		) : (
																			'Select'
																		)}
																	</p>
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
							<Button onClick={handleContactPaymentClose} variant="outlined" color="primary">
								Cancel
							</Button>
							<Button
								onClick={handleContactPaymentSave}
								className="sectionSubTitle px-4"
								variant="contained"
								color="primary"
							>
								Save
							</Button>
						</DialogActions>
					</Dialog>
					<Dialog
						open={openCustomerTypeDialog}
						onClose={handleCusotmerTypeClose}
						aria-labelledby="responsive-dialog-title"
						maxWidth="sm"
						fullWidth={true}
					>
						<DialogTitle className="px-4">
							<p className="sectionTitle" style={{ textTransform: 'capitalize' }}>
								Customer Type
							</p>
						</DialogTitle>

						<DialogContent className="px-4">
							<TextField
								InputProps={{ style: { height: 35, fotSize: 14 } }}
								required
								id="outlined-required"
								onChange={handleSearchCustomerType}
								variant="outlined"
								className="w-100 "
							/>

							<div className="container p-0 mt-4">
								<TableContainer component={Paper}>
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell className="sectionSubTitle" align="left">
													Name
												</TableCell>

												<TableCell align="right" className="sectionSubTitle pr-8">
													Action
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{customerTypes &&
												customerTypes.map((row) => (
													<TableRow key={row.id}>
														<TableCell align="left" className="sectionContent">
															{row.code}
														</TableCell>

														<TableCell align="right">
															<Button
																variant="contained"
																color="primary"
																disabled={
																	selectedCustomerType &&
																	selectedCustomerType.code === row.code
																}
																onClick={() => handleSelectCustomerType(row)}
															>
																<p>
																	{selectedCustomerType &&
																	selectedCustomerType.code === row.code ? (
																		'selected'
																	) : (
																		'select'
																	)}
																</p>
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
							<Button onClick={handleCusotmerTypeClose} variant="outlined" color="primary">
								Cancel
							</Button>
							<Button
								onClick={handleCustomerTypeSave}
								className="sectionSubTitle px-4"
								variant="contained"
								color="primary"
							>
								Save
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			)}
		</div>
	);
};
export default Profile;
