import { useEffect } from 'react';
import qs from "query-string";
// utils
// import ContentList from '../../utils/v1/lists';

// context
import {
	useListState,
	useListDispatch,
	loadList,
} from '../../store/list/context';
import {
	useUserState,
} from '../../store/user/context';
import {
  	useLayoutDispatch,
} from "../../store/layout/context";

const useContentList = ({ match, history }) => {
	// global
	const listDispatch = useListDispatch();
	const layoutDispatch = useLayoutDispatch();
	const {
		loading,
		items,
		currentList,
	} = useListState();
	const {
		listsByPath={},
	} = useUserState();

	// props
	const {
		params: {
			list,
		},
	} = match;

	const {
		location: {
			search,
		},
	} = history;

	// const loadTargetList = list => loadList(listDispatch, layoutDispatch, list);
	
	const targetList = listsByPath[list];
	let isInvalidList = !targetList;

	// loading the list
	useEffect(() => {
		const fetchTheList = (list, search) => {
			if (list) {
				if (search) {
					// console.log('> loading with search query: ', search);
					const query = qs.parse(search);
					list.updateQueryField(query);
				}
				loadList(listDispatch, layoutDispatch, list);
			}
		};

		fetchTheList(targetList, search);
	// dependency on target List
	}, [listDispatch, layoutDispatch, targetList, search]);
	return {
		loading,
		items,
		currentList,
		isInvalidList,		// indicates the targetList is invalid to get from the List
	};
}

export default {
	useContentList,
}
// const use
