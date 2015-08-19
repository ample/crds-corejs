var cms_services_module = angular.module('crossroads.core');

cms_services_module.factory('ContentBlock', function ($resource) {
    return $resource(__CMS_ENDPOINT__ + '/api/ContentBlock/:id', { id: '@_id' }, {cache: true});
});

cms_services_module.factory('Page', function ($resource, $location) {
    var stageParam = $location.search()['stage'];
    if (stageParam) {
        return $resource(__CMS_ENDPOINT__ + '/api/Page/?link=:url&STAGE=:stage', { url: '@_url', stage: stageParam }, { cache: false });
    };

    return $resource(__CMS_ENDPOINT__ + '/api/Page/?link=:url', { url: '@_url' }, { cache: true });
});
