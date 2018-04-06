import json


def parse_identity(event):
    provider = event["requestContext"]["identity"]["cognitoAuthenticationProvider"]
    identity = provider[provider.rfind(":") + 1:]
    print("Identity", identity)
    return identity


def make_response(code, body):
    response =  {
        "statusCode": code,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True,
            "Content-Type": "application/json"
        }
    }

    if body is not None and body != "":
        response['body'] = json.dumps(body)

    return response


def handle_client_error(e):
    code = 500
    msg = "Error accessing patient"
    if e.response['Error']['Code'] == 'NoSuchKey':
        code = 404
        msg = "Patient does not exist"
    print(e)
    return make_response(code, {"error": msg})