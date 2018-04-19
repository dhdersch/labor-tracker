from botocore.exceptions import ClientError
from endpoints.helpers import *


repo = make_repo()


def handler(event, context):

    identity = parse_identity(event)
    partogram_id = parse_partogram_id(event)
    time = parse_time(event)

    try:
        repo.delete_measurement(partogram_id, time)
    except ClientError as e:
        return handle_client_error(e)

    return make_response(200, None)
