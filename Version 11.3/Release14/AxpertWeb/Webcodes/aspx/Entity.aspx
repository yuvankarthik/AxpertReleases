<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Entity.aspx.cs" Inherits="aspx_Entity" %>

    <!DOCTYPE html>

    <html xmlns="http://www.w3.org/1999/xhtml">

    <head runat="server">

        <title>Entity Management</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="../UI/axpertUI/style.bundle.css" />
        <link rel="stylesheet" href="../UI/axpertUI/plugins.bundle.css" />
        <link rel="stylesheet" href="../ThirdParty/jquery-confirm-master/jquery-confirm.min.css" />
        <link href="../css/datatables.min.css" rel="stylesheet">
        <link rel="stylesheet" href="../css/Entity.min.css?v=1" />
        <style>
        </style>

    </head>

    <body id="Entitymanagement_Body" class="header-fixed header-tablet-and-mobile-fixed aside-fixed gradTheme"
        runat="server">
        <form id="form1" runat="server" enctype="multipart/form-data">
            <asp:ScriptManager ID="ScriptManager1" runat="server">
                <Services>
                    <asp:ServiceReference Path="../WebService.asmx" />
                    <asp:ServiceReference Path="../CustomWebService.asmx" />
                </Services>
            </asp:ScriptManager>

            <!--begin::Content-->
            <div class="content d-flex flex-column flex-column-fluid ">
                <!--begin::Container-->
                <div id="kt_content_container" class="">
                    <!--begin::Row-->

                    <div class=" " id="Entitymanagement_Body-overalldiv">

                        <!--begin:::Col-->

                        <div id="Entity_management_Wrapper" class="row">


                            <div id="Entity_management_Left"
                                class="col-xl-8 col-md-7 d-flex flex-column flex-column-fluid vh-100 min-vh-100">
                                <div class="card card-flush h-lg-100  ">

                                    <div class="card-header Page-title">

                                        <!--begin::Title-->
                                        <h3 class="card-title align-items-start flex-column"
                                            style="margin-bottom: 0px !important;">
                                            <span class="card-label fw-bold text-gray-900" id="EntityTitle"></span>

                                        </h3>
                                        <!--end::Title-->
                                        <!--begin::Toolbar-->
                                        <div class="card-toolbar">
                                            <div class="Tkts-toolbar-Right d-flex flex-row align-items-center gap-2">
                                                <!-- Searchbar button -->
                                                <fieldset class="searchFieldset d-flex gap-2">
                                                    <input type="search" id="searchBox" title="searchbar"
                                                        autocomplete="false" />
                                                    <button type="button"
                                                        class="btn btn-sm btn-icon btn-white btn-active-primary btn-custom-border-radius"
                                                        id="searchBoxButton"
                                                        onclick="searchInput.classList.toggle('show');"
                                                        data-bs-toggle="tooltip" title="Search">
                                                        <span
                                                            class="material-icons material-icons-style material-icons-2">search</span>
                                                    </button>
                                                </fieldset>

                                                <button type="button"
                                                    class="btn btn-sm btn-icon btn-primary btn-active-primary btn-custom-border-radius"
                                                    onclick="_entity.openNewTstruct(); return false;"
                                                    data-toggle="tooltip" id="add-entity" title="New">
                                                    <span
                                                        class="material-icons material-icons-style material-icons-2">add</span>
                                                </button>
                                                <button type="button"
                                                    class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm d-none"
                                                    onclick="return false;" data-toggle="tooltip" title="Delete">
                                                    <span
                                                        class="material-icons material-icons-style material-icons-2">remove</span>
                                                </button>
                                                <button type="button"
                                                    class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm"
                                                    data-toggle="tooltip" title="Select Fields"
                                                    onclick="openFieldSelection(); return false;" id="field-selection">
                                                    <span
                                                        class="material-icons material-icons-style material-icons-2">settings</span>
                                                </button>
                                                <button type="button"
                                                    class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm"
                                                    data-toggle="tooltip" title="Apply Filter(s)"
                                                    onclick="openFilters(); return false;">
                                                    <span
                                                        class="material-icons material-icons-style material-icons-2">tune</span>
                                                </button>
                                                <button type="button"
                                                    class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm"
                                                    onclick="_entity.reloadEntityPage(); return false;"
                                                    data-toggle="tooltip" title="Reload">
                                                    <span
                                                        class="material-icons material-icons-style material-icons-2">refresh</span>
                                                </button>
                                                <button type="button"
                                                    class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm d-none">
                                                    <span
                                                        class="material-icons material-icons-style material-icons-2">fullscreen</span>
                                                </button>
                                                <button type="button"
                                                    class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm  d-none">
                                                    <span
                                                        class="material-icons material-icons-style material-icons-2">keyboard_double_arrow_down
                                                    </span>
                                                </button>
                                                <button type="button"
                                                    class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm  d-none">
                                                    <span
                                                        class="material-icons material-icons-style material-icons-2">more_vert
                                                    </span>
                                                </button>

                                                <button type="button"
                                                    class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm"
                                                    data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                                                    data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
                                                    <span
                                                        class="material-icons material-icons-style material-icons-2">format_color_fill
                                                    </span>
                                                </button>


                                                <div id="selectThemes"
                                                    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px"
                                                    data-kt-menu="true" data-kt-element="theme-mode-menu">
                                                    <!--begin::Menu item-->
                                                    <div class="menu-item px-3 my-0">
                                                        <a href="#" class="menu-link px-3 py-2" data-kt-element="mode"
                                                            data-target="lightTheme" data-kt-value="light">
                                                            <span
                                                                class="material-icons material-icons-style material-icons-2">light_mode</span>
                                                            <span class="menu-title">Light
                                                            </span>
                                                        </a>
                                                    </div>
                                                    <!--end::Menu item-->
                                                    <!--begin::Menu item-->
                                                    <div class="menu-item px-3 my-0">
                                                        <a href="#" class="menu-link px-3 py-2" data-kt-element="mode"
                                                            data-target="blackTheme">
                                                            <span
                                                                class="material-icons material-icons-style material-icons-2">dark_mode</span>
                                                            <span class="menu-title">Dark
                                                            </span>
                                                        </a>
                                                    </div>
                                                    <!--end::Menu item-->
                                                    <!--begin::Menu item-->
                                                    <div class="menu-item px-3 my-0">
                                                        <a href="#" class="menu-link px-3 py-2 active"
                                                            data-kt-element="mode" data-target="gradTheme"
                                                            data-kt-value="system">
                                                            <span
                                                                class="material-icons material-icons-style material-icons-2">palette</span>
                                                            <span class="menu-title">Gradient
                                                            </span>
                                                        </a>
                                                    </div>

                                                    <div class="menu-item px-3 my-0">
                                                        <a href="#" class="menu-link px-3 py-2" data-kt-element="mode"
                                                            data-target="compactTheme" data-kt-value="system">
                                                            <span
                                                                class="material-icons material-icons-style material-icons-2">view_compact</span>
                                                            <span class="menu-title">Pattern
                                                            </span>
                                                        </a>
                                                    </div>
                                                    <!--end::Menu item-->
                                                </div>

                                                <div style="float: right; padding-left: 3px;">
                                                    <button type="button" data-toggle="tooltip" title="Utilities"
                                                        class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm"
                                                        data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                                                        data-kt-menu-attach="parent"
                                                        data-kt-menu-placement="bottom-end">
                                                        <span
                                                            class="material-icons material-icons-style material-icons-2">miscellaneous_services
                                                        </span>
                                                    </button>


                                                    <div id="selectUtilities" class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px" data-kt-menu="true">
                                                        <!-- Print Menu Item -->
                                                        <div class="menu-item px-3 my-0">
                                                            <a href="#" class="menu-link px-3 py-2" data-target="Print">
                                                                <span class="material-icons material-icons-style material-icons-2">print</span>
                                                                <span class="menu-title">Print</span>
                                                            </a>
                                                        </div>
                                                        <!-- PDF Menu Item -->
                                                        <div class="menu-item px-3 my-0">
                                                            <a href="#" class="menu-link px-3 py-2" data-target="PDF">
                                                                <span class="material-icons material-icons-style material-icons-2">picture_as_pdf</span>
                                                                <span class="menu-title">PDF</span>
                                                            </a>
                                                        </div>
                                                        <!-- Excel Menu Item -->
                                                        <div class="menu-item px-3 my-0">
                                                            <a href="#" class="menu-link px-3 py-2" data-target="Excel">
                                                                <span class="material-icons material-icons-style material-icons-2">table_view</span>
                                                                <span class="menu-title">Excel</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                                <button type="button" id="viewToggleBtn"
                                                class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm"
                                                onclick="onToggleButtonClick(); return false;" data-toggle="tooltip" title="Switch View">
                                                <span id="viewIcon" class="material-icons material-icons-style material-icons-2">view_module</span>
                                            </button>
                                            

                                                  <!-- New Delete Button -->
        <!-- <button type="button"
        class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm"
        id="deleteSelectedButton"
        onclick="deleteSelectedRecordsFromToolbar(); return false;"
        data-toggle="tooltip" title="Delete Selected">
        <span class="material-icons material-icons-style material-icons-2">delete</span>
    </button> -->




                                                <!-- New icon for switching to table menu -->
                                                <!-- <button type="button"
                                                    class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm"
                                                    onclick="switchToTableMenu(); return false;" data-toggle="tooltip" title="Switch to Table Menu">
                                                    <span class="material-icons material-icons-style material-icons-2">view_list</span>
                                                </button> -->


                                                <!--end::Toolbar-->
                                            </div>
                                        </div>
                                        <!--end::Toolbar-->


                                    </div>
                                    <div class="secondary_card_header flex-row py-2 px-2 gap-3" style="display: none;">
                                        <button
                                            class="filterGroupBadge badge rounded-pill bg-primary d-flex align-items-center gap-2 py-2 px-6 border-0"
                                            style="max-width: fit-content;" data-toggle="tooltip" data-placement="top"
                                            data-html="true">All </button>
                                    </div>
                                    <!--begin::Body-->
                                    <div class="card-body" id="body_Container">
                                        <!-- Card view content will be populated dynamically -->
                                    </div>

                                    <div class="table-body" id="table-body_Container" style="display: none;">
                                        <!-- Table view content will be populated dynamically -->
                                    </div>
                                    <div id="noMoreRecordsMessage" class="no-more-records-message"
                                        style="display: none">No more records</div>
                                </div>
                            </div>

                            <div id="Entity_management_Right"
                                class="col-xl-2 col-md-3 d-flex flex-column flex-column-fluid vh-100 min-vh-100">

                                <div class="card card-xl-stretch  flex-root h-1px  ">

                                    <div class="card-header Page-title collapsible cursor-pointer rotate">
                                        <h3 class="card-title"></h3>
                                        <div class="card-toolbar">
                                            <button type="button" title="Fullscreen"
                                                class="d-none btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm">
                                                <span
                                                    class="material-icons material-icons-style material-icons-2">add</span>
                                            </button>

                                            <div
                                                class="d-flex align-items-stretch flex-shrink-0 gap-8 filterAlignChild">
                                                <div class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm"
                                                    data-kt-menu-trigger="click" data-kt-menu-placement="bottom"
                                                    data-kt-menu-flip="top" data-kt-menu-attach="parent"
                                                    data-toggle="tooltip" title="Add Chart(s)" id="add_chart">
                                                    <span class="material-icons material-icons-style">add_chart</span>
                                                </div>
                                                <!--<button class="btn btn-sm btn-icon btn-active-danger btn-custom-border-radius col-2 ms-auto me-2 shadow-sm" data-kt-drawer-dismiss="true" id="kt_drawer_proFlw_close"><span class="material-icons material-icons-style">close</span></button>-->
                                                <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light fw-bolder w-75 py-3 mt-3 w-350px"
                                                    id="filterProcess" data-kt-menu="true">

                                                    <button type="button" id="close" title="Close"
                                                        class=" btn btn-icon btn-danger btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm"
                                                        onclick="_entity.hideChartsMenu()">
                                                        <span
                                                            class="material-icons material-icons-style material-icons-2">close</span>
                                                    </button>

                                                    <div class="d-flex row mx-6 mb-4">
                                                        <h3>Chart Configuration</h3>

                                                        <div class="col-md-12 filter_items">
                                                            <label for="subEnt" class="form-label col-form-label">
                                                                Show data from

                                                            </label>
                                                            <select class="form-control rounded-0 border-gray-300"
                                                                id="subEnt" disabled="disabled">
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
                                                            <select class="form-control rounded-0 border-gray-300"
                                                                id="aggCond" disabled="disabled">
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

                                                            <button type="button"
                                                                class="btn btn-white btn-sm mt-2 btn-custom-border-radius"
                                                                onclick="_entity.clearChartSelection()" id="filter">
                                                                Clear All

                                                            </button>
                                                            <button type="button"
                                                                class="btn btn-primary btn-sm mt-2 btn-custom-border-radius"
                                                                onclick="_entity.applyChartSelection()" id="filter">
                                                                Apply

                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!--begin::Body-->
                                    <div class="card-body h-300px  KPI_Section">
                                        <div class="card KC_Items">
                                            <div class="collapse KC_Items_Content show" id="KPI-2">

                                                <div class=" Invoice-content-wrap">
                                                    <div class="row">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="NO-KPI-Items d-none">
                                            <img src="https://cdn-icons-png.flaticon.com/128/2936/2936725.png">
                                            <h4>No Charts Available.</h4>
                                            <p>Click Add Chart(s) button to add Charts </p>
                                        </div>

                                        <div class="card KC_Items">
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

                <div class="modal fade" id="filterModal">
                    <div class="modal-dialog modal-lg modal-dialog-scrollable">
                        <div class="modal-content">
                            <!-- Modal header -->
                            <div class="modal-header" style="padding: 1.75rem !important">
                                <h4 class="modal-title">Filters</h4>
                                <button type="button" title="Close"
                                    class=" btn btn-icon btn-danger btn-active-primary shadow-sm tb-btn btn-sm"
                                    onclick="filterModelClose()">
                                    <span class="material-icons material-icons-style material-icons-2">close</span>
                                </button>
                            </div>

                            <!-- Modal body -->
                            <div class="modal-body" style="max-height: 65vh">
                                <div class="container" id="dvModalFilter"></div>
                            </div>

                            <!-- Modal footer -->
                            <div class="modal-footer d-flex flex-row justify-content-between w-100">
                                <div class="filter_group_checkbox_input_wrapper mt-2 d-flex align-items-center gap-5"
                                    data-type="checkbox" style="flex-basis: 75%;">
                                    <div class="filter_group_checkbox_wrapper d-inline-flex gap-2">
                                        <label for="filter_group_checkbox" style="flex-basis: max-content;"> Save
                                            filters with a custom name ?</label>
                                        <input type="checkbox" name="filter_group_checkbox" id="filterGroupCheckbox"
                                            style="flex-basis: fit-content;"
                                            onchange="$('#filterGroupName').prop('disabled', !this.checked);">
                                    </div>

                                    <input type="text" name="filterGroupName" id="filterGroupName" class="col-md-7"
                                        disabled>
                                </div>
                                <div class="action_buttons d-inline-flex gap-2">
                                    <button type="button" onclick="resetFilters()"
                                        class="btn btn-white btn-sm">Reset</button>
                                    <button type="button" onclick="handleApply()" class="btn btn-primary">Apply</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="fieldsModal">
                    <div class="modal-dialog modal-md modal-dialog-scrollable">
                        <div class="modal-content">
                            <!-- Modal header -->
                            <div class="modal-header" style="padding: 1.75rem !important">
                                <h4 class="modal-title">Fields Selection</h4>
                                <button type="button" title="Close"
                                    class=" btn btn-icon btn-danger btn-active-primary shadow-sm tb-btn btn-sm"
                                    onclick="fieldsModelClose()">
                                    <span class="material-icons material-icons-style material-icons-2">close</span>
                                </button>
                            </div>

                            <!-- Modal body -->
                            <div class="modal-body" style="max-height: 65vh">
                                <div class="container" id="dvModalFields">
                                    <div class="container-fluid">
                                        <div class="table-responsive">
                                            <table class="table table-hover">
                                                <thead class="thead-dark">
                                                    <tr>
                                                        <th>
                                                            <input type="checkbox" id="check-all" />
                                                        </th>
                                                        <th>Field Name</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                        <div class="table-responsive" id="fields-selection"></div>
                                    </div>


                                </div>

                            </div>

                            <div class="modal-footer">

                                <div class="form-group mt-3">
                                    <label for="selectField">Select Key Field:</label>
                                    <select class="form-select" id="selectField" disabled>
                                    </select>
                                </div>
                                <div>
                                    <button type="button" onclick="resetFields()"
                                        class="btn btn-white btn-sm">Reset</button>
                                    <button type="button" onclick="applyFields()"
                                        class="btn btn-primary btn-sm">Apply</button>
                                </div>
                            </div>
                        </div>
                        <div id="hiddenTableContainer" style="display:none;"></div>


                        <!-- Modal footer -->

                    </div>
                </div>

                <div class="modal fade" id="logsModal">
                    <div class="modal-dialog modal-xl modal-lg modal-dialog-scrollable">
                        <div class="modal-content">
                            <!-- Modal header -->
                            <div class="modal-header" style="padding: 1.75rem !important">
                                <h4 class="modal-title">Last 10 ARM Logs</h4>
                                <button type="button" title="Close"
                                    class=" btn btn-icon btn-danger btn-active-primary shadow-sm tb-btn btn-sm"
                                    onclick="$('#logsModal').modal('hide');">
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
                <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h6 class="modal-title" id="confirmationModalLabel">Notification</h6>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                Your request to export data is submitted successfully. You will be notified once the file is ready.
                            </div>
                            <div class="modal-footer">
                                <button type="button" id="okBtn" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>
                            </div>
                        </div>
                    </div>
                </div>
                
               <!-- Confirmation Modal -->
<!-- <div class="modal fade" id="confirmationModal1" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title" id="confirmationModalLabel">Confirmation</h6>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="confirmationModalBody">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="confirmButton">Confirm</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          
            </div>
        </div>
    </div>
</div> -->

<!-- Notification Modal -->
<!-- <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title" id="notificationModalLabel">Notification</h6>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="notificationModalBody">
            
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

                 -->
                

                <!-- Custom Checkbox Modal for filter grouping -->
                <!-- <div class="modal fade" id="filterGroupModalWrapper" data-bs-backdrop='static'>
                    <div class="modal-dialog modal-lg modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="myModalLabel">Custom Filter Group Name</h5>
                                <button type="button" class="btn btn-icon btn-danger btn-active-primary shadow-sm tb-btn btn-sm" onclick="closeFilterGroupModal()" aria-label="Close">
                                    <span class="material-icons material-icons-style material-icons-2">close</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="filterGroupNameForm row">
                                    <label for="filterGroupName" class="col-md-4 p-0"> Check this box to save applied filters with a custom filter group name:</label>
                                    <input type="text" name="filterGroupName" id="filterGroupName" class="col-md-7">

                                </div>

                            </div>
                            <div class="modal-footer" style="padding: 0.5rem !important">
                                <button type="button" onclick="handleApply()" class="btn btn-primary">Apply</button>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
        </form>

        <!--end::Content-->
        <!--begin::Javascript-->
        <!--begin::Global Javascript Bundle(used by all pages)-->
        <!-- <script src="../assets/js/jquery-3.6.0.min.js"></script> -->
        <script type="text/javascript" src="../UI/axpertUI/plugins.bundle.js"></script>
        <script type="text/javascript" src="../UI/axpertUI/scripts.bundle.js"></script>
        <script type="text/javascript" src="../ThirdParty/jquery-confirm-master/jquery-confirm.min.js"></script>
        <script type="text/javascript" src="../Js/common.min.js"></script>
        <script type="text/javascript" src="../Js/alerts.min.js"></script>
        <script type="text/javascript" src="../Js/xmlToJson.js"></script>
        <script type="text/javascript" src="../Js/handlebars.min.js"></script>
        <script type="text/javascript" src="../ThirdParty/DataTables-1.10.13/extensions/Extras/moment.min.js"></script>
        <script src="../js/datatables.min.js"></script>

        <script src="../js/Entity-Common.js?v=1.1"></script>
        <script src="../js/entity.min.js?v=1"></script>

        <script type="text/javascript">
            /* Variables from mainpage */



        </script>

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
