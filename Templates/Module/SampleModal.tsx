// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect } from "react";
import { useSampleHook } from ".";

import { useTranslation } from 'react-i18next';
import PropTypes from "prop-types";
type Props = {
  sampleId: number | null,
  setSampleId: (id:number) => void
}
const SampleModal = (props: Props) => {
  const {

    getSelectedSampleById,
    clearSampleDataHook,
    getSampleByIdFromStore,
  } = useSampleHook();

  const { sampleId, setSampleId } = props;
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (sampleId && getSampleByIdFromStore === null) {
      getSelectedSampleById(sampleId);
    } 

    return () => {
      if (sampleId) {
        clearSampleDataHook();
        setSampleId(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSampleByIdFromStore]);





  return (
    <>
      <p>Create your content here</p>
    </>
  );
};
SampleModal.propTypes = {
  setSampleId: PropTypes.func,
  sampleId: PropTypes.number

};
SampleModal.defaultProps = {
  sampleId: null,
  setSampleId: () => {}
};
export { SampleModal };
