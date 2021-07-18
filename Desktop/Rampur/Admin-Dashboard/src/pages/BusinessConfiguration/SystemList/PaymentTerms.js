import React, { useContext, useEffect, useState } from 'react';
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
import { fetchPayments, createNewPayment, updatePayment, delPayment } from 'api';

const PaymentTerms = (props) => {
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(5);
	const [ selectedPayment, setSelectedPayment ] = useState(null);
	const [ payments, setPayments ] = useState([]);
	const [ allPayments, setAllPayments ] = useState([]);
	const [ paymentsLoader, setPaymentsLoader ] = useState(false);
	const [ selectedPaymentId, setSelectedPaymentId ] = useState(null);
	const [ editPaymentLoader, setEditPaymentLoader ] = useState(false);
	const [ createPaymentLoader, setCreatePaymentLoader ] = useState(false);

	const context = useContext(AppContext);

	useEffect(() => {
		getPayments();
	}, []);
	const getPayments = async () => {
		setPaymentsLoader(true);
		let res = await fetchPayments();
		setPaymentsLoader(false);
		if (res.status !== 'error') {
			setPayments(res.data);
			setAllPayments(res.data);
		} else {
			// context.addSnackMessage(res);
			setPayments([]);
			setAllPayments([]);
		}
	};
	const handleSearchPayment = (e) => {
		let text = e.target.value;
		let updatedPayments = allPayments;
		updatedPayments = updatedPayments.filter((item) => {
			return item.paymentType.toLowerCase().includes(text.toLowerCase());
		});
		setPayments(updatedPayments);
		setRowsPerPage(5);
	};

	const handleChange = (e) => {
		setSelectedPayment({
			...selectedPayment,
			[e.target.name]: e.target.name === 'days' ? parseInt(e.target.value) : e.target.value
		});
	};
	const handlePaymentClick = (type, payment) => {
		if (type === 'add') {
			let obj = {
				paymentType: '',
				days: null,
				type: 'add'
			};
			setSelectedPayment(obj);
		} else if (type === 'edit') {
			setSelectedPayment(payment);
		}
	};
	const handlePaymentDialogClose = () => {
		setSelectedPayment(null);
	};
	const handleAddPayment = async () => {
		setCreatePaymentLoader(true);
		let res = await createNewPayment(selectedPayment);
		setCreatePaymentLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			handlePaymentDialogClose();
			getPayments();
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleEditPayment = async () => {
		setEditPaymentLoader(true);
		let res = await updatePayment(selectedPayment);
		setEditPaymentLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			handlePaymentDialogClose();
			getPayments();
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleDeletePayment = async (payment) => {
		setSelectedPaymentId(true);
		let res = await delPayment(payment);
		setSelectedPaymentId(null);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			getPayments();
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

	return (
		<div>
			<Paper>
				<div className="spacingBetween px-16 pt-2">
					<p className="sectionTitle cursor-pointer">Payment Terms</p>
					<div className="circle adjustingCenter">
						<AddIcon
							style={{ fontSize: 20 }}
							className="text-white cursor-pointer"
							onClick={() => {
								handlePaymentClick('add');
							}}
						/>
					</div>
				</div>

				<div className="px-12">
					<TextField
						inputProps={{ style: { height: 4, fotSize: 20 } }}
						placeholder="Search"
						fullWidth
						onChange={handleSearchPayment}
						margin="normal"
						InputLabelProps={{
							shrink: true,
							fontSize: '12px'
						}}
						variant="outlined"
					/>

					{paymentsLoader ? (
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
												<p className="sectionSubTitle">Payment</p>
											</TableCell>
											<TableCell align="center">
												<p className="sectionSubTitle">Days</p>
											</TableCell>
											<TableCell align="center">
												<p className="sectionSubTitle">Actions</p>
											</TableCell>
										</TableRow>
									</TableHead>
									{payments &&
									payments.length > 0 && (
										<TableBody>
											{payments
												.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
												.map((payment, index) => {
													return (
														<TableRow key={index}>
															<TableCell align="left" className="sectionContent">
																{payment.paymentType}
															</TableCell>
															<TableCell align="center" className="sectionContent">
																{payment.days}
															</TableCell>
															<TableCell className="sectionContent " align="center">
																<Button
																	variant="outlined"
																	style={{
																		backgroundColor: '#f5f5f5'
																	}}
																	className="py-0 px-4 m-0"
																	size="small"
																	onClick={() => handlePaymentClick('edit', payment)}
																>
																	Edit
																</Button>
																<Button
																	variant="outlined"
																	style={{
																		backgroundColor: '#f5f5f5'
																	}}
																	className="cursor-pointer px-0 m-0 ml-2 py-0 "
																	disabled={selectedPaymentId === payment.id}
																	onClick={() => handleDeletePayment(payment)}
																>
																	{selectedPaymentId === payment.id ? (
																		'Deleting....'
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
							{payments &&
							payments.length > 0 && (
								<TablePagination
									style={{ fontSize: '15px' }}
									rowsPerPageOptions={[ 5, 10, 25 ]}
									component="div"
									count={payments && payments.length ? payments.length : 0}
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

			{selectedPayment && (
				<Dialog open={Boolean(selectedPayment)} maxWidth="sm" fullWidth={true}>
					<DialogTitle>
						<p className="sectionTitle">
							{selectedPayment.type === 'add' ? 'Add Payment' : 'Edit Payment'}
						</p>
					</DialogTitle>
					<DialogContent>
						<div className="d-flex flex-row align-items-center justify-content-between">
							<div style={{ width: '48%' }}>
								<p className="m-0 text-14 mb-2">Payment</p>
								<TextField
									fullWidth
									inputProps={{
										style: {
											height: 6
										}
									}}
									className="text-14"
									variant="outlined"
									name="paymentType"
									value={selectedPayment.paymentType}
									onChange={handleChange}
								/>
							</div>
							<div style={{ width: '48%' }}>
								<p className="m-0 text-14 mb-2">Days</p>
								<TextField
									fullWidth
									inputProps={{
										style: {
											height: 6
										}
									}}
									className="text-14"
									variant="outlined"
									name="days"
									type="number"
									value={parseInt(selectedPayment.days)}
									onChange={handleChange}
								/>
							</div>
						</div>
					</DialogContent>
					<DialogActions>
						<div className="mr-4">
							<Button color="primary" variant="outlined" onClick={handlePaymentDialogClose}>
								Cancel
							</Button>
						</div>
						{selectedPayment.type === 'add' ? (
							<Button
								color="primary"
								variant="contained"
								className="px-5"
								disabled={createPaymentLoader || selectedPayment.paymentType === "" || selectedPayment.days === null}
								onClick={handleAddPayment}
							>
								{createPaymentLoader ? 'Adding...' : 'Add'}
							</Button>
						) : (
							<Button
								color="primary"
								variant="contained"
								className="px-5"
								disabled={editPaymentLoader || selectedPayment.paymentType === "" || selectedPayment.days === null}
							
								onClick={handleEditPayment}
							>
								{editPaymentLoader ? 'Updating...' : 'Update'}
							</Button>
						)}
					</DialogActions>
				</Dialog>
			)}
		</div>
	);
};
export default PaymentTerms;
