from botocore.exceptions import ClientError
from endpoints.helpers import *


repo = make_repo()


def handler(event, context):
    print(event)
    print('Getting patient...')
    identity = parse_identity(event)
    print('Getting patient with identity', identity)
    patient_id = parse_patient_id(event)

    if patient_id is not None:
        if repo.check_provider_has_patient_permissions(identity, patient_id):
            identity = patient_id
        else:
            return make_response(403, {"error": "do not have permissions to get this patient data"})

    try:
        patient_data = repo.get_patient(identity)
    except ClientError as e:
        return handle_client_error(e)
    return make_response(200, patient_data)
