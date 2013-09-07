
Ext.define('Aenis.view.workflow.inheritance.components.Form', {
    extend: 'Ext.form.Panel',
    alias: 'widget.workflowInheritanceForm',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.inheritance.components.Form',
        'BestSoft.mixin.Localized'
    ],

    border: false,

    initComponent: function() {

        Ext.applyIf(this, {
            xtype: 'form',
            ref:'inheritanceSearchForm',
            defaults: {
                margin: 5
            },
            layout:{
                type: 'vbox',
                align: 'stretch'
            },

            messages:{
                first_name_is_empty: this.T('first_name_is_empty'),
                last_name_is_empty: this.T('last_name_is_empty'),
                second_name_is_empty: this.T('second_name_is_empty'),
                social_card_number_is_empty: this.T('social_card_number_is_empty'),
                passport_number_is_empty: this.T('passport_number_is_empty'),
                fallback: this.T('fallback_message')
            },
            border:false,
            items: [
                {
                    xtype:'fieldcontainer',
                    layout:{
                        type: 'vbox',
                        align:'stretch'
                    },
                    items:[
                        {
                            xtype:'fieldcontainer',
                            layout:{
                                type: 'vbox',
                                align:'center',
                                pack:'center'
                            },
                            fieldDefaults: {
                                labelAlign:'right'
                            },
                            items:[
                                {
                                    xtype:'textfield',
                                    name:'death_certificate',
                                    allowBlank: false,
                                    afterLabelTextTpl: BestSoft.required,
                                    fieldLabel:this.T('death_certeficate'),
                                    flex:1
                                },
                                {
                                    xtype: 'button',
                                    formBind: true,
                                    text:this.T("search"),
                                    ref:'deadManSearchButton',
                                    iconCls: 'icon-search',
                                    margin: '0 0 0 5px'
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
