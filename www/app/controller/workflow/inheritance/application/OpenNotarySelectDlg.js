Ext.define("Aenis.controller.workflow.inheritance.application.OpenNotarySelectDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.workflow.inheritance.application.OpenNotarySelectDlg'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.inheritance.application.OpenNotarySelectDlg',
        'BestSoft.mixin.Localized'
    ],


    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @param {Object} params    {Aenis.model.workflow.Transaction} model
     * @return {Aenis.view.workflow.will.ApproveDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.addComponentRefs(this.oDlg);
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user selects a country and presses OK button.
             * Return FALSE from event handler to prevent dialog from closing.
             * @param {Aenis.model.main.User} model    Selected item
             */
            'itemSelected',

            /**
             * @event cancelled
             * Fired when user closes the dialog without any action
             */
            'cancelled'
        );
        this.oDlg.returnValue = null;
        this.oDlg.params = params || {};
        this.oDlg.control({
            '[ref=selectAction]': {
                click: {fn: this.onSelectOpenNotaryAction, buffer:BestSoft.eventDelay}
            },
            '[action=cancel]': {
                click:this.onclickCloseBtn
            },
            '[ref=regionSelectAction]': {
                click: this.onclickSelectRegionBtn
            },
            '[ref=communitySelectAction]': {
                click: this.onclickSelectCommunityBtn
            },
            '.': {
                beforeclose: function(oDlg) {
                    if(oDlg.returnValue)
                    {
                        if(!oDlg.fireEvent('itemSelected', oDlg.returnValue))
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

    onSelectOpenNotaryAction: function(){

        var openNotaryId = this.getSelectFiniteNotaryCombo().getValue();
        var openNotary = this.getSelectFiniteNotaryCombo().getStore().getById(openNotaryId);
        var regionLabel =  this.getRegionField().regionModel.getTitle();
        var communityLabel =  this.getCommunityField().communityModel.getTitle();
        var addressLabel =  this.getTestatorAddressField().getValue();
        var testatorPlaceResidence = regionLabel+' '+communityLabel+' '+addressLabel;


        var notaryData = {
            notary_id: openNotaryId,
            notary: openNotary,
            address: testatorPlaceResidence
        };

        this.oDlg.returnValue = notaryData;
        this.oDlg.close();

    },

    onclickSelectRegionBtn: function() {
        var oController = this.application.loadController('main.country.region.SelectDlg');
        oController.showDialog().on({
            itemSelected: function(model) {
                this.getRegionField().setValue(model.getTitle());
                this.getRegionField().regionModel = model;
                this.getRegionField().regionId = model.getId();
                this.getCommunitySelectAction().enable();
            },
            scope: this
        });
    },

    onclickSelectCommunityBtn: function() {
        var me = this;
        var oController = this.application.loadController('main.country.region.community.SelectDlg');
        oController.showDialog({regionId: me.getRegionField().regionId}).on({
            itemSelected: function(model) {
                this.getCommunityField().setValue(model.getTitle());
                this.getCommunityField().communityModel = model;
                this.getCommunityField().communityId = model.getId();

                var default_lang_id = 1;
                var community_id =  this.getCommunityField().communityId;

                var me = this;
                this.getSelectFiniteNotaryCombo().getStore().load({
                    params: {
                        community_id: community_id,
                        default_language_only: default_lang_id,
                        merge_content_data: 1,
                        is_notary: 1,
                        show_all: 1
                    },
                    callback: function(record){
                        me.getSelectFiniteNotaryCombo().show();
                        me.getSelectFiniteNotaryCombo().setValue(record[0]);
                    }
                });
            },
            scope: this
        });




    },




    onclickCloseBtn: function() {
        this.oDlg.close();
    }
});

