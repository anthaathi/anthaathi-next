import { TimelineBadge, TimelineItem, TimelineItemBody } from '../TimelineItem';
import { TimelineItemWrapper } from '../TimelineStatus';
import React from 'react';

export function CommentBadge({
	children,
	icon,
}: {
	children?: React.ReactNode;
	icon?: React.ReactNode;
}) {
	return (
		<TimelineItemWrapper $style={{ marginLeft: '24px' }}>
			<TimelineItem data-component="timeline-item">
				{icon && <TimelineBadge>{icon}</TimelineBadge>}
				{children && <TimelineItemBody>{children}</TimelineItemBody>}
			</TimelineItem>
		</TimelineItemWrapper>
	);
}
