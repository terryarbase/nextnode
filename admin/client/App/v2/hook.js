// import React, { useState } from 'react';

// export const useToggle = (byDefault=false) => {
// 	const [status, setStatus] = useState(byDefault);

// 	const toggleStatus = () => {
// 		setStatus(!status);
// 	}

// 	return [ status, toggleStatus ];
// };

// // simulate redux state change
// export const useFetching = (payload={ data: [] }, reset=false) => {
// 	const state = {
// 		isLoading: false,
// 		loaded: false,
// 		error: null,
// 		...payload,
// 	};
// 	const [list, setList] = useState(state.list);
// 	const [isLoading, setIsLoading] = useState(state.isLoading);
// 	const [loaded, setLoaded] = useState(state.loaded);
// 	const [error, setError] = useState(state.error);

// 	const onFetching = () => {
// 		if (reset) {
// 			setList([]);
// 		}
// 		setIsLoading(true);
// 		setLoaded(false);
// 		setError(null);
// 	}

// 	const onFinished = list => {
// 		setList(list);
// 		setIsLoading(false);
// 		setLoaded(true);
// 	}

// 	const onFinished = error => {
// 		setIsLoading(false);
// 		setLoaded(true);
// 		setError(error);
// 	}

// 	return [ 
// 		{ list, isLoading, loaded, error },
// 		{ onFetching, onFinished, onError },
// 	];
// };

