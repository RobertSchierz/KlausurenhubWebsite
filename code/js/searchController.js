/**
 * Created by Rober on 07.02.2017.
 */
var searchController = app.controller('searchcontroller', function ($scope, $http, $rootScope, handleScopesService) {


    $scope.hidesearchbar = true;

    $scope.handleSearchbar = function (state) {
        $scope.hidesearchbar = state;

        //Reset der Suche wenn Filterbutton betätigt wird

        $scope.searchvalue = "";
        $scope.searchboxChanged();


    }

    $scope.searchboxChanged = function () {

        var requestData = {'searchvalue': $scope.searchvalue};



        $http.post('../php/getSearchResult.php', requestData)
            .then(function (response) {

                handleScopesService.getScopeOf(0).clauses = response.data;
               // $rootScope.clauses = response.data;


            })


    }

    handleScopesService.addScopeOf(2, $scope);
});