![NextNode](http://keystonejs.com/images/logo.svg)
===================================

[![Build Status](https://travis-ci.org/keystonejs/keystone.svg?branch=master)](https://travis-ci.org/keystonejs/keystone)

 - [About Keystone](#about)
 - [Getting Started](#getting-started)
 - [Community](#community)
 - [Contributing](#contributing)
 - [License](#license)

------------------------------------------------------------------------------------------------

## About Enhancements - Terry Chan 04/08/2018 (Last Updated at 11/09/2018)

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

------------------------------------------------------------------------------------------------

## About Keystone

[KeystoneJS](http://keystonejs.com) is a powerful Node.js content management system and web app framework built on the [Express](https://expressjs.com/) web framework and [Mongoose ODM](http://mongoosejs.com). Keystone makes it easy to create sophisticated web sites and apps, and comes with a beautiful auto-generated Admin UI.

