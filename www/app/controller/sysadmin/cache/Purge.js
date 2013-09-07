Ext.define('Aenis.controller.sysadmin.cache.Purge', {
    extend: 'Ext.app.Controller',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.sysadmin.cache.Purge',
        'BestSoft.mixin.Localized'
    ],

    onLaunch: function(app) {
        var me = this;
        Ext.Msg.confirm(
            app.title,
            me.T("confirm_cache_purge"),
            function(btn) {
                if(btn == 'yes')
                {
                    var oWaitMsg = Ext.Msg.wait(
                        me.T("purge_progressing"),
                        app.title
                    );
                    Ext.Ajax.request({
                        url: 'sysadmin/cache/purge.php',
                        method: 'POST',
                        callback: function(options, success, response){
                            oWaitMsg.close();
                            app.handleAjaxResponse(response);
                        }
                    });
                }
            }
        );
    }
});
