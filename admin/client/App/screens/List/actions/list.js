import {
	REALTIME_SAVING,
	REALTIME_SAVED,
	REALTIME_SAVE_ERROR,
} from '../constants';

/*
** Realtime Save Section
** Terry Chan
*/
export function realtimeSaved (list) {
	return {
		type: REALTIME_SAVED,
		list,
	};
}

export function realtimeSavedError (err) {
	return dispatch => dispatch({
		type: REALTIME_SAVE_ERROR,
		err,
	});
}

export function realtimeSave (formData = new FormData()) {
	return (dispatch, getState) => {

		dispatch({
			type: REALTIME_SAVING,
		});
		return;
		// // Take a snapshot of the current redux state.
		// // Hold a reference to the currentList in state.
		const { 
			lists: {
				currentList: {
					postIt,
				},
			},
		} = getState();

		postIt(formData, (err, items) => {
			if (items) {
				// Successfully resolve this request in redux and set the loadCounter back to zero.
				dispatch(itemsLoaded(items));
			} else {
				// Catch this error in redux and set the loadCounter back to zero.
				dispatch(itemLoadingError(err));
			}
		});
	};
}

