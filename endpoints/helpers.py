import json
import decimal
from endpoints.patient import PatientRepo
import boto3
import os


def make_repo():
    bucket = os.environ.get('BUCKET')
    resource = boto3.resource('s3')
    prefix = "users/"

    # providers_table = boto3.resource('dynamodb').Table(os.environ.get("PROVIDERS_TABLE"))
    partograms_table = boto3.resource('dynamodb').Table(os.environ.get("PARTOGRAMS_TABLE"))
    measurements_table = boto3.resource('dynamodb').Table(os.environ.get("MEASUREMENTS_TABLE"))

    kwargs = {
        's3': resource,
        'bucket': bucket,
        'prefix': prefix,
        'measurements_table': measurements_table,
        'partograms_table': partograms_table,
        # 'providers_table': providers_table
    }

    repo = PatientRepo(**kwargs)
    return repo

def parse_partogram_id(event):
    partogram_id = event['pathParameters']['partogram_id']
    return partogram_id


def parse_time(event):
    time = event['pathParameters']['time']
    return time


def parse_identity(event):
    provider = event["requestContext"]["identity"]["cognitoAuthenticationProvider"]
    identity = provider[provider.rfind(":") + 1:]
    print("Identity", identity)
    return identity


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)


def make_response(code, body):
    response = {
        "statusCode": code,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True,
            "Content-Type": "application/json"
        }
    }

    if body is not None and body != "":
        response['body'] = json.dumps(body, cls=DecimalEncoder)

    return response


def handle_client_error(e):
    print(e)
    code = 500
    msg = "Error accessing patient"
    if e.response['Error']['Code'] == 'NoSuchKey':
        code = 404
        msg = "Patient does not exist"
    return make_response(code, {"error": msg})