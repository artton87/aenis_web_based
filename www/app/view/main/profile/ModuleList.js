Ext.require([
    'Ext.form.field.ComboBox',
    'Aenis.store.workflow.notarial_office.UserOffices'
]);

Ext.define('Aenis.view.main.profile.ModuleList', {
    extend: 'Ext.container.Container',

    alias: 'widget.mainProfileModuleList',

    layout: {
        type: 'vbox',
        pack: 'center',
        align: 'stretch'
    },
    
    autoScroll: true,
   
    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.profile.ModuleList',
        'BestSoft.mixin.Localized'
    ],
    
    baseCls: 'x-plain',

    initComponent: function() {
        this.items = [
            {
                xtype:'container',
                border:false,
                baseCls: 'x-plain',
                flex: 8,
                layout: {
                    type: 'hbox',
                    align: 'top'
                },
                defaults: {
                    margin: 20
                },
                items: [
                    {
                        xtype: 'component',
                        ref: 'userFullNameInfoPane',
                        serverData: {},
                        formatString: this.T("welcome_msg"),
                        html: '',
                        flex: 1
                    },
                    {
                        xtype: 'button',
                        itemId: 'btn-logout',
                        text: this.T('logout'),
                        iconCls: 'toolbox-logout',
                        action: 'logout'
                    }
                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    pack: 'center',
                    align: 'center'
                },
                items: [
                    {
                        xtype:'panel',
                        border: false,
                        layout: {
                            type: 'vbox',
                            pack: 'center',
                            align: 'stretch'
                        },
                        width: 400,
                        tbar: {
                            xtype: 'combobox',
                            ref: 'notarialOfficesCombo',
                            fieldLabel: this.T('notarial_office'),
                            labelAlign: 'top',
                            margin: '0 6 20 6',
                            hidden: true,
                            flex:1,
                            editable: false,
                            store: Ext.create('Aenis.store.workflow.notarial_office.UserOffices'),
                            name: 'notarial_office_id',
                            forceSelection: true,
                            valueField: 'id',
                            queryMode: 'local',
                            emptyText: this.T('selects'),
                            displayField: 'title'
                        },
                        items: [{
                            xtype:'container',
                            formatString: this.T("module_text"),
                            ref: 'moduleContainer',
                            layout: {
                                type: 'vbox',
                                pack: 'center',
                                align: 'stretch'
                            },
                            items: []
                        }]
                    }
                ]
            },
            {xtype:'component', border:false, baseCls: 'x-plain', flex:13}
        ];
        this.callParent(arguments);
    }
});
