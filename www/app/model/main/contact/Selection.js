Ext.define('Aenis.model.main.contact.Selection', {
    extend: 'Ext.data.Model',

    requires:[
        'Aenis.model.workflow.Document',
        'Ext.form.field.File'
    ],

    mixins: [
        'BestSoft.mixin.ModelFileField'
    ],

    idProperty: "id",

    fields: [
        {type: 'int', name: 'id'}, //subject id

        {type: 'int', name: 'n_contact_id', useNull: true},
        {type: 'int', name: 'j_contact_id', useNull: true},
        {type: 'string', name: 'contactType'}, //either 'natural' or 'juridical'
        {type: 'string', name: 'contactName', persist: false},
        {type: 'auto', name: 'serviceData'},

        //fields for file selection
        {type: 'int', name: 'doc_type_id'},
        {type: 'string', name: 'doc_type_label', persist: false},
        {type: 'int', name: 'file_id'},
        {type: 'string', name: 'file_name', persist: false},
        {type: 'auto', name: 'fileData'},

        //unique hash for each contact selection model
        {type: 'string', name: 'hash', persist: false, convert: function(v, record) {
            return record.getHash();
        }}
    ],


    /**
     * Returns display name, which can be used in group header template
     */
    getSelectionName: function() {
        return this.get('contactName');
    },


    /**
     * Update hash after each edit
     */
    afterEdit: function() {
        this.callParent(arguments);
        this.data.hash = this.getHash();
    },


    /**
     * Resets fields for document type selection
     */
    resetDocTypeSelection: function() {
        this.set({
            doc_type_label: '',
            doc_type_id: 0
        });
    },


    /**
     * Returns hash, which identifies this model in a unique way.
     * Can be used for both records which come from DB and records, which come from service.
     * @return {String}
     */
    getHash: function() {
        var hash = [];
        var type = this.get('contactType');
        hash.push(type);
        if(type == 'natural')
        {
            hash.push(this.data.serviceData.social_card_number);
            hash.push(this.data.serviceData.passport_number);
        }
        else if(type == 'juridical')
        {
            hash.push(this.data.serviceData.tax_account);
        }
        return hash.join('##');
    },


    /**
     * Compares this model with the given one. Similarity is checked by the following algorithm:
     *    1) Function compares contact ids if both of them are not empty
     *    2) If one of contact ids is empty, function compares social_card_number
     *       for natural contacts and tax_account for juridical contacts.
     * @param {Aenis.model.main.contact.Selection} record    A model to compare this model against
     * @return {Boolean}    True, if record contains the 'same' model
     */
    compareWith: function(record) {
        return this.getHash() === record.getHash();
    },


    /**
     * Sets selection fields using contact model
     * @param {Aenis.model.workflow.transaction.relationship.party.Subject} model
     */
    fromSubject: function(model) {
        this.set({
            id: model.getId(),
            n_contact_id: model.get('n_contact_id'),
            j_contact_id: model.get('j_contact_id'),
            contactName: model.get('contact_name'),
            contactType: model.get('contact_type'),
            serviceData: model.get('serviceData')
        });
    },


    /**
     * Sets selection fields using contact model
     * @param {Aenis.model.main.contact.Natural} model
     */
    fromNaturalContact: function(model) {
        this.set({
            n_contact_id: model.getId(),
            j_contact_id: 0,
            contactName: model.getName(),
            contactType: 'natural',
            id: 0,
            serviceData: model.getServiceData()
        });
    },


    /**
     * Sets selection fields using contact model
     * @param {Aenis.model.main.contact.Juridical} model
     */
    fromJuridicalContact: function(model) {
        this.set({
            n_contact_id: 0,
            j_contact_id: model.getId(),
            contactName: model.getName(),
            contactType: 'juridical',
            id: 0,
            serviceData: model.getServiceData()
        });
    },

    hasMany:[
        {
            foreignKey: 'subject_id',
            associationKey: 'documents',
            name: 'documents',
            model: 'Aenis.model.workflow.Document'
        }
    ]
});
