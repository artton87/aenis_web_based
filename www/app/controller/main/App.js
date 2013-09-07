Ext.require([
    'Ext.tab.*',
    'Ext.ux.TabReorderer'
]);

Ext.define('Aenis.controller.main.App', {
    extend: 'Ext.app.Controller',
    requires: [
        'BestSoft.AjaxRequestsCountListener'
    ],

    refs: [
        {
            ref: 'appStatusBar', selector: '#app-statusbar'
        },
        {
            ref: 'appStatusBarNotarialOfficePane', selector: '#app-statusbar [sessionInfo=notarial_office]'
        },
        {
            ref: 'appStatusBarUserFullNamePane', selector: '#app-statusbar [sessionInfo=user_full_name]'
        },
        {
            ref: 'appStatusBarNotarialOfficePaneDelimiter', selector: '#app-statusbar [sessionInfo=user_id]'
        },
        {
            ref: 'pagePanel', selector: '#page-panel'
        }
    ],


    onLaunch: function(app) {
        Ext.Ajax.request({
            url: 'main/profile/check_session.php',
            disableCaching: true,
            callback: function(options, success, response){
                if(app.handleAjaxResponse(response, true))
                {
                    var obj = Ext.JSON.decode(response.responseText);
                    if(null == Ext.state.Manager.get('userId'))
                    {
                        Ext.state.Manager.set('userId', obj.user_id);
                    }

                    var currentModule = Ext.state.Manager.get('currentModule');
                    var currentModuleId = Ext.state.Manager.get('currentModuleId');
                    if(currentModule && currentModuleId)
                    {
                        //load chosen module
                        app.loadModule(currentModule, currentModuleId);
                    }
                    else
                    {
                        //show module list
                        app.loadController('main.profile.ModuleList');
                    }
                }
                else
                {
                    app.loadController('main.profile.Login');
                }
            }
        });
    },


    init: function(app) {
        //create ajax request count change listener
        Ext.create("BestSoft.AjaxRequestsCountListener", {
            listeners: {
                ajaxRequestsCountChanged: {
                    fn: this.onAjaxRequestsCountChanged,
                    scope: this
                }
            }
        });

        app.on('loadViewRequested', this.onLoadViewRequested, this);
        app.on('loadViewTabRequested', this.onLoadViewTabRequested, this);

        this.control({
            '[action=logout]': {
                click: {fn: this.onclickLogoutBtn, buffer:BestSoft.eventDelay}
            },
            '#app-toolbox': {
                moduleActivated: this.onToolboxModuleItem,
                commandActivated: this.onToolboxCommandItem
            },
            '[type="page-panel-tabs-panel"]': {
                destroy: this.onViewTabClosed
            }
        });
    },


    onAjaxRequestsCountChanged: function(ev) {
        var oStatusBar = this.getAppStatusBar();
        if(!oStatusBar) return;
        if(0 == ev.requestsCount) //hide loading indicator
        {
            oStatusBar.clearStatus();
        }
        else
        {
            oStatusBar.showBusy({
                text: Ext.String.format(oStatusBar.msgAjaxActiveRequestsCount, ev.requestsCount)
            });
        }
    },

    onLoadViewRequested: function(oView) {
        this.getPagePanel().removeAll(true);
        this.getPagePanel().add(oView);
    },


    onLoadViewTabRequested: function(ev) {
        var oTabs = this.getPagePanel().down('#page-panel-tabs');
        if(!oTabs)
        {
            this.getPagePanel().removeAll(true);
            oTabs = this.getPagePanel().add({
                itemId: 'page-panel-tabs',
                xtype: 'tabpanel',
                enableTabScroll: true,
                border: false,
                plain: true,
                plugins: ['tabclosemenu',Ext.create('Ext.ux.TabReorderer')]
            });
        }

        var oView = null,
            viewTab = oTabs.child('[viewAlias="'+ev.alias+'"]');
        if(!viewTab || viewTab.child('*').allowMultipleInstances) //tab does not exist or multiple instances of view are allowed
        {
            oView = Ext.ClassManager.instantiateByAlias('widget.'+ev.alias);
            (ev.callback || Ext.emptyFn).apply(ev.scope || window, [oView]);

            //create new tab
            oView.tabConfig = oView.tabConfig || {};
            var cfg = {
                viewAlias: ev.alias,
                type: 'page-panel-tabs-panel',
                layout: 'fit',
                padding: '2 1 0 1',
                border: false,
                tabConfig: oView.tabConfig
            };

            //if there is an icon defined, show it
            var iconCls = oView.self.getName().split(this.application.name + '.view.');
            iconCls = 'toolbox-' + iconCls[1].replace(/\./g, '-');
            if(Ext.util.CSS.getRule('.'+iconCls))
                cfg.iconCls = iconCls;

            //make tab closable by default
            if(!("closable" in oView.tabConfig))
                cfg.tabConfig.closable = true;

            //let Ext.ux.TabCloseMenu know about closable property of tab
            cfg.closable = cfg.tabConfig.closable;

            //add a new view to newly created tab
            viewTab = oTabs.add(cfg);
            viewTab.removeAll(true);
            viewTab.add(oView);
        }
        oTabs.setActiveTab(viewTab);
    },


    onViewTabClosed: function() {
        var oTabs = this.getPagePanel().down('#page-panel-tabs');
        if(oTabs && 0 == oTabs.items.items.length)
        {
            var currentModule = Ext.state.Manager.get('currentModule');
            if(currentModule)
            {
                // Tab is destroying at this moment, so defer loading
                // a new controller a bit (20ms) in order to let destroy finish.
                Ext.defer(function() {
                    this.application.loadController(currentModule + '.Home');
                }, 20, this);
            }
        }
    },

    onclickLogoutBtn: function() {
        this.application.logout();
    },

    onToolboxModuleItem: function(ev) {
        this.application.loadModule(ev.module, ev.moduleId);
    },

    onToolboxCommandItem: function(ev) {
        if(ev.command == 'main.profile.ModuleList')
        {
            this.getAppStatusBarUserFullNamePane().hide();
            this.getAppStatusBarNotarialOfficePane().hide();
            this.getAppStatusBarNotarialOfficePaneDelimiter().hide();
        }
        this.application.loadController(ev.command);
    },


    loadSessionInfo: function() {
        var me = this;
        Ext.Ajax.request({
            url: 'main/profile/check_session.php',
            callback: function(options, success, response){
                if(me.application.handleAjaxResponse(response, true))
                {
                    var sessionData = Ext.JSON.decode(response.responseText);
                    me.loadSessionInfoCallback(sessionData);
                }
            }
        });
    },

    loadSessionInfoCallback: function(serverData) {
        var oPane;
        if(serverData.user_full_name != '')
        {
            oPane = this.getAppStatusBarUserFullNamePane();
            oPane.setText('<b>'+Ext.String.htmlEncode(serverData.user_full_name)+'</b>');
            oPane.show();
        }
        if(serverData.notarial_office_name != '')
        {
            oPane = this.getAppStatusBarNotarialOfficePane();
            oPane.setText('<b>'+Ext.String.htmlEncode(serverData.notarial_office_name)+'</b>');
            oPane.show();
            this.getAppStatusBarNotarialOfficePaneDelimiter().show();
        }
    }
});
