from app.extensions import db
from app.utils.models_mixins import Base

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.schema import FetchedValue


class ImportNowSubmissionDocumentsJob(Base):
    __tablename__ = 'import_now_submission_documents_job'

    import_now_submission_documents_job_id = db.Column(db.Integer, primary_key=True)
    start_timestamp = db.Column(db.DateTime)
    end_timestamp = db.Column(db.DateTime)
    create_timestamp = db.Column(db.DateTime)
    complete_timestamp = db.Column(db.DateTime)
    attempt = db.Column(db.Integer, nullable=False, server_default=FetchedValue())
    create_user = db.Column(db.String)
    celery_task_id = db.Column(db.String)
    now_application_id = db.Column(db.Integer, nullable=False)
    now_application_guid = db.Column(UUID(as_uuid=True), nullable=False)

    import_now_submission_documents_job_status_code = db.Column(
        db.String,
        db.ForeignKey(
            'import_now_submission_documents_job_status.import_now_submission_documents_job_status_code'
        ),
        nullable=False,
        server_default=FetchedValue())

    import_now_submission_documents = db.relationship(
        'ImportNowSubmissionDocument', lazy='selectin')

    def __repr__(self):
        return f'<{self.__class__.__name__} {self.import_now_submission_documents_job_id}>'
