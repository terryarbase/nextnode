import React, { Component } from 'react';
import PropTypes from 'prop-types';
import vkey from 'vkey';
import _ from 'lodash';

import {
	Button,
	FormField,
	FormNote,
	SegmentedControl,
} from '../../elemental';
import {
	List,
	ListItem,
	ListItemText,
	IconButton,
	ListItemSecondaryAction,
	// Typography,
} from '@material-ui/core';
import {
	Check as CheckIcon,
} from '@material-ui/icons';

// import PopoutListItem from '../../shared/Popout/PopoutListItem';
import Kbd from '../../shared/Kbd';
// import bindFunctions from '../../utils/bindFunctions';

// locales
import i18n from '../../../../i18n';

const INVERTED_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

function getDefaultValue () {
	return {
		inverted: INVERTED_OPTIONS[0].value,
		value: [],
	};
}

class FilterOption extends Component {
	constructor () {
		super();

		this.handleClick = this.handleClick.bind(this);
	}
	handleClick () {
		const { option, selected } = this.props;
		this.props.onClick(option, selected);
	}
	render () {
		const { option, selected } = this.props;
		// console.log(option);
		return (
			<ListItem
				button divider selected={selected} dense
				onClick={this.handleClick}
			>
              <ListItemText
                primary={option.label}
              />
              {
              	selected && <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label={option.label}>
                      <CheckIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
              }
            </ListItem>
		);
	}
}

class SelectFilter extends Component {
	constructor () {
		super();

		_.forEach([
			'detectOS',
			'handleClick',
			'handleKeyDown',
			'handleKeyUp',
			'removeOption',
			'selectOption',
			'toggleAllOptions',
			'toggleInverted',
			'updateFilter',
		], func => this[func] = this[func].bind(this));
		// bindFunctions.call(this, [
		// 	'detectOS',
		// 	'handleClick',
		// 	'handleKeyDown',
		// 	'handleKeyUp',
		// 	'removeOption',
		// 	'selectOption',
		// 	'toggleAllOptions',
		// 	'toggleInverted',
		// 	'updateFilter',
		// ]);

		this.state = { metaDown: false };
	}
	componentDidMount () {
		this.detectOS();
		document.body.addEventListener('keydown', this.handleKeyDown, false);
		document.body.addEventListener('keyup', this.handleKeyUp, false);
	}
	componentWillUnmount () {
		document.body.removeEventListener('keydown', this.handleKeyDown);
		document.body.removeEventListener('keyup', this.handleKeyUp);
	}

	// ==============================
	// METHODS
	// ==============================

	// TODO this should probably be moved to the main App component and stored
	// in context for other components to subscribe to when required
	detectOS () {
		let osName = 'Unknown OS';

		if (navigator.appVersion.includes('Win')) osName = 'Windows';
		if (navigator.appVersion.includes('Mac')) osName = 'MacOS';
		if (navigator.appVersion.includes('X11')) osName = 'UNIX';
		if (navigator.appVersion.includes('Linux')) osName = 'Linux';

		this.setState({ osName });
	}
	handleKeyDown (e) {
		if (vkey[e.keyCode] !== '<meta>') return;

		this.setState({ metaDown: true });
	}
	handleKeyUp (e) {
		if (vkey[e.keyCode] !== '<meta>') return;

		this.setState({ metaDown: false });
	}

	toggleInverted (inverted) {
		this.updateFilter({ inverted });
	}
	toggleAllOptions () {
		const { field, filter } = this.props;

		if (filter.value.length < field.ops.length) {
			this.updateFilter({ value: field.ops.map(i => i.value) });
		} else {
			this.updateFilter({ value: [] });
		}
	}
	selectOption (option) {
		const value = this.state.metaDown
			? this.props.filter.value.concat(option.value)
			: [option.value];

		this.updateFilter({ value });
	}
	removeOption (option) {
		const value = this.state.metaDown
			? this.props.filter.value.filter(i => i !== option.value)
			: [option.value];

		this.updateFilter({ value });
	}
	handleClick (option, selected) {
		console.log(this);
		selected ? this.removeOption(option) : this.selectOption(option);
	}
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	}

	// ==============================
	// RENDERERS
	// ==============================

	renderOptions () {
		return this.props.field.ops.map((option, i) => {
			let { label } = option;
			// special for assigned delegated value and multilingual structure
			if (typeof label === 'object') {
				label = label[i18n.locale];
			}

			const selected = this.props.filter.value.indexOf(option.value) > -1;
			return (
				<FilterOption
					key={`item-${i}-${option.value}`}
					option={{
						...option,
						label,
					}}
					selected={selected}
					onClick={this.handleClick}
				/>
			);
		});
	}
	render () {
		const { field, filter } = this.props;
		const indeterminate = filter.value.length < field.ops.length;

		const metaKeyLabel = this.state.osName === 'MacOS'
			? 'cmd'
			: 'ctrl';

		const fieldStyles = {
			alignItems: 'center',
			borderBottom: '1px dashed rgba(0,0,0,0.1)',
			display: 'flex',
			justifyContent: 'space-between',
			marginBottom: '1em',
			paddingBottom: '1em',
		};
		const invertedOptions = _.map(INVERTED_OPTIONS, option => (
			{
				...option,
				label: i18n.t(`filter.${_.camelCase(option.label)}`)
			}
		));
		return (
			<div>
				<FormField>
					<SegmentedControl
						equalWidthSegments
						onChange={this.toggleInverted}
						options={invertedOptions}
						value={filter.inverted}
					/>
				</FormField>
				<div style={fieldStyles}>
					<Button size="xsmall" onClick={this.toggleAllOptions} style={{ padding: 0, width: 50 }}>
						{indeterminate ? i18n.t('filter.all') : i18n.t('filter.nothing')}
					</Button>
					<FormNote style={{ margin: 0 }}>
						{i18n.t('sort.hold')} <Kbd>{metaKeyLabel}</Kbd> {i18n.t('sort.multiMsg')}
					</FormNote>
				</div>
				<List component="nav">
					{this.renderOptions()}
				</List>
			</div>
		);
	}
};


SelectFilter.propTypes = {
	field: PropTypes.object,
	filter: PropTypes.shape({
		inverted: PropTypes.bool,
		value: PropTypes.array,
	}),
};
SelectFilter.getDefaultValue = getDefaultValue;
SelectFilter.defaultProps = {
	filter: getDefaultValue(),
};

export default SelectFilter;
