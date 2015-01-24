/**
 * Adds a number of convenience methods from the application instance
 */
Ext.define('Marcy.mixin.Application', {
    getService : function(serviceName) {
        return this.getApplication().getService(serviceName);
    },

    getApplicationModel : function(modelName) {
        return this.getApplication().getApplicationModel(modelName);
    },

    getAppModel : function(modelName) {
        return this.getApplication().getApplicationModel(modelName);
    },

    mask : function() {
        this.getApplication().mask();
    },

    unmask : function() {
        this.getApplication().unmask();
    }
});