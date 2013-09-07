Ext.define('BestSoft.override.data.Model', {
    override: 'Ext.data.Model',

	/**
	 * Reloads given model data
	 * @param {Object} [config]    Optional. Config object, can also contain 'params'.
	 * @param {Function} [fnCallback]    Optional. Callback function to be called at success or failure.
	 *                                   Parameters 'record', 'operation', 'success' will be passed to that function.
	 */
	reload: function(config, fnCallback) {
		var me = this;
		Ext.apply(config, {
			success: function(record, operation) {
				me.data = record.data;
				me.commit();
				Ext.callback(fnCallback, me, [record, operation, true]);
			},
			failure: function(record, operation) {
				Ext.callback(fnCallback, me, [record, operation, false]);
			}
		});
		return Ext.getClass(this).load(this.getId(), config);
	}
});
