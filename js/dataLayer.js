if (typeof BASE_API_URL === 'undefined' || typeof ajaxService === 'undefined') {
    var BASE_API_URL = 'https://localhost:7065/api/'; // 'https://acarreos-dev-api.azurewebsites.net/api/';
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
                    operatorId = model.userId;
                    loginResult = model;

                    var parameters = new Parameters();
                    parameters.store("userData", model);
                
                    //$("body").load("menu.html").hide().fadeIn(1500).delay(6000);
                    window.location.href = "menu.html";
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

    // login service
    this.closeSession = function () {
        var parameters = new Parameters();

        parameters.delete("userData");
    }
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

function DieselDispatching() {
    this.service = 'dieseldispatching/';
    this.ajaxService = new ServiceProxy(BASE_API_URL);

    this.storeDieselDispatching = function(machineId, quantity, operatorId) {
        this.localRepository.dieselDispatching.storeDieselDispatching(machineId, quantity, operatorId);
    }

    this.pushDieselDispatching = function (equipmentId, quantity, operatorId, successCallBack) {
        this.ajaxService.callGetService( 
            this.service,
            null, 
            successCallBack, 
            (jqXhr, textStatus, errorMessage) => {
                $("#error").html(`Error${errorMessage}`);
            }
        );
    };
}

function Parameters() {
    this.localRepository = new LocalRepository();

    this.store = function (name, value) {
        this.localRepository.parameters.storeParameter(name, value);
    };

    this.get = function (name) {
        return this.localRepository.parameters.getParameter(name);
    }

    this.delete = function (name) {
        return this.localRepository.parameters.deleteParameter(name);
    }
}

function syncData() {
    $("#syncLog").empty();

    var catalogsProxy = new CatalogsProxy();
    var localRepository = new LocalRepository();

    var catalogs = { 
        'tractortruckcatalog' : [ 'Tractocamiones', (data) => { for (var i = 0; i < data.length; i++) localRepository.catalogs.storeTrucks(data[i]);  } ], 
        'driverscatalog': [ 'Conductores', (data) => { for (var i = 0; i < data.length; i++) localRepository.catalogs.storeDrivers(data[i]); } ], 
        'gondolascatalog': [ 'Góndolas', (data) => { for (var i = 0; i < data.length; i++) localRepository.catalogs.storeGondolas(data[i]); } ], 
        'operators': [ 'Operadores', (data) => { for (var i = 0; i < data.length; i++) localRepository.catalogs.storeOperators(data[i]); } ], 
        'machines': [ 'Maquinaria', (data) => { for (var i = 0; i < data.length; i++) localRepository.catalogs.storeMachines(data[i]); } ], 
        'machineoperators': [ 'Operadores de maquinaria', (data) => { for (var i = 0; i < data.length; i++) localRepository.catalogs.storeMachineOperators(data[i]); } ], 
        'eventtypes': [ 'Tipos de eventos', (data) => { for (var i = 0; i < data.length; i++) localRepository.catalogs.storeEventTypes(data[i]); } ]
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