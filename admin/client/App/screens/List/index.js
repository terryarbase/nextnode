/**
 * The list view is a paginated table of all items in the list. It can show a
 * variety of information about the individual items in columns.
 */

import React from 'react';
// import { findDOMNode } from 'react-dom'; // TODO re-implement focus when ready
import numeral from 'numeral';
import _ from 'lodash';
import { translate } from "react-i18next";
import { connect } from 'react-redux';

import {
	BlankState,
	Center,
	Container,
	Glyph,
	GlyphButton,
	Spinner,
} from '../../elemental';

import Pagination from '../../elemental/Pagination';

import ListFilters from './components/Filtering/ListFilters';
import ListHeaderTitle from './components/ListHeaderTitle';
import ListHeaderToolbar from './components/ListHeaderToolbar';
import ListManagement from './components/ListManagement';

import NoListView from './components/NoListView';

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
		const isRealTimeChanged = this.props.realLoading && !nextProps.realLoading;
		// console.log('>>>>>>> ', isRealTimeChanged);
		if ((isReady && checkForQueryChange(nextProps, this.props)) || isRealTimeChanged) {
			this.setState({ realTimeInfo: null, realTimeCol: null });
			this.props.dispatch(selectList(nextProps.params.listId));
		}
		// the list record is loaded and the item result at least one item
		if (this.props.loading && !nextProps.loading) {
<<<<<<< HEAD
			if (nextProps.items && 
				nextProps.items.results && 
				nextProps.items.results.length && 
				nextProps.currentList.nolist) {
=======
			if (nextProps.items && nextProps.items.results && nextProps.items.results.length) {
>>>>>>> 89cbcf44ca5337307b7aa21c5ad3605bd203cf96
				const { items: { results } } = nextProps;
				this.context.router.push(`${Keystone.adminPath}/${nextProps.currentList.path}/${results[0].id}`);
			}
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
		list.createItem(null, {}, (err, data) => {
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
	handlePageChange(i) {
		this.setState({ realTimeCol: null, realTimeInfo: null });
		this.props.dispatch(setCurrentPage(i));
	},
	handlePageSelect (i) {
		// If the current page index is the same as the index we are intending to pass to redux, bail out.
		if (i === this.props.lists.page.index) return;
		return this.handlePageChange(i);
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
		const { t } = this.props;
		const list = this.props.currentList;
		const itemCount = pluralize(checkedItems, ('* ' + list.singular.toLowerCase()), ('* ' + list.plural.toLowerCase()));
		const itemIds = Object.keys(checkedItems);
		this.setState({
			confirmationDialog: {
				isOpen: true,
				label: t('delete'),
				body: (
					<div>
						{t('deleteAskMsg')}?
						<br />
						<br />
						{t('cannotUndo')}
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
		// var { realTimeCol = {} } = this.state;
		const { realTimeInfo } = this.state;
		const formData = new FormData();
		const removeNull = obj => _(obj).omitBy(_.isUndefined).omitBy(_.isNull).value();
		// construct col realtime content
		// if (realTimeCol) {
		// 	// remove all of null and undefined properties
		// 	realTimeCol = removeNull(realTimeCol);
		// 	var colData = {};
		// 	_.forOwn(realTimeCol, (current, key) => {
		// 		if (current !== null) {
		// 			// formData.append(key, current);
		// 			colData = {
		// 				...colData,
		// 				...{
		// 					[key]: current,
		// 				},
		// 			};
		// 		}
		// 	});
		// 	if (colData) {
		// 		formData.append('colreal', JSON.stringify(colData));
		// 	}
		// }
		// construct multiple realtime row content
		if (realTimeInfo) {
			_.forOwn(realTimeInfo, (current, id) => {
				// remove all of sub properties specified in col realtime content
				// _.forOwn(current, (obj, sid) => {
				// 	if (_.has(realTimeCol, sid)) {
				// 		current[sid] = null;
				// 	}
				// });
				current = removeNull(current);
				// still has sub properties, then needs to be pushed to api update
				// prevent duplicated update 
				if (_.keys(current).length) {
					formData.append('items[]', 
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
		const { t } = this.props;
		this.setState({
			confirmationDialog: {
				isOpen: true,
				label: t('save'),
				body: (
					<div>
						{t('saveAskMsg')}
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
		const { t } = this.props;
		return (
			<ConfirmationDialog
				confirmationLabel={t('confirm')}
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
				itemCount={this.props.items.editCount}
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
				list={list}
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
		const list = listsByPath[this.props.params.listId];
		return (
			<Container style={{ paddingTop: '2em' }}>
				<ListHeaderTitle
					activeSort={this.props.active.sort}
					availableColumns={this.props.currentList.columns}
					handleSortSelect={this.handleSortSelect}
					list={list}
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
					list={list}
					
					isLocale={this.props.isLocale}
					currentLang={this.props.currentLanguage}
					defaultLang={this.props.defaultLanguage}
					currentUILang={this.props.currentUILanguage}
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
						currentUILang={this.props.currentUILanguage}
						list={list}
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
		if (!item.delegated) {
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
		}
	},
	checkAllTableItems () {
		const checkedItems = {};
		this.props.items.results.forEach(item => {
			if (!item.delegated) {
				checkedItems[item.id] = true;
			}
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
		// console.log('>>>>>>>>>', this.props.currentLanguage);
		var self = this;
		this.props.currentList.loadItems({
			expandRelationshipFilters: false,
			filters: {},
			lang: this.props.currentLanguage,
		}, function (err, data) {
			data.results.forEach(item => {
				if (!item.delegated) {
					checkedItems[item.id] = true;
				}
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
		const { t } = this.props;
		this.setState({
			confirmationDialog: {
				isOpen: true,
				label: t('Delete'),
				body: (
					<div>
						{t('deleteAskMsg')}?
						<br />
						<br />
						{t('cannotUndo')}
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
	isRestricted ({ field }, { delegated }) {
		return field && !!(field.restrictDelegated) && delegated;
	},
	// ==============================
	// COMMON
	// ==============================
	/*
	** Real time Col Data Storage
	** restrictDelegated: if the col is restricted by delegated field, then ignore
	** @Terry Chan
	*/
	onChangeRealTimeCol({ col, key, path, value }) {
		const { items } = this.props;
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
	 	_.forEach(items.results, item => {
	 		if (!this.isRestricted(col, item)) {
		 		newInfo = {
		 			...newInfo,
		 			...{
		 				[item.id]: {
		 					...newInfo[item.id],
		 					...{
			 					[key]: value,
			 				},
			 			},
		 			},
		 		};
		 	}
	 	});
	 	// _.forOwn(newInfo, (current, id) => {
	 	// 	current[key] = value;
	 	// });
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
		// if nolist, use other noListView instead
		if (!this.showBlankState()) return null;
		const { t, currentList } = this.props;

		if (currentList.nolist) return this.renderNoListView();

		// create and nav directly to the item view, or open the create modal
		const onClick = currentList.autocreate
			? this.createAutocreate
			: this.openCreateModal;

		// display the button if create allowed
		const button = !currentList.nocreate ? (
			<GlyphButton color="success" glyph="plus" position="left" onClick={onClick} data-e2e-list-create-button="no-results">
				{t('create')}
			</GlyphButton>
		) : null;

		return (
			<Container>
				{(this.props.error) ? (
					<FlashMessages
						messages={{ error: [{
							title: t('message:networkError'),
						}] }}
					/>
				) : null}
				<BlankState heading={t('filter:noresult')} style={{ marginTop: 40 }}>
					{button}
				</BlankState>
			</Container>
		);
	},
	renderActiveState () {
		const { currentList: { nolist } } = this.props;
		if (this.showBlankState() || nolist) return null;

		const containerStyle = {
			transition: 'max-width 160ms ease-out',
			msTransition: 'max-width 160ms ease-out',
			MozTransition: 'max-width 160ms ease-out',
			WebkitTransition: 'max-width 160ms ease-out',
		};
		if (!this.state.constrainTableWidth) {
			containerStyle.maxWidth = '100%';
		}
		const { t } = this.props;
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
								title: t('message:networkError'),
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
								isRestricted={this.isRestricted}
								manageMode={this.state.manageMode}
								rowAlert={this.props.rowAlert}
								realTimeInfo={this.state.realTimeInfo || {}}
								realTimeCol={this.state.realTimeCol || {}}
								isLocale={this.props.isLocale}
								currentLang={this.props.currentLanguage}
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
		const { t } = this.props;
		if (this.props.active.filters.length) {
			matching += (matching ? t('filter:and') : '') + t('filter:filter', {
				postfix: this.props.active.filters.length > 1 ? '' : 's',
			})
		}
		matching = matching ? t('filter:matching') + matching : '.';
		return (
			<BlankState style={{ marginTop: 20, marginBottom: 20 }}>
				<Glyph
					name="search"
					size="medium"
					style={{ marginBottom: 20 }}
				/>
				<h2 style={{ color: 'inherit' }}>
					{
						t('filter:noresult')
					}
				</h2>
			</BlankState>
		);
	},
	renderNoListView () {
		return (
			<NoListView
				t={this.props.t}
				items={this.props.items}
				isOpen={this.state.showCreateForm}
				router={this.context.router}
				onCreate={this.openCreateModal}
				list={this.props.currentList}
			/>
		);
	},
	renderSpinner () {
		return (
			<Center height="50vh" data-screen-id="list">
				<Spinner />
			</Center>
		);
	},
	render () {
		// console.log(this.state.realTimeInfo, this.state.realTimeCol);
		if (!this.props.ready) {
			return this.renderSpinner();
		}
		// const { lists: { currentList } } = this.props;
		return (
			<div data-screen-id="list">
				{
					this.props.realLoading ? 
					this.renderSpinner() : 
					<div>
						{this.renderBlankState()}
						{this.renderActiveState()}
						<CreateForm
							dispatch={this.props.dispatch}
							err={Keystone.createFormErrors}
							isOpen={this.state.showCreateForm}
							isLocale={this.props.isLocale}
							currentLang={this.props.currentLanguage}
							defaultLang={this.props.defaultLanguage}
							list={this.props.currentList}
							onCancel={this.closeCreateModal}
							onCreate={this.onCreate}
						/>
						<UpdateForm
							isOpen={this.state.showUpdateForm}
							itemIds={Object.keys(this.state.checkedItems)}
							list={this.props.currentList}
							isLocale={this.props.isLocale}
							currentLang={this.props.currentLanguage}
							defaultLang={this.props.defaultLanguage}
							onCancel={() => this.toggleUpdateModal(false)}
						/>
						{this.renderConfirmationDialog()}
					</div>
				}
			</div>
		);
	},
});

module.exports = translate(['form', 'message', 'filter'])(connect(state => {
	const { lists } = state;
	var isLocale = false;
	if (lists.currentList) {
		isLocale = !!lists.currentList.multilingual;
	}
	return {
		lists: state.lists,
		loading: state.lists.loading,
		error: state.lists.error,
		currentList: state.lists.currentList,
		items: state.lists.items,
		page: state.lists.page,
		currentLanguage: state.lists.locale.current,
		currentUILanguage: state.lists.locale.currentUILang,
		isLocale,
		defaultLanguage: state.lists.locale.default,
		ready: state.lists.ready,
		rowAlert: state.lists.rowAlert,
		active: state.active,
		realLoading: state.lists.realTime.isLoading,
		realError: state.lists.realTime.error,
	};
})(ListView));
