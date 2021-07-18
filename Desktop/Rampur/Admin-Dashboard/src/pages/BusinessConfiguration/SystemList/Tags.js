import React, { useContext, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { Chip } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import { blue } from '@material-ui/core/colors';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import 'date-fns';

import { SketchPicker } from 'react-color';



import AppContext from 'context/AppContext';

import { fetchTags, createNewTag, updateTag, delTag } from 'api';

const Tags = (props) => {
	const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ selectedTag, setSelectedTag ] = React.useState(null);
	const [ tags, setTags ] = React.useState([]);
	const [ alltags, setAllTags ] = React.useState([]);
	const [ tagsLoader, setTagsLoader ] = React.useState(false);
	const [ selectedTagId, setSelectedTagId ] = React.useState(null);
	const [ editTagLoader, setEditTagLoader ] = React.useState(false);
	const [ addTagLoader, setAddTagLoader ] = React.useState(false);
	const [ editColor, setEditColor ] = React.useState(false);
	const [ deleteTagWarning, setDeleteTagWarning ] = React.useState(false);
	const [selectedDelTag,setSelectedDelTag]=React.useState(null)

	const context = useContext(AppContext);

	useEffect(() => {
		getTags();
	}, []);

	const getTags = async () => {
		setTagsLoader(true);
		let res = await fetchTags();
		setTagsLoader(false);
		if (res.status !== 'error') {
			setTags(res.data);
			setAllTags(res.data);
		} else {
			context.addSnackMessage(res);
			setTags([]);
			setAllTags([]);
		}
	};
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	const handleTagForm = (e, item) => {
		if (e.target.name === 'name') {
			setSelectedTag({ ...selectedTag, [e.target.name]: e.target.value });
		} else if (e.target.name === 'usedFor') {
			let usedFor = selectedTag.usedFor ? selectedTag.usedFor : [];
			if (usedFor && usedFor.length > 0) {
				let index = usedFor.findIndex((value) => {
					return value === item;
				});
				if (index >= 0) {
					let arr = [ ...usedFor.slice(0, index), ...usedFor.slice(index + 1, usedFor.length) ];
					usedFor = arr;
				} else {
					usedFor.push(item);
				}
			} else {
				usedFor.push(item);
			}
			setSelectedTag({ ...selectedTag, usedFor: usedFor });
		}
	};
	const handleSearchTag = (e) => {
		let text = e.target.value;

		let updatedTags = alltags;
		updatedTags = updatedTags.filter((item) => {
			return item.name.toLowerCase().includes(text.toLowerCase());
		});
		setTags(updatedTags);

		setRowsPerPage(5);
	};
	const handleTagClick = (type, tag) => {
		if (type === 'add') {
			let obj = {
				usedFor: [],
				name: '',
				colour: blue[600],
				type: 'add'
			};
			setSelectedTag(obj);
		} else if (type === 'edit') {
		
			setSelectedTag(tag);
		}
	};
	const handleTagDialogClose = () => {
		setSelectedTag(null);
	};
	const handleAddTag = async () => {
		setAddTagLoader(true);
		let res = await createNewTag(selectedTag);
		setAddTagLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			handleTagDialogClose();
			getTags();
		} else {
			context.addSnackMessage(res);
		}
	};

	const handleEditTag = async () => {
		setEditTagLoader(true);
		let res = await updateTag(selectedTag);
		setEditTagLoader(false);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			handleTagDialogClose();
			getTags();
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleDeleteTagWarning = (tag) => {
		setDeleteTagWarning(true);
		setSelectedDelTag(tag)
	};

	const handleDeleteTag = async () => {
		setDeleteTagWarning(false)
		// setSelectedTagId(selectedDelTag.tagId);
		let res = await delTag(selectedDelTag);
		// setSelectedTagId(null);
		setSelectedDelTag(null);
		if (res && res.status !== 'error') {
			let msg = { message: res.data.message, key: new Date().getTime(), type: 'success' };
			context.addSnackMessage(msg);
			getTags();
		} else {
			context.addSnackMessage(res);
		}
	};
	const handleEditCheck = (item) => {
		let usedFor = selectedTag && selectedTag.usedFor ? selectedTag.usedFor : [];
		let ind = usedFor.findIndex((value) => {
			return value === item;
		});
		if (ind >= 0) return true;
		return false;
	};
	const handleEditChangeComplete = (color) => {
		setSelectedTag({ ...selectedTag, colour: color.hex });
	};

	return (
		<div>
			<Paper>
				<div className="spacingBetween px-16 pt-2">
					<p className="sectionTitle cursor-pointer">Tags</p>
					<div className="circle adjustingCenter">
						<AddIcon
							style={{ fontSize: 20 }}
							className="text-white cursor-pointer"
							onClick={() => {
								handleTagClick('add');
							}}
						/>
					</div>
				</div>

				<div className="px-12">
					<TextField
						inputProps={{ style: { height: 4, fotSize: 20 } }}
						placeholder="Search"
						fullWidth
						onChange={handleSearchTag}
						margin="normal"
						variant="outlined"
					/>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell align="left">
										<p className="sectionSubTitle">Name</p>
									</TableCell>
									<TableCell align="left">
										<p className="sectionSubTitle  ">Display</p>
									</TableCell>
									<TableCell align="center">
										<p className="sectionSubTitle ml-3">Used For</p>
									</TableCell>
									<TableCell align="center">
										<p className="sectionSubTitle ml-4">Actions</p>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{tags &&
									tags
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((tag, index) => {
											return (
												<TableRow tabIndex={-1} key={index}>
													<TableCell
														align="left"
														className="sectionContent textHover text-blue"
													>
														{tag.name}
													</TableCell>
													<TableCell className="sectionContent " align="left">
														<Chip
															size="small"
															mr={1}
															mb={1}
															label={tag.tagId}
															style={{
																backgroundColor: tag.colour ? tag.colour : '',

																color: 'white',
																fontSize: '13px'
															}}
															className="px-2"
														/>
													</TableCell>

													<TableCell align="center" className="sectionContent">
														{tag.usedFor && tag.usedFor.length ? (
															<React.Fragment>
																<div>{tag.usedFor[0]}</div>
																{tag.usedFor[1] && <div>{tag.usedFor[1]}</div>}
																{tag.usedFor[2] && (
																	<div>
																		<MoreHorizIcon />
																	</div>
																)}
															</React.Fragment>
														) : (
															<div />
														)}
													</TableCell>

													<TableCell align="center" className="sectionContent">
														<div className="tag">
															<Button
																variant="outlined"
																style={{
																	backgroundColor: '#f5f5f5'
																}}
																className="py-0 px-4"
																onClick={() => handleTagClick('edit', tag)}
															>
																Edit
															</Button>
															<Button
																variant="outlined"
																style={{
																	backgroundColor: '#f5f5f5'
																}}
																className="cursor-pointer px-0 m-0 ml-2 py-0 "
																disabled={tag.tagId === selectedTagId}
																// onClick={() => handleDeleteTag(tag)}
																onClick={() => handleDeleteTagWarning(tag)}
																
															>
																{tag.tagId === selectedTagId ? 'Deleting...' : 'Delete'}
															</Button>
														</div>
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
						count={tags && tags.length ? tags.length : 0}
						rowsPerPage={rowsPerPage}
						page={page}
						onChangePage={handleChangePage}
						onChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				</div>
			</Paper>
			<Dialog fullWidth={true} maxWidth="sm" open={deleteTagWarning}>
				<DialogTitle>
					<p className="sectionTitle">Are you sure want to delete this item?</p>
				</DialogTitle>
				<DialogContent>
					<p className="sectionSubTitle"> Deleting this item will remove it from all parts of the system</p>
				</DialogContent>
				<DialogActions>
					<div className="">
						<Button color="primary" variant="outlined" onClick={()=>setDeleteTagWarning(false)} className="mr-12">
							Cancel
						</Button>
						<Button color="primary" variant="contained"  className="mr-12" onClick={handleDeleteTag}>
							Continue
						</Button>
					</div>
				</DialogActions>
			</Dialog>

			{selectedTag && (
				<Dialog open={Boolean(selectedTag)} maxWidth="md" fullWidth={true}>
					<DialogTitle>
						<p className="sectionTitle">{selectedTag.type === 'add' ? 'Add Tag' : 'Edit Tag'}</p>
					</DialogTitle>
					<DialogContent className="px-4">
						<div className="container">
							<div className="mb-12">
								<p className="sectionContent">Name</p>
								<TextField
									inputProps={{ style: { height: 5, fotSize: 20 } }}
									placeholder="Name"
									name="name"
									value={selectedTag.name}
									onChange={handleTagForm}
									className="p-0 m-0"
									fullWidth
									margin="normal"
									variant="outlined"
								/>
							</div>
							<p className="sectionContent mt-16">Used For</p>
							<div className="row p-0 m-0">
								{[
									'Items',
									'Item Accounting Codes',
									'Item Category',
									'Item Shapes',
									'Item Materials',
									'Item Grades',
									'Item Thickness'
								].map((item, index) => (
									<div key={index} className="col-md-3 pl-0 mb-4">
										<Card className="px-4 py-2 row m-0">
											<Checkbox
												size="small"
												name="usedFor"
												checked={handleEditCheck(item)}
												onChange={(e) => handleTagForm(e, item)}
												color="primary"
												inputProps={{
													'aria-label': 'secondary checkbox'
												}}
												className="pl-1 py-2"
											/>
											<p className="sectionSubTitle  pt-1">{item}</p>
										</Card>
									</div>
								))}
							</div>

							<div className="py-6">
								<p className="sectionContent mt-6">Style</p>
								<div className="container p-0">
									<div className="row">
										<div className="col-md-4">
											<p className="sectionSubTitle">Color</p>
											<Card className="spacingBetween d-flex py-2 px-2">
												<Chip
													size="small"
													mr={1}
													mb={1}
													label=""
													style={{
														backgroundColor: selectedTag.colour,
														color: 'white',
														fontSize: '13px'
													}}
													className="px-2"
												/>
												<EditIcon
													style={{
														opacity: 0.8,
														fontSize: '16px',
														cursor: 'pointer'
													}}
													onClick={() => setEditColor(true)}
												/>
											</Card>
										</div>
										{editColor && (
											<div className="col-md-4 ">
												<div style={{ position: 'relative' }} className="d-flex">
													<div className="circle adjustingCenter closePosition">
														<CloseIcon
															style={{
																fontSize: '15px',
																color: 'white'
															}}
															onClick={() => setEditColor(false)}
														/>
													</div>
													<SketchPicker
														color={selectedTag.colour}
														onChangeComplete={handleEditChangeComplete}
													/>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</DialogContent>
					<DialogActions>
						<div className="mr-4">
							<Button color="primary" variant="outlined" onClick={handleTagDialogClose} className="mr-12">
								Cancel
							</Button>
						</div>

						{selectedTag.type === 'add' ? (
							<Button
								color="primary"
								variant="contained"
								className="px-5"
								disabled={
									addTagLoader ||
									selectedTag.name === '' ||
									selectedTag.usedFor === []
								}
								onClick={handleAddTag}
							>
								{addTagLoader ? 'Adding...' : 'Add'}
							</Button>
						) : (
							<Button
								color="primary"
								variant="contained"
								className="px-5"
								disabled={
									editTagLoader ||
									selectedTag.name === '' ||
									selectedTag.usedFor === []
								}
								onClick={handleEditTag}
							>
								{editTagLoader ? 'Updating...' : 'Update'}
							</Button>
						)}
					</DialogActions>
				</Dialog>
			)}
		</div>
	);
};
export default Tags;
