import { FormNote, FormField, FormInput } from '../../../elemental';
import React, { PropTypes } from 'react';
import vkey from 'vkey';
import _ from 'lodash';
import { translate } from "react-i18next";

import Kbd from '../../../shared/Kbd';
import Popout from '../../../shared/Popout';
import PopoutList from '../../../shared/Popout/PopoutList';
import { getTranslatedLabel } from '../../../../utils/locale';

var ListSort = React.createClass({
	displayName: 'ListSort',
	propTypes: {
		handleSortSelect: PropTypes.func.isRequired,
	},
	getInitialState () {
		return {
			altDown: false,
			popoutIsOpen: false,
			searchString: '',
		};
	},
	componentDidMount () {
		document.body.addEventListener('keydown', this.handleKeyDown, false);
		document.body.addEventListener('keyup', this.handleKeyUp, false);
	},
	componentWillUnmount () {
		document.body.removeEventListener('keydown', this.handleKeyDown);
		document.body.removeEventListener('keyup', this.handleKeyUp);
	},
	handleKeyDown (e) {
		if (vkey[e.keyCode] !== '<alt>') return;
		this.setState({
			altDown: true,
		});
	},
	handleKeyUp (e) {
		if (vkey[e.keyCode] !== '<alt>') return;
		this.setState({
			altDown: false,
		});
	},
	handleSortSelect (path, inverted) {
		if (this.state.altDown) inverted = true;
		this.props.handleSortSelect(path, inverted);
		this.closePopout();
	},
	openPopout () {
		this.setState({
			popoutIsOpen: true,
		});
	},
	closePopout () {
		this.setState({
			popoutIsOpen: false,
			searchString: '',
		});
	},
	updateSearch (e) {
		this.setState({ searchString: e.target.value });
	},
	renderSortOptions () {
		// TODO: Handle multiple sort paths
		const activeSortPath = this.props.activeSort.paths[0];
		const availibleColumns = this.props.availableColumns;
		const { searchString } = this.state;
		const filteredColumns = availibleColumns;

		// if (searchString) {
		// 	filteredColumns = filteredColumns
		// 		.filter(column => column.type !== 'heading')
		// 		.filter(column => new RegExp(searchString).test(column.field.label.toLowerCase()));
		// }
		const { t, list } = this.props;

		return filteredColumns.map((el, i) => {
			var label = '';
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
				const isSelected = activeSortPath && activeSortPath.path === path;
				const isInverted = isSelected && activeSortPath.invert;
				const icon = this.state.altDown || (isSelected && !isInverted) ? 'chevron-up' : 'chevron-down';
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
							icon={icon}
							isSelected={isSelected}
							label={label}
							onClick={() => {
								this.handleSortSelect(path, isSelected && !isInverted);
							}}
						/>
					);
				}
			}
			return null;
		});
	},
	render () {
		// TODO: Handle multiple sort paths
		const { t, list } = this.props;
		const activeSortPath = this.props.activeSort.paths[0];
		const formFieldStyles = { borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' };
		return (
			<span>
				{activeSortPath && (
					<span>
						<span style={{ color: '#999' }}> {t('sortBy')} </span>
						<a id="listHeaderSortButton" href="javascript:;" onClick={this.openPopout}>
							{
								getTranslatedLabel(t, {
									listKey: list.key,
									prefix: 'field',
									namespace: 'form',
									content: activeSortPath.path,
									altContent: activeSortPath.label.toLowerCase(),
								})
							}
							{activeSortPath.invert ? ` ${t('decendingOrder')}` : ''}
							<span className="disclosure-arrow" />
						</a>
					</span>
				)}
				<Popout isOpen={this.state.popoutIsOpen} onCancel={this.closePopout} relativeToID="listHeaderSortButton">
					<Popout.Header title={t('label')} />

					<Popout.Body scrollable>
						<FormField style={formFieldStyles}>
							<FormInput
								autoFocus
								value={this.state.searchString}
								onChange={this.updateSearch}
								placeholder={t('placeholder')}
							/>
						</FormField>
						<PopoutList>
							{this.renderSortOptions()}
						</PopoutList>
					</Popout.Body>

					<Popout.Footer>
						<FormNote>{t('hold')} <Kbd>{t('alt')}</Kbd> {t('msg')}</FormNote>
					</Popout.Footer>
				</Popout>
			</span>
		);
	},
});

export default translate(['sort', 'form'])(ListSort);
// module.exports = ListSort;
