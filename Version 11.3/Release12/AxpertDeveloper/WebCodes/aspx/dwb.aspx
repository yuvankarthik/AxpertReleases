<%@ Page Title="" Language="C#" MasterPageFile="~/aspx/AxMPage.master" AutoEventWireup="true" CodeFile="dwb.aspx.cs" Inherits="dwb" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <script src="../js/developerWorkBench.min.js?v=100" type="text/javascript"></script>
    <script>
        var SQLHintObj = '<%=SQLHintObj%>'
        var nodeAccessToken = '<%=nodeAccessToken%>';
        var userResps = '<%=userResps%>';
        var restdllPath = '<%=restdllPath%>';
        var armRestDllPath = '<%=ArmRestDllPath%>';
        var nodeAPI = '<%=nodeAPI%>';
        var userroles = '<%=userroles%>';
        var redisutl = '<%= redisutl%>';
        var sid = '<%=sid%>';
        var utl = '<%=utl%>';//Session["utl"]
        var hasPageBuildAccess = '<%=hasPageBuildAccess%>';
        var nodeApi = '<%= nodeApi%>';
        var alertsTimeout = '<%=alertsTimeout%>';
        var errorTimeout = '<%=errorTimeout%>';
        var errorEnable = '<%=errorEnable.ToString().ToLower()%>';
        var isAppParamIV = false;
    </script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="right-section">
        <div id="structLoaderblur" style="display: none;">
            <div id="structLoader">
                <h2 id="lbltext"></h2>
                <div class="progress">
                    <div id="dynamic" class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                        <span id="current-progress"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-sm-12" style="padding: 0px;">
            <div class="developerWorkBenchToolbarMain">
                <div class="col-sm-4 col-lg-4 col-md-4 dwbLeftMenu">
                    <div class="developerbreadcrumb-panel">
                        <div class="developerbreadcrumb icon-services left">
                            <span class="developerbreadcrumbTitle"></span>
                        </div>
                        <div class="developerSearch">
                        </div>
                    </div>
                </div>
                <div class="col-sm-8 col-lg-8 col-md-8 dwbRightMenu">
                    <div class="developerWorkBenchToolbar">
                        <ul class="dwbiconsUl" id="Formstb">
                            <li><a href="javascript:void(0);" id="btn_search" title="Search" class="dwbBtn" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_opentstr" title="Create Form" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li class="dropdown"><a href="javascript:void(0)" id="customGroup1" title="Custom Actions" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true" aria-expanded="false"><i class="fa fa-plus" aria-hidden="true"></i>New<span class="icon-arrows-down"></span></a>
                                <ul class="dropdown-menu">
                                    <div class="dropdown-menu-inner">
                                        <ul>
                                            <li class="liTaskItems dwbsubmainheading"><span class="textBorder"><span class="listTitle">Basic fields</span></span></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addshorttext" title="Short Text Field" class="dwbBtn"><i class="fa fa-text-width"></i><span class="listTitle">Short Text</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addsimpletext" title="Simple Text Field" class="dwbBtn"><i class="fa fa-file"></i><span class="listTitle">Simple Text</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addlargetext" title="Large Text Field" class="dwbBtn"><i class="fa fa-file-text-o"></i><span class="listTitle">Large Text</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_adddecimalnumb" title="Decimal Number Field" class="dwbBtn"><i class="fa fa-list-ol"></i><span class="listTitle">Decimal Number</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addwholenumber" title="Whole Number Field" class="dwbBtn"><i class="fa fa-list-ol"></i><span class="listTitle">Whole Number</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_adddate" title="Date Field" class="dwbBtn"><i class="fa fa-calendar"></i><span class="listTitle">Date</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addtime" title="Time Field" class="dwbBtn"><i class="fa fa-clock-o"></i><span class="listTitle">Time</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addautogenerate" title="Auto Generate Field" class="dwbBtn"><i class="fa fa-sort-numeric-asc"></i><span class="listTitle">Auto Generate</span></a></li>
                                            <%-- <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addhtmltext" title="HTML Text Field" class="dwbBtn"><i class="fa fa-code"></i><span class="listTitle">HTML Text</span></a></li>--%>
                                        </ul>
                                        <ul>
                                            <li class="liTaskItems dwbsubmainheading"><span class="textBorder"><span class="listTitle">Components</span></span></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_dropdwnlist" title="Drop Down" class="dwbBtn"><i class="fa fa-caret-square-o-down"></i><span class="listTitle">Drop Down</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addmultiselect" title="Multi Select" class="dwbBtn"><i class="fa fa-list-alt"></i><span class="listTitle">Multi Select</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addrichtext" title="Rich Text Field" class="dwbBtn"><i class="fa fa-file-text"></i><span class="listTitle">Rich Text</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addchecklist" title="Check List" class="dwbBtn"><i class="fa fa-list-alt"></i><span class="listTitle">Check List</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addcheckbox" title="checkbox" class="dwbBtn"><i class="fa fa-check-square-o"></i><span class="listTitle">Check Box</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addradiogroup" title="Radio Group" class="dwbBtn"><i class="fa fa-check-circle-o"></i><span class="listTitle">Radio Group</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addimage" title="Image" class="dwbBtn"><i class="fa fa-image"></i><span class="listTitle">Image</span></a></li>
                                        </ul>
                                        <ul>
                                            <li class="liTaskItems dwbsubmainheading"><span class="textBorder"><span class="listTitle">Special Fields</span></span></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addmobilenumber" title="Mobile Number Field" class="dwbBtn"><i class="fa fa-mobile"></i><span class="listTitle">Mobile Number</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addphonenumber" title="Phone Number Field" class="dwbBtn"><i class="fa fa-phone"></i><span class="listTitle">Phone Number</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addcurrency" title="Currency Field" class="dwbBtn"><i class="fa fa-money"></i><span class="listTitle">Currency</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addemail" title="Email Field" class="dwbBtn"><i class="fa fa-envelope-o"></i><span class="listTitle">Email</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addurl" title="URL Field" class="dwbBtn"><i class="fa fa-link"></i><span class="listTitle">URL</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addipaddress" title="IP Address Field" class="dwbBtn"><i class="fa fa-laptop"></i><span class="listTitle">IP Address</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addpincode" title="Pincode Field" class="dwbBtn"><i class="fa fa-map-pin"></i><span class="listTitle">Pin Code</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addzipcode" title="Zip Code Field" class="dwbBtn"><i class="fa fa-map-pin"></i><span class="listTitle">Zip Code</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addrandomnumber" title="Random Number Field" class="dwbBtn"><i class="fa fa-random"></i><span class="listTitle">Random Number</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addpassword" title="Password Field" class="dwbBtn"><i class="fa fa-key"></i><span class="listTitle">Password</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_addtable" title="Table" class="dwbBtn"><i class="fa fa-table"></i><span class="listTitle">Table field</span></a></li>
                                        </ul>
                                        <ul>
                                            <li class="liTaskItems dwbsubmainheading"><span class="textBorder"><span class="listTitle">Form Elements</span></span></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_adddc" title="Add Frames" class="dwbBtn"><i class="fa fa-columns"></i><span class="listTitle">DC (Frames)</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_genmap" title="Add GenMap" class="dwbBtn"><i class="fa fa-file-text"></i><span class="listTitle">Gen Map</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_fillg" title="Add Fill Grid" class="dwbBtn"><i class="fa fa-th-large"></i><span class="listTitle">Fill Grid</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_mdmaps" title="Add MdMap" class="dwbBtn"><i class="fa fa-file-text-o"></i><span class="listTitle">MD Map</span></a></li>
                                            <li class="liTaskItems"><a href="javascript:void(0)" id="btn_actions" title="Scripts" class="dwbBtn"><i class="fa fa-tasks"></i><span class="listTitle">Scripts</span></a></li>
                                        </ul>

                                        <ul>
                                        </ul>
                                        <div class="clearfix"></div>
                                    </div>
                                </ul>
                            </li>

                            <li><a href="javascript:void(0);" id="btn_readtstructdef" title="Save" class="dwbBtn"><i class="fa fa-floppy-o" aria-hidden="true"></i>Save</a></li>
                            <%-- <li><a href="javascript:void(0);" id="btn_saveaststdef" title="Save As" class="dwbBtn"><i class="fa fa-clipboard" aria-hidden="true"></i>Save As</a></li>--%>
                            <li><a href="javascript:void(0);" onclick="javascript:LoadPopPageDesign();" id="" title="Form Design" class=""><i class="fa fa-file-text-o" aria-hidden="true"></i>Form Design</a></li>
                            <!-- <li><a href="javascript:void(0);" id="PublishDesign" title="Publish" class="dwbBtn"><i class="fa fa-arrow-up" aria-hidden="true"></i> Publish</a></li> -->
                            <li><a href="javascript:void(0)" id="btn_opntoolbar" title="ToolBar" data-pgtype="tstruct" class="dwbBtn"><i class="fa fa-bars" aria-hidden="true"></i>ToolBar</a></li>
                            <li><a href="javascript:void(0);" id="btn_openproperty" title="Properties" class="dwbBtn"><i class="fa fa-wpforms" aria-hidden="true"></i>Form Properties</a></li>
                            <li><a href="javascript:void(0)" id="btn_deletetstdef" title="Delete" class="dwbBtn"><i class="fa fa-trash-o" aria-hidden="true"></i>Delete</a></li>
                            <!-- <li><a href="javascript:void(0);" id="" title="changeLog" class="dwbBtn"><i class="fa fa-file-text" aria-hidden="true"></i> Change log</a></li> -->
                        </ul>

                        <ul class="dwbiconsUl" id="ArrangeMtb">
                            <%--// Arrange Menu Page Buttons //--%>
                            <li><a href="javascript:void(0);" id="lnkChngIcon" title="Change Icon" class="dwbBtn">Change Icon</a></li>
                            <li><a href="javascript:void(0);" id="btnAdd" title="Add Folder" class="dwbBtn">Add Folder</a></li>
                            <li><a href="javascript:void(0);" id="btnDelete" title="Delete" class="dwbBtn">Delete</a></li>
                            <li><a href="javascript:void(0);" id="btnSave" title="Save" class="dwbBtn">Save</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="iviewListToolbar">
                            <li><a href="javascript:void(0);" id="btn_createreport" title="Create Report" class="dwbBtn">Create Report</a></li>
                            <li><a href="javascript:void(0);" id="reportBuilderBtn" title="Report Designer" class="dwbBtnReportBuilder" onclick="LoadIframeDwb('iviewBuilder.aspx?ivname=flist');">Report Builder</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="wbtb">
                            <li><a href="javascript:void(0);" id="btn_dwbwidget" title="Widget builder" class="dwbwidget" onclick=" LoadIframeDwb('widgetbuilder.aspx');"><i class="material-icons" style="font-size: initial;">widgets</i><span>Widget Builder</span></a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="htmlPagesIvToolBar">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newpage" title="Create HTML" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="htmlPagesTstToolBar">
                            <li><a href="javascript:void(0);" title="Delete Page" onclick="$('#middle1')[0].contentWindow.DeleteTstruct();"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=hplist');;"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="spListTb">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_nform" title="Standard Page" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="spFormTb">
                            <li><a href="javascript:void(0);" title="Save" onclick="$('#middle1')[0].contentWindow.spObj.sp_save();"><i class="fa fa-floppy-o" aria-hidden="true"></i>Save</a></li>
                            <li id="spDelete"><a href="javascript:void(0);" title="Delete" onclick="$('#middle1')[0].contentWindow.DeleteTstruct();"><i class="fa fa-trash" aria-hidden="true"></i>Delete</a></li>
                            <li><a href="javascript:void(0);" title="Properties" onclick="$('#middle1')[0].contentWindow.spObj.sp_properties();"><i class="fa fa-file-text-o" aria-hidden="true"></i>Properties</a></li>
                            <li><a href="javascript:void(0);" title="Design Layout" onclick="$('#middle1')[0].contentWindow.spObj.sp_design();"><i class="fa fa-th-large" aria-hidden="true"></i>Design</a></li>
                            <li><a href="javascript:void(0);" title="List" onclick="LoadIframeDwb('iview.aspx?ivname=stdpglst');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="cardsIvToolBar">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newcard" title="New Card" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="cardsTstToolBar">
                            <li><a href="javascript:void(0);" id="new" title="New Card" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" title="Remove Card" onclick="$('#middle1')[0].contentWindow.DeleteTstruct();"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" title="List Cards" onclick="LoadIframeDwb('iview.aspx?ivname=axpcards');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="ivDefIvToolBar">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_act1" title="Create Iview" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="ivDefTstToolBar">
                            <li><a href="javascript:void(0);" id="actbtn_readivdef" title="Save" class="dwbBtn"><i class="fa fa-floppy-o" aria-hidden="true"></i>Save</a></li>
                            <%--<li><a href="javascript:void(0);" id="actbtn_saveasivdef" title="Save As" class="dwbBtn"><i class="fa fa-clipboard" aria-hidden="true"></i>Save As</a></li>--%>
                            <li><a href="javascript:void(0)" id="actbtn_deleteivdef" title="Delete" class="dwbBtn"><i class="fa fa-trash-o" aria-hidden="true"></i>Delete</a></li>
                            <li><a href="javascript:void(0)" id="actbtn_opntoolbar" title="ToolBar" data-pgtype="iview" class="dwbBtn"><i class="fa fa-bars" aria-hidden="true"></i>ToolBar</a></li>
                            <li><a href="javascript:void(0)" id="actbtn_rowtemplate" title="Layout" onclick="$('#middle1')[0].contentWindow.iviewTemplate();"><i class="fa fa-code" aria-hidden="true"></i>Layout</a></li>
                            <li><a href="javascript:void(0)" id="actbtn_ivlist" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=ivrptdwb');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxpertjobsToolBar">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newjob" title="Create Jobs" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxpertjobsToolBarTst">
                            <li><a href="javascript:void(0);" id="new" title="Create Jobs" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0)" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=jobtsk');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxImportDefinition">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newdef" title="Create Import" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxImportDefinitionTst">
                            <li><a href="javascript:void(0);" id="new" title="Create Import" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <%--<li><a href="javascript:void(0);" id="imgSaveTst" title="Save" class="dwbBtn"><i class="fa fa-save" aria-hidden="true"></i>Save</a></li>--%>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=aximpdef');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxPublishlisting">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_addserver" title="Add server" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>Add server</a></li>
                            <li><a href="javascript:void(0);" id="btn_listservers" title="List servers" class="dwbBtn"><i class="fa fa-file-text-o" aria-hidden="true"></i>List servers</a></li>
                            <li><a href="javascript:void(0);" id="btn_pubtosr" title="Publish now" class="dwbBtn"><i class="fa fa-share-square" aria-hidden="true"></i>Publish now</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxExportDefinition">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newdef" title="New ExportDefinition" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxExportDefinitionTst">
                            <li><a href="javascript:void(0);" id="new" title="New ExportDefinition" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" id="imgSaveTst" title="Save" class="dwbBtn"><i class="fa fa-save" aria-hidden="true"></i>Save</a></li>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=axexpjob');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="AxApiDefinition">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newdef" title="New ApiDefinition" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxApiDefinitionTst">
                            <li><a href="javascript:void(0);" id="new" title="New ApiDefinition" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <%--<li><a href="javascript:void(0);" id="imgSaveTst" title="Save" class="dwbBtn"><i class="fa fa-save" aria-hidden="true"></i>Save</a></li>--%>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=exapidef');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="AxEmailDefinition">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newdef" title="New EmailDefinition" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxEmailDefinitionTst">
                            <li><a href="javascript:void(0);" id="new" title="New EmailDefinition" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <%--<li><a href="javascript:void(0);" id="imgSaveTst" title="Save" class="dwbBtn"><i class="fa fa-save" aria-hidden="true"></i>Save</a></li>--%>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=emaildef');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="AxPrintDefinition">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newdef" title="New PrintDefinition" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxPrintDefinitionTst">
                            <li><a href="javascript:void(0);" id="new" title="New PrintDefinition" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <%--<li><a href="javascript:void(0);" id="imgSaveTst" title="Save" class="dwbBtn"><i class="fa fa-save" aria-hidden="true"></i>Save</a></li>--%>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=axprint');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="Applvarb">
                            <li><a href="javascript:void(0);" id="btn_search" title="Search" class="dwbBtn" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_nconst" title="Add New Constant" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>Add New Constant</a></li>
                            <li><a href="javascript:void(0);" id="btn_nvar" title="Add New Variable" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>Add New Variable</a></li>
                            <li><a href="javascript:void(0);" id="btn_appvar" title="Application Param" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>Application Param</a></li>
                            <li><a href="javascript:void(0);" id="btn_getdb" title="Get From DB" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>Get From DB</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="ApplvarbTst">
                            <li><a href="javascript:void(0);" id="new" title="New Application Vars" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=axvars');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="ApplFromDBVarbTst">
                            <li><a href="javascript:void(0);" id="new" title="New Application db variable" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="actbtn_iRemove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=axvars');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>




                        <ul class="dwbiconsUl" id="AxPublServer">
                            <li><a href="javascript:void(0);" id="btn_search" title="Search" class="dwbBtn" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <!--<li><a href="javascript:void(0);" id="" title="Publish history" class="" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=pservers');"><i class="fa fa-list-alt" aria-hidden="true"></i>Publish history</a></li>-->
                            <li><a href="javascript:void(0);" id="" title="List Server" class="" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=pservers');"><i class="fa fa-list-alt" aria-hidden="true"></i>List Server</a></li>
                            <li><a href="javascript:void(0);" id="" title="Go" class="" onclick="$('#middle1')[0].contentWindow.setPublish();"><i class="fa fa-upload" aria-hidden="true"></i>Go</a></li>
                            <li><a href="javascript:void(0);" id="" title="Params" class="" onclick="$('#middle1')[0].contentWindow.$('#ivContainer').css({'display': ''}); $('#middle1')[0].contentWindow.$('#accordion').css({'top': '0px'}); $('#middle1')[0].contentWindow.$('#Filterscollapse').collapse('show');"><i class="fa fa-search" aria-hidden="true"></i>Params</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=publist');"><i class="fa fa-file-text-o" aria-hidden="true"></i>Publish Listing</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="AxServerConfig">
                            <li><a href="javascript:void(0);" id="btn_search" title="Search" class="dwbBtn" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newser" title="Create Server Config" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=publist');"><i class="fa fa-file-text-o" aria-hidden="true"></i>Publish Listing</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxServerConfigTst">
                            <li><a href="javascript:void(0);" id="new" title="Create Server Config" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <%--<li><a href="javascript:void(0);" id="imgSaveTst" title="Save" class="dwbBtn"><i class="fa fa-save" aria-hidden="true"></i>Save</a></li>--%>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <%--<li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>--%>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=pservers');"><i class="fa fa-file-text-o" aria-hidden="true"></i>Server List</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=publist');"><i class="fa fa-file-text-o" aria-hidden="true"></i>Publish Listing</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxTableDescptior">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_add_td" title="Create Table Descriptor" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxTableDescptiorTst">
                            <li><a href="javascript:void(0);" id="new" title="Create Table Descriptor" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <%--<li><a href="javascript:void(0);" id="imgSaveTst" title="Save" class="dwbBtn"><i class="fa fa-save" aria-hidden="true"></i>Save</a></li>--%>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=adi_td');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="Axconfigproperty">
                            <li><a href="javascript:void(0);" id="btn_search" title="Search" class="dwbBtn" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newprops" title="Create Configuration Property" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" id="" title="Developer Options List" class="" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=dop_list');"><i class="fa fa-file-text-o" aria-hidden="true"></i>Developer Options List</a></li>
                            <%--<li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=ivconfdt');"><i class="fa fa-file-text-o" aria-hidden="true"></i>Property Listing</a></li>--%>
                        </ul>
                        <ul class="dwbiconsUl" id="Axconfigpropertytst">
                            <li><a href="javascript:void(0);" id="new" title="Create Configuration Property" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" id="" title="Developer Options List" class="" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=dop_list');"><i class="fa fa-file-text-o" aria-hidden="true"></i>Developer Options List</a></li>
                            <li><a href="javascript:void(0);" title="List" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=ivconfdt');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxDeveloper">
                            <li><a href="javascript:void(0);" id="btn_search" title="Search" class="dwbBtn" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newdo" title="Create Developer Options" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" title="Configuration Property List" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=ivconfdt');"><i class="fa fa-file-text-o" aria-hidden="true"></i>Configuration Property List</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxDeveloperTst">
                            <li><a href="javascript:void(0);" id="new" title="Create Developer Options" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" title="List" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=dop_list');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                            <li><a href="javascript:void(0);" title="Configuration Property List" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=ivconfdt');"><i class="fa fa-file-text-o" aria-hidden="true"></i>Configuration Property List</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="customsql">
                            <li><a href="javascript:void(0);" id="btn_search" title="Search" class="dwbBtn" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newsql" title="New Custom SQL" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="customsqlTst">
                            <li><a href="javascript:void(0);" id="new" title="New Custom SQL" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=csqlist');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="customdatatype">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_addcustomd" title="Create Custom Data Type" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="customdatatypetst">
                            <li><a href="javascript:void(0);" id="new" title="Create Custom Data Type" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="remove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0)" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=cdlist');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="configParameters">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_addparam" title="Configuration parameter" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="configParameterTstp">
                            <li><a href="javascript:void(0);" id="actbtn_setrule" title="Set AxRules" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>Set AxRules</a></li>
                            <li><a href="javascript:void(0);" id="new" title="New Configuration Parameter Definition" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" id="search" title="Search" class="dwbBtn"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="actbtn_iRemove" title="Remove" class="dwbBtn"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0)" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=ad_cnfgp');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="AxRuntimeAddFieldtst">
                            <li><a href="javascript:void(0);" id="btnadafRemove" title="Remove" class="dwbBtn hide"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0);" id="ftbtn_iNew" title="Runtime New Field" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0)" id="btnadafListView" title="List View" class="dwbBtn"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                            <li><a href="javascript:void(0);" id="btnadafuremove" title="Remove" class="dwbBtn hide"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxRuntimeAddField">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newfld" title="Runtime New Field" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="AxRuntimeAddForm">
                            <!-- <li><a href="javascript:void(0);" id="btnadafRemove" title="Remove" class="dwbBtn hide"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li> -->
                            <li><a href="javascript:void(0);" iid="ftbtn_iSave" title="Runtime New Form" class="" onclick="LoadIframeDwb('iview.aspx?ivname=runtform');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>

                            <li><a href="javascript:void(0);" iid="ftbtn_iSave" title="Runtime New Form" class="" onclick="$('#middle1')[0].contentWindow.$('.toolbarRightMenu a:not(#design,#RefreshFormLoad)').trigger('click');"><i class="fa fa-save" aria-hidden="true"></i>Save</a></li>
                            <!-- <li><a href="javascript:void(0)" id="btnadafListView" title="List View" class="dwbBtn"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li> -->
                            <!-- <li><a href="javascript:void(0);" id="btnadafuremove" title="Remove" class="dwbBtn hide"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li> -->
                        </ul>
                        <ul class="dwbiconsUl" id="AxRuntimeAddFormList">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_delform" title="Runtime New Form" class="dwbBtn---" onclick="callParentNew('AxConfigPage=', 'addform~~');LoadIframeDwb('tstructnew.aspx?act=open&transid=ad_nf&runtimetstruct=T&runtimemod=T');"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>

                        <ul class="dwbiconsUl" id="axlanguages">
                            <li><a href="javascript:void(0);" title="Search" onclick="$('#middle1')[0].contentWindow.$('#idsearch').addClass('fa-remove');$('#middle1')[0].contentWindow.$('#idsearch').removeClass('fa-search');$('#middle1')[0].contentWindow.$('.searchBoxChildContainer').removeClass('hide').parent().show();$('#middle1')[0].contentWindow.$('#ivInSearchInput').focus();"><i class="fa fa-search" aria-hidden="true"></i>Search</a></li>
                            <li><a href="javascript:void(0);" id="btn_newform" title="Axpert languages" class="dwbBtn"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                        </ul>
                        <ul class="dwbiconsUl" id="axlanguagetst">
                            <li><a href="javascript:void(0);" title="New Axpert languages" onclick="$('#middle1')[0].contentWindow.NewTstruct();"><i class="fa fa-plus" aria-hidden="true"></i>New</a></li>
                            <li><a href="javascript:void(0);" title="Remove" onclick="$('#middle1')[0].contentWindow.DeleteTstruct();"><i class="fa fa-trash" aria-hidden="true"></i>Remove</a></li>
                            <li><a href="javascript:void(0)" title="List View" onclick="LoadIframeDwb('ivtoivload.aspx?ivname=axlangs');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                        </ul>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="developerWorkBenchSubToolbar">
                <ul class="ivSubToolBar">
                    <li><a href="javascript:void(0)" id="actbtn_linksql" class="dwbIvTabBtn">Main</a></li>
                    <li><a href="javascript:void(0)" id="actbtn_linkparams" class="dwbIvTabBtn">Params</a></li>
                    <li><a href="javascript:void(0)" id="actbtn_linkcols" class="dwbIvTabBtn">Columns</a></li>
                    <li><a href="javascript:void(0)" id="actbtn_linkproperty" class="dwbIvTabBtn">Properties</a></li>
                    <li><a href="javascript:void(0)" id="actbtn_linkscript" class="dwbIvTabBtn">Scripts</a></li>
                    <li><a href="javascript:void(0)" id="actbtn_linksubtotal" class="dwbIvTabBtn">Sub Total</a></li>
                </ul>
            </div>
            <div class="leftSplitDivision" id="leftSplitDivision">
                <div id="GridView1Wrapper"></div>
                <div class="clearfix"></div>
            </div>
            <div class="topSplitDivision" id="GridView2Wrapper">
                <div class="clearfix"></div>
            </div>
            <div class="right-iviewmain card panel-fisrt-partdwb" id="dvMiddle1" style="width: 79%; float: right;">
                <iframe id="middle1" name="middle1" frameborder="0" class="searchOpened"
                    allowtransparency="True" width="100%" height="100%"></iframe>
            </div>

            <div class="right-iviewmain card panel-second-partdwb" id="divaxpiframe" style="display: none;">
                <iframe id="axpiframe" name="axpiframe" frameborder="0"
                    class="searchOpened" allowtransparency="True" width="100%" height="100%"
                    style="display: none;"></iframe>
            </div>
            <div class="clearfix"></div>
            <div class="Bottomnavigationbar">
                <ul class="ivnavigationbar">
                    <li><a href="javascript:void(0)" id="actbtn_preclk" class="dwbIvBtnbtm" title="previous"><span class="material-icons">skip_previous</span>Previous</a></li>
                    <li><a href="javascript:void(0)" id="actbtn_iSave" class="dwbIvBtnbtm" title="submit"><span class="material-icons">save</span>Submit</a></li>
                    <li><a href="javascript:void(0)" id="btn_iSDuplicate" class="dwbIvBtnbtm" style="display: none;" title="Error in sql validation."><span class="material-icons">save</span>Submit</a></li>
                    <li><a href="javascript:void(0)" id="actbtn_iRemove" class="dwbIvBtnbtm" title="delete"><span class="material-icons">delete</span>Remove</a></li>
                    <li><a href="javascript:void(0)" id="actbtn_nextclk" class="dwbIvBtnbtm" title="Next"><span class="material-icons">skip_next</span>Next</a></li>
                    <li><a href="javascript:void(0)" id="btn_nxclkDuplicate" class="dwbIvBtnbtm" style="display: none;" title="Error in sql validation."><span class="material-icons">skip_next</span>Next</a></li>
                </ul>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
    <div class="clearfix"></div>
    <asp:ScriptManager ID="ScriptManager1" runat="server">
        <Services>
            <asp:ServiceReference Path="../WebService.asmx" />
            <asp:ServiceReference Path="../CustomWebService.asmx" />
        </Services>
    </asp:ScriptManager>
</asp:Content>

