Ext.define('Aenis.store.sysadmin.resource.Types', {
	extend: 'Ext.data.Store',

    mixins: [
        'Locale.hy_AM.sysadmin.resource.Types',
        'BestSoft.mixin.Localized'
    ],

    fields: [
        {name: 'id', type: 'string'},
        {name: 'title', type: 'string'}
    ],

    proxy: {
        type: 'memory'
    },

    constructor: function() {
        this.callParent(arguments);
        this.loadData([
            {id: 'menu', title: this.T('menu')},
            {id: 'module', title: this.T('module')},
            {id: 'permission', title: this.T('permission')}
        ]);
    },

    autoDestroy: true
});
 
