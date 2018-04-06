import json
from botocore.exceptions import ClientError
import uuid


class PatientRepo(object):

    def __init__(self, **kwargs):
        self.__s3_resource = kwargs['s3']
        self.__s3_client = kwargs['s3_client']
        self.__bucket = kwargs['bucket']
        self.__prefix = kwargs['prefix']
        self.__table = kwargs['table']

    def get_measurements(self, identity, partogram_id):
        self.__table.query()


    def add_measurement(self, identity, measurement):
        key = identity + measurement['partogram_id']
        measurement['key'] = key
        self.__table.put_item(
            Item=measurement
        )

    def list_measurement_sets(self, patient_id):
        """
        Gets a list of the identifiers for the measurements set (each measurement set is the data for a single
        partograph or labor)
        :param patient_id:
        :return:
        """
        response = self.__s3_client.list_objects_v2(
            Bucket=self.__bucket,
            Prefix=self.__prefix + patient_id + "/"
        )
        partogram_identifiers_for_user = [obj['Key'] for obj in response['Contents']]
        return json.dumps({
            'partogram_ids': partogram_identifiers_for_user
        })

    def make_new_partogram(self, patient_id):
        partogram_id = uuid.uuid4()
        o = self.__s3_resource.Object(self.__bucket, self.__prefix + patient_id + "/" + partogram_id)
        return json.dumps({
            'partogram_id': partogram_id
        })

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
