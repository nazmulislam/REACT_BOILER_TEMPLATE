import {
  SAMPLE_LOADING,
  SAMPLE_FORM_SUBMIT,
  SAMPLE_ADD,
  SAMPLE_DELETE,
  SAMPLE_PAGNIATION_UPDATE,
  SAMPLE_GET_PAGINATED_LIST,
  SAMPLE_GET,
  SAMPLE_LAYOUT_STYLE,
  SAMPLE_UPDATE,
  SAMPLE_FORM_HTTP_REQUEST,
  SAMPLE_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./SampleTypes";
import { useHttp } from "src/hooks";
import { batch } from "react-redux"; 
import { DispatchType, ResponseData } from "src/vite-env";
import { findIndex } from "lodash";
import { GLOBAL_TOAST } from "src/store/actionTypes";
const SampleLoading = (status = true) => {
  const payLoad = status
    ? { loading: true, error: false, success: null }
    : { loading: false };
  const action: any = {
    type: SAMPLE_LOADING,
    payLoad,
  };
  return action;
};

const SampleSubmit = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: SAMPLE_FORM_SUBMIT,
    payLoad,
  };
  return action;
};

const SampleHttpRequest = (status = true) => {
  const payLoad = status ? { submitting: true } : { submitting: false };
  const action: any = {
    type: SAMPLE_FORM_HTTP_REQUEST,
    payLoad,
  };
  return action;
};
export function addSampleAction(url: string, formData: object, resetForm: () => void,isSaveAndExit:boolean, showSideBar: (status:boolean) => void) {
  return (dispatch: DispatchType, getState: any) => {
    const { SampleReducer } = getState();
    const { total_records } = SampleReducer;

    dispatch(SampleSubmit());
    const db = new useHttp();
    db.post(url, formData)
      .then((res: any) => {
        const { record } = res.data;

        if (res.status === 200) {

          resetForm();
          const action: any = {
            type: SAMPLE_ADD,
            payLoad: record,
            total_records: total_records + 1,
          };
          batch(() => {
            dispatch(action);

            dispatch({
              type: GLOBAL_TOAST,
              payLoad: {
                showToast: true,
                toastMessage: res.data.message,
                toastDetail: null,
                toastType: "success",
              },
            });
          });
          if(isSaveAndExit){
            showSideBar(false)
          }
        }
      })
      .finally(() => {
        dispatch(SampleLoading(false));
        dispatch(SampleSubmit(false));
        batch(() => {
          dispatch({
            type: GLOBAL_TOAST,
            payLoad: {
              showToast: false,
              toastMessage: null,
              toastDetail: null,
              toastType: "success",
            },
          });
        });
      });
  };
}

export function updateSampleAction(
  url: string,
  modelId: number,
  formData: object,
  resetForm: () => void,
  isSaveAndExit:boolean, 
  showSideBar: (status:boolean) => void
) {
  return (dispatch: DispatchType, getState: any) => {
    const { SampleReducer } = getState();
    const { list } = SampleReducer;
    const listIndex = findIndex(list, function (listItem: any) {
      return listItem.table_primary_key_id === modelId;
    });
    dispatch(SampleSubmit());
    const db = new useHttp();
    db.put(`${url}${modelId}`, formData)
      .then((res: any) => {
        const { record } = res.data;

        if (res.status === 200) {
          resetForm();
          const action: any = {
            type: SAMPLE_UPDATE,
            payLoad: { record, listIndex },
          };
          const updateAction: any = {
            type: SAMPLE_GET,
            payLoad: {
              sample: record,
            },
          };
          batch(() => {
            dispatch(action);
            dispatch(updateAction);
            /**
             * For Global toast show
             */
            dispatch({
              type: GLOBAL_TOAST,
              payLoad: {
                showToast: true,
                toastMessage: res.data.message,
                toastDetail: null,
                toastType: "success",
              },
            });
          });
          if(isSaveAndExit){
            showSideBar(false)
          }

        }
      })
      .finally(() => {
        batch(() => {
          dispatch(SampleLoading(false));
          dispatch(SampleSubmit(false));
          /**
           * For Global toast hide
           */
          dispatch({
            type: GLOBAL_TOAST,
            payLoad: {
              showToast: false,
              toastMessage: null,
              toastDetail: null,
              toastType: "success",
            },
          });
        });
      });
  };
}

export function clearSampleDataAction() {
  return (dispatch: DispatchType, getState: any) => {
    const action: any = {
      type: SAMPLE_GET,
      payLoad: {
        sample: null,
      },
    };
    dispatch(action);
  };
}

export function deleteSampleAction(url: string, data: any) {
  return (dispatch: DispatchType, getState: any) => {
    const { SampleReducer } = getState();
    const { total_records } = SampleReducer;

    dispatch(SampleLoading());
    const db = new useHttp();
    db.delete(`${url}${data.table_primary_key_id}`)
      .then((res: any) => {
        if (res.status === 200) {
          const action: any = {
            type: SAMPLE_DELETE,
            payLoad: data,
            total_records: total_records - 1,
          };
          batch(() => {
            dispatch({
              type: GLOBAL_TOAST,
              payLoad: {
                showToast: true,
                toastMessage: "Deleted",
                toastDetail: null,
                toastType: "success",
              },
            });
            dispatch(action);
          });
        }
      })
      .finally(() => {
        batch(() => {
          dispatch(SampleLoading(false));
          dispatch(SampleSubmit(false));
          dispatch({
            type: GLOBAL_TOAST,
            payLoad: {
              showToast: false,
              toastMessage: null,
              toastDetail: null,
              toastType: "success",
            },
          });
        });
      });
  };
}

export function getPaginatedSampleListAction(URL: string) {
  return (dispatch: DispatchType, getState: any) => {
    const { SampleReducer } = getState();
    const { page, per_page, filter, sort } = SampleReducer;
    if (SampleReducer.loading === true) return false;
    dispatch(SampleLoading());
    const db = new useHttp();

    db.get(
      URL + `?page=${page}&per_page=${per_page}&filter=${filter}&sort=${sort}`
    )
      .then((result: any) => {
        const files = result.data.data;
        if (files?.length > 0) {
          const response: any = result.data;
          const { data, total } = response;
          const action: any = {
            type: SAMPLE_GET_PAGINATED_LIST,
            payLoad: {
              list: data,
              count: data.length,
              total_records: total,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: SAMPLE_GET_PAGINATED_LIST,
            payLoad: {
              list: [],
              count: 0,
              total_records: 0,
            },
          };
          dispatch(action);
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(SampleLoading(false));
      });
  };
}

export function getSelectedSampleByIdAction(URL: string, modelId: number) {
  return (dispatch: DispatchType, getState: any) => {
    const { SampleReducer } = getState();

    if (SampleReducer.loading === true) return false;
    dispatch(SampleLoading());
    const db = new useHttp();

    db.get(URL + modelId)
      .then((result: any) => {
        if (result) {
          const action: any = {
            type: SAMPLE_GET,
            payLoad: {
              sample: result?.data,
            },
          };
          dispatch(action);
        } else {
          const action: any = {
            type: SAMPLE_GET,
            payLoad: {
              sample: "",
            },
          };
          dispatch(action);
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        dispatch(SampleLoading(false));
      });
  };
}

export const updateSamplePaginationAction = (paginationData: any) => (
  dispatch: DispatchType
) => {
  const { page, per_page } = paginationData;
  batch(() => {
    dispatch({
      type: SAMPLE_PAGNIATION_UPDATE,
      payLoad: { page: page, per_page: per_page },
    });
  });
};

export const updateSamplePaginationFilterAction = (paginationData: any) => (
  dispatch: DispatchType
) => {
  const { filter, page, per_page, sort } = paginationData;
  batch(() => {
    dispatch({
      type: SAMPLE_PAGNIATION_UPDATE,
      payLoad: { filter: filter, page: page, per_page: per_page, sort: sort },
    });
  });
};

export function changeLayoutAction(layoutStyle: any) {
  return (dispatch: DispatchType) => {
    dispatch({
      type: SAMPLE_LAYOUT_STYLE,
      payLoad: { layoutStyle },
    });
  };
}

export const updateSampleIsInitialTableDataLoadedAction = (status: boolean) => (
  dispatch: DispatchType
) => {
  
  batch(() => {
    dispatch({
      type: SAMPLE_IS_INITIAL_TABLE_DATA_LOADED_UPDATE,
      payLoad: { isInitialTableDataLoaded: status },
    });
  });
};
