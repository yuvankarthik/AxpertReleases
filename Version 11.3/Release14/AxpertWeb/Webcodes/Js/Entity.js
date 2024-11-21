let tableViewFlag = ''; 
let removedKeys = new Set();
let isEditMode = "";
let isFetching = false;
let lastScrollTop = 0;
let lastScrollLeft = 0;
var dtCulture = eval(callParent('glCulture'));
var _entity;
var _entityCommon;
var appliedFilterObj = {};
let currentEditFieldId = null;
let filterChanged = false;
// let isToggling = false;  // Initialize as false

var rowData
var pageNo = 1;

class Entity {
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
        this.nullRowsHtml = `Configure the fields properly in the 'Select Field(s)' option`;
        this.filter = "";
        this.fields = "All";
        this.keyField = '';
        this.filterObj = {};
        this.applyFilter = false;
        this.applyFilterStr = "";
        this.applyFilterId = "";
        this.allowCreate = true;
        this.isLastPage = false;

    }

    init() {
        parent.ShowDimmer(false);
    
        // Get URL parameters and validate entity name
        this.getUrlParams();
        if (this.inValid(this.entityName)) {
            this.catchError("Invalid Entity details");
            return;
        }
        
        this.applyTheme();
        document.querySelector("#EntityTitle").innerHTML = this.entityName;
        document.title = this.entityName;
        const myDiv = document.getElementById('body_Container');
    
        try {
            var data = {
                page: "Entity", 
                transId: _entity.entityTransId,
                propertiesList: ["tableView"], 
            };
            _entityCommon.getAnalyticsDataWS(data, (data) => {
                const tableData = typeof data === 'string' ? JSON.parse(data) : data;
                tableViewFlag = typeof tableData.result.data.tableView === 'string' 
                ? tableData.result.data.tableView.toUpperCase() === "TRUE" 
                : !!tableData.result.data.tableView;
    
                entityListDataJson = entityListDataJson.replaceAll(`"{`, `{`)
                    .replaceAll(`}"`, `}`)
                    .replaceAll(`"[`, `[`)
                    .replaceAll(`]"`, `]`);
                entityListDataJson = JSON.parse(entityListDataJson);
                this.metaData = entityListDataJson.result.metadata;
    
                var metadataEntry = this.metaData.find(meta => meta.dcname === 'dc1');
                var tablename = metadataEntry ? metadataEntry.tablename : null;
    
                this.metaData.push({
                    "ftransid": this.entityTransId,
                    "fcaption": this.entityName,
                    "fldname": "modifiedon",
                    "fldcap": "Modified on",
                    "cdatatype": "Date",
                    "fdatatype": "d",
                    "fmodeofentry": "calculate",
                    "hide": "F",
                    "props": null,
                    "normalized": "F",
                    "allowempty": "T",
                    "filtertype": "Text",
                    "tablename": tablename,
                    "dcname": "dc1"
                });
                this.metaData.push({
                    "ftransid": this.entityTransId,
                    "fcaption": this.entityName,
                    "fldname": "modifiedby",
                    "fldcap": "Modified by",
                    "cdatatype": "DropDown",
                    "fdatatype": "c",
                    "fmodeofentry": "calculate",
                    "hide": "F",
                    "props": null,
                    "normalized": "F",
                    "allowempty": "T",
                    "filtertype": "Text",
                    "tablename": tablename,
                    "dcname": "dc1"
                });
    
                // Parse the entity list data
                this.listJson = entityListDataJson.result.list?.[0]?.data_json ?? [];
                this.fields = entitySelectedFlds || "All";
                this.keyField = entityKeyField || "";
                this.maxPageNumber = getMaxPageNumber(this.listJson);
    
                // Apply filters if needed
                if (this.applyFilter) {
                    var [filterFld, filterValue] = this.applyFilterStr.split('^^^');
                    var filterFldJson = this.metaData.find(i => i.fldname == filterFld);
                    this.applyFilterId = getCurrentTimestamp();
                    var tmpFilterObj = {};
    
                    // Handle different filter field types
                    let pillText = filterValue;
                    let dateString;
    
                    if (filterFldJson.cdatatype?.toUpperCase() == "DROPDOWN" || filterFldJson.fmodeofentry?.toUpperCase() == "SELECT") {
                        tmpFilterObj[this.applyFilterId] = {
                            pillText: pillText,
                            isChecked: false
                        };
                        tmpFilterObj[this.applyFilterId][filterFld] = `DROPDOWN,${filterValue}`;
                    } else if (filterFldJson.cdatatype?.toUpperCase() == "DATE" && filterFldJson.fldname == "modifiedon") {
                        switch (filterValue) {
                            case 'year':
                                dateString = 'this_yearOption';
                                pillText = 'This year';
                                break;
                            case 'month':
                                dateString = 'this_monthOption';
                                pillText = 'This month';
                                break;
                            case 'week':
                                dateString = 'this_weekOption';
                                pillText = 'This week';
                                break;
                            case 'day':
                                dateString = 'todayOption';
                                pillText = 'Today';
                                break;
                            case 'yesterday':
                                dateString = 'yesterdayOption';
                                pillText = 'Yesterday';
                                break;
                        }
                    
                        tmpFilterObj[this.applyFilterId] = {
                            pillText: pillText,
                            isChecked: false
                        };
                        tmpFilterObj[this.applyFilterId][filterFld] = `DATE,${dateString}`;
                    } else if (filterFldJson.cdatatype?.toUpperCase() == "SIMPLE TEXT") {
                        tmpFilterObj[this.applyFilterId] = {
                            pillText: pillText || filterValue,
                            isChecked: false
                        };
                        tmpFilterObj[this.applyFilterId][filterFld] = `SIMPLE TEXT,${filterValue}`;
                    } else if (filterFldJson.cdatatype?.toUpperCase() == "AUTO GENERATE") {
                        tmpFilterObj[this.applyFilterId] = {
                            pillText: pillText || "Auto-generated",
                            isChecked: false
                        };
                        tmpFilterObj[this.applyFilterId][filterFld] = `AUTOGENERATE,${filterValue}`;
                    } else if (filterFldJson.cdatatype?.toUpperCase() == "CHECK BOX") {
                        tmpFilterObj[this.applyFilterId] = {
                            pillText: pillText || (filterValue ? "Checked" : "Unchecked"),
                            isChecked: filterValue // Assuming filterValue is a boolean indicating if the checkbox is checked or not
                        };
                        tmpFilterObj[this.applyFilterId][filterFld] = `CHECKBOX,${filterValue}`;
                    } else if (filterFldJson.cdatatype?.toUpperCase() == "SHORT TEXT") {
                        tmpFilterObj[this.applyFilterId] = {
                            pillText: pillText || filterValue,
                            isChecked: false
                        };
                        tmpFilterObj[this.applyFilterId][filterFld] = `SHORT TEXT,${filterValue}`;
                    } else if (filterFldJson.cdatatype?.toUpperCase() == "LARGE TEXT") {
                        tmpFilterObj[this.applyFilterId] = {
                            pillText: pillText || (filterValue ? filterValue.substring(0, 50) + '...' : "No Text"), // Show a truncated version for large text
                            isChecked: false
                        };
                        tmpFilterObj[this.applyFilterId][filterFld] = `LARGE TEXT,${filterValue}`;
                    }
                    
                    
                    
                    if (entityFilters)
                        entityFilters = JSON.stringify(tmpFilterObj);
                    else
                        entityFilters = JSON.stringify(tmpFilterObj);
                }
    
                if (entityFilters) {
                    this.filterObj = JSON.parse(entityFilters)
                    createPill(this.filterObj);
                }


                if (this.listJson?.length > 0) {
                    myDiv.addEventListener('scroll', function () {
                        if (isScrollAtBottomWithinDiv(myDiv)) {
                            var newPageNo = _entity.maxPageNumber + 1;
                            _entity.getEntityListData(newPageNo);
                        }
                    });
    
                    this.populateInitialView();
                    this.bindEvents();
                    this.initCharts();
                    parent.ShowDimmer(false);
                } else if (this.applyFilter) {
                    if (document.querySelector(`.${this.applyFilterId}`))
                        document.querySelector(`.${this.applyFilterId}`).click()
                }
    
            }, (error) => {
                showAlertDialog("error", "Error occurred while fetching Entity data. Please check with administrator.");
                console.error(error);
            });
    
        } catch (error) {
            showAlertDialog("error", "Error occurred. Please check with administrator.");
            console.error(error);
        }
    }
    
    

    populateInitialView() {
        const myDiv = document.getElementById('body_Container');
    
        myDiv.removeEventListener('scroll', scrollListener);
    
        if (tableViewFlag) {
            toggleView();
        } else {
            createListHTML(this.listJson, pageNo);
    
            myDiv.addEventListener('scroll', scrollListener);
        }
    
        $('[data-toggle="tooltip"]').tooltip();
        initReadMore();
    }
    

    getEntityListData(pageNo) {
        //parent.ShowDimmer(true);
        let _this = this;
        let url = "../aspx/Entity.aspx/GetEntityListDataWS";
        
        let data = { transId: _this.entityTransId, fields: _this.fields, pageNo: pageNo, pageSize: _this.pageSize, filter: _this.filter };
    
        if (_this.isLastPage) {
            parent.ShowDimmer(false);
            return;
        }
    
        this.callAPI(url, data, false, result => {
            setTimeout(function () {
                filterModelClose();
            }, 1);
    
            if (result.success) {
                parent.ShowDimmer(false);
                let listJson = JSON.parse(JSON.parse(result.response).d);
                listJson = listJson.result.list?.[0]?.data_json ?? "[]";
    
                try {
                    if (listJson.constructor != Array)
                        listJson = JSON.parse(listJson);
                }
                catch {
                    showAlertDialog("error", "Error occurred in data fetch.");
                    return;
                }
    
                if (listJson.length === 0) {
                    if (pageNo === 1) {
                        _this.listJson = [];
                        document.querySelector("#body_Container").innerHTML = _this.emptyRowsHtml;
                        document.querySelector("#table-body_Container").innerHTML = _this.emptyRowsHtml;
                    } else {
                        _this.isLastPage = true;
                        noMoreRecordsMessage.style.display = 'block';
                        setTimeout(function () {
                            noMoreRecordsMessage.style.display = 'none';
                        }, 3000);
                    }
                    return;
                } else {
                    if (pageNo === 1) {
                        _this.listJson = [];
                        document.querySelector("#body_Container").innerHTML = "";
                        document.querySelector("#table-body_Container").innerHTML = "";
                    }
    
                    _this.listJson.push(...listJson);
    
                    _this.maxPageNumber = pageNo;
    
                    const createHTMLFunction = (_entity.viewMode === 'table') ? createTableViewHTML : createListHTML;
                    createHTMLFunction(_this.listJson, pageNo);
    
                    $('[data-toggle="tooltip"]').tooltip();
                    initReadMore();
                }
            } else {
                parent.ShowDimmer(false);
            }
        });
    }
    

    hideChartsMenu() {
        document.querySelector("#add_chart")?.click();
    }

    openEntityForm(entityName, transId, recordId, keyValue, rowNo) {
        let _this = this;
        _this.updateRelatedData(transId, rowNo);
        //parent.ShowDimmer(true);
        var url = `../aspx/EntityForm.aspx?ename=${entityName}&tstid=${transId}&recid=${recordId}&keyval=${keyValue}`;
        parent.LoadIframe(url);
    }

    updateRelatedData(transId, rowNo) {
        let _this = this;
        if (!window.top.entityNavList)
            window.top.entityNavList = {};

        window.top.entityNavList[transId] = _this.getNearestRecords(rowNo);
        window.top.entityNavList.lastTransId = transId;
        window.top.entityNavList.lastCaption = `Other ${_this.entityName}`;
    }

    getSelectedChartsCriteria() {
        let _this = this;
        let criteriaArr = [];
        _this.selectedCharts.split("^").forEach((chart) => {
            var chartItems = chart.split("~");
            const grpFldVal = chartItems[1];
            const aggFldVal = chartItems[2];
            if (grpFldVal != "") {
                const fldData = _this.chartsMetaData["GroupFld"][grpFldVal];
                criteriaArr.push(`${chart}~${fldData.normalized}~${fldData.srctable || ""}~${fldData.srcfield || ""}~${fldData.allowempty}~${fldData.tablename}~~`);
            }
            else {
                const fldData = _this.chartsMetaData["AggFld"][aggFldVal];
                criteriaArr.push(`${chart}~${fldData.normalized}~${fldData.srctable || ""}~${fldData.srcfield || ""}~${fldData.allowempty}~${fldData.tablename}~~`);
            }
        })
        return criteriaArr.join("^");
    }

    getChartCriteria(criteria) {
        let parts = criteria.split("~");
        let result = parts.slice(0, 4).join("~");
        return result;
    }

    getEntityChartsData(condition) {
        let _this = this;
        let url = "../aspx/Entity.aspx/GetEntityChartsDataWS";

        var criteria = ""
        if (condition == "General") {
            criteria = '';
        }
        else {
            criteria = _this.getSelectedChartsCriteria();
        }

        let data = { entityName: _this.entityName, transId: _this.entityTransId, condition: condition, criteria: criteria };
        this.callAPI(url, data, true, result => {
            if (result.success) {

                if (condition == "General") {
                    _this.kpiJson = JSON.parse(JSON.parse(result.response).d);
                    var kpiJson = JSON.parse(_this.kpiJson.result.charts[0].data_json)[0];
                    var html = _this.generateGeneralKPIHTML(kpiJson);
                    document.querySelector('#KPI-2 .row').innerHTML = html;
                    return;
                }
                else {
                    document.querySelector("#Homepage_CardsList_Wrapper").innerHTML = "";
                    _this.chartsJson = JSON.parse(JSON.parse(result.response).d);
                    //_this.chartsJson.result.charts = JSON.parse(_this.chartsJson.result.charts[0].data_json);
                    try {
                        //const groupedChartData = {};
                        //_this.chartsJson.result.charts.forEach(chartsData => {
                        //    var chartData = JSON.parse(chartsData.data_json);
                        //    chartData.forEach(item => {
                        //        const { criteria, keyname, keyvalue } = item;

                        //        if (!groupedChartData[criteria]) {
                        //            groupedChartData[criteria] = [];
                        //        }

                        //        groupedChartData[criteria].push({ "data_label": keyname, "value": keyvalue });
                        //    });
                        //});



                        var finalDataObj = [];


                        //Object.entries(groupedChartData).forEach(([key, value]) => {
                        _this.chartsJson.result.charts.forEach(chartsData => {
                            let tempChartJson = JSON.parse(chartsData.data_json);
                            let criteria = _this.getChartCriteria(tempChartJson[0].criteria);

                            var chartJson = JSON.parse(chartsData.data_json).map(item => {
                                return { data_label: item.keyname, value: item.keyvalue };
                            });

                            finalDataObj.push({
                                "chartsid": criteria,
                                "charttype": "chart",
                                "chartjson": JSON.stringify(chartJson),
                                "chartname": `${_this.selectedChartsObj[criteria]}`

                            });

                        });

                        //_this.chartsJson.result.charts.forEach(entry => {
                        //    finalDataObj.push({
                        //        "chartsid": entry.criteria,
                        //        "charttype": "chart",
                        //        "chartjson": JSON.stringify({ "data_label": entry.keyname, "value": entry.keyvalue }),  //entry.data_json.replaceAll("keyname", "data_label").replaceAll("keyvalue", "value"),
                        //        "chartname": `${this.selectedChartsObj[entry.criteria]}`

                        //    });
                        //});

                        _this.chartsJson = finalDataObj;

                    }

                    catch (e) {
                        console.log("Error in charts" + e);
                        return;
                    }


                }
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


                            cardsData.value = JSON.stringify(_this.chartsJson);
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

                            cardElement.find(".card-title").attr("title", (card["chartname"] || "")).find("headerContent").replaceWith(card["chartname"] || "");
                            cardElement.find(".card-header").attr("data-bs-target", `#${card["chartsid"].replaceAll("~", "")}`);
                            cardElement.find(".KC_Items_Content").attr("id", `${card["chartsid"].replaceAll("~", "")}`);
                            cardElement.attr("title", (card["chartname"] || ""));


                            var toolBarHtml = `<span class="material-icons material-icons-style" onclick="_entity.deleteChart('${card["chartsid"]}')">close</span>`;
                            cardElement.find("toolbarContent").replaceWith(toolBarHtml);

                        }
                    }
                });
            }
        });
        //return chartsJson;
    }

    getEntityChartsMetaData() {
        let _this = this;
        let url = "../aspx/Entity.aspx/GetEntityChartsMetaDataWS";
        let data = { entityName: _this.entityName, transId: _this.entityTransId };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                let metaDataJson = JSON.parse(JSON.parse(result.response).d);
                _this.createChartsFieldsForSelection();

                _this.getSelectedCharts();
            }
        });
    }

    createChartsFieldsForSelection() {
        let _this = this;

        const groupedFields = {
            "GroupFld": {},
            "AggFld": {}
        };

        const gfldSelect = document.querySelector("select#grpFld");
        _this.metaData.filter(chart => chart.grpfield === "T" && chart.listingfld === "T").forEach(chart => {
            const option = document.createElement("option");
            option.value = chart.fldname;
            option.textContent = `${chart.fldcap || ''}(${chart.fldname})`;
            gfldSelect.appendChild(option);

            groupedFields["GroupFld"][chart.fldname] = {
                "cnd": chart.cnd,
                "fldcap": chart.fldcap || '',
                "fldname": chart.fldname,
                "normalized": chart.normalized,
                "allowempty": chart.allowempty,
                "srctable": chart.srctable,
                "srcfield": chart.srcfield,
                "tablename": chart.tablename
            };
        });

        const aEntSelect = document.querySelector("select#subEnt");
        if (aEntSelect) {
            const option = document.createElement("option");
            option.value = _this.entityTransId;
            option.textContent = `${_this.entityName}(${_this.entityTransId})`;
            aEntSelect.appendChild(option);
        }

        const afldSelect = document.querySelector("select#aggFld");
        _this.metaData.filter(chart => chart.aggfield === "T" && chart.listingfld === "T").forEach(chart => {
            const option = document.createElement("option");
            option.value = chart.fldname;
            option.textContent = `${chart.fldcap || ''}(${chart.fldname})`;
            afldSelect.appendChild(option);

            groupedFields["AggFld"][chart.fldname] = {
                "cnd": chart.cnd,
                "fldcap": chart.fldcap || '',
                "fldname": chart.fldname,
                "normalized": chart.normalized,
                "allowempty": chart.allowempty,
                "srctable": chart.srctable,
                "srcfield": chart.srcfield,
                "tablename": chart.tablename

            };
        });

        document.getElementById('aggFld').addEventListener('change', function () {
            const aggCondSelect = document.getElementById('aggCond');
            if (this.value === 'count') {
                aggCondSelect.value = 0;
                aggCondSelect.disabled = true;
            } else {
                aggCondSelect.value = "sum";
                aggCondSelect.disabled = false;
            }
        });

        this.chartsMetaData = groupedFields;
    }

    getSelectedCharts() {
        let _this = this;
        let url = "../aspx/Entity.aspx/GetSelectedEntityChartsWS";
        let data = { transId: _this.entityTransId };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                _this.selectedCharts = JSON.parse(result.response).d;
                if (_this.selectedCharts != "") {
                    _this.getEntityChartsData('Custom');
                    _this.getChartCaptions();
                    document.querySelector(".NO-KPI-Items").classList.add("d-none");
                }
                else {
                    document.querySelector(".NO-KPI-Items").classList.remove("d-none");
                }
                ShowDimmer(false);
            } else {
                ShowDimmer(false);
            }
        });
    }

    setSelectedCharts(chart) {
        let _this = this;
        if (chart) {
            if (_this.selectedCharts) {
                var chartsArr = _this.selectedCharts.split('^')
                chartsArr.push(chart);
                chartsArr = [...new Set(chartsArr)];
                _this.selectedCharts = chartsArr.join("^");
            }
            else {
                this.selectedCharts = chart;
            }
        }

        let url = "../aspx/Entity.aspx/SetSelectedEntityChartsWS";
        let data = { transId: _this.entityTransId, charts: _this.selectedCharts };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                //_this.reloadEntityPage();
                _this.getEntityChartsData('Custom');
                _this.getChartCaptions();
                _this.hideChartsMenu();
                ShowDimmer(false);
            } else {
                _this.hideChartsMenu();
                ShowDimmer(false);
            }
        });
    }

    clearChartSelection() {
        if (!confirm("Clear all Charts?"))
            return;

        let _this = this;
        _this.selectedCharts = "";
        _this.selectedChartsObj = {};
        let url = "../aspx/Entity.aspx/SetSelectedEntityChartsWS";
        let data = { transId: _this.entityTransId, charts: "" };
        this.callAPI(url, data, true, result => {
            _this.hideChartsMenu();
        });
        document.querySelector("#Homepage_CardsList_Wrapper").innerHTML = "";
        document.querySelector(".NO-KPI-Items").classList.remove("d-none");
    }

    applyChartSelection() {
        let _this = this;
        var grpFldVal = document.getElementById("grpFld").value;
        var grpFldData = _this.chartsMetaData["GroupFld"][grpFldVal];
        var aggCondVal = document.getElementById("aggCond").value;
        var aggFldVal = document.getElementById("aggFld").value;
        if (aggFldVal == "count")
            aggCondVal = "count";
        else if (aggCondVal == 0) {
            showAlertDialog("error", "Select a valid Display function");
            document.getElementById("aggCond").focus();
            return;
        }

        //if (grpFldVal == 0) {
        //    showAlertDialog("error", "Select a valid Group By Field");
        //    document.getElementById("grpFld").focus();
        //    return;
        //}

        if (grpFldVal == 0)
            grpFldVal = "";
        //const aggFldData = _this.chartsMetaData["AggFld"][aggFldVal];

        //groupp fld~~AggFld~~agg fnc~~normalized~~src table~~src fld~~allowempty        

        var chartStr = `${_this.entityTransId}~${grpFldVal}~${aggFldVal}~${aggCondVal}`;// ~${grpFldData.normalized}~~${grpFldData.srctable || ""}~~${grpFldData.srcfield || ""}~~${grpFldData.allowempty}`

        _this.setSelectedCharts(chartStr);
        document.querySelector(".NO-KPI-Items").classList.add("d-none");
    }

    getChartCaptions() {
        let _this = this;
        _this.selectedCharts.split("^").forEach((chart) => {
            var chartItems = chart.split("~");
            const grpFldVal = chartItems[1];
            const grpFldData = _this.chartsMetaData["GroupFld"][grpFldVal];
            const aggCondVal = chartItems[3];
            const aggFldVal = chartItems[2];
            const aggFldData = _this.chartsMetaData["AggFld"][aggFldVal];
            var chartStr = "";
            if (aggCondVal == "count")
                chartStr = `${grpFldData.fldcap || ''} wise ${aggCondVal}`;
            else {
                if (grpFldVal != "")
                    chartStr = `${grpFldData.fldcap || ''} wise ${aggFldData.fldcap || ''}(${aggCondVal})`;
                else
                    chartStr = `${aggFldData.fldcap || ''}(${aggCondVal})`;
            }
            _this.selectedChartsObj[chart] = chartStr;
        })
    }

    setSelectedFields() {
        let _this = this;
        let url = "../aspx/Entity.aspx/SetSelectedEntityFieldsWS";
        let data = { transId: _this.entityTransId, fields: _this.fields, keyField: _this.keyField };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                _this.reloadEntityPage();
                ShowDimmer(false);
            } else {
                ShowDimmer(false);
            }
        });
    }

    reloadPage() {
        window.location.reload();
    }

    deleteChart(chart) {
        if (!confirm("Delete this chart?"))
            return;

        let _this = this;

        if (_this.selectedCharts) {
            var chartsArr = _this.selectedCharts.split('^');
            chartsArr = chartsArr.filter(item => item !== chart);
            _this.selectedCharts = chartsArr.join("^");
        }
        else
            _this.selectedCharts = "";

        if (_this.selectedCharts == "") {
            _this.selectedChartsObj = {};
            let url = "../aspx/Entity.aspx/SetSelectedEntityChartsWS";
            let data = { transId: _this.entityTransId, charts: "" };
            this.callAPI(url, data, true, result => {
                _this.hideChartsMenu();
            });
            document.querySelector("#Homepage_CardsList_Wrapper").innerHTML = "";
            document.querySelector(".NO-KPI-Items").classList.remove("d-none");
        }
        else {
            _this.setSelectedCharts();
            document.querySelector(".NO-KPI-Items").classList.add("d-none");
        }

    }

    generateGeneralKPIHTML(data) {
        let html = '';
        html += `
            <div class="col-xl-12 col-lg-12 col-sm-12 Invoice-content-wrap">
                <a href="#" class="Invoice-item">
                    <div class="Invoice-icon">
                        <span class="material-icons material-icons-style material-icons-2">bar_chart</span><i class="fas fa-signal"></i>
                    </div>
                    <div class="Invoice-content">
                        <h6 class="subtitle">Total</h6>
                        <h3 class="title">${data.totrec}</h3>
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
                            <h6 class="subtitle">This year</h6>
                            <h3 class="title">${data.cyear}</h3>
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
                            <h6 class="subtitle">This month</h6>
                            <h3 class="title">${data.cmonth}</h3>
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
                            <h6 class="subtitle">This week</h6>
                            <h3 class="title">${data.cweek}</h3>
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
                            <h6 class="subtitle">Yesterday</h6>
                            <h3 class="title">${data.cyesterday}</h3>
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
                            <h6 class="subtitle">Today</h6>
                            <h3 class="title">${data.ctoday}</h3>
                        </div>
                        <div class="Invoice-icon2"></div>
                    </a>
                </div>
            `;
        }
        return html;
    }

    showTimeLine(processName, keyValue) {
        axTimeLineObj = new ProcessTimeLine();
        axTimeLineObj.keyvalue = keyValue;
        axTimeLineObj.processName = processName;

        if (!this.inValid(axTimeLineObj.keyvalue) && axTimeLineObj.keyvalue != "NA")
            axTimeLineObj.getTimeLineData();
    }

    initCharts() {
        let _this = this;

        _this.getEntityChartsData('General');

        _this.createChartsFieldsForSelection();
        _this.getSelectedCharts();
        //_this.getEntityChartsMetaData();

        //try {
        //    $(".filter_items select").select2({
        //        allowClear: true,
        //    });
        //} catch (error) { }
    }

    getUrlParams() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.entityName = urlParams.get('ename');
        this.entityTransId = urlParams.get('tstid');

        if (urlParams.get('applyfilter') == 'true' && urlParams.get('filterval') && urlParams.get('filterfld')) {
            this.applyFilter = true;
            this.applyFilterStr = urlParams.get('filterfld') + "^^^" + urlParams.get('filterval');
        }

    }

    bindEvents() {
        this.bindThemeEvent();
        this.bindUtilityEvent();  

    }




    openNewTstruct() {
        //parent.ShowDimmer(true);
        parent.LoadIframe(`../aspx/tstruct.aspx?transid=${this.entityTransId}`)
    }

    editEntity(recordId) {
        //parent.ShowDimmer(true);
        parent.LoadIframe(`../aspx/tstruct.aspx?transid=${this.entityTransId}&act=load&recordid=${recordId}`)
    }

    reloadEntityPage() {
        //parent.ShowDimmer(true);
        parent.LoadIframe(`../aspx/Entity.aspx?ename=${this.entityName}&tstid=${this.entityTransId}`)

    }

    bindThemeEvent() {
        var _this = this;
        var menuItems = document.querySelectorAll("#selectThemes .menu-link");

        menuItems.forEach(function (item) {
            item.addEventListener("click", function (event) {
                event.preventDefault();
                var target = this.getAttribute("data-target");
                _this.updateTheme(target);
                _this.updateActiveClass(item);
                localStorage.setItem(`selectedTheme-${_this.entityName}`, target);
            });
        });

    }

    bindUtilityEvent() {
        var _this = this;
        var utilityItems = document.querySelectorAll("#selectUtilities .menu-link");
    
        utilityItems.forEach(function (item) {
            item.addEventListener("click", function (event) {
                event.preventDefault();
                var target = this.getAttribute("data-target");
                _this.handleUtilityAction(target); 
            });
        });
    }
    
handleUtilityAction(action) {
    handleExport(action, '#table-body_Container .table');
}

    applyTheme() {
        var _this = this;
        var storedTheme = localStorage.getItem(`selectedTheme-${_this.entityName}`);
        if (storedTheme) {
            _this.updateTheme(storedTheme);
            var activeMenuItem = document.querySelector(`#selectThemes .menu-link[data-target="${storedTheme}"]`);
            if (activeMenuItem) {
                _this.updateActiveClass(activeMenuItem);
            }
        }
    }

    updateActiveClass(clickedItem) {
        var menuItems = document.querySelectorAll("#selectThemes .menu-link");
        menuItems.forEach(function (item) {
            item.classList.remove("active");
        });

        clickedItem.classList.add("active");
    }

    updateTheme(target) {
        var body = document.body;

        // Remove existing theme-related classes
        body.classList.remove("lightTheme", "blackTheme", "gradTheme", "compactTheme");

        // Add the new theme class based on the data-target attribute
        if (target === "lightTheme" || target === "light") {
            body.classList.add("lightTheme");
        } else if (target === "blackTheme" || target === "dark") {
            body.classList.add("blackTheme");
        } else if (target === "gradTheme" || target === "gradient" || target === "system") {
            body.classList.add("gradTheme");
        } else if (target === "compactTheme" || target === "pattern") {
            body.classList.add("compactTheme");
        }
    }

    //getNearestRecords(currentRow) {
    //    let _this = this;
    //    const currentIndex = _this.listJson.findIndex(record => record.rno === currentRow);

    //    if (currentIndex === -1) {
    //        return [];
    //    }

    //    let startIndex = Math.max(0, currentIndex - 5);
    //    let endIndex = Math.min(_this.listJson.length - 1, currentIndex + 4);

    //    if (currentIndex - startIndex < 5) {
    //        endIndex = Math.min(_this.listJson.length - 1, startIndex + 9);
    //    }

    //    if (endIndex - currentIndex < 5) {
    //        startIndex = Math.max(0, endIndex - 9);
    //    }

    //    return _this.listJson.slice(startIndex, endIndex + 1);
    //}

    //getNearestRecords(currentRow) {
    //    let _this = this;
    //    const currentIndex = _this.listJson.findIndex(record => record.rno === currentRow);

    //    if (currentIndex === -1) {
    //        return [];
    //    }

    //    let startIndex = Math.max(0, currentIndex - 2);
    //    let endIndex = Math.min(_this.listJson.length - 1, currentIndex + 2);

    //    return _this.listJson.slice(startIndex, endIndex + 1);
    //}

    getNearestRecords(currentRow) {
        let _this = this;
        let filteredList = _this.listJson.filter(record => _this.inValid(record[record.keycol]) === false);
        let currentIndex = filteredList.findIndex(record => record.rno === currentRow);

        if (currentIndex === -1) {
            return [];
        }

        let nearestRecords = [];

        // Add the previous record if it exists
        if (currentIndex > 0) {
            let prevRecord = { ...filteredList[currentIndex - 1], navtype: 'prev' };
            nearestRecords.push(prevRecord);
        }

        let currentRecord = { ...filteredList[currentIndex], navtype: 'current' };
        nearestRecords.push(currentRecord);

        // Add the next record if it exists
        if (currentIndex < filteredList.length - 1) {
            let nextRecord = { ...filteredList[currentIndex + 1], navtype: 'next' };
            nearestRecords.push(nextRecord);
        }

        return nearestRecords;
    }

    setSelectedFilters(filters) {
        console.log("Received Filters:", filters)
        let parsedFilter = JSON.parse(filters)
        for (let keys in parsedFilter) {
            if (parsedFilter[keys].isChecked === false)
                delete (parsedFilter[keys])
        }
        filters = JSON.stringify(parsedFilter)
        let res;
        let _this = this;
        let url = "../aspx/Entity.aspx/SetSelectedEntityFiltersWS";
        let data = { transId: _this.entityTransId, filters: filters };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                res = true;
            } else {
                res = false;
            }
        });
        return res
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
                    if (!this.isUndefined(data.result.data)) {
                        return data.result.data;
                    }
                }
                else {
                    if (!this.isUndefined(data.result.message)) {
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

    generateFldId() {
        return `fid${Date.now()}${Math.floor(Math.random() * 90000) + 10000}`;
    };

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

}

class Field {
    constructor(fieldData) {
        this.fldcap = fieldData.fldcap || '';
        this.fldname = fieldData.fldname;
        this.cdatatype = fieldData.cdatatype;
        this.fdatatype = fieldData.fdatatype;
        this.moe = fieldData.moe;
        this.hide = fieldData.hide;
        this.props = fieldData.props;
    }
}

class EntityMetaData {
    constructor(jsonData) {
        if (!jsonData || !Array.isArray(jsonData)) {
            throw new Error('Invalid JSON data');
        }

        // Map each field data to a Field object
        this.metadata = jsonData.map(fieldData => new Field(fieldData));
    }
}



function createListHTML(listJson, pageNo) {
    let bodyContainer = $('#body_Container');

    if (!isCardView) {
        bodyContainer.html('');  
    }

    let html = '';
    const filteredRows = filterRowsByPage(listJson, pageNo); 
    var largeTextElements = [];
    var attachmentElements = [];
    var otherElements = [];
    var buttonElements = [];

    // Iterate over the metadata array to categorize fields
    $.each(_entity.metaData, function (index, field) {
        if (field.hide === 'T') {
            return true; // Skip hidden fields
        }

        var fldType = getFieldDataType(field).toUpperCase(); // Determine field type
        if (fldType === "BUTTON") {
            buttonElements.push(field);
        } else if (fldType === "ATTACHMENTS") {
            attachmentElements.push(field);
        } else if (fldType === "LARGE TEXT") {
            largeTextElements.push(field);
        } else {
            otherElements.push(field);
        }
    });

    var keyCol = _entity.keyField;
    var isRowsAdded = false;

    // Loop through each row of filtered data
    for (var rowData of filteredRows) {
        if (!rowData.hasOwnProperty(keyCol)) {
            keyCol = getKeyField(_entity.metaData.filter(item => item.listingfld === "T")).fldname;
        }

        rowData.keycol = keyCol;
        if (!_entity.inValid(rowData[keyCol]) && rowData[keyCol] != "--") {
            isRowsAdded = true;

            Object.entries(rowData).forEach(([key, value]) => {
                if (_entity.inValid(_entity.fldData[key]))
                    _entity.fldData[key] = [];

                _entity.fldData[key].push(value || "");
            });

            // Constructing HTML for each card
            html += `<div class="Project_items" id="row_${rowData.recordid}">
                <div class="card">
                    <div class="col-xl-12 col-md-12 d-flex flex-column flex-column-fluid">`;

            // Card header with title and edit button
            html += ` <div class="page-Header">
                        <h3 class="card-title collapsible cursor-pointer rotate" data-bs-toggle="collapse"
                            aria-expanded="true" data-bs-target="#Sub-Entity_wrapper" >
                            <input class="Select-Project" type="checkbox" id="checkbox_${rowData.recordid}" data-recordid="${rowData.recordid}" value="">
                            <span class="Project_title" onclick="_entity.openEntityForm('${_entity.entityName}', '${rowData.transid}', '${rowData.recordid}', '${rowData[keyCol]}', ${rowData.rno})">${rowData[keyCol]}</span>
                            <input type="hidden" class="transid" id="transid_${rowData.recordid}" value="${rowData.transid}"/>
                            <input type="hidden" class="recid" id="recid_${rowData.recordid}" value="${rowData.recordid}"/>
                            <div class="Project_updates">
                            </div>
                        </h3>
                        <div id="" class="card-toolbar">
                            <div class="d-flex">
                                <div class="edit-container">
                                    <button type="button" id=""
                                        class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm me-3"
                                        data-bs-toggle="tooltip" title="Edit" data-bs-original-title="Edit"
                                        onclick="_entity.editEntity('${rowData.recordid}')">
                                        <span class="material-icons material-icons-style material-icons-2" style="color: red;">
                                            edit_note
                                        </span>
                                    </button>
                                </div>
                                <button type="submit" id=""
                                    class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm me-3 d-none"
                                    data-bs-toggle="tooltip" title="" data-bs-original-title="Options">
                                    <span class="material-icons material-icons-style material-icons-2" style="color: #47BE7D;">
                                        more_vert
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>`;

            // Modified BY Section (relative date & time)
if (!_entity.inValid(rowData.modifiedby) && !_entity.inValid(rowData.modifiedon)) {
    // Format the date part to 'DD/MM/YYYY' and keep the time part as it is
    let formattedDate = moment(rowData.modifiedon).format('DD/MM/YYYY');
    let timePart = moment(rowData.modifiedon).format('HH:mm:ss'); // Keep the time part

    var entity_realtiveTime = moment(rowData.modifiedon).fromNow();

    html += `<div class="workflow-row">
        <div class="workflow-items">
            <div class="symbol symbol-25px symbol-circle initialized" data-bs-toggle="tooltip" title="" data-bs-original-title="${rowData.modifiedby}">
                <span class="symbol-label bg-warning text-inverse-warning fw-bold">${rowData.modifiedby[0]}</span>
            </div>
            <span data-toggle="tooltip" title="Modified by: ${rowData.modifiedby}" class="Project_updates-value">${rowData.modifiedby.split("@")[0]}</span>
            <span class="Project_updates-value" data-toggle="tooltip" data-placement="top" title="Modified on: ${formattedDate} ${timePart}" data-name="${formattedDate} ${timePart}">last modified ${entity_realtiveTime}</span>
        </div>
    </div>`;
}

            // Status and timeline button
            if (rowData.axpeg_status && rowData.axpeg_status.toString() != "" && rowData.axpeg_status.toString() != "0") {
                html += `<span class="material-icons material-icons-style material-icons-2">people</span>${rowData.axpeg_status}
                    <button id="pd_timeline" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm entity-timelines" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end" data-kt-menu-attach="parent" title="Timeline">
                        <span class="material-icons material-icons-style material-icons-2">history</span>
                    </button>

                    <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light fw-bolder w-400px py-3" data-kt-menu="true" data-id="pd_timeline" data-processname="${rowData.axpeg_processname}" data-keyvalue="${rowData.axpeg_keyvalue}">
                    </div>`;
            }

            // Generate HTML for the fields (other, large text, attachment)
            html += generateRowElements(otherElements, largeTextElements, attachmentElements, rowData);

            // Generate buttons for the row
            html += generateRowButtonHTML(buttonElements, rowData);

            // Closing tags for the card
            html += `</div></div></div>`;
        }
    }

    if (filteredRows.length && !isRowsAdded) {
        bodyContainer.append(this.nullRowsHtml);
    } else if (html !== "") {
        bodyContainer.append(html);
        initReadMore(); // Initialize read more for large text fields
        KTMenu.init(); // Initialize the menu for timeline buttons

        // Initialize timeline behavior for each row
        document.querySelectorAll(".entity-timelines").forEach((item) => {
            KTMenu.getInstance(item).on("kt.menu.dropdown.show", function (item) {
                var popOver = KTMenu.getInstance(item).element;
                popOver.innerHTML = `<div id="TimeLine_overall" class="content">
                    <div class="card" id="Timeline-wrap">
                        <h1 class="Timeline-heading">Timeline</h1>
                        <ul class="Timel-sessions full-session d-none"></ul>
                        <span id="nodata" class="p-5">No Timeline data available.</span>
                    </div>
                </div>`;
                let popOverData = popOver.dataset;
                _entity.showTimeLine(popOverData.processname, popOverData.keyvalue);
            });

            KTMenu.getInstance(item).on("kt.menu.dropdown.hide", function (item) {
                KTMenu.getInstance(item).element.innerHTML = "";
            });
        });
    } else {
        bodyContainer.append(this.emptyRowsHtml);
    }
}





function generateRowElements(otherElements, largeTextElements, attachmentElements, rowData) {
    var RowElements = '<div class="Data-fields-row">';
    for (const rowfld of otherElements) {
        if (rowfld.fldname != rowData.keycol)
            RowElements += generateHTMLBasedOnDataType(rowfld, rowData);
    }
    for (const rowfld of largeTextElements) {
        if (rowfld.fldname != rowData.keycol)
            RowElements += generateHTMLBasedOnDataType(rowfld, rowData);
    }
    for (const rowfld of attachmentElements) {
        RowElements += generateHTMLBasedOnDataType(rowfld, rowData);
    }
    RowElements += '</div>';
    return RowElements;
}
function generateRowButtonHTML(buttonElements, rowData) {
    var rowButtonHTML = `<div class="Action-Btns-row ">
                                            <div class="d-flex align-items-center ">
                                                <a href="javascript:void(0)" title="Approve"
                                                   onclick="axTasksObj.doApprove('1409660000003', this);"
                                                   class="btn btn-white btn-sm btn-color-gray-700 btn-active-primary d-inline-flex align-items-center  btn-sm  me-2  ">
                                                    <span class="material-icons material-icons-style material-icons-2"
                                                          style="color: #47BE7D;">visibility</span>View form
                                                </a>
                                                <a href="javascript:void(0)" title="Reject"
                                                   class="btn btn-white btn-color-gray-700 btn-active-primary d-inline-flex align-items-center  me-2  btn-sm"
                                                   onclick="axTasksObj.doReject('1409660000003', this)">
                                                    <span class="material-icons material-icons-style material-icons-2"
                                                          style="color: red;">edit_note</span>Edit Form
                                                </a>`;
    for (const rowfld of buttonElements) {
        rowButtonHTML += generateHTMLBasedOnDataType(rowfld, rowData);
    }
    rowButtonHTML += ` </div>
                                        </div>`;
    return rowButtonHTML;
}

var dateFormat = 'DD/MM/YYYY'; 

// Function to format the date
function formatDate(dateStr, format) {
    // Remove any characters like 'T' and split the date
    dateStr = dateStr.split('T')[0]; // Handle timestamp with 'T'
    var dateParts = dateStr.split('-');
    var year = dateParts[0];
    var month = dateParts[1];
    var day = dateParts[2];

    if (format === 'DD/MM/YYYY') {
        return `${day}/${month}/${year}`;
    } else if (format === 'MM/DD/YYYY') {
        return `${month}/${day}/${year}`;
    } else {
        return dateStr; // Return as is if format is unknown
    }
}


function generateHTMLBasedOnDataType(fldProps, rowData) {
    var fldkey = fldProps.fldname;
    var fldtype = getFieldDataType(fldProps);
    var fldcap = fldProps.fldcap || '';
    var fProps = fldProps.props;
    var fldValue = rowData[fldkey];
    
    // Skip "Modified On" and "Modified By" fields
    if (fldkey.toLowerCase() === 'modifiedon' || fldkey.toLowerCase() === 'modifiedby') {
        return '';
    }

    if (_entity.inValid(fldValue) && fldtype.toUpperCase() != "BUTTON")
        return '';
    
    let html = '';
    switch (fldtype.toUpperCase()) {
        case 'LARGE TEXT':
            html = `<div class="Data-fields-items Department-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                        <p class="task-description moretext" style="margin-bottom:0px !important;">${fldValue}</p>
                        <a class="moreless-button" href="#">Read more</a>
                    </div>`;
            break;
        case 'SHORT TEXT':
            html = `<div class="Data-fields-items Department-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                        <span class="material-icons material-icons-style material-icons-2">description</span><span class="txt-bold Data-field-value">${fldValue}</span>
                    </div>`;
            break;
        case 'CURRENCY':
            html = `<div class="Data-fields-items Department-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                        <span class="material-icons material-icons-style material-icons-2">payments</span><span class="txt-bold Data-field-value">${fldValue}</span>
                    </div>`;
            break;
        case 'DATE':
            // Format the date value
            var formattedDate = formatDate(fldValue.replace("T00:00:00", ""), dateFormat);
            html = `<div class="Data-fields-items Date-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                            <span class="material-icons material-icons-style material-icons-2">today</span><span class="txt-bold Data-field-value">${formattedDate}</span>
                        </div>`;
            break;
        case 'TIME':
            html = `<div class="Data-fields-items Time-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                        <span class="material-icons material-icons-style material-icons-2">schedule</span><span class="txt-bold Data-field-value">${fldValue}</span>
                    </div>`;
            break;
        case 'LINK':
            html = `<div class="Data-fields-items link-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                        <span class="material-icons material-icons-style material-icons-2">link</span><span class="txt-bold Data-field-value">${fldValue}</span>
                    </div>`;
            break;
        case 'MOBILE':
            html = `<div class="Data-fields-items Email-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                        <span class="material-icons material-icons-style material-icons-2">phone</span><span class="txt-bold Data-field-value">${fldValue}</span>
                    </div>`;
            break;
        case 'PHONE':
            html = `<div class="Data-fields-items Email-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                        <span class="material-icons material-icons-style material-icons-2">phone</span><span class="txt-bold Data-field-value">${fldValue}</span>
                    </div>`;
            break;
        case 'PINCODE':
            html = `<div class="Data-fields-items Email-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                        <span class="material-icons material-icons-style material-icons-2">location_on</span><span class="txt-bold Data-field-value">${fldValue}</span>
                    </div>`;
            break;
        case 'ZIPCODE':
            html = `<div class="Data-fields-items Email-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                        <span class="material-icons material-icons-style material-icons-2">location_on</span><span class="txt-bold Data-field-value">${fldValue}</span>
                    </div>`;
            break;
        case 'EMAIL':
            html = `<div class="Data-fields-items Email-field truncate" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                        <span class="material-icons material-icons-style material-icons-2">mail</span><span class="txt-bold Data-field-value" data-text="${fldValue}" onclick="showPopup(this)">${fldValue}</span>
                    </div>`;
            break;
        case 'BOOL':
            // Check if the field value is "T" or "F" and display a checkbox accordingly
            if (fldValue === "T" || fldValue === "F") {
                html = `<div class="Data-fields-items Email-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" ${fldValue === "T" ? 'checked' : ''} readonly>
                                    <span class="txt-bold Data-field-value">${fldcap}</span>
                                </div>
                            </div>`;
            } else {
                html = `<div class="Data-fields-items Department-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                <span class="txt-bold Data-field-value">${fldValue}</span>
                            </div>`;
            }
            break;
        case 'BUTTON':
            var propsVal = fProps.split("|");
            var iconVal = propsVal[0].split("~")[1];
            html = `<a href="javascript:void(0)" title="View form"
                       class="btn btn-white btn-color-gray-700 btn-active-primary d-inline-flex align-items-center  btn-sm  me-2 ">
                        <span class="material-icons material-icons-style material-icons-2" style="color: darkmagenta;">${iconVal}</span>${fldcap}
                    </a>`;
            break;
        case 'ATTACHMENTS':
            if (fldValue?.length > 0) {
                var fileObj = parseFilePath(fldValue);
                if (fileObj.filename?.length > 0) {
                    var fileType = getFileType(fldValue);
                    var iconClass = getIconClass(fileType);
                    html = `<div class="Files-Attached" data-toggle="tooltip" data-placement="top" title="${fileObj.filename}.${fileObj.ext}">
                                ${iconClass}
                                <div class="ms-1 fw-semibold">
                                    <a class="attached-filename" onclick="downloadFileFromPath('${fileObj.folder.replaceAll("\\", "\\\\")}','${fileObj.filename}.${fileObj.ext}')">${fileObj.filename}</a>
                                </div>
                            </div>`;
                }
            }
            break;
        default:
            if (fldValue === "T" || fldValue === "F") {
                html = `<div class="Data-fields-items Department-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                <div class="d-flex align-items-center">
                                    
                                    <div class="form-check ms-1">
                                        <input class="form-check-input" type="checkbox" ${fldValue === "T" ? 'checked' : ''} readonly disabled>
                                    </div>
                                </div>
                            </div>`;
            } else {
                html = `<div class="Data-fields-items Department-field" data-toggle="tooltip" data-placement="top" title="${fldcap}" data-name="${fldcap.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                <span class="txt-bold Data-field-value">${fldValue}</span>
                            </div>`;
            }
    }
    return html;
}


// Event listener for scroll events
// Add a scroll event listener to your div

function parseFilePath(filePath) {
    // Regular expression to match folder, filename, and extension
    var regex = /^(.*[\\\/])([^\\\/]+)\.(\w+)$/;

    // Executing the regex on the filePath
    var match = regex.exec(filePath);

    // Initializing the result object
    var result = {
        folder: "",
        ext: "",
        filename: ""
    };

    // If match is found
    if (match) {
        result.folder = match[1];
        result.filename = match[2];
        result.ext = match[3];
    } else {
        // If no match is found, consider the whole string as folder path
        result.folder = filePath;
    }

    return result;
}

function downloadFileFromPath(filePath, filename) {
    $.ajax({
        type: "POST",
        url: top.window.location.href.toLowerCase().substring(0, top.window.location.href.indexOf("/aspx/")) + '/customwebservice.asmx/GetAttachments',
        cache: false,
        async: false,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            filePath: filePath, // Should be folder1\\folderb
            fileName: filename // Should be filename, e.g., myimg.png
        }),
        dataType: "json",
        success: function (data) {
            if (data.d !== ("File not exists" || "File path not exists")) {
                var extension = data.d.split('.').pop().toLowerCase();
                downloadAttachment(data.d, filename, extension);
            } else {
                parent.showAlertDialog("error", data.d);
            }
        },
        error: function (data) {
            parent.showAlertDialog("error", data.d);
        }
    });
}

function isScrollAtBottomWithinDiv(divElement) {
    const distanceToBottom = divElement.scrollHeight - (divElement.scrollTop + divElement.clientHeight);
    return distanceToBottom <= 1;  // Ensure this threshold is correct for your use case
}

function isScrollAtTopWithinDiv(divElement) {
    // Calculate the distance between the top of the div and the top of the viewport
    const distanceToTop = divElement.scrollTop;

    // Check if the distance to the top is within a small threshold to account for rounding errors
    return distanceToTop <= 1;
}
function filterRowsByPage(rows, pageNumber) {
    return rows.filter(row => row.pageno === pageNumber);
}
function getMaxPageNumber(data) {
    let maxPage = -Infinity; // Initialize with negative infinity
    //data = JSON.parse(data);
    // Iterate over each row and update maxPage if needed
    data.forEach(row => {
        if (row.pageno > maxPage) {
            maxPage = row.pageno;
        }
    });

    return maxPage;
}
function initReadMore() {
    // Get all elements with the "moretext" class
    var moreTextElements = document.querySelectorAll('.moretext');

    moreTextElements.forEach(function (moreText, index) {
        // Save the initial height when the page loads for each element
        var initialHeight = moreText.clientHeight;

        // Get the corresponding "Read more" button
        var moreLessButton = moreText.nextElementSibling;

        // Initial check and setup
        if (moreText.scrollHeight > moreText.clientHeight) {
            moreLessButton.style.display = 'inline-block';
            moreText.style.maxHeight = initialHeight + 'px'; // Set initial max height
        } else {
            moreLessButton.style.display = 'none'; // Hide button if content is not overflowing
        }

        moreLessButton.addEventListener('click', function () {
            var computedStyle = window.getComputedStyle(moreText);

            if (computedStyle.maxHeight === 'none' || computedStyle.maxHeight === initialHeight + 'px') {
                moreText.style.maxHeight = moreText.scrollHeight + 'px'; // Expand to full height
                moreLessButton.textContent = 'Read less';
            } else {
                moreText.style.maxHeight = initialHeight + 'px'; // Set back to initial height
                moreLessButton.textContent = 'Read more';
            }
        });
    });
}
function getFilesHtml(rowJson) {
    var returnHtml = "";
    var filesArray = rowJson["axpfile_file"].split(',');
    $.each(filesArray, function (index, value) {
        var fileType = getFileType(value);
        var iconClass = getIconClass(fileType);
        var attachmentURL = rowJson["axpfilepath_file"] + value;
        attachmentURL = attachmentURL.replace(/\\/g, "\\\\");
        if (value != "") {
            returnHtml += `<div class="Files-Attached ">
						   <!--begin::Icon-->	
						   ${iconClass}						   
						   <!--end::Icon-->                     
						   <!--begin::Info-->
						   <div class="ms-1 fw-semibold">
							  <!--begin::Desc-->							  
							  <a class="attached-filename" onclick="downloadFileFromPath('${attachmentURL}','${value}')">${value}</a>
							  <!--end::Desc-->                     
							  <!--begin::Number-->
							  <div class="attached-filedetails">
								 <span class="doctype">${fileType}</span>
								 <!--<span class="docsize">1.9mb</span>-->
							  </div>
							  <!--end::Number-->
						   </div>
						   <a class="attached-filename" onclick="downloadFileFromPath('${attachmentURL}','${value}')">
							   <span
								  class="material-icons material-icons-style material-icons-2 text-danger">cloud_download</span>
							</a>
						   <!--begin::Info-->
						</div>`;
        }

    });
    return returnHtml;
}
function getIconClass(fileType) {
    switch (fileType) {
        case 'pdf':
            return '<img src="../images/pdf.svg" class="file-img" />';
        case 'jpeg':
            return '<img src="../images/images.svg" class="file-img" />';
        case 'jpg':
            return '<img src="../images/images.svg" class="file-img" />';
        case 'png':
            return '<img src="../images/images.svg" class="file-img" />';
        case 'doc':
        case 'docx':
            return '<img src="../images/word.svg" class="file-img" />';
        case 'txt':
            return '<i style="margin:0px !important; font-size: 40px !important; " class="material-icons">description</i>';
        case 'xls':
        case 'xlsx':
            return '<img src="../images/xl.svg" class="file-img"/>';
        case 'ppt':
        case 'pptx':
            return '<img src="../images/ppt.svg" class="file-img"/>';
        case 'zip':
            return '<i style="margin:0px !important; font-size: 40px !important; " class="material-icons">archive</i>';
        case 'mp3':
            return '<i style="margin:0px !important; font-size: 40px !important; " class="material-icons">audiotrack</i>';
        case 'mp4':
            return '<i style="margin:0px !important; font-size: 40px !important; " class="material-icons">videocam</i>';
        default:
            return '<i style="margin:0px !important; font-size: 40px !important; " class="material-icons">insert_drive_file</i>'; // Default icon for unknown file types
    }
}
function getFileType(fileName) {
    // Split the file name into an array based on the dot separator
    var parts = fileName.split('.');

    // Get the last part of the array, which is the file extension
    var fileExtension = parts[parts.length - 1];

    // Convert the file extension to lowercase (optional, for consistency)
    return fileExtension.toLowerCase();
}
function scrollToTopOfDiv(divElement) {
    divElement.scrollTop = 0; // Set scrollTop to 0 to scroll to the top
}
/* End Function Set to generate html */
$(document).ready(function () {
    /* $('[data-toggle="tooltip"]').tooltip();
     initReadMore();
     $('.toggle-btn').click(function () {
         $('.content').toggleClass('min-height');
     });*/
    _entityCommon = new EntityCommon();
    _entity = new Entity();
    _entity.init();
});


var axTimeLineObj;
class ProcessTimeLine {
    constructor() {
        this.keyvalue = "";
        this.processName = "";
        this.make = `<li class="make">                                   
                    <p class="T-Desc">{{taskname}}#{{keyvalue}}</p>
 		    <p class="T-Heading">{{taskfromuser}}</p>
 		    <div class="time">{{tasktime}}</div>
                </li>`;
        this.check = `<li class="check">
                    <p class="T-Desc">{{taskname}}#{{keyvalue}} - {{taskstatus}}</p>
                    <p class="T-Heading">{{taskfromuser}}</p>                    
		    <div class="time">{{tasktime}}</div>
                </li>`;
        this.approve = `<li class="approve">
                   <p class="T-Desc">{{taskname}}#{{keyvalue}} - {{taskstatus}}</p>
                    <p class="T-Heading">{{taskfromuser}}</p>                    
		    <div class="time">{{tasktime}}</div>
                </li>`;
    }

    getTimeLineData() {
        ShowDimmer(true);
        let _this = this;
        let url = "../aspx/AxPEG.aspx/AxGetTimelineData";
        let data = { keyValue: _this.keyvalue, processName: _this.processName };
        this.callAPI(url, data, false, result => {
            if (result.success) {
                let json = JSON.parse(result.response);
                let dataResult = _this.dataConvert(json, "ARM");
                _this.constructTimeline(dataResult);
                ShowDimmer(false);
            } else {
                ShowDimmer(false);
            }
        });
    };

    constructTimeline(data) {
        if (this.isUndefined(data) || data.length == 0) {
            document.querySelector(".Timel-sessions").classList.add("d-none");
            document.querySelector("#nodata").classList.remove("d-none");
        }
        else {
            document.querySelector("#nodata").classList.add("d-none");
            document.querySelector(".Timel-sessions").classList.remove("d-none");
            var timelineData = "";
            document.querySelector('.Timel-sessions').innerHTML = '';
            data.forEach((rowData) => {
                timelineData += Handlebars.compile(this[rowData.tasktype.toLowerCase()])(rowData);
            })
            document.querySelector('.Timel-sessions').insertAdjacentHTML("beforeend", timelineData);
        }
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
                this.catchError(error.message);
            };
        }
        else if (type == "ARM") {
            try {
                if (!this.isAxpertFlutter)
                    data = JSON.parse(data.d);
                if (data.result && data.result.success) {
                    if (!this.isUndefined(data.result.data)) {
                        return data.result.data;
                    }
                }
                else {
                    if (!this.isUndefined(data.result.message)) {
                        this.catchError(data.result.message);
                    }
                }
            }
            catch (error) {
                this.catchError(error.message);
            };
        }

        return data;
    };

    generateFldId() {
        return `fid${Date.now()}${Math.floor(Math.random() * 90000) + 10000}`;
    };

    isEmpty(elem) {
        return elem == "";
    };

    isNull(elem) {
        return elem == null;
    };

    isNullOrEmpty(elem) {
        return elem == null || elem == "";
    };

    isUndefined(elem) {
        return typeof elem == "undefined";
    };

    inValid(elem) {
        return elem == null || typeof elem == "undefined" || elem == "";
    };
}



function showPopup(element) {
    var text = element.getAttribute('data-text');
    document.getElementById('popupText').textContent = text;
    $('#myModal').modal('show');
}


function openFilters() {
    $('#filterModal').modal('show');
    document.getElementById('filterGroupName').disabled = true;

    if ($('#dvModalFilter').html() === "") {
        createFilterLayout();
    }
}



function updateFilterLayout(fieldId, filterDetails) {
    filterChanged = true;

    $('#dvModalFilter').children().each(function () {
        let divDataType = $(this).attr('data-type'); 
        let selectElement = $(this).find('div select');
        let divEleId = selectElement.attr('id'); 
        let divDataField = selectElement.attr('data-field');

        let inputElement = $(this).find('div input');
        let inputEleId = inputElement.attr('id'); 
        
        // let selectedOptionValue = selectElement.val(); 

        // let inputValue = inputElement.val();

        for (const [key, value] of Object.entries(fieldId)) {
            if (divEleId === key || divDataField === key || inputEleId === key) {
                const secondValue = value.split(',')[1]; 
                const dropdownElement = $(`#${divEleId}`);

                switch (divDataType) {
                    case "DropDown":
                        if (dropdownElement.prop('multiple')) {
                            const values = secondValue.split(';');
                            dropdownElement.val(values).trigger('change');
                        } else {
                            dropdownElement.val(secondValue).trigger('change');
                        }
                        break;

                    case "Simple Text":
                        inputElement.val(secondValue);
                        break;

                        case "Date":
                            if (divEleId === "modifiedon_dateoption") {
                                const fromDate = $('#modifiedon_from');
                                const toDate = $('#modifiedon_to');
                                const fromToObj = getDatesBasedonSelection(secondValue);
    
                                fromDate.val(fromToObj.from);
                                toDate.val(fromToObj.to);
    
                                dropdownElement.val(secondValue).trigger('change');
    
                                // Enable or disable date fields based on the selected option
                                if (secondValue === "customOption") {
                                    fromDate.prop('disabled', false).addClass('disabledDate');
                                    toDate.prop('disabled', false).addClass('disabledDate');
                                } else {
                                    fromDate.prop('disabled', true).removeClass('disabledDate');
                                    toDate.prop('disabled', true).removeClass('disabledDate');
                                }
                            }
                            break;

                    case "Numeric":
                    case "Auto Generate":
                        inputElement.val(secondValue);
                        break;

                    default:
                        break;
                }
                break;
            }
        }
    });

    // Handle pillText if present
    if (fieldId.pillText) {
        $('#filterGroupName').val(fieldId.pillText);
    }
}







function getCurrentTimestamp() {
    const now = new Date();
    return "Filter-" + now.toISOString().replace(/[-:TZ.]/g, '');
}



// For opening filter group input modal on apply button click
function handleApply() {
    let pillClass = getCurrentTimestamp();
    let pillText = '';
    let isChecked = false;

    if ($('#filterGroupCheckbox').is(":checked")) {
        isChecked = true; // Setting isChecked flag to true if user has toggled the checkbox to check
        $('#filterGroupModalWrapper').modal('show'); // Opens the modal to enter a custom name for the filter group pill

        pillText = $('#filterGroupName').val(); // Reading the input from the user entry in the second modal

        // checking if user has entered any name
        if (pillText) {
            applyFilters(pillText, pillClass, isChecked)
        } else {

            handleApply()
            // showAlertDialog("error", "Error: Please enter the name for filter group");
        }

    } else {
        isChecked = false; // Setting isChecked flag to false if user has NOT toggled the checkbox to check
        $('#filterGroupModalWrapper').modal('hide');
        pillText = readFilterInput(); // Reading the inputs from the user entry in the main filter modal to frame a default pill text

        applyFilters(pillText, pillClass, isChecked)
    }
}

// To generate a string from user inputs in the main filter for default Pill Text
function readFilterInput() {
    let defaultPillText = "";
    var advFilterDtCulture = dtCulture == "en-us" ? "MM/DD/YYYY" : "DD/MM/YYYY";
    document.querySelectorAll("#dvModalFilter .filter-fld").forEach(fld => {

        let filterval = fld.value;
        let fldType = fld.dataset.type;

        if (_entity.inValid(fldType))
            return "Invalid Input";

        fldType = fldType.toUpperCase();

        switch (fldType) {
            case "DROPDOWN":
                if (_entity.inValid(filterval) || filterval == 0)
                    return;

                filterval = $(fld).val().join(',');
                defaultPillText = defaultPillText + ',' + filterval
                break;

            case "DATE":
                var dates = fld.querySelectorAll("input");
                var fromDate = dates[0];
                var toDate = dates[1];

                if ($(`#${fld.id}_dateoption`).val() === 'customOption') {
                    if (fromDate.value == "" && toDate.value == "") {
                        return;
                    }

                    if (fromDate.value != "" && toDate.value == "") {
                        filterval = moment(fromDate.value, advFilterDtCulture).format("DD-MMM-YYYY");
                        defaultPillText = defaultPillText + ',' + 'FROM:' + filterval
                    }
                    else if (toDate.value != "" && fromDate.value == "") {
                        filterval = moment(toDate.value, advFilterDtCulture).format("DD-MMM-YYYY");
                        defaultPillText = defaultPillText + ',' + 'TO:' + filterval
                    }
                    else {
                        filterval = moment(fromDate.value, advFilterDtCulture).format("DD-MMM-YYYY") + "~~" + moment(toDate.value, advFilterDtCulture).format("DD-MMM-YYYY");
                        defaultPillText = defaultPillText + ',' + filterval
                    }
                } else {
                    defaultPillText = defaultPillText + ',' + $(`#${fld.id}_dateoption option:selected`).text()
                }
                break;

            case "NUMERIC":
                var nums = fld.querySelectorAll("input");
                var fromNum = nums[0];
                var toNum = nums[1];

                if (fromNum.value == "" && toNum.value == "") {
                    return;
                }

                if (fromNum.value != "" && toNum.value == "") {
                    filterval = fromNum.value
                    defaultPillText = defaultPillText + ',' + 'FROM:' + filterval
                }
                else if (toNum.value != "" && fromNum.value == "") {
                    filterval = toNum.value
                    defaultPillText = defaultPillText + ',' + ' TO:' + filterval
                }
                else {
                    filterval = fromNum.value + " - " + toNum.value;
                    defaultPillText = defaultPillText + ',' + " Custom Range: " + filterval
                }
                break;

            default:
                if (_entity.inValid(filterval))
                    return;

                var searchOption = document.querySelector(`#${fld.id}_searchoption`).value || "CONTAINS";
                defaultPillText = defaultPillText + ',' + searchOption + ' : ' + filterval
                break;
        }

    })

    defaultPillText = defaultPillText.replace(/(^,)|(,$)/g, "");
    return defaultPillText
}


function createPill(appliedFilterObj) {
    console.log('appliedFilterObj: ', appliedFilterObj);

    // Check if there are no applied filters
    if (Object.keys(appliedFilterObj).length === 0) {
        $('.secondary_card_header').css('display', 'none');
    } else {
        $('.secondary_card_header').css('display', 'flex');
    }

    // If in edit mode, remove existing pills and check for duplicates
    if (isEditMode) {

        removePill(isEditMode, false)
    }

    // Create pills for current keys in appliedFilterObj
    for (let key in appliedFilterObj) {
        // Create the pill only if it doesn't already exist
        if (!$(`.secondary_card_header .${key}`).length) {
            let filterGroupPill = `<div class="${key} filterGroupBadge badge rounded-pill bg-primary d-flex align-items-center gap-2 py-2 px-6" role="button" style="max-width: fit-content;" data-toggle="tooltip" data-placement="top" data-html="true" onclick="handlePillClick('${key}')">
                ${appliedFilterObj[key].pillText} 
                <span title='edit' class="pillEditButton material-icons btn btn-primary px-2 py-1" onclick="editPill('${key}'); event.stopPropagation();">edit</span> 
                <span title="remove" class="pillRemoveButton material-icons btn btn-primary px-2 py-1" onclick="removePill('${key}'); event.stopPropagation();" >close</span> 
                </div>`;

            $('.secondary_card_header').append(filterGroupPill);
        }
    }

    // Reset edit mode after creating pills
    isEditMode = "";
}
function editPill(key) {
    // Remove the earlier pill if it exists

     // Check if a custom filter name exists for the selected pill
     if (_entity.filterObj[key] && _entity.filterObj[key].pillText) {
        document.getElementById('filterGroupName').value = _entity.filterObj[key].pillText;
    }


    // if (currentEditFieldId && currentEditFieldId !== key) {
    //     $(`.secondary_card_header .${currentEditFieldId}`).remove();
    //     removedKeys.add(currentEditFieldId); // Track the removed key
    // }

    // currentEditFieldId = key;

    isEditMode = key; // Set edit mode to true when editing a pill
    $('#filterModal').modal('show');
    document.getElementById('filterGroupName').disabled = true;

    if ($('#dvModalFilter').html() === "") {
        createFilterLayout();
    }

    if (_entity.filterObj[key]) {
        updateFilterLayout(_entity.filterObj[key]);
    }

}


// For removing pills
function removePill(key, onlydelete = true) {
    $(`div.${key}`).remove();
    delete (_entity.filterObj[key]);
    _entity.setSelectedFilters(JSON.stringify(_entity.filterObj));

    if (onlydelete) {
        if ($('.secondary_card_header .filterGroupBadge').length < 2) {
            $('.secondary_card_header').css('display', 'none')
            resetFilters()
        }
    }

    $(`.secondary_card_header .${key}`).remove();
    removedKeys.add(key); // Track the removed key
    console.log('Updated global entityfilters: ', _entity.filterObj)
}

// // For Pill editing
// $('.secondary_card_header').on('click', '.pillEditButton', function () {
//     $('#filterGroupModalWrapper').modal('show');
//     let key = $(this).parent().attr('class').split(' ')[0];
//     $('#filterGroupName').val(`${key}`)
// })

// For Pill specific filter implementation
function handlePillClick(key) {
    console.log("Key of Pill clicked: ", key);
    console.log("Object matching key from global _entity.filterObj: ", _entity.filterObj[`${key}`]);


    // Add the 'selected' class and border to the clicked pill

    $(`.${key}`).click(function () {
        $(".selected").removeClass("selected");
        $(this).addClass("selected");
        // $(".selected").css("border", "1px solid black");
    });


    let filterFldArr = [];
    let filterArr = [];

    let advFilterDtCulture = dtCulture == "en-us" ? "MM/DD/YYYY" : "DD/MM/YYYY";
    Object.keys(_entity.filterObj[`${key}`]).slice(2).forEach(fld => {
        console.log('Selected Pill Data: ', _entity.filterObj[`${key}`][`${fld}`]);

        let objProp = _entity.filterObj[`${key}`][`${fld}`].split(',');
        console.log("objProp: ", objProp);

        let fldType = objProp[0];
        let filterval = "";

        let tmpFld = _entity.metaData.find(item => item.fldname === fld);

        switch (fldType) {
            case "DROPDOWN":
                filterval = objProp.slice(1).join(",");
                console.log('Dropdown Data: ', filterval);

                filterFldArr.push(`${fld}~${tmpFld.normalized}~${tmpFld.srctable || ""}~${tmpFld.srcfield || ""}~${tmpFld.fdatatype || ""}~${tmpFld.listingfld || ""}~${tmpFld.tablename || ""}`);
                filterArr.push(generateFilterString(fldType, filterval.toLowerCase()));
                break;

            case "DATE":
                filterFldArr.push(`${fld}~${tmpFld.normalized}~${tmpFld.srctable || ""}~${tmpFld.srcfield || ""}~${tmpFld.fdatatype || ""}~${tmpFld.listingfld || ""}~${tmpFld.tablename || ""}`);
                if (jQuery.inArray('customOption', objProp) !== -1) {
                    console.log("It is customOption!");
                    if (jQuery.inArray('FROMDATE', objProp) === -1 && jQuery.inArray('TODATE', objProp) === -1) {
                        return;
                    } else if (jQuery.inArray('FROMDATE', objProp) !== -1 && jQuery.inArray('TODATE', objProp) === -1) {
                        filterval = moment(objProp[3], advFilterDtCulture).format("DD-MMM-YYYY");
                        filterArr.push(generateFilterString(fldType, filterval, "FROMDATE"));
                        console.log("Filter string on pill click: ", generateFilterString(fldType, filterval, "FROMDATE"));
                    } else if (jQuery.inArray('FROMDATE', objProp) === -1 && jQuery.inArray('TODATE', objProp) !== -1) {
                        filterval = moment(objProp[3], advFilterDtCulture).format("DD-MMM-YYYY");
                        filterArr.push(generateFilterString(fldType, filterval, "TODATE"));
                        console.log("Filter string on pill click: ", generateFilterString(fldType, filterval, "TODATE"));
                    } else {
                        filterval = moment(objProp[3], advFilterDtCulture).format("DD-MMM-YYYY") + "~~" + moment(objProp[5], advFilterDtCulture).format("DD-MMM-YYYY");
                        filterArr.push(generateFilterString(fldType, filterval));
                        console.log("Filter string on pill click: ", generateFilterString(fldType, filterval));
                    }
                } else {
                    console.log("It is not customOption: ", objProp[1]);
                    let processedDateObj = getDatesBasedonSelection(objProp[1]);
                    console.log("From date: ", processedDateObj.from, " To date: ", processedDateObj.to);
                    if (processedDateObj.from === "" && processedDateObj.to === "") {
                        return;
                    } else if (processedDateObj.from !== "" && processedDateObj.to === "") {
                        filterval = moment(processedDateObj.from, advFilterDtCulture).format("DD-MMM-YYYY");
                        filterArr.push(generateFilterString(fldType, filterval, "FROMDATE"));
                        console.log("Filter string on pill click: ", generateFilterString(fldType, filterval, "FROMDATE"));
                    } else if (processedDateObj.from === "" && processedDateObj.to !== "") {
                        filterval = moment(processedDateObj.to, advFilterDtCulture).format("DD-MMM-YYYY");
                        filterArr.push(generateFilterString(fldType, filterval, "TODATE"));
                        console.log("Filter string on pill click: ", generateFilterString(fldType, filterval, "TODATE"));
                    } else {
                        filterval = moment(processedDateObj.from, advFilterDtCulture).format("DD-MMM-YYYY") + "~~" + moment(processedDateObj.to, advFilterDtCulture).format("DD-MMM-YYYY");
                        filterArr.push(generateFilterString(fldType, filterval));
                        console.log("Filter string on pill click: ", generateFilterString(fldType, filterval));
                    }
                }
                break;

            case "NUMERIC":
                filterFldArr.push(`${fld}~${tmpFld.normalized}~${tmpFld.srctable || ""}~${tmpFld.srcfield || ""}~${tmpFld.fdatatype || ""}~${tmpFld.listingfld || ""}~${tmpFld.tablename || ""}`);
                if (jQuery.inArray('FROM', objProp) !== -1 && (jQuery.inArray('TO', objProp) === -1)) {
                    filterval = objProp[2];
                    filterArr.push(generateFilterString(fldType, filterval, "FROM"));
                } else if (jQuery.inArray('FROM', objProp) === -1 && (jQuery.inArray('TO', objProp) !== -1)) {
                    filterval = objProp[2];
                    filterArr.push(generateFilterString(fldType, filterval, "TO"));
                } else if (jQuery.inArray('FROM', objProp) !== -1 && (jQuery.inArray('TO', objProp) !== -1)) {
                    filterval = objProp[2] + "~~" + objProp[4];
                    filterArr.push(generateFilterString(fldType, filterval));
                } else {
                    console.log("Invalid number range: ", objProp);
                }
                break;

            default:
                filterval = objProp[1];
                searchOption = objProp[2] || "CONTAINS";
                console.log("Text Field value: ", filterval, " SearchOption: ", searchOption);
                filterFldArr.push(`${fld}~${tmpFld.normalized}~${tmpFld.srctable || ""}~${tmpFld.srcfield || ""}~${tmpFld.fdatatype || ""}~${tmpFld.listingfld || ""}~${tmpFld.tablename || ""}`);
                filterArr.push(generateFilterString("TEXT", filterval.toLowerCase(), searchOption));
                break;
        }
    });

    let filterStr = "";
    filterFldArr.forEach((filterFld, idx) => {
        filterStr += `${filterFld}|${filterArr[idx]}^^`;
    });
    if (filterStr.endsWith("^^")) {
        filterStr = filterStr.substr(0, filterStr.length - 2);
    }
    console.log("Final pill click string: ", filterStr);

    if (filterStr.startsWith("modifiedby~"))
        filterStr = filterStr.replace("modifiedby~", "username~");
    _entity.filter = filterStr;


    _entity.getEntityListData(1);

    $('#filterGroupName').val(key);
    _entity.filter = _entity.filterObj[key].filter;
    //document.getElementById('btnApplyFilters').click();
    _entity.filter = filterArr.join("##");

    //openFilters(key);
    parent.ShowDimmer(false);
}



// function closeFilterGroupModal() {
//     $('#filterGroupName').val('')
//     $('#filterGroupModalWrapper').modal('hide');
// }

function createFilterLayout() {
    $('#dvModalFilter').html("");

    $.each(_entity.metaData, function (index, field) {
        if (field.hide === 'T') {
            return true; 
        }

        generateFilterHTML(field);

        if (_entity.filterObj[field.fldname]) {
            updateFilterLayout(field.fldname, _entity.filterObj[field.fldname]);
        }
    });

    // Initialize dropdown fields
    document.querySelectorAll("#dvModalFilter .filter-fld[data-type=DropDown]").forEach(fld => {
        let fldId = fld.id;
        let dataArray = [...new Set(_entity.fldData[fldId])];

        // Add a default option
        $(fld).append($("<option></option>").val('0').html('--Select--'));

        // Add unique values to the dropdown
        dataArray.forEach(item => {
            if (!_entity.inValid(item))
                fld.insertAdjacentHTML("beforeend", `<option value="${item}">${item}</option>`);
        });

        // Initialize Select2 for the dropdown
        $(fld).select2({
            multiple: true
        }).on("select2:unselect select2:select", function (e) {
            let fldNamesf = $(this).attr("id");
            let fldAcValue = $(this).val();
            fldAcValue = fldAcValue.filter(num => num !== '0');
            $(this).val(fldAcValue);
            $(this).trigger("change");
        });
    });

    // Initialize date pickers
    var glCulture = eval(callParent('glCulture'));
    var dtFormat = "d/m/Y";
    if (glCulture == "en-us")
        dtFormat = "m/d/Y";
    $(".flatpickr-input").flatpickr({
        dateFormat: dtFormat
    });
}


function getFirstDayOfWeek(currentDate) {
    currentDate = new Date(currentDate);
    var day = currentDate.getDay();
    var diff = currentDate.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(currentDate.setDate(diff));
}

function generateFilterHTML(field) {
    var fldtype = getFieldDataType(field);
    var fldcap = field.fldcap || '';
    var fldname = field.fldname;
    let filterHTML = '';
    if (fldtype.toUpperCase() == "BUTTON" || fldtype.toUpperCase() == "ATTACHMENTS")
        return;

    if (field.fdatatype == "n")
        fldtype = "Numeric";

    switch (fldtype) {
        case 'DropDown':
            filterHTML = `<div class="row" data-type="${fldtype}"><div class="col-md-3 fldCaption"><p class="form-group ">${fldcap}</p> </div>
                          <div class="col-md-9 fldCaption">
                            <select class="form-control filter-fld"  data-type="${fldtype}" id="${fldname}" name="${fldtype}">
                            </select>
                          </div>`;

            break;
        case 'Numeric':
            filterHTML = `<div class="row filter-fld" data-type="${fldtype}" id="${fldname}" data-type="${fldtype}">
            <div class="col-md-3 fldCaption">
            <p class="form-group ">${fldcap}</p>
            </div> 
            <div class="col-md-9">
            <div class="form-group form-row fldCaption">
            <div class="col-md-6 col">
            <label>From</label>           
            <input type="number" id="${fldname}_from" class="form-control" data-type="${fldtype}"/>
            </div>
            <div class="col-md-6 col">
            <label>To</label>           
            <input type="number" id="${fldname}_to" class="form-control" data-type="${fldtype}"/>
            </div></div></div>`;
            break;
        case 'Date':
            var dateOptions = ["Custom", "Today", "Yesterday", "Tomorrow", "This week", "Last week", "Next week", "This month", "Last month", "Next month", "This quarter", "Last quarter", "Next quarter", "This year", "Last year", "Next year"];
            var dateOptionsId = ["customOption", "todayOption", "yesterdayOption", "tomorrowOption", "this_weekOption", "last_weekOption", "next_weekOption", "this_monthOption", "last_monthOption", "next_monthOption", "this_quarterOption", "last_quarterOption", "next_quarterOption", "this_yearOption", "last_yearOption", "next_yearOption"];

            filterHTML += `<div class="row filter-fld" data-type="${fldtype}" id="${fldname}"><div class="col-md-3 fldCaption"><p class="form-group ">${fldcap}</p></div>
                            <div class="col-md-4 fldCaption">
                            <select class="form-select dateFilter" type="text" id="${fldname}_dateoption" name="${fldname}" data-field="${fldname}" onchange="generateAdvFilterDates('${fldname}');">`;
            for (var i = 0; i < dateOptions.length; i++) {
                filterHTML += `<option value=${dateOptionsId[i]}>${dateOptions[i]}</option>`;
            }
            filterHTML += `</select> 
                            </div>
                            <div class="col-md-5">
<div class="form-group form-row fldCaption">
<div class="col-md-6 col">
<label>From</label>           
 <input id="${fldname}_from" name="${fldname}_from" value="" maxlength="10" type="date" class="form-control flatpickr-input" data-input="" onchange="validateDateRange('${fldname}');">
</div>
<div class="col-md-6 col">
<label>To</label>           
<input id="${fldname}_to" name="${fldname}_to" value="" maxlength="10" type="date" class="form-control flatpickr-input" data-input="" onchange="validateDateRange('${fldname}');">
</div></div></div>   
                            </div>`;
            break;
        default:
            filterHTML = `<div class="row" data-type="${fldtype}">
            <div class="col-md-3 fldCaption">
            <p class="form-group ">${fldcap}</p> 
            </div>
            <div class="col-md-4 fldValue"> 
            <select class="form-select" type="text" id="${fldname}_searchoption" class="form-control">
            <option value="STARTSWITH">Starts with</option>
            <option value="CONTAINS">Contains</option>
            <option value="ENDSWITH">Ends with</option>
            </select></div>
            <div class="col-md-5 fldValue"> <input type="text" id="${fldname}" class="form-control filter-fld" data-type="${fldtype}"/></div>
            </div>`;
            break;
    }

    $('#dvModalFilter').append(filterHTML);
}



function filterModelClose() {
    $('#filterGroupName').val('')
    $('#filterGroupModalWrapper').modal('hide');

    document.getElementById('filterGroupCheckbox').checked = false
    document.getElementById('filterGroupName').disabled = true

    $('#dvModalFilter').html("");
    $('#filterModal').modal('hide');

}


function validateDateRange(fieldId) {
    var fromDateElement = document.getElementById(fieldId + '_from');
    var toDateElement = document.getElementById(fieldId + '_to');
    var fromDate = fromDateElement.value;
    var toDate = toDateElement.value;

    if (fromDate && toDate) {
        var fromDateObj = parseDate(fromDate);
        var toDateObj = parseDate(toDate);

        if (!fromDateObj || !toDateObj) {
            alert('Invalid date format.');
            return;
        }

        // Check if the "To" date is earlier than the "From" date
        if (toDateObj < fromDateObj) {
            alert('The "To" date cannot be earlier than the "From" date.');
            // Clear the "To" date
            toDateElement.value = '';
        }
    }
}


function formatDateString(dateString) {
    let date = new Date(dateString);
    if (isNaN(date)) return ''; // Return empty if the date is invalid

    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();

    // Extract the time part (hours, minutes, seconds)
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // Format the date
    let formattedDate = isDDMMYYYY ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;

    // Check if the time is not "00:00:00"
    if (!(hours === 0 && minutes === 0 && seconds === 0)) {
        // Add the time part if it's not 00:00:00
        let timePart = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        return `${formattedDate} ${timePart}`;
    }

    // Return only the date if the time is 00:00:00
    return formattedDate;
}

// Define the date format (true for DD/MM/YYYY, false for MM/DD/YYYY)
var isDDMMYYYY = true; 


// Utility function to parse date in format DD/MM/YYYY or MM/DD/YYYY
function parseDate(dateString) {
    var parts = dateString.split('/');
    if (parts.length !== 3) {
        return null; 
    }
    var day, month, year;
    // Assuming date format is DD/MM/YYYY, adjust if using MM/DD/YYYY
    if (isDDMMYYYY) {
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1; 
        year = parseInt(parts[2], 10);
    } else {
        month = parseInt(parts[0], 10) - 1;
        day = parseInt(parts[1], 10);
        year = parseInt(parts[2], 10);
    }
    return new Date(year, month, day);
}




function getLastWeek() {
    var currentDate = new Date();
    var currentDay = currentDate.getDay();
    var startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDay);
    var endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() - 6);
    var formattedStartOfWeek = startOfWeek.toISOString().split('T')[0];
    var formattedEndOfWeek = endOfWeek.toISOString().split('T')[0];

    return {
        start: formattedStartOfWeek,
        end: formattedEndOfWeek
    };
}

function getCurrentWeek() {
    var currentDate = new Date();
    var currentDay = currentDate.getDay();
    var startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDay);
    var endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    var formattedStartOfWeek = startOfWeek.toISOString().split('T')[0];
    var formattedEndOfWeek = endOfWeek.toISOString().split('T')[0];

    return {
        start: formattedStartOfWeek,
        end: formattedEndOfWeek
    };
}

function getNextWeek() {

    var currentDate = new Date();
    var currentDay = currentDate.getDay();
    var startOfNextWeek = new Date(currentDate);
    startOfNextWeek.setDate(currentDate.getDate() - currentDay + 7);
    var endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

    var formattedStartOfNextWeek = startOfNextWeek.toISOString().split('T')[0];
    var formattedEndOfNextWeek = endOfNextWeek.toISOString().split('T')[0];

    return {
        start: formattedStartOfNextWeek,
        end: formattedEndOfNextWeek
    };
}

function getLastMonth() {

    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();
    var startOfLastMonth = new Date(year, month - 1, 2);
    var formattedStartOfLastMonth = startOfLastMonth.toISOString().split('T')[0];
    var endOfLastMonth = new Date(year, month, 1);
    var formattedEndOfLastMonth = endOfLastMonth.toISOString().split('T')[0];
    return {
        start: formattedStartOfLastMonth,
        end: formattedEndOfLastMonth
    };
}

function getCurrentMonth() {

    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;

    var startOfMonth = year + '-' + ('0' + month).slice(-2) + '-01';
    var endOfMonth = new Date(year, month, 1).toISOString().split('T')[0];
    return {
        start: startOfMonth,
        end: endOfMonth
    };
}

function getNextMonth() {

    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 2;
    var startOfNextMonth = year + '-' + ('0' + month).slice(-2) + '-01'; // Start from 01 
    var endOfNextMonth = new Date(year, month, 1);
    var formattedEndOfNextMonth = endOfNextMonth.toISOString().split('T')[0];
    return {
        start: startOfNextMonth,
        end: formattedEndOfNextMonth
    };
}

function getCurrentQuarter() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var quarter = Math.ceil(month / 3);
    var startOfQuarter = year + '-' + ('0' + ((quarter - 1) * 3 + 1)).slice(-2) + '-01';
    var endOfQuarterMonth = quarter * 3;
    var endOfQuarter = new Date(year, endOfQuarterMonth, 1).toISOString().split('T')[0];

    return {
        start: startOfQuarter,
        end: endOfQuarter
    };
}

function getNextQuarter() {
    var currentDate = new Date(); // Get the current date
    var year = currentDate.getFullYear(); // Get the current year
    var month = currentDate.getMonth() + 1; // Get the current month (1-indexed)
    var quarter = Math.ceil(month / 3); // Calculate the current quarter

    // Calculate the start date of the next quarter
    var startOfNextQuarterMonth = (quarter * 3) + 1; // Get the first month of the next quarter
    if (startOfNextQuarterMonth > 12) {
        startOfNextQuarterMonth = 1;
        year++;
    }
    var startOfNextQuarter = year + '-' + ('0' + startOfNextQuarterMonth).slice(-2) + '-01'; // Start from 01

    // Calculate the end date of the next quarter
    var endOfNextQuarter = new Date(year, (quarter * 3) + 3, 1).toISOString().split('T')[0]; // Get the last day of the last month of the next quarter

    // Return an object containing the start and end dates of the next quarter
    return {
        start: startOfNextQuarter,
        end: endOfNextQuarter
    };
}

function getCurrentYear() {
    var currentDate = new Date(); // Get the current date
    var year = currentDate.getFullYear(); // Get the current year

    // Calculate the start date of the current year
    var startOfYear = year + '-01-01'; // Start from January 1st

    // Calculate the end date of the current year
    var endOfYear = year + '-12-31'; // End on December 31st

    // Return an object containing the start and end dates of the current year
    return {
        start: startOfYear,
        end: endOfYear
    };
}

function getLastYear() {
    var currentDate = new Date(); // Get the current date
    var year = currentDate.getFullYear() - 1; // Get the current year

    // Calculate the start date of the current year
    var startOfYear = year + '-01-01'; // Start from January 1st

    // Calculate the end date of the current year
    var endOfYear = year + '-12-31'; // End on December 31st

    // Return an object containing the start and end dates of the current year
    return {
        start: startOfYear,
        end: endOfYear
    };
}

function getNextYear() {

    var currentDate = new Date(); // Get the current date
    var year = currentDate.getFullYear() + 1;// Get the current year

    // Calculate the start date of the current year
    var startOfYear = year + '-01-01'; // Start from January 1st

    // Calculate the end date of the current year
    var endOfYear = year + '-12-31'; // End on December 31st

    // Return an object containing the start and end dates of the current year
    return {
        start: startOfYear,
        end: endOfYear
    };
}


function getDatesBasedonSelection(selectionvalue) {

    var fromToObj = { from: "", to: "" };
    var advFilterDtCulture = dtCulture == "en-us" ? "MM/DD/YYYY" : "DD/MM/YYYY";
    switch (selectionvalue) {
        case "customOption":
            break;
        case "todayOption":
            var dateObj = new Date();
            fromToObj.from = fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "yesterdayOption":
            var dateObj = new Date();
            dateObj.setDate(dateObj.getDate() - 1);
            fromToObj.from = fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "tomorrowOption":
            var dateObj = new Date();
            dateObj.setDate(dateObj.getDate() + 1);
            fromToObj.from = fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "this_weekOption":
            var dateObj = getFirstDayOfWeek(new Date());
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setDate(dateObj.getDate() + 6);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "last_weekOption":
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(dateObj.getDate() - 7)
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setDate(dateObj.getDate() + 6);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "next_weekOption":
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(dateObj.getDate() + 7)
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setDate(dateObj.getDate() + 6);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "this_monthOption":
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(1);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setMonth(dateObj.getMonth() + 1);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "last_monthOption":
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(1);
            dateObj.setMonth(dateObj.getMonth() - 1);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setMonth(dateObj.getMonth() + 1);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "next_monthOption":
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(1);
            dateObj.setMonth(dateObj.getMonth() + 1);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setMonth(dateObj.getMonth() + 1);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "this_quarterOption":
            var dateObj = new Date();
            var thisQuarter = Math.floor(((dateObj).getMonth() + 3) / 3);
            dateObj.setDate(1);
            dateObj.setMonth((thisQuarter * 3) - 3);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setMonth(dateObj.getMonth() + 3);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "last_quarterOption":
            var dateObj = new Date();
            var thisQuarter = Math.floor(((dateObj).getMonth() + 3) / 3) - 1;
            if (thisQuarter == 0) {
                thisQuarter = 4;
                dateObj.setFullYear(dateObj.getFullYear() - 1);
            }
            dateObj.setDate(1);
            dateObj.setMonth((thisQuarter * 3) - 3);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setMonth(dateObj.getMonth() + 3);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "next_quarterOption":
            var dateObj = new Date();
            var thisQuarter = Math.floor(((dateObj).getMonth() + 3) / 3) + 1;
            if (thisQuarter == 5) {
                thisQuarter = 1;
                dateObj.setFullYear(dateObj.getFullYear() + 1);
            }
            dateObj.setDate(1);
            dateObj.setMonth((thisQuarter * 3) - 3);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setMonth(dateObj.getMonth() + 3);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "this_yearOption":
            var dateObj = new Date();
            dateObj.setDate(1);
            dateObj.setMonth(0);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setFullYear(dateObj.getFullYear() + 1);
            dateObj.setMonth(0);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "last_yearOption":
            var dateObj = new Date();
            dateObj.setFullYear(dateObj.getFullYear() - 1);
            dateObj.setDate(1);
            dateObj.setMonth(0);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setFullYear(dateObj.getFullYear() + 1);
            dateObj.setMonth(0);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "next_yearOption":
            var dateObj = new Date();
            dateObj.setFullYear(dateObj.getFullYear() + 1);
            dateObj.setDate(1);
            dateObj.setMonth(0);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setFullYear(dateObj.getFullYear() + 1);
            dateObj.setMonth(0);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
    }

    return fromToObj;
}


function generateAdvFilterDates(dateFld) {

    var selectionvalue = document.querySelector(`#${dateFld}_dateoption`).value;
    var currentDate = new Date();
    var fromDate = document.querySelector(`#${dateFld}_from`);
    var toDate = document.querySelector(`#${dateFld}_to`);

    var fromToObj = getDatesBasedonSelection(selectionvalue);

    fromDate.value = fromToObj.from;
    toDate.value = fromToObj.to;

    if (selectionvalue == "customOption") {
        fromDate.disabled = false;
        toDate.disabled = false;
        fromDate.classList.add('disabledDate');
        toDate.classList.add('disabledDate');
    }
    else {
        fromDate.disabled = true;
        toDate.disabled = true;
        fromDate.classList.remove('disabledDate');
        toDate.classList.remove('disabledDate');
    }

}

function getDateBasedOnCulture(dateStr) {
    if (dateStr != "") {
        let dateStrArr = dateStr.split(" ");
        dateStr = dateStrArr[0];
        if (dtCulture == "en-us") {
            var splittedDate = dateStr.split("/");
            if (splittedDate.length > 2) {
                if (isPerf && splittedDate[0].length == 4) {
                    dateStr = splittedDate[2] + "/" + splittedDate[0] + "/" + splittedDate[1];
                } else {
                    dateStr = splittedDate[1] + "/" + splittedDate[0] + "/" + splittedDate[2];
                }
            }
        } else {
            var splittedDate = dateStr.split("-");
            if (splittedDate.length > 2) {
                if (isPerf && splittedDate[0].length == 4) {
                    dateStr = splittedDate[2] + "/" + splittedDate[1] + "/" + splittedDate[0];
                }
            }
        }
        if (dateStrArr[1]) {
            dateStr = `${dateStr} ${dateStrArr[1]}`;
        }
    }
    return dateStr;
}

function generateFilterString(filterType, filterval, textOption) {
    var filterStr = "";
    switch (filterType) {
        case 'DROPDOWN':
            var filterArr = filterval.split(",");
            if (filterArr.length == 1) {
                filterStr = `= '${filterval}'`;
            }
            else {
                filterStr = `in (`
                filterArr.forEach(filter => {
                    filterStr += `'${filter}',`;
                })
                if (filterStr.endsWith(','))
                    filterStr = filterStr.substr(0, filterStr.length - 1);
                filterStr += `)`
            }
            break;
        case 'DATE':
            var filterArr = filterval.split("~~");
            if (textOption == "FROMDATE")
                filterStr = `>= '${filterArr[0]}'`;
            else if (textOption == "TODATE")
                filterStr = `<= '${filterArr[0]}'`;
            else
                filterStr = `between '${filterArr[0]}' and '${filterArr[1]}'`;
            break;
        case 'NUMERIC':
            var filterArr = filterval.split("~~");
            if (textOption == "FROM")
                filterStr = `>= ${filterArr[0]}`;
            else if (textOption == "TO")
                filterStr = `<= ${filterArr[0]}`;
            else
                filterStr = `between ${filterArr[0]} and ${filterArr[1]}`
            break;
        case 'TEXT':

            if (textOption == "STARTSWITH") {
                filterStr = `like '${filterval}%'`;
            }
            else if (textOption == "CONTAINS") {
                filterStr = `like '%${filterval}%'`;
            }
            else if (textOption == "ENDSWITH") {
                filterStr = `like '%${filterval}'`;
            }
            else {
                filterStr = `like '%${filterval}%'`;
            }
            break;
        default:
            filterStr = `= '${filterval}'`;
            break;
    }
    return filterStr;
}



function applyFilters(pillText = "", pillClass = "", isChecked = false, fieldId, filterDetails) {

    if (JSON.stringify(_entity.filterObj).includes(pillClass)) {
        console.log('Pill already present, just need to filter');
    }

    parent.ShowDimmer(true);
    var invalidFilter = false;
    var filterFldArr = [];
    var filterArr = [];


    // // Remove the existing pill if it exists
    // var existingPills = $(`.secondary_card_header .${pillClass}`);
    // if (existingPills.length < 0) {
    //     existingPills.remove();
    // }

      let customFilterName = document.getElementById('filterGroupName').value;
      if (document.getElementById('filterGroupCheckbox').checked && customFilterName) {
          _entity.filterObj[pillClass] = {
              ..._entity.filterObj[pillClass],
              'customFilterName': customFilterName
          };
      }

    // Initialize or update global object _entity.filterObj
    if (_entity.filterObj === null) {
        _entity.filterObj = { [pillClass]: { 'pillText': pillText, 'isChecked': isChecked } };
    } else {
        _entity.filterObj = { ..._entity.filterObj, [pillClass]: { 'pillText': pillText, 'isChecked': isChecked } };
    }

    var advFilterDtCulture = dtCulture == "en-us" ? "MM/DD/YYYY" : "DD/MM/YYYY";

    // Identify the table name from the field which has dc = dc1
    // var tableName = "";
    // _entity.metaData.forEach(item => {
    //     if (item.dcname === "dc1") {
    //         tableName = item.tablename;
    //     }
    // });

    document.querySelectorAll("#dvModalFilter .filter-fld").forEach(fld => {
        let filterval = fld.value;
        let fldType = fld.dataset.type;
        if (_entity.inValid(fldType))
            return;

        fldType = fldType.toUpperCase();
        var tmpFld = _entity.metaData.find(item => item.fldname === fld.id)
        let filterObjVal = fldType

        switch (fldType) {
            case "DROPDOWN":
                if (_entity.inValid(filterval) || filterval == 0)
                    return;

                filterval = $(fld).val().join(',');

                filterFldArr.push(`${fld.id}~${tmpFld.normalized}~${tmpFld.srctable || ""}~${tmpFld.srcfield || ""}~${tmpFld.fdatatype || ""}~${tmpFld.listingfld || ""}~${tmpFld.tablename || ""}`);
                filterArr.push(generateFilterString(fldType, filterval.toLowerCase()));

                // storing data in filterObj
                filterObjVal = filterObjVal + ',' + filterval
                _entity.filterObj[pillClass] = { ..._entity.filterObj[pillClass], [fld.id]: filterObjVal }

                break;

            case "DATE":
                var dates = fld.querySelectorAll("input");
                var fromDate = dates[0];
                var toDate = dates[1];

                if (fromDate.value == "" && toDate.value == "") {
                    return;
                }

                filterFldArr.push(`${fld.id}~${tmpFld.normalized}~${tmpFld.srctable || ""}~${tmpFld.srcfield || ""}~${tmpFld.fdatatype || ""}~${tmpFld.listingfld || ""}~${tmpFld.tablename || ""}`);

                if (fromDate.value != "" && toDate.value == "") {
                    filterval = moment(fromDate.value, advFilterDtCulture).format("DD-MMM-YYYY");
                    filterArr.push(generateFilterString(fldType, filterval, "FROMDATE"));

                    console.log("Applied filter string: ", generateFilterString(fldType, filterval, "FROMDATE"))

                    if ($(`#${fld.id}_dateoption`).val() === 'customOption') {
                        filterObjVal = filterObjVal + ',' + 'customOption' + ',' + 'FROMDATE' + ',' + fromDate.value
                    } else {
                        filterObjVal = filterObjVal + ',' + $(`#${fld.id}_dateoption`).val()
                    }
                }
                else if (toDate.value != "" && fromDate.value == "") {
                    filterval = moment(toDate.value, advFilterDtCulture).format("DD-MMM-YYYY");
                    filterArr.push(generateFilterString(fldType, filterval, "TODATE"));

                    console.log("Applied filter string: ", generateFilterString(fldType, filterval, "TODATE"))

                    if ($(`#${fld.id}_dateoption`).val() === 'customOption') {
                        filterObjVal = filterObjVal + ',' + 'customOption' + ',' + 'TODATE' + ',' + toDate.value
                    } else {
                        filterObjVal = filterObjVal + ',' + $(`#${fld.id}_dateoption`).val()
                    }

                }
                else {
                    filterval = moment(fromDate.value, advFilterDtCulture).format("DD-MMM-YYYY") + "~~" + moment(toDate.value, advFilterDtCulture).format("DD-MMM-YYYY");
                    filterArr.push(generateFilterString(fldType, filterval));

                    console.log("Applied filter string: ", generateFilterString(fldType, filterval))

                    if ($(`#${fld.id}_dateoption`).val() === 'customOption') {
                        filterObjVal = filterObjVal + ',' + 'customOption' + ',' + 'FROMDATE' + ',' + fromDate.value + ',' + 'TODATE' + ',' + toDate.value
                    } else {
                        filterObjVal = filterObjVal + ',' + $(`#${fld.id}_dateoption`).val()
                    }

                }

                // storing data in filterObj
                _entity.filterObj[pillClass] = { ..._entity.filterObj[pillClass], [fld.id]: filterObjVal }

                break;

            case "NUMERIC":
                var nums = fld.querySelectorAll("input");
                var fromNum = nums[0];
                var toNum = nums[1];

                if (fromNum.value == "" && toNum.value == "") {
                    return;
                }

                filterFldArr.push(`${fld.id}~${tmpFld.normalized}~${tmpFld.srctable || ""}~${tmpFld.srcfield || ""}~${tmpFld.fdatatype || ""}~${tmpFld.listingfld || ""}~${tmpFld.tablename || ""}`);

                if (fromNum.value != "" && toNum.value == "") {
                    filterval = fromNum.value
                    filterArr.push(generateFilterString(fldType, filterval, "FROM"));

                    // Console logging filter string
                    console.log("Applied Filter String: ", generateFilterString(fldType, filterval, "FROM"))

                    filterObjVal = filterObjVal + ",FROM," + fromNum.value
                }
                else if (toNum.value != "" && fromNum.value == "") {
                    filterval = toNum.value
                    filterArr.push(generateFilterString(fldType, filterval, "TO"));

                    // Console logging filter string
                    console.log("Applied Filter String: ", generateFilterString(fldType, filterval, "TO"))

                    filterObjVal = filterObjVal + ',TO,' + toNum.value
                }
                else {
                    filterval = fromNum.value + "~~" + toNum.value;
                    filterArr.push(generateFilterString(fldType, filterval));

                    // Console logging filter string
                    console.log("Applied Filter String: ", generateFilterString(fldType, filterval))

                    filterObjVal = filterObjVal + ',FROM,' + fromNum.value + ',TO,' + toNum.value
                }

                // storing data in filterObj
                _entity.filterObj[pillClass] = { ..._entity.filterObj[pillClass], [fld.id]: filterObjVal }

                break;

            default:
                if (_entity.inValid(filterval))
                    return;
                filterFldArr.push(`${fld.id}~${tmpFld.normalized}~${tmpFld.srctable || ""}~${tmpFld.srcfield || ""}~${tmpFld.fdatatype || ""}~${tmpFld.listingfld || ""}~${tmpFld.tablename || ""}`);
                var searchOption = document.querySelector(`#${fld.id}_searchoption`).value || "CONTAINS";
                filterArr.push(generateFilterString("TEXT", filterval.toLowerCase(), searchOption));

                // storing data in filterObj
                filterObjVal = "TEXT" + ',' + filterval + ',' + searchOption
                _entity.filterObj[pillClass] = { ..._entity.filterObj[pillClass], [fld.id]: filterObjVal }

                break;
        }

    });

    if (invalidFilter)
        return;



    // Construct the filter string with custom handling for modifiedon and modifiedby
    var filterStr = "";

    var filterStr = "";
    filterFldArr.forEach((filterFld, idx) => {
        filterStr += `${filterFld}|${filterArr[idx]}^^`
    })
    if (filterStr.endsWith("^^"))
        filterStr = filterStr.substr(0, filterStr.length - 2);

    console.log("Final filter applied string: ", filterStr);

    if (pillClass) {
        if (isChecked) {
            _entity.setSelectedFilters(JSON.stringify(_entity.filterObj));
        }
        createPill(_entity.filterObj);
    }
    console.log("Filter Object: ", _entity.filterObj);

    // Custom filtering logic using listjson
    // var filteredData = _entity.listJson.filter(row => {
    //     let matches = true;

    //     // Check if 'modifiedon' filter is applied
    //     if (_entity.filterObj[pillClass] && _entity.filterObj[pillClass].hasOwnProperty('modifiedon')) {
    //         let filterDetails = _entity.filterObj[pillClass]['modifiedon'].split(',');
    //         let fromDate = filterDetails[3] || null;
    //         let toDate = filterDetails[5] || null;

    //         let rowDate = moment(row.modifiedon, "YYYY-MM-DDTHH:mm:ss");

    //         if (fromDate) {
    //             let fromMoment = moment(fromDate, advFilterDtCulture);
    //             console.log(`Checking if ${rowDate.format()} is after ${fromMoment.format()}`);
    //             matches = matches && rowDate.isSameOrAfter(fromMoment);
    //         }
    //         if (toDate) {
    //             let toMoment = moment(toDate, advFilterDtCulture);
    //             console.log(`Checking if ${rowDate.format()} is before ${toMoment.format()}`);
    //             matches = matches && rowDate.isSameOrBefore(toMoment);
    //         }
    //     }

    //     // Check if 'modifiedby' filter is applied
    //     if (_entity.filterObj[pillClass] && _entity.filterObj[pillClass].hasOwnProperty('modifiedby')) {
    //         let filterBy = _entity.filterObj[pillClass]['modifiedby'].split(',')[1];
    //         console.log(`Checking if ${row.modifiedby.toLowerCase()} matches ${filterBy.toLowerCase()}`);
    //         matches = matches && (row.modifiedby.toLowerCase() === filterBy.toLowerCase());
    //     }

    //     return matches;
    // });

    // console.log("Filtered Data:", filteredData);

    // let listContainer = document.getElementById('body_Container');
    // if (listContainer) {
    //     console.log("Container found. Updating contents.");
    //     listContainer.innerHTML = '';
    //     createListHTML(filteredData, 1);
    // } else {
    //     console.error("Container with ID 'body_Container' not found.");
    // }

    if (filterStr.startsWith("modifiedby~"))
        filterStr = filterStr.replace("modifiedby~", "username~");

    _entity.filter = filterStr;
    _entity.getEntityListData(1);



    // appliedFilterObj[fieldId] = filterDetails;

    // createPill(appliedFilterObj);

    $('#filterModal').modal('hide');

    parent.ShowDimmer(false);
}



// function displayFilteredData(filteredData) {
//     let listContainer = document.querySelector('#entityDataContainer');
//     if (listContainer) {
//         // Generate HTML content for filtered data
//         let content = filteredData.map(row => {
//             let entityElement = constructEntityPopup(row); // Adjust this function to return HTML string
//             return entityElement.outerHTML;
//         }).join('');

//         // Update container's innerHTML
//         listContainer.innerHTML = content;
//     } else {
//         console.error("Container with ID 'entityDataContainer' not found.");
//     }
// }


function resetFilters() {
    parent.ShowDimmer(true);
    document.querySelectorAll("#dvModalFilter .filter-fld").forEach(fld => {
        let fldType = fld.dataset.type;

        if (_entity.inValid(fldType))
            return;

        fldType = fldType.toUpperCase();

        switch (fldType) {
            case "DROPDOWN":
                $(fld).val("");
                $(fld).trigger("change");
                break;
            case "NUMERIC":
                var nums = fld.querySelectorAll("input");
                var fromNum = nums[0];
                var toNum = nums[1];
                fromNum.value = "";
                toNum.value = "";
                break;
            case "DATE":
                var dates = fld.querySelectorAll("input");
                var fromDate = dates[0];
                var toDate = dates[1];
                fromDate.value = "";
                toDate.value = "";
                break;
            default:
                fld.value = "";
                break;
        }

    });

    _entity.filter = "";
    _entity.getEntityListData(1);
    document.getElementById('customCheckBox').checked = false
    document.getElementById('filterGroupName').disabled = true

}


function openFieldSelection() {

    $('#fieldsModal').modal('show');
    if ($('#fields-selection').html() == "")
        createFieldsLayout();
}

//function createFieldsLayout() {
//    const tbody = document.getElementById("table-body");
//    const selectField = document.getElementById("selectField");

//    // Add checkboxes and table rows dynamically
//    _entity.metaData.filter(item => item.listingfld === "T").forEach((data, index) => {
//        if (getFieldDataType(data) == "button")
//            return;

//        const tr = document.createElement("tr");
//        tr.innerHTML = `
//          <td><input type="checkbox" id="chk_${data.fldname}" class="chk-fields" value="${data.fldname}" data-fldcap="${data.fldcap}" data-dcname="${data.dcname}"></td>
//          <td><label for="chk_${data.fldname}">${data.fldcap}</label></td>
//        `;
//        tbody.appendChild(tr);
//    });

//    const checkFields = document.querySelectorAll(".chk-fields");
//    if (_entity.fields != "All") {
//        _entity.fields.split("|").forEach(fld => {
//            var fldName = (fld.indexOf("=") > -1) ? fld.split("~")[0].split('=')[1] : fld.split("~")[0];
//            document.querySelector(`#chk_${fldName}`).checked = true;
//        });

//        if (checkFields.length == _entity.fields.split("^").length)
//            document.querySelector("#check-all").checked = true;
//    }
//    else {
//        checkFields.forEach((checkbox) => {
//            checkbox.checked = true;
//        });
//        document.querySelector("#check-all").checked = true;
//        _entity.keyField = checkFields[0].value; //Set first field as keyfield;
//    }

//    // Initial update of select options
//    updateSelectOptions();



//    checkFields.forEach((checkbox) => {
//        checkbox.addEventListener("change", function () {

//            if (checkFields.length == document.querySelectorAll(".chk-fields:checked").length)
//                document.querySelector("#check-all").checked = true;
//            else
//                document.querySelector("#check-all").checked = false;
//            updateSelectOptions(); // Update select options whenever a checkbox is checked or unchecked
//        });
//    });

//    // Event listener for "Check All" checkbox
//    const checkAllCheckbox = document.getElementById("check-all");
//    checkAllCheckbox.addEventListener("change", function () {
//        const isChecked = checkAllCheckbox.checked;
//        checkFields.forEach((checkbox) => {
//            checkbox.checked = isChecked;
//        });
//        updateSelectOptions(); // Update select options when "Check All" checkbox is clicked
//    });

//    // Event listener for select field
//    selectField.addEventListener("change", function () {
//        _entity.keyField = "";
//        const selectedOption = selectField.value;
//        if (selectedOption !== "0" && selectedOption !== "") {
//            document.querySelector(`#chk_${selectedOption}`).checked = true;
//            _entity.keyField = selectedOption;
//            updateSelectOptions();
//        }
//    });
//}

function createFieldsLayout() {
    const fieldsContainer = document.getElementById("fields-selection");
    let skipFields = ["transid", "modifiedby", "modifiedon", "createdby", "createdon"];
    var fields = _entity.metaData.filter(item => item.ftransid === _entity.entityTransId && item.hide === "F" && item.griddc == "F" && (item.cdatatype === "DropDown" || item.fdatatype == "c" || item.fdatatype == "d") && skipFields.indexOf(item.fldname) == -1);
    const groupedFields = {};
    fields.forEach(field => {
        if (field.dcname) {
            if (!groupedFields[field.dcname]) {
                groupedFields[field.dcname] = [];
            }
            groupedFields[field.dcname].push(field);
        }
    });

    var html = '';
    Object.entries(groupedFields).forEach(([dc, dcFields]) => {
        let dcName = _entity.metaData.find(item => item.dcname == dc).dccaption || dc;;
        let collapsed = true;
        if (dc == "dc1")
            collapsed = false;

        html += `
        <div class="card KC_Items">
            <div class="card-header collapsible cursor-pointer rotate ${collapsed ? "collapsed" : ""}" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#fields-${dc}">
                <h3 class="card-title">${dcName} (${dc})</h3>
                <div class="card-toolbar rotate-180">
                    <span class="material-icons material-icons-style material-icons-2">
                        expand_circle_down
                    </span>
                </div>
            </div>
            <div class="KC_Items_Content collapse ${collapsed ? "" : "show"} heightControl pt-0---" id="fields-${dc}">
            <table class="table table-hover">
                <tbody id="fields-table-body">`;

        dcFields.forEach(fld => {
            html += `<tr><td><input type="checkbox" id="chk_${fld.fldname}" class="chk-fields chk-relateddataflds" value="${fld.fldname}" data-fldcap="${fld.fldcap}" data-dcname="${dc}"></td>
          <td><label for="chk_${fld.fldname}">${fld.fldcap || ''}  (${fld.fldname})</label></td></tr>`;

        })
        html += `</tbody></table></div></div>`;
    })

    fieldsContainer.innerHTML = html;
    const checkFields = document.querySelectorAll(".chk-fields");
    if (_entity.fields != "All") {
        _entity.fields.split("^").forEach(dcwiseFlds => {
            dcwiseFlds.split("|").forEach(fld => {
                var fldName = (fld.indexOf("=") > -1) ? fld.split("~")[0].split('=')[1] : fld.split("~")[0];
                if (document.querySelector(`#chk_${fldName}`))
                    document.querySelector(`#chk_${fldName}`).checked = true;

            })
        });

        if (checkFields.length == _entity.fields.split("|").length) {
            document.querySelector("#check-all").checked = true;
        }
    }
    else {
        checkFields.forEach((checkbox) => {
            if (checkbox.dataset.dcname == "dc1")
                checkbox.checked = true;
        });
        //document.querySelector("#check-all").checked = true;
        _entity.keyField = checkFields[0].value; //Set first field as keyfield;
    }

    // Initial update of select options
    updateSelectOptions();



    checkFields.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {

            if (checkFields.length == document.querySelectorAll(".chk-fields:checked").length)
                document.querySelector("#check-all").checked = true;
            else
                document.querySelector("#check-all").checked = false;
            updateSelectOptions(); // Update select options whenever a checkbox is checked or unchecked
        });
    });

    // Event listener for "Check All" checkbox
    const checkAllCheckbox = document.getElementById("check-all");
    checkAllCheckbox.addEventListener("change", function () {
        const isChecked = checkAllCheckbox.checked;
        checkFields.forEach((checkbox) => {
            checkbox.checked = isChecked;
        });
        updateSelectOptions(); // Update select options when "Check All" checkbox is clicked
    });

    // Event listener for select field
    selectField.addEventListener("change", function () {
        _entity.keyField = "";
        const selectedOption = selectField.value;
        if (selectedOption !== "0" && selectedOption !== "") {
            document.querySelector(`#chk_${selectedOption}`).checked = true;
            _entity.keyField = selectedOption;
            updateSelectOptions();
        }
    });

}

function updateSelectOptions() {
    const selectField = document.getElementById("selectField");
    selectField.innerHTML = ""; // Clear existing options
    const checkFields = document.querySelectorAll(".chk-fields");
    checkFields.forEach((checkbox) => {
        if (checkbox.checked) {
            const fieldName =
                checkbox.dataset.fldcap || '';
            const option = document.createElement("option");
            option.textContent = fieldName;
            option.value = checkbox.value;
            selectField.appendChild(option);
        }
    });
    selectField.disabled = ![...checkFields].some(
        (checkbox) => checkbox.checked
    ); // Disable the select if no checkbox is checked
    selectField.value = _entity.keyField;
}

function applyFields() {
    const selectedFields = document.querySelectorAll(".chk-fields:checked");

    // Check if no checkboxes are selected
    if (selectedFields.length === 0) {
        showAlertDialog("error", "Error: No fields are selected.");
        return; // Exit the function
    }
    const selectField = document.getElementById("selectField");
    if (selectField.value === 0 || selectField.value === "") {
        showAlertDialog("error", "Error: Key Field is not selected.");
        return; // Exit the function
    }

    let fldsStr = "";
    let groupedSelectedFlds = {}
    selectedFields.forEach((field) => {
        let dcName = field.dataset.dcname;
        if (!groupedSelectedFlds[dcName])
            groupedSelectedFlds[dcName] = [];

        const fieldName = field.value;
        groupedSelectedFlds[dcName].push(fieldName);

        //const fieldData = _entity.metaData.find(item => item.fldname === fieldName);
        //fldsStr += `${fieldData.tablename}=${fieldData.fldname}~${fieldData.normalized}~${fieldData.srctable || ""}~${fieldData.srcfield || ""}~${fieldData.allowempty}^`;
    });

    Object.entries(groupedSelectedFlds).forEach(([dcName, fields]) => {
        const tempFldData = _entity.metaData.find(item => item.fldname === fields[0]);
        fldsStr += `${tempFldData.tablename}=`;
        fields.forEach(fld => {
            const fieldData = _entity.metaData.find(item => item.fldname === fld);
            fldsStr += `${fieldData.fldname}~${fieldData.normalized}~${fieldData.srctable || ""}~${fieldData.srcfield || ""}~${fieldData.allowempty}|`;
        });
        if (fldsStr.endsWith("|"))
            fldsStr = fldsStr.substr(0, fldsStr.length - 1);

        fldsStr += `^`;
    });

    if (fldsStr.endsWith("^"))
        fldsStr = fldsStr.substr(0, fldsStr.length - 1);

    _entity.fields = fldsStr
    _entity.keyField = selectField.value;
    _entity.setSelectedFields();
}

function resetFields() {
    const checkFields = document.querySelectorAll(".chk-fields , #check-all");
    checkFields.forEach((checkbox) => {
        checkbox.checked = true;
    })
    _entity.fields = "All";
    _entity.keyField = checkFields[0].value;
    updateSelectOptions();
    _entity.setSelectedFields();
}

function fieldsModelClose() {
    $('#fieldsModal').modal('hide');
}

function getFieldDataType(fldProps) {
    if (_entity.inValid(fldProps.cdatatype)) {
        if (fldProps.fdatatype == "n")
            return "Number";
        else if (fldProps.fdatatype == "d")
            return "Date";
        else if (fldProps.fdatatype == "c")
            return "Text";
        else if (fldProps.fdatatype == "i")
            return "Image";
        else if (fldProps.fdatatype == "t")
            return "Large Text";
        else
            return "Text";
    }
    else
        return fldProps.cdatatype;
}


function getKeyField(metaData) {
    if (_entity.fields != "All") {
        let fld;
        const fields = _entity.fields.split('^');

        for (let field of fields) {
            const parts = field.split('~');
            if (parts[4] === 'T') {
                fld = parts[0].split('=')[1]; // Return the fieldname
            }
        }

        if (fld) {
            const keyFld = metaData.find(item => item.fldname === fld);
            if (keyFld) {
                return keyFld;
            }

        }

    }

    // Filter objects with "cdatatype": "Autogenerate"
    const autoGenerateField = metaData.find(item => item.cdatatype === "Auto Generate");
    if (autoGenerateField) {
        return autoGenerateField;
    }

    // Filter objects with hide = F and mandatory/allow empty = T and allowduplicate = F
    const mandatoryUniqueFld = metaData.find(item => item.hide === "F" && item.allowempty === "F" && item.allowduplicate === "F");
    if (mandatoryUniqueFld) {
        return mandatoryUniqueFld;
    }

    // Filter objects with hide = F and mandatory/allow empty = T
    const mandatoryFld = metaData.find(item => item.hide === "F" && item.allowempty === "F");
    if (mandatoryFld) {
        return mandatoryFld;
    }

    // Filter objects with hide = F
    const visibleFld = metaData.find(item => item.hide === "F");
    if (visibleFld) {
        return visibleFld;
    }

    // If none of the above conditions match, return first row
    return metaData[0];
}

function getARMLogs() {
    const tableContainer = document.getElementById('logs-table-container');
    tableContainer.innerHTML = "Loading logs...";
    $('#logsModal').modal('show');

    let _this = _entity;
    let url = "../aspx/Entity.aspx/GetARMLogsWS";
    _this.callAPI(url, {}, true, result => {
        if (result.success) {

            try {
                let logsJson = JSON.parse(JSON.parse(result.response).d);
                tableContainer.innerHTML = createARMLogsTable(logsJson);
            }
            catch {
                tableContainer.innerHTML = "No Logs available";
            }
        }
        else {
        }
    });
}

function createARMLogsTable(data) {
    // Create the table element
    const table = document.createElement('table');
    table.className = 'table table-striped table-bordered';

    // Create the table body
    const tbody = document.createElement('tbody');

    // Populate the table rows
    data.forEach(item => {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.innerText = item;
        row.appendChild(cell);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table.outerHTML;
}


function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const searchInput = document.getElementById("searchBox");
const liveSearchDebounced = debounce(liveSearch, 500);

function handleSearchInput() {
    if (searchInput.value === "") {
        liveSearch(); // Call immediately if input is empty
    } else {
        liveSearchDebounced();
    }
}

searchInput.addEventListener("keyup", handleSearchInput);
searchInput.addEventListener("input", handleSearchInput);

function liveSearch() {
    let cardsData = document.querySelectorAll(".Project_items");
    let tableRows = document.querySelectorAll("tbody tr");
    let searchTerm = searchInput.value.toLowerCase();

    // Filter card view items
    cardsData.forEach((card) => {
        if (card.innerText.toLowerCase().includes(searchTerm)) {
            card.classList.remove("d-none");
        } else {
            card.classList.add("d-none");
        }
    });

    // Filter table view rows
    tableRows.forEach((row) => {
        if (row.innerText.toLowerCase().includes(searchTerm)) {
            row.classList.remove("d-none");
        } else {
            row.classList.add("d-none");
        }
    });
}


let isCardView = true;

function toggleView(storeData = false) {
    pageNo = 1;
    isCardView = !isCardView;
    _entity.viewMode = isCardView ? 'card' : 'table'; 

    if (storeData) {
        var data = {
            page: "Entity", 
            transId: _entity.entityTransId,
            properties: { "tableView": !isCardView }, 
            confirmNeeded: true,
            storeData: storeData, 
            allUsers: false
        };

        _entityCommon.setAnalyticsDataWS(data, successCB = () => {
            console.log('View state saved successfully');
        }, errorCB = (error) => {
            showAlertDialog("error", error.status + " " + error.statusText);
        });
    }

    if (isCardView) {
        $('#table-body_Container').hide(); 
        $('#body_Container').show();
        createCardViewHTML();
        $('#viewIcon').text('view_module');
    } else {
        $('#body_Container').hide(); 
        $('#table-body_Container').show();
        if (_entity.listJson.length > 0) {
            $('#table-body_Container').html(createTableViewHTML(_entity.listJson));
            
            const tableDiv = document.querySelector('.table-responsive');
            tableDiv.removeEventListener('scroll', scrollListener); 
            tableDiv.addEventListener('scroll', scrollListener);

            $('#viewIcon').text('view_list');
        } else {
            _entity.listJson = [];
            document.querySelector("#table-body_Container").innerHTML = _entity.emptyRowsHtml;
            $('#viewIcon').text('view_module');

            const noMoreRecordsMessage = document.createElement('div');
            noMoreRecordsMessage.classList.add('no-records-message');
            noMoreRecordsMessage.textContent = "No more records";
            $('#table-body_Container').append(noMoreRecordsMessage);

            setTimeout(function () {
                $(noMoreRecordsMessage).remove();
            }, 3000);
        }
    }
}

function onToggleButtonClick() {
    toggleView(true); 
}





function createTableViewHTML(listJson, _pageNo) {
    let tableBodyContainer = $('#table-body_Container');
    let tableExists = tableBodyContainer.find('table').length > 0;
    let keyCol = _entity.keyField || ''; 
    let html = '';
    let excludedFields = new Set(['transid', 'ftransid']); 

    let hideTransid = !listJson.some(rowData => rowData[keyCol]);

    if (!keyCol || !_entity.metaData.some(field => field.fldname === keyCol)) {
        const filteredFields = _entity.metaData.filter(item => item.listingfld === "T");
        const keyField = getKeyField(filteredFields);
        keyCol = keyField ? keyField.fldname : _entity.keyField; 
    }

    let fieldsWithData = new Set();
    listJson.forEach(rowData => {
        for (let field in rowData) {
            if (rowData[field] !== null && rowData[field] !== undefined && !excludedFields.has(field)) {
                fieldsWithData.add(field);
            }
        }

        Object.entries(rowData).forEach(([key, value]) => {
            if (_entity.inValid(_entity.fldData[key])) {
                _entity.fldData[key] = [];
            }
            _entity.fldData[key].push(value || "");
        });
    });

    if (!tableExists) {
        html += '<div class="table-responsive"><table class="table table-striped">';

        html += '<thead class="sticky-header"><tr>';
        html += '<th><input type="checkbox" id="selectAllCheckbox" onclick="toggleSelectAll(this)"></th>';
        html += '<th>Edit Form</th>'; 

        if (fieldsWithData.has(keyCol)) {
            const keyField = _entity.metaData.find(field => field.fldname === keyCol);
            if (keyField) {
                html += `<th>${keyField.fldcap}</th>`;
            }
        }

        const addedFields = new Set();
        _entity.metaData.forEach(field => {
            if (field.fldname !== keyCol && fieldsWithData.has(field.fldname) && !excludedFields.has(field.fldname) && (!hideTransid || field.fldname !== 'transid')) {
                if (!addedFields.has(field.fldname)) {
                    html += `<th>${field.fldcap}</th>`;
                    addedFields.add(field.fldname);
                }
            }
        });
        html += '</tr></thead><tbody>';
    } else {
        tableBodyContainer.find('tbody').empty();
    }

    listJson.forEach((rowData, index) => {
        html += `<tr>`;
        html += `<td><input type="checkbox" class="rowCheckbox" data-index="${index}" data-recordid="${rowData.recordid}"></td>`;
        html += `<td><button type="button" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm me-3" data-bs-toggle="tooltip" title="Edit" data-bs-original-title="Edit" onclick="_entity.editEntity('${rowData.recordid}')"><span class="material-icons material-icons-style material-icons-2" style="color: red;">edit_note</span></button></td>`;
    
        if (fieldsWithData.has(keyCol)) {
            const entityName = _entity.entityName;
            const transId = _entity.entityTransId;
            const recordId = rowData.recordid;
            const keyValue = rowData[keyCol];
            const rowNo = rowData.rno;
    
            html += `<td><a href="#" onclick="_entity.openEntityForm('${entityName}','${transId}', '${recordId}', '${keyValue}', ${rowNo})">${keyValue}</a></td>`;
        } else {
            html += `<td></td>`;
        }
    
        _entity.metaData.forEach(field => {
            if (field.fldname !== keyCol && fieldsWithData.has(field.fldname) && !excludedFields.has(field.fldname) && (!hideTransid || field.fldname !== 'transid')) {
                let fieldValue = rowData[field.fldname];
                let cellContent = '';
    
                if (fieldValue === 'T' || fieldValue === 'F') {
                    cellContent = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" ${fieldValue === 'T' ? 'checked' : ''} disabled>
                        </div>`;
                } else if (field.fldname === 'docdate' || field.fldname === 'modifiedon' && fieldValue) {
                    cellContent = formatDateString(fieldValue);
                } else {
                    cellContent = `${fieldValue || ''}`;
                }
    
                html += `<td>${cellContent}</td>`;
            }
        });
    
        html += `</tr>`;
    });
    

    if (!tableExists) {
        html += '</tbody></table></div>';
        tableBodyContainer.append(html);
        initializeDataTable(); 
    } else {
        tableBodyContainer.find('tbody').append(html);
        // Reinitialize DataTable if needed
        updateDataTableOrdering(document.querySelector('#selectAllCheckbox').checked);
    }
}

// function deleteSelectedRecordsFromToolbar() {
//     // Gather selected record IDs
//     const checkboxes = document.querySelectorAll('.rowCheckbox');
//     const selectedIds = Array.from(checkboxes)
//         .filter(checkbox => checkbox.checked)
//         .map(checkbox => checkbox.closest('tr').querySelector('td:nth-child(3) a').textContent.trim());

//     if (selectedIds.length > 0) {
//         const confirmationModalBody = document.getElementById('confirmationModalBody');
//         confirmationModalBody.textContent = `Are you sure you want to delete ${selectedIds.length} record(s)?`;
//         const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal1'));
        
//         confirmationModal.show();

//         document.getElementById('confirmButton').addEventListener('click', () => {
//             deleteSelectedRecords(selectedIds);
            
//             confirmationModal.hide();
//         });
//     } else {
//         const notificationModalBody = document.getElementById('notificationModalBody');
//         notificationModalBody.textContent = 'No records selected for deletion.';
//         const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
        
//         notificationModal.show();
//     }
// }




function initializeDataTable() {
    $('#table-body_Container .table').DataTable({
        dom: 'Bfrtip', 
        paging: false, 
        searching: false,
        ordering: true,
        columnDefs: [
            { targets: 0, orderable: false } // Example for specific column
        ]
    });
}



function handleExport(action, tableSelector) {
    const hiddenTableSelector = '#hiddenTable';
    const maxRecords = 49;
    const entityName = _entity.entityName;
    // Determine date format based on culture
    const dateFormat = dtCulture === "en-us" ? "MM/DD/YYYY" : "DD/MM/YYYY";

    function getFileExtension(action) {
        switch (action) {
            case 'PDF':
                return 'pdf';
            case 'Excel':
                return 'xlsx';
            case 'Print':
                return 'pdf';
            default:
                return 'pdf';
        }
    }

    function exportData(table, action) {
        if (table.buttons) {
            switch (action) {
                case 'Print':
                    table.button('.buttons-print').trigger();
                    break;
                case 'PDF':
                    table.button('.buttons-pdf').trigger();
                    break;
                case 'Excel':
                    table.button('.buttons-excel').trigger();
                    break;
                default:
                    console.error("Unsupported export action: " + action);
            }
        } else {
            console.error("Buttons are not initialized for the table");
        }
    }

    const dataCount = _entity.listJson.length;
    const transId = _entity.entityTransId;
    const fileExtension = getFileExtension(action);
    const fileName = `${entityName}.${fileExtension}`; 

    if (dataCount > maxRecords) {
        // Directly call AJAX when dataCount is more than maxRecords (49)
        ASB.WebService.ARMExportPushToQueue(transId, "list", fileName, "Entity", dateFormat, 
            () => {
                // Show the predefined modal on success
                $('#confirmationModal').modal('show');
            },
            (error) => {
                // Show the predefined modal on error
                $('#confirmationModal').modal('show');
                
                console.error("Export request failed: ", error);
            }
        );
    } else {
        // If data is 49 or less, handle export normally
        if (isCardView) {
            createHiddenTableFromMetadata();

            if ($.fn.dataTable.isDataTable(hiddenTableSelector)) {
                $(hiddenTableSelector).DataTable().destroy(); 
            }

            const hiddenTable = $(hiddenTableSelector).DataTable({
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'print',
                    },
                    {
                        extend: 'pdf',
                    },
                    {
                        extend: 'excel',
                    }
                ],
                searching: false,
                paging: false,   
                info: false     
            });

            exportData(hiddenTable, action);
        } else {
            if ($.fn.dataTable.isDataTable(tableSelector)) {
                $(tableSelector).DataTable().destroy(); 
            }

            const table = $(tableSelector).DataTable({
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'print',
                        exportOptions: {
                            columns: ':not(:eq(1))'
                        }
                    },
                    {
                        extend: 'pdf',
                        exportOptions: {
                            columns: ':not(:eq(1))' 
                        }
                    },
                    {
                        extend: 'excel',
                        exportOptions: {
                            columns: ':not(:eq(1))' 
                        }
                    }
                ],
                searching: false, 
                paging: false,    
                info: false       
            });

            exportData(table, action);
        }
    }
}














function createHiddenTableFromMetadata() {
    $('#hiddenTableContainer').empty();

    let tableHtml = `<table id="hiddenTable" class="display nowrap" style="width:100%">
        <thead><tr>`;

    let fieldsWithData = [];

    _entity.metaData.forEach(field => {
        if (field.hide !== 'T') {
            let hasData = _entity.listJson.some(rowData => rowData[field.fldname] && rowData[field.fldname].trim() !== '');

            if (hasData) {
                fieldsWithData.push(field);
                tableHtml += `<th>${field.fldcap}</th>`;
            }
        }
    });

    tableHtml += `</tr></thead><tbody>`;

    _entity.listJson.forEach(rowData => {
        let rowHasData = false;
        let rowHtml = `<tr>`;

        fieldsWithData.forEach(field => {
            let cellValue = rowData[field.fldname] || '';

            if (cellValue !== '') {
                rowHasData = true;

                if (isDateField(field)) {
                    const dateValue = new Date(cellValue);
                    if (!isNaN(dateValue)) {
                        if (field.fldname.toLowerCase() === 'modifiedon') {
                            const formattedDate = dateValue.toLocaleDateString('en-GB', {
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric'
                            });
                            const formattedTime = dateValue.toLocaleTimeString('en-GB', {
                                hour: '2-digit', 
                                minute: '2-digit', 
                                second: '2-digit'
                            });
                            cellValue = `${formattedDate} ${formattedTime}`;
                        } else {
                            // Format other date fields as DD/MM/YYYY
                            cellValue = dateValue.toLocaleDateString('en-GB', {
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric'
                            });
                        }
                    }
                } else {
                    // For non-date fields, remove 'T' and 'Z' if present
                    cellValue = cellValue.replace('T', ' ').replace(/Z$/, '');
                }

                rowHtml += `<td>${cellValue}</td>`;
            } else {
                rowHtml += `<td></td>`;
            }
        });

        rowHtml += `</tr>`;

        if (rowHasData) {
            tableHtml += rowHtml;
        }
    });

    tableHtml += `</tbody></table>`;

    $('#hiddenTableContainer').append(tableHtml);

    // Initialize DataTable with export buttons
    $('#hiddenTable').DataTable({
        dom: 'Bfrtip',
        buttons: ['excel', 'pdf', 'print']
    });
}

function isDateField(field) {
    return field.cdatatype === 'Date' || 
           field.fdatatype === 'd' || 
           field.fldname.toLowerCase() === 'modifiedon';
}



// $(document).ready(function() {
//     $('#selectUtilities').on('click', '.menu-link', function(e) {
//         e.preventDefault();
//         const action = $(this).data('target');
//         handleExport(action, '#table-body_Container .table');
//     });
// });


// function createHiddenTableFromMetadata() {
//     // Clear previous hidden table if it exists
//     $('#hiddenTableContainer').empty();

//     let tableHtml = `<table id="hiddenTable" class="display nowrap" style="width:100%">
//         <thead><tr>`;

//     // Create table headers from the metadata
//     _entity.metaData.forEach(field => {
//         if (field.hide !== 'T') {  // Only include fields that are not hidden
//             tableHtml += `<th>${field.fldname}</th>`;
//         }
//     });

//     tableHtml += `</tr></thead><tbody>`;

//     // Create table rows from the listJson data
//     _entity.listJson.forEach(rowData => {
//         tableHtml += `<tr>`;
//         _entity.metaData.forEach(field => {
//             if (field.hide !== 'T') {
//                 tableHtml += `<td>${rowData[field.fldname] || ''}</td>`;
//             }
//         });
//         tableHtml += `</tr>`;
//     });

//     tableHtml += `</tbody></table>`;

//     // Append the hidden table to the container
//     $('#hiddenTableContainer').append(tableHtml);

//     // Initialize DataTables for the hidden table
//     $('#hiddenTable').DataTable({
//         dom: 'Bfrtip',
//         buttons: ['excel', 'pdf', 'print']
//     });
// }



function toggleSelectAll(source) {
    const checkboxes = document.querySelectorAll('.rowCheckbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = source.checked;
    });

    updateDataTableOrdering(source.checked);

    const selectedIds = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.closest('tr').querySelector('td:nth-child(3) a').textContent.trim()); 

    if (selectedIds.length > 0) {
        deleteSelectedRecords(selectedIds);
    }
}




function showNotification(message) {
    const modalBody = document.querySelector('#notificationModal .modal-body');
    modalBody.textContent = message;

    const confirmationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
    confirmationModal.show();
}



function deleteSelectedRecords() {
    const selectedCheckboxes = document.querySelectorAll('.rowCheckbox:checked');
    if (selectedCheckboxes.length === 0) {
        showNotification("Please select at least one record to delete.");
        return;
    }

    let recIds = [];
    let xmlData = '';
    selectedCheckboxes.forEach((checkbox, index) => {
        const recordId = checkbox.getAttribute('data-recordid');
        recIds.push(recordId);
        xmlData += `
            <row>
                <rowno>${index + 1}</rowno>
                <recordid>${recordId}</recordid>
            </row>`;
    });

    const traceValue = window.top.axTraceFlag ? `â™¦â™¦DeleteRow-${_entity.entityTransId}â™¦` : "";

    const requestPayload = {
        recIds: recIds.join(','), 
        transid: _entity.entityTransId, 
        s: `<root axpapp="${window.top.mainProject}" trace="${traceValue}" sessionid="${window.top.mainSessionId}" stype="iviews" sname="${_entity.entityTransId}" actname="delete">
            <varlist>${xmlData}</varlist>
        </root>`
    };

    try {
        ASB.WebService.DeleteIviewRow(requestPayload.recIds, requestPayload.transid, requestPayload.s, successCallback);
    } catch (ex) {
        showNotification("Error while deleting records. Please try again.");
        console.error("Error while deleting records:", ex);
    }
}






function updateDataTableOrdering(disableOrdering) {
    const table = $('#table-body_Container .table').DataTable();

    if (disableOrdering) {
        // Disable ordering by clearing any current ordering and disabling all columns
        table.order([]).draw(); // Reset ordering
        table.columns().every(function() {
            this.header().setAttribute('data-orderable', 'false');
        });
    } else {
        // Enable ordering by clearing the data-orderable attribute
        table.columns().every(function() {
            this.header().removeAttribute('data-orderable');
        });
    }
}



function createCardViewHTML() {
    createListHTML(_entity.listJson, 1); 
}
// $(document).ready(function () {
//     createCardViewHTML();
// });
function scrollListener(event) {
    const myDiv = event.target;

    const currentScrollTop = myDiv.scrollTop;
    const currentScrollLeft = myDiv.scrollLeft;

    
    if (lastScrollTop !== currentScrollTop) {
        lastScrollTop = currentScrollTop; 

        if (!isFetching && isScrollAtBottomWithinDiv(myDiv)) {
            isFetching = true; 
            pageNo++;

            _entity.getEntityListData(pageNo);

            setTimeout(() => {
                isFetching = false; 
            }, 500); 
        }
    }

    lastScrollLeft = currentScrollLeft;
}
