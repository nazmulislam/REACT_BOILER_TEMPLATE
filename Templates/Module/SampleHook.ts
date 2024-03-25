import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  addSampleAction,
  updateSampleAction,
  getPaginatedSampleListAction,
  updateSamplePaginationAction,
  updateSamplePaginationFilterAction,
  deleteSampleAction,
  getSelectedSampleByIdAction,
  changeLayoutAction,
  clearSampleDataAction,
  updateSampleIsInitialTableDataLoadedAction
} from "./SampleAction";
import { Dispatch } from "redux";
import { default as EndPoints } from "./SampleEndPoints.json";

const useSampleHook = (props?: any) => {
  const getPaginatedSampleListFromStore = useSelector(
    (state: any) => state.SampleReducer.list,
    shallowEqual
  );

  const getSampleByIdFromStore = useSelector(
    (state: any) => state.SampleReducer.sample,
    shallowEqual
  );

  const SampleList = useSelector(
    (state: any) => state.SampleReducer.menuList,
    shallowEqual
  );
  const SampleLoading = useSelector(
    (state: any) => state.SampleReducer.loading,
    shallowEqual
  );
  const SampleSubmit = useSelector(
    (state: any) => state.SampleReducer.submitting,
    shallowEqual
  );
  const SampleHTTPRequest = useSelector(
    (state: any) => state.SampleReducer.httpRequest,
    shallowEqual
  );
  const SampleFilter = useSelector(
    (state: any) => state.SampleReducer.filter,
    shallowEqual
  );
  const SampleSort = useSelector(
    (state: any) => state.SampleReducer.sort,
    shallowEqual
  );
  const SamplePage = useSelector(
    (state: any) => state.SampleReducer.page,
    shallowEqual
  );
  const SamplePerPage = useSelector(
    (state: any) => state.SampleReducer.per_page,
    shallowEqual
  );
  const SampleTotalRecords = useSelector(
    (state: any) => state.SampleReducer.total_records,
    shallowEqual
  );

  const SampleIsAdded = useSelector(
    (state: any) => state.SampleReducer?.success,
    shallowEqual
  );

  const SampleIsCreated = useSelector(
    (state: any) => state.SampleReducer.isCreated,
    shallowEqual
  );

  const SampleLayoutType = useSelector(
    (state: any) => state.SampleReducer.layoutStyle,
    shallowEqual
  );

  const dispatch: Dispatch<any> = useDispatch();

  const changeSampleLayoutType = React.useCallback(
    (layoutStyle: any) => dispatch(changeLayoutAction(layoutStyle)),
    [dispatch]
  );

  const saveForm = React.useCallback(
    (formData: object, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(addSampleAction(EndPoints.addSample, formData, resetForm,isSaveExit,showSideBar)),
    [dispatch]
  );
  const updateForm = React.useCallback(
    (SampleId: any, data: any, resetForm: () => void, isSaveExit:boolean,showSideBar:(status:boolean)=>void) =>
      dispatch(
        updateSampleAction(EndPoints.updateSample, SampleId, data, resetForm, isSaveExit,showSideBar)
      ),
    [dispatch]
  );
  const getPaginatedSampleList = React.useCallback(
    () =>
      dispatch(getPaginatedSampleListAction(EndPoints.getPaginatedSampleList)),
    [dispatch]
  );

  const getSelectedSampleById = React.useCallback(
    (SampleId: any) =>
      dispatch(
        getSelectedSampleByIdAction(EndPoints.getSelectedSampleById, SampleId)
      ),
    [dispatch]
  );

  const deleteForm = React.useCallback(
    (rowItem: any) =>
      dispatch(deleteSampleAction(EndPoints.deleteSample, rowItem)),
    [dispatch]
  );

  const clearSampleDataHook = React.useCallback(
    () => dispatch(clearSampleDataAction()),
    [dispatch]
  );

  const updateSamplePaginated = (sorting: any) =>
    dispatch(updateSamplePaginationAction(sorting));

  const updateSamplePaginationFilterSearch = (paginationData: any) =>
    dispatch(updateSamplePaginationFilterAction(paginationData));

    const updateSampleIsInitialTableDataLoaded = (status: boolean) =>
    dispatch(updateSampleIsInitialTableDataLoadedAction(status));

  return {
    SampleList,
    getPaginatedSampleListFromStore,
    SampleLoading,
    SampleSubmit,
    SampleHTTPRequest,
    SampleFilter,
    SampleSort,
    SamplePage,
    SamplePerPage,
    SampleTotalRecords,
    SampleIsAdded,
    SampleIsCreated,
    getPaginatedSampleList,
    saveForm,
    updateForm,
    updateSamplePaginated,
    updateSamplePaginationFilterSearch,
    deleteForm,
    getSampleByIdFromStore,
    getSelectedSampleById,
    changeSampleLayoutType,
    SampleLayoutType,
    clearSampleDataHook,
    updateSampleIsInitialTableDataLoaded,
  };
};
export { useSampleHook };
