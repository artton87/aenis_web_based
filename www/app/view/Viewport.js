Ext.require([
    'Ext.ux.statusbar.StatusBar',
    'Ext.tab.Panel',
    'Ext.ux.TabCloseMenu',
    'Ext.toolbar.Spacer'
]);

Ext.define('Aenis.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Aenis.view.sysadmin.menu.components.Toolbox'
    ],

    mixins: [
        'Locale.hy_AM.main.App',
        'Locale.hy_AM.Ajax',
        'BestSoft.mixin.Localized'
    ],

    layout: 'fit',

    initComponent: function() {
        var me = this;

        this.items = [{
            xtype: 'panel',
            itemId: 'page-panel',
            layout: 'fit',
            collapsible: false,
            border: false,
            bodyStyle: 'padding: 3px 0',

            dockedItems: [{
                xtype: 'statusbar',
                itemId: 'app-statusbar',
                dock: 'bottom',
                defaultText: '',
                busyIconCls: 'statusbar-panel-busy',
                msgAjaxActiveRequestsCount: me.T('ajax_active_requests_count'),
                height: 26,

                items: [
                    {
                        xtype: 'tbtext',
                        sessionInfo: 'notarial_office',
                        text: '',
                        hidden: true
                    },
                    {
                        xtype: 'tbseparator',
                        sessionInfo: 'user_id',
                        hidden: true
                    },
                    {
                        xtype: 'tbtext',
                        sessionInfo: 'user_full_name',
                        text: '',
                        hidden: true
                    },
                    '-',
                    {
                        xtype: 'tbtext',
                        text: Ext.String.format(
                            this.T('app_version'),
                            BestSoft.config.appVersion
                        ),
                        listeners: {
                            render: function(el){
                                Ext.create('Ext.tip.ToolTip', {
                                    target: el.getEl(),
                                    anchor: 'bottom',
                                    html: Ext.String.format(
                                        me.T('app_version_tip'),
                                        BestSoft.config.appVersion,
                                        Ext.getVersion('core').getMajor(),
                                        Ext.getVersion('core').getMinor(),
                                        Ext.getVersion('core').getPatch()
                                    )
                                });
                            }
                        }
                    },
                    '-',
                    {
                        xtype: 'tbtext',
                        autoEl: {
                            tag: 'a',
                            href: me.T('bs_homepage_url'),
                            target: '_blank',
                            html: me.T('copyright')
                        },
                        cls: 'text-link'
                    }
                ]
            }]
        }];
        this.callParent(arguments);
    },


    /**
     * Loads toolbox for the currently selected module
     */
    loadToolbox: function() {
        var oPanel = this.down('#page-panel');
        var oToolbox = oPanel.getDockedComponent('app-toolbox');
        if(oToolbox)
            oPanel.removeDocked(oToolbox, true);

        var currentModule = Ext.state.Manager.get('currentModule');
        var currentModuleId = Ext.state.Manager.get('currentModuleId');
        if(!currentModuleId) return;

        oToolbox = Ext.ComponentManager.create({
            xtype: 'sysadmin.menu.Toolbox',
            itemId: 'app-toolbox',
            moduleId: currentModuleId,
            moduleCode: currentModule
        });
        oPanel.addDocked(oToolbox, 'top');
    }
});
