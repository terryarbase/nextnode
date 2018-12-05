import React from 'react';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import Transition
	from 'react-addons-css-transition-group';
import classnames from 'classnames';
import ListFiltersAddForm from './ListFiltersAddForm';
import Popout from '../../../../shared/Popout';
import PopoutList from '../../../../shared/Popout/PopoutList';
import { FormInput } from '../../../../elemental';
import ListHeaderButton from '../ListHeaderButton';
import { translate } from "react-i18next";

import { setFilter } from '../../actions';
import { getTranslatedLabel } from '../../../../../utils/locale';

var ListFiltersAdd = React.createClass({
	displayName: 'ListFiltersAdd',
	propTypes: {
		maxHeight: React.PropTypes.number,
	},
	getDefaultProps () {
		return {
			maxHeight: 360,
		};
	},
	getInitialState () {
		return {
			innerHeight: 0,
			isOpen: false,
			searchString: '',
			selectedField: false,
		};
	},
	updateSearch (e) {
		this.setState({ searchString: e.target.value });
	},
	openPopout () {
		this.setState({ isOpen: true }, this.focusSearch);
	},
	closePopout () {
		this.setState({
			innerHeight: 0,
			isOpen: false,
			searchString: '',
			selectedField: false,
		});
	},
	setPopoutHeight (height) {
		this.setState({ innerHeight: Math.min(this.props.maxHeight, height) });
	},
	navigateBack () {
		this.setState({
			selectedField: false,
			searchString: '',
			innerHeight: 0,
		}, this.focusSearch);
	},
	focusSearch () {
		findDOMNode(this.refs.search).focus();
	},
	selectField (field) {
		this.setState({
			selectedField: field,
		});
	},
	applyFilter (value) {
		this.props.dispatch(setFilter(this.state.selectedField.path, value, this.props.currentLang));
		this.closePopout();
	},
	renderList () {
		const activeFilterFields = this.props.activeFilters.map(obj => obj.field);
		const activeFilterPaths = activeFilterFields.map(obj => obj.path);
		const { searchString } = this.state;
		const { t, list } = this.props;
		const filteredFilters = this.props.availableFilters;

		// if (searchString) {
		// 	filteredFilters = filteredFilters
		// 		.filter(filter => filter.type !== 'heading')
		// 		.filter(filter => new RegExp(searchString)
		// 		.test(filter.field.label.toLowerCase()));
		// }

		const popoutList = filteredFilters.map((el, i) => {
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
				return (
					<PopoutList.Heading key={'heading_' + i}>
						{label}
					</PopoutList.Heading>
				);
			} else if (el.type === 'field') {
				const path = el.field.path;
				const filterIsActive = activeFilterPaths.length && (activeFilterPaths.indexOf(path) > -1);
				label = getTranslatedLabel(t, {
					listKey: list.key,
					prefix: 'field',
					content: path,
					namespace: 'form',
					altContent: el.field.label,
				});
				const isFiltered = searchString && new RegExp(_.toLower(searchString)).test(_.toLower(label));
				if (isFiltered || !searchString) {
					return (
						<PopoutList.Item
							key={'item_' + path}
							icon={filterIsActive ? 'check' : 'chevron-right'}
							iconHover={filterIsActive ? 'check' : 'chevron-right'}
							isSelected={!!filterIsActive}
							label={label}
							onClick={() => { this.selectField(el.field); }} />
					);
				}
			}
			return null;
		});

		const formFieldStyles = {
			borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
			marginBottom: '1em',
			paddingBottom: '1em',
		};

		return (
			<Popout.Pane onLayout={this.setPopoutHeight} key="list">
				<Popout.Body>
					<div style={formFieldStyles}>
						<FormInput
							onChange={this.updateSearch}
							placeholder={t('placeholder')}
							ref="search"
							value={this.state.searchString}
						/>
					</div>
					{popoutList}
				</Popout.Body>
			</Popout.Pane>
		);
	},
	renderForm () {
		const { t, list, currentUILang } = this.props;
		const localePacks = currentUILang && Keystone.localization && Keystone.localization[currentUILang];
		return (
			<Popout.Pane onLayout={this.setPopoutHeight} key="form">
				<ListFiltersAddForm
					activeFilters={this.props.activeFilters}
					field={this.state.selectedField}
					onApply={this.applyFilter}
					onCancel={this.closePopout}
					onBack={this.navigateBack}
					currentUILang={this.props.currentUILang}
					maxHeight={this.props.maxHeight}
					onHeightChange={this.setPopoutHeight}
					dispatch={this.props.dispatch}
					apply={t('apply')}
					localePacks={localePacks}
					cancel={t('cancel')}
					t={t}
					getTranslatedLabel={getTranslatedLabel}
					list={list}
				/>
			</Popout.Pane>
		);
	},
	render () {
		const { t, list } = this.props;
		const { isOpen, selectedField } = this.state;
		const popoutBodyStyle = this.state.innerHeight
			? { height: this.state.innerHeight }
			: null;
		const popoutPanesClassname = classnames('Popout__panes', {
			'Popout__scrollable-area': !selectedField,
		});

		return (
			<div>
				<ListHeaderButton
					active={isOpen}
					glyph="eye"
					id="listHeaderFilterButton"
					label={t('label')}
					onClick={isOpen ? this.closePopout : this.openPopout}
				/>
				<Popout isOpen={isOpen} onCancel={this.closePopout} relativeToID="listHeaderFilterButton">
					<Popout.Header
						leftAction={selectedField ? this.navigateBack : null}
						leftIcon={selectedField ? 'chevron-left' : null}
						title={
							selectedField ? 
							getTranslatedLabel(t, {
								listKey: list.key,
								prefix: 'field',
								namespace: 'form',
								content: selectedField.path
							}):
							t('label')
						}
						transitionDirection={selectedField ? 'next' : 'prev'} />
					<Transition
						className={popoutPanesClassname}
						component="div"
						style={popoutBodyStyle}
						transitionName={selectedField ? 'Popout__pane-next' : 'Popout__pane-prev'}
						transitionEnterTimeout={360}
						transitionLeaveTimeout={360}
						>
						{selectedField ? this.renderForm() : this.renderList()}
					</Transition>
				</Popout>
			</div>
		);
	},
});

export default translate(['filter', 'form', 'sort'])(ListFiltersAdd);
// module.exports = ListFiltersAdd;
