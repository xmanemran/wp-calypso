/* eslint-disable import/no-extraneous-dependencies */

/**
 * External dependencies
 */
import { debounce } from 'lodash';
import debug from 'debug';

/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

const tracksDebug = debug( 'wpcom-block-editor:analytics:tracks:block-search' );

let lastSearchTerm;
const trackSearchTerm = ( event, target ) => {
	// Actions dispatcher.
	const { setSearchBlocksTerm, setSearchBlocks, setSearchBlocksNotFound } = dispatch(
		'automattic/tracking'
	);

	// Get the search term from the event object.
	const key = event.key || event.keyCode;
	const searchTerm = ( target.value || '' ).trim().toLowerCase();

	// Check if it's a duplicated query.
	if ( lastSearchTerm === searchTerm && 'Enter' !== key ) {
		return tracksDebug( 'Same term: %o, type %o key. Skip.', searchTerm, key );
	}
	lastSearchTerm = searchTerm;

	const eventProperties = { value: searchTerm, context: 'inserter_menu' };

	/*
	 * Populate event properties with `selected_block`
	 * if there is a selected block in the editor.
	 */
	const selectedBlock = select( 'core/block-editor' ).getSelectedBlock();
	if ( selectedBlock ) {
		eventProperties.selected_block = selectedBlock.name;
	}

	setSearchBlocksTerm( eventProperties );

	if ( searchTerm.length < 3 ) {
		return;
	}

	const blocksNotFound =
		document.querySelectorAll( '.block-editor-inserter__no-results' ).length !== 0;

	// Dispatch search blocks action.
	setSearchBlocks( { ...eventProperties, notFound: blocksNotFound } );

	// Create a separate event for search with no results to make it easier to filter by them.
	if ( blocksNotFound ) {
		setSearchBlocksNotFound( eventProperties );
	}
};

/**
 * Return the event definition object to track `wpcom_block_picker_no_results`.
 * Also, it tracks `wpcom_block_picker_no_results` is the searcher doesn't return any result.
 *
 * @returns {{handler: Function, selector: string, type: string}} event object definition.
 */
export default () => ( {
	selector: '.block-editor-inserter__search',
	type: 'keyup',
	handler: debounce( trackSearchTerm, 500 ),
} );
