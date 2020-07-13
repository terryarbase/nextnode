// import async from 'async';
// import { Redirect } from 'react-router-dom';
import Field from '../Field';
import { makeStyles } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
// import { listsByKey } from './../../../../utils/v1/lists';
import React from 'react';

import {
	Button,
	Card,
	CardActions,
	// CardActionArea,
	CardMedia,
	CardContent,
	Typography,
	IconButton,
} from '@material-ui/core';
import { components } from 'react-select';
import {
	ExpandMore as ExpandMoreIcon,
	Close as CloseIcon,
} from '@material-ui/icons';
import AsyncSelect from 'react-select/async';
import xhr from 'xhr';
import {
	// Button,
	// FormInput,
	// InlineGroup as Group,
	// InlineGroupSection as Section,
} from '../../elemental';
import _ from 'lodash';

// locales
import i18n from '../../../../i18n';

// utils
import {
	translateListName,
} from '../../../../utils/multilingual';

const compareValues = (current=[], next=[]) => {
	const currentValue = current && !Array.isArray(current) ? current.split(',') : current;
	const nextValue = next && !Array.isArray(next) ? next.split(',') : next;
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

const useStyles = makeStyles({
	root: {
		marginRight: '10px',
	},
  media: {
    height: 140,
  },
  title: {
  	textAlign: 'center',
  },
  link: {
  	textDecoration: 'none',
  	color: blueGrey[600],
  	textAlign: 'center',
  	margin: '0 auto',
  }
});

const SelectedCard = ({ image, label, url }) => {
  	const classes = useStyles();
  	const ImageBlock = !!image && (
  		<CardMedia
          className={classes.media}
          image={label}
          title={label}
        />
   	);
	return (
		<Card className={classes.root}>
	    {
	    	!!image ? <CardMedia
	          className={classes.media}
	          image={label}
	          title={label}
	        /> : <CardContent>
				<Typography className={classes.title} variant="body2" color="textSecondary" component="p">
					{label}
				</Typography>
			</CardContent>
		}
		  <CardActions>
			  	<a href={url} target="_blank" className={classes.link}>
			     	{i18n.t('list.view')}
			    </a>
		  </CardActions>
		</Card>
	);
}

export default Field.create({

	displayName: 'RelationshipField',
	statics: {
		type: 'Relationship',
	},

	getInitialState () {
		return {
			value: null,
			options: [],
			createIsOpen: false,
			isLoading: false,
		};
	},

	componentDidMount () {
		this._itemsCache = {};
		// this.loadValue(this.props.value);
	},

	componentWillReceiveProps (nextProps) {
	
		if ((nextProps.value !== this.props.value || 
			nextProps.many) && !compareValues(this.props.value, nextProps.value)) {
			this.afterLoadOptions(this.state.options, nextProps.value);
		}
		
		if (!_.isEqual(this.props.filters, nextProps.filters)) {
			this.loadOptions('', this.loadOptionsCallback, nextProps);
		}

		// console.log('> nextprops: ', nextProps.filters);
		
		// this.afterLoadOptions(this.state.options, nextProps.value);
	},

	shouldCollapse () {
		if (this.props.many) {
			// many:true relationships have an Array for a value
			return this.props.collapse && !this.props.value.length;
		}
		return this.props.collapse && !this.props.value;
	},

	buildFilters (props) {
		const newProps = props || this.props;
		var filters = {};
		_.forEach(newProps.filters, (value, key) => {
			if (typeof value === 'string' && value[0] === ':') {
				var fieldName = value.slice(1);

				var val = this.props.values[fieldName];
				if (val) {
					filters[key] = val;
					return;
				}

				// check if filtering by id and item was already saved
				if (fieldName === '_id' && newProps.id) {
					filters[key] = newProps.id;
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
			const {
				url,
			} = this.props;
			item.href = url + 'session/content/' + this.props.refList.path + '/' + (item.id || item.value);
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
		// const {
		// 	requestHeader,
		// } = this.props;
	// 	async.map(values, (value, done) => {
	// 		xhr({
	// 			url: Keystone.adminPath + '/api/' + this.props.refList.path + '/' + value + `?ts=${Math.random()}&basic&alangd=${this.props.currentLang}`,
	// 			responseType: 'json',
	//			headers: requestHeader,
	// 		}, (err, resp, data) => {
	// 			if (err || !data) return done(err);
	// 			// this.cacheItem(data);
	// 			done(err, data);
	// 		});
	// 	}, (err, expanded) => {
	// 		if (!this.isMounted()) return;

	// 		//handle unexpected JSON string not parsed
	// 		expanded = typeof expanded === 'string' ? JSON.parse(expanded) : expanded;
	// 		const results = expanded.results || [];
	// 		console.log(results);
	// 		// this.afterLoadOptions(results);
	// 		// this.setState({
	// 		// 	loading: false,
	// 		// 	value: this.props.many ? expanded : expanded[0],
	// 		// });
	// 	});
	// },

	// NOTE: this seems like the wrong way to add options to the Select
	loadOptionsCallback: {},
	afterLoadOptions(results, selected, callback) {
		const { display, many, mode, noedit } = this.props;
		// let { value } = this.props;
		let value = selected;
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
		// console.log('>>>>> value: ', selections, value);
		value = _.intersectionBy(selections, value, 'value');
		// console.log('>>>>> value: ', value);
		// console.log(results, selected, value);
		if (!many && value.length) {
			value = value[0];
		}

		this.setState({
			loading: false,
			value,
			options: results,
		}, () => callback ? callback(selections) : null);
		// console.log(selections, callback);

		// callback(selections);
	},
	loadOptions (input, callback, props) {
		const { value, url, requestHeader } = this.props;
		// console.log(this.props.display);
		// NOTE: this seems like the wrong way to add options to the Select
		this.loadOptionsCallback = callback;
		const filters = this.buildFilters(props);
		this.setState({
			loading: true,
		});
		xhr({
			url: url + 'session/content/' + this.props.refList.path + `?ts=${Math.random()}&basic&search=` + input + '&' + filters,
			responseType: 'json',
			headers: requestHeader,
		}, (err, resp, data) => {
			if (err) {
				console.error('Error loading items:', err);
				return callback(null, []);
			}
			//handle unexpected JSON string not parsed
			data = typeof data === 'string' ? JSON.parse(data) : data;
			const results = data.results || [];
			this.afterLoadOptions(results, value, callback);
		});
	},

	valueChanged (item) {
		let value = null;
        let label = [];
        if (this.props.many) {
                if (item) {
                        value = _.map(item, i => i.value).join(',');
                        label = _.map(item, i => i.name);
                }
        } else if (item) {
                value = item.value;
                label = [ item.name ];
        }
        this.props.onChange({
            path: this.props.path,
            value,
            label,
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
	// onSelectedClick({ data }) {
	// 	console.log(data);
	// },
	customizedOptions(props) {
		const { data: { label, image } } = props;
		const { mode, noedit } = this.props;
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
		const { listPath, refList } = this.props;
		const target = `${listPath}/${refList.path}/${value}`;
		return (
			<components.MultiValueLabel {...props}>
				<SelectedCard
					label={label}
					image={image}
					url={target}
				/>
			</components.MultiValueLabel>
		);
	},
	customizedRemove(props) {
		const { mode, noedit } = this.props;
		// console.log(this.props.refList.path, this.props.item);
		if (mode === 'edit' && noedit) return null;
		return (
			<components.MultiValueRemove {...props}>
	          <CloseIcon />
			</components.MultiValueRemove>
		);
	},
	customizedDropdownIndicator(props) {
		const { mode, noedit } = this.props;
		// console.log(this.props.refList.path, this.props.item);
		if (mode === 'edit' && noedit) return null;
		return (
			<components.DropdownIndicator {...props}>
				<ExpandMoreIcon />
			</components.DropdownIndicator>
		);
	},
	renderSelect (noedit, isMulti) {
		const { refList, many } = this.props;
		// let value =  
		return (
			<div>
				{/* This input element fools Safari's autocorrect in certain situations that completely break react-select */}
				<input type="text" style={{ position: 'absolute', width: 1, height: 1, zIndex: -1, opacity: 0 }} tabIndex="-1"/>
				<AsyncSelect
					isMulti={many}
					isClearable={!noedit}
					isSearchable={!noedit}
					openMenuOnFocus={false}
					loadOptions={this.loadOptions}
					defaultOptions={true}
					placeholder={ !noedit ? i18n.t('list.selectWithListname', {
						listName: translateListName(refList.key)
					}) : '---' }
					name={this.getInputName(this.props.path)}
					onChange={this.valueChanged}
					openMenuOnClick={false}
					isLoading={this.state.isLoading}
					styles={{
						option: (base, { isDisabled, isFocused, isSelected }) => ({
							...base,
							fontSize: '1rem',
							backgroundColor: isDisabled ? null : (
								isSelected || isFocused ? '#f5f5f5' : null
							),
							color: 'hsl(0,0%,20%)',
							fontWeight: isSelected ? 'bold' : 'normal',

						}),
						indicatorSeparator: base => ({
						    ...base,
						    visibility: (noedit ? 'hidden' : 'visibility'),
						}),
						multiValue: base => ({
							...base,
							fontSize: '1rem',
							backgroundColor: 'transparent',
							// cursor: 'default',
							// ':hover': {
							// 	backgroundColor: 'transparent',
							// },
						}),
						// multiValueLabel: base => ({
						// 	...base,
						// 	cursor: 'default',
						// }),
						placeholder: base => ({ ...base, fontSize: '1rem', color: 'hsl(0, 1%, 67%)' }),
						control: base => ({
							...base,
							padding: '4px',
							backgroundColor: '#fcfcfb',
							border: '1px solid #e2e2e1',
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
						// valueContainer: base => ({
						//     ...base,
						//     zIndex: 9999,
						// }),
					}}
					components={{
						Option: this.customizedOptions,
						MultiValueLabel: this.customizedSelections,
						MultiValueRemove: this.customizedRemove,
						SingleValue: this.customizedSelections,
						DropdownIndicator: this.customizedDropdownIndicator,
					}}
					value={this.state.value}
				/>
			</div>
		);
	},

	// renderInputGroup () {
	// 	// TODO: find better solution
	// 	//   when importing the CreateForm using: import CreateForm from '../../elemental/shared/CreateForm';
	// 	//   CreateForm was imported as a blank object. This stack overflow post suggested lazilly requiring it:
	// 	// http://stackoverflow.com/questions/29807664/cyclic-dependency-returns-empty-object-in-react-native
	// 	// TODO: Implement this somewhere higher in the app, it breaks the encapsulation of the RelationshipField component
	// 	const CreateForm = require('../../elemental/shared/CreateForm');
	// 	return (
	// 		<Group block>
	// 			<Section grow>
	// 				{this.renderSelect()}
	// 			</Section>
	// 			<Section>
	// 				<Button onClick={this.openCreate}>+</Button>
	// 			</Section>
	// 			<CreateForm
	// 				list={listsByKey[this.props.refList.key]}
	// 				isOpen={this.state.createIsOpen}
	// 				onCreate={this.onCreate}
	// 				onCancel={this.closeCreate} />
	// 		</Group>
	// 	);
	// },

	renderValue () {
		// const { many } = this.props;
		// const { value } = this.state;
		// // console.log(this.state.value);
		// const props = {
		// 	children: value ? value.name : null,
		// 	component: value ? 'a' : 'span',
		// 	href: value ? value.href : null,
		// 	noedit: true,
		// };
		return this.renderSelect(true);
		// return many ? this.renderSelect(true) : <FormInput {...props} />;
	},

	renderField () {
		if (this.props.createInline) {
			// return this.renderInputGroup();
		} else {
			return this.renderSelect(false);
		}
	},
	renderUI() {
		return this.renderWithErrorUI();
	},
});