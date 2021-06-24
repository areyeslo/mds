import json

from flask_restplus import Resource, inputs
from werkzeug.exceptions import NotFound
from flask import current_app
from decimal import Decimal

from app.extensions import api
from app.api.utils.resources_mixins import UserMixin
from app.api.utils.custom_reqparser import CustomReqparser
from app.api.utils.access_decorators import requires_any_of, VIEW_ALL, MINE_EDIT, MINESPACE_PROPONENT
from app.api.mines.mine.models.mine import Mine
from app.api.mines.explosives_permit.response_models import EXPLOSIVES_PERMIT
from app.api.mines.explosives_permit.models.explosives_permit import ExplosivesPermit


class ExplosivesPermitListResource(Resource, UserMixin):

    parser = CustomReqparser()
    parser.add_argument('permit_guid', type=str, store_missing=False, required=True, help='')
    parser.add_argument('originating_system', type=str, store_missing=False, required=True, help='')
    parser.add_argument(
        'latitude',
        type=lambda x: Decimal(x) if x else None,
        store_missing=False,
        required=True,
        help='')
    parser.add_argument(
        'longitude',
        type=lambda x: Decimal(x) if x else None,
        store_missing=False,
        required=True,
        help='')
    parser.add_argument(
        'application_date',
        type=lambda x: inputs.datetime_from_iso8601(x) if x else None,
        store_missing=False,
        required=True,
        help='')
    parser.add_argument(
        'now_application_guid', type=str, store_missing=False, required=False, help='')
    # TODO: Can we document/parse these relationship types better?
    parser.add_argument(
        'explosive_magazines',
        type=list,
        location='json',
        store_missing=False,
        required=False,
        help='')
    parser.add_argument(
        'detonator_magazines',
        type=list,
        location='json',
        store_missing=False,
        required=False,
        help='')
    parser.add_argument(
        'documents', type=list, location='json', store_missing=False, required=False, help='')

    @api.doc(
        description='Get a list of all Explosives Permits for a given mine.',
        params={'mine_guid': 'The GUID of the mine to get Explosives Permits for.'})
    @requires_any_of([VIEW_ALL, MINESPACE_PROPONENT])
    @api.marshal_with(EXPLOSIVES_PERMIT, code=200, envelope='records')
    def get(self, mine_guid):
        mine = Mine.find_by_mine_guid(mine_guid)
        if mine is None:
            raise NotFound('Mine not found')

        explosives_permits = ExplosivesPermit.find_by_mine_guid(mine_guid)
        return explosives_permits

    @api.doc(
        description='Create a new Explosives Permit.',
        params={'mine_guid': 'The GUID of the mine to create the Explosives Permit for.'})
    @api.expect(parser)
    @requires_any_of([MINE_EDIT])
    @api.marshal_with(EXPLOSIVES_PERMIT, code=200)
    def post(self, mine_guid):
        mine = Mine.find_by_mine_guid(mine_guid)
        if mine is None:
            raise NotFound('Mine not found')

        data = self.parser.parse_args()
        explosives_permit = ExplosivesPermit.create(mine, data.get('permit_guid'),
                                                    data.get('application_date'),
                                                    data.get('originating_system'),
                                                    data.get('latitude'), data.get('longitude'),
                                                    data.get('explosive_magazines'),
                                                    data.get('detonator_magazines'),
                                                    data.get('documents'),
                                                    data.get('now_application_guid'))
        explosives_permit.save()

        return explosives_permit
