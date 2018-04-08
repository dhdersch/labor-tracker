import json
import decimal


def parse_partogram_id(event):
    partogram_id = event['pathParameters']['partogram_id']
    return partogram_id


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
    code = 500
    msg = "Error accessing patient"
    if e.response['Error']['Code'] == 'NoSuchKey':
        code = 404
        msg = "Patient does not exist"
    print(e)
    return make_response(code, {"error": msg})