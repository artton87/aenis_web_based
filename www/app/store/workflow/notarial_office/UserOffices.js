Ext.define('Aenis.store.workflow.notarial_office.UserOffices', {
    extend: 'Ext.data.Store',
    requires: [
        'Aenis.model.workflow.notarial_office.GridItem'
    ],

    model: 'Aenis.model.workflow.notarial_office.GridItem',

    proxy: {
        type: 'ajax',
        extraParams: {
            default_language_only: 1,
            merge_content_data: 1,
            available_for_logged_in_user: 1
        },

        reader: {
            type: 'json',
            root: 'data'
        },

        api: {
            read: 'workflow/notarial_office/offices.json.php'
        }
    },

    autoLoad: true,
    autoDestroy: true,
    autoSync: true
});
