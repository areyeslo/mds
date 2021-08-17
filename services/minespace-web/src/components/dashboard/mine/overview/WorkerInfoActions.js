import React from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import CustomPropTypes from "@/customPropTypes";
import { EDIT_PENCIL } from "@/constants/assets";

const propTypes = {
  mine: PropTypes.objectOf(CustomPropTypes.mine).isRequired,
  openEditWorkerInfoModal: PropTypes.func.isRequired,
  handleWorkerInfo: PropTypes.func.isRequired,
};

const defaultProps = {};

export const WorkerInfoActions = (props) => (
  <div style={{ width: "max-content" }}>
    <Button
      type="primary"
      size="small"
      ghost
      onClick={(event) => props.openEditWorkerInfoModal(event, props.handleWorkerInfo, props.mine)}
    >
      <img src={EDIT_PENCIL} alt="Edit Worker Info" />
    </Button>
  </div>
);

WorkerInfoActions.propTypes = propTypes;
WorkerInfoActions.defaultProps = defaultProps;

export default WorkerInfoActions;
