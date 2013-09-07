Ext.define('Aenis.controller.main.profile.Manage', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.main.profile.Manage'
    ],

    mixins: [
        'Locale.hy_AM.main.profile.Manage',
        'BestSoft.mixin.Localized'
    ],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
                '[ref=calendarPicker]':{
                    select: this.onClickCalendarPickerAction
                },
                '[ref=viewTransactions]':{
                    click: this.onClickViewTransactions
                },
                '.':{
                    beforerender: this.onClickCalendarPickerAction
                }

            }, null, this);
        });
    },

    onClickCalendarPickerAction: function(){
        var pickerValue = this.getCalendarPicker().getValue();
        var luDate = pickerValue.getFullYear() + '/' + (parseInt(pickerValue.getMonth()) + 1) + '/' + pickerValue.getDate();

        this.getContractsGrid().loadStore({
           params: {
               lu_date: luDate
           },
           callback: function(){
           }
        });

        this.getWarrantsGrid().loadStore({
            params: {
                lu_date: luDate
            },
            callback: function(){
            }
        });

        this.getWillsGrid().loadStore({
            params: {
                lu_date: luDate
            },
            callback: function(){
            }
        });

        this.getOnlineApplicationsGrid().loadStore({
            params: {
                lu_date: luDate
            },
            callback: function(){
            }
        });

        this.getInheritancesGrid().loadStore({
            params: {
                lu_date: luDate
            },
            callback: function(){
            }
        });

        this.getInheritanceApplicationsGrid().loadStore({
            params: {
                lu_date: luDate
            },
            callback: function(){
            }
        });
    },

    onClickViewTransactions: function(){

        var oForm = this.getDetailsForm().getForm();
        var values = oForm.getValues();

        this.getOnlineApplicationsGrid().loadStore({
            params: {
                start_date: values.start_date,
                end_date: values.end_date
            },
            callback: function(){
            }
        });


        this.getWillsGrid().loadStore({
            params: {
                start_date: values.start_date,
                end_date: values.end_date
            },
            callback: function(){
            }
        });


    }

});
