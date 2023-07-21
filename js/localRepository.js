if (typeof LocalRepository === "undefined") {
    function LocalRepository () {
        const DB_NAME = "acarreos-local-db";
        
        var db = new Dexie(DB_NAME);

        function uuidv4() {
            return ([1e7]+-1e3+-4e3+-8e3+-1e11)
                .replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
        }

        // Define a schema
        db.version(1)
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
                haulings: 'id, truckId, gondolaOneId, weightOne, hOne1, hOne2, hOne3, hOne4, gondolaTwoId, weightTwo, hTwo1, hTwo2, hTwo3, hTwo4, status'
            });

        // Open the database
        db.open()
            .catch(function(error){
                alert('Uh oh: ' + error);
            });

        this.Parameters = function () {
            this.storeParameter = function (name, data) {
                db.parameters
                    .put({id: name, data: data})
                    .catch((error) => {
                        console.error("Failed to add new truck. Error: " + error.message);
                        return Promise.reject(error);
                    });    
            }

            this.getParameter = function (name) {
                return db.parameters
                    .where({id: name})
                    .first();
            }

            this.deleteParameter = function (name) {
                return db.parameters
                    .delete(name)
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

            this.storeNewHauling = (truckId, gondolaOneId, weightOne, gondolaTwoId, weightTwo) => {
                db.haulings
                    .add({id: uuidv4(), truckId: truckId, gondolaOneId: gondolaOneId, weightOne: weightOne, gondolaTwoId: gondolaTwoId, weightTwo: weightTwo, status: 'creado'})
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
        }

        this.Catalogs = function () {
            // Trucks
            this.storeTrucks = function (data) {
                db.trucks
                    .add({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new truck. Error: " + error);
                        return Promise.reject(error);
                    });
            }

            this.getTrucks = function () {
                return db.trucks.toArray();
            }

            // Drivers
            this.storeDrivers = function (data) {
                db.drivers
                    .add({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new driver. Error: " + error);
                        return Promise.reject(error);
                    });
            }

            // Gondolas
            this.storeGondolas = function (data) {
                db.gondolas
                    .add({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new gondola. Error: " + error);
                        return Promise.reject(error);
                    });
            }

            this.getGondolas = function () {
                return db.gondolas.toArray();
            }

            // operators
            this.storeOperators = function (data) {
                db.operators
                    .add({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new operator. Error: " + error);
                        return Promise.reject(error);
                    });
            }

            // machinery
            this.storeMachines = function (data) {
                db.machines
                    .add({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new machine. Error: " + error);
                        return Promise.reject(error);
                    });
            }

            this.getMachines = function() {
                return db.machines.toArray();
            }

            // Machine operators
            this.storeMachineOperators = function (data) {
                db.machineoperators
                    .add({ id: data.id, qrcode: data.qrCode, description: data.description })
                    .catch((error) => {
                        console.error("Failed to add new machine operator. Error: " + error);
                        return Promise.reject(error);
                    });
            }

            // Event Types
            this.storeEventTypes = function (data) {
                db.eventtypes
                    .add({ id: data.id, qrcode: data.qrCode, description: data.description })
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
