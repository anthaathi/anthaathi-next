import { FormControl } from 'baseui/form-control';
import { FileUploader } from 'baseui/file-uploader';
import { Block } from 'baseui/block';
import { Cell } from 'baseui/layout-grid';
import { RenderStringProps } from '../Render/RenderString';
import React, { useCallback, useEffect, useId, useState } from 'react';
import { FormLabel } from './FormLabel';
import type { FileUploadType } from '../type';
import { ProgressBar } from 'baseui/progress-bar';
import { useFormValue } from '../Hooks/use-form-value';
import { LabelMedium } from 'baseui/typography';
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Close } from '@carbon/icons-react';
import type {
	ErrorCallback,
	IndexedObject,
	UploadCompleteCallback,
	UploadProgressCallback,
} from '@uppy/core';

export function FileUpload(
	props: RenderStringProps & {
		onFileUpload?: FileUploadType;
		isMulti?: boolean;
	}
) {
	const fieldId = useId();

	const label = (
		<FormLabel title={props.field.title} required={props.required} />
	);

	const [value, setValue] = useFormValue<
		{ id: string; name: string; url: string }[]
	>(props.path);

	const recalculateInProgressFiles = useCallback(() => {
		const files = props.onFileUpload?.getFiles() || [];

		const returnValue =
			files
				.filter((file) => !file.progress?.uploadComplete)
				.map((res) => ({
					id: res.id,
					name: res.meta.name,
					progress: res.progress?.bytesUploaded
						? (res.progress?.bytesUploaded / res.progress?.bytesTotal) * 100
						: Infinity,
				})) ?? [];

		setFiles(returnValue);

		return returnValue;
	}, [props.onFileUpload]);

	const handleFileUpload = useCallback(
		async function handleFileUpload(files: File[]) {
			if (!props.onFileUpload) {
				return;
			}

			props.onFileUpload.addFiles(
				files.map((file) => ({
					data: file,
					name: file.name,
					extension: file.name.split('.').pop() as string,
					type: file.type,
				}))
			);

			recalculateInProgressFiles();
			await props.onFileUpload.upload();
		},
		[props.onFileUpload, recalculateInProgressFiles]
	);

	const [files, setFiles] = useState<
		{ id: string; name: string; url?: string; progress: number }[]
	>([]);

	useEffect(() => {
		if (!props.onFileUpload) {
			console.warn('File upload not configured');
			return;
		}

		if (typeof props.onFileUpload !== 'object') {
			throw new Error('File upload must be an object');
		}

		recalculateInProgressFiles();

		const completeHandler: UploadCompleteCallback<IndexedObject<any>> = (
			result
		) => {
			setFiles((prevFiles) => {
				return prevFiles.filter(
					(file) =>
						result.successful.findIndex((res) => res.id === file.id) === -1
				);
			});

			setValue((prevValue) => {
				const newUploads = result.successful.map((res) => ({
					id: res.id,
					url: res.uploadURL,
					name: res.meta.name,
				}));

				return [
					...newUploads,
					...(prevValue || []).filter(
						(res) =>
							newUploads.findIndex((upload) => res.id === upload.id) === -1
					),
				];
			});
		};

		const errorHandler: ErrorCallback = () => {};

		const progressHandler: UploadProgressCallback<IndexedObject<any>> = (
			data
		) => {
			setFiles((prevFiles) => {
				return prevFiles.map((res) => {
					if (res.id === data?.id) {
						return {
							...res,
							progress:
								((data?.progress?.bytesUploaded ?? 0) /
									(data?.progress?.bytesTotal ?? 0)) *
									100 || Infinity, // Always bytes uploaded is zero so
						};
					}

					return res;
				});
			});
		};

		props.onFileUpload?.on('complete', completeHandler);
		props.onFileUpload?.on('error', errorHandler);
		props.onFileUpload?.on('upload-progress', progressHandler);

		return () => {
			props.onFileUpload?.off('complete', completeHandler);
			props.onFileUpload?.off('error', errorHandler);
			props.onFileUpload?.off('upload-progress', progressHandler);
		};
	}, [props.onFileUpload, recalculateInProgressFiles, setValue]);

	const [css, $theme] = useStyletron();

	return (
		<>
			<Cell {...(props.field.cellProps ?? { span: 12 })}>
				<FormControl label={label} htmlFor={fieldId}>
					<FileUploader
						disabled={props.field.disabled}
						multiple={false}
						onDrop={(acceptedFiles) => {
							handleFileUpload(acceptedFiles);
						}}
						accept={props.field.accept}
						overrides={{
							HiddenInput: {
								props: {
									id: fieldId,
								},
							},
							ButtonComponent: {
								props: {
									type: 'button',
								},
							},
						}}
					/>
				</FormControl>

				<>
					{[...(value || []), ...files].map(
						(
							res: {
								id: string;
								name: string;
								url?: string;
								progress?: number;
							},
							index
						) => (
							<div
								className={css({
									display: 'flex',
									alignContent: 'center',
									placeItems: 'center',
									marginBottom: $theme.sizing.scale200,
									position: 'relative',
								})}
								key={res.id}
							>
								<div
									className={css({
										position: 'absolute',
										bottom: '-16px',
										left: '-12px',
										right: '-12px',
									})}
								>
									<ProgressBar
										value={
											res.progress === Infinity ? undefined : res.progress ?? 0
										}
										infinite={res.progress === Infinity}
									/>
								</div>
								<LabelMedium as="a" href={res.url ?? '#'} download>
									{res.name}
								</LabelMedium>
								<span className={css({ flexGrow: 1 })} />
								<Button
									kind="secondary"
									size="compact"
									onClick={() => {
										setValue((prevValue) =>
											(prevValue || []).filter(
												(prevRes) => prevRes.id !== res.id
											)
										);

										props.onFileUpload?.removeFile(res.id);
									}}
								>
									<Close />
								</Button>
							</div>
						)
					)}
				</>

				<Block marginBottom="scale400" />
			</Cell>
		</>
	);
}
