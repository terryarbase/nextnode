import React from 'react';
import assign from 'object-assign';
import { translate } from "react-i18next";

import Popout from '../../../shared/Popout';
import PopoutList from '../../../shared/Popout/PopoutList';
import { FormInput } from '../../../elemental';
import ListHeaderButton from './ListHeaderButton';

import { setActiveColumns } from '../actions';

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
		let filteredColumns = availableColumns;

		if (searchString) {
			filteredColumns = filteredColumns
				.filter(column => column.type !== 'heading')
				.filter(column => new RegExp(searchString).test(column.field.label.toLowerCase()));
		}

		return filteredColumns.map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.content}</PopoutList.Heading>;
			}

			const path = el.field.path;
			const selected = this.state.selectedColumns[path];

			return (
				<PopoutList.Item
					key={'column_' + el.field.path}
					icon={selected ? 'check' : 'dash'}
					iconHover={selected ? 'dash' : 'check'}
					isSelected={!!selected}
					label={el.field.label}
					onClick={() => { this.toggleColumn(path, !selected); }} />
			);
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

export default translate('column')(ListColumnsForm);
// module.exports = ListColumnsForm;
