import React, { useContext, useEffect ,useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import AddIcon from '@material-ui/icons/Add';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';



import 'date-fns';


import AppContext from 'context/AppContext';

import LoaderComponent from 'components/LoaderComponent';
import {

	fetchCustomerType,
	createNewCustomerType,	updateCustomerType,	delCustomerType
} from 'api';

const CustomerType = (props) => {
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(5);
	const [ selectedCustomer, setSelectedCustomer ] = useState(null);
	const [ customers, setCustomers ] = useState([]);
	const [ allCustomers, setAllCustomers ] = useState([]);
	const [ customerLoader, setCustomerLoader ] = useState(false);

	const [ editCustomerLoader, setEditCustomerLoader ] = useState(false);
    const [ createCustomerLoader, setCreateCustomerLoader ] = useState(false);
    const [deleteCustomerLoader,setDeleteCustomerLoader]=useState(false)

	const context = useContext(AppContext);

	useEffect(() => {
		getCustomers();
	}, []);

	const getCustomers = async () => {
		setCustomerLoader(true);
		let res = await fetchCustomerType();
		setCustomerLoader(false);
		if (res.status !== 'error') {
			setCustomers(res.data);
			setAllCustomers(res.data);
		} else {
			context.addSnackMessage(res);
			setCustomers([]);
			setAllCustomers([]);
		}
	};

	const handleChange = (e) => {
		setSelectedCustomer({
			...selectedCustomer,
			[e.target.name]: e.target.value
		});
	};
	const handleSearchCustomer = (e) => {
		let text = e.target.value;

		let updatedCustomers = allCustomers;
		updatedCustomers = updatedCustomers.filter((item) => {
			return item.code.toLowerCase().includes(text.toLowerCase());
		});
		setCustomers(updatedCustomers);
		setRowsPerPage(5);
	};
	const handleCustomerClick = (type, customer) => {
		if (type === 'add') {
			let obj = {
				code: '',
				rate: '',
				type: 'add'
			};
			setSelectedCustomer(obj);
		} else if (type === 'edit') {
			setSelectedCustomer(customer);
		}
	};
	const handleCustomerDialogClose = () => {
		setSelectedCustomer(null);
	};
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	const handleAddCustomer = async () => {
		setCreateCustomerLoader(true);
		let res = await createNewCustomerType(selectedCustomer);
		setCreateCustomerLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			handleCustomerDialogClose();
			getCustomers();
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleEditCustomer = async () => {
		setEditCustomerLoader(true);
		let res = await updateCustomerType(selectedCustomer);
		setEditCustomerLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			handleCustomerDialogClose();
			getCustomers();
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleDeleteCustomer = async (customer) => {
		setDeleteCustomerLoader(true)
		let res = await delCustomerType(customer);
		setDeleteCustomerLoader(false)
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			getCustomers();
		} else {
			context.addSnackMessage(res);
		}
	};


	return (
		<div>
			<Paper>
				<div className="spacingBetween px-16 pt-2">
					<p className="sectionTitle cursor-pointer">Customer/Supplier Types</p>
					<div className="circle adjustingCenter">
						<AddIcon
							style={{ fontSize: 20 }}
							className="text-white cursor-pointer"
							onClick={() => {
								handleCustomerClick('add');
							}}
						/>
					</div>
				</div>

				<div className="px-12">
					<TextField
						inputProps={{ style: { height: 4, fotSize: 20 } }}
						placeholder="Search"
						fullWidth
						onChange={handleSearchCustomer}
						margin="normal"
						InputLabelProps={{
							shrink: true,
							fontSize: '12px'
						}}
						variant="outlined"
					/>

					{customerLoader ? (
						<React.Fragment>
							{[ 1, 2, 3, 4, 5 ].map((loader, index) => (
								<LoaderComponent key={index} width="100%" height={63} classes="mb-3" />
							))}
						</React.Fragment>
					) : (
						<React.Fragment>
							<TableContainer>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell align="left">
												<p className="sectionSubTitle">Code</p>
											</TableCell>
											

											<TableCell align="center">
												<p className="sectionSubTitle">Actions</p>
											</TableCell>
										</TableRow>
									</TableHead>
									{customers &&
									customers.length > 0 && (
										<TableBody>
											{customers
												.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
												.map((customer, index) => {
													return (
														<TableRow key={index}>
															<TableCell align="left" className="sectionContent">
																{customer.code}
															</TableCell>
															
															<TableCell className="sectionContent " align="center">
																<Button
																	variant="outlined"
																	style={{
																		backgroundColor: '#f5f5f5'
																	}}
																	className="py-0 px-4 m-0"
																	size="small"
																	onClick={() => handleCustomerClick('edit', customer)}
																>
																	Edit
																</Button>

																<Button
																	variant="outlined"
																	style={{
																		backgroundColor: '#f5f5f5'
																	}}
																	className="cursor-pointer px-0 m-0 ml-2 py-0"
																	
																	onClick={() => handleDeleteCustomer(customer)}
																>
																	{deleteCustomerLoader? (
																		'Deleting...'
																	) : (
																		'Delete'
																	)}
																</Button>
															</TableCell>
														</TableRow>
													);
												})}
										</TableBody>
									)}
								</Table>
							</TableContainer>
							{customers &&
							customers.length > 0 && (
								<TablePagination
									style={{ fontSize: '15px' }}
									rowsPerPageOptions={[ 5, 10, 25 ]}
									component="div"
									count={customers && customers.length ? customers.length : 0}
									rowsPerPage={rowsPerPage}
									page={page}
									onChangePage={handleChangePage}
									onChangeRowsPerPage={handleChangeRowsPerPage}
								/>
							)}
						</React.Fragment>
					)}
				</div>
			</Paper>

			{selectedCustomer && (
				<Dialog open={Boolean(selectedCustomer)} maxWidth="sm" fullWidth={true}>
					<DialogTitle>
						<p className="sectionTitle">{selectedCustomer.type === 'add' ? 'Add Customer Type' : 'Edit Customer Type'}</p>
					</DialogTitle>
					<DialogContent>
						<div className="d-flex flex-row align-items-center justify-content-between">
							<div style={{ width: '48%' }}>
								<p className="m-0 text-14 mb-2">Code</p>
								<TextField
									fullWidth
									inputProps={{
										style: {
											height: 6
										}
									}}
									className="text-14"
									variant="outlined"
									name="code"
									value={selectedCustomer.code}
									onChange={handleChange}
								/>
							</div>
						
								
							
						</div>
					</DialogContent>
					<DialogActions>
						<div className="mr-4">
							<Button color="primary" variant="outlined" onClick={handleCustomerDialogClose}>
								Cancel
							</Button>
						</div>
						{selectedCustomer.type === 'add' ? (
							<Button
								color="primary"
								variant="contained"
								className="px-5"
								disabled={createCustomerLoader ||  selectedCustomer.code  === ''}
								onClick={handleAddCustomer}
							>
								{createCustomerLoader ? 'Adding...' : 'Add'}
							</Button>
						) : (
							<Button
								color="primary"
								variant="contained"
								className="px-5"
							
								disabled={editCustomerLoader ||  selectedCustomer.code  === ''}
								onClick={handleEditCustomer}
							>
								{editCustomerLoader ? 'Updating...' : 'Update'}
							</Button>
						)}
					</DialogActions>
				</Dialog>
			)}
		</div>
	);
};
export default CustomerType;
