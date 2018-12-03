import { FormNote, FormField, FormInput } from '../../../elemental';
import React, { PropTypes } from 'react';
import vkey from 'vkey';
import { translate } from "react-i18next";

import Kbd from '../../../shared/Kbd';
import Popout from '../../../shared/Popout';
import PopoutList from '../../../shared/Popout/PopoutList';

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
		let filteredColumns = availibleColumns;

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
			const isSelected = activeSortPath && activeSortPath.path === path;
			const isInverted = isSelected && activeSortPath.invert;
			const icon = this.state.altDown || (isSelected && !isInverted) ? 'chevron-up' : 'chevron-down';

			return (
				<PopoutList.Item
					key={'column_' + el.field.path}
					icon={icon}
					isSelected={isSelected}
					label={el.field.label}
					onClick={() => {
						this.handleSortSelect(path, isSelected && !isInverted);
					}} />
			);
		});
	},
	render () {
		// TODO: Handle multiple sort paths
		const { t } = this.props;
		const activeSortPath = this.props.activeSort.paths[0];
		const formFieldStyles = { borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' };
		return (
			<span>
				{activeSortPath && (
					<span>
						<span style={{ color: '#999' }}> {t('sortBy')} </span>
						<a id="listHeaderSortButton" href="javascript:;" onClick={this.openPopout}>
							{activeSortPath.label.toLowerCase()}
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

export default translate('sort')(ListSort);
// module.exports = ListSort;
