Ext.require('Ext.form.field.VTypes', function() {
    // custom Vtype for vtype: 'am_passport'
    Ext.apply(Ext.form.field.VTypes, {
        //  vtype validation function
        am_passport: function(val) {
            return /^[A-Z]{2}[0-9]{7}$/i.test(val);
        },

        // The error text to display when the validation function returns false
        am_passportText: 'Անձնագրի սերիան ու համարը սխալ են ներմուծված: Օրինակ` AH0449004:',

        // The keystroke filter mask
        am_passportMask: /[A-Z0-9]/i
    });


    // custom Vtype for vtype: 'am_ssn'
    Ext.apply(Ext.form.field.VTypes, {
        //  vtype validation function
        am_ssn: function(val) {
            return /^[0-9]{10}$/i.test(val);
        },

        // The error text to display when the validation function returns false
        am_ssnText: 'Սոց. քարտի համարը սխալ է ներմուծված: Օրինակ` 2202780145:',

        // The keystroke filter mask
        am_ssnMask: /[0-9]/i
    });


    // custom Vtype for vtype: 'am_tax_account'
    Ext.apply(Ext.form.field.VTypes, {
        //  vtype validation function
        am_tax_account: function(val) {
            return /^[0-9]{8}$/i.test(val);
        },

        // The error text to display when the validation function returns false
        am_tax_accountText: 'Հարկ վճարողի հաշվառման համարը սխալ է ներմուծված: Օրինակ` 03520238:',

        // The keystroke filter mask
        am_tax_accountMask: /[0-9]/i
    });


    // custom Vtype for vtype: 'phone'
    Ext.apply(Ext.form.field.VTypes, {
        //  vtype validation function
        phone: function(val) {
            return /^(((\(\+[0-9][0-9\- ]*\) *)|(\+[0-9][0-9\- ]*))?[0-9][0-9\- ]*[0-9])$/i.test(val);
        },

        // The error text to display when the validation function returns false
        phoneText: 'Հեռախոսի համարը սխալ է ներմուծված: Օրինակ` (+37410) 123456:',

        // The keystroke filter mask
        phoneMask: /[0-9\+\-\(\) ]/i
    });


    // custom Vtype for vtype: 'date_range'
    // To use, set
    //      endDateField: <itemId of end date field>
    // on the first field and
    //      startDateField: <itemId of start date field>
    // on the second field
    Ext.apply(Ext.form.field.VTypes, {
        date_range: function(val, field) {
            var date = field.parseDate(val);

            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            // Always return true since we're only using this vtype to set the
            // min/max allowed values (these are tested for after the vtype test)
            return true;
        },

        date_rangeText: 'Սկզբի ամսաթիվը պետք է փոքր լինի երկրորդ ամսաթվից'
    });


    // custom Vtype for vtype: 'password_match'
    // To use, set
    //      initialPassField: <itemId of password input field>
    // on the password verification field
    Ext.apply(Ext.form.field.VTypes, {
        password_match: function(val, field) {
            if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                return (val == pwd.getValue());
            }
            return true;
        },

        password_matchText: 'Գաղտնաբառերը չեն համընկնում'
    });

});
