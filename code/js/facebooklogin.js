/**
 * Created by Rober on 09.01.2017.
 */

/*

window.fbAsyncInit = function() {
    FB.init({
        appId      : '1710610359248953',
        xfbml      : true,
        version    : 'v2.8',
        status: true,
        cookie: true,
        xfbml: true,
        oauth:true
    });
    FB.AppEvents.logPageView();




    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });


    FB.Event.subscribe('auth.authResponseChange', function(response)
    {
        if (response.status === 'connected')
        {
            console.log("<br>Connected to Facebook");
            //SUCCESS
            FB.api('/me', { locale: 'tr_TR', fields: 'name, email,birthday, hometown,education,gender,website,work' },
                function(response) {



                }
            );

        }
        else if (response.status === 'not_authorized')
        {
            console.log("Failed to Connect");

            //FAILED
        } else
        {
            console.log("Logged Out");

            //UNKNOWN ERROR
        }
    });




};

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}



function statusChangeCallback(response) {

    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        $("#login").show(500);

    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        $("#login").hide(500);

    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        $("#login").hide(500);


    }
}

*/