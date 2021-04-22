from sqlalchemy.schema import FetchedValue

from app.extensions import db
from app.api.utils.models_mixins import Base, AuditMixin


class CoreActivityObjectType(Base, AuditMixin):
    __tablename__ = "core_activity_object_type"

    core_activity_object_type_code = db.Column(db.String, primary_key=True)
    description = db.Column(db.String, nullable=False)
    active_ind = db.Column(db.Boolean, nullable=False, server_default=FetchedValue())

    def __repr__(self):
        return f'<{self.__class__.__name__} {self.core_activity_object_type_code}>'

    @classmethod
    def get_active(cls):
        return cls.query.filter_by(active_ind=True).all()

    @classmethod
    def get_all(cls):
        return cls.query.all()
