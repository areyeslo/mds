import React from "react";
import PropTypes from "prop-types";
import WorkerInformation from "@/components/Forms/mines/WorkerInformation";

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  mineGuid: PropTypes.string.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.any),
};

const defaultProps = { initialValues: {} };

export const EditWorkerInfoModal = (props) => (
  <WorkerInformation
    onSubmit={props.onSubmit}
    closeModal={props.closeModal}
    title={props.title}
    mineGuid={props.mineGuid}
    initialValues={props.initialValues}
  />
);

EditWorkerInfoModal.propTypes = propTypes;
EditWorkerInfoModal.defaultProps = defaultProps;

export default EditWorkerInfoModal;
