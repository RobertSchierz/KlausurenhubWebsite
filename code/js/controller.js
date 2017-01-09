/**
 * Created by Rober on 16.12.2016.
 */


var app = angular.module('app', ['ngAnimate']);

/*
angular.module('app').config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
});

*/

var initTimer = 0;
var filter = {};

var filterActive = true;
var searchActive = false;

function resetFilter() {
    filter = { };
}

resetFilter();


var contentAppController = app.controller('contentcontroller', function ($scope, $rootScope, $http, sharedScopeofContentData, sharedScopeofFilterData) {

    sharedScopeofContentData.addList($scope);



    $scope.initContent = function () {


        if (initTimer == 0) {
            $http.post('../php/getClauses.php').then(function (response) {


                $rootScope.clauses = response.data;


            });
            initTimer += 1;
        }


    };

    $scope.getPdfUrl = function(){

        var contentscope = sharedScopeofFilterData.getList();

        return "http://www.klausurenhub.bplaced.net/" + contentscope.Path;

    }


})


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
        filter[source + "ID"] = selectedItem[source + "ID"]


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

        console.log(filter);

        for (var key in filter) {
            if (filter.hasOwnProperty(key) && filter[key] != null) {
                filterQuery += ("clauses." + key + " = " + "'" + filter[key] + "' AND ");

            }
        }



        filterQuery = filterQuery.slice(0, -4);

        console.log(filterQuery);

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

var mainButtonController = app.controller('mainbuttoncontroller', function($scope, sharedScopeofFilterData, sharedScopeofSearchData ){

    $scope.initMainButtons = function(){
        $scope.handlefilteractivation = "deactivatedbutton";
        $scope.filterdisablehandler = filterActive;
        $scope.searchdisablehandler = searchActive;
    }



    $scope.handleClickedMainButtons = function(event){

        var filterscope = sharedScopeofFilterData.getsearchScope();
        var searchscope = sharedScopeofSearchData.getsearchScope();


        if(filterActive && !searchActive){
            $scope.handlefilteractivation = "";
            $scope.handlesearchactivation = "deactivatedbutton";


            filterscope.handlesearchactivation = "deactivatedbutton";

            filterActive = false;
            searchActive = true;

            searchscope.handleSearchbar(false);
            filterscope.resetFilter();

        }else if(!filterActive && searchActive){
            $scope.handlesearchactivation = "";
            $scope.handlefilteractivation = "deactivatedbutton";

            filterscope.handlesearchactivation = "";

            searchActive = false;
            filterActive = true;

            searchscope.handleSearchbar(true);


        }

        $scope.filterdisablehandler = filterActive;
        $scope.searchdisablehandler = searchActive;

        filterscope.searchdisablehandler = searchActive;


    }

})

app.service('sharedScopeofSearchData', function () {
    var sharesearchscope = {};


    var addsearchscope = function (newObj) {
        sharesearchscope = newObj;
    }

    var getsearchscope = function () {
        return sharesearchscope;
    }

    return {
        addsearchScope: addsearchscope,
        getsearchScope: getsearchscope
    };
});

app.service('sharedScopeofContentData', function () {
    var myList = {};

    var addList = function (newObj) {
        myList = newObj;
    }

    var getList = function () {
        return myList;
    }

    return {
        addList: addList,
        getList: getList
    };
});

app.service('sharedScopeofFilterData', function () {
    var shareclause = {};
    var sharescope = {};

    var addclause = function (newObj) {
        shareclause = newObj;
    }

    var getclause = function () {
        return shareclause;
    }

    var addscope = function (newObj) {
        sharescope = newObj;
    }

    var getscope = function () {
        return sharescope;
    }

    return {
        addList: addclause,
        getList: getclause,
        addsearchScope: addscope,
        getsearchScope: getscope
    };
});


app.directive('filterelements', function () {
    return {
        templateUrl: "../loadedhtml/mainpage/filter.html",
        restrict: 'A'
    };
});

app.directive('documentsearchbar', function(){


    return{
        restrict: 'A',
        templateUrl: "../loadedhtml/mainpage/search.html"
    }
});

var searchController = app.controller('searchcontroller', function($scope, $http, $rootScope, sharedScopeofSearchData, sharedScopeofContentData){


    $scope.hidesearchbar = true;

    $scope.handleSearchbar = function(state){
        $scope.hidesearchbar = state;

        //Reset der Suche wenn Filterbutton betätigt wird

            $scope.searchvalue = "";
            $scope.searchboxChanged();


    }

    $scope.searchboxChanged = function(){

        var requestData = {'searchvalue': $scope.searchvalue};


        //var contentscope = sharedScopeofContentData.getList();

        $http.post('../php/getSearchResult.php', requestData)
            .then(function (response) {
                console.log(response.data);
                $rootScope.clauses = response.data;


            })



    }

    sharedScopeofSearchData.addsearchScope($scope);
});

var loginController = app.controller('logincontroller', function($scope, sharedScopeofContentData){

    $scope.changeViewToUpload = function(){

        var contentscope = sharedScopeofContentData.getList();
        contentscope.url = "../loadedhtml/content/uploadDisplay.html";

    }

});


app.directive('displaycontentoverview', function (sharedScopeofContentData, sharedScopeofFilterData) {

    function handleContent($scope, elem, attrs) {

        $scope.url = "../loadedhtml/content/clauseOverviewDisplay.html";


        $scope.back = function () {

            $scope.url = "../loadedhtml/content/clauseOverviewDisplay.html";

        }

        $scope.changeToContentView = function (clause) {
            sharedScopeofFilterData.addList(clause);
            $scope.clickedClause = clause;
            $scope.url = "../loadedhtml/content/clauseContentDisplay.html";

        }
    }

    return {
        template: '<div ng-include="url"></div>',
        link: handleContent,
        restrict: 'A'

    };
});













