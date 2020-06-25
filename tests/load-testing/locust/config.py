import os

from dotenv import load_dotenv, find_dotenv

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)


class Config(object):
    # Environment config
    BEARER_TOKEN = os.environ.get('BEARER_TOKEN', '')
    MINE_GUID = os.environ.get('MINE_GUID', '')
    OAUTH_CLIENT_ID = os.environ.get('OAUTH_CLIENT_ID', '')
    OAUTH_CLIENT_SECRET = os.environ.get('OAUTH_CLIENT_SECRET', '')
    OAUTH_REDIRECT = os.environ.get('OAUTH_REDIRECT', '')