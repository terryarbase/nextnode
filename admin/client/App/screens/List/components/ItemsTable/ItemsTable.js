import React, { PropTypes } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { Columns } from 'FieldTypes';
import { translate } from "react-i18next";

import TableRow from './ItemsTableRow';
import DragDrop from './ItemsTableDragDrop';

import { TABLE_CONTROL_COLUMN_WIDTH } from '../../../../../constants';
import { getTranslatedLabel } from '../../../../../utils/locale';

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
		allowUpdate: PropTypes.bool.isRequired,
		allowDelete: PropTypes.bool.isRequired,
		manageMode: PropTypes.bool.isRequired,
		rowAlert: PropTypes.object.isRequired,
		// isLocale={this.props.isLocale}
		// currentLang={this.props.currentLanguage}
	},
	renderCols () {
		let cols = this.props.columns.map(col => (
			<col key={col.path} width={col.width} />
		));

		// add delete col when available
		if (this.props.allowDelete) {
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
		if (this.props.allowDelete) listControlCount++;

		// set active sort
		const activeSortPath = this.props.activeSort.paths[0];
		const { manageMode, allowUpdate, items, realTimeCol } = this.props;
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
			** allowUpdate is true
			** at least one item result
			*/
			const isRealTimeCol = allowUpdate 
							&& ColumnType.displayName
							&& _.includes(RealTimeCol, ColumnType.displayName)
							&& items.results && items.results.length;
			var classNames = [];
			const currentValue = realTimeCol && _.has(realTimeCol, col.path) ? 
				realTimeCol[col.path] : null;
			if (isRealTimeCol) {
				classNames = [ ...classNames, 'ItemList__realtime--Col' ];
			}
			const title = getTranslatedLabel(this.props.t, {
				listKey: this.props.list.key,
				prefix: 'field',
				content: col.path,
			});
			// console.log(col);
			return (
				<th key={col.path} colSpan="1" className={classNames.join(' ')}>
					{
						isRealTimeCol && items.editCount ? 
						<ColumnType
								list={this.props.list}
								col={col}
								data={items[0]}
								noedit={manageMode || !allowUpdate}
								isPure={true}
								currentValue={currentValue}
								onChange={value => {
									this.props.onColChange({
										col,
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
							title={title}>
								{title}
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
			allowUpdate,
			allowDelete,
			realTimeCol,
			manageMode,
			isRestricted,
		} = this.props;
		if (!items.results.length) return null;

		const tableBody = (this.props.list.sortable) ? (
			<DragDrop {...this.props} />
		) : (
			<tbody >
				{items.results.map((item, i) => {
					// console.log(item);
					return (
						<TableRow key={item.id}
							deleteTableItem={this.props.deleteTableItem}
							index={i}
							sortOrder={item.sortOrder || 0}
							realTimeCol={realTimeCol}
							realTimeInfo={realTimeInfo}
							id={item.id}
							isLocale={this.props.isLocale}
							currentLang={this.props.currentLang}
							item={item}
							isRestricted={isRestricted}
							allowUpdate={allowUpdate}
							allowDelete={allowDelete}
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

module.exports = exports = translate('form')(ItemsTable);
