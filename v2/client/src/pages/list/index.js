import React from "react";
import {
	withRouter,
	Redirect,
} from "react-router-dom";

// hooks
import HookList from './../../hook/list';

// components
import ContentListTable from './../../components/ContentListTable';

// configurations
import {
	notFoundPrefix,
} from '../../config/constants.json';

const ListPage = props => {
	const {
		items,
		loading,
		isInvalidList,
		currentList,
	} = HookList.useContentList(props);

	// redirect to 404 where the list is incorrect from the <List>
	if (isInvalidList) {
		return (<Redirect to={notFoundPrefix} />);
	} else if (!currentList) {
		return null;
	}

	return (
		<ContentListTable
			{...props}
			loading={loading}
			info={items}
			currentList={currentList}
		/>
	);
}


export default withRouter(ListPage);
