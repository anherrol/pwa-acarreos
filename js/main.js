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
        console.log('No puedes generarse una pwa');
    }

    $(document).ready(function () {
        // login button
        $('#btnLogin').click(function () {
            var username = $("#userKey").val();
            var password = $("#userPwd").val();
            
            if ($.trim(username).length > 0 && $.trim(password).length > 0) {
                var authDL = new AuthProxy();

                authDL.loginService(username, password);
            }

            return false;
        });
    });
            
    function limpiarLista(lista) {
        lista.value = '';
    }
}
