Ext.define('Aenis.controller.main.profile.Logout', {
    extend: 'Ext.app.Controller',

    onLaunch: function(app) {
        app.logout();
    }
});