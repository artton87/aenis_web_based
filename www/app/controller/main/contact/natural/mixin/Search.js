Ext.define('Aenis.controller.main.contact.natural.mixin.Search', {

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
        var form = this.getNaturalSearchForm().getForm();
        if(form.isValid())
        {
            var values = form.getValues();
            if( !(
                ( values.first_name != '' && values.last_name != '' ) ||
                    ( values.social_card_number != ''  ) ||
                    ( values.passport_number != '' || values.death_certificate != '' )
                ))
            {
                var msg = '';
                if(values.first_name == '')
                {
                    msg = this.getNaturalSearchForm().messages['first_name_is_empty'];
                }
                else if(values.last_name == '')
                {
                    msg = this.getNaturalSearchForm().messages['last_name_is_empty'];
                }
                else if(values.social_card_number == '')
                {
                    msg = this.getNaturalSearchForm().messages['social_card_number_is_empty'];
                }
                else if(values.passport_number == '')
                {
                    msg = this.getNaturalSearchForm().messages['passport_number_is_empty'];
                }
                else if(values.death_certificate == '')
                {
                    msg = this.getNaturalSearchForm().messages['death_certificate_is_empty'];
                }
                else
                {
                    msg = this.getNaturalSearchForm().messages['fallback'];
                }
                Ext.Msg.show({
                    title: this.application.title,
                    msg: msg,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });
                return;
            }
            var me = this;
            this.getNaturalContactsGrid().loadStore({
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

                    if(me.getDeathCertificate().partTypeId == 30) // change unexceptionable to party_type_code, 30 is inheritor, died person
                    {
                        me.getNaturalContactsGrid().columns[8].setVisible(true);
                    }
                }
            });
        }
    }
});

