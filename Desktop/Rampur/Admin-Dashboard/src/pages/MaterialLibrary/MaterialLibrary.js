import React, { useEffect, useContext, useState } from 'react';
import 'date-fns';

import { useHistory } from 'react-router-dom';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import { Prompt } from 'react-router';
import Checkbox from '@material-ui/core/Checkbox';
import classNames from 'classnames';
import _ from 'lodash';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import LayersIcon from '@material-ui/icons/Layers';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Layout from 'layout/Layout';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { blue } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import EditIcon from '@material-ui/icons/Edit';
import DialogBox from 'components/DialogBox';
import Currency from 'components/Currency';
import { unitTypes } from 'staticData';
import AppContext from 'context/AppContext';
import DeleteIcon from '@material-ui/icons/Delete';
import LoaderComponent from 'components/LoaderComponent';
import {
	fetchCategoryList,
	addMaterialItem,
	updateDetails,
	fetchItems,
	fetchItemDetails,
	createNewTransaction,
	fetchTransactions,
	fetchInventory,
	fetchBomItemsList,
	updateBomData,
	fetchBomChildItems,
	updateInventory,
	deleteTransaction,
	fetchDemandData
} from 'api';

import { NumberFormat } from '../../components/NumberFormat';
import { parse } from 'date-fns';

// bom card UI Start
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

const BomCard = ({ item, classes, handleItem, handleExpanded, isParent, handleBomEditItems, updateBomItemTotal }) => {
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
						<div className="color mr-3" />
						<div>
							{isParent ? (
								<h5 className="itemNumber">
									{' '}
									<span className="mr-2">{item.itemNumber}</span>
									{item.description}{' '}
								</h5>
							) : (
								<h5
									onClick={() => handleItem(item)}
									className="itemNumber"
									style={{ textDecoration: 'underline', cursor: 'pointer' }}
								>
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
						<p className="blueColor">
							{' '}
							<Currency value={getUnitCost(item)} />
						</p>
						<p className="blueColor">
							<Currency value={getTotalCost(item, isParent)} />
						</p>
						<div className="actions">
							<div className="d-flex flex-row align-items-center">
								{item.items &&
								item.items.length > 0 && (
									<div className="actionIcon" onClick={() => handleExpanded(!item.expanded)}>
										{item.expanded ? <KeyboardArrowDownIcon /> : <ChevronLeft />}
									</div>
								)}
								{isParent && (
									<p
										style={{ fontSize: 14, minWidth: 'auto' }}
										className="cursor-pointer blueColor ml-3"
										onClick={() => handleBomEditItems(item)}
									>
										Edit Items
									</p>
								)}
							</div>
						</div>
					</div>
				</Paper>
			)}
		</React.Fragment>
	);
};

const RenderBomItems = ({ item, classes, isParent, handleItem, handleBomEditItems, updateBomItemTotal }) => {
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
				handleItem={handleItem}
				handleExpanded={handleExpanded}
				isParent={isParent}
				handleBomEditItems={handleBomEditItems}
				updateBomItemTotal={updateBomItemTotal}
			/>
			<Collapse in={renderItem.expanded} timeout="auto" unmountOnExit>
				{renderItem.items &&
				renderItem.items.length > 0 && (
					<div className="ml-40 mb-24">
						{renderItem.items.map((childItem, ind) => (
							<React.Fragment key={ind}>
								{childItem && (
									<RenderBomItems item={childItem} classes={classes} handleItem={handleItem} />
								)}
							</React.Fragment>
						))}
					</div>
				)}
			</Collapse>
		</React.Fragment>
	);
};

// bom card UI end

export default function MaterialLibrary(props) {
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(5);

	const [ paymentTermsSelectionDialogOpen, setPaymentTermsSelectionDialogOpen ] = useState(false);
	const [ selectedDate, setSelectedDate ] = useState(new Date('2020-08-18T21:11:54'));
	const [ orderType, setOrderType ] = useState('Add');
	const [ selectedValues, setSelectedValues ] = useState([ { id: 1, label: 'tag1' } ]);

	const [ itemsLoader, setItemsLoader ] = useState(false);
	const [ selectedTab, setSelectedTab ] = useState(null);

	const [ selectedItem, setSelectedItem ] = useState(null);
	const [ selectedItemLoader, setSelectedItemLoader ] = useState(null);
	const [ newValue, setNewValue ] = useState('');
	const [ categoryList, setCategoryList ] = useState(null);
	const [ allCategoryList, setAllCategoryList ] = useState(null);
	const [ categoryListLoader, setCategoryListLoader ] = useState(false);
	const [ selectedCategory, setSelectedCategory ] = useState(null);
	const [ newCategoryValue, setNewCategoryValue ] = useState(null);
	const [ updateDataLoader, setUpdateDataLoader ] = useState(false);
	const [ newMaterialItem, setNewMaterialItem ] = useState(null);
	const [ addMaterialLoader, setAddMaterialLoader ] = useState(false);
	const [ items, setItems ] = useState([]);
	const [ allItems, setAllItems ] = useState([]);
	const [ selectedInventory, setSelectedInventory ] = useState(null);
	const [ transactionsLoader, setTransactionsLoader ] = useState(false);
	const [ transactions, setTransactions ] = useState([]);
	const [ allTransactions, setAllTransactions ] = useState([]);
	const [ InventoryLoader, setInventoryLoader ] = useState(false);
	const [ inventory, setInventory ] = useState([]);
	const [ createTransactionLoader, setCreateTransactionLoader ] = useState(false);
	const [ oldSelectedBomItem, setOldSelectedBomItem ] = useState(null);
	const [ selectedBomItem, setSelectedBomItem ] = useState(null);
	const [ selectedItemIndexToUpdate, setSelectedItemIndexToUpdate ] = useState(false);
	const [ bomItemsSearchLoader, setBomItemsSearchLoader ] = useState(false);
	const [ bomSearchItems, setBomSearchItems ] = useState(null);
	const [ allBomSearchItems, setAllBomSearchItems ] = useState(null);
	const [ createNewSubItem, setCreateNewSubItem ] = useState(false);
	const [ waringDialogOpen, setWarningDialogOpen ] = useState(false);
	const [ demandData, setDemandData ] = useState([]);

	const [ prevItems, setPrevItems ] = useState([]);
	const [ bomChilds, setBomChilds ] = useState([]);
	const [ bomParentTotal, setBomParentTotal ] = useState(null);
	const [ tag, setTags ] = useState([]);
	const [ newBomItem, setNewBomItem ] = useState({
		itemId: 'new',
		itemNumber: '',
		qty: null,
		unitType: ''
	});
	const [ selecteNewItem, seStelecteNewItem ] = useState(null);
	const [ cautionDialog, setCautionDialog ] = useState(false);
	const [ bomItemsEdited, setBomItemsEdited ] = useState(false);
	const [ recentItemNumber, setRecentItemNumber ] = useState(null);
	const context = useContext(AppContext);
	const classes = useStyles();
	const history = useHistory();

	// Home page  fns and apis and also table fns start
	useEffect(() => {
		getItems();
	}, []);

	const getItems = async () => {
		setItemsLoader(true);
		let res = await fetchItems();
		setItemsLoader(false);
		if (res.status !== 'error') {
			setItems(res.data);
			setAllItems(res.data);
		} else {
			context.addSnackMessage(res);
		}

		setRecentItemNumber(
			res.data &&
				res.data.reduce(
					(acc, shot) =>
						(acc = parseInt(acc) > parseInt(shot.itemNumber) ? parseInt(acc) : parseInt(shot.itemNumber)),
					0
				)
		);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	const handleSearchItems = (e) => {
		let text = e.target.value;

		let allRows = allItems;

		allRows = allRows.filter((item) => {
			let index;
			if (item.itemTags && item.itemTags.length > 0) {
				index = item.itemTags.findIndex((tagsItem) => {
					return tagsItem.toLowerCase().includes(text.toLowerCase());
				});
			}
			if (index >= 0 || item.item.toLowerCase().includes(text.toLowerCase())) {
				return item;
			}
			return null;
		});
		setItems(allRows);
		setRowsPerPage(5);
	};

	const handleItem = (item) => {
		if (
			selectedTab !== 'bom' ||
			!bomItemsEdited ||
			(bomItemsEdited && window.confirm('Are you sure you want to leave?'))
		) {
			setSelectedTab('details');
			getItemIdDetails(item.itemId);
			getInventory(item.itemId);
			getDemand(item.itemId);
			getTransactions(item);
			setBomItemsEdited(false);
			setSelectedItem({ ...selectedItem, items: prevItems });
		}
	};

	const handleItemClose = () => {
		if (
			selectedTab !== 'bom' ||
			!bomItemsEdited ||
			(bomItemsEdited && window.confirm('Are you sure you want to leave?'))
		) {
			setSelectedItem(null);
			setNewCategoryValue('');
			setSelectedCategory(null);
			setCategoryList(null);
			setAllCategoryList(null);
			setInventory(null);
			setTransactions(null);
			getItems();
			setBomItemsEdited(false);
		}
	};
	// Home page  fns and apis and also table fns end

	// demand screen api  start
	const getDemand = async (id) => {
		let res = await fetchDemandData(id);

		if (res.status !== 'error') {
			setDemandData(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};

	// demand api end
	// details screen apis and fns start

	const getItemIdDetails = async (id) => {
		setSelectedItemLoader(true);
		let res = await fetchItemDetails(id);
		setSelectedItemLoader(false);
		if (res.status !== 'error') {
			let data = res.data;
			if (data.source === 'Make' || data.source === 'Make or Buy') {
				getBomChildItems(id, res.data);
			} else {
				setSelectedItem(res.data);
			}
		} else {
			setSelectedItem(null);
			context.addSnackMessage(res);
		}
		getItems();
	};

	const handleDelete = (chipToDelete) => () => {
		let allTags = selectedItem.itemTags ? selectedItem.itemTags : [];
		let filtered = allTags.filter((item) => item !== chipToDelete);
		setSelectedItem({ ...selectedItem, itemTags: filtered });
	};
	const handleKeyDown = (e) => {
		if (newValue !== '' && e.key === 'Enter') {
			let allTags = selectedItem.itemTags ? [ ...selectedItem.itemTags ] : [];
			allTags.push(newValue);
			let obj = {
				usedFor: [ 'Items' ],
				name: newValue,
				colour: 'silver'
			};

			tag.push(obj);
			setTags(tag);

			setSelectedItem({ ...selectedItem, itemTags: allTags, tags: tag });

			setNewValue('');
		}
	};
	const handleAddDialog = (type) => {
		let newItem = {
			itemNumber: '',
			source: '',
			description: '',
			unitType: '',
			unitOfMeasure: '',
			type: type
		};
		setNewMaterialItem(newItem);
	};
	const handleAddDialogClose = () => {
		setNewMaterialItem(null);
		getItems();
	};
	const handleNewMaterialItemChange = (e) => {
		setNewMaterialItem({ ...newMaterialItem, [e.target.name]: e.target.value });
	};

	const handleCategoryClick = (category) => {
		setSelectedCategory(category);
		getCategoryList(category);

		let newValue = '';
		if (category === 'Item Shapes') newValue = selectedItem.shape;
		if (category === 'Item Accounting Codes') newValue = selectedItem.accountingCode;
		if (category === 'Item Category') newValue = selectedItem.category;
		if (category === 'Item Materials') newValue = selectedItem.material;
		if (category === 'Item Grades') newValue = selectedItem.grade;
		if (category === 'Item Thickness') newValue = selectedItem.thickness;
		setNewCategoryValue(newValue);
	};

	const handleCategoryClose = () => {
		setSelectedCategory(null);
		setNewCategoryValue('');
		setCategoryList(null);
		setAllCategoryList(null);
	};
	const getCategoryList = async (category) => {
		setCategoryListLoader(true);
		let res = await fetchCategoryList(category);
		setCategoryListLoader(false);
		if (res.status !== 'error') {
			setCategoryList(res.data);
			setAllCategoryList(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleCategoryAdd = (type, value) => {
		let field;
		if (type === 'Item Shapes') {
			field = 'shape';
		} else if (type === 'Item Accounting Codes') {
			field = 'accountingCode';
		} else if (type === 'Item Category') {
			field = 'category';
		} else if (type === 'Item Materials') {
			field = 'material';
		} else if (type === 'Item Grades') {
			field = 'grade';
		} else if (type === 'Item Thickness') {
			field = 'thickness';
		}
		if (field) {
			setSelectedItem({ ...selectedItem, [field]: value });

			handleCategoryClose();
		}
	};

	// Apis save for bom and details  start
	const handleSave = async () => {
		let dataObj = _.cloneDeep(selectedItem);
		setBomItemsEdited(false);
		if (dataObj) {
			if (selectedTab === 'details') {
				setUpdateDataLoader(true);
				let res = await updateDetails(dataObj);
				setUpdateDataLoader(false);
				if (res.status !== 'error') {
					let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
					setTags([]);
					context.addSnackMessage(msg);
				} else {
					selectedItem.tags = [];
					context.addSnackMessage(res);
				}
			} else if (selectedTab === 'bom') {
				let items = dataObj.items ? dataObj.items : [];
				setPrevItems([ ...items ]);
				let bomItems = [];
				items.forEach((item) => {
					let obj = {
						itemId: item.itemId,
						qty: item.qty && item.qty !== '' ? Number(item.qty) : 1
					};
					bomItems.push(obj);
				});
				let apiObj = {
					itemId: dataObj.itemId,
					unitCost: bomParentTotal.toString(),
					BOM: bomItems
				};
				setUpdateDataLoader(true);
				let res = await updateBomData(apiObj);
				setUpdateDataLoader(false);
				if (res.status !== 'error') {
					let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
					context.addSnackMessage(msg);
					getTransactions(selectedItem);
					getInventory(selectedItem.itemId);
				} else {
					context.addSnackMessage(res);
				}
			}
		}
	};
	// Apis save for bom and details  start

	// details screen apis and fns END

	// INVENTORY screen apis and fns start
	const handleChange = (e) => {
		setSelectedItem({
			...selectedItem,
			[e.target.name]: e.target.value
		});
	};

	const handleaAddInventory = (e, type) => {
		if (type === 'date') {
			setSelectedInventory({ ...selectedInventory, date: e });
		} else {
			setSelectedInventory({
				...selectedInventory,

				[e.target.name]: e.target.value ? Number(e.target.value) : ''
			});
		}
	};

	const handleInventoryDialogClose = () => {
		setSelectedInventory(null);
	};
	const handleClickInventory = (type, transaction) => {
		let obj;
		if (type === 'add') {
			obj = {
				date: null,
				qty: '',
				unitPrice: '',
				itemId: selectedItem.itemId,
				type: 'add'
			};
		} else {
			obj = { ...transaction};
		}

		console.log(obj);
		setSelectedInventory(obj);
	};
	const handleDeleteInventory = async (transaction) => {
		let res = await deleteTransaction(transaction.transactionId);

		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);

			getTransactions(selectedItem);
		} else {
			context.addSnackMessage(res);
		}
	};

	const handleCreateInventory = async () => {
		let newInventory = {
			...selectedInventory,
			date: moment(selectedInventory.date).format('MMM DD YYYY hh:mm:ss'),
			updatedBy: context.user.name
		};

		setCreateTransactionLoader(true);
		let res = await createNewTransaction(newInventory);
		setCreateTransactionLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			setSelectedInventory(null);
			getTransactions(selectedItem);
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleEditInventory = async () => {
		let newInventory = {
			...selectedInventory,
			date: moment(selectedInventory.date).format('MMM DD YYYY hh:mm:ss'),
			updatedBy: context.user.name
		};
		console.log(selectedInventory);
		setCreateTransactionLoader(true);
		let res = await updateInventory(newInventory);
		setCreateTransactionLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			setSelectedInventory(null);
			getTransactions(selectedItem);
		} else {
			context.addSnackMessage(res);
		}
	};

	const getInventory = async (id) => {
		setInventoryLoader(true);
		let res = await fetchInventory(id);
		setInventoryLoader(false);
		if (res.status !== 'error') {
			setInventory(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};

	const getTransactions = async (selectedItem) => {
		setTransactionsLoader(true);
		let res = await fetchTransactions(selectedItem.itemNumber);
		setTransactionsLoader(false);
		if (res.status !== 'error') {
			setTransactions(res.data);
			setAllTransactions(res.data);
			getInventory(selectedItem.itemId);
		} else {
			// context.addSnackMessage(res);
		}
	};
	const handleSearchInventory = (e) => {
		let text = e.target.value;
		let newTransactions = allTransactions;
		newTransactions = newTransactions.filter((transaction) => {
			return transaction.source.toLowerCase().includes(text.toLowerCase());
		});
		setTransactions(newTransactions);
	};

	// INVENTORY screen apis and fns end

	// bom screen apis and fns end

	const handleBomEditItems = (item) => {
		let selectedItem = _.cloneDeep(item);
		setOldSelectedBomItem(_.cloneDeep(item));
		let items = selectedItem.items ? selectedItem.items : [];
		items.push(newBomItem);
		selectedItem.items = items;
		setSelectedBomItem(_.cloneDeep(selectedItem));
	};
	const handleBomEditItemsUpdate = () => {
		let id = selectedBomItem.itemId;
		if (selectedBomItem && selectedBomItem.items && selectedBomItem.items.length) {
			let items = selectedBomItem.items;
			items = items.filter((newItem) => {
				return newItem && newItem.itemId && !newItem.itemId.toString().includes('new');
			});
			selectedBomItem.items = items;
		}
		if (id === selectedItem.itemId) {
			setSelectedItem({ ...selectedItem, items: selectedBomItem.items });
		} else {
			let items = selectedItem.items ? selectedItem.items : [];
			let ind = items.findIndex((item) => {
				return item && item.itemId === id;
			});
			if (ind >= 0) {
				items[ind] = selectedBomItem;
				setSelectedItem({ ...selectedItem, items });
			}
		}
		handleBomEditItemsClose();
	};
	const handleBomEditItemsClose = () => {
		setSelectedBomItem(null);
		setOldSelectedBomItem(null);
	};
	const handleMaterialItemAdd = async () => {
		setAddMaterialLoader(true);
		let res = await addMaterialItem(newMaterialItem);
		setAddMaterialLoader(false);
		if (res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			if (newMaterialItem.type === 'newItem') {
				let id = res.data.itemId;
				setSelectedTab('details');
				getItemIdDetails(id);
				getInventory(id);
			}
			handleAddDialogClose();
		} else {
			context.addSnackMessage(res);
		}
	};

	const handleBomItemsSearch = async (ind) => {
		setSelectedItemIndexToUpdate(ind);
		setBomItemsSearchLoader(true);

		let res = await fetchBomItemsList(selectedItem.itemId);

		setBomItemsSearchLoader(false);
		if (res.status !== 'error') {
			let filtered = res.data ? res.data : [];
			let selectedItems = selectedBomItem.items ? selectedBomItem.items : [];
			selectedItems.forEach((item) => {
				filtered = filtered.filter((sItem) => {
					return sItem.itemId !== item.itemId;
				});
			});
			setBomSearchItems(filtered);
			setAllBomSearchItems(filtered);
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleBomItemsSearchText = (e) => {
		let text = e.target.value;
		let allRows = allBomSearchItems;
		allRows = allRows.filter((item) => {
			return (
				item.itemNumber.toLowerCase().includes(text.toLowerCase()) ||
				item.description.toLowerCase().includes(text.toLowerCase())
			);
		});
		setBomSearchItems(allRows);
	};
	const handleCloseSubItemListDialog = () => {
		setSelectedItemIndexToUpdate(null);
	};
	const handleSelectedBomItem = async (newItem) => {
		let ind = selectedItemIndexToUpdate;
		let items = selectedBomItem.items;

		if (items && ind >= 0) {
			let res = await fetchBomChildItems(newItem.itemId);

			if (res.status !== 'error') {
				let itemIds = res.itemIds ? res.itemIds : [];
				let newItemIds = [];
				newItemIds = itemIds.filter((item) => {
					return item == selectedItem.itemNumber;
				});
				if (newItemIds && newItemIds.length > 0) {
					setCautionDialog(true);
				} else {
					let updatedItem = newItem ? { ...newItem, qty: 1 } : {};
					let childItems = res.data ? res.data : [];
					updatedItem['items'] = getParentChildItems(childItems);
					items[ind] = updatedItem;
					setSelectedBomItem({ ...selectedBomItem, items: items });
					setBomItemsEdited(true);
				}
			}
			setSelectedItemIndexToUpdate(null);
		}
	};
	const handleCloseCaution = () => {
		setCautionDialog(false);
	};
	const handleCreateNewSubItem = () => {
		setCreateNewSubItem(true);
	};
	const handleCloseCreateSubItemDialogClose = () => {
		setCreateNewSubItem(false);
	};
	const handleBomChange = (e, id) => {
		let updatedItem = { ...selectedBomItem };
		let items = updatedItem.items ? updatedItem.items : [];
		let ind = items.findIndex((item) => {
			return item && item.itemId === id;
		});
		if (ind >= 0) {
			let item = items[ind];
			item[e.target.name] = e.target.value;
			items[ind] = item;
			updatedItem.items = items;
			setSelectedBomItem(updatedItem);
			setBomItemsEdited(true);
		}
	};
	const handleAddNewBomItem = (ind) => {
		let updatedItem = { ...selectedBomItem };
		let items = selectedBomItem.items ? selectedBomItem.items : [];
		items.splice(ind + 1, 0, { ...newBomItem, itemId: 'new' + items.length });
		updatedItem.items = items;
		setSelectedBomItem(updatedItem);
	};
	const handleDeleteBomItem = (itemId) => {
		let updatedItem = _.cloneDeep(selectedBomItem);
		if (selectedItem.itemNumber === updatedItem.itemNumber) {
			let items = selectedBomItem.items ? selectedBomItem.items : [];
			let filtered = items.filter((item) => {
				return item.itemId !== itemId;
			});
			setBomItemsEdited(true);
			updatedItem.items = filtered;
			setSelectedBomItem(updatedItem);
		}
	};

	const handleBomTabClick = () => {
		setSelectedTab('bom');
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
	const getBomChildItems = async (id, data) => {
		let res = await fetchBomChildItems(id);
		if (res.status !== 'error') {
			let updatedItem = data ? data : {};
			let items = res.data ? res.data : [];
			let itemsData = getParentChildItems(items);
			updatedItem['items'] = itemsData;
			setPrevItems([ ...itemsData ]);
			setSelectedItem(updatedItem);
		} else {
			// context.addSnackMessage(res);
		}
	};
	const updateBomItemTotal = (value) => {
		setBomParentTotal(value);
	};

	// bom fns and apis end
	const handleSelectedTab = (tab) => {
		if (bomItemsEdited) {
			if (window.confirm('Are you sure you want to leave?')) {
				setSelectedTab(tab);
				setBomItemsEdited(false);
				setSelectedItem({ ...selectedItem, items: prevItems });
			}
		} else {
			setSelectedTab(tab);
		}
	};

	return (
		<Layout history={props.history}>
			<Prompt when={bomItemsEdited} message="Are you sure you want to leave?" />
			<div className="p-24">
				<div>
					<div className="spacingBetween py-16 ">
						<p
							className="pageHeader textHover"
							style={{ cursor: 'pointer' }}
							onClick={() => handleItemClose()}
						>
							Items
						</p>
						{selectedItem && (
							<span className="mr-auto mt-2 ml-2">
								<span className="mx-2 sectionTitle " style={{ cursor: 'pointer' }} />
							</span>
						)}

						{selectedItem ? (
							<div className="d-flex flex-row align-items-center">
								<p
									className={classNames(
										'mr-24 text-16 sectionTitle cursor-pointer',
										selectedTab === 'details' ? classes.activeTab : ''
									)}
									onClick={() => handleSelectedTab('details')}
								>
									Details
								</p>
								<p
									className={classNames(
										'mr-24 text-16 sectionTitle cursor-pointer',
										selectedTab === 'inventory' ? classes.activeTab : ''
									)}
									onClick={() => handleSelectedTab('inventory')}
								>
									Inventory
								</p>
								{selectedItem &&
								(selectedItem.source === 'Make' || selectedItem.source === 'Make or Buy') ? (
									<p
										className={classNames(
											'mr-24 text-16 sectionTitle cursor-pointer',
											selectedTab === 'bom' ? classes.activeTab : ''
										)}
										onClick={() => handleBomTabClick()}
									>
										BOM
									</p>
								) : null}
								<p
									className={classNames(
										'mr-24 text-16 sectionTitle cursor-pointer',
										selectedTab === 'demand' ? classes.activeTab : ''
									)}
									onClick={() => handleSelectedTab('demand')}
								>
									Demand
								</p>
								<Button
									variant="contained"
									color="primary"
									disabled={updateDataLoader}
									onClick={handleSave}
								>
									<p className="px-12 text-14">{updateDataLoader ? 'Saving' : 'Save'}</p>
								</Button>
							</div>
						) : (
							<Button
								onClick={() => handleAddDialog('newItem')}
								className=" d-flex justify-content-center align-items-center buttonHover sectionTitle text-white"
								variant="contained"
								color="primary"
							>
								<p className="sectionSubTitle text-white">New Item</p>
								<AddIcon className="mb-1 cursor-pointer" />
							</Button>
						)}
					</div>

					{!selectedItem && (
						<div>
							<div className="container-fluid p-0">
								<div className="row">
									<div className="col-md-12">
										<TextField
											InputProps={{ style: { height: 40, fotSize: 14 } }}
											id="outlined-full-width"
											style={{ fontSize: '20px !important' }}
											placeholder="Search"
											fullWidth
											onChange={handleSearchItems}
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
							</div>
							<Paper>
								{itemsLoader ? (
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
														<TableCell align="left" className="setcionSubTitle">
															<p className="sectionSubTitle">Item</p>
														</TableCell>
														<TableCell align="center" className="setcionSubTitle">
															<p className="sectionSubTitle">Inventory</p>
														</TableCell>
														<TableCell align="center" className="setcionSubTitle">
															<p className="sectionSubTitle">Age</p>
														</TableCell>
														<TableCell align="center" className="setcionSubTitle">
															<p className="sectionSubTitle">Tags</p>
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{items &&
														items
															.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
															.map((row, index) => {
																return (
																	<TableRow tabIndex={-1} key={row.id}>
																		<TableCell
																			align="left"
																			className="sectionContent textHover"
																			onClick={() => handleItem(row)}
																			style={{
																				color: blue[600],
																				cursor: 'pointer'
																			}}
																		>
																			{row.item}
																		</TableCell>
																		<TableCell
																			align="center"
																			className="sectionContent"
																		>
																			{row.qty}
																		</TableCell>

																		<TableCell
																			align="center"
																			className="sectionContent"
																		>
																			{row.age}
																		</TableCell>
																		<TableCell
																			className="sectionContent "
																			align="center"
																		>
																			{row.itemTags &&
																				row.itemTags.map((item, index) => {
																					return (
																						<Chip
																							key={index}
																							size="small"
																							mr={1}
																							mb={1}
																							label={item}
																							style={{
																								backgroundColor:
																									blue[600],
																								color: 'white',

																								fontSize: '13px'
																							}}
																							className="px-2"
																						/>
																					);
																				})}
																		</TableCell>
																	</TableRow>
																);
															})}
												</TableBody>
											</Table>
										</TableContainer>
										<TablePagination
											style={{ fontSize: '15px' }}
											rowsPerPageOptions={[ 5, 10, 25 ]}
											component="div"
											count={items && items.length > 0 ? items.length : 0}
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

					{selectedItem &&
					selectedTab === 'details' && (
						<div className="">
							<div className="container m-0">
								<div className="row  m-0 p-0">
									<div className="col-md-4 py-2 ">
										<Card className="px-12  py-2">
											<p className="sectionContent ">Item Number</p>
											<p className="sectionSubTitle "> {selectedItem.itemNumber}</p>
										</Card>
									</div>

									<div className="col-md-4 py-2 ">
										<Card className="px-12  py-2">
											<p className="sectionContent ">Item Description</p>
											<p className="sectionSubTitle "> {selectedItem.description}</p>
										</Card>
									</div>
									<div className="col-md-4 py-2">
										<Card Card className="px-12  py-2">
											<p className="sectionContent ">Item Origin</p>
											<p className="sectionSubTitle "> {selectedItem.source}</p>
										</Card>
									</div>
								</div>
								<div className="row m-0 p-0">
									<Card
										className="col-md-1 mt-12 adjustingCenter "
										style={{ height: '30px', backgroundColor: 'rgb(220,220,220)' }}
									>
										<p className="sectionSubTitle text-black">Tags</p>
									</Card>
									<OutlinedInput
										variant="filled"
										style={{ width: 400 }}
										value={newValue}
										onChange={(e) => setNewValue(e.target.value)}
										onKeyDown={handleKeyDown}
										type="text"
										placeholder=""
										className="col-md-11 bg-white mt-12"
										inputProps={{
											style: {
												fotSize: 10,
												padding: 6
											}
										}}
										endAdornment={
											<InputAdornment position="end">
												<div className="circle adjustingCenter ">
													<AddIcon
														style={{ fontSize: 20 }}
														className="text-white cursor-pointer"
													/>
												</div>
											</InputAdornment>
										}
									/>
									<div className="mt-3 d-flex flex-row flex-wrap" style={{ width: 700 }}>
										{selectedItem.itemTags &&
											selectedItem.itemTags.map((tag, index) => (
												<div className="mr-2 mb-2" key={index}>
													<Chip
														label={tag}
														onDelete={handleDelete(tag)}
														style={{ backgroundColor: blue[600], color: 'white' }}
													/>
												</div>
											))}
									</div>
								</div>
								<div className="mt-16">
									<Paper className="px-16 py-8">
										<div className="">
											<p className="sectionTitle pt-1  ">Details</p>
										</div>
										<div className="row ">
											<div className="col-md-4">
												<p className="sectionContent">Unit Type</p>
												<FormControl
													variant="outlined"
													style={{ width: '284px', backgroundColor: 'rgb(220,220,220)' }}
												>
													<Select
														labelId="unitType"
														id="unitType"
														name="unitType"
														value={selectedItem.unitType}
														onChange={handleChange}
														style={{
															height: 28,
															minHeight: 28
														}}
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
											<div className="col-md-4 ">
												<p className="sectionContent">Unit of Measure</p>
												<FormControl
													variant="outlined"
													style={{ width: '284px', backgroundColor: 'rgb(220,220,220)' }}
												>
													<Select
														labelId="unitOfMeasure"
														id="unitOfMeasure"
														name="unitOfMeasure"
														value={selectedItem.unitOfMeasure}
														onChange={handleChange}
														style={{
															height: 28,
															minHeight: 28
														}}
													>
														{unitTypes &&
														selectedItem.unitType &&
														unitTypes[selectedItem.unitType] &&
														unitTypes[selectedItem.unitType].length > 0 ? (
															unitTypes[selectedItem.unitType].map((item) => {
																return <MenuItem value={item}>{item}</MenuItem>;
															})
														) : (
															<MenuItem disabled>No Options</MenuItem>
														)}
													</Select>
												</FormControl>
											</div>
										</div>
										<div className="row mt-16 ">
											<div className="col-md-4">
												<p className="sectionContent">Shape</p>
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
													value={selectedItem.shape ? selectedItem.shape : ''}
													onClick={() => handleCategoryClick('Item Shapes')}
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
											<div className="col-md-4">
												<p className="sectionContent">Accounting Code</p>
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
													value={selectedItem.accountingCode}
													onClick={() => handleCategoryClick('Item Accounting Codes')}
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
											<div className="col-md-4">
												<p className="sectionContent">Category</p>
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
													value={selectedItem.category}
													onClick={() => handleCategoryClick('Item Category')}
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
											<div className="col-md-4 mt-4">
												<p className="sectionContent">Material</p>
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
													value={selectedItem.material}
													onClick={() => handleCategoryClick('Item Materials')}
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
											<div className="col-md-4 mt-4">
												<p className="sectionContent">Grade</p>
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
													value={selectedItem.grade}
													onClick={() => handleCategoryClick('Item Grades')}
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
											<div className="col-md-4 mt-4">
												<p className="sectionContent">Thickness</p>
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
													value={selectedItem.thickness}
													onClick={() => handleCategoryClick('Item Thickness')}
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
											<div className="col-md-4 mt-4">
												<p className="sectionContent">Length</p>
												<OutlinedInput
													variant="outlined"
													type="text"
													className="w-100 bg-white"
													inputProps={{
														style: {
															fotSize: 10,
															padding: 6
														}
													}}
													name="length"
													value={selectedItem.length}
													onChange={handleChange}
												/>
											</div>
											<div className="col-md-4 mt-4">
												<p className="sectionContent">Width</p>
												<OutlinedInput
													variant="outlined"
													type="text"
													className="w-100 bg-white"
													inputProps={{
														style: {
															fotSize: 10,
															padding: 6
														}
													}}
													name="width"
													value={selectedItem.width}
													onChange={handleChange}
												/>
											</div>
											<div className="col-md-4 mt-4 ">
												<p className="sectionContent">Dimension Unit of Measure</p>
												<FormControl variant="outlined" className="dimensionDropdownWidth">
													<Select
														value={orderType}
														style={{
															height: 30,
															minHeight: 30
														}}
														name="dimensionUnitOfMeasure"
														value={selectedItem.dimensionUnitOfMeasure}
														onChange={handleChange}
													>
														<MenuItem value="Inches">Inches</MenuItem>
														<MenuItem value="Feet">Feet</MenuItem>
														<MenuItem value="Meters">Meters</MenuItem>
														<MenuItem value="Cms">Cms</MenuItem>
														<MenuItem value="Mms">Mms</MenuItem>
													</Select>
												</FormControl>
											</div>
											<div className="col-md-6 mt-4">
												<p className="sectionContent">Description</p>
												<OutlinedInput
													variant="outlined"
													type="text"
													placeholder=""
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
													value={selectedItem.description}
													onChange={handleChange}
												/>
											</div>
											<div className="col-md-6 mt-4">
												<p className="sectionContent">Internal Notes</p>
												<OutlinedInput
													variant="outlined"
													type="text"
													placeholder=""
													multiline
													rows={2}
													className="w-100 bg-white"
													inputProps={{
														style: {
															fotSize: 10,
															padding: 6
														}
													}}
													name="internalNote"
													value={selectedItem.internalNote}
													onChange={handleChange}
												/>
											</div>
										</div>
									</Paper>
								</div>
							</div>
						</div>
					)}
					{selectedItem &&
					selectedTab === 'inventory' && (
						<React.Fragment>
							<div>
								<div className="container p-0">
									<div className="row p-0  m-0">
										<div className="col-md-2 px-2">
											<div style={{ borderColor: '#3f51b5' }} className="pl-8  breakDownCard">
												<p className="sectionContent">on Hand</p>

												<p className="inventoryValues">
													{inventory && (inventory.onHand || inventory.onHand === 0) ? (
														inventory.onHand
													) : (
														'NA'
													)}
												</p>
											</div>
										</div>
										<div className="col-md-2 px-2">
											<div className="pl-8 breakDownCard" style={{ borderColor: '#4db6ac' }}>
												<p className="sectionContent">Demand</p>
												<p className="inventoryValues">
													{inventory && (inventory.demand || inventory.demand === 0) ? (
														inventory.demand
													) : (
														'NA'
													)}
												</p>
											</div>
										</div>
										<div className="col-md-2 px-2">
											<div className="pl-8  breakDownCard" style={{ borderColor: '#191e4c' }}>
												<p className="sectionContent">Available</p>
												<p className="inventoryValues">
													{inventory && (inventory.available || inventory.available === 0) ? (
														inventory.available
													) : (
														'NA'
													)}
												</p>
											</div>
										</div>
										<div className="col-md-2 px-2">
											<div className=" pl-8 breakDownCard" style={{ borderColor: '#cd5c5c' }}>
												<p className="sectionContent">Cost per Unit</p>
												<p className="inventoryValues">
													{inventory && (inventory.unitPrice || inventory.unitPrice === 0) ? (
														<Currency value={inventory.unitPrice} />
													) : (
														'NA'
													)}
												</p>
											</div>
										</div>
										<div className="col-md-2 px-2">
											<div className=" pl-8 breakDownCard" style={{ borderColor: '#7B1FA2' }}>
												<p className="sectionContent">Total Cost</p>
												<p className="inventoryValues">
													{inventory && (inventory.totalCost || inventory.totalCost === 0) ? (
														<Currency value={inventory.totalCost} />
													) : (
														'NA'
													)}
												</p>
											</div>
										</div>
										<div className="col-md-2 px-2">
											<div className=" pl-8 breakDownCard" style={{ borderColor: '#FF5722' }}>
												<p className="sectionContent">Age</p>
												<p className="inventoryValues">
													{inventory && (inventory.age || inventory.age === 0) ? (
														inventory.age
													) : (
														'NA'
													)}
												</p>
											</div>
										</div>
									</div>

									<Paper className="px-16 mt-16">
										<div className="spacingBetween  ">
											<p className="pageHeader cursor-pointer">Transactions</p>
											<Button
												className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover text-white"
												variant="contained"
												style={{ backgroundColor: '#4caf50' }}
												onClick={() => handleClickInventory('add')}
											>
												<p>Adjust Inventory </p>
											</Button>
										</div>

										<div>
											<div className="row">
												<div className="col-md-12">
													<TextField
														InputProps={{ style: { height: 40, fotSize: 14 } }}
														id="outlined-full-width"
														style={{ fontSize: '20px !important' }}
														placeholder="Search"
														fullWidth
														onChange={handleSearchInventory}
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
												{transactionsLoader ? (
													<React.Fragment>
														{[ 1, 2, 3, 4, 5 ].map((loader, index) => (
															<LoaderComponent
																key={index}
																width="100%"
																height={63}
																classes="mb-3"
															/>
														))}
													</React.Fragment>
												) : (
													<React.Fragment>
														<TableContainer>
															<Table>
																<TableRow>
																	<TableCell align="left" className="sectionSubTitle">
																		Source
																	</TableCell>
																	<TableCell
																		align="center"
																		className="sectionSubTitle"
																	>
																		Action
																	</TableCell>
																	<TableCell
																		align="center"
																		className="sectionSubTitle"
																	>
																		Unit Change
																	</TableCell>
																	<TableCell
																		align="center"
																		className="sectionSubTitle"
																	>
																		Unit Value
																	</TableCell>
																	<TableCell
																		align="center"
																		className="sectionSubTitle"
																	>
																		Total Value Changed
																	</TableCell>
																	<TableCell
																		align="center"
																		className="sectionSubTitle"
																	>
																		Direction
																	</TableCell>
																	<TableCell
																		align="center"
																		className="sectionSubTitle"
																	>
																		Action Date
																	</TableCell>
																	<TableCell
																		align="center"
																		className="sectionSubTitle"
																	>
																		By
																	</TableCell>
																	<TableCell
																		align="center"
																		className="sectionSubTitle"
																	>
																		Actions
																	</TableCell>
																</TableRow>

																<TableBody>
																	{transactions &&
																		transactions
																			.slice(
																				page * rowsPerPage,
																				page * rowsPerPage + rowsPerPage
																			)
																			.map((transaction, index) => {
																				return (
																					<TableRow key={index}>
																						<TableCell
																							align="left"
																							className="sectionContent textHover "
																							style={{
																								color: blue[600]
																							}}
																						>
																							{transaction.sourceType}
																						</TableCell>
																						<TableCell
																							align="center"
																							className="sectionContent"
																						>
																							{transaction.actionType}
																						</TableCell>

																						<TableCell
																							className="sectionContent "
																							align="center"
																						>
																							{transaction.qty}
																						</TableCell>
																						<TableCell
																							className="sectionContent "
																							align="center"
																						>
																							<Currency
																								value={
																									transaction.unitPrice
																								}
																							/>
																						</TableCell>
																						<TableCell
																							align="center"
																							className="sectionContent  "
																						>
																							<Currency
																								value={
																									transaction.totalValue
																								}
																							/>
																						</TableCell>
																						<TableCell
																							align="center"
																							className="sectionContent"
																						>
																							{transaction.direction}
																						</TableCell>

																						<TableCell
																							className="sectionContent "
																							align="center"
																						>
																							{transaction.date.slice(0,12)}
																						</TableCell>

																						<TableCell
																							className="sectionContent "
																							align="center"
																						>
																							{transaction.updatedBy}
																						</TableCell>
																						{transaction.sourceType ===
																							'Inventory' && (
																							<TableCell
																								className="sectionContent "
																								align="center"
																							>
																								<EditIcon
																									onClick={() =>
																										handleClickInventory(
																											'edit',
																											transaction
																										)}
																								/>
																								<DeleteIcon
																									onClick={() =>
																										handleDeleteInventory(
																											transaction
																										)}
																								/>
																							</TableCell>
																						)}
																					</TableRow>
																				);
																			})}
																</TableBody>
															</Table>
														</TableContainer>
														<TablePagination
															style={{ fontSize: '15px' }}
															rowsPerPageOptions={[ 5, 10, 25 ]}
															component="div"
															count={
																transactions && transactions.length ? (
																	transactions.length
																) : (
																	0
																)
															}
															rowsPerPage={rowsPerPage}
															page={page}
															onChangePage={handleChangePage}
															onChangeRowsPerPage={handleChangeRowsPerPage}
														/>
													</React.Fragment>
												)}
											</Paper>
										</div>
									</Paper>
								</div>
								{selectedInventory && (
									<div>
										<Dialog
											open={Boolean(selectedInventory)}
											// onClose={handleClose}
											aria-labelledby="responsive-dialog-title"
											maxWidth="md"
											fullWidth={true}
										>
											<DialogTitle className="px-4" style={{ borderBottom: '1px solid grey' }}>
												<p className="sectionTitle">Adjust Inventory </p>
											</DialogTitle>

											<DialogContent className="px-4">
												<div className="container">
													<div className="row py-16">
														<div className="col-md-3">
															<p className="sectionContent">Quantity</p>
															<OutlinedInput
																variant="outlined"
																type="number"
																maxLength="5"
																placeholder=""
																className="w-100 mb-8"
																name="qty"
																value={selectedInventory.qty}
																inputProps={{
																	style: {
																		fotSize: 10,
																		padding: 6
																	}
																}}
																onChange={handleaAddInventory}
																endAdornment={
																	<InputAdornment position="end">
																		<p
																			className="pl-4"
																			style={{
																				borderLeft: '1px solid grey',
																				lineHeight: 1.8
																			}}
																		>
																			{selectedItem &&
																			selectedItem.unitOfMeasure ? (
																				selectedItem.unitOfMeasure
																			) : (
																				''
																			)}
																		</p>
																	</InputAdornment>
																}
															/>
														</div>

														<div className="col-md-3">
															<p className="sectionContent">Unit Price</p>
															<OutlinedInput
																variant="outlined"
																type="number"
																className="w-100 mb-8"
																name="unitPrice"
																value={selectedInventory.unitPrice}
																onChange={handleaAddInventory}
																inputProps={{
																	style: {
																		fotSize: 10,
																		padding: 6
																	}
																}}
																endAdornment={
																	<InputAdornment position="end">
																		<p
																			className="pl-4"
																			style={{
																				borderLeft: '1px solid grey',
																				lineHeight: 1.8
																			}}
																		>
																			₹
																		</p>
																	</InputAdornment>
																}
															/>
														</div>

														<div className="col-md-3">
															<p className="sectionContent">Date</p>
												
															<MuiPickersUtilsProvider utils={DateFnsUtils}>
															<Grid>
																<KeyboardDatePicker
																	disableToolbar
																	variant="inline"
																	format="MM/dd/yyyy"
																	id="date-picker-inline"
																	name="date"
																	maxDate={new Date()}
																	value={selectedInventory.date}
																	onChange={(e) => handleaAddInventory(e, 'date')}
																	KeyboardButtonProps={{
																		'aria-label': 'change date'
																	}}
																/>
															</Grid>
														</MuiPickersUtilsProvider>
														</div>
													</div>
												</div>
											</DialogContent>
											<DialogActions className="px-4" style={{ borderTop: '1px solid grey' }}>
												<div className="spacingBetween mt-24 w-100">
													<Button
														onClick={handleInventoryDialogClose}
														className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
														variant="contained"
													>
														<p className="sectionSubTitle">Cancel</p>
													</Button>
													{selectedInventory.type === 'add' ? (
														<Button
															onClick={handleCreateInventory}
															className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover sectionSubTitle text-white"
															variant="contained"
															color="primary"
															disabled={
																selectedInventory.qty === '' ||
																selectedInventory.date === null ||
																selectedInventory.unitPrice === '' ||
																createTransactionLoader
															}
														>
															{createTransactionLoader ? 'Executing...' : 'Execute'}
														</Button>
													) : (
														<Button
															onClick={handleEditInventory}
															className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover sectionSubTitle text-white"
															variant="contained"
															color="primary"
															disabled={
																selectedInventory.qty === '' ||
																selectedInventory.date === '' ||
																selectedInventory.unitPrice === '' ||
																createTransactionLoader
															}
														>
															{createTransactionLoader ? 'Executing...' : 'Execute'}
														</Button>
													)}
												</div>
											</DialogActions>
										</Dialog>
									</div>
								)}
							</div>
						</React.Fragment>
					)}
					{selectedItem &&
					selectedTab === 'bom' && (
						<div>
							<div
								className={classNames(
									classes.bomHeader,
									'd-flex flex-row justify-between align-items-center'
								)}
							>
								<p style={{ minWidth: 200, textAlign: 'start' }}>Bill of Materials</p>
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
									handleItem={handleItem}
									isParent={true}
									handleBomEditItems={handleBomEditItems}
									updateBomItemTotal={updateBomItemTotal}
								/>
							</div>
						</div>
					)}

					{selectedItem &&
					selectedTab === 'demand' && (
						<div>
							<div className="container p-0 mt-4">
								<TableContainer component={Paper}>
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell align="left">
													<p className="sectionSubTitle">Event</p>
												</TableCell>
												<TableCell align="left">
													<p className="sectionSubTitle">Date</p>
												</TableCell>
												<TableCell align="left">
													<p className="sectionSubTitle">Change</p>
												</TableCell>
												<TableCell align="left">
													<p className="sectionSubTitle">Availale</p>
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{demandData &&
												demandData.map((demand, index) => (
													<TableRow key={index}>
														<TableCell align="left">
															<p className="sectionContent">S110101</p>
														</TableCell>
														<TableCell align="left">
															<p className="sectionContent">8/10/2020</p>
														</TableCell>
														<TableCell align="left">
															<p className="sectionContent ml-4">8</p>
														</TableCell>
														<TableCell align="left">
															<p className="sectionContent ml-4">8</p>
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</TableContainer>
							</div>
						</div>
					)}
				</div>

				{newMaterialItem && (
					<Dialog
						open={Boolean(newMaterialItem)}
						onClose={handleAddDialogClose}
						aria-labelledby="responsive-dialog-title"
						className="p-24"
					>
						<div className="p-24">
							<p className="sectionTitle">Create New Item</p>
							<DialogContent>
								<DialogContentText>
									<div className="container p-0">
										<div className=" row">
											<div className="col-md-6  mt-4 ">
												<div className="row m-0 p-0">
													<p className="sectionContent">
														Item Number(Recent ItemNumber:{recentItemNumber ? recentItemNumber : ''})
													</p>
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
															<MenuItem value="Customer Supplied">
																Customer Supplied
															</MenuItem>
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
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<div className="mr-4">
									<Button
										color="primary"
										variant="outlined"
										onClick={handleAddDialogClose}
										className="mr-12"
									>
										Cancel
									</Button>
								</div>
								<Button
									color="primary"
									variant="contained"
									className="px-5"
									disabled={
										newMaterialItem.itemNumber === '' ||
										newMaterialItem.source === '' ||
										newMaterialItem.unitOfMeasure === '' ||
										newMaterialItem.unitType === '' ||
										newMaterialItem.description === '' ||
										addMaterialLoader
									}
									onClick={handleMaterialItemAdd}
								>
									{addMaterialLoader ? 'Adding...' : 'Add'}
								</Button>
							</DialogActions>
						</div>
					</Dialog>
				)}
				<Dialog
					open={cautionDialog}
					aria-labelledby="responsive-dialog-title"
					maxWidth="sm"
					onClose={handleCloseCaution}
					fullWidth={true}
				>
					<DialogTitle className="px-4">
						<p className="sectionTitle">Caution</p>
					</DialogTitle>
					<DialogContent>
						<p>you are not allowed select this</p>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleCloseCaution}
							className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
							variant="contained"
							color="primary"
						>
							<p className="sectionSubTitle text-white">Ok</p>
						</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={Boolean(selectedCategory)}
					onClose={handleCategoryClose}
					aria-labelledby="responsive-dialog-title"
					maxWidth="sm"
					fullWidth={true}
				>
					<DialogTitle className="px-4">
						<p className="sectionTitle">{selectedCategory}</p>
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
							{categoryListLoader ? (
								<React.Fragment>
									{[ 1, 2, 3, 4, 5 ].map((loader, index) => (
										<LoaderComponent key={index} width="100%" height={63} classes="mb-3" />
									))}
								</React.Fragment>
							) : (
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
											{categoryList &&
												categoryList.length > 0 &&
												categoryList.map((row) => (
													<TableRow key={row.id}>
														<TableCell component="th" scope="row">
															<p className="sectionContent">{row.name}</p>
														</TableCell>
														<TableCell align="right">
															<Button
																variant="contained"
																color="primary"
																onClick={() => setNewCategoryValue(row.name)}
															>
																<p
																	className="sectionContent"
																	style={{ color: 'white' }}
																>
																	{newCategoryValue === row.name ? (
																		'Selected'
																	) : (
																		'Select'
																	)}
																</p>
															</Button>
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</div>
					</DialogContent>
					<DialogActions className="px-4">
						<div className="spacingBetween mt-24 w-100">
							<Button
								onClick={() => handleCategoryClose()}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="contained"
							>
								<p className="sectionSubTitle">Cancel</p>
							</Button>
							<Button
								onClick={() => handleCategoryAdd(selectedCategory, newCategoryValue)}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="contained"
								color="primary"
							>
								<p className="sectionSubTitle text-white">Save</p>
							</Button>
						</div>
					</DialogActions>
				</Dialog>

				{selectedBomItem && (
					<Dialog
						open={Boolean(selectedBomItem)}
						onClose={handleBomEditItemsClose}
						aria-labelledby="responsive-dialog-title"
						maxWidth="md"
						fullWidth={true}
					>
						<DialogTitle className="px-4" style={{ borderBottom: '1px solid #f1f1f1' }}>
							<p className="sectionTitle">Edit Items for {selectedBomItem.itemNumber}</p>
						</DialogTitle>

						<DialogContent className="p-24">
							<div className="mt-16">
								{selectedBomItem.items &&
									selectedBomItem.items.length > 0 &&
									selectedBomItem.items.map((childItem, ind) => (
										<React.Fragment key={ind}>
											{childItem && (
												<div className="mb-16 d-flex align-items-center flex-row">
													<div>
														<p className="sectionContent">Item</p>
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
															name="description"
															value={childItem.description}
															onChange={(e) => handleBomChange(e, childItem.itemId)}
															endAdornment={
																<InputAdornment
																	position="end"
																	onClick={() => handleBomItemsSearch(ind)}
																>
																	<SearchIcon
																		style={{
																			opacity: 0.8,
																			fontSize: '14px'
																		}}
																	/>
																</InputAdornment>
															}
														/>
													</div>
													<div className="ml-8">
														<p className="sectionContent">Material Input</p>
														<OutlinedInput
															variant="outlined"
															type="text"
															placeholder="Units Required"
															className="w-100 bg-white"
															inputProps={{
																style: {
																	fotSize: 10,
																	padding: 6
																}
															}}
															name="unitType"
															// value={childItem.unitType}
															disabled
														/>
													</div>
													<div className="ml-16">
														<p className="sectionContent">Quantity</p>
														<OutlinedInput
															variant="outlined"
															type="text"
															className="w-100 bg-white"
															inputProps={{
																style: {
																	fotSize: 8,
																	padding: 6
																}
															}}
															name="qty"
															value={childItem.qty ? childItem.qty : ''}
															onChange={(e) => handleBomChange(e, childItem.itemId)}
															startAdornment={
																<InputAdornment
																	position="start"
																	style={{ marginRight: '1px solid grey' }}
																>
																	<p
																		className="pr-4"
																		style={{
																			borderRight: '1px solid grey',
																			lineHeight: 1.8
																		}}
																	>
																		{selectedBomItem.itemNumber} Requires
																	</p>
																</InputAdornment>
															}
															endAdornment={
																<InputAdornment
																	position="end"
																	onClick={() => handleBomItemsSearch(ind)}
																	style={{
																		marginRight: '1px solid grey',
																		minWidth: 80
																	}}
																>
																	<p
																		className="px-2"
																		style={{
																			borderLeft: '1px solid grey',
																			lineHeight: 2.4,
																			fontSize: '13px'
																		}}
																	>
																		{childItem.unitOfMeasure ? (
																			childItem.unitOfMeasure.substring(0, 12)
																		) : null}
																	</p>
																</InputAdornment>
															}
														/>
													</div>
													<div className="d-flex align-items-center flex-row mt-24">
														<IconButton
															size="small"
															className="mx-12"
															style={{ color: blue[600] }}
															onClick={() => handleAddNewBomItem(ind)}
														>
															<AddIcon />
														</IconButton>
														<IconButton
															size="small"
															className="mr-12"
															style={{ color: 'red' }}
															disabled={selectedBomItem.items.length - 1 === ind}
															onClick={() => handleDeleteBomItem(childItem.itemId)}
														>
															<DeleteOutlineIcon />
														</IconButton>
														<IconButton
															size="small"
															onClick={() => handleAddDialog('addItem')}
														>
															<LayersIcon style={{ color: blue[600] }} />
														</IconButton>
													</div>
												</div>
											)}
										</React.Fragment>
									))}
							</div>
						</DialogContent>
						<DialogActions className="px-4" style={{ borderTop: '1px solid #f1f1f1' }}>
							<div className="spacingBetween mt-24 w-100">
								<Button
									onClick={handleBomEditItemsClose}
									className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
									variant="contained"
								>
									<p className="sectionSubTitle">Cancel</p>
								</Button>
								<Button
									onClick={handleBomEditItemsUpdate}
									className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover sectionSubTitle text-white"
									variant="contained"
									color="primary"
								>
									Update Items
								</Button>
							</div>
						</DialogActions>
					</Dialog>
				)}

				<Dialog
					open={selectedItemIndexToUpdate === 0 || Boolean(selectedItemIndexToUpdate)}
					onClose={handleCloseSubItemListDialog}
					aria-labelledby="responsive-dialog-title"
					maxWidth="sm"
					fullWidth={true}
				>
					<DialogTitle className="px-4">
						<p className="sectionTitle">Item</p>
					</DialogTitle>
					<DialogContent className="px-4">
						<TextField
							InputProps={{ style: { height: 35, fotSize: 14 } }}
							required
							id="outlined-required"
							defaultValue=""
							variant="outlined"
							className="w-100"
							onChange={handleBomItemsSearchText}
						/>

						<div className="container p-0 mt-4">
							<TableContainer component={Paper}>
								<Table aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell align="left" className="sectionSubTitle">
												Number
											</TableCell>
											<TableCell align="center" className="sectionSubTitle">
												Description
											</TableCell>
											<TableCell align="center" className="sectionSubTitle">
												Action
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{bomItemsSearchLoader ? (
											<p>Loading...</p>
										) : (
											<React.Fragment>
												{bomSearchItems &&
													bomSearchItems.map((row) => (
														<TableRow key={row.id}>
															<TableCell
																component="th"
																scope="row"
																className="sectionContent"
																align="left"
															>
																{row.itemNumber}
															</TableCell>
															<TableCell align="center" className="sectionContent">
																{row.description}
															</TableCell>
															<TableCell align="center">
																<Button
																	variant="contained"
																	color="primary"
																	className="sectionContent"
																	onClick={() => handleSelectedBomItem(row)}
																>
																	Select
																</Button>
															</TableCell>
														</TableRow>
													))}
											</React.Fragment>
										)}
									</TableBody>
								</Table>
							</TableContainer>
						</div>
					</DialogContent>
					<DialogActions className="px-4">
						<div className="spacingBetween mt-24 w-100">
							<Button
								onClick={handleCloseSubItemListDialog}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="contained"
							>
								<p className="sectionSubTitle">Cancel</p>
							</Button>
							<Button
								onClick={handleCloseSubItemListDialog}
								className="sectionSubTitle d-flex justify-content-center align-items-center buttonHover"
								variant="contained"
								color="primary"
							>
								<p>Save</p>
							</Button>
						</div>
					</DialogActions>
				</Dialog>
			</div>
		</Layout>
	);
}
