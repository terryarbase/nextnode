# Next-nodecms Changelog

## 1.0.6
### About Extend Customized AdminUI and Admin Signin UI
### About DateRange Types, DateTimeRange Type Enhancements

Bug Fixings
* Types.Text max length checking (use less than equals)

UI Enhancements:
* Added Customized AdminUI config, supported customized client's js
* Removed client bundle js during starting the server

Data Enhancements:
* Added Types.DateRange, Types.DateTimeRange
* Added min length and max length supporting for Types.Number
* Added Regex for Type.Text

## 1.0.5
## 1.0.4
hot fix realtime edit
copyable fields

## 1.0.3
### About Critical hotfix issues, Missing Multilingual Parts

Common Improvements:
* Added download as a text file format
* Fixed Column Type.Email, Type.Url target blank
* Fixed Multilingual label for name field in Create Form and Edit Form
* Fixed Multilingual value for customized options list in Column View

List Improvements:
* Added disable listview option

Multilingual Improvements:
* Fixed cookie language setting cannot found in suporting language pack
* Added multilingual to AdminUI Landing Dashboard
* Added multilingual to Account Setting Popup

## 1.0.2
### About Multilingual and Layout, Delegated Model Enhancements, Delegated Options List
Terry Chan 11/11/2018 (Last Updated at 30/11/2018)

Deprecated Features:
* Removed label for list field, use Application Language List instead

Common Improvements:
* Added Realtime edit field (Support Types.Boolean)
* Added Realtime select all function (Support Types.Boolean)
* Fixed AdminUI account lock checking
* Delegated Record Restrictions
* Added AdminUI account disable checking
* Added Common Types.Select option list
** section
** permission
** status
** activate
** gender
** appellation
** question
** device
** environment
** device
** region/hongkong
** notification/status
** customized list (with mapping language or with multilingual value)

List Enhancements:
* Added KeyText type for key-text pair value

Delegated Model Enhancements:
* Added AdminUI user account delegated model
* Added AdminUI user role delegated model
* Added Full Permission to the most power of role
* Added AdminUI localization delegated model

Multilingual Improvements:
* Added supporting en, zhtw and zhcn languages 
* Auto create multilingual schema for management language support for List schema
* Added List multilingual setting
* Added individual field multilingual setting 
* Added App-Language section for dynamic list (e.g. fields, labels, notes)
* Added export static file for App-Language section config
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
** Types.KeyText

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
* Added List type for any other Types child object

Item Improvements:
* Textarea field supports newline break for display in readonly

Account Imrpovements:
* Added Account Lock/Unlock functions
* Added Change Password popup function
