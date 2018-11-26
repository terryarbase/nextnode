# Next-nodecms Changelog

## 1.0.2
### About Multilingual and Layout, Delegated Model Enhancements
Terry Chan 11/11/2018 (Last Updated at 25/11/2018)

Common Improvements:
* Added Realtime edit field (Support Types.Boolean)
* Added Realtime select all function (Support Types.Boolean)
* Delegated Record Restrictions

Delegated Model Enhancements:
* Added AdminUI user account delegated model
* Added AdminUI user role delegated model
** Added Full Permission to the most power of role
* Added AdminUI localization delegated model

Multilingual Improvements:
* Added supporting en, zhtw and zhcn languages 
* Auto create multilingual schema for management language support for List schema
* Added List multilingual setting
* Added individual field multilingual setting 
* Support multilingual types: 
** Types.Text
** Types.Textarea
** Types.TextArray
** Types.Html
** Types.Url
** Types.Email
** Types.File
** Types.CloudinaryImage
** Types.CloudinaryImages
** Types.Name
** Types.Code
** Types.Color
** Types.Location

Layout Improvements:
* Added AdminUI Sidemenu for navigation menu for Desktop
* Changed Reasonable Icon for the Header Navigation
* Added AdminUI Data Language Selector
* Added AdminUI Multilingual

## 1.0.1 
### Common Enhancements
Terry Chan 04/08/2018 (Last Updated at 11/09/2018)

Common Improvements:
* Added timestamp to each of api call for ETag caching issue (no-cache) - Hotfixing
* Added system lock (Needs to create related presave logic for Incorrect Password Count)
* Added 'nav style' for adminUI nav styling
* Added base64Image flag for textbox to show up the image

List Improvements:
* Added single flag for each of list button in list view (e.g. delete, scaler, filter button)
  1. nodelete
  2. nofilter
  3. noscale
* Replaced CSV file download to Excel file, fix unicode Chinese Characters
* Fixed display Manage button if nodelete is true 

Item Improvements:
* Textarea field supports newline break for display in readonly

Account Imrpovements:
* Added Account Lock/Unlock functions
* Added Change Password popup function
