/**
 * Created by Rober on 16.12.2016.
 */





var filterApp = angular.module('filterapp', []);

var filterAppController = filterApp.controller('filtercontroller',  function($scope, $http) {


    var filter = {
        school: null,
        course: null
    };


    $scope.schoolheader = "Hochschulen";
    $scope.courseheader = "Studiengang";

    $scope.filter = filter;

    $scope.loadAvailableOptions = function(scopeVariableName, database){

        var requestData = {'database' : database};

       $http.post('../php/getAvailableOptions.php', requestData)
           .then(function(response){
               $scope[scopeVariableName] = response.data;


           })

    };

    $scope.setFilterelementToDecision = function(selectedItem, header, source){
        $scope[header] = selectedItem;
        $scope.filter[source] = selectedItem;
        console.log($scope.filter);



    };



});



filterAppController.directive('filterelements', function() {
    return {
        templateUrl:  "../loadedhtml/mainpage/filter.html"
    };
});




