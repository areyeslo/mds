import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Col, Row, Descriptions, Typography } from "antd";
import CustomPropTypes from "@/customPropTypes";
import AuthorizationWrapper from "@/components/common/wrappers/AuthorizationWrapper";
import * as Permission from "@/constants/permissions";
import { WorkerInfoActions } from "@/components/dashboard/mine/overview/WorkerInfoActions";

const { Title } = Typography;

const propTypes = {
  // handleSubmit: PropTypes.func.isRequired,
  // closeModal: PropTypes.func.isRequired,
  // title: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]).isRequired,
  // formValues: PropTypes.objectOf(PropTypes.any).isRequired,
  mine: PropTypes.objectOf(CustomPropTypes.mine).isRequired,
  // initialValues: PropTypes.objectOf(PropTypes.any),
  openEditWorkerInfoModal: PropTypes.func.isRequired,
  handleEditWorkerInfo: PropTypes.func.isRequired,
};

// const selector = formValueSelector(FORM.EDIT_EMPLOYEE_COUNT);

// const defaultProps = {
//   initialValues: {},
// };

// eslint-disable-next-line react/prefer-stateless-function
export class WorkerInformation extends Component {
  render() {
    console.log(`props${this.props}props`);
    return (
      <Form layout="vertical" onSubmit={console.log()}>
        <div align="right">
          <AuthorizationWrapper permission={Permission.EDIT_WORKER_INFO}>
            <WorkerInfoActions
              mine={this.props.mine}
              openEditWorkerInfoModal={this.props.openEditWorkerInfoModal}
              handleEditWorkerInfo={this.props.handleEditWorkerInfo}
            />
          </AuthorizationWrapper>
        </div>
        <div>
          <Row gutter={[0, 16]}>
            <Col lg={{ span: 14 }} xl={{ span: 16 }}>
              <Title level={4}>Worker Information</Title>
              <Descriptions column={2} colon={false}>
                <Descriptions.Item span={2} label="Number of Mine Employees">
                  {this.props.mine.number_of_mine_employees
                    ? this.props.mine.number_of_mine_employees
                    : 0}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Number of Contractors">
                  {this.props.mine.number_of_contractors
                    ? this.props.mine.number_of_contractors
                    : 0}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </div>
        {/* <div className="right center-mobile">
          <Popconfirm
            placement="topRight"
            title="Are you sure you want to cancel?"
            onConfirm={console.log()}
            okText="Yes"
            cancelText="No"
            disabled={this.props.submitting}
          >
            <Button className="full-mobile" type="secondary" disabled={this.props.submitting}>
              Cancel
            </Button>
          </Popconfirm>
          <Button
            className="full-mobile"
            type="primary"
            htmlType="submit"
            loading={this.props.submitting}
          >
            Save
          </Button>
        </div> */}
      </Form>
    );
  }
}

WorkerInformation.propTypes = propTypes;
// WorkerInformation.defaultProps = defaultProps;

// export default compose(
//   connect((state) => ({
//     selectedNumberOfContractors: selector(state, "number_of_contractors"),
//     selectedNumberOfMineEmployees: selector(state, "number_of_mine_employees"),
//     formMeta: state.form[FORM.EDIT_EMPLOYEE_COUNT],
//   })),
//   reduxForm({
//     form: FORM.EDIT_EMPLOYEE_COUNT,
//     touchOnBlur: false,
//     enableReinitialize: true,
//     onSubmitSuccess: resetForm(FORM.EDIT_EMPLOYEE_COUNT),
//   })
// )(WorkerInformation);
export default WorkerInformation;
