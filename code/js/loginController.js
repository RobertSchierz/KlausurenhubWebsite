/**
 * Created by Rober on 07.02.2017.
 */
var loginController = app.controller('logincontroller', function ($scope, handleScopesService) {

    $scope.changeViewToUpload = function () {

        var contentscope = handleScopesService.getScopeOf(0);
        contentscope.url = "../loadedhtml/content/uploadDisplay.html";

    }


});