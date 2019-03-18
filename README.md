Next-NodeCMS Beta 1.0.5
===================================

[![Build Status](https://travis-ci.org/keystonejs/keystone.svg?branch=master)](https://travis-ci.org/keystonejs/keystone)

 - [About Keystone](#about)
 - [Getting Started](#getting-started)
 - [Community](#community)
 - [Contributing](#contributing)
 - [License](#license)

------------------------------------------------------------------------------------------------
# Next-nodecms Changelog

## 1.0.6
### About Extend Customized AdminUI and Admin Signin UI
### About DateRange Types, DateTimeRange Type Enhancements

Bug Fixings
* Types.Text max length checking (use less than equals)

UI Enhancements:
* Added Customized AdminUI config, supported customized client's js
* Removed client bundle js during starting the server
* Added adminUI customized stylesheet ('adminui custom style')
* Upgraded react-select to v2 for Types.Select, Types.Relationship

Data Enhancements:
* Added Types.DateRange, Types.DateTimeRange
* Added min length and max length supporting for Types.Number
* Added Regex for Type.Text
* Added Advanced User Model's definations for the delegrated User model ('advanced user model')
* Added Advanced Role Permission list to individual model ('advanced role permissions')


## 1.0.4
## 1.0.5
* Hotfix realtime edit
* Hotfix copyable fields

## 1.0.3
### About Critical hotfix issues, Missing Multilingual Parts

Common Improvements:
* Added download as a text file format
* Fixed Column Type.Email, Type.Url target blank
* Fixed Multilingual label for name field in Create Form and Edit Form
* Fixed browserify require js bugs for customized Field.Types (KeyText)

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


## About Keystone

[KeystoneJS](http://keystonejs.com) is a powerful Node.js content management system and web app framework built on the [Express](https://expressjs.com/) web framework and [Mongoose ODM](http://mongoosejs.com). Keystone makes it easy to create sophisticated web sites and apps, and comes with a beautiful auto-generated Admin UI.

## License

(The MIT License)

Copyright (c) 2016-2018 Jed Watson

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

