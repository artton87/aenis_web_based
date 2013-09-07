Ext.define('Aenis.controller.main.contact.juridical.mixin.Search', {

    onTextFieldSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
            this.onSearchBtn();
        }
    },

    onSpecialKey: function(field, event) {
        if(event.getKey() == event.ENTER) {
            this.onAccept();
        }
    },

    onSearchBtn:function() {
        var form = this.getJuridicalSearchForm().getForm();
        if(form.isValid())
        {
            var values = form.getValues();
            //if(values.organization_name == '' && values.tax_account == '')
           // {
                var msg = '';
                //if(values.organization_name == '')
                //{
                    msg = this.getJuridicalSearchForm().messages['organization_name_is_empty'];
               // }
               // else if(values.tax_account == '')
                //{
                    msg = this.getJuridicalSearchForm().messages['tax_account_is_empty'];
                //}
                //else
               // {
                    msg = this.getJuridicalSearchForm().messages['fallback'];
              //  }
                /*Ext.Msg.show({
                    title: this.application.title,
                    msg: msg,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });*/
               // return;
            //}
            var me = this;
            this.getJuridicalContactsGrid().loadStore({
                params: values,
                callback: function(records/*, operation, success*/) {
                    if(null == records)
                    {
                        me.getAddAction().enable();
                    }
                    else
                    {
                        if(records.length == 0)
                        {
                            me.getAddAction().enable();
                        }
                        else
                        {
                            me.getAddAction().disable();
                        }
                    }
                }
            });
        }

    }
});

