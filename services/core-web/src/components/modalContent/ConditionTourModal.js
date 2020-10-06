/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import AddButton from "@/components/common/AddButton";
import { Divider } from "antd";
import Joyride, { STATUS } from "react-joyride";
import Condition from "@/components/Forms/permits/conditions/Condition";

const permitConditions = [
  {
    condition: "Permit Approval",
    condition_category_code: "GEC",
    condition_type_code: "SEC",
    display_order: 1,
    parent_permit_condition_id: null,
    permit_amendment_id: 53,
    permit_condition_guid: "22562465",
    permit_condition_id: 254,
    step: "1.",
    sub_conditions: [
      {
        condition:
          "Write out activities and total disturbance as indicated in the Notice of Work application (that you approve of – you must specify activities that were applied for that you do not approve of if there are any)",
        condition_category_code: "GEC",
        condition_type_code: "CON",
        display_order: 1,
        parent_permit_condition_id: 254,
        permit_amendment_id: 53,
        permit_condition_guid: "d326134",
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
            permit_condition_guid: "13464136",
            permit_condition_id: 256,
            step: "i.",
          },
        ],
      },
    ],
  },
  {
    condition: "Permit",
    condition_category_code: "GEC",
    condition_type_code: "SEC",
    display_order: 1,
    parent_permit_condition_id: null,
    permit_amendment_id: 53,
    permit_condition_guid: "13461346",
    permit_condition_id: 254,
    step: "2.",
    sub_conditions: [
      {
        condition: "This Permit is not transferable or assignable.",
        condition_category_code: "GEC",
        condition_type_code: "LIS",
        display_order: 1,
        parent_permit_condition_id: 255,
        permit_amendment_id: 53,
        permit_condition_guid: "13461346",
        permit_condition_id: 256,
        step: "i.",
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
  state = {
    run: true,
    steps: [
      {
        content:
          "Virtual Demonstration of how to create permit conditions inside CORE! Click Next to start the tour.",
        target: "body",
        placement: "center",
      },
      {
        target: ".field-title",
        content:
          "This is a Sub-section title, it is used to organize conditions into similar categories",
      },
      {
        target: ".add-btn",
        content: "Click here if you would like to create another Sub-Section!",
      },
      {
        target: ".ant-btn-background-ghost.ant-btn-primary",
        content: "This another awesome feature!",
      },
      {
        target: ".ant-btn-background-ghost.ant-btn-primary",
        content: "This is my awesome feature!",
      },
      {
        target: ".ant-btn-background-ghost.ant-btn-primary",
        content: "This another awesome feature!",
      },
      {
        target: ".ant-btn.full-mobile.btn--middle.ant-btn-secondary",
        content: "This is my awesome feature!",
      },
      {
        target: ".ant-btn.full-mobile.btn--middle.ant-btn-secondary",
        content: "This another awesome feature!",
      },
    ],
  };

  reorderConditions = (condition, isMoveUp) => {
    console.log(condition);
    condition.display_order = isMoveUp ? condition.display_order - 1 : condition.display_order + 1;
  };

  handleEdit = (values) => {
    console.log("editing");
  };

  handleJoyrideCallback = (data) => {
    const { status, type } = data;
    if ([STATUS.FINISHED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ run: false });
      this.props.closeModal();
    }

    console.groupCollapsed(type);
    console.log(data); //eslint-disable-line no-console
    console.groupEnd();
  };

  render() {
    return (
      <>
        <div>
          <Joyride
            steps={this.state.steps}
            callback={this.handleJoyrideCallback}
            continuous
            showProgress
            run={this.state.run}
            styles={{
              options: {
                // arrowColor: "#e3ffeb",
                // backgroundColor: "#e3ffeb",
                // overlayColor: "rgba(79, 26, 0, 0.4)",
                // primaryColor: "#7c66ad",
                // textColor: "#004a14",
                zIndex: 1000,
              },
            }}
          />
          {permitConditions.map((condition) => (
            <Condition
              condition={condition}
              reorderConditions={this.reorderConditions}
              handleSubmit={this.handleEdit}
              handleDelete={() => {}}
              setConditionEditingFlag={this.props.setConditionEditingFlag}
              editingConditionFlag={this.props.editingConditionFlag}
            />
          ))}
          <Divider />
          <AddButton type="secondary" onClick={() => {}} className="add-btn">
            Add Sub-Section
          </AddButton>
          {/* <AddCondition
            initialValues={{
              condition_category_code: "HSC",
              condition_type_code: "SEC",
              display_order: 2,
              permit_amendment_id: this.props.draftPermitAmendment.permit_amendment_id,
            }}
          /> */}
        </div>
      </>
    );
  }
}

ConditionTourModal.propTypes = propTypes;

export default ConditionTourModal;
