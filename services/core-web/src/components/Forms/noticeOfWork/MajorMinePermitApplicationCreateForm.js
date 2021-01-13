import React from "react";
import PropTypes from "prop-types";
import { reduxForm, Field } from "redux-form";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Button, Col, Row } from "antd";
import { compose } from "redux";
import { connect } from "react-redux";
import { required, date } from "@common/utils/Validate";
import { resetForm } from "@common/utils/helpers";
import { getDropdownNoticeOfWorkApplicationTypeOptions } from "@common/selectors/staticContentSelectors";
import * as FORM from "@/constants/forms";
import CustomPropTypes from "@/customPropTypes";
import { renderConfig } from "@/components/common/config";

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  applicationTypeOptions: PropTypes.arrayOf(CustomPropTypes.options).isRequired,
  minePermits: PropTypes.arrayOf(CustomPropTypes.permit).isRequired,
};

export const MajorMinePermitApplicationCreateForm = (props) => (
  <Form layout="vertical" onSubmit={props.handleSubmit}>
    <Row>
      <Col span={24}>
        <Form.Item>
          <Field
            id="permit_guid"
            name="permit_guid"
            label="Select a Permit *"
            component={renderConfig.SELECT}
            data={props.minePermits}
            validate={[required]}
          />
        </Form.Item>
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <Form.Item>
          <Field
            id="notice_of_work_type_code"
            name="notice_of_work_type_code"
            label="Permit Application Type *"
            component={renderConfig.SELECT}
            data={props.applicationTypeOptions}
            validate={[required]}
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item>
          <Field
            id="submitted_date"
            name="submitted_date"
            label="Submitted Date *"
            component={renderConfig.DATE}
            validate={[required, date]}
          />
        </Form.Item>
        <Form.Item>
          <Field
            id="received_date"
            name="received_date"
            label="Received Date *"
            component={renderConfig.DATE}
            validate={[required, date]}
          />
        </Form.Item>
      </Col>
    </Row>
    <div className="right center-mobile">
      <Button className="full-mobile" type="primary" htmlType="submit" loading={props.submitting}>
        {props.title}
      </Button>
    </div>
  </Form>
);

const mapStateToProps = (state) => ({
  applicationTypeOptions: getDropdownNoticeOfWorkApplicationTypeOptions(state),
});

MajorMinePermitApplicationCreateForm.propTypes = propTypes;

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: FORM.MAJOR_MINE_PERMIT_APPLICATION_CREATE,
    touchOnBlur: false,
    onSubmitSuccess: resetForm(FORM.MAJOR_MINE_PERMIT_APPLICATION_CREATE),
  })
)(MajorMinePermitApplicationCreateForm);
