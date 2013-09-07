Ext.define('Aenis.model.workflow.document.Type', {
    extend: 'Ext.data.Model',

    requires: [
        'Aenis.model.workflow.document.type.Content',
        'Aenis.model.workflow.Template'
    ],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        //{name: 'label', type: 'string'},
        {name: 'order_in_list', type: 'int'},
        {name: 'parent_id', type: 'int'},
        {name: 'parent_label', type: 'string', persist: false},
        {name: 'tr_type_id', type: 'int'},
        {name: 'tr_type_label', type: 'string', persist: false},
        {name: 'hidden', type: 'boolean'},
        {name: 'is_used_in_portal', type: 'boolean'},
        {name: 'doc_type_code', type: 'string'},

        {name: 'contentData', type: 'auto'}
    ],

    /**
     * Returns document type title in a first language
     * @return {String}
     */
    getTitle: function() {
        return this.content().first().get('label');
    },

    hasMany:[
        {
            foreignKey: 'doc_type_id',
            associationKey: 'templates',
            name: 'templates',
            model: 'Aenis.model.workflow.Template'
        },
        {
            foreignKey: 'doc_type_id',
            associationKey: 'content',
            name: 'content',
            model: 'Aenis.model.workflow.document.type.Content'
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
            create: 'workflow/document/type/add_edit.php',
            read: 'workflow/document/type/types.json.php',
            update: 'workflow/document/type/add_edit.php',
            destroy: 'workflow/document/type/delete.php'
        }
    }
});
