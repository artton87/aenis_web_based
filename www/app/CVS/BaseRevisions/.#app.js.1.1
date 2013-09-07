Ext.require([
    'Ext.util.Cookies',
    'Ext.window.MessageBox',
    'Ext.state.LocalStorageProvider',
    'Ext.state.CookieProvider',
    'BestSoft.override.*', //include all overrides
    'BestSoft.button.Add',
    'BestSoft.button.Delete',
    'BestSoft.button.Edit',
    'BestSoft.button.Reset',
    'BestSoft.button.Save'
]);


Ext.application({
    name: 'Aenis',
    appFolder: 'app',
    appProperty: 'application',

    controllers: [
        "main.App"
    ],

    uses: [
        /*ant-generated-content-start*/ /*ant-generated-content-end*/
    ],

    autoCreateViewport: true,


    init: function() {
        var provider = null;
        if(Ext.supports.LocalStorage)
        {
            provider = Ext.create('Ext.state.LocalStorageProvider');
        }
        else
        {
            var cookieProviderCfg = {
                expires: null, //will be a session cookie
                path: window.location.pathname
            };
            var h = window.location.hostname;
            if(h != 'localhost')
                cookieProviderCfg.domain = h;
            provider = Ext.create('Ext.state.CookieProvider', cookieProviderCfg);
        }
        Ext.state.Manager.setProvider(provider);

        Ext.util.Observable.observe(Ext.data.Connection);
        Ext.util.Observable.observe(Ext.data.proxy.Ajax);

        //intercept all ajax request and fix the url before sending the request
        Ext.data.Connection.on('beforerequest', function(conn, options) {
            if(options.url && options.url.indexOf('://') < 0) //if scheme part is missing from url
            {
                //append our application server
                options.url = BestSoft.config.server + options.url;
            }
        });
    },


    launch: function() {
        Aenis[this.appProperty] = this;

        var me = this;
        me.oViewPort = Ext.ComponentQuery.query("viewport")[0];
        me.oViewPort.application = this;

        //store application title, which will be used by all controllers
        me.title = me.oViewPort.T('app_title');

        //handle all exceptions
        Ext.Error.handle = function(e) {
            Ext.Msg.show({
                title: me.oViewPort.T('exception'),
                msg: Ext.String.format(me.oViewPort.T('exception_info'), e.msg, e.sourceClass, e.sourceMethod),
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
            return false; //let them go to error console and terminate execution
        };

        //generic ajax request exception handler
        Ext.data.Connection.on('requestexception', function(conn, response) {
            Ext.defer(function() {
                Ext.Msg.show({
                    title: Ext.String.format(me.oViewPort.T('connection_error'), response.status),
                    msg: me.safeGetResponseErrorMessage(response),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }, 100);
        });

        //ajax proxy exception handler
        Ext.data.proxy.Ajax.on('exception', function(proxy, response) {
            me.handleAjaxResponse(response);
        });
    },


    /**
     * Handles possible errors in the given Ajax response
     * @param {Object} response    Ajax response
     * @param {Boolean} [bSilent]    Optional. If given, will not show message box on error
     * @returns {Boolean}    True, if response has success HTTP code and success=true property set, false - otherwise
     */
    handleAjaxResponse: function(response, bSilent) {
        var msgBoxConfig = {
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.ERROR
        };
        if(Ext.Ajax.parseStatus(response.status).success)
        {
            var oResponse = Ext.JSON.decode(response.responseText);
            if(oResponse.success) return true;
            var messageText = '';
            if('errors' in oResponse && 'reason' in oResponse.errors)
                messageText = oResponse.errors.reason;
            else if('message' in oResponse)
                messageText = oResponse.message;
            if(oResponse.logout)
            {
                if(bSilent)
                {
                    this.logout();
                }
                Ext.apply(msgBoxConfig, {
                    title: this.oViewPort.T('session_expired'),
                    msg: messageText,
                    callback: this.logout
                });
            }
            else
            {
                Ext.apply(msgBoxConfig, {
                    title: this.oViewPort.T('ajax_proxy_response_error'),
                    msg: messageText
                });
            }
        }
        else
        {
            Ext.apply(msgBoxConfig, {
                title: Ext.String.format(this.oViewPort.T('ajax_proxy_connection_error'), response.status),
                msg: this.safeGetResponseErrorMessage(response)
            });
        }
        if(!bSilent)
        {
            Ext.defer(function() {
                Ext.Msg.show(msgBoxConfig);
            }, 50);
        }
        return false;
    },


    safeGetResponseErrorMessage: function(response) {
        try {
            var oResponse = Ext.JSON.decode(response.responseText);
            return oResponse.errors.reason || oResponse.message;
        }
        catch(e) {
            return response.responseText;
        }
    },


    loadController: function(controller) {
        var oController = this.controllers.get(controller);
        if(!oController)
        {
            oController = this.getController(controller);
            oController.init(this);
        }
        oController.onLaunch(this);
        return oController;
    },

    loadModule: function(module, moduleId, serverData) {
        Ext.state.Manager.set('currentModule', module);
        Ext.state.Manager.set('currentModuleId', moduleId);
        if(serverData)
            this.getController('main.App').loadSessionInfoCallback(serverData);
        else
            this.getController('main.App').loadSessionInfo();
        this.oViewPort.loadToolbox();
        this.loadController(module + '.Home');
    },


    /**
     * Loads given view by its alias.
     * If a controller object is passed instead of alias, alias will be determined using controller name.
     * If a view object will be passed instead of alias, it will just be loaded.
     * @param {String|Object} alias    Either view alias (like sysadmin.role.Manage) or controller object or view object
     */
    loadView: function(alias) {
        var oView = null;
        if(Ext.isString(alias))
        {
            oView = this.getView(alias);
        }
        else
        {
            if(Ext.isObject(alias))
            {
                var name = alias.self.getName();
                var v = name.split(this.name + '.controller.');
                if(v.length>0 && v[0]=="") //we got controller
                {
                    oView = this.getView(v[1]);
                }
                else
                {
                    oView = alias;
                }
            }
        }
        this.getController('main.App').onLoadViewRequested(oView);
    },

    /**
     * Loads given view by its alias in a tab.
     * @param {String} alias    View alias (like sysadminRoleManage)
     * @param {Function} [viewCreationCallback]    Optional. A callback function to be called at view creation
     *                                             but before view rendering start.
     * @param {Object} [scope]    Optional. A scope for callback function
     */
    loadViewTabByAlias: function(alias, viewCreationCallback, scope) {
        var c = this.getController('main.App');
        c.onLoadViewTabRequested({alias:alias, callback:viewCreationCallback, scope:scope});
    },

    /**
     * Loads main view of controller in a tab.
     * Callback function will be executed in controller's scope.
     * @param {BestSoft.override.app.Controller} controller    A controller object
     * @param {Function} [viewCreationCallback]    Optional. A callback function to be called after view creation,
     *                                             but before view rendering start.
     */
    loadMainViewTab: function(controller, viewCreationCallback) {
        this.loadViewTabByAlias(controller.getMainViewAlias(), viewCreationCallback, controller);
    },


    logout: function() {
        Ext.Ajax.request({
            url: 'main/profile/logout.php',
            disableCaching: true,
            autoAbort: true,
            callback: function(options, success, response) {
                Ext.state.Manager.clear('userId');
                Ext.state.Manager.clear('currentModule');
                Ext.state.Manager.clear('currentModuleId');
                Aenis.application.handleAjaxResponse(response);
                window.location.reload();
            }
        });
    }
});