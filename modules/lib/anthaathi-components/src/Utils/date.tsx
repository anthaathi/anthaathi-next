import React, { useCallback, useMemo } from 'react';

const DateDataContext = React.createContext<{ locale }>({ locale: 'en-US' });

export const DateFormatProvider = ({
	locale,
	children,
}: {
	locale: string;
	children: React.ReactNode;
}) => {
	return (
		<DateDataContext.Provider value={{ locale }}>
			{children}
		</DateDataContext.Provider>
	);
};

export const useDateFormat = () => {
	const { locale } = React.useContext(DateDataContext);

	const relativeTime = useMemo(
		() => new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }),
		[locale]
	);

	return useCallback((date: Date) => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();

		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const months = Math.floor(days / 30);
		const years = Math.floor(months / 12);

		const diffTime = Math.abs(now.getTime() - date.getTime());

		const difference = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (years > 0) {
			return relativeTime.format(-years, 'year');
		}

		if (months > 0) {
			return relativeTime.format(-months, 'month');
		}

		if (days > 0) {
			return relativeTime.format(-days, 'day');
		}

		if (hours > 0) {
			return relativeTime.format(-hours, 'hour');
		}

		if (minutes > 0) {
			return relativeTime.format(-minutes, 'minute');
		}

		if (seconds > 0) {
			return relativeTime.format(-seconds, 'second');
		}

		return relativeTime.format(-difference, 'second');
	}, [relativeTime]);
};
