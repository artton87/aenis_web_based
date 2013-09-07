Ext.define('Aenis.store.workflow.transaction.UiTypes', {
	extend: 'Ext.data.Store',

    mixins: [
        'Locale.hy_AM.workflow.transaction.UiTypes',
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
            {id: 'warrant', title: this.T('warrant')},
            {id: 'contract', title: this.T('contract')},
            {id: 'inheritance', title: this.T('inheritance')},
            {id: 'inheritance_final_part', title: this.T('inheritance_final_part')},
            {id: 'inheritance_application', title: this.T('inheritance_application')},
            {id: 'will', title: this.T('will')}
        ]);
    },

    autoDestroy: true
});
 
