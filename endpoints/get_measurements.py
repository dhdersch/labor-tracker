import boto3
import os
from botocore.exceptions import ClientError
from endpoints.patient import PatientRepo
from endpoints.helpers import *

dynamodb = boto3.resource('dynamodb')

s3_client = boto3.client('s3')

repo = PatientRepo(s3=boto3.resource('s3'),
                   bucket=os.environ.get("BUCKET"),
                   prefix="users/",
                   s3_client=s3_client,
                   table=dynamodb.Table(os.environ.get("MEASUREMENTS_TABLE")))


def handler(event, context):
    identity = parse_identity(event)
    partogram_id = parse_partogram_id(event)

    try:
        measurements = repo.get_measurements(identity, partogram_id)
    except ClientError as e:
        return handle_client_error(e)

    return make_response(200, {
        'measurements': measurements
    })
