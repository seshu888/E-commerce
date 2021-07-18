import React, { useContext, useEffect, useState } from 'react';
import Layout from 'layout/Layout';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Chip } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import 'date-fns';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';

import Details from './Details';
import Items from './Items';
import AppContext from 'context/AppContext';
import LoaderComponent from 'components/LoaderComponent';
import { fetchSales, createNewSale, fetchCusotmersList, UpdateSalesOrder, UpdateSalesOrderCustomerDetails } from 'api';
import Currency from 'components/Currency';

export default function Sales(props) {
	const [ selectedTab, setSelectedTab ] = useState(null);

	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(5);
	const [ createSaleDialogOpen, setCreateSaleDialogOpen ] = useState(false);
	const [ selectedDate, setSelectedDate ] = useState(new Date());
	const [ newSale, setNewSale ] = useState({ customer: '', priority: '', date: null });
	const [ salesLoader, setSalesLoader ] = useState(false);
	const [ customerListDialog, setCustomerListDialog ] = useState(false);
	const [ customerDetails, setCustomerDetails ] = useState(null);
	const [ isFrom, setIsFrom ] = useState(
		props && props.location && props.location.pathname === '/PurchaseOrderList' ? 'Purchases' : 'Sales'
	);
	const [disableSaveForItems,setDisableSaveForItems]=useState(false)
	const [ selectedCustomer, setSelectedCustomer ] = useState(null);
	const [ customerList, setCustomerList ] = useState([]);
	const [ allCustomerList, setAllCustomerList ] = useState([]);
	const [ sales, setSales ] = useState([]);
	const [ createSaleLoader, setCreateSaleLoader ] = useState(false);
	const [ allSales, setAllSales ] = useState([]);
	const [ orderItemDetails, setOrderItemDetails ] = useState(null);
	const [ savingData, setSavingData ] = useState(false);
	const context = useContext(AppContext);
	const [ orderItemId, setOrderItemId ] = useState(null);
	const [ customerId, setCustomerId ] = useState(null);

	useEffect(
		() => {
			let category;
			if (props && props.location && props.location.pathname === '/PurchaseOrderList') {
				category = 'Purchases';
			} else {
				category = 'Sales';
			}
			setIsFrom(category);

			getSales(category);
		},
		[ props.location ]
	);

	const getSales = async (category) => {
		setSalesLoader(true);
		let res = await fetchSales(category);
		setSalesLoader(false);
		if (res.status !== 'error') {
			setSales(res.data);
			setAllSales(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};

	const handleChangeTab = (tab) => {
		setSelectedTab(tab);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleSale = (row) => {
		setOrderItemId(row.orderId);
		setCustomerId(row.customerId);
		setSelectedTab('items');
	};
	const handleSaleAddDialog = () => {
		setCreateSaleDialogOpen(true);
	};
	const handleCreateNewSale = async () => {
		let updatedNewSale = {
			...newSale,
			deliveryDate: moment(newSale.date).format('MMM DD YYYY hh:mm:ss'),
			createdBy: context.user.name,
			customer: selectedCustomer && selectedCustomer.customerId
		};

		setCreateSaleLoader(true);
		let res = await createNewSale(updatedNewSale);
		setCreateSaleLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			handleCreateSaleClose();
			getSales(newSale.category);
			setOrderItemId(res.orderId);
			setSelectedTab('items');
			setCustomerId(res.customerId);
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleCreateSaleClose = () => {
		setCreateSaleDialogOpen(false);
		setNewSale({ customer: '', priority: '', date: null });
		setSelectedCustomer(null);
	};

	const handleNewSale = (e, type) => {
		if (type === 'date') {
			setNewSale({ ...newSale, date: e });
		} else {
			setNewSale({
				...newSale,
				[e.target.name]: e.target.value,
				category: isFrom === 'Sales' ? 'Sales' : 'Purchases'
			});
		}
	};
	const handleCustomerListDialogClose = () => {
		setCustomerListDialog(false);
	};
	const handleSaveSelectedCustomer = () => {
		setNewSale({ ...newSale, customer: selectedCustomer && selectedCustomer.customerId });
		handleCustomerListDialogClose();
	};

	const handleCustomerListDilaog = () => {
		setCustomerListDialog(true);
		getCustomerList();
	};

	const getCustomerList = async () => {
		let categoryForCustomerList = isFrom === 'Purchases' ? 'Purchases' : 'Sales';
		let res = await fetchCusotmersList(categoryForCustomerList);
		if (res && res.status !== 'error') {
			let msg = { message: res.message, key: new Date().getTime(), type: 'success' };
			// context.addSnackMessage(msg);
			setCustomerList(res.data);
			setAllCustomerList(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleSearchForSales = (e) => {
		let text = e.target.value;
		let updatedSales = allSales;
		updatedSales = updatedSales.filter(
			(item) =>
				item.customer.toLowerCase().includes(text.toLowerCase()) ||
				item.createdBy.toLowerCase().includes(text.toLowerCase()) ||
				item.priority.toLowerCase().includes(text.toLowerCase())
		);
		setSales(updatedSales);
	};

	const handleSelectCustomer = (item) => {
		setSelectedCustomer(item);
	};
	const handleCustomerListSearch = (e) => {
		let text = e.target.value;
		let updatedCustomersList = allCustomerList;
		updatedCustomersList = updatedCustomersList.filter((item) =>
			item.name.toLowerCase().includes(text.toLowerCase())
		);
		setCustomerList(updatedCustomersList);
	};
	const updateOrderItemDetails = (data) => {
	// 	let items= data && data.items?data.items:[];
	// 	if(items.length>0){let ind = items.findIndex((item)=>{
	// 		item.unitPrice == 0 || item.unitPrice == null
	// 	})
	// 	if(ind){
	// 		setDisableSaveForItems(true)
	// 	}
	// }
		setOrderItemDetails(data);
	};
	const updateOrderCustomerDetails = (data) => {
		setCustomerDetails(data);
	};
	const handleSave = async () => {
		if (selectedTab === 'items') {
			setSavingData(true);

			let items = orderItemDetails && orderItemDetails.items ? orderItemDetails.items : [];

			items.forEach((item) => {
				return (item.itemDueDate = moment(item.itemDueDate).format(
					'MMM DD YYYY hh:mm:ss',
					(item.type = 'Part')
				));
			});
			
			if (orderItemDetails.summary) {
				orderItemDetails.totalOrderCost= orderItemDetails.summary.discountedTotal;
			}
			let data = { ...orderItemDetails, items, updatedBy: context.user.name };

			if (data && data.backUpItems) {
				let deletedItems = (data.backUpItems ? data.backUpItems : []).filter((backUpItem) => {
					let ind = data.items.findIndex((item) => {
						return item.itemNumber === backUpItem.itemNumber;
					});
					let filteredItem;
					if (ind >= 0) {
						filteredItem = null;
					} else {
						filteredItem = backUpItem;
					}
					return filteredItem;
				});

				data = { ...orderItemDetails, deletedItems };
			}
			if (data && data.discountInfo && data.discountInfo !== null) {
				if (data.discountInfo.discountType === '%') {
					delete data.discountInfo.discountRate;
				} else if (data.discountInfo.discountType === '₹') {
					delete data.discountInfo.perRate;
				}
			}
			
			// let newItems = data.items.length>0?data.items:null;
			// let newDelItems = data.deletedItems.length>0?data.deletedItems:null;
			delete data.backUpItems;
			let newData = { ...data, updatedBy: context.user.name };
		
			console.log(newData.items);
			
			let res = await UpdateSalesOrder(newData);
			setSavingData(false);
			if (res && res.status !== 'error') {
				let msg = { message: res.message, key: new Date().getTime(), type: 'success' };
				context.addSnackMessage(msg);
				getSales(isFrom);
			} else {
				context.addSnackMessage(res);
			}
		} else if (selectedTab === 'details') {
			setSavingData(true);
			let data = {
				...customerDetails,
				orderId: orderItemId,
				updatedBy: context.user.name
			};

			if (data.address && Object.keys(data.address) !== null) {
				let newAddres = { ...data.address, option: 'Primary' };
				data = { ...data, address: newAddres };
			}

			let res = await UpdateSalesOrderCustomerDetails(data);
			setSavingData(false);
			if (res && res.status !== 'error') {
				let msg = { message: res.message, key: new Date().getTime(), type: 'success' };
				context.addSnackMessage(msg);
				getSales(isFrom);
			} else {
				context.addSnackMessage(res);
			}
		}
	};
	const handleDetailsClose = () => {
		setOrderItemId(null);
		setSelectedTab(null);
	};

	return (
		<Layout history={props.history}>
			<div className="container p-48">
				<div className="pb-32 spacingBetween pt-2">
					<p className="pageHeader textHover" onClick={handleDetailsClose}>
						{isFrom === 'Sales' ? 'Sales Orders' : 'Purchase Orders'}
					</p>
					{!orderItemId ? (
						<Button
							onClick={handleSaleAddDialog}
							className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
							variant="contained"
							color="primary"
						>
							{isFrom === 'Sales' ? 'Create New Sale' : 'Create New Purchase'}
							<AddIcon className="mb-1" />
						</Button>
					) : (
						<div className="d-flex flex-row align-items-center">
							<p
								onClick={() => setSelectedTab('items')}
								style={{
									borderBottom: selectedTab === 'items' ? '1px solid blue' : '',
									color: selectedTab === 'items' ? blue[600] : '',
									cursor: 'pointer'
								}}
								className="mr-24 text-16 sectionTitle"
							>
								Items
							</p>
							<p
								onClick={() => setSelectedTab('details')}
								style={{
									borderBottom: selectedTab === 'details' ? '1px solid blue' : '',
									color: selectedTab === 'details' ? blue[600] : '',
									cursor: 'pointer'
								}}
								className=" text-16 mr-24 sectionTitle"
							>
								Details
							</p>
							<Button variant="contained" color="primary" disabled={savingData} onClick={handleSave}>
								<p className="px-12 text-14">{savingData ? 'Saving...' : 'Save'}</p>
							</Button>
						</div>
					)}
				</div>
				{!orderItemId && (
					<React.Fragment>
						<TextField
							InputProps={{ style: { height: 35, fotSize: 14 } }}
							required
							id="outlined-required"
							variant="outlined"
							className="w-100 "
							onChange={handleSearchForSales}
						/>
						<Paper className="mt-4">
							{salesLoader ? (
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
													<TableCell align="left" className="sectionSubTitle">
														{isFrom === 'Sales' ? 'Sales Order' : 'Purchase Order'}
													</TableCell>
													<TableCell align="center" className="sectionSubTitle">
														{isFrom === 'Sales' ? 'Customer' : 'Supplier'}
													</TableCell>
													<TableCell align="center" className="sectionSubTitle">
														Priority
													</TableCell>

													<TableCell align="center" className="sectionSubTitle">
														Invoice
													</TableCell>
													<TableCell align="center" className="sectionSubTitle">
														Status
													</TableCell>
													<TableCell align="center" className="sectionSubTitle">
														Date
													</TableCell>
													<TableCell align="center" className="sectionSubTitle">
														Total
													</TableCell>
													<TableCell align="center" className="sectionSubTitle">
														Contact Person
													</TableCell>
													<TableCell align="center" className="sectionSubTitle">
														Phone
													</TableCell>
													<TableCell align="center" className="sectionSubTitle">
														Created By
													</TableCell>
													<TableCell align="center" className="sectionSubTitle">
														Created ON
													</TableCell>
												</TableRow>
											</TableHead>

											<TableBody>
												{sales &&
													sales
														.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
														.map((row, index) => (
															<TableRow key={index}>
																<TableCell
																	align="left"
																	className="sectionContent textHover"
																	onClick={(e) => handleSale(row)}
																	style={{
																		color: blue[600],
																		cursor: 'pointer'
																	}}
																>
																	#{row.orderId}
																</TableCell>
																<TableCell align="center" className="sectionContent">
																	{row.customer}
																</TableCell>

																<TableCell className="sectionContent " align="center">
																	{row.priority === 'High' && (
																		<Chip
																			size="small"
																			mr={1}
																			mb={1}
																			label="High"
																			style={{
																				backgroundColor: '#4caf50',
																				color: 'white',

																				fontSize: '13px'
																			}}
																			className="px-2"
																		/>
																	)}
																	{row.priority === 'Moderate' && (
																		<Chip
																			size="small"
																			mr={1}
																			mb={1}
																			label="Moderate"
																			style={{
																				backgroundColor: '#f57c00',

																				color: 'white',
																				fontSize: '13px'
																			}}
																			className="px-2"
																		/>
																	)}
																	{row.priority === 'Low' && (
																		<Chip
																			size="small"
																			mr={1}
																			mb={1}
																			label="Low"
																			style={{
																				backgroundColor: '#2196f3',
																				color: 'white',
																				fontSize: '13px'
																			}}
																			className="px-2"
																		/>
																	)}
																</TableCell>

																<TableCell align="center" className="sectionContent">
																	{row.InvoiceStatus}
																</TableCell>
																<TableCell align="center" className="sectionContent">
																	{row.status}
																</TableCell>
																<TableCell align="center" className="sectionContent">
																	{row.deliveryDate}
																</TableCell>
																<TableCell align="center" className="sectionContent">
																	<Currency value={row.totalOrderCost} />
																</TableCell>

																<TableCell align="center" className="sectionContent">
																	{row.contactPerson}
																</TableCell>
																<TableCell align="center" className="sectionContent">
																	{row.phone}
																</TableCell>
																<TableCell align="center" className="sectionContent">
																	{row.createdBy}
																</TableCell>
																<TableCell align="center" className="sectionContent">
																	{row.createdOn}
																</TableCell>
															</TableRow>
														))}
											</TableBody>
										</Table>
									</TableContainer>
									<TablePagination
										style={{ fontSize: '15px' }}
										rowsPerPageOptions={[ 5, 10, 25 ]}
										component="div"
										count={sales && sales.length ? sales.length : 0}
										rowsPerPage={rowsPerPage}
										page={page}
										onChangePage={handleChangePage}
										onChangeRowsPerPage={handleChangeRowsPerPage}
									/>
								</React.Fragment>
							)}
						</Paper>
					</React.Fragment>
				)}

				{selectedTab === 'details' && (
					<Details
						customerId={customerId}
						orderItemId={orderItemId && orderItemId}
						category={isFrom && isFrom}
						updateOrderCustomerDetails={updateOrderCustomerDetails}
					/>
				)}
				{selectedTab === 'items' &&
				orderItemId && (
					<Items
						category={isFrom && isFrom}
						orderItemId={orderItemId && orderItemId}
						updateOrderItemDetails={updateOrderItemDetails}
						upDatedSalesFromHome={sales && sales}
					/>
				)}
				<Dialog
					open={createSaleDialogOpen}
					onClose={handleCreateSaleClose}
					aria-labelledby="responsive-dialog-title"
					className="p-24"
				>
					<div className="p-24">
						<p className="sectionTitle">
							{isFrom === 'Sales' ? 'Create Sales Order' : 'Create Purchase Order'}
						</p>
						<DialogContent>
							<DialogContentText>
								<div className="container p-0">
									<div className=" row">
										<div className="col-md-6">
											<p className="sectionContent">
												{isFrom === 'Sales' ? 'Customers' : 'Suppliers'}
											</p>

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
												value={selectedCustomer && selectedCustomer.name}
												onClick={handleCustomerListDilaog}
												endAdornment={
													<InputAdornment position="end">
														<SearchIcon
															style={{
																opacity: 0.8,
																fontSize: '14px'
															}}
														/>
													</InputAdornment>
												}
												readOnly
											/>
										</div>
										<div className="col-md-6">
											<p className="sectionContent">Priority</p>

											<FormControl
												variant="outlined"
												style={{ width: '231px', height: '20px !important' }}
											>
												<Select
													labelId="demo-simple-select-outlined-label"
													id="demo-simple-select-outlined"
													style={{
														height: 35,
														minHeight: 35
													}}
													name="priority"
													value={newSale.priority}
													onChange={handleNewSale}
												>
													<MenuItem value="High">High</MenuItem>
													<MenuItem value="Low">Low</MenuItem>
													<MenuItem value="Moderate">Moderate</MenuItem>
												</Select>
											</FormControl>
										</div>
									</div>
									<div>
										<div className="  mt-24">
											<MuiPickersUtilsProvider utils={DateFnsUtils}>
												<Grid>
													<KeyboardDatePicker
														disableToolbar
														format="MM/dd/yyyy"
														id="date-picker-inline"
														label="Delivery due date"
														value={newSale.date}
														// maxDate={new Date()}
														name="date"
														onChange={(e) => handleNewSale(e, 'date')}
														KeyboardButtonProps={{
															'aria-label': 'change date'
														}}
													/>
												</Grid>
											</MuiPickersUtilsProvider>
										</div>
									</div>
								</div>
							</DialogContentText>
						</DialogContent>

						<DialogActions>
							<Button onClick={handleCreateSaleClose} color="primary" variant="outlined">
								<p>Cancel</p>
							</Button>
							<Button
								onClick={handleCreateNewSale}
								variant="contained"
								color="primary"
								disabled={newSale.date === '' || newSale.priority === ''}
							>
								<p>Create</p>
							</Button>
						</DialogActions>
					</div>
				</Dialog>
				<Dialog
					open={customerListDialog}
					onClose={handleCustomerListDialogClose}
					aria-labelledby="responsive-dialog-title"
					maxWidth="sm"
					fullWidth={true}
				>
					<DialogTitle className="px-4">
						<p className="sectionTitle" style={{ textTransform: 'capitalize' }}>
							{isFrom === 'Sales' ? 'Customers' : 'Suppliers'}
						</p>
					</DialogTitle>

					<DialogContent className="px-4">
						<TextField
							InputProps={{ style: { height: 35, fotSize: 14 } }}
							required
							id="outlined-required"
							variant="outlined"
							className="w-100 "
							onChange={handleCustomerListSearch}
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
										{customerList &&
											customerList.map((item, index) => (
												<TableRow key={index}>
													<TableCell align="left" className="sectionContent">
														{item.name}
													</TableCell>

													<TableCell align="right">
														<Button
															variant="contained"
															color="primary"
															disabled={
																selectedCustomer &&
																selectedCustomer.customerId === item.customerId
															}
															onClick={() => handleSelectCustomer(item)}
														>
															{selectedCustomer &&
															selectedCustomer.customerId === item.customerId ? (
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
						<Button variant="outlined" color="primary" onClick={handleCustomerListDialogClose}>
							Cancel
						</Button>
						<Button
							className="sectionSubTitle px-4"
							variant="contained"
							color="primary"
							onClick={handleSaveSelectedCustomer}
						>
							Save
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</Layout>
	);
}
