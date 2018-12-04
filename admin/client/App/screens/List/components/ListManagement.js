import React, { PropTypes } from 'react';
import { translate } from "react-i18next";
import _ from 'lodash';
import {
	Button,
	GlyphButton,
	InlineGroup as Group,
	InlineGroupSection as Section,
	Spinner,
} from '../../../elemental';

function ListManagement ({
	checkedItemCount,
	handleDelete,
	handleRealTimeSave,
	handleSelect,
	handleToggle,
	isOpen,
	itemCount,
	itemsPerPage,
	isRealTimeSaveMode,
	nodelete,
	noedit,
	realTimeInfo={},
	realTimeCol={},
	selectAllItemsLoading,
	t,
	...props
}) {
	// do not render if there's no results
	// or if edit/delete unavailable on the list
	if (!itemCount || (nodelete && noedit)) return null;

	const buttonNoteStyles = { color: '#999', fontWeight: 'normal' };

	// delete button
	const deleteActionButtons = !nodelete && isOpen && (
		<Section>
			<GlyphButton
				color="cancel"
				disabled={!checkedItemCount}
				glyph="trashcan"
				onClick={handleDelete}
				position="left"
				variant="link">
				{t('delete')}
			</GlyphButton>
		</Section>
	);

	// realtime edit button
	const realEditActionButtons = () => {
		if (!noedit && isRealTimeSaveMode) {
			const disabled = isOpen || (!_.keys(realTimeInfo).length && !_.keys(realTimeCol).length);
			return (
				<Section>
					<GlyphButton
						color="cancel"
						disabled={disabled}
						glyph="pencil"
						onClick={handleRealTimeSave}
						position="left"
						variant="link">
						{t('saveAll')}
					</GlyphButton>
				</Section>
			);
		}
		return null;
	};

	// select buttons
	const allVisibleButtonIsActive = checkedItemCount === itemCount;
	const pageVisibleButtonIsActive = checkedItemCount === itemsPerPage;
	const noneButtonIsActive = !checkedItemCount;
	const selectAllButton = itemCount > itemsPerPage && (
		<Section>
			<Button
				active={allVisibleButtonIsActive}
				onClick={() => handleSelect('all')}
				title="Select all rows (including those not visible)">
				{selectAllItemsLoading ? <Spinner/> : t('all')} <small style={buttonNoteStyles}>({itemCount})</small>
			</Button>
		</Section>
	);

	const selectButtons = isOpen ? (
		<Section>
			<Group contiguous>
				{selectAllButton}
				<Section>
					<Button active={pageVisibleButtonIsActive} onClick={() => handleSelect('visible')} title={t('selectAllRows')}>
						{itemCount > itemsPerPage ? t('page') : t('all')}
						<small style={buttonNoteStyles}>({itemCount > itemsPerPage ? itemsPerPage : itemCount})</small>
					</Button>
				</Section>
				<Section>
					<Button active={noneButtonIsActive} onClick={() => handleSelect('none')} title={t('disselectAllRows')}>{t('none')}</Button>
				</Section>
			</Group>
		</Section>
	) : null;

	// selected count text
	const selectedCountText = isOpen ? (
		<Section>
			<span style={{ color: '#666', display: 'inline-block', lineHeight: '2.4em', margin: 1 }}>
				{t('selected', { count: checkedItemCount })}
			</span>
		</Section>
	) : null;

	// put it all together
	return (
		<div>
			<Group style={{ float: 'left', marginRight: '.75em', marginBottom: 0 }}>
				<Section>
					<Button active={isOpen} onClick={() => handleToggle(!isOpen)}>
						{t('label')}
					</Button>
				</Section>
				{realEditActionButtons()}
				{selectButtons}
				{deleteActionButtons}
				{selectedCountText}
			</Group>
		</div>
	);
};

ListManagement.propTypes = {
	checkedItems: PropTypes.number,
	handleDelete: PropTypes.func.isRequired,
	handleSelect: PropTypes.func.isRequired,
	handleToggle: PropTypes.func.isRequired,
	isOpen: PropTypes.bool,
	itemCount: PropTypes.number,
	itemsPerPage: PropTypes.number,
	nodelete: PropTypes.bool,
	noedit: PropTypes.bool,
	selectAllItemsLoading: PropTypes.bool,
};

export default translate('manage')(ListManagement);
// module.exports = ListManagement;
