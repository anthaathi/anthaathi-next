import { useStyletron } from 'baseui';
import { Button, KIND, SIZE } from 'baseui/button';
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { expandBorderStyles } from 'baseui/styles';
import {
	At,
	CloudUpload,
	Link,
	ListBoxes,
	ListBulleted,
	TextBold,
	TextIndent,
	TextItalic,
	TextScale,
} from '@carbon/icons-react';
import { useIntl } from 'react-intl';
import {
	HeadingLarge,
	HeadingMedium,
	HeadingSmall,
	HeadingXLarge,
	HeadingXSmall,
	HeadingXXLarge,
	LabelXSmall,
	ParagraphSmall,
} from 'baseui/typography';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { StyledLink } from 'baseui/link';
import {
	Table,
	TableBody,
	TableHead,
} from '../../../Datatables/components/styled-tables';
import { StyleObject } from 'styletron-react';
import { Checkbox } from 'baseui/checkbox';
import { ButtonGroup } from 'baseui/button-group';

export interface MarkdownEditorProps {
	value: string;
	// eslint-disable-next-line no-unused-vars
	onChange(_value: string): void;
	id?: string;
	onFileUpload?: (files: File) => Promise<string | null>;
	onBlur?: VoidFunction;
	theme?: 'light' | 'dark';
	autoFocus?: boolean;
	onSubmit?: () => void;
	$override?: {
		Root?: {
			style?: StyleObject;
		};
	};
}

const isURL = (string) => {
	try {
		new URL(string);
		return true;
	} catch (error) {
		const pattern =
			// eslint-disable-next-line
			/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
		return pattern.test(string);
	}
};

export function MarkdownEditor({
	value,
	onChange,
	id,
	onFileUpload,
	onBlur,
	theme = 'dark',
	$override = {},
	autoFocus,
	onSubmit,
}: MarkdownEditorProps) {
	const [css, $theme] = useStyletron();

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (autoFocus) {
			textareaRef.current?.focus();
		}
	}, [autoFocus]);

	const [uploadingFile, setUploadingFile] = useState(0);

	const insertText = useCallback(
		(start: string, end = '') => {
			if (!textareaRef.current) {
				return;
			}

			const { selectionStart, selectionEnd, value } = textareaRef.current;

			const startingText = value.substring(0, selectionStart);
			const endingText = value.substring(selectionEnd);

			const selectedText = value.substring(selectionStart, selectionEnd);

			let newStartingText = startingText;
			let newEndingText = endingText;

			if (
				startingText.endsWith(start) &&
				(!end || endingText.startsWith(end))
			) {
				// remove start and end from text
				newStartingText = startingText.substring(
					0,
					startingText.length - start.length,
				);
				newEndingText = endingText.substring(end.length);
			} else {
				// add start and end to text
				newStartingText = startingText + start;
				newEndingText = end + endingText;
			}

			onChange(newStartingText + selectedText + newEndingText);

			setTimeout(() => {
				textareaRef.current?.setSelectionRange(
					newStartingText.length,
					newStartingText.length + selectedText.length,
				);
				textareaRef.current?.focus();
			}, 0);
		},
		[onChange],
	);

	const [fileLength, setFileLength] = useState(0);

	const onFileUploadChange = useCallback(
		async (event) => {
			const files = event?.target?.files;
			if (!files.length) {
				return;
			}

			setFileLength(files.length);

			let index = 0;
			for (const file of files) {
				setUploadingFile(++index);
				const fileUrl = await onFileUpload?.(file);
				if (!fileUrl) {
					continue;
				}
				if (file.type.startsWith('image/')) {
					insertText(`![${file.name}](${fileUrl})\n`);
				}
			}
			setUploadingFile(0);
			setFileLength(0);
		},
		[insertText, onFileUpload],
	);

	const handleFileUpload = useCallback(async () => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept =
			'.gif,.jpeg,.jpg,.mov,.mp4,.png,.svg,.webm,.csv,.docx,.fodg,.fodp,.fods,.fodt,.gz,.log,.md,.odf,.odg,.odp,.ods,.odt,.patch,.pdf,.pptx,.tgz,.txt,.xls,.xlsx,.zip';
		fileInput.multiple = true;
		document.body.appendChild(fileInput);
		fileInput.style.display = 'none';

		fileInput.addEventListener('change', async (event: any) => {
			fileInput.remove();
			await onFileUploadChange(event);
		});

		fileInput.click();
	}, [onFileUploadChange]);

	const insertAtStart = useCallback(
		(contentToInsert: string) => {
			if (!textareaRef.current) {
				return;
			}

			if (!textareaRef.current) {
				return;
			}

			const textarea = textareaRef.current;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			let selectedText = textarea.value.substring(start, end);
			let lines;
			let updatedLines;
			let updatedText;

			if (start === end) {
				// no text selected, insert contentToInsert at start of line
				const startOfLine = textarea.value.lastIndexOf('\n', start - 1) + 1;
				let endOfLine = textarea.value.indexOf('\n', start);
				if (endOfLine === -1) {
					endOfLine = textarea.value.length;
				}
				selectedText = textarea.value.substring(startOfLine, endOfLine);
				if (selectedText.startsWith(contentToInsert)) {
					// remove contentToInsert from start of line
					updatedText = selectedText.substring(contentToInsert.length);
				} else {
					// add contentToInsert to start of line
					lines = selectedText.split('\n');
					updatedLines = lines.map((line) => contentToInsert + line);
					updatedText = updatedLines.join('\n');
				}

				onChange(
					textarea.value.substring(0, startOfLine) +
						updatedText +
						textarea.value.substring(endOfLine),
				);
				textarea.focus();
				textarea.setSelectionRange(
					start + contentToInsert.length,
					start + contentToInsert.length,
				);
			} else {
				// text is selected, insert or remove contentToInsert at beginning of each selected line
				lines = selectedText.split('\n');
				updatedLines = lines.map((line) => {
					if (line.startsWith(contentToInsert)) {
						return line.substring(contentToInsert.length);
					} else {
						return contentToInsert + line;
					}
				});
				updatedText = updatedLines.join('\n');

				onChange(
					textarea.value.substring(0, start) +
						updatedText +
						textarea.value.substring(end),
				);
				textarea.focus();
				textarea.setSelectionRange(start, start + updatedText.length);
			}
		},
		[onChange],
	);

	const intl = useIntl();

	const insertURL = useCallback(
		(value?: string) => {
			const textarea = textareaRef.current;
			if (!textarea) {
				return;
			}

			const selectedText =
				value ??
				textarea.value.substring(
					textarea.selectionStart,
					textarea.selectionEnd,
				);
			const prefix = textarea.value.substring(0, textarea.selectionStart);
			const suffix = textarea.value.substring(textarea.selectionEnd);

			if (isURL(selectedText)) {
				const firstHalf = `${prefix}[`;
				const placeholderText = `Enter your text here`;
				const secondHalf = placeholderText + `](${selectedText})${suffix}`;
				onChange([firstHalf, secondHalf].join(''));
				setTimeout(() => {
					textareaRef.current?.setSelectionRange(
						firstHalf.length,
						firstHalf.length + placeholderText.length,
					);
					textareaRef.current?.focus();
				}, 0);
			} else {
				const firstHalf = `${prefix}[` + selectedText + '](';
				const placeholderText = `put your link here`;
				const secondHalf = `${placeholderText})${suffix}`;
				onChange([firstHalf, secondHalf].join(''));

				setTimeout(() => {
					textareaRef.current?.setSelectionRange(
						firstHalf.length,
						firstHalf.length + placeholderText.length,
					);
					textareaRef.current?.focus();
				}, 0);
			}
		},
		[onChange],
	);

	const [, setShouldThereWillBeADropdown] = useState(false);

	const getAtdrateSelection = useCallback(() => {
		const textarea = textareaRef.current;

		if (!textarea) {
			return;
		}

		const selectionStart = textarea.selectionStart;
		const selectionEnd = textarea.selectionEnd;

		setShouldThereWillBeADropdown(false);

		if (selectionStart !== selectionEnd) {
			return;
		}

		const valueBeforeSelection = textarea.value.substring(0, selectionStart);
		const atSignIndex = valueBeforeSelection.lastIndexOf('@');

		if (
			!(
				(atSignIndex !== -1 &&
					/\b/.test(valueBeforeSelection.charAt(atSignIndex + 1))) ||
				atSignIndex === selectionStart - 1
			)
		) {
			return;
		}

		const split = valueBeforeSelection.split(' ');

		if ((split[split.length - 1] ?? '').indexOf('@') === -1) {
			return;
		}

		setShouldThereWillBeADropdown(true);

		const value = textarea.value.substring(0, selectionStart);

		const allValue = value.split('\n');

		const endLine = allValue[allValue.length - 1];

		const selectedText = [
			...Array.from({ length: allValue.length - 1 })
				.map(() => '')
				.join('\n'),
			endLine,
		].join('\n');

		const tempSpan = document.createElement('span');
		tempSpan.textContent = selectedText;
		tempSpan.style.position = 'absolute';
		tempSpan.className = css({
			padding: $theme.sizing.scale200,
			backgroundColor: $theme.colors.backgroundPrimary,
			borderBottomRightRadius: $theme.borders.inputBorderRadius,
			borderBottomLeftRadius: $theme.borders.inputBorderRadius,
			maxWidth: textarea.getBoundingClientRect().width + 'px',
			whiteSpace: 'pre-wrap',
			...$theme.typography.LabelMedium,
		});
		tempSpan.style.top = '400px';
		tempSpan.style.left = '400px';
		document.body.appendChild(tempSpan);

		const rect = tempSpan.getBoundingClientRect();

		const x = rect.width;
		const y = rect.height - textarea.scrollTop;

		tempSpan.remove();

		return [x, y];
	}, [
		$theme.borders.inputBorderRadius,
		$theme.colors.backgroundPrimary,
		$theme.sizing.scale200,
		$theme.typography.LabelMedium,
		css,
	]);

	const [, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		if (!textareaRef.current) {
			return;
		}

		const textarea = textareaRef.current;

		const onSelectionChange = () => {
			if (textarea.selectionStart !== textarea.selectionEnd) {
				return;
			}
			const position = getAtdrateSelection();

			if (!position) {
				return;
			}

			setPosition({ x: position[0], y: position[1] });
		};

		textarea.addEventListener('selectionchange', onSelectionChange);

		return () => {
			textarea.removeEventListener('selectionchange', onSelectionChange);
		};
	}, [getAtdrateSelection]);

	const [isPreview, setIsPreview] = useState(false);

	return (
		<div
			className={css({
				...(theme === 'dark'
					? expandBorderStyles($theme.borders.border200)
					: {
							borderColor: $theme.colors.borderOpaque,
							borderWidth: $theme.borders.border200.borderWidth,
							borderStyle: $theme.borders.border200.borderStyle,
					  }),
				borderRadius: $theme.borders.inputBorderRadius,
				display: 'flex',
				width: '100%',
				flexDirection: 'column',
				...($override?.Root?.style ?? {}),
			})}
		>
			<div
				className={css({
					display: 'flex',
					backgroundColor:
						theme === 'dark'
							? $theme.colors.backgroundTertiary
							: $theme.colors.backgroundPrimary,
					paddingLeft: $theme.sizing.scale700,
					paddingRight: $theme.sizing.scale700,
					paddingBottom: $theme.sizing.scale200,
					paddingTop: $theme.sizing.scale200,
					width: `calc(100% - ${$theme.sizing.scale700} - ${$theme.sizing.scale700})`,

					borderBottomColor: $theme.borders.border200.borderColor,
					borderBottomWidth: $theme.borders.border200.borderWidth,
					borderBottomStyle: $theme.borders.border200.borderStyle as never,

					borderTopRightRadius: $theme.borders.inputBorderRadius,
					borderTopLeftRadius: $theme.borders.inputBorderRadius,
				})}
			>
				{value && (
					<div
						className={css({
							display: 'flex',
							alignItems: 'center',
							placeContent: 'center',
						})}
					>
						<Button
							type="button"
							kind="secondary"
							size={SIZE.mini}
							onClick={() => {
								setIsPreview((prev) => !isPreview);
							}}
						>
							{isPreview ? 'Edit' : 'Preview'}
						</Button>
					</div>
				)}

				{!isPreview && (
					<ButtonGroup
						overrides={{
							Root: {
								style: {
									flexWrap: 'wrap',
								},
							},
						}}
						kind={theme === 'dark' ? KIND.secondary : KIND.tertiary}
						size={SIZE.mini}
					>
						<ActionButton theme={theme} onClick={() => insertAtStart('### ')}>
							<TextScale />
						</ActionButton>

						<ActionButton theme={theme} onClick={() => insertText('**', '**')}>
							<TextBold />
						</ActionButton>

						<ActionButton theme={theme} onClick={() => insertText('_', '_')}>
							<TextItalic />
						</ActionButton>

						<ActionButton theme={theme} onClick={() => insertAtStart('> ')}>
							<TextIndent />
						</ActionButton>

						<ActionButton theme={theme} onClick={() => insertURL()}>
							<Link />
						</ActionButton>

						<ActionButton theme={theme} onClick={() => insertAtStart('- ')}>
							<ListBoxes />
						</ActionButton>

						<ActionButton theme={theme} onClick={() => insertAtStart('- [ ] ')}>
							<ListBulleted />
						</ActionButton>

						<ActionButton theme={theme} onClick={() => insertText('@')}>
							<At />
						</ActionButton>

						<ActionButton theme={theme} onClick={() => handleFileUpload()}>
							<CloudUpload />
						</ActionButton>
					</ButtonGroup>
				)}
			</div>

			{isPreview ? (
				<div
					className={css({
						paddingLeft: $theme.sizing.scale700,
						paddingRight: $theme.sizing.scale700,
						backgroundColor: $theme.colors.backgroundPrimary,
						borderBottomRightRadius: $theme.borders.inputBorderRadius,
						borderBottomLeftRadius: $theme.borders.inputBorderRadius,
						width: `calc(100% - ${$theme.sizing.scale700} - ${$theme.sizing.scale700})`,
					})}
				>
					<MarkdownViewer onChange={onChange} value={value} />
				</div>
			) : (
				<div
					className={css({
						position: 'relative',
						flexGrow: 1,
						display: 'flex',
						flexDirection: 'column',
					})}
				>
					<textarea
						ref={textareaRef}
						id={id}
						onKeyDown={(e) => {
							if ((e.keyCode === 10 || e.keyCode === 13) && e.ctrlKey) {
							}
						}}
						onBlur={onBlur}
						onChange={(e) => {
							onChange((e.target as never as HTMLInputElement).value);
						}}
						className={css({
							width: `calc(100% - ${$theme.sizing.scale700} - ${$theme.sizing.scale700})`,
							paddingLeft: $theme.sizing.scale700,
							paddingTop: $theme.sizing.scale300,
							paddingRight: $theme.sizing.scale700,
							border: 0,
							flexGrow: 1,
							minHeight: '100px',
							outline: 0,
							...$theme.typography.LabelMedium,
							resize: 'none',
						})}
						value={value}
					/>
				</div>
			)}

			<div
				className={css({
					display: 'flex',
					backgroundColor:
						theme === 'dark'
							? $theme.colors.backgroundTertiary
							: $theme.colors.backgroundPrimary,
					paddingLeft: $theme.sizing.scale700,
					paddingRight: $theme.sizing.scale700,
					paddingBottom: $theme.sizing.scale400,
					paddingTop: $theme.sizing.scale400,

					...(theme === 'dark'
						? {
								borderBottomColor: $theme.borders.border200.borderColor,
								borderBottomWidth: $theme.borders.border200.borderWidth,
								borderBottomStyle: $theme.borders.border200
									.borderStyle as never,
						  }
						: {}),

					borderTopColor: $theme.borders.border200.borderColor,
					borderTopWidth: $theme.borders.border200.borderWidth,
					borderTopStyle: $theme.borders.border200.borderStyle as never,
					borderBottomRightRadius: $theme.borders.inputBorderRadius,
					borderBottomLeftRadius: $theme.borders.inputBorderRadius,
					minHeight: '18px',
				})}
				onClick={handleFileUpload}
			>
				<LabelXSmall>
					{fileLength === 0
						? intl.formatMessage({
								defaultMessage:
									'Attach files by dragging & dropping, selecting or pasting them.',
						  })
						: intl.formatMessage(
								{ defaultMessage: 'Uploading file {fileOf} / {fileIn}' },
								{ fileOf: uploadingFile, fileIn: fileLength },
						  )}
				</LabelXSmall>
			</div>
		</div>
	);
}

interface ActionButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	theme: 'dark' | 'light';
}

function ActionButton({ children, onClick, ...props }: ActionButtonProps) {
	return (
		<Button onClick={onClick} type="button" {...props}>
			{children}
		</Button>
	);
}

export interface MarkdownViewerProps {
	value: string;
	placeholder?: string;
	/**
	 * This will get called when a checkbox is checked.
	 * @param newText
	 */
	onChange?: (newText: string) => void;
	minHeight?: string;
}

export function MarkdownViewer(props: MarkdownViewerProps) {
	const [css, $theme] = useStyletron();

	return (
		<MarkdownEditContext.Provider
			value={{
				onChangeCheckbox: (sourcePosition, checked) => {
					const offset = sourcePosition.start.offset!;
					const prefix = props.value.slice(0, offset);
					const newValue =
						prefix +
						props.value
							.slice(offset)
							.replace(
								/^([-+*]\s+)\[[x ]\](\s)/,
								`$1[${checked ? 'x' : ' '}]$2`,
							);
					props.onChange?.(newValue);
				},
			}}
		>
			<ReactMarkdown
				children={props.value || props.placeholder || ''}
				className={css({
					...$theme.typography.LabelMedium,
					minHeight: props.minHeight ?? '100px',
					...(props.value ? {} : { color: $theme.colors.contentTertiary }),
				})}
				remarkPlugins={[remarkGfm]}
				components={{
					div: ({ node, ...props }) => <div {...props} />,
					p: ({ node, ...cmpProps }) => (
						<ParagraphSmall
							marginTop={0}
							marginBottom={0}
							$style={{
								...(props.value
									? {}
									: { color: $theme.colors.contentTertiary }),
							}}
							{...cmpProps}
						/>
					),
					a: ({ node, ...props }) => {
						return (
							<StyledLink
								target="_blank"
								referrerPolicy="no-referrer"
								rel="noopener noreferrer"
								{...props}
								href={props.href ? addHttps(props.href) : props.href}
							/>
						);
					},
					ul: ({ node, ...props }) => (
						<ul
							{...props}
							className={
								props.className +
								' ' +
								css({
									marginTop: $theme.sizing.scale200,
									marginBottom: $theme.sizing.scale200,
									paddingLeft: $theme.sizing.scale600,
								})
							}
						/>
					),
					ol: ({ node, ...props }) => <ol {...props} />,
					li: ListWrapper as never,
					h1: ({ node, ...props }) => (
						<HeadingXXLarge marginBottom={0} marginTop={0} {...props} />
					),
					h2: ({ node, ...props }) => (
						<HeadingXLarge marginBottom={0} marginTop={0} {...props} />
					),
					h3: ({ node, ...props }) => (
						<HeadingLarge marginBottom={0} marginTop={0} {...props} />
					),
					h4: ({ node, ...props }) => (
						<HeadingMedium marginBottom={0} marginTop={0} {...props} />
					),
					h5: ({ node, ...props }) => (
						<HeadingSmall marginBottom={0} marginTop={0} {...props} />
					),
					h6: ({ node, ...props }) => (
						<HeadingXSmall marginBottom={0} marginTop={0} {...props} />
					),
					blockquote: ({ node, ...props }) => <blockquote {...props} />,
					pre: ({ node, ...props }) => <pre {...props} />,
					code: ({ node, ...props }) => <code {...props} />,
					em: ({ node, ...props }) => <em {...props} />,
					strong: ({ node, ...props }) => <strong {...props} />,
					del: ({ node, ...props }) => <del {...props} />,
					hr: ({ node, ...props }) => <hr {...props} />,
					table: ({ node, ...props }) => <Table {...props} />,
					thead: ({ node, ...props }) => (
						<TableHead {...props} $style={{ boxShadow: 'none' }} />
					),
					tbody: ({ node, ...props }) => <TableBody {...props} />,
					tr: ({ node, ...props }) => <tr {...props} />,
					th: ({ node, ...props }) => <th {...props} />,
					img: ({ node, ...props }) => (
						<img
							alt="uploaded file"
							className={css({
								maxWidth: '100%',
							})}
							{...props}
						/>
					),
				}}
			/>
		</MarkdownEditContext.Provider>
	);
}

function addHttps(url: string) {
	if (url.startsWith('#')) {
		return url;
	}

	if (!/^https:\/\//i.test(url)) {
		url = 'https://' + url;
	}
	return url;
}

const MarkdownEditContext = createContext({
	onChangeCheckbox: (p, checked) => {},
});

const ListWrapper = ({
	checked,
	index,
	ordered,
	node,
	sourcePosition,
	siblingCount,
	...props
}) => {
	const { onChangeCheckbox } = useContext(MarkdownEditContext);
	const [css] = useStyletron();

	if (checked == null) {
		return React.createElement('li', props);
	}

	return React.createElement(
		'li',
		{
			...props,
			className:
				props.className +
				' ' +
				css({
					display: 'flex',
					alignItems: 'center',
				}),
		},
		React.Children.map(props.children, (child) =>
			child &&
			typeof child === 'object' &&
			'type' in child &&
			child.type === 'input' &&
			child.props.type === 'checkbox' ? (
				// Manipulate input tag by React.cloneElement() or return customized checkbox. Below code is for material-ui.
				<Checkbox
					overrides={{
						Root: {
							style: {
								marginRight: '12px',
							},
						},
					}}
					checked={child.props.checked}
					onChange={(e) => {
						onChangeCheckbox(sourcePosition!, e.target.checked);
					}}
				/>
			) : (
				child
			),
		),
	);
};
