if (typeof BASE_API_URL === 'undefined' || typeof ajaxService === 'undefined') {
    // var BASE_API_URL = 'http://acarreosapi.local/api/';
    // var BASE_API_URL = 'https://localhost:7065/api/'; 
    var BASE_API_URL = 'https://mobileapi20231229170346.azurewebsites.net/api/';
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
                $("#error").html(`Error: ${errorMessage}`);
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

    this.storeHauling = function(ticketId, userId, haulingId, tractorTruckId, driver, gondolaId1, cantidadM31, gondolaId2, cantidadM32, successCallBack) {
        let operationDate = new Date();

        this.ajaxService.callPostService( 
            this.service,
            {
                "ticketId": ticketId, 
                "userId": userId,
                "operationDate": operationDate,
                "haulingId": haulingId,
                "tractorTruckId": tractorTruckId,
                "driver": driver,
                "gondolas": [
                    {
                        "gondolaId": gondolaId1,
                        "cantidadM3": cantidadM31
                    }, 
                    {
                        "gondolaId": gondolaId2,
                        "cantidadM3": cantidadM32
                    }
                ]
            }, 
            successCallBack, 
            (jqXhr, textStatus, errorMessage) => {
                $("#error").html(`Error${errorMessage}`);
            }
        );
    }

    this.updateHauling = function(userId, haulingId, tractorTruckId, driver, gondolaId1, h11, h21, h31, h41, gondolaId2, h12, h22, h32, h42, successCallBack) {
        let operationDate = new Date();

        this.ajaxService.callPutService( 
            this.service,
            haulingId,
            {
                "userId": userId,
                "operationDate": "2023-12-22T15:21:23.130Z",
                "haulingId": haulingId,
                "tractorTruckId": tractorTruckId,
                "driver": driver,
                "gondolas": [
                    {
                        "gondolaId": gondolaId1,
                        "h1": h11,
                        "h2": h21,
                        "h3": h31,
                        "h4": h41
                    }, 
                    {
                        "gondolaId": gondolaId2,
                        "h1": h12,
                        "h2": h22,
                        "h3": h32,
                        "h4": h42
                    }
                ]
            }, 
            successCallBack, 
            (jqXhr, textStatus, errorMessage) => {
                $("#error").html(`Error${errorMessage}`);
            }
        );
    }
}

function LogEntriesProxy() {
    this.service = 'logentries/storeEntry';
    this.ajaxService = new ServiceProxy(BASE_API_URL);

    this.storeLogEntry = function(logEntry, userId, logDateTime) {
        this.ajaxService.callPostService( 
            this.service,
            {
                "logEntry": logEntry,
                "userId": userId,
                "logDateTime": logDateTime
            }, 
            successCallBack, 
            (jqXhr, textStatus, errorMessage) => {
                $("#error").html(`Error${errorMessage}`);
            }
        );
    }
}

function SyncData() {
    this.localRepository = new LocalRepository();

    // sincronización de catálogos
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

    // sincronización de acarreos
    this.syncHaulings = async function() {
        let parametersRepository = new Parameters();

        // obtenemos el id del lugar de trabajo del usuario
        let userData = await parametersRepository.get("userData");
        let jobPlaceId = userData.data.jobPlaceId;
        let userId = userData.data.userId;
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

        if (jobPlace.esMina) {
            // descargar actualización de haulings para cierre
            //     haulingsProxy.getHaulingsForSources(jobPlaceId, haulingProcess);

            // updload only new haulings
            var newHaulings = await this.localRepository.haulings.getLocalNewHaulings(); 
            newHaulings.every((newHauling) => { 
                haulingsProxy.storeHauling(
                    newHauling.ticketId, 
                    userId, 
                    newHauling.id, 
                    newHauling.truckId, 
                    '12', 
                    newHauling.gondolaOneId, 
                    newHauling.weightOne, 
                    newHauling.gondolaTwoId, 
                    newHauling.weightTwo,
                    (data, status) => {
                        if (status == 'success') {
                            // se actualiza el hauling local, para no volver a subirlo
                            this.localRepository.haulings.updateHaulingStatus(newHauling.id, 'en ruta');
                        }
                    });

                return true;
            });
        } else {
            // descargar haulings para recepción
            haulingsProxy.getHaulingsForTargets(jobPlaceId, 
                (data) => {
                    if (data.length > 0) {
                        data.every((hauling) => {
                            var previousHauling = this.
                                localRepository.
                                haulings.
                                getHaulingById(hauling.acarreoId)
                                .then(data => {
                                    if (data.length == 0) {
                                        this.localRepository.haulings.storeHauling(
                                            hauling.acarreoId, 
                                            hauling.tractocamion, 
                                            hauling.operadorId,
                                            hauling.fechaDespacho, 
                                            hauling.gondolaId1, hauling.cantidadM31, 0, 0, 0, 0, 
                                            hauling.gondolaId2, hauling.cantidadM32, 0, 0, 0, 0, 
                                            hauling.nombreMina, 
                                            'en ruta',
                                            hauling.folioBoleta);        
                                    }
                                })

                            
                            return true;
                        });
                    }
                });

            // subir haulings actualizados
            var newHaulings = await this.localRepository.haulings.getLocalReceivedHaulings(); 
            newHaulings.every(hauling => {
                haulingsProxy.updateHauling(
                    userId, 
                    hauling.id, 
                    hauling.truckId, 
                    '', 
                    hauling.gondolaOneId, 
                    hauling.hOne1, hauling.hOne2, hauling.hOne3, hauling.hOne4, 
                    hauling.gondolaTwoId, 
                    hauling.hTwo1, hauling.hTwo2, hauling.hTwo3, hauling.hTwo4, 
                    (data, status) => { });

                return true;
            });
        }
    }

    // sincronización de logs
    this.syncLogEntries = async function() {
        let parametersRepository = new Parameters();

        // obtenemos el id del lugar de trabajo del usuario
        let userData = await parametersRepository.get("userData");
        let userId = userData.data.userId;
        
        let logEntriesProxy = new LogEntriesProxy();

            // updload only new haulings
            var logEntries = await this.localRepository.logEntries.getLocalLogEntries(); 

            logEntries.every((logEntry) => { 
                logEntriesProxy.storeLogEntry(
                    logEntry.logEntry, 
                    logEntry.logDate, 
                    userId, 
                    (data, status) => {
                        if (status == 'success') {
                            // se actualiza el hauling local, para no volver a subirlo
                            this.localRepository.logEntries.deleteLogEntry(logEntry.logId, 'en ruta');
                        }
                    });

                return true;
            });
    }
}