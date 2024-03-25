import { useEffect,useState } from "react";
import { useSampleHook } from ".";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FormSkeleton } from "src/components/Skeleton";
import { useGlobalHook } from "src/hooks";
import { useTranslation } from 'react-i18next';
import PropTypes from "prop-types";
type Props = {
  sampleId: number | null,
  setSampleId: (value: number | null) => void,
  setShowSidebar: (value: boolean) => void
}

const SampleSidebar = (props: Props) => {
  const {
    saveForm,
    updateForm,
    SampleLoading,
    SampleSubmit,
    getSelectedSampleById,
    clearSampleDataHook,
    getSampleByIdFromStore,
  } = useSampleHook();
  const { updateGlobalToast } = useGlobalHook();
  const [isSaveAndExit, setIsSaveAndExit] = useState<boolean>(false);
  const { sampleId, setSampleId, setShowSidebar } = props;
  const { t } = useTranslation();
  useEffect(() => {
    if (sampleId && getSampleByIdFromStore === null) {
      getSelectedSampleById(sampleId);
    } else {
      formik.setFieldValue(
        "title_field",
        getSampleByIdFromStore?.title_field
          ? getSampleByIdFromStore?.title_field
          : ""
      );
    }

    return () => {
      if (sampleId) {
        clearSampleDataHook();
        setSampleId(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSampleByIdFromStore]);

  const validationToast = () => {
    updateGlobalToast({
      showToast: true,
      toastMessage: "Error! Please fill in all the fields with * before them.",
      toastDetail: null,
      toastType: "error",
    });
  };

  const formik: any = useFormik({
    initialValues: {
      title_field: "",
    },
    validate: (data: any) => {
      const errors: any = {};

      if (!data.title_field) {
        errors.title_field = `${t('title_field is required.')}`;
      }
      return errors;
    },
    onSubmit: (data: any) => {
      const formPostData = {
        title_field: data.title_field,
      };

      if (sampleId) {
        updateForm(sampleId, formPostData, formik.resetForm,isSaveAndExit, setShowSidebar);
      } else {
        saveForm(formPostData, formik.resetForm,isSaveAndExit, setShowSidebar);
      }
    },
  });

  const isFormFieldValid = (name: any) => {
    return !!(formik.touched[name] && formik.errors[name]);
  };
  const getFormErrorMessage = (name: any) => {
    return (
      isFormFieldValid(name) && (
        <small className="block error">{formik.errors[name]}</small>
      )
    );
  };

  return (
    <>
    
    <div className="card">
        <div className="text-3xl font-medium text-900 mb-3">
        {sampleId ? `${t('Edit HeadingText')}` : `${t('Add New HeadingText')}`}
        </div>
        <div className="font-medium text-500 mb-3">
          Sample text here
        </div>
        <hr />
      
      {SampleLoading ? (
        <FormSkeleton />
      ) : (
        
        <form onSubmit={formik.handleSubmit}>
          <div className="grid p-fluid">
            <div className="col-12">
              <div className="scroll-height-300 mb-5">
                <div className="field">
                  <label className="block">
                    <span className="must-required">*</span>&nbsp;<span>{t('HeadingText')}</span>
                  </label>
                  <InputText
                    placeholder={t('Enter HeadingText')}
                    id="title_field"
                    name="title_field"
                    value={formik.values.title_field || ""}
                    onChange={formik.handleChange}
                    className={classNames({
                      invalid: isFormFieldValid("title_field"),
                    })}
                  />
                  {getFormErrorMessage("title_field")}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 py-3 surface-100 text-right sidebar-footer">
            <div className="text-right">
              <Button
              text
                onClick={() => setShowSidebar(false)}
                icon="pi pi-times"
                type="button"
                label={t('Cancel')}
                className=" p-button-danger p-component mr-3"
                disabled={SampleSubmit}
              />
              <Button
                type="submit"
                label={sampleId ? `${t('Update HeadingText')}` : `${t('Create HeadingText')}`}
                className="p-button p-button-primary p-button-outlined mr-3"
                disabled={SampleSubmit}
                loading={SampleSubmit}
                onClick={() => {
                  if (Object.keys(formik.errors).length !== 0) {
                    validationToast();
                   
                  } else {
                    setIsSaveAndExit(false)
                  }
                  formik.handleSubmit();
                }}
              />
              <Button
                type="submit"
                label={sampleId ? `${t('Update HeadingText')}` : `${t('Create HeadingText')}`}
                className="p-button p-button-primary"
                disabled={SampleSubmit}
                loading={SampleSubmit}
                onClick={() => {
                  if (Object.keys(formik.errors).length !== 0) {
                    validationToast();
                    
                  } else {
                    setIsSaveAndExit(true)
                  }
                  formik.handleSubmit();
                }}
              />
            </div>
          </div>
        </form>
      )}
    </div>
    </>
  );
};
SampleSidebar.propTypes = {
  setSampleId: PropTypes.func,
  sampleId: PropTypes.number,
  setShowSidebar: PropTypes.func,

};
SampleSidebar.defaultProps = {
  sampleId: null,
  setSampleId: () => {},
  setShowSidebar: () => {}
};
export { SampleSidebar };
