var ivColDesignJSON = [], dwbiName = "";
let tableColumnWidth = 0;
let visibleTableColumnWidth = 0;
let minCellWidth = 15;
let listViewCheckBoxSize = 40;
let cbDataTableApi = null;

function axDevIvDrawTable(ivDatas, dwbIvDefName) {
    dwbiName = dwbIvDefName;

    var localIvColDesignJSON = [];

    $.each(ivDatas, function (ind, ele) {
        var columnJson = {};
        columnJson["name"] = this.f_name;
        columnJson["width"] = this.column_width;
        columnJson["mergeid"] = this.mergeid && this.mergeid != "*" ? this.mergeid : "";
        columnJson["mergename"] = this.mergename && this.mergename != "*" ? this.mergename : "";
        columnJson["Savestr"] = this.f_name + '=' + Math.ceil(this.column_width);
        localIvColDesignJSON.push(columnJson);
    });

    ivColDesignJSON[dwbiName] = localIvColDesignJSON;
    
    headerText = ["", ...ivDatas.map(col => col.f_caption)];
    fieldName = ["rowno", ...ivDatas.map(col => col.f_name)];
    colWidth = ["10", ...ivDatas.map(col => col.column_width)];
    hideColumn = [true, ...ivDatas.map((col) => {
        if (col.hidden == "T")
            return true
        else if (col.hidden == "F")
            return false
        else return col.hidden;
    })];
    recordIds = ["0", ...ivDatas.map(col => col.recordid)];
    queryCol = [true, ...ivDatas.map((col) => {
        if (col.isquerycol == "*")
            return true
        else if (col.isquerycol.toString().toLowerCase() == "f")
            return false
        else return col.isquerycol;
    })];
    hyperlinkid = ["0", ...ivDatas.map(col => col.hyperrecid)];
    cndformatid = ["0", ...ivDatas.map(col => col.cformatrecid)];

    let _this = this;
    
    tableColumnWidth = 0;
    visibleTableColumnWidth = 0;
   

    tableColumnWidth += ((findGetParameter("tstcaption") == null ? minCellWidth : listViewCheckBoxSize));//for checkbox column
    // visibleTableColumnWidth += (findGetParameter("tstcaption") == null ? minCellWidth : listViewCheckBoxSize);//for checkbox column

    $("#GridView1Wrapper").hide();
	$("#GridView2Wrapper").empty();  
    $("#GridView2Wrapper").show();   

    $("#GridView2Wrapper").append($(`
    <table class="gridData ivirMainGrid iviewBuilder stripe row-border hover order-column table dataTable" rules="all" border="1" id="GridView1Dnd" data-row>
        <thead>
            <tr>
                <th id="GridView1Dnd_ctl01_rowno" data-column-name="rowno" style="width:${findGetParameter("tstcaption") == null ? minCellWidth : listViewCheckBoxSize}px;" scope="col"><input name="chkall" id="chkall" onclick="javascript:CheckAll();" style="height:12px;" type="checkbox"></th>
                ${headerText.map(function (a, b, c) {
                    if ((fieldName[b] != "rowno")) {
                        let width = colWidth[b] || minCellWidth;
                        (typeof hideColumn[b] != "undefined" ? hideColumn[b].toString() : "true") == "false" ? tableColumnWidth += parseInt(width, 10) : ""

                        return `
                        <th id="GridView1Dnd_ctl01_${fieldName[b]}" scope="col" data-column-name="${fieldName[b]}" style="width:${width}px;" class="${hideColumn[b] ? "hiddenColumnUI" : ""}">
                            <a href="javascript:void(0);" onclick="${generateHyperlink(recordIds[b])}">${a.replace(/~/g, "<br />")}</a>
                            <div class="three-dot" role="button">
                                <div class="btn-group colOptDropDown" data-toggle="popover">
                                    <button type="button" class="btn btn-secondary">
                                        <i class="fa fa-ellipsis-v"></i>
                                    </button>
                                    <div class="dropdown-menu columnPropOptions popover-content">
                                        <a class="dropdown-item" href="javascript:void(0);" onclick="${openHyperlinkPopUp(fieldName[b], hyperlinkid[b])}"><span class="material-icons columnPropOptionsIcon">link</span>
                                            <span class="columnPropOptionsText">Hyperlink</span>
                                        </a>
                                        <a class="dropdown-item" href="javascript:void(0);" onclick="${openConditinalFomatPopUp(fieldName[b], cndformatid[b])}"><span class="material-icons columnPropOptionsIcon">format_paint</span>
                                            <span class="columnPropOptionsText">Conditional Format</span>
                                        </a>
                                        <a class="dropdown-item ddMergeColOpt" href="javascript:void(0);" onclick="generateColumnMerege(this)"><span class="material-icons columnPropOptionsIcon">merge_type</span><span class="columnPropOptionsText">Merge with prior</span></a>
                                        ${
                                            !hideColumn[b] ? `
                                            <a class="dropdown-item hide" href="javascript:void(0);" onclick="$('#middle1')[0].contentWindow.iviewTemplate('${fieldName[b]}');"><span class="material-icons columnPropOptionsIcon">code</span>   <span class="columnPropOptionsText">Template</span></a>
                                            ` : ""
                                        }
                                        <a class="dropdown-item" href="javascript:void(0);" onclick="LoadIframeDwb('tstruct.aspx?act=open&transid=ad_ic&iName=${dwbiName}');return false;"><span class="material-icons columnPropOptionsIcon">add_circle_outline</span>
                                            <span class="columnPropOptionsText">Add Column</span>
                                        </a>                                               
                                        ${
                                            !queryCol[b] ? `
                                            <a class="dropdown-item" href="javascript:void(0);" onclick="delNonQueryElem(${recordIds[b]},'ad_ic','${dwbiName}');"><span class="material-icons columnPropOptionsIcon">remove_circle_outline</span>   <span class="columnPropOptionsText">Delete Column</span></a>
                                            ` : ""
                                        }
                                         <a class="dropdown-item" href="javascript:void(0);" onclick="${openRowOptionUIPopUp(fieldName[b])}"><span class="material-icons columnPropOptionsIcon">toc</span>
                                            <span class="columnPropOptionsText">Row Option UI</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </th>`;
                    }
                }).join("")}
            </tr>
        </thead>
    </table>
    `).css({ "width": `${tableColumnWidth}px` }).removeAttr('cellspacing rules border style').addClass('ivirMainGrid stripe row-border hover order-column table'));

    axDevIvInitDatatable(headerText, fieldName, colWidth, hideColumn, recordIds, queryCol, hyperlinkid, cndformatid);
}

function axDevIvInitDatatable(headerText, fieldName, colWidth, hideColumn, recordIds, queryCol, hyperlinkid, cndformatid) {
    $.fn.dataTableExt.ofnSearch['alt-status'] = function (sData) {
    };
    $.fn.dataTable.moment('DD/MM/YYYY');
    $.fn.dataTable.ext.errMode = 'none';
    $.fn.dataTable.Api.register('order.neutral()', function () {
        return this.iterator('table', function (s) {
            s.aaSorting.length = 0;
            s.aiDisplay.sort(function (a, b) {
                return a - b;
            });
            s.aiDisplayMaster.sort(function (a, b) {
                return a - b;
            });
        });
    });

    let _datatableObj = new DataTableObj(headerText, fieldName, colWidth, hideColumn, recordIds, queryCol, hyperlinkid, cndformatid);
    cbDataTableApi = $(".ivirMainGrid.iviewBuilder").DataTable(_datatableObj);

    initColumnMerge();

    $(".ivirMainGrid.iviewBuilder").on('column-resize.dt.mouseup', function (event, oSettings) {
        saveIvColDesign();
    }).on('column-reorder.dt.mouseup', function (event, oSettings) {
        saveIvColDesign();
    });
}

class DataTableObj {
    constructor(headerText, fieldName, colWidth, hideColumn, recordIds, queryCol, hyperlinkid, cndformatid) {
        let _this = this;
        let isChkBox = "false";
        let indexOfRowNo = -1;
        indexOfRowNo = fieldName.indexOf("rowno");
        if (indexOfRowNo >= 0) {
            isChkBox = (hideColumn[indexOfRowNo].toString() == "false").toString();
        }

        // let rowTypeExist = fieldName.filter(function (a) { return a == "axrowtype" }).length > 0;
        // var hiddenColumnIndex = fieldName.map(function (a, b, c) {
        //     // return (hideColumn[b] ? b : "")
        //     return b < 1 ? b : "";
        // }).filter(function (a) { return a !== "" });

        var hiddenColumnIndex = [0];

        tableColumnWidth = 0;
        visibleTableColumnWidth = 0;
        
        let widthIncrement = 0;

        // if($("#GridView1Dnd").width() > $("#GridView2Wrapper").width()){
            try {
                // horizontalScrollExist = true;
                widthIncrement = $("#GridView1Dnd thead tr th:eq(0)").outerWidth() - $("#GridView1Dnd thead tr th:eq(0)").width() || 0;
            } catch (ex) {
                widthIncrement = 0;
            }
        // }

        tableColumnWidth += (findGetParameter("tstcaption") == null ? minCellWidth : listViewCheckBoxSize);

        this.columns = fieldName.map((fld, ind) => {
            let width = colWidth[ind] || minCellWidth;
            //(typeof hideColumn[ind] != "undefined" ? hideColumn[ind].toString() : "true") == "false" ? visibleTableColumnWidth += (parseInt(width, 10) + widthIncrement) : "";

            hiddenColumnIndex.indexOf(ind) == -1 ? visibleTableColumnWidth += (parseInt(width, 10) + widthIncrement) : "";
           
            tableColumnWidth += (parseInt(width, 10) + widthIncrement);

            $("#GridView1Dnd").css({ "width": `${visibleTableColumnWidth || tableColumnWidth}px` }).parent().css({ "width": `${visibleTableColumnWidth || tableColumnWidth}px` });

            return { "data": fld, "name": fld, "width": `${colWidth[ind]}px` }
        });

        

        this.data = [[fieldName.reduce((result, fld ) => {result[fld] = ``; return result;},{})],[fieldName.reduce((result, fld ) => {result[fld] = ``; return result;},{})],[fieldName.reduce((result, fld ) => {result[fld] = ``; return result;},{})]];
        this.scrollX = true;
        this.dom = "t";
        this.colReorder = {
            resizeCallback() {
            }
        };
        this.ordering = false;
        this.lengthChange = false;
        this.autoWidth = false;
        this.fixedHeader = false;
        this.initComplete = function (settings, json) {
            $(".gridData").css({ "width": `${visibleTableColumnWidth}px` });

            $("#GridView1Dnd_wrapper").parent().css({ "width": `` });

            $('.dataTables_scrollBody table').on('scroll', function () {
                $('.dataTables_scrollHeadInner table').scrollLeft($(this).scrollLeft());
            });

            $(".dataTables_scrollBody").closest('.dataTables_scroll').width($(".dataTables_scrollBody").closest('.dataTables_scroll').find('.dataTables_scrollHead table thead').width());
            $(".dataTables_scrollBody").closest('.dataTables_scroll').find('.dataTables_scrollHead table thead th:eq(0)').css('cursor', 'col-resize');
            // var e = document.createEvent("MouseEvents");
            // e.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            // $(".dataTables_scrollBody").closest('.dataTables_scroll').find('.dataTables_scrollHead table thead th:eq(0)')[0].dispatchEvent(e);
            // e.initMouseEvent("mouseup", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            // $(".dataTables_scrollBody").closest('.dataTables_scroll').find('.dataTables_scrollHead table thead th:eq(0)')[0].dispatchEvent(e);
            // $(".dataTables_scrollBody").closest('.dataTables_scroll').find('.dataTables_scrollHead table thead th:eq(0)').css('cursor', 'auto');
        };

        if (isChkBox == "true") {
            this.columnDefs = [{
                "targets": 0,
                "orderable": false
            }];
        } else {
            this.columnDefs = [];
        }

        this.columnDefs.push({ targets: hiddenColumnIndex, visible: false, searchable: false });
        this.columnDefs.push({ targets: 0, searchable: false });

        // this.headerCallback = function ( thead, data, start, end, display ) {
        //     $(thead).find('th').each((ind, elm) => {
        //         $(elm).attr("onclick", $(elm).find("a").attr("onclick"));
        //         $(elm).find("a").removeAttr("onclick");
        //     });
        // }
    }
}

function generateHyperlink(recID) {
    if (recID != "") {
        return `LoadIframeDwb('tstruct.aspx?transid=ad_ic&amp;recordid=${recID}');`
    } else {
        return ``;
    }
}

function openHyperlinkPopUp(colID, hyperlinkID) {
        if (hyperlinkID == 0)
            return `createPopupdesign('tstruct.aspx?act=open&amp;transid=ad_ih&amp;hypsource=${colID}&amp;iName=${dwbiName}&amp;AxPop=true');return false;`
        else
            return `createPopupdesign('tstruct.aspx?act=load&amp;transid=ad_ih&amp;recordid=${hyperlinkID}&amp;AxPop=true');return false;`    
}

function openRowOptionUIPopUp(colID) {
    let _thisIvCap = "";
    if (dwbIvDefName != "" && dwbIvDefName.indexOf('(') > -1 && dwbIvDefName.indexOf(')') > -1)
        _thisIvCap = dwbIvDefName;
    else {
        let _ivCap = $('.developerbreadcrumbTitle').text();
        let _ivCapindex = _ivCap.indexOf('-');
        _thisIvCap = _ivCapindex !== -1 ? _ivCap.substring(_ivCapindex + 1) : _ivCap;
    }
    _thisIvCap = _thisIvCap.replace('(', '-(');
    _thisIvCap = _thisIvCap.trimStart();
    return `createPopupdesign('tstruct.aspx?act=load&amp;transid=ad_rc&amp;names=${_thisIvCap}&amp;elements=${colID}&amp;AxPop=true');return false;`
}

function saveIvColDesign() {
    var localIvColDesignJSON = [];
    $.each($(".dataTables_scrollHead .ivirMainGrid.iviewBuilder thead tr:not(.col-merge) th"), function (ind, ele) {
        var columnJson = {};
        columnJson["name"] = $(this).data("column-name");
        columnJson["width"] = $(this).width();
        columnJson["mergeid"] = (ivColDesignJSON[dwbiName]?.[ind]?.mergeid || "").trim();//(getNormalColumnIndex(getMergeColumnIndex(ind)) + 1).toString();
        columnJson["mergename"] = (ivColDesignJSON[dwbiName]?.[ind]?.mergename || "").trim();
        columnJson["Savestr"] = $(this).data("column-name") + '=' + Math.ceil($(this).width());
        localIvColDesignJSON.push(columnJson);
    });

    localIvColDesignJSON.map((col, ind, aio)=>{
        if(aio.filter(c=>c.mergeid == col.mergeid).length == 1){
            col.mergeid = "";
            col.mergename = "";
        }
    
        return col;
    });

    ivColDesignJSON[dwbiName] = localIvColDesignJSON;
}

function openConditinalFomatPopUp(colID, cndformatID) {  
    if (cndformatID == 0)
        return `createPopupdesign('tstruct.aspx?act=open&amp;transid=ad_if&amp;name=${colID}&amp;iName=${dwbiName}&amp;AxPop=true');return false;`
    else
        return `createPopupdesign('tstruct.aspx?act=load&amp;transid=ad_if&amp;recordid=${cndformatID}&amp;AxPop=true');return false;`
}

/**
 * @description: trigger column merge
 * @author Prashik
 * @date 03/09/2021
 * @param {*} elem
 */
function generateColumnMerege(elem) {
    let normalIndex = ivColDesignJSON[dwbiName].findIndex(col=>col.name==$(elem)?.parents(".columnDropdonwMenuPopover")?.data("bs.popover")?.$element?.parents("th")?.data("columnName"));

    let mergeColumn = $(`.dataTables_scrollHead .ivirMainGrid.iviewBuilder thead tr.col-merge th:eq(${getMergeColumnIndex(normalIndex)})`);

    if((mergeColumn.attr("colspan") || "1") == "1" || getNormalColumnIndex(getMergeColumnIndex(normalIndex)) == normalIndex){
        updateColumnMerge(normalIndex);
    }
}

/**
 * Get Merge Column Index based on Normal Column Index
 * @author Prashik
 * @Date   2021-08-11911:45:39+0530
 */
function getMergeColumnIndex(index){
    let colSpanArrar = [];
    return $(`.dataTables_scrollHead .ivirMainGrid.iviewBuilder thead tr:not(.col-merge) th`).toArray().reduce((finalInd, th, ind, thAll) =>{
        if(ind < index){
            colSpanArrar.push(ind);
            if(colSpanArrar.length == parseInt($(`.dataTables_scrollHead .ivirMainGrid.iviewBuilder thead tr.col-merge th:eq(${finalInd})`).attr("colspan") || 1)){
                colSpanArrar = [];
            }
            return finalInd + 1 - (colSpanArrar.length > 0 ? 1 : 0);
        }else{
            return finalInd;
        }
    }, 0);
}

/**
 * Get Normal Column Index based on Merge Column Index
 * @author Prashik
 * @Date   2021-08-11911:45:39+0530
 */
function getNormalColumnIndex(index){
    return $(`.dataTables_scrollHead .ivirMainGrid.iviewBuilder thead tr.col-merge th:lt(${index})`).toArray().reduce((finalInd, th, ind, thAll) =>{
        return finalInd + parseInt($(th).attr("colspan") || 1)
    }, 0)
}

/**
 * @description: check if any merge columns exists or not
 * @author Prashik
 * @date 03/09/2021
 * @return {*}  
 */
function mergeColumnsExist(){
    return (ivColDesignJSON[dwbiName] || []).filter(col=>col.mergeid).length > 0;
}

/**
 * @description: get colspan for given merge column
 * @author Prashik
 * @date 03/09/2021
 * @param {*} mergeid: merge id of column starting with 0
 * @return {*}  
 */
function getMergeColumnColspan(mergeid){
    return (ivColDesignJSON[dwbiName] || []).filter(col=>col.mergeid == mergeid).length || 1;
}

/**
 * @description: merge header cell generation logic
 * @author Prashik
 * @date 03/09/2021
 * @param {*} colSpan: colspan for merge
 * @param {*} title: title for merge
 * @param {*} col: column json object
 * @return {*}  
 */
function generateMergeColumnHTML(colSpan, title, col) {
    return `
    <th align="center" colspan="${colSpan}" rowspan="1" class="pivotHeaderStyle dt-center" ${col.mergeid ? `data-mergeid="${col.mergeid}"` : ``} data-title="${title}">
        ${title.replace(/~/g, "<br />") || "&nbsp;"}
        ${col.mergeid ? `
        <div class="three-dot" role="button">
            <div class="btn-group colOptDropDown" data-toggle="popover">
                <button type="button" class="btn btn-secondary">
                    <i class="fa fa-ellipsis-v"></i>
                </button>
                <div class="dropdown-menu columnPropOptions popover-content">
                    <a class="dropdown-item" href="javascript:void(0);" onclick="setMergeCaption(this, ${col.mergeid - 1})"><span class="material-icons columnPropOptionsIcon">mode_comment</span>
                        <span class="columnPropOptionsText">Merge Caption</span>
                    </a>
                    <a class="dropdown-item" href="javascript:void(0);" onclick="removeMerge(this, ${col.mergeid - 1})"><span class="material-icons columnPropOptionsIcon">remove_circle_outline</span>
                        <span class="columnPropOptionsText">Remove Merge</span>
                    </a>
                    <a class="dropdown-item" href="javascript:void(0);" onclick="removeAllMerge(this)"><span class="material-icons columnPropOptionsIcon">highlight_off</span>
                        <span class="columnPropOptionsText">Remove All Merge</span>
                    </a>
                </div>
            </div>
        </div>
        ` : ``}
    </th>`;
}

/**
 * @description: merge header row constuction logic
 * @author Prashik
 * @date 03/09/2021
 * @return {*}  
 */
function createMergeHeaders(){
    let returnRowHtml = "";
    if(mergeColumnsExist()){
        let addedMergeIndex = [];
        returnRowHtml = `<tr role="row"  class="col-merge">` + (ivColDesignJSON[dwbiName] || []).map((col, ind)=>{
            if(col.mergeid == "" || addedMergeIndex.indexOf(col.mergeid) == -1){
                addedMergeIndex.push(col.mergeid);
                return generateMergeColumnHTML(col.mergeid == "" ? "1" : getMergeColumnColspan(col.mergeid), col.mergename, col);
            }else {
                return "";
            }
        }).join("") + `</tr>`;

        cbDataTableApi.colReorder.disableReorder();
    }else{
        cbDataTableApi.colReorder.enableReorder();
    }

    return returnRowHtml;
}

/**
 * @description: render fresh column merge
 * @author Prashik
 * @date 03/09/2021
 */
function initColumnMerge(){
    $(".dataTables_scrollHead table.iviewBuilder thead tr.col-merge").remove();
    $(".dataTables_scrollHead table.iviewBuilder thead").prepend(createMergeHeaders());
}

/**
 * @description: function to show popup to set column merge caption
 * @author Prashik
 * @date 03/09/2021
 * @param {*} elem
 * @param {*} normalIndex
 */
function setMergeCaption(elem, normalIndex){
    let mergeCaptionHTML = `
    <div class="mergeCaptionWrapper">
        <div class="mergeCaptionBody">
            <div>
                <div class="mergeCapInput"> <input type="text" class="form-control" value="${ivColDesignJSON[dwbiName]?.[normalIndex]?.mergename || ""}" /> </div>
            </div>
        </div>      
        <div class="clearfix"></div>
        <div class="mergeCaptionFooter">
            <div class="pull-right">
                <input type="button" name="btnFilter" value="Ok" onclick="updateColumnMerge(${normalIndex})" id="btnFilter" title="Ok" class="hotbtn btn handCursor allow-enter-key" />
            </div>
            <div class="clearfix"></div>
        </div>
    </div> `;

    displayBootstrapModalDialog("Merge Column Caption", "md", "auto", false, mergeCaptionHTML,"" ,
    function () { 
        $(".mergeCapInput input").focus();
    });
}

/**
 * @description: remove selected column merge
 * @author Prashik
 * @date 03/09/2021
 * @param {*} elem
 * @param {*} mergeIndex: index of merge column starting with 0
 */
function removeMerge(elem, mergeIndex){
    ivColDesignJSON[dwbiName].map(col=>{
        let mergeId = (mergeIndex + 1).toString();
        if(col.mergeid == mergeId){
            col.mergeid = "";
            col.mergename = "";
        }
        
        return col;
    });

    initColumnMerge();
}

/**
 * @description: remove all column merge
 * @author Prashik
 * @date 03/09/2021
 * @param {*} elem
 */
function removeAllMerge(elem){
    ivColDesignJSON[dwbiName].map(col=>{
        col.mergeid = "";
        col.mergename = "";
        
        return col;
    });

    initColumnMerge();
}

/**
 * @description: common logic to update merge captio and merge columns
 * @author Prashik
 * @date 03/09/2021
 * @param {*} normalIndex: index of normal column starting with 0
 */
function updateColumnMerge(normalIndex) {
    let columnCaption = "";
    
    if($(".mergeCapInput:visible").length > 0){
        //caption change logic
        columnCaption = $(".mergeCapInput input").val() || "";

        ivColDesignJSON[dwbiName].map(col=>{
            let mergeId = (normalIndex + 1).toString();
            if(col.mergeid == mergeId){
                col.mergeid = mergeId;
                col.mergename = columnCaption;
            }
            
            return col;
        });

        closeModalDialog();
    }else{
        //merge logic

        //get caption
        let thisCaption = "";
        let prevCaption = "";
        thisCaption = ivColDesignJSON[dwbiName][normalIndex].mergename;
        prevCaption = ivColDesignJSON[dwbiName][normalIndex - 1].mergename;
        columnCaption = thisCaption || prevCaption || "";

        //make merge ids equal
        ivColDesignJSON[dwbiName][normalIndex - 1].mergeid = ivColDesignJSON[dwbiName][normalIndex - 1].mergeid || (normalIndex).toString();
        if(ivColDesignJSON[dwbiName][normalIndex].mergeid){
            let mergeId = ivColDesignJSON[dwbiName][normalIndex].mergeid;
            
            ivColDesignJSON[dwbiName].map(col=>{
                if(col.mergeid == mergeId){
                    col.mergeid = ivColDesignJSON[dwbiName][normalIndex - 1].mergeid;
                }
                
                return col;
            });
        }else{
            ivColDesignJSON[dwbiName][normalIndex].mergeid = ivColDesignJSON[dwbiName][normalIndex - 1].mergeid;
        }

        //make same caption for merge same merge ids
        ivColDesignJSON[dwbiName].map(col=>{
            //let mergeId = (getNormalColumnIndex(getMergeColumnIndex(normalIndex))).toString();
            let mergeId = (getNormalColumnIndex(getMergeColumnIndex(normalIndex - 1)) + 1).toString();
            if(col.mergeid == mergeId){
                col.mergeid = mergeId;
                col.mergename = columnCaption;
            }
            
            return col;
        });
    }

    initColumnMerge();
}