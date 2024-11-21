var fldAutoData = [];
var fldAutoList = "";
var fldExpData = [];
var colNames = [];
var colVExp = [];
var colfExp = [];
var aportionWhat = [];
var aportionAgainst = [];
var aportionWhatVal = [];
var isQuery = "";
var QueryData = "";
var colSource = [];
var thisFldId = "";
var valuesep = "";
var rowsep = "";
var rowObj = $();
var isfromSqlExec = false;

$j(document).ready(function () {

    GetTableHtml();

    $j(":text").blur(function (event) {
        MainBlur($j(this), "input");
    });

    $j("select").change(function () {
        MainBlur($j(this), "select");
    });

    LoadTableEvents("#divTable");

});

function LoadTableEvents(dvId) {

    var autoDiv = dvId == undefined ? "#divDc1" : dvId;
    tblAutoComplete(autoDiv + " .tblAutocom");
    $j(autoDiv).find(".tblAutocom").autocomplete();

    $j(dvId + " .date").removeClass('hasDatepicker');
    var glType = eval(callParent('gllangType'));
    var dtpkrRTL = false;
    if (glType == "ar")
        dtpkrRTL = true;
    else
        dtpkrRTL = false;
    var glCulture = eval(callParent('glCulture'));
    var dtFormat = "dd/mm/yy";
    if (glCulture == "en-us")
        dtFormat = "mm/dd/yy";
    $j(dvId + " .date").datepicker({
        isRTL: dtpkrRTL,
        dateFormat: dtFormat,
        changeMonth: true,
        changeYear: true
    });

    $j(dvId + " .number").unbind("keypress");
    $j(".number").keypress(function (event) {
        return CheckNumeric(event, $j(this).val());
    });

    $j("input.number").on('input', function () {
        var fldVal = $j(this).val();
        var fldId = $j(this).attr("id");
        var fldIndex = $j(this).attr("data-fInd");
        if (fldId != undefined) {
            var maxFldLength = callParentNew("FMaxLength")[fldIndex];
            var decimalLength = callParentNew("FDecimal")[fldIndex];
            if (decimalLength != undefined && decimalLength > 0) {
                var intPartMaxLimit = maxFldLength - decimalLength - 1;
                if (fldVal.indexOf('.') == -1) {
                    if (fldVal.length > intPartMaxLimit) $j(this).val(fldVal.slice(0, intPartMaxLimit));
                }
                else if (fldVal.indexOf('.') != -1) {
                    var intPart = fldVal.substring(0, fldVal.indexOf('.'));
                    var decPart = fldVal.substring(fldVal.indexOf('.') + 1, fldVal.length);
                    if (intPart.length > intPartMaxLimit) intPart = intPart.slice(0, intPartMaxLimit);
                    if (decPart.length > decimalLength) decPart = decPart.slice(0, decimalLength);
                    $j(this).val(intPart + "." + decPart);
                }
            }
        }
    });

    $j(":text").unbind("blur");
    $j(":text").blur(function (event) {
        MainBlur($j(this), "input");
    });

    $j("select").unbind("change");
    $j("select").change(function () {
        MainBlur($j(this), "select");
    });
}

function tblAutoComplete(fld) {
    var position = {
        my: "left top",
        at: "left bottom"
    };
    if ($("body").hasClass("btextDir-rtl")) {
        position = {
            my: "right top",
            at: "right bottom"
        }
    }

    const autoTblFlds = $(fld);

    autoTblFlds.each(function () {
        const presTblCom = $(this);
        if (presTblCom.data("uiAutocomplete")) {
            presTblCom.autocomplete("destroy")
        }
        if (presTblCom.data("ui-Autocomplete")) {
            presTblCom.autocomplete("destroy")
        }
    });

    autoTblFlds.autocomplete({
        minLength: 0,
        selectFirst: true,
        autoFocus: true,
        position: position,
        source: function (request, response) {
            let fldId = $(this.element).attr("data-id");
            if (fldAutoList != fldId)
                GetTblFldAutoData(fldId);
            //if (fldAutoData.length == 0) {
            //    let fldId = $(this.element).attr("data-id");
            //    GetTblFldAutoData(fldId);
            //}

            if (typeof fldAutoData != "undefined" && fldAutoData.length > 0) {
                var aSearch = [];
                if (request.term != "") {
                    $(fldAutoData).each(function (iIndex, sElement) {
                        sElement = sElement.replace(/\^\^dq/g, '"');
                        if (sElement.toLowerCase().indexOf(request.term.toLowerCase()) >= 0) {
                            aSearch.push(sElement);
                        }
                    });
                    response(aSearch);
                }
                else
                    response(fldAutoData);
            }
            else
                response(fldAutoData);
        },
        search: function (event, ui) {
            $(this).autocomplete("option", "delay", 300);
        }
    });

    $(".tblFldAutoClick").off('click');
    $(".tblFldAutoClick").click(function (e) {
        var presentFldNamer = $(this).attr("data-clk");
        if ($("#" + presentFldNamer).val() != "")
            $("#" + presentFldNamer).val('');
        $("#" + presentFldNamer).focus().autocomplete("search", $("#" + presentFldNamer).val());
    });
}

function GetTableHtml() {
    let tblData = "";
    let tblMetaDataJSON = "";
    try {
        parent.ChangedTblFields = new Array();
        parent.ChangedTblFieldVals = new Array();
        thisFldId = $("#hdnfieldId").val();
        let thisFldVal = "";
        let thisFldDisabled = false;
        let thisFldRowNo = "";
        let json = "";
        if (typeof thisFldId != "undefined" && thisFldId == "fromsqlexec") {
            isfromSqlExec = true;
            thisFldVal = callParentNew('_sqlParStr');
            thisFldDisabled = false;
            thisFldRowNo = "";
            json = callParentNew('_sqlTblJson');
        } else {
            thisFldVal = $(callParentNew(thisFldId, "id")).val();
            thisFldDisabled = $(callParentNew(thisFldId, "id")).prop("disabled");
            thisFldRowNo = callParentNew("GetFieldsRowNo(" + thisFldId + ")", "function");
            var thisFieldName = thisFldId.substring(0, thisFldId.lastIndexOf("F") - 3);
            var thisFldInd = callParentNew("GetFieldIndex(" + thisFieldName + ")", "function");
            json = callParentNew("FTableTypeVal")[thisFldInd];
        }
        if (json != "") {
            json = RepSpecialCharsInHTML(json);
            if (!json.startsWith("{") && !json.startsWith("db@")) {
                let dsfName = json.split("~")[1];
                let dsfDc = callParentNew("GetDcNo(" + dsfName + ")", "function");
                let isGirdDc = parent.DCIsGrid[dsfDc - 1];
                let dsfValue = "";
                if (isGirdDc == "True")
                    dsfValue = $(callParentNew(dsfName + thisFldRowNo + "F" + dsfDc, "id")).val();
                else
                    dsfValue = $(callParentNew(dsfName + "000F" + dsfDc, "id")).val();
                json = GetstrTableJson(dsfValue);
                tblMetaDataJSON = json;
            } else if (json.startsWith("db@")) {
                json = GetDBProcTableJson(json);
                tblMetaDataJSON = json;
            }
            var tableJson = JSON.parse(json);
            if (typeof tableJson != "undefined") {
                var tblType = tableJson.props.type;
                let colCount = tableJson.props.colcount;
                let rowCount = tableJson.props.rowcount;
                let delRow = tableJson.props.deleterow;
                let addRow = tableJson.props.addrow;
                rowsep = tableJson.props.rowseparator;
                valuesep = tableJson.props.valueseparator;
                if (typeof tableJson.props.sql != "undefined") {
                    isQuery = tableJson.props.sql;
                }
                let isDisabled = thisFldDisabled == true ? "disabled" : "";
                if (tblType == "table") {
                    let rowVal = "";
                    if (thisFldVal != "") {
                        rowVal = thisFldVal.split(rowsep);
                        if (rowVal.length > rowCount)
                            rowCount = rowVal.length;
                    }

                    if (rowVal == "" && isQuery == "true") {
                        SqlFillData();
                    }

                    let thRow = "";
                    let tdRow = "";

                    var exprVal = [];
                    thRow += "<tr class=\"fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200\">";
                    if (delRow.toLowerCase() == "t" || delRow.toLowerCase() == "true")
                        thRow += "<th></th>";
                    //thRow += "<th><input type=\"checkbox\" class=\"fgHdrChk\" onclick=\"javascript:CheckAll(this);\"></th>";
                    for (var i = 0; i < colCount; i++) {
                        let colCaption = tableJson.columns[i + 1].caption;
                        let tfhide = "";
                        if (typeof tableJson.columns[i + 1].hide != "undefined" && tableJson.columns[i + 1].hide != "")
                            tfhide = tableJson.columns[i + 1].hide.toLowerCase() == "t" ? " d-none " : "";

                        colNames.push(tableJson.columns[i + 1].name);
                        parent.ChangedTblFields.push(tableJson.columns[i + 1].name);
                        parent.ChangedTblFieldVals.push('');
                        if (tfhide != "")
                            thRow += "<th class=\"" + tfhide + "\">" + colCaption + "</th>";
                        else
                            thRow += "<th>" + colCaption + "</th>";
                        let colExp = tableJson.columns[i + 1].exp;
                        colfExp.push(colExp);
                        var result = "";
                        if (colExp != "") {
                            colExp = colExp.replace(/,/g, "♦");
                            result = callParentNew("Evaluate(" + tableJson.columns[i + 1].name + ",000," + colExp + ",expr,table)", "function");
                        }
                        fldExpData.push(result);
                        colVExp.push(tableJson.columns[i + 1].vexp);
                        if (typeof tableJson.columns[i + 1].aportionwhat != "undefined" && tableJson.columns[i + 1].aportionwhat != "") {
                            aportionWhat.push(tableJson.columns[i + 1].aportionwhat);
                            let fldaportionwhat = tableJson.columns[i + 1].aportionwhat;
                            var fldaportionwhatId = $j($j("[id*='" + fldaportionwhat + "']", doParentOpInIframe("document", "rtn", "[id*='" + fldaportionwhat + "']")).find("input")).attr("id");
                            aportionWhatVal.push($(callParentNew(fldaportionwhatId, "id")).val());
                        }
                        else {
                            aportionWhat.push("");
                            aportionWhatVal.push("");
                        }
                        if (typeof tableJson.columns[i + 1].aportionagainst != "undefined")
                            aportionAgainst.push(tableJson.columns[i + 1].aportionagainst);
                        else
                            aportionAgainst.push("");
                    }
                    thRow += "</tr>";

                    for (var j = 0; j < rowCount; j++) {
                        let colValues = "";
                        if ((typeof rowVal[j] != "undefined" && rowVal[j] != "") && rowVal != "") {
                            colValues = rowVal[j];
                            colValues = colValues.split(valuesep);
                        }
                        tdRow += "<tr id=" + j + ">";
                        if (delRow.toLowerCase() == "t" || delRow.toLowerCase() == "true")
                            tdRow += "<td style=\"text-align:center;\"><input type=\"checkbox\" class=\"fgChk\" name=\"chkItem\" onclick=\"javascript:ChkHdrCheckbox(this);\"></td>";
                        for (var i = 0; i < colCount; i++) {
                            let colValue = "";

                            if ((typeof colValues[i] != "undefined" && colValues[i] != "") && colValues != "")
                                colValue = colValues[i];
                            else if (typeof fldExpData[i] != "undefined" && fldExpData[i] != "")
                                colValue = fldExpData[i];
                            else if (typeof aportionWhatVal[i] != "undefined" && aportionWhatVal[i] != "" && j == 0)
                                colValue = aportionWhatVal[i];
                            else
                                colValue = tableJson.columns[i + 1].value;
                            let sourceFld = tableJson.columns[i + 1].source;

                            let allowEmpty = "";
                            if (typeof tableJson.columns[i + 1].allowempty != "undefined" && tableJson.columns[i + 1].allowempty != "")
                                allowEmpty = tableJson.columns[i + 1].allowempty.toLowerCase() == "f" ? " data-ae='false' " : "";
                            let allowDuplicate = "";
                            if (typeof tableJson.columns[i + 1].allowduplicate != "undefined" && tableJson.columns[i + 1].allowduplicate != "")
                                allowDuplicate = tableJson.columns[i + 1].allowduplicate.toLowerCase() == "f" ? " data-ad='false' " : "";
                            let tfreadyOnly = "";
                            if (typeof tableJson.columns[i + 1].readyonly != "undefined" && tableJson.columns[i + 1].readyonly != "")
                                tfreadyOnly = tableJson.columns[i + 1].readyonly.toLowerCase() == "t" ? " disabled " : "";
                            let tfhide = "";
                            if (typeof tableJson.columns[i + 1].hide != "undefined" && tableJson.columns[i + 1].hide != "")
                                tfhide = tableJson.columns[i + 1].hide.toLowerCase() == "t" ? " d-none " : "";

                            colSource.push(sourceFld);
                            let sourFldInd = callParentNew("GetFieldIndex(" + sourceFld + ")", "function");
                            let fldType = callParentNew("GetDWBFieldType(''," + sourFldInd + ")", "function");
                            let sourceDc = callParentNew("GetDcNo(" + sourceFld + ")", "function");

                            let sourceFldId = sourceFld + thisFldRowNo + "F" + sourceDc;
                            if (callParentNew("FMoe")[sourFldInd] == "Select") {
                                if (callParentNew("FldIsSql")[sourFldInd] == "True") {
                                    tdRow += "<td class=\"" + tfhide + "\"><div class=\"autoinput-parent\">";
                                    tdRow += "<input " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " type=\"text\" class=\"combotem Family form-control tblAutocom fldtableinput\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + j) + "\" value=\"" + colValue + "\" data-id=\"" + sourceFldId + "\">";
                                    tdRow += "<div class=\"edit\"><i class=\"glyphicon glyphicon-chevron-down tblFldAutoClick\" title=\"select\" data-clk=" + (colNames[i] + "R" + j) + "></i></div>";
                                    tdRow += "</div></td>";
                                }
                                else {
                                    var options = "";
                                    $(callParentNew(sourceFldId)).find("option").each(function () {
                                        if (colValue != "" && $(this)[0].value == colValue)
                                            options += $(this)[0].outerHTML.replace("<option ", "<option selected ");
                                        else
                                            options += $(this)[0].outerHTML.replace("selected=\"selected\"", "");
                                    });

                                    if (options == "") {
                                        let ddList = $(callParentNew(sourceFldId)).data('val').split(',');
                                        let ddlSelVal = ($(callParentNew(sourceFldId)).val() == "" ? colValue : $(callParentNew(sourceFldId)).val());
                                        for (var z = 0; z < ddList.length; z++) {
                                            if (ddlSelVal != "" && ddlSelVal == ddList[z])
                                                options += "<option selected=\"selected\" value=\"" + ddList[z] + "\">" + (ddList[z] == "" ? "-- Select --" : ddList[z]) + "</option>";
                                            else
                                                options += "<option value=\"" + ddList[z] + "\">" + (ddList[z] == "" ? "-- Select --" : ddList[z]) + "</option>";
                                        }
                                        tdRow += "<td class=\"" + tfhide + "\"><select " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " class=\"tem Family form-control\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + j) + "\" value=\"" + ddlSelVal + "\">" + options + "</select></td>";
                                    }
                                    else
                                        tdRow += "<td class=\"" + tfhide + "\"><select " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " class=\"tem Family form-control\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + j) + "\" value=\"" + colValue + "\">" + options + "</select></td>";
                                }
                            }
                            else if (callParentNew("FMoe")[sourFldInd] == "Accept" && callParentNew("FldIsSql")[sourFldInd] == "True") {
                                tdRow += "<td class=\"" + tfhide + "\"><input " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " type=\"text\" class=\"tem Family form-control fldtableinput\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + j) + "\" value=\"" + colValue + "\"></td>";
                            }
                            else if (typeof aportionWhat[i] != "undefined" && aportionWhat[i] != "") {
                                tdRow += "<td class=\"" + tfhide + "\"><input " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " type=\"text\" class=\"tem Family form-control fldtableinput\" readonly name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + j) + "\" value=\"" + colValue + "\"></td>";
                            }
                            else {
                                if (callParentNew("FDataType")[sourFldInd] == "Numeric") {
                                    tdRow += "<td class=\"" + tfhide + "\"><input " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " type=\"text\" style=\"text-align:right;\" class=\"tem Family form-control number fldtableinput\" data-fInd=\"" + sourFldInd + "\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + j) + "\" value=\"" + colValue + "\"></td>";
                                }
                                else if (callParentNew("FDataType")[sourFldInd] == "Date/Time") {
                                    tdRow += "<td class=\"input-group " + tfhide + "\"><input " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " type=\"text\" class=\"tem Family form-control flatpickr-input fldtableinput\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + j) + "\" value=\"" + colValue + "\">";
                                    tdRow += "<span class=\"input-group-addon spandate \"><i class=\"glyphicon glyphicon-calendar icon-basic-calendar\" title=" + colNames[i] + "></i></span></td>";
                                }
                                else {
                                    if (sourceFld != "" && callParentNew("FMoe")[sourFldInd] == "Accept" && $(callParentNew(sourceFldId)).val() != "" && $(callParentNew(sourceFldId)).val().indexOf(',') > 0) {
                                        let ddList = $(callParentNew(sourceFldId)).val().split(',');
                                        let ddlSelVal = colValue;
                                        var options = "";
                                        options += "<option value=\"\">-- Select --</option>";
                                        for (var z = 0; z < ddList.length; z++) {
                                            if (ddlSelVal != "" && ddlSelVal == ddList[z])
                                                options += "<option selected=\"selected\" value=\"" + ddList[z] + "\">" + ddList[z] + "</option>";
                                            else
                                                options += "<option value=\"" + ddList[z] + "\">" + ddList[z] + "</option>";
                                        }
                                        tdRow += "<td class=\"input-group-sm " + tfhide + "\"><select " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " class=\"tem Family form-control\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + j) + "\" value=\"" + ddlSelVal + "\">" + options + "</select></td>";
                                    }
                                    else {
                                        if (isfromSqlExec && colNames[i] == "datatypefld") {
                                            var options = "";
                                            options += "<option selected=\"selected\" value=\"c\">" + colValue + "</option>";
                                            options += "<option value=\"n\">Numeric</option>";
                                            options += "<option value=\"d\">Date/Time</option>";
                                            tdRow += "<td class=\"input-group-sm " + tfhide + "\"><select " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " class=\"tem Family form-control\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + j) + "\" value=\"c\">" + options + "</select></td>";
                                        }
                                        else
                                            tdRow += "<td class=\"input-group-sm " + tfhide + "\"><input " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " type=\"text\" class=\"tem Family form-control fldtableinput\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + j) + "\" value=\"" + colValue + "\"></td>";
                                    }
                                }
                            }
                            if (j == 0)
                                parent.ChangedTblFieldVals[i] = colValue;
                            else {
                                parent.ChangedTblFieldVals[i] = parent.ChangedTblFieldVals[i] + "~" + colValue;
                            }
                        }
                        tdRow += "</tr>";
                    }
                    tblData = "<div>";
                    tblData += "<div>";
                    if (addRow.toLowerCase() == "t" || addRow.toLowerCase() == "true")
                        tblData += "<div class=\"pull-left\"><i class=\"glyphicon glyphicon-plus\" title=\"Add\" onclick=\"AddTableRows('fldTable');\"></i></div>";
                    if (delRow.toLowerCase() == "t" || delRow.toLowerCase() == "true")
                        tblData += "<div class=\"pull-left\"><i class=\"glyphicon cup glyphicon-trash\" title=\"Delete\" onclick=\"DeleteTableRows('fldTable');\"></i></div>";
                    if (isQuery != "")
                        tblData += "<div class=\"pull-left\"><i class=\"glyphicon glyphicon-list\" title=\"Fill Data\" onclick=\"SqlFillData();\"></i></div>";
                    tblData += "<table id=\"fldTable\" class=\"table\">";
                    tblData += "<thead>";
                    tblData += thRow;
                    tblData += "</thead>";
                    tblData += "<tbody>";
                    tblData += tdRow;
                    tblData += "</tbody>";
                    tblData += "</table>";
                    tblData += "</div>";
                    tblData += "<div></div>";
                    tblData += "<div><input type=\"button\" class=\"coldbtn btn\" value=\"Clear\" onclick=\"ClearTableData('fldTable');\" /><input type=\"button\" class=\"hotbtn btn\" value=\"Ok\" onclick=\"AddTableData('" + thisFldId + "','" + valuesep + "','" + rowsep + "');\" style=\"float: right;\"/></div>";
                    tblData += "</div>";

                    if (rowVal == "" && isQuery == "sqlDescr") {
                        setTimeout(function () {
                            SqlFillData();
                        }, 0);
                    }
                }
                else {
                    var exprVal = [];
                    let colValues = "";
                    if (thisFldVal != "") {
                        colValues = thisFldVal;
                        colValues = colValues.split(valuesep);
                    }
                    var formDiv = "<div id=\"divtblForm\" >";
                    for (var i = 0; i < colCount; i++) {
                        let tfhide = "";
                        if (typeof tableJson.columns[i + 1].hide != "undefined" && tableJson.columns[i + 1].hide != "")
                            tfhide = tableJson.columns[i + 1].hide.toLowerCase() == "t" ? " d-none " : "";

                        let colCaption = tableJson.columns[i + 1].caption;
                        formDiv += "<div class=\"col-lg-12 col-sm-3 col-md-3 col-xs-12 " + tfhide + "\"><label>" + colCaption + "</label></div>";
                        formDiv += "<div class=\"col-lg-12 col-sm-9 col-md-9 col-xs-12 " + tfhide + "\">";
                        colNames.push(tableJson.columns[i + 1].name);
                        parent.ChangedTblFields.push(tableJson.columns[i + 1].name);
                        parent.ChangedTblFieldVals.push('');
                        let colExp = tableJson.columns[i + 1].exp;
                        colfExp.push(colExp);
                        var result = "";
                        if (colExp != "") {
                            colExp = colExp.replace(/,/g, "♦");
                            result = callParentNew("Evaluate(" + tableJson.columns[i + 1].name + ",000," + colExp + ",expr,table)", "function");
                        }
                        fldExpData.push(result);
                        colVExp.push(tableJson.columns[i + 1].vexp);
                        if (typeof tableJson.columns[i + 1].aportionwhat != "undefined" && tableJson.columns[i + 1].aportionwhat != "") {
                            aportionWhat.push(tableJson.columns[i + 1].aportionwhat);
                            let fldaportionwhat = tableJson.columns[i + 1].aportionwhat;
                            var fldaportionwhatId = $j($j("[id*='" + fldaportionwhat + "']", doParentOpInIframe("document", "rtn", "[id*='" + fldaportionwhat + "']")).find("input")).attr("id");
                            aportionWhatVal.push($(callParentNew(fldaportionwhatId, "id")).val());
                        }
                        else {
                            aportionWhat.push("");
                            aportionWhatVal.push("");
                        }
                        if (typeof tableJson.columns[i + 1].aportionagainst != "undefined")
                            aportionAgainst.push(tableJson.columns[i + 1].aportionagainst);
                        else
                            aportionAgainst.push("");


                        let colValue = "";

                        if ((typeof colValues[i] != "undefined" && colValues[i] != "") && colValues != "")
                            colValue = colValues[i];
                        else if (typeof fldExpData[i] != "undefined" && fldExpData[i] != "")
                            colValue = fldExpData[i];
                        else if (typeof aportionWhatVal[i] != "undefined" && aportionWhatVal[i] != "")
                            colValue = aportionWhatVal[i];
                        else
                            colValue = tableJson.columns[i + 1].value;
                        let sourceFld = tableJson.columns[i + 1].source;

                        let allowEmpty = "";
                        if (typeof tableJson.columns[i + 1].allowempty != "undefined" && tableJson.columns[i + 1].allowempty != "")
                            allowEmpty = tableJson.columns[i + 1].allowempty.toLowerCase() == "f" ? " data-ae='false' " : "";
                        let allowDuplicate = "";
                        if (typeof tableJson.columns[i + 1].allowduplicate != "undefined" && tableJson.columns[i + 1].allowduplicate != "")
                            allowDuplicate = tableJson.columns[i + 1].allowduplicate.toLowerCase() == "f" ? " data-ad='false' " : "";
                        let tfreadyOnly = "";
                        if (typeof tableJson.columns[i + 1].readyonly != "undefined" && tableJson.columns[i + 1].readyonly != "")
                            tfreadyOnly = tableJson.columns[i + 1].readyonly.toLowerCase() == "t" ? " disabled " : "";

                        colSource.push(sourceFld);
                        let sourFldInd = callParentNew("GetFieldIndex(" + sourceFld + ")", "function");
                        let fldType = callParentNew("GetDWBFieldType(''," + sourFldInd + ")", "function");
                        let sourceDc = callParentNew("GetDcNo(" + sourceFld + ")", "function");

                        let sourceFldId = sourceFld + thisFldRowNo + "F" + sourceDc;
                        if (callParentNew("FMoe")[sourFldInd] == "Select") {
                            if (callParentNew("FldIsSql")[sourFldInd] == "True") {
                                formDiv += "<div class=\"autoinput-parent\">";
                                formDiv += "<input " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " type=\"text\" name=" + colNames[i] + " class=\"combotem Family form-control tblAutocom fldtableinput\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + 0) + "\" value=\"" + colValue + "\" data-id=\"" + sourceFldId + "\">";
                                formDiv += "<div class=\"edit\"><i class=\"glyphicon glyphicon-chevron-down tblFldAutoClick\" title=\"select\" data-clk=" + (colNames[i] + "R" + 0) + "></i></div>";
                                formDiv += "</div>";
                            }
                            else {
                                var options = "";
                                $(callParentNew(sourceFldId)).find("option").each(function () {
                                    if (colValue != "" && $(this)[0].value == colValue)
                                        options += $(this)[0].outerHTML.replace("<option ", "<option selected ");
                                    else
                                        options += $(this)[0].outerHTML.replace("selected=\"selected\"", "");
                                });

                                if (options == "") {
                                    let ddList = $(callParentNew(sourceFldId)).data('val').split(',');
                                    let ddlSelVal = ($(callParentNew(sourceFldId)).val() == "" ? colValue : $(callParentNew(sourceFldId)).val());
                                    for (var z = 0; z < ddList.length; z++) {
                                        if (ddlSelVal != "" && ddlSelVal == ddList[z])
                                            options += "<option selected=\"selected\" value=\"" + ddList[z] + "\">" + (ddList[z] == "" ? "-- Select --" : ddList[z]) + "</option>";
                                        else
                                            options += "<option value=\"" + ddList[z] + "\">" + (ddList[z] == "" ? "-- Select --" : ddList[z]) + "</option>";
                                    }
                                    formDiv += "<select " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " class=\"tem Family form-control\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + 0) + "\" value=\"" + ddlSelVal + "\">" + options + "</select>";
                                }
                                else {
                                    formDiv += "<select " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " class=\"tem Family form-control\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + 0) + "\" value=\"" + colValue + "\">" + options + "</select>";
                                }
                            }
                        }
                        else if (callParentNew("FMoe")[sourFldInd] == "Accept" && callParentNew("FldIsSql")[sourFldInd] == "True") {
                            formDiv += "<input " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " type=\"text\" class=\"tem Family form-control fldtableinput\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + 0) + "\" value=\"" + colValue + "\">";
                        }
                        else if (typeof aportionWhat[i] != "undefined" && aportionWhat[i] != "") {
                            formDiv += "<input " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " type=\"text\" class=\"tem Family form-control fldtableinput\" readonly name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + 0) + "\" value=\"" + colValue + "\">";
                        }
                        else {
                            if (callParentNew("FDataType")[sourFldInd] == "Numeric") {
                                formDiv += "<input " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " type=\"text\" style=\"text-align:right;\" class=\"tem Family form-control number fldtableinput\" data-fInd=\"" + sourFldInd + "\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + 0) + "\" value=\"" + colValue + "\">";
                            }
                            else if (callParentNew("FDataType")[sourFldInd] == "Date/Time") {
                                formDiv += "<div class=\"input-group\"><input " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " type=\"text\" class=\"tem Family form-control date hasDatepicker fldtableinput\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + 0) + "\" value=\"" + colValue + "\">";
                                formDiv += "<span class=\"input-group-addon spandate \"><i class=\"glyphicon glyphicon-calendar icon-basic-calendar\" title=\"" + colNames[i] + "\"></i></span></div>";
                            }
                            else {
                                if (sourceFld != "" && callParentNew("FMoe")[sourFldInd] == "Accept" && $(callParentNew(sourceFldId)).val() != "" && $(callParentNew(sourceFldId)).val().indexOf(',') > 0) {
                                    let ddList = $(callParentNew(sourceFldId)).val().split(',');
                                    let ddlSelVal = colValue;
                                    var options = "";
                                    options += "<option value=\"\">-- Select --</option>";
                                    for (var z = 0; z < ddList.length; z++) {
                                        if (ddlSelVal != "" && ddlSelVal == ddList[z])
                                            options += "<option selected=\"selected\" value=\"" + ddList[z] + "\">" + ddList[z] + "</option>";
                                        else
                                            options += "<option value=\"" + ddList[z] + "\">" + ddList[z] + "</option>";
                                    }
                                    formDiv += "<select " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " class=\"tem Family form-control\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + 0) + "\" value=\"" + ddlSelVal + "\">" + options + "</select>";
                                }
                                else
                                    formDiv += "<input " + isDisabled + tfreadyOnly + allowEmpty + allowDuplicate + " type=\"text\" class=\"tem Family form-control fldtableinput\" name=\"" + colNames[i] + "\" id=\"" + (colNames[i] + "R" + 0) + "\" value=\"" + colValue + "\">";
                            }
                        }
                        if (i == 0)
                            parent.ChangedTblFieldVals[i] = colValue;
                        else {
                            parent.ChangedTblFieldVals[i] = parent.ChangedTblFieldVals[i] + "~" + colValue;
                        }
                        formDiv += "</div><div class=\"clearfix\"></div>";
                    }
                    formDiv += "</div>";

                    tblData = "<div>";
                    tblData += formDiv;
                    tblData += "</div><div class=\"clearfix\"></div>";
                    tblData += "<div><div class=\"col-lg-12 col-sm-12 col-md-12 col-xs-12\"><input type=\"button\" class=\"coldbtn btn\" value=\"Clear\" onclick=\"ClearTableData('fldTable');\" /><input type=\"button\" class=\"hotbtn btn\" value=\"Ok\" onclick=\"AddTableData('" + thisFldId + "','" + valuesep + "','" + rowsep + "');\" style=\"float: right;\"/></div></div>";
                }
            }
        }
    } catch (ex) { }
    $("#divTable").html(tblData);
    try {
        parent.AxAfterTableLoad(tblMetaDataJSON);
    } catch (ex) { }
}

function AddTableData() {
    var fldTblVal = "";
    let isErrorflag = true;
    let strAllowDuplicate = "";
    if ($("#fldTable tbody tr").length > 0) {
        $("#fldTable tbody tr").each(function () {
            var fldTblTdVal = "";
            let seperaterCount = 0;
            $(this).find("td").each(function () {
                if ($(this).find("select").length > 0 && typeof $(this).find("select").attr("value") != "undefined") {
                    fldTblTdVal += $(this).find("select").attr("value") + valuesep;
                    seperaterCount++;
                }
                else if ($(this).find("input:text").length > 0) {
                    if (typeof $(this).find("input").data("ae") != "undefined" && $(this).find("input").data("ae") == false && $(this).find("input").attr("value") == "") {
                        callParentNew('showAlertDialog("error",' + $(this).find("input").attr('id') + ' cannot be left empty.)', 'function');
                        $(this).find("input").focus();
                        isErrorflag = false;
                        return false;
                    }
                    if (typeof $(this).find("input").data("ad") != "undefined" && $(this).find("input").data("ad") == false && $(this).find("input").attr("value") != "") {
                        let _thisAd = $(this).find("input").attr('name') + "~" + $(this).find("input").attr("value") + "♠";
                        if (strAllowDuplicate.indexOf(_thisAd) > -1) {
                            callParentNew('showAlertDialog("error",' + $(this).find("input").attr('id') + ' duplicate value not allowed.)', 'function');
                            $(this).find("select").focus();
                            isErrorflag = false;
                            return false;
                        } else {
                            strAllowDuplicate += $(this).find("input").attr('name') + "~" + $(this).find("input").attr("value") + "♠";
                        }
                    }
                    fldTblTdVal += $(this).find("input").attr("value") + valuesep;
                    seperaterCount++;
                }
            });
            if (fldTblTdVal == valuesep.repeat(seperaterCount) && (parent.transid == "ad_i" || parent.transid == "ad_iq")) {
                fldTblTdVal = "";
            }
            if (fldTblTdVal != "")
                fldTblTdVal = fldTblTdVal.substring(0, fldTblTdVal.length - 1);
            fldTblVal += fldTblTdVal + rowsep;
        });
    }
    else {
        var fldTblTdVal = "";
        $("#divTable").find("input,select").each(function () {
            if ($(this).is("select") && typeof $(this).attr("value") != "undefined")
                fldTblTdVal += $(this).attr("value") + valuesep;
            else if ($(this).is("input") && $(this).attr("type") == "text") {
                if (typeof $(this).data("ae") != "undefined" && $(this).data("ae") == false && $(this).attr("value") == "") {
                    callParentNew('showAlertDialog("error",' + $(this).attr('name') + ' cannot be left empty.)', 'function');
                    $(this).find("input").focus();
                    isErrorflag = false;
                    return false;
                }
                fldTblTdVal += $(this).attr("value") + valuesep;
            }
        });
        if (fldTblTdVal != "")
            fldTblTdVal = fldTblTdVal.substring(0, fldTblTdVal.length - 1);
        fldTblVal += fldTblTdVal + rowsep;
    }
    if (isErrorflag) {
        if (isfromSqlExec) {
            fldTblVal = fldTblVal.substring(0, fldTblVal.length - 1);
            parent._sqlTblValues = fldTblVal;
        } else {
            fldTblVal = fldTblVal.substring(0, fldTblVal.length - 1);
            $j("#" + thisFldId, doParentOpInIframe("document", "rtn", "#" + thisFldId)).val(fldTblVal)
            UpdateArray(thisFldId, fldTblVal);
        }
        closeUploadDialog();
        try {
            parent.AxAfterAddTableData();
        } catch (ex) { }
    }
}

function ClearTableData(thisTblId) {
    $("#" + thisTblId + " tbody tr td").each(function () {
        $(this).find('input:text').val('');
        $(this).find('input:text').attr("value", '');
        $(this).find('select').val('');
        $(this).find('select').prop("selected", false)
    });
}

function DeleteTableRows(thisTblId) {
    $("#" + thisTblId + " tbody tr").each(function () {
        if (typeof $(this).find(".fgChk:checked").prop("checked") != "undefined" && $(this).find(".fgChk:checked").prop("checked")) {
            if ($("#" + thisTblId + " tbody tr").length == 1) {
                $j(".fgHdrChk").prop("checked", false);
                rowObj = $(this).clone();
            }
            $(this).remove();
        }
    });
}

function AddTableRows(thisTblId) {
    var thisRow = $("#" + thisTblId + " tbody tr:last");
    var rowNo = '-1';
    if (thisRow.length == 0) {
        rowObj.find('input:text').val('');
        $("#" + thisTblId + " tbody").append(rowObj);
    }
    else {
        rowNo = $("#" + thisTblId + " tbody tr:last").attr("id");
        $(thisRow).clone().insertAfter(thisRow).find('input:text').val('');
    }
    $("#" + thisTblId + " tbody tr:last").find(".fgChk").prop("checked", false);
    $j(".fgHdrChk").prop("checked", false);
    $("#" + thisTblId + " tbody tr:last").find('select,input,div.autoclear i,div.edit i,div[id^=autoadv],div[id^=autoadv] i').each(function (index, el) {
        var currentElement = $j(this);
        var attVal = "data-clk";
        id = currentElement.attr(attVal);
        if (id != undefined)
            currentElement.attr(attVal, $j(this).parents(".autoinput-parent").find("input").attr("id"));
        else {
            var fName = currentElement.attr("name");
            var prevFldName = fName + "R" + rowNo;
            var newFldName = fName + "R" + (parseInt(rowNo) + 1);
            currentElement.attr("id", newFldName);
            currentElement.removeAttr('value').attr('value', '');
        }
    });
    $("#" + thisTblId + " tbody tr:last").attr("id", (parseInt(rowNo) + 1).toString())
    LoadTableEvents("#divTable");
}

function MainBlur(obj, type) {
    let fldInd = colNames.indexOf(obj.attr("name"));
    if (typeof colVExp[fldInd] != "undefined" && colVExp[fldInd] != "") {
        var vExp = colVExp[fldInd].replace(/,/g, "♦");
        var vRowNo = obj.attr("id").replace(obj.attr("name") + "R", '');
        var indx = $j.inArray(obj.attr("name"), parent.ChangedTblFields);
        var cellVal = parent.ChangedTblFieldVals[indx].split('~');
        cellVal[vRowNo] = $(obj).val();
        parent.ChangedTblFieldVals[indx] = cellVal.join("~");

        var fResult = callParentNew("Evaluate(" + obj.attr("name") + "," + vRowNo + "," + vExp + ",vexpr,table)", "function");
        if (fResult != 'T' && fResult != 't' && fResult != true) {
            var cutMsg = eval(callParent('lcm[52]'));
            var firstChar = fResult.substring(0, 1);
            var alertMsg = fResult.substring(1);
            if (firstChar == "_") {
                showAlertDialog("error", alertMsg);
            } else if (firstChar == "?") {
                showAlertDialog("error", alertMsg);
                if (type == "input") {
                    $(obj).val($(obj).val());
                    $(obj).attr("value", $(obj).val());
                }
                else {
                    let ddlValue = $j(obj).val();
                    $j(obj).attr("selected", "selected");
                    $(obj).attr("value", ddlValue);
                }
                return false;
            } else if (firstChar == "*") {
                showAlertDialog("error", alertMsg);
                return false;
            } else {
                if (fResult == "MessageSetAxFont") {
                    return true;
                } else if (confirm(fResult + ". " + cutMsg)) {
                    if (type == "input") {
                        $(obj).val($(obj).val());
                        $(obj).attr("value", $(obj).val());
                    }
                    else {
                        let ddlValue = $j(obj).val();
                        $j(obj).attr("selected", "selected");
                        $(obj).attr("value", ddlValue);
                    }

                    return false;
                } else {
                    return true;
                }
            }
        }

        TableEvalonBlur(indx, vRowNo);
    }
    else {
        if (type == "input") {
            $(obj).val($(obj).val());
            $(obj).attr("value", $(obj).val());
        }
        else {
            let ddlValue = $j(obj).val();
            $j(obj).attr("selected", "selected");
            $(obj).attr("value", ddlValue);
        }

        var vRowNo = obj.attr("id").replace(obj.attr("name") + "R", '');
        var indx = $j.inArray(obj.attr("name"), parent.ChangedTblFields);
        var cellVal = parent.ChangedTblFieldVals[indx].split('~');
        cellVal[vRowNo] = $(obj).val();
        parent.ChangedTblFieldVals[indx] = cellVal.join("~");

        TableEvalonBlur(indx, vRowNo);
    }

    Aportion(obj);
}

function TableEvalonBlur(fldInd, fRowNo) {
    if (typeof colfExp[fldInd] != "undefined" && colfExp[fldInd] == "") {
        for (var i = fldInd; i < colfExp.length; i++) {
            if (typeof colfExp[i] != "undefined" && colfExp[i] != "") {
                var fExp = colfExp[i].replace(/,/g, "♦");
                var obj = $("#" + colNames[i] + "R" + fRowNo);
                //var fRowNo = obj.attr("id").replace(obj.attr("name"), '');
                var indx = $j.inArray(obj.attr("name"), parent.ChangedTblFields);
                var cellVal = parent.ChangedTblFieldVals[indx].split('~');
                cellVal[fRowNo] = $(obj).val();
                parent.ChangedTblFieldVals[indx] = cellVal.join("~");

                var fResult = callParentNew("Evaluate(" + obj.attr("name") + "," + fRowNo + "," + fExp + ",expr,table)", "function");
                if (fResult != '') {
                    let type = $(obj).attr("type");
                    if (type == "text") {
                        $(obj).val(fResult);
                        $(obj).attr("value", fResult);
                    }
                    else {
                        let ddlValue = fResult;
                        $j(obj).attr("selected", "selected");
                        $(obj).attr("value", ddlValue);
                    }
                    cellVal[fRowNo] = fResult;
                    parent.ChangedTblFieldVals[indx] = cellVal.join("~");
                }
            }
        }
    }
}

function UpdateArray(fldName, fldValue) {

    var isAlreadyFound = false;
    for (var x = 0; x < doParentOpInIframe("ChangedFields", "rtn").length; x++) {

        var fName = doParentOpInIframe("ChangedFields[" + x + "]", "rtn").toString();
        if (fName == fldName) {
            if (fldValue == "***") {
                doParentOpInIframe("ChangedFields", "rtn").splice(x, 1);
                doParentOpInIframe("ChangedFieldDbRowNo", "rtn").splice(x, 1);
                doParentOpInIframe("ChangedFieldValues", "rtn").splice(x, 1);
                doParentOpInIframe().ChangedFieldOldValues.splice(x, 1);
            }
            else {
                doParentOpInIframe("ChangedFieldOldValues[" + x + "]", "var", doParentOpInIframe("ChangedFieldValues[" + x + "]", "rtn").toString());
                doParentOpInIframe("ChangedFieldDbRowNo[" + x + "]", "var", doParentOpInIframe("ChangedFieldDbRowNo[" + x + "]", "rtn"));
                doParentOpInIframe("ChangedFieldValues[" + x + "]", "var", fldValue);
            }
            isAlreadyFound = true; // the field name is already found and updated.
            break;
        }
    }

    if ((!isAlreadyFound) && (fldValue != "***")) {
        var fIndx = fldName.lastIndexOf("F");
        var rowNo = fldName.substring(fIndx - 3, fIndx);
        var dcNo = fldName.substring(fIndx + 1);
        var dbRowNo = callParentNew("GetDbRowNo(" + rowNo + "," + dcNo + ")", "function");
        parent.ChangedFields.push(fldName);
        parent.ChangedFieldDbRowNo.push(dbRowNo);
        parent.ChangedFieldValues.push(fldValue);
        parent.ChangedFieldOldValues.push("");
    }
}

function closeUploadDialog() {
    if ($(parent.$('.custom-dialog')) != undefined && $(parent.$('.custom-dialog')).length > 0) {
        $(parent).focus();
        if ($(parent.$('.custom-dialog .close')) != undefined && $(parent.$('.custom-dialog .close')).length > 0) {
            $(parent.$('.custom-dialog  .close'))[$(parent.$('.custom-dialog .close')).length - 1].click();
        }
        setTimeout(function () {
            $(parent.$('.custom-dialog'))[$(parent.$('.custom-dialog')).length - 1].remove();
        }, 300);
    }
}

function CheckSpecialCharsInStr(str) {

    var str = str;
    if (str != undefined) {
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/'/g, "&apos;");
        str = str.replace(/"/g, '&quot;');
    }
    else {
        str = "";
    }
    return str;
}

function RepSpecialCharsInHTML(str) {
    str = str.replace(/&amp;/g, "&");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&apos;/g, "'");
    str = str.replace(/&quot;/g, '"');
    return str;
}

function CheckAll(obj) {
    $j("input[name=chkItem]:checkbox").each(function () {
        $j(this).prop("checked", obj.checked);
    });
}

function ChkHdrCheckbox(obj, exprResult) {
    if ($j(".fgChk:visible").length == $j(".fgChk:checked").length)
        $j(".fgHdrChk").prop("checked", true);
    else
        $j(".fgHdrChk").prop("checked", false);
}

function GetTblFldAutoData(thisFldId) {
    fldAutoData = [];
    var custData = callParentNew("AxGetCustSelectFldData(" + thisFldId + ")", "function");
    if (custData != "") {
        fldAutoList = thisFldId;
        var JsonData = JSON.parse(custData);
        var fldData = JsonData.pickdata[3].data;
        $(fldData).each(function (iIndex, sElement) {
            sElement.i = sElement.i.replace(/\^\^dq/g, '"');
            fldAutoData.push(sElement.i);
        });
    }
}

function Aportion(thisChangedFld) {
    let fldInd = colNames.indexOf(thisChangedFld.attr("name"));
    let fldName = thisChangedFld.attr("name");
    let apAgainst = aportionAgainst.indexOf(fldName);
    if (apAgainst > -1) {
        let fldApName = colNames[apAgainst];
        var fldApVa = 0;
        $('[name="' + fldApName + '"]').each(function () {
            fldApVa = parseInt(fldApVa) + parseInt($(this).val() == "" ? 0 : $(this).val());
        });
        var thisVal = $(thisChangedFld).val();
        if (thisVal != "") {
            var adjVal = $(thisChangedFld).parents("tr").find("[name='" + fldApName + "']").val();
            var adjId = $(thisChangedFld).parents("tr").find("[name='" + fldApName + "']").attr("id");
            if (parseInt(thisVal) <= parseInt(adjVal)) {
                $($("#" + adjId)).val(thisVal);
                $($("#" + adjId)).attr("value", thisVal);
                var nxtAdjVal = $(thisChangedFld).parents("tr").next("tr").find("[name='" + fldApName + "']").val();
                var nxtAdjId = $(thisChangedFld).parents("tr").next("tr").find("[name='" + fldApName + "']").attr("id");

                var fldAfterApVa = 0;
                $('[name="' + fldApName + '"]').each(function () {
                    fldAfterApVa = parseInt(fldAfterApVa) + parseInt($(this).val() == "" ? 0 : $(this).val());
                });

                if (nxtAdjVal == "" && parseInt(aportionWhatVal[apAgainst]) > parseInt(thisVal)) {
                    let nxtVal = 0;
                    if (aportionWhatVal[apAgainst] == fldApVa)
                        nxtVal = aportionWhatVal[apAgainst] - parseInt(fldAfterApVa);
                    else
                        nxtVal = aportionWhatVal[apAgainst] - (fldApVa + parseInt(thisVal));
                    $($("#" + nxtAdjId)).val(nxtVal);
                    $($("#" + nxtAdjId)).attr("value", nxtVal);
                }
                else if (nxtAdjVal != "" && parseInt(aportionWhatVal[apAgainst]) > parseInt(fldApVa)) {
                    var ss = nxtAdjVal;
                }
            }
            else if ((adjVal == "" || adjVal == "0") && parseInt(aportionWhatVal[apAgainst]) != parseInt(fldApVa)) {
                $($("#" + adjId)).val(thisVal);
                $($("#" + adjId)).attr("value", thisVal);
            }
            else if (adjVal != "" && aportionWhatVal[apAgainst] == "") {
                $($("#" + adjId)).val(thisVal);
                $($("#" + adjId)).attr("value", thisVal);
            }
            else if (parseInt(aportionWhatVal[apAgainst]) != parseInt(fldApVa)) {
                let balVal = parseInt(aportionWhatVal[apAgainst]) - parseInt(fldApVa);
                var thisAdjVal = $(thisChangedFld).parents("tr").find("[name='" + fldApName + "']").val();
                balVal = balVal + parseInt(thisAdjVal);
                if (thisVal >= balVal) {
                    $($("#" + adjId)).val(balVal);
                    $($("#" + adjId)).attr("value", balVal);
                }
                else {
                    $($("#" + adjId)).val(thisVal);
                    $($("#" + adjId)).attr("value", thisVal);
                }
            }
        }
    }
}

function SqlFillData() {
    if (isQuery == "true") {
        var jsonVal = "";
        try {
            $.ajax({
                url: 'tsttable.aspx/GetSqlFillData',
                type: 'POST',
                cache: false,
                async: true,
                data: JSON.stringify({
                    tstDId: callParentNew("tstDataId"), fldName: $("#hdnfieldId").val()
                }),
                dataType: 'json',
                contentType: "application/json",
                success: function (data) {
                    if (data.d != "") {
                        jsonVal = JSON.parse(data.d);
                        for (var l = 0; l < jsonVal.length; l++) {
                            var varData = jsonVal[l];
                            for (var keyData in varData) {
                                for (var key in varData[keyData]) {
                                    let KeyName = key;

                                    var obj = $($("#" + KeyName + "R" + l));
                                    if (obj.length == 0) {
                                        AddTableRows('fldTable');
                                        obj = $($("#" + KeyName + "R" + l));
                                    }
                                    let KeyValue = varData[keyData][key];
                                    let type = $(obj).attr("type");
                                    if (type == "text") {
                                        $(obj).val(KeyValue);
                                        $(obj).attr("value", KeyValue);
                                    }
                                    else {
                                        let ddlValue = KeyValue;
                                        $(obj).attr("selected", "selected");
                                        $(obj).attr("value", ddlValue);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        jsonVal = "";
                    }
                },
                error: function (error) {
                    jsonVal = "";
                }
            });
        }
        catch (ex) { }
    }
    else if (isQuery == "sqlDescr" && QueryData != "") {
        jsonVal = JSON.parse(QueryData);
        for (var l = 0; l < jsonVal.length; l++) {
            var varData = jsonVal[l];
            for (var keyData in varData) {
                for (var key in varData[keyData]) {
                    let KeyName = key;

                    var obj = $($("#" + KeyName + "R" + l));
                    if (obj.length == 0) {
                        AddTableRows('fldTable');
                        obj = $($("#" + KeyName + "R" + l));
                    }
                    let KeyValue = varData[keyData][key];
                    let type = $(obj).attr("type");
                    if (type == "text") {
                        $(obj).val(KeyValue);
                        $(obj).attr("value", KeyValue);
                    }
                    else {
                        let ddlValue = KeyValue;
                        if (obj.hasClass("tblFromSelect")) {
                            ddlValue = ddlValue == null ? "" : ddlValue;
                            $(obj).append('<option value="' + ddlValue + '" selected="selected">' + ddlValue + '</option>');
                            $(obj).attr("value", ddlValue);
                        }
                        else {
                            $(obj).attr("selected", "selected");
                            $(obj).attr("value", ddlValue);
                        }
                    }
                }
            }
        }
    }
}

function GetstrTableJson(descrName) {
    var jsonVal = "";
    try {
        $.ajax({
            url: 'tsttable.aspx/GetstrTableJson',
            type: 'POST',
            cache: false,
            async: false,
            data: JSON.stringify({
                descrName: descrName, tstDId: callParentNew("tstDataId"), fldName: $("#hdnfieldId").val()
            }),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                if (data.d != "") {
                    let fullData = data.d;
                    QueryData = fullData.split('♥')[1];
                    fullData = fullData.split('♥')[0];
                    if (fullData != "")
                        jsonVal = fullData;
                }
                else {
                    jsonVal = "";
                }
            },
            error: function (error) {
                jsonVal = "";
            }
        });
    }
    catch (ex) { }
    return jsonVal;
}

function GetAutoCompData(fldNameAc, value, curPageNo, AutPageSize) {
    var includeDcs = "";
    if (arrRefreshDcs.length > 0) {
        for (var i = 0; i < arrRefreshDcs.length; i++) {
            var arrDcNos = arrRefreshDcs[i].split(':');
            includeDcs = arrDcNos[1].replace("dc", "") + ',' + arrDcNos[0].replace("dc", "");
        }
    }
    value = CheckSpecialCharsInStr(value);
    var fldDcNo = callParentNew("GetFieldsDcNo(" + fldNameAc + ")", "function");

    AxActiveRowNo = parseInt(callParentNew("GetFieldsRowNo(" + fldNameAc + ")", "function"), 10);
    AxActiveRowNo = callParentNew("GetDbRowNo(" + AxActiveRowNo + "," + fldDcNo + ")", "function");
    var activeRow = AxActiveRowNo;

    var parStr = "";
    if (AxActivePRow != "" && AxActivePDc != "")
        parStr = AxActivePDc + "♠" + AxActivePRow;

    var subStr = "";
    return curPageNo.toString() + "~" + AutPageSize.toString() + "~" + fldDcNo + "~" + activeRow + "~" + parStr + "~" + subStr + "~" + includeDcs;
}

function GetDBProcTableJson(procName) {
    var jsonVal = "";
    try {
        let _fldName = $("#hdnfieldId").val().substring(0, $("#hdnfieldId").val().lastIndexOf("F") - 3);
        let _fldRowNo = callParentNew("GetFieldsRowNo(" + $("#hdnfieldId").val() + ")", "function");
        let _dsfDc = callParentNew("GetDcNo(" + _fldName + ")", "function");
        let _fldCltRowNo = callParentNew("GetDbRowNo(" + _fldRowNo + "," + _dsfDc + ")", "function");
        $.ajax({
            url: 'tsttable.aspx/GetDBProcTableJson',
            type: 'POST',
            cache: false,
            async: false,
            data: JSON.stringify({
                procName: procName, tstDId: callParentNew("tstDataId"), fldName: $("#hdnfieldId").val(), ChangedFields: parent.ChangedFields, ChangedFieldDbRowNo: parent.ChangedFieldDbRowNo, ChangedFieldValues: parent.ChangedFieldValues, DeletedDCRows: parent.DeletedDCRows, tfldDc: _dsfDc, tfldRowNo: _fldCltRowNo
            }),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                if (data.d != "") {
                    let fullData = data.d;
                    QueryData = fullData.split('♥')[1];
                    fullData = fullData.split('♥')[0];
                    if (fullData != "")
                        jsonVal = fullData;
                }
                else {
                    jsonVal = "";
                }
            },
            error: function (error) {
                jsonVal = "";
            }
        });
    }
    catch (ex) { }
    return jsonVal;
}

function GetSourceParamValue(_thisFld) {
    var _thisFinalVal = "";
    let _thisRowNo = typeof _thisFld.parents("tr").attr("id") == "undefined" ? "0" : _thisFld.parents("tr").attr("id");
    let _thisName = _thisFld.attr("name");
    $(colNames).each(function (iIndex, sElement) {
        if (colSource[iIndex] != "" && _thisName != sElement) {
            let _thisEleName = sElement + "R" + _thisRowNo;
            if ($("#" + _thisEleName).is("select") && typeof $("#" + _thisEleName).attr("value") != "undefined" && $("#" + _thisEleName).attr("value") != "")
                _thisFinalVal += _thisFinalVal == "" ? colSource[iIndex] + ":" + $("#" + _thisEleName).attr("value") : "♠" + colSource[iIndex] + ":" + $("#" + _thisEleName).attr("value");
            else if ($("#" + _thisEleName).is("input") && $("#" + _thisEleName).attr("type") == "text" && $("#" + _thisEleName).attr("value") != "")
                _thisFinalVal += _thisFinalVal == "" ? colSource[iIndex] + ":" + $("#" + _thisEleName).attr("value") : "♠" + colSource[iIndex] + ":" + $("#" + _thisEleName).attr("value");
        }
    });
    return _thisFinalVal;
}
