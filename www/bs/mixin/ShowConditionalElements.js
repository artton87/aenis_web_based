Ext.define('BestSoft.mixin.ShowConditionalElements', {

    /**
     * It makes sense to call this function right after view is rendered.
     * The perfect point is to call it in view's afterrender event handler.
     *
     * The function hides all elements, which have resourceRequiredToShow config set
     */
    hideConditionalElements: function() {
        var elements = this.query('[resourceRequiredToShow]');
        Ext.suspendLayouts();
        Ext.Array.each(elements, function(element) {
            element.hide();
        });
        Ext.resumeLayouts(true);
    },


    /**
     * It makes sense to call this function right after view is rendered.
     * The perfect point is to call it in view's afterrender event handler.
     *
     * The function hides all elements, which have resourceRequiredToShow config set, then
     * makes request to server ('main/profile/query_permissions.php'). After response is
     * received, function shows hidden elements only if resource specified in resourceRequiredToShow
     * config is allowed for logged in user.
     *
     * The config resourceRequiredToShow can be the following:
     *      // 1. Element will be visible only for root
     *      resourceRequiredToShow: {
     *          toBeRoot: true
     *      },
     *      // 2. Element will be visible only is resource with code 'test.add' is allowed
     *      resourceRequiredToShow: {
     *          resource: 'test.add'
     *      },
     */
    showConditionalElements: function() {
        var elements = this.query('[resourceRequiredToShow]');
        var queryResourceCodes = [];
        Ext.suspendLayouts();
        Ext.Array.each(elements, function(element) {
            if('resource' in element.resourceRequiredToShow)
                queryResourceCodes.push(element.resourceRequiredToShow.resource);
            element.hide();
        });
        Ext.resumeLayouts(true);
        Ext.Ajax.request({
            url: 'main/profile/query_permissions.php',
            params: {resource_codes:queryResourceCodes.join(',')},
            method: 'POST',
            scope: this,
            success: function(response) {
                var data = Ext.JSON.decode(response.responseText).data;
                Ext.suspendLayouts();
                Ext.Array.each(elements, function(element) {
                    if(element.resourceRequiredToShow.toBeRoot)
                    {
                        if(data.is_root)
                            element.show();
                    }
                    else if('resource' in element.resourceRequiredToShow)
                    {
                        if(data.query_result[element.resourceRequiredToShow.resource])
                            element.show();
                    }
                });
                Ext.resumeLayouts(true);
            }
        });
    }
});
