var dtAssoc = [];
var searchResult = [];
var AutPageNo = 1, AutPageSize = 50, rcount = 0, fetchRCount = FetchPickListRows || 1000; PageCount = 0;
var CangefldName = '', isNavigation = false, refreshAC = false, pickarrow = false;
var isAutocomBlur = true;
var isSelectedValFocus = false;
var isRefreshClick = false;

function createFormSelect(fld) {
    const formSelect = $(fld);
    var fldNameAc = "",
        fieldName = "",
        fastdll = "",
        termVal = "",
        depFldName = "";
    var isPickMinChar = false;
    var isOnCLose = false;
    var parentFldVal = "";
    var IsBindData = false;
    var isFillFromApi = false;
    formSelect.select2({
        ajax: {
            url: 'tstruct.aspx/GetAutoCompleteData',
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            delay: 250,
            data: function (params) {

                if (select2IsOpened && (typeof params.term == "undefined" || params.term == "")) {
                    if (isAddRowWsCalled == "true") {
                        isAddRowWsCalled = $(this).attr("id");
                        select2EventType = "tab";
                        select2IsFocused = true;
                        $(this).select2('close');
                        return;
                    } else
                        termVal = "";
                }
                else if (select2IsFocused) {
                    let _listOpened = false;
                    if (select2EventType == "open")
                        _listOpened = true;
                    if (recordid == "0") {
                        select2EventType = "open";
                        select2IsOpened = false;
                    }
                    else
                        select2IsOpened = true;
                    termVal = params.term == "" ? undefined : (isSelectedValFocus ? undefined : params.term);
                    if (typeof termVal == "undefined" && $(this).val() != null && isAddRowWsCalled == "false")
                        termVal = "";
                    else if (typeof termVal == "undefined" && $(this).val() == null && isAddRowWsCalled == "false" && _listOpened) {
                        _listOpened = false;
                        termVal = "";
                    }
                }
                else if (typeof params.term != "undefined" && params.term != "") {
                    termVal = params.term;
                }


                fastdll = $(this).hasClass('multiFldChk') ? true : $(this).hasClass('fastdll');
                if (fastdll == true || (fastdll == false && termVal == "") || (fastdll == false && (typeof termVal == "undefined" || termVal.length > 1))) {
                    isPickMinChar = false;
                    var isrefreshsave = $(this).hasClass('isrefreshsave');
                    var pageData = GetAutoCompData(fldNameAc, termVal, AutPageNo, AutPageSize);
                    var fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                    parentFldVal = "";
                    if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
                        parentFldVal = ISBoundAutoCom(fieldName, fldNameAc);
                    else
                        parentFldVal = ISBoundNew(fieldName, fldNameAc);
                    let fldApiInd = GetFieldIndex(fieldName);
                    let isApifld = FldIsAPI[fldApiInd];

                    let _cacheTrue = true;
                    if (PrevGridEditedRow != "" && IsGridField(fieldName)) {
                        let _prevRowNow = PrevGridEditedRow.substring(PrevGridEditedRow.lastIndexOf("F"), PrevGridEditedRow.lastIndexOf("F") - 3);
                        let _thisFldrow = fldNameAc.substring(fldNameAc.lastIndexOf("F"), fldNameAc.lastIndexOf("F") - 3);
                        if (_thisFldrow != _prevRowNow)
                            _cacheTrue = false;
                    }

                    if (FldListParents.length > 0 && FldListParents.indexOf(fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 && termVal == "" && !isRefreshClick && !$(this).hasClass('multiFldChk') && _cacheTrue && isApifld != "true") {//&& $(this).val() != null
                        //let _thisIdx = FldListParents.indexOf(fieldName + "~" + parentFldVal);
                        IsBindData = true;
                    } else {
                        IsBindData = false;
                        isRefreshClick = false;
                        /* PrevGridEditedRow = "";*/
                        return JSON.stringify({
                            tstDataId: tstDataId,
                            FldName: fieldName,
                            FltValue: termVal,
                            ChangedFields: ChangedFields,
                            ChangedFieldDbRowNo: ChangedFieldDbRowNo,
                            ChangedFieldValues: ChangedFieldValues,
                            DeletedDCRows: DeletedDCRows,
                            pageData: pageData,
                            fastdll: fastdll,
                            fldNameAc: fldNameAc,
                            refreshAC: refreshAC,
                            pickArrow: pickarrow,
                            parentsFlds: parentFldVal,
                            rfSave: isrefreshsave,
                            IsApiFld: isApifld,
                            tblSourceParams: "",
                            isTstHtmlLs: resTstHtmlLS
                        });
                    }
                } else {
                    IsBindData = false;
                    rcount = 0;
                    isPickMinChar = true;

                    let _fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                    if (FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 || FldListParents.some(item => item.startsWith(_fieldName + "♦"))) {
                        let _tIdn = FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 ? FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) : FldListParents.findIndex((account) => { return account.startsWith(_fieldName + "♦"); }, _fieldName + "♦");
                        FldListParents.splice(_tIdn, 1);
                        FldListData.splice(_tIdn, 1);
                    }
                }
            },
            processResults: function (data) {
                IsBindData = false;
                select2EventType = "open";
                refreshAC = false;
                const arabic = /[\u0600-\u06FF]/;
                try {
                    var result = data.d.toString().replace(new RegExp("\\n", "g"), "");
                    if (result != "") {
                        if (result != "" && result.split("♣*♣").length > 1) {
                            tstDataId = result.split("♣*♣")[0];
                            result = result.split("♣*♣")[1];
                        }
                        if (result.split("*♠*").length > 1) {
                            serverprocesstime = result.split("*♠*")[1];
                            requestProcess_logtime = result.split("*♠*")[2];
                            result = result.split("*♠*")[0];
                            WireElapsTime(serverprocesstime, requestProcess_logtime, true);
                        } else {
                            UpdateExceptionMessageInET("Error : " + result);
                        }
                    }
                    if (CheckSessionTimeout(result))
                        return;
                    result = result.toString().replace(new RegExp("\\t", "g"), "&#9;");
                    resTstHtmlLS = "";
                    ChangedFields = new Array();
                    ChangedFieldDbRowNo = new Array();
                    ChangedFieldValues = new Array();
                    DeletedDCRows = new Array();
                    if (!(result.toLowerCase().includes("access violation") && result.toLowerCase().includes("asbtstruct.dll"))) {
                        PrevGridEditedRow = "";
                        var serResult = $.parseJSON(result);
                        datasss = serResult;
                        if (serResult.error) {
                            ExecErrorMsg(serResult.error, "autocomplete");
                            return;
                        }
                        var rcountNew = 0;
                        try {
                            isFillFromApi = false;
                            if (typeof serResult.pickdata == "undefined" && typeof serResult.result != "undefined") {
                                isFillFromApi = true;
                                rcountNew = serResult.result[2].data.length
                                depFldName = serResult.result[1].dfname;
                            } else {
                                rcountNew = serResult.pickdata[0].rcount;
                                depFldName = serResult.pickdata[2].dfname;
                            }
                        } catch (ex) {
                            rcountNew = serResult.pickdata[0].rcount;
                            depFldName = serResult.pickdata[2].dfname;
                        }
                        // AutoFillFlds[fieldName] = depFldName;
                        if (rcountNew != 0)
                            rcount = parseInt(rcountNew);
                        rcount = rcount < fetchRCount ? rcount : fetchRCount;
                        PageCount = Math.ceil(rcount / AutPageSize);
                        PageCount == 0 ? PageCount = 1 : "";
                        countPerPage = rcount;
                        if (AutPageNo == 1) {
                            if (PageCount == 1) {
                                $("#autoleft" + fldNameAc).prop("disabled", true).addClass("disabled");
                                $("#autoright" + fldNameAc).prop("disabled", true).addClass("disabled");
                            } else {
                                // $("#autoleft" + fldNameAc).prop("disabled", true).addClass("disabled");
                                $("#autoright" + fldNameAc).prop("disabled", false).removeClass("disabled");
                            }
                        }
                        else if (AutPageNo > 1 && PageCount <= AutPageNo)
                            $("#autoright" + fldNameAc).prop("disabled", true).addClass("disabled");
                        try {
                            if (typeof serResult.pickdata == "undefined" && typeof serResult.result != "undefined")
                                dtAssoc = serResult.result[2].data
                            else
                                dtAssoc = serResult.pickdata[3].data;
                        } catch (ex) {
                            dtAssoc = serResult.pickdata[3].data;
                        }
                        if (dtAssoc != undefined && dtAssoc.length != 0) {
                            if (!$("#" + fldNameAc).hasClass('multiFldChk')) {
                                if (termVal == "") {
                                    let _fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                                    if (FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 || FldListParents.some(item => item.startsWith(_fieldName + "♦"))) {
                                        let _tIdn = FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 ? FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) : FldListParents.findIndex((account) => { return account.startsWith(_fieldName + "♦"); }, _fieldName + "♦");
                                        FldListParents[_tIdn] = _fieldName + "♦" + fldNameAc + "♦" + parentFldVal;
                                        FldListData[_tIdn] = serResult;
                                    } else {
                                        FldListParents.push(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal);
                                        FldListData.push(serResult);
                                    }
                                } else {
                                    let _fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                                    if (FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 || FldListParents.some(item => item.startsWith(_fieldName + "♦"))) {
                                        let _tIdn = FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 ? FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) : FldListParents.findIndex((account) => { return account.startsWith(_fieldName + "♦"); }, _fieldName + "♦");
                                        FldListParents.splice(_tIdn, 1);
                                        FldListData.splice(_tIdn, 1);
                                    }
                                }
                            }

                            if ($(this.$element).hasClass('multiFldChk'))
                                $(".msSelectAllOption").removeClass("d-none");
                            if (fastdll) {
                                var aSearch = [];
                                $(dtAssoc).each(function (iIndex, sElement) {
                                    sElement.i = sElement.i.replace(/\^\^dq/g, '&quot;');
                                    if (typeof DropdownSStartsWith != "undefined" && DropdownSStartsWith != "" && DropdownSStartsWith == "starts with") {
                                        if (arabic.test(sElement.i.toLowerCase()) && sElement.i.toLowerCase().endsWith(termVal.toLowerCase()))
                                            aSearch.push(sElement);
                                        else if (sElement.i.toLowerCase().startsWith(termVal.toLowerCase())) {
                                            aSearch.push(sElement);
                                        }
                                    } else {
                                        if (sElement.i.toLowerCase().indexOf(termVal.toLowerCase()) >= 0) {
                                            aSearch.push(sElement);
                                        }
                                    }
                                });
                                $("#" + fldNameAc).data("rowcount", aSearch.length);
                                if (aSearch.length != 0) {
                                    var result = ($.map(aSearch, function (item) {
                                        item.i = item.i.replace(/\^\^dq/g, '&quot;');
                                        return {
                                            //id: item.v == "" ? item.i : item.v,
                                            id: item.i,
                                            text: item.i,
                                            dep: item.d
                                        }
                                    }))
                                    if (AxRulesDefFilter == "true")
                                        result = AxFilterDropDownResult(fldNameAc, result);
                                    searchResult = result;
                                    return {
                                        results: result
                                    };
                                } else {
                                    if ($(this.$element).hasClass('multiFldChk'))
                                        $(".msSelectAllOption").addClass("d-none");
                                    else {
                                        let _fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                                        if (FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 || FldListParents.some(item => item.startsWith(_fieldName + "♦"))) {
                                            let _tIdn = FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 ? FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) : FldListParents.findIndex((account) => { return account.startsWith(_fieldName + "♦"); }, _fieldName + "♦");
                                            FldListParents.splice(_tIdn, 1);
                                            FldListData.splice(_tIdn, 1);
                                        }
                                    }
                                    var cutMsg = eval(callParent('lcm[0]'));
                                    return { results: "", noResults: cutMsg };
                                }
                            } else {
                                var result = ($.map(dtAssoc, function (item) {
                                    if (termVal != "") {
                                        if (typeof DropdownSStartsWith != "undefined" && DropdownSStartsWith != "" && DropdownSStartsWith == "starts with") {
                                            if (arabic.test(item.i.toLowerCase()) && item.i.toLowerCase().endsWith(termVal.toLowerCase())) {
                                                item.i = item.i.replace(/\^\^dq/g, '&quot;');
                                                return {
                                                    //id: item.v == "" ? item.i : item.v,
                                                    id: item.i,
                                                    text: item.i,
                                                    dep: item.d
                                                }
                                            }
                                            else if (item.i.toLowerCase().startsWith(termVal.toLowerCase())) {
                                                item.i = item.i.replace(/\^\^dq/g, '&quot;');
                                                return {
                                                    //id: item.v == "" ? item.i : item.v,
                                                    id: item.i,
                                                    text: item.i,
                                                    dep: item.d
                                                }
                                            }
                                        } else {
                                            if (termVal.indexOf('%') > -1) {
                                                let _thisTrue = false;
                                                let _termVal = termVal.split('%');
                                                $.each(_termVal, function (_index, _value) {
                                                    let _thistermVal = _value.split('_');
                                                    $.each(_thistermVal, function (_ind, _val) {
                                                        if (item.i.toLowerCase().indexOf(_val.toLowerCase()) >= 0) {
                                                            _thisTrue = true;
                                                        }
                                                    });
                                                });

                                                if (_thisTrue) {
                                                    item.i = item.i.replace(/\^\^dq/g, '&quot;');
                                                    return {
                                                        //id: item.v == "" ? item.i : item.v,
                                                        id: item.i,
                                                        text: item.i,
                                                        dep: item.d
                                                    }
                                                }
                                            } else {
                                                if (item.i.toLowerCase().indexOf(termVal.toLowerCase()) >= 0) {
                                                    item.i = item.i.replace(/\^\^dq/g, '&quot;');
                                                    return {
                                                        //id: item.v == "" ? item.i : item.v,
                                                        id: item.i,
                                                        text: item.i,
                                                        dep: item.d
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        item.i = item.i.replace(/\^\^dq/g, '&quot;');
                                        return {
                                            //id: item.v == "" ? item.i : item.v,
                                            id: item.i,
                                            text: item.i,
                                            dep: item.d
                                        }
                                    }
                                }));
                                if (AxRulesDefFilter == "true")
                                    result = AxFilterDropDownResult(fldNameAc, result);
                                searchResult = result;
                                return {
                                    results: result
                                };
                            }
                        } else {
                            if ($(this.$element).hasClass('multiFldChk'))
                                $(".msSelectAllOption").addClass("d-none");
                            else {
                                let _fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                                if (FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 || FldListParents.some(item => item.startsWith(_fieldName + "♦"))) {
                                    let _tIdn = FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 ? FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) : FldListParents.findIndex((account) => { return account.startsWith(_fieldName + "♦"); }, _fieldName + "♦");
                                    FldListParents.splice(_tIdn, 1);
                                    FldListData.splice(_tIdn, 1);
                                }
                            }
                            var cutMsg = eval(callParent('lcm[0]'));
                            return { results: "", noResults: cutMsg };
                        }
                    } else {
                        AxWaitCursor(false);
                        ShowDimmer(false);
                        $("#reloaddiv").show();
                        $("#dvlayout").hide();
                    }
                } catch (exception) {
                    if (exception.message.toLowerCase().indexOf("access violation") != -1) {
                        AxWaitCursor(false);
                        ShowDimmer(false);
                        $("#reloaddiv").show();
                        $("#dvlayout").hide();
                    }
                }
            },
            error: function (data) {
                if (IsBindData) {
                    let _fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                    if (FldListParents.length > 0 && FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1) {
                        var _thisIdx = FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal);
                        depFldName = FldListData[_thisIdx].pickdata[2].dfname;
                        var _ArrData = FldListData[_thisIdx].pickdata[3].data;
                        var result = ($.map(_ArrData, function (item) {
                            item.i = item.i.replace(/\^\^dq/g, '&quot;');
                            return {
                                id: item.i,
                                text: item.i,
                                dep: item.d
                            }
                        }))
                        $(".select2-results__options li:eq(0)").remove();
                        //$("#" + fldNameAc).trigger("change")
                        //$("#" + fldNameAc).select2('data', result).trigger("change");

                        //$("#" + fldNameAc).select2("updateResults");
                        console.clear();
                        $("#" + fldNameAc).select2("data", result, true);//.trigger("change");
                        $("#" + fldNameAc).select2("updateResults");
                    }
                }
            }
        },
        placeholder: 'Search for a repository',
        minimumInputLength: 0,
        escapeMarkup: function (markup) {
            return markup;
        },
        language: {
            errorLoading: function () {
                if (isPickMinChar)
                    return 'Required to search minimum 2 characters';
                else
                    return 'Start type characters for searching data..';
            }
        }
    }).on('select2:select', function (event) {
        let depList = event.params.data.dep;
        let fldAcValue = $(this).val();
        if (typeof $(this).data("separator") != "undefined" && $(this).hasClass("multiFldChk")) {
            let separator = $(this).data("separator");
            fldAcValue = fldAcValue.join(separator);
        }
        refreshAC = false;
        isGrdEditDirty = true;
        dtAssoc = [];
        var cutMsg = eval(callParent('lcm[0]'));

        var fName = GetFieldsName(fldNameAc);
        var fldIndex = $j.inArray(fName, FNames);

        if (fldIndex == -1)
            return;
        if (typeof $("#" + fldNameAc).attr('disabled') != "undefined")
            return;
        if (FFieldReadOnly[fldIndex] == "True")
            return;
        if (FFieldHidden[fldIndex] == "True")
            return;

        var rcID = GetFieldsRowFrameNo(fldNameAc);
        var acFrNo = GetFieldsDcNo(fldNameAc);
        var rowNum = GetDbRowNo(GetFieldsRowNo(fldNameAc), acFrNo);
        var fldRowNo = GetFieldsRowNo(fldNameAc);
        if (IsDcGrid(acFrNo) && isGrdEditDirty)
            UpdateFieldArray(axpIsRowValid + acFrNo + fldRowNo + "F" + acFrNo, GetDbRowNo(fldRowNo, acFrNo), "", "parent", "AddRow");
        UpdateFieldArray(fldNameAc, rowNum, fldAcValue, "parent", "AutoComplete");
        UpdateAllFieldValues(fldNameAc, fldAcValue);
        if (isFillFromApi) {
            if (depList != undefined && depList != null && depList != cutMsg && depFldName != "") {
                try {
                    var depText = depList.split('^');
                    var dfCount = 0;
                    $.each(depText, function (index, value) {
                        var depfldId = depFldName.split('^')[dfCount];
                        let _thisfInd = GetFieldIndex(depfldId);
                        dfCount++;
                        if (_thisfInd > -1) {
                            let _ffapi = FldFillFromAPI[_thisfInd];
                            if (_ffapi != "" && _ffapi == fName) {
                                var depfldValue = value;                               
                                rcID = rcID.substring(0, rcID.lastIndexOf('F') + 1) + GetDcNo(depfldId);
                                if (depfldValue != "")
                                    depfldValue = depfldValue.replace(new RegExp("<br>", "g"), "\n");
                                $("#" + depfldId + rcID).val(depfldValue);
                                let _thisfldType = $("#" + depfldId + rcID).data("type") || $("#" + depfldId + rcID).prop("type");
                                if (typeof _thisfldType != "undefined" && _thisfldType == "checkbox" && $("#" + depfldId + rcID).hasClass("custInpChk")) {
                                    if (depfldValue == "")
                                        $("#" + depfldId + rcID).prop("checked", false);
                                    else if (depfldValue != "" && depfldValue.toLowerCase() == "f")
                                        $("#" + depfldId + rcID).prop("checked", false);
                                    else if (depfldValue != "" && depfldValue.toLowerCase() == "t")
                                        $("#" + depfldId + rcID).prop("checked", true);
                                }
                                var _fldIndex = $j.inArray(depfldId, FNames);
                                var fldType = GetFieldType(depfldId, _fldIndex);
                                if (fldType == "Numeric")
                                    $("#" + depfldId + rcID).data("attr", depfldValue);
                                if (depfldValue != undefined) {
                                    UpdateFieldArray(depfldId + rcID, rowNum, depfldValue, "parent", "AutoComplete");
                                    UpdateAllFieldValues(depfldId + rcID, depfldValue);
                                }
                            }
                        }
                    });
                } catch (Ex) { }
            }
        } else {
            if (depList != undefined && depList != null && depList != cutMsg && depFldName != "") {//Alogn with othe cindtion should check depFldName variable also should not be empty
                try {
                    //dep = uhid^patient_details^attending_physician~76222000000431^wardtype~Single Room
                    var depText = depList.split('^');
                    var dfCount = 0;
                    $.each(depText, function (index, value) {
                        var depfldId = depFldName.split('^')[dfCount];
                        var depfldValue = value;
                        dfCount++;
                        rcID = rcID.substring(0, rcID.lastIndexOf('F') + 1) + GetDcNo(depfldId);
                        if (depfldValue != "")
                            depfldValue = depfldValue.replace(new RegExp("<br>", "g"), "\n");
                        $("#" + depfldId + rcID).val(depfldValue);
                        let _thisfldType = $("#" + depfldId + rcID).data("type") || $("#" + depfldId + rcID).prop("type");
                        if (typeof _thisfldType != "undefined" && _thisfldType == "checkbox" && $("#" + depfldId + rcID).hasClass("custInpChk")) {
                            if (depfldValue == "")
                                $("#" + depfldId + rcID).prop("checked", false);
                            else if (depfldValue != "" && depfldValue.toLowerCase() == "f")
                                $("#" + depfldId + rcID).prop("checked", false);
                            else if (depfldValue != "" && depfldValue.toLowerCase() == "t")
                                $("#" + depfldId + rcID).prop("checked", true);
                        }
                        var _fldIndex = $j.inArray(depfldId, FNames);
                        var fldType = GetFieldType(depfldId, _fldIndex);
                        if (fldType == "Numeric")
                            $("#" + depfldId + rcID).data("attr", depfldValue);
                        if (depfldValue != undefined) {
                            UpdateFieldArray(depfldId + rcID, rowNum, depfldValue, "parent", "AutoComplete");
                            UpdateAllFieldValues(depfldId + rcID, depfldValue);
                        }
                    });
                } catch (Ex) { }
            }
        }
        checkNextSelExpFld(fName, fldIndex);
        AxFocusedFld = "";
        setTimeout(function () {
            AxOldValue = "";
            MainBlur($j("#" + fldNameAc));
        }, 0);
    }).on("select2:unselect", function (e) {
        let fldNamesf = $(this).attr("id");
        let fldAcValue = $(this).val();
        if (typeof $(this).data("separator") != "undefined" && $(this).hasClass("multiFldChk")) {
            let separator = $(this).data("separator");
            fldAcValue = fldAcValue.join(separator);
            var rcID = GetFieldsRowFrameNo(fldNamesf);
            var acFrNo = GetFieldsDcNo(fldNamesf);
            var rowNum = GetDbRowNo(GetFieldsRowNo(fldNamesf), acFrNo);
            UpdateFieldArray(fldNamesf, rowNum, fldAcValue, "parent", "AutoComplete");
            UpdateAllFieldValues(fldNamesf, fldAcValue);
        }
        if (fldAcValue == "")
            AxOldValue = " ";
        else if (!$(this).hasClass("multiFldChk"))
            AxOldValue = fldAcValue;
        AxFocusedFld = "";
        MainBlur($j("#" + fldNamesf));
    }).on('select2:open', function (e) {

        const evt = "scroll.select2";
        $(e.target).parents().off(evt);
        $(window).off(evt);

        AxFldBlurFromSelect = "";
        isPickMinChar = false;
        if (select2IsFocused) {
            if (recordid != "0" && select2EventType != "click" && !$(this).hasClass('multiFldChk')) {
                select2EventType = "tab";
                select2IsFocused = true;
                $(this).select2('close');
                return;
            } else {
                select2EventType = "tab";
                if ($(this).val() != "" && $(this).val() != null) {
                    //$("input.select2-search__field").val($(this).val());
                    if (!$(this).hasClass('multiFldChk')) {
                        isSelectedValFocus = false;
                        select2IsFocused = true;
                        select2IsOpened = false;
                    } else {
                        $("input.select2-search__field").val($(this).val());
                        select2IsOpened = true;
                        isSelectedValFocus = true;
                    }
                } else if (!isOnCLose && !$(this).hasClass('multiFldChk')) {
                    select2IsOpened = true;
                    select2EventType = "click";
                } else if (isOnCLose && $(this).val() == null && !$(this).hasClass('multiFldChk'))
                    select2IsFocused = true;
                else if (isOnCLose && $(this).val() != "" && $(this).val() != null && !$(this).hasClass('multiFldChk'))
                    select2IsFocused = false;

                if ($(this).attr("id") != AxFocusedFld && AxFocusedFld != "" && AxFldBlured != AxFocusedFld && !$("#" + AxFocusedFld).hasClass("fldFromSelect") && !$("#" + AxFocusedFld).hasClass("multiFldChk") && !$("#" + AxFocusedFld).hasClass("gridHeaderSwitch") && !$("#" + AxFocusedFld).hasClass("dvgrdchkboxnonedit") && !$("#" + AxFocusedFld).hasClass("ckbGridStretchSwitch"))// Changed text field and directlly click on select2 field using mouse changed field not getting call mainblur.
                {
                    MainBlur($("#" + AxFocusedFld));
                    AxOldValue = "";
                    MainFocus($j(this));
                    AxFldBlurFromSelect = "♠♠";
                }
                else if (gridRowEditOnLoad && IsGridField(GetFieldsName($(this).attr("id")))) {
                    UpdateGridRowFlags($(this).attr("id"), GetFieldsDcNo($(this).attr("id")), "001");
                }

                isOnCLose = false;
            }
        }
        else {
            if ($(this).attr("id") != AxFocusedFld && AxFocusedFld != "" && AxFldBlured != AxFocusedFld && !$("#" + AxFocusedFld).hasClass("fldFromSelect") && !$("#" + AxFocusedFld).hasClass("multiFldChk") && !$("#" + AxFocusedFld).hasClass("gridHeaderSwitch") && !$("#" + AxFocusedFld).hasClass("dvgrdchkboxnonedit") && !$("#" + AxFocusedFld).hasClass("ckbGridStretchSwitch"))// Changed text field and directlly click on select2 field using mouse changed field not getting call mainblur.
            {
                MainBlur($("#" + AxFocusedFld));
                AxOldValue = "";
                MainFocus($j(this));
                AxFldBlurFromSelect = "♠♠";
            }
            else if (gridRowEditOnLoad && IsGridField(GetFieldsName($(this).attr("id")))) {
                UpdateGridRowFlags($(this).attr("id"), GetFieldsDcNo($(this).attr("id")), "001");
            }
            if (!isOnCLose) {
                if ($(this).val() != "" && $(this).val() != null && !$(this).hasClass('multiFldChk')) {
                    //$("input.select2-search__field").val($(this).val());
                    isSelectedValFocus = true;
                    select2IsFocused = true;
                } else {
                    $("input.select2-search__field").val($(this).val());
                    select2IsOpened = true;
                    select2EventType = "click";
                }
            } else if (isOnCLose && $(this).val() == null && !$(this).hasClass('multiFldChk'))
                select2IsFocused = true;
            else if (isOnCLose && $(this).val() != "" && $(this).val() != null && !$(this).hasClass('multiFldChk'))
                select2IsFocused = false;
            isOnCLose = false;
        }

        let addOption = typeof $(this).attr("data-addoption") == "undefined" ? "" : $(this).attr("data-addoption");
        let dataRefresh = typeof $(this).attr("data-refresh") == "undefined" ? "" : $(this).attr("data-refresh");
        let _thisId = $(this).attr("id");
        let isApiFld = "";
        try {
            let _thisfldInd = GetFieldIndex(GetFieldsName(_thisId));
            if (_thisfldInd > -1)
                isApiFld = FldIsAPI[_thisfldInd];
        } catch (ex) {
            isApiFld = "";
        }

        let iconBtn = "";
        if (!$(this).hasClass('multiFldChk')) {
            if (typeof dataRefresh != "undefined" && dataRefresh != "" && dataRefresh == "true") {
                iconBtn += '<a class="btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm ms-2 fsautorefresh" id="autorefresh' + _thisId + '" title="Refresh" data-refresh=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">refresh</span></a>';
            }
            else if (typeof dataRefresh != "undefined" && dataRefresh != "" && dataRefresh == "false") {
                iconBtn += '<a class="btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm ms-2 disabled" id="autoleft' + _thisId + '" title="Previous" data-fldname=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">navigate_before</span></a><a class="btn btn-sm btn-icon btn-white btn-color-gray-500 btn-active-primary me-2 shadow-sm disabled" id="autoright' + _thisId + '" title="Next" data-fldname=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">navigate_next</span></a>';
            }
            if (isApiFld == "")
                iconBtn += '<a class="btn btn-sm btn-icon btn-white btn-color-gray-500 btn-active-primary me-2 shadow-sm float-end" id="advSearch' + _thisId + '" title="adv. search" data-ids=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">search</span></a><input type=hidden id="pickIdVal_' + _thisId + '" value=\"\" />';

            iconBtn += '<a class="btn btn-sm btn-icon btn-white btn-color-gray-500 btn-active-primary me-2 shadow-sm float-end" id="copySelVal' + _thisId + '" title="Copy Selected Value" data-ids=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">copy</span></a>';
        } else {
            $(".select2-results a.fsautorefresh").remove();
            if (isApiFld == "")
                iconBtn += '<a class="btn btn-sm btn-icon btn-white btn-color-gray-500 btn-active-primary me-2 shadow-sm float-end" id="advSearch' + _thisId + '" title="adv. search" data-ids=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">search</span></a><input type=hidden id="pickIdVal_' + _thisId + '" value=\"\" />';
        }
        if (typeof addOption != "undefined" && addOption != "") {
            iconBtn += '<a class="btn btn-sm btn-icon btn-primary btn-color-gray-600--- btn-active-primary--- me-2 shadow-sm float-end" id="addOption' + _thisId + '" data-ids=' + _thisId + ' title="Add Master Data"><span class="material-icons material-icons-style material-icons-3">add</span></a>';
        }

        $(".select2-results:not(:has(a))").append(iconBtn);

        fldNameAc = $(this).attr("id");
        if ($(this).hasClass('multiFldChk')) {
            var curDropdown = $(this).data("select2")?.$dropdown;
            if (curDropdown.find(".select2-results").find(".msSelectAllOption").length == 0) {
                let selectAllHTML = `<div class="msSelectAllOption form-check form-check-custom align-self-end px-5 d-none">
                    <input type="checkbox" class="form-check-input msSelectAll" onchange="checkAllCheckBoxTokens(this, '${fldNameAc}')"/>
                    <label for="SelectAll" class="ps-2 form-check-label form-label col-form-label pb-1 fw-boldest">
                        Select All
                    </label>
                </div>`;
                curDropdown.find(".select2-results").append(selectAllHTML);
            }
            var selectedOptionCount = 0;
            curDropdown.find(".select2-results").find(".select2-results__options li:not(.select2-results__option--disabled.loading-results)").each((ind, elm) => {
                if ($(elm).hasClass("select2-results__option--selected")) {
                    selectedOptionCount++;
                }
            });

            if (curDropdown.find(".select2-results").find(".select2-results__options li:not(.select2-results__option--disabled.loading-results)").length == selectedOptionCount && selectedOptionCount > 0) {
                curDropdown.find(".select2-results").find(".msSelectAllOption > .msSelectAll").prop("checked", true);
            }
            else if (curDropdown.find(".select2-results").find(".select2-results__options li:not(.select2-results__option--disabled.loading-results)").length != selectedOptionCount && curDropdown.find(".select2-results").find(".msSelectAllOption > .msSelectAll").is(":checked")) {
                curDropdown.find(".select2-results").find(".msSelectAllOption > .msSelectAll").prop("checked", false);
            }
        }

        if (CangefldName != fldNameAc) {
            AutPageNo = 1;
            rcount = 0;
            CangefldName = fldNameAc;
        }
        if (!isNavigation)
            AutPageNo = 1;
        isNavigation = false;
        try {
            if ($("#" + fldNameAc).val() != null && $("#" + fldNameAc).val() != "") {
                let _thisTfName = GetFieldsName(fldNameAc);
                ShowTooltip(_thisTfName, $("#" + fldNameAc));
            }
        } catch (ex) { }
        clickEvents(_thisId);
    }).on("select2:close", function (e) {
        isOnCLose = false;
        isSelectedValFocus = false;
        select2IsFocused = true;
        select2EventType = "";
    }).on("select2:closing", function (e) {
        isOnCLose = true;
        select2EventType = "";
    }).on("select2:clear", function (e) {
        isOnCLose = true;
        select2EventType = "";
    });
}

function checkNextSelExpFld(_thisNSEfld, _fldInd) {
    try {
        if (typeof AxpFillDepEnabled != 'undefined' && AxpFillDepEnabled == 'true') {
            if (AxpFillDepFieldsClient != "") {
                let _AxpFillDepField = AxpFillDepFieldsClient.split(",");
                if (_AxpFillDepField.indexOf(_thisNSEfld) == -1) {
                    var _depArray;
                    var _depStr = "";
                    if (_fldInd != -1)
                        _depStr = FldDependents[_fldInd].toString();
                    if (_depStr != "")
                        _depArray = _depStr.split(",");
                    if (_depArray != undefined) {
                        for (var di = 0; di < _depArray.length; di++) {
                            var _dField = _depArray[di].toString();
                            var _depFirstChar = _dField.substring(0, 1);
                            var _depfName = _dField.substring(1);
                            var _dfldInd = GetFieldIndex(_depfName);

                            if (_dfldInd > -1 && _depFirstChar == "e" && FMoe[_dfldInd].toString().toLowerCase() == "select") {
                                AxpFillDepFieldsClient = "," + _thisNSEfld;
                                if (IsGridField(_depfName)) {
                                    if (AxFldExpOnAddRow != "")
                                        AxFldExpOnAddRow = "," + _depfName;
                                    else
                                        AxFldExpOnAddRow = _depfName;
                                }
                                break;
                            }
                        }
                    }
                }
            } else {
                var _depArray;
                var _depStr = "";
                if (_fldInd != -1)
                    _depStr = FldDependents[_fldInd].toString();
                if (_depStr != "")
                    _depArray = _depStr.split(",");
                if (_depArray != undefined) {
                    for (var di = 0; di < _depArray.length; di++) {
                        var _dField = _depArray[di].toString();
                        var _depFirstChar = _dField.substring(0, 1);
                        var _depfName = _dField.substring(1);
                        var _dfldInd = GetFieldIndex(_depfName);

                        if (_dfldInd > -1 && _depFirstChar == "e" && FMoe[_dfldInd].toString().toLowerCase() == "select") {
                            AxpFillDepFieldsClient = _thisNSEfld;
                            if (IsGridField(_depfName)) {
                                if (AxFldExpOnAddRow != "")
                                    AxFldExpOnAddRow = "," + _depfName;
                                else
                                    AxFldExpOnAddRow = _depfName;
                            }
                            break;
                        }
                    }
                }
            }
        }
    } catch (ex) { }
}

function clickEvents(fsFldName) {

    $(document).off("click", "#autorefresh" + fsFldName);
    $(document).on("click", "#autorefresh" + fsFldName, function (e) {
        refreshAC = true;
        AutPageNo = 1;
        rcount = 0;
        CangefldName = '';
        PageCount = 0;
        isSelectedValFocus = false;
        select2IsFocused = false;
        select2IsOpened = true;
        isRefreshClick = true;
        select2EventType = "click";
        if (typeof $(".select2-dropdown--below") != "undefined" && $(".select2-dropdown--below").length > 0)
            $(".select2-dropdown--below").find('.select2-search__field').trigger($.Event('input', { which: 13 }));
        else {
            $("#" + $(e.currentTarget).data('refresh')).select2('close');
            $("#" + $(e.currentTarget).data('refresh')).select2('open');
        }
    });

    $(document).off("click", "#autoleft" + fsFldName);
    $(document).on("click", "#autoleft" + fsFldName, function (e) {
        isNavigation = true;
        pickarrow = true;
        AutPageNo--;
        isSelectedValFocus = false;
        $("#autoright" + fsFldName).prop("disabled", false).removeClass("disabled");
        if (AutPageNo == 1) {
            $("#autoleft" + fsFldName).prop("disabled", true).addClass("disabled");
        }
        select2IsFocused = false;
        select2IsOpened = true;
        isRefreshClick = true;
        select2EventType = "click";
        //$(".select2-dropdown--below").find('.select2-search__field').trigger($.Event('input', { which: 13 }));
        if (typeof $(".select2-dropdown--below") != "undefined" && $(".select2-dropdown--below").length > 0)
            $(".select2-dropdown--below").find('.select2-search__field').trigger($.Event('input', { which: 13 }));
        else {
            $("#" + $(e.currentTarget).data('refresh')).select2('close');
            $("#" + $(e.currentTarget).data('refresh')).select2('open');
        }
    });

    $(document).off("click", "#autoright" + fsFldName);
    $(document).on("click", "#autoright" + fsFldName, function (e) {
        isNavigation = true;
        pickarrow = true;
        AutPageNo++;
        isSelectedValFocus = false;

        $("#autoleft" + fsFldName).prop("disabled", false).removeClass("disabled");
        if (PageCount <= AutPageNo) {
            $("#autoright" + fsFldName).prop("disabled", true).addClass("disabled");
        }
        select2IsFocused = false;
        select2IsOpened = true;
        isRefreshClick = true;
        select2EventType = "click";
        //$(".select2-dropdown--below").find('.select2-search__field').trigger($.Event('input', { which: 13 }));
        if (typeof $(".select2-dropdown--below") != "undefined" && $(".select2-dropdown--below").length > 0)
            $(".select2-dropdown--below").find('.select2-search__field').trigger($.Event('input', { which: 13 }));
        else {
            $("#" + $(e.currentTarget).data('refresh')).select2('close');
            $("#" + $(e.currentTarget).data('refresh')).select2('open');
        }
    });

    $(document).off("click", "#advSearch" + fsFldName);
    $(document).on("click", "#advSearch" + fsFldName, function () {
        $("#" + $(this).data("ids")).select2("close");
        isSelectedValFocus = false;
        SearchOpenNew($(this).data("ids"));
    });

    $(document).off("click", "#addOption" + fsFldName);
    $(document).on("click", "#addOption" + fsFldName, function () {
        $("#" + $(this).data("ids")).select2("close");
        let mstFldId = $(this).data("ids");
        let mstFldDetails = $("#" + mstFldId).data("addoption");
        var fieldName = mstFldId.substring(0, mstFldId.lastIndexOf("F") - 3);
        let na = `tstruct.aspx?transid=` + mstFldDetails.split('~')[0] + `&AxPop=true&AxRefSelect=true&AxRefSelectID=` + fieldName + `&AxSrcSelectID=` + mstFldDetails.split('~')[1] + `&AxRefType=` + mstFldDetails.split('~')[2];
        isSelectedValFocus = false;
        let myModal = new BSModal("modalIdNewItem", "", "<iframe class='col-12 h-100' src='" + na + "'></iframe>", () => {
            //shown callback
        }, () => {
            //hide callback
        });
        myModal.changeSize("fullscreen");
        myModal.hideFooter();
        myModal.hideHeader();
        myModal.showFloatingClose();
    });

    $(document).off("keydown", "input.select2-search__field");
    $(document).on("keydown", "input.select2-search__field", function (event) {
        if (isSelectedValFocus) {
            isSelectedValFocus = false;
        }
        if (event.originalEvent.keyCode == "9") {
            let _fldTarget = $(event.currentTarget).attr('aria-controls');
            if (typeof _fldTarget != "undefined") {
                _fldTarget = _fldTarget.replace("select2-", "").replace("-results", "");
                $("#" + _fldTarget).select2("close");
            }
        }
    });

    $(document).off("keypress", "input.select2-search__field");
    $(document).on("keypress", "input.select2-search__field", function (event) {
        if (isSelectedValFocus) {
            isSelectedValFocus = false;
        }
    });

    $(document).off("click", "#copySelVal" + fsFldName);
    $(document).on("click", "#copySelVal" + fsFldName, function () {
        try {
            if ($("#" + $(this).data("ids")).val() != null)
                navigator.clipboard.writeText($("#" + $(this).data("ids")).val());
            else
                navigator.clipboard.writeText("");
        } catch (ex) {
            if (typeof navigator.clipboard == "undefined" && $("#" + $(this).data("ids")).val() != null) {
                var copyText = document.getElementById('tstddlCopyText');
                copyText.value = $("#" + $(this).data("ids")).val();
                copyText.select();
                document.execCommand('copy');
            } else if (typeof navigator.clipboard != "undefined")
                navigator.clipboard.writeText("");
        }
    });
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
    var fldDcNo = GetFieldsDcNo(fldNameAc);

    AxActiveRowNo = parseInt(GetFieldsRowNo(fldNameAc), 10);
    AxActiveRowNo = GetDbRowNo(AxActiveRowNo, fldDcNo);
    var activeRow = AxActiveRowNo;

    var parStr = "";
    if (AxActivePRow != "" && AxActivePDc != "")
        parStr = AxActivePDc + "♠" + AxActivePRow;

    var subStr = "";
    if (IsParentField(fldNameAc, fldDcNo))
        subStr = GetSubGridInfoForParent(fldDcNo, AxActiveRowNo);
    if (value != null && value != "")
        curPageNo = 1;
    return curPageNo.toString() + "~" + AutPageSize.toString() + "~" + fldDcNo + "~" + activeRow + "~" + parStr + "~" + subStr + "~" + includeDcs;
}

function createFormMultiSelect(msfldId) {
    const formSelect = $(msfldId);
    var msData = "";
    var refreshMs = false;
    var fldNameMs = "";
    var isrefreshsave = "";
    var fieldName = "";
    var pageData = "";
    var parentFldVal = "";
    var igr = 1;
    formSelect.select2({
        ajax: {
            url: 'tstruct.aspx/GetMultiSelectValues',
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            delay: 250,
            data: function (params) {

                if (select2IsOpened && (typeof params.term == "undefined" || params.term == "")) {
                    termVal = "";
                }
                else if (select2IsFocused) {
                    select2EventType = "open";
                    termVal = params.term == "" ? undefined : params.term;
                }
                else if (typeof params.term != "undefined" && params.term != "") {
                    termVal = params.term;
                }
                igr = 1;
                fldNameMs = $(this).attr("id");
                isrefreshsave = $(this).hasClass('isrefreshsave');
                fieldName = fldNameMs.substring(0, fldNameMs.lastIndexOf("F") - 3);
                pageData = GetMultiSelectPageData(fldNameMs, "", 1, AutPageSize);

                return JSON.stringify({
                    tstDataId: tstDataId, FldName: fieldName, ChangedFields: ChangedFields, ChangedFieldDbRowNo: ChangedFieldDbRowNo,
                    ChangedFieldValues: ChangedFieldValues, DeletedDCRows: DeletedDCRows, fldNameMs: fldNameMs, refreshMs: refreshMs,
                    parentsFlds: parentFldVal, rfSave: isrefreshsave, pageData: pageData, isTstHtmlLs: resTstHtmlLS
                });
            },
            processResults: function (data) {
                select2EventType = "open";
                var result = data.d.toString().replace(new RegExp("\\n", "g"), "");
                if (result != "" && result.split("♣*♣").length > 1) {
                    tstDataId = result.split("♣*♣")[0];
                    result = result.split("♣*♣")[1];
                }
                if (CheckSessionTimeout(result))
                    return;
                result = result.toString().replace(new RegExp("\\t", "g"), "&#9;");
                resTstHtmlLS = "";
                ChangedFields = new Array();
                ChangedFieldDbRowNo = new Array();
                ChangedFieldValues = new Array();
                DeletedDCRows = new Array();
                if (result.toLowerCase().indexOf("access violation") === -1) {
                    var serResult = $.parseJSON(result);
                    if (serResult.error) {
                        ExecErrorMsg(serResult.error, "autocomplete");
                        return;
                    }
                    msData = serResult.multiselectdata[3].data;
                    if (msData.length != 0) {
                        let aSearch = [];
                        if (termVal.toLowerCase() != "") {
                            $(msData).each(function (iIndex, sElement) {
                                sElement.mslist = sElement.mslist.replace(/\^\^dq/g, '&quot;');
                                if (sElement.mslist.toLowerCase().indexOf(termVal.toLowerCase()) >= 0) {
                                    aSearch.push(sElement);
                                }
                            });
                        } else {
                            aSearch = msData;
                        }
                        if (aSearch.length != 0) {
                            msData = _.sortBy(aSearch, "grouporder");
                            let grdNo = 0;
                            var mulResult = "[";
                            var result = ($.map(msData, function (item) {
                                if (grdNo == 0) {
                                    grdNo = item.grouporder;
                                    mulResult += `{"id":"` + item.grouporder + `","text":"` + item.groupby + `","children":[{"id":"` + item.mslist + `","text":"` + item.mslist + `","selected":"` + item.selected + `"}`;
                                }
                                else if (grdNo == item.grouporder) {
                                    grdNo = item.grouporder;
                                    mulResult += `,{"id":"` + item.mslist + `","text":"` + item.mslist + `","selected":"` + item.selected + `"}`;
                                }
                                else if (grdNo != item.grouporder) {
                                    grdNo = item.grouporder;
                                    mulResult += `]},{"id":"` + item.grouporder + `","text":"` + item.groupby + `","children":[{"id":"` + item.mslist + `","text":"` + item.mslist + `", "selected":"` + item.selected + `"}`;
                                }
                            }));
                            if (mulResult != "[")
                                mulResult += "]}]";
                            else if (mulResult == "[")
                                mulResult = "";
                            return {
                                results: $.parseJSON(mulResult)
                            };
                        }
                        else {
                            var cutMsg = eval(callParent('lcm[0]'));
                            return { results: "", noResults: cutMsg };
                        }
                    }
                    else {
                        var cutMsg = eval(callParent('lcm[0]'));
                        return { results: "", noResults: cutMsg };
                    }
                }
            }
        },
        tags: "true",
        placeholder: 'Search for a repository',
        minimumInputLength: 0,
        selectionCssClass: ':all:d-flex pe-10 ms-render',
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: function (data, container) {
            if (data.element) {
                return data.text;
            }
            if (data.children) {
                //if (igr > 1)
                //    $('#' + fldNameMs).data("select2")?.$dropdown.find('ul.select2-results__options:eq(0)').addClass('d-flex justify-content-between multiSelectGroup');
                //igr++;
                $('#' + fldNameMs).data("select2")?.$dropdown.find('ul.select2-results__options:eq(0)').addClass('d-flex justify-content-between multiSelectGroup');
            }
            return data.text;
        },
        closeOnSelect: false,
        createTag: function (params) {
            return null;
        }
    }).on('select2:select', function (event) {
        let fldMulValue = $(this).val();
        if (typeof $(this).data("sep") != "undefined") {
            let separator = $(this).data("sep");
            fldMulValue = fldMulValue.join(separator);
        }

        var fName = GetFieldsName(fldNameMs);
        var fldIndex = $j.inArray(fName, FNames);

        if (fldIndex == -1)
            return;
        if (typeof $("#" + fldNameMs).attr('disabled') != "undefined")
            return;
        if (FFieldReadOnly[fldIndex] == "True")
            return;
        if (FFieldHidden[fldIndex] == "True")
            return;

        var acFrNo = GetFieldsDcNo(fldNameMs);
        var rowNum = GetDbRowNo(GetFieldsRowNo(fldNameMs), acFrNo);
        $(this).attr("data-selected", fldMulValue);
        UpdateFieldArray(fldNameMs, rowNum, fldMulValue, "parent", "AutoComplete");
        UpdateAllFieldValues(fldNameMs, fldMulValue);
        setTimeout(function () {
            MainBlur($j("#" + fldNameMs));
        }, 0);
    }).on("select2:unselect", function (e) {
        let fldNamesf = $(this).attr("id");
        let fldMulValue = $(this).val();
        if (typeof $(this).data("sep") != "undefined") {
            let separator = $(this).data("sep");
            fldMulValue = fldMulValue.join(separator);
        }
        var acFrNo = GetFieldsDcNo(fldNamesf);
        var rowNum = GetDbRowNo(GetFieldsRowNo(fldNamesf), acFrNo);
        $(this).attr("data-selected", fldMulValue);
        UpdateFieldArray(fldNamesf, rowNum, fldMulValue, "parent", "AutoComplete");
        UpdateAllFieldValues(fldNamesf, fldMulValue);
        if (fldMulValue == "")
            AxOldValue = " ";
        //else
        //    AxOldValue = fldMulValue;
        MainBlur($j("#" + fldNamesf));
    }).on('select2:open', function (e) {
        const evt = "scroll.select2";
        $(e.target).parents().off(evt);
        $(window).off(evt);

        if (select2IsFocused) {
            select2EventType = "tab";
        }
        else {
            select2IsOpened = true;
            select2EventType = "click";
        }
        $(".select2-results a.fsautorefresh").remove();
        $(".select2-results a[id*=addOption]").remove();
        $(".select2-results a[id^='copySelVal']").remove();
        let _thisId = $(this).attr("id");
        let iconBtn = '<a class="btn btn-sm btn-icon btn-white btn-color-gray-500 btn-active-primary me-2 shadow-sm float-end" id="advSearch' + _thisId + '" title="adv. search" data-ids=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">search</span></a><input type=hidden id="pickIdVal_' + _thisId + '" value=\"\" />';

        $(".select2-results:not(:has(a))").append(iconBtn);
        clickEvents(_thisId);
    });

    formSelect.parent().find(".ms-render .select2-selection__rendered").addClass("text-wrap text-break p-0");
}

function GetMultiSelectPageData(fldNameMs, value, curPageNo, AutPageSize) {
    var includeDcs = "";
    if (arrRefreshDcs.length > 0) {
        for (var i = 0; i < arrRefreshDcs.length; i++) {
            var arrDcNos = arrRefreshDcs[i].split(':');
            includeDcs = arrDcNos[1].replace("dc", "") + ',' + arrDcNos[0].replace("dc", "");
        }
    }
    value = CheckSpecialCharsInStr(value);
    var fldDcNo = GetFieldsDcNo(fldNameMs);

    AxActiveRowNo = parseInt(GetFieldsRowNo(fldNameMs), 10);
    AxActiveRowNo = GetDbRowNo(AxActiveRowNo, fldDcNo);
    var activeRow = AxActiveRowNo;

    var parStr = "";
    if (AxActivePRow != "" && AxActivePDc != "")
        parStr = AxActivePDc + "♠" + AxActivePRow;

    var subStr = "";
    if (IsParentField(fldNameMs, fldDcNo))
        subStr = GetSubGridInfoForParent(fldDcNo, AxActiveRowNo);
    return curPageNo.toString() + "~" + AutPageSize.toString() + "~" + fldDcNo + "~" + activeRow + "~" + parStr + "~" + subStr + "~" + includeDcs;
}

function AxGetCustSelectFldData(fieldId) {
    var optionValues = "";
    var fastdll = $("#" + fieldId).hasClass('fastdll');
    var pageData = GetAutoCompData(fieldId, "", 1, 1000);
    var fieldName = fieldId.substring(0, fieldId.lastIndexOf("F") - 3);
    var parentFldVal = "";
    if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
        parentFldVal = ISBoundAutoCom(fieldName, fieldId);
    else
        parentFldVal = ISBoundNew(fieldName, fieldId);
    let fldApiInd = GetFieldIndex(fieldName);
    let isApifld = FldIsAPI[fldApiInd];
    $.ajax({
        url: 'tstruct.aspx/GetAutoCompleteData',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            tstDataId: tstDataId, FldName: fieldName, FltValue: "", ChangedFields: ChangedFields, ChangedFieldDbRowNo: ChangedFieldDbRowNo,
            ChangedFieldValues: ChangedFieldValues, DeletedDCRows: DeletedDCRows, pageData: pageData, fastdll: fastdll, fldNameAc: fieldId, refreshAC: false,
            pickArrow: false, parentsFlds: parentFldVal, rfSave: true, IsApiFld: isApifld, tblSourceParams: "", isTstHtmlLs: resTstHtmlLS
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            try {
                var result = data.d.toString().replace(new RegExp("\\n", "g"), "");
                if (result != "" && result.split("♣*♣").length > 1) {
                    tstDataId = result.split("♣*♣")[0];
                    result = result.split("♣*♣")[1];
                }
                if (result != "") {
                    result = result.split("*♠*")[0];
                }
                if (CheckSessionTimeout(result))
                    return;
                result = result.toString().replace(new RegExp("\\t", "g"), "&#9;");
                resTstHtmlLS = "";
                ChangedFields = new Array();
                ChangedFieldDbRowNo = new Array();
                ChangedFieldValues = new Array();
                DeletedDCRows = new Array();
                if (!(result.toLowerCase().includes("access violation") && result.toLowerCase().includes("asbtstruct.dll"))) {
                    optionValues = result;
                }
                else {
                    AxWaitCursor(false);
                    ShowDimmer(false);
                    showAlertDialog("error", "Access Violation");
                }
            }
            catch (exception) {
                AxWaitCursor(false);
                ShowDimmer(false);
                showAlertDialog("error", exception.message);
            }
        },
        error: function (error) {
            AxWaitCursor(false);
            ShowDimmer(false);
            showAlertDialog("error", error);
        }
    })
    return optionValues;
}

function createFormSelectMultiChecklist(fld) {
    const formSelect = $(fld);
    var fldNameAc = "",
        fieldName = "",
        fastdll = "",
        termVal = "",
        depFldName = "";
    var isPickMinChar = false;
    var isOnCLose = false;
    var parentFldVal = "";
    var IsBindData = false;
    var mulSeparator = ",";

    formSelect.select2({
        ajax: {
            url: 'tstruct.aspx/GetAutoCompleteData',
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            delay: 250,
            data: function (params) {

                if (select2IsOpened && (typeof params.term == "undefined" || params.term == "")) {
                    termVal = "";
                }
                else if (select2IsFocused) {
                    select2EventType = "open";
                    //termVal = params.term == "" ? undefined : (isSelectedValFocus ? undefined : params.term);
                    termVal = params.term;
                    if (typeof termVal == "undefined" && $(this).val() != null)
                        termVal = "";
                }
                else if (typeof params.term != "undefined" && params.term != "") {
                    termVal = params.term;
                }

                if (typeof $(this).data("separator") != "undefined")
                    mulSeparator = $(this).data("separator");

                fastdll = $(this).hasClass('multiFldChk') ? true : $(this).hasClass('fastdll');
                if (fastdll == true || (fastdll == false && termVal == "") || (fastdll == false && (typeof termVal == "undefined" || termVal.length > 1))) {
                    isPickMinChar = false;
                    var isrefreshsave = $(this).hasClass('isrefreshsave');
                    var pageData = GetAutoCompData(fldNameAc, termVal, AutPageNo, AutPageSize);
                    var fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                    parentFldVal = "";
                    if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
                        parentFldVal = ISBoundAutoCom(fieldName, fldNameAc);
                    else
                        parentFldVal = ISBoundNew(fieldName, fldNameAc);
                    let fldApiInd = GetFieldIndex(fieldName);
                    let isApifld = FldIsAPI[fldApiInd];

                    if (FldListParents.length > 0 && FldListParents.indexOf(fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 && termVal == "" && !isRefreshClick && !$(this).hasClass('multiFldChk')) {//&& $(this).val() != null
                        //let _thisIdx = FldListParents.indexOf(fieldName + "~" + parentFldVal);
                        IsBindData = true;
                    } else {
                        IsBindData = false;
                        isRefreshClick = false;
                        return JSON.stringify({
                            tstDataId: tstDataId,
                            FldName: fieldName,
                            FltValue: termVal,
                            ChangedFields: ChangedFields,
                            ChangedFieldDbRowNo: ChangedFieldDbRowNo,
                            ChangedFieldValues: ChangedFieldValues,
                            DeletedDCRows: DeletedDCRows,
                            pageData: pageData,
                            fastdll: fastdll,
                            fldNameAc: fldNameAc,
                            refreshAC: refreshAC,
                            pickArrow: pickarrow,
                            parentsFlds: parentFldVal,
                            rfSave: isrefreshsave,
                            IsApiFld: isApifld,
                            tblSourceParams: "",
                            isTstHtmlLs: resTstHtmlLS
                        });
                    }
                } else {
                    IsBindData = false;
                    rcount = 0;
                    isPickMinChar = true;
                }
            },
            processResults: function (data) {
                IsBindData = false;
                select2EventType = "open";
                refreshAC = false;
                try {
                    var result = data.d.toString().replace(new RegExp("\\n", "g"), "");
                    if (result != "") {
                        if (result.split("♣*♣").length > 1) {
                            tstDataId = result.split("♣*♣")[0];
                            result = result.split("♣*♣")[1];
                        }
                        if (result.split("*♠*").length > 1) {
                            serverprocesstime = result.split("*♠*")[1];
                            requestProcess_logtime = result.split("*♠*")[2];
                            result = result.split("*♠*")[0];
                            WireElapsTime(serverprocesstime, requestProcess_logtime, true);
                        } else {
                            UpdateExceptionMessageInET("Error : " + result);
                        }
                    }
                    if (CheckSessionTimeout(result))
                        return;
                    result = result.toString().replace(new RegExp("\\t", "g"), "&#9;");
                    resTstHtmlLS = "";
                    ChangedFields = new Array();
                    ChangedFieldDbRowNo = new Array();
                    ChangedFieldValues = new Array();
                    DeletedDCRows = new Array();
                    if (!(result.toLowerCase().includes("access violation") && result.toLowerCase().includes("asbtstruct.dll"))) {
                        var serResult = $.parseJSON(result);
                        datasss = serResult;
                        if (serResult.error) {
                            ExecErrorMsg(serResult.error, "autocomplete");
                            return;
                        }
                        var rcountNew = serResult.pickdata[0].rcount;
                        depFldName = serResult.pickdata[2].dfname;
                        // AutoFillFlds[fieldName] = depFldName;
                        if (rcountNew != 0)
                            rcount = parseInt(rcountNew);
                        rcount = rcount < fetchRCount ? rcount : fetchRCount;
                        PageCount = Math.ceil(rcount / AutPageSize);
                        PageCount == 0 ? PageCount = 1 : "";
                        countPerPage = rcount;
                        if (AutPageNo == 1) {
                            if (PageCount == 1) {
                                $("#autoleft" + fldNameAc).prop("disabled", true).addClass("disabled");
                                $("#autoright" + fldNameAc).prop("disabled", true).addClass("disabled");
                            } else {
                                // $("#autoleft" + fldNameAc).prop("disabled", true).addClass("disabled");
                                $("#autoright" + fldNameAc).prop("disabled", false).removeClass("disabled");
                            }
                        }
                        else if (AutPageNo > 1 && PageCount <= AutPageNo)
                            $("#autoright" + fldNameAc).prop("disabled", true).addClass("disabled");

                        dtAssoc = serResult.pickdata[3].data;
                        if (dtAssoc != undefined && dtAssoc.length != 0) {
                            if (!$("#" + fldNameAc).hasClass('multiFldChk')) {
                                let _fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                                if (FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 || FldListParents.some(item => item.startsWith(_fieldName + "♦"))) {
                                    let _tIdn = FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 ? FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) : FldListParents.findIndex((account) => { return account.startsWith(_fieldName + "♦"); }, _fieldName + "♦");
                                    FldListParents[_tIdn] = _fieldName + "♦" + fldNameAc + "♦" + parentFldVal;
                                    FldListData[_tIdn] = serResult;
                                } else {
                                    FldListParents.push(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal);
                                    FldListData.push(serResult);
                                }
                            }

                            if ($(this.$element).hasClass('multiFldChk'))
                                $(".msSelectAllOption").removeClass("d-none");
                            if (fastdll) {
                                var aSearch = [];
                                $(dtAssoc).each(function (iIndex, sElement) {
                                    sElement.i = sElement.i.replace(/\^\^dq/g, '&quot;');
                                    if (sElement.i.toLowerCase().indexOf(termVal.toLowerCase()) >= 0) {
                                        aSearch.push(sElement);
                                    }
                                });
                                $("#" + fldNameAc).data("rowcount", aSearch.length);
                                if (aSearch.length != 0) {
                                    var result = ($.map(aSearch, function (item) {
                                        item.i = item.i.replace(/\^\^dq/g, '&quot;');
                                        return {
                                            //id: item.v == "" ? item.i : item.v,
                                            id: item.i,
                                            text: item.i,
                                            dep: item.d
                                        }
                                    }))
                                    if (AxRulesDefFilter == "true")
                                        result = AxFilterDropDownResult(fldNameAc, result);
                                    searchResult = result;
                                    return {
                                        results: result
                                    };
                                } else {
                                    if ($(this.$element).hasClass('multiFldChk'))
                                        $(".msSelectAllOption").addClass("d-none");
                                    else {
                                        let _fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                                        if (FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 || FldListParents.some(item => item.startsWith(_fieldName + "♦"))) {
                                            let _tIdn = FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 ? FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) : FldListParents.findIndex((account) => { return account.startsWith(_fieldName + "♦"); }, _fieldName + "♦");
                                            FldListParents.splice(_tIdn, 1);
                                            FldListData.splice(_tIdn, 1);
                                        }
                                    }
                                    var cutMsg = eval(callParent('lcm[0]'));
                                    return { results: "", noResults: cutMsg };
                                }
                            } else {
                                var result = ($.map(dtAssoc, function (item) {
                                    item.i = item.i.replace(/\^\^dq/g, '&quot;');
                                    return {
                                        //id: item.v == "" ? item.i : item.v,
                                        id: item.i,
                                        text: item.i,
                                        dep: item.d
                                    }
                                }))
                                if (AxRulesDefFilter == "true")
                                    result = AxFilterDropDownResult(fldNameAc, result);
                                searchResult = result;
                                return {
                                    results: result
                                };
                            }
                        } else {
                            if ($(this.$element).hasClass('multiFldChk'))
                                $(".msSelectAllOption").addClass("d-none");
                            else {
                                let _fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                                if (FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 || FldListParents.some(item => item.startsWith(_fieldName + "♦"))) {
                                    let _tIdn = FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1 ? FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) : FldListParents.findIndex((account) => { return account.startsWith(_fieldName + "♦"); }, _fieldName + "♦");
                                    FldListParents.splice(_tIdn, 1);
                                    FldListData.splice(_tIdn, 1);
                                }
                            }
                            var cutMsg = eval(callParent('lcm[0]'));
                            return { results: "", noResults: cutMsg };
                        }
                    } else {
                        AxWaitCursor(false);
                        ShowDimmer(false);
                        $("#reloaddiv").show();
                        $("#dvlayout").hide();
                    }
                } catch (exception) {
                    if (exception.message.toLowerCase().indexOf("access violation") != -1) {
                        AxWaitCursor(false);
                        ShowDimmer(false);
                        $("#reloaddiv").show();
                        $("#dvlayout").hide();
                    }
                }
            },
            error: function (data) {
                if (IsBindData) {
                    let _fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                    if (FldListParents.length > 0 && FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal) > -1) {
                        var _thisIdx = FldListParents.indexOf(_fieldName + "♦" + fldNameAc + "♦" + parentFldVal);
                        depFldName = FldListData[_thisIdx].pickdata[2].dfname;
                        var _ArrData = FldListData[_thisIdx].pickdata[3].data;
                        var result = ($.map(_ArrData, function (item) {
                            item.i = item.i.replace(/\^\^dq/g, '&quot;');
                            return {
                                id: item.i,
                                text: item.i,
                                dep: item.d
                            }
                        }))
                        $(".select2-results__options li:eq(0)").remove();
                        console.clear();
                        $("#" + fldNameAc).select2("data", result, true);
                        $("#" + fldNameAc).select2("updateResults");
                    }
                }
            }
        },
        placeholder: 'Search for a repository',
        minimumInputLength: 0,
        selectionCssClass: ':all:d-flex pe-10 ms-render',
        escapeMarkup: function (markup) {
            return markup;
        },
        //tags: true,
        multiple: true,
        tokenSeparators: [mulSeparator],
        language: {
            errorLoading: function () {
                if (isPickMinChar)
                    return 'Required to search minimum 2 characters';
                else
                    return 'Start type characters for searching data..';
            }
        }
    }).on('select2:select', function (event) {
        let depList = event.params.data.dep;
        let fldAcValue = $(this).val();
        if (typeof $(this).data("separator") != "undefined") {
            let separator = $(this).data("separator");
            fldAcValue = fldAcValue.join(separator);
        }
        refreshAC = false;
        isGrdEditDirty = true;
        dtAssoc = [];
        var cutMsg = eval(callParent('lcm[0]'));

        var fName = GetFieldsName(fldNameAc);
        var fldIndex = $j.inArray(fName, FNames);

        if (fldIndex == -1)
            return;
        if (typeof $("#" + fldNameAc).attr('disabled') != "undefined")
            return;
        if (FFieldReadOnly[fldIndex] == "True")
            return;
        if (FFieldHidden[fldIndex] == "True")
            return;

        var rcID = GetFieldsRowFrameNo(fldNameAc);
        var acFrNo = GetFieldsDcNo(fldNameAc);
        var rowNum = GetDbRowNo(GetFieldsRowNo(fldNameAc), acFrNo);
        var fldRowNo = GetFieldsRowNo(fldNameAc);
        if (IsDcGrid(acFrNo) && isGrdEditDirty)
            UpdateFieldArray(axpIsRowValid + acFrNo + fldRowNo + "F" + acFrNo, GetDbRowNo(fldRowNo, acFrNo), "", "parent", "AddRow");
        UpdateFieldArray(fldNameAc, rowNum, fldAcValue, "parent", "AutoComplete");
        UpdateAllFieldValues(fldNameAc, fldAcValue);

        if (depList != undefined && depList != null && depList != cutMsg && depFldName != "") {//Alogn with othe cindtion should check depFldName variable also should not be empty
            try {
                //dep = uhid^patient_details^attending_physician~76222000000431^wardtype~Single Room
                var depText = depList.split('^');
                var dfCount = 0;
                $.each(depText, function (index, value) {
                    var depfldId = depFldName.split('^')[dfCount];
                    var depfldValue = value;
                    dfCount++;
                    rcID = rcID.substring(0, rcID.lastIndexOf('F') + 1) + GetDcNo(depfldId);
                    if (depfldValue != "")
                        depfldValue = depfldValue.replace(new RegExp("<br>", "g"), "\n");
                    $("#" + depfldId + rcID).val(depfldValue);
                    let _thisfldType = $("#" + depfldId + rcID).data("type") || $("#" + depfldId + rcID).prop("type");
                    if (typeof _thisfldType != "undefined" && _thisfldType == "checkbox" && $("#" + depfldId + rcID).hasClass("custInpChk")) {
                        if (depfldValue == "")
                            $("#" + depfldId + rcID).prop("checked", false);
                        else if (depfldValue != "" && depfldValue.toLowerCase() == "f")
                            $("#" + depfldId + rcID).prop("checked", false);
                        else if (depfldValue != "" && depfldValue.toLowerCase() == "t")
                            $("#" + depfldId + rcID).prop("checked", true);
                    }
                    var _fldIndex = $j.inArray(depfldId, FNames);
                    var fldType = GetFieldType(depfldId, _fldIndex);
                    if (fldType == "Numeric")
                        $("#" + depfldId + rcID).data("attr", depfldValue);
                    if (depfldValue != undefined) {
                        UpdateFieldArray(depfldId + rcID, rowNum, depfldValue, "parent", "AutoComplete");
                        UpdateAllFieldValues(depfldId + rcID, depfldValue);
                    }
                });
            } catch (Ex) { }
        }
        checkNextSelExpFld(fName, fldIndex);
        setTimeout(function () {
            AxOldValue = "";
            MainBlur($j("#" + fldNameAc));
        }, 0);
    }).on("select2:unselect", function (e) {
        let fldNamesf = $(this).attr("id");
        let fldAcValue = $(this).val();
        if (typeof $(this).data("separator") != "undefined") {
            let separator = $(this).data("separator");
            fldAcValue = fldAcValue.join(separator);
            var rcID = GetFieldsRowFrameNo(fldNamesf);
            var acFrNo = GetFieldsDcNo(fldNamesf);
            var rowNum = GetDbRowNo(GetFieldsRowNo(fldNamesf), acFrNo);
            UpdateFieldArray(fldNamesf, rowNum, fldAcValue, "parent", "AutoComplete");
            UpdateAllFieldValues(fldNamesf, fldAcValue);
        }
        if (fldAcValue == "")
            AxOldValue = " ";
        else if (!$(this).hasClass("multiFldChk"))
            AxOldValue = fldAcValue;
        MainBlur($j("#" + fldNamesf));
    }).on('select2:open', function (e) {

        const evt = "scroll.select2";
        $(e.target).parents().off(evt);
        $(window).off(evt);

        isPickMinChar = false;
        if (select2IsFocused) {
            select2EventType = "tab";
            if ($(this).val() != "" && $(this).val() != null) {
                $("input.select2-search__field").val($(this).val());
                select2IsOpened = true;
                isSelectedValFocus = true;
            }

            if ($(this).attr("id") != AxFocusedFld && AxFocusedFld != "" && !$("#" + AxFocusedFld).hasClass("fldFromSelect") && !$("#" + AxFocusedFld).hasClass("multiFldChk") && !$("#" + AxFocusedFld).hasClass("gridHeaderSwitch") && !$("#" + AxFocusedFld).hasClass("dvgrdchkboxnonedit") && !$("#" + AxFocusedFld).hasClass("ckbGridStretchSwitch"))// Changed text field and directlly click on select2 field using mouse changed field not getting call mainblur.
            {
                MainBlur($("#" + AxFocusedFld));
                AxOldValue = "";
                MainFocus($j(this));
            }
            else if (gridRowEditOnLoad && IsGridField(GetFieldsName($(this).attr("id")))) {
                UpdateGridRowFlags($(this).attr("id"), GetFieldsDcNo($(this).attr("id")), "001");
            }

            isOnCLose = false;
        }
        else {
            if ($(this).attr("id") != AxFocusedFld && AxFocusedFld != "" && !$("#" + AxFocusedFld).hasClass("fldFromSelect") && !$("#" + AxFocusedFld).hasClass("multiFldChk") && !$("#" + AxFocusedFld).hasClass("gridHeaderSwitch") && !$("#" + AxFocusedFld).hasClass("dvgrdchkboxnonedit") && !$("#" + AxFocusedFld).hasClass("ckbGridStretchSwitch"))// Changed text field and directlly click on select2 field using mouse changed field not getting call mainblur.
            {
                MainBlur($("#" + AxFocusedFld));
                AxOldValue = "";
                MainFocus($j(this));
            }
            else if (gridRowEditOnLoad && IsGridField(GetFieldsName($(this).attr("id")))) {
                UpdateGridRowFlags($(this).attr("id"), GetFieldsDcNo($(this).attr("id")), "001");
            }
            if (!isOnCLose) {
                $("input.select2-search__field").val($(this).val());
                select2IsOpened = true;
                select2EventType = "click";
            }
            isOnCLose = false;
        }

        let addOption = typeof $(this).attr("data-addoption") == "undefined" ? "" : $(this).attr("data-addoption");
        let dataRefresh = typeof $(this).attr("data-refresh") == "undefined" ? "" : $(this).attr("data-refresh");
        let _thisId = $(this).attr("id");
        let _selItemCount = $(this).val().length;
        let iconBtn = "";
        $(".select2-results a.fsautorefresh").remove();
        iconBtn += '<a class="btn btn-sm btn-icon btn-white btn-color-gray-500 btn-active-primary me-2 shadow-sm float-end" id="advSearch' + _thisId + '" title="adv. search" data-ids=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">search</span></a><input type=hidden id="pickIdVal_' + _thisId + '" value=\"\" />';

        if (typeof addOption != "undefined" && addOption != "") {
            iconBtn += '<a class="btn btn-sm btn-icon btn-primary btn-color-gray-600--- btn-active-primary--- me-2 shadow-sm float-end" id="addOption' + _thisId + '" data-ids=' + _thisId + ' title="Add Master Data"><span class="material-icons material-icons-style material-icons-3">add</span></a>';
        }

        $(".select2-results:not(:has(a))").append(iconBtn);

        fldNameAc = $(this).attr("id");
        if ($(this).hasClass('multiFldChk')) {
            var curDropdown = $(this).data("select2")?.$dropdown;

            let _selCountDv = `<div class="dvMulSelectCount float-end px-2">
                    <label for="Selecteditems" class="ps-2 form-label col-form-label pb-1">
                        Selected Count: ${_selItemCount}
                    </label>
                </div>`;

            curDropdown.find(".select2-results").find(".dvMulSelectCount").remove();
            if (curDropdown.find(".select2-results").find(".msSelectAllOption").length > 0)
                curDropdown.find(".select2-results").find(".msSelectAllOption").before(_selCountDv);
            else
                curDropdown.find(".select2-results").append(_selCountDv);
            let _fName = GetFieldsName(fldNameAc);
            if (typeof AxHideSelectAll != "undefined") {
                let _axhideselall = AxHideSelectAll.split('♦');
                if (_axhideselall[0].toLowerCase() == 'false') {
                    if (curDropdown.find(".select2-results").find(".msSelectAllOption").length == 0) {
                        let selectAllHTML = `<div class="msSelectAllOption form-check form-check-custom align-self-end px-5 d-none">
                    <input type="checkbox" class="form-check-input msSelectAll" onchange="checkAllCheckBoxTokens(this, '${fldNameAc}')"/>
                    <label for="SelectAll" class="ps-2 form-check-label form-label col-form-label pb-1 fw-boldest">
                        Select All
                    </label>
                </div>`;
                        curDropdown.find(".select2-results").append(selectAllHTML);
                    }
                } else if (_axhideselall.length > 1 && _axhideselall[0].toLowerCase() == 'false' && _axhideselall[1] == "") {
                    if (curDropdown.find(".select2-results").find(".msSelectAllOption").length == 0) {
                        let selectAllHTML = `<div class="msSelectAllOption form-check form-check-custom align-self-end px-5 d-none">
                    <input type="checkbox" class="form-check-input msSelectAll" onchange="checkAllCheckBoxTokens(this, '${fldNameAc}')"/>
                    <label for="SelectAll" class="ps-2 form-check-label form-label col-form-label pb-1 fw-boldest">
                        Select All
                    </label>
                </div>`;
                        curDropdown.find(".select2-results").append(selectAllHTML);
                    }
                } else if (_axhideselall.length > 1 && (_axhideselall[0].toLowerCase() != 'true' || (_axhideselall[0].toLowerCase() == 'true' && _axhideselall[1] != "" && _axhideselall[1] != _fName))) {
                    if (curDropdown.find(".select2-results").find(".msSelectAllOption").length == 0) {
                        let selectAllHTML = `<div class="msSelectAllOption form-check form-check-custom align-self-end px-5 d-none">
                    <input type="checkbox" class="form-check-input msSelectAll" onchange="checkAllCheckBoxTokens(this, '${fldNameAc}')"/>
                    <label for="SelectAll" class="ps-2 form-check-label form-label col-form-label pb-1 fw-boldest">
                        Select All
                    </label>
                </div>`;
                        curDropdown.find(".select2-results").append(selectAllHTML);
                    }
                }
            } else {
                if (curDropdown.find(".select2-results").find(".msSelectAllOption").length == 0) {
                    let selectAllHTML = `<div class="msSelectAllOption form-check form-check-custom align-self-end px-5 d-none">
                    <input type="checkbox" class="form-check-input msSelectAll" onchange="checkAllCheckBoxTokens(this, '${fldNameAc}')"/>
                    <label for="SelectAll" class="ps-2 form-check-label form-label col-form-label pb-1 fw-boldest">
                        Select All
                    </label>
                </div>`;
                    curDropdown.find(".select2-results").append(selectAllHTML);
                }
            }

            var selectedOptionCount = 0;
            curDropdown.find(".select2-results").find(".select2-results__options li:not(.select2-results__option--disabled.loading-results)").each((ind, elm) => {
                if ($(elm).hasClass("select2-results__option--selected")) {
                    selectedOptionCount++;
                }
            });

            if (curDropdown.find(".select2-results").find(".select2-results__options li:not(.select2-results__option--disabled.loading-results)").length == selectedOptionCount && selectedOptionCount > 0) {
                curDropdown.find(".select2-results").find(".msSelectAllOption > .msSelectAll").prop("checked", true);
            }
            else if (curDropdown.find(".select2-results").find(".select2-results__options li:not(.select2-results__option--disabled.loading-results)").length != selectedOptionCount && curDropdown.find(".select2-results").find(".msSelectAllOption > .msSelectAll").is(":checked")) {
                curDropdown.find(".select2-results").find(".msSelectAllOption > .msSelectAll").prop("checked", false);
            }
        }

        if (CangefldName != fldNameAc) {
            AutPageNo = 1;
            rcount = 0;
            CangefldName = fldNameAc;
        }
        if (!isNavigation)
            AutPageNo = 1;
        isNavigation = false;

        clickEvents(_thisId);
    }).on("select2:close", function (e) {
        isOnCLose = false;
        isSelectedValFocus = false;
        select2IsFocused = true;
        select2EventType = "";
    }).on("select2:closing", function (e) {
        isOnCLose = true;
        select2EventType = "";
    }).on("select2:clear", function (e) {
        isOnCLose = true;
        select2EventType = "";
    });

    formSelect.parent().find(".ms-render .select2-selection__rendered").addClass("text-wrap text-break p-0");
}


$(document).on('paste', 'span.select2', function (e) {
    var _select = $(e.target).closest('.select2').prev();
    if (!$(_select).hasClass('multiFldChk'))
        return;
    e.preventDefault();
    let _fldNameAc = _select.attr("id");
    var ckmulResultList = new Array();
    $(_select).data("select2")?.$results.children().each(function (key, val) {
        ckmulResultList.push($(this).text());
    });
    if (typeof _select.data("separator") != "undefined")
        _select.data('select2').options.options.tokenSeparators[0] = _select.data("separator");
    var clipboard = (e.originalEvent || e).clipboardData.getData('text/plain');
    var createOption = function (value, selected) {
        return $("<option></option>")
            .attr("value", value)
            .attr("selected", "selected")
            .text(value)[0]
    };
    $.each(
        clipboard.split(new RegExp(_select.data('select2').options.options.tokenSeparators.map(function (a) {
            return (a).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }).join('|'))),
        function (key, value) {
            if (value && $.inArray(value, ckmulResultList) > -1 && (!_select.val() || (_select.val() && _select.val().indexOf('' + value) == -1))) {
                _select.append(createOption(value));
                //_select.append('<option value="' + val + '" selected="selected">' + val + '</option>');
            }
        });
    _select.trigger('change');
    setTimeout(function () {
        MainBlur($j("#" + _fldNameAc));
    }, 0);
});
