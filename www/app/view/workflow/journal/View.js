Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.layout.container.Border',
    'Ext.toolbar.Paging',
    'Ext.ux.grid.FiltersFeature'
]);

Ext.define('Aenis.view.workflow.journal.View', {
    extend: 'Ext.container.Container',
    alias: 'widget.workflowJournalView',

    layout: {
        type: 'fit'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.journal.View',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    styleSheets: [
        'workflow/transaction/Grid.css',
        'workflow/onlineApplications/messages/Grid.css'
    ],

    subjectItem: function(value){
        var subjects = [];
        Ext.Array.each(value, function(record){
            for(var key in record)
            {
                for(var index in record[key])
                {
                    subjects.push(record[key][index].contactName);
                }
            }
        });
       return subjects.join('<br /> ');
    },

    passportItem: function(value){
        var subjects = [];
        Ext.Array.each(value, function(record){
            for(var key in record)
            {
                for(var index in record[key])
                {
                    subjects.push(record[key][index].serviceData.passport_number);
                }
            }
        });
        return subjects.join('<br /> ');
    },

    initComponent: function() {
        this.loadStyleSheets();

        var store = Ext.create('Aenis.store.workflow.Journal');

        Ext.apply(this, {
            tabConfig: {
                title: this.T("journalView")
            },
            items:[
                {
                    xtype:'bsgrid',
                    ref:'journalGrid',
                    header: false,
                    flex:1,
                    autoLoadStore: true,
                    store: store,
                    features: [
                        {
                            ftype: 'filters',
                            encode: false,
                            local: true
                        }
                    ],
                    columns:[
                        {
                            header: '<b>'+this.T('transaction_code')+'</b>',
                            dataIndex: 'transaction_code',
                            renderer: Ext.util.Format.stripTags,
                            filterable: true,
                            height:70,
                            width:150
                        },
                        {
                            xtype: 'datecolumn',
                            header: '<b>'+this.T('tr_creation_date')+'</b>',
                            format: Ext.util.Format.dateFormat+" H:i",
                            dataIndex: 'tr_creation_date',
                            flex:1,
                            tdCls: 'x-grid3-hd-inner'
                        },
                        {
                            header: '<b>'+this.T("subjects")+'</b>',
                            dataIndex:'relationships',
                            alignTo: 'center',
                            flex:1,
                            renderer: this.subjectItem
                        },
                        {

                            text: '<b>'+this.T("notarial_action_content")+'</b>',
                            dataIndex:'tr_type_label',
                            flex:1
                        },
                        {

                            text: '<b>'+this.T("identification_documents")+'</b>',
                            dataIndex:'relationships',
                            flex:1,
                            renderer: this.passportItem
                        },
                        {

                            text: '<b>'+this.T("state_fee_coefficient")+'</b>',
                            dataIndex:'state_fee_coefficient',
                            width:120
                        },
                        {

                            text: '<b>'+this.T("service_fee_coefficient")+'</b>',
                            dataIndex:'service_fee_coefficient',
                            width:120
                        }
                    ],

                    tbar:[
                        '->',
                        {
                            xtype:'button',
                            text: this.T('export_excel'),
                            ref:'exportExcel',
                            iconCls:'icon-excel'
                        }
                    ]
                }
            ]
        });

        this.callParent(arguments);
    }
});