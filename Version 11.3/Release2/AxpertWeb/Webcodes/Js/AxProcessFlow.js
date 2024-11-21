var armToken = "", axProcessObj;

var LoadIframe = callParentNew("LoadIframe");
var cardsData = {}, cardsDesign = {}, xmlMenuData = "", menuJson = "";
var _horizontalFlow = true;
var _autoLoadNextTask = true;
var _pagesize = 100;
var _pageno = 1;
var pendingtasksJson = {}, processflowJson = {}, taskdetailsJson = {}, completedtasksJson = {};
var _pendingTaskCount = 0;
callParentNew("AxNotifyMsgId=", '');
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

const queryString = window.location.search;
//const urlParams = new URLSearchParams(queryString);
var taskcards = "";

class AxProcessFlow {
    constructor() {
        this.isAxpertFlutter = !this.isNullOrEmpty(armToken);
        this.cardParams = {};
        this.cardFlds = {};
        this.processName = '';
        this.keyField = '';
        this.keyValue = '';
        this.taskCompleted = false;
        this.taskId = '';
        this.userType = 'GUEST';
        this.isTaskEditable = false;
        this.currentElem = null;
        this.taskStatus = '';
        this.currentIndex = 1;
        this.stepHtml = `
            <div class="step">
                <div>
                    <div class="circle d-none">
                        <i class="fa fa-check"></i>
                        <span class="Emp-steps-counts">{{sno}}</span>
                    </div>
                    <div class="line"></div>
                </div>
                <div class="Task-process-wrapper">
                    {{groupNameHtml}}
                    {{taskCaptionHtml}}
                </div>
            </div>`;
        this.groupNameHtml = `
            <div class="title">
                <a href="#">{{taskgroupname}}</a>
                    <span data-groupname="{{taskgroupname}}" class="Process-flow accordion-icon rotate">
                    <span  class="material-icons material-icons-style material-icons-2">chevron_right</span>
                </span>
            </div>`
        this.taskCaptionHtml = `<div class="process-sub-flow" data-groupname="{{taskgroupname}}">
            <div class="Task-process-list vertical-steps status-{{taskstatus}}" data-indexno='{{indexno}}' onclick="axProcessObj.openTask(this, '{{taskname}}', '{{tasktype}}', '{{transid}}', '{{keyfield}}', '{{keyvalue}}', '{{recordid}}', '{{taskid}}', '{{indexno}}','{{hlink_transid}}','{{hlink_params}}','{{processname}}');" data-taskid="{{taskid}}" data-tasktype="{{tasktype}}" data-transid="{{transid}}" data-recordid="{{recordid}}">
                <a href="#">{{taskname}}</a>
            </div>
        </div>`;
        this.bulkTaskRowHtml = `
        <div class="table align-middle  fs-6 gy-5 mb-0 dataTable no-footer task-listing-card">
            
               
                        <div class="d-flex flex-column task-name">
<div class="d-flex">
                            <input type="checkbox" value="" class="form-check-input task-list-checkbox my-auto" data-taskid="{{taskid}}" >
                            <a href="javascript:void(0)"  class="text-gray-800 fw-bolder fs-6 task-title pt-0 pb-2 px-0" title="{{displaytitle}}"><span href="javascript:void(0)"><span class="material-icons material-icons-style material-icons-1 display-icon task-listing-icons">{{displayicon}}</span>{{displaytitle}}</span></a>
                            </div><div class="task-subtitle">{{displaycontent}}</div>
                        </div>
                  

                        <div class="d-flex flex-row task-process gap-5">
                            <a href="javascript:void(0)" class="d-flex text-gray-800 task-assignedBy my-auto mb-1 gap-2" title="Assigned By"><span class="material-icons material-icons-style p-0">person</span><span class="p-0"> {{fromuser}}</span></a>
                            <a href="javascript:void(0)" title="Assigned On" class="d-flex text-gray-800 mb-1 task-date my-auto gap-2"><span class="material-icons material-icons-style p-0">today</span><span class="p-0"> {{eventdatetime}}</span></a>
                        </div>
                                      
           
        </div>`;

        this.horizontalStepHtml = `<li class="{{taskstatus}}">
                                <a href="javascript:void(0)" onclick="axProcessObj.openTask(this, '{{taskname}}', '{{tasktype}}', '{{transid}}', '{{keyfield}}', '{{keyvalue}}', '{{recordid}}', '{{taskid}}', '{{indexno}}','{{hlink_transid}}','{{hlink_params}}','{{processname}}');" data-taskid="{{taskid}}" data-tasktype="{{tasktype}}" data-transid="{{transid}}" data-recordid="{{recordid}}" data-taskname="{{taskname}}" data-indexno='{{indexno}}' class="horizontal-steps {{taskstatus}}">
                                    <span class="circle">{{sno}}</span>
                                    <span class="label">{{taskname}}</span>
                                </a>
                            </li>`;

        this.dataSources = [];
        this.processFlowObj = {};
        this.processProgressObj = {};
        this.getUrlParams();
        this.horizontalFlow = _horizontalFlow;
        this.autoLoadNextTask = _autoLoadNextTask;

        this.processVars = {
            plistTbIcons: ["add_task", "receipt_long", "post_add", "library_books", "free_cancellation", "published_with_changes"],
            plistCols: {
                taskName: {
                    caption: "Task Name",
                    hidden: false,
                },
            },
            pStatus: {
                approve: {
                    badgeColor: "badge-light-success",
                    bgColor: "bg-light-success",
                    borderColor: "border-light-success",
                    color: "bg-success",
                    iconColor: "text-success",
                },
                approved: {
                    badgeColor: "badge-light-success",
                    bgColor: "bg-light-success",
                    borderColor: "border-light-success",
                    color: "bg-success",
                    iconColor: "text-success",
                },
                check: {
                    badgeColor: "badge-light-custom-checked",
                    bgColor: "bg-light-custom-checked",
                    borderColor: "border-light-custom-checked",
                    color: "bg-custom-checked",
                    iconColor: "text-custom-checked",
                },
                checked: {
                    badgeColor: "badge-light-custom-checked",
                    bgColor: "bg-light-custom-checked",
                    borderColor: "border-light-custom-checked",
                    color: "bg-custom-checked",
                    iconColor: "text-custom-checked",
                },
                made: {
                    badgeColor: "badge-light-primary",
                    bgColor: "bg-light-primary",
                    borderColor: "border-light-primary",
                    color: "bg-primary",

                },
                make: {
                    badgeColor: "badge-light-primary",
                    bgColor: "bg-light-primary",
                    borderColor: "border-light-primary",
                    color: "bg-primary",

                },
                rejected: {
                    badgeColor: "badge-light-danger",
                    bgColor: "bg-light-danger",
                    borderColor: "border-light-danger",
                    color: "bg-danger",

                },
                returned: {
                    badgeColor: "badge-light-warning",
                    bgColor: "bg-light-warning",
                    borderColor: "border-light-warning",
                    color: "bg-warning",

                },
            }
        };
        this.toolbarDrawerHTML = `<div class="Tkts-toolbar-Right">
                            <button id="" type="submit" class="btn btn-sm btn-icon btn-primary btn-active-primary btn-custom-border-radius d-none">
                                <span class="material-icons material-icons-style material-icons-2">add_task</span>
                            </button>
                            <button type="submit" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm" onclick="axProcessObj.taskFilter('reset')" id="reset">
                                <span class="material-icons material-icons-style material-icons-2">refresh</span>
                            </button>


                            <button type="submit" id="" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm">
                                <span class="material-icons material-icons-style material-icons-2">history_toggle_off</span>
                            </button>
                        </div>`;

        this.annHTML = `<div class="menu-item px-3">
            <a class="menu-link px-3 border-bottom" href="javascript:void(0);" data-newtstruct>
                <span class="symbol symbol-30px symbol-circle me-5">
                    <span class="symbol-label bg-primary text-white fw-normal fs-3 material-icons"></annIcon></span>
                </span>
                <span class="fw-normal addCaption"></annCaption></span>
            </a>
        </div>`;

        this.allTskHTML = `<div class="custom-menu-item px-3">
            <span class="custom-menu-link px-3 border-bottom">
                <span class="form-check form-check-custom form-check-solid me-2">
                    <input class="form-check-input h-25px w-25px menu-task" type="checkbox" checked="checked"/>
                </span>
                <span class="symbol symbol-30px symbol-circle me-2">
                    <span class="symbol-label bg-light-primary text-primary fw-normal fs-3 material-icons border border-light-primary"></annIcon></span>
                </span>
                <span class="fw-normal menu-task-text"></annCaption></span>
            </span>
        </div>`;
        this.calledFrom = "";
        this.getProcessUserType();
    }

    getProcessUserType() {
        let _this = this, data = {}, url = "";
        url = "../aspx/AxPEG.aspx/AxGetProcessUserType";
        data = { processName: this.processName };

        this.callAPI(url, data, false, result => {
            if (result.success) {
                let json = JSON.parse(result.response);
                if (json.d == 'Error in ARM connection.') {
                    showAlertDialog("error", 'Error in ARM connection.');
                    return;
                }
                let dataResult = _this.dataConvert(json, "ARM");
                dataResult.every((rowData) => {
                    if (rowData.tasktype?.toUpperCase() == "APPROVE") {
                        this.userType = "APPROVER";
                        return false;
                    }

                    if (rowData.tasktype?.toUpperCase() == "MAKE") {
                        this.userType = "MAKER";
                        return false;
                    }

                    return true;
                })
            }
        });
    }

    getNextTaskInProcess() {
        var nextTask = false;
        if (!this.autoLoadNextTask)
            return nextTask;

        let _this = this, data = {}, url = "";
        url = "../aspx/AxPEG.aspx/AxGetNextTaskInProcess";
        data = { processName: this.processName, keyValue: this.keyValue };
        this.callAPI(url, data, false, result => {
            if (result.success) {
                let json = JSON.parse(result.response);
                let dataResult = _this.dataConvert(json, "ARM");
                if (dataResult.length > 0) {
                    let rowData = dataResult[0];
                    if (this.horizontalFlow && rowData.nexttasktype != "Current Process")
                        nextTask = false;

                    if ('URLSearchParams' in window) {
                        nextTask = true;
                        var searchParams = new URLSearchParams(window.location.search);
                        searchParams.set("keyfield", rowData.keyfield);
                        searchParams.set("keyvalue", rowData.keyvalue);
                        searchParams.set("taskid", rowData.taskid);
                        searchParams.set("target", "");
                        window.location.search = searchParams.toString();
                    }
                }
                else {
                    //Load homepage
                    callParentNew('LoadIframe(loadhomepage)', 'function');
                    nextTask = true;
                }
            }
        });
        return nextTask;
    }


    showProcessTree() {
        if (this.isNullOrEmpty(axProcessTreeObj) || this.isUndefined(axProcessTreeObj)) {
            axProcessTreeObj = new AxProcessTree(this.processName);
        }
        axProcessTreeObj.showProcessTree();
    }

    reloadProcess(recordId) {
        this.taskCompleted = true;
        ShowDimmer(true);
        let _this = this;
        let url = "../aspx/AxPEG.aspx/AxGetKeyValue";
        let data = { processName: this.processName, recordId: recordId };
        this.callAPI(url, data, false, result => {
            if (result.success) {
                let json = JSON.parse(result.response);
                let dataResult = _this.dataConvert(json, "ARM");
                _this.refreshProcess(dataResult[0].keyvalue);
            }
        });
    };

    refreshPage() {
        window.location.href = window.location.href;
    }

    refreshProcess(keyValue) {
        ShowDimmer(true);
        const params = new URLSearchParams(location.search);
        params.set('keyvalue', keyValue);
        window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
        document.querySelector("#process_centerpanel").classList.add("d-none");
        document.querySelector("#horizontal-processbar").classList.remove("d-none");
        let $rightIframe = document.querySelector("#rightIframe");
        $rightIframe.setAttribute("src", "");
        $rightIframe.classList.remove("d-none");

        //window.location.href = window.location.href;
        //this.dataSources = [];
        //this.processFlowObj = {};
        this.keyValue = keyValue;
        //this.init();
        if (this.horizontalFlow)
            this.showProgress();
        else
            this.showVerticalProgress();
        this.fetchProcessList("ProcessList", "TaskCompletion")
        //this.showVerticalProgress();
        //this.fetchProcessKeyValues("ProcessKeyValues");
    };

    hideDefaultCenterPanel() {
        document.querySelector("#process_centerpanel").classList.add("d-none");
        document.querySelector("#horizontal-processbar").classList.remove("d-none");
    }

    fetchProcessList(name, from) {
        let _this = this, data = {}, url = "";
        if (typeof from != 'undefined' && from == 'TaskCompletion')
            url = "../aspx/AxPEG.aspx/AxGetCompletedTasks";
        else
            url = "../aspx/AxPEG.aspx/AxGetPendingActiveTasks";

        data = { pageNo: _pageno, pageSize: _pagesize };

        this.callAPI(url, data, true, result => {
            if (result.success) {
                let json = JSON.parse(result.response);
                if (json.d == 'Error in ARM connection.') {
                    ShowDimmer(false);
                    showAlertDialog("error", 'Error in ARM connection.');
                    return;
                }
                let dataResult = _this.dataConvert(json, "ARM");
                //processflowJson = dataResult.result.processflow;
                //taskdetailsJson = dataResult.result.taskdetails[0];
                _pendingTaskCount = dataResult.result.count;
                if (typeof from != 'undefined' && from == 'TaskCompletion') {
                    completedtasksJson = dataResult.result.completedtasks;
                    if (typeof completedtasksJson != "undefined" && completedtasksJson.length > 0)
                        _this.showProcessList('completed');
                    else
                        ShowDimmer(false);
                }
                else {
                    pendingtasksJson = dataResult.result.pendingtasks;
                    if (pendingtasksJson.length > 0)
                        _this.showProcessList('pending');
                    else
                        ShowDimmer(false);
                }
                //_this.showProgressNew();
                //_this.openTask('', taskdetailsJson.taskname,taskdetailsJson.tasktype, taskdetailsJson.transid, taskdetailsJson.keyfield, taskdetailsJson.keyvalue, taskdetailsJson.recordid, taskdetailsJson.taskid, taskdetailsJson.indexno, 'LeftPanel');
                ////openTask(this, '${plst.taskname}','${plst.tasktype}','${plst.transid}','${plst.keyfield}','${plst.keyvalue}','${plst.recordid}','${plst.taskid}', '${plst.indexno}', 'LeftPanel');"
            }
        });
    };

    filterProcessList(reset) {
        if (reset)
            document.querySelector("#advTextSearch").value = "";

        var searchTerm = document.querySelector("#advTextSearch").value;
        let _this = this;
        if (!_this.inValid(searchTerm)) {
            searchTerm = searchTerm.toLowerCase();
            var filteredResults = axProcessObj.dataSources["ProcessList"].list.filter(function (item) {
                return item.displaytitle?.toLowerCase().includes(searchTerm);
            });

            document.querySelectorAll(`#plistAccordion tr`).forEach((listItems) => {
                listItems.classList.add("d-none");
                listItems.classList.add("filterApplied");
            });

            if (filteredResults.length > 0) {
                filteredResults.forEach((filteredRow) => {
                    document.querySelectorAll(`.filterApplied [data-taskid="${filteredRow.taskid}"]`).forEach((i) => {
                        i?.closest('tr')?.classList.remove("d-none");
                        i?.closest('tr')?.classList.remove("filterApplied");
                    })
                })
            }
        }
        else {
            document.querySelectorAll(`.filterApplied`).forEach((filteredRow) => {
                filteredRow.classList.remove("d-none");
                filteredRow.classList.remove("filterApplied");
            });
        }
    }

    fetchProcessKeyValues(name) {
        let _this = this;
        let url = "../aspx/AxPEG.aspx/AxGetProcessKeyValues";
        let data = { processName: this.processName };
        this.callAPI(url, data, true, result => {
            if (result.success) {
                let json = JSON.parse(result.response);
                let dataResult = _this.dataConvert(json, "ARM");
                let dataArray = [];
                dataResult.forEach((item) => {
                    dataArray.push({ id: item.keyvalue, text: item.keyvalue })
                })
                $("select#keyvalues-select").select2({
                    placeHolder: "Search...",
                    data: dataArray
                }).on('select2:select', function (e) {
                    let keyValue = e.params.data.text;
                    _this.refreshProcess(keyValue);
                }).on('select2:open', () => {
                    $(this).find('.select2-search__field').focus();
                }).on('select2:close', () => {
                    $('.searchBoxChildContainer.search').addClass('d-none');
                });
            }
        });
    };

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
        return elem == null || elem == 'null';
    };

    isNullOrEmpty(elem) {
        return elem == null || elem == 'null' || elem == "";
    };

    isUndefined(elem) {
        return typeof elem == "undefined";
    };

    inValid(elem) {
        return elem == null || typeof elem == "undefined" || elem == "";
    };

    showVerticalProgress(elem) {
        let _this = this, data = {}, url = "";
        url = "../aspx/AxPEG.aspx/AxGetProcess";
        data = { processName: this.processName, keyField: this.keyField, keyValue: this.keyValue };
        let elemTaskId = elem?.dataset?.taskid || this.taskId;
        this.callAPI(url, data, true, result => {
            if (result.success) {
                _this.hideDefaultCenterPanel();
                ShowDimmer(false);
                let json = JSON.parse(result.response);
                let dataResult = _this.dataConvert(json, "ARM");
                this.processProgressObj = {};
                dataResult.forEach((rowData, idx) => {
                    let tempTaskType = rowData.tasktype.toUpperCase();
                    if (["IF", "ELSE", "ELSE IF", "END"].indexOf(tempTaskType) == -1) {
                        if (this.isNullOrEmpty(rowData.taskstatus) && rowData.indexno > 1) {
                            rowData.taskstatus = "disabled";
                            return;
                        }

                        if (this.isUndefined(this.processProgressObj[rowData.taskname])) {
                            this.processProgressObj[rowData.taskname] = {};
                            this.processProgressObj[rowData.taskname].group_name_html = '';
                            this.processProgressObj[rowData.taskname].task_caption_html = '';
                        }

                        if (this.isNullOrEmpty(rowData.recordid)) {
                            rowData.recordid = "0";
                        }

                        let taskGroup = this.processProgressObj[rowData.taskname];
                        taskGroup.indexno = rowData.indexno;
                        //taskGroup.group_name_html = Handlebars.compile(this.groupNameHtml)(rowData);
                        taskGroup.task_caption_html += Handlebars.compile(this.taskCaptionHtml)(rowData);
                    }
                });

                document.querySelector('#procflow-steps').innerHTML = "";
                //if (this.isNullOrEmpty(this.keyValue))
                //    document.querySelector('#process-ref').innerText = '';
                //else
                //    document.querySelector('#process-ref').innerText = `Identifier : ${this.keyValue}`.toUpperCase();

                let sno = 1;
                for (let [key, value] of Object.entries(this.processProgressObj)) {
                    document.querySelector('#procflow-steps').insertAdjacentHTML("beforeend", ` ${this.stepHtml.replace("{{sno}}", sno).replace("{{groupNameHtml}}", value.group_name_html).replace("{{taskCaptionHtml}}", value.task_caption_html)} `);
                    sno++;
                }
                ShowDimmer(false);

                //let activeTask = document.querySelector('.status-active');
                //if (!this.isUndefined(this.taskId) && !this.isNullOrEmpty(this.taskId)) {
                //    ShowDimmer(true);
                //    document.querySelector(`.Task-process-list[data-taskid="${this.taskId}"]`).click();
                //}
                //else if (!this.isUndefined(this.transId) && !this.isNullOrEmpty(this.transId)) {
                //    ShowDimmer(true);
                //    document.querySelector(`.Task-process-list[data-transid="${this.transid}"][data-tasktype="Make"]`).click();
                //}
                //else if (this.isNull(activeTask)) {
                //    ShowDimmer(true);
                //    document.querySelector('.Task-process-list').click();
                //}
                //else {
                //    ShowDimmer(true);
                //    activeTask.click();
                //}

                if (this.taskCompleted) {
                    this.taskCompleted = false;
                    let nextTask = this.getNextTaskInProcess();
                    if (!nextTask) {
                        if (!this.inValid(document.querySelector(".vertical-steps.status-Active"))) {
                            this.calledFrom = "ProgressBar";
                            document.querySelector(".vertical-steps.status-Active")?.click();
                            document.querySelector(".vertical-steps.status-Active")?.scrollIntoView();
                            elemTaskId = document.querySelector(".vertical-steps.status-Active").dataset?.taskid;
                        }
                        else if (!this.inValid(document.querySelector(".vertical-steps"))) {
                            this.calledFrom = "ProgressBar";
                            document.querySelector(".vertical-steps")?.click();
                            document.querySelector(".vertical-steps")?.scrollIntoView();
                            elemTaskId = document.querySelector(".vertical-steps").dataset?.taskid;
                        }
                    }
                }
                else if (!this.inValid(this.taskId)) {
                    this.calledFrom = "ProgressBar";
                    let selector = `.vertical-steps[data-taskid="${this.taskId}"]`;
                    if (!this.inValid(document.querySelector(selector))) {
                        document.querySelector(selector)?.click();
                        document.querySelector(selector)?.scrollIntoView();
                        if (this.inValid(elemTaskId))
                            elemTaskId = document.querySelector(selector).dataset?.taskid;
                    }
                    this.target = null;
                }
                else if (!this.inValid(this.target)) {
                    this.calledFrom = "ProgressBar";
                    let selector = `.vertical-steps[data-taskname="${this.target}"]`;
                    if (!this.inValid(document.querySelector(selector))) {
                        document.querySelector(selector)?.click();
                        document.querySelector(selector)?.scrollIntoView();
                        if (this.inValid(elemTaskId))
                            elemTaskId = document.querySelector(selector).dataset?.taskid;
                    }
                    else if (!this.inValid(document.querySelector(".vertical-steps"))) {
                        this.calledFrom = "ProgressBar";
                        document.querySelector(".vertical-steps")?.click();
                        document.querySelector(".vertical-steps")?.scrollIntoView();
                        if (this.inValid(elemTaskId))
                            elemTaskId = document.querySelector(".vertical-steps").dataset?.taskid;
                    }
                    this.target = null;
                }

                if (!_this.inValid(elemTaskId)) {
                    _this.setActiveInList(elemTaskId);
                }

                $(".accordion-icon").click(function () {
                    let groupname = $(this).attr('data-groupname');
                    $(this).toggleClass('rotate');
                    $(`.process-sub-flow[data-groupname="${groupname}"]`).toggle();
                });

            }
        });
    };

    showHorizontalProcessFlow() {
        let sno = 1;
        document.querySelector('#horizontal-processbar').innerHTML = "";
        this.dataSources["Process"].forEach((rowData, idx) => {
            let tempTaskType = rowData.tasktype.toUpperCase();
            if (["IF", "ELSE", "ELSE IF", "END"].indexOf(tempTaskType) == -1) {
                if (this.isNullOrEmpty(rowData.taskstatus) && rowData.indexno > 1) {
                    rowData.taskstatus = "disabled";
                }
                else if (["APPROVED", "REJECTED", "RETURNED", "CHECKED", "MADE"].indexOf(rowData.taskstatus?.toUpperCase())) {
                    rowData.taskstatus = "completed";
                }

                if (this.taskId == rowData.taskid) {
                    rowData.taskstatus = "active";
                }

                if (this.isNullOrEmpty(rowData.recordid)) {
                    rowData.recordid = "0";
                }

                rowData.sno = sno;
                sno++;

                document.querySelector('#horizontal-processbar').insertAdjacentHTML("beforeend", ` ${Handlebars.compile(this.horizontalStepHtml)(rowData)} `);


            }
        });



        //for (let [key, value] of Object.entries(this.processProgressObj)) {
        //    document.querySelector('#procflow-steps').insertAdjacentHTML("beforeend", ` ${this.horizontalStepHtml} `);

        //}
        ShowDimmer(false);
    };

    openTask(elem, taskName, taskType, transId, keyField, keyValue, recordId, taskId, indexNo, hLinkPage, hLinkParam, processName, messageType, calledFrom) {
        ShowDimmer(true);
        this.currentIndex = parseInt(indexNo);
        this.keyField = keyField;
        this.keyValue = keyValue || this.keyValue;
        this.taskId = taskId;
        this.processName = processName;
        this.taskType = taskType;
        if (!this.inValid(calledFrom))
            this.calledFrom = calledFrom;
        callParentNew("AxNotifyMsgId=", '');
        if (!this.inValid(messageType) && (messageType.toLowerCase() == "message" || messageType.toLowerCase() == "form notification" || messageType.toLowerCase() == "periodic notification"))
            taskType = messageType;
        switch (taskType.toUpperCase()) {
            case "MAKE":
                document.querySelector("#pd_timeline").classList.remove("d-none");
                this.showProgressNew();
                this.openTstruct(taskName, transId, keyField, keyValue, recordId);
                break;
            case "CHECK":
                document.querySelector("#pd_timeline").classList.remove("d-none");
                this.showProgressNew();
                this.openProcessTask(taskName, taskType, taskId);
                break;
            case "APPROVE":
                document.querySelector("#pd_timeline").classList.remove("d-none");
                this.showProgressNew();
                this.openProcessTask(taskName, taskType, taskId);
                break;
            case "FORM NOTIFICATION":
            case "PERIODIC NOTIFICATION":
            case "MESSAGE":
                document.querySelector("#pd_timeline").classList.add("d-none");
                this.openMessageLink(hLinkPage, hLinkParam);
                break;
            case "CACHED SAVE":
                document.querySelector("#pd_timeline").classList.add("d-none");
                this.openMessageLinkCachedSave(hLinkPage, hLinkParam, taskId);
                break;
        }
    };

    setActiveInList(elemTaskId) {
        document.querySelectorAll(`[data-taskid="${elemTaskId}"]`).forEach((elem) => {
            if (elem.classList.contains("Procurement-list")) {
                document.querySelector(".Procurement-list-wrap.active")?.classList.remove("active");
                elem.closest(`.Procurement-list-wrap`)?.classList.add("active");
            }

            if (elem.classList.contains("horizontal-steps")) {
                document.querySelectorAll(".horizontal-steps").forEach((step) => {
                    step.closest("li")?.classList.remove("Active");
                });

                elem.closest(`li`)?.classList.add("Active");
                //elem.scrollIntoView();
            }
        });
    }


    openRightSideCards(taskname, keyvalue) {
        ShowDimmer(true);
        /* Variables from mainpage */


        files.js.push("/../ThirdParty/lodash.min.js");
        files.js.push("/../ThirdParty/deepdash.min.js");

        files.js.push("/../Js/handlebars.min.js?v=1");
        files.js.push("/../Js/handleBarsHelpers.min.js");

        files.js.push("/../ThirdParty/Highcharts/highcharts-3d.js");
        files.js.push("/../ThirdParty/Highcharts/highcharts-more.js");
        files.js.push("/../ThirdParty/Highcharts/highcharts.js");
        files.js.push("/../ThirdParty/Highcharts/highcharts-exporting.js");
        files.js.push("/../Js/high-charts-functions.min.js?v=20");
        files.js.push("/../Js/AxInterface.min.js?v=10");

        files.js.push("/../ThirdParty/DataTables-1.10.13/media/js/jquery.dataTables.js");
        files.js.push("/../ThirdParty/DataTables-1.10.13/media/js/dataTables.bootstrap.js");

        files.js.push("/../ThirdParty/DataTables-1.10.13/extensions/Extras/moment.min.js");
        files.css.push("/../ThirdParty/fullcalendar/lib/main.min.css");
        files.js.push("/../ThirdParty/fullcalendar/lib/main.min.js");

        if (cardsDashboardObj.isMobile) {
            files.js.push("/../ThirdParty/jquery-ui-touch-punch-master/jquery.ui.touch-punch.min.js");
        }

        if (cardsDashboardObj.enableMasonry) {
            files.js.push("/../ThirdParty/masonry/masonry.pkgd.min.js");
        }

        //files.js.push(`/HTMLPages/js/axpertFlutterCustomDashboard.js?v=2`);

        if (document.getElementsByTagName("body")[0].classList.contains("btextDir-rtl")) {
            cardsDashboardObj.dirLeft = false;
        }



        loadAndCall({
            files: files,
            callBack: () => {

                $(function () {
                    //deepdash(_);

                    $.ajax({
                        url: "../aspx/AxPEG.aspx/AxGetCardsData",
                        type: 'POST',
                        cache: false,
                        async: true,
                        data: JSON.stringify({
                            processName: axProcessObj.processName || '', taskName: taskname || '', keyValue: keyvalue || ''
                        }),
                        dataType: 'json',
                        contentType: "application/json",
                        success: (data) => {
                            if (data.d && data.d != "") {
                                let result = JSON.parse(data.d);
                                if (result?.result?.success) {
                                    document.querySelector("#PROFLOW_Right_Last").classList.remove("d-none");
                                    var rightclassList = document.querySelector("#PROFLOW_Right").classList;
                                    rightclassList.remove('col-md-9', 'col-xl-9');
                                    rightclassList.add('col-md-7', 'col-xl-7');
                                }
                                else {
                                    document.querySelector("#PROFLOW_Right_Last").classList.add("d-none");
                                    var rightclassList = document.querySelector("#PROFLOW_Right").classList;
                                    rightclassList.add('col-md-9', 'col-xl-9');
                                    rightclassList.remove('col-md-7', 'col-xl-7');
                                    return;
                                }
                                cardsData.value = JSON.stringify(result.result.cards);
                                cardsDesign.value = "";
                                //xmlMenuData = result.menu;
                                //taskcards = JSON.parse(result.taskcards).result[0].result.row;
                                //if (taskcards != '') {
                                //    taskcards = taskcards.map(item => item.cardname);
                                //}
                            } else {
                                showAlertDialog("error", "Error while loading cards dashboard..!!");
                                return;
                            }

                            if (xmlMenuData != "") {
                                xmlMenuData = xmlMenuData.replace(/&apos;/g, "'");
                                var xml = parseXml(xmlMenuData)
                                var xmltojson = xml2json(xml, "");
                                menuJson = JSON.parse(xmltojson);
                            }
                            appGlobalVarsObject._CONSTANTS.menuConfiguration = $.extend(true, {},
                                appGlobalVarsObject._CONSTANTS.menuConfiguration, {
                                menuJson: menuJson,
                            });
                            // try {
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
                                        cardsDiv: ".cardsPlot",
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
                        },
                        error: (error) => {
                            ShowDimmer(false);
                            showAlertDialog("error", "Error while loading cards dashboard..!!");
                            return;
                        },
                        failure: (error) => {
                            ShowDimmer(false);
                            showAlertDialog("error", "Error while loading cards dashboard..!!");
                            return;
                        },
                    });

                    //start cards dasboard Init



                    // } catch (ex) {
                    //     showAlertDialog("error", ex.Message);
                    // }
                });

                //axTimeLineObj = new ProcessTimeLine();
                //axTimeLineObj.keyvalue = urlParams.get('keyvalue');
                //axTimeLineObj.getTimeLineData();
            }
        });
        //End cards dashboard Code
    }

    isEditableTask(taskName, keyValue) {
        var isEditable = false;
        let _this = this;
        let url = "../aspx/AxPEG.aspx/AxGetEditableTask";
        let data = { processName: this.processName, taskName: taskName, keyValue: keyValue, indexNo: this.currentIndex };
        this.callAPI(url, data, false, result => {
            if (result.success) {
                let json = JSON.parse(result.response);
                let dataResult = _this.dataConvert(json, "ARM");
                if (dataResult?.length > 0) {
                    let rowData = dataResult[0];
                    if (rowData?.editable == 'T')
                        isEditable = true
                }
            }
        });
        return isEditable;
    }

    openTstruct(taskName, transId, keyField, keyValue, recordId) {
        ShowDimmer(true);
        let isProcess = (this.userType == "APPROVER" ? "&fromprocess=true" : "");
        let isPegEdit = '';
        if (!this.inValid(this.keyValue) && this.keyValue != "NA" && (document.querySelector(`[data-tasktype="Make"][data-transid="${transId}"][data-recordid="0"]`) == null || this.currentElem?.classList.contains('completed'))) {
            var isEditable = this.isEditableTask(taskName, this.keyValue);
            isPegEdit = `&ispegedit=${isEditable.toString()}`;

            if (isEditable === false) {
                this.isTaskEditable = false;
            }
            else {
                this.isTaskEditable = true;
            }
        }

        let url = `../aspx/tstruct.aspx?transid=${transId}${isProcess}${isPegEdit}`;
        if (this.isNullOrEmpty(recordId))
            recordId = "0";
        if (recordId != "0")
            url += `&act=load&recordid=${recordId}`;
        else {
            if (keyValue != "" && keyValue != '{{keyvalue}}') {
                url += `&act=open&${keyField}=${keyValue}`
            }
            else {
                url += `&act=open&${this.keyField}=${this.keyValue}`
            }
        }
        document.querySelector("#process_centerpanel").classList.add("d-none");
        document.querySelector("#horizontal-processbar").classList.remove("d-none");
        let $rightIframe = document.querySelector("#rightIframe");
        $rightIframe.classList.remove("d-none");
        $rightIframe.setAttribute("src", "");
        $rightIframe.setAttribute("src", url);
        //ShowDimmer(false);
    };

    openMessageLink(pageType, pageParams) {
        ShowDimmer(true);
        if (pageType == '') {
            showAlertDialog("error", 'Page name should not be empty.');
            return false;
        }
        let url = '';
        pageParams = pageParams.replace("^", "&");
        if (pageType.startsWith('i')) {
            pageType = pageType.substring(1);
            url = `../aspx/iview.aspx?ivname=${pageType}&${pageParams}`;
        } else if (pageType.startsWith('t')) {
            pageType = pageType.substring(1);
            url = `../aspx/tstruct.aspx?transid=${pageType}&${pageParams}`;
        } else if (pageType.startsWith('c')) {
            //pageType = pageType.substring(2);
            url = `../aspx/${pageParams}`;
        }
        document.querySelector("#process_centerpanel").classList.add("d-none");
        document.querySelector("#horizontal-processbar").classList.add("d-none");
        let $rightIframe = document.querySelector("#rightIframe");
        $rightIframe.classList.remove("d-none");
        $rightIframe.setAttribute("src", "");
        $rightIframe.setAttribute("src", url);
        if (pageType.startsWith('c'))
            ShowDimmer(false);
    };

    openMessageLinkCachedSave(pageType, pageParams, taskId) {
        ShowDimmer(true);
        if (pageType == '') {
            showAlertDialog("error", 'Page name should not be empty.');
            return false;
        }
        let url = '';
        pageParams = pageParams.replace("^", "&");
        if (pageType.startsWith('i')) {
            pageType = pageType.substring(1);
            url = `../aspx/iview.aspx?ivname=${pageType}&${pageParams}`;
        } else if (pageType.startsWith('t')) {
            pageType = pageType.substring(1);
            callParentNew("AxNotifyMsgId=", taskId);
            url = `../aspx/tstruct.aspx?transid=${pageType}&${pageParams}`;
        } else if (pageType.startsWith('c')) {
            //pageType = pageType.substring(2);
            url = `../aspx/${pageParams}`;
        }
        document.querySelector("#process_centerpanel").classList.add("d-none");
        document.querySelector("#horizontal-processbar").classList.add("d-none");
        let $rightIframe = document.querySelector("#rightIframe");
        $rightIframe.classList.remove("d-none");
        $rightIframe.setAttribute("src", "");
        $rightIframe.setAttribute("src", url);
        if (pageType.startsWith('c'))
            ShowDimmer(false);
    };

    newTstruct(transId, taskName) {
        ShowDimmer(true);

        document.querySelector("#process_centerpanel").classList.add("d-none");
        document.querySelector("#horizontal-processbar").classList.remove("d-none");
        let isProcess = (this.userType == "APPROVER" ? "fromprocess=true&" : "");
        let url = `../aspx/tstruct.aspx?${isProcess}transid=${transId}&act=open`;
        let $rightIframe = document.querySelector("#rightIframe");
        $rightIframe.classList.remove("d-none");
        $rightIframe.setAttribute("src", "");
        $rightIframe.setAttribute("src", url);
        this.keyValue = "NA";
        if (this.horizontalFlow)
            this.showProgress();
        else
            this.showVerticalProgress();
        axProcessObj.openRightSideCards(taskName, "NA");
        ShowDimmer(false);
    };

    openBulkApprove() {
        let _this = this;
        try {
            let _this = this, data = {}, url = "";
            url = "../aspx/AxPEG.aspx/AxGetBulkApprovalCount";
            data = {};
            this.callAPI(url, data, true, result => {
                if (result.success) {
                    let json = JSON.parse(result.response);
                    json = JSON.parse(json.d);
                    json = JSON.parse(json.result.data);
                    let allTasks = '';
                    json.forEach((item) => {
                        allTasks += `<div class="d-flex custom-menu-item px-4 py-2 border-1 border-bottom">
<div class="symbol symbol-45px">
                        <span class="symbol-label">
                            <img alt="{{processname}}" class=" w-30px" src="../custompages/icons/{{processname}}.png"
                                onerror="this.onerror=null;this.src='../custompages/icons/default.png';">

                        </span></div>
            <div class="d-flex align-items-center " onclick="axProcessObj.openBulkApprovePopup('${item.processname}')">
                        <span class="custom-menu-link px-3">
                            <span class="fw-normal fs-5 menu-task-text">${item.processname} (${item.pendingapprovals})</span>
                        </span></div>
                        </div>`;
                    });

                    document.getElementsByTagName("pd-allTasksNew")[0].outerHTML = allTasks;
                }
            });


        } catch (error) {
            showAlertDialog("error", error.message);
        }
    }

    openBulkApprovePopup(processName) {
        let _this = this;
        document.querySelector("body").click();
        this.processName = processName;
        let modalObj = {
            "id": `ldbApprove`
        };
        modalObj.iFrameModalBody = `
            <div class="card-body d-flex  row">
                <div class="w-100" id="Bulk-SelectALL-wrap">
                    <div class="form-check" style="position:absolute">
                      <input class="form-check-input task-list-checkbox" type="checkbox" id="select-all-checkbox">
                      <label class="form-check-label" for="select-all-checkbox">
                        Select All
                      </label>
                    </div>
                    <h4 style="margin-left: 295px; font-weight:bold">Bulk Approvals</h4>
                </div>
                <div class="w-100" id="BulkActiveList_Container">
                </div>
                <div class="w-100 mt-3">
                    <div class="approval-controls" data-tasktype="Approve">
                        <label class="form-label col-form-label mandatory">Bulk Approval Comments</label>
                        <div class="input-group">
                            <textarea data-tasktype="Approve" class="form-control"
                                data-tasktype="Approve" id="BULKAPPROVEComments"></textarea>
                        </div>
                    </div>
                </div>
                <div>
                    <button  style="float:right " class="btn btn-primary btn-sm mt-2" type="button" onclick="axProcessObj.doBulkAction('BULKAPPROVE','APPROVE');">Bulk Approve</button>
                </div>
            </div>`;
        modalObj.size = "lg";
        modalObj.opening = _this.bulkInit;

        try {
            let myModal = new BSModal(`modal_${modalObj.id}`, "", modalObj.iFrameModalBody,
                (opening) => { _this.bulkInit(); ShowDimmer(false); }, (closing) => { }
            );

            myModal.changeSize(modalObj.size || "fullscreen");
            myModal.hideHeader();
            myModal.hideFooter();
            myModal.showFloatingClose();
        } catch (error) {
            showAlertDialog("error", error.message);
        }
    }

    fetchBulkTasks(name) {
        let _this = this;
        let url = "../aspx/AxPEG.aspx/AxGetBulkActiveTasks";
        let data = { processName: _this.processName, taskType: "Approve" };

        this.callAPI(url, data, true, result => {
            if (result.success) {
                let json = JSON.parse(result.response);
                let dataResult = _this.dataConvert(json, "ARM");
                _this.dataSources[name] = JSON.parse(dataResult);
                this.showBulkTasks();
                ShowDimmer(false);
            } else {
                ShowDimmer(false);
            }
        });
    }

    bulkInit() {
        this.fetchBulkTasks("BulkTasks");
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        selectAllCheckbox?.addEventListener('change', function () {
            const checkboxes = document.querySelectorAll('.task-list-checkbox');
            checkboxes.forEach(function (checkbox) {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });
    }

    showBulkTasks() {
        document.querySelector(`#BulkActiveList_Container`).innerHTML = "";

        if (this.dataSources["BulkTasks"]?.length == undefined || this.dataSources["BulkTasks"].length == 0) {
            if (this.isUndefined(parent.axProcessObj)) {
                document.querySelector(`#BulkActiveList_Container`).insertAdjacentHTML("beforeend", ` ${this.noRecordsRowHtml} `);
            }
            else {
                document.querySelector(`#BulkActiveList_Container`).insertAdjacentHTML("beforeend", ` ${this.processedRowHtml} `);
            }
        }
        else {
            this.dataSources["BulkTasks"].forEach((rowData, idx) => {
                var htmlText = Handlebars.compile(this.bulkTaskRowHtml)(rowData);
                document.querySelector(`#BulkActiveList_Container`).insertAdjacentHTML("beforeend", ` ${htmlText} `);
            });
        }
    }

    doBulkAction(action, taskType) {

        let _this = this;
        ShowDimmer(true);
        let url = "../aspx/AxPEG.aspx/AxDoBulkAction";

        let taskReason = "";
        let taskText = document.querySelector(`#${action}Comments`).value;

        var checkboxes = document.querySelectorAll('.task-list-checkbox:checked');
        if (checkboxes.length == 0) {
            showAlertDialog("Error", "Select atleast one task for approval.");
            ShowDimmer(false);
            return false;
        }

        if (taskText == '') {
            showAlertDialog("Error", "Bulk Approval Comments cannot be left empty.");
            ShowDimmer(false);
            return false;
        }

        let taskIds = [];
        checkboxes.forEach((item) => {
            taskIds.push(item.dataset.taskid);
        })
        taskIds = taskIds.join(",");

        let data = { action: action, taskId: taskIds, taskType: taskType, statusText: taskText, processName: this.processName };
        this.callAPI(url, data, true, result => {
            ShowDimmer(false);
            if (result.success) {
                let json = JSON.parse(result.response);
                if (!_this.isAxpertFlutter) {
                    json = JSON.parse(json.d);
                }
                if (json.result.success) {
                    _this.showSuccess(json.result.message);
                    if (!_this.isUndefined(parent.axProcessObj))
                        parent.window.location.reload();
                    else {
                        setTimeout(function () {

                            axProcessObj.refreshPage();
                        }, 1000)
                    }
                }
                else {
                    _this.catchError(json.result.message);
                }
            }
        });
    }


    getUrlParams() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.keyField = urlParams.get('keyfield');
        this.keyValue = urlParams.get('keyvalue') || 'NA';
        this.processName = urlParams.get('processname') || _processName;
        this.taskId = urlParams.get('taskid') || '';
        this.transId = urlParams.get('transid') || '';
        this.target = urlParams.get('target') || '';

        this.add = urlParams.get('add') || 'T';
        this.leftPanel = urlParams.get('left') || 'T';
        this.rightPanel = urlParams.get('right') || 'T';
        this.showTree = urlParams.get('tree') || 'T';
        this.bulkApproval = urlParams.get('bulk') || 'T';
        this.horizontal = urlParams.get('horizontal') || 'T';

        //document.querySelector('#process-name span').innerText = this.processName;
        _autoLoadNextTask = (urlParams.get('autoloadnexttask') == 'F' ? false : _autoLoadNextTask);
    };

    openProcessTask(taskName, taskType, taskid) {
        ShowDimmer(true);
        //let url = `../aspx/htmlPages.aspx?loadcaption=Active Lists&processname=${this.processName}&keyfield=${this.keyField}&keyvalue=${this.keyValue}&taskname=${taskName}&tasktype=${taskType}&taskid=${taskid}`;
        let url = `../aspx/processflow.aspx?loadcaption=Active Lists&processname=${this.processName}&keyfield=${this.keyField}&keyvalue=${this.keyValue}&taskname=${taskName}&tasktype=${taskType}&taskid=${taskid}`;
        document.querySelector("#process_centerpanel").classList.add("d-none");
        document.querySelector("#horizontal-processbar").classList.remove("d-none");
        let $rightIframe = document.querySelector("#rightIframe");
        $rightIframe.classList.remove("d-none");
        $rightIframe.setAttribute("src", "");
        $rightIframe.setAttribute("src", url);
        //ShowDimmer(false);
    };

    openSearch() {
        if ($('.searchBoxChildContainer.search').hasClass('d-none')) {
            $('.searchBoxChildContainer.search').removeClass('d-none');
            $('select#keyvalues-select').select2('open');
        }
        else {
            $('.searchBoxChildContainer.search').addClass('d-none');
            $('select#keyvalues-select').select2('close');
        }
    };

    init() {
        try {
            ShowDimmer(true);
            var headerExtras = document.createElement("div");

            headerExtras.classList.add(..."d-flex gap-4".split(" "));
            //document.getElementsByTagName("toolbarDrawer")[0].replaceWith(headerExtras);
            headerExtras.innerHTML = this.toolbarDrawerHTML;

            if (this.userType == "APPROVER")
                document.querySelector("#kt_drawer_bulkApprove_button")?.classList.remove("d-none");

            //KTDrawer.init();
            KTMenu.init();

            if (this.horizontal == "F" || (typeof _horizontalFlow != "undefined" && !_horizontalFlow)) {
                this.horizontalFlow = false;
            }

            if (this.add == "F") {
                document.querySelector("#pd_ann").classList.add("d-none")
            }

            if (this.leftPanel == "F") {
                document.querySelector("#PROFLOW_Left").classList.add("d-none")
                document.querySelector("#PROFLOW_Right")?.classList.add("right-only")
            }

            if (this.horizontalFlow) {
                if (this.leftPanel != "F")
                    this.fetchProcessList("ProcessList");
                //this.showProgress();
            }
            else {
                document.querySelector("#PROFLOW_Left").classList.remove("d-none");
                document.querySelector("#PROFLOW_Left .card-header").classList.add("d-none");
                document.querySelector("#PROFLOW_Left #PROFLOW-profile-container").classList.remove("d-none");
                document.querySelector("#PROFLOW_Left #plistAccordion").classList.add("d-none");
                document.querySelector("#PROFLOW_Right")?.classList.remove("right-only")
                this.showVerticalProgress();
            }

            if (this.rightPanel == "F") {
                document.querySelector("#PROFLOW_Right_Last")?.classList.add("d-none");
                var rightclassList = document.querySelector("#PROFLOW_Right").classList;
                rightclassList.remove('col-md-7', 'col-xl-7');
                rightclassList.add('col-md-9', 'col-xl-9');
            }

            if (this.bulkApproval == "F") {
                document.querySelector("#kt_drawer_bulkApprove_button")?.classList.add("d-none")
            }

            if (this.showTree == "F") {
                document.querySelector("#proFlw_Tree_button")?.classList.add("d-none")
            }

            document.querySelectorAll("#pd_all_tasksNew").forEach((item) => {
                KTMenu.getInstance(item).on("kt.menu.dropdown.show", function (item) {
                    axProcessObj.openBulkApprove();
                });
            });

            document.querySelectorAll("#pd_timeline").forEach((item) => {
                KTMenu.getInstance(item).on("kt.menu.dropdown.show", function (item) {
                    axProcessObj.showTimeLine();
                });
            });

            //if (!this.inValid(this.target)) {
            //    ShowDimmer(true);
            //    this.showProgress();
            //}

        } catch (error) {
            this.catchError(error.message);
        }
    };

    processNewNode(drawer = false) {
        let annContent = ``;
        if (axProcessObj.dataSources["ProcessList"].addnewnode && axProcessObj.dataSources["ProcessList"].addnewnode.length > 0) {
            annContent = Object.values(axProcessObj.dataSources["ProcessList"].addnewnode).map((annode) => {
                let ann = axProcessObj.annHTML;
                !this.isUndefined(annode.transid) ? ann = ann.replace("data-newtstruct", `onclick="axProcessObj.newTstruct('${annode.transid}','${annode.taskname}')"`) : "";
                ann = ann.replace("</annIcon>", (annode.taskicon));
                ann = ann.replace("</annCaption>", (annode.taskname || ""));
                return ann;
            }).join("");
        } else {
            let ann = axProcessObj.annHTML;
            ann = ann.replace("</annIcon>", "playlist_remove");
            ann = ann.replace("</annCaption>", "No data");
            annContent = ann;
        }

        if (drawer) {
            return annContent;
        }

        if (!this.isUndefined(document.getElementsByTagName("anncontent")[0])) {
            document.getElementsByTagName("anncontent")[0].outerHTML = annContent
        }
        // !this.isUndefined(document.getElementsByTagName("pd-annContent")[0]) && (document.getElementsByTagName("pd-annContent")[0].outerHTML = annContent);
    };

    showProcessList(_type) {
        ShowDimmer(true);
        try {
            const dataSource = typeof _type != "undefined" && _type == 'pending' ? pendingtasksJson : completedtasksJson;
            let allTasks = ``;

            let tblContentPending = document.getElementById("plistContentPending");
            let tblContentCompleted = document.getElementById("plistContentCompleted");

            if (dataSource.length > 0) {

                document.querySelector("#PROFLOW_Left").classList.remove("d-none");
                document.querySelector("#PROFLOW_Right").classList.remove("right-only");

                let allTaskCaps = [...new Set(dataSource.map((plst) => plst.taskname))];
                let allTaskIcons = [...new Set(dataSource.map((plst) => plst.displayicon))].splice(0, allTaskCaps.length);
                allTasks = `<div class="custom-menu-item px-3">
                    <span class="custom-menu-link px-3 border-bottom">
                        <span class="form-check form-check-custom form-check-solid me-4">
                            <input class="form-check-input h-25px w-25px all-task" type="checkbox" checked="checked" />
                        </span>                        
                        <span class="fw-normal all-task-text">Unselect All</span>
                        <button class="btn btn-sm btn-light-primary ms-auto btn-custom-border-radius" onclick="axProcessObj.taskFilter('task')">Apply</button>
                    </span>
                </div>`;
                allTaskCaps.forEach((cap, indx) => {
                    let ann = axProcessObj.allTskHTML;
                    ann = ann.replace("</annCaption>", cap);
                    ann = ann.replace("</annIcon>", allTaskIcons[indx]);
                    allTasks += ann;
                });

                !this.isUndefined(document.getElementsByTagName("pd-allTasks")[0]) && (document.getElementsByTagName("pd-allTasks")[0].outerHTML = allTasks);

                if (_type == 'pending') {
                    let tblPending = document.createElement("table");
                    tblPending.classList.add(..."table table-sm table-row-bordered table-responsive overflow-auto".split(" "));
                    tblPending.setAttribute("id", "pendingList");


                    let plistThead = Object.keys(axProcessObj.processVars.plistCols).map(key => axProcessObj.processVars.plistCols[key]).filter(obj => obj.hidden == false);
                    let tbodyPending = document.createElement("tbody");
                    let pendingCount = 0;

                    Object.values(dataSource).map((plst) => {
                        let newTr = document.createElement("tr");
                        plistThead.map((col) => {
                            let trTd = document.createElement("td");
                            let tdData = axProcessObj.processListData(plst, col);
                            trTd.innerHTML = tdData;
                            trTd.setAttribute("data-fromuser", plst.fromuser);
                            trTd.setAttribute("data-tasktime", plst.tasktime);
                            newTr.appendChild(trTd);
                        });
                        tbodyPending.appendChild(newTr);
                        pendingCount++;
                    }).join("");

                    tblPending.appendChild(tbodyPending);

                    if (tblContentPending && pendingCount) {
                        tblContentPending.innerHTML = "";
                        tblContentPending.appendChild(tblPending);
                    }
                    else {
                        let plistNoDataAlert = `<label class="form-label fs-4">No data available...!!!</label>`;
                        tblContentPending.innerHTML = plistNoDataAlert;
                    }
                } else {
                    let tblCompleted = document.createElement("table");
                    tblCompleted.classList.add(..."table table-sm table-row-bordered table-responsive overflow-auto".split(" "));
                    tblCompleted.setAttribute("id", "completedList");

                    let plistThead = Object.keys(axProcessObj.processVars.plistCols).map(key => axProcessObj.processVars.plistCols[key]).filter(obj => obj.hidden == false);

                    let tbodyCompleted = document.createElement("tbody");
                    let completedCount = 0;

                    Object.values(dataSource).map((plst) => {
                        let newTr = document.createElement("tr");
                        plistThead.map((col) => {
                            let trTd = document.createElement("td");
                            let tdData = axProcessObj.processListData(plst, col);
                            trTd.innerHTML = tdData;
                            trTd.setAttribute("data-fromuser", plst.fromuser);
                            trTd.setAttribute("data-tasktime", plst.tasktime);
                            newTr.appendChild(trTd);
                        });
                        tbodyCompleted.appendChild(newTr);
                        completedCount++;

                    }).join("");

                    tblCompleted.appendChild(tbodyCompleted);

                    if (tblContentCompleted && completedCount) {
                        tblContentCompleted.innerHTML = "";
                        tblContentCompleted.appendChild(tblCompleted);
                    }
                    else {
                        let plistNoDataAlert = `<label class="form-label fs-4">No data available...!!!</label>`;
                        tblContentCompleted.innerHTML = plistNoDataAlert;
                    }
                }

                $("#pdFilFrom, #pdFilTo").flatpickr({
                    dateFormat: "d-M-Y", //"d-m-Y H:i:S",
                    enableTime: false,
                });

                KTMenu.init();

                $(document).on("click", ".all-task", (event) => {
                    let menuPr = document.querySelector("#pd_all_tasks");
                    let menuDd = KTMenu.getInstance(menuPr);
                    menuDd.element.children.forEach((ch, inx) => {
                        if (inx != 0) {
                            ch.getElementsByClassName("menu-task")[0].checked = event.currentTarget.checked;
                        }
                    });
                    event.currentTarget.checked ? $(".all-task-text").text("Unselect All") : $(".all-task-text").text("Select All");
                });


                $(document).on("click", ".menu-task", (event) => {
                    let totalCheckBoxes = document.querySelectorAll(".menu-task");
                    let checkedCheckBoxes = document.querySelectorAll(".menu-task:checked");
                    if (totalCheckBoxes.length > 0 && totalCheckBoxes.length == checkedCheckBoxes.length) {
                        document.querySelector(".all-task").checked = true;
                        $(".all-task-text").text("Unselect All")
                    }
                    else {
                        document.querySelector(".all-task").checked = false;
                        $(".all-task-text").text("Select All")
                    }
                });

            } else {
                document.querySelector("#PROFLOW_Left").classList.add("d-none");
                document.querySelector("#PROFLOW_Right").classList.add("right-only");
                //document.getElementsByClassName("card-header")[0].classList.add("d-none");
                //document.getElementsByClassName("card-footer")[0].classList.add("d-none");
                //let plistNoDataAlert = `<label class="form-label fs-4">No data available...!!!</label>`;
                //tblContentCompleted.innerHTML = plistNoDataAlert;
                //tblContentPending.innerHTML = plistNoDataAlert;
            }

            //if (!this.isUndefined(this.taskId) && !this.isNullOrEmpty(this.taskId)) {
            //    let elem = document.querySelector(`.Procurement-list[data-taskid="${this.taskId}"]`);
            //    elem?.click();
            //    elem?.scrollIntoView();
            //}

            if (!this.inValid(this.taskId) && !this.taskCompleted) {
                this.setActiveInList(this.taskId);
            }

        } catch (error) {
            this.catchError(error.message);
        }

        document.querySelectorAll('.accordion-button').forEach((btn) => {
            btn.addEventListener("click", function (e) {
                let elem = this;
                let target = elem.getAttribute('data-target');
                elem.classList.toggle('collapsed');
                document.querySelector(target).classList.toggle('show');
            });
        });
        ShowDimmer(false);
    };

    processListData(plst, col) {
        try {
            let returnData = ``;
            switch (col.caption) {
                //case "Task Name":
                //    returnData = `${axProcessObj.getProStatusDetails(col, plst)}
                //    <a href="javascript:void(0);" class="text-dark cursor-pointer text-hover-primary fs-6 Procurement-list" onclick="axProcessObj.openTask(this, '${plst.taskname}','${plst.tasktype}','${plst.transid}','${plst.keyfield}','${plst.keyvalue}','${plst.recordid}','${plst.taskid}', '${plst.indexno}', 'LeftPanel');" data-caption="${plst.taskname}" data-keyvalue="${plst.keyvalue}" data-keyfield="${plst.keyfield}" data-processname="${plst.processname}" data-taskid="${plst.taskid}">${plst.displaytitle}</a>`;
                //    break;
                case "Task Name":
                    returnData = `<div class="ProcessFlow_New-List-Items">
                                                            <div class="d-flex align-items-center Ticket-Num ">
                                                                <div class="symbol symbol-30px me-5">
                                                                    <span class="symbol-label">
                                                                        <span class="material-icons material-icons-style text-warning">add_task</span>
                                                                    </span>
                                                                </div>
                                                                <div class=" d-flex flex-column">
                                                                    <a href="javascript:void(0)" class="ProcessFlow_New-List-Title Procurement-list" onclick="axProcessObj.openTask(this, '${plst.taskname}','${plst.tasktype}','${plst.transid}','${plst.keyfield}','${plst.keyvalue}','${plst.recordid}','${plst.taskid}', '${plst.indexno}','${plst.hlink_transid}','${plst.hlink_params}','${plst.processname}','${plst.msgtype}', 'LeftPanel');" data-caption="${plst.taskname}" data-keyvalue="${plst.keyvalue}" data-keyfield="${plst.keyfield}" data-processname="${plst.processname}" data-taskid="${plst.taskid}">${plst.displaytitle}</a>
                                                                </div>
                                                            </div>
                                                            <div class=" ms-14 Ticket-Description">${plst.displaycontent}</div>
                                                            <div class="Ticket-Details ms-14 ">
                                                                <div class="Ticket-Value">
                                                                    <span class="Assigned-By"><span class="material-icons material-icons-style material-icons-2">person</span>${plst.fromuser}</span>
                                                                </div>
                                                                <div class="Ticket-Value">
                                                                    <span class="Assigned-Date">
                                                                        <span class="material-icons material-icons-style material-icons-2">today</span>
                                                                        ${plst.eventdatetime.split(' ')[0]}
                                                                    </span>
                                                                    <span class="Assigned-Date">
                                                                        <span class="material-icons material-icons-style material-icons-2">schedule</span>
                                                                        ${plst.eventdatetime.split(' ')[1]}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>`;
                    break;
                default: returnData = ``;
                    break;
            }
            return returnData;
        } catch (error) {
            this.catchError(error.message);
        }
    };

    getProStatusDetails(col, plst) {
        let _this = {
            counter: 0,
            returnProStatus: ``,
        };

        if (col.caption == "Task Name") {
            _this.counter = 1;
            _this.icon = plst.displayicon;
            _this.taskType = (this.processVars.pStatus[plst.tasktype.toLowerCase()] || "make");
            _this.title = "";
        } else if (col.caption == "Next Step") {
            _this.counter = plst.nexttask != "" ? plst.nexttask.split(",").length : 0;
            _this.nextTask = plst.nexttask.split(",");
        }

        let i = 0;
        while (i < _this.counter) {
            if (col.caption == "Next Step") {
                _this.curTask = _this.nextTask[i].split("~");
                _this.icon = _this.curTask[0];
                _this.taskType = (this.processVars.pStatus[_this.curTask[1].toLowerCase()] || "make");
                _this.title = _this.curTask[2];
            }
            _this.returnProStatus += `<button class="btn btn-icon btn-sm ${_this.taskType.bgColor} border ${_this.taskType.borderColor} shadow-sm flex-column me-2" ${_this.title != "" ? `title="${_this.title}"` : ""}>
                <span class="blinker bullet bullet-dot h-8px w-8px position-relative bottom-25 start-25 animation-blinkz ${_this.taskType.color}"></span>
                <span class="material-icons material-icons-style material-icons-3 mt-n2 ${_this.taskType.iconColor}">${_this.icon}</span>
            </button>`;

            i++;
        }

        return _this.returnProStatus;

    };

    taskFilter(type) {
        ShowDimmer(true);
        let tryFilter = {
            user: document.getElementById("pdFilUser").value || "",
            from: document.getElementById("pdFilFrom").value?.replaceAll("-", "/") || "",
            to: document.getElementById("pdFilTo").value?.replaceAll("-", "/") || "",
        };

        //tryFilter.tbl = document.getElementById("completedList");
        //tryFilter.tbdy = tryFilter.tbl.getElementsByTagName("tbody")[0];
        tryFilter.allTrs = document.querySelectorAll('#pendingList tr, #completedList tr');

        if (type == "reset") {
            document.getElementById("pdFilUser").value = "";
            document.getElementById("pdFilFrom").value = "";
            document.getElementById("pdFilTo").value = "";
            let _leftType = $("#PROFLOW_Left li a.active").attr("id");
            if (_leftType == 'pending')
                this.fetchProcessList("ProcessList");
            else
                this.fetchProcessList("ProcessList", "TaskCompletion");
        } else if (type == "filter" && (tryFilter && (tryFilter.user || tryFilter.from || tryFilter.to)) == "") {
            ShowDimmer(false);
            this.catchError("Filter parameters cannot be left empty..!!");
        } else {
            let _leftType = $("#PROFLOW_Left li a.active").attr("id");

            let _this = this, data = {}, url = "";
            url = "../aspx/AxPEG.aspx/AxGetFilteredActiveTasks";
            data = { filterType: _leftType, pageNo: _pageno, pageSize: _pagesize, fromuser: tryFilter.user, processname: '', fromdate: tryFilter.from, todate: tryFilter.to, searchtext: '' };

            this.callAPI(url, data, true, result => {
                if (result.success) {
                    let json = JSON.parse(result.response);
                    let dataResult = _this.dataConvert(json, "ARM");
                    _pendingTaskCount = dataResult.result.count;
                    if (typeof _leftType != 'undefined' && _leftType == 'completed') {
                        if (typeof dataResult.result.completedtasks != "undefined" && dataResult.result.completedtasks.length > 0) {
                            completedtasksJson = dataResult.result.completedtasks;
                            _this.showProcessList('completed');
                        } else {
                            showAlertDialog("warning", "No task available.");
                        }
                    }
                    else {
                        if (typeof dataResult.result.pendingtasks != "undefined" && dataResult.result.pendingtasks.length > 0) {
                            pendingtasksJson = dataResult.result.pendingtasks;
                            _this.showProcessList('pending');
                        } else {
                            showAlertDialog("warning", "No task available.");
                        }
                    }
                    document.getElementById("pdFilUser").value = "";
                    document.getElementById("pdFilFrom").value = "";
                    document.getElementById("pdFilTo").value = "";
                    ShowDimmer(false);
                } else {
                    ShowDimmer(false);
                }
            });
        }
    };

    taskSearch(type) {
        ShowDimmer(true);
        let trySearch = {
            searchVal: document.getElementById("advTextSearch").value || ""
        };

        //trySearch.allTrs = document.querySelectorAll('#pendingList tr, #completedList tr');

        if (type == "reset") {
            document.getElementById("advTextSearch").value = "";
            let _leftType = $("#PROFLOW_Left li a.active").attr("id");
            if (_leftType == 'pending')
                this.fetchProcessList("ProcessList");
            else
                this.fetchProcessList("ProcessList", "TaskCompletion");
        } else if (type == "search" && (trySearch && trySearch.searchVal) == "") {
            ShowDimmer(false);
            this.catchError("Search cannot be left empty..!!");
        } else {
            let _leftType = $("#PROFLOW_Left li a.active").attr("id");

            let _this = this, data = {}, url = "";
            url = "../aspx/AxPEG.aspx/AxGetFilteredActiveTasks";
            data = { filterType: _leftType, pageNo: _pageno, pageSize: _pagesize, fromuser: '', processname: '', fromdate: '', todate: '', searchtext: trySearch.searchVal };

            this.callAPI(url, data, true, result => {
                if (result.success) {
                    let json = JSON.parse(result.response);
                    let dataResult = _this.dataConvert(json, "ARM");
                    _pendingTaskCount = dataResult.result.count;
                    if (typeof _leftType != 'undefined' && _leftType == 'completed') {
                        if (typeof dataResult.result.completedtasks != "undefined" && dataResult.result.completedtasks.length > 0) {
                            completedtasksJson = dataResult.result.completedtasks;
                            _this.showProcessList('completed');
                        } else {
                            showAlertDialog("warning", "No task available.");
                        }
                    }
                    else {
                        if (typeof dataResult.result.pendingtasks != "undefined" && dataResult.result.pendingtasks.length > 0) {
                            pendingtasksJson = dataResult.result.pendingtasks;
                            _this.showProcessList('pending');
                        } else {
                            showAlertDialog("warning", "No task available.");
                        }
                    }

                    document.getElementById("advTextSearch").value = "";
                    ShowDimmer(false);
                } else {
                    ShowDimmer(false);
                }
            });
        }
    };

    showProgress(elem) {
        setTimeout(function () {
            axProcessObj.beforeLoad();
        }, 100)
        let _this = this, data = {}, url = "";
        url = "../aspx/AxPEG.aspx/AxGetProcess";
        let elemTaskId = elem?.dataset?.taskid || this.taskId;
        if (typeof elem != "undefined")
            data = { processName: this.processName, keyField: this.keyField, keyValue: this.keyValue };
        else {
            let _thisEle = $($('.Procurement-list')[0]);
            data = { processName: _thisEle.data('processname'), keyField: _thisEle.data('keyfield'), keyValue: _thisEle.data('keyvalue') };
            elemTaskId = _thisEle.data('taskid');
            this.processName = _thisEle.data('processname');
        }
        this.callAPI(url, data, true, result => {
            if (result.success) {
                _this.hideDefaultCenterPanel();
                ShowDimmer(false);
                let json = JSON.parse(result.response);
                let dataResult = _this.dataConvert(json, "ARM");

                let sno = 1;
                document.querySelector('#horizontal-processbar').innerHTML = "";
                dataResult.forEach((rowData, idx) => {
                    let tempTaskType = rowData.tasktype.toUpperCase();
                    if (["IF", "ELSE", "ELSE IF", "END"].indexOf(tempTaskType) == -1) {
                        if (rowData.indexno == "1" && this.inValid(rowData.taskstatus)) {
                            rowData.taskstatus = "pending";
                        }
                        else if (rowData.taskstatus == "Active") {
                            rowData.taskstatus = "pending";
                        }

                        if (this.isNullOrEmpty(rowData.taskstatus) && rowData.indexno > 1) {
                            rowData.taskstatus = "disabled";
                        }
                        else if (["APPROVED", "REJECTED", "RETURNED", "CHECKED", "MADE"].indexOf(rowData.taskstatus?.toUpperCase()) > -1) {
                            rowData.taskstatus = "completed";
                        }

                        //if (this.taskId == rowData.taskid) {
                        //    rowData.taskstatus = "active";
                        //}

                        if (this.isNullOrEmpty(rowData.recordid)) {
                            rowData.recordid = "0";
                        }

                        rowData.sno = sno;
                        sno++;

                        document.querySelector('#horizontal-processbar').insertAdjacentHTML("beforeend", ` ${Handlebars.compile(this.horizontalStepHtml)(rowData)} `);

                    }
                });

                if (this.taskCompleted) {
                    this.taskCompleted = false;
                    let nextTask = this.getNextTaskInProcess();
                    if (!nextTask) {
                        if (!this.inValid(document.querySelector(".horizontal-steps.pending"))) {
                            this.calledFrom = "ProgressBar";
                            document.querySelector(".horizontal-steps.pending")?.click();
                            document.querySelector(".horizontal-steps.pending")?.scrollIntoView();
                            elemTaskId = document.querySelector(".horizontal-steps.pending").dataset?.taskid;
                        }
                        else if (!this.inValid(document.querySelector(".horizontal-steps"))) {
                            this.calledFrom = "ProgressBar";
                            document.querySelector(".horizontal-steps")?.click();
                            document.querySelector(".horizontal-steps")?.scrollIntoView();
                            elemTaskId = document.querySelector(".horizontal-steps.pending").dataset?.taskid;
                        }
                    }
                }
                else if (!this.inValid(this.taskId)) {
                    this.calledFrom = "ProgressBar";
                    let selector = `.horizontal-steps[data-taskid="${this.taskId}"]`;
                    if (!this.inValid(document.querySelector(selector))) {
                        document.querySelector(selector)?.click();
                        document.querySelector(selector)?.scrollIntoView();
                        if (this.inValid(elemTaskId))
                            elemTaskId = document.querySelector(selector).dataset?.taskid;
                    }
                    this.target = null;
                }
                else if (!this.inValid(this.target)) {
                    this.calledFrom = "ProgressBar";
                    let pendingSelector = `.horizontal-steps.pending[data-taskname="${this.target}"]`;
                    let selector = `.horizontal-steps[data-taskname="${this.target}"]`;
                    if (!this.inValid(document.querySelector(pendingSelector))) {
                        document.querySelector(selector)?.click();
                        document.querySelector(pendingSelector)?.scrollIntoView();
                    }
                    else if (!this.inValid(document.querySelector(selector))) {
                        document.querySelector(selector)?.click();
                        document.querySelector(selector)?.scrollIntoView();
                    }
                    if (this.inValid(elemTaskId))
                        elemTaskId = document.querySelector(selector).dataset?.taskid;
                    this.target = null;
                }
                else {
                    this.calledFrom = "ProgressBar";
                    let pendingSelector = `.horizontal-steps.pending`;
                    let selector = `.horizontal-steps`;
                    if (!this.inValid(document.querySelector(pendingSelector))) {
                        document.querySelector(selector)?.click();
                        document.querySelector(pendingSelector)?.scrollIntoView();
                    }
                    else if (!this.inValid(document.querySelector(selector))) {
                        document.querySelector(selector)?.click();
                        document.querySelector(selector)?.scrollIntoView();
                    }
                    if (this.inValid(elemTaskId))
                        elemTaskId = document.querySelector(selector).dataset?.taskid;
                    this.target = null;
                }

                if (!_this.inValid(elemTaskId)) {
                    _this.setActiveInList(elemTaskId);
                }

                setTimeout(function () {
                    axProcessObj.afterLoad();
                }, 100)
            }
            else {
                ShowDimmer(false);
            }
        });

    }


    showProgressNew() {
        setTimeout(function () {
            axProcessObj.beforeLoad();
        }, 100);

        let _this = this, data = {}, url = "";
        url = "../aspx/AxPEG.aspx/AxPEGGetTaskDetails";

        data = { processName: this.processName, taskType: this.taskType, taskId: this.taskId, keyValue: this.keyValue };

        this.callAPI(url, data, true, result => {
            if (result.success) {
                let json = JSON.parse(result.response);
                let dataResult = _this.dataConvert(json, "ARM");
                processflowJson = dataResult.result.processflow;

                if (processflowJson.length > 0) {
                    //ShowDimmer(false);
                    let dataResult = processflowJson;

                    let sno = 1;
                    document.querySelector('#horizontal-processbar').innerHTML = "";
                    dataResult.forEach((rowData, idx) => {
                        let tempTaskType = rowData.tasktype.toUpperCase();
                        if (["IF", "ELSE", "ELSE IF", "END"].indexOf(tempTaskType) == -1) {
                            if (rowData.indexno == "1" && this.inValid(rowData.taskstatus)) {
                                rowData.taskstatus = "pending";
                            }
                            else if (rowData.taskstatus == "Active") {
                                rowData.taskstatus = "pending";
                            }

                            if (this.isNullOrEmpty(rowData.taskstatus) && rowData.indexno > 1) {
                                rowData.taskstatus = "disabled";
                            }
                            else if (["APPROVED", "REJECTED", "RETURNED", "CHECKED", "MADE"].indexOf(rowData.taskstatus?.toUpperCase()) > -1) {
                                rowData.taskstatus = "completed";
                            }

                            //if (this.taskId == rowData.taskid) {
                            //    rowData.taskstatus = "active";
                            //}

                            if (this.isNullOrEmpty(rowData.recordid)) {
                                rowData.recordid = "0";
                            }

                            rowData.sno = sno;
                            sno++;

                            document.querySelector('#horizontal-processbar').insertAdjacentHTML("beforeend", ` ${Handlebars.compile(this.horizontalStepHtml)(rowData)} `);

                        }
                    });

                    setTimeout(function () {
                        axProcessObj.afterLoad();
                    }, 100)
                }
                else {
                    ShowDimmer(false);
                }
            } else {
                ShowDimmer(false);
            }
        });
    }

    beforeLoad() { }
    afterLoad() { }

    showTimeLine() {
        axTimeLineObj = new ProcessTimeLine();
        axTimeLineObj.keyvalue = this.keyValue;
        axTimeLineObj.processName = this.processName;

        if (!this.inValid(axTimeLineObj.keyvalue) && axTimeLineObj.keyvalue != "NA")
            axTimeLineObj.getTimeLineData();
    }

    showList() {
        document.querySelectorAll("#showList,#PROFLOW-profile-container").forEach((item) => {
            item.classList.add("d-none");
        });
        document.querySelectorAll("#plistAccordion,#showProgress").forEach((item) => {
            item.classList.remove("d-none");
        });
    }

    showDefaultList() {
        document.querySelectorAll("#showList,#PROFLOW-profile-container,#showProgress").forEach((item) => {
            item.classList.add("d-none");
        });
        document.querySelectorAll("#plistAccordion").forEach((item) => {
            item.classList.remove("d-none");
        });
    }

    refreshCards(cardIds, cardParamsValues) {
        if (this.inValid(cardIds))
            return;
        $.ajax({
            url: "../aspx/AxPEG.aspx/AxRefreshCardsData",
            type: 'POST',
            cache: false,
            async: true,
            data: JSON.stringify({
                cardsIds: cardIds.join(","), cardsParams: cardParamsValues
            }),
            dataType: 'json',
            contentType: "application/json",
            success: (data) => {
                if (data.d && data.d != "") {
                    let result = JSON.parse(data.d);
                    cardsData.value = JSON.parse(cardsData.value);
                    var mergedCardsData = cardsData.value.concat(result.result.cards);
                    var uniqueCardsData = mergedCardsData.reduce((acc, current) => {
                        const x = acc.find(item => item.axp_cardsid === current.axp_cardsid);
                        if (!x) {
                            return acc.concat([current]);
                        } else {
                            x.cardsql = current.cardsql; // Update the "cardsql" property value of the matching element
                            return acc;
                        }
                    }, []);

                    cardsData.value = JSON.stringify(uniqueCardsData);
                    cardsDesign.value = "";
                } else {
                    showAlertDialog("error", "Error while loading cards dashboard..!!");
                    return;
                }

                if (xmlMenuData != "") {
                    xmlMenuData = xmlMenuData.replace(/&apos;/g, "'");
                    var xml = parseXml(xmlMenuData)
                    var xmltojson = xml2json(xml, "");
                    menuJson = JSON.parse(xmltojson);
                }
                appGlobalVarsObject._CONSTANTS.menuConfiguration = $.extend(true, {},
                    appGlobalVarsObject._CONSTANTS.menuConfiguration, {
                    menuJson: menuJson,
                });
                // try {
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
                            cardsDiv: ".cardsPlot",
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
            },
            error: (error) => {
                showAlertDialog("error", "Error while loading cards dashboard..!!");
                return;
            },
            failure: (error) => {
                showAlertDialog("error", "Error while loading cards dashboard..!!");
                return;
            },
        });
    }
}

var axProcessTreeObj;
class AxProcessTree {
    constructor(processName) {
        this.definitionFetched = false;
        this.dataSources = [];

        this.processName = processName;
        this.stepHtml = `
            <div class="step">
                <div>
                    <div class="circle ">
                        <i class="fa fa-check"></i>
                        <span class="Emp-steps-counts">{{sno}}</span>
                    </div>
                    <div class="line"></div>
                </div>
                <div class="Task-process-wrapper">
                    {{groupNameHtml}}
                    {{taskCaptionHtml}}
                </div>
            </div>`;
        this.groupNameHtml = `
            <div class="title">
                <a href="javascript:void(0)">{{taskgroup}}</a>
                <span data-groupname="{{taskgroup}}" class="Process-flow accordion-icon rotate">
                    <span  class="material-icons material-icons-style material-icons-2">chevron_right</span>                    
                </span>
            </div>`
        this.taskCaptionHtml = `<div class="process-sub-flow" data-groupname="{{taskgroup}}" data-tasktype="{{tasktype}}">`;
        this.taskCaptionHtml += `<div class="positionRel Task-process-list">`;
        this.taskCaptionHtml += `<a href="javascript:void(0)" onclick="return false;">{{taskname}}</a>`;
        this.taskCaptionHtml += `</div></div>`;
    }

    fetchProcessDefinition(name) {
        let _this = this;
        let url = "../aspx/AxPEG.aspx/AxGetProcessDefinition";
        let data = { processName: this.processName };
        this.callAPI(url, data, false, result => {
            if (result.success) {
                let json = JSON.parse(result.response);
                let dataResult = _this.dataConvert(json, "ARM");
                _this.dataSources[name] = dataResult;
                _this.definitionFetched = true;
            }
        });
    }

    showProcessTree() {
        try {
            let myModal = new BSModal(`modal_ProcessTree`, "", `<div class="PROFLOW-Info-Steps ax-data accordion arrows" id="procflow-steps"></div>`,
                (opening) => {
                    ShowDimmer(true);
                    if (!this.definitionFetched) {
                        this.fetchProcessDefinition("Process");
                    }
                    this.showProcessDefinition();
                    ShowDimmer(false);

                }, (closing) => {
                    //document.querySelector('#procflow-steps').innerHTML = "";
                }
            );

            myModal.changeSize("md");
            myModal.hideHeader();
            myModal.hideFooter();
            myModal.showFloatingClose();
        } catch (error) {
            showAlertDialog("error", error.message);
        }
    }

    showProcessDefinition() {
        if (document.querySelector('#procflow-steps').innerHTML != "")
            return;
        this.processFlowObj = {};
        this.dataSources["Process"].forEach((rowData, idx) => {
            if (this.isUndefined(this.processFlowObj[rowData.taskgroup])) {
                this.processFlowObj[rowData.taskgroup] = {};
                this.processFlowObj[rowData.taskgroup].group_name_html = '';
                this.processFlowObj[rowData.taskgroup].task_caption_html = '';

            }

            if (this.isNullOrEmpty(rowData.taskstatus) && rowData.indexno > 1) {
                rowData.taskstatus = "disabled";
            }

            if (this.isNullOrEmpty(rowData.recordid)) {
                rowData.recordid = "0";
            }

            let taskGroup = this.processFlowObj[rowData.taskgroup];
            taskGroup.indexno = rowData.indexno;
            taskGroup.group_name_html = Handlebars.compile(this.groupNameHtml)(rowData);
            taskGroup.task_caption_html += Handlebars.compile(this.taskCaptionHtml)(rowData);

        });

        document.querySelector('#procflow-steps').innerHTML = "";


        let sno = 1;
        for (let [key, value] of Object.entries(this.processFlowObj)) {
            document.querySelector('#procflow-steps').insertAdjacentHTML("beforeend", ` ${this.stepHtml.replace("{{sno}}", sno).replace("{{groupNameHtml}}", value.group_name_html).replace("{{taskCaptionHtml}}", value.task_caption_html)} `);
            sno++;
        }
        ShowDimmer(false);

        $(".accordion-icon").click(function () {
            let groupname = $(this).attr('data-groupname');
            $(this).toggleClass('rotate');
            $(`.process-sub-flow[data-groupname="${groupname}"]`).toggle();
        });

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
        this.callAPI(url, data, true, result => {
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

$(document).ready(function () {
    ShowDimmer(true);
    axProcessObj = new AxProcessFlow();
    axProcessObj.init();
    //var proflowRightLastClasslist = document.querySelector("#PROFLOW_Right_Last").classList;
    var rightclassList = document.querySelector("#PROFLOW_Right").classList;
    //if (proflowRightLastClasslist.contains('d-none')) {
    //    rightclassList.add('col-md-9', 'col-xl-9');
    //    rightclassList.remove('col-md-7', 'col-xl-7');

    //} else {
    //    rightclassList.remove('col-md-9', 'col-xl-9');
    //    rightclassList.add('col-md-7', 'col-xl-7');
    //}

    var filter = document.querySelector("#filter");

    var reset = document.querySelector("#reset");

    var filterClose = document.querySelector("#filterClose");


    var filterCloseAdvanced = document.querySelector("#filterCloseAdvanced");

    var filterResetAdvanced = document.querySelector("#filterResetAdvanced");

    var filterSearchAdvanced = document.querySelector("#filterSearchAdvanced");


    filter.addEventListener("click", function () {
        var container = document.querySelector("#filterProcess");
        if (container.classList.contains("show")) {
            container.classList.remove("show");
        } else {
            container.classList.add("show");
        }
    });

    reset.addEventListener("click", function () {
        var container = document.querySelector("#filterProcess");
        if (container.classList.contains("show")) {
            container.classList.remove("show");
        } else {
            container.classList.add("show");
        }
    });

    filterClose.addEventListener("click", function () {
        var container = document.querySelector("#filterProcess");
        if (container.classList.contains("show")) {
            container.classList.remove("show");
        } else {
            container.classList.add("show");
        }
    });


    filterSearchAdvanced.addEventListener("click", function () {
        var container = document.querySelector("#filterProcessAdvanced");
        if (container.classList.contains("show")) {
            container.classList.remove("show");
        } else {
            container.classList.add("show");
        }
    });

    filterResetAdvanced.addEventListener("click", function () {
        var container = document.querySelector("#filterProcessAdvanced");
        if (container.classList.contains("show")) {
            container.classList.remove("show");
        } else {
            container.classList.add("show");
        }
    });

    filterCloseAdvanced.addEventListener("click", function () {
        var container = document.querySelector("#filterProcessAdvanced");
        if (container.classList.contains("show")) {
            container.classList.remove("show");
        } else {
            container.classList.add("show");
        }
    });
});


