/**
 * External dependencies
 */
import { useTranslate, TranslateResult } from 'i18n-calypso';
import React, { FunctionComponent } from 'react';

/**
 * Internal dependencies
 */
import { Button } from '@automattic/components';
import contactSupportUrl from 'landing/jetpack-cloud/lib/contact-support-url';
import Gridicon from 'components/gridicon';

interface Props {
	errorText: TranslateResult;
	siteUrl: string;
}

const RewindFlowError: FunctionComponent< Props > = ( { errorText, siteUrl } ) => {
	const translate = useTranslate();
	return (
		<>
			<div className="rewind-flow__header">
				<img
					src="/calypso/images/illustrations/jetpack-cloud-download-failure.svg"
					alt="jetpack cloud download error"
				/>
			</div>
			<h3 className="rewind-flow__title">{ errorText }</h3>
			<Button
				className="rewind-flow__primary-button"
				href={ contactSupportUrl( siteUrl, 'error' ) }
				primary
				rel="noopener noreferrer"
				target="_blank"
			>
				{ translate( 'Contact Support {{externalIcon/}}', {
					components: { externalIcon: <Gridicon icon="external" size={ 24 } /> },
				} ) }
			</Button>
		</>
	);
};

export default RewindFlowError;
