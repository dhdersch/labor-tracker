from botocore.exceptions import ClientError
from endpoints.helpers import *
import json


repo = make_repo()


def handler(event, context):
    identity = parse_identity(event)
    partogram_id = parse_partogram_id(event)
    try:
        data = repo.get_partogram(partogram_id)
    except ClientError as e:
        return handle_client_error(e)
    return make_response(200, data)
