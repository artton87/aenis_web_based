Ext.define('Aenis.model.workflow.transaction.Type', {
    extend: 'Ext.data.Model',
    requires: [
        'Aenis.model.workflow.transaction.type.Content',
        'Aenis.model.workflow.transaction.type.party.Type',
        'Aenis.model.workflow.transaction.type.property.Type'
    ],

    mixins: [
        'Locale.hy_AM.workflow.transaction.UiTypes',
        'BestSoft.mixin.Localized'
    ],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'order_in_list', type: 'int'},
        {name: 'parent_id', type: 'int'},
        {name: 'parent_label', type: 'string', persist: false},
        {name: 'hidden', type: 'boolean'},
        {name: 'is_used_in_portal', type: 'boolean'},
        {name: 'state_fee_coefficient', type: 'float', useNull: true},
        {name: 'service_fee_coefficient_min', type: 'float', useNull: true},
        {name: 'service_fee_coefficient_max', type: 'float', useNull: true},
        {name: 'form_template', type: 'string'},
        {name: 'ui_type', type: 'string'},
        {name: 'ui_type_label', type: 'string', persist: false, convert: function(v, record) {
            return record.T(record.data.ui_type);
        }},
        {name: 'contentData', type: 'auto'}
    ],

    /**
     * Returns transaction type title in a first language
     * @return {String}
     */
    getTitle: function() {
        return this.content().first().get('label');
    },

    hasMany:[
        {
            foreignKey: 'tr_type_id',
            associationKey: 'partyTypes',
            name: 'partyTypes',
            model: 'Aenis.model.workflow.transaction.type.party.Type'
        },
        {
            foreignKey: 'tr_type_id',
            associationKey: 'propertyTypes',
            name: 'propertyTypes',
            model: 'Aenis.model.workflow.transaction.type.property.Type'
        },
        {
            foreignKey: 'tr_type_id',
            associationKey: 'content',
            name: 'content',
            model: 'Aenis.model.workflow.transaction.type.Content'
        },
        {
            foreignKey: 'tr_type_id',
            associationKey: 'relationshipTypes',
            name: 'relationshipTypes',
            model: 'Aenis.model.workflow.relationship.Type'
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
            create: 'workflow/transaction/type/add_edit.php',
            read: 'workflow/transaction/type/types.json.php',
            update: 'workflow/transaction/type/add_edit.php',
            destroy: 'workflow/transaction/type/delete.php'
        }
    }
});
