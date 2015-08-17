# Crossroads Core Angular Module


This is the core angular module for the Crossroads.net site. It includes multiple dependencies used throughout the crossroads ecosystem including:
* Angular
* Angular Resource 
* Angular Cookies
* Angular Messages
* Angular Sanitize
* Ui-Router *may be removed in the future*
* Ui-Bootstrap
* [UI Event](http://htmlpreview.github.io/?https://github.com/angular-ui/ui-event/master/demo/index.html)
* [Angular Growl 2](https://github.com/JanStevens/angular-growl-2)
* [Angular Payments](https://github.com/laurihy/angular-payments) *may be removed in the future*
* [Angular Stripe](https://github.com/bendrucker/angular-stripe)  *may be removed in the future*
* [Angular Toggle Switch](http://cgarvis.github.io/angular-toggle-switch/) *may be removed in the future*
* lodash
* moment

### Installation
`npm i crds-core --save-dev` 

At the top of your entry file (most likely app.js) `require('crds-core')`


### Building and Testing
The module is built with gulp using webpack for packaging.

* Pull down the repo
* Install dependencies `npm i`
* Run tests `karma start karma.conf.js`

