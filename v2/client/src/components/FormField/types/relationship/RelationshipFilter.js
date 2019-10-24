import _ from 'lodash';
import async from 'async';
import React from 'react';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
import { findDOMNode } from 'react-dom';
import xhr from 'xhr';
import PropTypes from 'prop-types';

import {
	FormField,
	FormInput,
	SegmentedControl,
} from '../../elemental';

import PopoutList from '../../shared/Popout/PopoutList';

// locales
import i18n from '../../../../i18n';

// utils
import {
	translateListName,
} from '../../../../utils/multilingual';

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

var RelationshipFilter = createClass({
	propTypes: {
		field: PropTypes.object,
		filter: PropTypes.shape({
			inverted: PropTypes.bool,
			value: PropTypes.array,
		}),
		onHeightChange: PropTypes.func,
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
			const {
				url,
			} = this.props;
			xhr({
				url: url + this.props.field.refList.path + '/' + id + '?basic',
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
		const {
			url,
		} = this.props;
		xhr({
			url: url + this.props.field.refList.path + '?basic&search=' + searchString + '&' + filters,
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
		const itemIconHover = selected ? i18n.t('filter.cross') : i18n.t('filter.check');

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
		const{ listName } = this.props;
		const  selectedItems = this.state.selectedItems;
		const searchResults = this.state.searchResults.filter(i => {
			return this.props.filter.value.indexOf(i.id) === -1;
		});
		const invertedOptions = _.map(INVERTED_OPTIONS, option => (
			{
				...option,
				label: i18n.t(`filter${_.camelCase(option.label)}`),
			}
		));
		const placeholder = this.isLoading() ? `${i18n.t('filter.loading')}...` : `${i18n.t('filter.finding', { listName: translateListName(listName) })}...`;
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
						<PopoutList.Heading>{i18n.t('filter.selected')}</PopoutList.Heading>
						{this.renderItems(selectedItems, true)}
					</PopoutList>
				) : null}
				{searchResults.length ? (
					<PopoutList>
						<PopoutList.Heading style={selectedItems.length ? { marginTop: '2em' } : null}>
							{i18n.t('filter.items')}
						</PopoutList.Heading>
						{this.renderItems(searchResults)}
					</PopoutList>
				) : null}
			</div>
		);
	},
});

export default RelationshipFilter;
