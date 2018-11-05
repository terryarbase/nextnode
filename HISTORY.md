# Next-nodecms Changelog

## 1.0.1 
About Enhancements - Terry Chan 04/08/2018 (Last Updated at 11/09/2018)
Enhancements includes:

Common Improvements
* Added timestamp to each of api call for ETag caching issue (no-cache) - Hotfixing
* Added system lock (Needs to create related presave logic for Incorrect Password Count)
* Added 'nav style' for adminUI nav styling
* Added base64Image flag for textbox to show up the image

List Improvements 
* Added single flag for each of list button in list view (e.g. delete, scaler, filter button)
  1. nodelete
  2. nofilter
  3. noscale
* Replaced CSV file download to Excel file, fix unicode Chinese Characters
* Fixed display Manage button if nodelete is true 

Item Improvements
* Textarea field supports newline break for display in readonly
