/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { maxBy } from "lodash";
import { Divider } from "antd";
import Condition from "@/components/Forms/permits/conditions/Condition";
import AddCondition from "@/components/Forms/permits/conditions/AddCondition";

const permitConditions = [
  {
    condition: "Testing Section",
    condition_category_code: "GEC",
    condition_type_code: "SEC",
    display_order: 1,
    parent_permit_condition_id: null,
    permit_amendment_id: 53,
    permit_condition_guid: "2707723f-58fc-45d7-835a-7d48a715ada9",
    permit_condition_id: 254,
    step: "1.",
    sub_conditions: [
      {
        condition: "testing",
        condition_category_code: "GEC",
        condition_type_code: "CON",
        display_order: 1,
        parent_permit_condition_id: 254,
        permit_amendment_id: 53,
        permit_condition_guid: "d9f19b66-3a05-438c-93f3-07d6cdb053f4",
        permit_condition_id: 255,
        step: "a.",
        sub_conditions: [
          {
            condition: "list item 1",
            condition_category_code: "GEC",
            condition_type_code: "LIS",
            display_order: 1,
            parent_permit_condition_id: 255,
            permit_amendment_id: 53,
            permit_condition_guid: "04549039-8306-4b95-b34b-1973506e65fd",
            permit_condition_id: 256,
            step: "i.",
          },
        ],
      },
    ],
  },
];

const propTypes = {
  handleDelete: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  condition: PropTypes.objectOf(PropTypes.any).isRequired,
};

export class ConditionTourModal extends Component {
  render() {
    return (
      <>
        {this.props.permitConditionCategoryOptions.map((conditionCategory) => {
          const conditions = permitConditions.filter(
            (condition) =>
              condition.condition_category_code === conditionCategory.condition_category_code
          );
          <div>
            {conditions.map((condition) => (
              <Condition
                condition={condition}
                reorderConditions={this.props.reorderConditions}
                handleSubmit={this.props.handleEdit}
                handleDelete={this.props.openDeleteConditionModal}
                setConditionEditingFlag={this.props.setConditionEditingFlag}
                editingConditionFlag={this.props.editingConditionFlag}
              />
            ))}
            <Divider />
            <AddCondition
              initialValues={{
                condition_category_code: conditionCategory.condition_category_code,
                condition_type_code: "SEC",
                display_order:
                  conditions.length === 0
                    ? 1
                    : maxBy(conditions, "display_order").display_order + 1,
                permit_amendment_id: this.props.draftPermitAmendment.permit_amendment_id,
              }}
            />
          </div>;
        })}
      </>
    );
  }
}

ConditionTourModal.propTypes = propTypes;

export default ConditionTourModal;
