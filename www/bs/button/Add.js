Ext.define('BestSoft.button.Add', {
    extend: 'Ext.button.Button',
    alias: 'widget.bsbtnAdd',

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.applyIf(this, {
            text: this.T('add'),
            action: 'add',
            iconCls: 'icon-add'
        });
        this.callParent(arguments);
    }
});
