

  var app =  angular.module('testapp', ['ngMaterial'])
        app.controller('DemoCtrl', DemoCtrl);

    function DemoCtrl ($timeout, $q, $log, $scope, loadfilteroptions, countRows) {
        var self = this;

        // list of `state` value/display objects
        self.querySearch   = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange   = searchTextChange;
        $scope.schoolheader = "Hochschulen";
        $scope.teacherheader = "Lehrkraft";
        $scope.courseheader = "Studiengang";
        $scope.subjectheader = "Modul";
        $scope.degreeheader = "Grad";
        $scope.semesterheader = "Semester";
        $scope.yearheader = "Jahr";


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




        loadfilteroptions.loadAvailableOptions("schools" ,function(response){
            $scope.school = response.data;

            $scope.getCountRowsForItems($scope.school, "schoolID", "schoolCount");

        });

        loadfilteroptions.loadAvailableOptions("teachers" ,function(response){
            $scope.teacher = response.data;
            $scope.getCountRowsForItems($scope.teacher, "teacherID", "teacherCount");

        });

        loadfilteroptions.loadAvailableOptions("courses" ,function(response){
            $scope.course = response.data;
            $scope.getCountRowsForItems($scope.course, "courseID", "courseCount");
        });

        loadfilteroptions.loadAvailableOptions("subjects" ,function(response){
            $scope.subject = response.data;
            $scope.getCountRowsForItems( $scope.subject, "subjectID", "subjectCount");
        });

        loadfilteroptions.loadAvailableOptions("degrees" ,function(response){
            $scope.degree = response.data;
            $scope.getCountRowsForItems( $scope.degree, "degreeID", "degreeCount");
        });

        loadfilteroptions.loadAvailableOptions("semesters" ,function(response){
            $scope.semester = response.data;
            $scope.getCountRowsForItems( $scope.semester, "semesterID", "semesterCount");
        });

        loadfilteroptions.loadAvailableOptions("years" ,function(response){
            $scope.year = response.data;
            $scope.getCountRowsForItems( $scope.year, "yearID", "yearCount");
        });







        function querySearch (query, source) {

            var results = query ? $scope[source].filter( createFilterFor(query, source) ) : $scope[source],
                deferred;
                return results;

        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
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

          $http.post('getAvailableOptions.php', requestData)
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

          $http.post('countRows.php', requestData, ["Content-Type", "application/json;charset=UTF-8"])
              .then(function (response) {
                  return callback(response, item);
         })
      }

      return{
          getRowsCount:getRowsCount
      }


  })



