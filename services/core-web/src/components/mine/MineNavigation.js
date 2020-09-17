import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { includes } from "lodash";
import { detectProdEnvironment } from "@common/utils/environmentUtils";
import * as routes from "@/constants/routes";
import CustomPropTypes from "@/customPropTypes";

const propTypes = {
  mine: CustomPropTypes.mine.isRequired,
  activeButton: PropTypes.string.isRequired,
  openSubMenuKey: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export class MineNavigation extends Component {
  ifActiveButton = (route) => (includes(this.props.activeButton, route) ? "active-menu-btn" : "");

  render() {
    const isProd = detectProdEnvironment();
    const isMajorMine = this.props.mine.major_mine_ind;
    const isTailingsVisible = this.props.mine.mine_tailings_storage_facilities.length >= 1;
    return (
      <Menu mode="horizontal" selectedKeys={this.props.openSubMenuKey}>
        <Menu.SubMenu
          id={this.ifActiveButton("mine-information")}
          title={
            <span>
              Mine Information
              <DownOutlined className="padding-small--left" />
            </span>
          }
        >
          <Menu className="sub-menu">
            <Menu.Item key="general">
              <Link to={routes.MINE_GENERAL.dynamicRoute(this.props.mine.mine_guid)}>General</Link>
            </Menu.Item>
            <Menu.Item key="contacts">
              <Link to={routes.MINE_CONTACTS.dynamicRoute(this.props.mine.mine_guid)}>
                Contacts
              </Link>
            </Menu.Item>
          </Menu>
        </Menu.SubMenu>
        <Menu.SubMenu
          id={this.ifActiveButton("permits-and-approvals")}
          title={
            <span>
              Permits & Approvals
              <DownOutlined className="padding-small--left" />
            </span>
          }
        >
          <Menu className="sub-menu">
            <Menu.Item key="permits">
              <Link to={routes.MINE_PERMITS.dynamicRoute(this.props.mine.mine_guid)}>Permits</Link>
            </Menu.Item>
            <Menu.Item key="securities">
              <Link to={routes.MINE_SECURITIES.dynamicRoute(this.props.mine.mine_guid)}>
                Securities
              </Link>
            </Menu.Item>
            <Menu.Item key="variances">
              <Link to={routes.MINE_VARIANCES.dynamicRoute(this.props.mine.mine_guid)}>
                Variances
              </Link>
            </Menu.Item>
            <Menu.Item key="notices-of-work">
              <Link to={routes.MINE_NOW_APPLICATIONS.dynamicRoute(this.props.mine.mine_guid)}>
                {isMajorMine ? "Permit Applications" : "Notice of Work Applications"}
              </Link>
            </Menu.Item>
          </Menu>
        </Menu.SubMenu>
        <Menu.SubMenu
          id={this.ifActiveButton("oversight")}
          title={
            <span>
              Oversight
              <DownOutlined className="padding-small--left" />
            </span>
          }
        >
          <Menu className="sub-menu">
            <Menu.Item key="inspections-and-audits">
              <Link to={routes.MINE_INSPECTIONS.dynamicRoute(this.props.mine.mine_guid)}>
                Inspections & Audits
              </Link>
            </Menu.Item>
            <Menu.Item key="incidents-and-investigations">
              <Link to={routes.MINE_INCIDENTS.dynamicRoute(this.props.mine.mine_guid)}>
                Incidents & Investigations
              </Link>
            </Menu.Item>
          </Menu>
        </Menu.SubMenu>
        <Menu.SubMenu
          id={this.ifActiveButton("reports")}
          title={
            <span>
              Reports
              <DownOutlined className="padding-small--left" />
            </span>
          }
        >
          <Menu className="sub-menu">
            <Menu.Item key="code-required-reports">
              <Link to={routes.MINE_REPORTS.dynamicRoute(this.props.mine.mine_guid)}>
                Code Required Reports
              </Link>
            </Menu.Item>
            {isTailingsVisible && (
              <Menu.Item key="tailings">
                <Link to={routes.MINE_TAILINGS.dynamicRoute(this.props.mine.mine_guid)}>
                  Tailings
                </Link>
              </Menu.Item>
            )}
          </Menu>
        </Menu.SubMenu>
        <Menu.SubMenu
          id={this.ifActiveButton("documents")}
          title={
            <span>
              Documents
              <DownOutlined className="padding-small--left" />
            </span>
          }
        >
          <Menu className="sub-menu">
            <Menu.Item key="documents">
              <Link to={routes.MINE_DOCUMENTS.dynamicRoute(this.props.mine.mine_guid)}>
                Documents
              </Link>
            </Menu.Item>
          </Menu>
        </Menu.SubMenu>
      </Menu>
    );
  }
}

MineNavigation.propTypes = propTypes;

export default MineNavigation;
