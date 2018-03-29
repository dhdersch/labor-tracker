import json
from botocore.exceptions import ClientError


class PatientRepo(object):

    def __init__(self, s3_resource, bucket, prefix):
        self.__s3_resource = s3_resource
        self.__bucket = bucket
        self.__prefix = prefix

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
