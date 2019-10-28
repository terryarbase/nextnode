import React from "react";
import {
	withRouter,
	Redirect,
} from "react-router-dom";
import {
  DialogContentText,
} from '@material-ui/core';

// hooks
import {
	useContentList,
} from './../../hook/list';

// components
import ContentListTable from './../../components/ContentListTable';
import ListMessage from './../../components/ContentListTable/Message';

// configurations
import {
	notFoundPrefix,
} from '../../config/constants.json';

// locales
import i18n from '../../i18n';

// context
import {
  	useListState,
} from '../../store/list/context';
import {
	useUserState,
} from '../../store/user/context';

const ListPage = props => {
	/*
	** Pass List list to the useContentList hooking
	** Flexible list definition for the callee
	** listsByPath can be extends any customized List for the corresponding customized page 
	** Terry Chan
	** 28/10/2019
	*/
	const {
		listsByPath={},
	} = useUserState();
	props = {
		...props,
		listsByPath, 
	};
	const [
		loading,
		items,
		currentList,
		isInvalidList,
	] = useContentList(props);

	// redirect to 404 where the list is incorrect from the <List>
	if (isInvalidList) {
		return (<Redirect to={notFoundPrefix} />);
	} else if (!currentList) {
		return null;
	}
	return (
		<React.Fragment>
			<ListMessage />
			<ContentListTable
				{...props}
				loading={loading}
				info={items}
				currentList={currentList}
			/>
		</React.Fragment>
	);
}


export default withRouter(ListPage);
