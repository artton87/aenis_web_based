Ext.define('Aenis.controller.main.profile.Login', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.main.profile.Login'
    ],

    mixins: [
        'Locale.hy_AM.main.profile.Login',
        'BestSoft.mixin.Localized'
    ],

    onLaunch: function(app) {
        Ext.state.Manager.clear('currentModule');
        Ext.state.Manager.clear('currentModuleId');
        var oView = this.createMainView();
        this.addComponentRefs(oView);
        oView.control({
            'textfield': {
                specialkey: {fn: this.onTextFieldSpecialKey, buffer:BestSoft.eventDelay}
            },
            'form': {
                beforeaction: this.onFormBeforeAction,
                actioncomplete: this.onFormActionComplete,
                actionfailed: this.onFormActionFailed
            },
            '[action=login]': {
                click: {fn: this.onclickLoginBtn, buffer:BestSoft.eventDelay}
            },
            '.': {
                afterrender: this.onAfterRenderView
            }
        }, null, this);
        app.loadView(oView);
    },


    onAfterRenderView: function(oView) {
        oView.down('form textfield').focus();
    },

    onclickLoginBtn: function(oBtn) {
        oBtn.up('form').getForm().submit();
    },

    onFormBeforeAction: function(oForm, action) {
        if(action instanceof Ext.form.action.Submit)
        {
            if(!oForm.isValid()) return false;
            var oMsg = this.getLoginMessage();
            oMsg.hide();
            action.waitMsg = this.T('logging_in');
        }
        return true;
    },

    onFormActionComplete: function(oForm, action) {
        if(action instanceof Ext.form.action.Submit)
        {
            window.location.reload();
        }
    },

    onFormActionFailed: function(oForm, action) {
        if(action instanceof Ext.form.action.Submit)
        {
            if(action.failureType == Ext.form.action.Action.SERVER_INVALID)
            {
                var oMsg = this.getLoginMessage();
                var obj = Ext.JSON.decode(action.response.responseText);
                oMsg.update(obj.errors.reason);
                oMsg.show();
            }
            oForm.reset();
        }
    },

    onTextFieldSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
            field.up('form').getForm().submit();
        }
    }
});
