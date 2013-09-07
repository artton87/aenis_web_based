Ext.define('Locale.hy_AM.Ajax', {

    constructor: function() {
        Ext.applyIf(this.translations["hy_AM"], {
            "connection_error": 'Կապի սխալ #{0}',
            "ajax_proxy_connection_error": 'Կապի սխալ #{0}',
            "ajax_proxy_response_error": 'Տվյալների փոխանակման սխալ',
            "ajax_no_active_requests": 'Ընթացիկ հարցումներ չկան',
            "ajax_active_requests_count": 'Ընթացքի մեջ է {0} հարցում ...'
        });
    }
});