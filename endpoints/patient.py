import json
from botocore.exceptions import ClientError
import uuid

from boto3.dynamodb.conditions import Key

import time as ptime
import decimal


class PatientRepo(object):

    def __init__(self, **kwargs):
        self.__s3_resource = kwargs.get('s3')
        self.__s3_client = kwargs.get('s3_client')
        self.__bucket = kwargs.get('bucket')
        self.__prefix = kwargs.get('prefix')
        self.__table = kwargs.get('table')


    def delete_partogram(self, identity, partogram_id):
        db_hash_key = identity + partogram_id

        measurements = self.get_measurements(identity, partogram_id)

        for m in measurements:
            kwargs = {
                'Key':{
                    'key': db_hash_key,
                    'time': m['time']
                }
            }
            self.__table.delete_item(**kwargs)

        o = self.__s3_resource.Object(self.__bucket, self.__prefix + identity + "/" + str(partogram_id))
        o.delete()
        ptime.sleep(0.2)


    @staticmethod
    def __make_measurement_output(identity, partogram_id, measurement):

        key = measurement.get('key')
        identifier = key.replace(identity, "")
        return {
            'id': identifier,
            'dilation': measurement.get('dilation'),
            'time': measurement.get('time')
        }

    def delete_measurement(self, identity, partogram_id, time):
        hash_key = identity + partogram_id
        range_key = time

        kwargs= {
            'Key': {
                "key": hash_key,
                "time": int(range_key)
            }

        }

        self.__table.delete_item(**kwargs)

    def get_measurements(self, identity, partogram_id):

        hash_key = identity + partogram_id

        kwargs = {
            'Select': 'ALL_ATTRIBUTES',
            'ConsistentRead': False,
            'KeyConditionExpression': Key("key").eq(hash_key)
        }

        items = self.__table.query(**kwargs)['Items']
        items = [self.__make_measurement_output(identity, partogram_id, item) for item in items]

        return items

    def add_measurement(self, identity, partogram_id, measurement):
        key = identity + partogram_id
        measurement['key'] = key
        measurement['dilation'] = decimal.Decimal(str(measurement['dilation']))
        self.__table.put_item(
            Item=measurement
        )

    def list_partograms(self, patient_id):
        """
        Gets a list of the identifiers for the measurements set (each measurement set is the data for a single
        partograph or labor)
        :param patient_id:
        :return:
        """

        prefix = self.__prefix + patient_id + "/"
        response = self.__s3_client.list_objects_v2(
            Bucket=self.__bucket,
            Prefix=prefix,
        )

        print(response)

        identifiers = set([remove_prefix(obj['Key'], prefix) for obj in response.get('Contents',[])])

        if "" in identifiers:
            identifiers.remove("")

        result = [{"partogram_id": identifier} for identifier in list(identifiers)]

        return {
            'partograms': result
        }

    def make_new_partogram(self, patient_id):
        partogram_id = uuid.uuid4()
        o = self.__s3_resource.Object(self.__bucket, self.__prefix + patient_id + "/" + str(partogram_id))
        o.put()
        return {
            'partogram_id': str(partogram_id)
        }

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