Ext.define('Aenis.controller.main.profile.ChangePasswordDlg', {
    extend: 'Ext.app.Controller',
	
    requires: [
        'Aenis.view.main.profile.ChangePasswordDlg'
    ],
    
    onLaunch: function() {
        this.dlg = this.createMainView();
    	this.dlg.show();
    },
    
    onclickSaveBtn: function(oBtn) {
    	var oForm = oBtn.up('form');
    	oForm.actionMsg = oBtn.messages.success;
    	oForm.getForm().submit();    	    	
    },
    
    onclickCloseBtn: function() {
    	this.dlg.destroy();
    	return true;
    },
    
    onFormBeforeAction: function() {
        return true;
    },

    onFormActionComplete: function(oForm, action) {
    	if(action instanceof Ext.form.action.Submit)
        {
        	Ext.MessageBox.alert({title: this.application.title, msg: oForm.owner.actionMsg, icon: Ext.MessageBox.INFO, buttons: Ext.MessageBox.OK});
        	this.dlg.destroy();
        }
    },

    onFormActionFailed: function(oForm, action) {
        if(action instanceof Ext.form.action.Submit)
        {
        	if(action.failureType == Ext.form.action.Action.SERVER_INVALID)
            {
                var obj = Ext.JSON.decode(action.response.responseText);
                Ext.MessageBox.alert(this.application.title, obj.errors.reason);               
            }
            
            oForm.reset();
        }
    },
    
    onTextFieldSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
        	var actionBtn = field.up('form').down('[action=save]');
        	this.onclickSaveBtn(actionBtn);        	 
        }
    },
    
    init: function() {
        this.control({
        	'mainProfileChangePasswordDlg textfield': {
                specialkey: {fn: this.onTextFieldSpecialKey, buffer:BestSoft.eventDelay}
            },
        	'mainProfileChangePasswordDlg form': {
                beforeaction: this.onFormBeforeAction,
                actioncomplete: this.onFormActionComplete,
                actionfailed: this.onFormActionFailed
            },
            'mainProfileChangePasswordDlg [action=save]': {
                click: {fn: this.onclickSaveBtn, buffer:BestSoft.eventDelay}
            },
            'mainProfileChangePasswordDlg [action=close]': {
                click: this.onclickCloseBtn
            }
        });
    }   
});
