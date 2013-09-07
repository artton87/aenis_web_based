Ext.define('BestSoft.override.window.MessageBox', {
    override: 'Ext.window.MessageBox',

	/**
	 * Displays a standard read-only message box with an OK button (comparable to the basic JavaScript alert prompt).
	 * If a callback function is passed it will be called after the user clicks the button, and the
	 * id of the button that was clicked will be passed as the only parameter to the callback
	 * (could also be the top-right close button, which will always report as "cancel").
	 *
	 * @param {String|Object} cfg The title bar text
	 * @param {String} msg The message box body text
	 * @param {Function} [fn] The callback function invoked after the message box is closed.
	 * @param {Object} [scope=window] The scope (<code>this</code> reference) in which the callback is executed.
	 * @return {Ext.window.MessageBox} this
	 */
	alert: function(cfg, msg, fn, scope) {
		if (Ext.isString(cfg)) {
			cfg = {
				title : cfg,
				msg : msg,
				fn: fn,
				scope : scope,
				minWidth: this.minWidth,
				buttons: this.OK,
				icon: this.WARNING
			};
		}
		return this.show(cfg);
	}
});
