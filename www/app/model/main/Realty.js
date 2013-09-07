Ext.define('Aenis.model.main.Realty', {
    extend: 'Ext.data.Model',

    idProperty: "id",

    fields: [
        {type: 'string', name: 'id'},
        {type: 'string', name: 'certificate_number'},
        {type: 'date',   name: 'given_date', dateFormat:'d/m/Y'},
        {type: 'string', name: 'address'},
        {type: 'string', name: 'building_type'},
        {type: 'string', name: 'parcel_codes'},
        {type: 'string', name: 'building_codes'},
        {type: 'string', name: 'parcel_total_area'},
        {type: 'string', name: 'building_total_area'},
        {type: 'string', name: 'description'}
    ],

    getName: function(){
        return this.get('address')+' '+this.get('building_total_area')+' '+this.get('building_type')+' '+this.get('certificate_number');
    }
});
