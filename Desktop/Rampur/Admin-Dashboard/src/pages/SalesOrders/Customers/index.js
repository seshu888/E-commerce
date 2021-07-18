import React, { useState, useContext, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Chip } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';
import { blue } from '@material-ui/core/colors';

import 'date-fns';

import { createNewCustomer, fetchCustomers, updateCustomer } from 'api';
import Layout from 'layout/Layout';
import AppContext from 'context/AppContext';
import LoaderComponent from 'components/LoaderComponent';
import Profile from './Profile';

export default function CustomerList(props) {
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(5);

	const [ createNewCustomerDialog, setCreateNewCustomerDialog ] = useState(false);
	const [ selectedCustomerId, setSelectedCustomerId ] = useState(null);
	const [ salesLoader, setSalesLoader ] = useState(false);
	const [ sales, setSales ] = useState([]);
	const [ allSales, setAllSales ] = useState([]);
	const [ savingData, setSavingData ] = useState(false);
	const [ newCustomer, setNewCustomer ] = useState({
		customerName: '',
		// address: { city: '', state: '', address: '' },
		contact: { contactPerson: '' }
		// status: ''
	});
	const [ selectedCustomerName, setSelectedCustomerName ] = useState(null);
	const [ updatedCustomer, setUpdatedCustomer ] = useState(null);
	const [ createNewCustomerLoader, setCreateNewCustomerLoader ] = useState(false);

	const [ isFrom, setIsFrom ] = useState(
		props && props.location && props.location.pathname === '/VendorList' ? 'Suppliers' : 'Customers'
	);
	const context = useContext(AppContext);

	useEffect(
		() => {
			let category;
			if (props && props.location && props.location.pathname === '/VendorList') {
				category = 'Suppliers';
			} else {
				category = 'Customers';
			}

			setSelectedCustomerId(null);
			setIsFrom(category);
			getCustomers(category);
		},
		[ props.location ]
	);

	const getCustomers = async (category) => {
		setSalesLoader(true);
		let res = await fetchCustomers(category);

		setSalesLoader(false);
		if (res.status !== 'error') {
			setSales(res.data);
			setAllSales(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleNewCustomerDialogOpen = () => {
		setCreateNewCustomerDialog(true);
	};
	const handleNewCustomer = (e) => {
		setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
	};
	// const handleCustomerAddressChange = (e) => {
	// 	setNewCustomer({
	// 		...newCustomer,
	// 		address: { ...newCustomer.address, [e.target.name]: e.target.value }
	// 	});
	// };
	const handleCustomerContactChange = (e) => {
		setNewCustomer({
			...newCustomer,
			contact: { ...newCustomer.contact, [e.target.name]: e.target.value },
			category: isFrom === 'Customers' ? 'Customers' : 'Suppliers'
		});
	};

	const handleSearch = (e) => {
		let text = e.target.value;

		let allRows = allSales && allSales;
		allRows = allRows.filter((item) => {
			return (
				// item.customerName.toLowerCase().includes(text.toLowerCase()) ||
				item.contactPerson.toLowerCase().includes(text.toLowerCase())
			);
		});
		setSales(allRows);

		setRowsPerPage(5);
	};

	const handleClose = () => {
		setNewCustomer({
			customerName: '',
			// address: { city: '', state: '', address: '' },
			contact: { contactPerson: '' }
			// status: ''
		});
		setCreateNewCustomerDialog(false);
	};

	const handleCustomerClick = (sale) => {
		setSelectedCustomerId(sale.customerId);
		setSelectedCustomerName(sale.customerName);
	};
	const handleCreateNewCustomer = async () => {
		setCreateNewCustomerLoader(true);
		let res = await createNewCustomer(newCustomer);
		setCreateNewCustomerLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			getCustomers(isFrom);
			setSelectedCustomerId(res.customerId);
			handleClose();
		} else {
			context.addSnackMessage(res);
		}
	};
	const updateSelectedCustomer = (value) => {
		setUpdatedCustomer(value);
	};

	const saveCustomerDetails = async () => {
		setSavingData(true);
		let customerDetails = { ...updatedCustomer, customerId: selectedCustomerId };
		let res = await updateCustomer(customerDetails);
		setSavingData(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			getCustomers(isFrom);
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleNavigateCustomers = () => {
		setSelectedCustomerId(null);
		getCustomers(isFrom);
	};

	return (
		<Layout history={props.history}>
			<div className="p-24">
				<div>
					<div className="spacingBetween py-16 ">
						<p className="pageHeader textHover" onClick={handleNavigateCustomers}>
							{isFrom === 'Customers' ? 'Customers' : 'Suppliers'}
						</p>

						{selectedCustomerId ? (
							<div className="d-flex flex-row ">
								<p
									className="sectionTitle mr-12 pt-8"
									style={{
										color: blue[600],
										cursor: 'pointer',
										borderBottom: '1px solid blue'
									}}
								>
									Profile
								</p>
								<Button
									variant="contained"
									color="primary"
									disabled={savingData}
									onClick={saveCustomerDetails}
								
								>
									<p className="px-12 py-0 text-14">{savingData ? 'Saving...' : 'Save'}</p>
								</Button>
							</div>
						) : (
							<Button
								onClick={handleNewCustomerDialogOpen}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="contained"
								color="primary"
							>
								<p> {isFrom === 'Customers' ? 'New Customer' : 'New Supplier'}</p>
								<AddIcon className="mb-1 cursor-pointer" />
							</Button>
						)}
					</div>
					{!selectedCustomerId && (
						<div>
							<div className="row">
								<div className="col-md-12">
									<TextField
										InputProps={{ style: { height: 40, fotSize: 14 } }}
										id="outlined-full-width"
										style={{ fontSize: '20px !important' }}
										placeholder="Search"
										fullWidth
										onChange={handleSearch}
										margin="normal"
										InputLabelProps={{
											shrink: true,
											fontSize: '12px'
										}}
										variant="outlined"
									/>
								</div>
								<div className="col-md-3" />
							</div>
							<Paper>
								{salesLoader ? (
									<React.Fragment>
										{[ 1, 2, 3, 4, 5 ].map((loader, index) => (
											<LoaderComponent key={index} width="100%" height={63} classes="mb-3" />
										))}
									</React.Fragment>
								) : (
									<React.Fragment>
										<TableContainer>
											<Table aria-labelledby="tableTitle" aria-label="enhanced table">
												<TableHead>
													<TableRow>
														<TableCell align="left" className="sectionSubTitle">
															{isFrom === 'Customers' ? 'Customer' : ' Supplier'}
														</TableCell>
														<TableCell align="center" className="sectionSubTitle">
															SalesPerson
														</TableCell>
														<TableCell align="center" className="sectionSubTitle">
															City
														</TableCell>
														<TableCell align="center" className="sectionSubTitle">
															State
														</TableCell>
														<TableCell align="center" className="sectionSubTitle">
															Status
														</TableCell>
													</TableRow>
												</TableHead>
												{sales &&
												sales.length > 0 && (
													<TableBody>
														{sales
															.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
															.map((sale, index) => {
																return (
																	<TableRow key={index}>
																		<TableCell
																			align="left"
																			className="sectionContent textHover "
																			style={{ color: blue[600] }}
																			onClick={() => handleCustomerClick(sale)}
																		>
																			{sale.customerName}
																		</TableCell>
																		<TableCell
																			align="center"
																			className="sectionContent"
																		>
																			{sale.contactPerson}
																		</TableCell>
																		<TableCell
																			align="center"
																			className="sectionContent"
																		>
																			{sale.city}
																		</TableCell>

																		<TableCell
																			align="center"
																			className="sectionContent"
																		>
																			{sale.state}
																		</TableCell>

																		<TableCell
																			className="sectionContent "
																			align="center"
																		>
																			{sale.status === 'Active' ? (
																				<Chip
																					size="small"
																					mr={1}
																					mb={1}
																					label="Active"
																					style={{
																						backgroundColor: '#4caf50',
																						color: 'white',

																						fontSize: '13px'
																					}}
																					className="px-2"
																				/>
																			) : (
																				<Chip
																					size="small"
																					mr={1}
																					mb={1}
																					label="InActive"
																					style={{
																						backgroundColor: '#f57c00',

																						color: 'white',
																						fontSize: '13px'
																					}}
																					className="px-2"
																				/>
																			)}
																		</TableCell>
																	</TableRow>
																);
															})}
													</TableBody>
												)}
											</Table>
										</TableContainer>
										<TablePagination
											style={{ fontSize: '15px' }}
											rowsPerPageOptions={[ 5, 10, 25 ]}
											component="div"
											count={sales && sales.length ? sales.length : []}
											rowsPerPage={rowsPerPage}
											page={page}
											onChangePage={handleChangePage}
											onChangeRowsPerPage={handleChangeRowsPerPage}
										/>
									</React.Fragment>
								)}
							</Paper>
						</div>
					)}
				</div>

				{selectedCustomerId ? (
					<div>
						<Profile
							customerId={selectedCustomerId}
							updateSelectedCustomer={updateSelectedCustomer}
							category={isFrom && isFrom}
						/>
					</div>
				) : (
					<div />
				)}

				<div>
					<Dialog
						open={createNewCustomerDialog}
						onClose={handleClose}
						aria-labelledby="responsive-dialog-title"
						className="p-24"
					>
						<DialogTitle>
							<p className="sectionTitle"> Create {isFrom === 'Customers' ? 'Customer' : 'Supplier'}</p>
						</DialogTitle>
						<DialogContent>
							<div>
								<div className=" d-flex">
									<div>
										<p className="m-0 sectionContent mb-2">
											{isFrom === 'Customers' ? 'Customer' : 'Supplier'} Name
										</p>
										<TextField
											required
											InputProps={{ style: { height: 35, fotSize: 14 } }}
											name="customerName"
											value={newCustomer.customerName}
											onChange={handleNewCustomer}
											variant="outlined"
											style={{ marginRight: '20px', width: '230px' }}
										/>
									</div>
									<div>
										<p className="m-0 sectionContent mb-2">Contact Name</p>
										<TextField
											required
											InputProps={{ style: { height: 35, fotSize: 14 } }}
											name="contactPerson"
											value={newCustomer.contact.contactPerson}
											onChange={handleCustomerContactChange}
											variant="outlined"
											style={{ marginRight: '20px', width: '230px' }}
										/>
									</div>
								</div>
							</div>
						</DialogContent>

						<DialogActions>
							<Button color="primary" variant="outlined" onClick={handleClose}>
								Cancel
							</Button>
							<Button
								onClick={handleCreateNewCustomer}
								disabled={newCustomer.contact.contactPerson === '' || newCustomer.customerName === ''}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="contained"
								color="primary"
							>
								Execute
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			</div>
		</Layout>
	);
}

// {selectedCustomerId && (
// 	<span className="mr-auto mt-3 ml-2">
// 		<span className="mx-2 sectionTitle " style={{ cursor: 'pointer' }}>
// 			<span>/</span> {selectedCustomerName}
// 		</span>
// 	</span>
// )}
