/**
 * Created by Rober on 11.12.2016.
 */

$(document).ready(function(){


    $( "#filterdocumentsinner" ).load( "../loadedhtml/mainpage/filter.html" );



    $("#filterdocumentsinner").on("click","#school_list li a" ,  function(){

        $(this).parents("#filter_school").find('#school_selection').text($(this).text());
        $(this).parents("#filter_school").find('#school_selection').val($(this).text());

    });

});

