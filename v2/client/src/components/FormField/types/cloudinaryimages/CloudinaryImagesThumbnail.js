import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
} from '@material-ui/core';
import downloadImage from '../../../../utils/v1/downloadImage';
import ImageThumbnail from '../../components/ImageThumbnail';

// locales
import i18n from '../../../../i18n';

function CloudinaryImagesThumbnail ({
	isDeleted,
	imageSourceLarge,
	imageSourceSmall,
	inputName,
	isQueued,
	openLightbox,
	shouldRenderActionButton,
	toggleDelete,
	value,
	...props
}) {
	// render icon feedback for intent
	let mask;
	if (isQueued) mask = 'upload';
	else if (isDeleted) mask = 'remove';

	// action button
	const actionButton = (shouldRenderActionButton && !isQueued) ? (
		<Button color={isDeleted ? 'default' : 'secondary'} onClick={toggleDelete}>
			{isDeleted ? i18n.t('list.undo') : i18n.t('list.remove')}
		</Button>
	) : null;

	const downloadButton = value && value.public_id ? (
		<Button onClick={() => {
			const { signature, format, secure_url } = value;
			downloadImage(secure_url, `${signature}.${format}`);
		}}>
			{i18n.t('list.downloadPicture')}
		</Button>
	) : null;

	const input = (!isQueued && !isDeleted && value) ? (
		<input type="hidden" name={inputName} value={JSON.stringify(value)} />
	) : null;

	// provide gutter for the images
	const imageStyles = {
		float: 'left',
		marginBottom: 10,
		marginRight: 10,
		textAlign: 'center',
	};

	return (
		<div>
			<div style={imageStyles}>
				<ImageThumbnail
					component={imageSourceLarge ? 'a' : 'span'}
					href={!!imageSourceLarge && imageSourceLarge}
					onClick={!!imageSourceLarge && openLightbox}
					mask={mask}
					target={!!imageSourceLarge && '__blank'}
				>
					<img src={imageSourceSmall} style={{ height: 90 }} />
				</ImageThumbnail>
				{actionButton}
				{downloadButton}
				{input}
			</div>
		</div>
	);

};

CloudinaryImagesThumbnail.propTypes = {
	imageSourceLarge: PropTypes.string,
	imageSourceSmall: PropTypes.string.isRequired,
	isDeleted: PropTypes.bool,
	isQueued: PropTypes.bool,
	openLightbox: PropTypes.func.isRequired,
	shouldRenderActionButton: PropTypes.bool,
	toggleDelete: PropTypes.func.isRequired,
};

export default CloudinaryImagesThumbnail;
