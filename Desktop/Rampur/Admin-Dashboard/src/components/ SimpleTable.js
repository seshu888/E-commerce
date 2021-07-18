import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Chip } from '@material-ui/core';
import classNames from 'classnames';
import InputBase from '@material-ui/core/InputBase';
import Layout from 'layout/Layout';
import TextField from '@material-ui/core/TextField';

function createData(id, product, date, total, status, method) {
	return { id, product, date, total, status, method };
  }
const rows = [
	createData('000253', 'Salt & Pepper Grinder', '2020-01-02', '$32,00', 0, 'Visa'),
	createData('000254', 'Backpack', '2020-01-04', '$130,00', 0, 'PayPal'),
	createData('000255', 'Pocket Speaker', '2020-01-04', '$80,00', 2, 'Mastercard'),
	createData('000256', 'Glass Teapot', '2020-01-08', '$45,00', 0, 'Visa'),
	createData('000257', 'Unbreakable Water Bottle', '2020-01-09', '$40,00', 0, 'PayPal'),
	createData('000258', 'Spoon Saver', '2020-01-14', '$15,00', 0, 'Mastercard'),
	createData('000259', 'Hip Flash', '2020-01-16', '$25,00', 1, 'Visa'),
	createData('000260', 'Woven Slippers', '2020-01-22', '$20,00', 0, 'PayPal'),
	createData('000261', 'Womens Watch', '2020-01-22', '$65,00', 2, 'Visa'),
	createData('000262', 'Over-Ear Headphones', '2020-01-23', '$210,00', 0, 'Mastercard'),
  ];

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [ el, index ]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const headCells = [
	{ id: 'id', alignment: 'right', label: 'Order ID' },
	{ id: 'product', alignment: 'left', label: 'Product' },
	{ id: 'date', alignment: 'left', label: 'Date' },
	{ id: 'total', alignment: 'right', label: 'Total' },
	{ id: 'status', alignment: 'left', label: 'Status' },
	{ id: 'method', alignment: 'left', label: 'Payment Method' },

  ];

function EnhancedTableHead(props) {
	const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{ 'aria-label': 'select all desserts' }}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.alignment}
						padding={headCell.disablePadding ? 'none' : 'default'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
							className="sectionSubTitle"
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<span className={classes.visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf([ 'asc', 'desc' ]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1)
	},
	highlight:
		theme.palette.type === 'light'
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85)
				}
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark
				},
	title: {
		flex: '1 1 100%'
	}
}));

const EnhancedTableToolbar = (props) => {
	const classes = useToolbarStyles();
	const { numSelected } = props;

	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0
			})}
		>
			{numSelected > 0 ? (
				<Typography className={classes.title} color="inherit" variant="subtitle1">
					{numSelected} selected
				</Typography>
			) : (
				<Typography className={classNames(classes.title, 'pageHeader')} id="tableTitle">
					Nutrition
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton aria-label="delete">
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title="Filter list">
					<IconButton aria-label="filter list">
						<FilterListIcon />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	},
	table: {
		minWidth: 750
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1
	}
}));

export default function SampleTable(props) {
	const classes = useStyles();
	const [ order, setOrder ] = React.useState('asc');
	const [ orderBy, setOrderBy ] = React.useState('calories');
	const [ selected, setSelected ] = React.useState([]);
	const [ page, setPage ] = React.useState(0);
	const [ dense, setDense ] = React.useState(false);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ allRows, setAllRows ] = React.useState(rows);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n) => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangeDense = (event) => {
		setDense(event.target.checked);
	};

	const isSelected = (id) => selected.indexOf(id) !== -1;

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	const handleSearch = (e) => {
		let text = e.target.value;

		let allRows = rows;
		allRows = allRows.filter((item) => {
			return item.product.toLowerCase().includes(text.toLowerCase());
		});
		setAllRows(allRows);
		
		setRowsPerPage( 5);
	};


	return (
		<Layout history={props.history}>
			<div className="p-24">
				<div className={classes.root}>
					<Paper className={classes.paper}>
						<EnhancedTableToolbar numSelected={selected.length} />
						<TextField
							id="outlined-full-width"
							style={{ fontSize: '20px !important' }}
							placeholder="Search"
							fullWidth
							onChange={handleSearch}
							margin="normal"
							InputLabelProps={{
								shrink: true,
								fontSize:'12px'
							}}
							variant="outlined"
						/>
						<TableContainer>
							<Table
								className={classes.table}
								aria-labelledby="tableTitle"
								size={dense ? 'small' : 'medium'}
								aria-label="enhanced table"
							>
								<EnhancedTableHead
									classes={classes}
									numSelected={selected.length}
									order={order}
									orderBy={orderBy}
									onSelectAllClick={handleSelectAllClick}
									onRequestSort={handleRequestSort}
									rowCount={rows.length}
								/>
								<TableBody>
									{stableSort(allRows, getComparator(order, orderBy))
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((row, index) => {
											const isItemSelected = isSelected(row.id);
											const labelId = `enhanced-table-checkbox-${index}`;

											return (
												<TableRow
													hover
													onClick={(event) => handleClick(event, row.id)}
													role="checkbox"
													aria-checked={isItemSelected}
													tabIndex={-1}
													key={row.id}
													selected={isItemSelected}
												>
													<TableCell padding="checkbox">
														<Checkbox
															checked={isItemSelected}
															inputProps={{ 'aria-labelledby': labelId }}
														/>
													</TableCell>
													<TableCell
														
													align="right"
														className="sectionContent"
													>
														#{row.id}
													</TableCell>
													<TableCell align="left" className="sectionContent">
														{row.product}
													</TableCell>
													<TableCell align="left" className="sectionContent">
														{row.date}
													</TableCell>
													<TableCell align="right" className="sectionContent">
														{row.total}
													</TableCell>
													<TableCell  className="sectionContent " align="left">
														{row.status === 0 && (
															<Chip
																size="small"
																mr={1}
																mb={1}
																label="Shipped"
																style={{
																	backgroundColor: '#4caf50',
																	color: 'white',
																	fontSize: '13px'
																}}
															>
																Shipped
															</Chip>
														)}
														{row.status === 1 && (
															<Chip
																size="small"
																mr={1}
																mb={1}
																label="Processing"
															
																style={{
																	backgroundColor: '#f57c00',
																	
																	color: 'white',
																	fontSize: '13px'
																}}
															/>
														)}
														{row.status === 2 && (
															<Chip
																size="small"
																mr={1}
																mb={1}
																label="Cancelled"
																style={{
																	backgroundColor: '#2196f3',
																	color: 'white',
																	fontSize: '13px'
																}}
															/>
														)}
													</TableCell>
													<TableCell align="left" className="sectionContent">
														{row.method}
													</TableCell>
												</TableRow>
											);
										})}
									{emptyRows > 0 && (
										<TableRow style={{ height: ' 10 * emptyRows' }}>
											<TableCell colSpan={6} />
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
						<TablePagination
							style={{ fontSize: '15px' }}
							rowsPerPageOptions={[ 5, 10, 25 ]}
							component="div"
							count={rows.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onChangePage={handleChangePage}
							onChangeRowsPerPage={handleChangeRowsPerPage}
						/>
					</Paper>
				</div>
			</div>
		</Layout>
	);
}
