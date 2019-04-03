import async from 'async';
import Field from '../Field';
import { listsByKey } from '../../../admin/client/utils/lists';
import React from 'react';
import Select, { components } from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import xhr from 'xhr';
import {
	Button,
	FormInput,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../../admin/client/App/elemental';
import _ from 'lodash';

function compareValues (current=[], next=[]) {
	const currentValue = !Array.isArray(current) ? current.split(',') : current;
	const nextValue = !Array.isArray(next) ? next.split(',') : next;
	const currentLength = currentValue ? currentValue.length : 0;
	const nextLength = nextValue ? nextValue.length : 0;
	if (currentLength !== nextLength) return false;
	for (let i = 0; i < currentLength; i++) {
		if (currentValue[i] !== nextValue[i]) return false;
	}
	return true;
}

const optionsStyle = {
	maxWidth: '200px',
	maxHeight: '100px',
	height: 'auto'
};

module.exports = Field.create({

	displayName: 'RelationshipField',
	statics: {
		type: 'Relationship',
	},

	getInitialState () {
		return {
			value: null,
			createIsOpen: false,
			isLoading: false,
		};
	},

	componentDidMount () {
		this._itemsCache = {};
		// this.loadValue(this.props.value);
	},

	componentWillReceiveProps (nextProps) {
		if (nextProps.value === this.props.value || nextProps.many && compareValues(this.props.value, nextProps.value)) return;
		// console.log('> ', nextProps.value);
		// this.loadValue(nextProps.value);
	},

	shouldCollapse () {
		if (this.props.many) {
			// many:true relationships have an Array for a value
			return this.props.collapse && !this.props.value.length;
		}
		return this.props.collapse && !this.props.value;
	},

	buildFilters () {
		var filters = {};

		_.forEach(this.props.filters, (value, key) => {
			if (typeof value === 'string' && value[0] === ':') {
				var fieldName = value.slice(1);

				var val = this.props.values[fieldName];
				if (val) {
					filters[key] = val;
					return;
				}

				// check if filtering by id and item was already saved
				if (fieldName === '_id' && Keystone.item) {
					filters[key] = Keystone.item.id;
					return;
				}
			} else {
				filters[key] = value;
			}
		}, this);

		var parts = [];

		_.forEach(filters, function (val, key) {
			parts.push('filters[' + key + '][value]=' + encodeURIComponent(val));
		});

		return parts.join('&');
	},

	cacheItem (item) {
		if (item && item.id) {
			item.href = Keystone.adminPath + '/' + this.props.refList.path + '/' + (item.id || item.value);
			this._itemsCache[(item.id || item.value)] = item;
		}
	},

	// loadValue (values) {
	// 	if (!values) {
	// 		return this.setState({
	// 			loading: false,
	// 			value: null,
	// 		});
	// 	};
	// 	// console.log('> 1', this._itemsCache, this.state.value);
	// 	values = Array.isArray(values) ? values : values.split(',');
	// 	const cachedValues = values.map(i => this._itemsCache[i]).filter(i => i);
	// 	if (cachedValues.length === values.length) {
	// 		this.setState({
	// 			loading: false,
	// 			value: this.props.many ? cachedValues : cachedValues[0],
	// 		});
	// 		return;
	// 	}
	// 	this.setState({
	// 		loading: true,
	// 		// value: null,
	// 	});
	// 	async.map(values, (value, done) => {
	// 		xhr({
	// 			url: Keystone.adminPath + '/api/' + this.props.refList.path + '/' + value + `?ts=${Math.random()}&basic&alangd=${this.props.currentLang}`,
	// 			responseType: 'json',
	// 		}, (err, resp, data) => {
	// 			if (err || !data) return done(err);
	// 			this.cacheItem(data);
	// 			done(err, data);
	// 		});
	// 	}, (err, expanded) => {
	// 		if (!this.isMounted()) return;
	// 		//handle unexpected JSON string not parsed
	// 		expanded = typeof expanded === 'string' ? JSON.parse(expanded) : expanded;
	// 		// this.setState({
	// 		// 	loading: false,
	// 		// 	value: this.props.many ? expanded : expanded[0],
	// 		// });
	// 	});
	// },

	// NOTE: this seems like the wrong way to add options to the Select
	loadOptionsCallback: {},
	afterLoadOptions(results, callback) {
		const { display, many, mode, noedit } = this.props;
		let { value } = this.props;
		const selections = _.map(results, ({ id, name, fields }) => {
			let label = name;
			if (!!display && fields && fields[display]) {
				label = fields[display].url;
			}
			return {
				label,
				value: id,
				name,
				image: display === 'image',
				isDisabled: mode === 'edit' && noedit
			}
		});
		if (value) {
			if (!Array.isArray(value)) {
				value = value.split(',');
			}
		} else {
			value = '';
		}
		// console.log('> split: ', value);
		value = _.map(value, v => ({ value: String(v) }));
		value = _.intersectionBy(selections, value, 'value');
		// console.log(selections);
		if (!many && value.length) {
			value = value[0];
		}
		this.setState({
			loading: false,
			value,
		}, () => callback(selections));
		// console.log(selections, callback);

		// callback(selections);
	},
	loadOptions (input, callback) {
		const { many } = this.props;
		// console.log(this.props.display);
		// NOTE: this seems like the wrong way to add options to the Select
		this.loadOptionsCallback = callback;
		const filters = this.buildFilters();
		this.setState({
			loading: true,
		});
		xhr({
			url: Keystone.adminPath + '/api/' + this.props.refList.path + `?ts=${Math.random()}&basic&search=` + input + '&' + filters,
			responseType: 'json',
		}, (err, resp, data) => {
			if (err) {
				console.error('Error loading items:', err);
				return callback(null, []);
			}
			//handle unexpected JSON string not parsed
			data = typeof data === 'string' ? JSON.parse(data) : data;
			const results = data.results || [];
			this.afterLoadOptions(results, callback);
			// callback(
			// 	_.map(results, ({ id, name, fields }) => {
			// 		let label = name;
			// 		if (!!display && fields && fields[displayField]) {
			// 			label = fields[displayField].url;
			// 		}
			// 		return {
			// 			label,
			// 			value: id,
			// 		}
			// 	})
			// );
			// data.results.forEach(this.cacheItem);
			// callback(null, {
			// 	options: data.results,
			// 	complete: data.results.length === data.count,
			// });
		});
	},

	valueChanged (item) {
		let value = null;
		if (this.props.many) {
			if (item) {
				value = _.map(item, i => i.value).join(',');
			}
		} else if (item) {
			value = item.value
		}
		this.props.onChange({
			path: this.props.path,
			value,
		});

		this.setState({
			value: item,
		});
		
	},

	openCreate () {
		this.setState({
			createIsOpen: true,
		});
	},

	closeCreate () {
		this.setState({
			createIsOpen: false,
		});
	},

	onCreate (item) {
		this.cacheItem(item);
		if (Array.isArray(this.state.value)) {
			// For many relationships, append the new item to the end
			const values = this.state.value.map((item) => item.id);
			values.push(item.id);
			this.valueChanged(values.join(','));
		} else {
			this.valueChanged(item.label);
		}

		// NOTE: this seems like the wrong way to add options to the Select
		this.loadOptionsCallback(null, {
			complete: true,
			options: Object.keys(this._itemsCache).map((k) => this._itemsCache[k]),
		});
		this.closeCreate();
	},
	customizedOptions(props) {
		const { data: { label, value, name, image } } = props;
		const { mode, noedit, t } = this.props;
		if (mode === 'edit' && noedit) return null;
		return (
			<components.Option {...props}>
				{
					image ? <div>
						<img src={label} alt={label} style={{
							...optionsStyle,
						}} />
					</div> : label
				}
			</components.Option>
		);
	},
	customizedSelections(props) {
		const { data: { label, value, image } } = props;
		const url = `${Keystone.adminPath}/${this.props.refList.path}/${value}`;
		return (
			<components.MultiValueLabel {...props}>
				<a href={url} target="_blank">
				{
					image ? 
					<img src={label} alt={label} style={{
						...optionsStyle,
					}} />
					: label
				}
				</a>
			</components.MultiValueLabel>
		);
	},
	customizedRemove(props) {
		const { mode, noedit, image } = this.props;
		// console.log(this.props.refList.path, this.props.item);
		if (mode === 'edit' && noedit) return null;
		return (
			<components.MultiValueRemove {...props}>
				x
			</components.MultiValueRemove>
		);
	},
	customizedDropdownIndicator(props) {
		const { mode, noedit, t, image } = this.props;
		// console.log(this.props.refList.path, this.props.item);
		if (mode === 'edit' && noedit) return null;
		return (
			<components.DropdownIndicator {...props}>
				{t('dropdown')}
			</components.DropdownIndicator>
		);
	},
	renderSelect (noedit, isMulti) {
		const { t, refList, many, value, mode, display, noedit: disabled } = this.props;
		// let value =  
		// console.log(this.state.value);
		return (
			<div>
				{/* This input element fools Safari's autocorrect in certain situations that completely break react-select */}
				<input type="text" style={{ position: 'absolute', width: 1, height: 1, zIndex: -1, opacity: 0 }} tabIndex="-1"/>
				<AsyncSelect
					isMulti={many}
					isClearable={!noedit}
					isSearchable={!noedit}
					openMenuOnFocus={false}
					openMenuOnClick={false}
					loadOptions={this.loadOptions}
					defaultOptions={true}
					placeholder={ !noedit ? t('selectWithListname', { listName: t(`table_${refList.key}`) }) : '---'}
					name={this.getInputName(this.props.path)}
					onChange={this.valueChanged}
					isLoading={this.state.isLoading}
					styles={{
						option: base => ({
							...base,
							border: `1px disabled #ccc`,
							height: '100%',
						}),
						indicatorSeparator: base => ({
						    ...base,
						    visibility: (noedit ? 'hidden' : 'visibility'),
						}),
						container: base => {
							let style = { ...base };
							if (noedit) {
								style = {
									...style,
									outline: 'none',
									backgroundColor: '#e6e6e6',
								};
							}
							return style;
						},
						indicatorsContainer: base => {
							let style = { ...base };
							if (noedit) {
								style = {
									...style,
									outline: 'none',
									backgroundColor: '#e6e6e6',
								};
							}
							return style;
						},
						valueContainer: base => ({
						    ...base,
						    zIndex: 9999,
						}),
					}}
					components={{
						Option: this.customizedOptions,
						MultiValueLabel: this.customizedSelections,
						MultiValueRemove: this.customizedRemove,
						DropdownIndicator: this.customizedDropdownIndicator,
					}}
					value={this.state.value}
				/>
			</div>
		);
	},

	renderInputGroup () {
		// TODO: find better solution
		//   when importing the CreateForm using: import CreateForm from '../../../admin/client/App/shared/CreateForm';
		//   CreateForm was imported as a blank object. This stack overflow post suggested lazilly requiring it:
		// http://stackoverflow.com/questions/29807664/cyclic-dependency-returns-empty-object-in-react-native
		// TODO: Implement this somewhere higher in the app, it breaks the encapsulation of the RelationshipField component
		const CreateForm = require('../../../admin/client/App/shared/CreateForm');
		return (
			<Group block>
				<Section grow>
					{this.renderSelect()}
				</Section>
				<Section>
					<Button onClick={this.openCreate}>+</Button>
				</Section>
				<CreateForm
					list={listsByKey[this.props.refList.key]}
					isOpen={this.state.createIsOpen}
					onCreate={this.onCreate}
					onCancel={this.closeCreate} />
			</Group>
		);
	},

	renderValue () {
		// const { many } = this.props;
		const { value } = this.state;
		// console.log(this.state.value);
		const props = {
			children: value ? value.name : null,
			component: value ? 'a' : 'span',
			href: value ? value.href : null,
			noedit: true,
		};
		return this.renderSelect(true);
		// return many ? this.renderSelect(true) : <FormInput {...props} />;
	},

	renderField () {
		if (this.props.createInline) {
			return this.renderInputGroup();
		} else {
			return this.renderSelect(false);
		}
	},

});
