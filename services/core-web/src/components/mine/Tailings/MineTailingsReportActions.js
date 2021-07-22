import React from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import { EDIT_OUTLINE_VIOLET } from "@/constants/assets";
import CustomPropTypes from "@/customPropTypes";

const propTypes = {
  tailingsStorageFacility: CustomPropTypes.tailingsStorageFacility.isRequired,
  openEditTailingsModal: PropTypes.func.isRequired,
  handleEditTailings: PropTypes.func.isRequired,
};

const defaultProps = {};

export const MineTailingsReportActions = (props) => (
  <div style={{ width: "max-content" }}>
    <Button
      type="primary"
      size="small"
      ghost
      onClick={(event) =>
        props.openEditTailingsModal(event, props.handleEditTailings, props.tailingsStorageFacility)
      }
    >
      <img src={EDIT_OUTLINE_VIOLET} alt="Edit Mine Tailing" />
    </Button>
  </div>
);

MineTailingsReportActions.propTypes = propTypes;
MineTailingsReportActions.defaultProps = defaultProps;

export default MineTailingsReportActions;
