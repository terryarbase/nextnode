import React from "react";

import {
  TOGGLE_SIDEBAR,
  READYUI_SUCCESS,
  GLOBAL_LOADING,
} from './type';

var LayoutStateContext = React.createContext();
var LayoutDispatchContext = React.createContext();

const initialState = {
  coreLoad: false,
  isSidebarOpened: true,
  uiReady: false,   // must finish the get user session flow
};

function layoutReducer(state=initialState, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return { ...state, isSidebarOpened: !state.isSidebarOpened };
    case READYUI_SUCCESS:
      return { ...state, uiReady: true };
    case GLOBAL_LOADING:
      return { ...state, coreLoad: action.data };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function LayoutProvider({ children }) {
  var [state, dispatch] = React.useReducer(layoutReducer, initialState);
  return (
    <LayoutStateContext.Provider value={state}>
      <LayoutDispatchContext.Provider value={dispatch}>
        {children}
      </LayoutDispatchContext.Provider>
    </LayoutStateContext.Provider>
  );
}

function useLayoutState() {
  var context = React.useContext(LayoutStateContext);
  if (context === undefined) {
    throw new Error("useLayoutState must be used within a LayoutProvider");
  }
  return context;
}

function useLayoutDispatch() {
  var context = React.useContext(LayoutDispatchContext);
  if (context === undefined) {
    throw new Error("useLayoutDispatch must be used within a LayoutProvider");
  }
  return context;
}

// ###########################################################
const toggleSidebar = dispatch => {
  dispatch({
    type: TOGGLE_SIDEBAR,
  });
}

const changeCoreLoading = (dispatch, coreLoad) => {
  dispatch({
    type: GLOBAL_LOADING,
    data: coreLoad,
  });
}

const uiAlready = dispatch => {
  dispatch({
    type: READYUI_SUCCESS,
  });
}

export {
  LayoutProvider,
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
  uiAlready,
  changeCoreLoading,
};
