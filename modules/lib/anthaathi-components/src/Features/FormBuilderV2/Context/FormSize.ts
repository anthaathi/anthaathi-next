import React from 'react';

export const FormSizeContext = React.createContext<
	'compact' | 'mini' | 'default' | 'large'
>('default');
