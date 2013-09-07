Ext.define('Aenis.store.main.YesNo', {
    extend: 'Ext.data.Store',

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized'
    ],

    fields: [
        {name: 'id', type: 'boolean'},
        {name: 'title', type: 'string'}
    ],

    proxy: {
        type: 'memory'
    },

    constructor: function() {
        this.callParent(arguments);
        this.loadData([
            {id: true, title: this.T('yes')},
            {id: false, title: this.T('no')}
        ]);
    },

    autoDestroy: true
});
 
