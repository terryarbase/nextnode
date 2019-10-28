import { useMemo, useState } from 'react';
import qs from "query-string";
// utils
// import ContentList from '../../utils/v1/lists';

// context
import {
	useListState,
	useListDispatch,
	loadList,
} from '../../store/list/context';
// import {
// 	useUserState,
// } from '../../store/user/context';
import {
  	useLayoutDispatch,
} from "../../store/layout/context";

const useContentList = ({ match, history, listsByPath={} }) => {
	// global
	const listDispatch = useListDispatch();
	const layoutDispatch = useLayoutDispatch();
	const {
		loading,
		items,
		currentList,
	} = useListState();
	// const {
	// 	listsByPath={},
	// } = useUserState();

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
	const isInvalidList = !targetList;
	// console.log(search);
	// loading the list
	useMemo(() => {
		const fetchTheList = (list, search) => {
			if (list) {
				if (search) {
					const query = qs.parse(search);
					list.updateQueryField(query);
				}
				loadList(listDispatch, layoutDispatch, list);
			}
		};
		fetchTheList(targetList, search);
	// dependency on target List
	}, [listDispatch, layoutDispatch, search, targetList]);

	return [
		loading,
		items,
		currentList,
		isInvalidList,		// indicates the targetList is invalid to get from the List
	];
}

const useToggle = initialValue => {
  const [value, setValue] = useState(initialValue);

  const toggleValue = () => {
  	setValue(!value);
  }

  return [value, toggleValue];
}

const useErrorDidChange = () => {
	const {
    	error,
	} = useListState();
	// const showError = useErrorDidChange(error);
	const [show, showError] = useState(!!error);
	// console.log(error, didChanged);
	useMemo(() => {
	  showError(!!error);
	}, [ error ]);
	// console.log(error);
	const closeError = () => showError(false);
	return [show, error, closeError];
}

export {
	useContentList,
	useToggle,
	useErrorDidChange,
}
// const use
