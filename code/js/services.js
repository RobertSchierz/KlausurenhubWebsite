/**
 * Created by Rober on 07.02.2017.
 */


app.service('handleScopesService', function(){

    var sharedContentscope = {};
    var sharedFilterscope = {};
    var sharedSearchscope = {};

    var scopeID = new Map();
    scopeID.set(0, sharedContentscope);
    scopeID.set(1, sharedFilterscope);
    scopeID.set(2, sharedSearchscope);



    var getScopeOnID = function (id) {

            if(scopeID.get(id) != null){
                return scopeID.get(id);
            }else{
                console.log("Scope mit der ID: " + id + " nicht gefunden");
                return null;
            }

    };

    var addScopeOnID = function (id, scope) {

        if(scopeID.get(id) != null){
            scopeID.set(id, scope);
        }else{
            console.log("Scope mit der ID: " + id + " nicht gefunden");
            return null;
        }

    }

    var addScopeOf = function(id, scope){
        addScopeOnID(id, scope);
    }

    var getScopeOf = function(id){
        return getScopeOnID(id);
    }


    return{
        addScopeOf: addScopeOf,
        getScopeOf: getScopeOf

    }

})


app.service('refreshClauses', function ($http, $rootScope, handleScopesService) {
    
    var refreshcontent = function (callback) {

        handleScopesService.getScopeOf(0).loading = true;


            $http.post('../php/getClauses.php').then(function (response) {

                handleScopesService.getScopeOf(0).clauses = response.data;

                //$rootScope.clauses
                handleScopesService.getScopeOf(0).loading = false;
                return callback(response);
            })

        
    }
    
    
    return{
    refreshcontent:refreshcontent
    }
});
