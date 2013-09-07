Ext.define('BestSoft.AjaxRequestsCountListener', {

    mixins: {
        observable: 'Ext.util.Observable'
    },

    /**
     * A number of AJAX requests in progress
     */
    activeRequestsCount: 0,


    constructor: function(config) {
        this.mixins.observable.constructor.call(this, config);

        this.addEvents('ajaxRequestsCountChanged');

        var me = this;
        Ext.Ajax.mon(Ext.Ajax, {
            beforerequest: me.beforeRequestHandler,
            requestcomplete: me.requestCompleteHandler,
            requestexception: me.requestExceptionHandler,
            scope: me
        });
        return this;
    },

    beforeRequestHandler: function(/*conn, options, eOpts*/) {
        this.incActiveRequestsCount();
        this.fireEvent('ajaxrequestscountchanged', {
            requestsCount: this.activeRequestsCount,
            grow: 'increased'
        });
    },

    requestCompleteHandler: function(/*conn, response, options, eOpts*/) {
        this.decActiveRequestsCount();
        this.fireEvent('ajaxrequestscountchanged', {
            requestsCount: this.activeRequestsCount,
            grow: 'decreased'
        });
    },

    requestExceptionHandler: function(/*conn, response, options, eOpts*/) {
        this.decActiveRequestsCount();
        this.fireEvent('ajaxrequestscountchanged', {
            requestsCount: this.activeRequestsCount,
            grow: 'decreased'
        });
    },

    /**
     * Increases number of AJAX requests in progress
     */
    incActiveRequestsCount: function() {
        ++this.activeRequestsCount;
        return this.activeRequestsCount;
    },

    /**
     * Decreases number of AJAX requests in progress
     */
    decActiveRequestsCount: function() {
        this.activeRequestsCount = this.activeRequestsCount>0 ? --this.activeRequestsCount : 0;
        return this.activeRequestsCount;
    }
});
