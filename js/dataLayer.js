if (typeof BASE_API_URL === 'undefined' || typeof ajaxService === 'undefined') {
    var BASE_API_URL = 'https://localhost:7065/api/'; // 'https://acarreos-dev-api.azurewebsites.net/api/';
}

function AuthProxy() {
    this.service = 'auth/';
    this.ajaxService = new ServiceProxy(BASE_API_URL);

    // login service
    this.loginService = async function (username, password) {
        // your callback down here
        var loginResult;

        this.ajaxService.callPostService( 
            this.service + 'login',
            { 'userKey': username, 'userPassword': password }, 
            async (model) => {
                if (model) {
                    operatorId = model.userId;
                    loginResult = model;

                    var parameters = new Parameters();
                    await parameters.store("userData", model);
                
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
    this.closeSession = async function () {
        var parameters = new Parameters();

        await parameters.delete("userData");
    }

    // sync job places
    this.getJobPLaces = function(successCallBack) {
        let action = 'jobplaces';

        this.ajaxService.callGetService( 
            this.service + action,
            null, 
            successCallBack, 
            (jqXhr, textStatus, errorMessage) => {
                $("#error").html(`Error${errorMessage}`);
            }
        );
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

    this.store = async function (name, value) {
        await this.localRepository.parameters.storeParameter(name, value);
    };

    this.get = async function (name) {
        return await this.localRepository.parameters.getParameter(name);
    }

    this.delete = async function (name) {
        return await this.localRepository.parameters.deleteParameter(name);
    }
}

function HaulingsProxy() {
    this.service = 'hauling/';
    this.ajaxService = new ServiceProxy(BASE_API_URL);

    this.getHaulingsForTargets = function (jobPlaceId, successCallBack) {
        let action = 'HaulingsForTargets'

        this.ajaxService.callGetService( 
            this.service + action,
            "jobPlaceId=" + jobPlaceId, 
            successCallBack, 
            (jqXhr, textStatus, errorMessage) => {
                $("#error").html(`Error${errorMessage}`);
            }
        );
    }

    this.getHaulingsForSources = function (jobPlaceId, successCallBack) {
        let action = 'HaulingsForSources'

        this.ajaxService.callGetService( 
            this.service + action,
            "jobPlaceId=" + jobPlaceId, 
            successCallBack, 
            (jqXhr, textStatus, errorMessage) => {
                $("#error").html(`Error${errorMessage}`);
            }
        );
    }
}

function SyncData() {
    this.localRepository = new LocalRepository();

    this.syncCatalogs = function() {
        $("#syncLog").empty();

        var catalogs = { 
            'tractortruckcatalog' : [ 'Tractocamiones', (data) => { for (var i = 0; i < data.length; i++) this.localRepository.catalogs.storeTrucks(data[i]);  } ], 
            'driverscatalog': [ 'Conductores', (data) => { for (var i = 0; i < data.length; i++) this.localRepository.catalogs.storeDrivers(data[i]); } ], 
            'gondolascatalog': [ 'Góndolas', (data) => { for (var i = 0; i < data.length; i++) this.localRepository.catalogs.storeGondolas(data[i]); } ], 
            'operators': [ 'Operadores', (data) => { for (var i = 0; i < data.length; i++) this.localRepository.catalogs.storeOperators(data[i]); } ], 
            'machines': [ 'Maquinaria', (data) => { for (var i = 0; i < data.length; i++) this.localRepository.catalogs.storeMachines(data[i]); } ], 
            'machineoperators': [ 'Operadores de maquinaria', (data) => { for (var i = 0; i < data.length; i++) this.localRepository.catalogs.storeMachineOperators(data[i]); } ], 
            'eventtypes': [ 'Tipos de eventos', (data) => { for (var i = 0; i < data.length; i++) this.localRepository.catalogs.storeEventTypes(data[i]); } ], 
        };

        var catalogsProxy = new CatalogsProxy();
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
        
        var authProxy = new AuthProxy();
        authProxy.getJobPLaces(
            (data) => {
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        this.localRepository.catalogs.storeJobPlaces(data[i]); 
                    }

                    $("#syncLog").append(`<li class="list-group-item">Lugares de Trabajo</li>`);
                } else {
                    $("#error").html("<span style='color:#cc0000'>Error:</span> Usuario y contraseña inválidos.");
                }
            }
        )
    };

    this.syncHaulings = async function() {
        let parametersRepository = new Parameters();

        // obtenemos el id del lugar de trabajo del usuario
        let userData = await parametersRepository.get("userData");
        let jobPlaceId = userData.data.jobPlaceId;
        let jobPlacesCatalog = await this.localRepository.catalogs.getJobPlaces();
        let jobPlace;

        // obtenemos el lugar de trabajo de la persona
        jobPlacesCatalog.every(eachJobPlace => {
            if (eachJobPlace.id === jobPlaceId) {
                jobPlace = eachJobPlace;
                return false;
            }

            return true;
        });

        let haulingsProxy = new HaulingsProxy();

        // bajar haulings correspondientes a este lugar de trabajo
        let haulingProcess = (data) => {
            if (data.length > 0) {
                console.log(data);
            }
        };

        if (jobPlace.esMina) {
            haulingsProxy.getHaulingsForTargets(jobPlaceId, haulingProcess);
        } else {
            haulingsProxy.getHaulingsForSources(jobPlaceId, haulingProcess);
        }

        // subir haulings actualizados
    }
}