(function() {
  'use strict';

  module.exports = AttributeType;

  AttributeType.$inject = ['$resource', '$cookies'];

  function AttributeType($resource, $cookies) {
    return {
      AttributeTypes: AttributeTypes,
      transformPersonMultiAttributes: transformPersonMultiAttributes
    };

    function AttributeTypes(params) {
      return $resource(__API_ENDPOINT__ + 'api/AttributeType/:id',
          params,
          {
            get: { method:'GET', cache: true },
            query: { method:'GET', cache: true, isArray:true }
          }
        );
    }

    /**
     * Takes an attributeTypeId, the list of attributes from a person,
     * the list of attributes defined for the particular attributeType and
     * a predicate to transform the attributes that belong to a person
     *
     * returns the transformed list of attributes that the person has defined
     */
    function transformPersonMultiAttributes(attributeTypeId,
        contactAttributes,
        attributeList,
        successPredicate) {

      var contactAttrs = _.filter(contactAttributes, function(attr) {
        return attr.attributeTypeId === attributeTypeId;
      });

      _.forEach(attributeList, function(attr) {
        _.forEach(contactAttrs, function(mine) {
          if (mine.attributeId === attr.attributeId) {
            successPredicate(attr);
          }
        });
      });

      return attributeList;
    }
  }
})();
