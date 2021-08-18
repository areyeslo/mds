import React from "react";
import PropTypes from "prop-types";
import EditWorkerInformationForm from "@/components/Forms/mines/EditWorkerInformationForm";

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export const EditWorkerInfoModal = (props) => <EditWorkerInformationForm {...props} />;

EditWorkerInfoModal.propTypes = propTypes;
export default EditWorkerInfoModal;
