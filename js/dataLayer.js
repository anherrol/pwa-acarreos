if (typeof BASE_API_URL === 'undefined' || typeof ajaxService === 'undefined') {
    var BASE_API_URL = 'https://acarreos-dev-api.azurewebsites.net/api/';
}

function AuthProxy() {
    this.service = 'auth/';
    this.ajaxService = new ServiceProxy(BASE_API_URL);

    // login service
    this.loginService = function (username, password) {
        // your callback down here
        var loginResult;

        this.ajaxService.callPostService( 
            this.service + 'login',
            { 'userKey': username, 'userPassword': password }, 
            (model) => {
                if (model) {
                    loginResult = model;
                
                    $("body").load("menu.html").hide().fadeIn(1500).delay(6000);
                    // window.location.href = "menu.html";
                }
                else {
                    $('#loginForm').shake();
                    $("#btnLogin").val('Iniciar sesi&oacute;n')
                    $("#error").html("<span style='color:#cc0000'>Error:</span> Usuario y contraseña inválidos.");
                }
            }, 
            (jqXhr, textStatus, errorMessage) => {
                $("#error").html(`Error${errorMessage}`);
            }
        );
    };
}

function CatalogsProxy() {
    this.service = 'catalogs/';
    this.ajaxService = new ServiceProxy(BASE_API_URL);

    // catalogs recovering
    this.getData = function (catalogName, successCallBack) {
        this.ajaxService.callGetService( 
            this.service + catalogName,
            null, 
            successCallBack, 
            (jqXhr, textStatus, errorMessage) => {
                $("#error").html(`Error${errorMessage}`);
            }
        );
    };
}

function syncData() {
    $("#syncLog").empty();

    var catalogsProxy = new CatalogsProxy();
    var localRepository = new LocalRepository();

    var catalogs = { 
        'tractortruckcatalog' : [ 'Tractocamiones', (data) => { for (var i = 0; i < data.length; i++) localRepository.storeTrucks(data[i]);  } ], 
        'driverscatalog': [ 'Conductores', (data) => { for (var i = 0; i < data.length; i++) localRepository.storeDrivers(data[i]); } ], 
        'gondolascatalog': [ 'Góndolas', (data) => { for (var i = 0; i < data.length; i++) localRepository.storeGondolas(data[i]); } ], 
        'operators': [ 'Operadores', (data) => { for (var i = 0; i < data.length; i++) localRepository.storeOperators(data[i]); } ], 
        'machines': [ 'Maquinaria', (data) => { for (var i = 0; i < data.length; i++) localRepository.storeMachines(data[i]); } ], 
        'machineoperators': [ 'Operadores de maquinaria', (data) => { for (var i = 0; i < data.length; i++) localRepository.storeMachineOperators(data[i]); } ], 
        'eventtypes': [ 'Tipos de eventos', (data) => { for (var i = 0; i < data.length; i++) localRepository.storeEventTypes(data[i]); } ]
    };

    Object.keys(catalogs).forEach(key => {
        catalogsProxy.getData(key, 
            (data) => {
                if (data) {
                    catalogs[key][1].call(this, data.data);

                    $("#syncLog").append(`<li class="list-group-item">${catalogs[key][0]}</li>`);
                } else {
                    $("#error").html("<span style='color:#cc0000'>Error:</span> Usuario y contraseña inválidos.");
                }
            });
        });
}