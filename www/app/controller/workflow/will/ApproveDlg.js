Ext.define("Aenis.controller.workflow.will.ApproveDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.workflow.will.ApproveDlg'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized',
        'Locale.hy_AM.workflow.will.ApproveDlg'
    ],

    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @param {Object} params    {Aenis.model.workflow.will.Manage} model
     * @return {Aenis.view.workflow.will.ApproveDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.addComponentRefs(this.oDlg);
        this.oDlg.addEvents(
            /**
             * @event approved
             * Fired when user approves will
             * Return FALSE from event handler to prevent dialog from closing.
             */
            'actionCompleted',

            /**
             * @event cancelled
             * Fired when user closes the dialog without any action
             */
            'cancelled'
        );
        this.oDlg.returnValue = null;
        this.oDlg.params = params || {};
        this.oDlg.control({
            '[ref=approveAction]': {
                click: {fn: this.onApproveWill, buffer:BestSoft.eventDelay}
            },
            '[action=cancel]': {
                click:this.onclickCloseBtn
            },
            '[ref=printAction]':{
                click: {fn: this.printWill, buffer:BestSoft.eventDelay}
            },
            '[ref=payAction]':{
                click: this.onclickPayAction
            },
            '[ref=resetPayment]':{
                click: this.onclickResetPaymentAction
            },
            '[ref=approveWillForm]': {
                afterrender: {fn:this.afterRenderApproveDialogForm, single:true},
                actioncomplete: this.onFormActionComplete,
                actionfailed: this.onFormActionFailed
            },
            '[ref=inheritorTypes]': {
                beforerender: this.onBeforeRenderInheritorTypes,
                change:this.onChangeAction
            },
            '[ref=objectRealtyParcelTypes]': {
                change:this.onChangeAction
            },
            '[ref=objectRealtyBuildingTypes]': {
                change:this.onChangeAction
            },
            '[ref=discountDocument]': {
                change:this.onChangeDiscountDocument
            },
            '[ref=resetDiscount]': {
                click: this.onClickResetDiscount
            },
            '.': {
                beforeclose: function(oDlg) {
                    if(oDlg.returnValue)
                    {
                        if(!oDlg.fireEvent('actionCompleted', oDlg.returnValue))
                        {
                            oDlg.returnValue = null;
                            return false;
                        }
                    }
                    else
                    {
                        oDlg.fireEvent('cancelled');
                    }
                    delete this.oDlg;
                    return true;
                }
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },

    onChangeDiscountDocument: function(){
        if(this.getDiscountDocument().getValue() != '')
        {
            this.getInheritorTypesPanel().hide();
            this.getObjectRealtyParcelTypesPanel().hide();
            this.getObjectRealtyBuildingTypesPanel().hide();
            this.getDiscountDocument().dutyValue = this.getDutyValue().getValue();
            this.getDutyValue().setValue(0);
            this.getResetDiscount().show();
        }
    },

    onClickResetDiscount: function(){
        this.getDiscountDocument().reset();
        this.getInheritorTypesPanel().show();
        this.getObjectRealtyParcelTypesPanel().show();
        this.getObjectRealtyBuildingTypesPanel().show();
        this.getDutyValue().setValue(this.getDiscountDocument().dutyValue);
        this.getResetDiscount().hide();
    },

    onChangeAction: function(){
      console.log("change");

        var data = {};

        if(parseInt(this.getInheritorTypes().getValue()) > 0)
            var inheritorType = this.getInheritorTypes().getValue();
        else
            var inheritorType = 0;

        if(parseInt(this.getObjectRealtyParcelTypes().getValue()) > 0)
            var objectRealtyParcelType = this.getObjectRealtyParcelTypes().getValue();
        else
            var objectRealtyParcelType = 0;
        if(parseInt(this.getObjectRealtyBuildingTypes().getValue()) > 0)
            var objectRealtyBuildingType = this.getObjectRealtyBuildingTypes().getValue();
        else
            var objectRealtyBuildingType = 0;


        data.inheritorType = inheritorType;
        data.objectRealtyParcelType = objectRealtyParcelType;
        data.objectRealtyBuildingType = objectRealtyBuildingType;
        this.setStateFeeCoefficient(data);
    },


    // subject inheritor types before render
    onBeforeRenderInheritorTypes: function(oList){
        var oStore = oList.getStore();
        oStore.load({
                scope:this,
                callback: function(records) {

                }
            }
        );
    },

    afterRenderApproveDialogForm: function(){
        this.getTransactionTypeField().setValue(this.oDlg.params.model.get('tr_type_label'));
        this.getApproveWillForm().transaction_id = this.oDlg.params.model.getId();
        this.getApproveWillForm().tr_type_id = this.oDlg.params.model.get('tr_type_id');

        var rates =  this.oDlg.params.model.get('rateData');
        var state_fee = [];
        for(var index in rates)
        {

            if(rates[index].building_type_id == 0 &&
                rates[index].inheritor_type_id == 0 &&
                rates[index].parcel_purpose_type_id == 0
                )
            {
                state_fee.push(rates[index].state_fee_coefficient);
                this.getDutyValue().setValue(1000*Ext.Array.max(state_fee));
            }
        }

        this.getPaymentNotaryValue().setMinValue(this.oDlg.params.model.get('service_fee_coefficient_min'));
        this.getPaymentNotaryValue().setMaxValue(this.oDlg.params.model.get('service_fee_coefficient_max'));
    },


    onclickPayAction: function(){

        var dutyValue = this.getDutyValue().getValue();
        var paymentNotaryValue = this.getPaymentNotaryValue().getValue();
        if(dutyValue >= 0 && paymentNotaryValue > 0)
        {
            this.getPaidDutyValue().setValue(dutyValue);
            this.getPaidPaymentNotaryValue().setValue(paymentNotaryValue);
            this.getDutyPaymentOptionsPanel().hide();
            this.getCompleteDocForm().show();

            this.getPrintAction().hide();
            this.getApproveAction().show();
            this.getPayAction().hide();
        }

    },

    onclickResetPaymentAction: function(){
        this.getPaidDutyValue().setValue();
        this.getPaidPaymentNotaryValue().setValue();

        this.getDutyPaymentOptionsPanel().show();
        this.getCompleteDocForm().hide();

        this.getPrintAction().show();
        this.getApproveAction().hide();
        this.getPayAction().show();
        this.getPaymentNotaryValue().setValue(this.oDlg.params.model.get('service_fee_coefficient_min'));
    },


    printWill: function(){
        var model = this.oDlg.params.model;
        Ext.Ajax.request({
            url: 'workflow/will/print.php',
            method: 'POST',
            params: {
                init: 1,
                transaction_id: model.getId()
            },
            callback: function(options, success, response) {
                if(Aenis.application.handleAjaxResponse(response))
                {
                    response = Ext.JSON.decode(response.responseText);
                    if(response.success && response.key)
                    {
                        window.open(
                            BestSoft.config.server + 'workflow/will/print.php?key='+response.key,
                            '_blank',
                            'resizable=yes'
                        )
                    }
                }
            }
        });
    },

    onFormActionComplete: function(oForm, action) {
        if(action instanceof Ext.form.action.Submit)
        {
            Ext.MessageBox.alert({
                title: this.application.title,
                msg: this.getApproveWillForm().messages.will_approved,
                icon: Ext.MessageBox.INFO, buttons: Ext.MessageBox.OK
            });
            this.oDlg.returnValue = true;
            var model = this.oDlg.params.model;
            model.set('tr_status_code','approved');
            model.set('tr_status_title',this.T('approved'));
            model.commit();
            this.oDlg.close();
        }
    },

    onFormActionFailed: function(oForm, action) {
        if(action instanceof Ext.form.action.Submit)
        {
            if(action.failureType == Ext.form.action.Action.SERVER_INVALID)
            {
                var obj = Ext.JSON.decode(action.response.responseText);
                Ext.Msg.alert({
                    title: this.application.title,
                    msg: obj.errors.reason,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        }
    },

    onApproveWill: function(){
        var oForm = this.getApproveWillForm().getForm();
        oForm.submit({params:{
            transaction_id: this.getApproveWillForm().transaction_id,
            tr_type_id: this.getApproveWillForm().tr_type_id,
            duty: this.getPaidDutyValue().getValue(),
            paymentNotary: this.getPaidPaymentNotaryValue().getValue()
        }});
    },

    onclickCloseBtn: function() {
        this.oDlg.close();
    },

    setStateFeeCoefficient: function(inputData){

        var rates =  this.oDlg.params.model.get('rateData');

        //console.log(rates);

        var state_fee = [];
        for(var index in rates)
        {
            if(
                parseInt(rates[index].inheritor_type_id) == inputData.inheritorType &&
                parseInt(rates[index].parcel_purpose_type_id) == inputData.objectRealtyParcelType &&
                parseInt(rates[index].building_type_id) == inputData.objectRealtyBuildingType
               )
            {
                state_fee.push(rates[index].state_fee_coefficient);
                this.getDutyValue().setValue(1000*Ext.Array.max(state_fee));
            }
        }

    }
});

