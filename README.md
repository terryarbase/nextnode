NextNode
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

