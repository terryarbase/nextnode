import axios from 'axios';
// import FileDownload from'js-file-download';

const downloadImage = (url, filename) => {
	axios({
		url,
		method: 'GET',
		responseType: 'blob', // important
	}).then((response) => {
	   const url = window.URL.createObjectURL(new Blob([response.data]));
	   const link = document.createElement('a');
	   link.href = url;
	   link.setAttribute('download', filename); //or any other extension
	   // document.body.appendChild(link);
	   link.click();
	});
}

export defualt downloadImage;