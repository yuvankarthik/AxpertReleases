﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Analytics.aspx.cs" Inherits="aspx_Analytics" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
    <title>Axpert Analytics</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="../UI/axpertUI/style.bundle.css" />
    <link rel="stylesheet" href="../UI/axpertUI/plugins.bundle.css" />
    <link rel="stylesheet" href="../ThirdParty/jquery-confirm-master/jquery-confirm.min.css" />
    <link rel="stylesheet" href="../css/analytics.min.css?v=1" />
</head>

<body id="Entitymanagement_Body" class="header-fixed header-tablet-and-mobile-fixed aside-fixed gradTheme" runat="server">
    <form id="form1" runat="server" enctype="multipart/form-data">
        <asp:ScriptManager ID="ScriptManager1" runat="server">
            <Services>
                <asp:ServiceReference Path="../WebService.asmx" />
                <asp:ServiceReference Path="../CustomWebService.asmx" />
            </Services>
        </asp:ScriptManager>
        <!--begin::Content-->
        <div class="content d-flex flex-column flex-column-fluid " style="padding: 0px !important">
            <!--begin::Container-->
            <div id="kt_content_container" class="">
                <!--begin::Row-->
                <div id="Entity_Summary_Body-overalldiv" class="Entity_Summary">
                    <!--begin:::Col-->
                    <div id="Entity_Summary_Wrapper" class="row">
                        <div class="card-header Page-title">
                            <!--begin::Title-->
                            <h3 class="card-title align-items-start flex-column col-md-1">
                                <span class="card-label fw-bold text-gray-900">Analytics</span>                                
                            </h3>
                            <div class="d-flex flex-column flex-column-fluid col-md-9" style="overflow-x: auto; ">
                                <ul id="dv_EntityContainer" class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">

                                  
                                </ul>
                            </div>
                            
                            

                            <!--end::Title-->
                            <!--begin::Toolbar-->
                            <div class="card-toolbar ">
                                <div class="Tkts-toolbar-Right ">
                                    <button id="btn_Add_Entity" type="button" onclick="openEntitySelection()" title="Add Entities"
                                        class="btn btn-sm btn-icon btn-primary btn-active-primary btn-custom-border-radius">
                                        <span class="material-icons material-icons-style material-icons-2">add</span>
                                    </button>
                                    <button id="btn_selectfields" type="button" onclick="openFieldSelection()" title="Configure fields"
                                        class="btn btn-sm btn-icon btn-custom-border-radius">
                                        <span class="material-icons material-icons-style material-icons-2">settings </span>
                                    </button>
                                </div>
                            </div>
                            <!--end::Toolbar-->
                        </div>
                        <div id="Entity_summary_Left"
                            class=" col-xl-1 col-md-2  d-flex flex-column flex-column-fluid vh-100 min-vh-100 ">
                            <div class="card card-flush h-lg-100  ">

                                <!--begin::Body-->
                                <div class="card-body">
                                    <div id="Data-Group-container">
                                    </div>
                                </div>
                                <!-- <div class="card-footer d-none">
                                    <div class="Data-Group_Items">
                                        <a href="">
                                            <div class="d-flex ">
                                                <div class="symbol symbol-40px symbol-circle me-5">
                                                    <div class="symbol-label bgs1 bg-success">
                                                        <span class="material-icons material-icons-style material-icons-2">add</span>
                                                    </div>
                                                </div>
                                                <div class="d-flex flex-column">
                                                    <span class="Data-Group-name">Add New View</span>
                                                    <span class="Data-Group-label">Reports
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div> -->

                            </div>
                        </div>

                        <div id="Entity_summary_Right"
                            class="col-xl-8 col-md-8 d-flex flex-column flex-column-fluid vh-100 min-vh-100">

                            <div class="card card-xl-stretch  flex-root h-1px ">
                                <div id="Aggregation_Wrapper" class="card-header row" style="justify-content: flex-start !important;">
                                </div>
                                <!--begin::Body-->
                                <div id="" class="row m-auto" style="justify-content: flex-start !important;">
                                    <h3></h3>
                                </div>
                                <div id="Summary-Results" class="row card-body scroller">

                                    <div id="analytics-chart-title" class="col-md-12 d-inline-block analytics-container">
                                        <div id="chart-title" class="d-inline"></div>
                                        <div class="d-inline chart-selections">
                                            <button type="button" onclick="chartSelectionClick(event,this)" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm bg-success" chart_type="pie">
                                                <span class="material-icons material-icons-style material-icons-2">pie_chart</span>
                                            </button>
                                            <button type="button" onclick="chartSelectionClick(event,this)" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm" chart_type="column">
                                                <span class="material-icons material-icons-style material-icons-2">bar_chart</span>
                                            </button>
                                            <button type="button" onclick="chartSelectionClick(event,this)" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm" chart_type="bar">
                                                <span class="material-icons material-icons-style material-icons-2" style="writing-mode: vertical-rl;">bar_chart</span>
                                            </button>
                                            <div class="direction-btns ">
                                                <button id="" type="button" onclick="moveselection('left')" class="btn btn-sm btn-icon btn-primary btn-active-primary btn-custom-border-radius">
                                                    <span class="material-icons material-icons-style material-icons-2">arrow_back</span>
                                                </button>
                                                <button type="button" id="" onclick="moveselection('right')" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm">
                                                    <span class="material-icons material-icons-style material-icons-2">arrow_forward</span>
                                                </button>
                                                <button type="button" id="" onclick="moveselection('up')" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm">
                                                    <span class="material-icons material-icons-style material-icons-2">arrow_upward</span>
                                                </button>
                                                <button type="button" id="" onclick="moveselection('down')" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm">
                                                    <span class="material-icons material-icons-style material-icons-2">arrow_downward</span>
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="col-md-6 analytics-container">
                                        <div class="card-body  Summary_Charts">

                                            <div class="card Summary_Charts_Items">
                                                <div class="card-header collapsible cursor-pointer rotate collapsed d-none"
                                                    data-bs-toggle="collapse" aria-expanded="false"
                                                    data-bs-target="#KPI-3">
                                                    <h3 class="card-title" id="chartTitle">KPI Title</h3>
                                                    <div class="card-toolbar rotate-180">

                                                        <button id="" type="button" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm d-none">
                                                            <span class="material-icons material-icons-style material-icons-2">visibility_off</span>
                                                        </button>
                                                        <button type="button" id="" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm d-none"
                                                            data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                                                            data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
                                                            <span class="material-icons material-icons-style material-icons-2">more_vert
                                                            </span>
                                                        </button>
                                                        <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px"
                                                            data-kt-menu="true" data-kt-element="theme-mode-menu">
                                                            <!--begin::Menu item-->
                                                            <div class="menu-item px-3 my-0">
                                                                <a href="#" class="menu-link px-3 py-2 active" data-kt-element="mode"
                                                                    data-kt-value="light">
                                                                    <span class="material-icons material-icons-style material-icons-2">light_mode</span>
                                                                    <span class="menu-title">Pie Chart
                                                                    </span>
                                                                </a>
                                                            </div>
                                                            <!--end::Menu item-->
                                                            <!--begin::Menu item-->
                                                            <div class="menu-item px-3 my-0">
                                                                <a href="#" class="menu-link px-3 py-2" data-kt-element="mode"
                                                                    data-kt-value="dark">
                                                                    <span class="material-icons material-icons-style material-icons-2">dark_mode</span>
                                                                    <span class="menu-title">Bar Chart
                                                                    </span>
                                                                </a>
                                                            </div>
                                                            <!--end::Menu item-->
                                                            <!--begin::Menu item-->
                                                            <div class="menu-item px-3 my-0">
                                                                <a href="#" class="menu-link px-3 py-2" data-kt-element="mode"
                                                                    data-kt-value="system">
                                                                    <span class="material-icons material-icons-style material-icons-2">palette</span>
                                                                    <span class="menu-title">Line Chart
                                                                    </span>
                                                                </a>
                                                            </div>
                                                            <!--end::Menu item-->
                                                        </div>

                                                        <span class="material-icons material-icons-style material-icons-2">expand_circle_down
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="collapse Summary_Charts_Items_Content show" id="KPI-3">
                                                    <div class="cardsPlot mb-8" id="Homepage_CardsList">
                                                        <div class="row" id="Homepage_CardsList_Wrapper">
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 analytics-container">
                                        <div class="card KC_Items">
                                            <div class="collapse KC_Items_Content show" id="KPI-2">
                                                <div class=" Invoice-content-wrap">
                                                    <div class="row">
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p class="nodata">No data found.</p>
                                </div>
                                <div class="card-footer-bottom">
                        

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--end:::Col-->
                <!--begin:::Col-->
                <!--end::Container-->
            </div>

<!-- Bootstrap Modal HTML -->
<div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <h5 class="modal-title" id="confirmationModalLabel">Confirm</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
              Apply this change for?
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-primary" id="btnAllUsers">All Users</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btnJustMyself">Myself</button>
    </div>
    </div>
    </div>
    </div>
  
            <div class="modal fade" id="entityModal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Add Entities</h4>
                            <div class="search-container">
                                <div class="position-relative d-flex align-items-center">
                                    <span class="material-icons material-icons-style material-icons-2 material-icons-lg-3 cursor-default position-absolute top-50 translate-middle-y ms-0 ms-lg-4 text-gray-500">search</span>
                                    <input id="searchEntity" type="text" class="search-input form-control form-control-transparent ps-8" name="search" value="" placeholder="Search Entities..." data-kt-search-element="input" />
                                </div>
                            </div>
                            <button type="button" title="Close" class="btn btn-icon btn-danger btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm" onclick="entityModelClose()">
                                <span class="material-icons material-icons-style material-icons-2">close</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="HomePageCards mb-8 col-md-12">
                                <div class="card">
                                    <div class="card-body px-6 py-2 mb-3">
                                   
                                        <div id="selectedEntitiesContainer" class="row d-flex" style="margin-bottom: 20px;"></div>
                                        <label id="pendingLabel" class="pending-name"> Entities To Add</label>
                                        <div id="entityDataContainer" class="row d-flex"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        
                        <div class="modal-footer">
                            <button type="button" onclick="resetSelection()" class="btn btn-white btn-sm shadow-sm">Reset</button>
                            <button type="button" onclick="saveSelectedEntities()" class="btn btn-primary btn-sm shadow-sm">Apply</button>
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
                            <button type="button" title="Close" class=" btn btn-icon btn-danger btn-active-primary shadow-sm tb-btn btn-sm" onclick="fieldsModelClose()">
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
                                                        <input type="checkbox" id="check-all" /></th>
                                                    <th>Field Name</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                    <div class="table-responsive" id="fields-selection"></div>
                                </div>


                            </div>

                        </div>

                        <div class="modal-footer" style="">
                            <div>
                                <button type="button" onclick="resetFields()" class="btn btn-white btn-sm">Reset</button>
                                <button type="button" onclick="applyFields()" class="btn btn-primary btn-sm">Apply</button>
                            </div>
                        </div>
                    </div>

                    <!-- Modal footer -->

                </div>
            </div>
        </div>

        <asp:HiddenField ID="hdnAnalyticsPageLoadData" runat="server" />
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
    <script type="text/javascript" src="../ThirdParty/DataTables-1.10.13/extensions/Extras/moment.min.js"></script>
    <script src="../js/Entity-Common.min.js?v=1"></script>
    <script src="../js/analytics.min.js?v=2"></script>

    <!--end::Page Custom Javascript-->
    <!--end::Javascript-->
</body>




</html>

