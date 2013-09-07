Ext.define('BestSoft.override.data.Store', {
    override: 'Ext.data.Store',

	/**
	 * Gets data of all models inside the store as array.
	 * Each element is an object containing the model data.
	 * @param {Boolean} includeAssociated    True to also include associated data. Defaults to false.
	 * @return {Array}    An array with data from all store models
	 */
	getData: function(includeAssociated) {
		var data = [];
		this.each(function(model) {
			data.push(model.getData(includeAssociated));
		});
		return data;
	},


	/**
	 * Gets field values of all models inside the store as array.
	 * @param {String} field    A name of field to get
	 * @return {Array}    An array with data from all store models
	 */
	getFieldData: function(field) {
		var data = [];
		this.each(function(model) {
			data.push(model.get(field));
		});
		return data;
	},


	/**
	 * Returns an array of objects, where each object is
	 * constructed by picking given field from the each record of store.
	 * @param {Array|String} [fields]    Which fields to take from store records.
	 * @param {Boolean} [bReturnNonPersistentFields]    Whenever to return fields with persist=false.
	 *                                                  Has effect only if fields array is empty.
	 *                                                  Defaults to false - will not return persist=false fields.
	 * @return {Object[]}    An array of objects, where each object
	 *                       contains fields extracted from store model
	 */
	getRecords: function(fields, bReturnNonPersistentFields) {
		if(!fields)
			fields = [];
		if(!Ext.isArray(fields))
			fields = [fields];

		if(0 === fields.length)
		{
			Ext.Array.each(this.model.getFields(), function(field) {
				if(bReturnNonPersistentFields || field.persist)
				{
					fields.push(field.name);
				}
			});
		}

		var data = [];
		this.each(function(model) {
			var recordData = {};
			for(var i=0; i<fields.length; ++i)
			{
				recordData[fields[i]] = model.get(fields[i]);
			}
			data.push(recordData);
		});
		return data;
	},


	/**
	 * Returns true, if store was previously successfully loaded.
	 * This status resets before each store load.
	 * @return {Boolean}
	 */
	isLoaded: function() {
		return this.loaded;
	},


	constructor: function() {
		this.callParent(arguments);
		this.on('beforeload', this.onBeforeLoadHandler, this);
		this.on('load', this.onLoadHandler, this);
	},

	onBeforeLoadHandler: function() {
		this.loaded = false;
	},

	onLoadHandler: function() {
		this.loaded = true;
	}
});
