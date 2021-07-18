import React, { useState, useEffect, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Paper from '@material-ui/core/Paper';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import { blue } from '@material-ui/core/colors';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import Collapse from '@material-ui/core/Collapse';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import SearchIcon from '@material-ui/icons/Search';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';

import TableRow from '@material-ui/core/TableRow';
import { unitTypes } from '../../../staticData';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

import ChevronLeft from '@material-ui/icons/ChevronLeft';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import AppContext from 'context/AppContext';
import moment from 'moment';
import { Prompt } from 'react-router';

import {
	fetchBomItemDetails,
	fetchBomChildItems,
	fetchItemsList,
	fetchTaxes,
	createNewTax,
	fetchOrderDetails,
	addMaterialItem
} from 'api';
import Currency from 'components/Currency';

const useStyles = makeStyles((theme) => ({
	activeTab: {
		borderBottom: '1px solid blue',
		color: blue[600],
		cursor: 'pointer'
	},
	bomHeader: {
		marginTop: 10,
		marginBottom: 12,
		'& p': {
			fontSize: 15,
			minWidth: 120,
			textAlign: 'center'
		},
		'& p.actions': {
			minWidth: 130,
			textAlign: 'center'
		}
	},
	bomCard: {
		padding: 10,
		marginBottom: 12,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		'& .color': {
			width: 30,
			height: 30,
			borderRadius: '50%',
			backgroundColor: '#000'
		},
		'& .itemNumber': {
			color: blue[600],
			fontSize: 19,
			marginBottom: 4
		},
		'& .type': {
			marginRight: 7,
			backgroundColor: '#eee',
			fontSize: 13,
			padding: '2px 7px',
			borderRadius: 6
		},
		'& p': {
			fontSize: 15,
			minWidth: 120,
			textAlign: 'center'
		},
		'& .actions': {
			minWidth: 130,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		},
		'& .blueColor': {
			color: blue[600]
		},
		'& .actionIcon': {
			width: 28,
			height: 28,
			borderRadius: '50%',
			border: '1px solid #eee',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			cursor: 'pointer',
			color: '#9c9c9c'
		}
	}
}));

const BomCard = ({ item, classes, handleExpanded, isParent, updateBomItemTotal }) => {
	const getMultiplication = (itemVal) => {
		let p = Number(itemVal.unitPrice);
		let q = Number(itemVal.qty || itemVal.qty === 0 ? itemVal.qty : 1);
		return p * q;
	};
	const getUnitCost = (item) => {
		let value = 0;
		if (item && item.items && item.items.length > 0) {
			let items = item.items;
			for (let i = 0; i < items.length; i++) {
				let childItem = items[i];
				value = value + getTotalCost(childItem);
			}
		} else {
			if (item.source === 'Buy' || item.source === 'Make or Buy') {
				value = item.unitPrice;
			} else {
				value = 0;
			}
		}
		return value;
	};
	const getTotalCost = (item, isParent) => {
		let value = 0;
		if (item && item.items && item.items.length > 0) {
			let items = item.items;
			for (let i = 0; i < items.length; i++) {
				value = value + getTotalCost(items[i]);
			}
			value = (!item.qty || isParent ? 1 : Number(item.qty)) * value;
		} else {
			if (item.source === 'Buy' || item.source === 'Make or Buy') {
				value = getMultiplication(item);
			} else {
				value = 0;
			}
		}
		if (isParent) {
			updateBomItemTotal(value);
		}
		return value;
	};

	return (
		<React.Fragment>
			{item && (
				<Paper className={classes.bomCard}>
					<div className="d-flex flex-row align-items-center">
						<div className="color mr-4" />
						<div>
							{isParent ? (
								<h5 className="itemNumber">
									<span className="mr-2">{item.itemNumber}</span>
									{item.description}
								</h5>
							) : (
								<h5 className="itemNumber" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
									{item.description}
								</h5>
							)}
							<div className="d-flex flex-row">
								<div className="type">{item.source}</div>
								<p style={{ color: '#000', fontSize: 15, textAlign: 'start' }}>{item.itemNumber}</p>
							</div>
						</div>
					</div>
					<div className="d-flex flex-row align-items-center">
						<p>{item.qty || item.qty === 0 ? item.qty : 1}</p>
						<p>{item.unitOfMeasure}</p>
						<p className="blueColor">₹{getUnitCost(item).toLocaleString('en-IN')}</p>
						<p className="blueColor">₹{getTotalCost(item, isParent).toLocaleString('en-IN')}</p>
						<div className="actions">
							<div className="d-flex flex-row align-items-center">
								{item.items &&
								item.items.length > 0 && (
									<div className="actionIcon" onClick={() => handleExpanded(!item.expanded)}>
										{item.expanded ? <KeyboardArrowDownIcon /> : <ChevronLeft />}
									</div>
								)}
							</div>
						</div>
					</div>
				</Paper>
			)}
		</React.Fragment>
	);
};

const RenderBomItems = ({ item, classes, isParent, updateBomItemTotal }) => {
	const [ renderItem, setRenderItem ] = useState(item);

	useEffect(
		() => {
			setRenderItem({ ...item, expanded: renderItem.expanded });
		},
		[ item ]
	);

	const handleExpanded = (value) => {
		setRenderItem({ ...renderItem, expanded: value });
	};
	return (
		<React.Fragment>
			<BomCard
				item={renderItem}
				classes={classes}
				handleExpanded={handleExpanded}
				isParent={isParent}
				updateBomItemTotal={updateBomItemTotal}
			/>
			<Collapse in={renderItem.expanded} timeout="auto" unmountOnExit>
				{renderItem.items &&
				renderItem.items.length > 0 && (
					<div className="ml-40 mb-24">
						{renderItem.items.map((childItem, ind) => (
							<React.Fragment key={ind}>
								{childItem && <RenderBomItems item={childItem} classes={classes} />}
							</React.Fragment>
						))}
					</div>
				)}
			</Collapse>
		</React.Fragment>
	);
};

const Item = (props) => {
	const { category, orderItemId, updateOrderItemDetails, upDatedSalesFromHome } = props;
	const [ orderType, setOrderType ] = React.useState(null);
	const [ selectedOrderItem, setSelectedOrderItem ] = React.useState(null);

	const [ taxDialogOpen, setTaxDialogOpen ] = React.useState(false);
	const [ costBreakdownByTotal, setCostBreakdownByTotal ] = React.useState(true);
	const [ bomParentTotal, setBomParentTotal ] = useState(null);
	const classes = useStyles();
	const [ selectedItem, setSelectedItem ] = useState(null);
	const [ loadingBomItemDetails, setLoadingBomItemDetails ] = useState(false);
	const context = useContext(AppContext);
	const [ items, setItems ] = useState([]);
	const [ allItems, setAllItems ] = useState([]);
	const [ taxes, setTaxes ] = React.useState([]);

	const [ taxesLoader, setTaxesLoader ] = React.useState(false);
	const [ selectedTax, setSelectedTax ] = React.useState(null);

	const [ createTaxLoader, setCreateTaxLoader ] = React.useState(false);
	const [ selectedItems, setSelectedItems ] = useState([]);
	const [ selectedItemTax, setSelectedItemTax ] = useState(null);
	const [ orderItemDetails, setOrderItemDetails ] = useState(null);
	const [ updateItem, setUpdateItem ] = useState(null);
	const [ itemsTaxDialogOpen, setItemsTaxDialogOpen ] = useState(false);
	const [ selectedTaxes, setSelectedTaxes ] = useState([]);
	const [ selectedSingleItemTaxes, setSelectedSingleItemTaxes ] = useState([]);

	// backup means only backup items for home 
	const [ backUp, setBackUp ] = useState([]);

	// backup means all backup data for home 
	const [backUpdata,setBackUpdata]=useState([])
	const [itemsEdited,setItemsEdited]=useState(false)
	const [ newMaterialItem, setNewMaterialItem ] = useState({
		itemNumber: '',
		source: '',
		description: '',
		unitType: '',
		unitOfMeasure: ''
	});
	useEffect(
		() => {
			updateOrderItemDetails(orderItemDetails,backUpdata);
		},
		[ orderItemDetails ]
	);

	useEffect(
		() => {
			getOrderDetails();
		},
		[ upDatedSalesFromHome ]
	);

	useEffect(() => {
		getTaxes();
	}, []);

	const getOrderDetails = async () => {
		let res = await fetchOrderDetails(orderItemId);
		if (res.status !== 'error') {
			let data = res.data;
			setBackUpdata(res.data)
			if (!data.discountInfo) {
				data['discountInfo'] = {};
			}

			// data.discountInfo['type'] = 'Discount';
			if (!data.orderInfo) {
				data['orderInfo'] = {};
			}
			if (!data.taxes) {
				data['taxes'] = {};
			}

			// data.taxes['type'] = 'Tax';
			let items = data.items;
			let backUpItems = items ? items : [];
			setBackUp(backUpItems);
			if (items) {
				items.forEach((item) => {
					item.subTotal = getSubtotals('total', item);
				});
			} else {
				items = [];
			}

			if (selectedOrderItem && items && items.length > 0) {
				let ind = items.findIndex((obj) => {
					return obj.itemId === selectedOrderItem.itemId;
				});
				if (ind >= 0) {
					setSelectedOrderItem({ ...items[ind] });
				}
			}
			data['summary'] = {};
			if (items && items.length > 0) {
				data['summary'] = calculateSummary(data.discountInfo, items);
			}

			setOrderItemDetails({ ...data, items, backUpItems: backUpItems });
		} else {
			context.addSnackMessage(res);
		}
	};

	// bom apis start
	const getBomChildItems = async (id, data) => {
		let res = await fetchBomChildItems(id);
		setLoadingBomItemDetails(false);
		if (res.status !== 'error') {
			let updatedItem = data ? data : {};
			let items = res.data ? res.data : [];
			updatedItem['items'] = getParentChildItems(items);
			setSelectedItem(updatedItem);
		} else {
			// context.addSnackMessage(res);
		}
	};
	const getParentChildItems = (items) => {
		let updatedItems = [];
		items.forEach((item) => {
			let obj;
			if (item.items) {
				obj = item['parentItem'];
				obj['items'] = getParentChildItems(item.items);
			} else {
				obj = item;
			}
			updatedItems.push(obj);
		});
		return updatedItems;
	};
	const handleBomDialog = () => {
		getItemIdDetails();
	};
	const updateBomItemTotal = (value) => {
		setBomParentTotal(value);
	};
	const getItemIdDetails = async () => {
		setLoadingBomItemDetails(true);
		let res = await fetchBomItemDetails(selectedOrderItem && selectedOrderItem.itemId);
		if (res.status !== 'error') {
			// setSelectedItem(res.data);
			getBomChildItems(selectedOrderItem && selectedOrderItem.itemId, res.data);
		} else {
			setLoadingBomItemDetails(false);
			setSelectedItem(null);
			context.addSnackMessage(res);
		}
	};

	// bom apis end

	// orderitem details

	// taxes
	const getTaxes = async () => {
		setTaxesLoader(true);
		let res = await fetchTaxes();
		setTaxesLoader(false);
		if (res.status !== 'error') {
			setTaxes(res.data);
		} else {
			context.addSnackMessage(res);
			setTaxes([]);
		}
	};
	const handleTaxClick = () => {
		let obj = {
			code: '',
			rate: ''
		};
		setSelectedTax(obj);
	};
	const handleTaxDialogClose = () => {
		setSelectedTax(null);
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
	const handleTaxChange = (e) => {
		setSelectedTax({
			...selectedTax,
			[e.target.name]: e.target.value
		});
	};
	// taxes end

	const handleOrderItemClick = (item) => {
		if (selectedOrderItem && selectedOrderItem.name === item.name) {
			setSelectedOrderItem(null);
		} else {
			let subTotal = getSubtotals('total', item);
			setSelectedOrderItem({ ...item, subTotal: subTotal });

			let items = orderItemDetails && orderItemDetails.items ? orderItemDetails.items : [];
			let ind = items.findIndex((value) => {
				return value.itemId === item.itemId;
			});
			let taxCodes = [];

			if (ind >= 0) {
				taxCodes = items[ind].taxCodes ? items[ind].taxCodes : [];
			}
			setSelectedSingleItemTaxes(taxCodes);

			setOrderType(null);
		}
	};
	const handleCloseTaxDialog = () => {
		setTaxDialogOpen(false);
	};
	const handleOrderTypeClose = () => {
		setOrderType(null);
		setNewMaterialItem({
			itemNumber: '',
			source: '',
			description: '',
			unitType: '',
			unitOfMeasure: ''
		});
		// setSelectedItems(null);
	};

	// items functions start
	const handleOrderType = (e) => {
		let value = e.target.value;
		setOrderType(value);
		if (value === 'item') {
			getItemsList();
			let items = orderItemDetails && orderItemDetails.items ? orderItemDetails.items : [];

			setSelectedItems(items);
		}
		if (value === 'tax') {
			getTaxes();
			let taxes =
				orderItemDetails && orderItemDetails.taxes && orderItemDetails.taxes.taxCodes
					? orderItemDetails.taxes.taxCodes
					: [];
			// let taxCodes = taxes.map((tax) => {
			// 	return tax.id;
			// });
			// setOrderItemDetails({ ...orderItemDetails, taxes: { ...orderItemDetails.taxes, taxCodes } });
			setSelectedTaxes(taxes);
		}

		setSelectedOrderItem(null);
	};

	const getItemsList = async () => {
		let res = await fetchItemsList(category);

		if (res.status !== 'error') {
			setItems(res.data);

			setAllItems(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleSearchForItems = (e) => {
		let text = e.target.value;
		let updatedSearchItems = allItems;
		updatedSearchItems = updatedSearchItems.filter((item, index) =>
			item.description.toLowerCase().includes(text.toLowerCase())
		);
		setItems(updatedSearchItems);
	};

	// items functions end

	// summary calculations start
	const handleChange = (e, key) => {
		let data;
		if (key === 'date') {
			data = { ...selectedOrderItem, itemDueDate: moment(e).format('MMM DD YYYY hh:mm:ss') };
		} else if (key === 'discountType') {
			let obj = {
				discountType: e
			};
			if (e === '₹') {
				obj.perRate = null;
			} else if (e === '%') {
				obj.discountRate = null;
			}
			data = { ...selectedOrderItem, ...obj };
		} else if (e === 'taxId') {
			data = { ...selectedOrderItem, taxCodes: selectedSingleItemTaxes && selectedSingleItemTaxes };
		} else {
			let type = e.target.type;
			if (type === 'number') {
				data = { ...selectedOrderItem, [e.target.name]: e.target.value ? Number(e.target.value) : '' };
			} else if (type === 'checkbox') {
				data = { ...selectedOrderItem, [e.target.name]: e.target.checked };
			} else {
				data = { ...selectedOrderItem, [e.target.name]: e.target.value };
			}
		}
		let subTotal = getSubtotals('total', data);

		data = { ...data, subTotal: subTotal };

		setSelectedOrderItem(data);

		let newArray = orderItemDetails && orderItemDetails.items ? orderItemDetails.items : [];
		let ind = newArray.findIndex((item) => {
			return item.itemNumber === selectedOrderItem.itemNumber;
		});
		if (ind >= 0) {
			newArray[ind] = data;
			let summary = {};
			if (newArray && newArray.length > 0) {
				summary = calculateSummary(orderItemDetails.discountInfo, newArray);
			}

			setOrderItemDetails({ ...orderItemDetails, items: newArray, summary });
		}
	};
	const calculateSummary = (discountInfo, items) => {
		let total = 0;
		let discountedTotal = 0;
		let unitTotal = 0;
		let discountedUnitTotal = 0;
		items.forEach((item) => {
			total += Number(item.subTotal ? item.subTotal : 0);
			unitTotal += Number(item.unitValue ? item.unitValue : 0);
		});
		if (discountInfo && Object.keys(discountInfo).length > 0 && discountInfo.applyDiscount) {
			if (discountInfo.discountType === '%') {
				let val = total * Number(discountInfo.perRate) / 100;
				let res = discountedUnitTotal * Number(discountInfo.perRate) / 100;
				if (isNaN(val)) val = 0;
				if (isNaN(res)) res = 0;
				discountedTotal = total - val;
				discountedUnitTotal = unitTotal - res;
			} else if (discountInfo.discountType === '₹') {
				let val = total - Number(discountInfo.discountRate ? discountInfo.discountRate : 0);
				let res = unitTotal - Number(discountInfo.discountRate ? discountInfo.discountRate : 0);
				if (isNaN(val)) val = 0;
				if (isNaN(res)) res = 0;
				discountedTotal = val;
				discountedUnitTotal = res;
			} else {
				discountedTotal = total;
				discountedUnitTotal = unitTotal;
			}
		} else {
			discountedTotal = total;
			discountedUnitTotal = unitTotal;
		}
		let summary = orderItemDetails && orderItemDetails.summary ? orderItemDetails.summary : {};
		summary = { total: total, discountedTotal: discountedTotal, discountedUnitTotal: discountedUnitTotal };
		// console.log(summary);
		return summary;
	};

	const handleTaxSelection = (row) => {
		setSelectedItemTax(row);
	};

	const handleItemTaxDialogClose = () => {
		setSelectedItemTax(null);
		setTaxDialogOpen(false);
	};
	const getSubtotals = (type, singleOrderItem) => {
		let val = 0;
		if (singleOrderItem) {
			if (type === 'total') {
				if (singleOrderItem.discountType === '₹') {
					val = (singleOrderItem.unitValue - singleOrderItem.discountRate) * singleOrderItem.qty;
				} else if (singleOrderItem.discountType === '%') {
					val =
						singleOrderItem.unitValue * singleOrderItem.qty -
						singleOrderItem.unitValue * singleOrderItem.qty * singleOrderItem.perRate / 100;
				} else {
					val = singleOrderItem.unitValue * singleOrderItem.qty;
				}
			} else {
				if (singleOrderItem.discountType === '₹') {
					val = singleOrderItem.unitValue - singleOrderItem.discountRate;
				} else if (singleOrderItem.discountType === '%') {
					val = singleOrderItem.unitValue - singleOrderItem.unitValue * singleOrderItem.perRate / 100;
				} else {
					val = singleOrderItem.unitValue;
				}
			}
		}
		if (isNaN(val)) val = 0;
		return val;
	};

	// discount section

	const handleItemsDiscountChange = (e, key) => {
		let type, value, name;

		if (key) {
			name = key;
			value = e;
		} else {
			name = e.target.name;
			value = e.target.value;
			type = e.target.type;
		}
		if (type === 'checkbox') {
			value = e.target.checked;
		}
		let data = {
			...orderItemDetails,
			discountInfo: { ...orderItemDetails.discountInfo, [name]: value, type: 'Discount' }
		};

		if (data.discountInfo.discountType === '%') {
			data.discountInfo.discountRate = '';
		} else if (data.discountInfo.discountType === '₹') {
			data.discountInfo.perRate = '';
		}
		let summary = {};
		if (data.items && data.items.length > 0) {
			summary = calculateSummary(data.discountInfo, data.items);
		}
		setOrderItemDetails({ ...data, summary });
	};

	//  multiple items selections fns start
	const handleSelectedItems = (item, type) => {
		let newItems = [ ...selectedItems ];
		if (type === 'Select') {
			let backUpItems = backUp ? backUp : [];
			let ind = backUpItems.findIndex((backUpItem) => {
				return item.itemId === backUpItem.itemId;
			});
			if (ind >= 0) {
				item = backUpItems[ind];
			} else item = item;

			newItems.push(item);
		} else {
			newItems = newItems.filter((newItem) => {
				return newItem.itemNumber !== item.itemNumber;
			});
		}
		setSelectedItems(newItems);
	};

	const handleItemsSave = () => {
		let items = selectedItems;

		items.forEach((item) => {
			item.subTotal = getSubtotals('total', item);
		});
		let backUpItems = backUp ? backUp : [];
		let delItemArray = [];
		delItemArray = backUpItems.filter((delItem) => {
			let ind = items.findIndex((item) => {
				return delItem.itemId === item.itemId;
			});
			if (ind >= 0) {
				return delItem;
			}
		});

		let summary = {};
		if (items && items.length > 0) {
			summary = calculateSummary(orderItemDetails.discountInfo, items);
		}

		setOrderItemDetails({ ...orderItemDetails, items, summary });
		handleOrderTypeClose();
	};

	const findSelectedItem = (value) => {
		let selected = false;
		let arr = selectedItems ? selectedItems : [];
		let index = arr.findIndex((item) => {
			return item.itemId === value.itemId;
		});
		if (index >= 0) {
			selected = true;
		}
		return selected;
	};

	//  multiple items selections fns end

	// multiple tax selection functions start

	const handleItemsTaxSelection = (row, type) => {
		let newTaxes = [ ...selectedTaxes ];
		if (type === 'Select') {
			newTaxes.push(row.id);
		} else {
			newTaxes = newTaxes.filter((newTax) => {
				return newTax !== row.id;
			});
		}
		setSelectedTaxes(newTaxes);
	};

	const findSelectedTax = (value) => {
		let selected = false;
		let arr = selectedTaxes ? selectedTaxes : [];
		let index = arr.findIndex((item) => {
			return item === value;
		});

		if (index >= 0) {
			selected = true;
		}
		return selected;
	};

	const handleItemTaxesSave = () => {
		let itemTaxes = selectedTaxes;
		let data = {
			...orderItemDetails,
			taxes: { ...orderItemDetails.taxes, taxCodes: itemTaxes }
		};
		setOrderItemDetails(data);
		handleCloseItemsTax();
	};

	const handleItemsTaxChange = (e) => {
		let name, value;
		if (e.target.type === 'checkbox') {
			value = e.target.checked;
			name = e.target.name;
		}
		let data = {
			...orderItemDetails,
			taxes: { ...orderItemDetails.taxes, [name]: value, type: 'Tax' }
		};

		setOrderItemDetails(data);
	};

	const handleItemsTaxDialog = () => {
		setItemsTaxDialogOpen(true);
	};
	const handleCloseItemsTax = () => {
		setItemsTaxDialogOpen(false);
		// setSelectedTaxes(null);
	};

	// multiple tax selection functions end

	// multiple tax selections fns for single item start

	const handleSingleItemTaxSelection = (row, type) => {
		let newTaxes = [ ...selectedSingleItemTaxes ];

		if (type === 'Select') {
			newTaxes.push(row.id);
		} else {
			newTaxes = newTaxes.filter((newTax) => {
				return newTax !== row.id;
			});
		}

		setSelectedSingleItemTaxes(newTaxes);
	};

	const findSelectedSingleItemTax = (value) => {
		let selected = false;
		let arr = selectedSingleItemTaxes ? selectedSingleItemTaxes : [];

		let index = arr.findIndex((item) => {
			return item === value;
		});

		if (index >= 0) {
			selected = true;
		}
		return selected;
	};
	const handleSingleItemTaxSave = () => {
		handleChange('taxId');

		handleItemTaxDialogClose();
	};

	const handleOrderInfoChange = (e) => {
		let data = {
			...orderItemDetails,
			orderInfo: { ...orderItemDetails.orderInfo, [e.target.name]: e.target.value }
		};
		setOrderItemDetails(data);
	};
	const handleAddBomItem = async () => {
		let res = await addMaterialItem(newMaterialItem);

		if (res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
		} else {
			context.addSnackMessage(res);
		}
		handleOrderTypeClose();
	};
	const handleNewMaterialItemChange = (e) => {
		setNewMaterialItem({ ...newMaterialItem, [e.target.name]: e.target.value });
	};

	// multiple tax selections fns for single item start

	const findTotalUnitMaterialCost = (type, price) => {
		if (selectedOrderItem) {
			if (type === 'total') {
				let val1 = selectedOrderItem.unitPrice * selectedOrderItem.qty;
				let val2 = selectedOrderItem.subTotal;
				if (price === 'costPrice') {
					return val1;
				} else if (price === 'sellingPrice') {
					return val2;
				} else if (price === 'totalMargin') {
					let val3 = val2 / val1 - 1;
					return Number((val3 * 100).toFixed(3));
				}
			} else if (type === 'unit') {
				let val1 = selectedOrderItem.unitPrice;

				let val2 = selectedOrderItem.subTotal / selectedOrderItem.qty;
				if (price === 'costPrice') {
					return val1;
				} else if (price === 'sellingPrice') {
					return val2;
				} else if (price === 'unitMargin') {
					let val3 = val2 / val1 - 1;
					return Number((val3 * 100).toFixed(3));
				}
			}
		}
	};

	// multiple tax selections fns for single item end

	return (
		<div>
		<Prompt when={itemsEdited} message="Are you sure you want to leave?" />
			<div>
				<div className="container p-0">
					<div className="row">
						<div className="col-md-5">
							<Card className="p-24 spacingBetween">
								<div>
									<p className="sectionContent"> {category === 'Sales' ? 'Customer' : 'Supplier'}</p>
									<p className="sectionSubTitle">
										{orderItemDetails && orderItemDetails.orderInfo.customer ? (
											orderItemDetails.orderInfo.customer
										) : (
											'NA'
										)}
									</p>
								</div>
								<div>
									<p className="sectionContent">Contact</p>
									<p className="sectionSubTitle">
										{orderItemDetails && orderItemDetails.orderInfo.contactPerson ? (
											orderItemDetails.orderInfo.contactPerson
										) : (
											'NA'
										)}
									</p>
								</div>
							</Card>
						</div>
						<div className="col-md-7">
							<Card className="p-24 spacingBetween">
								<div>
									<p className="sectionContent">Status</p>
									<FormControl variant="outlined" style={{ width: '131px' }}>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											style={{
												height: 25,
												minHeight: 25
											}}
											name="status"
											onChange={(e) => handleOrderInfoChange(e)}
											value={
												orderItemDetails &&
												orderItemDetails.orderInfo &&
												orderItemDetails.orderInfo.status ? (
													orderItemDetails.orderInfo.status
												) : (
													''
												)
											}
										>
											<MenuItem value="Shipped">Shipped</MenuItem>
											<MenuItem value="Cancelled">Cancelled</MenuItem>
											<MenuItem value="	Partially Shipped"> Partially Shipped</MenuItem>
											<MenuItem value="Created">Created</MenuItem>
											<MenuItem value="In progress">In progress</MenuItem>
										</Select>
									</FormControl>
								</div>
								<div>
									<p className="sectionContent">Priority</p>

									<FormControl
										variant="outlined"
										style={{ width: '131px', height: '10px !important' }}
									>
										<Select
											labelId="demo-simple-select-outlined-label"
											id="demo-simple-select-outlined"
											style={{
												height: 25,
												minHeight: 25
											}}
											onChange={(e) => handleOrderInfoChange(e)}
											name="priority"
											value={
												orderItemDetails &&
												orderItemDetails.orderInfo &&
												orderItemDetails.orderInfo.priority ? (
													orderItemDetails.orderInfo.priority
												) : (
													''
												)
											}
										>
											<MenuItem value="High">High</MenuItem>
											<MenuItem value="Low">Low</MenuItem>
											<MenuItem value="Moderate">Moderate</MenuItem>
										</Select>
									</FormControl>
								</div>
								<div>
									<p className="sectionContent">Created On</p>
									<p className="sectionSubTitle">
										{orderItemDetails && orderItemDetails.orderInfo.createdOn ? (
											orderItemDetails.orderInfo.createdOn
										) : (
											'NA'
										)}
									</p>
								</div>
							</Card>
						</div>
					</div>
				</div>
				<div className=" mt-32">
					<p>Add</p>
					<FormControl style={{ width: '120px', color: 'white' }}>
						<TextField
							select
							value={orderType}
							onChange={handleOrderType}
							style={{ backgroundColor: blue[600], borderRadius: '5px', border: 'none' }}
							InputProps={{
								style: { height: 34, color: 'white', padding: '0px 10px', fontSize: 15 }
							}}
							variant="outlined"
						>
							<MenuItem value="item">Item</MenuItem>
							<MenuItem value="newItem">New Item</MenuItem>
							<MenuItem value="fee">Fee</MenuItem>
							<MenuItem value="discount">Discount</MenuItem>
							<MenuItem value="tax">Tax</MenuItem>
						</TextField>
					</FormControl>
				</div>
				<div className="container mt-16 ">
					<div className="row flex py-2">
						<div
							style={{
								width:
									selectedOrderItem || orderType === 'discount' || orderType === 'tax'
										? '40%'
										: '100%'
							}}
						>
							<div className={'row w-100 m-0 border'}>
								<div
									className={
										selectedOrderItem || orderType === 'discount' || orderType === 'tax' ? (
											'col-md-4'
										) : (
											'col-md-2'
										)
									}
								>
									<p className="sectionSubTitle ml-32">Name</p>
								</div>
								<div
									className="col-md-2"
									style={{
										display:
											selectedOrderItem || orderType === 'discount' || orderType === 'tax'
												? 'none'
												: ''
									}}
								>
									<p className="sectionSubTitle">Type</p>
								</div>
								<div
									className="col-md-2"
									style={{
										display:
											selectedOrderItem || orderType === 'discount' || orderType === 'tax'
												? 'none'
												: ''
									}}
								>
									<p className="sectionSubTitle">Description</p>
								</div>
								<div
									className={
										selectedOrderItem || orderType === 'discount' || orderType === 'tax' ? (
											'col-md-4'
										) : (
											'col-md-2'
										)
									}
								>
									<p className="sectionSubTitle pl-16">Price</p>
								</div>
								<div
									className="col-md-2 "
									style={{
										display:
											selectedOrderItem || orderType === 'discount' || orderType === 'tax'
												? 'none'
												: ''
									}}
								>
									<p className="sectionSubTitle pl-24"> Quantity</p>
								</div>
								<div
									className={
										selectedOrderItem || orderType === 'discount' || orderType === 'tax' ? (
											'col-md-4'
										) : (
											'col-md-2'
										)
									}
								>
									<p className="sectionSubTitle"> Sub Total</p>
								</div>
							</div>

							<div className="row w-100 m-0">
								{orderItemDetails &&
									orderItemDetails.items &&
									orderItemDetails.items.map((item, index) => (
										<Card
											className="w-100 mt-6 cursor-pointer"
											key={index}
											onClick={() => handleOrderItemClick(item)}
										>
											<div className="row m-0">
												<div
													className={
														selectedOrderItem ||
														orderType === 'discount' ||
														orderType === 'tax' ? (
															'col-md-4'
														) : (
															'col-md-2'
														)
													}
												>
													<div className="p-0 row">
														<p
															className="borderRight pt-1"
															style={{
																backgroundColor: blue[600],
																textAlign:
																	selectedOrderItem ||
																	orderType === 'discount' ||
																	orderType === 'tax'
																		? 'center'
																		: ''
															}}
														>
															<UnfoldMoreIcon
																style={{ color: 'white', fontSize: '13px' }}
															/>
														</p>
														<div>
															<p className="sectionContent py-2 ml-24">
																{index + 1}.{item.itemNumber}
															</p>
															<p
																className="sectionContent pl-16 ml-8"
																style={{
																	display:
																		selectedOrderItem ||
																		orderType === 'discount' ||
																		orderType === 'tax'
																			? ''
																			: 'none'
																}}
															>
																{item.description}
															</p>
														</div>
													</div>
												</div>
												<div
													className="col-md-2"
													style={{
														display:
															selectedOrderItem ||
															orderType === 'discount' ||
															orderType === 'tax'
																? 'none'
																: ''
													}}
												>
													<p className="sectionContent py-2">Part</p>
												</div>
												<div
													className="col-md-2 "
													style={{
														display:
															selectedOrderItem ||
															orderType === 'discount' ||
															orderType === 'tax'
																? 'none'
																: ''
													}}
												>
													<p className="sectionContent py-3">{item.description}</p>
												</div>
												<div
													className={
														selectedOrderItem ||
														orderType === 'discount' ||
														orderType === 'tax' ? (
															'col-md-4'
														) : (
															'col-md-2'
														)
													}
												>
													<p className="sectionContent py-2 pl-16">
														<Currency value={item.unitValue ? item.unitValue : 0} />
													</p>
												</div>
												<div
													className="col-md-2 pl-16 "
													style={{
														display:
															selectedOrderItem ||
															orderType === 'discount' ||
															orderType === 'tax'
																? 'none'
																: ''
													}}
												>
													<p
														className="sectionContent ml-6 py-2 pl-16"
														style={{ paddingLeft: '30px' }}
													>
														{item.qty}
													</p>
												</div>
												<div
													className={
														selectedOrderItem ||
														orderType === 'discount' ||
														orderType === 'tax' ? (
															'col-md-4'
														) : (
															'col-md-2'
														)
													}
												>
													<p className="sectionContent py-2">
														{' '}
														<Currency value={item.subTotal ? item.subTotal : 0} />
													</p>
												</div>
											</div>
										</Card>
									))}
								{orderItemDetails &&
								orderItemDetails.discountInfo &&
								orderItemDetails.discountInfo.applyDiscount ? (
									<React.Fragment>
										<Card className="w-100 mt-6 cursor-pointer">
											<div className="row m-0">
												<div
													className={
														selectedOrderItem ||
														orderType === 'discount' ||
														orderType === 'tax' ? (
															'col-md-4'
														) : (
															'col-md-2'
														)
													}
												>
													<div className="p-0 row">
														<p
															className="borderRight pt-1"
															style={{
																backgroundColor: blue[600],
																textAlign:
																	selectedOrderItem ||
																	orderType === 'discount' ||
																	orderType === 'tax'
																		? 'center'
																		: ''
															}}
														>
															<UnfoldMoreIcon
																style={{ color: 'white', fontSize: '13px' }}
															/>
														</p>
														<div>
															<p className="sectionContent py-2 pl-4">Discount</p>
															<p
																className="sectionContent pl-16 ml-8"
																style={{
																	display:
																		selectedOrderItem ||
																		orderType === 'discount' ||
																		orderType === 'tax'
																			? ''
																			: 'none'
																}}
															/>
														</div>
													</div>
												</div>
												<div
													className="col-md-2"
													style={{
														display:
															selectedOrderItem ||
															orderType === 'discount' ||
															orderType === 'tax'
																? 'none'
																: ''
													}}
												/>
												<div
													className="col-md-2 "
													style={{
														display:
															selectedOrderItem ||
															orderType === 'discount' ||
															orderType === 'tax'
																? 'none'
																: ''
													}}
												>
													<p className="sectionContent py-3" />
												</div>
												<div
													className={
														selectedOrderItem ||
														orderType === 'discount' ||
														orderType === 'tax' ? (
															'col-md-4'
														) : (
															'col-md-2'
														)
													}
												>
													<p className="sectionContent py-2 pl-16" />
												</div>
												<div
													className="col-md-2 pl-16 "
													style={{
														display:
															selectedOrderItem ||
															orderType === 'discount' ||
															orderType === 'tax'
																? 'none'
																: ''
													}}
												>
													<p
														className="sectionContent ml-6 py-2 pl-16"
														style={{ paddingLeft: '30px' }}
													/>
												</div>
												<div
													className={
														selectedOrderItem ||
														orderType === 'discount' ||
														orderType === 'tax' ? (
															'col-md-4'
														) : (
															'col-md-2'
														)
													}
												>
													<p className="sectionContent py-2">
														{orderItemDetails &&
														orderItemDetails.summary &&
														orderItemDetails.summary.discountedTotal ? (
															<Currency
																value={(orderItemDetails.summary.total -
																	orderItemDetails.summary.discountedTotal).toFixed(
																	2
																)}
															/>
														) : (
															'0'
														)}
													</p>
												</div>
											</div>
										</Card>
									</React.Fragment>
								) : (
									<div />
								)}
								{orderItemDetails && orderItemDetails.summary && orderItemDetails.items.length > 0 ? (
									<React.Fragment>
										<Card className="w-100 mt-6 cursor-pointer">
											<div className="row m-0">
												<div
													className={
														selectedOrderItem ||
														orderType === 'discount' ||
														orderType === 'tax' ? (
															'col-md-4'
														) : (
															'col-md-2'
														)
													}
												>
													<div className="p-0 row">
														<p
															className="borderRight pt-1"
															style={{
																backgroundColor: blue[600],
																textAlign:
																	selectedOrderItem ||
																	orderType === 'discount' ||
																	orderType === 'tax'
																		? 'center'
																		: ''
															}}
														>
															<UnfoldMoreIcon
																style={{ color: 'white', fontSize: '13px' }}
															/>
														</p>
														<div>
															<p className="sectionContent py-2 pl-4">Summary</p>
															<p
																className="sectionContent pl-16 ml-8"
																style={{
																	display:
																		selectedOrderItem ||
																		orderType === 'discount' ||
																		orderType === 'tax'
																			? ''
																			: 'none'
																}}
															/>
														</div>
													</div>
												</div>
												<div
													className="col-md-2"
													style={{
														display:
															selectedOrderItem ||
															orderType === 'discount' ||
															orderType === 'tax'
																? 'none'
																: ''
													}}
												/>
												<div
													className="col-md-2 "
													style={{
														display:
															selectedOrderItem ||
															orderType === 'discount' ||
															orderType === 'tax'
																? 'none'
																: ''
													}}
												>
													<p className="sectionContent py-3" />
												</div>
												<div
													className={
														selectedOrderItem ||
														orderType === 'discount' ||
														orderType === 'tax' ? (
															'col-md-4'
														) : (
															'col-md-2'
														)
													}
												>
													<p className="sectionContent py-2 pl-16">
														{orderItemDetails && orderItemDetails.summary ? (
															<Currency value={orderItemDetails.summary.total} />
														) : (
															'0'
														)}
													</p>
												</div>
												<div
													className="col-md-2 pl-16 "
													style={{
														display:
															selectedOrderItem ||
															orderType === 'discount' ||
															orderType === 'tax'
																? 'none'
																: ''
													}}
												>
													<p
														className="sectionContent ml-6 py-2 pl-16"
														style={{ paddingLeft: '30px' }}
													/>
												</div>
												<div
													className={
														selectedOrderItem ||
														orderType === 'discount' ||
														orderType === 'tax' ? (
															'col-md-4'
														) : (
															'col-md-2'
														)
													}
												>
													<p className="sectionContent py-2">
														{orderItemDetails && orderItemDetails.summary ? (
															<Currency
																value={orderItemDetails.summary.discountedTotal}
															/>
														) : (
															'0'
														)}
													</p>
												</div>
											</div>
										</Card>
									</React.Fragment>
								) : (
									<div />
								)}
							</div>
						</div>

						<div
							style={{
								width:
									selectedOrderItem || orderType === 'discount' || orderType === 'tax' ? '57%' : '0%',
								transition: 'all 0.4s ease'
							}}
							className="ml-auto"
						>
							{selectedOrderItem && (
								<Card className={selectedOrderItem ? 'p-24' : 'p-0'}>
									<div className="row ">
										<div className="col-md-4">
											<p className="sectionContent">Name</p>
											<Card
												style={{
													backgroundColor: 'rgb(220,220,220)',
													color: 'black'
												}}
											>
												<p className="sectionSubTitle px-16 py-1">
													{selectedOrderItem.itemNumber}
												</p>
											</Card>
										</div>
										<div className="col-md-4">
											<p className="sectionContent">UOM</p>
											<Card
												style={{
													backgroundColor: 'rgb(220,220,220)',
													color: 'black'
												}}
											>
												<p className="sectionSubTitle px-16 py-1">
													{selectedOrderItem.unitOfMeasure ? (
														selectedOrderItem.unitOfMeasure
													) : (
														'NA'
													)}
												</p>
											</Card>
										</div>
										<div className="col-md-4 ">
											<Card
												className=" py-0 mt-24"
												style={{
													backgroundColor: 'rgb(220,220,220)',
													color: 'black'
												}}
											>
												<div className="row px-4">
													<Checkbox
														size="small"
														onChange={handleChange}
														checked={selectedOrderItem.customerItem}
														name="customerItem"
														color="primary"
														inputProps={{
															'aria-label': 'secondary checkbox'
														}}
														disable
														className="py-2"
													/>
													<p className="sectionSubTitle pt-1 ">
														{category === 'Sales' ? 'Customers Item' : 'Supplier Item'}
													</p>
												</div>
											</Card>
										</div>
									</div>
									<div className="mt-24">
										<p>Description</p>
										<Card
											style={{
												backgroundColor: 'rgb(220,220,220)',
												color: 'black'
											}}
										>
											<p className="sectionSubTitle px-16 py-1">
												{selectedOrderItem.description ? selectedOrderItem.description : 'NA'}
											</p>
										</Card>
									</div>
									<div className="mt-24 ">
										<p>Internal Notes</p>

										<Card
											style={{
												backgroundColor: 'rgb(220,220,220)',
												color: 'black'
											}}
										>
											<p className="sectionSubTitle px-16 py-1">
												{selectedOrderItem.internalNote ? selectedOrderItem.internalNote : 'NA'}
											</p>
										</Card>
									</div>

									<div className="row mt-16">
										<div className="col-md-6">
											<p className="sectionContent">Accounting Code</p>
											<Card
												style={{
													backgroundColor: 'rgb(220,220,220)',
													color: 'black'
												}}
											>
												<p className="sectionSubTitle px-16 py-1">
													{selectedOrderItem.accountingCode ? (
														selectedOrderItem.accountingCode
													) : (
														'NA'
													)}
												</p>
											</Card>
										</div>

										<div className="col-md-6 mt-4">
											<p className="sectionContent">Delivery due date</p>
											<MuiPickersUtilsProvider utils={DateFnsUtils}>
												<Grid>
													<KeyboardDatePicker
														disableToolbar
														variant="inline"
														format="MM/dd/yyyy"
														id="date-picker-inline"
														name="itemDueDate"
														value={selectedOrderItem && selectedOrderItem.itemDueDate}
														onChange={(e) => handleChange(e, 'date')}
														KeyboardButtonProps={{
															'aria-label': 'change date'
														}}
													/>
												</Grid>
											</MuiPickersUtilsProvider>
										</div>
									</div>
									<div className="mt-16">
										<div className="w-100 border">
											<p className="py-1 pl-16 sectionTitle">Pricing</p>
										</div>
										<div className=" border  px-12 py-12">
											<div className="row mt-8 align-items-end ">
												<div className="col-md-4">
													<p className="sectionContent">₹/Unit</p>
													<TextField
														type="Number"
														onChange={handleChange}
														name="unitValue"
														value={selectedOrderItem && selectedOrderItem.unitValue}
														InputProps={{ style: { height: 31, fotSize: 14 } }}
														required
														id="outlined-required"
														variant="outlined"
													/>
												</div>
												<div className="col-md-4">
													<p className="sectionContent">Qty</p>
													<TextField
														type="number"
														onChange={handleChange}
														name="qty"
														value={selectedOrderItem.qty}
														InputProps={{ style: { height: 31, fotSize: 14 } }}
														required
														id="outlined-required"
														variant="outlined"
													/>
												</div>
												<div className="col-md-4 ">
													<Card className=" py-0">
														<div className="row px-4">
															<Checkbox
																size="small"
																onChange={handleChange}
																checked={selectedOrderItem.TAndMPricing}
																name="TAndMPricing"
																color="primary"
																inputProps={{
																	'aria-label': 'secondary checkbox'
																}}
																className="py-2"
															/>
															<p className="sectionSubTitle pt-1 ">T & M pricing</p>
														</div>
													</Card>
												</div>
												<div className="col-md-6 mt-2">
													<p className="sectionContent">Sub Total</p>
													<Card
														className="py-2 px-4"
														style={{
															backgroundColor: 'rgb(220,220,220)',
															color: 'black'
														}}
													>
														{isNaN(selectedOrderItem.unitValue * selectedOrderItem.qty) ? (
															0
														) : (
															selectedOrderItem.unitValue * selectedOrderItem.qty
														)}
													</Card>
												</div>
											</div>
											<div className="mt-4">
												<div className="col-md-12">
													<Card className="row ">
														<Checkbox
															checked={selectedOrderItem.applyDiscount}
															size="small"
															name="applyDiscount"
															onChange={handleChange}
															color="primary"
															inputProps={{
																'aria-label': 'secondary checkbox'
															}}
															className="py-2"
														/>
														<p className="sectionSubTitle  pt-1">Apply Discount?</p>
													</Card>
												</div>
												{selectedOrderItem.applyDiscount && (
													<div>
														<div className="row mt-8">
															<div className="col-md-4">
																<p className="sectionContent">Type</p>
																<div className="row m-0 p-0">
																	<Card
																		className="py-2 text-center col-md-6"
																		style={{
																			cursor: 'pointer',
																			backgroundColor:
																				selectedOrderItem.discountType === '%'
																					? 'white'
																					: 'rgb(220,220,220)'
																		}}
																		onClick={() =>
																			handleChange('%', 'discountType')}
																	>
																		%
																	</Card>

																	<Card
																		className="py-2  col-md-6 text-center"
																		style={{
																			backgroundColor:
																				selectedOrderItem.discountType === '₹'
																					? 'white'
																					: 'rgb(220,220,220)',
																			color: 'black',
																			cursor: 'pointer'
																		}}
																		onClick={() =>
																			handleChange('₹', 'discountType')}
																	>
																		₹
																	</Card>
																</div>
															</div>
															<div className="col-md-4">
																<p className="sectionContent">₹/Unit</p>
																<OutlinedInput
																	disabled={
																		!selectedOrderItem.discountType ||
																		selectedOrderItem.discountType === '%'
																	}
																	variant="outlined"
																	placeholder=""
																	className="w-100 bg-white pl-0"
																	inputProps={{
																		style: {
																			fotSize: 10,
																			padding: 6
																		}
																	}}
																	name="discountRate"
																	onChange={handleChange}
																	value={selectedOrderItem.discountRate}
																	startAdornment={
																		<InputAdornment position="end">
																			<p> ₹</p>
																		</InputAdornment>
																	}
																/>
															</div>
															<div className="col-md-4 ">
																<p className="sectionContent">% Unit</p>
																<OutlinedInput
																	variant="outlined"
																	name="perRate"
																	onChange={handleChange}
																	value={selectedOrderItem.perRate}
																	disabled={
																		!selectedOrderItem.discountType ||
																		selectedOrderItem.discountType === '₹'
																	}
																	placeholder=""
																	className="w-100 bg-white pl-0"
																	inputProps={{
																		style: {
																			fotSize: 10,
																			padding: 6
																		}
																	}}
																	endAdornment={
																		<InputAdornment position="end">
																			<p> %</p>
																		</InputAdornment>
																	}
																/>
															</div>
														</div>
														<div className="row   mt-8 ">
															<div className="col-md-6 ">
																<p className="sectionContent">Discounted Unit price</p>
																<Card
																	className="py-2 px-4"
																	style={{
																		backgroundColor: 'rgb(220,220,220)',
																		color: 'black'
																	}}
																>
																	₹{getSubtotals('unit', selectedOrderItem)}
																</Card>
															</div>

															<div className="col-md-6 ">
																<p className="sectionContent">Discounted Subtotal</p>
																<Card
																	className="py-2 px-4 "
																	style={{
																		backgroundColor: 'rgb(220,220,220)',
																		color: 'black'
																	}}
																>
																	<Currency value={selectedOrderItem.subTotal} />
																</Card>
															</div>
														</div>
													</div>
												)}

												<div className="row mt-16">
													<div className="col-md-6 ">
														<Card>
															<div className="row pl-16">
																<Checkbox
																	size="small"
																	checked={selectedOrderItem.taxable}
																	onChange={handleChange}
																	color="primary"
																	name="taxable"
																	inputProps={{
																		'aria-label': 'secondary checkbox'
																	}}
																	className="pl-8 py-2"
																/>
																<p className="sectionSubTitle   pt-1">is Taxable?</p>
															</div>
														</Card>
													</div>
													{selectedOrderItem.taxable && (
														<div className="col-md-6 ">
															<Card>
																<div className="row pl-16">
																	<Checkbox
																		size="small"
																		checked={selectedOrderItem.overrideTaxRate}
																		onChange={handleChange}
																		name="overrideTaxRate"
																		color="primary"
																		inputProps={{
																			'aria-label': 'secondary checkbox'
																		}}
																		className="pl-8 py-2"
																	/>
																	<p className="sectionSubTitle   pl-8 pt-1">
																		Override Tax Rate?
																	</p>
																</div>
															</Card>
														</div>
													)}
												</div>
												{selectedOrderItem.taxable &&
												selectedOrderItem.overrideTaxRate && (
													<div>
														<div className="row   mt-8 ">
															<div className="col-md-6 ">
																<p className="sectionContent">Discounted Unit price</p>
																<Card
																	className="py-2 px-4"
																	style={{
																		color: blue[600]
																	}}
																>
																	<div className="row pl-4 spacingBetween">
																		<div className="row">
																			<p
																				className="px-2"
																				onClick={handleTaxClick}
																			>
																				New Tax Code
																			</p>
																			<AddIcon style={{ fontSize: 18 }} />
																		</div>
																		<div>
																			<SearchIcon
																				onClick={() => setTaxDialogOpen(true)}
																				style={{
																					opacity: 0.8,
																					fontSize: '18px',
																					paddingTop: '2px',
																					color: 'black'
																				}}
																			/>
																		</div>
																	</div>
																</Card>
															</div>

															<div className="col-md-6 ">
																<p className="sectionContent">Rate</p>
																<TextField
																	InputProps={{
																		style: { height: 31, fotSize: 14 }
																	}}
																	value={
																		selectedOrderItem.tax &&
																		selectedOrderItem.tax.rate
																	}
																	className="w-100"
																	required
																	id="outlined-required"
																	defaultValue=""
																	variant="outlined"
																/>
															</div>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
									<div className="mt-16">
										<div className="w-100 border">
											<p className="py-1 pl-16 sectionTitle">
												BOM/Routing for {selectedOrderItem && selectedOrderItem.itemNumber}
											</p>
										</div>
										<div className=" border  px-12 py-12 ">
											<Button
												className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
												variant="contained"
												color="primary"
												disabled={loadingBomItemDetails}
												onClick={handleBomDialog}
											>
												{loadingBomItemDetails ? 'Loading...' : 'BOM/Routing'}
											</Button>
										</div>
									</div>
									<div className="mt-16 border">
										<div className="w-100 border spacingBetween px-12">
											<p className="py-1  sectionTitle">
												Cost Breakdown for {selectedOrderItem && selectedOrderItem.itemNumber}
											</p>
											{costBreakdownByTotal && (
												<p className="sectionContent" style={{ color: blue[600] }}>
													View Full Cost Breakdown
												</p>
											)}
										</div>
										<p className="px-12 sectionContent  mt-16">Sumarized Cost by</p>
										<div className="row  mx-1 mt-8 ">
											<Card
												className="py-2 text-center col-md-6"
												style={{
													cursor: 'pointer',
													backgroundColor: costBreakdownByTotal ? 'rgb(220,220,220)' : 'white'
												}}
												onClick={() => setCostBreakdownByTotal(true)}
											>
												Total
											</Card>

											<Card
												className="py-2  col-md-6 text-center"
												style={{
													backgroundColor: costBreakdownByTotal
														? 'white'
														: 'rgb(220,220,220)',
													color: 'black',
													cursor: 'pointer'
												}}
												onClick={() => setCostBreakdownByTotal(false)}
											>
												Unit
											</Card>
										</div>
										<div className="row mt-24 mb-8 px-12">
											<div className="col-md-3 px-2">
												<div style={{ borderColor: '#3f51b5' }} className="pl-8  breakDownCard">
													<p className="sectionContent  ">Material</p>
													<p className="sectionContent ">
														Cost{!costBreakdownByTotal && <span>/Piece</span>}
													</p>
													<p>
														{costBreakdownByTotal ? (
															<Currency
																value={findTotalUnitMaterialCost('total', 'costPrice')}
															/>
														) : (
															<Currency
																value={findTotalUnitMaterialCost('unit', 'costPrice')}
															/>
														)}
													</p>
												</div>
											</div>

											<div className="col-md-3 px-2">
												<div className=" pl-8 breakDownCard" style={{ borderColor: '#cd5c5c' }}>
													<p className="sectionContent">Margin</p>

													<p className="sectionContent" style={{ marginBottom: '19px' }}>
														{costBreakdownByTotal ? (
															findTotalUnitMaterialCost('total', 'totalMargin')
														) : (
															findTotalUnitMaterialCost('unit', 'unitMargin')
														)}%
													</p>
												</div>
											</div>
										</div>
									</div>
								</Card>
							)}
							{orderType === 'discount' && (
								<Card className={orderType === 'discount' ? 'p-24' : 'p-0'}>
									<div>
										<div className="mt-4">
											<div className="col-md-12">
												<Card className="row ">
													<Checkbox
														checked={
															orderItemDetails.discountInfo &&
															orderItemDetails.discountInfo.applyDiscount
														}
														size="small"
														onChange={(e) => handleItemsDiscountChange(e)}
														color="primary"
														name="applyDiscount"
														inputProps={{
															'aria-label': 'secondary checkbox'
														}}
														className="py-2"
													/>
													<p className="sectionSubTitle  pt-1">Apply Discount?</p>
												</Card>
											</div>
											{orderItemDetails.discountInfo &&
											orderItemDetails.discountInfo.applyDiscount && (
												<div>
													<div className="row mt-8">
														<div className="col-md-4">
															<p className="sectionContent">Type</p>
															<div className="row m-0 p-0">
																<Card
																	className="py-2 text-center col-md-6"
																	style={{
																		cursor: 'pointer',
																		backgroundColor:
																			orderItemDetails.discountInfo &&
																			orderItemDetails.discountInfo
																				.discountType === '%'
																				? 'white'
																				: 'rgb(220,220,220)'
																	}}
																	onClick={() =>
																		handleItemsDiscountChange('%', 'discountType')}
																>
																	%
																</Card>

																<Card
																	className="py-2  col-md-6 text-center"
																	style={{
																		backgroundColor:
																			orderItemDetails.discountInfo &&
																			orderItemDetails.discountInfo
																				.discountType === '₹'
																				? 'white'
																				: 'rgb(220,220,220)',
																		color: 'black',
																		cursor: 'pointer'
																	}}
																	onClick={() =>
																		handleItemsDiscountChange('₹', 'discountType')}
																>
																	₹
																</Card>
															</div>
														</div>
														<div className="col-md-4">
															<p className="sectionContent">₹/Unit</p>
															<OutlinedInput
																variant="outlined"
																type="text"
																placeholder=""
																className="w-100 bg-white pl-0"
																inputProps={{
																	style: {
																		fotSize: 10,
																		padding: 6
																	}
																}}
																disabled={
																	!orderItemDetails.discountInfo.discountType ||
																	orderItemDetails.discountInfo.discountType === '%'
																}
																name="discountRate"
																value={
																	orderItemDetails.discountInfo &&
																	orderItemDetails.discountInfo.discountRate
																}
																onChange={(e) => handleItemsDiscountChange(e)}
																startAdornment={
																	<InputAdornment position="end">
																		<p> ₹</p>
																	</InputAdornment>
																}
															/>
														</div>
														<div className="col-md-4 ">
															<p className="sectionContent">% Unit</p>
															<OutlinedInput
																variant="outlined"
																type="text"
																placeholder=""
																className="w-100 bg-white pl-0"
																inputProps={{
																	style: {
																		fotSize: 10,
																		padding: 6
																	}
																}}
																disabled={
																	!orderItemDetails.discountInfo.discountType ||
																	orderItemDetails.discountInfo.discountType === '₹'
																}
																value={
																	orderItemDetails.discountInfo &&
																	orderItemDetails.discountInfo.perRate
																}
																name="perRate"
																onChange={(e) => handleItemsDiscountChange(e)}
																endAdornment={
																	<InputAdornment position="end">
																		<p> %</p>
																	</InputAdornment>
																}
															/>
														</div>
													</div>
													<div className="row   mt-8 ">
														<div className="col-md-6 ">
															<p className="sectionContent">Sub Total</p>
															<Card
																className="py-2 px-4"
																style={{
																	backgroundColor: 'rgb(220,220,220)',
																	color: 'black'
																}}
															>
																{orderItemDetails &&
																orderItemDetails.summary &&
																orderItemDetails.summary.total ? (
																	<Currency value={orderItemDetails.summary.total} />
																) : (
																	'0'
																)}
															</Card>
														</div>

														<div className="col-md-6 ">
															<p className="sectionContent">Discounted Subtotal</p>
															<Card
																className="py-2 px-4 "
																style={{
																	backgroundColor: 'rgb(220,220,220)',
																	color: 'black'
																}}
															>
																{orderItemDetails &&
																orderItemDetails.summary &&
																orderItemDetails.summary.discountedTotal ? (
																	<Currency
																		value={orderItemDetails.summary.discountedTotal}
																	/>
																) : (
																	'0'
																)}
															</Card>
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
								</Card>
							)}
							{orderType === 'tax' && (
								<Card className={orderType === 'tax' ? 'p-24' : 'p-0'}>
									<div>
										<div className="row">
											<div className="col-md-5 ">
												<Card>
													<div className="row pl-16">
														<Checkbox
															size="small"
															name="taxable"
															checked={
																orderItemDetails &&
																orderItemDetails.taxes &&
																orderItemDetails.taxes.taxable
															}
															onChange={(e) => handleItemsTaxChange(e)}
															color="primary"
															inputProps={{
																'aria-label': 'secondary checkbox'
															}}
															className="pl-8 py-2"
														/>
														<p className="sectionSubTitle   pl-8 pt-1">is Taxable?</p>
													</div>
												</Card>
											</div>

											{orderItemDetails &&
											orderItemDetails.taxes &&
											orderItemDetails.taxes.taxable && (
												<div className="col-md-5 ">
													<Card>
														<div className="row pl-16">
															<Checkbox
																size="small"
																checked={
																	orderItemDetails &&
																	orderItemDetails.taxes &&
																	orderItemDetails.taxes.overrideTaxRate
																}
																onChange={(e) => handleItemsTaxChange(e)}
																name="overrideTaxRate"
																color="primary"
																inputProps={{
																	'aria-label': 'secondary checkbox'
																}}
																className="pl-8 py-2"
															/>
															<p className="sectionSubTitle   pl-8 pt-1">
																Override Tax Rate?
															</p>
														</div>
													</Card>
												</div>
											)}
										</div>
										{orderItemDetails &&
										orderItemDetails.taxes &&
										orderItemDetails.taxes.taxable &&
										orderItemDetails.taxes.overrideTaxRate && (
											<div>
												<div className="row   mt-8 ">
													<div className="col-md-6 ">
														<p className="sectionContent">Discounted Unit price</p>
														<Card
															className="py-2 px-4"
															style={{
																color: blue[600]
															}}
														>
															<div className="row pl-4 spacingBetween">
																<div className="row" onClick={handleTaxClick}>
																	<p className="px-2">New Tax Code</p>
																	<AddIcon style={{ fontSize: 18 }} />
																</div>
																<div>
																	<SearchIcon
																		style={{
																			opacity: 0.8,
																			fontSize: '18px',
																			paddingTop: '2px',
																			color: 'black'
																		}}
																		onClick={handleItemsTaxDialog}
																	/>
																</div>
															</div>
														</Card>
													</div>
												</div>
											</div>
										)}
									</div>
								</Card>
							)}
						</div>
					</div>
				</div>
				<Dialog open={Boolean(selectedItem)} fullWidth={true} maxWidth="lg">
					<DialogTitle>
						<p className="sectionTitle">BOM</p>
					</DialogTitle>
					<DialogContent>
						<div>
							<div
								className={classNames(
									classes.bomHeader,
									'd-flex flex-row justify-between align-items-center'
								)}
							>
								<p style={{ minWidth: 370, textAlign: 'start' }}>Bill of Materials</p>
								<div className="d-flex flex-row align-items-center" style={{ margin: '0px 10px' }}>
									<p>Quantity</p>
									<p>Unit</p>
									<p>Unit Cost</p>
									<p>Total Cost</p>
									<p className="actions">Actions</p>
								</div>
							</div>
							<div>
								<RenderBomItems
									item={selectedItem}
									classes={classes}
									isParent={true}
									updateBomItemTotal={updateBomItemTotal}
								/>
							</div>
						</div>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => {
								setSelectedItem(null);
							}}
							variant="outlined"
							color="primary"
						>
							cancel
						</Button>
						<Button
							onClick={() => {
								setSelectedItem(null);
							}}
							variant="contained"
							color="primary"
						>
							Save
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={Boolean(orderType === 'newItem')}
					fullWidth={true}
					maxWidth="sm"
					onClose={handleOrderTypeClose}
				>
					<DialogTitle>
						<p className="sectionTitle">{orderType === 'newItem' ? 'NewItem' : ''} </p>
					</DialogTitle>
					<DialogContent>
						{orderType === 'newItem' && (
							<div className="container p-0">
								<div className=" row">
									<div className="col-md-6  mt-4 ">
										<div className="row m-0 p-0">
											<p className="sectionContent">Item Number</p>
											<TextField
												inputProps={{ style: { height: 5, fotSize: 20 } }}
												placeholder="Item Number"
												className="p-0 m-0"
												fullWidth
												type="number"
												margin="normal"
												InputLabelProps={{
													shrink: true,
													fontSize: '12px'
												}}
												variant="outlined"
												name="itemNumber"
												value={newMaterialItem.itemNumber}
												onChange={handleNewMaterialItemChange}
											/>
										</div>
									</div>
									<div className="col-md-6 mt-4 ">
										<div className="row m-0 p-0">
											<p className="sectionContent">Item Origin</p>
											<FormControl
												variant="outlined"
												style={{ width: '231px', height: '20px !important' }}
											>
												<Select
													labelId="demo-simple-select-outlined-label"
													id="demo-simple-select-outlined"
													style={{
														height: 40,
														minHeight: 40
													}}
													name="source"
													value={newMaterialItem.source}
													onChange={handleNewMaterialItemChange}
												>
													<MenuItem value="Make">Make</MenuItem>
													<MenuItem value="Make or Buy">Make or Buy</MenuItem>
													<MenuItem value="Customer Supplied">Customer Supplied</MenuItem>
													<MenuItem value="Buy">Buy</MenuItem>
												</Select>
											</FormControl>
										</div>
									</div>
									<div className="col-md-6 mt-4">
										<div className="row m-0 p-0">
											<p className="sectionContent">Unit Type</p>
											<FormControl
												variant="outlined"
												style={{ width: '231px', height: '20px !important' }}
											>
												<Select
													labelId="unitType"
													id="unitType"
													style={{
														height: 40,
														minHeight: 40
													}}
													name="unitType"
													value={newMaterialItem.unitType}
													onChange={handleNewMaterialItemChange}
												>
													{unitTypes && Object.keys(unitTypes).length > 0 ? (
														Object.keys(unitTypes).map((item) => {
															return <MenuItem value={item}>{item}</MenuItem>;
														})
													) : (
														<MenuItem disabled>No Options</MenuItem>
													)}
												</Select>
											</FormControl>
										</div>
									</div>

									<div className="col-md-6 mt-4">
										<div className="row m-0 p-0">
											<p className="sectionContent">Unit of Measure</p>
											<FormControl
												variant="outlined"
												style={{ width: '231px', height: '20px !important' }}
											>
												<Select
													labelId="unitOfMeasure"
													id="unitOfMeasure"
													style={{
														height: 40,
														minHeight: 40
													}}
													name="unitOfMeasure"
													value={newMaterialItem.unitOfMeasure}
													onChange={handleNewMaterialItemChange}
												>
													{' '}
													{unitTypes &&
													newMaterialItem.unitType &&
													unitTypes[newMaterialItem.unitType] &&
													unitTypes[newMaterialItem.unitType].length > 0 ? (
														unitTypes[newMaterialItem.unitType].map((item) => {
															return <MenuItem value={item}>{item}</MenuItem>;
														})
													) : (
														<MenuItem disabled>No Options</MenuItem>
													)}
												</Select>
											</FormControl>
										</div>
									</div>

									<div className="col-md-12 mt-4 ">
										<p className="sectionContent">Description</p>

										<OutlinedInput
											variant="outlined"
											type="text"
											placeholder="Description"
											multiline
											rows={2}
											className="w-100 bg-white"
											inputProps={{
												style: {
													fotSize: 10,
													padding: 6
												}
											}}
											name="description"
											value={newMaterialItem.description}
											onChange={handleNewMaterialItemChange}
										/>
									</div>
								</div>
							</div>
						)}
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleOrderTypeClose}
							className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
							variant="outlined"
							color="primary"
						>
							<p>Cancel</p>
						</Button>
						<Button
							onClick={handleAddBomItem}
							disabled={
								newMaterialItem.itemNumber === '' ||
								newMaterialItem.source === '' ||
								newMaterialItem.unitOfMeasure === '' ||
								newMaterialItem.unitType === '' ||
								newMaterialItem.description === ''
							}
							className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
							variant="contained"
							color="primary"
						>
							<p>Save</p>
						</Button>
					</DialogActions>
				</Dialog>
				{selectedTax && (
					<Dialog open={Boolean(selectedTax)} maxWidth="sm" fullWidth={true}>
						<DialogTitle>
							<p className="sectionTitle">Add Tax</p>
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
										onChange={handleTaxChange}
									/>
								</div>
								<div style={{ width: '48%' }}>
									<p className="m-0 text-14 mb-2">Rate</p>
									<OutlinedInput
										fullWidth
										value={selectedTax.rate}
										onChange={handleTaxChange}
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
													<p style={{ fontSize: 20 }} className=" cursor-pointer">
														%
													</p>
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

							<Button
								color="primary"
								variant="contained"
								className="px-5"
								disabled={createTaxLoader || selectedTax.rate === '' || selectedTax.tax === ''}
								onClick={handleAddTax}
							>
								{createTaxLoader ? 'Adding...' : 'Add'}
							</Button>
						</DialogActions>
					</Dialog>
				)}

				<Dialog
					open={taxDialogOpen}
					onClose={handleCloseTaxDialog}
					aria-labelledby="responsive-dialog-title"
					maxWidth="sm"
					fullWidth={true}
				>
					<DialogTitle className="px-4">
						<p className="sectionTitle">Tax</p>
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
												<p className="sectionSubTitle">Code</p>
											</TableCell>
											<TableCell align="right">
												<p className="sectionSubTitle">Rate</p>
											</TableCell>
											<TableCell align="right">
												<p className="sectionSubTitle">Action</p>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{taxes &&
											taxes.map((row) => (
												<TableRow key={row.id}>
													<TableCell component="th" scope="row">
														<p className="sectionContent">{row.code}</p>
													</TableCell>
													<TableCell align="right">
														<p className="sectionContent">{row.rate}</p>
													</TableCell>
													<TableCell align="right">
														<Button
															variant="contained"
															color="primary"
															onClick={() =>
																handleSingleItemTaxSelection(
																	row,
																	findSelectedSingleItemTax(row.id)
																		? 'Remove'
																		: 'Select'
																)}
														>
															{findSelectedSingleItemTax(row.id) ? 'Remove' : 'Select'}
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
						<Button onClick={handleItemTaxDialogClose} variant="outlined" color="primary">
							<p>Cancel</p>
						</Button>
						<Button onClick={handleSingleItemTaxSave} variant="contained" color="primary">
							<p>Save</p>
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={itemsTaxDialogOpen}
					onClose={handleCloseItemsTax}
					aria-labelledby="responsive-dialog-title"
					maxWidth="sm"
					fullWidth={true}
				>
					<DialogTitle className="px-4">
						<p className="sectionTitle">Tax</p>
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
												<p className="sectionSubTitle">Code</p>
											</TableCell>
											<TableCell align="right">
												<p className="sectionSubTitle">Rate</p>
											</TableCell>
											<TableCell align="right">
												<p className="sectionSubTitle">Action</p>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{taxes &&
											taxes.map((row) => (
												<TableRow key={row.id}>
													<TableCell component="th" scope="row">
														<p className="sectionContent">{row.code}</p>
													</TableCell>
													<TableCell align="right">
														<p className="sectionContent">{row.rate}</p>
													</TableCell>
													<TableCell align="right">
														<Button
															variant="contained"
															color="primary"
															onClick={() =>
																handleItemsTaxSelection(
																	row,
																	findSelectedTax(row.id) ? 'Remove' : 'Select'
																)}
														>
															{findSelectedTax(row.id) ? 'Remove' : 'Select'}
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
						<Button onClick={handleCloseItemsTax} variant="outlined" color="primary">
							<p>Cancel</p>
						</Button>
						<Button
							onClick={handleItemTaxesSave}
							className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
							variant="contained"
							color="primary"
						>
							<p>Save</p>
						</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={Boolean(orderType === 'item')}
					onClose={handleOrderTypeClose}
					aria-labelledby="responsive-dialog-title"
					maxWidth="sm"
					fullWidth={true}
				>
					<DialogTitle className="px-4">
						<p className="sectionTitle" style={{ textTransform: 'capitalize' }}>
							Items
						</p>
					</DialogTitle>

					<DialogContent className="px-4">
						<TextField
							InputProps={{ style: { height: 35, fotSize: 14 } }}
							required
							id="outlined-required"
							variant="outlined"
							className="w-100 "
							onChange={handleSearchForItems}
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
										{items &&
											items.map((item, index) => (
												<TableRow key={index}>
													<TableCell align="left" className="sectionContent">
														{item.description}
													</TableCell>

													<TableCell align="right">
														<Button
															variant="contained"
															color="primary"
															onClick={() =>
																handleSelectedItems(
																	item,
																	findSelectedItem(item) ? 'Remove' : 'Select'
																)}
														>
															{findSelectedItem(item) ? 'Remove' : 'Select'}
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
						<Button variant="outlined" color="primary" onClick={handleOrderTypeClose}>
							Cancel
						</Button>
						<Button
							className="sectionSubTitle px-4"
							variant="contained"
							color="primary"
							onClick={handleItemsSave}
						>
							Save
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</div>
	);
};

export default Item;
