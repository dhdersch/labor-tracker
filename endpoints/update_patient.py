import boto3
import os
from botocore.exceptions import ClientError
from endpoints.patient import PatientRepo
from endpoints.helpers import *


repo = PatientRepo(boto3.resource('s3'), os.environ.get("BUCKET"), "users/")


def handler(event, context):
    identity = parse_identity(event)
    try:
        patient_data = repo.update_patient(identity, json.loads(event['body']))
    except ClientError as e:
        return handle_client_error(e)
    return make_response(200, patient_data)
