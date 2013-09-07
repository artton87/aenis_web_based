Ext.define('BestSoft.override.form.Basic', {
    override: 'Ext.form.Basic',

	/**
	 * Return all the {@link Ext.form.field.Field} components in the owner container.
	 * Override does not return fields with "formExcluded: true" config set.
	 * @return {Ext.util.MixedCollection} Collection of the Field objects
	 */
	getFields: function() {
		var fields = this.callParent(arguments);
		for(var i=fields.getCount()-1; i>=0; --i)
		{
			if(fields.getAt(i).formExcluded)
			{
				fields.removeAt(i);
			}
		}
		return fields;
	}
});
