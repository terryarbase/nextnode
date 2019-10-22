import React from 'react';
// , { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
	Chip,
} from '@material-ui/core/Chip';

import Popout from '../../../../shared/Popout';
import { setFilter, clearFilter } from '../../actions';
import getFilterLabel from './getFilterLabel';

class Filter extends Component {
	constructor () {
		super();

		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.updateValue = this.updateValue.bind(this);
		this.updateFilter = this.updateFilter.bind(this);
		this.removeFilter = this.removeFilter.bind(this);

		this.state = {
			isOpen: false,
		};
	}
	open () {
		this.setState({
			isOpen: true,
			filterValue: this.props.filter.value,
		});
	}
	close () {
		this.setState({
			isOpen: false,
		});
	}
	updateValue (filterValue) {
		this.setState({
			filterValue: filterValue,
		});
	}
	updateFilter (e) {
		const { dispatch, filter } = this.props;
		dispatch(setFilter(filter.field.path, this.state.filterValue));
		this.close();
		e.preventDefault();
	}
	removeFilter () {
		this.props.dispatch(clearFilter(this.props.filter.field.path));
	}
	render () {
		const { filter, t, list, currentUILang } = this.props;
		const filterId = `activeFilter__${filter.field.path}`;
		const FilterComponent = Filters[filter.field.type];

		return (
			<span>
				<Chip
					label={getFilterLabel(list, t, currentUILang, filter)}
					onClick={this.open}
					onClear={this.removeFilter}
					color="primary"
					id={filterId}
				/>
				<Popout isOpen={this.state.isOpen} onCancel={this.close} relativeToID={filterId}>
					<form onSubmit={this.updateFilter}>
						<Popout.Header title={t('editFilter')} />
						<Popout.Body>
							<FilterComponent
								field={filter.field}
								filter={this.state.filterValue}
								onChange={this.updateValue}
							/>
						</Popout.Body>
						<Popout.Footer
							ref="footer"
							primaryButtonIsSubmit
							primaryButtonLabel={t('apply')}
							secondaryButtonAction={this.close}
							secondaryButtonLabel={t('cancel')} />
					</form>
				</Popout>
			</span>
		);
	}
};

FilterItem.propTypes = {
	filter: PropTypes.shape({
		field: PropTypes.object.isRequired,
		value: PropTypes.object.isRequired,
	}).isRequired,
};

module.exports = FilterItem;
