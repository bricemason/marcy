# Marcy
## Enterprise Mobile Application Framework for Sencha Touch

Marcy (named after the highest peak in New York State) is an opinionated, yet open-minded, framework for building enterprise mobile applications with Sencha Touch.

## Getting Started
Here is an example installation.

1. `sencha generate app MyApp ~/Desktop/my-app`
2. `cd ~/Desktop/my-app`
3. `git clone https://github.com/bricemason/marcy.git lib/marcy`
4. Add `${app.dir}/lib/marcy` to the *app.classPath* property in *.sencha/app/sencha.cfg* 
5. `sencha app refresh`
6. Create a class named *MyApp.Application* as follows:
```javascript
Ext.define('MyApp.Application', {
    extend : 'Marcy.app.Application',

    bootstrap : function(launchType) {
        if (launchType === 'launch') {
            Ext.Viewport.add({
                xtype : 'main'
            });
        }
    }
});
```
7. Replace *app.js* with the following:

```javascript
Ext.syncRequire('Marcy.Framework');

Ext.application({
    name        : 'MyApp',
    application : 'MyApp.Application',

    requires : [
        'MyApp.Application'
    ],

    views : [
        'Main'
    ]
});
```

## Feature Overview
### Application Bootstrap Enhancements
There are a couple of key enhancements to how an app is bootstrapped in Marcy. When you use the framework, the `launch` method usually defined in `app.js` is now deprecated in favor of implementing a `bootstrap` method off a custom `Ext.app.Application` instance. With Marcy, your `app.js` file could now look as plain as this:
```javascript
Ext.syncRequire('Marcy.Framework');

Ext.application({
    name        : 'MyApp',
    application : 'MyApp.Application',

    requires : [
        'MyApp.Application'
    ],

    views : [
        'Main'
    ]
});
```
Notice the new `application` config option in the `Ext.application method` call. The framework requires that you extend a new application instance and implement a method named `bootstrap`. Since 'bootstrap' may take on a different context in a hybrid application, this new bootstrap method will indicate whether it's being invoked from a pure 'launch' condition vs an app 'resume' condition.

The other key part to notice about this `app.js` file is that many of the usual defaults (icon definitions, etc) has been tucked into the framework. The opinion for this new `app.js` file is that it should look more like a configuration and used for piecing together our app rather than mixing scripting/logic.

### Application Models
Often we will need to preserve data whether it be for saving preferences or caching credentials for auto-login. The framework provides for this concept with what's called application models. Application models are regular models with a couple of key differences:

- They implement a local storage proxy by default
- When any data changes in the model, it is saved to ensure we have the most up-to-date information
- Any application model defined in your app is available via the `getApplicationModel` (or `getAppModel`) method call in any of your state providers (Application, Controller, Service)

Application models are easy to implement, simply extend from the `Marcy.model.Persistent` class and define them in the new `applicationModels` config option to `Ext.application` like so:
```javascript
applicationModels : [
    {
        id    : 'my-app-preferences',
        name  : 'preferences',
        type  : 'MyApp.model.application.Preferences'
    }
],
```
### Services
Another key opinion of the framework is to keep clean controllers. To aid in this effort, a new layer has been added called *services*. It's tempting to liken a service to a controller but it's much more plain than that. A service exists to spread logic out away from controllers, focusing on reusability. A service should do a lot of the heavy lifting, from formatting data to maintaining configurtaions to executing ajax requests.

To define a service, just extend from `Marcy.service.Service` and then register the service in the new `services` config option in `Ext.application`:
```javascript
services : [
    {
        name : 'config',
        type : 'MyApp.service.Configuration'
    }
]
```
You can now access your services using the `getService` method available off any of your state providers (Application, Controller, Service). 