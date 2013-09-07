Ext.define('Aenis.model.workflow.NotarialOffice', {
    extend: 'Ext.data.Model',

    requires:[
        'Aenis.model.workflow.notarial_office.Content'
    ],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'latitude', type: 'float', useNull: true},
        {name: 'longitude', type: 'float', useNull: true},
        {name: 'postal_index', type: 'string'},
        {name: 'community_id', type: 'int', useNull: true},
        {name: 'community_title', type: 'string'},
        {name: 'region_title', type: 'string'},
        {name: 'contentData', type: 'auto'}
    ],

    hasMany:[
        {
            foreignKey: 'notarial_office_id',
            associationKey: 'content',
            name: 'content',
            model: 'Aenis.model.workflow.notarial_office.Content'
        }
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
            create: 'workflow/notarial_office/add_edit.php',
            read: 'workflow/notarial_office/offices.json.php',
            update: 'workflow/notarial_office/add_edit.php',
            destroy: 'workflow/notarial_office/delete.php'
        }
    }
});
