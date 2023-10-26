import * as React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormBuilder from './index';
import { FormSchema } from './types';
// import '@testing-library/jest-dom/extend-expect';
import { DataSourceProvider } from '../Datasource';
import { ConfigProvider } from '../Datatables/context/use-datatable-context';

const schema: FormSchema = {
	properties: {
		email: {
			name: 'email',
			type: 'string',
			format: 'email',
			title: 'Email',
		},
		password: {
			name: 'password',
			type: 'string',
			title: 'Password',
		},
		submit: {
			type: 'submit',
			name: 'submit',
			title: 'Submit',
		},
	},
	required: ['email', 'password'],
};

const onSubmit = jest.fn();

describe('FormBuilder', () => {
	beforeAll(() => {
		onSubmit.mockReset();
	});

	it('renders the correct number of fields based on the schema', () => {
		const { getAllByTestId } = render(
			<DataSourceProvider dataSources={{}}>
				<ConfigProvider>
					<FormBuilder schema={schema} onSubmit={onSubmit} />
				</ConfigProvider>
			</DataSourceProvider>,
		);
		const fields = getAllByTestId('form-field');
		expect(fields).toHaveLength(2);
	});

	it('displays validation errors for required fields when the form is submitted without filling them out', async () => {
		const { getByText } = render(
			<DataSourceProvider dataSources={{}}>
				<ConfigProvider>
					<FormBuilder schema={schema} onSubmit={onSubmit} />
				</ConfigProvider>
			</DataSourceProvider>,
		);
		const form = getByText('Submit');
		act(() => {
			fireEvent.click(form);
		});
		await waitFor(() => {
			expect(getByText('Email is a required field')).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(getByText('Password is a required field')).toBeInTheDocument();
		});
	});

	it('displays validation errors for fields with invalid data', async () => {
		const { getByLabelText, getByText } = render(
			<DataSourceProvider dataSources={{}}>
				<ConfigProvider>
					<FormBuilder schema={schema} onSubmit={onSubmit} />
				</ConfigProvider>
			</DataSourceProvider>,
		);
		const emailInput = getByLabelText('Email');
		act(() => {
			fireEvent.change(emailInput, { target: { value: 'invalid email' } });
		});
		act(() => {
			fireEvent.blur(emailInput);
		});
		await waitFor(() => {
			expect(getByText('Email must be a valid email')).toBeInTheDocument();
		});
	});

	// write a test to check if the form is submitted when all the fields are valid
	it('submits the form when all the fields are valid', async () => {
		const { getByLabelText, getByText } = render(
			<DataSourceProvider dataSources={{}}>
				<ConfigProvider>
					<FormBuilder schema={schema} onSubmit={onSubmit} />
				</ConfigProvider>
			</DataSourceProvider>,
		);
		const emailInput = getByLabelText('Email');
		act(() => {
			fireEvent.change(emailInput, { target: { value: '' } });
		});
		act(() => {
			fireEvent.blur(emailInput);
		});
		await waitFor(() => {
			expect(getByText('Email is a required field')).toBeInTheDocument();
		});
	});
});
