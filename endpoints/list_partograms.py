from botocore.exceptions import ClientError
from endpoints.helpers import *


repo = make_repo()


def handler(event, context):
    identity = parse_identity(event)
    patients = repo.get_patients_for_provider(identity)
    try:
        data = repo.list_partograms(identity)
        for patient_id in patients:
            pdata = repo.list_partograms(patient_id)
            data['partograms'].extend(pdata['partograms'])

    except ClientError as e:
        return handle_client_error(e)
    return make_response(200, data)
