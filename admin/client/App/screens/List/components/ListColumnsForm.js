import React from 'react';
import assign from 'object-assign';
import _ from 'lodash';
import { translate } from "react-i18next";

import Popout from '../../../shared/Popout';
import PopoutList from '../../../shared/Popout/PopoutList';
import { FormInput } from '../../../elemental';
import ListHeaderButton from './ListHeaderButton';

import { setActiveColumns } from '../actions';
import { getTranslatedLabel } from '../../../../utils/locale';

var ListColumnsForm = React.createClass({
	displayName: 'ListColumnsForm',
	getInitialState () {
		return {
			selectedColumns: {},
			searchString: '',
		};
	},
	getSelectedColumnsFromStore () {
		var selectedColumns = {};
		this.props.activeColumns.forEach(col => {
			selectedColumns[col.path] = true;
		});
		return selectedColumns;
	},
	togglePopout (visible) {
		this.setState({
			selectedColumns: this.getSelectedColumnsFromStore(),
			isOpen: visible,
			searchString: '',
		});
	},
	toggleColumn (path, value) {
		const newColumns = assign({}, this.state.selectedColumns);

		if (value) {
			newColumns[path] = value;
		} else {
			delete newColumns[path];
		}

		this.setState({
			selectedColumns: newColumns,
		});
	},
	applyColumns () {
		this.props.dispatch(setActiveColumns(Object.keys(this.state.selectedColumns)));
		this.togglePopout(false);
	},
	updateSearch (e) {
		this.setState({ searchString: e.target.value });
	},
	renderColumns () {
		const availableColumns = this.props.availableColumns;
		const { searchString } = this.state;
		const filteredColumns = availableColumns;

		// if (searchString) {
		// 	filteredColumns = filteredColumns
		// 		.filter(column => column.type !== 'heading')
		// 		.filter(column => new RegExp(searchString).test(column.field.label.toLowerCase()));
		// }
		const { t, list } = this.props;

		return filteredColumns.map((el, i) => {
			var label = '';
			// once input filtering keyword then skip this logic
			if (el.type === 'heading' && !searchString) {
				label = getTranslatedLabel(t, {
					listKey: list.key,
					prefix: 'heading',
					namespace: 'form',
					content: _.camelCase(el.content),
					altContent: el.content,
				});
				return <PopoutList.Heading key={'heading_' + i}>{label}</PopoutList.Heading>;
			} else if (el.type === 'field') {
				const path = el.field.path;
				const selected = this.state.selectedColumns[path];
				label = getTranslatedLabel(t, {
					listKey: list.key,
					prefix: 'field',
					content: path,
					namespace: 'form',
					altContent: el.field.label,
				});
				const isFiltered = searchString && new RegExp(_.toLower(searchString)).test(_.toLower(label));
				// the filter keyword has not been inputted 
				if (isFiltered || !searchString) {
					return (
						<PopoutList.Item
							key={'column_' + path}
							icon={selected ? 'check' : 'dash'}
							iconHover={selected ? 'dash' : 'check'}
							isSelected={!!selected}
							label={label}
							onClick={() => { this.toggleColumn(path, !selected); }} />
					);
				}
			}
			return null;
		});
	},
	render () {
		const { t } = this.props;
		const formFieldStyles = {
			borderBottom: '1px dashed rgba(0,0,0,0.1)',
			marginBottom: '1em',
			paddingBottom: '1em',
		};
		return (
			<div>
				<ListHeaderButton
					active={this.state.isOpen}
					id="listHeaderColumnButton"
					glyph="list-unordered"
					label={t('label')}
					onClick={() => this.togglePopout(!this.state.isOpen)}
				/>
				<Popout isOpen={this.state.isOpen} onCancel={() => this.togglePopout(false)} relativeToID="listHeaderColumnButton">
					<Popout.Header title={t('label')} />
					<Popout.Body scrollable>
						<div style={formFieldStyles}>
							<FormInput
								autoFocus
								onChange={this.updateSearch}
								placeholder={t('placeholder')}
								value={this.state.searchString}
							/>
						</div>
						<PopoutList>
							{this.renderColumns()}
						</PopoutList>
					</Popout.Body>
					<Popout.Footer
						primaryButtonAction={this.applyColumns}
						primaryButtonLabel={t('apply')}
						secondaryButtonAction={() => this.togglePopout(false)}
						secondaryButtonLabel={t('cancel')} />
				</Popout>
			</div>
		);
	},
});

export default translate(['column', 'form'])(ListColumnsForm);
// module.exports = ListColumnsForm;
