feature-toggle-express-middleware
=================================
This middleware manages feature toggles. You can switch on/off features using a query parameter. It stores them in a cookie.
```js
const featureToggle = require('feature-toggle-express-middleware');

// pass a list of allowed features and a prefix representing your application
const featureToggleMiddleware = featureToggle(['feature1', 'feature2'], 'myapp');

app.get('/myapp', featureToggleMiddleware, (req, res) => {
  if (res.locals.hasToggle('feature1')) {
    res.send('Feature 1 active');
  }
  res.send('Feature 1 not active');
});
```

featureToggle takes this arguments:
* an array with allowed toggles (a toggle is a string)
* a prefix that is used for the cookie and the query parameters
* [optional] the options for the cookie (see expressjs documentation)

Using the middleware
====================
You can switch a feature on using the addToggles query parameter:
```
http://www.example.com?myappAddToggles=feature1
```
You can also enable multiple features:
```
http://www.example.com?myappAddToggles=feature1,feature2
```
You can remove one or more feature:
```
http://www.example.com?myappRemoveToggles=feature1
http://www.example.com?myappRemoveToggles=feature1,feature2
```
You can use both query parameter to add/remove toggles
```
http://www.example.com?myappRemoveToggles=feature1&myappAddToggles=feature2
```
You can switch off all toggles:
```
http://www.example.com?myappResetToggles=true
```

allow-feature
=============
This is another middleware that, used together with featureToggle enable/disable a specific endpoint.
```js
const allowFeature = require('feature-toggle-express-middleware/allow-feature');

const disableWithFeature1 = allowFeature.allowWith('feature1');
const enableWithFeature1 = allowFeature.disallowWith('feature1');

app.get('/myapp/1', featureToggleMiddleware, disableWithFeature1, (req, res) => {
  console.log('this is disabled with feature1');
});

app.get('/myapp/2', featureToggleMiddleware, enableWithFeature1, (req, res) => {
  console.log('this is enabled with feature1');
});
```

Notes
=====
This module is implemented with ES6 feature. Use it with the appropriate node versions.
The middleware provides to disable cache (using cache headers), when a feature toggle is enabled.
