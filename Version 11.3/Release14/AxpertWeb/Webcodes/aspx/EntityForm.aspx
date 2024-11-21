<%@ Page Language="C#" AutoEventWireup="true" CodeFile="EntityForm.aspx.cs" Inherits="aspx_EntityForm" %>

<!DOCTYPE html>


<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
    <title>Entity Management
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="../UI/axpertUI/style.bundle.css" />
    <link rel="stylesheet" href="../UI/axpertUI/plugins.bundle.css" />
    <link rel="stylesheet" href="../ThirdParty/jquery-confirm-master/jquery-confirm.min.css" />
    <link rel="stylesheet" href="../css/entityform.min.css?v=1" />
    <style>
    </style>

</head>

<body id="Entitymanagement_Body" class="header-fixed header-tablet-and-mobile-fixed aside-fixed gradTheme" runat="server">
    <form id="form2" runat="server" enctype="multipart/form-data">
        <asp:ScriptManager ID="ScriptManager2" runat="server">
            <Services>
                <asp:ServiceReference Path="../WebService.asmx" />
                <asp:ServiceReference Path="../CustomWebService.asmx" />
            </Services>
        </asp:ScriptManager>
        <!--begin::Content-->
        <div class="content d-flex flex-column flex-column-fluid ">
            <!--begin::Container-->
            <div id="kt_content_container" class="" style="overflow: hidden;">
                <!--begin::Row-->

                <div class=" " id="Entitymanagement_Body-overalldiv">

                    <!--begin:::Col-->

                    <div id="Entity_management_Wrapper" class="row">


                        <div id="Entity_management_Left"
                            class="col-xl-8 col-md-7 d-flex flex-column flex-column-fluid vh-100 min-vh-100">
                            <div class="card card-flush h-lg-100  ">

                                <div class="card-header Page-title">

                                    <!--begin::Title-->
                                    <h3 class="card-title align-items-start flex-column" style="margin-bottom: 0px !important;">
                                        <span class="card-label fw-bold text-gray-900" id="EntityTitle"></span>

                                    </h3>
                                    <!--end::Title-->
                                    <!--begin::Toolbar-->
                                    <div class="card-toolbar">
                                        <div class="Tkts-toolbar-Right">
                                            <button type="button"  id="add-entity"
                                                class="btn btn-sm btn-icon btn-primary btn-active-primary btn-custom-border-radius" onclick="_subEntity.openNewTstruct(); return false;" data-toggle="tooltip" title="New">
                                                <span class="material-icons material-icons-style material-icons-2">add</span>
                                            </button>
                                            <button type="button"
                                                class="btn btn-sm btn-icon btn-primary btn-active-primary btn-custom-border-radius" onclick="_subEntity.editEntity(); return false;" data-toggle="tooltip" title="Edit">
                                                <span class="material-icons material-icons-style material-icons-2">edit_note</span>
                                            </button>
                                            <button type="button"
                                                class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm d-none" data-toggle="tooltip" title="Apply Filter(s)" onclick="openFilters(); return false;">
                                                <span class="material-icons material-icons-style material-icons-2">tune</span>
                                            </button>
                                            <button type="button"
                                                class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm" onclick="_subEntity.reloadEntityPage(); return false;" data-toggle="tooltip" title="Reload">
                                                <span class="material-icons material-icons-style material-icons-2">refresh</span>
                                            </button>
                                            

                                            <button type="button"
                                                class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm" data-kt-menu-trigger="{default:'click', lg: 'hover'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
                                                <span
                                                    class="material-icons material-icons-style material-icons-2">format_color_fill
                                                </span>
                                            </button>


                                            <div id="selectThemes" class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px" data-kt-menu="true" data-kt-element="theme-mode-menu">
                                                <!--begin::Menu item-->
                                                <div class="menu-item px-3 my-0">
                                                    <a href="#" class="menu-link px-3 py-2" data-kt-element="mode" data-target="lightTheme" data-kt-value="light">
                                                        <span class="material-icons material-icons-style material-icons-2">light_mode</span>
                                                        <span class="menu-title">Light
                                                        </span>
                                                    </a>
                                                </div>
                                                <!--end::Menu item-->

                                                <!--begin::Menu item-->
                                                <div class="menu-item px-3 my-0">
                                                    <a href="#" class="menu-link px-3 py-2" data-kt-element="mode" data-target="blackTheme">
                                                        <span class="material-icons material-icons-style material-icons-2">dark_mode</span>
                                                        <span class="menu-title">Dark
                                                        </span>
                                                    </a>
                                                </div>
                                                <!--end::Menu item-->

                                                <!--begin::Menu item-->
                                                <div class="menu-item px-3 my-0">
                                                    <a href="#" class="menu-link px-3 py-2 active" data-kt-element="mode" data-target="gradTheme" data-kt-value="system">
                                                        <span class="material-icons material-icons-style material-icons-2">palette</span>
                                                        <span class="menu-title">Gradient
                                                        </span>
                                                    </a>
                                                </div>

                                                <div class="menu-item px-3 my-0">
                                                    <a href="#" class="menu-link px-3 py-2" data-kt-element="mode" data-target="compactTheme" data-kt-value="system">
                                                        <span class="material-icons material-icons-style material-icons-2">view_compact</span>
                                                        <span class="menu-title">Pattern
                                                        </span>
                                                    </a>
                                                </div>
                                                <!--end::Menu item-->
                                            </div>
                                            <div style="float: right; padding-left: 3px; text-align:left">
                                                <button type="button" id="scriptBtns-btn"
                                                    class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm d-none" data-kt-menu-trigger="{default:'click', lg: 'hover'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
                                                    <span
                                                        class="material-icons material-icons-style material-icons-2">apps
                                                    </span>
                                                </button>


                                                <div id="scriptBtns-container" class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-250px" data-kt-menu="true" data-kt-element="theme-mode-menu">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!--end::Toolbar-->


                                </div>
                                <!--begin::Body-->

                                <div class="Tab_Header">

                                    <ul id="dcTabs">
                                    </ul>
                                </div>




                                <div id="Project_Entity_form" class="card-body Project_items_Entity">



                                    <div class="" id="header_Container">
                                    </div>


                                    <div class="row" style="position: relative; right: 3px;" id="sub-entityhdr">
                                        <div class="dc-heading card-title cursor-pointer collapsible  rotate  collapsed" data-bs-toggle="collapse"
                                            aria-expanded="true" data-bs-target="#sub-entitycontainer">
                                            <span class="material-icons material-icons-style material-icons-2 rotate-180">expand_circle_down
                                            </span>Connected data
                                            <div class="card-toolbar">
                                                <div class="Tkts-toolbar-Right">

                                                    <button type="button" id="SubEntity-add-btn"
                                                        class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm"
                                                        data-kt-menu-trigger="{default:'click', lg: 'hover'}" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
                                                        <span class="material-icons material-icons-style material-icons-2">add
                                                        </span>
                                                    </button>


                                                    <div id="SubEntity-add" class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-250px" data-kt-menu="true" data-kt-element="theme-mode-menu">
                                                    </div>

                                                    <div class="" style="float: right; padding-left: 3px;">
                                                        <button type="button"
                                                            class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm"
                                                            data-kt-menu-trigger="{default:'click', lg: 'hover'}" data-kt-menu-attach="parent" data-kt-menu-placement="top-start">
                                                            <span class="material-icons material-icons-style material-icons-2">tune
                                                            </span>
                                                        </button>


                                                        <div id="SubEntity-Filter" class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-250px" data-kt-menu="true" data-kt-element="theme-mode-menu">
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <!--end::Toolbar-->

                                        </div>

                                        <div id="sub-entitycontainer" class="row sub-entity-row collapse">
                                            <div class="Entity_Form_SubEntity" id="body_Container">
                                            </div>
                                        </div>

                                    </div>

                                    <div id="noMoreRecordsMessage" class="no-more-records-message" style="display: none;">No more records</div>
                                </div>
                            </div>
                        </div>

                        <div id="Entity_management_Right"
                            class="col-xl-2 col-md-3 d-flex flex-column flex-column-fluid vh-100 min-vh-100">

                            <div class="card card-xl-stretch  flex-root h-1px  ">

                                <div class="card-header Page-title collapsible cursor-pointer rotate">
                                    <h3 class="card-title">Other Data</h3>
                                    <div class="card-toolbar">
                                        <button type="button" title="Fullscreen" class="d-none btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm">
                                            <span class="material-icons material-icons-style material-icons-2">add</span>
                                        </button>

                                        <div class="d-flex gap-2 filterAlignChild">
                                            <button type="button"
                                                class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm"
                                                data-toggle="tooltip" title="Select Fields for Other Data"
                                                onclick="openFieldSelection(); return false;">
                                                <span class="material-icons material-icons-style material-icons-2">settings</span>
                                            </button>
                                            <button type="button"
                                                class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm"
                                                data-toggle="tooltip" title="Select Fields for Other Data"
                                                onclick="openDisplayFieldSelection(); return false;">
                                                <span class="material-icons material-icons-style material-icons-2">visibility</span>
                                            </button>
                                            <div class="d-none">
                                                <div class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm"
                                                    data-kt-menu-trigger="click" data-kt-menu-placement="bottom"
                                                    data-kt-menu-flip="top" data-kt-menu-attach="parent" data-toggle="tooltip" title="Add Chart(s)" id="add_chart">
                                                    <span class="material-icons material-icons-style">add_chart</span>
                                                </div>
                                                <!--<button class="btn btn-sm btn-icon btn-active-danger btn-custom-border-radius col-2 ms-auto me-2 shadow-sm" data-kt-drawer-dismiss="true" id="kt_drawer_proFlw_close"><span class="material-icons material-icons-style">close</span></button>-->
                                                <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light fw-bolder w-75 py-3 mt-3 w-350px" id="filterProcess" data-kt-menu="true">

                                                    <button type="button" id="close" title="Close" class=" btn btn-icon btn-danger  btn-active-primary shadow-sm tb-btn btn-sm" onclick="_subEntity.hideChartsMenu();">
                                                        <span class="material-icons material-icons-style material-icons-2">close</span>
                                                    </button>

                                                    <div class="d-flex row mx-6 mb-4">
                                                        <h3>Chart Configuration</h3>

                                                        <div class="col-md-12 filter_items">
                                                            <label for="subEnt" class="form-label col-form-label">
                                                                Show data from

                                                            </label>
                                                            <select class="form-control rounded-0 border-gray-300"
                                                                id="subEnt">
                                                                <option value="0">Select Form</option>
                                                            </select>
                                                        </div>

                                                        <div class="col-md-12 filter_items">
                                                            <label for="aggFld" class="form-label col-form-label">
                                                                Select field to show

                                                            </label>
                                                            <select class="form-control rounded-0 border-gray-300"
                                                                id="aggFld">
                                                                <option value="count">Count</option>
                                                            </select>
                                                        </div>

                                                        <div class="col-md-12 filter_items">
                                                            <label for="aggCond" class="form-label col-form-label">
                                                                Display function

                                                            </label>
                                                            <select class="form-control rounded-0 border-gray-300" id="aggCond" disabled="disabled">
                                                                <option value="0">Select function</option>
                                                                <option value="sum">Sum</option>
                                                                <option value="avg">Average</option>
                                                            </select>
                                                        </div>

                                                        <div class="col-md-12 filter_items">
                                                            <label for="grpFld" class="form-label col-form-label">
                                                                Group By

                                                            </label>
                                                            <select class="form-control rounded-0 border-gray-300"
                                                                id="grpFld">
                                                                <option value="0">Select Field</option>

                                                            </select>
                                                        </div>
                                                        <div class="col-md-12 mt-5 text-center">

                                                            <button type="button" class="btn btn-white btn-sm mt-2 btn-custom-border-radius"
                                                                onclick="_subEntity.clearChartSelection()"
                                                                id="filter">
                                                                Clear All
                                                   
                                                            </button>
                                                            <button type="button" class="btn btn-primary btn-sm mt-2 btn-custom-border-radius"
                                                                onclick="_subEntity.applyChartSelection()"
                                                                id="filter">
                                                                Apply
                                               
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!--begin::Body-->
                                <div class="card-body h-300px  KPI_Section">

                                    <div class="card KC_Items">
                                        <div class="collapse KC_Items_Content show d-none" id="KPI-2">

                                            <div class=" Invoice-content-wrap">
                                                <div class="row">
                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                    <div class="card KC_Items d-none" id="related-records-container">
                                        <div class="card-header collapsible cursor-pointer rotate d-none" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#related-records">
                                            <h3 class="card-title"></h3>
                                            <div class="card-toolbar rotate-180">
                                                <span class="material-icons material-icons-style material-icons-2">expand_circle_down
                                                </span>
                                            </div>
                                        </div>
                                        <div class="KC_Items_Content collapse show heightControl pt-0---" id="related-records">
                                            <bodycontent>No Data Found</bodycontent>
                                        </div>
                                    </div>

                                    <div class="NO-KPI-Items d-none">
                                        <img src="https://cdn-icons-png.flaticon.com/128/2936/2936725.png">
                                        <h4>No Charts Available.</h4>
                                        <p>Click Add Chart(s) button to add Charts     </p>
                                    </div>

                                    <div class="card KC_Items d-none">
                                        <div class="cardsPlot mb-8" id="Homepage_CardsList">
                                            <div class="row" id="Homepage_CardsList_Wrapper">
                                            </div>

                                        </div>

                                        <!--<div class="card-header collapsible cursor-pointer rotate collapsed" data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#KPI-3">
                                        <h3 class="card-title">KPI Title</h3>
                                        <div class="card-toolbar rotate-180">
                                            <span class="material-icons material-icons-style material-icons-2">expand_circle_down
                                            </span>
                                        </div>
                                    </div>
                                    <div class="collapse KC_Items_Content show" id="KPI-3">

                                        
                                    </div>-->
                                    </div>


                                </div>
                            </div>
                        </div>

                    </div>






                </div>


                <!--end:::Col-->
                <!--begin:::Col-->
                <!--end::Container-->
            </div>
            <!-- Modal -->
            <div class="modal fade" id="myModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <!-- Modal body -->
                        <div class="modal-body">
                            <div id="popupText"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="fieldsModal">
                <div class="modal-dialog modal-md modal-dialog-scrollable">
                    <div class="modal-content">
                        <!-- Modal header -->
                        <div class="modal-header" style="padding: 1.75rem !important">
                            <h4 class="modal-title">Other Data - Fields Selection</h4>
                            <button type="button" title="Close" class=" btn btn-icon btn-danger  btn-active-primary shadow-sm tb-btn btn-sm" onclick="fieldsModelClose()">
                                <span class="material-icons material-icons-style material-icons-2">close</span>
                            </button>
                        </div>

                        <!-- Modal body -->
                        <div class="modal-body" style="max-height: 65vh">
                            <input type="text" id="searchBar" class="form-control mb-3" placeholder="Search fields..." onkeyup="searchFields()">
                            <div class="container" id="dvModalFields">
                                <div class="container-fluid">
                                    <div class="table-responsive" id="fields-selection"></div>
                                </div>
                            </div>

                        </div>

                        <div class="modal-footer" style="">
                            <div>
                                <button type="button" onclick="resetRelatedDataFields()" class="btn btn-white btn-sm">Reset</button>
                                <button type="button" onclick="applyRelatedDataFields()" class="btn btn-primary btn-sm">Apply</button>
                            </div>
                        </div>
                    </div>

                    <!-- Modal footer -->

                </div>
            </div>

            <div class="modal fade" id="displayFieldsModal">
                <div class="modal-dialog modal-md modal-dialog-scrollable">
                    <div class="modal-content">
                        <!-- Modal header -->
                        <div class="modal-header" style="padding: 1.75rem !important">
                            <h4 class="modal-title">Other Data - Display Fields Selection</h4>
                            <button type="button" title="Close" class=" btn btn-icon btn-danger  btn-active-primary shadow-sm tb-btn btn-sm" onclick="displayFieldsModelClose()">
                                <span class="material-icons material-icons-style material-icons-2">close</span>
                            </button>
                        </div>

                        <!-- Modal body -->
                        <div class="modal-body" style="max-height: 65vh">
                            <div class="container" id="dvModalDisplayFields">
                                <div class="container-fluid">
                                    <div class="table-responsive" id="displayfields-selection"></div>
                                </div>
                            </div>

                        </div>

                        <div class="modal-footer" style="">
                            <div>
                                <button type="button" onclick="resetDisplayFields()" class="btn btn-white btn-sm">Reset</button>
                                <button type="button" onclick="applyDisplayFields()" class="btn btn-primary btn-sm">Apply</button>
                            </div>
                        </div>
                    </div>

                    <!-- Modal footer -->

                </div>
            </div>

            <div class="modal fade" id="logsModal">
                <div class="modal-dialog modal-xl modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <!-- Modal header -->
                        <div class="modal-header" style="padding: 1.75rem !important">
                            <h4 class="modal-title">Last 10 ARM Logs</h4>
                            <button type="button" title="Close" class=" btn btn-icon btn-danger  btn-active-primary shadow-sm tb-btn btn-sm" onclick="$('#logsModal').modal('hide');">
                                <span class="material-icons material-icons-style material-icons-2">close</span>
                            </button>
                        </div>

                        <!-- Modal body -->
                        <div class="modal-body" style="max-height: 80vh">
                            <div class="container">
                                <div class="container-fluid">
                                    <div id="logs-table-container"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal footer -->

                </div>
            </div>

        </div>
        <asp:HiddenField ID="hdnScriptsUrlpath" runat="server" />
    </form>


    <!--end::Content-->
    <!--begin::Javascript-->
    <!--begin::Global Javascript Bundle(used by all pages)-->
    <!-- <script src="../assets/js/jquery-3.6.0.min.js"></script> -->

    <script src="../UI/axpertUI/plugins.bundle.js"></script>
    <script src="../UI/axpertUI/scripts.bundle.js"></script>
    <script type="text/javascript" src="../ThirdParty/jquery-confirm-master/jquery-confirm.min.js"></script>
    <script src="../Js/noConflict.min.js?v=1" type="text/javascript"></script>
    <script type="text/javascript" src="../Js/alerts.min.js"></script>
    <script src="../js/handlebars.js"></script>

    <script src="../js/common.js"></script>
    <script src="../js/process.js"></script>
    <script src="../js/helper.js"></script>
    <script src="../js/entityform.min.js?v=1"></script>

    <script>

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


        $(document).ready(function () {


            $("button.rotate").click(function () {
                $(".task-activity-container").toggle();
            });


            var showChar = 450;  // How many characters are shown by default
            var ellipsestext = "...";
            var moretext = "Show more >";
            var lesstext = "Show less";


            $('.more').each(function () {
                var content = $(this).html();

                if (content.length > showChar) {

                    var c = content.substr(0, showChar);
                    var h = content.substr(showChar, content.length - showChar);

                    var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

                    $(this).html(html);
                }

            });

            $(".morelink").click(function () {
                if ($(this).hasClass("less")) {
                    $(this).removeClass("less");
                    $(this).html(moretext);
                } else {
                    $(this).addClass("less");
                    $(this).html(lesstext);
                }
                $(this).parent().prev().toggle();
                $(this).prev().toggle();
                return false;
            });
        });

    </script>

    <!--end::Page Custom Javascript-->
    <!--end::Javascript-->
</body>
</html>
