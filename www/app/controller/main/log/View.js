Ext.define('Aenis.controller.main.log.View', {
	extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.main.log.View'
    ],


    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
        	oView.control({
                '[ref=mainTabPanel]': {
                    tabchange: this.onTabChange
                },
                '[ref=clearLogAction]': {
                    click: {fn: this.onClearLogAction, buffer:BestSoft.eventDelay}
                },
                '[action=reload]': {
                    click: {fn: this.onReloadInfoAction, buffer:BestSoft.eventDelay}
                },
                '.': {
                    afterrender: {fn: this.onReloadInfoAction, single:true}
                }
            }, null, this);
        });
    },


    onTabChange: function(tabPanel, newCard) {
        this.getLoadSizeField().disable();
        this.getClearLogAction().disable();
        var type = newCard.infoType;
        if(type == 'debug_log' || type == 'exception_log')
        {
            this.getLoadSizeField().enable();
            this.getClearLogAction().enable();

        }
        this.onReloadInfoAction();
    },


    onReloadInfoAction: function() {
        var tabPanel = this.getMainTabPanel();
        var type = tabPanel.getActiveTab().infoType;
        if(type == 'debug_log' || type == 'exception_log')
        {
            this.loadLogTail(type, this.getLoadSizeField().getValue());
        }
        else
        {
            this.loadLogTail(type, 0);
        }
    },


    loadLogTail: function(type, tailSize) {
        var tab = this.getMainTabPanel().getActiveTab();
        tab.down('uxiframe').load(BestSoft.config.server+'main/log/view.php?'+Ext.Object.toQueryString({
            type: type,
            tailSize: tailSize
        }));
    },


    onClearLogAction: function() {
        var me = this, tabPanel = this.getMainTabPanel();
        Ext.Ajax.request({
            url: 'main/log/clear.php',
            method: 'POST',
            params: {
                type: tabPanel.getActiveTab().infoType
            },
            callback: function(options, success, response) {
                if(me.application.handleAjaxResponse(response))
                {
                    response = Ext.JSON.decode(response.responseText);
                    if(response.success)
                    {
                        me.onReloadInfoAction();
                    }
                }
            }
        });
    }
});
