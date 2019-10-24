import _ from 'lodash';
import async from 'async';
import React from 'react';
// replace all of function component before fully mirgation to v2, use this package instead of using the native
// React.createClass function
import createClass from 'create-react-class';
// import { findDOMNode } from 'react-dom';
import xhr from 'xhr';
import PropTypes from 'prop-types';
import {
	List,
	ListItem,
	ListItemText,
	IconButton,
	ListItemSecondaryAction,
	Typography,
} from '@material-ui/core';
import {
	Check as CheckIcon,
} from '@material-ui/icons';

import {
	FormField,
	FormInput,
	SegmentedControl,
} from '../../elemental';

// import PopoutList from '../../shared/Popout/PopoutList';
// import PopoutListHeading from '../../shared/Popout/PopoutListHeading';
// import PopoutListItem from '../../shared/Popout/PopoutListItem';


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
		const {
			url,
			requestHeader,
		} = this.props;
		async.map(value, (id, next) => {
			if (this._itemsCache[id]) return next(null, this._itemsCache[id]);
			xhr({
				url: url + '/' + this.props.field.refList.path + '/' + id + '?basic',
				responseType: 'json',
				headers: requestHeader,
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
			requestHeader,
		} = this.props;

		xhr({
			url: url + '/' + this.props.field.refList.path + '?basic&search=' + searchString + '&' + filters,
			responseType: 'json',
			headers: requestHeader,
		}, (err, resp, data) => {
			if (err || resp.statusCode === 403) {
				// TODO: Handle errors better
				// console.error('Error loading items:', err);
				this.setState({
					searchIsLoading: false,
				});
				// window.location.reload();
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
			});
		});
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
		// const itemIconHover = selected ? i18n.t('filter.cross') : i18n.t('filter.check');

		return items.map((item, i) => {
			return (
				<ListItem
					button divider selected={selected} dense
					key={`item-${i}-${item.id}`}
					onClick={() => {
						if (selected) this.removeItem(item);
						else this.selectItem(item);
					}}
				>
                  <ListItemText
                    primary={item.name}
                  />
                  {
                  	selected && <ListItemSecondaryAction>
	                    <IconButton edge="end" aria-label={item.name}>
	                      <CheckIcon />
	                    </IconButton>
	                  </ListItemSecondaryAction>
	              }
                </ListItem>
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
				label: i18n.t(`filter.${_.camelCase(option.label)}`),
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
				{
					selectedItems.length ? (
						<List component="nav">
							<React.Fragment>
								<Typography variant="h4">
									{i18n.t('filter.selected')}
								</Typography>
								{this.renderItems(selectedItems, true)}
							</React.Fragment>
						</List>
					) : null
				}
				{
					searchResults.length ? (
						<List component="nav">
							<React.Fragment>
								<Typography variant="h4">
									{i18n.t('filter.items')}
								</Typography>
								{this.renderItems(searchResults)}
							</React.Fragment>
						</List>
					) : null
				}
			</div>
		);
	},
});

export default RelationshipFilter;
