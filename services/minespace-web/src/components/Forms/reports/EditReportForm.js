import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Popconfirm, Col, Form, Row } from "antd";
import { Field, reduxForm } from "redux-form";
import { required, integer } from "@common/utils/Validate";
import CustomPropTypes from "@/customPropTypes";
import * as FORM from "@/constants/forms";
import { renderConfig } from "@/components/common/config";

const propTypes = {
  // mineGuid: PropTypes.string.isRequired,
  mineReport: CustomPropTypes.mineReport.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  // closeModal: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]).isRequired,
  change: PropTypes.func.isRequired,
};

export class EditReportForm extends Component {
  state = {
    mineReportSubmissions: this.props.mineReport.mine_report_submissions,
  };

  updateMineReportSubmissions = (updatedSubmissions) => {
    this.setState({ mineReportSubmissions: updatedSubmissions }, () =>
      this.props.change("mine_report_submissions", this.state.mineReportSubmissions)
    );
  };

  render() {
    return (
      <Form layout="vertical" onSubmit={console.log()}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item>
              <Field
                id="number_of_contractors"
                name="number_of_contractors"
                label="Number of Contractors"
                component={renderConfig.FIELD}
                validate={[integer, required]}
              />
            </Form.Item>
          </Col>
          <Col span={12} xs={24}>
            <Form.Item>
              <Field
                id="number_of_mine_employees"
                name="number_of_mine_employees"
                label="Number of mine employees"
                component={renderConfig.FIELD}
                validate={[integer, required]}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="right center-mobile">
          <Popconfirm
            placement="topRight"
            title="Are you sure you want to cancel?"
            onConfirm={console.log()}
            okText="Yes"
            cancelText="No"
            // disabled={this.props.submitting}
          >
            {/* <Button className="full-mobile" type="secondary" disabled={this.props.submitting}> */}
            <Button className="full-mobile" type="secondary">
              Cancel
            </Button>
          </Popconfirm>
          <Button
            className="full-mobile"
            type="primary"
            htmlType="submit"
            // loading={this.props.submitting}
          >
            {this.props.title}
          </Button>
        </div>
      </Form>
    );
  }
}

EditReportForm.propTypes = propTypes;

export default reduxForm({
  form: FORM.EDIT_REPORT,
  touchOnBlur: true,
})(EditReportForm);
