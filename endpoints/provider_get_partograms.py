from botocore.exceptions import ClientError
from endpoints.helpers import *


repo = make_repo()


def handler(event, context):
    print("making new partogram")
    identity = parse_identity(event)
    try:
        data = repo.make_new_partogram(identity)
    except ClientError as e:
        return handle_client_error(e)
    return make_response(200, data)
