// import React from "react";
// import {
// 	withRouter,
// 	Redirect,
// } from "react-router-dom";
// import {
//   DialogContentText,
// } from '@material-ui/core';

// // hooks
// import {
// 	useContentList,
// } from './../../hook/list';

// // components
// import ContentListTable from './../../components/ContentListTable';
// import ListMessage from './../../components/ContentListTable/Message';

// // configurations
// import {
// 	notFoundPrefix,
// } from '../../config/constants.json';

// // locales
// import i18n from '../../i18n';

// // context
// import {
//   useListState,
// } from '../../store/list/context';

// const ListPage = props => {
// 	const [
// 		loading,
// 		items,
// 		currentList,
// 		isInvalidList,
// 	] = useContentList(props);

// 	// redirect to 404 where the list is incorrect from the <List>
// 	if (isInvalidList) {
// 		return (<Redirect to={notFoundPrefix} />);
// 	} else if (!currentList) {
// 		return null;
// 	}
// 	return (
// 		<React.Fragment>
// 			<ListMessage />
// 			<ContentListTable
// 				{...props}
// 				loading={loading}
// 				info={items}
// 				currentList={currentList}
// 			/>
// 		</React.Fragment>
// 	);
// }


// export default withRouter(ListPage);
