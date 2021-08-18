import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";
import { Row, Col, Card, Descriptions, Typography } from "antd";
import { getPartyRelationships } from "@common/selectors/partiesSelectors";
import {
  getMineRegionHash,
  getDisturbanceOptionHash,
  getCommodityOptionHash,
} from "@common/selectors/staticContentSelectors";
import { getTransformedMineTypes } from "@common/selectors/mineSelectors";
import { updateMineRecord } from "@common/actionCreators/mineActionCreator";
import { openModal, closeModal } from "@common/actions/modalActions";
import { WorkerInfoEmployee } from "./WorkerInfoEmployee";
import { getUserInfo } from "@/selectors/authenticationSelectors";
import CustomPropTypes from "@/customPropTypes";
import ContactCard from "@/components/common/ContactCard";
import MinistryContactItem from "@/components/dashboard/mine/overview/MinistryContactItem";
import * as Strings from "@/constants/strings";
import * as Contacts from "@/constants/contacts";
import Map from "@/components/common/Map";

const { Paragraph, Title } = Typography;

const propTypes = {
  mine: PropTypes.objectOf(CustomPropTypes.mine).isRequired,
  partyRelationships: PropTypes.arrayOf(CustomPropTypes.partyRelationship).isRequired,
  mineRegionHash: PropTypes.objectOf(PropTypes.string).isRequired,
  mineDisturbanceOptionsHash: PropTypes.objectOf(PropTypes.string).isRequired,
  mineCommodityOptionsHash: PropTypes.objectOf(PropTypes.string).isRequired,
  transformedMineTypes: CustomPropTypes.transformedMineTypes.isRequired,
  userInfo: PropTypes.shape({ preferred_username: PropTypes.string.isRequired }).isRequired,
  fetchMineRecordById: PropTypes.func.isRequired,
  updateMineRecord: PropTypes.func.isRequired,
  createMineTypes: PropTypes.func.isRequired,
};

export class Overview extends Component {
  isPartyRelationshipActive = (pr) =>
    (!pr.end_date || moment(pr.end_date).add(1, "days") > new Date()) &&
    (!pr.start_date || Date.parse(pr.start_date) <= new Date());

  getMineManager = (partyRelationships) => {
    const mineManagers = partyRelationships
      ? partyRelationships.filter(
          (pr) => pr.mine_party_appt_type_code === "MMG" && this.isPartyRelationshipActive(pr)
        )
      : null;
    const mineManager = mineManagers && mineManagers.length > 0 ? mineManagers[0] : null;
    return mineManager;
  };

  getRegionalMineRegionalContacts = (region) =>
    Object.values(Contacts.REGIONAL_MINE_REGIONAL_CONTACTS[region]);

  getMajorMineRegionalContacts = (region) =>
    Object.values(Contacts.MAJOR_MINE_REGIONAL_CONTACTS[region]);

  handleEditWorkerInfo = (value) => {
    const mineStatus = value.mine_status.join(",");
    return this.props
      .updateMineRecord(
        this.props.mine.mine_guid,
        {
          ...value,
          mine_status: mineStatus,
        },
        value.mine_name
      )
      .then(() => {
        this.props.createMineTypes(this.props.mine.mine_guid, value.mine_types).then(() => {
          this.props.fetchMineRecordById(this.props.mine.mine_guid);
        });
      });
  };

  render() {
    return (
      <Row gutter={[0, 16]}>
        <Col lg={{ span: 14 }} xl={{ span: 16 }}>
          <Title level={4}>Overview</Title>
          <Paragraph>
            This tab contains general information about your mine and important contacts at EMLI.
            The information is pulled from current Ministry resources. If anything is incorrect,
            please notify one of the Ministry contacts.
          </Paragraph>
          <Descriptions column={2} colon={false}>
            <Descriptions.Item span={2} label="Region">
              {this.props.mineRegionHash[this.props.mine.mine_region] || Strings.UNKNOWN}
            </Descriptions.Item>
            <Descriptions.Item label="Latitude">
              {(this.props.mine.mine_location && this.props.mine.mine_location.latitude) ||
                Strings.UNKNOWN}
            </Descriptions.Item>
            <Descriptions.Item label="Longitude">
              {(this.props.mine.mine_location && this.props.mine.mine_location.longitude) ||
                Strings.UNKNOWN}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Operating Status">
              {(this.props.mine.mine_status &&
                this.props.mine.mine_status.length > 0 &&
                this.props.mine.mine_status[0].status_labels.join(", ")) ||
                Strings.UNKNOWN}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Commodity">
              {this.props.transformedMineTypes &&
              this.props.transformedMineTypes.mine_commodity_code &&
              this.props.transformedMineTypes.mine_commodity_code.length > 0
                ? this.props.transformedMineTypes.mine_commodity_code
                    .map((code) => this.props.mineCommodityOptionsHash[code])
                    .join(", ")
                : Strings.UNKNOWN}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Disturbance">
              {this.props.transformedMineTypes &&
              this.props.transformedMineTypes.mine_disturbance_code &&
              this.props.transformedMineTypes.mine_disturbance_code.length > 0
                ? this.props.transformedMineTypes.mine_disturbance_code
                    .map((code) => this.props.mineDisturbanceOptionsHash[code])
                    .join(", ")
                : Strings.UNKNOWN}
            </Descriptions.Item>
            <Descriptions.Item span={2} label="Active Permits">
              {this.props.mine.mine_permit_numbers && this.props.mine.mine_permit_numbers.length > 0
                ? this.props.mine.mine_permit_numbers.join(", ")
                : Strings.NONE}
            </Descriptions.Item>
          </Descriptions>
          <WorkerInfoEmployee
            mine={this.props.mine}
            handleEditWorkerInfo={this.handleEditWorkerInfo}
          />
          <Row gutter={[16, 16]}>
            <Col xl={{ span: 11 }} xxl={{ span: 10 }}>
              <ContactCard
                title="Mine Manager"
                partyRelationship={this.getMineManager(this.props.partyRelationships)}
                dateLabel="Mine Manager Since"
              />
            </Col>
          </Row>
        </Col>
        <Col lg={{ span: 9, offset: 1 }} xl={{ offset: 1, span: 7 }}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <div style={{ height: "200px" }}>
                <Map mine={this.props.mine} controls={false} />
              </div>
            </Col>
            {(this.props.mine.major_mine_ind && (
              <Col span={24}>
                <Card title="Ministry Contacts">
                  <MinistryContactItem contact={Contacts.MM_OFFICE} />
                  <MinistryContactItem contact={Contacts.CHIEF_INSPECTOR} />
                  <MinistryContactItem contact={Contacts.EXEC_LEAD_AUTH} />
                  {this.getMajorMineRegionalContacts(this.props.mine.mine_region).map((contact) => (
                    <MinistryContactItem contact={contact} key={contact.title} />
                  ))}
                </Card>
              </Col>
            )) || [
              <Col span={24}>
                <Card title="Regional Ministry Contacts">
                  {this.getRegionalMineRegionalContacts(this.props.mine.mine_region).map(
                    (contact) => (
                      <MinistryContactItem contact={contact} key={contact.title} />
                    )
                  )}
                </Card>
              </Col>,
              <Col span={24}>
                <Card title="General Ministry Contacts">
                  <MinistryContactItem contact={Contacts.CHIEF_INSPECTOR} />
                  <MinistryContactItem contact={Contacts.EXEC_LEAD_AUTH} />
                </Card>
              </Col>,
            ]}
          </Row>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: getUserInfo(state),
  mineRegionHash: getMineRegionHash(state),
  mineCommodityOptionsHash: getCommodityOptionHash(state),
  mineDisturbanceOptionsHash: getDisturbanceOptionHash(state),
  partyRelationships: getPartyRelationships(state),
  transformedMineTypes: getTransformedMineTypes(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateMineRecord,
      openModal,
      closeModal,
    },
    dispatch
  );

Overview.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
