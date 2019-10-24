import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
	Chip,
	DialogTitle,
  	DialogContent,
  	DialogActions,
  	Dialog,
  	Button,
} from '@material-ui/core';

// components
import Filters from './../../../../FormField/types/filters';

// locales
import i18n from './../../../../../i18n';

// utils
import FilterLabeler from './../../../../../utils/filter';
import {
	translateListField,
} from './../../../../../utils/multilingual';
// configuration
import {
	listPrefix,
	main,
} from './../../../../../config/constants.json';

const FilterItem = props => {
	const {
		filter,
		filter: {
			field,
			field: {
				path,
			},
		},
		listName,
	} = props;

	const [isOpen, setOpen] = useState(false);
	const [filterInfo, setFilterInfo] = useState(filter);

	useMemo(() => {
		setFilterInfo(filter);
	}, [ filter ]);

	const open = () => setOpen(true);
	// 	setFilterInfo(filter);
	// };

	const close = () => setOpen(false);
	const updateFilter = () => {
		close();
	}
	const removeFilter = () => {
		close();
	}

	const FilterComponent = Filters[field.type];
	const fieldName = FilterLabeler(listName, filter);
	return (
		<React.Fragment>
			<Chip
				label={
					FilterLabeler(
						listName,
						filter,
					)
				}
				onClick={open}
				onDelete={removeFilter}
				color="primary"
				id={path}
			/>
			<Dialog
		        disableBackdropClick
		        disableEscapeKeyDown
		        maxWidth="lg"
		        aria-labelledby="confirmation-dialog-title"
		        open={isOpen}
		      >
		        <DialogTitle id="confirmation-dialog-title">
		          {translateListField(listName, path)} - {i18n.t('filter.editFilter')}
		        </DialogTitle>
		        <DialogContent dividers>
		        	<FilterComponent
						field={field}
						filter={filterInfo}
						adminPath={main}
						url={listPrefix}
						onChange={setFilterInfo}
					/>
		        </DialogContent>
		        <DialogActions>
		          <Button onClick={close}>
		            {i18n.t('filter.cancel')}
		          </Button>
		          <Button onClick={updateFilter} color="primary" variant="contained">
		            {i18n.t('filter.apply')}
		          </Button>
		        </DialogActions>
		    </Dialog>
		</React.Fragment>
	);
}

// class Filter extends Component {
// 	constructor () {
// 		super();


/*<Dialog
		        disableBackdropClick
		        disableEscapeKeyDown
		        maxWidth="lg"
		        aria-labelledby="confirmation-dialog-title"
		        open={isOpen}
		      >
		        <DialogTitle id="confirmation-dialog-title">
		          {i18n.t('filter.editFilter')}
		        </DialogTitle>
		        <DialogContent dividers>
		        	<FilterComponent
						field={field}
						filter={filterInfo}
						adminPath={main}
						url={listPrefix}
						onChange={setFilterInfo}
					/>
		        </DialogContent>
		        <DialogActions>
		          <Button onClick={close} variant="contained">
		            {i18n.t('filter.cancel')}
		          </Button>
		          <Button onClick={updateFilter} color="primary" variant="contained">
		            {i18n.t('filter.apply')}
		          </Button>
		        </DialogActions>
		    </Dialog>*/

// 		this.open = this.open.bind(this);
// 		this.close = this.close.bind(this);
// 		this.updateValue = this.updateValue.bind(this);
// 		this.updateFilter = this.updateFilter.bind(this);
// 		this.removeFilter = this.removeFilter.bind(this);

// 		this.state = {
// 			isOpen: false,
// 		};
// 	}
// 	open () {
// 		this.setState({
// 			isOpen: true,
// 			filterValue: this.props.filter.value,
// 		});
// 	}
// 	close () {
// 		this.setState({
// 			isOpen: false,
// 		});
// 	}
// 	updateValue (filterValue) {
// 		this.setState({
// 			filterValue: filterValue,
// 		});
// 	}
// 	updateFilter (e) {
// 		const { dispatch, filter } = this.props;
// 		dispatch(setFilter(filter.field.path, this.state.filterValue));
// 		this.close();
// 		e.preventDefault();
// 	}
// 	removeFilter () {
// 		this.props.dispatch(clearFilter(this.props.filter.field.path));
// 	}
// 	render () {
// 		const { filter, t, list, currentUILang } = this.props;
// 		const filterId = `activeFilter__${filter.field.path}`;
// 		const FilterComponent = Filters[filter.field.type];

// 		return (
// 			<span>
// 				<Chip
// 					label={getFilterLabel(list, t, currentUILang, filter)}
// 					onClick={this.open}
// 					onClear={this.removeFilter}
// 					color="primary"
// 					id={filterId}
// 				/>
// 				<Popout isOpen={this.state.isOpen} onCancel={this.close} relativeToID={filterId}>
// 					<form onSubmit={this.updateFilter}>
// 						<Popout.Header title={t('editFilter')} />
// 						<Popout.Body>
// 							<FilterComponent
// 								field={filter.field}
// 								filter={this.state.filterValue}
// 								onChange={this.updateValue}
// 							/>
// 						</Popout.Body>
// 						<Popout.Footer
// 							ref="footer"
// 							primaryButtonIsSubmit
// 							primaryButtonLabel={t('apply')}
// 							secondaryButtonAction={this.close}
// 							secondaryButtonLabel={t('cancel')} />
// 					</form>
// 				</Popout>
// 			</span>
// 		);
// 	}
// };

FilterItem.propTypes = {
	listName: PropTypes.string.isRequired,
	filter: PropTypes.shape({
		field: PropTypes.object.isRequired,
		// value: PropTypes.string.isRequired,
	}).isRequired,
};

export default FilterItem;
