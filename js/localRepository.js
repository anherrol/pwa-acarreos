if (typeof LocalRepository === "undefined") {
    function LocalRepository () {
        const DB_NAME = "acarreos-local-db";
        
        var db = new Dexie(DB_NAME);

        // Define a schema
        db.version(1)
            .stores({
                trucks: 'id, qrcode, description', 
                drivers: 'id, qrcode, description', 
                gondolas: 'id, qrcode, description', 
                operators: 'id, qrcode, description', 
                machines: 'id, qrcode, description', 
                machineoperators: 'id, qrcode, description', 
                eventtypes: 'id, qrcode, description'
            });

        // Open the database
        db.open()
            .catch(function(error){
                alert('Uh oh: ' + error);
            });

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
}