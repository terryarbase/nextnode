import React, { PropTypes } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { Columns } from 'FieldTypes';

import TableRow from './ItemsTableRow';
import DragDrop from './ItemsTableDragDrop';

import { TABLE_CONTROL_COLUMN_WIDTH } from '../../../../../constants';

// generate by this for realtime edit control column
const RealTimeCol = ['BooleanColumn'];

const ItemsTable = React.createClass({
	propTypes: {
		checkedItems: PropTypes.object.isRequired,
		columns: PropTypes.array.isRequired,
		deleteTableItem: PropTypes.func.isRequired,
		handleSortSelect: PropTypes.func.isRequired,
		items: PropTypes.object.isRequired,
		realTimeInfo: PropTypes.object.isRequired,
		realTimeCol: PropTypes.object.isRequired,
		list: PropTypes.object.isRequired,
		noedit: PropTypes.bool.isRequired,
		manageMode: PropTypes.bool.isRequired,
		rowAlert: PropTypes.object.isRequired,
	},
	renderCols () {
		let cols = this.props.columns.map(col => (
			<col key={col.path} width={col.width} />
		));

		// add delete col when available
		if (!this.props.list.nodelete) {
			cols.unshift(
				<col width={TABLE_CONTROL_COLUMN_WIDTH} key="delete" />
			);
		}

		// add sort col when available
		if (this.props.list.sortable) {
			cols.unshift(
				<col width={TABLE_CONTROL_COLUMN_WIDTH} key="sortable" />
			);
		}

		return (
			<colgroup>
				{cols}
			</colgroup>
		);
	},
	renderHeaders () {
		let listControlCount = 0;

		if (this.props.list.sortable) listControlCount++;
		if (!this.props.list.nodelete) listControlCount++;

		// set active sort
		const activeSortPath = this.props.activeSort.paths[0];
		const { manageMode, noedit, items, realTimeCol } = this.props;
		// pad first col when controls are available
		const cellPad = listControlCount ? (
			<th colSpan={listControlCount} />
		) : null;

		// map each heading column
		const cellMap = this.props.columns.map(col => {
			const ColumnType = Columns[col.type] || Columns.__unrecognised__;
			const isSelected = activeSortPath && activeSortPath.path === col.path;
			const isInverted = isSelected && activeSortPath.invert;
			const buttonTitle = `Sort by ${col.label}${isSelected && !isInverted ? ' (desc)' : ''}`;
			const colClassName = classnames('ItemList__sort-button th-sort', {
				'th-sort--asc': isSelected && !isInverted,
				'th-sort--desc': isInverted,
			});
			/*
			** disable if 
			** manage mode is on
			** noedit is turned off
			** at least one item result
			*/
			const isRealTimeCol = !noedit 
							&& ColumnType.displayName
							&& _.includes(RealTimeCol, ColumnType.displayName)
							&& items.results && items.results.length;
			var classNames = [];
			const currentValue = realTimeCol && _.has(realTimeCol, col.path) ? 
				realTimeCol[col.path] : null;
			if (isRealTimeCol) {
				classNames = [ ...classNames, 'ItemList__realtime--Col' ];
			}
			return (
				<th key={col.path} colSpan="1" className={classNames.join(' ')}>
					{
						isRealTimeCol ? 
						<ColumnType
								list={this.props.list}
								col={col}
								data={items[0]}
								noedit={manageMode || noedit}
								isPure={true}
								currentValue={currentValue}
								onChange={value => {
									this.props.onColChange({
										key: col.path,
										value,
									});
								}}
						/>
						: null
					}
						<button
							className={colClassName}
							onClick={() => {
								this.props.handleSortSelect(
									col.path,
									isSelected && !isInverted
								);
							}}
							title={buttonTitle}>
							{col.label}
							<span className="th-sort__icon" />
						</button>
				</th>
			);
		});

		return (
			<thead>
				<tr>
					{cellPad}
					{cellMap}
				</tr>
			</thead>
		);
	},
	render () {
		const {
			items,
			realTimeInfo,
			noedit,
			realTimeCol,
			manageMode,
		} = this.props;
		if (!items.results.length) return null;

		const tableBody = (this.props.list.sortable) ? (
			<DragDrop {...this.props} />
		) : (
			<tbody >
				{items.results.map((item, i) => {
					return (
						<TableRow key={item.id}
							deleteTableItem={this.props.deleteTableItem}
							index={i}
							sortOrder={item.sortOrder || 0}
							realTimeCol={realTimeCol}
							realTimeInfo={realTimeInfo}
							id={item.id}
							item={item}
							noedit={noedit}
							// currentValue={realTimeInfo && realTimeInfo[item.id]}
							{...this.props}
						/>
					);
				})}
			</tbody>
		);

		return (
			<div className="ItemList-wrapper">
				<table cellPadding="0" cellSpacing="0" className="Table ItemList">
					{this.renderCols()}
					{this.renderHeaders()}
					{tableBody}
				</table>
			</div>
		);
	},
});

module.exports = exports = ItemsTable;
