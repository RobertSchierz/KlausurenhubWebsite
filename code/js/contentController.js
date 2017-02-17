/**
 * Created by Rober on 07.02.2017.
 */
var contentAppController = app.controller('contentcontroller', function ($scope, $rootScope, $http, refreshClauses, handleScopesService) {





    handleScopesService.addScopeOf(0, $scope);

    $scope.initContent = function () {


        if (initTimer == 0) {
         refreshClauses.refreshcontent(function (response) {
             console.log("Content refresh");

         })
        }
        initTimer += 1;



    };

    $scope.getPdfUrl = function () {

        var contentscope = handleScopesService.getScopeOf(0);
        return "http://klausurenhub.bplaced.net/" + contentscope.clickedClause.Path;

    }

    $scope.setThumbnail = function (clauseID, clausePath) {
        PDFJS.disableWorker = true;
        PDFJS.getDocument("http://www.klausurenhub.bplaced.net/" + clausePath + "").then(function getPdfHelloWorld(pdf) {


            pdf.getPage(1).then(function getPageHelloWorld(page) {
                var scale = 0.2;
                var viewport = page.getViewport(scale);

                //
                // Prepare canvas using PDF page dimensions
                //
                var canvas = document.getElementById(clauseID);
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                //
                // Render PDF page into canvas context
                //
                page.render({canvasContext: context, viewport: viewport});
            });
        });

    }


})