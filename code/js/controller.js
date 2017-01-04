/**
 * Created by Rober on 16.12.2016.
 */





var filterApp = angular.module('filterapp', []);

var filterAppController = filterApp.controller('filtercontroller',  function($scope, $http) {



    $scope.schoolheader = "Hochschulen";

    $scope.loadAvailableSchools = function(){
       $http.post('../php/getAvailableSchools.php')
           .then(function(response){
               $scope.availableSchools = response.data;
               console.log($scope.availableSchools);
           })

    };



});



filterAppController.directive('filterelements', function() {
    return {
        templateUrl:  "../loadedhtml/mainpage/filter.html"
    };
});




