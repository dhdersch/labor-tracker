from botocore.exceptions import ClientError
from endpoints.helpers import *


repo = make_repo()


def handler(event, context):
    print('Getting patient...')
    identity = parse_identity(event)
    print('Getting patient with identity', identity)
    try:
        patient_data = repo.get_patient(identity)
    except ClientError as e:
        return handle_client_error(e)
    return make_response(200, patient_data)
