import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';

import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Checkbox from '@material-ui/core/Checkbox';

import { Chip } from '@material-ui/core';

export default function TableComponent(props) {
	return (
		<React.Fragment>
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
										<TableCell align="right" className="sectionContent">
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
										<TableCell className="sectionContent " align="left">
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
		</React.Fragment>
	);
}

TableComponent.propTypes = {
	columns: PropTypes.object.isRequired,
	rows: PropTypes.object.isRequired
};
