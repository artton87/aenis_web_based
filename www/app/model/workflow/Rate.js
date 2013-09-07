Ext.define('Aenis.model.workflow.Rate', {
    extend: 'Ext.data.Model',

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'tr_type_id', type: 'int'},
        {name: 'tr_type_label', type: 'string', persist: false},
        {name: 'inheritor_type_id', type: 'int'},
        {name: 'inheritor_type_label', type: 'string', persist: false},
        {name: 'parcel_purpose_type_id', type: 'int'},
        {name: 'building_type_id', type: 'int'},
        {name: 'state_fee_coefficient', type: 'float'}
    ],

    proxy: {
        type: 'ajax',

        reader: {
            type: 'json',
            root: 'data'
        },

        writer: {
            type: 'json',
            root: 'data',
            encode: true
        },

        api: {
            create: 'workflow/rate/add_edit.php',
            read: 'workflow/rate/rates.json.php',
            update: 'workflow/rate/add_edit.php',
            destroy: 'workflow/rate/delete.php'
        }
    }
});
