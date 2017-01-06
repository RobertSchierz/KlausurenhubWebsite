/**
 * Created by Rober on 16.12.2016.
 */





var app = angular.module('app', []);

var filter = {
    schoolID: null,
    courseID: null
};

var filterAppController = app.controller('filtercontroller',  function($scope, $http) {





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
        $scope[header] = selectedItem[source + "Name"];
        $scope.filter[source + "ID"] = selectedItem[source + "ID"]
        console.log($scope.filter);

        $scope.updateContent();

    };

    $scope.updateContent = function(){


        var filterQuery = "SELECT clauseID , clauseName, Path, Uploader, courseName, schoolName, clauses.schoolID, clauses.courseID "+
        "FROM clauses " +
        "LEFT JOIN courses " +
        "ON clauses.courseID = courses.courseID " +
        "LEFT JOIN schools " +
        "ON clauses.schoolID = schools.schoolID " +
        "WHERE ";

           for(var key in filter){
               if(filter.hasOwnProperty(key) && filter[key] != null){
                   filterQuery += ("clauses." + key +" = " + "'"+filter[key]+"' AND ");

               }
           }

        filterQuery = filterQuery.slice(0, - 4);

        var requestData = {'query' : filterQuery };

        console.log(filterQuery);

            $http.post('../php/getFilteredQuery.php', requestData)
                .then(function(response){

                    console.log(response.data);


                })
    }



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




