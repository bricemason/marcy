/**
 * Base service class
 */
Ext.define('Marcy.service.Service', {

    mixins : [
        'Marcy.mixin.Application'
    ],

    config : {
        /**
         * @cfg {Ext.app.Application} The application instance
         */
        application : null
    },

    /**
     * @constructor
     */
    constructor : function(config) {
        var me = this;

        me.initConfig(config);
    },

    /**
     * Initialization method for service class
     *
     * @param {Ext.app.Application} app
     * The application instance
     */
    init : Ext.emptyFn
});