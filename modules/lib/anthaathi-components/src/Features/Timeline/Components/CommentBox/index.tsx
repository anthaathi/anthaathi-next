import * as React from 'react';
import {
	TimelineStatus,
	TimelineStatusBody,
	TimelineStatusTitleWrapper,
	TimelineWrapper,
} from '../TimelineStatus';
import { useStyletron } from 'baseui';
import { CardDivider } from '../../../DetailViewer';
import { MarkdownViewer } from '../../../MarkdownEditor';

export interface CommentBoxProps {
	fullWidth?: boolean;
	title?: React.ReactNode;
	/**
	 * @deprecated
	 */
	subTitle?: string;
	children?: string;
	onChange?: (newText: string) => void;
	minHeight?: string;
}

function CommentBox({
	fullWidth = false,
	title,
	subTitle,
	children,
	onChange,
	minHeight,
}: CommentBoxProps) {
	const [, $theme] = useStyletron();

	return (
		<TimelineWrapper
			$style={{
				[$theme.mediaQuery.large]: {
					marginLeft: fullWidth ? '0' : '60px',
				},
			}}
		>
			<TimelineStatus>
				<TimelineStatusTitleWrapper>{title}</TimelineStatusTitleWrapper>
				<CardDivider $style={{ borderTopColor: '#DDD' }} />
				<TimelineStatusBody>
					<MarkdownViewer
						minHeight={minHeight}
						onChange={onChange}
						value={children ?? subTitle ?? ''}
					/>
				</TimelineStatusBody>
			</TimelineStatus>
		</TimelineWrapper>
	);
}

export default CommentBox;
