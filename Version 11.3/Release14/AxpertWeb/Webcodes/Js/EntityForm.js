var iframeindex = -1;
var _subEntity;
var _entityForm;

class SubEntity {
    constructor() {
        this.entityName = '';
        this.entityTransId = '';
        this.recordId = '';
        this.keyValue = '';
        this.metaData = {};
        this.entityWiseMetaData = {};
        this.entityWiseFields = {};
        this.subEntityMapping = {};
        this.listJson = {};
        this.maxPageNumber = 1;
        this.pageSize = 50;
        this.chartsMetaData = [];
        this.subEntityList = {};
        this.selectedCharts = "";
        this.selectedSubEntities = "";
        this.subEntityFilter == "";
        this.selectedChartsObj = {};
        this.activitiesExpanded = false;
        this.isSubEntitiesAvailable = true;
        this.kpiFilter = "";
        this.emptyRowsHtml = `No data found`;
    }



    init() {
        let _this = this;
        _this.getUrlParams();
        if (_this.inValid(_this.entityName)) {
            _this.catchError("Invalid Entity details");
            return;
        }
        document.querySelector("#EntityTitle").innerHTML = `${_this.entityName} - ${_this.keyValue}`;

        try {
            if (axDisallowCreate) {
                var transids = axDisallowCreate.split(",");
                if (transids.indexOf(this.entityTransId) > -1) {
                    this.allowCreate = false;
                    document.querySelector("#add-entity").remove();
                }
            }

            subEntityMetaData = subEntityMetaData.replaceAll(`"{`, `{`).replaceAll(`}"`, `}`);
            subEntityMetaData = JSON.parse(subEntityMetaData);
            _this.metaData = subEntityMetaData.result.metadata;

            if (_subEntity.inValid(_this.recordId) || _this.recordId == "0") {
                _this.recordId = _entityForm.recordId;
            }

            _this.parseSubEntityMetaDataJSON();
            _this.initCharts()
            _this.bindEvents();
            _entityForm.getRelatedEntityListData();
            _entityForm.constructFormRelatedDataAccordions();
        }
        catch {
            showAlertDialog("error", "Error occurred. Please check with administrator.");
        }
    }

    bindEvents() {

        $('#sub-entityhdr').on('shown.bs.collapse', function () {
            _subEntity.activitiesExpanded = true;

            if (document.querySelector("#sub-entitycontainer").classList.contains('data-fetched'))
                return;

            _subEntity.getSubEntityListData(1);
        })

        $('#sub-entityhdr').on('hide.bs.collapse', function () {
            _subEntity.activitiesExpanded = false;
        })

        const checkEntities = document.querySelectorAll(".chk-entities");
        checkEntities.forEach((checkbox) => {
            checkbox.addEventListener("change", function (event) {
                if (checkEntities.length == document.querySelectorAll(".chk-entities:checked").length)
                    document.querySelector("#check-all").checked = true;
                else
                    document.querySelector("#check-all").checked = false;

            });
        });

        const checkAllCheckbox = document.getElementById("check-all");
        checkAllCheckbox.addEventListener("change", function (event) {
            const isChecked = checkAllCheckbox.checked;
            checkEntities.forEach((checkbox) => {
                checkbox.checked = isChecked;
            });
        });
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


    hideChartsMenu() {
        document.querySelector("#add_chart")?.click();
    }

    openNewTstruct() {
        //parent.ShowDimmer(true);
        parent.LoadIframe(`../aspx/tstruct.aspx?transid=${this.entityTransId}`)
    }

    openSubEntityTstruct(transId) {
        let _this = this;
        let params = "";
        if (_this.subEntityMapping[transId]?.["mapfield"] && _this.subEntityMapping[transId]?.["mapsrcdata"]) {
            params = `act=open&${_this.subEntityMapping[transId]?.["mapfield"]}=${_this.subEntityMapping[transId]?.["mapsrcdata"]}`;
        }

        //parent.ShowDimmer(true);
        parent.LoadIframe(`../aspx/tstruct.aspx?transid=${transId}&${params}`)
    }

    editEntity() {
        //parent.ShowDimmer(true);
        parent.LoadIframe(`../aspx/tstruct.aspx?transid=${this.entityTransId}&act=load&recordid=${this.recordId}&dummyload=false`)
    }

    editSubEntity(entityTransId, recordId) {
        //parent.ShowDimmer(true);
        parent.LoadIframe(`../aspx/tstruct.aspx?transid=${entityTransId}&act=load&recordid=${recordId}&dummyload=false`)
    }

    reloadEntityPage() {
        //parent.ShowDimmer(true);
        parent.LoadIframe(`../aspx/EntityForm.aspx?ename=${this.entityName}&tstid=${this.entityTransId}&recid=${this.recordId}&keyval=${this.keyValue}`)
    }

    openEntityForm(entityName, transId, recordId, keyValue, rowNo) {
        if (rowNo) {
            let _this = this;
            _this.updateRelatedData(transId, rowNo)
        }
        //parent.ShowDimmer(true);
        var url = `../aspx/EntityForm.aspx?ename=${entityName}&tstid=${transId}&recid=${recordId}&keyval=${keyValue}`;
        parent.LoadIframe(url);
    }

    updateRelatedData(transId, rowNo) {
        let _this = this;
        if (!window.top.entityNavList)
            window.top.entityNavList = {};

        let tmpArr = _this.getNearestRecords(rowNo);
        tmpArr.forEach(rowData => {
            if (_this.inValid(rowData.entityname)) {
                rowData.entityname = _this.subEntityList[rowData.transid];
            }
        });
        window.top.entityNavList[transId] = _this.getNearestRecords(rowNo);
        window.top.entityNavList.lastTransId = transId;
        window.top.entityNavList.lastCaption = `${_this.keyValue}`;
    }

    openEntityPage(entityName, entityTransId) {
        //parent.ShowDimmer(true);
        parent.LoadIframe(`../aspx/Entity.aspx?ename=${entityName}&tstid=${entityTransId}`)
    }

    getSubEntityKPIFilter() {
        let _this = this;
        let strFilter = "";
        Object.entries(_this.subEntityMapping).forEach(([key, value]) => {
            let mapVal = value["mapdatavalue"];
            let mapFld = value["mapfield"];
            strFilter += `${key}~~~~${value.mapfieldjson.normalized || "F"}~${value.mapfieldjson.srctable || ""}~${value.mapfieldjson.srcfld || ""}~${value.mapfieldjson.allowempty || "F"}~${value.mapfieldjson.tablename || ""}~${mapFld}~'${mapVal}'^`;
        });

        if (strFilter.endsWith("^"))
            return strFilter.substr(0, strFilter.length - 1);
        else
            return strFilter
    }

    getSubEntityFilter() {
        let _this = this;
        let strFilter = "";
        let selectedEntities = [];

        const chkSelectedEntities = document.querySelectorAll(".chk-entities:checked");
        if (chkSelectedEntities.length == 0) {
            showAlertDialog("error", "Error: No filters selected.");
            return false;
        }

        chkSelectedEntities.forEach((checkbox) => {            
            var val = checkbox.value;
            let subEntity = _this.subEntityMapping[val];
            let subEntityMapFldJson = subEntity.mapfieldjson;
            let mapVal = subEntity["mapdatavalue"];
            let mapFld = subEntity["mapfield"];
            strFilter += `${val}=All=${subEntityMapFldJson.tablename}.${mapFld}~'${mapVal}'~${subEntityMapFldJson.tablename}~${subEntityMapFldJson.normalized}~${subEntityMapFldJson.srctable}~${subEntityMapFldJson.srcfield}~${subEntityMapFldJson.allowempty}++`;
            selectedEntities.push(val);
        });

        if (strFilter.endsWith("++"))
            strFilter = strFilter.substr(0, strFilter.length - 2);

        _this.subEntityFilter = strFilter;
        _this.selectedSubEntities = selectedEntities.join(',');
        return true;
    }

    getSubEntityListData(pageNo) {
        let _this = this;
        if (!_this.getSubEntityFilter())
            return;

        parent.ShowDimmer(true);
        let url = "../aspx/EntityForm.aspx/GetSubEntityListDataWS";
        let data = { entityName: _subEntity.entityName, transId: _this.entityTransId, recordId: _this.recordId, fields: _this.subEntityFilter, pageNo: pageNo, pageSize: _this.pageSize, metaData: false, subEntityList: _this.selectedSubEntities };
        _this.callAPI(url, data, false, result => {
            parent.ShowDimmer(false);
            if (result.success) {
                let subEntityListDataJson = JSON.parse(JSON.parse(result.response).d);
                subEntityListDataJson = subEntityListDataJson.result.list ?? [];
                try {
                    if (subEntityListDataJson.constructor != Array)
                        subEntityListDataJson = JSON.parse(subEntityListDataJson);
                }
                catch {
                    showAlertDialog("error", "Error occurred in data fetch.");
                    return;
                }

                if ((subEntityListDataJson.length || 0) == 0) {
                    if (pageNo == 1) {
                        _this.listJson = [];
                        document.querySelector("#body_Container").innerHTML = _this.emptyRowsHtml;
                        return;
                    }

                    noMoreRecordsMessage.style.display = 'block';
                    setTimeout(function () {
                        noMoreRecordsMessage.style.display = 'none';
                    }, 3000);
                }
                else {
                    try {
                        if (pageNo == 1) {
                            _this.listJson = [];
                            _this.entityWiseFields = {}
                            document.querySelector("#body_Container").innerHTML = "";
                        }
                        var newListJson = [];
                        subEntityListDataJson.forEach(item => {
                            newListJson.push(item.data_json);
                        })
                        _this.listJson.push(...newListJson);
                        _this.maxPageNumber = getMaxPageNumber(_this.listJson);
                        noMoreRecordsMessage.style.display = 'none';
                        createListHTML(_this.listJson, pageNo);
                        document.querySelector("#sub-entitycontainer").classList.add('data-fetched');
                        setTimeout(function () {
                            document.querySelector("#activities-link").click();
                        }, 100);
                    }
                    catch {

                        $('#body_Container').append(JSON.parse(result.response).d);
                    }
                }
            }
        });

        //this.getSubEntityPaginationData(1);
        //subEntityListDataJson = subEntityListDataJson.replaceAll(`"{`, `{`).replaceAll(`}"`, `}`);
        //subEntityListDataJson = JSON.parse(subEntityListDataJson);

        //this.metaDataObject = new SubEntityMetaData(subEntityListDataJson.result.metadata);
        //this.listJson = subEntityListDataJson.result.list;
        //this.maxPageNumber = getMaxPageNumber(this.listJson);
        ////Hardcoded Header Added
        //createListHTML(this.listJson, pageNo);

    }
    getSubEntityPaginationData(pageNo) {
        let _this = this;
        let url = "../aspx/EntityForm.aspx/GetSubEntityListDataWS";

        let data = { entityName: _subEntity.entityName, transId: _this.entityTransId, recordId: _this.recordId, fields: _this.subEntityFilter, pageNo: pageNo, pageSize: this.pageSize, metaData: false };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                let listJson = JSON.parse(JSON.parse(result.response).d);
                if ((listJson?.result?.list?.length || 0) == 0) {
                    noMoreRecordsMessage.style.display = 'block';
                    // Hide the message after 3 seconds (3000 milliseconds)
                    setTimeout(function () {
                        noMoreRecordsMessage.style.display = 'none';
                    }, 3000);
                }
                else {
                    _this.maxPageNumber = pageNo;
                    noMoreRecordsMessage.style.display = 'none';
                    listJson.result.list.forEach(item => {
                        item.data_json = JSON.parse(item.data_json);
                    });

                    _this.listJson.push(...listJson.result.list);
                    createListHTML(_this.listJson, pageNo);
                }
            }
        });
    }

    initCharts() {
        let _this = this;

        _this.getSubEntityChartsData('General');
        //_this.createChartsFieldsForSelection();
        //_this.getSelectedCharts();
    }

    //getSubEntitychartsMetaData() {
    //    let _this = this;
    //    let url = "../aspx/EntityForm.aspx/GetSubEntitychartsMetaDataWS";
    //    let data = { entityName: _this.entityName, transId: _this.entityTransId };
    //    this.callAPI(url, data, true, result => {
    //        if (result.success) {
    //            let metaDataJson = JSON.parse(JSON.parse(result.response).d);
    //            _this.chartsMetaData = metaDataJson.result.metadata;
    //            _this.parseSubEntityMetaDataJSON();
    //            _this.createChartsFieldsForSelection();

    //            _this.getSelectedCharts();
    //        }
    //    });
    //}

    createChartsFieldsForSelection() {
        let _this = this;
        const subEntSelect = document.getElementById('subEnt');

        _this.populateSubEnt();
        subEntSelect.addEventListener('change', function () {
            const selectedEntity = this.value;
            _this.populateGroupAndAggFields(selectedEntity);
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

        if (document.querySelectorAll('#subEnt option').length > 1) {
            var formFld = document.querySelector('#subEnt')
            formFld.selectedIndex = 1;
            var event = new Event('change');
            formFld.dispatchEvent(event);
        }

    }

    parseSubEntityMetaDataJSON() {
        let _this = this;
        let subEntityList = {};
        let entityWiseMetaData = {};
        let subEntityMapping = {};

        const subEntities = _this.metaData.filter(item => item.subentity === 'T');

        subEntities.forEach(item => {
            if (!subEntityList[item.ftransid])
                subEntityList[item.ftransid] = item.fcaption || item.ftransid;

            if (!entityWiseMetaData[item.ftransid])
                entityWiseMetaData[item.ftransid] = {};

            if (!_this.inValid(item.entityrelfld)) {
                if (!subEntityMapping[item.ftransid])
                    subEntityMapping[item.ftransid] = {};

                subEntityMapping[item.ftransid]["mapfieldjson"] = item;
                subEntityMapping[item.ftransid]["mapfield"] = item.fldname;
                subEntityMapping[item.ftransid]["mapdatafield"] = item.entityrelfld;
                subEntityMapping[item.ftransid]["mapsrcfield"] = item.srcfield;

                let mapVal = _this.keyValue;
                let mapSrc = _this.keyValue;
                if (item.entityrelfld == "recordid" && item.srcfield) {
                    mapVal = _this.recordId.toString();
                    let mapDataRow = _entityForm.entityFormJson.data.filter(i => i.n === item.srcfield);
                    if (mapDataRow.length)
                        mapSrc = ReverseCheckSpecialChars(mapDataRow[0].v);
                }
                if (item.entityrelfld == "recordid" && !item.srcfield) { //dcflds
                    mapVal = _this.recordId.toString();
                    mapSrc = _this.recordId.toString();
                }
                else if (item.srcfield) {
                    let mapDataRow = _entityForm.entityFormJson.data.filter(i => i.n === item.entityrelfld);
                    if (mapDataRow.length)
                        mapVal = ReverseCheckSpecialChars(mapDataRow[0].v);

                    let mapSrcRow = _entityForm.entityFormJson.data.filter(i => i.n === item.srcfield);
                    if (mapSrcRow.length)
                        mapSrc = ReverseCheckSpecialChars(mapSrcRow[0].v);
                }
                subEntityMapping[item.ftransid]["mapsrcdata"] = mapSrc;
                subEntityMapping[item.ftransid]["mapdatavalue"] = mapVal;

            }


            entityWiseMetaData[item.ftransid][item.fldname] = item;

        });

        _this.subEntityMapping = subEntityMapping;
        _this.entityWiseMetaData = entityWiseMetaData;
        _this.subEntityList = subEntityList;
        _this.getActivitiesBtnsHTML();
        _this.getSubEntityKeyFields();
    }

    getSubEntityKeyFields() {
        let _this = this;
        let subEntityList = Object.keys(_this.subEntityList).join(",");
        let url = "../aspx/EntityForm.aspx/GetSubEntityKeyFieldsWS";
        let data = { subEntityList: subEntityList };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                let keyfields = JSON.parse(result.response).d;
                _this.subEntityKeyFields = JSON.parse(keyfields);
                ShowDimmer(false);
            } else {
                ShowDimmer(false);
            }
        });
    }

    populateSubEnt() {
        let _this = this;
        const subEntSelect = document.getElementById('subEnt');

        for (const [key, value] of Object.entries(_this.subEntityList)) {
            //console.log(`Key: ${key}, Value: ${value}`);
            const option = document.createElement('option');
            option.value = key;
            option.text = `${value}(${key})`;
            option.dataset.form = value;
            subEntSelect.appendChild(option);
        }

    }

    populateGroupAndAggFields(selectedEntity) {
        let _this = this;
        const grpFldSelect = document.getElementById('grpFld');
        const aggFldSelect = document.getElementById('aggFld');
        grpFldSelect.innerHTML = ''; // Clear existing options
        aggFldSelect.innerHTML = ''; // Clear existing options

        // Add "Select Field" option with value 0 to both dropdowns
        const defaultOption = document.createElement('option');
        defaultOption.value = 0;
        defaultOption.text = 'Select Field';
        grpFldSelect.appendChild(defaultOption);

        const countOption = document.createElement('option');
        countOption.value = "count";
        countOption.text = 'Count';
        aggFldSelect.appendChild(countOption);

        const aggCondSelect = document.getElementById('aggCond');
        aggCondSelect.value = 0;
        aggCondSelect.disabled = true;

        if (selectedEntity == 0)
            return;

        for (const [key, value] of Object.entries(_this.entityWiseMetaData[selectedEntity])) {
            if (value.hide === 'F') {
                if (value.grpfield === 'T') {
                    const option = document.createElement('option');
                    option.value = value.fldname;
                    option.text = `${value.fldcap || ''}(${value.fldname})`;
                    grpFldSelect.appendChild(option);
                }

                if (value.aggfield === 'T') {
                    const option = document.createElement('option');
                    option.value = value.fldname;
                    option.text = `${value.fldcap || ''}(${value.fldname})`;
                    aggFldSelect.appendChild(option);
                }
            }
        }
    }

    getSelectedCharts() {
        let _this = this;
        let url = "../aspx/EntityForm.aspx/GetSelectedSubEntityChartsWS";
        let data = { transId: _this.entityTransId };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                _this.selectedCharts = JSON.parse(result.response).d;
                if (_this.selectedCharts != "") {
                    _this.getSubEntityChartsData('Custom');
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

    deleteChart(chart) {
        if (!confirm("Delete this chart?"))
            return;

        let _this = this;

        if (_this.selectedCharts) {
            var chartsArr = _this.selectedCharts.split(',');
            chartsArr = chartsArr.filter(item => item !== chart);
            _this.selectedCharts = chartsArr.join(",");
        }
        else
            _this.selectedCharts = "";

        if (_this.selectedCharts == "") {
            _this.selectedChartsObj = {};
            let url = "../aspx/EntityForm.aspx/GetSelectedSubEntityChartsWS";
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

    getSelectedChartsCriteria() {
        let _this = this;
        let criteriaArr = [];
        _this.selectedCharts.split(",").forEach((chart) => {
            var chartItems = chart.split("~~");
            const entTransId = chartItems[0];
            const grpFldVal = chartItems[1];
            const grpFldData = _this.entityWiseMetaData[entTransId][grpFldVal]

            let mapVal = _this.subEntityMapping[entTransId]["mapdatavalue"];
            let mapFld = _this.subEntityMapping[entTransId]["mapfield"];

            criteriaArr.push(`${chart}~~${grpFldData.normalized}~~${grpFldData.srctable || ""}~~${grpFldData.srcfield || ""}~~${grpFldData.allowempty}~~${mapFld}~~${mapVal}`);
        })
        return criteriaArr.join(",");
    }

    getChartCriteria(criteria) {
        let parts = criteria.split("~~");
        let result = parts.slice(0, 4).join("~~");
        return result;
    }

    getSubEntityChartsData(condition) {
        let _this = this;
        let url = "../aspx/EntityForm.aspx/GetSubEntityChartsDataWS";
        var criteria = ""
        if (condition == "General") {
            criteria = _this.getSubEntityKPIFilter();
            _this.kpiFilter = criteria;
        }
        else {
            criteria = _this.getSelectedChartsCriteria();
        }

        let data = { entityName: _this.entityName, transId: _this.entityTransId, condition: condition, criteria: criteria, recordId: _this.recordId, keyValue: _this.keyValue };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                if (condition == "General") {
                    _this.kpiJson = JSON.parse(JSON.parse(result.response).d);
                    var kpiJson = _this.kpiJson.result.charts;
                    if (kpiJson.length) {
                        _this.isSubEntitiesAvailable = true;
                        var html = _this.generateGeneralKPIHTML(kpiJson);
                        
                        if (html) {
                            document.querySelector('#KPI-2 .row').innerHTML = html;
                            document.querySelector('#KPI-2').classList.remove("d-none");
                        }
                    }
                    else {
                        _this.isSubEntitiesAvailable = false;
                        document.querySelector("#sub-entitycontainer").classList.add('data-fetched');
                        document.querySelector("#body_Container").innerHTML = _this.emptyRowsHtml;
                        document.querySelector("#sub-entityhdr .Tkts-toolbar-Right").classList.add('d-none');
                    }
                    return;
                }
                else {
                    document.querySelector("#Homepage_CardsList_Wrapper").innerHTML = "";
                    _this.chartsJson = JSON.parse(JSON.parse(result.response).d);
                    //var chartsJson = JSON.parse(_this.chartsJson.result.charts[0].data_json);      

                    var finalDataObj = [];

                    _this.chartsJson.result.charts.forEach(chartsData => {
                        let criteria = _this.getChartCriteria(chartsData.criteria);
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

                    _this.chartsJson = finalDataObj;
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

                files.js.push("/ThirdParty/Highcharts/highcharts-3d.js");
                files.js.push("/ThirdParty/Highcharts/highcharts-more.js");
                files.js.push("/ThirdParty/Highcharts/highcharts.js");
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


                            var toolBarHtml = `<span class="material-icons material-icons-style" onclick="_subEntity.deleteChart('${card["chartsid"]}')">close</span>`;
                            cardElement.find("toolbarContent").replaceWith(toolBarHtml);

                        }
                    }
                });
            }
        });
        //return chartsJson;
    }

    generateGeneralKPIHTML(dataJson) {
        let _this = this;
        let html = '';
        dataJson.forEach(data => {
            let item = JSON.parse(data.data_json)[0];
            if (item.totrec != 0) {
                html += `
                <div class="col-xl-12 col-lg-12 col-sm-12 Invoice-content-wrap">
                    <a href="#" class="Invoice-item">
                        <div class="Invoice-icon">
                            <span class="material-icons material-icons-style material-icons-2">bar_chart</span>
                        </div>
                        <div class="Invoice-content">
                            <h6 class="subtitle">${_this.subEntityList[item.transid]}</h6>
                            <h3 class="title">${item.totrec}</h3>
                        </div>
                        <div class="Invoice-icon2"></div>
                    </a>
                </div>
            `;
            }
        });
        return html;
    }


    setSelectedCharts(chart) {
        let _this = this;
        if (chart) {
            if (_this.selectedCharts) {
                var chartsArr = _this.selectedCharts.split(',')
                chartsArr.push(chart);
                chartsArr = [...new Set(chartsArr)];
                _this.selectedCharts = chartsArr.join(",");
            }
            else {
                _this.selectedCharts = chart;
            }
        }

        let url = "../aspx/EntityForm.aspx/SetSelectedSubEntityChartsWS";
        let data = { transId: _this.entityTransId, charts: _this.selectedCharts };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                //_this.reloadEntityPage();
                _this.getSubEntityChartsData('Custom', _this.selectedCharts);
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
        let url = "../aspx/EntityForm.aspx/SetSelectedSubEntityChartsWS";
        let data = { transId: _this.entityTransId, charts: "" };
        this.callAPI(url, data, true, result => {
            _this.hideChartsMenu();
        });
        document.querySelector("#Homepage_CardsList_Wrapper").innerHTML = "";
        document.querySelector(".NO-KPI-Items").classList.remove("d-none");
    }

    applyChartSelection() {
        let _this = this;
        const entTransId = document.getElementById("subEnt").value;
        if (entTransId == 0) {
            showAlertDialog("error", "Select a valid Form");
            return;
        }
        var entName = _this.subEntityList[entTransId];
        const grpFldVal = document.getElementById("grpFld").value;
        const grpFldData = _this.entityWiseMetaData[entTransId][grpFldVal];

        var aggCondVal = document.getElementById("aggCond").value;
        var aggFldVal = document.getElementById("aggFld").value;
        if (aggFldVal == "count")
            aggCondVal = "count";
        else if (aggCondVal == 0) {
            showAlertDialog("error", "Select a valid Display function");
            document.getElementById("aggCond").focus();
            return;
        }

        if (grpFldVal == 0) {
            showAlertDialog("error", "Select a valid Group By Field");
            return;
        }
        //const aggFldData = _this.chartsMetaData["Agg fld"][aggFldVal];

        //groupp fld~~agg fld~~agg fnc~~normalized~~src table~~src fld~~allowempty        

        var chartStr = `${entTransId}~~${grpFldVal}~~${aggFldVal}~~${aggCondVal}`;// ~~${grpFldData.normalized}~~${grpFldData.srctable || ""}~~${grpFldData.srcfield || ""}~~${grpFldData.allowempty}`


        _this.setSelectedCharts(chartStr);
        document.querySelector(".NO-KPI-Items").classList.add("d-none");
    }

    getChartCaptions() {
        let _this = this;
        _this.selectedCharts.split(",").forEach((chart) => {
            var chartItems = chart.split("~~");
            const entTransId = chartItems[0];
            var entForm = _this.subEntityList[entTransId];
            const grpFldVal = chartItems[1];
            const grpFldData = _this.entityWiseMetaData[entTransId][grpFldVal];
            const aggCondVal = chartItems[3];
            const aggFldVal = chartItems[2];
            const aggFldData = _this.entityWiseMetaData[entTransId][aggFldVal];
            var chartStr = "";
            if (aggCondVal == "count")
                chartStr = `${entForm} - ${grpFldData.fldcap || ''} wise ${aggCondVal}`;
            else
                chartStr = `${entForm} - ${grpFldData.fldcap || ''} wise ${aggFldData.fldcap || ''}(${aggCondVal})`;
            _this.selectedChartsObj[chart] = chartStr;
        })
    }

    getActivitiesBtnsHTML() {
        let _this = this;
        var addBtnHtml = "";
        var filterBtnHtml = "";
        var transids = axDisallowCreate.split(",");
        for (const [key, value] of Object.entries(_this.subEntityList)) {            
            if (transids.indexOf(key) == -1) {
                addBtnHtml += `<div class="menu-item px-3 my-0">
                            <a href="#" class="menu-link px-3 py-2" data-kt-element="mode" onclick="_subEntity.openSubEntityTstruct('${key}')">
                                <span class="material-icons material-icons-style material-icons-2">keyboard_double_arrow_right</span>
                                <span class="menu-title">${value}
                                </span>
                            </a>
                        </div>`
            }
            filterBtnHtml += `
            <tr>
                <td><input type="checkbox" id="chkentity_${key}" class="chk-entities" value="${key}" data-fldcap="${value}" checked></td>
                <td><label for="chkentity_${key}">${value}</label></td>
            </tr>`            
        }
        if (addBtnHtml)
            document.querySelector("#SubEntity-add").innerHTML = addBtnHtml;
        else {
            document.querySelector("#SubEntity-add").remove();
            document.querySelector("#SubEntity-add-btn").remove();
        }




        filterBtnHtml = `<table class="table table-hover text-start">
            <thead class="thead-dark">
                <tr>
                    <th>
                        <input type="checkbox" id="check-all" checked>
                    </th>
                    <th><label for="check-all">Select all</label></th>
                </tr>
            </thead>
            <tbody id="table-body">
                ${filterBtnHtml}
            </tbody>
        </table>
        <div class="modal-footer" style="padding: 0.5rem !important">
            <button type="button" onclick="_subEntity.resetSubEntityFilter()" class="btn btn-white btn-sm">Reset</button>
            <button type="button" onclick="_subEntity.applySubEntityFilter();" class="btn btn-primary">Apply</button>
        </div>`;
        document.querySelector("#SubEntity-Filter").innerHTML = filterBtnHtml;
    }

    applySubEntityFilter() {
        let _this = this;
        document.querySelector("#sub-entitycontainer").classList.remove('data-fetched');
        document.querySelector("#body_Container").innerHTML = "";
        _this.getSubEntityListData(1);
    }

    resetSubEntityFilter() {
        let _this = this;
        document.querySelector("#sub-entitycontainer").classList.remove('data-fetched');
        document.querySelector("#body_Container").innerHTML = "";
        event.preventDefault();
        const checkEntities = document.querySelectorAll(".chk-entities, #check-all");
        checkEntities.forEach((checkbox) => {
            checkbox.checked = true;
        });

        _this.getSubEntityListData(1);
    }

    getUrlParams() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.entityName = urlParams.get('ename') || "";
        this.entityTransId = urlParams.get('tstid');
        this.recordId = urlParams.get('recid') || "0";
        this.keyValue = urlParams.get('keyval') || "";
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
        this.entity = fieldData.entity;
        this.fcaption = fieldData.fcaption;
        this.fldname = fieldData.fldname;
        this.fldtype = fieldData.fldtype;
        this.fdatatype = fieldData.fdatatype;
        this.moe = fieldData.moe;
        this.hide = fieldData.hide;
        this.props = fieldData.props;
    }
}
class SubEntityMetaData {
    constructor(jsonData) {
        if (!jsonData || !Array.isArray(jsonData)) {
            throw new Error('Invalid JSON data');
        }

        // Map each field data to a Field object
        this.metadata = jsonData.map(fieldData => new Field(fieldData));
    }
}

let formCompJSON = {
    "components": {
        "N": {
            "html": `<input type="number" class="inputcontent1" value="{{value}}" readonly>`,
        },
        "ST": {
            "html": `<div class="inputcontent"  readonly>{{value}}</div>`,
        },
        "S": {
            "html": `<div class="inputcontent"  readonly>{{v}}</div>`,
        },
        "M": {
            "html": `<div class="inputcontent"  readonly>{{v}}</div>`,
        },
        "C": {
            "html": `<div class="inputcontent"  readonly>{{v}}</div>`,
        },
        // "RT": {
        //     "html":`<p class="moretext" >{{value}}</p><a class="moreless-button" href="#" >Read more</a><br>`,
        // },
        "RT": {
            "html": `<p class="add-read-more show-less-content" >{{value}}</p><br>`,
        },
        "LT": {
            "html": `<p class="add-read-more show-less-content" >{{value}}</p><br>`,
        },
        "D": {
            "html": `<input type="date" class="form-control form-control-sm w-auto" value="{{value}}" readonly/>`,
        },
        "ATT": {
            "html": ` <div id="{{customid}}" class="Files-Attached " onclick="_entityForm.downloadfileattachment('{{v}}','{{filepath}}')" data-filename="{{v}}" data-filepath="{{filepath}}">
                                  {{componentimg}}
                               <div class="mx-3 fw-semibold attachmenttxt">
                               <a class="attached-filename" data-bs-toggle="tooltip" data-bs-placement="bottom" title="{{v}}">{{v}}</a>
                            </div>
                       </div><br>`
        },
        "GRID_ATT": {
            "html": ` <div id="{{customid}}" class="Files-Attached " onclick="_entityForm.showGridAttLink('{{v}}')" data-filename="{{v}}">
                                  {{componentimg}}
                               <div class="mx-3 fw-semibold attachmenttxt">
                               <a class="attached-filename" data-bs-toggle="tooltip" data-bs-placement="bottom" title="{{v}}">{{v}}</a>
                            </div>
                       </div><br>`
        },

        "Image": {
            "html": `<img class="{{colclassname}} col-sm-12"  src="{{src}}" alt="Girl in a jacket" style="width:150px;" height="100">`
        },
        "togglebutton": {
            "html": `<div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" {{checked}} onclick="return false;">
                </div>`
        }
    }
};

let fldTypes = ["N", "ST", "D", "LT", "RT", "ATT", "Image", "table", "togglebutton"];

// EntityForm class
class EntityForm {
    constructor() {
        this.components = formCompJSON.components;
        this.fldtype = fldTypes;
        this.flds = {};
        this.entityFormJson = {};
        this.pageSize = 5;
        this.emptyRowsHtml = `No data found`;
        this.hideControls = [];
    }

    init() {
        let _this = this;
        _this.getUrlParams();
        try {
            entityFormMetaData = entityFormMetaData.replaceAll(`"{`, `{`).replaceAll(`}"`, `}`);
            entityFormMetaData = JSON.parse(entityFormMetaData);
            entityFormData = entityFormData.replaceAll(`"{`, `{`).replaceAll(`}"`, `}`);
            entityFormData = entityFormData.split("*$*")[1];
            entityFormData = JSON.parse(entityFormData);

            _this.hideControls = entityFormData.data.find(i => i.n?.toLowerCase() == 'axro_hidecontrols')?.v?.toLowerCase().split(',') || [];
            _this.entityFormJson.data = entityFormData.data;
            _this.entityFormJson.metadata = entityFormMetaData.result.metadata;
            _this.entityFormJson.error = entityFormData.error;

            if (_subEntity.inValid(_this.recordId) || _this.recordId == "0") {
                _this.recordId = _this.entityFormJson.data.find(i => i.n == "axp_recid1").v;
            }

            _this.constructEntityFormHTML();
            //_this.constructFormRelatedDataAccordions();

            _this.readmore();
            _this.bindEvents();
            _this.applyTheme();
        }
        catch {
            showAlertDialog("error", "Error occurred. Please check with administrator.");
        }
        parent.ShowDimmer(false);
    }

    getUrlParams() {
        let _this = this;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        _this.entityName = urlParams.get('ename') || "";
        _this.entityTransId = urlParams.get('tstid');
        _this.recordId = urlParams.get('recid') || "0";
        _this.keyValue = urlParams.get('keyval') || "";
    }

    getRelatedEntityListData() {
        let _this = this;
        if (window.top.entityNavList && window.top.entityNavList?.lastTransId && _subEntity.subEntityList[window.top.entityNavList.lastTransId] && window.top.entityNavList?.[window.top.entityNavList.lastTransId] && window.top.entityNavList[window.top.entityNavList.lastTransId].length) {
            _this.createRelatedListHTML(window.top.entityNavList[window.top.entityNavList.lastTransId], window.top.entityNavList.lastTransId);
        }
        else if (window.top.entityNavList && window.top.entityNavList?.[_this.entityTransId] && window.top.entityNavList[_this.entityTransId].length) {
            _this.createRelatedListHTML(window.top.entityNavList[_this.entityTransId], _this.entityTransId);
        }

    }

    createRelatedListHTML(listArr, lastTransId) {
        let _this = this;

        let html = '';
        let tempArr = listArr.filter(record => record.recordid != _this.recordId &&  record.transid == lastTransId);
        let isPrev = false;
        let isNext = false;

        for (var rowData of tempArr) {
            if (!_subEntity.entityWiseFields[rowData.transid]) {
                $.each(_subEntity.metaData.filter(i => i.ftransid === rowData.transid), function (index, field) {
                    _this.populateEntityWiseFlds(index, field);
                })
            }

            let keyCol = entityKeyField;

            if (!rowData.hasOwnProperty(keyCol)) {
                keyCol = getKeyField(rowData.transid).fldname;
                if (_subEntity.inValid(rowData[keyCol]))
                    keyCol = Object.keys(rowData)[4];
            }

            rowData.keycol = keyCol;

            if (!rowData.keycol || _subEntity.inValid(rowData[rowData.keycol])) {
                const keys = Object.keys(rowData);
                let notNullNode = null;

                for (let i = 4; i < keys.length; i++) {
                    const key = keys[i];
                    if (rowData[key] !== null && rowData[key] !== undefined && rowData[key] !== "") {
                        notNullNode = key;
                        break;
                    }
                }

                rowData.keycol = notNullNode;
                keyCol = notNullNode;
            }

            const axpdef_keycol = rowData[keyCol]?.toString().replace("T00:00:00", "");

            let subEntityCaption = rowData.entityname || _this.entityName;
            let subEntityVal = ""
            if (rowData.navtype == "prev") {
                subEntityVal = "<<";
                isPrev = true;
            }
            else if (rowData.navtype == "next") {
                subEntityVal = ">>";
                isNext = true;
            }
            else {
                if (isPrev)
                    subEntityVal = ">>";
                else if (isNext)
                    subEntityVal = "<<";
                else
                    subEntityVal = "<<";
            }


            let navCaption = subEntityVal == ">>" ? "Next" : "Previous";
            html += `<div class="Project_items">
                        <div class="card  ">
                           <div class="col-xl-12 col-md-12 d-flex flex-column flex-column-fluid   ">`;
            html += ` <div class="page-Header">
                        <h3 class="card-title collapsible cursor-pointer rotate" data-bs-toggle="collapse"
                            aria-expanded="true" data-bs-target="#Sub-Entity_wrapper" >
                            <div class="symbol symbol-25px symbol-circle initialized"  data-toggle="tooltip" title="${navCaption}" data-bs-original-title="${navCaption}">
                                <span class="symbol-label bg-warning text-inverse-warning fw-bold" style="height:30px !important; width:30px !important;">${subEntityVal}</span>
                            </div>
                            <span class="Project_title" onclick="_subEntity.openEntityForm('${subEntityCaption}', '${rowData.transid}', '${rowData.recordid}','${axpdef_keycol}')">${axpdef_keycol}</span>
                        </h3>
                    </div>`;

            html += `</div></div></div></div></div>`;            
        }

        if (html != '') {
            $('#related-records-container').removeClass("d-none");
            $('#related-records-container .card-title').html(`${window.top.entityNavList.lastCaption}`);
            $('#related-records').html(html);

        }
        return;
        //let _this = this;
        //let html = '';

        for (const rowData of listArr) {
            const axpdef_keycol = rowData.keycol;
            //if (!_subEntity.inValid(rowData[axpdef_keycol]) && rowData[axpdef_keycol] != "--" && rowData.recordid.toString() != _this.recordId) {
            if (rowData.recordid.toString() != _this.recordId) {
                let eName = rowData.entityname || _this.entityName;
                let eCaption = getSubEntityInitials(eName);
                html += `
                <div class="col-xl-12 col-lg-12 col-sm-12 Invoice-content-wrap">
                    <a href="#" class="Invoice-item">
                        <div class="symbol symbol-25px symbol-circle initialized" onclick="_subEntity.openEntityPage('${eName}', '${rowData.transid}')" data-toggle="tooltip" title="${eName}">
                        <span class="symbol-label bg-warning text-inverse-warning fw-bold" style="height:30px !important; width:30px !important;">${eCaption}</span>

                    </div>
                        <div class="Invoice-content">
                            <h6 class="subtitle"  onclick="_entityForm.openEntityForm('${eName}', '${rowData.transid}', '${rowData.recordid}','${rowData[axpdef_keycol]}')">${rowData[axpdef_keycol] || "--"}</h6>
                        </div>
                        <div class="Invoice-icon2"></div>
                    </a>
                </div>
            `
            }

        }

        $('#related-records-container').removeClass("d-none");
        $('#related-records-container .card-title').html(`${window.top.entityNavList.lastCaption}`);
        $('#related-records').html(html);

    }

    populateEntityWiseFlds(index, field) {
        if (!_subEntity.entityWiseFields[field.ftransid]) {
            _subEntity.entityWiseFields[field.ftransid] = {};
            _subEntity.entityWiseFields[field.ftransid].largeTextElements = [];
            _subEntity.entityWiseFields[field.ftransid].attachmentElements = [];
            _subEntity.entityWiseFields[field.ftransid].otherElements = [];
            _subEntity.entityWiseFields[field.ftransid].buttonElements = [];
        }

        var fldType = getFieldDataType(field).toUpperCase();
        if (fldType === "BUTTON") {
            _subEntity.entityWiseFields[field.ftransid].buttonElements.push(field);
        }
        else if (fldType === "ATTACHMENTS") {
            _subEntity.entityWiseFields[field.ftransid].attachmentElements.push(field);
        }
        else if (fldType === "LARGE TEXT") {
            _subEntity.entityWiseFields[field.ftransid].largeTextElements.push(field);
        }
        else {
            _subEntity.entityWiseFields[field.ftransid].otherElements.push(field);
        }
    }

    constructFormRelatedDataList(listArr, fldId) {
        let _this = this;
        let html = 'No other data found';

        if (!_subEntity.entityWiseFields[_this.entityTransId]) {
            $.each(_subEntity.metaData.filter(i => i.ftransid === _this.entityTransId), function (index, field) {
                _this.populateEntityWiseFlds(index, field);
            })
        }

        for (var rowData of listArr) {
            if (rowData.recordid == _this.recordId)
                continue;

            let keyCol = entityKeyField;

            if (!rowData.hasOwnProperty(keyCol)) {
                keyCol = getKeyField(rowData.transid).fldname;
                if (_subEntity.inValid(rowData[keyCol]))
                    keyCol = Object.keys(rowData)[4];
            }

            rowData.keycol = keyCol;
            

            if (!rowData.keycol || _subEntity.inValid(rowData[rowData.keycol])) {
                const keys = Object.keys(rowData);
                let notNullNode = null;

                for (let i = 4; i < keys.length; i++) {
                    const key = keys[i];
                    if (rowData[key] !== null && rowData[key] !== undefined && rowData[key] !== "") {
                        notNullNode = key;
                        break;
                    }
                }

                rowData.keycol = notNullNode;
                keyCol = notNullNode;
            }

            const axpdef_keycol = rowData[keyCol]?.toString().replace("T00:00:00", "");

            let subEntityCaption = rowData.entityname || _this.entityName;
            let subEntityVal = getSubEntityInitials(subEntityCaption);

            if (html == 'No other data found')
                html = '';

            html += `<div class="Project_items">
                        <div class="card  ">
                           <div class="col-xl-12 col-md-12 d-flex flex-column flex-column-fluid   ">`;
            var rowButtonHTML = generateRowButtonHTML(rowData, rowData.transid);
            html += ` <div class="page-Header">
                        <h3 class="card-title collapsible cursor-pointer rotate" data-bs-toggle="collapse"
                            aria-expanded="true" data-bs-target="#Sub-Entity_wrapper" >
                            <div class="symbol symbol-25px symbol-circle initialized"  onclick="_subEntity.openEntityPage('${subEntityCaption}', '${rowData.transid}')" data-toggle="tooltip" title="${subEntityCaption}" data-bs-original-title="${subEntityCaption}">
                                        <span class="symbol-label bg-warning text-inverse-warning fw-bold" style="height:30px !important; width:30px !important;">${subEntityVal}</span>
                                    </div>
                            <span class="Project_title" onclick="_subEntity.openEntityForm('${subEntityCaption}', '${rowData.transid}', '${rowData.recordid}','${axpdef_keycol}')">${axpdef_keycol}</span>
                        </h3>
                    </div>`;           
            html += `               
                </div>
            </div>`;

            html += generateRowElements(rowData, rowData.transid, "Other Data");
            html += `</div></div></div>`;
        }
        //$('#body_Container').html('');
        $(`#related-records_${fldId}`).html(html);
        $(`#related-records-container_${fldId}`).addClass("data-fetched");
        $('[data-toggle="tooltip"]').tooltip();
        initReadMore();
        KTMenu.init();        
    }

    constructFormRelatedDataAccordions() {
        //Fetch dropdown flds
        var relatedFields = [];

        if (relatedDataFields == "") {

            return;

            //relatedFields = _subEntity.metaData.filter(function (item) {
            //    return item.cdatatype === "DropDown" && item.subentity === "F" && item.hide === "F" && item.dcname === "dc1";
            //});
        }
        else {

            var relatedFldsArr = [];
            relatedDataFields.split(",").forEach(fld => {
                relatedFldsArr.push(fld.split('~')[1]);
            })

            relatedFields = _subEntity.metaData.filter(function (item) {
                return item.subentity === "F" && item.hide === "F" && relatedFldsArr.includes(item.fldname);
            });
        }

        let html = '';
        relatedFields.forEach(fld => {            
            let fldVal = fld.fldcap || '';
            let mapDataRow = _entityForm.entityFormJson.data.filter(item => item.n === fld.fldname);
            if (mapDataRow.length) {
                let rowNo = 1;
                mapDataRow.forEach(row => {
                    fldVal = ReverseCheckSpecialChars(row.v);
                    let dcNameWithRowNo = `${fld.dcname}${rowNo}`;
                    html += `
                <div class="card KC_Items related-accordions" id="related-records-container_${dcNameWithRowNo}${fld.fldname}" data-fldid="${fld.fldname}" data-dcname="${fld.dcname}" data-rowno="${rowNo}"  data-fldval="${fldVal}" data-griddc="${fld.griddc}">
                    <div class="card-header collapsible cursor-pointer rotate collapsed" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#related-records_${dcNameWithRowNo}${fld.fldname}">
                        <h3 class="card-title">${fld.fldcap || ''} - ${fldVal}</h3>
                        <div class="card-toolbar rotate-180">
                            <span class="material-icons material-icons-style material-icons-2">expand_circle_down
                            </span>
                        </div>
                    </div>
                    <div class="KC_Items_Content collapse heightControl pt-0---" id="related-records_${dcNameWithRowNo}${fld.fldname}">
                        <bodycontent>No Data Found</bodycontent>
                    </div>
                </div>`

                    rowNo++;
                });
            }
            

        })
        $(".KPI_Section").append(html);


        document.querySelectorAll('.related-accordions').forEach(item => {
            $(item).on('show.bs.collapse', function () {
                if (this.classList.contains('data-fetched'))
                    return;

                let fldId = this.dataset.fldid;
                let dcName = this.dataset.dcname;
                let gridDc = this.dataset.griddc;
                let rowNo = this.dataset.rowno;
                let fldVal = this.dataset.fldval;


                fetchFilteredData(fldId, fldVal, dcName, gridDc, rowNo.toString());
            })
        });


    }

    getEntityListDataForOtherData(pageNo, fldId, gridDc) {
        parent.ShowDimmer(true);
        let _this = this;
        let url = "../aspx/Entity.aspx/GetEntityListWithGridDataWS";
        let data = { transId: _this.entityTransId, fields: _this.fields, pageNo: pageNo, pageSize: _this.pageSize, filter: _this.filter, gridDc: gridDc };
        this.callAPI(url, data, false, result => {
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

                if ((listJson.length || 0) == 0) {
                    if (pageNo == 1) {
                        _this.listJson = [];
                        document.querySelector(`related-records_${fldId}`).innerHTML = _this.emptyRowsHtml;
                        return;
                    }
                }
                else {

                    _this.constructFormRelatedDataList(listJson, fldId);

                }
            }
            else {
                parent.ShowDimmer(false);
            }
        });
    }

    openEntityForm(entityName, transId, recordId, keyValue) {
        //parent.ShowDimmer(true);
        var url = `../aspx/EntityForm.aspx?ename=${entityName}&tstid=${transId}&recid=${recordId}&keyval=${keyValue}`;
        parent.LoadIframe(url);
    }

    constructEntityFormHTML() {
        let _this = this;
        let jsonData = _this.entityFormJson
        // Get the container where HTML will be appended
        const container = document.getElementById('header_Container');

        if (_subEntity.inValid(jsonData.error)) {
            // Group the data by 'dc'
            const groupedData = this.groupByDC(jsonData.data);
            this.parseFormMetaData(jsonData.metadata);
            this.constructScriptButtons(jsonData.metadata);
            // Generate HTML for each group and append it to the container
            container.innerHTML = this.generateHTML(groupedData, jsonData.metadata);
            document.querySelector("#dcTabs").insertAdjacentHTML("beforeend", `<li class="dcTabs"><a href="#sub-entityhdr" id="activities-link">Connected data</a></li>`);

            const dcTabsList = document.querySelectorAll("#dcTabs li a");

            dcTabsList.forEach((tab) => {
                tab.addEventListener("click", function (event) {
                    const allTabs = document.querySelectorAll("#dcTabs li");
                    allTabs.forEach(tab => tab.classList.remove("active"));
                    this.closest('li').classList.add("active");

                    document.querySelector(`${this.getAttribute("href")} .dc-heading.collapsed`)?.click();
                });
            })
        }
        else {
            container.innerHTML = jsonData.error[0].msg;
        }

    }

    parseFormMetaData(metaData) {
        metaData.forEach((fld) => {
            this.flds[fld.fname] = fld;
        })
    }

    constructScriptButtons(metaData) {

        let html = '';
        metaData.filter(item => item.customdatatype == "Button").forEach((btn) => {
            html += `<div class="menu-item px-3 my-0" onclick="_entityForm.callScriptAction('${btn.fname}')">
                        <a href="javascript:void(0)" class="menu-link px-3 py-2" data-kt-element="mode" data-target="lightTheme" data-kt-value="light">
                            <span class="material-icons material-icons-style material-icons-2">keyboard_double_arrow_right</span>
                            <span class="menu-title">${btn.caption}
                            </span>
                        </a>
                    </div>`;
        });

        if (html) {
            document.querySelector("#scriptBtns-btn").classList.remove("d-none");
            document.querySelector("#scriptBtns-container").innerHTML = html;
        }

    }

    callScriptAction(script) {
        parent.ShowDimmer(true);
        let _this = this;
        let url = "../aspx/EntityForm.aspx/CallScriptsWS";
        let data = { transId: _this.entityTransId, script: script, recordId: _this.recordId };
        this.callAPI(url, data, true, result => {
            parent.ShowDimmer(false);
            if (result.success) {
                try {
                    result = JSON.parse(JSON.parse(result.response).d).result;
                    AssignLoadValues(result, "", script, "")
                    try {
                        AxAfterCallAction();
                    }
                    catch (ex) {

                    }
                }
                catch (e) {

                }
            }
            else {
                showAlertDialog("Error", result.response);
            }
        });
    }


    bindEvents() {
        let _this = this;
        const subEntityDiv = document.getElementById('Project_Entity_form'); // Replace 'yourDivId' with the ID of your div
        subEntityDiv.addEventListener('scroll', function () {
            if (_this.isSubEntitiesAvailable && _this.activitiesExpanded && isScrollAtBottomWithinDiv(subEntityDiv)) {
                var newPageNo = _this.maxPageNumber + 1;
                _this.getSubEntityListData(newPageNo);
            }
        });

        this.bindThemeEvent();
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
                localStorage.setItem(`selectedTheme-${_subEntity.entityName}`, target);
            });
        });

    }

    applyTheme() {
        var _this = this;
        var storedTheme = localStorage.getItem(`selectedTheme-${_subEntity.entityName}`);
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


    createHTML(data, metadata) {
        let html = '';
        let dcName = data[0].n.toLowerCase();
        if (data[0].hasdatarows && data[0].hasdatarows === 'yes') {
            // Initialize an object to store rows grouped by the 'r' value
            const rowsByR = {};

            data.forEach(item => {
                if (item.t !== 'dc') {
                    const rValue = item.r;
                    if (!rowsByR[rValue]) {
                        rowsByR[rValue] = [];
                    }
                    rowsByR[rValue].push(item);
                }
            });

            const rows = {};
            data.forEach(item => {
                if (item.t !== 'dc') {
                    if (!rows[item.r]) {
                        rows[item.r] = {};
                    }
                    rows[item.r][item.n] = item.v;
                }
            });

            html += `<div class="row" style="position: relative; right: 3px;" id="${dcName}">
                                        <div class="dc-heading card-title cursor-pointer collapsible  rotate  collapsed" data-bs-toggle="collapse"
                                            aria-expanded="true" data-bs-target="#${dcName}container" >
                                            <span class="material-icons material-icons-style material-icons-2 rotate-180">expand_circle_down
                                            </span>${getCaption(dcName)}
                                        </div>

                                        <div id="${dcName}container" class="row sub-entity-row collapse"><table class="table table-light table-striped table-bordered tabularDC">`;
            //Create table header
            html += `<thead><tr>`;

        
            let dcMetaData = metadata.filter(i => i.datatype != 'dc' && i.dcname == dcName && (i.hidden != null && i.hidden != "T"))
            dcMetaData.forEach(field => {
                html += `<th>${field.caption}</th>`;
            });

            //const firstRowKeys = Object.values(rowsByR[Object.keys(rowsByR)[0]]);
            // Iterate over each unique 'r' value and create a table row

            //firstRowKeys.forEach(key => {
            //    var isHidden = getHiddenFlag(key.n);
            //    var colCaption = getCaption(key.n);
            //    if (isHidden != null && isHidden != "T") {
            //        html += `<th>${colCaption}</th>`;
            //    }
            //});
            html += `</tr></thead>`;
            //Create table body
            html += `<tbody>`;
            Object.keys(rows).forEach(rowKey => {
                html += `<tr>`;
                dcMetaData.forEach((field, index) => {
                    if (field.fname.startsWith("axpfile_")) {
                        const axpfilepathUploadObject = _entityForm.entityFormJson.data.find(i => i.n === field.fname.replace("axpfile_", "axpfilepath_"));
                        var pathVal = axpfilepathUploadObject ? axpfilepathUploadObject.v : null;
                        if (pathVal.indexOf(";bkslh") != -1) {
                            pathVal = pathVal.replace(new RegExp(";bkslh", "g"), "\\");
                        }

                        if (pathVal.endsWith("\\"))
                            pathVal = pathVal.substr(0, pathVal.length - 1);

                        var item = {};
                        item["v"] = ReverseCheckSpecialChars(rows[rowKey][field.fname] || '');
                        item["filepath"] = pathVal;
                        html +=
                            `<td>${this.createAttachmentHTML(item, index, "")}</td>`;
                    }
                    else if (field.fname.startsWith("dc") && field.fname.endsWith("_image")) {
                        var item = {};
                        item["v"] = ReverseCheckSpecialChars(rows[rowKey][field.fname] || '');

                        html +=
                            `<td>${this.createDCAttachmentHTML(item, index, "")}</td>`;
                    }
                    else
                        html += `<td>${ReverseCheckSpecialChars(rows[rowKey][field.fname] || '')}</td>`;
                    return;

                    //var isHidden = getHiddenFlag(item.n);
                    //if (isHidden != null && isHidden != "T") {
                        
                    //    if (item.n.startsWith("axpfile_")) {
                    //        //var colclassname = _entityForm.getclassname(data.value, data.props.split("~")[3]);
                            
                    //        const axpfilepathUploadObject = _entityForm.entityFormJson.data.find(i => i.n === item.n.replace("axpfile_", "axpfilepath_"));
                    //        var pathVal = axpfilepathUploadObject ? axpfilepathUploadObject.v : null;
                    //        if (pathVal.indexOf(";bkslh") != -1) {
                    //            pathVal = pathVal.replace(new RegExp(";bkslh", "g"), "\\");                                
                    //        }

                    //        if (pathVal.endsWith("\\"))
                    //            pathVal = pathVal.substr(0, pathVal.length - 1);

                    //        item.filepath = pathVal;
                    //        html +=
                    //            `<td>${this.createAttachmentHTML(item, index, "")}</td>`;
                    //    }
                    //    if (item.n.startsWith("dc") && item.n.endsWith("_image")) {
                    //        html +=
                    //            `<td>${this.createDCAttachmentHTML(item, index, "")}</td>`;
                    //    }
                    //    else {
                    //        html += `<td>${ReverseCheckSpecialChars(rows[rowKey][field.fname] || '')}</td>`;
                    //    }
                    //}
                });
                html += `</tr>`;
            });
            html += `</tbody>`;
            html += `</table></div></div>`;
        }
        else {
            var i = 1;
            var visibleItems = 0;
            var dcHTML = "";

            //dcHTML = `<div class="row" style="position: relative; right: 3px;" id="${dcName}"><div class="dc-heading"><h3>${getCaption(dcName)}</h3 ></div >`;
            if (dcName == "dc1")
                dcHTML = `<div class="row" style="position: relative; right: 3px;" id="${dcName}">
                                        <div class="dc-heading card-title cursor-pointer collapsible  rotate  " data-bs-toggle="collapse"
                                            aria-expanded="true" data-bs-target="#${dcName}container" >
                                            <span class="material-icons material-icons-style material-icons-2 rotate-180">expand_circle_down
                                            </span>${getCaption(dcName)}
                                        </div>

                                        <div id="${dcName}container" class="row sub-entity-row collapse show">`
            else
                dcHTML = `<div class="row" style="position: relative; right: 3px;" id="${dcName}">
                                        <div class="dc-heading card-title cursor-pointer collapsible  rotate  collapsed" data-bs-toggle="collapse"
                                            aria-expanded="true" data-bs-target="#${dcName}container" >
                                            <span class="material-icons material-icons-style material-icons-2 rotate-180">expand_circle_down
                                            </span>${getCaption(dcName)}
                                        </div>

                                        <div id="${dcName}container" class="row sub-entity-row collapse">`
            data.forEach(item => {
                if (item.n) {
                    var isHidden = getHiddenFlag(item.n);
                    if (isHidden != null && isHidden != "T") {
                        visibleItems++;
                        dcHTML += this.nongridDcHTML(item, i, metadata);
                    }
                }
                i++;
            });
            dcHTML += `</div></div>`;

            if (visibleItems > 0) {
                html += dcHTML;
            }
        }

        if (html != "") {
            let activeClass = '';
            if (data[0].n.toLowerCase() == "dc1")
                activeClass = 'active'
            var tabDcHtml = `<li class="dcTabs ${activeClass}"><a href="#${data[0].n.toLowerCase()}">${getCaption(data[0].n.toLowerCase())}</a></li>`;
            document.querySelector("#dcTabs").insertAdjacentHTML("beforeend", tabDcHtml);
        }

        return html;
    }
    groupByDC(data) {
        const groups = [];
        let currentGroup = [];
        let hideDc = false;
        data.forEach(item => {
            if (item.t === 'dc') {
                hideDc = false;

                if (item.n && this.hideControls.indexOf(item.n?.toLowerCase()) > -1)
                    hideDc = true;

                if (currentGroup.length > 0) {
                    groups.push(currentGroup);
                }
                currentGroup = [];
            }

            if (!hideDc && item.n && !(this.hideControls.indexOf(item.n?.toLowerCase()) > -1)) {
                currentGroup.push(item);
            }

        });
        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }
        return groups;
    }
    generateHTML(groups, metadata) {
        let html = '';
        groups.forEach(group => {
            html += this.createHTML(group, metadata);
        });
        return html;
    }
    nongridDcHTML(fldjson, index, metadata) {

        var fldName = fldjson.n;
        var fldVal = ReverseCheckSpecialChars(fldjson.v);

        
        var fldCaption = getCaption(fldjson.n);
        var comphtml = "";
        var finalhtml;
        let fieldType = fldjson.t.toUpperCase();
        if (fieldType != 'DC') {
            let componentHtml = this.components[fieldType]?.html || `<div class="inputcontent"  readonly>{{v}}</div>`;
            if (fldVal != "") {
                var colclassname = this.getclassname(fldVal, '');
                if (!colclassname.startsWith("col")) {
                    var stylewidth = colclassname;
                    colclassname = "";
                } else {
                    stylewidth = ""
                }
            }

            if (fieldType == "RT" || fieldType == "LT") {
                comphtml = this.createRichTextComponent(fldjson, index);
            } else if (fieldType == "ATT" || fldName.startsWith("axpfile_")) {
                //comphtml = this.createAttachmentHTML(fldjson, index, colclassname)
                const axpfilepathUploadObject = _entityForm.entityFormJson.data.find(item => item.n === fldName.replace("axpfile_", "axpfilepath_"));
                var pathVal = axpfilepathUploadObject ? axpfilepathUploadObject.v : null;
                if (pathVal.indexOf(";bkslh") != -1) {
                    pathVal = pathVal.replace(new RegExp(";bkslh", "g"), "\\");                    
                }

                if (pathVal.endsWith("\\"))
                    pathVal = pathVal.substr(0, pathVal.length - 1);

                fldjson.filepath = pathVal;
                comphtml =
                    `<div class="${colclassname} col-sm-12 " data-type="${fieldType}" data-name="${fldName}" data-ctype="${this.flds[fldName].customdatatype}"><label>${fldCaption}</label>${this.createAttachmentHTML(fldjson, index, colclassname) }</div>`;
            }
            else if (fldName.startsWith("dc") && fldName.endsWith("_image")) {
                comphtml =
                    `<div class="${colclassname} col-sm-12 " data-type="${fieldType}" data-name="${fldName}" data-ctype="${this.flds[fldName].customdatatype}"><label>${fldCaption}</label>${this.createDCAttachmentHTML(fldjson, index, colclassname)}</div>`;
            }
            else if (this.flds[fldName].customdatatype == "Image") {
                //comphtml = this.getTstructImage(fldjson, index, colclassname)
                comphtml =
                    `<div class="${colclassname} col-sm-12 " data-type="${fieldType}" data-name="${fldName}" data-ctype="${this.flds[fldName].customdatatype}"><label>${fldCaption}</label>${this.getTstructImage(fldjson, index, colclassname) }</div>`;
            } else if (fldVal == "T" || fldVal == "F") {
                var checked = fldVal === "T" ? "checked" : "";
                componentHtml = this.components["togglebutton"].html.replace("{{checked}}", checked);
                comphtml =
                    `<div class="${colclassname} col-sm-12 " data-type="${fieldType}" data-name="${fldName}" data-ctype="${this.flds[fldName].customdatatype}"><label>${fldCaption}</label>${componentHtml}</div>`;

            } else {
                comphtml =
                    `<div class="${colclassname} col-sm-12 " data-type="${fieldType}" data-name="${fldName}" data-ctype="${this.flds[fldName].customdatatype}"><label>${fldCaption}</label>${componentHtml}</div>`;
            }
        }

        finalhtml = Handlebars.compile(comphtml)(fldjson);
        return finalhtml;
    }

    ConstructEntityForm(targetSelector, jsonData) {
        var formContainer = document.querySelector(targetSelector);
        formContainer.className = "container";
        var isgrid = false;
        var currentDC = null;
        var rowdiv = document.createElement("div");
        rowdiv.classList.add("row");

        var gridChildren = [];

        for (var i = 0; i < jsonData.length; i++) {

            if (jsonData[i].props.split("~")[0] == "DC") {
                var dcNumber = jsonData[i].dcno;

                if (currentDC !== dcNumber) {
                    isgrid = false;
                    if (rowdiv.innerHTML !== "") {
                        formContainer.appendChild(rowdiv.cloneNode(true));
                        rowdiv.innerHTML = "";
                    }

                    var rowdiv = document.createElement("div");
                    rowdiv.classList.add("row");
                    rowdiv.style.position = "relative"
                    rowdiv.style.right = "3px"

                    var dcHeadingDiv = document.createElement("div");
                    dcHeadingDiv.className = "dc-heading";
                    dcHeadingDiv.innerHTML = "<h3>" + jsonData[i].caption + "</h3>";

                    rowdiv.appendChild(dcHeadingDiv);
                    formContainer.appendChild(rowdiv);

                    currentDC = dcNumber;
                    if (this.isGridDC(jsonData[i])) {
                        isgrid = true;
                        gridChildren = [];
                    }
                }

            }

            if (isgrid) {
                if (jsonData[i].props.split("~")[0] !== "DC" && this.fldtype.includes(jsonData[i].props
                    .split("~")[0]) && jsonData[i].props.split("~")[2] !== "F") {

                    gridChildren.push(jsonData[i]);


                    if ((i + 1 === jsonData.length || jsonData[i + 1].props.split("~")[0] === "DC") &&
                        gridChildren.length > 0) {

                        var tableHtml = this.gridDc(gridChildren, i);
                        rowdiv.innerHTML += tableHtml;
                        gridChildren = [];
                    }
                }
            } else {
                if (jsonData[i].props.split("~")[0] !== "DC" && this.fldtype.includes(jsonData[i].props
                    .split("~")[0]) && jsonData[i].props.split("~")[2] !== "F") {

                    var c = this.nongridDc(jsonData[i], i);
                    rowdiv.innerHTML += c;
                }
            }
        }



        if (rowdiv.innerHTML !== "") {
            formContainer.appendChild(rowdiv);
        }
    }

    isGridDC(dcData) {
        return dcData.props.split("~")[1] == "T";
    }

    gridDc(jsonData, index) {
        var columnValues = {};
        jsonData.forEach(function (data) {
            var columnName = data.fieldid;
            var columnValue = data.value;


            if (!columnValues[columnName]) {
                columnValues[columnName] = [];
            }

            var rowIndex = data.row - 1;
            if (!columnValues[columnName][rowIndex]) {
                columnValues[columnName][rowIndex] = '';
            }
            var fldtype = data.props.split("~")[0];

            var componentHtml = _entityForm.components[data.props.split("~")[0]]?.html || `<div class="inputcontent"  readonly>{{v}}</div>`;
            if (fldtype == "ATT" || fldName.startsWith("axpfile_") || (fldName.startsWith("dc") && fldName.endsWith("_image"))) {
                var colclassname = _entityForm.getclassname(data.value, data.props.split("~")[3]);
                //componentHtml = _entityForm.createAttachmentHTML(data, index, colclassname);
                const axpfilepathUploadObject = _entityForm.entityFormJson.data.find(item => item.n === fldName.replace("axpfile_", "axpfilepath_"));
                var pathVal = axpfilepathUploadObject ? axpfilepathUploadObject.v : null;
                if (pathVal.indexOf(";bkslh") != -1) {
                    pathVal = pathVal.replace(new RegExp(";bkslh", "g"), "\\");
                }

                fldjson.filepath = pathVal;
                componentHtml =
                        `<div class="${colclassname} col-sm-12 " data-type="${fieldType}" data-name="${fldName}" data-ctype="${this.flds[fldName].customdatatype}"><label>${fldCaption}</label>${this.createAttachmentHTML(fldjson, index, colclassname)}</div>`;

                columnValues[columnName][rowIndex] += componentHtml +
                    '<br>';
            } else if (fldtype == "togglebutton" && _entityForm.fldtype.includes(data.props.split("~")[
                0])) {
                var togglehtml = _entityForm.components[fldtype]?.html || `<div class="inputcontent"  readonly>{{v}}</div>`;
                var checked = data.value === "T" ? "checked" : "";

                togglehtml = togglehtml.replace("{{checked}}",
                    checked);
                componentHtml =
                    `<div class="${colclassname} col-sm-12" style="display:inline-grid;" ><div><label style="font-weight:bold;">${data.caption}</label></div><div>${togglehtml}</div></div>`;
                columnValues[columnName][rowIndex] += componentHtml + '<br>';
            } else {
                columnValues[columnName][rowIndex] += columnValue +
                    '<br>';
            }


        });


        var tableHtml = '<table class="table table-light table-striped table-bordered">';
        tableHtml += '<thead><tr>';


        Object.keys(columnValues).forEach(function (columnName) {
            tableHtml += '<th>' + columnName + '</th>';
        });

        tableHtml += '</tr></thead><tbody>';


        var maxRows = Math.max(...Object.values(columnValues).map(arr => arr.length));
        for (var i = 0; i < maxRows; i++) {
            tableHtml += '<tr>';
            Object.keys(columnValues).forEach(function (columnName) {
                var value = columnValues[columnName][i] ||
                    '';
                tableHtml += '<td>' + value + '</td>';
            });
            tableHtml += '</tr>';
        }


        tableHtml += '</tbody></table>';

        return tableHtml;
    }

    nongridDc(fldjson, index) {

        var comphtml = "";
        var finalhtml;
        let fieldType = fldjson.props.split("~")[0];
        let componentHtml = this.components[fieldType]?.html || `<div class="inputcontent"  readonly>{{v}}</div>`;
        if (fldjson.value != "") {
            var colclassname = this.getclassname(fldjson.value, fldjson.props.split("~")[3]);
            if (!colclassname.startsWith("col")) {
                var stylewidth = colclassname;
                colclassname = "";
            } else {
                stylewidth = ""
            }
        }

        if (fieldType == "RT" || fieldType == "LT") {
            comphtml = this.createRichTextComponent(fldjson, index);
        } else if (fieldType == "ATT") {
            comphtml = this.createAttachmentHTML(fldjson, index, colclassname)
        } else if (fieldType == "Img") {
            comphtml = this.getimage(fldjson, index, colclassname)
        } else if (fieldType == "togglebutton") {
            var checked = fldjson.value === "T" ? "checked" : "";
            componentHtml = componentHtml.replace("{{checked}}", checked);
            comphtml =
                `<div class="${colclassname} col-sm-12 " style="display:inline-grid;" ><div><label style="font-weight:bold;">${fldjson.caption}</label></div><div>${componentHtml}</div></div>`;

        } else {
            comphtml =
                `<div class="${colclassname} col-sm-12 " style="width:${stylewidth}px;"><div><label style="font-weight:bold;">{{caption}}</label></div><div>${componentHtml}</div></div>`;
        }


        finalhtml = Handlebars.compile(comphtml)(fldjson);
        return finalhtml;
    }
    getimage(fldjson, index, colclassname) {
        var imgsrc = this.downloadfileattachment(fldjson.caption, "")
        let fieldType = fldjson.props.split("~")[0];
        let componentHtml = this.components[fieldType]?.html || `<div class="inputcontent"  readonly>{{v}}</div>`;
        componentHtml = componentHtml.replace("{{colclassname}}", `${colclassname}`);
        if (imgsrc != undefined) {
            componentHtml = componentHtml.replace("{{src}}", `${imgsrc}`);
        } else {
            componentHtml = componentHtml.replace("{{src}}", `../images/logo.png`);
        }
        var comphtml =
            `<div class="${colclassname} col-sm-12 ">${componentHtml}</div>`
        return comphtml;
    }

    getTstructImage(fldjson, index, colclassname) {
        var imgsrc = "";

        var fileName = ReverseCheckSpecialChars(fldjson.v);
        var fldValuePath = "";
        if (fileName.length > 1) {
            fldValuePath = this.getScriptsPath() + "/" + fileName;
        }

        GetDateTime();
        imgsrc =  fldValuePath + "?" + imageSuffix;
        let componentHtml = this.components["Image"]?.html || `<div class="inputcontent"  readonly>{{v}}</div>`;
        componentHtml = componentHtml.replace("{{colclassname}}", `${colclassname}`);
        if (imgsrc != undefined) {
            componentHtml = componentHtml.replace("{{src}}", `${imgsrc}`);
        }
        return componentHtml;
    }

    getScriptsPath() {
        var path = "";
        var hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
        if (hdnScriptsUrlPath[0] != undefined)
            path = hdnScriptsUrlPath.val() + "axpert/" + callParentNew("mainSessionId");
        return path;
    }

    createRichTextComponent(fldjson, index) {
        var comphtml = `<div class="col-lg-12 col-sm-12 ">
                        <div class="mb-3">
                            <label style="font-weight:bold;">{{caption}}</label>
                        </div>
                        <div id='textcontent${index}' class="mb-5">${fldjson.value}</div>
                    </div>`;
        comphtml = Handlebars.compile(comphtml)(fldjson);
        return comphtml;
    }
    createAttachmentHTML(fldjson, index, colclassname) {
        let componentHtml = this.components["ATT"]?.html || `<div class="inputcontent"  readonly>{{v}}</div>`;
        componentHtml = componentHtml.replaceAll("{{customid}}", `fileattached${index}`);
        var extension = ReverseCheckSpecialChars(fldjson.v).split('.').pop().toLowerCase();
        var fileimg = this.getFileImgHTML(extension)
        componentHtml = componentHtml.replace("{{componentimg}}", `${fileimg}`);
        var comphtml = Handlebars.compile(componentHtml)(fldjson);
        return comphtml;
    }
    createDCAttachmentHTML(fldjson, index, colclassname) {
        let componentHtml = this.components["GRID_ATT"]?.html || `<div class="inputcontent"  readonly>{{v}}</div>`;
        componentHtml = componentHtml.replaceAll("{{customid}}", `fileattached${index}`);
        var extension = ReverseCheckSpecialChars(fldjson.v).split('.').pop().toLowerCase();
        var fileimg = this.getFileImgHTML(extension)
        componentHtml = componentHtml.replace("{{componentimg}}", `${fileimg}`);
        var comphtml = Handlebars.compile(componentHtml)(fldjson);
        return comphtml;
    }
    getclassname(comphtml, compfldwidth) {        
        var tempElement = document.createElement('div');
        tempElement.style.visibility = 'hidden';
        tempElement.style.whiteSpace = 'pre';
        tempElement.style.position = 'absolute';
        tempElement.style.left = '-9999px';
        document.body.appendChild(tempElement);
        tempElement.textContent = comphtml;
        var contentWidth = tempElement.getBoundingClientRect().width;
        document.body.removeChild(tempElement);

        //console.log('Width of input value:', contentWidth, 'pixels');

        var classval = "";
        if (compfldwidth == "" || compfldwidth == undefined || compfldwidth == null) {
            if (contentWidth > 375 && contentWidth < 800) {
                classval = "col-lg-8 Eform_Display_Items";
            } else if (contentWidth > 800) {
                classval = "col-lg-12 Eform_Display_Items";
            } else {
                classval = "col-lg-6 Eform_Display_Items";
            }
            return classval;
        } else {
            return compfldwidth;
        }
    }
    downloadfileattachment(filename, filepath) {
        var src = this.getScriptsPath() + "/" + filename;
        ASB.WebService.LoadAxpFileToScript(filepath, filename, CallBackOnAxpFile);

        function CallBackOnAxpFile() {
            src = unescape(src); //to show decode special characters
            var idx = src.lastIndexOf("/");
            if (idx > -1) src = src.substring(0, idx + 1) + encodeURIComponent(src.substring(idx + 1, src.length));
            if (isMobile) {
                let _fileName = src.match(/\/([^\/?#]+)$/)[1];
                OpenPdfFile(_fileName, "", "", "", false);
            } else {
                window.open(src, "GridUploadFile", "width=500,height=350,scrollbars=no,resizable=yes");
            }
        }  

    }

    showGridAttLink(filename) {
        var src = this.getScriptsPath() + "/" + filename;
        
        src = src.replace(/♠/g, "\'");
        src = unescape(src); //to show decode special characters
        var idx = src.lastIndexOf("/");
        if (idx > -1) src = src.substring(0, idx + 1) + encodeURIComponent(src.substring(idx + 1, src.length));

        window.open(src, "GridUploadFile", "width=500,height=350,scrollbars=no,resizable=yes");

    }

    downloadAttachment(fileUrl, filename, extension) {
        var link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = fileUrl;
        link.download = filename;
        link.click();
        document.body.removeChild(link);
    }
    getFileImgHTML(fileType) {
        switch (fileType) {
            case 'pdf':
                return '<img src="../Images/filetypes/pdf.svg" class="file-img"/>';
            case 'ppt':
            case 'pptx':
                return '<img src="../Images/filetypes/ppt.svg" class="file-img"/>';
            case 'jpeg':
            case 'jpg':
            case 'png':
                return '<img src="../Images/filetypes/images.svg" class="file-img" />';
            case 'doc':
            case 'docx':
                return '<img src="../Images/filetypes/word.svg" class="file-img" />';
            case 'txt':
                return '<img src="../Images/filetypes/text.svg" class="file-img" />';
            case 'xls':
            case 'xlsx':
            case 'csv':
                return '<img src="../Images/filetypes/csv.svg" class="file-img"/>';
            default:
                return '<img src="../Images/filetypes/default.svg" class="file-img" />';
        }
    }
    addmore() {
        document.querySelectorAll(`[id^=${'textcontent'}]`).forEach(element => {

            var maxLength = 350;
            var showText = "..Read More";
            var hideText = "Show Less";
            var content = $(element).html();
            if (content.length > maxLength) {
                var truncatedContent = content.substr(0, maxLength); //
                var hiddenContent = content.substr(maxLength);
                $(element).html(truncatedContent);
                $(element).append('<span class="more-text" style="display:none;">' +
                    hiddenContent +
                    '</span>');
                $(element).append('<a href="#" class="read-more">' + showText +
                    '</a>');
            }

            $(element).on("click", ".read-more", function (e) {
                e.preventDefault();
                var moreText = $(this).text();
                if (moreText === showText) {
                    $(this).text(hideText);
                    $(this).prev(".more-text").show();
                } else {
                    $(this).text(showText);
                    $(this).prev(".more-text").hide();
                }
            });

        });

    }
    readmore() {
        document.querySelectorAll(`[id^=${'textcontent'}]`).forEach(element => {

            var showText = "..Read More";
            var hideText = "Read Less";
            var lines = element.innerHTML.trim().split("\n");
            var firstTwoLines = lines.slice(0, 2);
            var truncatedContent = firstTwoLines.join('\n');
            var tempElement = document.createElement('div');
            tempElement.innerHTML = truncatedContent;
            document.body.appendChild(tempElement);
            var height = tempElement.clientHeight;
            tempElement.parentNode.removeChild(tempElement);


            var hiddenContent = lines.slice(2).join('\n');



            if (firstTwoLines.length >= 2) {
                element.innerHTML = truncatedContent;
                element.insertAdjacentHTML('beforeend',
                    '<span class="more-text" style="display:none;">' + hiddenContent + '</span>'
                );
                element.insertAdjacentHTML('beforeend',
                    '<a href="#" class="read-more" style="float:right;">' + showText + '</a>');
            } else {
                element.innerHTML = truncatedContent;
                element.insertAdjacentHTML('beforeend',
                    '<span class="more-text" style="display:none;">' + hiddenContent + '</span>'
                );
                element.insertAdjacentHTML('beforeend',
                    '<a href="#" class="read-more" style="float:right;display:none;">' +
                    showText + '</a>');

            }
            element.addEventListener("click", function (e) {
                if (!e.target.matches('.read-more')) return;
                e.preventDefault();
                var moreText = e.target.textContent;
                if (moreText === showText) {
                    e.target.textContent = hideText;
                    e.target.previousElementSibling.style.display =
                        'inline';
                } else {
                    e.target.textContent = showText;
                    e.target.previousElementSibling.style.display =
                        'none';
                }
            });
        });
    }

    callAPI(url, data, async, callBack) {
        let _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, async);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

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


    setSelectedRelatedFields() {
        let _this = this;
        let url = "../aspx/EntityForm.aspx/SetSelectedRelatedDataFieldsWS";
        let data = { transId: _this.entityTransId, fields: _this.selectedRelatedDataFields };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                _subEntity.reloadEntityPage();
                ShowDimmer(false);
            } else {

                ShowDimmer(false);
            }
        });
    }


    setSelectedDisplayFields() {
        let _this = this;
        let url = "../aspx/EntityForm.aspx/SetSelectedDisplayFieldsWS";
        let data = { transId: _this.entityTransId, fields: _this.selectedDisplayFields, gridFields: _this.selectedDisplayGridFields };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                _subEntity.reloadEntityPage();
                ShowDimmer(false);
            } else {

                ShowDimmer(false);
            }
        });
    }

}
function getCaption(fname) {
    var metadata = _entityForm.entityFormJson.metadata;
    for (var i = 0; i < metadata.length; i++) {
        if (metadata[i].fname === fname) {
            return metadata[i].caption;
        }
    }
    return null;
}
function getHiddenFlag(fname) {
    var metadata = _entityForm.entityFormJson.metadata;
    for (var i = 0; i < metadata.length; i++) {
        if (metadata[i].fname === fname) {
            return metadata[i].hidden;
        }
    }
    return null;
}

function createListHTML(listJson, pageNo) {
    let html = '';
    //resultHeaderJson = JSON.parse(jsonRowData);
    const filteredRows = filterRowsByPage(listJson, pageNo);
    // Iterate over the metadata array
    Object.keys(_subEntity.subEntityMapping).forEach(subEnt => {
        if (!_subEntity.entityWiseFields[subEnt]) {
            $.each(_subEntity.metaData.filter(i => i.ftransid === subEnt), function (index, field) {
                _entityForm.populateEntityWiseFlds(index, field);
            })
        }
    });
    


    for (var rowData of filteredRows) {
        let keyCol = _subEntity.subEntityMapping[rowData.transid].keycol;

        if (!rowData.hasOwnProperty(keyCol)) {
            keyCol = getKeyField(rowData.transid).fldname;
            if (_subEntity.inValid(rowData[keyCol]))
                keyCol = Object.keys(rowData)[4];

            _subEntity.subEntityMapping[rowData.transid].keycol = keyCol;
        }

        rowData.keycol = keyCol;

        const axpdef_keycol = rowData[keyCol];
        const subEntityCaption = _subEntity.subEntityList[rowData.transid];
        const subEntityVal = getSubEntityInitials(subEntityCaption);

        html += `<div class="Project_items">
                        <div class="card  ">
                           <div class="col-xl-12 col-md-12 d-flex flex-column flex-column-fluid   ">`;
        var rowButtonHTML = generateRowButtonHTML(rowData, rowData.transid);
        html += ` <div class="page-Header">
                                            <h3 class="card-title collapsible cursor-pointer rotate" data-bs-toggle="collapse"
                                                aria-expanded="true" data-bs-target="#Sub-Entity_wrapper" >
                                                <input class="Select-Project" type="checkbox" id="" name="" value="">
                                                <div class="symbol symbol-25px symbol-circle initialized"  onclick="_subEntity.openEntityPage('${subEntityCaption}', '${rowData.transid}')" data-toggle="tooltip" title="${subEntityCaption}" data-bs-original-title="${subEntityCaption}">
                                                            <span class="symbol-label bg-warning text-inverse-warning fw-bold" style="height:30px !important; width:30px !important;">${subEntityVal}</span>
                                                        </div>
                                                <span class="Project_title" onclick="_subEntity.openEntityForm('${subEntityCaption}', '${rowData.transid}', '${rowData.recordid}','${axpdef_keycol}',${rowData.rno})">${axpdef_keycol}</span>
                                                <input type="hidden" id="transid_${rowData.recordid}" value="${rowData.transid}"/>
                                                <input type="hidden" id="recid_${rowData.recordid}" value="${rowData.recordid}"/>
                                                <div class="Project_updates">
                                                    
                                                </div>
                                            </h3>
                                            <div class="card-toolbar ">
                                                <div class="d-flex ">
                                                    <button type="submit" id="" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm me-3" data-bs-toggle="tooltip" title="" data-bs-original-title="edit" onclick="_subEntity.editSubEntity('${rowData.transid}','${rowData.recordid}')">
                                                        <span class="material-icons material-icons-style material-icons-2" style="color: red;">
                                                        edit_note
                                                        </span>
                                                    </button>
                                                    <button type="button" id="" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm d-none" data-kt-menu-trigger="{default:'click', lg: 'hover'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
                                                       <span class="material-icons material-icons-style material-icons-2" style="color: #47BE7D;">
                                                        more_vert
                                                        </span>
                                                    </button>
                                                    <div id="selectThemes" class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px" data-kt-menu="true" data-kt-element="theme-mode-menu">
                                                      ${rowButtonHTML}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
        // Modified BY Section (relative date & time)
        if (!_subEntity.inValid(rowData.modifiedby)) {
            var entity_realtiveTime = moment(rowData.modifiedon).fromNow();
            html += `<div class="workflow-row">
                                            <div class=" workflow-items">
											<div class="symbol symbol-25px symbol-circle initialized d-none"
                                                             data-bs-toggle="tooltip" title="" data-bs-original-title="${rowData.modifiedby
                }">
                                                            <span class="symbol-label bg-warning text-inverse-warning fw-bold">${rowData
                    .modifiedby[0]
                }</span>
                                                        </div>
                                                        <span class="txt-bold Project_updates-value">${rowData.modifiedby
                }</span>last modified <span class="txt-bold Project_updates-value" data-toggle="tooltip" data-placement="top" title="${rowData.modifiedon.replace(
                    "T",
                    " "
                )}" data-name="${rowData.modifiedon.replace(
                    "T",
                    " "
                )}" >${entity_realtiveTime}</span>`;
        }
        if (!_subEntity.inValid(rowData.axpeg_status)) {
            html += `<span class="material-icons material-icons-style material-icons-2 ">people</span>${rowData.axpeg_statustext}
                                                <button id="pd_timeline" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm entity-timelines" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end" data-kt-menu-attach="parent" title="Timeline">
                                                    <span class="material-icons material-icons-style material-icons-2">history</span>
                                                </button>

                                                <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light fw-bolder w-400px py-3" data-kt-menu="true" data-id="pd_timeline" data-processname="${rowData.axpeg_processname}" data-keyvalue="${rowData.axpeg_keyvalue}">
                               
                                                </div>`;
        }
        html += `
                                    <!--<button type="submit" id="" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm me-3">
                                                    <span class="material-icons material-icons-style material-icons-2">history</span>
                                                </button>-->
                                                
                                            </div>
                                        </div>`;


        html += generateRowElements(rowData, rowData.transid);
        html += `</div></div></div>`;
    }
    //$('#body_Container').html('');
    $('#body_Container').append(html);
    $('[data-toggle="tooltip"]').tooltip();
    initReadMore();
    KTMenu.init();
}
function getSubEntityInitials(subEntityVal) {

    let initials = '';

    // Split the string into words
    const words = subEntityVal.split(' ');

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
/* Function Set to generate html */
function generateRowElements(rowData, subEntity, calledFrom) {
    var RowElements = '<div class="Data-fields-row">';
    if (calledFrom && calledFrom == "Other Data") {
        RowElements = '<div class="Data-fields-row relateddata-row workflow-items">';
        for (const fld of _subEntity.entityWiseFields[subEntity].otherElements) {
            RowElements += generateHTMLBasedForOtherData(fld, rowData);
        }

        if (RowElements.endsWith(',&nbsp;'))
            RowElements = RowElements.substr(0, RowElements.length - 7);
    }
    else {
        for (const fld of _subEntity.entityWiseFields[subEntity].otherElements) {
            RowElements += generateHTMLBasedOnDataType(fld, rowData);
        }
        for (const fld of _subEntity.entityWiseFields[subEntity].largeTextElements) {
            RowElements += generateHTMLBasedOnDataType(fld, rowData);
        }
        for (const fld of _subEntity.entityWiseFields[subEntity].attachmentElements) {
            RowElements += generateHTMLBasedOnDataType(fld, rowData);
        }
    }
    RowElements += '</div>';

    if (calledFrom && calledFrom == "Other Data") {
        RowElements = RowElements.replaceAll("txt-bold", " ");
    }
    return RowElements;
}
function generateRowButtonHTML(rowData, subEntity) {
    var rowButtonHTML = "";
    for (const fld of _subEntity.entityWiseFields[subEntity].buttonElements) {
        rowButtonHTML += `<div class="menu-item px-3 my-0">`;
        rowButtonHTML += generateHTMLBasedOnDataType(fld, rowData);
        rowButtonHTML += `</div>`;
    }
    return rowButtonHTML;
}

function getFieldDataType(fldProps) {
    if (_subEntity.inValid(fldProps.cdatatype)) {
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


function generateHTMLBasedOnDataType(fld, rowData) {
    var fldName = fld.fldname;
    if ((fldName == entityKeyField && rowData.transid == _subEntity.entityTransId) || (fldName == rowData.keycol && rowData.transid == fld.ftransid))
        return '';
    var fldtype = getFieldDataType(fld);
    var fCaption = fld.fldcap || '';
    var fProps = fld.props;
    var fldValue = rowData[fldName];
    if ((_subEntity.inValid(fldValue) && fldtype.toUpperCase() != "BUTTON") || fld.fldname == "transid")
        return '';

    if (fldtype.toUpperCase() != "BUTTON")
        fldValue = fldValue?.toString().replace("T00:00:00", "");

    let html = '';
    switch (fldtype) {
        case 'Large Text':
            html = `<div class=" Data-fields-items Department-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                               <p class="task-description moretext" style="margin-bottom:0px !important;">
															${fldValue}
														 </p>
														 <a class="moreless-button" href="#">Read more</a>
                                            </div>`;
            break;
        case 'Short Text':
            html = `<div class=" Data-fields-items Department-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                                <span class="material-icons material-icons-style material-icons-2 ">description</span><span class="txt-bold Data-field-value">${fldValue}</span>
                                            </div>`;
            break;
        case 'Currency':
            html = `<div class=" Data-fields-items Department-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                                <span class="material-icons material-icons-style material-icons-2 ">payments</span><span class="txt-bold Data-field-value">${fldValue}</span>
                                            </div>`;
            break;
        case 'Date':
            html = `<div class=" Data-fields-items Date-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                                <span class="material-icons material-icons-style material-icons-2 ">today</span><span class="txt-bold Data-field-value"> Dec 14 2023 </span>
                                            </div>`;
            break;
        case 'Time':
            html = ` <div class=" Data-fields-items Time-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                                <span class="material-icons material-icons-style material-icons-2 ">schedule</span><span class="txt-bold Data-field-value">11:30 PM</span>
                                            </div>`;
            break;
        case 'Link':
            html = `<div class=" Data-fields-items link-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                                <span class="material-icons material-icons-style material-icons-2 ">link</span><span class="txt-bold Data-field-value">${fldValue}</span>
                                            </div>`;
            break;
        case 'Mobile':
            html = `<div class=" Data-fields-items Email-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                                <span class="material-icons material-icons-style material-icons-2 ">phone</span><span class="txt-bold Data-field-value">${fldValue}</span>
                                            </div>`;
            break;
        case 'Phone':
            html = `<div class=" Data-fields-items Email-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                                <span class="material-icons material-icons-style material-icons-2 ">phone</span><span class="txt-bold Data-field-value">${fldValue}</span>
                                            </div>`;
            break;
        case 'Pincode':
            html = `<div class=" Data-fields-items Email-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                                <span class="material-icons material-icons-style material-icons-2 ">location_on</span><span class="txt-bold Data-field-value">${fldValue}</span>
                                            </div>`;
            break;
        case 'Zipcode':
            html = `<div class=" Data-fields-items Email-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                                <span class="material-icons material-icons-style material-icons-2 ">location_on</span><span class="txt-bold Data-field-value">${fldValue}</span>
                                            </div>`;
            break;
        case 'Email':
            html = `<div class=" Data-fields-items Email-field truncate" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                                <span class="material-icons material-icons-style material-icons-2 ">mail</span><span class="txt-bold Data-field-value" data-text="${fldValue}" onclick="showPopup(this)">${fldValue}</span>
                                            </div>`;
            break;
        case 'Bool':
            if (fldValue == "T")
                html = `<div class=" Data-fields-items Email-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                    <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" role="switch" checked disabled>
                          <span class="txt-bold Data-field-value">${fCaption}</span>
                        </div></div>`;
            else
                html = `<div class=" Data-fields-items Email-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                    <div class="form-check form-switch" style="padding-top: 5px;">
                          <input class="form-check-input" type="checkbox" role="switch" disabled>
                          <span class="txt-bold Data-field-value">${fCaption}</span>
                        </div></div>`;
            break;
        case 'button':
            var propsVal = fProps.split("|");
            var iconVal = propsVal[0].split("~")[1];
            html = `<a href="javascript:void(0)" title="View form"
                                                   class="btn btn-white btn-color-gray-700 btn-active-primary d-inline-flex align-items-center  btn-sm  me-2 ">
                                                    <span class="material-icons material-icons-style material-icons-2"
                                                          style="color: darkmagenta;">${iconVal}</span>${fCaption}
                                                </a>`;
            break;
        case 'Attachments':
            var fileType = getFileType(fldValue);
            var iconClass = getIconClass(fileType);
            var attachmentURL = "";
            html = `<div class="Files-Attached " data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
						   ${iconClass}	
						   <div class="ms-1 fw-semibold">							  
							  <a class="attached-filename" onclick="downloadFileFromPath('${attachmentURL}','${fldValue}')">${fldValue}</a>						  							  
						   </div>						  						   
						</div>`;
            break;
        default:
            html = `<div class=" Data-fields-items Department-field" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                                                <span class="txt-bold Data-field-value">${fldValue}</span>
                                            </div>`;
    }

    return html;
}

function generateHTMLBasedForOtherData(fld, rowData) {
    var fldName = fld.fldname;
    if ((fldName == entityKeyField && rowData.transid == _subEntity.entityTransId) || (fldName == rowData.keycol && rowData.transid == fld.ftransid))
        return '';
    var fldtype = getFieldDataType(fld);
    var fCaption = fld.fldcap || '';
    var fProps = fld.props;
    var fldValue = rowData[fldName];
    if (_subEntity.inValid(fldValue) || fld.fldname == "transid")
        return '';

    fldValue = fldValue?.toString().replace("T00:00:00", "");    
    let html = `<div class="" data-toggle="tooltip" data-placement="top" title="${fCaption}" data-name="${fCaption.toLowerCase().replaceAll("*", "").replaceAll(" ", "")}">
                <span class="txt-bold Data-field-value">${fldValue}</span>
            </div>,&nbsp;`;

    return html;
}
// Event listener for scroll events
// Add a scroll event listener to your div
function isScrollAtBottomWithinDiv(divElement) {
    // Calculate the distance between the top of the div and the bottom of the viewport
    const distanceToBottom = divElement.scrollHeight - (divElement.scrollTop + divElement.clientHeight);

    // Check if the distance to the bottom is within a small threshold to account for rounding errors
    return distanceToBottom <= 1;
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

        // Toggle between two lines and full height and adjust max-height accordingly
        moreLessButton.addEventListener('click', function () {
            // Get the computed style for the moreText element
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
						   ${iconClass}						   
						   <div class="ms-1 fw-semibold">						  
							  <a class="attached-filename" onclick="downloadFileFromPath('${attachmentURL}','${value}')">${value}</a>                    
							  <div class="attached-filedetails">
								 <span class="doctype">${fileType}</span>
							  </div>
						   </div>
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
    _entityForm = new EntityForm();
    _subEntity = new SubEntity();

    _entityForm.init();
    _subEntity.init();
});

function showPopup(element) {
    var text = element.getAttribute('data-text');
    document.getElementById('popupText').textContent = text;
    $('#myModal').modal('show');
}

function getKeyField(transId) {
    if (_subEntity.subEntityKeyFields && _subEntity.subEntityKeyFields[transId]) {
        return { "fldname": _subEntity.subEntityKeyFields[transId] };
    }

    let metaData = _subEntity.metaData.filter(item => item.ftransid === transId);

    // Filter objects with "cdatatype": "Autogenerate"
    const autoGenerateField = metaData.find(item => item.cdatatype === "Auto Generate");
    if (autoGenerateField) {
        return autoGenerateField;
    }

    // Filter objects with hide = F and mandatory/allow empty = F and allowduplicate = F
    const mandatoryUniqueFld = metaData.find(item => item.hide === "F" && item.allowempty === "F" && item.allowduplicate === "F");
    if (mandatoryUniqueFld) {
        return mandatoryUniqueFld;
    }

    // Filter objects with hide = F and mandatory/allow empty = F
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


function fetchFilteredData(fldId, fldVal, dcName, gridDc, rowNo) {
    var tmpFld = _subEntity.metaData.find(item => item.fldname === fldId && item.ftransid === _entityForm.entityTransId)
    let isListingFld = "F";
    if (relatedDataDisplayFields.indexOf(`=${fldId}~`) > -1 || relatedDataDisplayFields.indexOf(`|${fldId}~`) > -1 || (dcName == "dc1" && (relatedDataDisplayFields == "All" || relatedDataDisplayFields == "")))
        isListingFld = "T";
    var filterStr = `${fldId}~${tmpFld.normalized}~${tmpFld.srctable || ""}~${tmpFld.srcfield || ""}~${tmpFld.fdatatype || ""}~${isListingFld || "F"}~${tmpFld.tablename || ""}| = '${fldVal.toLowerCase()}'`;

    _entityForm.filter = filterStr;
    _entityForm.fields = relatedDataDisplayFields || "All";
    _entityForm.getEntityListDataForOtherData(1, `${dcName}${rowNo}${fldId}`, gridDc);
}


function openFieldSelection() {
    $('#fieldsModal').modal('show');
    if ($('#fields-selection').html() == "")
        createOtherDataFieldsLayout();
}

function openDisplayFieldSelection() {
    $('#displayFieldsModal').modal('show');
    if ($('#displayfields-selection').html() == "")
        createDisplayFieldsLayout();
}

function createOtherDataFieldsLayout() {
    const fieldsContainer = document.getElementById("fields-selection");
    var fields = _subEntity.metaData.filter(item => item.ftransid === _entityForm.entityTransId && item.hide === "F" && (item.cdatatype === "DropDown" || item.fdatatype == "c" || item.fdatatype == "d"));
    const groupedFields = {};
    fields.forEach(field => {
        if (!groupedFields[field.dcname]) {
            groupedFields[field.dcname] = [];
        }
        groupedFields[field.dcname].push(field);
    });

    var html = '';
    Object.entries(groupedFields).forEach(([dc, dcFields]) => {
        let collapsed = false;

        let dcName = _entityForm.entityFormJson.metadata.find(item => item.fname == dc).caption || dc;
        html += `
        <div class="card KC_Items">
            <div class="card-header collapsible cursor-pointer rotate  ${collapsed ? "collapsed" : ""}" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#fields-${dc}">
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
            html += `<tr><td><input type="checkbox" id="chk_${fld.fldname}" class="chk-fields chk-relateddataflds" value="${fld.fldname}" data-fldcap="${fld.fldcap || ''}" data-dcname="${dc}"></td>
          <td><label for="chk_${fld.fldname}">${fld.fldcap || ''} (${fld.fldname})</label></td></tr>`;

        })
        html += `</tbody></table></div></div>`;

    })

    fieldsContainer.innerHTML = html;

    //const checkKeyFld = document.querySelector(`#chk_${entityKeyField}`);
    //if (checkKeyFld) {
    //    checkKeyFld.checked = true;
    //    checkKeyFld.disabled = true;
    //}


    const checkFields = document.querySelectorAll(".chk-relateddataflds");

    if (relatedDataFields !== "") {
        relatedDataFields.split(",").forEach(fld => {
            var fldName = fld.split("~")[1];
            document.querySelector(`#chk_${fldName}`).checked = true;
        });
    }

    checkFields.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            var currDcName = this.dataset.dcname;
            var isGridDc = _entityForm.entityFormJson.metadata.find(item => item.fname === currDcName)?.customdatatype || "F";
            if (isGridDc == "T") {
                const dcFields = document.querySelectorAll(`.chk-relateddataflds`);
                let dcGridDetails = {};
                dcGridDetails[currDcName] = isGridDc;

                dcFields.forEach(chk => {
                    var dcName = chk.dataset.dcname;
                    if (!dcGridDetails[dcName]) {
                        dcGridDetails[dcName] = _entityForm.entityFormJson.metadata.find(item => item.fname === dcName)?.customdatatype || "F";
                    }

                    if (dcGridDetails[dcName] == "T" && chk != this) {
                        chk.checked = false;
                    }
                })

            }
        });
    });

}

function createDisplayFieldsLayout() {
    const fieldsContainer = document.getElementById("displayfields-selection");

    const dcs = new Set();
    relatedDataFields.split(',').forEach(pair => {
        const key = pair.split('~')[0];
        dcs.add(key);
    });

    const dcArr = Array.from(dcs);

    var fields = _subEntity.metaData.filter(item => item.ftransid === _entityForm.entityTransId && item.hide === "F" && dcArr.includes(item.dcname));

    const groupedFields = {};
    fields.forEach(field => {
        if (!groupedFields[field.dcname]) {
            groupedFields[field.dcname] = [];
        }
        groupedFields[field.dcname].push(field);
    });


    var html = '';
    Object.entries(groupedFields).forEach(([dc, dcFields]) => {
        let collapsed = true;
        if (dc == "dc1")
            collapsed = false;

        let dcRow = _entityForm.entityFormJson.metadata.find(item => item.fname == dc);
        let dcName = dcRow.caption || dc;
        html += `
        <div class="card KC_Items">
            <div class="card-header collapsible cursor-pointer rotate  ${collapsed ? "collapsed" : ""}" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#fields-${dc}">
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
            html += `<tr><td><input type="checkbox" id="chkdisp_${fld.fldname}" class="chk-fields chk-displayflds" value="${fld.fldname}" data-fldcap="${fld.fldcap || ''}" data-dcname="${dc}" data-griddc="${dcRow.customdatatype || "T"}"></td>
          <td><label for="chkdisp_${fld.fldname}">${fld.fldcap || ''} (${fld.fldname})</label></td></tr>`;

        })
        html += `</tbody></table></div></div>`;
    })

    fieldsContainer.innerHTML = html;

    if (relatedDataDisplayFields !== "") {
        relatedDataDisplayFields.split("^").forEach(dc => {
            dc.split("|").forEach(fld => {
                var fldName = (fld.indexOf("=") > -1) ? fld.split("~")[0].split('=')[1] : fld.split("~")[0];
                document.querySelector(`#chkdisp_${fldName}`).checked = true;
            });
        });
    }

    

    const checkKeyFld = document.querySelector(`#chkdisp_${entityKeyField}`);
    if (checkKeyFld) {
        checkKeyFld.checked = true;
        checkKeyFld.disabled = true;
    }
}


function fieldsModelClose() {
    $('#fieldsModal').modal('hide');
}

function displayFieldsModelClose() {
    $('#displayFieldsModal').modal('hide');
}

function applyRelatedDataFields() {
    const selectedFields = document.querySelectorAll(".chk-relateddataflds:checked");

    // Check if no checkboxes are selected
    if (selectedFields.length === 0) {
        showAlertDialog("error", "Error: No fields are selected.");
        return; // Exit the function
    }

    let fields = "";
    let isDc1FldSelected = false;
    selectedFields.forEach((field) => {
        const fieldName = field.value;
        const dcName = field.dataset.dcname;
        if (!isDc1FldSelected)
            isDc1FldSelected = (field.dataset.dcname === "dc1");

        fields += `${dcName}~${fieldName},`;
    });

    if (!isDc1FldSelected) {
        showAlertDialog("error", "Error: No DC1 fields are selected. Please select atleast one DC1 field.");
        return;
    }

    if (fields.endsWith(","))
        fields = fields.substr(0, fields.length - 1);

    _entityForm.selectedRelatedDataFields = fields;
    _entityForm.setSelectedRelatedFields();
}

function resetRelatedDataFields() {
    _entityForm.selectedRelatedDataFields = "";
    _entityForm.setSelectedRelatedFields();
}

function applyDisplayFields() {
    const selectedFields = document.querySelectorAll(".chk-displayflds:checked");

    // Check if no checkboxes are selected
    if (selectedFields.length === 0) {
        showAlertDialog("error", "Error: No fields are selected.");
        return; // Exit the function
    }

    let fields = "";
    selectedFields.forEach((field) => {
        const fieldName = field.value;
        const dcName = field.dataset.dcname;
        fields += `${dcName}~${fieldName},`;
    });

    if (fields.endsWith(","))
        fields = fields.substr(0, fields.length - 1);

    let fldsStr = "";
    let gridFldsStr = "";
    let groupedSelectedFlds = {}
    selectedFields.forEach((field) => {
        let dcName = `${field.dataset.dcname}~${field.dataset.griddc}`;
        if (!groupedSelectedFlds[dcName])
            groupedSelectedFlds[dcName] = [];

        const fieldName = field.value;
        groupedSelectedFlds[dcName].push(fieldName);
    });

    Object.entries(groupedSelectedFlds).forEach(([dcName, fields]) => {
        let isGridDc = dcName.split("~")[1] == "T";
        const tempFldData = _subEntity.metaData.find(item => item.fldname === fields[0] && item.ftransid == _subEntity.entityTransId);
        if (!isGridDc) {
            fldsStr += `${tempFldData.tablename}=`;

            fields.forEach(fld => {
                const fieldData = _subEntity.metaData.find(item => item.fldname === fld && item.ftransid == _subEntity.entityTransId);
                fldsStr += `${fieldData.fldname}~${fieldData.normalized}~${fieldData.srctable || ""}~${fieldData.srcfield || ""}~${fieldData.allowempty}|`;
            });
            if (fldsStr.endsWith("|"))
                fldsStr = fldsStr.substr(0, fldsStr.length - 1);

            fldsStr += `^`;
        }
        else {
            gridFldsStr += `${tempFldData.tablename}=`;

            fields.forEach(fld => {
                const fieldData = _subEntity.metaData.find(item => item.fldname === fld);
                gridFldsStr += `${fieldData.fldname}~${fieldData.normalized}~${fieldData.srctable || ""}~${fieldData.srcfield || ""}~${fieldData.allowempty}|`;
            });
            if (gridFldsStr.endsWith("|"))
                gridFldsStr = gridFldsStr.substr(0, gridFldsStr.length - 1);

            gridFldsStr += `^`;
        }
    });

    if (fldsStr.endsWith("^"))
        fldsStr = fldsStr.substr(0, fldsStr.length - 1);

    if (gridFldsStr.endsWith("^"))
        gridFldsStr = gridFldsStr.substr(0, gridFldsStr.length - 1);


    _entityForm.selectedDisplayFields = fldsStr;
    _entityForm.selectedDisplayGridFields = gridFldsStr;
    _entityForm.setSelectedDisplayFields();
}

function resetDisplayFields() {
    _entityForm.selectedDisplayFields = "All";
    _entityForm.selectedDisplayGridFields = "";
    _entityForm.setSelectedDisplayFields();
}


function getARMLogs() {
    const tableContainer = document.getElementById('logs-table-container');
    tableContainer.innerHTML = "Loading logs...";
    $('#logsModal').modal('show');

    let _this = _subEntity;
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


function searchFields() {
    let _searchInput = document.getElementById('searchBar').value.toLowerCase();
    let _tables = document.querySelectorAll('[id^="fields-dc"]');

    _tables.forEach(table => {
        let _fields = table.getElementsByTagName('tr');       
        for (let i = 0; i < _fields.length; i++) {
            let _label = _fields[i].getElementsByTagName('label')[0];
            if (_label.innerText.toLowerCase().includes(_searchInput)) {
                _fields[i].style.display = '';
            } else {
                _fields[i].style.display = 'none';
            }
        } 
    });
}


