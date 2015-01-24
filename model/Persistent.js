/**
 * Base model class used to persist data across 'sessions'
 */
Ext.define('Marcy.model.Persistent', {
    extend : 'Marcy.model.Model',

    config : {
        /**
         * @cfg {Ext.data.Proxy} proxy
         * The default proxy is localstorage
         */
        proxy : {
            type : 'localstorage',
            id   : 'marcy-persistent'
        }
    },

    /**
     * Ensures local storage stays up to date
     */
    afterEdit: function () {
        var me = this;

        me.callParent(arguments);

        me.getProxy() && me.save();
    }
});