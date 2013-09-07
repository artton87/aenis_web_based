Ext.require('Ext.form.Panel');

Ext.define('Aenis.view.main.profile.Login', {
    extend: 'Ext.container.Container',

    alias: 'widget.mainProfileLogin',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    
    autoScroll: true,

//    locale: 'hy_AM',

    styleSheets: [
        'main/profile/login.css'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.profile.Login',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    baseCls: 'x-plain',

    initComponent: function() {
        this.loadStyleSheets();
        this.items = [
            {xtype:'container', border:false, baseCls: 'x-plain', flex:8}, // 13/8 - is golden ratio (approx.)
            {
                border: false,
                baseCls: 'x-plain',
                xtype:'container',
                layout: {
                    type: 'vbox',
                    pack: 'center',
                    align: 'center'
                },
                items: [
                    {
                        xtype: 'container',
                        ref: 'loginMessage',
                        hidden: true,
                        html: 'ABC',
                        minWidth: 280,
                        cls: 'login-message'
                    },
                    {
                        xtype: 'form',
                        url: 'main/profile/login.php',
                        title: this.T('login_form_title'),
                        bodyPadding: 5,
                        width: 280,
                        waitMsgTarget: true,

                        fieldDefaults: {
                            labelAlign: 'right',
                            labelWidth: 90,
                            anchor: '100%'
                        },

                        items: [
                            {
                                xtype: 'textfield',
                                name: 'username',
                                fieldLabel: this.T('username'),
                                allowBlank: false,
                                listeners:{
                                    afterrender:function(cmp){
                                        cmp.inputEl.set({
                                            autocomplete:'on'
                                        });
                                    }
                                }
                            },
                            {
                                xtype: 'textfield',
                                inputType: 'password',
                                name: 'password',
                                fieldLabel: this.T('password'),
                                allowBlank: false
                            },
                            {
                                border: false,
                                baseCls: 'x-plain',
                                layout: {
                                    type: 'hbox',
                                    pack: 'center',
                                    align: 'center'
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        formBind: true,
                                        disabled: true,
                                        text: this.T('login'),
                                        action: 'login',
                                        iconCls: 'icon-login'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {xtype:'container', border:false, baseCls: 'x-plain', flex:13} // 13/8 - is golden ratio (approx.)
        ];
        this.callParent(arguments);
    }
});
