/**
 * Created by Rober on 16.12.2016.
 */





var app = angular.module('app', []);

var filterAppController = app.controller('filtercontroller',  function($scope, $http) {


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

var contentAppController = app.controller('contentcontroller', function($scope, $http){

    $scope.initContent = function(){

        $http.post('../php/getClauses.php')
            .then(function(response){
                $scope.clauses = response.data;
                console.log($scope.clauses)

            })

    };


});





filterAppController.directive('filterelements', function() {
    return {
        templateUrl:  "../loadedhtml/mainpage/filter.html"
    };
});




