import React, { useState } from "react";
import PropTypes from "prop-types";
import { Col, Row, Button } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { maxBy } from "lodash";
import { TRASHCAN, EDIT_OUTLINE_VIOLET } from "@/constants/assets";
import NOWActionWrapper from "@/components/noticeOfWork/NOWActionWrapper";
import * as Permission from "@/constants/permissions";
import ConditionLayerTwo from "@/components/Forms/permits/conditions/ConditionLayerTwo";
import ConditionForm from "@/components/Forms/permits/conditions/ConditionForm";
import AddCondition from "./AddCondition";

const propTypes = {
  condition: PropTypes.objectOf(PropTypes.any),
  new: PropTypes.bool,
  handleSubmit: PropTypes.func,
  handleCancel: PropTypes.func,
  handleDelete: PropTypes.func,
  reorderConditions: PropTypes.func,
  setConditionEditingFlag: PropTypes.func,
  initialValues: PropTypes.objectOf(PropTypes.any),
  editingConditionFlag: PropTypes.bool.isRequired,
  isViewOnly: PropTypes.bool,
  isAdminControl: PropTypes.bool,
};

const defaultProps = {
  condition: undefined,
  isAdminControl: false,
  new: false,
  handleSubmit: () => {},
  handleCancel: () => {},
  handleDelete: () => {},
  reorderConditions: () => {},
  setConditionEditingFlag: () => {},
  initialValues: {},
  isViewOnly: false,
};

const ConditionLayerOne = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [isEditing, setIsEditing] = useState(props.new);
  return (
    <>
      {props.condition &&
        props.condition.sub_conditions.length === 0 &&
        props.condition.display_order !== 1 && (
          <Row gutter={32}>
            <Col span={24}>&nbsp;</Col>
          </Row>
        )}
      <Row gutter={[16, 24]} className={isEditing || props.isViewOnly ? "" : "hover-row"}>
        {!isEditing && <Col span={props.isViewOnly ? 2 : 1}>{props.condition.step}</Col>}
        {!isEditing && (
          <Col
            span={props.isViewOnly ? 17 : 18}
            className={props.condition.condition_type_code === "SEC" ? "field-title" : ""}
          >
            {props.condition.condition}
          </Col>
        )}
        <Col span={4} className="float-right show-on-hover">
          {!isEditing && !props.isViewOnly && (
            <div className="float-right">
              <NOWActionWrapper
                permission={Permission.EDIT_PERMITS}
                tab="DFT"
                isAdminControl={props.isAdminControl}
              >
                <Button
                  className="no-margin"
                  ghost
                  size="small"
                  type="primary"
                  onClick={() => {
                    props.reorderConditions(props.condition, true);
                  }}
                  disabled={props.editingConditionFlag}
                >
                  <UpOutlined />
                </Button>
              </NOWActionWrapper>
              <NOWActionWrapper
                permission={Permission.EDIT_PERMITS}
                tab="DFT"
                isAdminControl={props.isAdminControl}
              >
                <Button
                  ghost
                  className="no-margin"
                  size="small"
                  type="primary"
                  onClick={() => {
                    props.reorderConditions(props.condition, false);
                  }}
                  disabled={props.editingConditionFlag}
                >
                  <DownOutlined />
                </Button>
              </NOWActionWrapper>
              <NOWActionWrapper
                permission={Permission.EDIT_PERMITS}
                tab="DFT"
                isAdminControl={props.isAdminControl}
              >
                <Button
                  ghost
                  className="no-margin"
                  size="small"
                  type="primary"
                  onClick={() => {
                    props.setConditionEditingFlag(true);
                    setIsEditing(!isEditing);
                  }}
                  disabled={props.editingConditionFlag}
                >
                  <img
                    className={props.editingConditionFlag ? "disabled-icon" : ""}
                    name="edit"
                    src={EDIT_OUTLINE_VIOLET}
                    alt="Edit Condition"
                  />
                </Button>
              </NOWActionWrapper>
              <NOWActionWrapper
                permission={Permission.EDIT_PERMITS}
                tab="DFT"
                isAdminControl={props.isAdminControl}
              >
                <Button
                  className="no-margin"
                  ghost
                  size="small"
                  type="primary"
                  onClick={() => props.handleDelete(props.condition)}
                  disabled={props.editingConditionFlag}
                >
                  <img
                    className={props.editingConditionFlag ? "disabled-icon" : ""}
                    name="remove"
                    src={TRASHCAN}
                    alt="Remove Condition"
                  />
                </Button>
              </NOWActionWrapper>
            </div>
          )}
        </Col>
      </Row>
      {isEditing && (
        <ConditionForm
          onCancel={() => {
            setIsEditing(!isEditing);
            props.setConditionEditingFlag(false);
            props.handleCancel(false);
          }}
          onSubmit={(values) => props.handleSubmit(values).then(() => setIsEditing(!isEditing))}
          initialValues={props.condition || props.initialValues}
          layer={1}
        />
      )}
      {props.condition &&
        props.condition.sub_conditions.map((condition) => (
          <ConditionLayerTwo
            isAdminControl={props.isAdminControl}
            condition={condition}
            reorderConditions={props.reorderConditions}
            handleSubmit={props.handleSubmit}
            handleDelete={props.handleDelete}
            setConditionEditingFlag={props.setConditionEditingFlag}
            editingConditionFlag={props.editingConditionFlag}
            isViewOnly={props.isViewOnly}
          />
        ))}
      {!isEditing && !props.isViewOnly && (
        <Row gutter={32}>
          <Col span={22}>
            <AddCondition
              initialValues={{
                condition_category_code: props.condition.condition_category_code,
                condition_type_code: "CON",
                display_order:
                  props.condition.sub_conditions.length === 0
                    ? 1
                    : maxBy(props.condition.sub_conditions, "display_order").display_order + 1,
                parent_permit_condition_id: props.condition.permit_condition_id,
                permit_amendment_id: props.condition.permit_amendment_id,
                parent_condition_type_code: props.condition.condition_type_code,
                sibling_condition_type_code:
                  props.condition.sub_conditions.length === 0
                    ? null
                    : props.condition.sub_conditions[0].condition_type_code,
              }}
              layer={1}
            />
          </Col>
        </Row>
      )}
      <Row gutter={32}>
        <Col span={24}>&nbsp;</Col>
      </Row>
    </>
  );
};

ConditionLayerOne.propTypes = propTypes;
ConditionLayerOne.defaultProps = defaultProps;

export default ConditionLayerOne;
