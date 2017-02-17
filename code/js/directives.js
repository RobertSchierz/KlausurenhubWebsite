/**
 * Created by Rober on 16.12.2016.
 */


var app = angular.module('app', ['ngAnimate', 'ngSanitize', 'facebook']);

angular.module('app').config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
});

angular.module('app').config(function (FacebookProvider) {
    FacebookProvider.init('1710610359248953');
});


var filter = {};
var initTimer = 0;

var filterActive = true;
var searchActive = false;

function resetFilter() {
    filter = { };
}

resetFilter();


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


app.directive('displaycontentoverview', function (handleScopesService) {

    function handleContent($scope, elem, attrs) {

        $scope.url = "../loadedhtml/content/clauseOverviewDisplay.html";


        $scope.back = function () {
            handleScopesService.getScopeOf(1).updateContent();
            $scope.url = "../loadedhtml/content/clauseOverviewDisplay.html";


        }

        $scope.changeToContentView = function (clause) {
           /* sharedScopeofFilterData.addList(clause);
            handleScopesService.getScopeOf(1).clauses */
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


    function uploadHandler($scope, elem) {


        var cachedFiles = [];
        $scope.statustext = "";
        $scope.success = true;


        $scope.disableupload = true;


        $scope.dropzonetext = "Datei(en) hier ablegen";

        elem.bind('dragover', function (e) {
            e.stopPropagation();
            e.preventDefault();
            $scope.$apply(function () {
                //scope.divClass = 'on-drag-enter';

                $scope.dropzonestyleparam = "dropzoneover";
                if (e.originalEvent.dataTransfer.files.length > 1) {
                    $scope.dropzonetext = "Dateien loslassen";
                } else {
                    $scope.dropzonetext = "Datei loslassen";
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
            $scope.$apply(function () {
                //scope.divClass = '';
                $scope.dropzonetext = "Datei(en) hier ablegen";

            });
        });
        elem.bind('drop', function (evt) {

            evt.stopPropagation();
            evt.preventDefault();


            $scope.disableupload = true;


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

        $scope.deleteattachedfile = function (uploadedfile) {


            for (var i = 0; i < cachedFiles.length; i++) {
                if (cachedFiles[i].$$hashKey == uploadedfile.$$hashKey) {

                    cachedFiles.splice(i, 1);
                }

                if ($scope.decisionsForFiles[i] != undefined && $scope.decisionsForFiles[i].id == uploadedfile.$$hashKey) {
                    $scope.decisionsForFiles.splice(i, 1);
                }

            }

            if (uploadedfile == $scope.editfile) {
                $scope.showeditor = false;
            }

            $scope.checkIfAllFilled();

            if (cachedFiles.length == 0) {

                $scope.disableupload = true;
                $scope.showeditor = false;
            }


        }

        var setTextUploader = function (evt) {
            if (evt.originalEvent.dataTransfer.files.length > 1) {
                $scope.dropzonetext = "Dateien hinzugefügt";
            } else {
                $scope.dropzonetext = "Datei hinzugefügt";
            }
            window.setTimeout(function () {
                $scope.$apply(function () {
                    $scope.dropzonetext = "Datei(en) hier ablegen";
                    $scope.dropzonestyleparam = "dropzonedefault";
                });
            }, 2000);
        };

        function storeFilesinDroppedZone(cachedFiles) {

            $scope.$apply(function () {
                $scope.uploadedfiles = cachedFiles;


            })


        }

        function cacheFiles(file, evt) {
            if (!checkIfIsPdf(file.name)) {

                $scope.success = false;
                $scope.statustext = "<b> " + file.name + " </b> ist keine .pdf!";
                $scope.handleDropzoneText(true);
                $scope.success = true;
            } else {
                cachedFiles.push(file);
            }


        }

        $scope.upload = function () {


            var fData = new FormData();
            for (var i in cachedFiles) {
                fData.append('uploadedfile', cachedFiles[i]);


                var xhr = new XMLHttpRequest();


                xhr.open("POST", "../php/uploadFile.php", false);
                xhr.onreadystatechange = onreadyforrequest;
                xhr.setRequestHeader('Cache-Control', 'no-cache');
                xhr.send(fData);


                function onreadyforrequest() {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200 || xhr.status == 304) {
                            $scope.showError(JSON.parse(xhr.response));


                            if (JSON.parse(xhr.response).data == '5') {
                                $scope.writeToDatabase(cachedFiles[i].$$hashKey);


                            }


                            $scope.handleDropzoneText(false);


                        }
                    }
                }


            }

        }


        $scope.showError = function (resp) {
            switch (resp.data) {
                case '1':
                    $scope.statustext += "<b>" + resp.status['name'] + " </b> Fehler " + "<br />";
                    $scope.success = false;
                    break;
                case '2':
                    $scope.statustext += "<b>" + resp.status['name'] + " </b> keine PDF " + "<br />";
                    $scope.success = false;
                    break;
                case '3':
                    $scope.statustext += "<b>" + resp.status['name'] + " </b>  Maximalgröße 50MB " + "<br />";
                    $scope.success = false;
                    break;
                case '4':
                    $scope.statustext += "<b>" + resp.status['name'] + " </b> existiert serverseitig" + "<br />";
                    $scope.success = false;
                    break;
                case '5':
                    $scope.statustext += "<b>" + resp.status['name'] + " </b>  erfolgreich hochgeladen" + "" + "<br />";
                    break;
                default:
                    $scope.statustext += "Unbekannter Fehler bei Datei: <b>" + resp.status['name'] + " </b>" + "<br />";
                    $scope.success = false;
                    break;

            }
            console.log($scope.statustext);


        }

        $scope.handleDropzoneText = function (jpgCheck) {


            var statusclass;

            if ($scope.success) {
                statusclass = "dropzonesuccess";
            } else if (!$scope.success) {
                statusclass = "dropzoneerror";
            }


            if (jpgCheck) {
                $scope.$apply(function () {
                    $scope.dropzonetext = $scope.statustext;
                    $scope.dropzonestyleparam = statusclass;

                });
            } else {
                $scope.dropzonetext = $scope.statustext;
                $scope.dropzonestyleparam = statusclass;

                //$scope.$root.changeLoading(false);


            }


            window.setTimeout(function () {
                $scope.$apply(function () {
                    $scope.dropzonetext = "Datei(en) hier ablegen";
                    $scope.dropzonestyleparam = "dropzonedefault";
                    $scope.statustext = "";
                });

            }, 3000);
        }


    }


    return {
        restrict: "A",
        link: uploadHandler,
        templateUrl: "../loadedhtml/content/uploadDropzone.html"
    }
})

app.directive("uploadeditor", function ($http, $rootScope, handleScopesService) {


    function editorinit($scope) {

        $scope.decisionsForFiles = [];

        $scope.filterscope = handleScopesService.getScopeOf(1);


        resetDecisionHeader();


        $scope.showeditor = false;


        $scope.setFilterelementToDecision = function (selectedItem, header, source) {
            $scope[header] = selectedItem[source + "Name"];


            for (var i = 0; i < $scope.decisionsForFiles.length; i++) {
                if ($scope.editfile.$$hashKey == $scope.decisionsForFiles[i].id) {
                    $scope.decisionsForFiles[i][source] = selectedItem[source + "ID"];

                    if ($scope.decisionsForFiles[i].school != "" && $scope.decisionsForFiles[i].teacher != ""
                        && $scope.decisionsForFiles[i].subject != "" && $scope.decisionsForFiles[i].course != "" && $scope.decisionsForFiles[i].degree != "" &&
                        $scope.decisionsForFiles[i].semester != "" && $scope.decisionsForFiles[i].year != "") {
                        $scope.showalldecisionschecked = $scope.editfile.$$hashKey;


                        angular.element(document.getElementById("allchecked_" + $scope.editfile.$$hashKey)).removeClass("notalldecisionsfilled");
                        angular.element(document.getElementById("allchecked_" + $scope.editfile.$$hashKey)).addClass("alldecisionsfilled");

                        $scope.decisionsForFiles[i].allfilled = true;

                        $scope.checkIfAllFilled();

                    }
                }


            }


        };

        $scope.checkIfAllFilled = function () {
            var updatebuttonenable = false;

            console.log($scope.decisionsForFiles);

            for (var i = 0; i < $scope.decisionsForFiles.length; i++) {
                if (!$scope.decisionsForFiles[i].allfilled) {
                    updatebuttonenable = true;
                }
            }


            $scope.disableupload = updatebuttonenable;


        };

        function resetDecisionHeader() {
            $scope.editorschoolHeader = "Hochschulen";
            $scope.availableSchools = $scope.filterscope.availableSchools;

            $scope.editorteacherHeader = "Lehrkraft";
            $scope.availableTeachers = $scope.filterscope.availableTeachers;

            $scope.editorcourseHeader = "Studiengang";
            $scope.availableCourses = $scope.filterscope.availableCourses;

            $scope.editorsubjectHeader = "Modul";
            $scope.availableSubjects = $scope.filterscope.availableSubjects;

            $scope.editordegreeHeader = "Grad";
            $scope.availableDegrees = $scope.filterscope.availableDegrees;

            $scope.editorsemesterHeader = "Semester";
            $scope.availableSemesters = $scope.filterscope.availableSemesters;

            $scope.editoryearHeader = "Jahr";
            $scope.availableYears = $scope.filterscope.availableYears;
        };

        function setDecisionsToEditfile() {
            for (var i = 0; i < $scope.decisionsForFiles.length; i++) {
                if ($scope.editfile.$$hashKey == $scope.decisionsForFiles[i].id) {
                    console.log($scope.decisionsForFiles[i]);

                    if ($scope.decisionsForFiles[i].school != "") {
                        $scope.editorschoolHeader = getHeaderNameFromID($scope.availableSchools, $scope.decisionsForFiles[i].school, "school");

                    }
                    if ($scope.decisionsForFiles[i].teacher != "") {
                        $scope.editorteacherHeader = getHeaderNameFromID($scope.availableTeachers, $scope.decisionsForFiles[i].teacher, "teacher");

                    }
                    if ($scope.decisionsForFiles[i].subject != "") {
                        $scope.editorsubjectHeader = getHeaderNameFromID($scope.availableSubjects, $scope.decisionsForFiles[i].subject, "subject");

                    }
                    if ($scope.decisionsForFiles[i].course != "") {
                        $scope.editorcourseHeader = getHeaderNameFromID($scope.availableCourses, $scope.decisionsForFiles[i].course, "course");

                    }
                    if ($scope.decisionsForFiles[i].degree != "") {
                        $scope.editordegreeHeader = getHeaderNameFromID($scope.availableDegrees, $scope.decisionsForFiles[i].degree, "degree");

                    }
                    if ($scope.decisionsForFiles[i].semester != "") {
                        $scope.editorsemesterHeader = getHeaderNameFromID($scope.availableSemesters, $scope.decisionsForFiles[i].semester, "semester");
                        ;

                    }
                    if ($scope.decisionsForFiles[i].year != "") {
                        $scope.editoryearHeader = getHeaderNameFromID($scope.availableYears, $scope.decisionsForFiles[i].year, "year");

                    }

                }
            }

        }

        function getHeaderNameFromID(availableHeader, id, source) {
            for (var i = 0; i < availableHeader.length; i++) {

                if (availableHeader[i][source + "ID"] == id) {
                    return availableHeader[i][source + "Name"]
                }

            }

        }


        $scope.editorshow = function (editfile) {

            resetDecisionHeader();

            $scope.showeditor = true;
            $scope.selectedclassoffile = editfile.$$hashKey;
            $scope.editfile = editfile;

            $scope.handleDecisionsForFiles();
            setDecisionsToEditfile();
        };

        $scope.handleDecisionsForFiles = function () {


            var isIn;

            for (var j = 0; j < $scope.uploadedfiles.length; j++) {
                for (var k = 0; k < $scope.decisionsForFiles.length; k++) {
                    if ($scope.decisionsForFiles[k].id == $scope.uploadedfiles[j].$$hashKey) {
                        isIn = true;
                    }
                }


                if (!isIn || $scope.decisionsForFiles.length == 0) {
                    // if(scope.decisionsForFiles.indexOf(scope.uploadedfiles[j].$$hashKey) ==  -1){

                    $scope.decisionsForFiles.push({
                        id: $scope.uploadedfiles[j].$$hashKey,
                        name: $scope.uploadedfiles[j].name,
                        uploader: $rootScope.facebookname,
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

        $scope.uploadfiles = function () {


            var isIn;
            for (var i = 0; i < $scope.decisionsForFiles.length; i++) {
                for (var j = 0; j < $scope.uploadedfiles.length; j++) {
                    if ($scope.decisionsForFiles[i].id == $scope.uploadedfiles[j].$$hashKey) {
                        isIn = true;
                    }
                }
                if (!isIn) {
                    $scope.decisionsForFiles.splice(i, 1);


                }


                isIn = false;
            }

            $scope.upload();
            $scope.success = true;


        }

        $scope.sendmails = function (file) {

            console.log(file);
            var requestData = JSON.stringify(file);

            $http.post('../php/sendMails.php', requestData, ["Content-Type", "application/json;charset=UTF-8"])
                .then(function (response) {

                })
        }

        $scope.writeToDatabase = function (id) {


            for (var i = 0; i < $scope.decisionsForFiles.length; i++) {

                if ($scope.decisionsForFiles[i].id == id) {


                    $scope.sendmails($scope.decisionsForFiles[i]);

                    var requestData = {'uploadedfile': JSON.stringify($scope.decisionsForFiles[i])};


                    $http.post('../php/insertToDatabase.php', requestData, ["Content-Type", "application/json;charset=UTF-8"])
                        .then(function (response) {

                        })
                }


            }
        }


    }


    return{
        restrict: "A",
        templateUrl: "../loadedhtml/content/uploadEditor.html",
        link: editorinit
    }
})






