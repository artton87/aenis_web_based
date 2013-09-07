Ext.define('Aenis.model.workflow.notarial_office.GridItem', {
	extend: 'Ext.data.Model',

	idProperty: 'id',
	fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'postal_index', type: 'string'},
        {name: 'community_id', type: 'int', useNull: true},
        {name: 'community_title', type: 'string', persist: false},
        {name: 'region_title', type: 'string', persist: false},
        {name: 'lang_id', type: 'int'},
        {name: 'address', type: 'string'},
        {name: 'title', convert: function(v, record) {
            return record.getTitle(v, record);
        }}
    ],


    getTitle: function(v, record) {
        var model = record || this;
        var parts = [
            model.get('region_title'),
            model.get('community_title')
        ];
        var address = model.get('address');
        if(address != '')
            parts.push(address);
        return parts.join('; ');
    },

    proxy: {
        type: 'ajax',
        extraParams: {
            default_language_only: 1,
            merge_content_data: 1
        },

        reader: {
            type: 'json',
            root: 'data'
        },

        api: {
            read: 'workflow/notarial_office/offices.json.php'
        }
    }
});
