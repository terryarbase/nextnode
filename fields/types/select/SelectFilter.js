import React, { Component, PropTypes } from 'react';
import vkey from 'vkey';
import _ from 'lodash';
import {
	Button,
	FormField,
	FormNote,
	SegmentedControl,
} from '../../../admin/client/App/elemental';
import PopoutList from '../../../admin/client/App/shared/Popout/PopoutList';
import Kbd from '../../../admin/client/App/shared/Kbd';
import bindFunctions from '../../utils/bindFunctions';

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

		bindFunctions.call(this, [
			'handleClick',
		]);
	}
	handleClick () {
		const { option, selected } = this.props;
		this.props.onClick(option, selected);
	}
	render () {
		const { option, selected } = this.props;
		return (
			<PopoutList.Item
				icon={selected ? 'check' : 'dash'}
				isSelected={selected}
				label={option.label}
				onClick={this.handleClick}
			/>
		);
	}
}

class SelectFilter extends Component {
	constructor () {
		super();

		bindFunctions.call(this, [
			'detectOS',
			'handleClick',
			'handleKeyDown',
			'handleKeyUp',
			'removeOption',
			'selectOption',
			'toggleAllOptions',
			'toggleInverted',
			'updateFilter',
		]);

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

		let metaKey = '<control>';
		let metaKeyLabel = 'ctrl';
		if (osName === 'MacOS') {
			metaKey = '<meta>';
			metaKeyLabel = 'cmd';
		}
		
		this.setState({ osName, metaKey, metaKeyLabel });
	}
	handleKeyDown (e) {
		if (vkey[e.keyCode] !== this.state.metaKey) return;
		this.setState({ metaDown: true });
	}
	handleKeyUp (e) {
		if (vkey[e.keyCode] !== this.state.metaKey) return;

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
		selected ? this.removeOption(option) : this.selectOption(option);
	}
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	}

	// ==============================
	// RENDERERS
	// ==============================

	renderOptions () {
		const { currentUILang, field: { assign } } = this.props;
		return this.props.field.ops.map((option, i) => {
			var { label } = option;
			// special for assigned delegated value and multilingual structure
			if (assign && typeof label === 'object', currentUILang) {
				label = label[currentUILang];
			}

			const selected = this.props.filter.value.indexOf(option.value) > -1;
			return (
				<FilterOption
					key={`item-${i}-${option.value}`}
					option={{
						...option,
						...{
							label,
						},
					}}
					selected={selected}
					onClick={this.handleClick}
				/>
			);
		});
	}
	render () {
		const { field, filter, t, list } = this.props;
		const indeterminate = filter.value.length < field.ops.length;

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
				...{
					label: t(_.camelCase(option.label))
				},
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
						{indeterminate ? t('all') : t('nothing')}
					</Button>
					<FormNote style={{ margin: 0 }}>
						{t('sort:hold')} <Kbd>{this.state.metaKeyLabel}</Kbd> {t('sort:multiMsg')}
					</FormNote>
				</div>
				{this.renderOptions()}
			</div>
		);
	}
};


SelectFilter.propTypes = {
	field: PropTypes.object,
	filter: PropTypes.shape({
		inverted: PropTypes.boolean,
		value: PropTypes.array,
	}),
};
SelectFilter.getDefaultValue = getDefaultValue;
SelectFilter.defaultProps = {
	filter: getDefaultValue(),
};

module.exports = SelectFilter;
