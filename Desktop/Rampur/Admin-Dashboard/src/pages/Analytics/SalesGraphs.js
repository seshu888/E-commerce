import React, { useEffect, useState, useContext } from 'react';
import Layout from 'layout/Layout';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { TextField } from '@material-ui/core';
import {  Bar, Line, Pie } from 'react-chartjs-2';
import moment from 'moment';

import AppContext from 'context/AppContext';
import LoaderComponent from 'components/LoaderComponent';
import {
	fetchYSalesAmountData,
	getNoOfSalesData,
	fetchPieChart,
	fetchTopCustomers,
	fetchItemsList,
	fetchProductsGraphData
} from 'api';

import Currency from 'components/Currency';

const useStyles = makeStyles((theme) => ({}));

const salesGraph = {
	labels: [ 'june', 'February', 'March', 'April', 'Mayy', 'June', 'July' ],
	datasets: [
		{
			fill: false,
			lineTension: 0,
			backgroundColor: 'rgba(75,192,192,0.4)',
			borderColor: '#1e88e5',
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: '#1e88e5',
			pointBackgroundColor: '#1e88e5',
			pointBorderWidth: 2,
			pointHoverRadius: 6,
			pointHoverBackgroundColor: '#1e88e5',
			pointHoverBorderColor: 'rgba(220,220,220,1)'
			// pointHoverBorderWidth: 2,
			// pointRadius: 1,
			// pointHitRadius: 10
			// data: [ 65, 59, 81.4, 81, 56, 100, 40.44 ]
		}
	],
	options: {
		legend: { display: false },
		scales: {
			yAxes: [
				{
					// gridLines: { display:false },
					ticks: {
						precision: 0,

						beginAtZero: true,
						maxTicksLimit: 5,
						// stepSize: 1,
						callback: function(value, index, values) {
							return '₹' + value;
						}
					}
				}
			]
		}
	}
};

const salesGraphConfig = {
	labels: [ 'june', 'February', 'March', 'April', 'May', 'June', 'July' ],
	datasets: [],
	options: {
		// legend: { display: false },
		scales: {
			yAxes: [
				{
					// gridLines: { display:false },
					ticks: {
						precision: 0,

						beginAtZero: true,
						maxTicksLimit: 5,
						// stepSize: 1,
						callback: function(value, index, values) {
							return '₹' + value.toLocaleString('en-IN');
						}
					}
				}
			]
		}
	}
};
const salesGraphDataset = {
	fill: false,
	lineTension: 0,
	borderColor: '#1e88e5',
	pointHoverBackgroundColor: '#1e88e5',
	borderCapStyle: 'butt',
	borderDash: [],
	borderDashOffset: 0.0,
	borderJoinStyle: 'miter',
	// pointBorderColor: '#1e88e5',
	// pointBackgroundColor: '#1e88e5',
	pointBorderWidth: 2,
	pointHoverRadius: 6
	// pointHoverBorderColor: 'rgba(220,220,220,1)'
	// pointHoverBorderWidth: 2,
	// pointRadius: 1,
	// pointHitRadius: 10
	// data: [ 65, 59, 81.4, 81, 56, 100, 40.44 ]
};

const salesConfig = {
	labels: [ 'june', 'February', 'March', 'April', 'May', 'June', 'July' ],
	datasets: [
		{
			fill: false,
			lineTension: 0,
			backgroundColor: 'rgba(75,192,192,0.4)',
			borderColor: '#1e88e5',
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: '#1e88e5',
			pointBackgroundColor: '#1e88e5',
			pointBorderWidth: 2,
			pointHoverRadius: 6,
			pointHoverBackgroundColor: '#1e88e5',
			pointHoverBorderColor: 'rgba(220,220,220,1)'
			// pointHoverBorderWidth: 2,
			// pointRadius: 1,
			// pointHitRadius: 10
			// data: [ 65, 59, 81.4, 81, 56, 100, 40.44 ]
		}
	],
	options: {
		legend: { display: false },
		scales: {
			yAxes: [
				{
					// gridLines: { display:false },
					ticks: {
						precision: 0,

						beginAtZero: true,
						maxTicksLimit: 5,
						// stepSize: 1,
						callback: function(value, index, values) {
							return '₹' + value.toLocaleString('en-IN');
						}
					}
				}
			]
		}
	}
};

const barConfig = {
	labels: [ '001', '002', '003', '004', '005', '006', '007' ],
	datasets: [
		{
			data: [ 12, 19, 3, 5, 8, 3 ],

			borderWidth: 1
		}
	],
	options: {
		legend: { display: false },
		scales: {
			yAxes: [
				{
					// gridLines: { display:false },
					ticks: {
						precision: 0,

						beginAtZero: true,
						maxTicksLimit: 12,
						// stepSize: 1,
						// callback: function(value, index, values) {
						// 	return '₹' + value;
						// },
						
						
					
					}
				}
			],
			xAxes: [
				{
					gridLines: {
						display: false
					}
				}
			]
		}
	}
};

const barConfig2 = {
	labels: [ '001', '002', '003', '004', '005', '006', '007' ],
	datasets: [
		{
			data: [ 12, 19, 3, 5, 8, 3 ],

			borderWidth: 1
		}
	],
	options: {
		legend: { display: false },
		scales: {
			yAxes: [
				{
					// gridLines: { display:false },
					ticks: {
						precision: 0,

						beginAtZero: true,
						maxTicksLimit: 12,
						callback: function(value, index, values) {
							return '₹' + value;
						}
						// stepSize: 1,
						// callback: function(value, index, values) {
						// 	return '₹' + value;
						// }
					
					}
				}
			],
			xAxes: [
				{
					gridLines: {
						display: false
					}
				}
			]
		}
	}
};

const pieConfig = {
	labels: [ 'Red', 'Green', 'Yellow' ],
	datasets: [
		{
			data: [ 300, 50, 100 ]
		}
	]
};

export default function SalesGraphs(props) {
	const classes = useStyles();

	const [ loadingSales, setLoadingSales ] = useState(false);
	const [ salesData, setSalesData ] = useState(null);
	const [ salesGraphData, setSalesGraphData ] = useState(null);
	const [ salesProfitData, setSalesProfitData ] = useState(null);
	const [ barData, setBarData ] = useState(null);
	const [ customersGraphData, setCustomersGraphData ] = useState(null);
	const [ customersData, setCustomersData ] = useState(null);
	const [ pieData, setPieData ] = useState(null);
	const [ pieChartData, setPieChartData ] = useState(null);
	const [ statusForPie, setStatusForPie ] = useState('Created');
	const context = useContext(AppContext);
	const [ loadingPieChart, setLoadingPieChart ] = useState(false);
	const [ loadigTopCustomersChart, setLoadigTopCustomersChart ] = useState(false);
	const [ timePeriod, setTimePeriod ] = useState('Week');
	const [ status, setStatus ] = useState('Created');
	const [ firstDay, setFirstDay ] = useState(moment(new Date()).startOf('week'));
	const [ lastDay, setLastDay ] = useState(new Date());
	const [ loadingNoOfSalesData, setLoadingNoOfSalesData ] = useState(false);
	const [ noOfSalesData, setNoOfSalesData ] = useState([]);
	const [ statusForNoSales, setStatusForNoSales ] = useState('Created');
	const [ statusForTopCustomers, setStatusForTopCustomers ] = useState('Created');
	const [ items, setItems ] = useState([]);
	const [ allItems, setAllItems ] = useState([]);
	const [ anchorEl, setAnchorEl ] = useState(null);

	const [ selectedProducts, setSelectedProducts ] = useState({ allProducts: null, itemIds: [] });

	useEffect(() => {
		setSalesChart(firstDay, lastDay, status, timePeriod);
		fetchNoOfSales(firstDay, lastDay, statusForNoSales, timePeriod);
		getPieChart(firstDay, lastDay, statusForNoSales, timePeriod);
		getTopCustomers(firstDay, lastDay, statusForTopCustomers, timePeriod);
		getItems();
	}, []);

	const getItems = async () => {
		let res = await fetchItemsList('Sales');

		if (res.status !== 'error') {
			let data = res.data;
			let filteredData = data.filter((item, index) => item.source === 'Make' || item.source === 'Make or Buy');
			setItems(filteredData);

			setAllItems(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};
	const getPieChart = async (start, end, statusForPie, timePeriod) => {
		let payload = {
			startDate: moment(start).format('MMM DD YYYY HH:mm:ss'),
			endDate: moment(end).format('MMM DD YYYY HH:mm:ss'),
			status: statusForPie,
			timePeriod: timePeriod
		};
		setLoadingPieChart(true);
		let res = await fetchPieChart(payload);
		setLoadingPieChart(false);
		if (res && res.status !== 'error') {
			setPieData(res);
			let pieGraph = res.pieChart;
			let xAxisForPieGraph = pieGraph ? Object.keys(pieGraph) : [];
			let yAxisForPieGraph = pieGraph ? Object.values(pieGraph) : [];
			let dataSetsForPieGraph = pieConfig.datasets;

			dataSetsForPieGraph[0].data = yAxisForPieGraph;

			let graphLenth = dataSetsForPieGraph[0].data.length;
			let colorData = poolColors(graphLenth);
			dataSetsForPieGraph[0].backgroundColor = colorData;
			dataSetsForPieGraph[0].borderColor = colorData;
			setPieChartData({
				...pieConfig,
				labels: xAxisForPieGraph,
				datasets: dataSetsForPieGraph
			});
		} else {
			context.addSnackMessage(res);
		}
	};

	function poolColors(a) {
		var pool = [];
		for (let i = 0; i < a; i++) {
			let randomColor = Math.floor(Math.random() * 16777215).toString(16);

			pool.push('#' + randomColor);
		}

		return pool;
	}

	const getTopCustomers = async (start, end, statusForTopCustomers, timePeriod) => {
		let payload = {
			startDate: moment(start).format('MMM DD YYYY HH:mm:ss'),
			endDate: moment(end).format('MMM DD YYYY HH:mm:ss'),
			status: statusForTopCustomers,
			timePeriod: timePeriod
		};
		setLoadigTopCustomersChart(true);
		let res = await fetchTopCustomers(payload);
		setLoadigTopCustomersChart(false);
		if (res && res.status !== 'error') {
			setCustomersGraphData(res.data);
			let customersGraph = res.topCustomers;
			let xAxisForCustomersGraph = customersGraph ? Object.keys(customersGraph) : [];
			let yAxisForCustomersGraph = customersGraph ? Object.values(customersGraph) : [];
			let dataSetsForCustomersGraph = barConfig2.datasets;

			dataSetsForCustomersGraph[0].data = yAxisForCustomersGraph;
			let customersGraphLenth = dataSetsForCustomersGraph[0].data.length;

			let colorData = poolColors(customersGraphLenth);
			dataSetsForCustomersGraph[0].backgroundColor = colorData;
			// dataSetsForCustomersGraph[0].borderColor = colorData;
			setCustomersData({
				...barConfig2,
				labels: xAxisForCustomersGraph,
				datasets: dataSetsForCustomersGraph,

				options: {
					...barConfig2.options,
					scales: {
						...barConfig2.options.scales,
						xAxes: [
							{
								ticks: {
									maxTicksLimit: 12
									// stepSize: 1
								}
							}
						]
					}
				}
			});
		} else {
			context.addSnackMessage(res);
		}
	};
	const fetchNoOfSales = async (start, end, statusForNoSales, timePeriod) => {
		let payload = {
			startDate: moment(start).format('MMM DD YYYY HH:mm:ss'),
			endDate: moment(end).format('MMM DD YYYY HH:mm:ss'),
			status: statusForNoSales,
			timePeriod: timePeriod
		};
		setLoadingNoOfSalesData(true);
		let res = await getNoOfSalesData(payload);
		setLoadingNoOfSalesData(false);
		if (res && res.status !== 'error') {
			setNoOfSalesData(res);
			let barGraph = res.barChart;
			let xAxisForBarGraph = barGraph ? Object.keys(barGraph) : [];
			let yAxisForBarGraph = barGraph ? Object.values(barGraph) : [];
			let dataSetsForBarGraph = barConfig.datasets;

			dataSetsForBarGraph[0].data = yAxisForBarGraph;
			let barGraphLenth = dataSetsForBarGraph[0].data.length;

			let colorData = poolColors(barGraphLenth);
			dataSetsForBarGraph[0].backgroundColor = colorData;
			dataSetsForBarGraph[0].borderColor = colorData;
			setBarData({
				...barConfig,
				labels: xAxisForBarGraph,
				datasets: dataSetsForBarGraph,

				options: {
					...barConfig.options,
					scales: {
						...barConfig.options.scales,
						xAxes: [
							{
								ticks: {
									maxTicksLimit: 12
									// stepSize: 1
								}
							}
						]
					}
				}
			});
		} else {
			context.addSnackMessage(res);
		}
	};

	const setSalesChart = async (firstDay, lastDay, status, timePeriod) => {
		setLoadingSales(true);
		setSalesGraphData(null);
		let response = await getSalesAmountData(firstDay, lastDay, status, timePeriod);
		let labels = response.labels;
		let datasets = response.datasets;
		let productsData = await getProductsData(
			firstDay,
			lastDay,
			status,
			timePeriod,
			selectedProducts.itemIds,
			selectedProducts.allProducts
		);

		if (productsData && Object.keys(productsData).length > 0) {
			datasets = [];

			let keys = Object.keys(productsData);
			keys.forEach((key) => {
				let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
				let obj;
				let item = productsData[key];
				if (key !== 'All') {
					obj = {
						...salesGraphDataset,
						label: item.itemName,
						borderColor: color,
						pointHoverBackgroundColor: color,
						data: item.chartdata ? [ ...Object.values(item.chartdata) ] : []
					};
				} else {
					obj = {
						...salesGraphDataset,
						label: 'All',
						borderColor: color,
						pointHoverBackgroundColor: color,
						data: item ? [ ...Object.values(item) ] : []
					};
				}

				datasets.push(obj);
			});
		}
		let data = {
			...salesGraphConfig,
			labels: labels,
			datasets: [ ...datasets ],
			options: {
				...salesGraphConfig.options,
				scales: {
					...salesGraphConfig.options.scales,
					xAxes: [
						{
							ticks: {
								maxTicksLimit: 12
							}
						}
					]
				}
			}
		};
		setLoadingSales(false);
		setSalesGraphData(data);
	};

	const getSalesAmountData = async (start, end, status, timePeriod) => {
		let payload = {
			startDate: moment(start).format('MMM DD YYYY HH:mm:ss'),
			endDate: moment(end).format('MMM DD YYYY HH:mm:ss'),
			status: status,
			timePeriod: timePeriod
		};
		let res = await fetchYSalesAmountData(payload);
		if (res && res.status !== 'error') {
			setSalesData(res);

			// profit chart
			setProfitChart(res.profitChartDate);

			// sales chart
			let dataGraph = res.chartData;
			let xAxisForDataGraph = Object.keys(dataGraph);
			let yAxisForDataGraph = Object.values(dataGraph);
			let dataSet = { ...salesGraphDataset };
			dataSet.data = yAxisForDataGraph;
			dataSet.label = 'Sales';
			return { labels: xAxisForDataGraph, datasets: [ dataSet ] };
		}
	};
	const getProductsData = async (start, end, status, timePeriod, itemIds, allProducts) => {
		let payload = {
			startDate: moment(start).format('MMM DD YYYY HH:mm:ss'),
			endDate: moment(end).format('MMM DD YYYY HH:mm:ss'),
			status: status,
			timePeriod: timePeriod,
			itemIds: itemIds,
			allProducts: allProducts
		};
		let res = await fetchProductsGraphData(payload);
		if (res && res.status !== 'error') {
			let data = res ? res : {};
			return data;
		}
	};
	const setProfitChart = (profitGraph) => {
		let xAxisForProfitGraph = Object.keys(profitGraph);
		let yAxisForProfitGraph = Object.values(profitGraph);
		let dataSetsForProfitGraph = salesConfig.datasets;

		dataSetsForProfitGraph[0].data = yAxisForProfitGraph;
		setSalesProfitData({
			...salesConfig,
			labels: xAxisForProfitGraph,
			datasets: dataSetsForProfitGraph,
			options: {
				...salesConfig.options,
				scales: {
					...salesConfig.options.scales,
					xAxes: [
						{
							ticks: {
								maxTicksLimit: 12
								// stepSize: 1
							}
						}
					]
				}
			}
		});
	};
	const handleTimePeriodChange = (e) => {
		setTimePeriod(e.target.value);
		let type = e.target.value;
		let curr = new Date();
		let firstday;
		if (type === 'Week') {
			let first = moment(curr).startOf('week');
			firstday = new Date(first);
		} else if (type === 'Month') {
			let first = moment(curr).startOf('month');
			firstday = new Date(first);
		} else if (type === 'Year') {
			let first = moment(curr).startOf('year');
			firstday = new Date(first);
		} else if (type === 'Custom') {
			firstday = firstDay;
		}
		setFirstDay(firstday);
		setLastDay(curr);
		setSalesChart(firstday, curr, status, type);
		fetchNoOfSales(firstday, curr, statusForNoSales, type);
	};

	const handleStatusChange = (e) => {
		let status = e.target.value;
		setStatus(status);
		setSalesChart(firstDay, lastDay, status, timePeriod);
	};
	const handleNoOfSalesStatusChange = (e) => {
		let statusForNoSales = e.target.value;
		setStatusForNoSales(statusForNoSales);
		fetchNoOfSales(firstDay, lastDay, statusForNoSales, timePeriod);
	};
	const handlePieChartStatusChange = (e) => {
		let statusForPie = e.target.value;
		setStatusForPie(statusForPie);
		getPieChart(firstDay, lastDay, statusForPie, timePeriod);
	};
	const handleTopCustomersChange = (e) => {
		let statusForTopCustomers = e.target.value;
		setStatusForTopCustomers(statusForTopCustomers);
		getTopCustomers(firstDay, lastDay, statusForTopCustomers, timePeriod);
	};

	const handleChange = (e, day) => {
		if (day === 'firstDay') {
			setFirstDay(e);
			setSalesChart(e, lastDay, status, 'Custom');
			fetchNoOfSales(firstDay, lastDay, statusForNoSales, 'Custom');
		} else {
			setLastDay(e);
			setSalesChart(firstDay, e, status, 'Custom');
			fetchNoOfSales(firstDay, lastDay, statusForNoSales, 'Custom');
		}
		setTimePeriod('Custom');
	};
	const handleSearchForItems = (e) => {
		let text = e.target.value;
		console.log(text);
		let data = allItems ? allItems : [];

		let filtered = data.filter((item) => item.description.toLowerCase().includes(text.toLowerCase()));
		setItems(filtered);
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleProductCheck = (id) => {
		let items = selectedProducts.itemIds ? selectedProducts.itemIds : [];
		let ind = items.findIndex((itemId) => itemId === id);
		if (ind >= 0) return true;
		return false;
	};
	const handleProductChange = (id) => {
		let items = selectedProducts.itemIds ? selectedProducts.itemIds : [];
		let ind = items.findIndex((itemId) => itemId === id);

		if (ind >= 0) {
			let filtered = items.filter((itemId) => itemId !== id);
			items = filtered;
		} else {
			items.push(id);
		}

		setSelectedProducts({ ...selectedProducts, itemIds: items });
	};
	const handleProductsSave = () => {
		setSalesChart(firstDay, lastDay, status, timePeriod);
		handleClose();
	};
	const stopPropagation = (e) => {
		switch (e.key) {
			case 'ArrowDown':
			case 'ArrowUp':
			case 'Home':
			case 'End':
				break;
			default:
				e.stopPropagation();
		}
	};

	return (
		<Layout history={props.history}>
			<div className="container p-48">
				<div className="d-flex flex-row justify-content-between my-24  ">
					<p className="pageHeader">Analytics</p>

					<div className="d-flex  " style={{ alignSelf: 'flex-end' }}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Grid>
								<KeyboardDatePicker
									disableToolbar
									className="mt-1 mr-2"
									variant="inline"
									format="MM/dd/yyyy"
									style={{ width: 140 }}
									value={firstDay}
									name="firstDay"
									onChange={(e) => handleChange(e, 'firstDay')}
									KeyboardButtonProps={{
										'aria-label': 'change date'
									}}
								/>
							</Grid>
						</MuiPickersUtilsProvider>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Grid>
								<KeyboardDatePicker
									disableToolbar
									variant="inline"
									format="MM/dd/yyyy"
									className="mt-1 mr-12"
									name="lastDay"
									style={{ width: 140 }}
									value={lastDay}
									onChange={(e) => handleChange(e, 'lastDay')}
									KeyboardButtonProps={{
										'aria-label': 'change date'
									}}
								/>
							</Grid>
						</MuiPickersUtilsProvider>

						<FormControl variant="outlined" className={classes.formControl}>
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								value={timePeriod}
								onChange={handleTimePeriodChange}
								label="Time"
								style={{
									height: 35.5,
									minHeight: 35.5,
									marginRight: 0,
									border: '1px solid white !important',
									backgroundColor: '#1e88e5',
									color: 'white'
								}}
							>
								<MenuItem value="Week">This Week</MenuItem>
								<MenuItem value="Month">This Month</MenuItem>
								<MenuItem value="Year">This Year</MenuItem>
								<MenuItem value="Custom">Custom</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>

				<div className="row">
					<div className="col-md-4">
						<Card className="p-16">
							<div className="spacingBetween">
								<p className="sectionTitle">Sales Today</p>
							</div>
							<div>
								<p className="text-24">₹{salesData && salesData.todaySaleAmount}</p>
							</div>
						</Card>
					</div>

					<div className="col-md-4">
						<Card className="p-16">
							<div className="spacingBetween">
								<p className="sectionTitle">Sales This Month</p>
							</div>
							<div>
								<p className="text-24">₹{salesData && salesData.thisMonthAmount}</p>
							</div>
						</Card>
					</div>

					<div className="col-md-4">
						<Card className="p-16">
							<div className="spacingBetween">
								<p className="sectionTitle">Sales This Year</p>
							</div>
							<div>
								<p className="text-24">₹{salesData && salesData.thisYearAmount}</p>
							</div>
						</Card>
					</div>
				</div>

				<div className="row mt-24">
					<div className="col-md-12">
						<Paper className="p-12">
							<div className="spacingBetween">
								<p className="sectionTitle">Revenue Over Time Period</p>
								<div>
								<FormControl variant="outlined" className="mr-5">
								<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									value={status}
									onChange={handleStatusChange}
									style={{
										height: 35.5,
										minHeight: 35.5,

										border: '1px solid white !important',
										backgroundColor: '#1e88e5',
										color: 'white'
									}}
								>
									<MenuItem value="Created">Created</MenuItem>
									<MenuItem value="Shipped">Shipped</MenuItem>
									<MenuItem value="Cancelled">Cancelled</MenuItem>
								</Select>
							</FormControl>
									<Button
										aria-controls="simple-menu"
										aria-haspopup="true"
										onClick={handleClick}
										classsName="bg-primary text-white mr-3"
										style={{ backgroundColor: '#1e88e5', color: 'white' }}
									>
										Select Products
									</Button>

									<Menu
										id="simple-menu"
										anchorEl={anchorEl}
										keepMounted
										open={Boolean(anchorEl)}
										onClose={handleClose}
										style={{ width: '250px', height: '400px' }}
									>
										<MenuItem>
											All
											<span className="ml-auto">
												<Checkbox
													color="primary"
													checked={selectedProducts.allProducts === 'All'}
													inputProps={{ 'aria-label': 'secondary checkbox' }}
													onChange={(e) => {
														if (e.target.checked)
															setSelectedProducts({
																...selectedProducts,
																allProducts: 'All'
															});
														else
															setSelectedProducts({
																...selectedProducts,
																allProducts: null
															});
													}}
												/>
											</span>
										</MenuItem>
										<MenuItem>
											<TextField
												InputProps={{ style: { height: 35, fotSize: 14 } }}
												style={{ fontSize: '20px !important' }}
												placeholder="Search"
												fullWidth
												onKeyDown={stopPropagation}
												onChange={handleSearchForItems}
												margin="normal"
												variant="outlined"
												type="text"
											/>
										</MenuItem>
										{items &&
											items.map((item) => (
												<MenuItem>
													<p style={{maxWidth:140,overflowX:'auto'}}>{item.description}</p>
													<span className="ml-auto">
														<Checkbox
															color="primary"
															inputProps={{ 'aria-label': 'secondary checkbox' }}
															checked={handleProductCheck(item.itemId)}
															onChange={() => handleProductChange(item.itemId)}
														/>
													</span>
												</MenuItem>
											))}
										<MenuItem className="d-flex flex-row justify-content-center">
										
												<Button
													onClick={handleProductsSave}
													style={{ backgroundColor: '#1e88e5', color: 'white' }}
												>
													Save
												</Button>
										
										</MenuItem>
									</Menu>
						
								</div>
							</div>

							{loadingSales ? (
								<React.Fragment>
									{[ 1, 2, 3, 4, 5 ].map((loader, index) => (
										<LoaderComponent key={index} width="100%" height={63} classes="mb-3" />
									))}
								</React.Fragment>
							) : (
								<React.Fragment>
									{salesGraphData && <Line data={salesGraphData} options={salesGraphData.options} />}
								</React.Fragment>
							)}
						</Paper>
						<Paper className="mt-24 p-12">
							<div className="spacingBetween">
								<p className="sectionTitle"> Profit Over Time Period</p>
								<Button
									className=" d-flex justify-content-center align-items-center buttonHover sectionTitle text-white"
									variant="contained"
									color="primary"
								>
									<p className="sectionSubTitle text-white">Shipped</p>
								</Button>
							</div>

							{loadingSales ? (
								<React.Fragment>
									{[ 1, 2, 3, 4, 5 ].map((loader, index) => (
										<LoaderComponent key={index} width="100%" height={63} classes="mb-3" />
									))}
								</React.Fragment>
							) : (
								<React.Fragment>
									{salesProfitData && (
										<Line data={salesProfitData} options={salesProfitData.options} />
									)}
								</React.Fragment>
							)}
						</Paper>
						<Paper className="p-24 mt-24">
							<div className="spacingBetween">
								<p className="sectionTitle">No Of Products</p>
								<FormControl variant="outlined" className={classes.formControl}>
									<Select
										labelId="demo-simple-select-outlined-label"
										id="demo-simple-select-outlined"
										value={statusForNoSales}
										onChange={handleNoOfSalesStatusChange}
										style={{
											height: 35.5,
											minHeight: 35.5,

											border: '1px solid white !important',
											backgroundColor: '#1e88e5',
											color: 'white'
										}}
									>
										<MenuItem value="Created">Created</MenuItem>
										<MenuItem value="Shipped">Shipped</MenuItem>
										<MenuItem value="Cancelled">Cancelled</MenuItem>
									</Select>
								</FormControl>
							</div>
							{loadingNoOfSalesData ? (
								<React.Fragment>
									{[ 1, 2, 3, 4, 5 ].map((loader, index) => (
										<LoaderComponent key={index} width="100%" height={63} classes="mb-3" />
									))}
								</React.Fragment>
							) : (
								<React.Fragment>
									{barData && <Bar data={barData} options={barConfig.options} />}
								</React.Fragment>
							)}
						</Paper>
						<Paper className="p-24 mt-24">
							<div className="spacingBetween">
								<p className="sectionTitle">Product Share</p>
								<FormControl variant="outlined" className={classes.formControl}>
									<Select
										labelId="demo-simple-select-outlined-label"
										id="demo-simple-select-outlined"
										value={statusForPie}
										onChange={handlePieChartStatusChange}
										style={{
											height: 35.5,
											minHeight: 35.5,

											border: '1px solid white !important',
											backgroundColor: '#1e88e5',
											color: 'white'
										}}
									>
										<MenuItem value="Created">Created</MenuItem>
										<MenuItem value="Shipped">Shipped</MenuItem>
										<MenuItem value="Cancelled">Cancelled</MenuItem>
									</Select>
								</FormControl>
							</div>
							{loadingPieChart ? (
								<React.Fragment>
									{[ 1, 2, 3, 4, 5 ].map((loader, index) => (
										<LoaderComponent key={index} width="100%" height={63} classes="mb-3" />
									))}
								</React.Fragment>
							) : (
								<React.Fragment>{pieData && <Pie data={pieChartData} />}</React.Fragment>
							)}
						</Paper>
						<Paper className="p-24 mt-24">
							<div className="spacingBetween">
								<p className="sectionTitle">Top 5 Customers </p>
								<FormControl variant="outlined" className={classes.formControl}>
									<Select
										labelId="demo-simple-select-outlined-label"
										id="demo-simple-select-outlined"
										value={statusForTopCustomers}
										onChange={handleTopCustomersChange}
										style={{
											height: 35.5,
											minHeight: 35.5,

											border: '1px solid white !important',
											backgroundColor: '#1e88e5',
											color: 'white'
										}}
									>
										<MenuItem value="Created">Created</MenuItem>
										<MenuItem value="Shipped">Shipped</MenuItem>
										<MenuItem value="Cancelled">Cancelled</MenuItem>
									</Select>
								</FormControl>
							</div>
							{loadigTopCustomersChart ? (
								<React.Fragment>
									{[ 1, 2, 3, 4, 5 ].map((loader, index) => (
										<LoaderComponent key={index} width="100%" height={63} classes="mb-3" />
									))}
								</React.Fragment>
							) : (
								<React.Fragment>
									{customersData && <Bar data={customersData} options={barConfig2.options} />}
								</React.Fragment>
							)}
						</Paper>
					</div>
				</div>
			</div>
		</Layout>
	);
}
