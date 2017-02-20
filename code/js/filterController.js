/**
 * Created by Rober on 07.02.2017.
 */
var filterAppController = app.controller('filtercontroller', function ($scope, $rootScope, $http, handleScopesService) {

   // sharedScopeofFilterData.addsearchScope($scope);
    handleScopesService.addScopeOf(1, $scope);


    $scope.setFilterStandardValues = function () {
        $scope.schoolheader = "Hochschulen";
        $scope.teacherheader = "Lehrkraft";
        $scope.courseheader = "Studiengang";
        $scope.subjectheader = "Modul";
        $scope.degreeheader = "Grad";
        $scope.semesterheader = "Semester";
        $scope.yearheader = "Jahr";

    }


    filter;

    $scope.loadAvailableOptions = function (scopeVariableName, database) {

        var requestData = {'database': database};

        $http.post('../php/getAvailableOptions.php', requestData)
            .then(function (response) {

                $scope[scopeVariableName] = response.data;

            })

    };

    $scope.setFilterelementToDecision = function (selectedItem, header, source) {
        $scope[header] = selectedItem[source + "Name"];
        filter[source + "ID"] = selectedItem[source + "ID"];
        console.log(filter);
        $scope.updateContent();


    };

    $scope.updateContent = function () {

        handleScopesService.getScopeOf(0).loadingfilter = true;

        var filterQuery = "WHERE " ;

        for (var key in filter) {
            if (filter.hasOwnProperty(key) && filter[key] != null) {
                filterQuery += ("clauses." + key + " = " + "'" + filter[key] + "' AND ");

            }
        }

        if(Object.keys(filter).length === 0){
            filterQuery = filterQuery.slice(0, -6);
        }else{
            filterQuery = filterQuery.slice(0, -4);
        }

        var requestData = {'query': filterQuery };

        $http.post('../php/getFilteredQuery.php', requestData)
            .then(function (response) {

                handleScopesService.getScopeOf(0).clauses = response.data;
                handleScopesService.getScopeOf(0).loadingfilter = false;

            })




    }

    $scope.resetFilter = function () {

        initTimer = 0;

        var sharedscope = handleScopesService.getScopeOf(0);

        sharedscope.url = "../loadedhtml/content/clauseOverviewDisplay.html";
        sharedscope.initContent();
        $scope.setFilterStandardValues();
        resetFilter();
    }


});