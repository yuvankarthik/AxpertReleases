var dtCulture = eval(callParent('glCulture'));

var _entitySummary;
var _entityCommon;
// var globalOrder = [];
// var globalYOrder = [];


var selectedItemsArray = [];
class EntitySummary {
    constructor() {
        this.entityName = '';
        this.entityTransId = '';
        this.metaData = {};
        this.listJson = {};
        this.maxPageNumber = 1;
        this.pageSize = 50;
        this.kpiJson = [];
        this.chartsJson = [];
        this.chartsMetaData = {};
        this.selectedCharts = "";
        this.selectedChartsObj = {};
        this.fldData = {};
        this.emptyRowsHtml = `No data found`;
        this.filter = "";
        // this.fields = "All";
        this.xAxisFields = "";
        this.yAxisFields = "";
        this.selectedKeyField = '';
        this.entityList = [];
        this.allEntitiesList = [];
        this.selectedEntitiesList = [];
        this.filterObj = {};
        this.globalOrder = [];
        this.globalYOrder = [];
        
    }
    init() {
        parent.ShowDimmer(false);
    
        const pageLoadData = JSON.parse(document.querySelector("#hdnAnalyticsPageLoadData").value);
    
        if (_entityCommon.inValid(pageLoadData.result.data.SelectedEntities)) {
            this.allEntitiesList = pageLoadData.result.data.AllEntitiesList;
            this.constructEntityPopup(this.allEntitiesList);
            document.querySelector("#Entity_summary_Left").classList.add("d-none");
            document.querySelector("#Entity_summary_Right").classList.add("d-none");
        } else {
            let { "xAxisFields": xAxisFields, "yAxisFields": yAxisFields } = pageLoadData.result.data.Properties;
    
            this.xAxisFields = xAxisFields || "All";
            this.yAxisFields = yAxisFields || "All";
    
            this.metaData = pageLoadData.result.data.MetaData;
            this.selectedEntitiesList = pageLoadData.result.data.SelectedEntitiesList;
            this.entityTransId = pageLoadData.result.data.TransId;
            this.entityName = this.getEntityCaption(this.entityTransId);

            this.constructXandYAxis(this.metaData, "Page Load");
            this.constructSelectedEntityHeader();
        }
    
        // this.checkAppmanagerAccess();
    }
    
    
    getAnalyticsChartsDataWS(input) {
        $.ajax({
            url: top.window.location.href.toLowerCase().substring(0, top.window.location.href.toLowerCase().indexOf("/aspx/")) + '/aspx/Analytics.aspx/GetAnalyticsChartsDataWS',
            type: 'POST',
            cache: false,
            async: true,
            dataType: 'json',
            data: JSON.stringify(input),
            contentType: "application/json",
            success: function (data) {
                try {
                    var result = JSON.parse(data.d);

                    if (result.result.success) {
                        var chartsData = JSON.parse(result.result.charts[0].data_json);
                    }
                    handleValidChartData();

                    document.querySelector("#Homepage_CardsList_Wrapper").innerHTML = "";

                    if (input.aggField === "count" && input.groupField === "all") {
                        if (chartsData.length > 0) {
                            var kpiJson = chartsData[0];
                            var html = _entitySummary.generateGeneralKPIHTML(kpiJson);
                            document.querySelector('#KPI-2 .row').innerHTML = html;
                            document.querySelector("#Homepage_CardsList_Wrapper").innerHTML = "";
                            document.querySelector('#analytics-chart-title #chart-title').innerHTML = `${_entitySummary.entityName}(s)`;

                            let map = {
                                "totrec": "Total records",
                                "cyear": "This year",
                                "cmonth": "This month",
                                "cweek": "This week",
                                "cyesterday": "Yesterday",
                                "ctoday": "Today"
                            };

                            let chartJson = Object.keys(kpiJson).filter(item => item != "cnd" && item != "creiteria" && item != null && kpiJson[item] != null && kpiJson[item] != 0).map(key => ({ data_label: map[key], value: kpiJson[key] }));
                            var finalDataObj = [];

                            finalDataObj.push({
                                "chartsid": "General",
                                "charttype": "chart",
                                "chartjson": JSON.stringify(chartJson),
                                "chartname": `criteria`,
                                "chart": document.querySelector(".chart-selections button.bg-success")?.getAttribute("chart_type")
                            });
                            _entitySummary.chartsJson = finalDataObj;
                        }
                    } else {
                        // Handle other conditions if needed
                        if (chartsData.length > 0) {
                            let kpiJson = chartsData;
                            var finalDataObj = [];
                            let criteria = kpiJson[0].criteria;
                            let criteriaArr = criteria.split("~");
                            let caption = "None";

                            if (criteriaArr[1] == '') {
                                caption = _this.filterByFldname(_this.metaData, criteriaArr[2])[0]?.fldcap || '';
                                document.querySelector('#analytics-chart-title #chart-title').innerHTML = `${caption} (${criteriaArr[3]})`;
                            } else {
                                document.querySelector('#analytics-chart-title #chart-title').innerHTML = _entitySummary.getChartCaptions(criteria);
                            }

                            var chartJson = kpiJson.map(item => ({
                                data_label: item.keyname || caption,
                                value: item.keyvalue || 0
                            }));

                            document.querySelector("#Homepage_CardsList_Wrapper").innerHTML = "";
                            var html = _entitySummary.generateCustomKPIHTML(kpiJson, caption);
                            document.querySelector('#KPI-2 .row').innerHTML = html;

                            finalDataObj.push({
                                "chartsid": criteria,
                                "charttype": "chart",
                                "chartjson": JSON.stringify(chartJson),
                                "chartname": `criteria`,
                                "chart": document.querySelector(".chart-selections button.bg-success")?.getAttribute("chart_type")
                            });
                            _entitySummary.chartsJson = finalDataObj;

                            $("#Homepage_CardsList_Wrapper").show();
                        } else {
                            handleNoChartData();
                        }
                    }

                    // Load additional resources and initialize UI
                    var LoadIframe = callParentNew("LoadIframe");
                    var cardsData = {}, cardsDesign = {}, xmlMenuData = "", menuJson = "";
                    let cardsDashboardObj = {
                        dirLeft: true,
                        enableMasonry: false,
                        homePageType: "cards",
                        isCardsDashboard: true,
                        isMobile: isMobileDevice(),
                    };
                    var files = {
                        css: [],
                        js: []
                    };

                    // Add JavaScript and CSS files
                    files.js.push("/ThirdParty/lodash.min.js");
                    files.js.push("/ThirdParty/deepdash.min.js");
                    files.js.push("/Js/handlebars.min.js?v=1");
                    files.js.push("/Js/handleBarsHelpers.min.js");
                    files.js.push("/ThirdParty/Highcharts/highcharts.js");
                    files.js.push("/ThirdParty/Highcharts/highcharts-3d.js");
                    files.js.push("/ThirdParty/Highcharts/highcharts-more.js");
                    files.js.push("/ThirdParty/Highcharts/highcharts-exporting.js");
                    files.js.push("/Js/high-charts-functions.min.js?v=20");
                    files.js.push("/Js/AxInterface.js?v=10");
                    files.js.push("/ThirdParty/DataTables-1.10.13/media/js/jquery.dataTables.js");
                    files.js.push("/ThirdParty/DataTables-1.10.13/media/js/dataTables.bootstrap.js");
                    files.js.push("/ThirdParty/DataTables-1.10.13/extensions/Extras/moment.min.js");
                    files.css.push("/ThirdParty/fullcalendar/lib/main.min.css");
                    files.js.push("/ThirdParty/fullcalendar/lib/main.min.js");

                    if (cardsDashboardObj.isMobile) {
                        files.js.push("/ThirdParty/jquery-ui-touch-punch-master/jquery.ui.touch-punch.min.js");
                    }

                    if (cardsDashboardObj.enableMasonry) {
                        files.js.push("/ThirdParty/masonry/masonry.pkgd.min.js");
                    }

                    files.js.push(`/js/entity-charts.min.js?v=1`);

                    if (document.getElementsByTagName("body")[0].classList.contains("btextDir-rtl")) {
                        cardsDashboardObj.dirLeft = false;
                    }

                    loadAndCall({
                        files: files,
                        callBack: () => {

                            $(function () {

                                ShowDimmer(true);
                                deepdash(_);
                                var cardVisibleArray = [];
                                //var chartsJson = _entity.getEntityChartsData();


                                cardsData.value = JSON.stringify(_entitySummary.chartsJson);
                                cardsDesign.value = JSON.stringify(cardVisibleArray);
                                xmlMenuData = "";

                                //start cards dasboard Init

                                if (xmlMenuData != "") {
                                    xmlMenuData = xmlMenuData.replace(/'/g, "'");
                                    var xml = parseXml(xmlMenuData)
                                    var xmltojson = xml2json(xml, "");
                                    menuJson = JSON.parse(xmltojson);
                                }
                                appGlobalVarsObject._CONSTANTS.menuConfiguration = $.extend(true, {},
                                    appGlobalVarsObject._CONSTANTS.menuConfiguration, {
                                    menuJson: menuJson,
                                });
                                // try {

                                appGlobalVarsObject._CONSTANTS.cardsPage = {
                                    setCards: false,
                                    cards: []
                                }

                                $.axpertUI.options.cardsPage.cards = [];
                                appGlobalVarsObject._CONSTANTS.cardsPage = $.extend(true, {},
                                    appGlobalVarsObject._CONSTANTS.cardsPage, {
                                    setCards: true,
                                    cards: (JSON.parse(cardsData.value !== "" ? ReverseCheckSpecialChars(cardsData.value) : "[]",
                                        function (k, v) {
                                            try {
                                                return (typeof v === "object" || isNaN(v) || v.toString().trim() === "") ? v : (typeof v == "string" && (v.startsWith("0") || v.startsWith("-")) ? parseFloat(v, 10) : JSON.parse(v));
                                            } catch (ex) {
                                                return v;
                                            }
                                            //0 & - starting with does not gets parsed in json.parse
                                            //json.parse is used because it porcess int, float and boolean together
                                        }
                                    ) || []).map(arr => _.mapKeys(arr, (value, key) => key.toString().toLowerCase())),
                                    design: (JSON.parse(cardsDesign.value !== "" ? cardsDesign.value : "[]",
                                        function (k, v) {
                                            try {
                                                return (typeof v === "object" || isNaN(v) || v.toString().trim() === "") ? v : (typeof v == "string" && (v.startsWith("0") || v.startsWith("-")) ? parseFloat(v, 10) : JSON.parse(v));
                                            } catch (ex) {
                                                return v;
                                            }
                                        }
                                    ) || []).map(arr => _.mapKeys(arr, (value, key) => key.toString().toLowerCase())),
                                    enableMasonry: cardsDashboardObj.enableMasonry,
                                    staging: {
                                        iframes: ".splitter-wrapper",
                                        cardsFrame: {
                                            div: ".cardsPageWrapper",
                                            cardsDiv: "#Homepage_CardsList_Wrapper",
                                            cardsDesigner: ".cardsDesigner",
                                            cardsDesignerToolbar: ".designer",
                                            editSaveButton: ".editSaveCardDesign",
                                            icon: "span.material-icons",
                                            divControl: "#arrangeCards"
                                        },
                                    }
                                });

                                var lcm = appGlobalVarsObject.lcm;
                                var tempaxpertUIObj = $.axpertUI
                                    .init({
                                        isHybrid: appGlobalVarsObject._CONSTANTS.isHybrid,
                                        isMobile: cardsDashboardObj.isMobile,
                                        compressedMode: appGlobalVarsObject._CONSTANTS.compressedMode,
                                        dirLeft: cardsDashboardObj.dirLeft,
                                        axpertUserSettings: {
                                            settings: appGlobalVarsObject._CONSTANTS.axpertUserSettings
                                        },
                                        cardsPage: appGlobalVarsObject._CONSTANTS.cardsPage
                                    });

                                appGlobalVarsObject._CONSTANTS.cardsPage = tempaxpertUIObj.cardsPage;

                                ShowDimmer(false);
                            });

                            $.axpertUI.cardsPage._addCardHeader = function (cardElement, card) {
                                cardElement.find(".card-header").addClass("d-none");

                            }
                        }
                    });


                } catch (e) {
                    console.error("Error processing summary data:", e);
                }
            }

        });
    }

    getEntityCaption(transId) {
        let _this = this;
        let data = _this.selectedEntitiesList;
        for (let i = 0; i < data.length; i++) {
            if (data[i].name === transId) {
                return data[i].caption;
            }
        }
        return '';
    }

    constructSelectedEntityHeader() {
        var selectedHtml = `<label id="selectedLabel" class="selected-name">Selected Entities</label>`;
        var entityHtml = ""; // Variable for all items HTML
    
        let _this = this;
    
        // Loop through the selected entities to create HTML
        _this.selectedEntitiesList.forEach(function (item, index) {
            var initials = _entityCommon.getInitials(item.caption);
    
            selectedHtml += ` <div data-cardname="${item.caption}" onclick="toggleSelection(${index})" class="EntityData_Select-lists col-lg-3 col-md-3 col-sm-12 col-xs-3">
                                    <div class="EntityData_Select-Items selected">
                                        <div class="symbol symbol-40px symbol-circle me-2">
                                            <img alt="" class="w-40px cardsIcons" src="../images/homepageicon/${item.caption}.png" 
                                                onerror="this.onerror=null;this.src='../images/homepageicon/default.png';">
                                        </div>
                                        <h6 class="Entity-title" title="${item.caption}" value="${item.name}">
                                            ${item.caption}(${item.name})
                                        </h6>
                                    </div>

                                </div>`;
        });
    
        // Append selected items HTML above the existing list
        $("#selectedEntitiesContainer").html(selectedHtml);
    
        // Loop through the selected entities again to create HTML for all items
        $.each(_this.selectedEntitiesList, function (index, item) {
            var selectedClass = index === 0 ? "active" : "";
            var initials = _entityCommon.getInitials(item.caption);
            entityHtml += `<li class="nav-item" onclick="selectEntity(this, '${item.name}')" data-cardname="${item.caption}" dt_transid="${item.name}">
                                <div class="symbol symbol-40px symbol-circle me-2">
                                    <img alt="" class="w-40px cardsIcons" src="../images/homepageicon/${item.caption}.png" 
                                        onerror="this.onerror=null;this.src='../images/homepageicon/default.png';">
                                </div>
                                <a class="nav-link ${selectedClass}" href="#">${item.caption}</a>
                            </li>`;
        });
    
        // Update the main container with all items
        $("#dv_EntityContainer").html(entityHtml);
    
        // Additional logic to handle other elements
        var firstAnchorGroup = $('#Data-Group-container .Data-Group_Items:first a');
        var parentElement = $(firstAnchorGroup).parent();
        $(".Data-Group_Items").removeClass("selected");
        $(parentElement).addClass("selected");
    
        var firstAnchorAgg = $('.Aggregation-item:first');
        $(".Aggregation-item").removeClass("selected");
        $(firstAnchorAgg).addClass("selected");            
        $('#entityModal').modal('hide');
    }
  
    constructEntityPopup(entityList) {
        var entityHtml = "";
        
        // Iterate over the entity list to construct the HTML for non-selected entities
        $.each(entityList, function (index, item) {
            // Check if the item is not already selected
            if (!selectedItemsArray.map(e => e.toLowerCase()).includes(item.name.toLowerCase())) {
                var initials = _entityCommon.getInitials(item.caption);
    
                entityHtml += `<div data-cardname="${item.caption}" onclick="selectEntityToAdd('${item.caption}', '${item.name}', this)" 
                                class="EntityData_Select-lists col-lg-3 col-md-3 col-sm-12 col-xs-3">
                                    <div class="EntityData_Select-Items">
                                        <div class="symbol symbol-40px symbol-circle me-2">
                                            <img alt="" class="w-40px cardsIcons" src="../images/homepageicon/${item.caption}.png" 
                                                onerror="this.onerror=null;this.src='../images/homepageicon/default.png';">
                                        </div>
                                        <h6 class="Entity-title" title="${item.caption}" value="${item.name}">
                                            ${item.caption}(${item.name})
                                        </h6>
                                    </div>
                                    
                            </div>`;
            }
        });
    
        $("#entityDataContainer").html(entityHtml);
    
        $('#entityModal').modal('show');
    
        $('#entityDataContainer .EntityData_Select-lists').each(function () {
            var entityData = $(this).find('.Entity-title').attr('value').toLowerCase();
            if (selectedItemsArray.map(e => e.toLowerCase()).includes(entityData)) {
                $(this).hide();
            }
        });
    }
    

    constructXandYAxis(metaData, calledFrom) {
        let _this = this;
        $("#Data-Group-container").html("");
        $("#Aggregation_Wrapper").html("");
        let groupHtml = "";
        let aggHtml = "";
    
        // Default X axis (Aggregation)
        aggHtml += `<div class="col-lg-3 col-sm-4 Aggregation-Item-wrap agg-count" data-dcname="Count">
                        <a href="#" class="Aggregation-item" onclick="selectAggField(this)">
                            <div class="Aggregation-icon">
                                <span class="material-icons material-icons-style material-icons-2">bar_chart</span>
                            </div>
                            <div class="Aggregation-content">
                                <h6 class="subtitle"  data-fldname="Count">Count</h6>
                            </div>
                        </a>
                    </div>`;
    
        // Default Y axis (Grouping)
        groupHtml += `<div class="Data-Group_Items group-all" data-dcname="All">
                        <a href="#" class="group-item" onclick="selectGroupField(this)">
                            <div class="d-flex">
                                <div class="symbol symbol-40px symbol-circle me-5" style="margin-left:5px !important;">
                                    <div class="symbol-label bgs1">
                                        <span class="material-icons material-icons-style material-icons-2">date_range</span>
                                    </div>
                                </div>
                                <div class="d-flex flex-column y-axis-caption">
                                    <span class="Data-Group-name" nonmandatory="F" normalized="F" data-fldname="All" srctbl="All" srcfld="All">All</span>
                                </div>
                            </div>
                        </a>
                      </div>`;
    
        const xAxisFieldsArr = this.xAxisFields && this.xAxisFields.trim() !== "" && this.xAxisFields.trim()  !== "All" ? this.xAxisFields.split(",") : [];
        const yAxisFieldsArr = this.yAxisFields && this.yAxisFields.trim() !== "" && this.yAxisFields.trim() !== "All" ? this.yAxisFields.split(",") : [];

        function getSortOrder(fieldName) {
            if (xAxisFieldsArr.includes(fieldName)) {
                return xAxisFieldsArr.indexOf(fieldName);
            } else if (yAxisFieldsArr.includes(fieldName)) {
                return yAxisFieldsArr.indexOf(fieldName) + xAxisFieldsArr.length;
            }
            return -1;
        }

        if (xAxisFieldsArr.length > 0) {
            let filteredMetaData = metaData.filter(item => xAxisFieldsArr.includes(item.fldname));
            const sortedMetaData = filteredMetaData.sort((a, b) => getSortOrder(a.fldname) - getSortOrder(b.fldname));
            $.each(sortedMetaData, function (index, item) {
                if (item.aggfield === "T") {
                    aggHtml += _this.getAggFldHtml(item);
                }
            });
        }
        else {
            $.each(metaData, function (index, item) {
                if (item.aggfield === "T" && item.hide === "F") {
                    aggHtml += _this.getAggFldHtml(item);
                }
            });
        }

        if (yAxisFieldsArr.length > 0) {
            let filteredMetaData = metaData.filter(item => yAxisFieldsArr.includes(item.fldname));
            const sortedMetaData = filteredMetaData.sort((a, b) => getSortOrder(a.fldname) - getSortOrder(b.fldname));
            $.each(sortedMetaData, function (index, item) {
                if (item.grpfield === "T" && (item.cdatatype === "DropDown" || item.fdatatype === "c" || item.fdatatype === "d")) {
                    groupHtml += _this.getGroupFldHtml(item);
                }
            });
        }
        else {
            $.each(metaData, function (index, item) {
                if (item.grpfield === "T" && item.hide === "F" && (item.cdatatype === "DropDown" || item.fdatatype === "c" || item.fdatatype === "d")) {
                    groupHtml += _this.getGroupFldHtml(item);
                }
            });
        }
       
        $("#Data-Group-container").html(groupHtml);
        $("#Aggregation_Wrapper").html(aggHtml);
    
        if (calledFrom === "Entity Selection" || calledFrom === "Page Load") {
            const ftransidItem = metaData.find(item => item.ftransid);
            let ftransid = ftransidItem ? ftransidItem.ftransid : "default";    

            _entitySummary.getAnalyticsChartsDataWS({
                page: "Analytics",
                transId: ftransid,
                aggField: "count",
                aggTransId: ftransid,
                groupField: "all",
                groupTransId: ftransid,
                aggFunc: "count"
            });
    
            const firstAnchorGroup = $('#Data-Group-container .Data-Group_Items:first a');
            const parentElement = $(firstAnchorGroup).parent();
            $(".Data-Group_Items").removeClass("selected"); 
            $(parentElement).addClass("selected");
    
            const firstAnchorAgg = $('.Aggregation-item:first');
            $(".Aggregation-item").removeClass("selected"); 
            $(firstAnchorAgg).addClass("selected");
        }
    
        if (calledFrom === "Entity Selection") {
            $('#entityModal').modal('hide');
        }
    }       

    getGroupFldHtml(item) {
        return `
        <div class="Data-Group_Items" data-fldname="${item.fldname}" data-dcname="${item.dcname}" data-griddc="${item.griddc}">
            <a href="#" class="group-item" onclick="selectGroupField(this)" >
                <div class="d-flex ">
                    <div class="symbol symbol-40px symbol-circle me-5" style="margin-left:5px !important;">
                        <div class="symbol-label bgs1">
                            <span class="material-icons material-icons-style material-icons-2">date_range</span>
                        </div>
                    </div>
                    <div class="d-flex flex-column y-axis-caption">
                        <span class="Data-Group-name" data-fldname="${item.fldname}">${item.fldcap || item.fldname}</span>
                    </div>
                </div>
            </a>
        </div>`;
    }

    getAggFldHtml(item) {
        return `
        <div class="col-lg-3 col-sm-4 Aggregation-Item-wrap" data-fldname="${item.fldname}" data-dcname="${item.dcname}" data-griddc="${item.griddc}">
            <a href="#" class="Aggregation-item" onclick="selectAggField(this)">
                <div class="Aggregation-icon">
                    <span class="material-icons material-icons-style material-icons-2">bar_chart</span>
                </div>
                <div class="Aggregation-content">
                    <h6 class="subtitle"  data-fldname="${item.fldname}" >${item.fldcap || item.fldname}</h6>
                </div>
                <div class="Aggregation-icon2">
                    <button type="button" onclick="handleFuncSelection(event,this)" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm bg-success" agg_function="sum" title="Sum">
                        <span class="material-icons material-icons-style material-icons-2">functions</span>
                    </button>
                    <button type="button" onclick="handleFuncSelection(event,this)" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm" agg_function="avg" title="Average">
                        <span class="material-icons material-icons-style material-icons-2">percent</span>
                    </button>
                </div>
            </a>
        </div>`;
    }

    getUrlParams() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.entityName = urlParams.get('ename');
    }


    getAllEntities() {
        let _this = this;
        let url = "../aspx/Analytics.aspx/GetEntityListWS";
        let data = {};
        this.callAPI(url, data, true, result => {
            if (result.success) {
                let listJson = JSON.parse(JSON.parse(result.response).d);
                _this.allEntitiesList = listJson.result.list;;
                _this.constructEntityPopup(this.allEntitiesList);
            } else {
                console.log("Error fetching all entity list");
            }
        });
    }

    reloadAnalyticsPage() {
        parent.ShowDimmer(true);
        parent.LoadIframe(`../aspx/Analytics.aspx`)
    }

    callAPI(url, data, async, callBack) {
        let _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, async);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        if (_this.isAxpertFlutter) {
            xhr.setRequestHeader('Authorization', `Bearer ${armToken}`);
            data["armSessionId"] = armSessionId;
        }
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    callBack({ success: true, response: this.responseText });
                }
                else {
                    _this.catchError(this.responseText);
                    callBack({ success: false, response: this.responseText });
                }
            }
        }
        xhr.send(JSON.stringify(data));
    };
    catchError(error) {
        showAlertDialog("error", error);
    };
    showSuccess(message) {
        showAlertDialog("success", message);
    };
    dataConvert(data, type) {
        if (type == "AXPERT") {
            try {
                data = JSON.parse(data.d);
                if (typeof data.result[0].result.row != "undefined") {
                    return data.result[0].result.row;
                }

                if (typeof data.result[0].result != "undefined") {
                    return data.result[0].result;
                }
            }
            catch (error) {
                ShowDimmer(false);
                this.catchError(error.message);
            };
        }
        else if (type == "ARM") {
            try {
                if (!this.isAxpertFlutter)
                    data = JSON.parse(data.d);
                if (data.result && data.result.success) {
                    if (!_entityCommon.isUndefined(data.result.data)) {
                        return data.result.data;
                    }
                }
                else {
                    if (!_entityCommon.isUndefined(data.result.message)) {
                        this.catchError(data.result.message);
                    }
                }
            }
            catch (error) {
                ShowDimmer(false);
                this.catchError(error.message);
            };
        }

        return data;
    };

    // Updated generateCustomKPIHTML function
    generateCustomKPIHTML(jsonData, caption) {
        let html = '';
        jsonData.forEach(function (obj) {
            let criterianodeResponse = obj.criteria || '';

            let criteriaItems = criterianodeResponse.split('~');
            let transid = criteriaItems[1].trim();
            let fldname = criteriaItems[2].trim();

            html += `
           <div class="col-xl-12 col-lg-12 col-sm-12 Invoice-content-wrap">
    <a href="#" class="Invoice-item" >
        <div class="Invoice-icon">
            <span class="material-icons material-icons-style material-icons-2">bar_chart</span>
        </div>
        <div class="Invoice-content" >
            <h6 class="subtitle" data-keyname="${obj.keyname || caption}" onclick="navigateToListPage('${transid}', '${fldname}', this)">${obj.keyname || caption}</h6>
            <h3 class="title">${obj.keyvalue?.toLocaleString() || 0}</h3>
        </div>
        <div class="Invoice-icon2"></div>
    </a>
</div>

        `;
        });

        // Return the generated HTML
        return html;
    }
    generateGeneralKPIHTML(data) {
        let html = '';

        html += `
        <div class="col-xl-12 col-lg-12 col-sm-12 Invoice-content-wrap">
            <a href="#" class="Invoice-item">
                <div class="Invoice-icon">
                    <span class="material-icons material-icons-style material-icons-2">bar_chart</span>
                </div>
                <div class="Invoice-content">
                    <h6 class="subtitle" onclick="navigateToPeriod('total')">Total</h6>
                    <h3 class="title">${data.totrec || 0}</h3>
                </div>
                <div class="Invoice-icon2"></div>
            </a>
        </div>
    `;

        if (data.cyear !== 0) {
            html += `
            <div class="col-xl-12 col-lg-12 col-sm-12 Invoice-content-wrap">
                <a href="#" class="Invoice-item">
                    <div class="Invoice-icon">
                        <span class="material-icons material-icons-style material-icons-2">bar_chart</span>
                    </div>
                    <div class="Invoice-content">
                        <h6 class="subtitle" onclick="navigateToPeriod('year')">This year</h6>
                        <h3 class="title">${data.cyear || 0}</h3>
                    </div>
                    <div class="Invoice-icon2"></div>
                </a>
            </div>
        `;
        }

        if (data.cmonth !== 0) {
            html += `
            <div class="col-xl-12 col-lg-12 col-sm-12 Invoice-content-wrap">
                <a href="#" class="Invoice-item">
                    <div class="Invoice-icon">
                        <span class="material-icons material-icons-style material-icons-2">bar_chart</span>
                    </div>
                    <div class="Invoice-content">
                        <h6 class="subtitle" onclick="navigateToPeriod('month')">This month</h6>
                        <h3 class="title">${data.cmonth || 0}</h3>
                    </div>
                    <div class="Invoice-icon2"></div>
                </a>
            </div>
        `;
        }

        if (data.cweek !== 0) {
            html += `
            <div class="col-xl-12 col-lg-12 col-sm-12 Invoice-content-wrap">
                <a href="#" class="Invoice-item">
                    <div class="Invoice-icon">
                        <span class="material-icons material-icons-style material-icons-2">bar_chart</span>
                    </div>
                    <div class="Invoice-content">
                        <h6 class="subtitle" onclick="navigateToPeriod('week')">This week</h6>
                        <h3 class="title">${data.cweek || 0}</h3>
                    </div>
                    <div class="Invoice-icon2"></div>
                </a>
            </div>
        `;
        }

        if (data.cyesterday !== 0) {
            html += `
            <div class="col-xl-12 col-lg-12 col-sm-12 Invoice-content-wrap">
                <a href="#" class="Invoice-item">
                    <div class="Invoice-icon">
                        <span class="material-icons material-icons-style material-icons-2">bar_chart</span>
                    </div>
                    <div class="Invoice-content">
                        <h6 class="subtitle" onclick="navigateToPeriod('yesterday')">Yesterday</h6>
                        <h3 class="title">${data.cyesterday || 0}</h3>
                    </div>
                    <div class="Invoice-icon2"></div>
                </a>
            </div>
        `;
        }

        if (data.ctoday !== 0) {
            html += `
            <div class="col-xl-12 col-lg-12 col-sm-12 Invoice-content-wrap">
                <a href="#" class="Invoice-item">
                    <div class="Invoice-icon">
                        <span class="material-icons material-icons-style material-icons-2">bar_chart</span>
                    </div>
                    <div class="Invoice-content">
                        <h6 class="subtitle" onclick="navigateToPeriod('today')">Today</h6>
                        <h3 class="title">${data.ctoday || 0}</h3>
                    </div>
                    <div class="Invoice-icon2"></div>
                </a>
            </div>
        `;
        }

        return html;
    }



    filterByFldname(metaData, fldname) {
        return metaData.filter(obj => obj.fldname === fldname);
    }
    getChartCriteria(criteria) {
        let parts = criteria.split("~~");
        let result = parts.slice(0, 4).join("~~");
        return result;
    }
    
    getChartCaptions(chart) {
        let _this = this;
        if (!_this.selectedChartsObj[chart]) {
            var chartItems = chart.split("~");
            const groupfld = this.filterByFldname(this.metaData, chartItems[2]);
            const aggFld = this.filterByFldname(this.metaData, chartItems[9]);
            const aggCondVal = chartItems[0];
    
            var chartStr = "";
    
            if (groupfld.length === 0 || chartItems[2] == "") {
                if (aggCondVal === "count") {
                    chartStr = `${this.entityName} (Count)`;
                } else {
                    chartStr = `${aggFld[0].fldcap || ''} (${aggCondVal})`;
                }
            } else {
                if (aggCondVal === "count") {
                    chartStr = `${groupfld[0].fldcap || ''} wise ${aggCondVal}`;
                } else {
                    chartStr = `${groupfld[0].fldcap || ''} wise ${aggFld[0].fldcap || ''} (${aggCondVal})`;
                }
            }
    
            _this.selectedChartsObj[chart] = chartStr;
        }
        return _this.selectedChartsObj[chart];
    }
       
    checkAppmanagerAccess() {
        if (!_entityCommon.isAppManager()) {
            document.querySelector("#Entity_Summary_Wrapper .card-header .Tkts-toolbar-Right").innerHTML = "";

        }
    }
}

$(document).ready(function () {
    _entityCommon = new EntityCommon();
    _entitySummary = new EntitySummary();
    _entitySummary.init();

    $('#searchEntity').keyup(function (event) {
        applyEntitySearch();
    }).change(function (event) {
        applyEntitySearch();
    });


    $(document).keydown(function (e) {
        switch (e.which) {
            case 37: // left
                moveselection('left');
                break;

            case 38: // up
                moveselection('up'); // Treat up as previous in vertical list
                break;

            case 39: // right
                moveselection('right');
                break;

            case 40: // down
                moveselection('down'); // Treat down as next in vertical list
                break;

            default: return;
        }
        e.preventDefault();
    });
});

function applyEntitySearch() {
    var txt = $('#searchEntity').val().trim().toLowerCase();

    if (txt === "") {
        $("#entityDataContainer .EntityData_Select-lists, #selectedEntitiesContainer .EntityData_Select-lists").removeClass("d-none");
    } else {
        // Filter in entityDataContainer
        $("#entityDataContainer .EntityData_Select-lists").addClass("d-none");
        var filteredEntityDataDivs = $("#entityDataContainer").find('.EntityData_Select-lists').filter(function () {
            return $(this).text().toLowerCase().indexOf(txt) > -1;
        });
        filteredEntityDataDivs.removeClass("d-none");

        // Filter in selectedEntitiesContainer
        $("#selectedEntitiesContainer .EntityData_Select-lists").addClass("d-none");
        var filteredSelectedEntitiesDivs = $("#selectedEntitiesContainer").find('.EntityData_Select-lists').filter(function () {
            return $(this).text().toLowerCase().indexOf(txt) > -1;
        });
        filteredSelectedEntitiesDivs.removeClass("d-none");
    }
}


function selectGroupField(anchor) {
    var parentElement = $(anchor).parent();
    $(".Data-Group_Items").removeClass("selected");
    $(parentElement).addClass("selected");

    var groupFieldName = $(anchor).find(".Data-Group-name").attr("data-fldname").toLowerCase();

    var aggFieldName = $(".Aggregation-item.selected").find(".subtitle").attr("data-fldname").toLowerCase();

    var selectedItem = _entitySummary.metaData.find(item => item.fldname === groupFieldName);

    var groupField = groupFieldName === "all" ? "all" : groupFieldName;
    var aggField = aggFieldName || "count";
    
    var aggFunc = $(".Aggregation-item.selected").find("button.bg-success").attr("agg_function") || "count";
    
    var transId = groupFieldName === "all" ? _entitySummary.entityTransId : selectedItem ? selectedItem.ftransid : null;

    if (!groupField || !aggField || !transId) {
        console.error("One or more required fields are missing from the selected item.");
        return;
    }

    if (groupField === "all" || (selectedItem && selectedItem.griddc === "F")) {
        showAllXAxis();
    } else {
        constructXandYAxisForSelectedGroup(groupField);
    }

    _entitySummary.getAnalyticsChartsDataWS({
        page: "Analytics",
        transId: transId,
        aggField: aggField,
        aggTransId: transId,
        groupField: groupField,
        groupTransId: transId,
        aggFunc: aggFunc 
    });
}




function constructXandYAxisForSelectedGroup(selectedDc) {


    document.querySelectorAll(".Aggregation-Item-wrap").forEach(aggFld => {
        aggFld.classList.add("d-none");

        let fldDcName = aggFld.dataset.dcname;

        if (fldDcName == "Count" || fldDcName == selectedDc) {
            aggFld.classList.remove("d-none");
        }
    });


    let selectedAggregation = document.querySelector(".Aggregation-item.selected");
    if (selectedAggregation.closest('.Aggregation-Item-wrap').classList.contains("d-none")) {
        selectedAggregation.classList.remove("selected");
        document.querySelector(".agg-count .Aggregation-item").classList.add("selected");
    }
}

function showAllXAxis() { 
    document.querySelectorAll(".Aggregation-Item-wrap.d-none").forEach(aggFld => {
        aggFld.classList.remove("d-none");
    });

}

function selectEntityToAdd(ename, transid, imgtag) {
    var entityElem = $(imgtag).find(".EntityData_Select-Items");

    // Toggle selection state
    if (entityElem.hasClass('selected')) {
        entityElem.removeClass("selected");
        if (selectedItemsArray.includes(transid)) {
            selectedItemsArray = selectedItemsArray.filter(id => id !== transid);
        }
    } else {
        entityElem.addClass("selected");
        if (!selectedItemsArray.includes(transid)) {
            selectedItemsArray.push(transid);
        }
    }
}


function selectAggField(anchor, chartType) {
    $(".Aggregation-item").removeClass("selected"); 
    $(anchor).addClass("selected"); 

    // Get the selected aggregation field name (x-axis)
    var selectedFldName = $(anchor).find(".subtitle").attr("data-fldname");

    // Get the selected group field name (y-axis)
    var groupFieldName = $(".Data-Group_Items.selected").attr("data-fldname");

    var selectedItem = _entitySummary.metaData.find(item => item.fldname === selectedFldName);

    var groupField = "all";
    var aggField = "count"; 
    var aggFunc = "count";  
    var transId = null;     

    if (selectedFldName === "Count") {
        groupField = groupFieldName || "all"; 
        aggField = "count"; 
        aggFunc = "count"; 
        transId = _entitySummary.entityTransId; 
    } else if (selectedItem) {
        aggFunc = $(anchor).find("button.bg-success").attr("agg_function");
        groupField = groupFieldName || "all"; 
        aggField = selectedFldName; 
        transId = selectedItem.ftransid; 
    }

    if (!groupField || !aggField || !aggFunc || (selectedFldName !== "count" && !transId)) {
        console.error("One or more required fields are missing from the selected item.");
        return;
    }

    _entitySummary.getAnalyticsChartsDataWS({
        page: "Analytics",
        transId: transId,
        aggField: aggField,
        aggTransId: transId,
        groupField: groupField,
        groupTransId: transId,
        aggFunc: aggFunc,
        chartType: chartType       
    });
}




function handleFuncSelection(event, button) {
    event.stopPropagation(); 
    var parentDiv = button.closest('.Aggregation-icon2');
    parentDiv.querySelectorAll('button').forEach(function (btn) {
        btn.classList.remove('bg-success');
    });
    button.classList.add('bg-success');
    button.closest('.Aggregation-item').click();
}

function chartSelectionClick(event, button) {
    event.stopPropagation(); 

    var parentDiv = button.closest('.chart-selections');
    parentDiv.querySelectorAll('button').forEach(function (btn) {
        btn.classList.remove('bg-success');
    });

    button.classList.add('bg-success');

    var chartType = button.getAttribute('chart_type');
    var selectedAnchor = $(".Aggregation-item.selected").get(0); 

    if (selectedAnchor) {
        selectAggField(selectedAnchor, chartType);
    } else {
        console.error("No aggregation field is selected.");
    }
}


function entityModelClose() {

    //$('#dvModalFilter').html("");
    $('#entityModal').modal('hide');
}
function resetSelection() {
    $('#entityDataContainer .selected').removeClass('selected');

    var data = {
        page: "Analytics",
        transId: "",
        properties: { "Entities": "" },
        allUsers: false
    }

    _entityCommon.setAnalyticsDataWS(data, successCB = () => {
        window.location.reload();
    }, errorCB = (error) => {
        showAlertDialog("error", error.status + " " + error.statusText);
    })
}




function saveSelectedEntities() {
    var entitiesToKeep = _entitySummary.selectedEntitiesList.filter(item => !item.toBeRemoved);
    _entitySummary.selectedEntitiesList.forEach(item => {
        item.toBeRemoved = false;
    });

    var updatedSelectedEntities = entitiesToKeep.map(item => item.name).concat(selectedItemsArray);

    if (updatedSelectedEntities.length > 0) {
        selectedItemsArray = updatedSelectedEntities;
    
        $('#entityDataContainer .EntityData_Select-lists').each(function () {
            var entityData = $(this).find('.Entity-title').attr('value').toLowerCase();
            if (updatedSelectedEntities.map(e => e.toLowerCase()).includes(entityData)) {
                $(this).hide();
            }
        });

        var data = {
            page: "Analytics",
            transId: "",
            properties: { "Entities": updatedSelectedEntities.join(",") },
            allUsers: false
        }

        _entityCommon.setAnalyticsDataWS(data, successCB = () => {
            window.location.reload();
        }, errorCB = (error) => {
            showAlertDialog("error", error.status + " " + error.statusText);
        })

    } else {
      
        showAlertDialog("error", "Please select at least one entity to proceed.");
        return; 
    }
}


function selectEntity(elem, transId) {
    document.querySelectorAll("#dv_EntityContainer .nav-link.active").forEach(nav => nav.classList.remove('active'));
    elem.querySelector(".nav-link").classList.add('active');
    
    _entitySummary.entityTransId = transId;
    _entitySummary.entityName = _entitySummary.getEntityCaption(transId);
    
    fetchEntityData(transId);
}


function moveselection(direction) {
    switch (direction) {
        case 'up':
            var anchor = $('.Data-Group_Items.selected');
            var prevelem = $(anchor).prev('.Data-Group_Items');
            if (prevelem.length > 0) {
                $(".Data-Group_Items").removeClass("selected");
                $(prevelem).addClass("selected");
                $(prevelem).find(".group-item").click();
            } else {
                var lastElem = $('.Data-Group_Items').last();
                $(".Data-Group_Items").removeClass("selected");
                $(lastElem).addClass("selected");
                $(lastElem).find(".group-item").click();
            }
            break;

        case 'down':
            var anchor = $('.Data-Group_Items.selected');
            var nextelem = $(anchor).next('.Data-Group_Items');
            if (nextelem.length > 0) {
                $(".Data-Group_Items").removeClass("selected");
                $(nextelem).addClass("selected");
                $(nextelem).find(".group-item").click();
            } else {
                var firstElem = $('.Data-Group_Items').first();
                $(".Data-Group_Items").removeClass("selected");
                $(firstElem).addClass("selected");
                $(firstElem).find(".group-item").click();
            }
            break;

        case 'left':
            var anchor = $(".Aggregation-item.selected");
            var parent = $(anchor).closest('.Aggregation-Item-wrap');
            var prevelem = $(parent).prev().find('.Aggregation-item').last(); 
            if (prevelem.length === 0) {
                prevelem = $(parent).siblings().last().find('.Aggregation-item').last();
            }
            if (prevelem.length > 0) {
                $(".Aggregation-item").removeClass("selected");
                $(prevelem).addClass("selected");
                $(prevelem).click();
            }
            break;

        case 'right':
            var anchor = $(".Aggregation-item.selected");
            var parent = $(anchor).closest('.Aggregation-Item-wrap');
            var nextelem = $(parent).next().find('.Aggregation-item').first(); 
            if (nextelem.length === 0) {
                nextelem = $(parent).siblings().first().find('.Aggregation-item').first();

                moveselection('down');
            }
            if (nextelem.length > 0) {
                $(".Aggregation-item").removeClass("selected");
                $(nextelem).addClass("selected");
                $(nextelem).click();
            }
            break;
    }
}


function reloadPage() {
    window.location.reload();
}
function ShowDimmer(status) {

    DimmerCalled = true;
    var dv = $("#waitDiv");

    if (dv.length > 0 && dv != undefined) {
        if (status == true) {

            var currentfr = $("#middle1", parent.document);
            if (currentfr) {
                dv.width(currentfr.width());
            }
            dv.show();
            document.onkeydown = function EatKeyPress() {
                return false;
            }
        } else {
            dv.hide();
            document.onkeydown = function EatKeyPress() {
                if (DimmerCalled == true) {
                    return true;
                }
            }
        }
    } else {
        //TODO:Needs to be tested
        if (window.opener != undefined) {

            dv = $("#waitDiv", window.opener.document);
            if (dv.length > 0) {
                if (status == true)
                    dv.show();
                else
                    dv.hide();
            }
        }
    }
    DimmerCalled = false;
}
function openEntitySelection() {
    if ($("#entityDataContainer").html() == "")
        _entitySummary.getAllEntities();
    else
        $('#entityModal').modal('show');
}


function openFieldSelection() {

    $('#fieldsModal').modal('show');
    // if ($('#fields-selection').html() == "")
        createFieldsLayout();
}

function createFieldsLayout() {
    const fieldsContainer = document.getElementById("fields-selection");

    const xAxisFields = _entitySummary.xAxisFields || "All";
    const yAxisFields = _entitySummary.yAxisFields || "All";

    // Split xAxisFields and yAxisFields into arrays, if not 'All'
    const xAxisArray = xAxisFields === "All" ? [] : xAxisFields.split(",");
    const yAxisArray = yAxisFields === "All" ? [] : yAxisFields.split(",");

    var grpFields = _entitySummary.metaData.filter(item => item.grpfield === "T" && (item.cdatatype === "DropDown" || item.fdatatype === "c" || item.fdatatype === "d"));
    var aggFields = _entitySummary.metaData.filter(item => item.aggfield === "T");

    function reorderFields(fields, selectedFields) {
        return fields.sort((a, b) => {
            const aSelected = selectedFields.includes(a.fldname);
            const bSelected = selectedFields.includes(b.fldname);

            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;

            const aIndex = selectedFields.indexOf(a.fldname);
            const bIndex = selectedFields.indexOf(b.fldname);
            return aIndex - bIndex; 
        });
    }

    var orderedAggFields = reorderFields(aggFields, xAxisArray);
    var orderedGrpFields = reorderFields(grpFields, yAxisArray);

    var html = '';
    if (orderedAggFields.length) {
        html += `
        <div class="card KC_Items">
            <div class="card-header collapsible cursor-pointer rotate" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#fields-aggFields">
                <h3 class="card-title">Aggregate Fields (X-axis)</h3>
                <div class="card-toolbar rotate-180">
                    <span class="material-icons material-icons-style material-icons-2">expand_circle_down</span>
                </div>
            </div>
            <div class="KC_Items_Content collapse show heightControl pt-0---" id="fields-aggFields">
            <table class="table table-hover">
                <tbody id="fields-table-body">`;
        orderedAggFields.forEach(fld => {
            let fldname = `${fld.fldcap || ''}  (${fld.fldname}) (${fld.dcname}) ${fld.hide == "T" ? "(Hidden)" : ""}`;
            html += `<tr><td><input type="checkbox" id="chk_${fld.fldname}" class="chk-fields chk-relateddataflds" value="${fld.fldname}" data-fldcap="${fld.fldcap || ''}"></td>
            <td><label for="chk_${fld.fldname}">${fldname}</label></td></tr>`;
        });
        html += `</tbody></table></div></div>`;
    }

    if (orderedGrpFields.length) {
        html += `
        <div class="card KC_Items">
            <div class="card-header collapsible cursor-pointer rotate" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#fields-grpFields">
                <h3 class="card-title">Group Fields (Y-axis)</h3>
                <div class="card-toolbar rotate-180">
                    <span class="material-icons material-icons-style material-icons-2">expand_circle_down</span>
                </div>
            </div>
            <div class="KC_Items_Content collapse show heightControl pt-0---" id="fields-grpFields">
            <table class="table table-hover">
                <tbody id="fields-table-body">`;
        orderedGrpFields.forEach(fld => {
            let fldname = `${fld.fldcap || ''}  (${fld.fldname})  (${fld.dcname}) ${fld.hide == "T" ? "(Hidden)" : ""}`;
            html += `<tr><td><input type="checkbox" id="chk_${fld.fldname}" class="chk-fields chk-relateddataflds" value="${fld.fldname}" data-fldcap="${fld.fldcap || ''}"></td>
            <td><label for="chk_${fld.fldname}">${fldname}</label></td></tr>`;
        });
        html += `</tbody></table></div></div>`;
    }

    fieldsContainer.innerHTML = html;

    const checkFields = document.querySelectorAll(".chk-fields");

    // If "All" is selected for the X-axis, check all Aggregate Fields checkboxes
    if (xAxisFields === "All") {
        checkFields.forEach(checkbox => {
            if (orderedAggFields.some(fld => checkbox.id === `chk_${fld.fldname}`)) {
                checkbox.checked = true;
            }
        });
    }

    // If "All" is selected for the Y-axis, check all Group Fields checkboxes
    if (yAxisFields === "All") {
        checkFields.forEach(checkbox => {
            if (orderedGrpFields.some(fld => checkbox.id === `chk_${fld.fldname}`)) {
                checkbox.checked = true;
            }
        });
    }

    // Handle manual checkbox selection
    xAxisArray.forEach(fld => {
        if (fld !== "All") {
            const checkbox = document.querySelector(`#chk_${fld}`);
            if (checkbox) {
                checkbox.checked = true;
            } else {
                console.warn(`Checkbox with ID #chk_${fld} not found.`);
            }
        }
    });

    yAxisArray.forEach(fld => {
        if (fld !== "All") {
            const checkbox = document.querySelector(`#chk_${fld}`);
            if (checkbox) {
                checkbox.checked = true;
            } else {
                console.warn(`Checkbox with ID #chk_${fld} not found.`);
            }
        }
    });

    checkFields.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            const allChecked = checkFields.length === document.querySelectorAll(".chk-fields:checked").length;
            document.querySelector("#check-all").checked = allChecked;
        });
    });

    const checkAllCheckbox = document.getElementById("check-all");
    checkAllCheckbox.addEventListener("change", function () {
        const isChecked = checkAllCheckbox.checked;
        checkFields.forEach((checkbox) => {
            checkbox.checked = isChecked;
        });
    });
}






function applyFields() {
    const selectedFields = document.querySelectorAll(".chk-fields:checked");

    if (selectedFields.length === 0) {
        showAlertDialog("error", "Error: No fields are selected.");
        return; 
    }

    // Get the child divs by their IDs
    const aggFieldsDiv = document.getElementById("fields-aggFields");
    const grpFieldsDiv = document.getElementById("fields-grpFields");

    let xAxisFields = [];
    let yAxisFields = [];

    selectedFields.forEach((field) => {
        const fieldName = field.value;
        const parentDiv = field.closest(".card");

        if (parentDiv) {
            if (aggFieldsDiv && aggFieldsDiv.contains(field.closest("div"))) {
                xAxisFields.push(fieldName);
            } else if (grpFieldsDiv && grpFieldsDiv.contains(field.closest("div"))) {
                yAxisFields.push(fieldName);
            }
        }
    });

    xAxisFields = xAxisFields.join(",");
    yAxisFields = yAxisFields.join(",");

    // Store the selected fields
    //_entityCommon.storeSelectedFields(xAxisFields, yAxisFields);

    const dataPayload = {
        page: "Analytics",
        transId: _entitySummary.entityTransId,
        properties: {
            "xAxisFields": xAxisFields,
            "yAxisFields": yAxisFields,
        },
        allUsers: false
    };
    _entityCommon.setAnalyticsDataWS(dataPayload, successCB = () => {
        const transId = _entitySummary.entityTransId; 
    
        const dataTransIdElement = document.querySelector(`[dt_transid="${transId}"]`);
    
        if (dataTransIdElement) {
            fieldsModelClose();
            selectEntity(dataTransIdElement, transId); 
        } else {
            console.error(`Element with dt_transid="${transId}" not found`);
        }
    }, errorCB = (error) => {
        showAlertDialog("error", error.status + " " + error.statusText);
    });
    
}


function resetFields() {
    const checkFields = document.querySelectorAll(".chk-fields , #check-all");
    checkFields.forEach((checkbox) => {
        checkbox.checked = true;
    })
    _entitySummary.fields = "All";
    _entitySummary.setSelectedFields();
}

function fieldsModelClose() {
    $('#fieldsModal').modal('hide');
}


document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('dv_EntityContainer');
    let dragSrcEl = "";
    let dragImage = "";

    function handleDragStart(e) {
        dragSrcEl = this;

        // Create a clone of the element being dragged
        dragImage = dragSrcEl.cloneNode(true);
        dragImage.classList.add('drag-image');
        document.body.appendChild(dragImage);

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        e.dataTransfer.setData('text/html', this.innerHTML);

        this.classList.add('dragging');
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Allow drop
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        if (this !== dragSrcEl) {
            this.classList.add('over');
        }
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // Prevent default drop behavior
        }
    
        if (dragSrcEl !== this) {
            const items = Array.from(container.querySelectorAll('.nav-item'));
            const srcIndex = items.indexOf(dragSrcEl);
            const targetIndex = items.indexOf(this);
    
            if (srcIndex < targetIndex) {
                this.after(dragSrcEl);
            } else {
                this.before(dragSrcEl);
            }
        }
    
        // Remove the custom drag image
        if (dragImage && dragImage.parentNode) {
            dragImage.parentNode.removeChild(dragImage);
        }
    
        const newOrder = Array.from(container.querySelectorAll('.nav-item'))
            .map(item => item.getAttribute('dt_transid')).join(',');
    
        var data = {
            page: "Analytics",
            transId: "",
            properties: { "Entities": newOrder },
            allUsers: false
        }

        _entityCommon.setAnalyticsDataWS(data, successCB = () => { }, errorCB = (error) => {
            showAlertDialog("error", error.status + " " + error.statusText);
        })
    
        return false;
    }
    

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        items.forEach(function (item) {
            item.classList.remove('over');
        });

        // Remove the custom drag image if not already removed
        if (dragImage && dragImage.parentNode) {
            dragImage.parentNode.removeChild(dragImage);
        }
    }

    function addDragAndDropHandlers(item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    }

    // Initially add drag and drop handlers to existing elements
    let items = container.querySelectorAll('.nav-item');
    items.forEach(function (item) {
        item.setAttribute('draggable', 'true');
        addDragAndDropHandlers(item);
    });

    // MutationObserver to observe changes in the dv_EntityContainer
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('nav-item')) {
                        node.setAttribute('draggable', 'true');
                        addDragAndDropHandlers(node);
                    }
                });
            }
        });
    });

    observer.observe(container, {
        childList: true,
    });
});



// X-axis draggable code

document.addEventListener('DOMContentLoaded', function () {
    const axcontainer = document.getElementById('Data-Group-container');
    let dragSrcEl = '';
    let dragClone = null;

    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';

        dragClone = this.cloneNode(true);
        dragClone.style.position = 'absolute';
        dragClone.style.top = '-1000px';
        document.body.appendChild(dragClone);

        e.dataTransfer.setDragImage(dragClone, e.offsetX, e.offsetY);

        this.classList.add('dragging');
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        if (this !== dragSrcEl) {
            this.classList.add('over');
        }
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    
        if (dragSrcEl !== this) {
            const items = Array.from(axcontainer.querySelectorAll('.Data-Group_Items:not(.first-item):not(.selected)'));
            const srcIndex = items.indexOf(dragSrcEl);
            const targetIndex = items.indexOf(this);
    
            if (srcIndex < targetIndex) {
                this.after(dragSrcEl);
            } else {
                this.before(dragSrcEl);
            }
    
            items.forEach(item => {
                const icon = item.querySelector('.material-icons');
                if (icon) {
                    icon.style.color = item.dataset.initialColor;
                }
            });
    
            const updatedItems = Array.from(axcontainer.querySelectorAll('.Data-Group_Items:not(.first-item):not(.selected)'));
            const yOrder = updatedItems.map(item => item.getAttribute('data-fldname'));
            console.log("Updated yOrder:", yOrder);
    
            const selectedFldName = dragSrcEl.getAttribute('data-fldname');
            console.log("Selected fldname:", selectedFldName);
    
            const metadataItem = _entitySummary.metaData.find(meta => meta["fldname"] === selectedFldName);
    
            if (metadataItem) {
                const transId = metadataItem.ftransid;
                console.log("Found ftransid:", transId);
    
                const dataPayload = {
                    page: "Analytics",
                    transId: transId,  
                    properties: {
                        "yAxisFields": yOrder.join(','),
                    },
                    allUsers: false
                };
    
                _entityCommon.setAnalyticsDataWS(dataPayload, successCB = () => { }, errorCB = (error) => {
                    showAlertDialog("error", error.status + " " + error.statusText);
                })
            } else {
                console.warn("Metadata item not found for selected fldname:", selectedFldName);
            }
        }
    
        return false;
    }
    
    

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        const items = Array.from(axcontainer.querySelectorAll('.Data-Group_Items:not(.first-item):not(.selected)'));
        items.forEach(function (item) {
            item.classList.remove('over');
        });

        if (dragClone) {
            document.body.removeChild(dragClone);
            dragClone = null;
        }
    }

    function addDragAndDropHandlers(item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    }

    const firstItem = axcontainer.querySelector('.Data-Group_Items:first-child');
    if (firstItem) {
        firstItem.classList.add('first-item');
    }

    let items = axcontainer.querySelectorAll('.Data-Group_Items:not(.first-item):not(.selected)');
    items.forEach(function (item) {
        item.setAttribute('draggable', 'true');

        const icon = item.querySelector('.material-icons');
        if (icon) {
            item.dataset.initialColor = window.getComputedStyle(icon).color;
        }
        addDragAndDropHandlers(item);
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('Data-Group_Items') && !node.classList.contains('selected') && !node.classList.contains('first-item')) {
                        node.setAttribute('draggable', 'true');
                        // Store the initial color of the icon
                        const icon = node.querySelector('.material-icons');
                        if (icon) {
                            node.dataset.initialColor = window.getComputedStyle(icon).color;
                        }
                        addDragAndDropHandlers(node);
                    }
                });
            }
        });
    });

    observer.observe(axcontainer, {
        childList: true,
    });
});

// y-axis dragable code


document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.getElementById('Aggregation_Wrapper');
    let dragSrcEl = '';
    let dragClone = null;

    function handleDragStart(e) {
        if (this.getAttribute('draggable') === 'false') {
            return;
        }

        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';

        dragClone = this.cloneNode(true);
        dragClone.style.position = 'absolute';
        dragClone.style.top = '-1000px';
        document.body.appendChild(dragClone);

        e.dataTransfer.setDragImage(dragClone, e.offsetX, e.offsetY);

        this.classList.add('dragging');
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        if (this !== dragSrcEl) {
            this.classList.add('over');
        }
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    
        if (dragSrcEl !== this) {
            const items = Array.from(wrapper.querySelectorAll('.Aggregation-Item-wrap'));
            const srcIndex = items.indexOf(dragSrcEl);
            const targetIndex = items.indexOf(this);
    
            if (srcIndex < targetIndex) {
                this.after(dragSrcEl);
            } else {
                this.before(dragSrcEl);
            }
    
            const updatedItems = Array.from(wrapper.querySelectorAll('.Aggregation-Item-wrap'));
            const xOrder = updatedItems.map(item => item.getAttribute('data-fldname'));
            console.log("Updated xOrder:", xOrder);
    
            const selectedFldName = dragSrcEl.getAttribute('data-fldname');
            console.log("Selected fldname:", selectedFldName);
    
            const metadataItem = _entitySummary.metaData.find(meta => meta["fldname"] === selectedFldName);
    
            if (metadataItem) {
                const transId = metadataItem.ftransid;
                console.log("Found ftransid:", transId);
    
                const dataPayload = {
                    page: "Analytics",
                    transId: transId,  
                    properties: {
                        "xAxisFields": xOrder.join(','),
                    },
                    allUsers: false
                };
    
                _entityCommon.setAnalyticsDataWS(dataPayload, successCB = () => { }, errorCB = (error) => {
                    showAlertDialog("error", error.status + " " + error.statusText);
                })
            } else {
                console.warn("Metadata item not found for selected fldname:", selectedFldName);
            }
        }
    
        return false;
    }
    
    
    function handleDragEnd(e) {
        this.classList.remove('dragging');
        const items = Array.from(wrapper.querySelectorAll('.Aggregation-Item-wrap:not(.selected)'));
        items.forEach(function (item) {
            item.classList.remove('over');
        });

        if (dragClone) {
            document.body.removeChild(dragClone);
            dragClone = null;
        }
    }

    function addDragAndDropHandlers(item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    }

    let items = wrapper.querySelectorAll('.Aggregation-Item-wrap');
    items.forEach(function (item, index) {
        if (index !== 0) {
            item.setAttribute('draggable', 'true');
            addDragAndDropHandlers(item);
        } else {
            item.setAttribute('draggable', 'false');
        }
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('Aggregation-Item-wrap')) {
                        const index = Array.from(wrapper.children).indexOf(node);
                        if (index !== 0) {
                            node.setAttribute('draggable', 'true');
                            addDragAndDropHandlers(node);
                        }
                    }
                });
            }
        });
    });

    observer.observe(wrapper, {
        childList: true,
    });
});

function toggleSelection(entityIndex) {
    var selectedItem = _entitySummary.selectedEntitiesList[entityIndex];

    selectedItem.toBeRemoved = !selectedItem.toBeRemoved;

    var selectedEntity = $(`#selectedEntitiesContainer .EntityData_Select-lists:eq(${entityIndex})`);
    selectedEntity.find('.EntityData_Select-Items').toggleClass('selected');

    var anySelected = _entitySummary.selectedEntitiesList.some(item => !item.toBeRemoved);
    var selectedLabel = $(".selcted");
    selectedLabel.toggle(anySelected); 

    if (!selectedItem.toBeRemoved) {
        $('#entityDataContainer .EntityData_Select-lists').each(function () {
            var entityData = $(this).find('.EntityData_Select-Items').text().trim().toLowerCase();
            console.log(`Showing entity: ${entityData}`);
            if (entityData === selectedItem.name.toLowerCase()) {
                $(this).show();
            }
        });
    }
}


function navigateToListPage(transid, fldname, element) {

    if (_entityCommon.inValid(fldname)) {
        let selectedEntity = _entitySummary.selectedEntitiesList.find(entity => entity.name === transid);
        let ename = selectedEntity.caption;
        let url = `../aspx/Entity.aspx?ename=${ename}&tstid=${transid}`;

        loadEntityPage(url);
    }
    else {
        let keyname = element.getAttribute('data-keyname');

        if (_entitySummary.selectedEntitiesList && fldname) {
            let selectedEntity = _entitySummary.selectedEntitiesList.find(entity => entity.name === transid);

            if (selectedEntity) {
                let ename = selectedEntity.caption;
                let url = `../aspx/Entity.aspx?ename=${ename}&tstid=${transid}&filterval=${keyname}&filterfld=${fldname}&applyfilter=true`;

                loadEntityPage(url);
            } else {
                console.error(`Entity not found for transid: ${transid}`);
            }
        } else {
            console.error(`selectedEntitiesList or fldname is undefined`);
        }
    }
}

function navigateToPeriod(period) {
    let transid = _entitySummary.entityTransId;

    if (_entitySummary.selectedEntitiesList) {
        let selectedEntity = _entitySummary.selectedEntitiesList.find(entity => entity.name === transid);

        if (selectedEntity) {
            let ename = selectedEntity.caption;
            let url = `../aspx/Entity.aspx?ename=${ename}&tstid=${transid}&filterval=${period}&filterfld=modifiedon`;

            if (period.trim().toLowerCase() !== 'total') {
                url += `&applyfilter=true`;
            }

            loadEntityPage(url);
        } else {
            console.error(`Entity not found for transid: ${transid}`);
        }
    } else {
        console.error(`selectedEntitiesList is undefined`);
    }
}



// Function to reload entity page with provided URL
function loadEntityPage(url) {
    parent.ShowDimmer(true);
    parent.LoadIframe(url);
}

function handleNoChartData() {
    document.querySelectorAll(".analytics-container").forEach(item => {
        item.classList.add("d-none");
    })
    document.querySelector(".nodata").classList.remove("d-none");
}

function handleValidChartData() {
    document.querySelectorAll(".analytics-container").forEach(item => {
        item.classList.remove("d-none");
    })
    document.querySelector(".nodata").classList.add("d-none");
}


// document.addEventListener("DOMContentLoaded", function() {
//     var wrapper = document.querySelector(".Summary_Charts");
//     var footer = document.querySelector(".card-footer-bottom"); 

//     if (wrapper && footer) {
//         wrapper.addEventListener("mouseenter", function() {
//             footer.classList.add("show");
//         });

//         wrapper.addEventListener("mouseleave", function() {
//             footer.classList.remove("show");
//         });
//     } else {
//         console.log("Either .Summary_Charts or .card-footer-bottom element not found.");
//     }
// });


function fetchEntityData(transId, callback) {
    $.ajax({
        url: top.window.location.href.toLowerCase().substring(0, top.window.location.href.toLowerCase().indexOf("/aspx/")) + '/aspx/Analytics.aspx/GetAnalyticsEntityWS',
        type: 'POST',
        cache: false,
        async: true,
        dataType: 'json',
        data: JSON.stringify({ page: "Analytics", transId: transId }),
        contentType: "application/json",
        success: function (data) {
            if (data && data.d) {
                let pageLoadData = JSON.parse(data.d);
                let { "xAxisFields": xAxisFields, "yAxisFields": yAxisFields } = pageLoadData.result.data.Properties;

                _entitySummary.xAxisFields = xAxisFields || "All";
                _entitySummary.yAxisFields = yAxisFields || "All";

                _entitySummary.metaData = pageLoadData.result.data.MetaData;
                _entitySummary.entityTransId = pageLoadData.result.data.TransId;
                _entitySummary.entityName = _entitySummary.getEntityCaption(_entitySummary.entityTransId);

                _entitySummary.constructXandYAxis(_entitySummary.metaData, "Page Load");
            }
        },
        error: function (error) {
            console.error("Error fetching entity data:", error);
        }
    });
}
