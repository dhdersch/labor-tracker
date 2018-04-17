from botocore.exceptions import ClientError
from endpoints.helpers import *


repo = make_repo()


def handler(event, context):

    identity = parse_identity(event)
    partogram_id = parse_partogram_id(event)
    measurement = json.loads(event['body'])

    try:
        repo.add_measurement(identity, partogram_id, measurement)
    except ClientError as e:
        return handle_client_error(e)

    return make_response(200, None)
