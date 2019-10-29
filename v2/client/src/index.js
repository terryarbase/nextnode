import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

import Themes from "./themes";
import App from "./components/App";
// import * as serviceWorker from "./serviceWorker";
import { LayoutProvider } from "./store/layout/context";
import { UserProvider } from "./store/user/context";
import { ListProvider } from './store/list/context';

// global styles
import 'react-day-picker/lib/style.css';
// import i18n from './i18n';


ReactDOM.render(
  <LayoutProvider>
    <UserProvider>
    	<ListProvider>
			<ThemeProvider theme={Themes.default}>
				<CssBaseline />
				<App />
			</ThemeProvider>
		</ListProvider>
    </UserProvider>
  </LayoutProvider>,
  document.getElementById("root"),
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
