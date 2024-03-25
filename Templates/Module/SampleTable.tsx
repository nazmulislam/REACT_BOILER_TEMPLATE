import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import { Button } from "primereact/button";
import { useSampleHook } from "./SampleHook";
import { confirmDialog } from "primereact/confirmdialog";
import { Sidebar } from "primereact/sidebar";
import React,{ useState } from "react";
import { SampleSidebar } from "./SampleSidebar";
import { DataTableSkeleton } from "src/components/Skeleton/DataTableSkeleton";
import { useTranslation } from 'react-i18next';
import { SampleModal } from "./SampleModal";
import { Dialog } from "primereact/dialog";


export const SampleTable = ( props: any ) => {
  const { items, loading,  } = props;

  const { deleteForm, clearSampleDataHook, SampleLoading, SampleSubmit,} = useSampleHook();
  const [ showModal, setShowModal ] = useState<boolean>( false );
  const [ showSampleItemViewSidebar, setShowSampleItemViewSidebar ] = useState<boolean>(
    false
  );

  const [ sampleId, setSampleId ] = useState<any>();
  const { t, i18n } = useTranslation();

  const deleteRowHandler = ( row: any ) => {
    confirmDialog( {
      message: t('Do you want to delete this record?'),
      header: t('Delete Confirmation'),
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => {
        deleteForm( row );
      },
      reject: () => { },
    } );
  };

  const actionBodyTemplate = ( row: any ) => {
    return (
      <>
        <Button
        text
          type="button"
          className="p-button-info "
          onClick={ () => {
            setSampleId( row?.table_primary_key_id );
            setShowSampleItemViewSidebar( true );
          } }
          icon="pi pi-pencil"
        ></Button>

      <Button
       text
          type="button"
          className="p-button-info "
          onClick={ () => {
            setSampleId( row?.table_primary_key_id );
            setShowModal( true );
          } }
          icon="pi pi-eye"
        ></Button>

        <Button
         text
          type="button"
          className="p-button-danger left-space"
          onClick={ () => deleteRowHandler( row ) }
          icon="pi pi-trash"
        ></Button>
      </>
    );
  };

  return (
    <>
      <Dialog
      maximizable
      onHide={()=>{setShowModal(false)}}
      header="Sample"
      visible={showModal}
      style={{ width: "50vw" }}
      footer={() => (
        <>
        <Button label="Close" className="p-button-danger" onClick={() => setShowModal(false)} />
          
        </>
      )}
      >
          <SampleModal />
      </Dialog>

      <Sidebar
            dismissable={ false }
            className="p-sidebar-lg"
            position="right"
            visible={ showSampleItemViewSidebar }
            onHide={ () => setShowSampleItemViewSidebar( false ) }
            showCloseIcon={ !SampleSubmit }
          >
            <SampleSidebar
              sampleId={ sampleId }
              setSampleId={ setSampleId }
              setShowSidebar={ setShowSampleItemViewSidebar }
            />
          </Sidebar>
      <div>
        <div>


         

          { !loading ? (
            <DataTable value={ items } scrollable scrollHeight="calc(100vh - 350px)"
            >
              <Column
                style={ { width: "10%" } }
                field="table_primary_key_id"
                header={t('ID')}
                sortable
              ></Column>

              <Column
                style={ { width: "10%" } }
                field="created_at"
                header={t('Created')}
                body={ ( row ) => (
                  <>{ moment( row?.created_at ).format( "Do MMM YYYY HH:mm" ) }</>
                ) }
                sortable
              ></Column>

              <Column
                style={ { width: "10%" } }
                field="title_field"
                header={t('title_label')}

            
              ></Column>



              <Column
                style={ { width: "10%" } }
                headerStyle={ { textAlign: "center" } }
                bodyStyle={ { textAlign: "center", overflow: "visible" } }
                body={ ( e ) => actionBodyTemplate( e ) }
              />
            </DataTable>
          ) : (
            <DataTableSkeleton
              noOfRows={ 15 }
              columns={ [
                { field: "table_primary_key_id", header: "ID" },
                { field: "created_at", header: t('Created') },
              ] }
            />
          ) }
        </div>
      </div>
    </>
  );
};
