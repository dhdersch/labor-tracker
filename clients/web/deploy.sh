#!/bin/bash


BUCKET_NAME=labor-tracker-website

aws --region us-east-1 --profile labor-tracker s3 sync --acl "public-read" --sse "AES256" dist/ s3://$BUCKET_NAME
