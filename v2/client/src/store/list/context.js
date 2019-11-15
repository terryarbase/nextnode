import React from "react";
import _ from 'lodash';

import {
  LOADLIST,
  LOADLIST_SUCCESS,
  LOADLIST_FAILURE,
  SELECTLIST,
  DELETE_ROWS,
  DELETE_ROWS_SUCCESS,
  DELETE_ROWS_FAILURE,
  LOADLISTDETAILS,
  LOADLISTDETAILS_SUCCESS,
  LOADLISTDETAILS_FAILURE,
  CREATELISTITEM,
  CREATELISTITEM_SUCCESS,
  CREATELISTITEM_FAILURE,
  CLEARERROR,
} from './type';

import {
  request,
} from './../../utils/request';

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
  form: null,
  entityError: null,
};

const listReducer = (state=initialState, action) => {
  switch (action.type) {
    case LOADLIST: 
      return {
        ...state,
        loading: true,
        error: null,
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
    case DELETE_ROWS: 

      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_ROWS_SUCCESS: 
      return {
        ...state,
        loading: false,
      };
    case DELETE_ROWS_FAILURE: 
      return {
        ...state,
        loading: false,
        error: action.err,
      };
    case LOADLISTDETAILS: 
      return {
        ...state,
        loading: true,
        error: null,
        form: null,
      };
    case CREATELISTITEM:
      return {
        ...state,
        loading: true,
        form: null,
        error: null,
        entityError: null,
      };
    case LOADLISTDETAILS_SUCCESS:
    case CREATELISTITEM_SUCCESS:
      return {
        ...state,
        form: action.data,
        loading: false,
      };
    case LOADLISTDETAILS_FAILURE: 
      return {
        ...state,
        loading: false,
        error: action.err,
      };
    case CREATELISTITEM_FAILURE:
      return {
        ...state,
        loading: false,
        entityError: action.err,
        error: action.message,
      };
    case CLEARERROR: 
      return {
        ...state,
        entityError: null,
        error: null,
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

const clearError = async(dispatch) => {
  dispatch({
    type: CLEARERROR,
  });
}

const deleteListRows = async(dispatch, layoutDispatch, list, ids) => {
  dispatch({
    type: DELETE_ROWS,
  });

  // turn on the global loader
  changeCoreLoading(layoutDispatch, true);

  try {
    // prepare data
    const data = new FormData();
    _.forEach(ids, id => data.append('ids[]', id));
    const result = await request({
      url: `${api.listContent}/${list.path}`,
      method: 'delete',
      data,
    });
    dispatch({
      type: DELETE_ROWS_SUCCESS,
      data: result,
    });

    // reload the current list after delete
    loadList(dispatch, layoutDispatch, list);

  } catch (err) {
    dispatch({
      type: DELETE_ROWS_FAILURE,
      err: err.error,
    });
  } finally {
    // turn on the global loader
    changeCoreLoading(layoutDispatch, false);
  }
}

const loadList = async(dispatch, layoutDispatch, list) => {
  dispatch({
    type: LOADLIST,
  });

  // turn on the global loader
  changeCoreLoading(layoutDispatch, true);
  try {
    // get the current query string
    const query = list.buildQueryString();
    // console.log(list, query);
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

const createListItem = async(dispatch, layoutDispatch, data, list) => {
  dispatch({
    type: CREATELISTITEM,
  });

  // turn on the global loader
  changeCoreLoading(layoutDispatch, true);

  try {
    const result = await request({
      url: `${api.listContent}/${list.path}`,
      method: 'post',
      data,
    });
    dispatch({
      type: CREATELISTITEM_SUCCESS,
      data: result,
    });

  } catch (err) {
    dispatch({
      type: CREATELISTITEM_FAILURE,
      err: err.error,
      message: err.message,
    });
  } finally {
    // turn on the global loader
    changeCoreLoading(layoutDispatch, false);
  }
}

const loadListDetails = async(dispatch, layoutDispatch, id, list) => {
  dispatch({
    type: LOADLISTDETAILS,
  });

  // turn on the global loader
  changeCoreLoading(layoutDispatch, true);

  try {
    const result = await request({
      url: `${api.listContent}/${list.path}/${id}`,
      method: 'get',
    });
    dispatch({
      type: LOADLISTDETAILS_SUCCESS,
      data: result,
    });

  } catch (err) {
    dispatch({
      type: LOADLISTDETAILS_FAILURE,
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
  clearError,
  loadListDetails,
  selectList,
  deleteListRows,
  createListItem,
};
