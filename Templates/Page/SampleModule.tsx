// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FC, useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import {
  SampleToolBar,
  SampleTable,
  SamplePaginator,
  SampleSidebar,
  useSampleHook
} from "src/Modules/Sample";
import PropTypes from "prop-types";

  
const SampleModule: FC = () => {

  const [ showSidebar, setShowSidebar ] = useState<boolean>( false );

  
  const onClickNewBtn = () => setShowSidebar( true );

  const {
    SampleLoading,
    SampleHTTPRequest,
    SampleSubmit,
    getPaginatedSampleListFromStore,
    SampleLayoutType,
    changeSampleLayoutType,
    getPaginatedSampleList,
    updateSampleIsInitialTableDataLoaded,
    clearSampleDataHook
  } = useSampleHook();
  const items = getPaginatedSampleListFromStore;
  useEffect( () => {
    /**
     * Check if store is empty, else get
     */
    if ( !items ) {
      getPaginatedSampleList();
    }

    return () =>{
      updateSampleIsInitialTableDataLoaded(false)
    }
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps


  const onChangeLayout = ( type: string = "table" ) => {
    changeSampleLayoutType( type );
  };

  return (
    <>
    
      <Sidebar
        dismissable={ false }
        className="p-sidebar-lg"
        position="right"
        visible={ showSidebar }
        onHide={ () => setShowSidebar( false ) }
        showCloseIcon={ !SampleSubmit }
      >
        <SampleSidebar setShowSidebar={ setShowSidebar } />
      </Sidebar>

      <SampleToolBar
        heading={ "HeadingText" }
        newBtn={ onClickNewBtn }
        showLayoutBtns={ false }
        showSearchFilter={ true }
        changeLayout={ onChangeLayout }
        layoutType={ SampleLayoutType }
      />
      <div className="grid">
      <div className="col-12">
            <SampleTable
              items={ items }
              loading={ SampleLoading }
            />
          </div>
      </div>
      <SamplePaginator />
    </>
  );
};

SampleModule.propTypes = {

};
SampleModule.defaultProps = {
  
};
export { SampleModule };
