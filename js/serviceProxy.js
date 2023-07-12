if (typeof ServiceProxy === "undefined") {
    function ServiceProxy (webServiceUrl) {
        this.baseServiceUrl = webServiceUrl;

        this.callPostService = function (service, dataParameter, successCallBack, errorCallBack) {
            var ajaxOptions = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                type: "POST",
                url: this.baseServiceUrl + service,
                data: JSON.stringify(dataParameter),
                cache: false,
                success: (data) => { successCallBack(data); },
                error: errorCallBack
            };

            $.ajax(ajaxOptions);
        };

        this.callGetService = function (service, dataParameter, successCallBack, errorCallBack) {
            var ajaxOptions = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                type: "GET",
                url: this.baseServiceUrl + service,
                cache: false,
                success: (data) => { successCallBack(data); },
                error: errorCallBack
            };

            if (dataParameter != null) {
                ajaxOptions[data] = dataParameter;
            }

            $.ajax(ajaxOptions);
        };
    }
}