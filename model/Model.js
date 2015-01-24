/**
 * Base model class
 */
Ext.define('Marcy.model.Model', {
    extend : 'Ext.data.Model',

    /**
     * Resets all fields to their default values
     */
    reset : function() {
        var me     = this,
            fields = me.getFields();

        fields.each(function(field) {
            var name = field.getName();

            name !== 'id' && me.set(field.getName(), field.getDefaultValue());
        });
    }
});