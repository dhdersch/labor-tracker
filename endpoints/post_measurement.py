import boto3
import os
from botocore.exceptions import ClientError
from endpoints.patient import PatientRepo
from endpoints.helpers import *


repo = PatientRepo(s3=boto3.resource('s3'), bucket=os.environ.get("BUCKET"), prefix="users/")


def handler(event, context):

    identity = parse_identity(event)

    measurement = json.loads(event['body'])

    try:
        patient_data = repo.add_measurement(identity, measurement)
    except ClientError as e:
        return handle_client_error(e)

    return make_response(200, patient_data)
