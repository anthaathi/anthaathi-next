#!/bin/python3
import os

import requests
import json
import subprocess


def create_store():
	headers = {
		'Accept': 'application/json, text/plain, */*',
		'Content-Type': 'application/json',
	}

	current_stores = requests.get('http://127.0.0.1:8080/stores', headers=headers)

	if current_stores.status_code == 200:
		for store in current_stores.json()['stores']:
			if store['name'] == 'anthaathi-root':
				return store['id']

	json_data = {
		'name': 'anthaathi-root',
	}

	response = requests.post('http://127.0.0.1:8080/stores', headers=headers, json=json_data)

	if response.status_code != 201:
		raise Exception('Failed to create store')

	return response.json()['id']


def create_model():
	headers = {
		'Accept': 'application/json, text/plain, */*',
		'Content-Type': 'application/json',
	}

	id = create_store()

	json_data = json.load(open('./authz.json'))

	response = requests.post(
		'http://127.0.0.1:8080/stores/%s/authorization-models' % id,
		headers=headers,
		json=json_data,
	)

	os.putenv('OPENFGA_STORE_ID', id)

	if response.status_code != 201:
		raise Exception('Failed to create model')

	print('Model created successfully')

	print('Run the following command to set the authorization model id\n')

	print('export OPENFGA_STORE_ID=%s' % id)
	print('export OPENFGA_AUTHORIZATION_MODEL_ID=' + response.json()['authorization_model_id'])

if __name__ == "__main__":
	create_model()
