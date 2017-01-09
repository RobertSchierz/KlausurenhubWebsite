/**
 * Created by Rober on 09.01.2017.
 */



window.fbAsyncInit = function() {
    FB.init({
        appId      : '1710610359248953',
        xfbml      : true,
        version    : 'v2.8'
    });
    FB.AppEvents.logPageView();


(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));




FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
});

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}




    function testAPI() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
            console.log('Successful login for: ' + response.name);
            document.getElementById('status').innerHTML =
                'Thanks for logging in, ' + response.name + '!';
        });
    }



};

