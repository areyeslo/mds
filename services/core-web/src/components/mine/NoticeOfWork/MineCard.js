import React from "react";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { uniqBy } from "lodash";
import { connect } from "react-redux";
import MineHeaderMapLeaflet from "@/components/maps/MineHeaderMapLeaflet";
import CustomPropTypes from "@/customPropTypes";
import * as Strings from "@/constants/strings";
import { getMineRegionHash } from "@/selectors/staticContentSelectors";
import { fetchRegionOptions } from "@/actionCreators/staticContentActionCreator";

/**
 * @class MineHeader.js contains header section of MineDashboard before the tabs. Including map, mineName, mineNumber.
 */
const propTypes = {
  mine: CustomPropTypes.mine.isRequired,
  mineRegionHash: PropTypes.objectOf(PropTypes.string).isRequired,
};

export const MineCard = (props) => {
  return (
    props.mine && (
      <div className="mine-content__card">
        <div className="mine-content__card-right">
          <div className="inline-flex padding-small">
            <p className="field-title">Mine Name</p>
            <p>{props.mine.mine_name}</p>
          </div>
          <div className="inline-flex padding-small">
            <p className="field-title">Mine Number</p>
            <p>{props.mine.mine_no}</p>
          </div>
          <div className="inline-flex padding-small">
            <p className="field-title">Mine Class </p>
            <p>{props.mine.major_mine_ind ? Strings.MAJOR_MINE : Strings.REGIONAL_MINE}</p>
          </div>
          <div className="inline-flex padding-small">
            <p className="field-title">Permit Number</p>
            <ul className="mine-list__permits">
              {props.mine.mine_permit && props.mine.mine_permit.length > 0
                ? uniqBy(props.mine.mine_permit, "permit_no").map(({ permit_no, permit_guid }) => (
                    <li key={permit_guid}>{permit_no}</li>
                  ))
                : Strings.EMPTY_FIELD}
            </ul>
          </div>
        </div>
        <div className="mine-content__card-left">
          <MineHeaderMapLeaflet mine={props.mine} />
          <div className="mine-content__card-left--footer">
            <div className="inline-flex between">
              <p className="p-white">
                Lat:{" "}
                {props.mine.mine_location && props.mine.mine_location.latitude
                  ? props.mine.mine_location.latitude
                  : Strings.EMPTY_FIELD}
              </p>
              <p className="p-white">
                Long:{" "}
                {props.mine.mine_location && props.mine.mine_location.longitude
                  ? props.mine.mine_location.longitude
                  : Strings.EMPTY_FIELD}
              </p>
            </div>
            <div className="inline-flex between">
              <p className="p-white">
                Region:{" "}
                {props.mine.mine_region
                  ? props.mineRegionHash[props.mine.mine_region]
                  : Strings.EMPTY_FIELD}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  mineRegionHash: getMineRegionHash(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchRegionOptions,
    },
    dispatch
  );

MineCard.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MineCard);
