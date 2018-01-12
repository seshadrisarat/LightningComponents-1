({
    fetchSelectedParentRecord : function(component, event, helper) {
        var parentSObjectMetadata = component.get('v.parentSObjectMetadata');
        var action = component.get('c.getRecord');
        action.setParams({
            recordId : component.get('v.selectedParentRecordId')
        });
        action.setStorable();
        action.setCallback(this, function(response) {
            if(response.getState() === 'SUCCESS') {
                component.set('v.selectedParentRecord', response.getReturnValue());
                component.set('v.parentSObjectName', response.getReturnValue().sobjectName);
            } else if(response.getState() === 'ERROR') {
                var errors = response.getError();
                if(errors && errors[0] && errors[0].message) {
                    alert(errors[0].message);
                }
            }
        });
        $A.enqueueAction(action);
    },
    fetchSearchResults : function(component, event, helper) {
        var searchText = event && event.target ? event.target.value : null;

        var escapeKeyCode = 27;
        if(event.keyCode == escapeKeyCode) {
            helper.clearSelection(component, event, helper);
        } else {
            var parentSObjectMetadata = component.get('v.parentSObjectMetadata');
            var action = component.get('c.search');
            action.setParams({
                parentSObjectName    : parentSObjectMetadata.name,
                searchFieldName      : parentSObjectMetadata.nameField,
                searchText           : searchText,
                displayTextFieldName : parentSObjectMetadata.nameField,
                limitCount           : component.get('v.limitCount')
            });
            action.setStorable();
            action.setCallback(this, function(response) {
                if(response.getState() === 'SUCCESS') {
                    component.set('v.searchResults', response.getReturnValue());
                } else if(response.getState() === 'ERROR') {
                    var errors = response.getError();
                    if(errors && errors[0] && errors[0].message) {
                        alert(errors[0].message);
                    }
                }
            });
            $A.enqueueAction(action);
        }
    },
    parentRecordSelected : function(component, event, helper) {
        var selectedParentRecordIndex = helper.getIndexFromParent(event.target, helper, 'data-selectedparentindex');
        if(selectedParentRecordIndex) {
            var searchResults = component.get('v.searchResults');
            var record = component.get('v.record');
            var fieldName = component.get('v.fieldName');
            var selectedParentRecord = searchResults[selectedParentRecordIndex];

            if(selectedParentRecord.record) {
                record[fieldName] = selectedParentRecord.record.Id;
                component.set('v.selectedParentRecord', selectedParentRecord);
            }
            component.set('v.searchResults', null);
        }
    },
    clearSelection: function(component, event, helper) {
        component.set('v.selectedParentRecord', null);
        component.set('v.searchResults', null);
    },
    getIndexFromParent : function(target, helper, attributeToFind) {
        var selectedParentRecordIndex = target.getAttribute(attributeToFind);
        while(!selectedParentRecordIndex) {
            target = target.parentNode;
            selectedParentRecordIndex = helper.getIndexFromParent(target, helper, attributeToFind);
        }
        return selectedParentRecordIndex;
    }
})