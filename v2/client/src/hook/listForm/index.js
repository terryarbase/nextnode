import { useMemo, useEffect, useState } from 'react';

// context
import {
	useListState,
	useListDispatch,
} from '../../store/list/context';
import {
  	useLayoutDispatch,
} from "../../store/layout/context";

const useContentListDetails = ({ match, listsByPath={} }) => {
	// global
	const listDispatch = useListDispatch();
	const layoutDispatch = useLayoutDispatch();
	const {
		loading,
		form,
	} = useListState();

	// props
	const {
		params: {
			list,
			id,
		},
	} = match;

	// const loadTargetList = list => loadList(listDispatch, layoutDispatch, list);
	
	const targetList = listsByPath[list];
	const isInvalidList = !targetList;
	const fetchDetails = (list) => {
		if (list) {
			loadList(listDispatch, layoutDispatch, id, list);
		}
	};
	// console.log(search);
	// loading the list
	useMemo(() => {
		fetchDetails(targetList);
	// dependency on target List
	}, [fetchDetails, targetList]);

	return [
		loading,
		form,
		isInvalidList,		// indicates the targetList is invalid to get from the List
	];
}

export {
	useContentListDetails,
}
// const use
