Ext.define('Aenis.model.workflow.transaction.type.Content', {
    extend: 'Ext.data.Model',

    /**
     * Let lang_id act as primary key in JS, because it is unique for each transaction type.
     * This will significantly speed up searching by lang_id.
     */
    idProperty: 'lang_id',

    fields: [
        {name: 'tr_type_id', type: 'int'},
        {name: 'lang_id', type: 'int'},
        {name: 'label', type: 'string'}
    ]
});
