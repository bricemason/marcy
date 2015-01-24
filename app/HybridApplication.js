/**
 * Base application class for hybrid applications.
 * This adds 'resume' as an option for the bootstrap method.
 */
Ext.define('Marcy.app.HybridApplication', {
    extend : 'Marcy.app.Application',

    /**
     * Adds a handler for the 'resume' event, using 'bootstrap' as the handler
     */
    init : function() {
        var me = this;

        me.callParent();

        document.addEventListener('resume', Ext.bind(me.bootstrap, me, ['resume']), false);
    }
});