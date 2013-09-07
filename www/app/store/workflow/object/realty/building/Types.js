Ext.define('Aenis.store.workflow.object.realty.building.Types', {
	extend: 'Ext.data.Store',

    mixins: [
        'Locale.hy_AM.workflow.object.realty.building.Types',
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
            {id: 1, label: this.T('apartment')},
            {id: 2, label: this.T('house')},
            {id: 3, label: this.T('garden_house')},
            {id: 4, label: this.T('garage')},
            {id: 5, label: this.T('administrative_building')},
            {id: 6, label: this.T('area')},
            {id: 7, label: this.T('office')},
            {id: 8, label: this.T('swimming_pool')},
            {id: 9, label: this.T('storage')},
            {id: 10, label: this.T('workshop')},
            {id: 11, label: this.T('shop')},
            {id: 12, label: this.T('showroom')},
            {id: 13, label: this.T('fuel_refueling_stations')},
            {id: 14, label: this.T('car_service_station')},
            {id: 15, label: this.T('parking_harbor')},
            {id: 16, label: this.T('factory')},
            {id: 17, label: this.T('substation')},
            {id: 18, label: this.T('manufacturing')},
            {id: 19, label: this.T('store')},
            {id: 20, label: this.T('watchhouse')},
            {id: 21, label: this.T('boiler_house')},
            {id: 22, label: this.T('pumping_station')},
            {id: 23, label: this.T('glasshouse')},
            {id: 24, label: this.T('barn_house')},
            {id: 25, label: this.T('multi_residential_buildings')}

        ]);
    },

    autoDestroy: true
});