Ext.define('Aenis.model.sysadmin.Resource', {
    extend: 'Ext.data.Model',

    mixins: [
        'Locale.hy_AM.sysadmin.resource.Types',
        'BestSoft.mixin.Localized'
    ],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'title', type: 'string'},
        {name: 'code', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'type_label', type: 'string', persist: false, convert: function(v, record) {
            return record.T(record.data.type);
        }},
        {name: 'is_root_resource', type: 'boolean'}
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
            create: 'sysadmin/resource/add_edit.php',
            read: 'sysadmin/resource/resources.json.php',
            update: 'sysadmin/resource/add_edit.php',
            destroy: 'sysadmin/resource/delete.php'
        }
    }
});
