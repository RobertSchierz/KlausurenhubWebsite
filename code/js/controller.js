/**
 * Created by Rober on 16.12.2016.
 */


var app = angular.module('app', ['ngAnimate']);

angular.module('app').config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
});


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

    $scope.getPdfUrl = function () {

        var contentscope = sharedScopeofFilterData.getList();

        return "http://klausurenhub.bplaced.net/" + contentscope.Path;

    }

    $scope.setThumbnail = function (clauseID, clausePath) {
        PDFJS.disableWorker = true;
        console.log("http://www.klausurenhub.bplaced.net/" + clausePath + "");
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

var mainButtonController = app.controller('mainbuttoncontroller', function ($scope, sharedScopeofFilterData, sharedScopeofSearchData) {

    $scope.initMainButtons = function () {
        $scope.handlefilteractivation = "deactivatedbutton";
        $scope.filterdisablehandler = filterActive;
        $scope.searchdisablehandler = searchActive;
    }


    $scope.handleClickedMainButtons = function (event) {

        var filterscope = sharedScopeofFilterData.getsearchScope();
        var searchscope = sharedScopeofSearchData.getsearchScope();


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

app.directive('documentsearchbar', function () {


    return{
        restrict: 'A',
        templateUrl: "../loadedhtml/mainpage/search.html"
    }
});

var searchController = app.controller('searchcontroller', function ($scope, $http, $rootScope, sharedScopeofSearchData, sharedScopeofContentData) {


    $scope.hidesearchbar = true;

    $scope.handleSearchbar = function (state) {
        $scope.hidesearchbar = state;

        //Reset der Suche wenn Filterbutton betätigt wird

        $scope.searchvalue = "";
        $scope.searchboxChanged();


    }

    $scope.searchboxChanged = function () {

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

var loginController = app.controller('logincontroller', function ($scope, sharedScopeofContentData) {

    $scope.changeViewToUpload = function () {

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



app.directive("dropzone", function () {

    function uploadHandler(scope, elem) {


        var cachedFiles = [];

        scope.disableupload = true;


        scope.dropzonetext = "Datei(en) hier ablegen";

        elem.bind('dragover', function (e) {
            e.stopPropagation();
            e.preventDefault();
            scope.$apply(function () {
                //scope.divClass = 'on-drag-enter';

                scope.dropzonestyleparam = "dropzoneover";
                if (e.originalEvent.dataTransfer.files.length > 1) {
                    scope.dropzonetext = "Dateien loslassen";
                } else {
                    scope.dropzonetext = "Datei loslassen";
                }

            });
        });
        elem.bind('dragenter', function (e) {


            e.stopPropagation();
            e.preventDefault();

        });
        elem.bind('dragleave', function (e) {

            e.stopPropagation();
            e.preventDefault();
            scope.$apply(function () {
                //scope.divClass = '';
                scope.dropzonetext = "Datei(en) hier ablegen";

            });
        });
        elem.bind('drop', function (evt) {

            evt.stopPropagation();
            evt.preventDefault();

            scope.disableupload = true;


            var files = evt.originalEvent.dataTransfer.files
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();
                reader.readAsArrayBuffer(f);

                reader.onload = (function (theFile) {
                    return function (e) {

                        cacheFiles(theFile, evt);

                        if (cachedFiles.length == files.length) {
                            storeFilesinDroppedZone(cachedFiles);
                        }


                        /*  if(i == files.length){
                         upload(evt);
                         }*/

                    };

                })(f);
                setTextUploader(evt);
            }


        });

        function checkIfIsPdf(filename) {
            var ext = getExtension(filename);
            switch (ext.toLowerCase()) {
                case 'pdf':
                    return true;
            }
            return false;
        }


        function getExtension(filename) {
            var parts = filename.split('.');
            return parts[parts.length - 1];
        }

       scope.deleteattachedfile = function(uploadedfile){


            for(var i = 0; i < cachedFiles.length; i++ ){
                if(cachedFiles[i].$$hashKey == uploadedfile.$$hashKey){

                 cachedFiles.splice(i, 1);


                }
            }

           if(cachedFiles.length == 0){
               scope.disableupload = true;
           }

       }

        var setTextUploader = function (evt) {
            if (evt.originalEvent.dataTransfer.files.length > 1) {
                scope.dropzonetext = "Dateien hinzugefügt";
            } else {
                scope.dropzonetext = "Datei hinzugefügt";
            }
            window.setTimeout(function () {
                scope.$apply(function () {
                    scope.dropzonetext = "Datei(en) hier ablegen";
                    scope.dropzonestyleparam = "dropzonedefault";
                });
            }, 2000);
        };

        function storeFilesinDroppedZone(cachedFiles) {

            scope.$apply(function () {
                scope.uploadedfiles = cachedFiles;

            })



        }

        function cacheFiles(file, evt) {
            if(!checkIfIsPdf(file.name)){
                handleDropzoneText(file.name + " ist keine .pdf!", "dropzoneerror" );
            }else{
                cachedFiles.push(file);
            }


        }

        function upload(evt) {

            var fData = new FormData();
            for (var i in cachedFiles) {
                fData.append('uploadedfile', cachedFiles[i]);
            }
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    try {
                        var resp = JSON.parse(xhr.response);
                    } catch (e) {
                        var resp = {
                            status: 'error',
                            data: 'Unknown error occurred: [' + xhr.responseText + ']'
                        };
                    }
                    showError(resp, evt);
                }
            };

            //xhr.upload.addEventListener("progress", uploadProgress, false)
            // xhr.addEventListener("load", uploadComplete, false)
            // xhr.addEventListener("error", uploadFailed, false)
            // xhr.addEventListener("abort", uploadCanceled, false)
            xhr.open("POST", "../php/uploadFile.php");

            xhr.send(fData);

        }

        var handleDropzoneText = function(text, statusclass){


            scope.$apply(function () {
                scope.dropzonetext = text;
                scope.dropzonestyleparam = statusclass;

            });


            window.setTimeout(function () {
                scope.$apply(function () {
                    scope.dropzonetext = "Datei(en) hier ablegen";
                    scope.dropzonestyleparam = "dropzonedefault";
                });

            }, 3000);
        }


        var showError = function (resp, evt) {

            var pluralhelper = "";
            var success = false;

            if (evt.originalEvent.dataTransfer.files.length > 1) {
                var pluralhelper = "en";
            } else {
                var pluralhelper = "";
            }

            var statustext = "";
            switch (resp.data) {
                case '1':
                    statustext = "Fehler während des Uploads!";
                    break;
                case '2':
                    statustext = "Bitte ausschließlich .pdf Dateien hochladen!";
                    break;
                case '3':
                    statustext = "Maximalgröße von 50MB überschritten!";
                    break;
                case '4':
                    statustext = "Datei existierts serverseitig bereits!";
                    break;
                case '5':
                    statustext = "Datei" + pluralhelper + " erfolgreich hochgeladen";
                    success = true;
                    break;
                default:
                    statustext = "Unbekannter Fehler";
                    break;

            }

            scope.$apply(function () {

                var statusclasstemp;

                if (success) {
                    statusclasstemp = "dropzonesuccess";
                } else {
                    statusclasstemp = "dropzoneerror";
                }

                handleDropzoneText(statustext, statusclasstemp );

            });




        }




    }


    return {
        restrict: "A",
        link: uploadHandler,
        templateUrl: "../loadedhtml/content/uploadDropzone.html"
    }
})

app.directive("uploadeditor", function(sharedScopeofFilterData){


    function editorinit(scope){

        scope.decisionsForFiles = [];

        scope.filterscope = sharedScopeofFilterData.getsearchScope();

        console.log(scope.filterscope);


        resetDecisionHeader();


        scope.showeditor = false;


        scope.setFilterelementToDecision = function (selectedItem, header, source) {
            scope[header] = selectedItem[source + "Name"];
           // filter[source + "ID"] = selectedItem[source + "ID"];

            for(var i = 0; i < scope.decisionsForFiles.length; i++){
                if(scope.editfile.$$hashKey == scope.decisionsForFiles[i].id){
                    scope.decisionsForFiles[i][source] = selectedItem[source + "Name"];

                    if( scope.decisionsForFiles[i].school != "" && scope.decisionsForFiles[i].teacher != ""
                        && scope.decisionsForFiles[i].subject != "" && scope.decisionsForFiles[i].course != "" && scope.decisionsForFiles[i].degree != "" &&
                        scope.decisionsForFiles[i].semester != "" && scope.decisionsForFiles[i].year != ""){
                        scope.showalldecisionschecked = scope.editfile.$$hashKey;
                        console.log("Alles ausgefüllt");

                        angular.element(document.getElementById("allchecked_" + scope.editfile.$$hashKey)).removeClass("notalldecisionsfilled");
                        angular.element(document.getElementById("allchecked_" + scope.editfile.$$hashKey)).addClass("alldecisionsfilled");

                        scope.decisionsForFiles[i].allfilled = true;

                        scope.checkIfAllFilled();

                    }
                }
            }
        };

        scope.checkIfAllFilled = function(){
            var updatebuttonenable = false;

            for(var i = 0; i < scope.decisionsForFiles.length; i++){
                if(!scope.decisionsForFiles[i].allfilled){
                    updatebuttonenable = true;
                }
            }

            console.log(updatebuttonenable);
            scope.disableupload = updatebuttonenable;


        };

        function resetDecisionHeader(){
            scope.editorschoolHeader = scope.filterscope.schoolheader;
            scope.availableSchools = scope.filterscope.availableSchools;

            scope.editorteacherHeader = scope.filterscope.teacherheader;
            scope.availableTeachers = scope.filterscope.availableTeachers;

            scope.editorcourseHeader = scope.filterscope.courseheader;
            scope.availableCourses = scope.filterscope.availableCourses;

            scope.editorsubjectHeader = scope.filterscope.subjectheader;
            scope.availableSubjects = scope.filterscope.availableSubjects;

            scope.editordegreeHeader = scope.filterscope.degreeheader;
            scope.availableDegrees = scope.filterscope.availableDegrees;

            scope.editorsemesterHeader = scope.filterscope.semesterheader;
            scope.availableSemesters = scope.filterscope.availableSemesters;

            scope.editoryearHeader = scope.filterscope.yearheader;
            scope.availableYears = scope.filterscope.availableYears;
        };

        function setDecisionsToEditfile(){
            for(var i = 0; i < scope.decisionsForFiles.length; i++){
                if(scope.editfile.$$hashKey == scope.decisionsForFiles[i].id){
                    console.log(scope.decisionsForFiles[i]);

                    if(scope.decisionsForFiles[i].school != ""){
                        scope.editorschoolHeader = scope.decisionsForFiles[i].school;

                    }
                    if(scope.decisionsForFiles[i].teacher != ""){
                        scope.editorteacherHeader = scope.decisionsForFiles[i].teacher;

                    }
                    if(scope.decisionsForFiles[i].subject != ""){
                        scope.editorsubjectHeader = scope.decisionsForFiles[i].subject;

                    }
                    if(scope.decisionsForFiles[i].course != ""){
                        scope.editorcourseHeader = scope.decisionsForFiles[i].course;

                    }
                    if(scope.decisionsForFiles[i].degree != ""){
                        scope.editordegreeHeader = scope.decisionsForFiles[i].degree;

                    }
                    if(scope.decisionsForFiles[i].semester != ""){
                        scope.editorsemesterHeader = scope.decisionsForFiles[i].semester;

                    }
                    if(scope.decisionsForFiles[i].year != ""){
                        scope.editoryearHeader = scope.decisionsForFiles[i].year;

                    }

                }
            }



        }


        scope.editorshow = function(editfile){

            resetDecisionHeader();

            scope.showeditor = true;
            scope.selectedclassoffile = editfile.$$hashKey;
            scope.editfile = editfile;

            scope.handleDecisionsForFiles();
            setDecisionsToEditfile();
        };

        scope.handleDecisionsForFiles = function(){

            var isIn;

                for(var j = 0; j < scope.uploadedfiles.length; j++){
                    for(var k = 0; k < scope.decisionsForFiles.length; k++){
                        if(scope.decisionsForFiles[k].id == scope.uploadedfiles[j].$$hashKey){
                            isIn = true;
                        }
                    }

                    if(!isIn || scope.decisionsForFiles.length == 0){
                        // if(scope.decisionsForFiles.indexOf(scope.uploadedfiles[j].$$hashKey) ==  -1){

                        scope.decisionsForFiles.push({
                            id: scope.uploadedfiles[j].$$hashKey,
                            name: scope.uploadedfiles[j].name,
                            school: "",
                            course: "",
                            semester: "",
                            degree: "",
                            subject: "",
                            teacher: "",
                            year: "",
                            allfilled: false
                        });
                        // }
                    }

                    isIn = false;
            }
        }

        scope.uploadfiles = function(){

            console.log("Upload gedrückt!");

            var isIn;
            for(var i = 0; i < scope.decisionsForFiles.length; i++){
                for(var j = 0; j < scope.uploadedfiles.length; j++){
                    if(scope.decisionsForFiles[i].id == scope.uploadedfiles[j].$$hashKey){
                        isIn = true;
                    }
                }
                if(!isIn){
                    scope.decisionsForFiles.splice(i, 1);


                }


            isIn = false;
            }

        }



    }




    return{
        restrict: "A",
        templateUrl: "../loadedhtml/content/uploadEditor.html",
        link: editorinit
    }
})






