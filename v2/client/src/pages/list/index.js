import React from "react";
// import _ from "lodash";
import {
	withRouter,
	Redirect,
} from "react-router-dom";
import {
  Grid,
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
	logo,
	endpoint,
	name,
} from '../../config/constants.json';

// styles
import useStyles from './styles';

// context
// import {
//   	useListState,
// } from '../../store/list/context';
import {
	useUserState,
} from '../../store/user/context';

const ListPage = props => {
	const classes = useStyles();
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
		return (
			<Grid
				container
				direction="row"
      			justify="center"
      			alignItems="center"
      			className={classes.loadingContainer}
      		>
				<img src={`${endpoint}${logo}`} alt={name} />
			</Grid>
		);
	}
	return (
		<React.Fragment>
			<ListMessage />
			<ContentListTable
				{...props}
				loading={loading}
				info={items}
				// for cloudinary field use
				// cloudinary={_.get(nextnode, 'cloudinary')}
				currentList={currentList}
			/>
		</React.Fragment>
	);
}


export default withRouter(ListPage);
