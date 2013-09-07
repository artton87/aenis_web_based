Ext.define('Aenis.model.workflow.subject.relation.TreeItem', {
    extend: 'Ext.data.Model',

    idProperty: "id",

    fields: [
        {type: 'int', name: 'id'},
        {type: 'int', name: 'rel_dt_id'},
        {type: 'int', name: 'subject_relation_id'},
        {type: 'int', name: 'rel_type_id'},
        {type: 'int', name: 'subject_id'},
        {type: 'int', name: 'contact_id'},
        {type: 'string', name: 'name'},
        {type: 'string', name:'type'},
        {type: 'auto', name:'serviceData'}
    ],

    proxy: {
        type: 'ajax',
        actionMethods: {
            read:'POST'
        },
        api: {
            read: 'workflow/subject/relations.json.php'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty: 'total'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            encode: true,
            root: 'data'
        }
    }
});
