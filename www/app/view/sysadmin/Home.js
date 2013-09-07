Ext.define('Aenis.view.sysadmin.Home', {
    extend: 'Ext.container.Container',

    alias: 'widget.sysadmin.Home',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    baseCls: 'x-plain',

    initComponent: function() {
    	this.callParent(arguments);
    }
});