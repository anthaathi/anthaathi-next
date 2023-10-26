import MrLang from './intl/mr.json';
import EnLang from './intl/en.json';

export * from './StandardRoutes/Unauthorized/public';
export * from './Features/Layout/ContentWrapper/public';
export * from './Features/Branding/Header/public';
export * from './Features/Branding/Footer/public';
export * from './Features/FormBuilder/public';
export * from './Features/Datasource/public';
export * from './Features/Datatables/public';
export * from './Features/BadgesList/public';
export * from './Features/Timeline/public';
export * from './Features/MarkdownEditor/public';
export * from './Features/AvatarStack/public';
export * from './Features/DetailViewer/public';
export * from './Features/Header/public';
export * from './atoms/public';
export * from './Layouts/public';
export * from './Features/PictureUpload/public';
export * from './Features/TaskMetaData/public';
export * from './Features/Timeline/public';
export * from './Features/Sidebar/public';
export * from './Features/Utils/LoadFontForLanguage';
export * from './Features/FacetBuilder/public';
export * from './Features/Auth/public';
export * from './Features/FormBuilderV2/public';
export * from './Features/DatatableV2/public';
export * from './Utils/public';
export * from './Features/FormDataViewer/public';

export const Lang: Record<'mr' | 'en', Record<string, string>> = {
	mr: MrLang,
	en: EnLang,
};
