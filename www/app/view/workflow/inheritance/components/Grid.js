Ext.require([
    'BestSoft.grid.Panel',
    'Ext.toolbar.Paging',
    'Aenis.store.workflow.Inheritances'
]);

Ext.define('Aenis.view.workflow.inheritance.components.Grid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.workflowInheritanceGrid',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.inheritance.components.Grid',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    styleSheets: [
        'workflow/transaction/Grid.css'
    ],


    statusIconColumnRenderer: function(value/*, metadata, record*/){
        return '<div class="transaction_status transaction_status-'+value+'"></div>';
    },

    objectList: function(value){
        if(value.object.length == 1)
            value = value.object[0].objectName;
        else if(value.object.length > 1)
            value = value.object[0].objectName + ', ... (' + value.object.length+')';
        return value;
    },

    testatorItem: function(value){
        if(value.testator.length == 1)
            value = value.testator[0].contactName;
        else if(value.testator.length > 1)
            value = value.testator[0].contactName + ', ... (' + value.testator.length+')';
        return value;
    },

    inheritorItem: function(value){
        if(value.inheritor.length == 1)
            value = value.inheritor[0].contactName;
        else if(value.inheritor.length > 1)
            value = value.inheritor[0].contactName + ', ... (' + value.inheritor.length+')';
        return value;
    },

    applicantItem: function(value){
        if(value.applicant.length == 1)
            value = value.applicant[0].contactName;
        else if(value.applicant.length > 1)
            value = value.applicant[0].contactName + ', ... (' + value.applicant.length+')';
        return value;
    },

    initComponent: function() {

        this.loadStyleSheets();

        var me = this;
        var store = this.store || Ext.create('Aenis.store.workflow.Inheritances',{});
        Ext.applyIf(store.proxy.extraParams, {
            view_uid: me.getId(),
            params: Ext.JSON.encode({
                ui_type: 'inheritance'
            })
        });
        Ext.applyIf(this, {
            xtype: 'bsgrid',
            ref: 'inheritancesGrid',
            hidden:true,
            autoLoadStore: false,
            height:240,
            store: store,
            tools: [],
            columns:[

                {
                    text: this.T('transaction_code'),
                    dataIndex: 'transaction_code',
                    width:150
                },


                /*{
                 text:this.T('testator'),
                 dataIndex:'relationships',
                 flex:1,
                 renderer:this.testatorItem
                 },
                 {
                 text:this.T('inheritor'),
                 dataIndex:'relationships',
                 flex:1,
                 renderer:this.inheritorItem
                 },
                 {
                 text:this.T('applicant'),
                 dataIndex:'relationships',
                 flex:1,
                 renderer:this.applicantItem
                 },
                {
                    text:this.T('objects'),
                    dataIndex:'relationships',
                    flex:1,
                    renderer:this.objectList
                },*/
                {
                    text:this.T('notary'),
                    dataIndex:'notary',
                    flex:1
                },

                {
                    xtype: 'datecolumn',
                    format: Ext.util.Format.dateFormat+" H:i",
                    text: this.T('tr_creation_date'),
                    dataIndex: 'tr_creation_date'
                }
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: store,
                displayInfo: true,
                displayMsg: this.T('pagingtoolbar_displayMessage'),
                emptyMsg: this.T('pagingtoolbar_emptyMessage')
            }

        });
        this.callParent(arguments);
    }
});
