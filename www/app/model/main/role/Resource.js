Ext.define('Aenis.model.main.role.Resource', {
    extend: 'Ext.data.Model',

    mixins: [
        'Locale.hy_AM.sysadmin.resource.Types',
        'BestSoft.mixin.Localized'
    ],

    fields: [
        {name: 'role_id', type: 'int'},
        {name: 'resource_id', type: 'int'},
        {name: 'title', type: 'string'},
        {name: 'code', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'type_label', type: 'string', persist: false, convert: function(v, record) {
            return record.T(record.data.type);
        }},
        {name: 'allowed', type: 'bool'}
    ],

    proxy: {
        type: 'ajax',

        reader: {
            type: 'json',
            root: 'data'
        },

        api: {
            read: 'main/role/resource/resources.json.php'
        }
    }
});
