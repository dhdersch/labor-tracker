from botocore.exceptions import ClientError
from endpoints.helpers import *


repo = make_repo()


def handler(event, context):
    identity = parse_identity(event)
    try:
        data = repo.list_partograms(identity)
    except ClientError as e:
        return handle_client_error(e)
    return make_response(200, data)
