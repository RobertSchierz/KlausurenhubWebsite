/**
 * Created by Rober on 07.02.2017.
 */
var mainButtonController = app.controller('mainbuttoncontroller', function ($scope, handleScopesService) {

    $scope.initMainButtons = function () {
        $scope.handlefilteractivation = "deactivatedbutton";
        $scope.filterdisablehandler = filterActive;
        $scope.searchdisablehandler = searchActive;
    }


    $scope.handleClickedMainButtons = function (event) {

        var filterscope = handleScopesService.getScopeOf(1);
        var searchscope = handleScopesService.getScopeOf(2);


        if (filterActive && !searchActive) {
            $scope.handlefilteractivation = "";
            $scope.handlesearchactivation = "deactivatedbutton";


            filterscope.handlesearchactivation = "deactivatedbutton";

            filterActive = false;
            searchActive = true;

            searchscope.handleSearchbar(false);
            filterscope.resetFilter();

        } else if (!filterActive && searchActive) {
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