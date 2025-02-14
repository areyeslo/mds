import requests, base64, io, json
from tusclient import client

from flask import Response, current_app
from flask_restplus import marshal, fields
from app.config import Config
from app.api.now_applications.response_models import NOW_SUBMISSION_DOCUMENT
from app.api.now_applications.models.now_application_document_identity_xref import NOWApplicationDocumentIdentityXref

ALLOWED_DOCUMENT_CATEGORIES = [
    'tailings', 'permits', 'variances', 'incidents', 'reports', 'mine_party_appts', 'noticeofwork',
    'bonds', 'reclamation_invoices', 'explosives_permits'
]


class DocumentManagerService():
    document_manager_document_resource_url = f'{Config.DOCUMENT_MANAGER_URL}/documents'

    @classmethod
    def initializeFileUploadWithDocumentManager(cls, request, mine, document_category):
        metadata = cls._parse_request_metadata(request)
        if not metadata or not metadata.get('filename'):
            raise Exception('Request metadata missing filename')

        folder, pretty_folder = cls._parse_upload_folders(mine, document_category)
        data = {
            'folder': folder,
            'pretty_folder': pretty_folder,
            'filename': metadata.get('filename')
        }

        resp = requests.post(
            url=cls.document_manager_document_resource_url,
            headers={key: value
                     for (key, value) in request.headers if key != 'Host'},
            data=data,
            cookies=request.cookies)

        return Response(str(resp.content), resp.status_code, resp.raw.headers.items())

    @classmethod
    def importNoticeOfWorkSubmissionDocuments(cls, request, now_application):
        data = {
            'now_application_id':
            now_application.now_application_id,
            'submission_documents':
            marshal(now_application.submission_documents, NOW_SUBMISSION_DOCUMENT),
            'now_application_guid':
            str(now_application.now_application_guid)
        }

        resp = requests.post(
            url=f'{Config.DOCUMENT_MANAGER_URL}/import-now-submission-documents',
            headers={key: value
                     for (key, value) in request.headers if key != 'Host'},
            data=json.dumps(data))

        return Response(resp.content, resp.status_code, resp.raw.headers.items())

    @classmethod
    def pushFileToDocumentManager(cls, file_content, filename, mine, document_category,
                                  authorization_header):
        folder, pretty_folder = cls._parse_upload_folders(mine, document_category)
        data = {
            'folder': folder,
            'pretty_folder': pretty_folder,
            'filename': filename,
            'authorization': authorization_header
        }

        my_client = client.TusClient(cls.document_manager_document_resource_url, headers=data)
        uploader = my_client.uploader(
            file_stream=io.BytesIO(file_content),
            chunk_size=Config.DOCUMENT_UPLOAD_CHUNK_SIZE_BYTES)
        uploader.upload()
        document_manager_guid = uploader.url.rsplit('/', 1)[-1]
        return document_manager_guid

    @classmethod
    def _parse_upload_folders(cls, mine, document_category):
        if document_category not in ALLOWED_DOCUMENT_CATEGORIES:
            raise Exception(
                f'CONFIGURATION ERROR: Document Manager Folder \'{document_category}\' not allowed, must be one of {ALLOWED_DOCUMENT_CATEGORIES}.'
            )

        folder = f'mines/{str(mine.mine_guid)}/{document_category}'
        pretty_folder = f'mines/{mine.mine_no}/{document_category}'

        return folder, pretty_folder

    @classmethod
    def _parse_request_metadata(cls, request):
        request_metadata = request.headers.get('Upload-Metadata')
        metadata = {}
        if not request_metadata:
            return metadata

        for key_value in request_metadata.split(','):
            (key, value) = key_value.split(' ')
            metadata[key] = base64.b64decode(value).decode('utf-8')

        return metadata
