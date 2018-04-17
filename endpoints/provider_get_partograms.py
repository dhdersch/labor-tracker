import boto3
import os
from botocore.exceptions import ClientError
from endpoints.patient import PatientRepo
from endpoints.helpers import *


dynamodb = boto3.resource('dynamodb')

repo = PatientRepo(s3=boto3.resource('s3'),
                   bucket=os.environ.get("BUCKET"),
                   prefix="users/",
                   s3_client=boto3.client('s3'),
                   table=dynamodb.Table(os.environ.get("MEASUREMENTS_TABLE")))


def handler(event, context):
    print("making new partogram")
    identity = parse_identity(event)
    try:
        data = repo.make_new_partogram(identity)
    except ClientError as e:
        return handle_client_error(e)
    return make_response(200, data)
