from botocore.exceptions import ClientError
from endpoints.helpers import *


repo = make_repo()


def handler(event, context):
    identity = parse_identity(event)

    try:
        patient_data = repo.put_patient(identity, json.loads(event['body']))
    except ClientError as e:
        return handle_client_error(e)
    except AttributeError as e:
        return make_response(400, {"error": str(e)})

    return make_response(200, patient_data)
