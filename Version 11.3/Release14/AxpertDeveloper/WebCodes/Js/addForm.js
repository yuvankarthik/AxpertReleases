window.onbeforeunload = function () {
    appGlobalVarsObject._CONSTANTS.callerWindow = null;
}

document.addEventListener('contextmenu', event => event.preventDefault());

var transid = "";
var caption = "";

var sourceDetails = "";

var addedItemUpdated = false;

var addedItemRecordId = "0";

let grid;

$(()=> {   
    try {
        callParentNew("dummyHider", "id").style.display = 'none';
    } catch (ex) {}
    
    if (typeof callParentNew("AxConfigPage") != "undefined" && callParentNew("AxConfigPage") != "") {
        sourceDetails = callParentNew("AxConfigPage").split("~");
        (sourceDetails?.[0] == "addform") && (transid = sourceDetails?.[1]);

        if(sourceDetails?.[2]){
            caption = sourceDetails[2];
        }

        initDesigner(transid);
    }
    else {
        showAlertDialog("error", "An error occurred while opening the page");
    }
});

function initDesigner(transid){
    let isLoading = true;

    let editJSON = getEditJSON(transid);

    grid = GridStack.init({
        column: 36,
        cellHeight: 115,
        float: true,
        acceptWidgets: true,
        minRow: 10, // don't collapse when empty
        dragIn: '.sidebar .grid-stack-item',  // class that can be dragged from outside
        dragInOptions: { revert: 'invalid', scroll: false, appendTo: 'body', helper: 'clone' }, // clone or can be your function
        removable: '#trash', // drag-out delete class
    }).on('resizestart', function (event, el) {
        $(el).parent().addClass("ui-droppable-active");
    }).on('resizestop', function (event, el) {
        $(el).parent().removeClass("ui-droppable-active");
    }).on('added', function (event, items) {
        $("#dragInfo").addClass("d-none");

        setTimeout(() => {
            $(frameElement).parents(".remodal").find(".developerWorkBenchToolbar .dwbiconsUl").show();
        }, 0);

        if(isLoading){
            return;
        }
        
        items.forEach(function (item, index) {
            if (index == 0) {
                addedItemUpdated = false;

                let controlID = `ax_fld_id${Math.floor(Math.random() * 100000)}`;

                $(item.el).attr("data-control-id", controlID).data("data-control-id", controlID);

                if (sourceDetails?.[0] == "addform") {
                    let addedItemCaption = $(item.el).find("[placeholder]").text();

                    let myModal = new BSModal(controlID, addedItemCaption, `<iframe id="modal-addfield" src="tstructnew.aspx?act=open&transid=ad_af&stransid=${transid}&formcaption=${caption}${(transid ? ('('+transid+')') : "")}&fcaption=${addedItemCaption}&fldtype=${$(item.el).data("placeholder")}" class="w-100 vh-100"></iframe>`, 
                    (opening) => {
                        $(myModal.modal._dialog).find("iframe").css({height: `${$(myModal.modal._dialog).find(".modal-body").height() - 10}px`}).removeClass("vh-100");

                        $(myModal.modal._element).attr("data-control-id", controlID).data("data-control-id", controlID);
                        appGlobalVarsObject._CONSTANTS.callerWindow = window;
                        appGlobalVarsObject._CONSTANTS.calledWindow = null;
                    }, 
                    (closed) => {
                        if (!addedItemUpdated) {
                            grid.removeWidget(item.el, true, true);
                        } else {
                            if (addedItemUpdated && addedItemRecordId != "0") {
                                $(item.el).attr("data-recid", addedItemRecordId).data("recid", addedItemRecordId);
                            }
                        }

                        addedItemUpdated = false;
                        addedItemRecordId = "0";
                        if(appGlobalVarsObject._CONSTANTS.callerWindow) {
                            appGlobalVarsObject._CONSTANTS.callerWindow = null;
                        }
                        appGlobalVarsObject._CONSTANTS.calledWindow = null;
                    });

                    myModal.scrollableDialog();

                    // myModal.modalHeader.classList.add(...["p-5", "py-2"]);
                    myModal.modalBody.classList.add(...["p-5", "py-2"]);
                    myModal.modalFooter.classList.add(...["p-5", "py-2"]);

                    myModal.cancelBtn.classList.add("d-none");
                    myModal.cancelBtn.classList.add("btn-sm");

                    myModal.okBtn.classList.add("btn-sm");
                    myModal.okBtn.removeAttribute("data-bs-dismiss");
                    myModal.okBtn.innerText = appGlobalVarsObject.lcm[399];
                    myModal.okBtn.addEventListener("click", (e) => {
                        $(document.getElementById("modal-addfield"))[0].contentWindow.$(".toolbarRightMenu").find("a[title=usave]").trigger("click");
                    });
                }

            }
        });
    });

    editJSON.forEach((gsw) => {
        let tempDataType = "";
        // if(gsw.customdatatype == "DropDown"){
        //     tempDataType = "Dropdown from form";
        // }

        let element = $(`.sidebar .grid-stack-item[data-placeholder=${(tempDataType || gsw.fldtype).replaceAll(" ", "\\ ")}]`).clone();

        let controlID = `ax_fld_id${Math.floor(Math.random() * 100000)}`;

        element.attr("data-control-id", controlID).data("data-control-id", controlID);
        element.attr("data-id", gsw.name).data("id", gsw.name);
        element.attr("data-recid", gsw.recordid).data("recid", gsw.recordid);
        element.find("[placeholder]").text(gsw.caption);

        let elementHTML = element?.[0]?.outerHTML;
        if(elementHTML){
            grid.addWidget(elementHTML, gsw.design || {});
        }
    });

    isLoading = false;

    setTimeout(() => {
        $(frameElement).parents(".remodal").find(".developerWorkBenchToolbar .dwbiconsUl").show();
    }, 0);
}

function editFieldProperty(curEditElement) {
    let addedItemControlId = curEditElement.data("controlId");
    let addedItemCaption = curEditElement.find("[placeholder]").text();
    addedItemRecordId = curEditElement.data("recid");

    let myModal = new BSModal(addedItemControlId, addedItemCaption, `<iframe id="modal-editfield" src="tstructnew.aspx?act=load&transid=ad_af&recordid=${addedItemRecordId}" class="w-100 vh-100"></iframe>`,
        (opening) => {
            $(myModal.modal._dialog).find("iframe").css({height: `${$(myModal.modal._dialog).find(".modal-body").height() - 10}px`}).removeClass("vh-100");

            $(myModal.modal._element).attr("data-control-id", addedItemControlId).data("data-control-id", addedItemControlId);
            appGlobalVarsObject._CONSTANTS.callerWindow = window;
            appGlobalVarsObject._CONSTANTS.calledWindow = null;
        },
        (closed) => {
            if (!addedItemUpdated && addedItemRecordId == "0") {
                grid.removeWidget(curEditElement?.[0], true, true);
            } else {
                if (addedItemUpdated && addedItemRecordId != "0") {
                    $(curEditElement).attr("data-recid", addedItemRecordId).data("recid", addedItemRecordId);
                }
            }

            addedItemUpdated = false;
            addedItemRecordId = "0";
            if(appGlobalVarsObject._CONSTANTS.callerWindow) {
                appGlobalVarsObject._CONSTANTS.callerWindow = null;
            }
            appGlobalVarsObject._CONSTANTS.calledWindow = null;
        });

    myModal.scrollableDialog();

    // myModal.modalHeader.classList.add(...["p-5", "py-2"]);
    myModal.modalBody.classList.add(...["p-5", "py-2"]);
    myModal.modalFooter.classList.add(...["p-5", "py-2"]);

    myModal.cancelBtn.removeAttribute("data-bs-dismiss");
    myModal.cancelBtn.innerText = appGlobalVarsObject.lcm[248];
    myModal.cancelBtn.addEventListener("click", (e) => {
        $(document.getElementById("modal-editfield"))[0].contentWindow.$(".toolbarRightMenu").find("a[title=uremove]").trigger("click");
    });
    myModal.cancelBtn.classList.add("btn-sm");

    myModal.okBtn.classList.add("btn-sm");
    myModal.okBtn.removeAttribute("data-bs-dismiss");
    myModal.okBtn.innerText = appGlobalVarsObject.lcm[399];
    myModal.okBtn.addEventListener("click", (e) => {
        $(document.getElementById("modal-editfield"))[0].contentWindow.$(".toolbarRightMenu").find("a[title=usave]").trigger("click");
    });
}

function getDesignerJSON() {
    var dsnJSON = "";
    var typeee_as_grid = '';

    this.form_serialized_data = _.map($('body'), function (el) {
        this.dc_serialized_data = _.map($('.grid-stack'), function (el) {
            el = $(el);
            dc_id = $(el).attr("id");
            typeee_as_grid = el.parents(".grid-icons").length > 0 ? "T" : "F";
            this.serialized_data = _.map($('#' + dc_id + ' > .grid-stack-item'), function (el) {
                el = $(el);
  
                return {
                    fld_id: $(el).data("id"),
                    x: +el.attr("gs-x"),
                    y: +el.attr("gs-y"),
                    w: +el.attr("gs-w"),
                    h: +el.attr("gs-h"),
                    visibility: !el.hasClass("designHidden"),
                };
            }, this);

            var fieldsDesign = this.serialized_data.length ? GridStack.Utils.sort(this.serialized_data, 1, 36).map(fld => { return { fld_id: fld.fld_id, x: fld.x, y: fld.y, width: fld.w, height: fld.h, visibility: fld.visibility } }) : null;
            // var tableDesign = this.serialized_data_table.length ? this.serialized_data_table : null;
            dc_id = dc_id.indexOf("divDc") == 0 ? dc_id.substr(5) : dc_id.substr(dc_id.lastIndexOf("F") + 1);
            return {
                dc_id,
                isGrid: false,//typeee_as_grid,
                gridStretch: false,//$("#ckbGridStretch" + dc_id).is(":checked"), //To be changed with grid stretch
                fieldsDesign,
                tableDesign: [],
            };
        }, this);
        var form_data = (typeof dcLayoutType == "undefined" || dcLayoutType == "" || dcLayoutType == "default") ? (typeof isDcLayoutSelected != "undefined" && isDcLayoutSelected == true ? designObj[0].dcs : (this.dc_serialized_data)) : designObj[0].dcs;
        var newform_data = (typeof dcLayoutType != "undefined" && dcLayoutType != "" && dcLayoutType != "default") ? (this.dc_serialized_data) :/*designObj?.[0]?.newdcs*/[];
        return {
            transid,
            compressedMode: true,//$("#ckbCompressedMode").is(":checked"),
            newDesign: true,
            staticRunMode: true,//$("#ckbStaticRunMode").prop('checked'),
            wizarcdDC: false,//$("#ckbWizardDC").prop('checked'),
            selectedLayout: null,//$("#designLayoutSelector").val(),
            selectedFontSize: 14,//$("#designForntSizeSelector").val(),
            selectedControlHeight: 25,//$("#designControlHeightSelector").val(),
            tstUpdatedOn: typeof tstructUpdateOn != "undefined" ? tstructUpdateOn : "",
            dcLayout: "default",//typeof dcLayoutType != "undefined" && dcLayoutType != "" ? dcLayoutType : "default",
            formWidth: "100",//$("#designFormWidthSelector").val(),
            formAlignment: "default",//$("#designFormAlignmentSelector").val(),
            fieldCaptionWidth: "30",//$("#designFieldCaptionWidthSelector").val(),
            formLabel: typeof formLabelJSON != "undefined" && formLabelJSON != "" ? JSON.parse(formLabelJSON) : [],
            buttonFieldFont: typeof buttonFieldFontJSON != "undefined" && buttonFieldFontJSON != "" ? JSON.parse(buttonFieldFontJSON) : [],
            dcs: form_data,
            newdcs: newform_data
        };
    }, this);

    // if(dcLayoutType == "" || dcLayoutType == "default"){
    var newIndex = form_serialized_data[0].dcs.map(function (obj, index) {
        return obj.dc_id;
    });

    var oldUpdatedObject = [];
    try {
        if (designObj[0].dcs != null) {
            oldUpdatedObject = designObj[0].dcs.filter(function (obj, index) {
                if (newIndex.indexOf(obj.dc_id) == -1) {
                    return true;
                }
            });
        }
    } catch (ex) {

    }

    form_serialized_data[0].dcs = _.sortBy([...form_serialized_data[0].dcs, ...oldUpdatedObject], 'dc_id');

    dsnJSON = JSON.stringify(this.form_serialized_data, null, '');


    return dsnJSON;
}



function formSave(){
    SavePublishDesignerJSONWeb(false);
    
    appGlobalVarsObject._CONSTANTS.callerWindow = window;
    appGlobalVarsObject._CONSTANTS.window.$('#btn_readtstructdef').trigger('click');
}


function SavePublishDesignerJSONWeb(isSaveNormal = true) {
    var dsnJSON = getDesignerJSON();
    var SavedId = $("#SaveID").val();
    var PublishId = $("#PublishID").val();
    var Savetype = "SAVEPUBLISH";
    $(".grid-stack").removeClass('dirty');
    ShowDimmer(true);
    $.ajax({
        url: 'tstruct.aspx/SavePublishDesign',
        type: 'POST',
        cache: false,
        async: true,
        data: JSON.stringify({
            Transid: transid, DesignType: Savetype, Content: dsnJSON, SavedId: SavedId
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            if (data.d != "") {
                SavedId = data.d.split('~')[0];
                PublishId = data.d.split('~')[1];
                $("#SaveID").attr("value", SavedId);
                if (isSaveNormal)
                    showAlertDialog("success", DesigntstructMessages.designSaved);
                $("#PublishID").val(PublishId);
                $("#IsPublish").val("Y");
            }
            else {
                showAlertDialog("error", "Error while save & publish design.");
            }
            ShowDimmer(false);
        }, error: function (error) {
            showAlertDialog("error", error);
            ShowDimmer(false);
        }
    });
}

function getEditJSON(transid){
    let res = [];
    try {
        ShowDimmer(true);
        $.ajax({
            url: 'addForm.aspx/CallGetAddFormData',
            type: 'POST',
            cache: false,
            async: false,
            data: JSON.stringify({ transid, getCaption: !caption }),
            dataType: 'json',
            contentType: "application/json",
            success: function (msg) {
                if (msg.d == "SESSION_TIMEOUT") {
                    parent.window.location.href = "../aspx/sess.aspx";
                }
                else if (msg.d != "") {
                    dataJSON = JSON.parse(msg.d);
                    if(dataJSON.fields && dataJSON.design){
                        let fields = [];
                        let design = [];

                        if(dataJSON.caption){
                            try {
                                caption = dataJSON.caption.result.row[0].caption;
                                callParentNew("axpertPopupWrapper", "id").querySelectorAll(".dwbLeftMenu")[0].textContent = `${caption}(${transid})`;
                            } catch (ex) {}
                        }

                        try {
                            fields = dataJSON.fields.result.row.filter(fld=>fld.hidden != "T");
                        } catch (ex) {}

                        try {
                            design = JSON.parse(dataJSON.design.result.row[0].content);
                        } catch (ex) {}

                        if(fields.length > 0){
                            fields.forEach((fld)=>{
                                if(fldDesign = design?.[0]?.dcs?.filter(dc=>dc.dc_id == "1")?.[0]?.fieldsDesign?.filter(designFld=>designFld.fld_id == fld.name)?.[0]){
                                    fld.design = {
                                        x: fldDesign.x, y: fldDesign.y, w: fldDesign.width, h: fldDesign.height
                                    };
                                }else{
                                    fld.design = {};
                                }
                            });

                            res = fields;
                        }
                    }
                }
                ShowDimmer(false);
            },
            error: function () {
                showAlertDialog("error", "Error while executing the query.");
                ShowDimmer(false);
            }
        });
        return res;
    }
    catch (exp) {
        showAlertDialog("error", "Error while executing the query.");
        ShowDimmer(false);
    }
}

function openFormProperties(elem) {
    if ($("#editFormProperties").length == 0) {
        elem.parents('body').find('editFormProperties').remove();
        appGlobalVarsObject._CONSTANTS.callerWindow = window;
    }
    else return;
}

function renderFormProperties(url){
    let myModal = new BSModal("editFormProperties", "Form Properties", `<iframe id="modal-editFormProperties" src="${url}&AxPop=true" class="w-100 vh-100"></iframe>`,
        (opening) => {
            $(myModal.modal._dialog).find("iframe").css({height: `${$(myModal.modal._dialog).find(".modal-body").height() - 10}px`}).removeClass("vh-100");

            // $(myModal.modal._element).attr("data-control-id", addedItemControlId).data("data-control-id", addedItemControlId);
            appGlobalVarsObject._CONSTANTS.callerWindow = window;
            appGlobalVarsObject._CONSTANTS.calledWindow = null;
        },
        (closed) => {
            if(appGlobalVarsObject._CONSTANTS.callerWindow) {
                appGlobalVarsObject._CONSTANTS.callerWindow = null;
            }
            appGlobalVarsObject._CONSTANTS.calledWindow = null;
        });

    myModal.scrollableDialog();

    // myModal.modalHeader.classList.add(...["p-5", "py-2"]);
    myModal.modalBody.classList.add(...["p-5", "py-2"]);
    myModal.modalFooter.classList.add(...["p-5", "py-2"]);


    myModal.cancelBtn.classList.add("d-none");
    myModal.cancelBtn.classList.add("btn-sm");

    myModal.okBtn.classList.add("btn-sm");
    myModal.okBtn.removeAttribute("data-bs-dismiss");
    myModal.okBtn.innerText = appGlobalVarsObject.lcm[399];
    myModal.okBtn.addEventListener("click", (e) => {
        $(document.getElementById("modal-editFormProperties"))[0].contentWindow.CallAction('iSave','','','n','n','','false');;
    });
}