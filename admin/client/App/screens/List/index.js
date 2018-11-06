/**
 * The list view is a paginated table of all items in the list. It can show a
 * variety of information about the individual items in columns.
 */

import React from 'react';
// import { findDOMNode } from 'react-dom'; // TODO re-implement focus when ready
import numeral from 'numeral';
import _ from 'lodash';
import { connect } from 'react-redux';

import {
	BlankState,
	Center,
	Container,
	Glyph,
	GlyphButton,
	Pagination,
	Spinner,
} from '../../elemental';

import ListFilters from './components/Filtering/ListFilters';
import ListHeaderTitle from './components/ListHeaderTitle';
import ListHeaderToolbar from './components/ListHeaderToolbar';
import ListManagement from './components/ListManagement';

import ConfirmationDialog from '../../shared/ConfirmationDialog';
import CreateForm from '../../shared/CreateForm';
import FlashMessages from '../../shared/FlashMessages';
import ItemsTable from './components/ItemsTable/ItemsTable';
import UpdateForm from './components/UpdateForm';
import { plural as pluralize } from '../../../utils/string';
import { listsByPath } from '../../../utils/lists';
import { checkForQueryChange } from '../../../utils/queryParams';

import {
	deleteItems,
	setActiveSearch,
	setActiveSort,
	setCurrentPage,
	selectList,
	clearCachedQuery,
	realtimeSave,
} from './actions';

import {
	deleteItem,
} from '../Item/actions';

const ESC_KEY_CODE = 27;

const ListView = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired,
	},
	getInitialState () {
		return {
			confirmationDialog: {
				isOpen: false,
			},
			checkedItems: {},
			constrainTableWidth: true,
			manageMode: false,
			showCreateForm: false,
			showUpdateForm: false,
			realTimeCol: null,	// store all of real time col state
			realTimeInfo: null,	// store the real time edit content
		};
	},
	componentWillMount () {
		// When we directly navigate to a list without coming from another client
		// side routed page before, we need to initialize the list and parse
		// possibly specified query parameters

		this.props.dispatch(selectList(this.props.params.listId));

		const isNoCreate = this.props.lists.data[this.props.params.listId].nocreate;
		const shouldOpenCreate = this.props.location.search === '?create';

		this.setState({
			showCreateForm: (shouldOpenCreate && !isNoCreate) || Keystone.createFormErrors,
		});

	},
	componentWillReceiveProps (nextProps) {
		// We've opened a new list from the client side routing, so initialize
		// again with the new list id
		const isReady = this.props.lists.ready && nextProps.lists.ready;
		if (isReady && checkForQueryChange(nextProps, this.props)) {
			this.props.dispatch(selectList(nextProps.params.listId));
		}
	},
	componentWillUnmount () {
		this.props.dispatch(clearCachedQuery());
	},

	// ==============================
	// HEADER
	// ==============================
	// Called when a new item is created
	onCreate (item) {
		// Hide the create form
		this.toggleCreateModal(false);
		// Redirect to newly created item path
		const list = this.props.currentList;
		this.context.router.push(`${Keystone.adminPath}/${list.path}/${item.id}`);
	},
	createAutocreate () {
		const list = this.props.currentList;
		list.createItem(null, (err, data) => {
			if (err) {
				// TODO Proper error handling
				alert('Something went wrong, please try again!');
				console.log(err);
			} else {
				this.context.router.push(`${Keystone.adminPath}/${list.path}/${data.id}`);
			}
		});
	},
	updateSearch (e) {
		this.props.dispatch(setActiveSearch(e.target.value));
	},
	handleSearchClear () {
		this.props.dispatch(setActiveSearch(''));

		// TODO re-implement focus when ready
		// findDOMNode(this.refs.listSearchInput).focus();
	},
	handleSearchKey (e) {
		// clear on esc
		if (e.which === ESC_KEY_CODE) {
			this.handleSearchClear();
		}
	},
	handlePageSelect (i) {
		// If the current page index is the same as the index we are intending to pass to redux, bail out.
		if (i === this.props.lists.page.index) return;
		return this.props.dispatch(setCurrentPage(i));
	},
	toggleManageMode (filter = !this.state.manageMode) {
		this.setState({
			manageMode: filter,
			checkedItems: {},
		});
	},
	toggleUpdateModal (filter = !this.state.showUpdateForm) {
		this.setState({
			showUpdateForm: filter,
		});
	},
	massUpdate () {
		// TODO: Implement update multi-item
		console.log('Update ALL the things!');
	},
	massDelete () {
		const { checkedItems } = this.state;
		const list = this.props.currentList;
		const itemCount = pluralize(checkedItems, ('* ' + list.singular.toLowerCase()), ('* ' + list.plural.toLowerCase()));
		const itemIds = Object.keys(checkedItems);
		this.setState({
			confirmationDialog: {
				isOpen: true,
				label: 'Delete',
				body: (
					<div>
						Are you sure you want to delete {itemCount}?
						<br />
						<br />
						This cannot be undone.
					</div>
				),
				onConfirmation: () => {
					this.props.dispatch(deleteItems(itemIds));
					this.toggleManageMode();
					this.removeConfirmationDialog();
				},
			},
		});
	},
	getRealTimeFormDate () {
		var { realTimeCol = {} } = this.state;
		const { realTimeInfo } = this.state;
		const formData = new FormData();
		const removeNull = obj => _(obj).omitBy(_.isUndefined).omitBy(_.isNull).value();
		// construct col realtime content
		if (realTimeCol) {
			// remove all of null and undefined properties
			realTimeCol = removeNull(realTimeCol);
			var colData = {};
			_.forOwn(realTimeCol, (current, key) => {
				if (current !== null) {
					// formData.append(key, current);
					colData = {
						...colData,
						...{
							[key]: current,
						},
					};
				}
			});
			if (colData) {
				formData.append('colreal', JSON.stringify(colData));
			}
		}
		// construct multiple realtime row content
		if (realTimeInfo) {
			_.forOwn(realTimeInfo, (current, id) => {
				// remove all of sub properties specified in col realtime content
				_.forOwn(current, (obj, sid) => {
					if (_.has(realTimeCol, sid)) {
						current[sid] = null;
					}
				});
				current = removeNull(current);
				// still has sub properties, then needs to be pushed to api update
				// prevent duplicated update 
				if (_.keys(current).length) {
					formData.append('item[]', 
						JSON.stringify({
							...current,
							id,
						})
					);
				}
			});
		}
		// window.console.warn('Realtime FormData:');
		// for (var pair of formData.entries()) {
		//     console.log(pair[0], JSON.parse(pair[1])); 
		// }
		return formData;
	},
	realTimeSave () {
		this.setState({
			confirmationDialog: {
				isOpen: true,
				label: 'Save',
				body: (
					<div>
						Are you sure you want to save those items?
					</div>
				),
				onConfirmation: () => {
					this.props.dispatch(
						realtimeSave(this.getRealTimeFormDate())
					);
					// this.toggleManageMode();
					this.removeConfirmationDialog();
				},
			},
		});
	},
	handleManagementSelect (selection) {
		if (selection === 'all') this.checkAllItems();
		if (selection === 'none') this.uncheckAllTableItems();
		if (selection === 'visible') this.checkAllTableItems();
		return false;
	},
	renderConfirmationDialog () {
		const props = this.state.confirmationDialog;
		return (
			<ConfirmationDialog
				confirmationLabel={props.label}
				isOpen={props.isOpen}
				onCancel={this.removeConfirmationDialog}
				onConfirmation={props.onConfirmation}
			>
				{props.body}
			</ConfirmationDialog>
		);
	},
	renderManagement () {
		const { checkedItems, manageMode, selectAllItemsLoading } = this.state;
		const { currentList } = this.props;
		return (
			<ListManagement
				checkedItemCount={Object.keys(checkedItems).length}
				handleDelete={this.massDelete}
				handleRealTimeSave={this.realTimeSave}
				handleSelect={this.handleManagementSelect}
				handleToggle={() => this.toggleManageMode(!manageMode)}
				isOpen={manageMode}
				realTimeInfo={this.state.realTimeInfo}
				realTimeCol={this.state.realTimeCol}
				itemCount={this.props.items.count}
				itemsPerPage={this.props.lists.page.size}
				nodelete={currentList.nodelete}
				noedit={currentList.noedit}
				isRealTimeSaveMode={!!currentList.realtimeEditFields.length}
				selectAllItemsLoading={selectAllItemsLoading}
			/>
		);
	},
	renderPagination () {
		const items = this.props.items;
		if (this.state.manageMode || !items.count) return;

		const list = this.props.currentList;
		const currentPage = this.props.lists.page.index;
		const pageSize = this.props.lists.page.size;

		return (
			<Pagination
				currentPage={currentPage}
				onPageSelect={this.handlePageSelect}
				pageSize={pageSize}
				plural={list.plural}
				singular={list.singular}
				style={{ marginBottom: 0 }}
				total={items.count}
				limit={10}
			/>
		);
	},
	renderHeader () {
		const items = this.props.items;
		const {
			autocreate,
			nocreate,
			plural,
			singular,
			nodownload,
			nofilter,
			noscale,
		} = this.props.currentList;

		// console.log(singular, plural);

		return (
			<Container style={{ paddingTop: '2em' }}>
				<ListHeaderTitle
					activeSort={this.props.active.sort}
					availableColumns={this.props.currentList.columns}
					handleSortSelect={this.handleSortSelect}
					title={`
						${numeral(items.count).format()}
						${
							// pluralize(items.count, ' ' + singular, ' ' + plural)
							plural
						}
					`}
				/>
				<ListHeaderToolbar
					// common
					dispatch={this.props.dispatch}
					list={listsByPath[this.props.params.listId]}

					// expand
					expandIsActive={!this.state.constrainTableWidth}
					expandOnClick={this.toggleTableWidth}

					// create
					createIsAvailable={!nocreate}
					createListName={singular}
					createOnClick={autocreate
						? this.createAutocreate
						: this.openCreateModal}

					// search
					searchHandleChange={this.updateSearch}
					searchHandleClear={this.handleSearchClear}
					searchHandleKeyup={this.handleSearchKey}
					searchValue={this.props.active.search}

					// filters
					filtersActive={this.props.active.filters}
					filtersAvailable={this.props.currentList.columns.filter((col) => (
						col.field && col.field.hasFilterMethod) || col.type === 'heading'
					)}

					// columns
					columnsActive={this.props.active.columns}
					columnsAvailable={this.props.currentList.columns}

					// button flags
					nodownload={nodownload}
					nofilter={nofilter}
					noscale={noscale}
				/>
				{
					!nofilter ? 
					<ListFilters
						dispatch={this.props.dispatch}
						filters={this.props.active.filters}
					/> : null
				}
			</Container>
		);
	},

	// ==============================
	// TABLE
	// ==============================

	checkTableItem (item, e) {
		e.preventDefault();
		const newCheckedItems = { ...this.state.checkedItems };
		const itemId = item.id;
		if (this.state.checkedItems[itemId]) {
			delete newCheckedItems[itemId];
		} else {
			newCheckedItems[itemId] = true;
		}
		this.setState({
			checkedItems: newCheckedItems,
		});
	},
	checkAllTableItems () {
		const checkedItems = {};
		this.props.items.results.forEach(item => {
			checkedItems[item.id] = true;
		});
		this.setState({
			checkedItems: checkedItems,
		});
	},
	checkAllItems () {
		const checkedItems = { ...this.state.checkedItems };
		// Just in case this API call takes a long time, we'll update the select all button with
		// a spinner.
		this.setState({ selectAllItemsLoading: true });
		var self = this;
		this.props.currentList.loadItems({ expandRelationshipFilters: false, filters: {} }, function (err, data) {
			data.results.forEach(item => {
				checkedItems[item.id] = true;
			});
			self.setState({
				checkedItems: checkedItems,
				selectAllItemsLoading: false,
			});
		});
	},
	uncheckAllTableItems () {
		this.setState({
			checkedItems: {},
		});
	},
	deleteTableItem (item, e) {
		if (e.altKey) {
			this.props.dispatch(deleteItem(item.id));
			return;
		}

		e.preventDefault();

		this.setState({
			confirmationDialog: {
				isOpen: true,
				label: 'Delete',
				body: (
					<div>
						Are you sure you want to delete <strong>{item.name}</strong>?
						<br />
						<br />
						This cannot be undone.
					</div>
				),
				onConfirmation: () => {
					this.props.dispatch(deleteItem(item.id));
					this.removeConfirmationDialog();
				},
			},
		});
	},
	removeConfirmationDialog () {
		this.setState({
			confirmationDialog: {
				isOpen: false,
			},
		});
	},
	toggleTableWidth () {
		this.setState({
			constrainTableWidth: !this.state.constrainTableWidth,
		});
	},

	// ==============================
	// COMMON
	// ==============================
	/*
	** Real time Col Data Storage
	** @Terry Chan
	*/
	onChangeRealTimeCol({ key, path, value }) {
	 	// window.console.warn('Real Time Col Edit: ', key, path, value);
	 	const { realTimeCol = {}, realTimeInfo = {} } = this.state;
	 	var newColInfo = { ...realTimeCol };
	 	var newInfo = { ...realTimeInfo };
	 	newColInfo = {
			...newColInfo,
			...{
				[key]: value,
			},
		}

	 	// remove all of related to this path value in Realtime Info
	 	_.forOwn(newInfo, (current, id) => {
	 		current[key] = value;
	 	});
		this.setState({ realTimeCol: newColInfo, realTimeInfo: newInfo });
	},
	/*
	** Real time Data Storage
	** @Terry Chan
	*/
	onChangeRealTime({ key, path, value }) {
	 	// window.console.warn('Real Time Edit: ', key, path, value);
	 	const { realTimeCol = {}, realTimeInfo = {} } = this.state;
	 	var newInfo = { ...realTimeInfo };
	 	var newColInfo = { ...realTimeCol };
		if (key) {
			if (newInfo[key]) {
				newInfo = {
					...newInfo,
					...{
						[key]: {
							...newInfo[key],
							...{
								[path]: value,
							},
						},
					},
				}
			} else {
				newInfo = {
					...newInfo,
					...{
						[key]: {
							[path]: value,
						},
					},
				}
			}
			newColInfo = {
				...newColInfo,
				...{
					[path]: null,
				},
			};
			this.setState({
				realTimeInfo: newInfo,
				realTimeCol: newColInfo,
			});
		}
	},
	handleSortSelect (path, inverted) {
		if (inverted) path = '-' + path;
		this.props.dispatch(setActiveSort(path));
	},
	toggleCreateModal (visible) {
		this.setState({
			showCreateForm: visible,
		});
	},
	openCreateModal () {
		this.toggleCreateModal(true);
	},
	closeCreateModal () {
		this.toggleCreateModal(false);
	},
	showBlankState () {
		return !this.props.loading
				&& !this.props.items.results.length
				&& !this.props.active.search
				&& !this.props.active.filters.length;
	},
	renderBlankState () {
		const { currentList } = this.props;

		if (!this.showBlankState()) return null;

		// create and nav directly to the item view, or open the create modal
		const onClick = currentList.autocreate
			? this.createAutocreate
			: this.openCreateModal;

		// display the button if create allowed
		const button = !currentList.nocreate ? (
			<GlyphButton color="success" glyph="plus" position="left" onClick={onClick} data-e2e-list-create-button="no-results">
				Create {currentList.singular}
			</GlyphButton>
		) : null;

		return (
			<Container>
				{(this.props.error) ? (
					<FlashMessages
						messages={{ error: [{
							title: "There is a problem with the network, we're trying to reconnect...",
						}] }}
					/>
				) : null}
				<BlankState heading={`No ${this.props.currentList.plural.toLowerCase()} found...`} style={{ marginTop: 40 }}>
					{button}
				</BlankState>
			</Container>
		);
	},
	renderActiveState () {
		if (this.showBlankState()) return null;

		const containerStyle = {
			transition: 'max-width 160ms ease-out',
			msTransition: 'max-width 160ms ease-out',
			MozTransition: 'max-width 160ms ease-out',
			WebkitTransition: 'max-width 160ms ease-out',
		};
		if (!this.state.constrainTableWidth) {
			containerStyle.maxWidth = '100%';
		}
		return (
			<div>
				{this.renderHeader()}
				<Container>
					<div style={{ height: 35, marginBottom: '1em', marginTop: '1em' }}>
						{this.renderManagement()}
						{this.renderPagination()}
						<span style={{ clear: 'both', display: 'table' }} />
					</div>
				</Container>
				<Container style={containerStyle}>
					{(this.props.error) ? (
						<FlashMessages
							messages={{ error: [{
								title: "There is a problem with the network, we're trying to reconnect..",
							}] }}
						/>
					) : null}
					{(this.props.loading) ? (
						<Center height="50vh">
							<Spinner />
						</Center>
					) : (
						<div>
							<ItemsTable
								activeSort={this.props.active.sort}
								checkedItems={this.state.checkedItems}
								checkTableItem={this.checkTableItem}
								columns={this.props.active.columns}
								deleteTableItem={this.deleteTableItem}
								handleSortSelect={this.handleSortSelect}
								items={this.props.items}
								onChange={this.onChangeRealTime}
								onColChange={this.onChangeRealTimeCol}
								list={this.props.currentList}
								manageMode={this.state.manageMode}
								rowAlert={this.props.rowAlert}
								realTimeInfo={this.state.realTimeInfo || {}}
								realTimeCol={this.state.realTimeCol || {}}
								currentPage={this.props.lists.page.index}
								pageSize={this.props.lists.page.size}
								noedit={this.props.currentList.noedit}
								drag={this.props.lists.drag}
								dispatch={this.props.dispatch}
							/>
							{this.renderNoSearchResults()}
						</div>
					)}
				</Container>
			</div>
		);
	},
	renderNoSearchResults () {
		if (this.props.items.results.length) return null;
		let matching = this.props.active.search;
		if (this.props.active.filters.length) {
			matching += (matching ? ' and ' : '') + pluralize(this.props.active.filters.length, '* filter', '* filters');
		}
		matching = matching ? ' found matching ' + matching : '.';
		return (
			<BlankState style={{ marginTop: 20, marginBottom: 20 }}>
				<Glyph
					name="search"
					size="medium"
					style={{ marginBottom: 20 }}
				/>
				<h2 style={{ color: 'inherit' }}>
					No {this.props.currentList.plural.toLowerCase()}{matching}
				</h2>
			</BlankState>
		);
	},
	render () {
		if (!this.props.ready) {
			return (
				<Center height="50vh" data-screen-id="list">
					<Spinner />
				</Center>
			);
		}

		return (
			<div data-screen-id="list">
				{this.renderBlankState()}
				{this.renderActiveState()}
				<CreateForm
					err={Keystone.createFormErrors}
					isOpen={this.state.showCreateForm}
					list={this.props.currentList}
					onCancel={this.closeCreateModal}
					onCreate={this.onCreate}
				/>
				<UpdateForm
					isOpen={this.state.showUpdateForm}
					itemIds={Object.keys(this.state.checkedItems)}
					list={this.props.currentList}
					onCancel={() => this.toggleUpdateModal(false)}
				/>
				{this.renderConfirmationDialog()}
			</div>
		);
	},
});

module.exports = connect((state) => {
	return {
		lists: state.lists,
		loading: state.lists.loading,
		error: state.lists.error,
		currentList: state.lists.currentList,
		items: state.lists.items,
		page: state.lists.page,
		ready: state.lists.ready,
		rowAlert: state.lists.rowAlert,
		active: state.active,
	};
})(ListView);
