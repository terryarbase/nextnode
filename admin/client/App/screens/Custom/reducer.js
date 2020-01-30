import assign from 'object-assign';
import {
	LOAD_SUMMARY,
	SUMMARY_LOADING_SUCCESS,
	SUMMARY_LOADING_ERROR,
} from './constants';

const initialState = {
	summary: {
		data: null,
		loading: false,
		error: null,
	}
};

function custom (state = initialState, action) {
	switch (action.type) {
		case LOAD_SUMMARY:
			return {
				...state,
				summary: {
					data: null,
					loading: true,
					error: null,
				},
			}
		case SUMMARY_LOADING_SUCCESS:
			return {
				...state,
				summary: {
					data: action.summary,
					loading: false,
					error: null,
				},
			}
		case SUMMARY_LOADING_ERROR:
			return {
				...state,
				summary: {
					data: null,
					loading: false,
					error: action.error,
				},
			}
		default:
			return state;
	}
}

export default custom;
