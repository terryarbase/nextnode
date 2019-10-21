/**
 * Exports an object of lists, keyed with their key instead of their name and
 * wrapped with the List helper (./List.js)
 */
import _ from 'lodash';
import List from './List';

// context
import {
  useUserState,
} from "./../../../store/user/context";

const NormalizeContentList = () => {
	const {
		info: {
			nextnode: {
				lists,
			},
		},
	} = useUserState();

	let listsByKey = {};
	let listsByPath = {};

	_.forOwn(lists, l => {
		const list = new List(l);
		listsByKey = {
			...listsByKey,
			[key]: list,
		};
		listsByPath = {
			...listsByPath,
			[list.path]: list,
		};
	});

	return {
		listsByKey,
		listsByPath,
	};
};


export default NormalizeContentList;
