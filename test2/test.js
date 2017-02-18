

  var app =  angular.module('testapp', ['ngMaterial'])
        app.controller('DemoCtrl', DemoCtrl);

    function DemoCtrl ($timeout, $q, $log, $scope, loadfilteroptions, countRows) {
        var self = this;


        loadfilteroptions.loadAvailableOptions("schools" ,function(response){
            $scope.school = response.data;

            for(var i = 0; i < $scope.school.length; i++){
                $scope.school[i].rowname = "schoolID";

               countRows.getRowsCount($scope.school[i], function(response, item){
                   item.schoolCount = "(" + response.data[0].count + ")";
                   console.log($scope.school);
               })
            }

        });

        loadfilteroptions.loadAvailableOptions("teachers" ,function(response){
            $scope.teacher = response.data;
        });


        // list of `state` value/display objects
        self.querySearch   = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange   = searchTextChange;
        $scope.schoolheader = "Hochschulen";
        $scope.teacherheader = "Lehrkraft";




        function querySearch (query, source) {
            console.log(source);
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



