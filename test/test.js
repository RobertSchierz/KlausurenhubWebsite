var app = angular.module('testapp', []);


app.service('servicePOST', function($http){



        var getDatafromDatabase = function (callback) {


            $http.post('test.php').then(function (response) {



                return callback(response);
            }

            )
        }

    return{
        getDatafromDatabase : getDatafromDatabase
    }

})





//app.service('servicePOST', servicePOST);


app.controller('testcontroller', function($scope, $http, servicePOST) {
    $scope.header = "schools";
    $scope.source = "https://cdn2.iconfinder.com/data/icons/flat-ui-icons-24-px/24/cross-24-512.png";




   $scope.reload = function(){
       $scope.source = "https://openclipart.org/image/2400px/svg_to_png/225151/Loading_icon_with_fade.png";


       servicePOST.getDatafromDatabase(function (response) {

           $scope.test = response;

           $scope.schools = response.data;
           $scope.source = "https://d30y9cdsu7xlg0.cloudfront.net/png/6156-200.png";

       });

       console.log($scope.test);

   }

});