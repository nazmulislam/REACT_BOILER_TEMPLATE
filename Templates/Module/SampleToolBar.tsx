// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input } from "src/Styles";
import { Toolbar as ToolBarPrime } from "primereact/toolbar";
import { useSampleHook } from "./SampleHook";
import { useTranslation } from 'react-i18next';

type Props = {
  newBtn: () => void;
  heading: string;
  btnHide: boolean;
  showSearchFilter: boolean;
  layoutType?: string;
  showLayoutBtns?: boolean;
  changeLayout?: (layout:string) => void;
};
const SampleToolBar = (props: Props | any) => {
  const { t, i18n } = useTranslation();
  const {
    newBtn,
    heading,
    btnHide,
    showSearchFilter,
    label,
    layoutType,
    changeLayout,
    showLayoutBtns,
  } = props;

  const {
    getPaginatedSampleList,
    updateSamplePaginationFilterSearch,
    SampleLoading,
    SampleFilter,
  } = useSampleHook();
  const [searhValue, setSearhValue] = useState<any>("");

  const Refresh = () => {
    getPaginatedSampleList();
  };
  /**
   * Handler for setting serach text
   * @param event
   */
  const changeSearchInputValue = (event: any) => {
    setSearhValue(event.target.value);
  };

  /**
   * Handles the user dynamic input text search
   */
  const searchHandler = () => {
    updateSamplePaginationFilterSearch({
      filter: searhValue,
      page: 1,
      per_page: 10,
      sort: "TABLE_NAME.created_at|desc",
    });
  };

  /**
   * Handler for clearing the search text
   */
  const onPressClear = () => {
    setSearhValue("");

    updateSamplePaginationFilterSearch({
      filter: "",
      page: 1,
      per_page: 10,
      sort: "TABLE_NAME.created_at|desc",
    });
  };

  useEffect(() => {
    if (!SampleLoading) {
      getPaginatedSampleList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SampleFilter]);

  /**
   * Toolbar left content
   */
  const leftContents = (
    <React.Fragment>
      {heading && (
        <div style={{ width: "350px" }}>
          <h3 className="mr-5 mb-0">
            <i className={`mx-2 text-bold pi-fs-2 pi`} />
            {heading}
          </h3>
        </div>
      )}
    </React.Fragment>
  );

  /**
   * Toolbar right content
   */
  const rightContents = (
    <React.Fragment>
      {!btnHide && (
        <Button
     
          onClick={newBtn}
          label={label}
          icon="pi pi-plus"
          className="mr-2 p-button-primary"
          disabled={SampleLoading}
        />
      )}

      <React.Fragment>
        <Button
         text
          icon="pi pi-refresh"
          className=" p-button-info right-spacing"
          aria-label="Bookmark"
          onClick={Refresh}
          tooltip="Reload Table" tooltipOptions={{ position: 'bottom', mouseTrack: false, mouseTrackTop: 15 }}
          disabled={SampleLoading}
        />
      </React.Fragment>

      {showLayoutBtns && (
        <React.Fragment>
          <span className="p-buttonset">
            <Button
              text
              className={`${layoutType === "table" ? "button-low-opac" : ""}`}
              icon="pi pi-th-large"
              onClick={() => changeLayout("grid")}
              tooltip="Grid view" tooltipOptions={{ position: 'bottom', mouseTrack: false, mouseTrackTop: 15 }}
              disabled={SampleLoading}
            />
            <Button
               text
              className={`${layoutType === "grid" ? "button-low-opac" : ""}`}
              icon="pi pi-bars"
              onClick={() => changeLayout("table")}
              tooltip="Table view" tooltipOptions={{ position: 'bottom', mouseTrack: false, mouseTrackTop: 15 }}
              disabled={SampleLoading}
            />
          </span>
        </React.Fragment>
      )}
      {showSearchFilter && (
        <React.Fragment>
          <span className="p-input-icon-right">
            {searhValue ? (
              <i className="pi pi-times" onClick={() => onPressClear()} />
            ) : (
              <></>
            )}

            <Input
              value={searhValue}
              onChange={(event) => changeSearchInputValue(event)}
              placeholder={t('Type here to search')}
              onKeyDown={ ( event: any ) => {
                if ( event.key === "Enter" ) {
                  searchHandler();
                }
              } }
              disabled={SampleLoading}
            />
          </span>
          <Button
           text
            icon="pi pi-search"
            className="mr-2"
            onClick={() => searchHandler()}
            disabled={SampleLoading}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );

  return (
    <>
      <ToolBarPrime
        className="tool-bar mb-3"
        start={leftContents}
        end={rightContents}
      />
    </>
  );
};

SampleToolBar.defaultProps = {
  newBtn: () => {},
  changeLayout: () => {},
  isDisabled: true,
  btnHide: false,
  showLayoutBtns: true,
  showSearchFilter: true,
  heading: "",
  label: "New",
  layoutType: "table",
};
SampleToolBar.propTypes = {
  newBtn: PropTypes.func,
  changeLayout: PropTypes.func,
  heading: PropTypes.string,
  btnHide: PropTypes.bool,
  showLayoutBtns: PropTypes.bool,
  showSearchFilter: PropTypes.bool,
  label: PropTypes.string,
  layoutType: PropTypes.string,
};

export { SampleToolBar };
