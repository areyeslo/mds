import re
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.schema import FetchedValue
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property

from app.api.utils.models_mixins import SoftDeleteMixin, AuditMixin, Base
from app.extensions import db


class Address(SoftDeleteMixin, AuditMixin, Base):
    __tablename__ = 'address'

    address_id = db.Column(db.Integer, primary_key=True)
    suite_no = db.Column(db.String, nullable=True)
    address_line_1 = db.Column(db.String, nullable=True)
    address_line_2 = db.Column(db.String, nullable=True)
    city = db.Column(db.String, nullable=True)
    sub_division_code = db.Column(
        db.String, db.ForeignKey('sub_division_code.sub_division_code'), nullable=True)
    post_code = db.Column(db.String, nullable=True)
    address_type_code = db.Column(db.String, nullable=False, server_default=FetchedValue())

    party_guid = db.Column(UUID(as_uuid=True), db.ForeignKey('party.party_guid'), nullable=False)
    party = db.relationship('Party', lazy='joined')

    def __repr__(self):
        return '<Address %r>' % self.address_id

    # TODO: Remove this once mine_party_appt has been refactored
    def json(self):
        return {
            'suite_no': self.suite_no,
            'address_line_1': self.address_line_1,
            'address_line_2': self.address_line_2,
            'city': self.city,
            'sub_division_code': self.sub_division_code,
            'post_code': self.post_code
        }

    @hybrid_property
    def full(self):
        full = ''
        if self.suite_no:
            full += f'{self.suite_no} '
        if self.address_line_1:
            full += f'{self.address_line_1} '
        if self.address_line_2:
            full += self.address_line_2
        full = full.strip()

        if self.city or self.sub_division_code or self.post_code:
            full += '\n'
            if self.city:
                full += self.city
            if self.sub_division_code:
                full += f' {self.sub_division_code}'
            if self.post_code:
                post_code = self.post_code
                try:
                    post_code = f'{post_code[:3]} {post_code[3:]}'
                except:
                    pass
                full += f' {post_code}'

        return full.strip()

    @classmethod
    def create(cls,
               suite_no=None,
               address_line_1=None,
               address_line_2=None,
               city=None,
               sub_division_code=None,
               post_code=None,
               add_to_session=True):
        address = cls(
            suite_no=suite_no,
            address_line_1=address_line_1,
            address_line_2=address_line_2,
            city=city,
            sub_division_code=sub_division_code,
            post_code=post_code)
        if add_to_session:
            address.save(commit=False)
        return address

    @validates('post_code')
    def validate_post_code(self, key, post_code):
        if post_code and len(post_code) > 6:
            raise AssertionError('post_code must not exceed 6 characters.')
        validPostalCode = re.compile(r"\s*([a-zA-Z]\s*\d\s*){3}$")
        if post_code and not validPostalCode.match(post_code):
            raise AssertionError('Invalid post_code format.')
        return post_code
