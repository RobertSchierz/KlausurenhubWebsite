/**
 * Created by Rober on 28.01.2017.
 */

/*
app.factory('facebookService', function($q) {
    return {
        getMyLastName: function() {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'last_name'
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }
    }
});



$scope.getMyLastName = function() {
    facebookService.getMyLastName()
        .then(function(response) {
            //$scope.last_name = response.last_name;
            console.log(response.last_name);
        }
    );
};

    */