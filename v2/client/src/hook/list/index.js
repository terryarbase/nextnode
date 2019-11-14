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
import {
	useUserState,
} from '../../store/user/context';
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
	}, [listDispatch, layoutDispatch, search, list]);

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
	const {
		// language,
		defaultLanguage: language,
	} = useUserState();
	const initialValues = { ...initial };
	// stateful content
	const [values, setValues] = useState(initialValues);
	const [currentLang, setLanguage] = useState(language || i18n.locale);
	// when the values changed
	const handleChanged = ({ path, value, attachment }) => {
		// grab the values with the multilingual factor
		setValues(list.getProperlyChangedValue({
			currentLang,
			path,
			value,
			attachment,
			currentValue: values,
		}));
	}
	return [ values, handleChanged, currentLang, setLanguage ];
}

const useSubmitForm = list => {
	const [values, whenChanged, currentLang, whenLanguageChanged] = useFormValues(list);
	// global
	const listDispatch = useListDispatch();
	const layoutDispatch = useLayoutDispatch();

	const handleSubmit = useCallback(() => {
		// e.preventDefault();
		const formData = new FormData();
		// adjust formData
		list.getFormData(formData, values);

		// for (var pair of formData.entries()) {
		//     console.log(pair[0]+ ', ' + pair[1]); 
		// }
		createListItem(listDispatch, layoutDispatch, formData, list);
	});

	return [values, whenChanged, handleSubmit, currentLang, whenLanguageChanged];
}

export {
	useContentList,
	useToggle,
	useErrorDidChange,
	useFormValues,
	useSubmitForm,
}
// const use
