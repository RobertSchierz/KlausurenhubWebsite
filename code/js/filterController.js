/**
 * Created by Rober on 07.02.2017.
 */
var filterAppController = app.controller('filtercontroller', function ($scope, $rootScope, $http, sharedScopeofContentData, sharedScopeofFilterData) {

    sharedScopeofFilterData.addsearchScope($scope);


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


        $scope.updateContent();


    };

    $scope.updateContent = function () {


        var filterQuery = " SELECT * " +
            " FROM clauses " +
            " LEFT JOIN courses " +
            " ON clauses.courseID = courses.courseID " +
            " LEFT JOIN schools " +
            " ON clauses.schoolID = schools.schoolID " +
            " LEFT JOIN degrees " +
            " ON clauses.degreeID = degrees.degreeID" +
            " LEFT JOIN semesters " +
            " ON clauses.semesterID = semesters.semesterID " +
            " LEFT JOIN subjects " +
            " ON clauses.subjectID = subjects.subjectID" +
            " LEFT JOIN teachers " +
            " ON clauses.teacherID = teachers.teacherID" +
            " LEFT JOIN years " +
            " ON clauses.yearID = years.yearID" +
            " WHERE ";



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

                $rootScope.clauses = response.data;



            })
    }

    $scope.resetFilter = function () {

        initTimer = 0;

        var sharedscope = sharedScopeofContentData.getList();

        sharedscope.url = "../loadedhtml/content/clauseOverviewDisplay.html";
        sharedscope.initContent();
        $scope.setFilterStandardValues();
        resetFilter();
    }


});