/**
 * Created by Rober on 07.02.2017.
 */
var loginController = app.controller('logincontroller', function ($scope, sharedScopeofContentData) {

    $scope.changeViewToUpload = function () {

        var contentscope = sharedScopeofContentData.getList();
        contentscope.url = "../loadedhtml/content/uploadDisplay.html";

    }


});