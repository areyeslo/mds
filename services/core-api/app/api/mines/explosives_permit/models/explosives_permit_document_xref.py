from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.schema import FetchedValue
from sqlalchemy.ext.associationproxy import association_proxy

from app.api.utils.models_mixins import Base
from app.extensions import db


class ExplosivesPermitDocumentXref(Base):
    __tablename__ = 'explosives_permit_document_xref'

    explosives_permit_document_xref_guid = db.Column(
        UUID(as_uuid=True), primary_key=True, server_default=FetchedValue())
    mine_document_guid = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey('mine_document.mine_document_guid'),
        nullable=False,
        unique=True)
    explosives_permit_id = db.Column(
        db.Integer, db.ForeignKey('explosives_permit.explosives_permit_id'), nullable=False)
    explosives_permit_document_type_code = db.Column(
        db.String,
        db.ForeignKey('explosives_permit_document_type.explosives_permit_document_type_code'),
        nullable=False)

    # TODO: Determine if we want to return the mine_document or its attributes below.
    # mine_document = db.relationship('MineDocument', lazy='joined')
    # mine_guid = association_proxy('mine_document', 'mine_guid')
    # document_manager_guid = association_proxy('mine_document', 'document_manager_guid')
    # document_name = association_proxy('mine_document', 'document_name')
    # upload_date = association_proxy('mine_document', 'upload_date')

    def __repr__(self):
        return f'{self.__class__.__name__} {self.explosives_permit_document_xref_guid}'
