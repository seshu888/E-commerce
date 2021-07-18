import React, { useContext, useEffect } from 'react';
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
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import LoaderComponent from 'components/LoaderComponent';
import {

	fetchTaxes,
	createNewTax,
	updateTax,
	delTax,

} from 'api';

const TaxCodes = (props) => {
	const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ selectedTax, setSelectedTax ] = React.useState(null);
	const [ taxes, setTaxes ] = React.useState([]);
	const [ allTaxes, setAllTaxes ] = React.useState([]);
	const [ taxesLoader, setTaxesLoader ] = React.useState(false);
	const [ selectedTaxId, setSelectedTaxId ] = React.useState(null);
	const [ editTaxLoader, setEditTaxLoader ] = React.useState(false);
	const [ createTaxLoader, setCreateTaxLoader ] = React.useState(false);

	const context = useContext(AppContext);

	useEffect(() => {
		getTaxes();
	}, []);

	const getTaxes = async () => {
		setTaxesLoader(true);
		let res = await fetchTaxes();
		setTaxesLoader(false);
		if (res.status !== 'error') {
			setTaxes(res.data);
			setAllTaxes(res.data);
		} else {
			context.addSnackMessage(res);
			setTaxes([]);
			setAllTaxes([]);
		}
	};

	const handleChange = (e) => {
		setSelectedTax({
			...selectedTax,
			[e.target.name]: e.target.value
		});
	};
	const handleSearchTax = (e) => {
		let text = e.target.value;

		let updatedTaxes = allTaxes;
		updatedTaxes = updatedTaxes.filter((item) => {
			return item.code.toLowerCase().includes(text.toLowerCase());
		});
		setTaxes(updatedTaxes);
		setRowsPerPage(5);
	};
	const handleTaxClick = (type, tax) => {
		if (type === 'add') {
			let obj = {
				code: '',
				rate: '',
				type: 'add'
			};
			setSelectedTax(obj);
		} else if (type === 'edit') {
			
			let rateSplit = tax.rate ? tax.rate.split(' ') : [];
			let rateVal = rateSplit[0] ? parseFloat(rateSplit[0]) : null;
			let updatedTax = { ...tax, rate: JSON.stringify(rateVal) };
			setSelectedTax(updatedTax);
		}
	};
	const handleTaxDialogClose = () => {
		setSelectedTax(null);
	};
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	const handleAddTax = async () => {
		setCreateTaxLoader(true);
		let res = await createNewTax(selectedTax);
		setCreateTaxLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			handleTaxDialogClose();
			getTaxes();
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleEditTax = async () => {
		setEditTaxLoader(true);
		let res = await updateTax(selectedTax);
		setEditTaxLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			handleTaxDialogClose();
			getTaxes();
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleDeleteTax = async (tax) => {
		setSelectedTaxId(tax.id);
		let res = await delTax(tax);
		setSelectedTaxId(null);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			getTaxes();
		} else {
			context.addSnackMessage(res);
		}
	};


	return (
		<div>
			<Paper>
				<div className="spacingBetween px-16 pt-2">
					<p className="sectionTitle cursor-pointer">Tax Codes</p>
					<div className="circle adjustingCenter">
						<AddIcon
							style={{ fontSize: 20 }}
							className="text-white cursor-pointer"
							onClick={() => {
								handleTaxClick('add');
							}}
						/>
					</div>
				</div>

				<div className="px-12">
					<TextField
						inputProps={{ style: { height: 4, fotSize: 20 } }}
						placeholder="Search"
						fullWidth
						onChange={handleSearchTax}
						margin="normal"
						InputLabelProps={{
							shrink: true,
							fontSize: '12px'
						}}
						variant="outlined"
					/>

					{taxesLoader ? (
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
												<p className="sectionSubTitle">Rate</p>
											</TableCell>

											<TableCell align="center">
												<p className="sectionSubTitle">Actions</p>
											</TableCell>
										</TableRow>
									</TableHead>
									{taxes &&
									taxes.length > 0 && (
										<TableBody>
											{taxes
												.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
												.map((tax, index) => {
													return (
														<TableRow key={index}>
															<TableCell align="left" className="sectionContent">
																{tax.code}
															</TableCell>
															<TableCell align="center" className="sectionContent">
																{tax.rate}
															</TableCell>
															<TableCell className="sectionContent " align="center">
																<Button
																	variant="outlined"
																	style={{
																		backgroundColor: '#f5f5f5'
																	}}
																	className="py-0 px-4 m-0"
																	size="small"
																	onClick={() => handleTaxClick('edit', tax)}
																>
																	Edit
																</Button>

																<Button
																	variant="outlined"
																	style={{
																		backgroundColor: '#f5f5f5'
																	}}
																	className="cursor-pointer px-0 m-0 ml-2 py-0"
																	disabled={tax.id === selectedTaxId}
																	onClick={() => handleDeleteTax(tax)}
																>
																	{tax.id === selectedTaxId ? (
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
							{taxes &&
							taxes.length > 0 && (
								<TablePagination
									style={{ fontSize: '15px' }}
									rowsPerPageOptions={[ 5, 10, 25 ]}
									component="div"
									count={taxes && taxes.length ? taxes.length : 0}
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

			{selectedTax && (
				<Dialog open={Boolean(selectedTax)} maxWidth="sm" fullWidth={true}>
					<DialogTitle>
						<p className="sectionTitle">{selectedTax.type === 'add' ? 'Add Tax' : 'Edit Tax'}</p>
					</DialogTitle>
					<DialogContent>
						<div className="d-flex flex-row align-items-center justify-content-between">
							<div style={{ width: '48%' }}>
								<p className="m-0 text-14 mb-2">Tax</p>
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
									value={selectedTax.code}
									onChange={handleChange}
								/>
							</div>
							<div style={{ width: '48%' }}>
								<p className="m-0 text-14 mb-2">Rate</p>
								<OutlinedInput
							
								fullWidth
								value={selectedTax.rate}
								onChange={handleChange}
								variant="outlined"
									name="rate"
									type="number"
									className="text-14"
								inputProps={{
									style: {
										height: 6
									}
								}}
								endAdornment={
									<InputAdornment position="end">
										<div>
											<p style={{ fontSize: 20 }}
											className=" cursor-pointer">%</p>

											
										</div>
									</InputAdornment>
								}
							/>
								
							</div>
						</div>
					</DialogContent>
					<DialogActions>
						<div className="mr-4">
							<Button color="primary" variant="outlined" onClick={handleTaxDialogClose}>
								Cancel
							</Button>
						</div>
						{selectedTax.type === 'add' ? (
							<Button
								color="primary"
								variant="contained"
								className="px-5"
								disabled={createTaxLoader || selectedTax.rate === '' || selectedTax.tax  === ''}
								onClick={handleAddTax}
							>
								{createTaxLoader ? 'Adding...' : 'Add'}
							</Button>
						) : (
							<Button
								color="primary"
								variant="contained"
								className="px-5"
							
								disabled={editTaxLoader || selectedTax.rate === '' || selectedTax.tax  === ''}
								onClick={handleEditTax}
							>
								{editTaxLoader ? 'Updating...' : 'Update'}
							</Button>
						)}
					</DialogActions>
				</Dialog>
			)}
		</div>
	);
};
export default TaxCodes;
