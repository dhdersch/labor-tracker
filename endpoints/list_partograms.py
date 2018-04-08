import boto3
import os
from botocore.exceptions import ClientError
from endpoints.patient import PatientRepo
from endpoints.helpers import *


repo = PatientRepo(s3=boto3.resource('s3'),
                   bucket=os.environ.get("BUCKET"),
                   prefix="users/",
                   s3_client=boto3.client('s3'))


def handler(event, context):
    identity = parse_identity(event)
    try:
        data = repo.list_partograms(identity)
    except ClientError as e:
        return handle_client_error(e)
    return make_response(200, data)
