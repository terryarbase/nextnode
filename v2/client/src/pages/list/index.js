import React from "react";
import {
	withRouter,
	Redirect,
} from "react-router-dom";

// hooks
import {
	useContentList,
} from './../../hook/list';

// components
import ContentListTable from './../../components/ContentListTable';

// configurations
import {
	notFoundPrefix,
} from '../../config/constants.json';

const ListPage = props => {
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
		<ContentListTable
			{...props}
			loading={loading}
			info={items}
			currentList={currentList}
		/>
	);
}


export default withRouter(ListPage);
