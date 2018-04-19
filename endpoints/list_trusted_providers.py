from botocore.exceptions import ClientError
from endpoints.helpers import *


repo = make_repo()


def handler(event, context):
    identity = parse_identity(event)

    try:
        trusted_providers = repo.get_trusted_providers(identity)
    except ClientError as e:
        return handle_client_error(e)
    return make_response(200, {"trusted_providers": trusted_providers})
