from app.extensions import api
from flask_restplus import fields
from app.api.mines.response_models import MINE_DOCUMENT_MODEL

EXPLOSIVES_PERMIT_MAGAZINE_MODEL = api.model(
    'ExplosivesPermitMagazine', {
        'explosives_permit_magazine_id': fields.Integer,
        'explosives_permit_id': fields.Integer,
        'explosives_permit_magazine_type_code': fields.String,
        'type_no': fields.String,
        'tag_no': fields.String,
        'construction': fields.String,
        'latitude': fields.Fixed(decimals=7),
        'longitude': fields.Fixed(decimals=7),
        'length': fields.Fixed,
        'width': fields.Fixed,
        'height': fields.Fixed,
        'quantity': fields.Integer,
        'distance_road': fields.Fixed,
        'distance_dwelling': fields.Fixed
    })

EXPLOSIVES_PERMIT_DOCUMENT_MODEL = api.inherit('ExplosivesPermitDocument', MINE_DOCUMENT_MODEL, {
    'explosives_permit_id': fields.Integer,
    'explosives_permit_document_type_code': fields.String
})

EXPLOSIVES_PERMIT_MODEL = api.model(
    'ExplosivesPermit', {
        'explosives_permit_id': fields.Integer,
        'explosives_permit_guid': fields.String,
        'mine_guid': fields.String,
        'permit_guid': fields.String,
        'now_application_guid': fields.String,
        'issuing_inspector_party_guid': fields.String,
        'mine_operator_party_guid': fields.String,
        'application_status': fields.String,
        'permit_number': fields.String,
        'issue_date': fields.Date,
        'expiry_date': fields.Date,
        'application_number': fields.String,
        'application_date': fields.Date,
        'originating_system': fields.String,
        'received_timestamp': fields.DateTime,
        'decision_timestamp': fields.DateTime,
        'decision_reason': fields.String,
        'latitude': fields.Fixed(decimals=7),
        'longitude': fields.Fixed(decimals=7),
        'is_closed': fields.Boolean,
        'closed_timestamp': fields.DateTime,
        'closed_reason': fields.String,
        'explosive_magazines': fields.List(fields.Nested(EXPLOSIVES_PERMIT_MAGAZINE_MODEL)),
        'detonator_magazines': fields.List(fields.Nested(EXPLOSIVES_PERMIT_MAGAZINE_MODEL)),
        'documents': fields.List(fields.Nested(EXPLOSIVES_PERMIT_DOCUMENT_MODEL)),
        'mines_permit_number': fields.String(attribute='mines_act_permit.permit_no'),
        'now_number': fields.String(attribute='now_application_identity.now_number')
    })

EXPLOSIVES_PERMIT_STATUS_MODEL = api.model(
    'ExplosivesPermitStatus', {
        'explosives_permit_status_code': fields.String,
        'description': fields.String,
        'active_ind': fields.Boolean,
        'display_order': fields.Integer
    })

EXPLOSIVES_PERMIT_DOCUMENT_TYPE_MODEL = api.model(
    'ExplosivesPermitDocumentType', {
        'explosives_permit_document_type_code': fields.String,
        'description': fields.String,
        'active_ind': fields.Boolean,
        'display_order': fields.Integer
    })

EXPLOSIVES_PERMIT_MAGAZINE_TYPE_MODEL = api.model('ExplosivesPermitMagazineType', {
    'explosives_permit_magazine_type_code': fields.String,
    'description': fields.String
})