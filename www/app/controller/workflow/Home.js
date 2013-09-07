Ext.define('Aenis.controller.workflow.Home', {
    extend: 'Ext.app.Controller',

    views: [
        'workflow.Home'
    ],

    onLaunch: function(app) {
        app.loadView('workflow.Home');
    }
});
