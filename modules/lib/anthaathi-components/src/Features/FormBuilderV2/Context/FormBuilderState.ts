import React, { SetStateAction } from 'react';

export const FormBuilderContext = React.createContext<
	[any, SetStateAction<any>]
>([{}, () => {}]);
