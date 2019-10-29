import url from 'cloudinary-microurl';

// const CLOUD_NAME = window.Keystone.cloudinary.cloud_name;

/*
	Take a cloudinary public id + options object
	and return a url
*/
function cloudinaryResize (cloud_name, publicId, options = {}) {
	if (!publicId || !cloud_name) return false;

	return url(publicId, {
		cloud_name, // single cloud for the admin UI
		quality: 80, // 80% quality, which ~halves image download size
		...options,
	});
};

export default cloudinaryResize;
