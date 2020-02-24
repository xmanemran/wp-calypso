/**
 * External dependencies
 */
import * as React from 'react';
import memize from 'memize';
import { I18n, LocaleData } from './i18n-locale';
import { createHigherOrderComponent } from '@wordpress/compose';

export interface I18nReact {
	i18nlocale: string;
	__: I18n[ '__' ];
	_n: I18n[ '_n' ];
	_nx: I18n[ '_nx' ];
	_x: I18n[ '_x' ];
}

const DEFAULT_LOCALE = 'en';
const I18nContext = React.createContext< I18nReact >( makeContextValue( DEFAULT_LOCALE, {} ) );

interface Props {
	locale?: string;
	localeData?: LocaleData;
}
export const I18nProvider: React.FunctionComponent< Props > = ( {
	children,
	locale = 'en',
	localeData,
} ) => {
	const makeStableContext = React.useRef< typeof makeContextValue >( memize( makeContextValue ) );
	return (
		<I18nContext.Provider value={ makeStableContext.current( locale, localeData ) }>
			{ children }
		</I18nContext.Provider>
	);
};

/**
 * React hook providing i18n translate functions
 *
 * @example
 *
 * import { useI18n } from '@automattic/react-i18n';
 * function MyComponent() {
 *   const { __ } = useI18n();
 *   return <div>{ __( 'Translate me.', 'text-domain' ) }</div>;
 * }
 */
export const useI18n = (): I18nReact => {
	const ctx = React.useContext( I18nContext );
	React.useDebugValue( ctx.i18nlocale );
	return ctx;
};

/**
 * React hook providing i18n translate functions
 *
 * @param InnerComponent Component that will receive translate functions as props
 * @returns Component enhanced with i18n context
 *
 * @example
 *
 * import { withI18n } from '@automattic/react-i18n';
 * function MyComponent( { __ } ) {
 *   return <div>{ __( 'Translate me.', 'text-domain' ) }</div>;
 * }
 * export default withI18n( MyComponent );
 */
export const withI18n = createHigherOrderComponent< I18nReact >( InnerComponent => {
	return props => {
		const i18n = useI18n();
		return <InnerComponent { ...i18n } { ...props } />;
	};
}, 'withI18n' );

/**
 * Utility to make a new context value
 *
 * @param locale The locale of the context value
 * @param localeData The localeData
 *
 * @returns The context value with bound translation functions
 */
function makeContextValue( locale: string, localeData?: LocaleData ): I18nReact {
	const i18n = new I18n( localeData );
	return {
		i18nlocale: locale,
		__: i18n.__.bind( i18n ),
		_n: i18n._n.bind( i18n ),
		_nx: i18n._nx.bind( i18n ),
		_x: i18n._x.bind( i18n ),
	};
}
