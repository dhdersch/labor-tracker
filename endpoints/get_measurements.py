from botocore.exceptions import ClientError
from endpoints.helpers import *

repo = make_repo()


def handler(event, context):
    identity = parse_identity(event)
    partogram_id = parse_partogram_id(event)

    try:
        measurements = repo.get_measurements(partogram_id)
    except ClientError as e:
        return handle_client_error(e)

    return make_response(200, {
        'measurements': measurements
    })
