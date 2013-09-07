Ext.define('Aenis.view.main.profile.ChangePasswordDlg', {
    extend: 'Ext.window.Window',
    alias: 'widget.mainProfileChangePasswordDlg',
    width: 300,
    height: 300,
    minHeight: 300,
    layout: 'fit',
    resizable: false,
    modal: true,
    closeAction: 'destroy',
    
    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.profile.ChangePasswordDlg',
        'BestSoft.mixin.Localized'
    ],
    
    initComponent: function() {
    	this.title = this.T('dlg_title');    	 
    	this.items = [{
	    	xtype : 'form',
	    	url: 'main/profile/change_password.php',
	    	layout: {
	            type: 'vbox',
	            align: 'stretch'
	        },
	        border: false,
	        bodyPadding: 10,
			defaultType: 'textfield',
	        fieldDefaults: {
	            labelAlign: 'top',
	            labelWidth: 100
	        },
	        defaults: {
	            margins: '0 0 10 0'
	        },
	        
	        items: [ {
	            fieldLabel: this.T('password_old'),
	            allowBlank: false,
	            name: 'password_old',
	            inputType: 'password'
	        }, {
	            fieldLabel: this.T('password_new'),
	            allowBlank: false,
	            name: 'password_new',
	            inputType: 'password'
	        }, {
	            fieldLabel: this.T('password_new_repeat'),
	            allowBlank: false,
	            name: 'password_new_repeat',
	            inputType: 'password'
	        }],
	        buttons: [{
	            text: this.T('save'),
	            action: 'save',
	            messages: {
	            	success: this.T('msg_changed_success')
	            },
	            iconCls: 'icon-save'	            
	        },{
	            text: this.T('close'),
	            action: 'close',
	            iconCls: 'icon-reset'
	        }]
	    }];
	    
    	this.callParent(arguments);
    }
});

