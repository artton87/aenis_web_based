Ext.define('Aenis.store.workflow.object.realty.parcel.Types', {
	extend: 'Ext.data.Store',

    mixins: [
        'Locale.hy_AM.workflow.object.realty.parcel.Types',
        'BestSoft.mixin.Localized'
    ],

    fields: [
        {name: 'id', type: 'int'},
        {name: 'label', type: 'string'}
    ],

    proxy: {
        type: 'memory'
    },

    constructor: function() {
        this.callParent(arguments);
        this.loadData([
            {id: 1, label: this.T('settlements')},
            {id: 2, label: this.T('industrial_purposes')},
            {id: 3, label: this.T('energy_transportation_communications')},
            {id: 4, label: this.T('specially_protected_areas')},
            {id: 5, label: this.T('special')},
            {id: 6, label: this.T('forestry')},
            {id: 7, label: this.T('reserve_lands')},
            {id: 8, label: this.T('agricultural')}
        ]);
    },

    autoDestroy: true
});