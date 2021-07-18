import axios from 'axios';
// const baseUrl = 'http://localhost:8088/services/';
// const baseUrl = 'https://kata-solutions-test1.df.r.appspot.com/';
const baseUrl="https://rampur-engineering.el.r.appspot.com";

const commonError = {
	key: new Date().getTime(),
	status: 'error',
	message: 'Something went wrong...'
};

const getErrorMsg = (error) => {
	let errMsg = commonError;
	if (error && error.response && error.response.data) {
		let msg = error.response.data.message;
		errMsg.message = msg !== 'No message available' ? msg : commonError.message;
	}
	return errMsg;
};

const fetchUsers = async () => {
	const res = await axios
		.get(baseUrl + 'business/usersDashboard')
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const createNewUser = async (userForm) => {
	const res = axios
		.post(baseUrl + 'business/addUser', userForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const updateUser = async (userForm) => {
	const res = axios
		.put(baseUrl + 'business/updateUser', userForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const deactivateUser = async (userForm) => {
	const res = await axios
		.post(baseUrl + 'business/userActions', userForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

// Tag APIs starts
const fetchTags = async () => {
	const res = await axios
		.get(baseUrl + 'business/getTags')
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const createNewTag = async (tagForm) => {
	const res = axios
		.post(baseUrl + 'business/addTag', tagForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const updateTag = async (tagForm) => {
	const res = axios
		.put(baseUrl + 'business/updateTag', tagForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const delTag = async (tagForm) => {
	const res = axios
		.post(baseUrl + 'business/deleteTag', tagForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
// Tag APIs ends

// Payment APIs starts
const fetchPayments = async () => {
	const res = await axios
		.get(baseUrl + 'business/getPaymentTerms')
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const createNewPayment = async (paymentForm) => {
	const res = axios
		.post(baseUrl + 'business/addPaymentTerms', paymentForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const updatePayment = async (paymentForm) => {
	const res = axios
		.put(baseUrl + 'business/updatePaymentTerms', paymentForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const delPayment = async (paymentForm) => {
	const res = axios
		.post(baseUrl + 'business/deletePaymentTerms', paymentForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
// Payment APIs ends

// Taxcode APIs starts
const fetchTaxes = async () => {
	const res = await axios
		.get(baseUrl + 'business/getTaxCodes')
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const createNewTax = async (taxForm) => {
	let newTaxForm = { ...taxForm, rateType: '%' };
	const res = axios
		.post(baseUrl + 'business/addTaxCode', newTaxForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const updateTax = async (taxForm) => {
	let newTaxForm = { ...taxForm, rateType: '%' };
	const res = axios
		.put(baseUrl + 'business/updateTaxCode', newTaxForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const delTax = async (taxForm) => {
	const res = axios
		.post(baseUrl + 'business/deleteTaxCode', taxForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const fetchCustomerType = async () => {
	const res = await axios
		.get(baseUrl + 'business/getCustomerTypes')
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const createNewCustomerType = async (CustomerType) => {
	const res = axios
		.post(baseUrl + 'business/addCustomerType', CustomerType)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const updateCustomerType = async (CustomerType) => {
	const res = axios
		.put(baseUrl + 'business/updateCustomerType', CustomerType)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const delCustomerType = async (CustomerType) => {
	const res = axios
		.delete(baseUrl + 'business/deleteCustomerType/' + CustomerType.id)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
// Taxcode APIs ends

// MaterialLibrary APIs starts
const fetchCategoryList = async (category) => {
	const res = await axios
		.get(baseUrl + 'business/getTagInfo/' + category)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const addMaterialItem = async (materialItem) => {
	const res = axios
		.post(baseUrl + 'material/addItem', materialItem)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const updateDetails = async (data) => {
	let newData = {
		...data,
		unitPrice: data.unitPrice.toString(),
		length: data.length.toString(),
		width: data.width.toString()
	};
	const res = axios
		.put(baseUrl + 'material/updateItem', newData)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const updateBomData = async (data) => {
	const res = axios
		.post(baseUrl + 'material/addItemBOM', data)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const fetchItems = async () => {
	const res = await axios
		.get(baseUrl + 'material/dashboard')
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const fetchItemDetails = async (id) => {
	const res = await axios
		.get(baseUrl + 'material/itemDetails/' + id)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const fetchTransactions = async (itemNumber) => {
	const res = await axios
		.get(baseUrl + 'material/transactions/' + itemNumber)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const fetchInventory = async (id) => {
	const res = await axios
		.get(baseUrl + 'material/inventory/' + id)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const fetchDemandData=async(id)=>{
	
	const res = await axios
	.get(baseUrl + 'material/demandData/' + id)
	.then((res) => {
		return res;
	})
	.catch((error) => {
		let errMsg = getErrorMsg(error);
		return errMsg;
	});
if (res && res.status === 200) {
	return res.data;
}
return res;
}

const createNewTransaction = async (selectedInventory) => {
	let newSelectedInventory = {
		...selectedInventory,
		direction: 'Increased',
		actionType: 'Adjusted',

	
	};

	const res = axios
		.put(baseUrl + 'material/adjustInventory', newSelectedInventory)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const deleteTransaction = async (id) => {

	
	const res = axios
		.delete(baseUrl + 'material/deleteTransaction/'+ id)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const updateInventory = async (selectedInventory) => {


	const res = axios
		.put(baseUrl + 'material/updateTransaction', selectedInventory)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const fetchBomItemsList = async (id) => {
	const res = await axios
		.get(baseUrl + 'material/itemsList/' + id)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const fetchBomChildItems = async (id) => {
	const res = await axios
		.get(baseUrl + 'material/itemBOM/' + id)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
// MaterialLibrary APIs ends

// Customer and suppliers APIS starts
const fetchCustomers = async (category) => {
	const res = await axios
		.get(baseUrl + 'sales/customerDashboard/' + category)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const createNewCustomer = async (newCustomer) => {
	let customer = { ...newCustomer, status: 'Active' };
	const res = await axios
		.post(baseUrl + 'sales/addCustomer', customer)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const fetchCustomerDetails = async (customerId) => {
	const res = await axios
		.get(baseUrl + 'sales/customerDetails/' + customerId)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const fetchContactPersonList = async (customerId) => {
	const res = await axios
		.get(baseUrl + 'sales/customerContacts/' + customerId)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const fetchPaymentTerms = async () => {
	const res = await axios
		.get(baseUrl + 'business/getPaymentTerms')
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const fetchContacts = async (customerId) => {
	const res = await axios
		.get(baseUrl + 'sales/customerContacts/' + customerId)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const createNewContact = async (newContact) => {
	delete newContact.contacts.type;
	let newContactForm = { ...newContact };

	const res = await axios
		.put(baseUrl + 'sales/updateContacts', newContactForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const fetchAddresses = async (customerId) => {
	const res = await axios
		.get(baseUrl + 'sales/customerAddresses/' + customerId)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const createNewAddress = async (form) => {
	delete form.address.type;
	let newAddresForm = { ...form };

	const res = await axios
		.put(baseUrl + 'sales/updateAddresses', newAddresForm)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const deleteContact = async (contactId, customerId) => {
	const res = await axios
		.delete(baseUrl + 'sales/deleteContact/' + customerId + '/' + contactId)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const deleteAddress = async (customerId, AddressId) => {
	const res = await axios
		.delete(baseUrl + 'sales/deleteCustomerAddress/' + customerId + '/' + AddressId)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const updateCustomer = async (selectedCustomer) => {
	let customer = {
		...selectedCustomer,
		paymentTerms: selectedCustomer.paymentTerms && selectedCustomer.paymentTerms.id,
		customerType: selectedCustomer.customerType && selectedCustomer.customerType.id
	};
	const res = await axios
		.put(baseUrl + 'sales/updateCustomer', customer)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const fetchBomItemDetails = async (id) => {
	const res = await axios
		.get(baseUrl + 'material/itemDetails/' + id)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

// SalesAPIS
const fetchSales = async (category) => {
	const res = await axios
		.get(baseUrl + 'sales/ordersDashboard/' + category)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const fetchCusotmersList = async (categoryForList) => {
	let category = categoryForList === 'Sales' ? 'Customers' : 'Suppliers';
	const res = await axios
		.get(baseUrl + 'sales/activeCustomers/' + category)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const createNewSale = async (updatedNewSale) => {
	const res = await axios
		.post(baseUrl + 'sales/createOrder', updatedNewSale)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const fetchItemsList = async (category) => {
	const res = await axios
		.get(baseUrl + 'sales/orderItemsList/' + category)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const fetchOrderDetails = async (id) => {
	const res = await axios
		.get(baseUrl + 'sales/orderDetails/' + id)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const UpdateSalesOrder = async (orderDetails) => {
	let newOrderDetails = {
		...orderDetails,
		orderId: orderDetails.orderInfo.orderId,
		orderStatus: orderDetails.orderInfo.status,
		totalOrderCost: (orderDetails.summary.discountedTotal),
		priority: orderDetails.orderInfo.priority,

	};
	let items=newOrderDetails.items && newOrderDetails.items.map((item)=>{
		
		item.subTotal=(item.subTotal)/(item.qty)
		return item
	})
	newOrderDetails={...newOrderDetails,items}
	console.log(items)
	delete newOrderDetails.summary;
	delete newOrderDetails.orderInfo;

	const res = await axios
		.post(baseUrl + 'sales/addOrderDetails', newOrderDetails)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const UpdateSalesOrderCustomerDetails = async (customerDetails) => {
	let id = customerDetails.customerDetails.customerId;
	let paymentId = customerDetails.paymentTerms && customerDetails.paymentTerms.id;

	delete customerDetails.status;
	delete customerDetails.url;
	delete customerDetails.customerName;
	delete customerDetails.creditLimit;
	delete customerDetails.customerDetails;

	let newCustomerDetails = { ...customerDetails, paymentTerms: paymentId, customerId: id };

	const res = await axios
		.put(baseUrl + 'sales/updateOrderCustomer', newCustomerDetails)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const fetchCustomerInfo = async (customerId, orderId) => {
	const res = await axios
		.get(baseUrl + 'sales/customerInfo/' + customerId + '/' + orderId)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const deleteSelectedItem = async (contactId, customerId) => {
	const res = await axios
		.delete(baseUrl + 'sales/deleteContact/' + customerId + '/' + contactId)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});

	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const fetchYSalesAmountData = async (payload) => {
	const res = await axios
		.post(baseUrl + 'sales/chartsInfo', payload)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const getNoOfSalesData = async (payload) => {
	const res = await axios
		.post(baseUrl + 'sales/barChartData', payload)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const fetchPieChart = async (payload) => {
	const res = await axios
		.post(baseUrl + 'sales/pieChartData ', payload)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};
const fetchTopCustomers = async (payload) => {
	const res = await axios
		.post(baseUrl + 'sales/topCustomersData ', payload)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};

const fetchProductsGraphData = async (payload) => {
	const res = await axios
		.post(baseUrl + 'sales/getProductChartData', payload)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			let errMsg = getErrorMsg(error);
			return errMsg;
		});
	if (res && res.status === 200) {
		return res.data;
	}
	return res;
};



// getYearlyData

// SalesAPIS ends

// Sales apis ends
export {
	fetchUsers,
	createNewUser,
	updateUser,
	deactivateUser,
	fetchPayments,
	createNewPayment,
	updatePayment,
	delPayment,
	fetchTaxes,
	createNewTax,
	updateTax,
	delTax,
	fetchCustomerType,
	createNewCustomerType,
	updateCustomerType,
	delCustomerType,
	fetchTags,
	createNewTag,
	updateTag,
	delTag,
	fetchCategoryList,
	addMaterialItem,
	updateDetails,
	updateBomData,
	fetchItems,
	fetchItemDetails,
	createNewTransaction,
	deleteTransaction,
	updateInventory,
	fetchTransactions,
	fetchInventory,
	fetchBomItemsList,
	fetchBomChildItems,
	fetchCustomers,
	createNewCustomer,
	fetchCustomerDetails,
	fetchContactPersonList,
	fetchPaymentTerms,
	fetchContacts,
	createNewContact,
	fetchAddresses,
	createNewAddress,
	deleteContact,
	deleteAddress,
	updateCustomer,
	fetchBomItemDetails,
	fetchSales,
	createNewSale,
	fetchCusotmersList,
	fetchItemsList,
	fetchOrderDetails,
	UpdateSalesOrder,
	fetchCustomerInfo,
	UpdateSalesOrderCustomerDetails,
	deleteSelectedItem,
	fetchYSalesAmountData,
	getNoOfSalesData,
	fetchPieChart,
	fetchTopCustomers,
	fetchProductsGraphData,
	fetchDemandData
};
