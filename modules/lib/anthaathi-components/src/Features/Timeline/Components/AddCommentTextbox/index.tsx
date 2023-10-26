import * as React from 'react';
import { useStyletron } from 'baseui';
import { Avatar } from 'baseui/avatar';
import { Button } from 'baseui/button';
import { MarkdownEditor } from '../../../MarkdownEditor';
import { useState } from 'react';

export function AddCommentTextbox() {
	const [css] = useStyletron();

	const [value, setValue] = useState('');

	return (
		<>
			<div className={css({ display: 'flex' })}>
				<div className={css({ padding: '10px' })}>
					<Avatar name="My User" />
				</div>

				<div className={css({ flexGrow: 1 })}>
					<MarkdownEditor value={value} onChange={setValue} />
				</div>
			</div>
			<div
				className={css({
					display: 'flex',
					flexDirection: 'row-reverse',
					marginTop: '12px',
				})}
			>
				<Button>Comment</Button>
			</div>
		</>
	);
}
