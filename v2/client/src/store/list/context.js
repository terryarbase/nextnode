import React from "react";
// import _ from 'lodash';

import {
  LOADLIST,
  LOADLIST_SUCCESS,
  LOADLIST_FAILURE,
  SELECTLIST,
  // REALTIME_SAVING,
  // REALTIME_SAVED,
  // REALTIME_SAVE_ERROR,
} from './type';

import request from './../../utils/request';

// import List from './../../utils/v1/List';

import {
  // storageName,
  api,
  // listContent,
  // signin,
} from './../../config/constants.json';

// context
import {
  changeCoreLoading,
} from "./../layout/context";

const ListStateContext = React.createContext();
const ListDispatchContext = React.createContext();

const initialState = {
  loading: false,
  error: null,
  items: {
    results: [],
    count: 0,
    editCount: 0,
  },
  currentList: null,
  // columns: [],
  // filters: [],
  // search: '',
  // sort: {
  //   input: '',
  //   isDefaultSort: false,
  //   paths: [],
  //   rawInput: '',
  // },
};

const listReducer = (state=initialState, action) => {
  switch (action.type) {
    case LOADLIST: 
      return {
        ...state,
        loading: true,
        items: {
          results: [],
          count: 0,
          editCount: 0,
        },
      };
    case LOADLIST_SUCCESS:
      return {
        ...state,
        items: action.data,
        loading: false,
      };
    case LOADLIST_FAILURE: 
      return {
        ...state,
        loading: false,
        error: action.err,
      };
    case SELECTLIST: 
      // const prevList = state.currentList;
      // const nextList = action.data;
      // // reset the previous list, if list is being changed
      // if (prevList && nextList.key !== prevList.key) {
      //   prevList.resetQueryField();
      // }
      return {
        ...state,
        currentList: action.data,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function ListProvider({ children }) {
  const [state, dispatch] = React.useReducer(listReducer, initialState);

  return (
    <ListStateContext.Provider value={state}>
      <ListDispatchContext.Provider value={dispatch}>
        {children}
      </ListDispatchContext.Provider>
    </ListStateContext.Provider>
  );
}

function useListState() {
  const context = React.useContext(ListStateContext);
  if (context === undefined) {
    throw new Error("useListState must be used within a ListProvider");
  }
  return context;
}

function useListDispatch() {
  const context = React.useContext(ListDispatchContext);
  if (context === undefined) {
    throw new Error("useListDispatch must be used within a ListProvider");
  }
  return context;
}

// ###########################################################
const selectList = async(dispatch, data) => {
  dispatch({
    type: SELECTLIST,
    data,
  });
};

const loadList = async(dispatch, layoutDispatch, list) => {
  dispatch({
    type: LOADLIST,
  });

  // turn on the global loader
  changeCoreLoading(layoutDispatch, true);

  try {
    // get the current query string
    const query = list.buildQueryString();
    console.log(list, query);
    const result = await request({
      url: `${api.listContent}/${list.path}${query}`,
      method: 'get',
    });
    dispatch({
      type: LOADLIST_SUCCESS,
      data: result,
    });
    selectList(dispatch, list);
  } catch (err) {
    dispatch({
      type: LOADLIST_FAILURE,
      err: err.error,
    });
  } finally {
    // turn on the global loader
    changeCoreLoading(layoutDispatch, false);
  }
}

export {
  ListProvider,
  useListDispatch,
  useListState,
  loadList,
  selectList,
};
