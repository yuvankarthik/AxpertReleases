function AxAfterTstLoad() {
    if (transid == 'NF_AG') {
        var dfldType = $("#customdatatype000F1").attr('value');
        if (dfldType == "Auto Generate") {
            $("#Def_Sequence000F2").addClass("fldCustTable");
            var dfName = GetFieldsName("Def_Sequence000F2");
            var dfldIndex = $j.inArray(dfName, FNames);
            var tjson = "{\"props\":{\"type\":\"table\",\"colcount\":\"5\",\"rowcount\":\"1\",\"addrow\":\"t\",\"deleterow\":\"t\",\"valueseparator\":\"|\",\"rowseparator\":\"^\"},\"columns\":{\"1\":{\"caption\":\"Prefix\",\"name\":\"prefixtxt\",\"value\":\"\",\"source\":\"\",\"exp\":\"\",\"vexp\":\"\"},\"2\":{\"caption\":\"Prefix Field\",\"name\":\"prefixfld\",\"value\":\"\",\"source\":\"prefixddl\",\"exp\":\"\",\"vexp\":\"\"},\"3\":{\"caption\":\"Starting No.\",\"name\":\"startingnofld\",\"value\":\"\",\"source\":\"\",\"exp\":\"\",\"vexp\":\"\"},\"4\":{\"caption\":\"Active\",\"name\":\"activeflg\",\"value\":\"\",\"source\":\"seqactiveddl\",\"exp\":\"{True}\",\"vexp\":\"\"},\"5\":{\"caption\":\"No. of Digit\",\"name\":\"noofdigitfld\",\"value\":\"\",\"source\":\"\",\"exp\":\"\",\"vexp\":\"\"}}}";
            FTableTypeVal[dfldIndex] = tjson;
            var dfldHtml = $("#Def_Sequence000F2").parent().html();
            dfldHtml = dfldHtml.replace("<input ", "<div class=\"autoinput-parent\"><input ") + "<div class=\"edit\"><i class=\"glyphicon glyphicon-th\" title=\"select\" data-clk=\"Def_Sequence000F2-tbl\"></i></div></div>";
            $("#Def_Sequence000F2").parent().html(dfldHtml);
        }
    }
    if (transid == "ad_ih" || transid == "ad_tb" || transid == "ad_tg" || transid == "ad_if") {
        $('#tstToolBarBtn').show();
    }
    if ((transid == 'NF_AG' || transid == 'mntss')) {
        var dparam = "&stransid=" + $("#stransid000F1").attr('value') + "&olddcname=" + $("#dcselect000F1").attr('value') + "&structname=" + $("#structname000F1").attr('value');
        callParentNew("dwbtstparams=", dparam);
    }
    if ((transid == 'ad__d' || transid == 'subm' || transid == 'ad_fg' || transid == 'ad_ge' || transid == 'ad_md' || transid == 'ad_s')) {//|| transid == 'ad__t'
        var dparam = "&stransid=" + $("#stransid000F1").attr('value') + "&structname=" + $("#structname000F1").attr('value');
        callParentNew("dwbtstparams=", dparam);
        if (transid == 'ad__d' && recordid != "")
            callParentNew("dwbtstdctable=", $("#tablename000F1").val());

    }
    if (transid == 'ad_i') {
        $("#Def_Table_params000F1").addClass("fldCustTable");
        var dfName = GetFieldsName("Def_Table_params000F1");
        var dfldIndex = $j.inArray(dfName, FNames);
        var tjson = "{\"props\":{\"type\":\"table\",\"colcount\":\"3\",\"rowcount\":\"1\",\"addrow\":\"f\",\"deleterow\":\"f\",\"valueseparator\":\"~\",\"rowseparator\":\",\"},\"columns\":{\"1\":{\"caption\":\"Parameter Name\",\"name\":\"paraname\",\"value\":\"\",\"source\":\"\",\"exp\":\"\",\"vexp\":\"\"},\"2\":{\"caption\":\"Data Type\",\"name\":\"datatypefld\",\"value\":\"\",\"source\":\"ddldatatype\",\"exp\":\"\",\"vexp\":\"\"},\"3\":{\"caption\":\"Value\",\"name\":\"valuefld\",\"value\":\"\",\"source\":\"\",\"exp\":\"\",\"vexp\":\"\"}}}";
        FTableTypeVal[dfldIndex] = tjson;
        var dfldHtml = $("#Def_Table_params000F1").parent().html();
        dfldHtml = dfldHtml.replace("<input ", "<div class=\"autoinput-parent\"><input ") + "<div class=\"edit\"><i class=\"glyphicon glyphicon-th\" title=\"select\" data-clk=\"Def_Table_params000F1-tbl\"></i></div></div>";
        $("#Def_Table_params000F1").parent().html(dfldHtml);

        $("#sql_editor_iviewsql000F1").on("focusout", function (event) {
            var sqlParStr = "";
            try {
                if ($(this).val() != "" && ($(this).val().replace(/'(.*?)'/g, "''").match(/(:)+[a-zA-Z0-9_]{1,}/g) || []).filter(v => v.indexOf("::") != 0).length > 0) {
                    sqlParStr = _.uniqBy($(this).val().replace(/'(.*?)'/g, "''").match(/(:)+[a-zA-Z0-9_]{1,}/g).filter(v => v.indexOf("::") != 0).map((val) => val.replace(/[:\s]/g, ""))).join(",");
                }
                if ($(this).val() != "" && ($(this).val().replace(/'(.*?)'/g, "''").match(/(\{(?:\[??[^\[]*?\}))*/g) || []).filter(v => v).length > 0) {
                    sqlParStr = (sqlParStr ? (sqlParStr + ",") : "") + _.uniqBy($(this).val().replace(/'(.*?)'/g, "''").match(/(\{(?:\[??[^\[]*?\}))*/g).map((val) => val.replace(/[{\s]/g, "").replace(/[}\s]/g, ""))).filter(v => v).join(",");
                }
                // sqlParStr = sqlParStr.endsWith(",") ? sqlParStr.substr(0, sqlParStr.length - 1) : sqlParStr;

                // if($("#paramscal000F1").val() == ""){
                sqlParStr = sqlParStr.split(",").map(par => par && `${par}~Character~`).join(",");
                // }
            } catch (error) {

            }

            if (sqlParStr == "") {
                SetFieldValue("iviewparams000F1", sqlParStr);
                UpdateFieldArray("iviewparams000F1", GetFieldsRowNo("iviewparams000F1"), sqlParStr, "parent");
                SetFieldValue("Def_Table_paramsmain000F1", sqlParStr);
                UpdateFieldArray("Def_Table_params000F1", GetFieldsRowNo("Def_Table_params000F1"), sqlParStr, "parent");
            }
            if ($("#paramscal000F1").val() != sqlParStr) {
                SetFieldValue("paramscal000F1", sqlParStr);
                UpdateFieldArray("paramscal000F1", GetFieldsRowNo("paramscal000F1"), sqlParStr, "parent");
                SetFieldValue("Def_Table_params000F1", sqlParStr);
                UpdateFieldArray("Def_Table_params000F1", GetFieldsRowNo("Def_Table_params000F1"), sqlParStr, "parent");

                if (sqlParStr != "") {
                    if (parent.$("#actbtn_nextclk.dwbIvBtnbtm:visible").length > 0 || parent.$("#btn_nxclkDuplicate.dwbIvBtnbtm:visible").length > 0) {
                        parent.$("#actbtn_nextclk.dwbIvBtnbtm").hide();
                        $(callParentNew("btn_nxclkDuplicate")).show();
                    }
                    // else {
                    //     parent.$("#actbtn_iSave.dwbIvBtnbtm").hide();
                    //     $(callParentNew("btn_iSDuplicate")).show();
                    // }

                    FieldTypeTable(event, $("#Def_Table_params000F1"));
                } else {
                    customValidationFn($("#sql_editor_iviewsql000F1")[0]);
                }
            } else {
                customValidationFn($("#sql_editor_iviewsql000F1")[0]);
            }
        });
    }

    if (transid == 'ad_iq') {
        $("#Def_Table_paramsmain000F1").addClass("fldCustTable");
        var dfName = GetFieldsName("Def_Table_paramsmain000F1");
        var dfldIndex = $j.inArray(dfName, FNames);
        var tjson = "{\"props\":{\"type\":\"table\",\"colcount\":\"3\",\"rowcount\":\"1\",\"addrow\":\"f\",\"deleterow\":\"f\",\"valueseparator\":\"~\",\"rowseparator\":\",\"},\"columns\":{\"1\":{\"caption\":\"Parameter Name\",\"name\":\"paraname\",\"value\":\"\",\"source\":\"\",\"exp\":\"\",\"vexp\":\"\"},\"2\":{\"caption\":\"Data Type\",\"name\":\"datatypefld\",\"value\":\"\",\"source\":\"ddldatatype\",\"exp\":\"\",\"vexp\":\"\"},\"3\":{\"caption\":\"Value\",\"name\":\"valuefld\",\"value\":\"\",\"source\":\"\",\"exp\":\"\",\"vexp\":\"\"}}}";
        FTableTypeVal[dfldIndex] = tjson;
        var dfldHtml = $("#Def_Table_paramsmain000F1").parent().html();
        dfldHtml = dfldHtml.replace("<input ", "<div class=\"autoinput-parent\"><input ") + "<div class=\"edit\"><i class=\"glyphicon glyphicon-th\" title=\"select\" data-clk=\"Def_Table_paramsmain000F1-tbl\"></i></div></div>";
        $("#Def_Table_paramsmain000F1").parent().html(dfldHtml);

        $("#sql_editor_iviewsqlmain000F1").on("focusout", function (event) {
            var sqlParStr = "";
            try {
                if ($(this).val() != "" && ($(this).val().replace(/'(.*?)'/g, "''").match(/(:)+[a-zA-Z0-9_]{1,}/g) || []).filter(v => v.indexOf("::") != 0).length > 0) {
                    sqlParStr = _.uniqBy($(this).val().replace(/'(.*?)'/g, "''").match(/(:)+[a-zA-Z0-9_]{1,}/g).filter(v => v.indexOf("::") != 0).map((val) => val.replace(/[:\s]/g, ""))).join(",");
                }
                if ($(this).val() != "" && ($(this).val().replace(/'(.*?)'/g, "''").match(/(\{(?:\[??[^\[]*?\}))*/g) || []).filter(v => v).length > 0) {
                    sqlParStr = (sqlParStr ? (sqlParStr + ",") : "") + _.uniqBy($(this).val().replace(/'(.*?)'/g, "''").match(/(\{(?:\[??[^\[]*?\}))*/g).map((val) => val.replace(/[{\s]/g, "").replace(/[}\s]/g, ""))).filter(v => v).join(",");
                }
                // sqlParStr = sqlParStr.endsWith(",") ? sqlParStr.substr(0, sqlParStr.length - 1) : sqlParStr;

                // if($("#paramscal000F1").val() == ""){
                sqlParStr = sqlParStr.split(",").map(par => par && `${par}~Character~`).join(",");
                // }
            } catch (error) {

            }
            if (sqlParStr == "") {
                SetFieldValue("iviewparams000F1", sqlParStr);
                UpdateFieldArray("iviewparams000F1", GetFieldsRowNo("iviewparams000F1"), sqlParStr, "parent");
                SetFieldValue("Def_Table_paramsmain000F1", sqlParStr);
                UpdateFieldArray("Def_Table_paramsmain000F1", GetFieldsRowNo("Def_Table_paramsmain000F1"), sqlParStr, "parent");
            }
            if ($("#paramscal000F1").val() != sqlParStr) {
                SetFieldValue("paramscal000F1", sqlParStr);
                UpdateFieldArray("paramscal000F1", GetFieldsRowNo("paramscal000F1"), sqlParStr, "parent");
                SetFieldValue("Def_Table_paramsmain000F1", sqlParStr);
                UpdateFieldArray("Def_Table_paramsmain000F1", GetFieldsRowNo("Def_Table_paramsmain000F1"), sqlParStr, "parent");

                if (sqlParStr != "") {
                    if (parent.$("#actbtn_nextclk.dwbIvBtnbtm:visible").length > 0 || parent.$("#btn_nxclkDuplicate.dwbIvBtnbtm:visible").length > 0) {
                        parent.$("#actbtn_nextclk.dwbIvBtnbtm").hide();
                        $(callParentNew("btn_nxclkDuplicate")).show();
                    }
                    // else {
                    //     parent.$("#actbtn_iSave.dwbIvBtnbtm").hide();
                    //     $(callParentNew("btn_iSDuplicate")).show();
                    // }

                    FieldTypeTable(event, $("#Def_Table_paramsmain000F1"));
                } else {
                    customValidationFn($("#sql_editor_iviewsqlmain000F1")[0]);
                }
            } else {
                customValidationFn($("#sql_editor_iviewsqlmain000F1")[0]);
            }
        });
    }

    if (transid == "ad_ip") {
        $("#Def_Table_querycols000F1").addClass("fldCustTable");
        var dfName = GetFieldsName("Def_Table_querycols000F1");
        var dfldIndex = $j.inArray(dfName, FNames);
        var tjson = "{\"props\":{\"type\":\"table\",\"colcount\":\"3\",\"rowcount\":\"1\",\"addrow\":\"f\",\"deleterow\":\"f\",\"valueseparator\":\"~\",\"rowseparator\":\",\"},\"columns\":{\"1\":{\"caption\":\"Parameter Name\",\"name\":\"paraname\",\"value\":\"\",\"source\":\"\",\"exp\":\"\",\"vexp\":\"\"},\"2\":{\"caption\":\"Data Type\",\"name\":\"datatypefld\",\"value\":\"\",\"source\":\"ddldatatype\",\"exp\":\"\",\"vexp\":\"\"},\"3\":{\"caption\":\"Value\",\"name\":\"valuefld\",\"value\":\"\",\"source\":\"\",\"exp\":\"\",\"vexp\":\"\"}}}";
        FTableTypeVal[dfldIndex] = tjson;
        var dfldHtml = $("#Def_Table_querycols000F1").parent().html();
        dfldHtml = dfldHtml.replace("<input ", "<div class=\"autoinput-parent\"><input ") + "<div class=\"edit\"><i class=\"glyphicon glyphicon-th\" title=\"select\" data-clk=\"Def_Table_params000F1-tbl\"></i></div></div>";
        $("#Def_Table_querycols000F1").parent().html(dfldHtml);

        $("#SQL_editor_paramsql000F1").on("focusout", function (event) {
            var sqlParStr = "", paramsForSQL = "";
            try {
                if ($(this).val() != "" && ($(this).val().replace(/'(.*?)'/g, "''").match(/(:)+[a-zA-Z0-9_]{1,}/g) || []).filter(v => v.indexOf("::") != 0).length > 0) {
                    sqlParStr = _.uniqBy($(this).val().replace(/'(.*?)'/g, "''").match(/(:)+[a-zA-Z0-9_]{1,}/g).filter(v => v.indexOf("::") != 0).map((val) => val.replace(/[:\s]/g, ""))).join(",");
                }
                if ($(this).val() != "" && ($(this).val().replace(/'(.*?)'/g, "''").match(/(\{(?:\[??[^\[]*?\}))*/g) || []).filter(v => v && v.toLowerCase().indexOf("dynamicfilter") != 0).length > 0) {
                    sqlParStr = (sqlParStr ? (sqlParStr + ",") : "") + _.uniqBy($(this).val().replace(/'(.*?)'/g, "''").match(/(\{(?:\[??[^\[]*?\}))*/g).map((val) => val.replace(/[{\s]/g, "").replace(/[}\s]/g, ""))).filter(v => v && v.toLowerCase().indexOf("dynamicfilter") != 0).join(",");
                }

                paramsForSQL = sqlParStr.split(",").map(par => {
                    let ivPJSON = callParentNew("ivParamsJSON");
                    if (par)
                        return ivPJSON.filter(leftPar => leftPar.pname == par).length == 0 ? `${par}~Character~` : ""
                }).filter(par => par).join(",");

            } catch (error) { }

            if (paramsForSQL == "") {
                SetFieldValue("iviewparams000F1", paramsForSQL);
                UpdateFieldArray("iviewparams000F1", GetFieldsRowNo("iviewparams000F1"), paramsForSQL, "parent");
                UpdateFieldArray("Def_Table_querycols000F1", GetFieldsRowNo("Def_Table_querycols000F1"), paramsForSQL, "parent");
            }

            if ($("#paramscal000F1").val() != paramsForSQL) {
                SetFieldValue("paramscal000F1", paramsForSQL);
                UpdateFieldArray("paramscal000F1", GetFieldsRowNo("paramscal000F1"), paramsForSQL, "parent");
                SetFieldValue("Def_Table_querycols000F1", paramsForSQL);
                UpdateFieldArray("Def_Table_querycols000F1", GetFieldsRowNo("Def_Table_querycols000F1"), paramsForSQL, "parent");

                if (paramsForSQL != "") {
                    if (parent.$("#actbtn_iSave.dwbIvBtnbtm:visible").length > 0 || parent.$("#btn_iSDuplicate.dwbIvBtnbtm:visible").length > 0) {
                        parent.$("#actbtn_iSave.dwbIvBtnbtm").hide();
                        $(callParentNew("btn_iSDuplicate")).show();
                    }
                    FieldTypeTable(event, $("#Def_Table_querycols000F1"));
                } else {
                    customValidationFn($("#SQL_editor_paramsql000F1")[0]);
                }
            } else {
                customValidationFn($("#SQL_editor_paramsql000F1")[0]);
            }
        });
    }

    if (transid == 'b_sql') {
        $("#sqlparams000F1").addClass("fldCustTable");
        var dfName = GetFieldsName("sqlparams000F1");
        var dfldIndex = $j.inArray(dfName, FNames);
        var tjson = "{\"props\":{\"type\":\"table\",\"colcount\":\"3\",\"rowcount\":\"1\",\"addrow\":\"f\",\"deleterow\":\"f\",\"valueseparator\":\"~\",\"rowseparator\":\",\"},\"columns\":{\"1\":{\"caption\":\"Parameter Name\",\"name\":\"paraname\",\"value\":\"\",\"source\":\"\",\"exp\":\"\",\"vexp\":\"\"},\"2\":{\"caption\":\"Value\",\"name\":\"valuefld\",\"value\":\"\",\"source\":\"\",\"exp\":\"\",\"vexp\":\"\"}}}";
        FTableTypeVal[dfldIndex] = tjson;
        var dfldHtml = $("#sqlparams000F1").parent().html();
        dfldHtml = dfldHtml.replace("<input ", "<div class=\"autoinput-parent\"><input ") + "<div class=\"edit\"><i class=\"glyphicon glyphicon-th\" title=\"select\" data-clk=\"sqlparams000F1-tbl\"></i></div></div>";
        $("#sqlparams000F1").parent().html(dfldHtml);

        $("#sqltext000F1").on("focusout", function (event) {
            var sqlParStr = "";
            try {
                if ($(this).val() != "" && ($(this).val().replace(/'(.*?)'/g, "''").match(/(:)+[a-zA-Z0-9_]{1,}/g) || []).filter(v => v.indexOf("::") != 0).length > 0) {
                    sqlParStr = _.uniqBy($(this).val().replace(/'(.*?)'/g, "''").match(/(:)+[a-zA-Z0-9_]{1,}/g).filter(v => v.indexOf("::") != 0).map((val) => val.replace(/[:\s]/g, ""))).join(",");
                }
                if ($(this).val() != "" && ($(this).val().replace(/'(.*?)'/g, "''").match(/(\{(?:\[??[^\[]*?\}))*/g) || []).filter(v => v).length > 0) {
                    sqlParStr = (sqlParStr ? (sqlParStr + ",") : "") + _.uniqBy($(this).val().replace(/'(.*?)'/g, "''").match(/(\{(?:\[??[^\[]*?\}))*/g).map((val) => val.replace(/[{\s]/g, "").replace(/[}\s]/g, ""))).filter(v => v).join(",");
                }
                // sqlParStr = sqlParStr.endsWith(",") ? sqlParStr.substr(0, sqlParStr.length - 1) : sqlParStr;

                // if($("#paramscal000F1").val() == ""){
                sqlParStr = sqlParStr.split(",").map(par => par && `${par}`).join(",");
                // }
            } catch (error) {

            }

            if (sqlParStr == "") {
                // SetFieldValue("iviewparams000F1", sqlParStr);
                // UpdateFieldArray("iviewparams000F1", GetFieldsRowNo("iviewparams000F1"), sqlParStr, "parent");
                SetFieldValue("sqlparams000F1", sqlParStr);
                UpdateFieldArray("sqlparams000F1", GetFieldsRowNo("sqlparams000F1"), sqlParStr, "parent");
            }
            if ($("#paramcal000F1").val() != sqlParStr) {
                SetFieldValue("paramcal000F1", sqlParStr);
                UpdateFieldArray("paramcal000F1", GetFieldsRowNo("paramcal000F1"), sqlParStr, "parent");
                SetFieldValue("sqlparams000F1", sqlParStr);
                UpdateFieldArray("sqlparams000F1", GetFieldsRowNo("sqlparams000F1"), sqlParStr, "parent");

                if (sqlParStr != "") {
                    if (parent.$("#actbtn_nextclk.dwbIvBtnbtm:visible").length > 0 || parent.$("#btn_nxclkDuplicate.dwbIvBtnbtm:visible").length > 0) {
                        parent.$("#actbtn_nextclk.dwbIvBtnbtm").hide();
                        $(callParentNew("btn_nxclkDuplicate")).show();
                    }
                    // else {
                    //     parent.$("#actbtn_iSave.dwbIvBtnbtm").hide();
                    //     $(callParentNew("btn_iSDuplicate")).show();
                    // }

                    FieldTypeTable(event, $("#sqlparams000F1"));
                } else {
                    customValidationFn($("#sqltext000F1")[0]);
                }
            } else {
                customValidationFn($("#sqltext000F1")[0]);
            }
        });
    }

    if (transid == 'paget') {
        if (recordid != "" && callParentNew("dwbtstdctable") != "") {
            callParentNew("dwbtstdctable=", "");
            parent.$j("#btn_readtstructdef").click();
        }
        else {
            $('#myModal').modal('show');
            $('.modal-dialog').css({ 'width': '98%' });
        }
    }

    if (transid == "sect") {
        $("#wBdr").addClass("htmlPagesCls");
        ToggleWizardDc("3", "hide");

        var customButtons = `
        <button onclick="previewHtmlPage();" class="hpCustBtns" type="button" id="previewHtmlPageId" title="Preview"><span class="material-icons">preview</span><span class="hpCustBtnsText">Preview</span></button>
        
        <button onclick="addCssJs(this.id);" class="hpCustBtns" type="button" id="addCssRow" title="Add Css"><span class="material-icons">code</span><span class="hpCustBtnsText">Add Css</span></button>

        <button onclick="addCssJs(this.id);" class="hpCustBtns" type="button" id="addJsRow" title="Add Js"><span class="material-icons">code</span><span class="hpCustBtnsText">Add Js</span></button>
        `;
        $(".wizardNextPrevWrapper").prepend(customButtons);
        $("#addCssRow, #addJsRow").hide();

        // To overwrite image upload axpfilepath
        let HPImagePath = $("#hdnAxpertWebDirPath").val() + callParentNew("webProject") + "\\HTMLPages\\images\\*";
        SetFieldValue("AxpFilePath_hpImages000F1", HPImagePath);
        UpdateFieldArray("AxpFilePath_hpImages000F1", "000", HPImagePath, "parent", "");

        if (recordid != "0") {
            pageNo = GetFieldValue("pageno000F1");
            loadcontentsFromFile();
            $(`#${htmlObj.fields.templateBtn}`).prop("disabled", true);
        }
        else if (recordid == "0") {
            pageNo = Date.now().toString();
            SetFieldValue("pageno000F1", pageNo);
            UpdateFieldArray("pageno000F1", GetFieldsRowNo("pageno000F1"), pageNo, "parent");
            $(`#${htmlObj.fields.templateBtn}`).removeAttr("onclick").attr("onclick", "selectTemplate()");
        }
    }

    if (transid == "axcad") {
        if (recordid != "0") {
            let _cartType = $("#cardtype000F1");
            _cartType.prop("disabled", true);
            _cartType.attr("readOnly", "readOnly");
        }
        cardFieldsShowHideLogic();

        cardBackgroundPickerLogic();

        // To overwrite image upload axpfilepath
        let cardsImagePath = $("#hdnAxpertWebDirPath").val() + callParentNew("webProject") + "\\ImageCard\\*";
        SetFieldValue("axpfilepath_imgcard000F1", cardsImagePath);
        UpdateFieldArray("axpfilepath_imgcard000F1", "000", cardsImagePath, "parent", "");
    }

    if (transid == "ad_tb" || transid == "ad_tg" || transid == "axcad") {
        loadAndCall({
            files: {
                css: ["/Css/iconPopup.css"],
                js: ["/Js/iconPopup.js"]
            },
            callBack() { }
        });
        $("html").on('click', '.changeBtnIcon', function () {
            (transid == "axcad") ? createIconPopup('uploadIcon', 'hdnUserIconList', $('#hdnIconPath').val()) : createIconPopup("", "", "");
        });

        if (transid == "ad_tg") {
            var grpBtnFldId = "#grpicon000F1";
            var grpBtnFldHTML = $(grpBtnFldId).parent().html();
            var oldIconName = $(grpBtnFldId).val() != "" ? $(grpBtnFldId).val() : "folder_open";
            grpBtnFldHTML = grpBtnFldHTML.replace("<input ", `<div class="autoinput-parent"><input `) + `<div class="edit"><span id="changGrpIcon000F1" class="material-icons changeBtnIcon" style="top:-5px;position:relative;">` + oldIconName + `</span></div></div>`;
            $(grpBtnFldId).parent().html(grpBtnFldHTML).addClass("customIconFld");
        }

        if (transid == "axcad") {
            var iconBtnFldId = "#cardicon000F1";
            var iconBtnFldHTML = $(iconBtnFldId).parent().html();
            var oldIconName = $(iconBtnFldId).val() != "" ? $(iconBtnFldId).val() : "";
            iconBtnFldHTML = iconBtnFldHTML.replace("<input ", `<div class="autoinput-parent"><input `) + `<div class="edit"><span id="changCardicon000F1" class="material-icons changeBtnIcon" style="top:-5px;position:relative;">` + (oldIconName || "arrow_circle_up") + `</span></div></div>`;
            $(iconBtnFldId).parent().html(iconBtnFldHTML).addClass("customIconFld");
            $(iconBtnFldId).val(oldIconName);
        }
    }

    if (transid == "ad_iq" || transid == "ad_ip" || transid == "ad_ic" || transid == "ad_ia" || transid == "ad_sc" || transid == "ad_is") {
        try {
            dwbIvDefName = GetFieldValue("iname000F1") || GetFieldValue("hiname000F1");
            capName = ("- " + GetFieldValue("icaption000F1")) || ("(" + dwbIvDefName + ")");
        } catch (ex) { }

        $(callParentNew("developerbreadcrumbTitle", "class")).text("Iviews " + capName);
    }

    if (transid == "ad_if" || transid == "ad_ic" || transid == "ad_is") {

        loadAndCall({
            files: {
                css: ["/ThirdParty/seballot-spectrum/spectrum.css", "/Css/fontColorPicker.min.css?v=2"],
                js: ["/ThirdParty/seballot-spectrum/spectrum.js", "/Js/fontColorPicker.min.js?v=1"]
            },
            callBack() {
                if (transid == "ad_ic") {
                    var iconBtnFldId = "#font000F1"; // "#font001F2                
                    var oldValue = $(iconBtnFldId).val();

                    $(iconBtnFldId).wrap(`<div class="autoinput-parent"></div>`).parent().append(`<div class="edit changeFontSettings" title="${(new Stages()).fontPicker.title}" data-toggle="tooltip" data-font-picker-type="${"properties"}" data-id="${iconBtnFldId}" data-value="${oldValue}" onclick="${(new Stages()).fontPicker.call.generate}"><span class="material-icons functionalityPicker" style="top:-5px;position:relative;">format_paint</span></div>`);

                    var iconBtnFldId = "#color000F1"; // "#color000F1                                             
                    var bkpValue = $(iconBtnFldId).val();
                    var oldValue = (new PropertySheet())._parseHexAndDelphiColors(bkpValue, true);
                    $(iconBtnFldId).attr("value", oldValue).val(oldValue);

                    (new PropertySheet()).initializeColorPicker($(iconBtnFldId));
                }
            }
        });
    }

    if (transid == "ad_ia") {
        var iconBtnFldId = "#axpiv_sub_caption000F1"; // "#axpiv_sub_caption000F1              
        var oldValue = $(iconBtnFldId).val();
        $(iconBtnFldId).wrap(`<div class="autoinput-parent"></div>`).parent().append(`<div class="edit ivSubCaptionPopUp" title="iview sub caption" data-id="${iconBtnFldId}" data-value="${oldValue}" onclick="generateSubCaptionPopUp()"><span class="material-icons" style="top:-5px;position:relative;">mode_comment</span></div>`);
        $(iconBtnFldId).parent().html(iconBtnFldHTML).addClass("customIconFld");
    }

    if (transid == "apidg") {
        $(".dvdcframe input:button").attr("onclick", "javascript:ExecuteOnClick()");
        $("#APIAxpertSample000F1").val("{\"data\":[{\"i\":\"admin\",\"v\":\"\"},{\"i\":\"User1\",\"v\":\"\"},{\"i\":\"User2\",\"v\":\"\"}]}");
        $("#APIAxpertSample000F1").attr('readonly', true);
    }

    if (transid == "ad_db") {
        $("#btn18").attr("onclick", "javascript:GetAppDbVars();");
        $("#btn18").attr("title", "Click here to get defined DB level variables.");
    }

    if (transid == "ad_cg" || transid == "ad_cs" || transid == "axrul") {
        $('#tstToolBarBtn').show();
    }

    if (transid == "ad_lg") {
        $("#wizardCancelbtn").css({ "display": "none" });
        $("#btn24").css({ "display": "none" });
        $("#btn23").attr("title", "After upload please click on view log button to get the status. Based on the status you can use the below button to publish language to runtime schema.");
        if (typeof $($("#exportfiles000F2")) != "undefined" && $($("#exportfiles000F2")).attr("id") == "exportfiles000F2") {
            let allselectedOpt = $("#exportfiles000F2").val();
            if (allselectedOpt != "" && allselectedOpt.indexOf("All tstructs") > -1) {
                $("#tstructcap000F2").parents('.grid-stack-item').addClass("hide");
            } else if (allselectedOpt != "" && allselectedOpt.indexOf("Selected tstructs") > -1) {
                $("#tstructcap000F2").parents('.grid-stack-item').removeClass("hide");
            }
            if (allselectedOpt != "" && allselectedOpt.indexOf("All iviews") > -1) {
                $("#iviewcap000F2").parents('.grid-stack-item').addClass("hide");
            } else if (allselectedOpt != "" && allselectedOpt.indexOf("Selected iviews") > -1) {
                $("#iviewcap000F2").parents('.grid-stack-item').removeClass("hide");
            }
        }
    }

    if (transid == 'ad_s' && recordid != "" && recordid != "0") {
        if ($("#control_type000F1").val() == "T") {
            let _fcEditorVal = $("#exp_editor_fcscript000F1").val();
            let _ScrEditorVal = $("#exp_editor_script000F1").val();
            if (_fcEditorVal == "" && _ScrEditorVal != "") {
                SetFieldValue("exp_editor_fcscript000F1", _ScrEditorVal);
                UpdateFieldArray("exp_editor_fcscript000F1", GetFieldsRowNo("exp_editor_fcscript000F1"), _ScrEditorVal, "parent");
            }
        }
    }
}

function AxAfterLoadTab(CurrTabNo) {
    if (transid == "sect") {
        if (CurrTabNo == 1) {
            $("#addCssRow, #addJsRow").hide();
        }
        if (CurrTabNo == 2) {
            $("#wizardBodyContent").append($("#DivFrame3").detach());
            $("#addCssRow, #addJsRow").show();
            htmlObj.template.name = GetFieldValue(`${htmlObj.fields.template}`);
            if (htmlObj.template.name != "" && !+recordid) {
                htmlObj.template.flag = true;
                SetFieldValue(`${htmlObj.fields.template}`, htmlObj.template.name);
                UpdateFieldArray(`${htmlObj.fields.template}`, GetFieldsRowNo(`${htmlObj.fields.template}`), htmlObj.template.name, "parent");
                $("#DivFrame3").hide();
                loadcontentsFromFile();
                htmlCodeMirror.getDoc().setValue($(`#${htmlObj.fields.htmlCm}`).val());
                htmlObj.template.files.html = htmlObj.template.files.html == "" ? $(`#${htmlObj.fields.htmlCm}`).val() : htmlObj.template.files.html;
            } else if (recordid == "0" || (recordid != "0" && DCHasDataRows[2].toLowerCase() == "false")) {
                $("#DivFrame3").hide();
            }
            else {
                $("#DivFrame3").show();
            }
            setTimeout(() => {
                htmlCodeMirror != "" ? htmlCodeMirror.refresh() : "";
                cssCodeMirror != "" ? cssCodeMirror.refresh() : "";
                jsCodeMirror != "" ? jsCodeMirror.refresh() : "";
            }, 0);
        }
    }
}

function AxBeforeSave() {
    if (transid == "sect") {
        return validateHtmlPage;
    }
}

/* save redirection for htmlpages and hyperlinks in iview builder */
function dwbCustomSaveRedirect() {
    if (transid == "sect") {
        var htmlContent = htmlCodeMirror.getValue();
        htmlContent = htmlContent.replace(/&/g, '&amp;');
        var domParser = new DOMParser();
        var dom = "";
        if (htmlContent.trim() != "") {
            dom = domParser.parseFromString(htmlContent, 'text/html');
        }
        var cssContents = [], jsContents = [], isNewPage = true;
        var headTag = dom.getElementsByTagName('head')[0];
        var bodyTag = dom.getElementsByTagName('body')[0];
        let HtmlDirPath = "../../" + callParentNew("webProject") + "/HTMLPages/";
        $(".formGridRow").each(function () {
            var fileExt = $(this).find("[id^='filetype']").val().toLowerCase();
            var fileName = $(this).find("[id^='filename']").val().replace(/ /g, "_") + "_" + pageNo + "." + fileExt;
            var content = $(this).find("textarea[id^='css_js_src']").val();
            if (fileExt == "css") {
                cssFileName.push(fileName);
                cssContents.push(content);

                $(headTag).find("link[href*='/" + fileName + "']").remove();

                var linkTag = dom.createElement("link");
                linkTag.setAttribute("type", "text/css");
                linkTag.setAttribute("rel", "stylesheet");
                linkTag.setAttribute("href", HtmlDirPath + "Css/" + fileName + "?v=" + (new Date()).getTime());
                headTag.append("\t");
                headTag.appendChild(linkTag);
                headTag.append("\n");
            }
            else if (fileExt == "js") {
                jsFileName.push(fileName);
                jsContents.push(content);

                $(bodyTag).find("script[src*='/" + fileName + "']").remove();

                var scriptTag = dom.createElement("script");
                scriptTag.setAttribute("type", "text/javascript");
                scriptTag.setAttribute("src", HtmlDirPath + "Js/" + fileName + "?v=" + (new Date()).getTime());
                bodyTag.append("\t");
                bodyTag.appendChild(scriptTag);
                bodyTag.append("\n");
            }
        });

        htmlContent = dom.documentElement.outerHTML;
        pageCaption = GetFieldValue("caption000F1");
        var addToMenu = GetFieldValue("isacoretrans000F1") == "Yes" ? true : false;
        if (recordid != "0") {
            isNewPage = false;
        }
        try {
            $.ajax({
                type: "POST",
                url: "tstruct.aspx/htmlPagePublish",
                data: JSON.stringify({
                    htmlContent, cssFileName, cssContents, jsFileName, jsContents, pageCaption, addToMenu, pageNo, isNewPage
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.d == "done") {
                        //ShowDialog("success", "HTML Pages Saved");
                        cssFileName = [], cssContents = [], jsFileName = [], jsContents = [];
                        SetFormDirty(false);
                        // NewTstruct(); /* Task ID-008205 */
                    }
                    else {
                        ShowDialog("error", response.d);
                        SetFormDirty(false);
                    }
                },
                error: function (error) {
                    ShowDialog("error", "Error occurred while saving..!");
                }
            });
        }
        catch (e) {
            ShowDialog("error", "Exception occurred while saving");
        }
    }
    else if (transid == "ad_ih") {
        ShowDialog("success", "HyperLinks Saved");
        SetFormDirty(false);
        callParentNew("getIvDefParamsNColumns(" + (callParentNew("middle1", "id")?.contentWindow?.dwbIvDefName || callParentNew("dwbIvDefName")) + ",ad_ic)", "function");
    }
    else {
        ShowDialog("success", result);
        SetFormDirty(false);
    }
}

/* delete redirection for htmlpages and hyperlinks in iview builder */
function dwbCustomDeleteRedirect() {
    if (transid == "sect") {
        if (pageNo != "") {
            try {
                $.ajax({
                    type: "POST",
                    url: "tstruct.aspx/removeFromMenuAndFolder",
                    data: JSON.stringify({
                        pageNo
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        if (response.d == "done") {
                            window.location.href = "ivtoivload.aspx?ivname=hplist";
                        }
                        else {
                            ShowDialog("error", response.d);
                        }
                    },
                    error: function (error) {
                        ShowDialog("error", "Error while removing the file..!");
                    }
                });
            }
            catch (ex) {
                ShowDialog("error", "Error while removing the file..! " + ex);
            }
        }
        else {
            ShowDialog("error", "page number not found");
        }
    } else if (transid == "ad_ih") {
        callParentNew("getIvDefParamsNColumns(" + (callParentNew("middle1", "id")?.contentWindow?.dwbIvDefName || callParentNew("dwbIvDefName")) + ",ad_ic)", "function");
    } else {
        ShowDialog("error", "Error while deleting..!");
    }
}

/**
 * @description: function to show / hide fields based on card type selection
 * @author Prashik
 * @date 14/04/2021
 */
function cardFieldsShowHideLogic() {
    let cardField = $("#cardtype000F1");
    let cardFieldValue = GetFieldValue(cardField.attr("id"));

    switch (cardFieldValue) {
        case "":
            HideShowField("charttype", "show");
            HideShowField("chartprops", "show");

            HideShowField("SQL_editor_cardsql", "show");
            HideShowField("html_editor_card", "hide");

            HideShowField("pagecaption", "show");
            HideShowField("pagedesc", "show");

            HideShowField("hcaption", "hide");
            HideShowField("htype", "hide");
            HideShowField("htranstypeui", "hide");

            HideShowField("axpfile_imgcard", "hide");

            HideShowField("cardbgclr", "show");

            HideShowField("calendarsource", "hide");
            ShowingDc("2", "hide");
            break;
        case "chart":
            HideShowField("charttype", "show");
            HideShowField("chartprops", "show");

            HideShowField("SQL_editor_cardsql", "show");
            HideShowField("html_editor_card", "hide");

            HideShowField("pagecaption", "hide");
            HideShowField("pagedesc", "hide");

            HideShowField("hcaption", "hide");
            HideShowField("htype", "hide");
            HideShowField("htranstypeui", "hide");

            HideShowField("axpfile_imgcard", "hide");

            HideShowField("cardbgclr", "hide");

            HideShowField("calendarsource", "hide");
            ShowingDc("2", "hide");
            break;
        case "menu":
            HideShowField("charttype", "hide");
            HideShowField("chartprops", "hide");

            HideShowField("SQL_editor_cardsql", "hide");
            HideShowField("html_editor_card", "hide");

            HideShowField("pagecaption", "show");
            HideShowField("pagedesc", "show");

            HideShowField("hcaption", "hide");
            HideShowField("htype", "hide");
            HideShowField("htranstypeui", "hide");

            HideShowField("axpfile_imgcard", "hide");

            HideShowField("cardbgclr", "show");

            HideShowField("calendarsource", "hide");
            ShowingDc("2", "hide");
            break;
        case "modern menu":
            HideShowField("charttype", "hide");
            HideShowField("chartprops", "hide");

            HideShowField("SQL_editor_cardsql", "hide");
            HideShowField("html_editor_card", "hide");

            HideShowField("pagecaption", "show");
            HideShowField("pagedesc", "hide");

            HideShowField("hcaption", "hide");
            HideShowField("htype", "hide");
            HideShowField("htranstypeui", "hide");

            HideShowField("axpfile_imgcard", "hide");

            HideShowField("cardbgclr", "show");

            HideShowField("calendarsource", "hide");
            ShowingDc("2", "hide");
            break;
        case "image card":
            HideShowField("charttype", "hide");
            HideShowField("chartprops", "hide");

            HideShowField("SQL_editor_cardsql", "hide");
            HideShowField("html_editor_card", "hide");

            HideShowField("pagecaption", "hide");
            HideShowField("pagedesc", "show");

            HideShowField("hcaption", "show");
            HideShowField("htype", "show");
            HideShowField("htranstypeui", "show");

            HideShowField("axpfile_imgcard", "show");

            HideShowField("cardbgclr", "show");
            HideShowField("calendarsource", "hide");
            ShowingDc("2", "hide");
            break;
        case "calendar":
            HideShowField("charttype", "hide");
            HideShowField("chartprops", "hide");

            HideShowField("SQL_editor_cardsql", "hide");
            HideShowField("html_editor_card", "hide");

            HideShowField("pagecaption", "hide");
            HideShowField("pagedesc", "hide");

            HideShowField("hcaption", "hide");
            HideShowField("htype", "hide");
            HideShowField("htranstypeui", "hide");

            HideShowField("axpfile_imgcard", "hide");

            HideShowField("cardbgclr", "hide");
            
            HideShowField("calendarsource", "show");
            ShowingDc("2", "hide");
            break;
        case "html":
            HideShowField("charttype", "hide");
            HideShowField("chartprops", "hide");

            HideShowField("SQL_editor_cardsql", "hide");
            HideShowField("html_editor_card", "show");

            HideShowField("pagecaption", "hide");
            HideShowField("pagedesc", "hide");

            HideShowField("hcaption", "hide");
            HideShowField("htype", "hide");
            HideShowField("htranstypeui", "hide");

            HideShowField("axpfile_imgcard", "hide");

            HideShowField("cardbgclr", "hide");

            HideShowField("calendarsource", "hide");
            ShowingDc("2", "hide");
            break;
        case "options card":
            HideShowField("charttype", "hide");
            HideShowField("chartprops", "hide");

            HideShowField("SQL_editor_cardsql", "show");
            HideShowField("html_editor_card", "hide");

            HideShowField("pagecaption", "hide");
            HideShowField("pagedesc", "hide");

            HideShowField("hcaption", "hide");
            HideShowField("htype", "hide");
            HideShowField("htranstypeui", "hide");

            HideShowField("axpfile_imgcard", "hide");

            HideShowField("cardbgclr", "show");

            HideShowField("calendarsource", "hide");
            ShowingDc("2", "show");
            setTimeout(() => {
                let buttonOptCM = CodeMirror.fromTextArea(document.getElementById("exp_editor_buttons000F2"), );
                buttonOptCM.refresh();
            }, 0);
            break;
        case "list":
        default:
            HideShowField("charttype", "hide");
            HideShowField("chartprops", "hide");

            HideShowField("SQL_editor_cardsql", "show");
            HideShowField("html_editor_card", "hide");

            HideShowField("pagecaption", "hide");
            HideShowField("pagedesc", "hide");

            HideShowField("hcaption", "hide");
            HideShowField("htype", "hide");
            HideShowField("htranstypeui", "hide");

            HideShowField("axpfile_imgcard", "hide");

            HideShowField("cardbgclr", "show");

            HideShowField("calendarsource", "hide");
            ShowingDc("2", "hide");
            break;
    }
}

function cardBackgroundPickerLogic() {
    if (transid == "axcad") {
        let bgObj = {
            red: {
                backgroundColor: "#D50000",
                color: "#fff"
            },
            pink: {
                backgroundColor: "#C51162",
                color: "#fff"
            },
            purple: {
                backgroundColor: "#AA00FF",
                color: "#fff"
            },
            blue: {
                backgroundColor: "#2962FF",
                color: "#fff"
            },
            cyan: {
                backgroundColor: "#00B8D4",
                color: "#000"
            },
            cream: {
                backgroundColor: "#fff9e7",
                color: "#000"
            },            
            "light-pink": {
                backgroundColor: "#feedf8",
                color: "#000"
            },
            "light-blue": {
                backgroundColor: "#f2fdff",
                color: "#000"
            },
            "light-green": {
                backgroundColor: "#eefcef",
                color: "#000"
            }
        };
        let bgcolorId = "cardbgclr000F1";

        $(`#${bgcolorId} option`).toArray().forEach((opt) => {
            bgObj[$(opt).html()] && $(opt).css(bgObj[$(opt).html()]);
        });
    }
}

function AxAfterInlineEditRow(gDcNo, gRowNo) {
    if (transid == "ad_tb") {
        var iconBtnFldId = "#btnicon" + gRowNo + "F" + gDcNo; // "#btnicon001F2
        var iconBtnFldHTML = $(iconBtnFldId).parent().html();
        var oldIconName = $(iconBtnFldId).val() != "" ? $(iconBtnFldId).val() : "task_alt";
        iconBtnFldHTML = iconBtnFldHTML.replace("<input ", `<div class="autoinput-parent"><input `) + `<div class="edit"><span id="changeBtnIcon` + gRowNo + `F` + gDcNo + `" class="material-icons changeBtnIcon" style="top:-5px;position:relative;">` + oldIconName + `</span></div></div>`;
        $(iconBtnFldId).parent().html(iconBtnFldHTML).addClass("customIconFld");
    }

    if (transid == "ad_if") {
        var iconBtnFldId = "#font" + gRowNo + "F" + gDcNo; // "#font001F2      
        var oldValue = $(iconBtnFldId).val();
        $(iconBtnFldId).prop("disabled", true).addClass("disabled").wrap(`<div class="autoinput-parent"></div>`).parent().append(`<div class="edit changeFontSettings" title="${(new Stages()).fontPicker.title}" data-toggle="tooltip" data-font-picker-type="${"colCondFormat"}" data-id="${iconBtnFldId}" data-value="${oldValue}" onclick="${(new Stages()).fontPicker.call.generate}"><span class="material-icons" style="top:-5px;position:relative;">format_paint</span></div>`);
        $(iconBtnFldId).parent().html(iconBtnFldHTML).addClass("customIconFld");
    }

    if (transid == "ad_is") {
        var iconBtnFldId = "#header_color" + gRowNo + "F" + gDcNo;
        var bkpValue = $(iconBtnFldId).val();
        var oldValue = (new PropertySheet())._parseHexAndDelphiColors(bkpValue, true);
        $(iconBtnFldId).attr("value", oldValue).val(oldValue);
        (new PropertySheet()).initializeColorPicker($(iconBtnFldId));
        $(iconBtnFldId).attr("value", bkpValue).val(bkpValue);

        var iconBtnFldId = "#footer_color" + gRowNo + "F" + gDcNo;
        var bkpValue = $(iconBtnFldId).val();
        var oldValue = (new PropertySheet())._parseHexAndDelphiColors(bkpValue, true);
        $(iconBtnFldId).attr("value", oldValue).val(oldValue);
        (new PropertySheet()).initializeColorPicker($(iconBtnFldId));
        $(iconBtnFldId).attr("value", bkpValue).val(bkpValue);
    }
}

function ExecuteOnClick() {
    let apimethod = $("#ExecAPIMethod000F1").val();
    if (apimethod == "") {
        ShowDialog("error", "Select API Method.");
        return;
    }
    let apiresp = $("#APIResponseFormat000F1").val();
    let apivalue = $("#ExecAPIURL000F1").val();
    if (apivalue == "") {
        ShowDialog("error", "API URL should not empty.");
        return;
    }

    ASB.WebService.GetDataFromExternalAPI(apivalue, apimethod, apiresp, SuccessGetExternalApi, OnException);

    //APIResponseString000F1
}

function SuccessGetExternalApi(result, eventArgs) {
    if (result != "") {
        $("#APIResponseString000F1").val(result);
        $("#APIResponseString000F1").attr('readonly', true);
    }
}

$(document).off('click').on("click", '.modal-content #iconWrapperData  span', function (event) {
    if (transid == "ad_tb") {
        var curIconRow = $(".changeBtnIcon").parent().parent().find("input").attr("id");
        $("#" + curIconRow).val($(this).text());
        var curIconRowNo = curIconRow.substring(curIconRow.length - 5, curIconRow.length - 2);
        SetFieldValue(curIconRow, $(this).text());
        UpdateFieldArray(curIconRow, curIconRowNo, $(this).text(), "parent", "AddRow");
        $("#changeBtnIcon" + curIconRowNo + "F2").text($(this).text()).attr('class', 'material-icons changeBtnIcon');
        closeModalDialog();
    }
    else if (transid == "ad_tg") {
        $("#grpicon000F1").val($(this).text());
        SetFieldValue("grpicon000F1", $(this).text());
        UpdateFieldArray("grpicon000F1", GetFieldsRowNo("grpicon000F1"), $(this).text(), "parent");
        $("#changGrpIcon000F1").text($(this).text()).attr('class', 'material-icons changeBtnIcon');
        closeModalDialog();
    // } else if (transid == "axcad") {
    //     $("#cardicon000F1").val($(this).text());
    //     SetFieldValue("cardicon000F1", $(this).text());
    //     UpdateFieldArray("cardicon000F1", GetFieldsRowNo("cardicon000F1"), $(this).text(), "parent");
    //     $("#changCardicon000F1").text($(this).text()).attr('class', 'material-icons changeBtnIcon');
    //     closeModalDialog();
    }
});

function clearCardCache(cardId, isDelete = false) {
    var accessString = GetFieldValue("accessstringui000F1").join(",");
    ASB.WebService.clearCardCache(cardId, accessString, isDelete, (succ) => { }, (err) => { });
}

function loadInMiddle1(redirectionLink, cmdJsonObj) {
    let tempTransId = (findGetParameter("transid", redirectionLink) || "");

    if (tempTransId == "ad_ip" || tempTransId == "ad_ic" || tempTransId == "ad_sc") {
        try {
            dwbIvDefName = GetFieldValue("iname000F1") || GetFieldValue("name000F1") || dwbIvDefName;
            capName = ("- " + GetFieldValue("icaption000F1")) || ("(" + dwbIvDefName + ")");
        } catch (ex) { }

        $(callParentNew("developerbreadcrumbTitle", "class")).text("Iviews " + capName);

        try {
            if (redirectionLink && findGetParameter("recordid", redirectionLink) == null && (tempRecId = parseInt($j("#recordid000F0")?.val() || 0)) && (typeof cmdJsonObj != "undefined" ? cmdJsonObj : [])?.filter(cmd => cmd.cmd == "recid").length > 0) {
                if ((typeof cmdJsonObj != "undefined" ? cmdJsonObj : [])?.filter(cmd => cmd.cmd == "opentstruct" && cmd.cmdval == transid).length > 0) {
                    redirectionLink = `${redirectionLink}&recordid=${tempRecId}`;
                }
            }
        } catch (ex) { }

        callParentNew("getIvDefParamsNColumns(" + dwbIvDefName + "," + (tempTransId || transid) + "," + redirectionLink + ")", "function");
        return true;
    } else {
        return false;
    }
}

function AxAfterBlur(fldObj) {
    if (transid == "ad_i" || transid == "ad_iq" || transid == "ad_ip") {
        let fldElm = fldObj[0];
        if (fldElm.id == "Def_Table_params000F1") {
            customValidationFn($("#sql_editor_iviewsql000F1")[0]);
        } else if (fldElm.id == "Def_Table_paramsmain000F1") {
            customValidationFn($("#sql_editor_iviewsqlmain000F1")[0]);
        } else if (fldElm.id == "Def_Table_querycols000F1") {
            customValidationFn($("#SQL_editor_paramsql000F1")[0]);
        }
    }
    else if (transid == "axapi") {
        let _armRestPath = callParentNew("armRestDllPath");
        let _mainRestPath = _armRestPath == "" ? callParentNew("restdllPath") : (_armRestPath.slice(-1) == "/" ? _armRestPath : _armRestPath + "/");
        if ($(fldObj).attr("id") == "dd_caption000F1") {
            if ($("#apicategory000F1").val() == "Get Dropdown data" && $("#dd_caption000F1").val() != "") {
                let servicePath = _mainRestPath + "ASBTStructRest.dll/datasnap/rest/TASBTStruct/GetDropDownValues";
                $("#apiurl000F1").val(servicePath);
                GetRequestJSON();
            }
            else if ($("#apicategory000F1").val() == "Get Dropdown data" && $("#dd_caption000F1").val() == "") {
                $("#apiurl000F1").val("");
                $("#reqformat000F1").val("");
            }
        }
        else if ($(fldObj).attr("id") == "sql_reffield000F1") {
            if ($("#apicategory000F1").val() == "Get SQL data" && $("#sql_reffield000F1").val() != "") {
                let servicePath = _mainRestPath + "ASBMenuRest.dll/datasnap/rest/TASBMenuRest/GetSqldata";
                $("#apiurl000F1").val(servicePath);
                GetSqlParamsRequestJSON();
            }
            else if ($("#apicategory000F1").val() == "Get SQL data" && $("#sql_reffield000F1").val() == "") {
                $("#apiurl000F1").val("");
                $("#reqformat000F1").val("");
            }
        }
        else if ($(fldObj).attr("id") == "apicategory000F1" && $("#apicategory000F1").val() == "Login") {
            let servicePath = _mainRestPath + "ASBMenuRest.dll/datasnap/rest/TASBMenuREST/login";
            $("#apiurl000F1").val(servicePath);

            $("#reqformat000F1").val('{"login": { "axpapp": "' + callParentNew("webProject") + '", "username": "' + callParentNew("mainUserName") + '", "password": "PASSWORD", "seed": "1983", "other": "chrome", "trace": "true" } }');

            $("#res_success000F1").val('{"result": { "status": "Success", "s": "' + sid + '", "ugroup": "default,designer", "uroles": "default,default", "EMAIL": "support@agile-labs.com" }}');

            $("#res_fail000F1").val('{"result":[{"error":{"status":"Failed","msg":"Invalid username or password"}}]}');
        }
        else if ($(fldObj).attr("id") == "formcaption000F1" && $("#formcaption000F1").val() != "" && $("#apicategory000F1").val() == "Submit data") {
            let servicePath = _mainRestPath + "ASBTStructRest.dll/datasnap/rest/TASBTStruct/savedata";
            $("#apiurl000F1").val(servicePath);
            GetSubmitDataRequestJSON();
        }
        else if ($(fldObj).attr("id") == "iviewcaption000F1" && $("#iviewcaption000F1").val() != "" && $("#apicategory000F1").val() == "Get Iview data") {
            let servicePath = _mainRestPath + "AsbIViewRest.dll/datasnap/rest/TASBIViewREST/getiview";
            $("#apiurl000F1").val(servicePath);
            GetIviewDataRequestJSON();
        }
        else if ($("#apicategory000F1").val() == "Execute Script") {

            if ($(fldObj).attr("id") == "page000F1") {
                $("#pagescriptname000F1").val("");
                $("#pagescript000F1").val("");
                $("#pagecaption000F1").val("");
                $("#apiurl000F1").val("");
                $("#reqformat000F1").val("");
            }
            else if ($(fldObj).attr("id") == "pagecaption000F1" && $("#pagecaption000F1").val() != "") {
                $("#pagescriptname000F1").val("");
                $("#pagescript000F1").val("");
                $("#apiurl000F1").val("");
                $("#reqformat000F1").val("");
            }
            else if ($(fldObj).attr("id") == "pagescript000F1" && $("#pagescriptname000F1").val() != "") {
                let servicePath = _mainRestPath + "ASBScriptRest.dll/datasnap/rest/TASBScriptRest/ScriptsAPI";
                $("#apiurl000F1").val(servicePath);
                GetScriptApiRequestJSON();
            }
            else if ($(fldObj).attr("id") == "pagescript000F1" && $("#pagescriptname000F1").val() == "") {
                $("#apiurl000F1").val("");
                $("#reqformat000F1").val("");
            }
        }
    }

    if (transid == "ad_lg" && typeof fldObj != "undefined" && $(fldObj).attr("id") == "exportfiles000F2") {
        let allselectedOpt = $("#exportfiles000F2").val();
        if (allselectedOpt != "" && allselectedOpt.indexOf("All tstructs") > -1) {
            $("#tstructcap000F2").parents('.grid-stack-item').addClass("hide");
        } else if (allselectedOpt != "" && allselectedOpt.indexOf("Selected tstructs") == -1) {
            $("#tstructcap000F2").parents('.grid-stack-item').addClass("hide");
        } else if (allselectedOpt != "" && allselectedOpt.indexOf("Selected tstructs") > -1) {
            $("#tstructcap000F2").parents('.grid-stack-item').removeClass("hide");
        }
        if (allselectedOpt != "" && allselectedOpt.indexOf("All iviews") > -1) {
            $("#iviewcap000F2").parents('.grid-stack-item').addClass("hide");
        } else if (allselectedOpt != "" && allselectedOpt.indexOf("Selected iviews") == -1) {
            $("#iviewcap000F2").parents('.grid-stack-item').addClass("hide");
        } else if (allselectedOpt != "" && allselectedOpt.indexOf("Selected iviews") > -1) {
            $("#iviewcap000F2").parents('.grid-stack-item').removeClass("hide");
        }
    }
}

function GetSqlParamsRequestJSON() {
    try {
        let custSqlName = $("#sql_reffield000F1").val();
        let isDropDown = $("#sql_output000F1").val();
        $.ajax({
            type: "POST",
            url: "tstruct.aspx/CreateSqlRequestJSON",
            data: JSON.stringify({
                custSqlName: custSqlName, isDropDown: isDropDown
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.d != "error") {
                    $("#reqformat000F1").val(response.d);
                }
                else {
                    ShowDialog("error", "Error while Getting request JSON!");
                }
            },
            error: function (error) {
                ShowDialog("error", "Error while Getting request JSON!");
            }
        });
    }
    catch (ex) {
        ShowDialog("error", "Error while Getting request JSON!" + ex);
    }
}


function GetRequestJSON() {
    try {
        let strtrId = $("#formcaption000F1").val();
        strtrId = strtrId.substr(strtrId.indexOf('(') + 1, strtrId.length);
        strtrId = strtrId.substr(0, strtrId.indexOf(')'));
        let trfldname = $("#dd_caption000F1").val();
        trfldname = trfldname.substr(trfldname.indexOf('(') + 1, trfldname.length);
        trfldname = trfldname.substr(0, trfldname.indexOf(')'));

        $.ajax({
            type: "POST",
            url: "tstruct.aspx/CreateRequestJSON",
            data: JSON.stringify({
                strTrId: strtrId, trFldName: trfldname
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.d != "error") {
                    $("#reqformat000F1").val(response.d);
                }
                else {
                    ShowDialog("error", "Error while Getting request JSON!");
                }
            },
            error: function (error) {
                ShowDialog("error", "Error while Getting request JSON!");
            }
        });
    }
    catch (ex) {
        ShowDialog("error", "Error while Getting request JSON!" + ex);
    }
}

function AxBeforeCallAction(actionName) {
    if (callParentNew("transid") == "ad_s" && $("#event000F1").val() != "" && $("#control_type000F1").val() == "F") {
        let textSqlandExpression = $("#exp_editor_script000F1").val();
        var FunScriptsAvoid = "";
        textSqlandExpression = textSqlandExpression.replaceAll(" ", "");
        $.each(ScriptsAvoidOnEvent, function (i, scrFunName) {
            if (textSqlandExpression.toLowerCase().indexOf(scrFunName) > -1) {
                FunScriptsAvoid = scrFunName;
                return false;
            }
        });
        if (FunScriptsAvoid != "") {
            FunScriptsAvoid = FunScriptsAvoid.slice(0, -1);
            showAlertDialog("error", FunScriptsAvoid + " function not allowed in selected event.");
            ShowDimmer(false);
            return false;
        }
    }else if(callParentNew("transid") == "ad_ip" && actionName == "iSave"){
        callParentNew("saveIvParamsOrder()", "function");
    }
}

function generateSubCaptionPopUp() {
    let subCaptionHTML = `
    <div class="subcaptionWrapper">
        <div class="subCaptionBody">
            <button type="button" class="btn btn-default waves-effect waves-circle waves-float addSubCaptionBtn" onclick="addIviewSubCaption();">
                <i class="material-icons">add</i>
            </button>                    
            <ul class="subCaptionUlList"></ul>
        </div>      
        
        <div class="subCaptionFooter">
            <div class="pull-right">
                <input type="button" name="btnFilter" value="Ok" onclick="updateSubCaptionField()" id="btnFilter" title="Ok" class="hotbtn btn handCursor allow-enter-key">
            </div>
            <div class="clearfix"></div>
        </div>
    </div> `;

    displayBootstrapModalDialog("Sub Caption", "md", "auto", false, subCaptionHTML, "", function () {
        let ivSubCapValue = [];
        try {
            ivSubCapValue = $("#axpiv_sub_caption000F1").parent().find(".ivSubCaptionPopUp").attr("data-value").split("~$~");
        } catch (ex) { }

        if (ivSubCapValue != "") {
            $.each(ivSubCapValue, function (ind, ele) {
                addIviewSubCaption(ele);
            });
        }
    });
}

function addIviewSubCaption(ele = "") {
    $(".subCaptionUlList").append(`
    <li class="ui-state-default subCaptionLi">
        <div class="subCapDragInd"> <span class="material-icons dragIcon">drag_indicator</span> </div>
        <div class="subCapInput"> <input type="text" class="form-control" value="${ele}" /> </div>
        <div class="subCapDelete"> <button type="button" class="editSaveCardDesign btn btn-default btn-circle waves-effect waves-circle waves-float" onclick="deleteIviewSubCaption(this);">
            <i class="material-icons">delete</i>
        </button> </div>
    </li>
    `);

    $(".subCaptionUlList").sortable({
        cursor: "move",
        update: function (event, ui) {
            // return true;
        },
    });
}

function deleteIviewSubCaption(elem) {
    $(elem).parents(".subCaptionLi").remove();
}

function updateSubCaptionField() {
    var subCaptionOrder = [];
    $.each($(".subCaptionUlList .subCaptionLi"), function (ind, ele) {
        subCaptionOrder.push($(ele).find(".subCapInput input").val());
    });
    subCaptionOrder = subCaptionOrder.join("~$~");

    $("#axpiv_sub_caption000F1").parent().find(".ivSubCaptionPopUp").attr("data-value", subCaptionOrder);
    SetFieldValue("axpiv_sub_caption000F1", subCaptionOrder);
    UpdateFieldArray("axpiv_sub_caption000F1", GetFieldsRowNo("axpiv_sub_caption000F1"), subCaptionOrder, "parent", "");
    closeModalDialog();
}

function iviewTemplate(colName = "ALL") {
    try {
        dwbIvDefName = GetFieldValue("iname000F1") || GetFieldValue("name000F1") || dwbIvDefName;
        capName = (GetFieldValue("icaption000F1")) || ("(" + dwbIvDefName + ")");
    } catch (ex) { }

    ivTempFrameHTML = `<div class="iviewTemplateWrapper"></div>`;

    var popWindow = parent.window;

    // if(colName != "ALL"){
    // popWindow = parent.window;
    // }

    popWindow.displayBootstrapModalDialog("Template", "xl", "500px", false, ivTempFrameHTML, false,
        () => {
            callParentNew("showDimmer(true)", "function");
            $(callParentNew("Bottomnavigationbar", "class")).addClass("hide");

            var iframe = document.createElement('iframe');

            $(iframe).attr("id", "iviewTemplate");
            $(iframe).addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12 iviewTemplateFrame");
            $(iframe).css("padding", "0px");
            $(iframe).attr("frameborder", "0");
            $(iframe).attr("allowtransparency", "True");

            popWindow.$(".iviewTemplateWrapper")[0].appendChild(iframe);

            let iframeWindow = iframe.contentWindow;

            // $(iframeWindow.document.getElementsByTagName("body")).attr("oncontextmenu", "return false;");

            iframeWindow.dwbiName = dwbIvDefName;
            iframeWindow.dwbiCaption = capName;
            iframeWindow.columnName = colName;

            popWindow.$(".modal-dialog").addClass("modal-template");
            popWindow.$(".modal-header").addClass("hide");
            let modalFooterHTML = `
            <div class="modal-footer form-inline">
                <div class="form-group pull-left text-left iview-Layout-Default-Prop hide">
                    <label for="templeteSelectWidth">Width</label>
                    <select id="templeteSelectWidth" class="form-control input-sm">
                        <option value="">100%</option>
                        <option value="11">90%</option>
                        <option value="10">85%</option>
                        <option value="9">75%</option>
                        <option value="8">70%</option>
                        <option value="7">60%</option>
                        <option value="6">50%</option>
                    </select>
                </div>
                <div class="form-group pull-left text-left iview-Layout-Default-Prop hide">
                    <label for="templeteSelectAlignment">Align</label>
                    <select id="templeteSelectAlignment" class="form-control input-sm">
                        <option value="">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>                
                
                <button type="button" class="btn hotbtn pull-right" onclick="$('.iviewTemplateWrapper').find('iframe')[0].contentWindow.processSave();">Save</button>
                <button type="button" class="btn coldbtn pull-right" data-dismiss="modal">Close</button>
                <button type="button" class="btn coldbtn pull-right layoutBackBtn hide" onclick="$('.iviewTemplateWrapper').find('iframe')[0].contentWindow.backToLayout();">Back</button>
                <button type="button" class="btn coldbtn pull-right hide" onclick="$('.iviewTemplateWrapper').find('iframe')[0].contentWindow.processDelete();">Delete</button>
            </div>`;
            popWindow.$(".modal-content").append(modalFooterHTML);

            loadAndCall({
                files: {
                    css: [
                        "/Css/thirdparty/bootstrap/3.3.6/bootstrap.min.css",
                        "/Css/Icons/icon.min.css",
                        "/Css/thirdparty/font-awesome/4.6.3/css/font-awesome.min.css",
                        "/ThirdParty/codemirror/codemirror.css",
                        "/ThirdParty/codemirror/addon/hint/show-hint.css",
                        "/Css/globalStyles.min.css?v=35",
                        "/Css/axDeveloperCustom.min.css?v=2",
                    ],
                    js: [
                        "/Js/thirdparty/jquery/3.1.1/jquery.min.js",
                        "/Js/noConflict.min.js",
                        "/Js/thirdparty/bootstrap/3.3.6/bootstrap.min.js",
                        "/Js/alerts.min.js?v=30",
                        "/ThirdParty/codemirror/codemirror.js",
                        "/ThirdParty/codemirror/addon/mode/overlay.js",
                        "/ThirdParty/codemirror/addon/hint/show-hint.js",
                        "/ThirdParty/codemirror/addon/hint/xml-hint.js",
                        "/ThirdParty/codemirror/addon/hint/html-hint.js",
                        "/ThirdParty/codemirror/mode/xml/xml.js",
                        "/Js/common.min.js?v=88",
                        "/Js/AxInterface.min.js?v=2",
                        "/Js/iviewTemplates.min.js?v=1",
                    ]
                },
                callBack() { },
                win: iframeWindow
            });

        }, () => {
            $(callParentNew("Bottomnavigationbar", "class")).removeClass("hide");
        }
    );

}

function GetSubmitDataRequestJSON() {
    try {
        let strtrId = $("#tname000F1").val();
        let formName = $("#formcaption000F1").val();
        formName = formName.substr(0, formName.indexOf('('));
        $.ajax({
            type: "POST",
            url: "tstruct.aspx/CreateSubmitDataRequestJSON",
            data: JSON.stringify({
                strTrId: strtrId
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.d != "error") {
                    let resp = response.d;
                    var tempfldJSON = JSON.parse(resp.split('¿')[0]);
                    var tstDCJSON = JSON.parse(resp.split('¿')[1]);
                    var TstFldJsonArr = [];
                    var dccnt = 1;
                    var smpGridrcrd = '[{"rowno":"001","text":"0","columns":{}},{"rowno":"002","text":"0","columns":{}}]';
                    var smpNongrdRcrd = '[{"rowno":"001","text":"0","columns":{}}]';
                    $.each(tstDCJSON["result"]["row"], function (i, e) {
                        var tempjson = {};
                        var dcName = e.dname;
                        if (e.asgrid.toLowerCase() == 't')
                            tempjson["axp_recid" + dccnt] = JSON.parse(smpGridrcrd);
                        else
                            tempjson["axp_recid" + dccnt] = JSON.parse(smpNongrdRcrd);
                        $.each(tempfldJSON["result"]["row"], function (ind, ele) {
                            if (ele.dcname == dcName) {
                                if (ele.fname != null)
                                    tempjson["axp_recid" + dccnt][0].columns[ele.fname] = "FIELD_VALUE";
                                else
                                    tempjson["axp_recid" + dccnt][0].columns[ele.FNAME] = "FIELD_VALUE";
                            }
                        });
                        TstFldJsonArr.push(tempjson);
                        dccnt++;
                    });

                    $("#reqformat000F1").val('{ "savedata": { "axpapp": "' + callParentNew("webProject") + '", "transid": "' + strtrId + '","s":"' + sid + '", "changedrows": { "dc2": " * ", "dc3": " * " }, "trace": "true", "recordid": "0", "recdata":  ' + JSON.stringify(TstFldJsonArr) + ' } }');


                    $("#res_success000F1").val('{"message": [{ "msg": "' + formName + ' Saved", "recordid": "1690220000000" }] }');

                    $("#res_fail000F1").val('{"result": [{"error": {"status": "Failed","msg": "Sessionid not specified in call to webservice savedata" } }] }');
                }
                else {
                    ShowDialog("error", "Error while Getting request JSON!");
                }
            },
            error: function (error) {
                ShowDialog("error", "Error while Getting request JSON!");
            }
        });
    }
    catch (ex) {
        ShowDialog("error", "Error while Getting request JSON!" + ex);
    }
}

function GetIviewDataRequestJSON() {
    try {
        let ivname = $("#iname000F1").val();
        $.ajax({
            type: "POST",
            url: "tstruct.aspx/CreateIviewRequestJSON",
            data: JSON.stringify({
                ivName: ivname
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.d != "error") {
                    var paramJson = {};
                    try {
                        ParamNameJSON = JSON.parse(response.d);
                    } catch (ex) { }
                    if (typeof ParamNameJSON != "undefined" && ParamNameJSON["result"] && typeof ParamNameJSON["result"]["row"] != "undefined" && ParamNameJSON["result"]["row"].length != 0) {
                        var colName = ParamNameJSON["result"]["fields"][0]["name"]
                        $.each(ParamNameJSON["result"]["row"], function (i, e) {
                            var key = e[colName];
                            var value = "Param_value";
                            paramJson[key] = value;
                        });
                    }

                    $("#reqformat000F1").val('{ "getiview": { "name": "' + ivname + '", "axpapp": "' + callParentNew("webProject") + '", "s": "' + sid + '", "pageno": "1", "pagesize": "100", "sqlpagination": "true", "params": ' + JSON.stringify(paramJson) + '} }');

                    $("#res_success000F1").val('{"headrow": { "rowno": { "hide": "true" }, "axrowtype": { "hide": "true", "width": "80", "dec": "0", "type": "c" }, "axp__font": { "axp__font": "axp__fontdetails", "hide": "true", "width": "80", "dec": "0", "type": "c" }, "column1": { "column1": "Sr. No.", "width": "54", "dec": "0", "align": "Center", "ordno": "1", "runningtotal": "False", "type": "n", "hide": "false" }, "emp": { "emp": "emp", "width": "80", "dec": "0", "align": "Left", "ordno": "2", "runningtotal": "False", "type": "c", "hlink": "ttotal", "pop": "True", "hltype": "load", "map": "emp=:emp", "hide": "false" }, "dep": { "dep": "dep", "width": "80", "dec": "0", "align": "Left", "ordno": "3", "runningtotal": "False", "type": "c", "hlaction": "act1", "hlink": "ttotal", "pop": "True", "hltype": "open", "map": "dep=:dep", "hide": "false" }, "sal": { "sal": "sal", "width": "80", "dec": "2", "align": "Center", "ordno": "4", "runningtotal": "False", "type": "n", "hlink": "iAccept", "pop": "True", "hltype": "load", "map": "employeename=:emp", "hide": "false" }, "reccount": "3", "pagesize": "0", "totalrows": "2", "datarows": "2" }, "row": [{ "rowno": "1", "column1": "1", "emp": "rohit", "dep": "marketing", "sal": "12,345.78", "total1id": "1110220000004", "e": "rohit" }, { "rowno": "2", "column1": "2", "emp": "pawan", "dep": "testing", "sal": "7,778.78", "total1id": "1108880000000", "e": "pawan" }], "GrandTotal": [{ "rowno": "3", "axrowtype": "4", "column1": "820", "emp": "", "dep": "", "sal": "7,97,671.40", "total1id": "44820370000374", "e": "" }] }');

                    $("#res_fail000F1").val('{​​​​​​​​"result":[{​​​​​​​​"error":"Sessionid not specified in call to webservice getIView"}​​​​​​​​]}');
                }
                else {
                    ShowDialog("error", "Error while Getting request JSON!");
                }
            },
            error: function (error) {
                ShowDialog("error", "Error while Getting request JSON!");
            }
        });
    }
    catch (ex) {
        ShowDialog("error", "Error while Getting request JSON!" + ex);
    }
}

function GetScriptApiRequestJSON() {
    try {
        let pageType = $("#page000F1").val();
        let tstName = "";
        let ivName = "";
        if (pageType == "tstruct")
            tstName = $("#pagename000F1").val();
        else if (pageType == "iview")
            ivName = $("#pagename000F1").val();

        let pagename = $("#iname000F1").val();
        let scriptapiname = $("#pagescriptname000F1").val();
        $.ajax({
            type: "POST",
            url: "tstruct.aspx/CreateScriptApiJSON",
            data: JSON.stringify({
                scriptApiName: scriptapiname, tstName: tstName, ivName: ivName
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.d != "error") {

                    $("#reqformat000F1").val(response.d);

                    $("#res_success000F1").val('');

                    $("#res_fail000F1").val('');
                }
                else {
                    ShowDialog("error", "Error while Getting request JSON!");
                }
            },
            error: function (error) {
                ShowDialog("error", "Error while Getting request JSON!");
            }
        });
    }
    catch (ex) {
        ShowDialog("error", "Error while Getting request JSON!" + ex);
    }
}

function btn22onclick() {
    if (transid == "ad_lg") {
        if ($("#exportto000F1").val() != "" && $("#language000F1").val() != "") {
            let srptPath = $("#exportto000F1").val();
            let axLang = $("#language000F1").val();
            srptPath += "\\" + axLang;

            try {
                var curWin = window.open('OpenFiles.aspx?alPath=' + srptPath, '_self', 'width=400,height=300,scrollbars=yes,resizable=yes');
            } catch (ex) {
                showAlertDialog("warning", 'This file does not exist.');
            }
        }
    }
}
var isAxLangUploaded = "false";
function btn23onclick() {
    if (transid == "ad_lg") {
        if ($("#exportto000F1").val() != "" && $("#language000F1").val() != "" && $("#uploadfilename000F3").val() != "") {
            let srptPath = $("#exportto000F1").val();
            let axLang = $("#language000F1").val();
            srptPath += "\\" + axLang;

            let upFileType = $("#uploadfilename000F3").val();
            isAxLangUploaded = "false";
            var src = "./axlangupload.aspx?fpath=" + srptPath + "&upfiletype=" + upFileType;
            displayBootstrapModalDialog("Axpert Language", "lg", "200px", true, src, "", "", CallbackImportFunction);
        }
    }

    function CallbackImportFunction() {
        try {
            if (isAxLangUploaded == "true") {
                let upFileType = $("#uploadfilename000F3").val();
                if (upFileType != "") {
                     upFileType = upFileType + ".xlsx";
                    //upFileType = upFileType + ".xls";
                    $("#uploadedfile000F3").val(upFileType);
                    UpdateFieldArray("uploadedfile000F3", GetFieldsRowNo("uploadedfile000F3"), upFileType, "parent");

                    $("#btn25").click();
                }
            }

        } catch (ex) { }
    }
}

function btn24onclick() {
    if (transid == "ad_lg") {
        AxWaitCursor(true);
        ShowDimmer(true);
        ASB.WebService.AxLangPublishToRuntime(transid, SuccessAxLangPublishToRuntime, OnException);
    }
}

function SuccessAxLangPublishToRuntime(result, eventArgs) {

    AxWaitCursor(false);
    ShowDimmer(false);
}

function AxAftertstCallAction(strResult) {
    var flag = false;
    if (transid == "job_s" && AxActiveAction == "iSave") {
        let isSuccessFullSave = (typeof strResult != "undefined" && strResult.indexOf('{\"result\":[{\"save\": \"success\"}]}') > -1);
        if (isSuccessFullSave) {
            var period = $("#jobschedule000F1").val();
            var tmpPeriod = period.toLowerCase().trim();
            var sendOn = "";
            if (tmpPeriod == "every week") {
                sendOn = $("#weekday000F1").val()
            }
            else if (tmpPeriod == "every month" || tmpPeriod == "every quarter") {
                sendOn = $("#jday000F1").val()
            }
            else if (tmpPeriod == "custom") {
                sendOn = $("#noofmins000F1").val()
            }
            $.ajax({
                type: "POST",
                url: "../aspx/ARMAPIs.aspx/AxPushToQueue",
                data: JSON.stringify({
                    queueName: "ARMAxpertJobsQueue",
                    queueJson: {
                        "start_date": $("#jobstartfrom000F1").val(),
                        "period": period,
                        "sendtime": $("#axptm_starttime000F1").val(),
                        "sendon": sendOn,
                        "project": $("#appname000F1").val(),
                        "jobname": $("#jname000F1").val(),
                        "username": callParentNew("mainUserName")
                    }
                }),
                cache: false,
                async: false,
                dataType: 'json',
                contentType: "application/json",
                success: function (response) {
                    try {
                        var result = JSON.parse(response.d);
                        if (!result.result.success) {
                            showAlertDialog("error", "Error occurred while Queue call-" + result.result.message);
                            flag = true;
                        }
                    }
                    catch (e) {
                        showAlertDialog("error", "Error occurred while Queue call-" + response.d)
                        flag = true;
                    }
                },
                error: function (error) {
                    ShowDialog("error", "Error occurred while Queue call-" + error.responseJSON.Message);
                    flag = true;
                }
            });
        }
    }
    return flag;
}
