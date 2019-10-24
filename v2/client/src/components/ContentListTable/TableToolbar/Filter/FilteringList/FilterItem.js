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
import {
	requestHeader,
} from './../../../../../utils/request';
// configuration
import {
	apiVersionV2Session,
	main,
	endpoint,
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
		onUpdate,
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
		onUpdate(filterInfo);
		close();
	}
	const removeFilter = () => {
		onUpdate(filterInfo, true);
		close();
	}

	const FilterComponent = Filters[field.type];
	const fieldName = FilterLabeler(listName, filter);
	return (
		<React.Fragment>
			<Chip
				label={fieldName}
				onClick={open}
				onDelete={removeFilter}
				color="primary"
				id={path}
			/>
			<Dialog
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
						url={`${endpoint}${apiVersionV2Session}`}
						onChange={setFilterInfo}
						requestHeader={requestHeader({ isAuth: true })}
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

FilterItem.propTypes = {
	listName: PropTypes.string.isRequired,
	onUpdate: PropTypes.func.isRequired,
	filter: PropTypes.shape({
		field: PropTypes.object.isRequired,
		// value: PropTypes.string.isRequired,
	}).isRequired,
};

export default FilterItem;
