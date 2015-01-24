Ext.define('Marcy.app.Application', {
    extend : 'Ext.app.Application',

    config : {
        /**
         * @cfg {Array}
         * Array of application model configurations defined in app.js
         */
        applicationModels : [],

        /**
         * @cfg {Object}
         * Maintains a collection of application model instances, keyed by name defined in app.js
         */
        applicationModelInstances : {},

        /**
         * @cfg {Array}
         * Array of service configurations defined in app.js
         */
        services : [],

        /**
         * @cfg {Object}
         * Maintains a collection of service instances, keyed by named defined in app.js
         */
        serviceInstances : {}
    },

    constructor : function(config) {
        var me = this;

        // <debug>
        if (config.requires.length > 0) {
            // in the situation where there are no items in the requires array,
            // we're assuming this is a build other than development
            me.checkMarcyDependencies(config);
        }
        // </debug>

        me.callParent(arguments);
    },

    /**
     * Checks for all marcy class dependencies defined in things such as
     * application models and services. If they aren't defined in the 'requires' array
     * of Ext.application, Sencha Cmd builds will have a problem including them.
     *
     * @param config
     */
    // <debug>
    checkMarcyDependencies : function(config) {
        var me                = this,
            dependencies      = [],
            applicationModels = config.applicationModels,
            len               = config.applicationModels && config.applicationModels.length,
            proxyClassName,
            applicationModel,
            dependency,
            i;

        // assemble the application models classes
        for (i = 0; i < len; i++) {
            applicationModel = applicationModels[i];

            dependencies.push(applicationModel.type);

            // tack on the proxy class
            if (applicationModel.proxy) {
                // get the full proxy class name
                proxyClassName = Ext.ClassManager.getNameByAlias('proxy.' + applicationModel.proxy.type);

                // tack on the proxy to the dependencies to be loaded
                dependencies.push(proxyClassName);
            }
        }

        // assemble the service classes
        len = config.services && config.services.length;

        for (i = 0; i < len; i++) {
            dependencies.push(config.services[i].type);
        }

        // run through all dependencies and warn about any that do not exist in the requires array
        len = dependencies.length;

        for (i = 0; i < len; i++) {
            dependency = dependencies[i];

            if (config.requires.indexOf(dependency) === -1) {
                console.warn('Please add', dependency, 'to the "requires" array in Ext.application. Failing to do so will cause problems with the loader and Sencha Cmd builds.');
            }
        }

        return dependencies;
    },
    // </debug>

    /**
     * Wires up application-level events
     */
    init : function() {
        var me = this;

        me.on({
            launch : Ext.bind(me.bootstrap, me, ['launch'])
        });
    },

    /**
     * Used for bootstrapping the application, deprecating 'launch'
     */
    bootstrap : Ext.emptyFn,

    /**
     * Adds a loading indicator
     */
    mask : function() {
        Ext.Viewport.mask({
            xtype : 'loadmask'
        });
    },

    /**
     * Removes the loading indicator
     */
    unmask : function() {
        Ext.Viewport.unmask();
    },

    /**
     * Initializes the services
     *
     * @param {Array} services
     */
    initServices : function(services) {
        var me            = this,
            instances     = {},
            len           = services.length,
            defaultConfig = {
                application : me
            },
            config,
            service,
            serviceInstance,
            i;

        for (i = 0; i < len; i++) {
            // get the service config which will have 'name' and 'type'
            service = services[i];

            // a config may have been passed in via app.js
            config = Ext.merge(defaultConfig, (service.config || {}));

            // create an instance of the service
            serviceInstance = Ext.create(service.type, config);

            // add the service instance to the internal hash
            instances[service.name] = serviceInstance;

            // execute any initialization routines that are defined
            serviceInstance.init(me);
        }

        this.setServiceInstances(instances);
    },

    /**
     * Retrieves a service instance.
     *
     * @param {String} serviceName
     * The name of the service to get
     */
    getService : function(serviceName) {
        return this.getServiceInstances()[serviceName];
    },

    /**
     * Initializes the application models
     *
     * @param {Array} models
     */
    initApplicationModels : function(models) {
        var me  = this,
            len = models && models.length,
            staticModel,
            model,
            i;

        if (models && models.length) {
            for (i = 0; i < len; i++) {
                model = models[i];

                // get the model class
                staticModel = Ext.ClassManager.classes[model.type];

                // if no proxy is defined, assume local storage
                if (!model.hasOwnProperty('proxy')) {
                    model.proxy = {
                        type : 'localstorage'
                    };
                }

                // sync the model id with the proxy id
                model.proxy.id = model.id;

                staticModel.setProxy(model.proxy);

                // load the model from persistent storage
                staticModel.load(model.id, {
                    callback : Ext.bind(me.onApplicationModelLoad, me, [model], true)
                });
            }
        }
    },

    /**
     * Callback for the attempted load of a application model
     *
     * @param {Marcy.model.Persistent} record
     */
    onApplicationModelLoad : function(record, operation, modelConfig) {
        var me               = this,
            applicationModel = record,
            modelArgs        = {
                id : modelConfig.id
            };

        // if we don't have a application model, create a blank one
        if (!applicationModel) {
            if (modelConfig.proxy) {
                modelArgs.proxy = modelConfig.proxy;
            }

            applicationModel = Ext.create(modelConfig.type, modelArgs);
        }

        // set the model on the application model instances hash
        me.getApplicationModelInstances()[modelConfig.name] = applicationModel;
    },

    /**
     * Returns a application model by name as defined in app.js
     */
    getApplicationModel : function(modelName) {
        return this.getApplicationModelInstances()[modelName];
    },

    /**
     * Shortcut
     */
    getAppModel : function(modelName) {
        return this.getApplicationModel(modelName);
    },

    /**
     * Executed just after the main requires array from Ext.application is processed.
     * This method will initialize application models and services before controllers.
     */
    onProfilesLoaded : function() {
        var me = this;

        // load/initialize application models
        me.initApplicationModels(me.getApplicationModels());

        // initialize services
        me.initServices(me.getServices());

        me.callParent(arguments);
    }
});