import _ from 'lodash';
import async from 'async';
import React from 'react';
import { findDOMNode } from 'react-dom';
import xhr from 'xhr';

import {
	FormField,
	FormInput,
	SegmentedControl,
} from '../../../admin/client/App/elemental';

import PopoutList from '../../../admin/client/App/shared/Popout/PopoutList';

const INVERTED_OPTIONS = [
	{ label: 'Linked To', value: false },
	{ label: 'NOT Linked To', value: true },
];

function getDefaultValue () {
	return {
		inverted: INVERTED_OPTIONS[0].value,
		value: [],
	};
}

var RelationshipFilter = React.createClass({
	propTypes: {
		field: React.PropTypes.object,
		filter: React.PropTypes.shape({
			inverted: React.PropTypes.bool,
			value: React.PropTypes.array,
		}),
		onHeightChange: React.PropTypes.func,
	},
	statics: {
		getDefaultValue: getDefaultValue,
	},
	getDefaultProps () {
		return {
			filter: getDefaultValue(),
		};
	},
	getInitialState () {
		return {
			searchIsLoading: false,
			searchResults: [],
			searchString: '',
			selectedItems: [],
			valueIsLoading: true,
		};
	},
	componentDidMount () {
		this._itemsCache = {};
		this.loadSearchResults(true);
	},
	componentWillReceiveProps (nextProps) {
		if (nextProps.filter.value !== this.props.filter.value) {
			this.populateValue(nextProps.filter.value);
		}
	},
	isLoading () {
		return this.state.searchIsLoading || this.state.valueIsLoading;
	},
	populateValue (value) {
		async.map(value, (id, next) => {
			if (this._itemsCache[id]) return next(null, this._itemsCache[id]);
			xhr({
				url: Keystone.adminPath + '/api/' + this.props.field.refList.path + '/' + id + '?basic',
				responseType: 'json',
			}, (err, resp, data) => {
				if (err || !data) return next(err);
				this.cacheItem(data);
				next(err, data);
			});
		}, (err, items) => {
			if (err) {
				// TODO: Handle errors better
				console.error('Error loading items:', err);
			}
			//handle unexpected JSON string not parsed
			items = typeof items === 'string' ? JSON.parse(items) : items;
			this.setState({
				valueIsLoading: false,
				selectedItems: items || [],
			}, () => {
				findDOMNode(this.refs.focusTarget).focus();
			});
		});
	},
	cacheItem (item) {
		this._itemsCache[item.id] = item;
	},
	buildFilters () {
		// var filters = {};
		// const operators = ['$gt', '$lt', '$lte', '$gte', '$ne', '$eq'];
		var parts = [];
		_.forEach(this.props.field.filters, function (value, key) {
			if (value[0] === ':') return;
			// if (typeof value === 'object') {
			// 	if (operators.includes(value)) {

			// 	}
			// }
			// filters[key] = value;
			parts.push('filters[' + key + '][value]=' + encodeURIComponent(value));
		}, this);
		// var parts = [];
		// _.forEach(filters, function (val, key) {
		// 	parts.push('filters[' + key + '][value]=' + encodeURIComponent(val));
		// });

		return parts.join('&');
	},
	loadSearchResults (thenPopulateValue) {
		const searchString = this.state.searchString;
		const filters = this.buildFilters();
		xhr({
			url: Keystone.adminPath + '/api/' + this.props.field.refList.path + '?basic&search=' + searchString + '&' + filters,
			responseType: 'json',
		}, (err, resp, data) => {
			if (err) {
				// TODO: Handle errors better
				console.error('Error loading items:', err);
				this.setState({
					searchIsLoading: false,
				});
				return;
			}
			//handle unexpected JSON string not parsed
			data = typeof data === 'string' ? JSON.parse(data) : data;
			data.results.forEach(this.cacheItem);
			if (thenPopulateValue) {
				this.populateValue(this.props.filter.value);
			}
			if (searchString !== this.state.searchString) return;
			this.setState({
				searchIsLoading: false,
				searchResults: data.results,
			}, this.updateHeight);
		});
	},
	updateHeight () {
		if (this.props.onHeightChange) {
			this.props.onHeightChange(this.refs.container.offsetHeight);
		}
	},
	toggleInverted (inverted) {
		this.updateFilter({ inverted });
	},
	updateSearch (e) {
		this.setState({ searchString: e.target.value }, this.loadSearchResults);
	},
	selectItem (item) {
		const value = this.props.filter.value.concat(item.id);
		this.updateFilter({ value });
	},
	removeItem (item) {
		const value = this.props.filter.value.filter(i => { return i !== item.id; });
		this.updateFilter({ value });
	},
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},
	renderItems (items, selected) {
		const { t } = this.props;
		const itemIconHover = selected ? t('cross') : t('check');

		return items.map((item, i) => {
			return (
				<PopoutList.Item
					key={`item-${i}-${item.id}`}
					icon="dash"
					iconHover={itemIconHover}
					label={item.name}
					onClick={() => {
						if (selected) this.removeItem(item);
						else this.selectItem(item);
					}}
				/>
			);
		});
	},
	render () {
		const{ t, list } = this.props;
		const  selectedItems = this.state.selectedItems;
		const searchResults = this.state.searchResults.filter(i => {
			return this.props.filter.value.indexOf(i.id) === -1;
		});
		const invertedOptions = _.map(INVERTED_OPTIONS, option => (
			{
				...option,
				...{
					label: t(_.camelCase(option.label))
				},
			}
		));
		const placeholder = this.isLoading() ? `${t('loading')}...` : `${t('finding', { listName: t(`form:table_${list.key}`) })}...`;
		return (
			<div ref="container">
				<FormField>
					<SegmentedControl equalWidthSegments options={invertedOptions} value={this.props.filter.inverted} onChange={this.toggleInverted} />
				</FormField>
				<FormField style={{ borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' }}>
					<FormInput autoFocus ref="focusTarget" value={this.state.searchString} onChange={this.updateSearch} placeholder={placeholder} />
				</FormField>
				{selectedItems.length ? (
					<PopoutList>
						<PopoutList.Heading>{t('selected')}</PopoutList.Heading>
						{this.renderItems(selectedItems, true)}
					</PopoutList>
				) : null}
				{searchResults.length ? (
					<PopoutList>
						<PopoutList.Heading style={selectedItems.length ? { marginTop: '2em' } : null}>
							{t('items')}
						</PopoutList.Heading>
						{this.renderItems(searchResults)}
					</PopoutList>
				) : null}
			</div>
		);
	},
});

module.exports = RelationshipFilter;
