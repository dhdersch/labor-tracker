from botocore.exceptions import ClientError
from endpoints.helpers import *

repo = make_repo()


def handler(event, context):
    print("making new partogram")
    identity = parse_identity(event)

    patient_id = event.get('queryStringParameters', {}).get('patient_id', None)

    if patient_id:
        if repo.check_provider_has_patient_permissions(identity, patient_id):
            identity = patient_id
        else:
            return make_response(403, {"error": "you do not have permissions"})

    try:
        data = repo.make_new_partogram(identity, json.loads(event['body']))
    except ClientError as e:
        return handle_client_error(e)
    return make_response(200, data)
