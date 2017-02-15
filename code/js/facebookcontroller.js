/**
 * Created by Rober on 28.01.2017.
 */




var facebookcontroller = app.controller('authenticationCtrl', ['$scope','Facebook' ,'$rootScope', '$q', '$http', function($scope, Facebook, $rootScope, $q, $http) {


    $scope.userWriteToDatabase = function(){

        var requestData =  JSON.stringify({id: $rootScope.facebooid, email: $rootScope.facebookemail, name: $rootScope.facebookname});

        $http.post('../php/uploadUser.php', requestData,["Content-Type", "application/json;charset=UTF-8"])
            .then(function (response) {

            })
    }

    $scope.$watch(function() {
        return Facebook.isReady();
    }, function(newVal) {

        $scope.$on('Facebook:statusChange', function(ev, data) {



            if (data.status == 'connected') {

                $scope.$apply(function() {



                    getMyLastName().then(function(response) {

                        $rootScope.facebookname = response.name;
                        $rootScope.facebooid = response.id;
                        $rootScope.facebookemail = response.email;
                        $("#login").show(500);
                        $("#facebooknamespan").show(500);

                        $scope.userWriteToDatabase();

                    });
                });

            } else {

                $scope.$apply(function() {

                    $("#login").hide(500);
                    $("#facebooknamespan").hide(500, function () {
                        $rootScope.facebookname = "";
                        $rootScope.facebooid = "";
                        $rootScope.facebookemail = "";
                    });

                });

            }


        });

        function getMyLastName() {
            var deferred = $q.defer();
            FB.api('/me', {fields: 'name, email'}, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }

    });
}]);