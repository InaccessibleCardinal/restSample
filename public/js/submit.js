document.addEventListener("DOMContentLoaded", onLoad); 
function onLoad() {
this.console.log('loaded!')
    var n = document.getElementById('name'), p = document.getElementById('password'), s = document.getElementById('submit');

    s.addEventListener('click', submitData);
    //"username":"angrymeercat748","password":"baltimor"

    function submitData() {
        var url = 'http://localhost:9000/auth';
        var name = n.value, password = p.value, data = {};
        data.name = name;
        data.password = password;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (XMLHttpRequest.DONE && this.status >=200) {
                console.log(this.response)
            }

        }
        console.log('DATA? ', data);
        xhr.send(JSON.stringify(data));
    }
};