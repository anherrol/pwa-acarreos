if (typeof LocalRepository === "undefined") {
    function LocalRepository () {
        const DB_NAME = "acarreos-local-db";
        
        var db = new Dexie(DB_NAME);

        function uuidv4() {
            return ([1e7]+-1e3+-4e3+-8e3+-1e11)
                .replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
        }

        // Define a schema
        db.version(1.1)
            .stores({
                trucks: 'id, qrcode, description', 
                drivers: 'id, qrcode, description', 
                gondolas: 'id, qrcode, description', 
                operators: 'id, qrcode, description', 
                machines: 'id, qrcode, description', 
                machineoperators: 'id, qrcode, description', 
                eventtypes: 'id, qrcode, description', 
                parameters: 'id, value', 
                dieselDispatchings: 'id, machineId, quantity, operatorId', 
                creationOfEvents: 'id, machineId, hourmeter, eventType, observations, operatorId', 
                haulings: 'id, truckId, gondolaOneId, weightOne, hOne1, hOne2, hOne3, hOne4, gondolaTwoId, weightTwo, hTwo1, hTwo2, hTwo3, hTwo4, status', 
                jobplaces: 'id, nombre, prefijoBoletas, lugarOrigen, numeroFrente, numeroLote, esMina'
            });

        // Open the database
        db.open()
            .catch(function(error){
                alert('Uh oh: ' + error);
            });

        this.Parameters = function () {
            this.storeParameter = async function (name, data) {
                await db.parameters.put({id: name, data: data});
            }

            this.getParameter = async function (name) {
                return await db.parameters.where({id: name}).first();
            }

            this.deleteParameter = async function (name) {
                await db.parameters.delete(name);
            }
        }

        this.DieselDispatching = function () {
            this.storeDieselDispatching = (machineId, quantity, operatorId) => {
                db.dieselDispatchings
                    .add({id: uuidv4(), machineId: machineId, quantity: quantity, operatorId: operatorId})
                    .catch((error) => {
                        console.error("Failed to add new diesel dispatching. Error: " + error);
                        return Promise.reject(error);
                    });   
            };
        }

        this.CreationOfEvents = function () {
            this.storeCreationOfEvent = (machineId, hourmeter, eventType, observations, operatorId) => {
                db.creationOfEvents
                    .add({id: uuidv4(), machineId: machineId, hourmeter: hourmeter, eventType: eventType, observations: observations, operatorId: operatorId})
                    .catch((error) => {
                        console.error("Failed to add new creation of events. Error: " + error);
                        return Promise.reject(error);
                    });   
            };
        }

        this.Haulings = function () {
            this.getHaulingByTruck = (truckId) => {
                return db.haulings.where({truckId: truckId}).toArray();
            }

            this.getHaulingById = (id) => {
                return db.haulings.where({id: id, status: 'recibido'}).toArray();
            }

            this.getLocalNewHaulings = async () => {
                return await db.haulings.where({status: 'creado'}).toArray();
            }

            this.getLocalReceivedHaulings = async () => {
                return await db.haulings.where({status: 'recibido'}).toArray();
            }

            this.storeNewHauling = (ticketId, truckId, gondolaOneId, weightOne, gondolaTwoId, weightTwo) => {
                db.haulings
                    .add({
                        id: uuidv4(), 
                        ticketId: ticketId, 
                        truckId: truckId, 
                        gondolaOneId: gondolaOneId, 
                        weightOne: weightOne, 
                        gondolaTwoId: gondolaTwoId, 
                        weightTwo: weightTwo, 
                        status: 'creado'
                    })
                    .catch((error) => {
                        console.error("Failed to add new hauling. Error: " + error);
                        return Promise.reject(error);
                    }); 
            };

            this.updateHaulingReception = (id, hOne1, hOne2, hOne3, hOne4, hTwo1, hTwo2, hTwo3, hTwo4) => {
                return db.haulings
                    .update(id, {hOne1: hOne1, hOne2: hOne2, hOne3: hOne3, hOne4: hOne4, hTwo1: hTwo1, hTwo2: hTwo2, hTwo3: hTwo3, hTwo4: hTwo4, status: 'recibido'})
            };

            this.updateHaulingFinalization = (id) => {
                return db.haulings
                    .update(id, {status: 'finalizado'});
            };

            this.updateHaulingStatus = (id, status) => {
                return db.haulings
                    .update(id, {status: status});
            };

            this.storeHauling = (truckId, gondolaOneId, weightOne, hOne1, hOne2, hOne3, hOne4, gondolaTwoId, weightTwo, hTwo1, hTwo2, hTwo3, hTwo4, status) => {
                db.haulings
                    .put({
                        id: uuidv4(), truckId: truckId, 
                        gondolaOneId: gondolaOneId, weightOne: weightOne, hOne1: hOne1, hOne2: hOne2, hOne3: hOne3, hOne4: hOne4, 
                        gondolaTwoId: gondolaTwoId, weightTwo: weightTwo, hTwo1: hTwo1, hTwo2: hTwo2, hTwo3: hTwo3, hTwo4: hTwo4, 
                        status: status
                    })
                    .catch((error) => {
                        console.error("Failed to store hauling. Error: " + error);
                        return Promise.reject(error);
                    });
            };

            this.storeHauling = (id, truckId, operatorId, dispatchDate, gondolaOneId, weightOne, hOne1, hOne2, hOne3, hOne4, gondolaTwoId, weightTwo, hTwo1, hTwo2, hTwo3, hTwo4, bankName, status, foliotBoleta) => {
                db.haulings
                    .put({
                        id: id, 
                        truckId: truckId, 
                        operatorId: operatorId, 
                        dispatchDate: dispatchDate, 
                        gondolaOneId: gondolaOneId, weightOne: weightOne, hOne1: hOne1, hOne2: hOne2, hOne3: hOne3, hOne4: hOne4, 
                        gondolaTwoId: gondolaTwoId, weightTwo: weightTwo, hTwo1: hTwo1, hTwo2: hTwo2, hTwo3: hTwo3, hTwo4: hTwo4, 
                        bankName: bankName,
                        status: status, 
                        foliotBoleta: foliotBoleta
                    })
                    .catch((error) => {
                        console.error("Failed to store hauling. Error: " + error);
                        return Promise.reject(error);
                    });
            };

            this.getTrucks = async () => {
                return await db.haulings.orderBy('truckId').keys();
            }
        }

        this.Catalogs = function () {
            // Job Places
            this.storeJobPlaces = async function (data) {
                await db
                    .jobplaces
                    .put({ id: data.id, nombre: data.nombre, prefijoBoletas: data.prefijoBoletas, lugarOrigen: data.lugarOrigen, numeroFrente: data.numeroFrente, numeroLote: data.numeroLote, esMina: data.esMina });
            }

            this.getJobPlaces = async function () {
                return await db.jobplaces.toArray();
            }

            // Trucks
            this.storeTrucks = function (data) {
                db.trucks
                    .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new truck. Error: " + error);
                        return Promise.reject(error);
                    });
            }

            this.getTrucks = async function () {
                return await db.trucks.toArray();
            }

            // Drivers
            this.storeDrivers = function (data) {
                db.drivers
                    .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new driver. Error: " + error);
                        return Promise.reject(error);
                    });
            }

            // Gondolas
            this.storeGondolas = function (data) {
                db.gondolas
                    .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new gondola. Error: " + error);
                        return Promise.reject(error);
                    });
            }

            this.getGondolas = async function () {
                return await db.gondolas.toArray();
            }

            // operators
            this.storeOperators = function (data) {
                db.operators
                    .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new operator. Error: " + error);
                        return Promise.reject(error);
                    });
            }

            // machinery
            this.storeMachines = function (data) {
                db.machines
                    .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new machine. Error: " + error);
                        return Promise.reject(error);
                    });
            }

            this.getMachines = async function() {
                return await db.machines.toArray();
            }

            // Machine operators
            this.storeMachineOperators = function (data) {
                db.machineoperators
                    .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new machine operator. Error: " + error);
                        return Promise.reject(error);
                    });
            }

            // Event Types
            this.storeEventTypes = function (data) {
                db.eventtypes
                    .put({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new event type. Error: " + error);
                        return Promise.reject(error);
                    });
            }
            
            this.getEventTypes = function (data) {
                return db.eventtypes.toArray();
            }
        }

        this.parameters = new this.Parameters();
        this.dieselDispatching = new this.DieselDispatching();
        this.creationOfEvents = new this.CreationOfEvents();
        this.catalogs = new this.Catalogs();
        this.haulings = new this.Haulings();
    }
}
