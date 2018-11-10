import {
	REALTIME_SAVING,
	REALTIME_SAVED,
	REALTIME_SAVE_ERROR,
	SET_LOCALIZATION,
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
		const state = getState();
		const currentList = state.lists.currentList;
		currentList.updateItems(formData, (err, items) => {
			if (items) {
				// Successfully resolve this request in redux and set the loadCounter back to zero.
				dispatch(realtimeSaved(items));
			} else {
				// Catch this error in redux and set the loadCounter back to zero.
				dispatch(realtimeSavedError(err));
			}
		});
	};
}

/*
** Localization
*/
export function setCurrentLanguage (current) {
	return dispatch => dispatch({
		type: SET_LOCALIZATION,
		current,
	});
}

