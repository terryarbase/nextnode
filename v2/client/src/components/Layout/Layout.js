import React from "react";
import {
  Route,
  Switch,
  // Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
// import Typography from "../../pages/typography";
// import Notifications from "../../pages/notifications";
// import Maps from "../../pages/maps";
// import Tables from "../../pages/tables";
// import Icons from "../../pages/icons";
// import Charts from "../../pages/charts";
import List from "../../pages/list";
import ListForm from "../../pages/listForm";
import ErrorPage from "../../pages/error";

// context
import { useLayoutState } from "../../store/layout/context";

// configurations
import {
  main,
  notFoundPrefix,
  listPrefix,
} from "./../../config/constants.json";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();
    // <Route exact path={`${listPrefix}/:list/:id`} component={ListForm} />
  return (
    <div className={classes.root}>
        <React.Fragment>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path={main} component={Dashboard} />
              <Route exact path={`${listPrefix}/:list`} component={List} />
              <Route exact path={`${listPrefix}/:list/:action`} component={List} />
        
              <Route exact path={notFoundPrefix} render={() => <ErrorPage innerPage />} />
              <Route render={() => <ErrorPage innerPage />} />
            </Switch>
          </div>
        </React.Fragment>
    </div>
  );
}

export default withRouter(Layout);
