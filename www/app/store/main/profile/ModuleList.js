Ext.define('Aenis.store.main.profile.ModuleList', {
    extend: 'Ext.data.Store',

    fields: ['id', 'title', 'description', 'module'],

    proxy: {
         type: 'ajax',
         url: 'main/profile/module_list.php',
         reader: {
             type: 'json',
             root: 'modules'
         }         
    },

    autoDestroy: true
});
