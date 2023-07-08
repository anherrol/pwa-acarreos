if (!previousLoading) {
    var previousLoading = true;

    // Service worker
    if ('serviceWorker' in navigator) {
        console.log('Puedes usar los service workers en tu navegador.');

        navigator
            .serviceWorker
            .register('./js/sw.js')
            .then(res => console.log('serviceWorker cargado correctamente.', res))
            .catch(err => console.log('serviceWorker no se ha podido registrar.', err))
    } else {
        console.log('No puedes');
    }

    // general constants
    const BASE_API_URL = 'https://localhost:7065/api/';

    // service calling
    var callService = (service, dataString, successCallBack, errorCallBack) => {
        var urlService = BASE_API_URL + service;

        $.ajax({
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            type: "POST",
            url: urlService,
            data: dataString,
            cache: false,
            beforeSend: function () { $("#login").val('Connecting...'); },
            success: successCallBack, 
            error: errorCallBack
        });
    };

    // login service
    var loginService = (username, password) => {
        callService(
            'Auth/login', 
            JSON.stringify({ userKey: username, userPassword: password }), 
            (data) => {
                if (data) {
                    $("body").load("menu.html").hide().fadeIn(1500).delay(6000);
                    // window.location.href = "menu.html";
                }
                else {
                    //Shake animation effect.
                    $('#loginForm').shake();
                    $("#btnLogin").val('Iniciar sesi&oacute;n')
                    $("#error").html("<span style='color:#cc0000'>Error:</span> Invalid username and password. ");
                }
            }, 
            (jqXhr, textStatus, errorMessage) => {
                $("#error").html(`Error${errorMessage}`);
            });
    };

    $(document).ready(function () {
        // login button
        $('#btnLogin').click(function () {
            var username = $("#userKey").val();
            var password = $("#userPwd").val();
            
            if ($.trim(username).length > 0 && $.trim(password).length > 0) {
                loginService(username, password);
            }
            return false;
        });
    });
}