import Login from 'pages/Login';

import MaterialLibrary from 'pages/MaterialLibrary/MaterialLibrary';
// import TableComponent from 'components/TableComponent';

import Inventory from 'pages/Analytics/Inventory';

import Consumption from 'pages/Analytics/Consumption';

import SystemList from 'pages/BusinessConfiguration/SystemList';
import SalesGraphs from 'pages/Analytics/SalesGraphs';

import Sales from 'pages/SalesOrders/Sales';
import Customers from 'pages/SalesOrders/Customers';

import Bom from '../pages/Bom';
import UserList from 'pages/BusinessConfiguration/Users/UserList';

import ProductionList from 'pages/Production/ProductionList';


const routesConfig = [
	{
		id: 3,
		name: 'Analytics Dashboard',
		icon: 'view_compact_icon',
		showOnSidebar: true,
		childrenComponents: [
			{
				name: 'Sales & Costs',
				component: SalesGraphs,
				to: '/salesGraphs',
				icon: '',
				showOnSidebar: true
			},
			{
				name: 'Consumption & Production',
				component: Consumption,
				to: '/Consumption',
				icon: '',
				showOnSidebar: true
			},
			{
				name: 'Inventory Management',
				component: Inventory,
				to: '/Inventory',
				icon: '',
				showOnSidebar: true
			}
		]
	},
	{
		id: 3,
		name: 'Sales',
		icon: 'credit_card_icon',
		showOnSidebar: true,
		childrenComponents: [
			{
				name: 'Sale Orders',
				component: Sales,
				to: '/SalesOrders/Sales',
				icon: '',
				showOnSidebar: false
			},
			{
				id: 7,
				name: 'Customers',
				component: Customers,
				to: '/SalesOrders/Customers',
				icon: '',
				showOnSidebar: false
			}
		]
	},
	{
		id: 3,
		name: 'Purchases',
		icon: 'business_center_icon',
		showOnSidebar: true,
		childrenComponents: [
			{
				name: 'Purchase Orders',
				component: Sales,
				to: '/PurchaseOrderList',
				icon: '',
				showOnSidebar: false
			},
			{
				name: 'Suppliers',
				component: Customers,
				to: '/VendorList',
				icon: '',
				showOnSidebar: false
			}
		]
	},
	{
		id: 7,
		name: 'Production',
		component: ProductionList,
		to: '/ProductionList',
		icon: 'layers',
		showOnSidebar: true
	},

	{
		id: 2,
		name: 'Login',
		component: Login,
		to: '/login',
		icon: '',
		showOnSidebar: false
	},

	{
		id: 7,
		name: 'Material Library',
		component: MaterialLibrary,
		to: '/materialLibrary',
		icon: 'layers',
		showOnSidebar: true
	},




	{
		id: 3,
		name: 'Business Configuration',
		icon: 'settings',
		showOnSidebar: true,
		childrenComponents: [
			{
				name: 'Users',
				component: UserList,
				to: '/UserList',
				icon: '',
				showOnSidebar: false
			},
			{
				name: 'Systems',
				component: SystemList,
				to: '/SystemList',
				icon: '',
				showOnSidebar: false
			}
		]
	}
];
export default routesConfig;
