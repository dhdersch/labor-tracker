from botocore.exceptions import ClientError
from endpoints.helpers import *

repo = make_repo()


def parse_patient_id(event):
    query_strings = event.get('queryStringParameters')
    if query_strings:
        patient_id = query_strings.get('patient_id', None)
        return patient_id
    return None


def handler(event, context):
    print("making new partogram")
    identity = parse_identity(event)
    patient_id = parse_patient_id(event)
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
