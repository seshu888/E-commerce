import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import Layout from '../../../layout/Layout';
import AppContext from '../../../context/AppContext';
import LoaderComponent from '../../../components/LoaderComponent';
import { fetchUsers, createNewUser, updateUser, deactivateUser } from '../../../api';
import * as jwtService from '../../../services/jwtService';



const UserList = (props) => {
	const context = useContext(AppContext);
	const [ allUsers, setAllUsers ] = useState([]);
	const [ users, setUsers ] = useState([]);
	const [ usersLoader, setUsersLoader ] = useState(false);
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(5);
	const [ selectedUser, setSelectedUser ] = useState(null);
	const [ selectedUserId, setSelectedUserId ] = useState(null);
	const [ createUserLoader, setCreateUserLoader ] = useState(false);
	const [ editUserLoader, setEditUserLoader ] = useState(false);


	useEffect(() => {
		getUsers();
	}, []);

	const getUsers = async () => {
		setUsersLoader(true);
		let res = await fetchUsers();
		setUsersLoader(false);
		if (res.status !== 'error') {
			setUsers(res.data);
			setAllUsers(res.data);
		} else {
			context.addSnackMessage(res);
		}
	};

	const handleSearch = (e) => {
		let text = e.target.value;
		let updatedUsers = allUsers ? allUsers : [];
		updatedUsers = updatedUsers.filter((item) => {
			return (
				item.firstName.toLowerCase().includes(text.toLowerCase()) ||
				item.lastName.toLowerCase().includes(text.toLowerCase()) ||
				item.email.toLowerCase().includes(text.toLowerCase())
			);
		});
		setUsers(updatedUsers);
		setRowsPerPage(5);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleUserClick = (type, user) => {
		if (type === 'add') {
			let obj = {
				firstName: '',
				lastName: '',
				email: '',
				type: 'add'
			};
			setSelectedUser(obj);
		} else if (type === 'edit') {
			setSelectedUser(user);
		}
	};
	const handleChange = (e) => {
		setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
	};
	const handleDialogClose = () => {
		setSelectedUser(null);
	};

	const handleAddUser = async () => {
		setCreateUserLoader(true);
		let res = await createNewUser(selectedUser);
		setCreateUserLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			firebase.auth().sendPasswordResetEmail(selectedUser.email);
			handleDialogClose();
			getUsers();
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleEditUser = async () => {
		setEditUserLoader(true);
		let res = await updateUser(selectedUser);
		setEditUserLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);	
			if(context.user && context.user.email === selectedUser.email ){
				let updatedUser = {...context.user,name:selectedUser.firstName}
				context.updateUser(updatedUser)
			}
			handleDialogClose();
			getUsers();
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleDeactivateUser = async (user) => {
		setSelectedUserId(user.uId);
		let res = await deactivateUser({ ...user, disabled: !user.disabled });
		setSelectedUserId(null);
		if (res && res.status !== 'error') {
		
			let msg = { message: res.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
		
			if ( context.user && context.user.email === user.email && !user.disabled) {
				jwtService.logout();
				window.location = '/login';
			}
			getUsers();
		} else {
			context.addSnackMessage(res);
		}
	};

	return (
		<Layout history={props.history}>
			<div className="p-24">
				<div className="spacingBetween pt-12 pb-8">
					<p className="pageHeader cursor-pointer">Users</p>
					<Button
						onClick={() => {
							handleUserClick('add');
						}}
						className=" d-flex justify-content-center align-items-center "
						variant="contained"
						color="primary"
					>
						<p className="sectionSubTitle text-white">Add User</p>
						<AddIcon className="mb-1 cursor-pointer" />
					</Button>
				</div>

				<TextField
					className="w-full"
					InputProps={{ style: { height: 40, fotSize: 14 } }}
					id="outlined-full-width"
					style={{ fontSize: '20px !important' }}
					placeholder="Search"
					fullWidth
					onChange={handleSearch}
					margin="normal"
					InputLabelProps={{
						shrink: true,
						fontSize: '12px'
					}}
					variant="outlined"
				/>

				<Paper className="mt-3">
					{usersLoader ? (
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
												<p className="sectionSubTitle">Name</p>
											</TableCell>
											<TableCell align="left">
												<p className="sectionSubTitle">Email</p>
											</TableCell>
											<TableCell align="center">
												<p className="sectionSubTitle">Status</p>
											</TableCell>
											<TableCell align="center">
												<p className="sectionSubTitle">Actions</p>
											</TableCell>
										</TableRow>
									</TableHead>
									{users &&
									users.length > 0 && (
										<TableBody>
											{users
												.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
												.map((user, index) => {
													return (
														<TableRow key={index}>
															<TableCell align="left" className="sectionContent " >
																<p style={{textTransform:'capitalize'}}>{user.firstName} {user.lastName}</p>
															</TableCell>
															<TableCell align="left" className="sectionContent">
																{user.email}
															</TableCell>
															<TableCell className="sectionContent " align="center">
																<Chip
																	size="small"
																	label={user.disabled ? 'Inactive' : 'Active'}
																	style={{
																		backgroundColor: user.disabled
																			? 'red'
																			: '#4caf50',
																		color: 'white',

																		fontSize: '13px'
																	}}
																	className="px-2"
																/>
															</TableCell>
															<TableCell className="sectionContent " align="center">
																<Button
																	variant="outlined"
																	style={{
																		backgroundColor: '#f5f5f5'
																	}}
																	className="mr-3"
																	size="small"
																	disabled={selectedUserId === user.uId}
																	onClick={() => handleDeactivateUser(user)}
																>
																	{user.disabled ? selectedUserId === user.uId ? (
																		'Activating...'
																	) : (
																		'Activate'
																	) : selectedUserId === user.uId ? (
																		'Deactivating...'
																	) : (
																		'Deactivate'
																	)}
																</Button>

																<Button
																	variant="outlined"
																	style={{
																		backgroundColor: '#f5f5f5'
																	}}
																	size="small"
																	onClick={() => handleUserClick('edit', user)}
																>
																	edit
																</Button>
															</TableCell>
														</TableRow>
													);
												})}
										</TableBody>
									)}
								</Table>
							</TableContainer>
							{users &&
							users.length > 0 && (
								<TablePagination
									style={{ fontSize: '15px' }}
									rowsPerPageOptions={[ 5, 10, 25 ]}
									component="div"
									count={users && users.length ? users.length : 0}
									rowsPerPage={rowsPerPage}
									page={page}
									onChangePage={handleChangePage}
									onChangeRowsPerPage={handleChangeRowsPerPage}
								/>
							)}
						</React.Fragment>
					)}
				</Paper>
			</div>

			{selectedUser && (
				<Dialog open={Boolean(selectedUser)} maxWidth="sm" fullWidth={true}>
					<DialogTitle>
						<p className="sectionTitle">{selectedUser.type === 'add' ? 'Add User' : 'Edit User'}</p>
					</DialogTitle>
					<DialogContent>
						<div className="d-flex flex-row align-items-center justify-content-between">
							<div style={{ width: '48%' }}>
								<p className="m-0 text-14 mb-2">First Name</p>
								<TextField
									fullWidth
									inputProps={{
										style: {
											height: 6
										}
									}}
									className="text-14"
									variant="outlined"
									name="firstName"
									value={selectedUser.firstName}
									onChange={handleChange}
								/>
							</div>
							<div style={{ width: '48%' }}>
								<p className="m-0 text-14 mb-2">Last Name</p>
								<TextField
									fullWidth
									inputProps={{
										style: {
											height: 6
										}
									}}
									className="text-14"
									variant="outlined"
									name="lastName"
									value={selectedUser.lastName}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="w-full mt-4">
							<p className="m-0 text-14 mb-2">Email</p>
							<TextField
								fullWidth
								inputProps={{
									style: {
										height: 6
									}
								}}
								className="text-14"
								variant="outlined"
								name="email"
								value={selectedUser.email}
								onChange={handleChange}
							/>
						</div>
					</DialogContent>
					<DialogActions>
						<div className="mr-4">
							<Button color="primary" variant="outlined" onClick={handleDialogClose}>
								Cancel
							</Button>
						</div>
						{selectedUser.type === 'add' ? (
							<Button
								color="primary"
								variant="contained"
								className="px-5"
								disabled={createUserLoader || selectedUser.lastName === "" || selectedUser.email === "" || selectedUser.firstName === ""}
								onClick={handleAddUser}
							>
								{createUserLoader ? 'Adding...' : 'Add'}
							</Button>
						) : (
							<Button
								color="primary"
								variant="contained"
								className="px-5"
								disabled={editUserLoader || selectedUser.lastName === "" || selectedUser.email === "" || selectedUser.firstName === ""}
								onClick={handleEditUser}
							>
								{editUserLoader ? 'Updating...' : 'Update'}
							</Button>
						)}
					</DialogActions>
				</Dialog>
			)}
		</Layout>
	);
};
export default UserList;
