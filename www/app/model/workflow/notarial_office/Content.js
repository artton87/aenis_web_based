Ext.define('Aenis.model.workflow.notarial_office.Content', {
    extend: 'Ext.data.Model',

    /**
     * Let lang_id act as primary key in JS, because it is unique for each NotarialOffice.
     * This will significantly speed up searching by lang_id.
     */
    idProperty: 'lang_id',

    fields: [
        {name: 'notarial_office_id', type: 'int'},
        {name: 'lang_id', type: 'int'},
        {name: 'address', type: 'string'}
    ]
});
