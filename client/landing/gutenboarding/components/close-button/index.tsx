/**
 * External dependencies
 */
import React from 'react';
import { Button } from '@wordpress/components';
import { Icon, close } from '@wordpress/icons';
import { useI18n } from '@automattic/react-i18n';

interface CloseButtonProps {
	onClose: () => void;
}

const CloseButton = ( { onClose }: CloseButtonProps ) => {
	const { __: NO__ } = useI18n();
	return (
		<Button onClick={ onClose } label={ NO__( 'Close dialog' ) }>
			<Icon icon={ close } />
		</Button>
	);
};

export default CloseButton;
