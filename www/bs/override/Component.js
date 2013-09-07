Ext.define('BestSoft.override.Component', {
    override: 'Ext.Component', 
        
	/**
	 * Adds listeners to child components selected via Ext.ComponentQuery.
	 *
	 * Accepts an object containing component paths mapped to a hash of listener functions.
	 *
	 * Listeners are being added using {@link mon()}, ensuring, that they will be
	 * destroyed, when the component to which they are attached will be destroyed.
	 *
	 * @param {String|Object} selectors    If a String, the second argument is used as the listeners,
	 *                                     otherwise an object of selectors -> listeners is assumed
	 * @param {Object} [listeners]    Optional. Config for listeners.
	 * @param {Object} [scope]    Optional. If given, will be used as scope for all listeners without specified scope
	 */
	control: function(selectors, listeners, scope) {
		var selector, me = this;
		if(Ext.isString(selectors))
		{
			selector = selectors;
			selectors = {};
			selectors[selector] = listeners;
		}
		for(selector in selectors)
		{
			if(!selectors.hasOwnProperty(selector)) continue;

			var oEls = [];
			if(selector == '.') //'.' stands for 'myself'
				oEls.push(me);
			else
				oEls = this.query(selector);
			Ext.Array.forEach(oEls, function(oEl) {
				var listenerList = selectors[selector] || {};
				for(var ev in listenerList)
				{
					if(!listenerList.hasOwnProperty(ev)) continue;

					var options  = {};
					var listener = listenerList[ev];
					var listenerScope = scope || me;
					if(Ext.isObject(listener))
					{
						options = Ext.clone(listener);
						listener = options.fn;
						listenerScope = options.scope || scope;
						delete options.fn;
						delete options.scope;
					}
					oEl.mon(oEl, ev, listener, listenerScope, options);
				}
			});
		}
	},


	/**
	 * Returns alias of component, derived from component class name by removing
	 * dots and part before '.view.' (inclusive) and making first letters uppercase.
	 * If obtained alias (or alias prefixed with 'widget.') does
	 * not exist in the list of component aliases, returns null.
	 *
	 * @return {String|null}    Alias or null if alias cannot be determined.
	 */
	getMainAlias: function() {
		var className = Ext.ClassManager.getName(this);
		var i = className.indexOf('.view.');
		if(i<0) return null;
		var mainAlias = className.substr(i+'.view.'.length);
		mainAlias = mainAlias.replace(/\.(.)/g, function(match, group1) {
			return Ext.String.capitalize(group1);
		});
		mainAlias = Ext.String.uncapitalize(mainAlias);

		var aliases = Ext.ClassManager.getAliasesByName(className);
		if(Ext.Array.contains(aliases, 'widget.'+mainAlias) || Ext.Array.contains(aliases, mainAlias))
		{
			return mainAlias;
		}
		return null;
	}
});
