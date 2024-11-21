class EntityCommon {
    constructor() { }

    isAppManager() {
        return window.top.$.axpertUI?.options?.axpertUserSettings?.settings?.axUserOptions?.configurationStudio?.display == 'block';
    }

    getInitials(str) {

        let initials = '';

        // Split the string into words
        const words = str.split(' ');

        // Extract initials based on number of words
        if (words.length === 1) {
            if (words[0].length == 1)
                initials = words[0].charAt(0);
            else
                initials = words[0].charAt(0) + words[0].charAt(1);
        } else if (words.length === 2) {
            // If there are two words, get the first character of each word
            initials = words[0].charAt(0) + words[1].charAt(0);
        } else if (words.length >= 3) {
            // If there are three or more words, get the first character of the first two words
            initials = words[0].charAt(0) + words[1].charAt(0);
        }

        return initials.toUpperCase();
    }

    isEmpty(elem) {
        return elem == "";
    };

    isNull(elem) {
        return elem == null;
    };

    isNullOrEmpty(elem) {
        return elem == null || elem == "";
    };

    inValid(elem) {
        return elem == null || typeof elem == "undefined" || elem == "";
    };

    isUndefined(elem) {
        return typeof elem == "undefined";
    };

    setAnalyticsDataWS(data, successCB = () => {}, errorCB = () => {}) {
        const ajaxCall = (data) => {
    
            $.ajax({
                url: top.window.location.href.toLowerCase().substring(0, top.window.location.href.toLowerCase().indexOf("/aspx/")) + '/aspx/Analytics.aspx/SetAnalyticsDataWS',
                type: 'POST',
                cache: false,
                async: true,
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log('Response from SetAnalyticsDataWS:', response);
                    if (successCB && typeof successCB === "function") {
                        successCB(response.d || response);
                    }
                },
                error: function (error) {
                    console.error('Error in SetAnalyticsDataWS:', error);
                    if (errorCB && typeof errorCB === "function") {
                        errorCB(error);
                    }
                }
            });
        };
    
        if (data.confirmNeeded) {
            ajaxCall(data);
        } else if (this.isAppManager()) {
            $('.modal').modal('hide');
    
            $('#confirmationModal').appendTo('body').css('z-index', 1100).modal('show');
    
            $('#confirmationModal').on('hidden.bs.modal', function () {
                const userChoice = $(this).data('userChoice');
                data.allUsers = userChoice === 'allUsers';
                ajaxCall(data);
            });
    
            $('#btnAllUsers').on('click', function () {
                $('#confirmationModal').data('userChoice', 'allUsers');
                $('#confirmationModal').modal('hide');
            });
    
            $('#btnJustMyself').on('click', function () {
                $('#confirmationModal').data('userChoice', 'justMyself');
                $('#confirmationModal').modal('hide');
            });
        } else {
            ajaxCall(data);
        }
    }
    
    getAnalyticsDataWS(data, successCB = () => { }, errorCB = () => { }) {
        $.ajax({
            url: top.window.location.href.toLowerCase().substring(0, top.window.location.href.toLowerCase().indexOf("/aspx/")) + '/aspx/Analytics.aspx/GetAnalyticsDataWS',
            type: 'POST',
            cache: false,
            async: true,
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (response) {
                if (successCB && typeof successCB == "function") {
                    successCB(response.d || response);
                }
            },
            error: function (error) {
                if (errorCB && typeof errorCB == "function") {
                    errorCB(error);
                }
            }
        });
    }
    
}

function AxGetGlobalVar() {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/GetGlobalVar',
        type: 'POST',
        cache: false,
        async: false,
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            if (data.d != "") {
                jsonVal = JSON.parse(data.d);
            }
            else {
                jsonVal = "";
            }
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}
