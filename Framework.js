/**
 * Implements the Marcy framework by overriding Ext.application
 */
Ext.define('Marcy.Framework', {
    singleton : true,

    requires : [
        'Marcy.app.Application'
    ],

    /**
     * Used to override Ext.application
     */
    constructor : function(config) {
        var me = this;

        Ext.application = function(config) {
            var appName     = config.name,
                application = config.application || 'Marcy.app.Application',
                onReady,
                scope,
                requires,
                app;

            me.initMarcyConfig(config);

            if (!Ext.Loader.config.paths[appName]) {
                Ext.Loader.setPath(appName, config.appFolder || 'app');
            }

            requires = Ext.Array.from(config.requires);

            onReady = config.onReady;
            scope = config.scope;

            config.onReady = function() {
                config.requires = requires;

                Ext.create(application, config);

                if (onReady) {
                    onReady.call(scope);
                }
            };

            Ext.setup(config);
        };
    },

    /**
     * Allows for the extension of Application instances as well as configures
     * a number of defaults normally found in Ext.application boilerplate.
     *
     * @param {Object} config
     * The configuration passed into Ext.application
     */
    initMarcyConfig : function(config) {
        // prevents the custom application property to carry through to the application instance config
        delete config.application;

        // In Marcy, the launch method is ignored in favor of a 'bootstrap' method on the Application
        if (config.launch) {
            // <debug warn>
            console.warn('The "launch" method is not used in Marcy. Please migrate initialization code to the "bootstrap" method on your Application instance');
            // </debug>
        }

        // overwrite the launch method to fire the 'launch' event off the Application instance
        config.launch = function() {
            var loadingIndicator = Ext.get('appLoadingIndicator');

            loadingIndicator && loadingIndicator.destroy();

            this.init();
            this.fireEvent('launch');
        };

        config.startupImage = Ext.merge({}, {
            '320x460'   : 'resources/startup/320x460.jpg',
            '640x920'   : 'resources/startup/640x920.png',
            '768x1004'  : 'resources/startup/768x1004.png',
            '748x1024'  : 'resources/startup/748x1024.png',
            '1536x2008' : 'resources/startup/1536x2008.png',
            '1496x2048' : 'resources/startup/1496x2048.png'
        }, config.startupImage);

        config.isIconPrecomposed = true;

        config.icon = Ext.merge({}, {
            '57'  : 'resources/icons/Icon.png',
            '72'  : 'resources/icons/Icon~ipad.png',
            '114' : 'resources/icons/Icon@2x.png',
            '144' : 'resources/icons/Icon~ipad@2x.png'
        }, config.icon);

        config.onUpdated = function() {
            Ext.Msg.confirm(
                "Application Update",
                "This application has just successfully been updated to the latest version. Reload now?",
                function(buttonId) {
                    if (buttonId === 'yes') {
                        window.location.reload();
                    }
                }
            );
        };
    }
});