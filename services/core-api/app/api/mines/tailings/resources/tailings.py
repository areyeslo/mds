import uuid, requests, json
from decimal import Decimal
from datetime import datetime, timezone
from flask import request, current_app, url_for
from flask_restplus import Resource, reqparse
from werkzeug.exceptions import BadRequest, InternalServerError, NotFound

from app.extensions import api, db
from app.api.utils.access_decorators import requires_role_view_all, requires_role_mine_edit
from app.api.utils.resources_mixins import UserMixin

from app.api.mines.mine.models.mine import Mine
from app.api.mines.tailings.models.tailings import MineTailingsStorageFacility
from app.api.parties.party_appt.models.mine_party_appt import MinePartyAppointment
from app.api.mines.reports.models.mine_report_definition import MineReportDefinition
from app.api.mines.reports.models.mine_report import MineReport
from app.api.mines.response_models import MINE_TSF_MODEL


class MineTailingsStorageFacilityListResource(Resource, UserMixin):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'mine_tailings_storage_facility_name',
        type=str,
        trim=True,
        help='Name of the tailings storage facility.',
        required=True)
    parser.add_argument(
        'longitude',
        type=lambda x: Decimal(x) if x else None,
        help='Longitude point for the mine.',
        location='json')
    parser.add_argument(
        'latitude',
        type=lambda x: Decimal(x) if x else None,
        help='Latitude point for the mine.',
        location='json')
    parser.add_argument(
        'consequence_classification_status_code',
        type=str,
        trim=True,
        help='Risk Severity Classification',
        required=True)
    parser.add_argument(
        'tsf_operating_status_code',
        type=str,
        trim=True,
        help='Operating Status of the storage facility',
        required=True)
    parser.add_argument(
        'has_itrb', type=bool, trim=True, help='Risk Severity Classification', required=True)
    parser.add_argument(
        'eor_party_guid',
        type=str,
        help='GUID of the party that is the Engineer of Record for this TSF.',
        location='json',
        store_missing=False)

    @api.doc(description='Gets the tailing storage facilites for the given mine')
    @api.marshal_with(
        MINE_TSF_MODEL, envelope='mine_tailings_storage_facilities', as_list=True, code=200)
    @requires_role_view_all
    def get(self, mine_guid):
        mine = Mine.find_by_mine_guid(mine_guid)
        if not mine:
            raise NotFound('Mine not found.')
        return mine.mine_tailings_storage_facilities

    @api.doc(description='Creates a new tailing storage facility for the given mine')
    @api.marshal_with(MINE_TSF_MODEL, code=201)
    @requires_role_mine_edit
    def post(self, mine_guid):
        mine = Mine.find_by_mine_guid(mine_guid)
        if not mine:
            raise NotFound('Mine not found.')

        data = self.parser.parse_args()

        mine_tsf_list = mine.mine_tailings_storage_facilities
        is_mine_first_tsf = len(mine_tsf_list) == 0

        mine_tsf = MineTailingsStorageFacility.create(
            mine,
            mine_tailings_storage_facility_name=data['mine_tailings_storage_facility_name'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            consequence_classification_status_code=data['consequence_classification_status_code'],
            has_itrb=data['has_itrb'],
            tsf_operating_status_code=data['tsf_operating_status_code'])
        mine.mine_tailings_storage_facilities.append(mine_tsf)

        if is_mine_first_tsf:
            try:
                tsf_required_reports = MineReportDefinition.find_required_reports_by_category('TSF')

                for tsf_req_doc in tsf_required_reports:
                    calculated_due_date = tsf_req_doc.default_due_date or datetime.utcnow()
                    MineReport.create(
                        mine_report_definition_id=tsf_req_doc.mine_report_definition_id,
                        mine_guid=mine.mine_guid,
                        due_date=calculated_due_date,
                        received_date=None,
                        submission_year=calculated_due_date.year - 1,
                        permit_id=None)
            except Exception as e:
                db.session.rollback()
                current_app.logger.error(str(e))
                raise InternalServerError(str(e) + ", tsf not created")

        eor_party_guid = data.get('eor_party_guid')
        if eor_party_guid is not None:
            new_eor = MinePartyAppointment.create(
                mine=mine,
                tsf=mine_tsf,
                party_guid=eor_party_guid,
                mine_party_appt_type_code='EOR',
                processed_by=self.get_user_info(),
                start_date=datetime.now(tz=timezone.utc))
            related_guid = mine_tsf.mine_tailings_storage_facility_guid
            new_eor.assign_related_guid('EOR', related_guid)
            new_eor.save()

        mine.save()
        return mine_tsf, 201


class MineTailingsStorageFacilityResource(Resource, UserMixin):
    parser = reqparse.RequestParser()
    parser.add_argument(
        'mine_tailings_storage_facility_name',
        type=str,
        trim=True,
        help='Name of the tailings storage facility.',
        required=True)
    parser.add_argument(
        'longitude', type=str, help='Longitude point for the mine.', location='json')
    parser.add_argument('latitude', type=str, help='Latitude point for the mine.', location='json')
    parser.add_argument(
        'consequence_classification_status_code',
        type=str,
        trim=True,
        help='Risk Severity Classification',
        required=True)
    parser.add_argument(
        'tsf_operating_status_code',
        type=str,
        trim=True,
        help='Operating Status of the storage facility',
        required=True)
    parser.add_argument(
        'has_itrb',
        type=lambda x: True if x.lower() in ("true") else False,
        trim=True,
        help='Risk Severity Classification',
        required=True)
    parser.add_argument(
        'eor_party_guid',
        type=str,
        help='GUID of the party that is the Engineer of Record for this TSF.',
        location='json',
        store_missing=False)

    @api.doc(description='Updates an existing tailing storage facility for the given mine')
    @requires_role_mine_edit
    @api.marshal_with(MINE_TSF_MODEL)
    def put(self, mine_guid, mine_tailings_storage_facility_guid):
        mine = Mine.find_by_mine_guid(mine_guid)

        if not mine:
            raise NotFound('Mine not found.')

        mine_tsf = MineTailingsStorageFacility.find_by_tsf_guid(mine_tailings_storage_facility_guid)

        if not mine_tsf:
            raise NotFound("Tailing Storage Facility not found")

        data = self.parser.parse_args()

        current_app.logger.info(f'Updating {mine_tsf} with {data}')
        eor_party_guid = data.get('eor_party_guid')
        if eor_party_guid != None and (mine_tsf.engineer_of_record is None
                                       or eor_party_guid != mine_tsf.engineer_of_record.party_guid):
            if mine_tsf.engineer_of_record:
                mine_tsf.engineer_of_record.end_date = datetime.now(tz=timezone.utc)
            new_eor = MinePartyAppointment.create(
                mine=mine,
                tsf=mine_tsf,
                party_guid=eor_party_guid,
                mine_party_appt_type_code='EOR',
                processed_by=self.get_user_info(),
                start_date=datetime.now(tz=timezone.utc))
            related_guid = mine_tsf.mine_tailings_storage_facility_guid
            new_eor.assign_related_guid('EOR', related_guid)
            new_eor.save(commit=False)

        for key, value in data.items():
            if key in ('eor_party_guid'):
                continue
            setattr(mine_tsf, key, value)

        mine_tsf.save()
        return mine_tsf