import React from "react";
import PropTypes from "prop-types";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Button, Col, Row, Popconfirm } from "antd";
import { Field, reduxForm } from "redux-form";
import { integer, required } from "@common/utils/Validate";
import { renderConfig } from "@/components/common/config";
import * as FORM from "@/constants/forms";

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export const EditWorkerInformationForm = (props) => (
  <Form layout="vertical" onSubmit={props.handleSubmit}>
    <Row gutter={[0, 16]}>
      <Col lg={{ span: 14 }} xl={{ span: 16 }}>
        <Form.Item>
          <Field
            id="number_of_mine_employees"
            name="number_of_mine_employees"
            label="Number of Mine Employees"
            component={renderConfig.FIELD}
            validate={[integer, required]}
          />
        </Form.Item>
      </Col>
      <Col lg={{ span: 14 }} xl={{ span: 16 }}>
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
    </Row>
    <div className="right center-mobile">
      <Popconfirm
        placement="topRight"
        title="Are you sure you want to cancel?"
        onConfirm={console.log()}
        okText="Yes"
        cancelText="No"
        disabled={props.submitting}
      >
        <Button className="full-mobile" type="secondary" disabled={props.submitting}>
          Cancel
        </Button>
      </Popconfirm>
      <Button className="full-mobile" type="primary" htmlType="submit" loading={props.submitting}>
        Update
      </Button>
    </div>
  </Form>
);

EditWorkerInformationForm.propTypes = propTypes;

export default reduxForm({
  form: FORM.EDIT_EMPLOYEE_COUNT,
  touchOnBlur: false,
  enableReinitialize: true,
})(EditWorkerInformationForm);
