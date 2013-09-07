Ext.define('Aenis.model.workflow.file.Selection', {
    extend: 'Ext.data.Model',

    requires:[
        'Aenis.model.workflow.Document',
        'Ext.form.field.File'
    ],

    mixins: [
        'BestSoft.mixin.ModelFileField'
    ],

    idProperty: "doc_type_id",

    fields: [
        {type: 'int', name: 'doc_type_id'},
        {type: 'string', name: 'doc_type_label', persist: false},
        {type: 'int', name: 'file_id'},
        {type: 'string', name: 'file_name', persist: false},

        //hash will be the same for all items inside a single store
        {type: 'string', name: 'hash', persist: false}
    ],


    /**
     * Resets fields for document type selection
     */
    resetDocTypeSelection: function() {
        this.set({
            doc_type_label: '',
            doc_type_id: 0
        });
    }
});
