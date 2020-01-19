import assign from 'object-assign';
import {
	LOAD_COUNTS,
	COUNTS_LOADING_SUCCESS,
	COUNTS_LOADING_ERROR,

	LOAD_GENDER_STATISTIC,
	LOAD_GENDER_STATISTIC_SUCCESS,
	LOAD_GENDER_STATISTIC_ERROR,

	LOAD_JOIN_STATISTIC,
	LOAD_JOIN_STATISTIC_SUCCESS,
	LOAD_JOIN_STATISTIC_ERROR,
} from './constants';

const initialState = {
	counts: {},
	loading: false,
	error: null,

	genderStatistic: null,
	genderLoading: false,
	genderError: null,

	joinStatistic: null,
	joinLoading: false,
	joinError: null,
};

function home (state = initialState, action) {
	switch (action.type) {
		case LOAD_COUNTS:
			return assign({}, state, {
				loading: true,
			});
		case COUNTS_LOADING_SUCCESS:
			return assign({}, state, {
				loading: false,
				counts: action.counts,
				error: null,
			});
		case COUNTS_LOADING_ERROR:
			return assign({}, state, {
				loading: false,
				error: action.error,
			});
		case LOAD_GENDER_STATISTIC:
			return assign({}, state, {
				genderLoading: true,
			});
		case LOAD_GENDER_STATISTIC_SUCCESS:
			return assign({}, state, {
				genderLoading: false,
				genderStatistic: action.data,
				genderError: null,
			});
		case LOAD_GENDER_STATISTIC_ERROR:
			return assign({}, state, {
				genderLoading: false,
				genderError: action.error,
			});
		case LOAD_JOIN_STATISTIC:
			return assign({}, state, {
				joinLoading: true,
			});
		case LOAD_JOIN_STATISTIC_SUCCESS:
			return assign({}, state, {
				joinLoading: false,
				joinStatistic: action.data,
				joinError: null,
			});
		case LOAD_JOIN_STATISTIC_ERROR:
			return assign({}, state, {
				joinLoading: false,
				joinError: action.error,
			});
		default:
			return state;
	}
}

export default home;
