import { useMemo, useState, useCallback } from 'react';
import qs from "query-string";
// import _ from "lodash";
// utils
// import ContentList from '../../utils/v1/lists';

// context
import {
	useListState,
	useListDispatch,
	loadList,
	createListItem,
} from '../../store/list/context';
// import {
// 	createListItem,
// } from '../../store/user/context';
import {
  	useLayoutDispatch,
} from "../../store/layout/context";

// locales
import i18n from '../../i18n';

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

// form value changed
const useFormValues = (list, initial) => {
	const initialValues = { ...initial };
	const currentLang = i18n.locale;
	// if no given initial values, and the behavior is an item creation
	// get the default value for each of field
	// if (!initial) {
	// 	initialValues = list.getDefaultValue({ currentLang });
	// 	console.log('>>>>>>> ', initialValues);
	// }
	// stateful content
	const [values, setValues] = useState(initialValues);
	// when the values changed
	const handleChanged = ({ path, value }) => {
		// grab the values with the multilingual factor
		setValues(list.getProperlyChangedValue({
			currentLang,
			path,
			value,
			currentValue: values,
		}));
	}

	return [ values, handleChanged ];
}

const useSubmitForm = list => {
	const [values, whenChanged] = useFormValues(list);
	// global
	const listDispatch = useListDispatch();
	const layoutDispatch = useLayoutDispatch();

	const handleSubmit = useCallback(e => {
		e.preventDefault();
		const formData = new FormData(e.target);
		// adjust formData
		list.getFormData({
			formData,
			values,
		});

		createListItem(listDispatch, layoutDispatch, formData, list);
	});

	return [values, whenChanged, handleSubmit];
}

export {
	useContentList,
	useToggle,
	useErrorDidChange,
	useFormValues,
	useSubmitForm,
}
// const use
