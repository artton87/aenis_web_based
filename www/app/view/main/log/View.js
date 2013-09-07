Ext.require([
    'Ext.form.field.Number',
    'Ext.ux.IFrame'
]);

Ext.define('Aenis.view.main.log.View', {
	extend: 'Ext.container.Container',
	alias: 'widget.mainLogView',
	
	layout: {
        type: 'fit'
    },

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.log.View',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
		Ext.apply(this, {
            tabConfig: {
                title: this.T("tabTitle")
            },
            items: [
                {
                    xtype: 'tabpanel',
                    ref: 'mainTabPanel',
                    enableTabScroll: true,
                    bbar: [
                        {
                            xtype: 'numberfield',
                            ref: 'loadSizeField',
                            fieldLabel: this.T('kb_to_load'),
                            labelWidth: 150,
                            labelAlign: 'right',
                            value: 10,
                            inputWidth: 80,
                            minValue: 1,    //1KB min
                            maxValue: 4096  //4MB max
                        },
                        ' ',
                        {
                            text: this.T("reload"),
                            action: 'reload',
                            iconCls: 'icon-reload'
                        },
                        '->',
                        {
                            text: this.T("clear_log"),
                            ref: 'clearLogAction',
                            iconCls: 'icon-reset'
                        }
                    ],
                    defaults: {
                        layout: 'fit'
                    },
                    items: [
                        {
                            title: this.T("server_info"),
                            infoType: 'server_info',
                            items: [
                                {
                                    xtype: 'uxiframe'
                                }
                            ]
                        },
                        {
                            title: this.T("debug_log"),
                            infoType: 'debug_log',
                            items: [
                                {
                                    xtype: 'uxiframe'
                                }
                            ]
                        },
                        {
                            title: this.T("exception_log"),
                            infoType: 'exception_log',
                            items: [
                                {
                                    xtype: 'uxiframe'
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
