/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getUrlParts } from 'lib/url/url-parts';
import isPrivateSite from 'state/selectors/is-private-site';
import isSiteAutomatedTransfer from 'state/selectors/is-site-automated-transfer';
import getSelectedSiteId from 'state/ui/selectors/get-selected-site-id';
import getSelectedSiteSlug from 'state/ui/selectors/get-selected-site-slug';
import ProxiedImage from './proxied-image';

const parseMediaURL = ( url: string, siteSlug: string ) => {
	const { pathname, search: query, hostname } = getUrlParts( url );
	let filePath = pathname;
	let isRelativeToSiteRoot = true;
	if (
		hostname !== siteSlug &&
		( hostname.endsWith( 'wp.com' ) || hostname.endsWith( 'wordpress.com' ) )
	) {
		const [ first, ...rest ] = filePath.substr( 1 ).split( '/' );
		filePath = '/' + rest.join( '/' );

		if ( first !== siteSlug ) {
			isRelativeToSiteRoot = false;
		}
	}

	return {
		query,
		filePath,
		isRelativeToSiteRoot,
	};
};

interface Props {
	src: string;

	filePath: string;
	query: string;
	siteSlug: string;
	onLoad: () => any;
	useProxy: boolean;
	dispatch: any;
}

const MediaImage: React.FC< Props > = function MediaImage( {
	src,
	query,
	filePath,
	siteSlug,
	useProxy = false,
	dispatch,
	...rest
} ) {
	if ( useProxy ) {
		return <ProxiedImage siteSlug={ siteSlug } filePath={ filePath } query={ query } { ...rest } />;
	}

	/* eslint-disable-next-line jsx-a11y/alt-text */
	return <img src={ src } { ...rest } />;
};

export default connect( ( state, { src }: Pick< Props, 'src' > ) => {
	const siteId = getSelectedSiteId( state );
	const siteSlug = getSelectedSiteSlug( state ) as string;
	const isAtomic = !! isSiteAutomatedTransfer( state, siteId as number );
	const isPrivate = !! isPrivateSite( state, siteId );
	const { filePath, query, isRelativeToSiteRoot } = parseMediaURL( src, siteSlug );

	const useProxy =
		// Site privacy / coming soon are getting clobbered when the media lib loads
		// Should be fixed when D39264-code lands
		// Hard-coding for now so I can keep working...
		( true || ( isAtomic && isPrivate ) ) && filePath && isRelativeToSiteRoot;

	return {
		query,
		siteSlug,
		useProxy,
		filePath,
	};
} )( MediaImage );
