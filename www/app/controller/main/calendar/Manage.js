Ext.define('Aenis.controller.main.calendar.Manage', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.main.calendar.Manage'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.calendar.Manage',
        'BestSoft.mixin.Localized'
    ],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({



            }, null, this);
        });
    }

});
