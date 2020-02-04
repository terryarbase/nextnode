import xhr from 'xhr';
import {
	LOAD_SUMMARY,
	SUMMARY_LOADING_SUCCESS,
	SUMMARY_LOADING_ERROR,
} from './constants';
import { NETWORK_ERROR_RETRY_DELAY } from '../../../constants';

/**
 * Load the summary of all lists
 */
export function loadSummary () {
	return (dispatch) => {
		dispatch({
			type: LOAD_SUMMARY,
		});
		xhr({
			url: `/api/internal/summary`,
		}, (err, resp, body) => {
			if (err) {
				dispatch(summaryLoadingError(err));
				return;
			}
			try {
				body = JSON.parse(body);
				if (body.data) {
					dispatch(summaryLoaded(body.data));
				}
			} catch (e) {
				console.log('Error parsing results json:', e, body);
				dispatch(summaryLoadingError(e));
				return;
			}
		});
	};
}

/**
 * Dispatched when the summary were loaded
 *
 * @param  {Object} summary The summary object as returned by the API
 */
export function summaryLoaded (summary) {
	return {
		type: SUMMARY_LOADING_SUCCESS,
		summary,
	};
}

/**
 * Dispatched when unsuccessfully trying to load the summary, will redispatch
 * loadCounts after NETWORK_ERROR_RETRY_DELAY until we get summary back
 *
 * @param  {object} error The error
 */
export function summaryLoadingError (error) {
	return (dispatch, getState) => {
		dispatch({
			type: SUMMARY_LOADING_ERROR,
			error,
		});
		setTimeout(() => {
			dispatch(loadSummary());
		}, NETWORK_ERROR_RETRY_DELAY);
	};
}
