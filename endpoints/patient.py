import json
from botocore.exceptions import ClientError

from boto3.dynamodb.conditions import Key

import time as ptime
import decimal


class PatientRepo(object):

    def __init__(self, **kwargs):
        self.__s3_resource = kwargs.get('s3')
        self.__bucket = kwargs.get('bucket')
        self.__prefix = kwargs.get('prefix')
        self.__measurements_table = kwargs.get('measurements_table')
        self.__partograms_table = kwargs.get('partograms_table')
        self.__providers_table = kwargs.get('providers_table')

    def delete_partogram(self, identity, labor_start_time):
        db_hash_key = identity + labor_start_time

        measurements = self.get_measurements(identity, labor_start_time)

        for m in measurements:
            kwargs = {
                'Key':{
                    'key': db_hash_key,
                    'time': m['time']
                }
            }
            self.__measurements_table.delete_item(**kwargs)

        self.__partograms_table.delete_item(Key={
            'patient_id': identity,
            'labor_start_time': int(labor_start_time),
        })
        ptime.sleep(0.2)


    @staticmethod
    def __make_measurement_output(identity, labor_start_time, measurement):

        key = measurement.get('key')
        identifier = key.replace(identity, "")
        return {
            'id': identifier,
            'dilation': measurement.get('dilation'),
            'time': measurement.get('time')
        }


    @staticmethod
    def __validate_patient(patient):
        if "initials" in patient and (not isinstance(patient["initials"], str) or len(patient["initials"]) > 4):
            raise AttributeError("Invalid value for initials in patient object. Should be string of 4 or fewer characters")
        if "age" in patient and not isinstance(patient["age"], int):
            raise AttributeError("Invalid value for age in patient object. Should be integer")
        if "num_past_vaginal_births" in patient and not isinstance(patient["num_past_vaginal_births"], int):
            raise AttributeError("Invalid value for num_past_vaginal_births in patient object. Should be integer")
        if "height" in patient and not isinstance(patient["height"], int):
            raise AttributeError("Invalid value for height in patient object. Should be integer")
        if "weight" in patient and not isinstance(patient["weight"], int):
            raise AttributeError("Invalid value for weight in patient object. Should be integer")

    def delete_measurement(self, identity, labor_start_time, time):
        hash_key = identity + labor_start_time
        range_key = time

        kwargs= {
            'Key': {
                "key": hash_key,
                "time": int(range_key)
            }

        }

        self.__measurements_table.delete_item(**kwargs)

    def get_measurements(self, identity, labor_start_time):

        hash_key = identity + labor_start_time

        kwargs = {
            'Select': 'ALL_ATTRIBUTES',
            'ConsistentRead': False,
            'KeyConditionExpression': Key("key").eq(hash_key)
        }

        items = self.__measurements_table.query(**kwargs)['Items']
        items = [self.__make_measurement_output(identity, labor_start_time, item) for item in items]

        return items

    def add_measurement(self, identity, labor_start_time, measurement):
        key = identity + labor_start_time
        measurement['key'] = key
        measurement['dilation'] = decimal.Decimal(str(measurement['dilation']))
        self.__measurements_table.put_item(
            Item=measurement
        )

    def get_partogram(self, identity, labor_start_time):
        response = self.__partograms_table.get_item(Key={
            'labor_start_time': int(labor_start_time),
            'patient_id': identity
        })

        data = response['Item']
        data['labor_start_time'] = data['labor_start_time']

        return data

    def list_partograms(self, patient_id):
        """
        Gets a list of the identifiers for the measurements set (each measurement set is the data for a single
        partograph or labor)
        :param patient_id:
        :return:
        """
        kwargs = {
            'Select': 'ALL_ATTRIBUTES',
            'ConsistentRead': False,
            'KeyConditionExpression': Key("patient_id").eq(patient_id)
        }
        items = self.__partograms_table.query(**kwargs)['Items']
        return {
            'partograms': items
        }

    def make_new_partogram(self, patient_id, data):
        data['patient_id'] = patient_id
        data['labor_start_time'] = int(data['labor_start_time'])
        self.__partograms_table.put_item(
            Item=data
        )
        return data

    def get_patient(self, patient_id):
        """
        Get patient data
        :param patient_id:
        :return:
        """
        o = self.__s3_resource.Object(self.__bucket, self.__prefix + patient_id + ".json")
        response = o.get(ResponseContentType="application/json")
        data = json.loads(response['Body'].read().decode("utf-8"))
        return data

    def put_patient(self, patient_id, data):
        """
        Put data to patient. Old values are not kept.
        :param patient_id:
        :param data:
        :return:
        """
        # Validate patient object:
        self.__validate_patient(data)
        o = self.__s3_resource.Object(self.__bucket, self.__prefix + patient_id + ".json")
        o.put(Body=json.dumps(data), ContentType="application/json")
        return data

    def update_patient(self, patient_id, data):
        """
        Add data to a patient. Old values overwritten if new values provided.
        If patients does not exist, creates patient
        :param patient_id:
        :param data:
        :return:
        """
        try:
            existing_data = self.get_patient(patient_id)
        except ClientError as e:
            existing_data = {}

        existing_data.update(data)
        self.put_patient(patient_id, existing_data)
        return existing_data


def remove_prefix(text, prefix):
    if text.startswith(prefix):
        return text[len(prefix):]
    return text