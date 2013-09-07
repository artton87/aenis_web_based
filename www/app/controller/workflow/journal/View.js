Ext.define('Aenis.controller.workflow.journal.View', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.journal.View'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.journal.View',
        'BestSoft.mixin.Localized'
    ],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
                '[ref=exportExcel]':{
                    click: this.onClickExportExcel
                },
                '.': {
                    afterrender: this.onAfterRenderView
                }
            }, null, this);
        });
    },

    onAfterRenderView: function(){

    },

    onClickExportExcel: function(){
        window.open(BestSoft.config.server+'workflow/journal/export.php');
    }
});