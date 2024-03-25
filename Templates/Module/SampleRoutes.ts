import { SampleReducer } from "src/store/Reducers";
export const SampleRoutes = [

  {
    path: "/ROUTE",
    component: "SampleModule",
    label: "Sample",
    isPrivate: true,
    hasAccess: false,
    module_identifier: "module_scope",
    reducers: [{
      key: "SampleReducer",
      reducer: SampleReducer,
    }],
  },



  
];
