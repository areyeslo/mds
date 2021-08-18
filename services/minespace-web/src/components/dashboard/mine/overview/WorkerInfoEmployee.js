import React, { Component } from "react";
import PropTypes from "prop-types";
import "@ant-design/compatible/assets/index.css";
import { Button, Col, Descriptions, Row, Typography } from "antd";
import AuthorizationWrapper from "@/components/common/wrappers/AuthorizationWrapper";
import * as Permission from "@/constants/permissions";
import { EDIT_PENCIL } from "@/constants/assets";
import CustomPropTypes from "@/customPropTypes";
import EditWorkerInformationForm from "@/components/Forms/mines/EditWorkerInformationForm";

const { Title } = Typography;

const propTypes = {
  mine: PropTypes.objectOf(CustomPropTypes.mine).isRequired,
  handleEditWorkerInfo: PropTypes.func.isRequired,
};

// eslint-disable-next-line react/prefer-stateless-function
export class WorkerInfoEmployee extends Component {
  state = {
    isEditable: false,
  };

  handleToggleEdit = (event) => {
    event.preventDefault();
    this.setState((prevState) => ({
      isEditable: !prevState.isEditable,
    }));
  };

  render() {
    return (
      <div>
        <div align="right">
          <AuthorizationWrapper permission={Permission.EDIT_WORKER_INFO}>
            <Button
              type="primary"
              size="small"
              ghost
              onClick={(event) => this.handleToggleEdit(event)}
            >
              <img src={EDIT_PENCIL} alt="Edit Worker Info" />
            </Button>
          </AuthorizationWrapper>
        </div>
        {this.state.isEditable ? (
          <div>
            <EditWorkerInformationForm
              initialValues={this.props.mine}
              onSubmit={this.props.handleEditWorkerInfo}
            />
          </div>
        ) : (
          <div>
            <Row gutter={[0, 16]}>
              <Col lg={{ span: 14 }} xl={{ span: 16 }}>
                <Title level={4}>Worker Information</Title>
                <Descriptions column={2} colon={false}>
                  <Descriptions.Item span={2} label="Number of Mine Employees">
                    {this.props.mine.number_of_mine_employees || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item span={2} label="Number of Contractors">
                    {this.props.mine.number_of_contractors || "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  }
}

WorkerInfoEmployee.propTypes = propTypes;

export default WorkerInfoEmployee;
