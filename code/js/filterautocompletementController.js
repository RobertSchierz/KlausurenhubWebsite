/**
 * Created by Rober on 20.02.2017.
 */



app.controller('AutocompleteController', AutocompleteController);

function AutocompleteController ($timeout, $q, $log, $scope, loadfilteroptions, countRows, handleScopesService, $http, updateRowCount) {
    var self = this;


    handleScopesService.addScopeOf(1, $scope);

    // list of `state` value/display objects
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.noCache = false;



    $scope.setFilterelementToDecision = function (selectedItem, source) {
        if(selectedItem == undefined){
           delete filter[source + "ID"];
        }else{
            filter[source + "ID"] = selectedItem[source + "ID"];
        }


        $scope.updateContent();



    };



    $scope.resetFilter = function () {

        //initTimer = 0;

        var sharedscope = handleScopesService.getScopeOf(0);

        sharedscope.url = "../loadedhtml/content/clauseOverviewDisplay.html";
        sharedscope.initContent();
        $scope.setFilterStandardValues();
        filter = {};
    }

    $scope.updateContent = function () {

        handleScopesService.getScopeOf(0).loadingfilter = true;

        $scope.filterQuery = "WHERE " ;

        for (var key in filter) {
            if (filter.hasOwnProperty(key) && filter[key] != null) {
                $scope.filterQuery += ("clauses." + key + " = " + "'" + filter[key] + "' AND ");

            }
        }

        if(Object.keys(filter).length === 0){
            $scope.filterQuery = $scope.filterQuery.slice(0, -6);
        }else{
            $scope.filterQuery = $scope.filterQuery.slice(0, -4);
        }

        var requestData = {'query': $scope.filterQuery };



        $http.post('../php/getFilteredQuery.php', requestData)
            .then(function (response) {

                handleScopesService.getScopeOf(0).clauses = response.data;
                handleScopesService.getScopeOf(0).loadingfilter = false;

            })




    }

    $scope.setFilterStandardValues = function () {


        $scope.schoolheader = "Hochschulen";
        $scope.teacherheader = "Lehrkraft";
        $scope.courseheader = "Studiengang";
        $scope.subjectheader = "Modul";
        $scope.degreeheader = "Grad";
        $scope.semesterheader = "Semester";
        $scope.yearheader = "Jahr";


        self.searchTextSchool = "";
        self.searchTextTeacher = "";
        self.searchTextCourse = "";
        self.searchTextSubject = "";
        self.searchTextDegree = "";
        self.searchTextSemester = "";
        self.searchTextYear = "";


    }



    $scope.loadingFilters = 0;
    $scope.filterDisabled = false;


    $scope.getCountRowsForItems = function (scopevar, rowname, scopeRowcountname) {
        for(var i = 0; i < scopevar.length; i++){
            scopevar[i].rowname = rowname;

            countRows.getRowsCount(scopevar[i], function(response, item){
                item[scopeRowcountname] = "(" + response.data[0].count + ")";


            })
        }
    }

    $scope.getUpdatedCountRowsForItems = function (scopevar, IDRow, scopeRowcountname, item) {
        for(var i = 0; i < scopevar.length; i++){

            var query = "clauses." + IDRow + " = " + scopevar[i][IDRow];

            if(item != undefined || (item === undefined && $scope.filterQuery != "")){
                updateRowCount.getNewRowCount(" AND " +  query, scopevar[i], function(response, itemscope){

                    itemscope[scopeRowcountname] = "(" + response.data[0].count + ")"
                }  )
            }else if(item === undefined && $scope.filterQuery == ""){

                updateRowCount.getNewRowCount(" WHERE " + query, scopevar[i], function(response, itemscope){

                    itemscope[scopeRowcountname] = "(" + response.data[0].count + ")"

                }  )
            }




        }
    }


$scope.initFilterValues = function(mode, item, source){

if(mode == 1){


    loadfilteroptions.loadAvailableOptions("schools" ,function(response){
        $scope.school = response.data;
        $scope.availableSchools = response.data;
        $scope.getCountRowsForItems($scope.school, "schoolID", "schoolCount");


    });

    loadfilteroptions.loadAvailableOptions("teachers" ,function(response){
        $scope.teacher = response.data;
        $scope.availableTeachers = response.data;
        $scope.getCountRowsForItems($scope.teacher, "teacherID", "teacherCount");

    });

    loadfilteroptions.loadAvailableOptions("courses" ,function(response){
        $scope.course = response.data;
        $scope.availableCourses = response.data;
        $scope.getCountRowsForItems($scope.course, "courseID", "courseCount");
    });

    loadfilteroptions.loadAvailableOptions("subjects" ,function(response){
        $scope.subject = response.data;
        $scope.availableSubjects = response.data;
        $scope.getCountRowsForItems( $scope.subject, "subjectID", "subjectCount");
    });

    loadfilteroptions.loadAvailableOptions("degrees" ,function(response){
        $scope.degree = response.data;
        $scope.availableDegrees = response.data;
        $scope.getCountRowsForItems( $scope.degree, "degreeID", "degreeCount");
    });

    loadfilteroptions.loadAvailableOptions("semesters" ,function(response){
        $scope.semester = response.data;
        $scope.availableSemesters = response.data;
        $scope.getCountRowsForItems( $scope.semester, "semesterID", "semesterCount");
    });

    loadfilteroptions.loadAvailableOptions("years" ,function(response){
        $scope.year = response.data;
        $scope.availableYears = response.data;
        $scope.getCountRowsForItems( $scope.year, "yearID", "yearCount");
    });


}else if(mode == 2){



    $scope.getUpdatedCountRowsForItems($scope.school, "schoolID", "schoolCount", item);
    $scope.getUpdatedCountRowsForItems($scope.teacher, "teacherID", "teacherCount", item);
    $scope.getUpdatedCountRowsForItems($scope.course, "courseID", "courseCount", item);
    $scope.getUpdatedCountRowsForItems($scope.subject, "subjectID", "subjectCount", item);
    $scope.getUpdatedCountRowsForItems($scope.degree, "degreeID", "degreeCount", item);
    $scope.getUpdatedCountRowsForItems($scope.semester, "semesterID", "semesterCount", item);
    $scope.getUpdatedCountRowsForItems( $scope.year, "yearID", "yearCount", item);


}

}

    $scope.initFilterValues(1, null, null);



    function querySearch (query, source) {
        var results = query ? $scope[source].filter( createFilterFor(query, source) ) : $scope[source],deferred;
        return results;

    }

    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item, source) {

        $scope.setFilterelementToDecision(item, source);
        $scope.initFilterValues(2, item, source);
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query, source) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {

            var itemNamelowerCase = angular.lowercase(item[source  + "Name"]);
            return (itemNamelowerCase.indexOf(lowercaseQuery) === 0);
        };

    }





}

app.service('loadfilteroptions', function($http){


    var loadAvailableOptions = function (database, callback) {

        var requestData = {'database': database};


        $http.post('../php/getAvailableOptions.php', requestData)
            .then(function (response) {

                return callback(response);

            })

    };



    return{
        loadAvailableOptions:loadAvailableOptions
    }

})


app.service('countRows', function ($http) {


    var getRowsCount = function(item, callback){


        var requestData = JSON.stringify(item);

        $http.post('../php/countRows.php', requestData, ["Content-Type", "application/json;charset=UTF-8"])
            .then(function (response) {
                return callback(response, item);
            })
    }

    return{
        getRowsCount:getRowsCount
    }


})

app.service('updateRowCount', function ($http, handleScopesService) {




    var getNewRowCount = function (addedQuery, item, callback) {
        var requestData = JSON.stringify(handleScopesService.getScopeOf(1).filterQuery + addedQuery);

        $http.post('../php/updateCountRow.php', requestData, ["Content-Type", "application/json;charset=UTF-8"])
            .then(function (response) {
                return callback(response, item);
            })
    }


    return{
        getNewRowCount:getNewRowCount
    }
})



