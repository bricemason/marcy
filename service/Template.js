/**
 * Maintains a collection of reusable XTemplates
 */
Ext.define('Marcy.service.Template', {
    extend : 'Marcy.service.Service',

    config : {
        /**
         * @cfg {Ext.XTemplate} breaks an array into their own lines for display
         */
        arrayLineBreak : new Ext.XTemplate('<tpl for="."><div>{.}</div></tpl>')
    },

    /**
     * Processes a template from the service given its name and the data to apply
     *
     * @param {String} templateName
     * @param {*} data
     * @returns {String}
     */
    apply : function(templateName, data) {
        var me       = this,
            template = me.config[templateName],
            fragment = '';

        if (template) {
            fragment = template.apply(data);
        }

        return fragment;
    }
});