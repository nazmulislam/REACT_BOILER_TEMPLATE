import initialState from "src/store/initialState";
import {
  SAMPLE_LOADING,
  SAMPLE_FORM_SUBMIT,
  SAMPLE_FORM_HTTP_REQUEST,
  SAMPLE_ADD,
  SAMPLE_GET_PAGINATED_LIST,
  SAMPLE_DELETE,
  SAMPLE_PAGNIATION_UPDATE,
  SAMPLE_SUCCESS_TOAST,
  SAMPLE_GET,
  SAMPLE_LAYOUT_STYLE,
  SAMPLE_UPDATE,
  SAMPLE_IS_INITIAL_TABLE_DATA_LOADED_UPDATE
} from "./SampleTypes";

const SampleReducer = (state: any = initialState.Sample, action: any): any => {
  switch (action.type) {
    case SAMPLE_SUCCESS_TOAST:
      return { ...state, ...action.payLoad };

    case SAMPLE_FORM_SUBMIT:
      return { ...state, ...action.payLoad };

    case SAMPLE_FORM_HTTP_REQUEST:
      return { ...state, ...action.payLoad };

    case SAMPLE_LOADING:
      return { ...state, ...action.payLoad };

  case SAMPLE_IS_INITIAL_TABLE_DATA_LOADED_UPDATE:
        return { ...state, ...action.payLoad };
      
    case SAMPLE_ADD:
      {
        const tableList = state?.list;

        if (state.per_page === parseInt(tableList?.length)) {
          const startIndex = tableList?.length - 1; // Calculate the starting index
          tableList?.splice(startIndex, 1); // Get a new array with the removed elements
        }
  
        return {
          ...state,
          list: [...[action.payLoad], ...tableList],
          total_records: action.total_records,
        };
      }
    

    case SAMPLE_GET_PAGINATED_LIST:
      return { ...state, ...action.payLoad };

    case SAMPLE_PAGNIATION_UPDATE:
      return { ...state, ...action.payLoad };

    case SAMPLE_LAYOUT_STYLE:
      return { ...state, ...action.payLoad };

    case SAMPLE_UPDATE:
      {
        { const { record, listIndex } = action.payLoad;
        const itemData: any = state.list[listIndex];
        state.list[listIndex] = { ...itemData, ...record };
        return state; }
      }
      

    case SAMPLE_GET:
      return { ...state, ...action.payLoad };

    case SAMPLE_DELETE:
      {
        const Data = state.list.filter(
          (listItem: any) =>
            listItem.table_primary_key_id !== action.payLoad.table_primary_key_id
        );
        return { ...state, list: [...Data], total_records: action.total_records };
      }
     
  }

  return state;
};

export { SampleReducer };
