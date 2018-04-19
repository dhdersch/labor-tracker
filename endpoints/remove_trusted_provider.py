from botocore.exceptions import ClientError
from endpoints.helpers import *


repo = make_repo()


def handler(event, context):
    identity = parse_identity(event)
    provider_id = parse_provider_id(event)

    try:
        repo.remove_trusted_provider(identity, provider_id)
    except ClientError as e:
        return handle_client_error(e)
    return make_response(200, None)
