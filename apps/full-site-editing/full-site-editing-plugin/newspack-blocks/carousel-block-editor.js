/* eslint-disable import/no-extraneous-dependencies */
/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
/* eslint-enable import/no-extraneous-dependencies */

/**
 * External dependencies
 */
import { settings } from './synced-newspack-blocks/blocks/carousel/index';

/**
 * Block name in the A8C\FSE context.
 */
const blockName = 'a8c/posts-carousel';

function setBlockTransformationName( name ) {
	return name !== 'newspack-blocks/carousel' ? name : blockName;
}

addFilter(
	'blocks.transforms_from_name',
	'set-transformed-block-name',
	setBlockTransformationName
);

registerBlockType( blockName, {
	...settings,
	title: __( 'Posts Carousel', 'full-site-editing' ),
	category: 'layout',
} );
