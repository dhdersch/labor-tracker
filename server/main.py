# main.py


import os

import boto3

from flask import Flask, jsonify, request
app = Flask(__name__)

PATIENTS_TABLE = os.environ['PATIENTS_TABLE']
client = boto3.client('dynamodb')


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/patients/<string:key>")
def get_patient(key):
    resp = client.get_item(
        TableName=PATIENTS_TABLE,
        Key={
            'key': { 'S': key }
        }
    )
    item = resp.get('Item')
    if not item:
        return jsonify({'error': 'User does not exist'}), 404

    return jsonify({
        'key': item.get('key').get('S'),
    })


@app.route("/patients", methods=["POST"])
def create_patient():
  key = request.json.get('key')
  # Validate input
  if not key or type(key) is not str:
      return jsonify({'error': 'Please provide a key'}), 400

  resp = client.put_item(
      TableName=PATIENTS_TABLE,
      Item={
          'key': {'S': key },
      }
  )

  return jsonify({
      'key': key,
  })

