var _submit = document.getElementById('_submit'),
    _file = document.getElementById('_file');

var upload = function(){

    var data = new FormData();
    console.log(_file.files[0]);
    data.append('SelectedFile', _file.files[0]);

    var request = new XMLHttpRequest();
    /*request.onreadystatechange = function(){
        if(request.readyState == 4){
            try {
                var resp = JSON.parse(request.response);
            } catch (e){
                var resp = {
                    status: 'error',
                    data: 'Unknown error occurred: [' + request.responseText + ']'
                };
            }
            console.log(resp.status + ': ' + resp.data);
        }
    };*/


    request.open('POST', 'test.php');
    request.send(data);
}

_submit.addEventListener('click', upload);