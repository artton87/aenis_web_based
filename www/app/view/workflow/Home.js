Ext.define('Aenis.view.workflow.Home', {
    extend: 'Ext.container.Container',

    alias: 'widget.workflow.Home',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    baseCls: 'x-plain',

    initComponent: function() {
    	this.callParent(arguments);
    }
});
