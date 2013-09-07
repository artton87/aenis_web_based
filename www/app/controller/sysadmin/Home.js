Ext.define('Aenis.controller.sysadmin.Home', {
    extend: 'Ext.app.Controller',

    views: [
        'sysadmin.Home'
    ],

    onLaunch: function(app) {
        app.loadView('sysadmin.Home');
    }
});