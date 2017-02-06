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

var filterActive = true;
var searchActive = false;

function resetFilter() {
    filter = { };
}

resetFilter();



var facebookcontroller = app.controller('authenticationCtrl', ['$scope','Facebook' ,'$rootScope', '$q', '$http', function($scope, Facebook, $rootScope, $q, $http) {


    $scope.userWriteToDatabase = function(){

        var requestData =  JSON.stringify({id: $rootScope.facebooid, email: $rootScope.facebookemail, name: $rootScope.facebookname});

        $http.post('../php/uploadUser.php', requestData,["Content-Type", "application/json;charset=UTF-8"])
            .then(function (response) {

            })
    }

    $scope.$watch(function() {
        return Facebook.isReady();
    }, function(newVal) {

        $scope.$on('Facebook:statusChange', function(ev, data) {



            if (data.status == 'connected') {

                $scope.$apply(function() {



                    getMyLastName().then(function(response) {
                        console.log(response);
                        $rootScope.facebookname = response.name;
                        $rootScope.facebooid = response.id;
                        $rootScope.facebookemail = response.email;
                        $("#login").show(500);
                        $("#facebooknamespan").show(500);

                        $scope.userWriteToDatabase();

                    });
                });

            } else {

                $scope.$apply(function() {
                    console.log(data);
                    $("#login").hide(500);
                    $("#facebooknamespan").hide(500, function () {
                        $rootScope.facebookname = "";
                        $rootScope.facebooid = "";
                        $rootScope.facebookemail = "";
                    });

                });

            }


        });

        function getMyLastName() {
            var deferred = $q.defer();
            FB.api('/me', {fields: 'name, email'}, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }

    });
}]);


var contentAppController = app.controller('contentcontroller', function ($scope, $rootScope, $http, sharedScopeofContentData, sharedScopeofFilterData) {





    sharedScopeofContentData.addList($scope);


    $scope.initContent = function () {



            $http.post('../php/getClauses.php').then(function (response) {


                $rootScope.clauses = response.data;
                console.log("Content refresh");

            });



    };

    $scope.getPdfUrl = function () {

        var contentscope = sharedScopeofFilterData.getList();

        return "http://klausurenhub.bplaced.net/" + contentscope.Path;

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


        filterQuery = filterQuery.slice(0, -4);



        var requestData = {'query': filterQuery };

        $http.post('../php/getFilteredQuery.php', requestData)
            .then(function (response) {

                $rootScope.clauses = response.data;


            })
    }

    $scope.resetFilter = function () {

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

       $scope.deleteattachedfile = function(uploadedfile){


            for(var i = 0; i < cachedFiles.length; i++ ){
                if(cachedFiles[i].$$hashKey == uploadedfile.$$hashKey){

                 cachedFiles.splice(i, 1);
                }

                if( $scope.decisionsForFiles[i] != undefined && $scope.decisionsForFiles[i].id == uploadedfile.$$hashKey ){
                    $scope.decisionsForFiles.splice(i,1);
                }

            }

           if(uploadedfile == $scope.editfile){
               $scope.showeditor = false;
           }

           $scope.checkIfAllFilled();

           if(cachedFiles.length == 0){

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
            if(!checkIfIsPdf(file.name)){

                $scope.success = false;
                $scope.statustext = "<b> " + file.name + " </b> ist keine .pdf!";
                $scope.handleDropzoneText(true);
                $scope.success = true;
            }else{
                cachedFiles.push(file);
            }


        }

        $scope.upload = function() {



            var fData = new FormData();
            for (var i in cachedFiles) {
                fData.append('uploadedfile', cachedFiles[i]);


                var xhr = new XMLHttpRequest();


                xhr.open("POST", "../php/uploadFile.php", false);
                xhr.onreadystatechange = onreadyforrequest;
                xhr.setRequestHeader('Cache-Control','no-cache');
                xhr.send(fData);




                function onreadyforrequest()
                {
                    if (xhr.readyState == 4 ) {
                        if (xhr.status == 200 || xhr.status == 304) {
                            $scope.showError(JSON.parse(xhr.response));



                            if(JSON.parse(xhr.response).data == '5'){
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
                    $scope.statustext += "<b>" +  resp.status['name'] + " </b> keine PDF "  + "<br />";
                    $scope.success = false;
                    break;
                case '3':
                    $scope.statustext += "<b>" +   resp.status['name']  + " </b>  Maximalgröße 50MB "  + "<br />";
                    $scope.success = false;
                    break;
                case '4':
                    $scope.statustext += "<b>" +  resp.status['name'] + " </b> existiert serverseitig" + "<br />";
                    $scope.success = false;
                    break;
                case '5':
                    $scope.statustext += "<b>" + resp.status['name']+ " </b>  erfolgreich hochgeladen" + ""  + "<br />";
                    break;
                default:
                    $scope.statustext += "Unbekannter Fehler bei Datei: <b>" +resp.status['name'] + " </b>"  + "<br />";
                    $scope.success = false;
                    break;

            }
                console.log($scope.statustext);


        }

        $scope.handleDropzoneText = function(jpgCheck){


            var statusclass;

            if ($scope.success) {
                statusclass = "dropzonesuccess";
            } else if(!$scope.success) {
                statusclass = "dropzoneerror";
            }


            if(jpgCheck){
                $scope.$apply(function () {
                    $scope.dropzonetext = $scope.statustext;
                    $scope.dropzonestyleparam = statusclass;

                });
            }else{
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

app.directive("uploadeditor", function(sharedScopeofFilterData, $http, $rootScope){


    function editorinit($scope){

        $scope.decisionsForFiles = [];

        $scope.filterscope = sharedScopeofFilterData.getsearchScope();



        resetDecisionHeader();


        $scope.showeditor = false;





        $scope.setFilterelementToDecision = function (selectedItem, header, source) {
            $scope[header] = selectedItem[source + "Name"];


            for(var i = 0; i < $scope.decisionsForFiles.length; i++){
                if($scope.editfile.$$hashKey == $scope.decisionsForFiles[i].id){
                    $scope.decisionsForFiles[i][source] = selectedItem[source + "ID"];

                    if( $scope.decisionsForFiles[i].school != "" && $scope.decisionsForFiles[i].teacher != ""
                        && $scope.decisionsForFiles[i].subject != "" && $scope.decisionsForFiles[i].course != "" && $scope.decisionsForFiles[i].degree != "" &&
                        $scope.decisionsForFiles[i].semester != "" && $scope.decisionsForFiles[i].year != ""){
                        $scope.showalldecisionschecked = $scope.editfile.$$hashKey;


                        angular.element(document.getElementById("allchecked_" + $scope.editfile.$$hashKey)).removeClass("notalldecisionsfilled");
                        angular.element(document.getElementById("allchecked_" + $scope.editfile.$$hashKey)).addClass("alldecisionsfilled");

                        $scope.decisionsForFiles[i].allfilled = true;

                        $scope.checkIfAllFilled();

                    }
                }


            }


        };

        $scope.checkIfAllFilled = function(){
            var updatebuttonenable = false;

            for(var i = 0; i < $scope.decisionsForFiles.length; i++){
                if(!$scope.decisionsForFiles[i].allfilled){
                    updatebuttonenable = true;
                }
            }


            $scope.disableupload = updatebuttonenable;


        };

        function resetDecisionHeader(){
            $scope.editorschoolHeader = $scope.filterscope.schoolheader;
            $scope.availableSchools = $scope.filterscope.availableSchools;

            $scope.editorteacherHeader = $scope.filterscope.teacherheader;
            $scope.availableTeachers = $scope.filterscope.availableTeachers;

            $scope.editorcourseHeader = $scope.filterscope.courseheader;
            $scope.availableCourses = $scope.filterscope.availableCourses;

            $scope.editorsubjectHeader = $scope.filterscope.subjectheader;
            $scope.availableSubjects = $scope.filterscope.availableSubjects;

            $scope.editordegreeHeader = $scope.filterscope.degreeheader;
            $scope.availableDegrees = $scope.filterscope.availableDegrees;

            $scope.editorsemesterHeader = $scope.filterscope.semesterheader;
            $scope.availableSemesters = $scope.filterscope.availableSemesters;

            $scope.editoryearHeader = $scope.filterscope.yearheader;
            $scope.availableYears = $scope.filterscope.availableYears;
        };

        function setDecisionsToEditfile(){
            for(var i = 0; i < $scope.decisionsForFiles.length; i++){
                if($scope.editfile.$$hashKey == $scope.decisionsForFiles[i].id){
                    console.log($scope.decisionsForFiles[i]);

                    if($scope.decisionsForFiles[i].school != ""){
                        $scope.editorschoolHeader = getHeaderNameFromID($scope.availableSchools, $scope.decisionsForFiles[i].school, "school" );

                    }
                    if($scope.decisionsForFiles[i].teacher != ""){
                        $scope.editorteacherHeader = getHeaderNameFromID($scope.availableTeachers, $scope.decisionsForFiles[i].teacher, "teacher" );

                    }
                    if($scope.decisionsForFiles[i].subject != ""){
                        $scope.editorsubjectHeader = getHeaderNameFromID($scope.availableSubjects, $scope.decisionsForFiles[i].subject, "subject" );

                    }
                    if($scope.decisionsForFiles[i].course != ""){
                        $scope.editorcourseHeader = getHeaderNameFromID($scope.availableCourses, $scope.decisionsForFiles[i].course, "course" );

                    }
                    if($scope.decisionsForFiles[i].degree != ""){
                        $scope.editordegreeHeader = getHeaderNameFromID($scope.availableDegrees, $scope.decisionsForFiles[i].degree, "degree" );

                    }
                    if($scope.decisionsForFiles[i].semester != ""){
                        $scope.editorsemesterHeader = getHeaderNameFromID($scope.availableSemesters, $scope.decisionsForFiles[i].semester, "semester" );
                        ;

                    }
                    if($scope.decisionsForFiles[i].year != ""){
                        $scope.editoryearHeader = getHeaderNameFromID($scope.availableYears, $scope.decisionsForFiles[i].year, "year" );

                    }

                }
            }

        }

        function getHeaderNameFromID(availableHeader, id, source){
            for(var i = 0 ; i <  availableHeader.length; i++){

                    if(availableHeader[i][source + "ID"] == id){
                        return availableHeader[i][source + "Name"]
                    }

            }

        }


        $scope.editorshow = function(editfile){

            resetDecisionHeader();

            $scope.showeditor = true;
            $scope.selectedclassoffile = editfile.$$hashKey;
            $scope.editfile = editfile;

            $scope.handleDecisionsForFiles();
            setDecisionsToEditfile();
        };

        $scope.handleDecisionsForFiles = function(){



            var isIn;

                for(var j = 0; j < $scope.uploadedfiles.length; j++){
                    for(var k = 0; k < $scope.decisionsForFiles.length; k++){
                        if($scope.decisionsForFiles[k].id == $scope.uploadedfiles[j].$$hashKey){
                            isIn = true;
                        }
                    }


                    if(!isIn || $scope.decisionsForFiles.length == 0){
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

        $scope.uploadfiles = function(){



            var isIn;
            for(var i = 0; i < $scope.decisionsForFiles.length; i++){
                for(var j = 0; j < $scope.uploadedfiles.length; j++){
                    if($scope.decisionsForFiles[i].id == $scope.uploadedfiles[j].$$hashKey){
                        isIn = true;
                    }
                }
                if(!isIn){
                    $scope.decisionsForFiles.splice(i, 1);


                }


            isIn = false;
            }


            $scope.upload();


            $scope.success = true;





        }

        $scope.sendmails = function(file){

            console.log(file);
            var requestData =  JSON.stringify(file);

            $http.post('../php/sendMails.php', requestData,["Content-Type", "application/json;charset=UTF-8"])
                .then(function (response) {

                })
        }

        $scope.writeToDatabase = function(id){



            for(var i = 0; i < $scope.decisionsForFiles.length; i++){

                if($scope.decisionsForFiles[i].id == id){


                    $scope.sendmails($scope.decisionsForFiles[i]);

                    var requestData = {'uploadedfile': JSON.stringify($scope.decisionsForFiles[i])};


                    $http.post('../php/insertToDatabase.php', requestData,["Content-Type", "application/json;charset=UTF-8"])
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






