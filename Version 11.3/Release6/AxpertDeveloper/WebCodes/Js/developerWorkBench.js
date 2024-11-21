var isDWB = true;
var heightOfToolbar = 0;
var dwbTitle = 0;
var hightofmiddle1 = 0;
var isSuccessAlertInPopUp = false;
var isRefreshParentOnClose = false;
var mainSqlHintObj = {};
var tstAxpFileFlds = false;
var nodeAcesstokenDwb = "";
var openflg = false;
var dwbtstparams = "";
var dwbIvDefName = "";
var dwbTstDcTableDellst="";
var ivParamsJSON = [];
var ivParamsOrder = [];
var appLinkHistory = [], appLinkHistoryLabel = [], menuLabel;
var curPageIndex = 0, prevClickFlag = false, nextClickFlag = false, histListFlag = false;
var dwbtstdctable = "";
var sqlRestCallInitiated=false;
var beforeRestCallId="";
var actionfldflag="";

$(document).ready(function () {
    if (typeof AxRoleDefaultError != 'undefined' && AxRoleDefaultError != "") {
        alert("Proper user role not set for Axpert Developer for this user.");
        window.location.href = 'signout.aspx';
        return;
    }

    window.onbeforeunload = BeforeWindowClose;
    createLocalSession();
    loginToNodeAPI();
    HideStructLoader();

    try {
        AxBeforeDWBCallBack();
    } catch (error) {}

    if(typeof AxConfigPage!="undefined" && AxConfigPage!=""){
        let sourceDetails = AxConfigPage.split("~");
        if(sourceDetails?.[0] == "addfield"){
            // let soruceDetails=AxConfigPage.split("~");
            LoadIframeDwb('tstructnew.aspx?act=open&transid=ad_af&stransid='+sourceDetails[1]+'&formcaption='+sourceDetails[2]+(sourceDetails[1] ? ('('+sourceDetails[1]+')&disableform=T') : ""));
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Add New Field');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").hide();
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#AxRuntimeAddFieldtst").show();
            $(".left-section").hide();
            $(".right-section").css({'left':'initial','width':'calc(100vw - 2px)'});
        }
        else if(sourceDetails?.[0] == "editfield"){
            // let soruceDetails=AxConfigPage.split("~");
            LoadIframeDwb('tstructnew.aspx?act=load&transid=ad_af&stransid='+sourceDetails[1]+'&fname='+sourceDetails[2]);
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Edit Field');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").hide();
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#AxRuntimeAddFieldtst").show();
            $("#AxRuntimeAddFieldtst #ftbtn_iNew, #AxRuntimeAddFieldtst #btnadafListView").hide();
            $(".left-section").hide();
            $(".right-section").css({'left':'initial','width':'calc(100vw - 2px)'});
        }
        else if (sourceDetails?.[0] == "addform") {  
            $("body").append(`<div id="dummyHider" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:white;"></div>`);          
            LoadIframeDwb(`tstructnew.aspx?act=open&transid=ad_nf&ntransid=${sourceDetails[1]}&caption=${sourceDetails[2]}&runtimetstruct=T&runtimemod=T`);
            $(".developerWorkBenchToolbar, .developerWorkBenchSubToolbar, .dwbiconsUl, .left-section, .Bottomnavigationbar").hide();    
            // $(" #actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave")
            $('.developerWorkBenchToolbar').show();
            $("#AxRuntimeAddForm").show();
            $(".developerbreadcrumbTitle").text("New Form");
            $(".developerworkbench .navbar").css({"z-index" : "1000000"});
            $(".right-section").css({"left" : "0", "width" : "calc(100vw - 2px)"});
            $(".right-section .right-iviewmain#dvMiddle1").css({"padding" : "0 12px"});    
        }
        else if (sourceDetails?.[0] == "designform") {  
            AxConfigPage =  AxConfigPage.replace("designform~", "addform~");
            sourceDetails = AxConfigPage.split("~");

            $(".developerworkbench .navbar").css({"z-index" : "1000000"});
            $(".left-section").hide();
            $(".right-section").css({'left':'initial','width':'calc(100vw - 2px)'});

            updateSessionVar("AxConfigPage", AxConfigPage);

            //`OpenIviewFromIv("ivtoivload.aspx?ivname=mainrepo","&str=${rowData["ntransid"]}&captitle=${tempCaption}(${rowData["ntransid"]})&tstname=${rowData["ntransid"]}&hltype=load","mainrepo","");`

            LoadIframeDwb(`ivtoivload.aspx?ivname=mainrepo&str=${sourceDetails[1]}&captitle=${sourceDetails[2]}(${sourceDetails[1]})&tstname=${sourceDetails[1]}&hltype=load`+"&disableform=T");

            createPopupdesignAddForm(`addForm.aspx`,`addform`,`${sourceDetails[2] || "Form Designer"}(${sourceDetails[1]})`);

       
        }
    }
    else
        LoadIframeDwb("ivtoivload.aspx?ivname=Formn");        

    $('#developerLogout').click(function () {
        var x = window.location.href;
        var path = x.substring(0, x.lastIndexOf('/'));
        window.location.replace(path + '/mainnew.aspx');
    });

    // toolbar buttons outside iframe //
    var frmnm = '';
    $("#middle1").on('load', function () {
        $("#leftSplitDivision").hide();
        $(".right-section").removeClass("dwbIvDef");
        resetiviewHtml();
        if ($("#middle1").contents().find('.tstivCaption').text() != "") {
            frmnm = getParamsValuefrmName("captitle");
            if (frmnm.length > 0)
            { frmnm = ' - ' + frmnm; }

            var iviewPageID = $('#middle1')[0].contentWindow["iName"] || $('#middle1')[0].contentWindow["transid"];
            if (iviewPageID == "ad_iq" || iviewPageID == "ad_ip" || iviewPageID == "ad_ic" || iviewPageID == "ad_ia" || iviewPageID == "ad_sc" || iviewPageID == "ad_is") {}
            else {
                $(".developerbreadcrumbTitle").text($("#middle1").contents().find('.tstivCaption').text() + frmnm);
            }
        }

        if ($('#middle1').attr('src') == "AxDBScript.aspx") {
            $('.developerWorkBenchToolbar,.developerWorkBenchSubToolbar').hide();
            $(".developerbreadcrumbTitle").text('DB Console');
        }
        else if ($('#middle1').attr('src') == "axpertAPI.aspx") {
            $('.developerWorkBenchToolbar,.developerWorkBenchSubToolbar').hide();
            $(".developerbreadcrumbTitle").text('Get Axpert API');
        }
            // else if ($('#middle1').attr('src') == "wizardsetting_new.aspx") {
            //     $('.developerWorkBenchToolbar,.developerWorkBenchSubToolbar').hide();
            //     if ($('.developerbreadcrumb-panel').is(":visible")) {
            //         dwbTitle = $('.developerbreadcrumb-panel').outerHeight(true);
            //     }
            // }
        else if ($('#middle1').attr('src') == "ArrangeMenu.aspx") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Arrange Menu');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('#ArrangeMtb').show();
        }
        else if ($('#middle1').attr('src') == "workflownew.aspx") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('WorkFlow');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
        }
        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "stdpglst") {
            $(".developerWorkBenchSubToolbar, .dwbiconsUl, .Bottomnavigationbar, #actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();            
            $(".developerbreadcrumbTitle").text("Standard Page");
            $(".developerWorkBenchToolbar").show();
            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=ad_sp") != -1 ) {
                $("#spFormTb").show();
            }
            else
            {
                $('#spListTb').show();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "ad_sp") {
            $(".developerWorkBenchSubToolbar, .dwbiconsUl").hide();
            $(".developerbreadcrumbTitle").text("Standard Page");
            $(".developerWorkBenchToolbar, #spFormTb").show();
        }
        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "jobtsk") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Axpert Jobs');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=job_s") != -1 ) {
                $('#AxpertjobsToolBarTst').show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
                $("#actbtn_iSave").show();
            }
            else
            {
                $('#AxpertjobsToolBar').show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "job_s") {
            $('#AxpertjobsToolBar').hide();
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Axpert Jobs');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#actbtn_iSave").show();
        }
        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "cdlist") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Custom Data Type');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=ctype") != -1 ) {
                $('#customdatatypetst').show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
                $("#actbtn_iSave").show();
            }
            else
            {
                $('#customdatatype').show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "ctype") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Custom Data Type');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#actbtn_iSave").show();
            $("#customdatatypetst").show();
        }

        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "ad_cnfgp") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Configuration parameters');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            if (typeof $('#middle1').contents().find('#form1').attr('action') != "undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=ad_cd") != -1) {
                $('#configParameterTstp').show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({ position: 'relative' });
                $("#actbtn_preclk, #actbtn_nextclk").hide();
                $("#actbtn_iSave,#actbtn_iRemove").show();
                $(".Bottomnavigationbar #actbtn_iRemove").hide()
            }
            else {
                $('#configParameters').show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "ad_cd") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Configuration parameters');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({ position: 'relative' });
            $("#actbtn_preclk, #actbtn_nextclk").hide();
            $("#actbtn_iSave,#actbtn_iRemove").show();
            $(".Bottomnavigationbar #actbtn_iRemove").hide()
            $("#configParameterTstp").show();
        }

        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "aximpdef") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Import Definitions');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=axipd") != -1 ) {
                $("#AxImportDefinitionTst").show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
                $("#actbtn_iSave").show();
            }
            else{
                $("#AxImportDefinition").show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "csqlist") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Data Source');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=b_sql") != -1 ) {
                $("#customsqlTst").show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
                $("#actbtn_iSave").show();
            }
            else{
                $("#customsql").show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "b_sql") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Data Source');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").show();
            $("#actbtn_preclk, #actbtn_nextclk ,#actbtn_iRemove").hide();
            $("#customsqlTst").show();
        }
        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "dop_list") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Developer Options');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=axstc") != -1 ) {
                $("#AxDeveloperTst").show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
                $("#actbtn_iSave").show();
            }
            else{
                $("#AxDeveloper").show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "axstc") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Developer Options');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").show();
            $("#actbtn_preclk, #actbtn_nextclk ,#actbtn_iRemove").hide();
            $("#AxDeveloperTst").show();
        }
        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "ivconfdt") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Configuration Property');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=astcp") != -1 ) {
                $("#Axconfigpropertytst").show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
                $("#actbtn_iSave").show();
            }
            else{
                $("#Axconfigproperty").show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "astcp") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Configuration Property');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").show();
            $("#actbtn_preclk, #actbtn_nextclk ,#actbtn_iRemove").hide();
            $("#Axconfigpropertytst").show();
        }
        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "runtform") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Runtime Forms');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });
            // $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            // $("#actbtn_iSave").show();
            $("#actbtn_preclk, #actbtn_nextclk ,#actbtn_iRemove").hide();
            $("#AxRuntimeAddFormList").show();
        }
        else if (findGetParameter("transid", $("#middle1").attr("src")) == "ad_nf") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Add New Form');
            $('.developerWorkBenchSubToolbar').hide();
            // $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });
            // $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            // $("#actbtn_iSave").show();
            $("#actbtn_preclk, #actbtn_nextclk ,#actbtn_iRemove").hide();
            $("#AxRuntimeAddForm").show();
        }

        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "publist") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Publish listing');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=axpub") != -1 ) {
                $(".developerbreadcrumbTitle").text('Servers configuration');
                $("#AxServerConfigTst").show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_iSave,#actbtn_iRemove").show();
                $("#actbtn_preclk, #actbtn_nextclk").hide();
            }
            else  if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("ivname=axpubls") != -1 ) {
                $('.developerWorkBenchToolbar').show();
                $(".developerbreadcrumbTitle").text('Structure listing for Publish');
                $('.developerWorkBenchSubToolbar').hide();
                $(".dwbiconsUl").hide();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
                $("#AxPublServer").show();
                try {
                    if(!$($('#middle1')[0].contentWindow.pserver).val()){
                        $('#middle1')[0].contentWindow.$('#ivContainer').css({'display': ''});
                        $('#middle1')[0].contentWindow.$('#accordion').css({'top': '0px'});
                        $('#middle1')[0].contentWindow.$('#Filterscollapse').collapse('show');
                    }
                } catch (ex) {}
            }
            else  if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("ivname=pservers") != -1 ) {
                $(".developerbreadcrumbTitle").text('Servers configuration list');
                $("#AxServerConfig").show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
            else{
                $("#AxPublishlisting").show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "axipd") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Import Definitions');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").show();
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#AxImportDefinitionTst").show();

        }

        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "axexpjob") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Export Definitions');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=axexp") != -1 ) {
                $("#AxExportDefinitionTst").show();
            }
            else{
                $("#AxExportDefinition").show();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "axexp") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Export Definitions');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });
            $("#AxExportDefinitionTst").show();
        }

        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "exapidef") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('API Definitions');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            // $('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=apidg") != -1 ) {
                $("#AxApiDefinitionTst").show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
                $("#actbtn_iSave").show();
            }
            else{
                $("#AxApiDefinition").show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "apidg") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('API Definitions');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").show();
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#AxApiDefinitionTst").show();
        }

        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "emaildef") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Email Definitions');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            //$('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=axeml") != -1 ) {
                $("#AxEmailDefinitionTst").show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
                $("#actbtn_iSave").show();
            }
            else{
                $("#AxEmailDefinition").show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "axeml") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Email Definitions');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").show();
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#AxEmailDefinitionTst").show();
        }


        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "adi_td") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Table Descriptor');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            //$('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=ad_td") != -1 ) {
                $("#AxTableDescptiorTst").show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
                $("#actbtn_iSave").show();
            }
            else{
                $("#AxTableDescptior").show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "ad_td") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Table Descriptor');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").show();
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#AxTableDescptiorTst").show();
        }


        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "axprint") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Print Definitions');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            // $('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=axprn") != -1 ) {
                $("#AxPrintDefinitionTst").show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
                $("#actbtn_iSave").show();
            }
            else{
                $("#AxPrintDefinition").show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "axprn") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Print Definitions');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").show();
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#AxPrintDefinitionTst").show();
        }

        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "axpubls") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Structure listing for Publish');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });
            $("#AxPublServer").show();
            try {
                if(!$($('#middle1')[0].contentWindow.pserver).val()){
                    $('#middle1')[0].contentWindow.$('#ivContainer').css({'display': ''});
                    $('#middle1')[0].contentWindow.$('#accordion').css({'top': '0px'});
                    $('#middle1')[0].contentWindow.$('#Filterscollapse').collapse('show');
                }
            } catch (ex) {}
        }

        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "pservers") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Servers configuration');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=axpub") != -1 ) {
                $("#AxServerConfigTst").show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_iSave,#actbtn_iRemove").show();
                $("#actbtn_preclk, #actbtn_nextclk").hide();
            }
            else{
                $("#AxServerConfig").show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk,#actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "axpub") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Servers configuration');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave,#actbtn_iRemove").show();
            $("#actbtn_preclk, #actbtn_nextclk").hide();
            $("#AxServerConfigTst").show();
        }
        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "axvars") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Application variables');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=axvar") != -1 ) {
                $("#ApplvarbTst").show();
                if ($('#middle1').contents().find('#form1').attr('action').indexOf("&isparam=F")>-1 && $('#middle1').contents().find('#form1').attr('action').indexOf("&isconstant=T")>-1)
                {
                    $(".developerbreadcrumbTitle").text('Application constants');
                    $("#ApplvarbTst").find('#new').attr('title', 'New Application constant');
                }
                else if ($('#middle1').contents().find('#form1').attr('action').indexOf("&isparam=F") > -1 && $('#middle1').contents().find('#form1').attr('action').indexOf("&isvariable=T") > -1)
                {
                    $(".developerbreadcrumbTitle").text('Application variables');
                    $("#ApplvarbTst").find('#new').attr('title', 'New Application variable');
                }
                else if ($('#middle1').contents().find('#form1').attr('action').indexOf("&isparam=T") > -1)
                {
                    $(".developerbreadcrumbTitle").text('Application parameters');
                    $("#ApplvarbTst").find('#new').attr('title', 'New Application parameter');
                }
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({ position: 'relative' });
                $("#actbtn_iSave,#actbtn_iRemove").show();
                $("#actbtn_preclk, #actbtn_nextclk ,#actbtn_iRemove").hide();
            }
            else if (typeof $('#middle1').contents().find('#form1').attr('action') != "undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("transid=ad_db") != -1) {
                $("#ApplFromDBVarbTst").show();
                $(".developerbreadcrumbTitle").text('Application db variables');
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({ position: 'relative' });
                $("#actbtn_iSave,#actbtn_iRemove").show();
                $("#actbtn_preclk, #actbtn_nextclk").hide();
                $(".Bottomnavigationbar #actbtn_iRemove").hide()
            }
            else {
                $(".developerbreadcrumbTitle").text('Application variables');
                $("#Applvarb").show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk,#actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "axvar") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Application variables');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({ position: 'relative' });
            $("#actbtn_iSave").show();
            $("#actbtn_preclk, #actbtn_nextclk ,#actbtn_iRemove").hide();
            $("#ApplvarbTst").show();
            $("#ApplvarbTst").find('#new').attr('title', 'New Axvars');
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "ad_db") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Application variables');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({ position: 'relative' });
            $("#actbtn_iSave,#actbtn_iRemove").show();
            $("#actbtn_preclk, #actbtn_nextclk").hide();
            $(".Bottomnavigationbar #actbtn_iRemove").hide()
            $("#ApplFromDBVarbTst").show();
        }

        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "ivrptdwb") {
            $(".developerWorkBenchToolbar, .Bottomnavigationbar").show();
            $(".dwbiconsUl").hide();
            $(".dwbIvTabBtn").removeClass('active');
            $(".panel-fisrt-partdwb").css({ 'box-shadow': 'none', 'margin-left': '0px', height: 'calc(100vh - 110px)' });

            var iviewPageID = $('#middle1')[0].contentWindow["iName"] || $('#middle1')[0].contentWindow["transid"];
            //condition for listview page.
            if (iviewPageID == "ivrptdwb") {
                $(".developerWorkBenchSubToolbar, .leftSplitDivision, .topSplitDivision, .Bottomnavigationbar").hide();
                $("#ivDefIvToolBar").show();
                $(".panel-fisrt-partdwb").css({ width: '100%', position: 'relative' });
            }
                //condition for NewIvew Page.
            else if (iviewPageID === "ad_i") {
                $(".developerWorkBenchSubToolbar, .topSplitDivision, .leftSplitDivision, #actbtn_preclk, #actbtn_iSave, #actbtn_iRemove").hide();
                $(".panel-fisrt-partdwb").css({ width: '100%', position: 'relative' });
                $("#actbtn_nextclk, #ivDefTstToolBar").show();
            }
                //condition when opening in split mode(params ,columns and script tab)
            else if (iviewPageID == "ad_ip" || iviewPageID == "ad_ic" || iviewPageID == "ad_sc") {
                $(".developerWorkBenchSubToolbar, #ivDefTstToolBar, #actbtn_preclk, #actbtn_iSave, #actbtn_nextclk").show();
                $(".right-section").addClass("dwbIvDef");
                $("#actbtn_iRemove").hide();

                if (iviewPageID == "ad_ic") {
                    $(".leftSplitDivision").hide();
                    $(".topSplitDivision").show();
                    $(".panel-fisrt-partdwb").css({ width: '100%', height: 'calc(100vh - 269px)', position: 'relative' });
                    $("#actbtn_linkcols").addClass('active');
                }
                else if (iviewPageID == "ad_ip" || iviewPageID == "ad_sc") {                    
                    $(".topSplitDivision").hide();
                    $(".leftSplitDivision").show();
                    $(".panel-fisrt-partdwb").css({ width: '79%', float: 'right', position: 'relative', right: '0', 'box-shadow': 'none', 'margin-left': '0px', height: 'calc(100vh - 147px)' });

                    if(iviewPageID == "ad_sc") {
                        $("#actbtn_linkscript").addClass("active");                        
                    } 
                    else{
                        $("#actbtn_linkparams").addClass("active");
                    }
                }
            }
                //condition when opening without splitmode.
            else if (iviewPageID != undefined) {
                $(".developerWorkBenchSubToolbar, #ivDefTstToolBar").show();
                $(".right-section").addClass("dwbIvDef");
                $(".panel-fisrt-partdwb").css({ width: '100%', position: 'relative',height: 'calc(100vh - 147px)' });
                $(".topSplitDivision, .leftSplitDivision").hide();

                if (iviewPageID == "ad_iq") { // main
                    $("#actbtn_preclk, #actbtn_iSave, #actbtn_iRemove").hide();
                    $("#actbtn_nextclk").show();
                    $("#actbtn_linksql").addClass("active");
                }
                else if (iviewPageID == "ad_ia") { // prop
                    $("#actbtn_preclk, #actbtn_iSave, #actbtn_nextclk").show();
                    $("#actbtn_iRemove").hide();
                    $("#actbtn_linkproperty").addClass("active");
                }
                else if (iviewPageID == "ad_is") { // sub total
                    $("#actbtn_preclk, #actbtn_iSave").show();
                    $("#actbtn_iRemove, #actbtn_nextclk").hide();
                    $("#actbtn_linksubtotal").addClass("active");
                }
                else {
                    $("#actbtn_preclk, #actbtn_iSave, #actbtn_nextclk, #actbtn_iRemove").hide();
                }                                
            }
        }
            //condition when iview definition pages loading directly in split mode (not through form1 action)
        else if (findGetParameter("transid", $("#middle1").attr("src")) == "ad_ia" || findGetParameter("transid", $("#middle1").attr("src")) ==  "ad_ic" || findGetParameter("transid", $("#middle1").attr("src")) ==  "ad_ip" || findGetParameter("transid", $("#middle1").attr("src")) ==  "ad_iq" || findGetParameter("transid", $("#middle1").attr("src")) ==  "ad_sc" || findGetParameter("transid", $("#middle1").attr("src")) ==  "ad_is") {
            var iviewPageID = $('#middle1')[0].contentWindow["iName"] || $('#middle1')[0].contentWindow["transid"];
            $(".developerWorkBenchToolbar, .developerWorkBenchSubToolbar, .Bottomnavigationbar").show();
            $(".right-section").addClass("dwbIvDef");
            $(".dwbiconsUl").hide();
            $("#ivDefTstToolBar").show();
            
            if (iviewPageID == "ad_ip" || iviewPageID == "ad_sc") {
                $(".panel-fisrt-partdwb").css({ width: '79%', float: 'right', position: 'relative', right: '0', 'box-shadow': 'none', 'margin-left': '0px', height: 'calc(100vh - 142px)' });
                $(".topSplitDivision, #actbtn_iRemove").hide();
                $(".leftSplitDivision, #actbtn_preclk, #actbtn_iSave, #actbtn_nextclk").show();
                if (iviewPageID == "ad_sc") {
                    $("#actbtn_linkscript").addClass("active");
                } 
                else {
                    $("#actbtn_linkparams").addClass("active");
                } 
            }
            else if (iviewPageID == "ad_ic") {
                $(".panel-fisrt-partdwb").css({ width: '100%', height: 'calc(100vh - 269px)', position: 'relative' });
                $(".topSplitDivision, #actbtn_preclk, #actbtn_iSave, #actbtn_nextclk").show();
                $("#actbtn_linkcols").addClass("active");
                $(".leftSplitDivision, #actbtn_iRemove").hide();
            }
            else {
                $(".panel-fisrt-partdwb").css({ width: '100%', height: 'calc(100vh - 142px)', position: 'relative' });
                $(".leftSplitDivision, .topSplitDivision").hide();
                if (iviewPageID == "ad_ia") {
                    $("#actbtn_preclk, #actbtn_iSave, #actbtn_nextclk").show();
                    $("#actbtn_iRemove").hide();
                    $("#actbtn_linkproperty").addClass("active");
                }
                else if (iviewPageID == "ad_iq") {
                    $("#actbtn_preclk, #actbtn_iSave, #actbtn_iRemove").hide();
                    $("#actbtn_nextclk").show();
                    $("#actbtn_linksql").addClass("active");
                }
                else if (iviewPageID == "ad_is") {
                    $("#actbtn_preclk, #actbtn_iSave").show();
                    $("#actbtn_iRemove, #actbtn_nextclk").hide();
                    $("#actbtn_linksubtotal").addClass("active");
                }
                else if (iviewPageID == "ivrptdwb") {
                    $(".developerWorkBenchSubToolbar, .leftSplitDivision, .topSplitDivision, .Bottomnavigationbar").hide();
                    $(".dwbiconsUl").hide();
                    $("#ivDefIvToolBar").show();
                    $(".panel-fisrt-partdwb").css({ width: '100%', position: 'relative' });
                }
                else if (iviewPageID == "ad_i"){
                    $("#actbtn_preclk, #actbtn_iSave, #actbtn_iRemove, .developerWorkBenchSubToolbar").hide();
                    $("#actbtn_nextclk").show();
                }
            }
        }
            // else if ($('#middle1').attr('src') == "PageDesigner.aspx") {
            //     $('.developerWorkBenchToolbar').show();
            //     $(".developerbreadcrumbTitle").text('Page Builder');
            //     $('.developerWorkBenchSubToolbar').hide();
            //     $(".dwbiconsUl").hide();
            //     $('#wbtb').show();
            // }
        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "hplist") {
            $(".developerWorkBenchSubToolbar, .dwbiconsUl").hide();
            $(".developerWorkBenchToolbar").show();
            findGetParameter("transid", $('#middle1').contents().find('#form1').attr('action')) == "sect" ? $("#htmlPagesTstToolBar").show() : $("#htmlPagesIvToolBar").show();
           
        }
            // else if ($('#middle1').attr('src') == "widgetbuilder.aspx") {
            //     $('.developerWorkBenchToolbar').show();
            //     $('.developerWorkBenchSubToolbar').hide();
            //     $(".dwbiconsUl").hide();
            //     $('#pgbuildertb').show();
            // }
        else if ($('#middle1').attr('src') == "ivtoivload.aspx?ivname=Formn" || ($('#middle1').attr('src') == "ivtoivload.aspx?ivname=mainrepo&AxIvNav=true" && isAppParamIV == false)){
            isAppParamIV = false;
            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("=ad_nf") != -1 ) {
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_iSave").show();
                $("#actbtn_preclk, #actbtn_nextclk,#actbtn_iRemove").hide();
            }
            else if($('#axpiframe').attr('src').indexOf("=NF_AG") != -1 || $('#axpiframe').attr('src').indexOf("=mntss") != -1 || $('#axpiframe').attr('src').indexOf("=ad__d") != -1||$('#axpiframe').attr('src').indexOf("=ad_ge") != -1 || $('#axpiframe').attr('src').indexOf("=ad_md") != -1 || $('#axpiframe').attr('src').indexOf("=ad_fg") != -1 || $('#axpiframe').attr('src').indexOf("=ad_s") != -1 || $('#axpiframe').attr('src').indexOf("=ad__t") != -1) {
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_iSave, #actbtn_iRemove ").show();
                $("#actbtn_preclk, #actbtn_nextclk").hide();
            }
            $('.developerWorkBenchToolbar').show();
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('#Formstb').show();
            
            $.each($('#Formstb').children('li'), function (i, e) {
                var btnID = $(e).children('a').attr('id');

                if ((btnID.trim() == 'btn_opentstr' || btnID.trim() == 'btn_search') && frmnm == '') {
                    $(e).show();
                    return true;
                }
                else if (btnID.trim() != 'btn_opentstr' && frmnm != '') {
                    $(e).show();
                    return true;
                }
                else {
                    $(e).hide();
                }
            });

        }
        else if ($('#middle1').attr('src').startsWith("tstructnew.aspx?act=open&transid=ad_af&") || findGetParameter("tstname", $("#middle1").attr("src"))=="ad_af") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Add New Field');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").hide();
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#AxRuntimeAddFieldtst").show();
            $(".left-section").hide();
            $(".right-section").css({'left':'initial','width':'calc(100vw - 2px)'});
        }
        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "ivad_af") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Add New Field');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").hide();
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#AxRuntimeAddField").show();
            $(".left-section").hide();
            $(".right-section").css({'left':'initial','width':'calc(100vw - 2px)'});
        }

        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "axpcards") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Cards');
            $('.developerWorkBenchSubToolbar, .dwbiconsUl, .Bottomnavigationbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });

            if( typeof $('#middle1').contents().find('#form1').attr('action') !="undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("=axcad") != -1 ) {
                $("#cardsTstToolBar").show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
                $("#actbtn_iSave").show();
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            }
            else
            {
                $('#cardsIvToolBar').show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "axcad") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Cards');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave").show();
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#cardsTstToolBar").show();
        }  
        else if (findGetParameter("ivname", $("#middle1").attr("src")) == "axlangs") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Axpert languages');
            $('.developerWorkBenchSubToolbar, .dwbiconsUl, .Bottomnavigationbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'none' });

            if (typeof $('#middle1').contents().find('#form1').attr('action') != "undefined" && $('#middle1').contents().find('#form1').attr('action').indexOf("=ad_lg") != -1) {
                $("#axlanguagetst").show();
                $('.Bottomnavigationbar').css({ display: 'block' });
                $('.right-section .right-iviewmain#dvMiddle1').css({ position: 'relative' });
                $("#actbtn_iSave").hide();
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            }
            else {
                $('#axlanguages').show();
                $('.Bottomnavigationbar').css({ display: 'none' });
                $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove, #actbtn_iSave").hide();
            }
        }
        else if (findGetParameter("tstname", $("#middle1").attr("src")) == "ad_lg") {
            $('.developerWorkBenchToolbar').show();
            $(".developerbreadcrumbTitle").text('Axpert languages');
            $('.developerWorkBenchSubToolbar').hide();
            $(".dwbiconsUl").hide();
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({ position: 'relative' });
            $("#actbtn_iSave").hide();
            $("#actbtn_preclk, #actbtn_nextclk, #actbtn_iRemove").hide();
            $("#axlanguagetst").show();
        } 
        // setMiddle1Height();
    });



    $("#axpiframe").on('load', function () {
        var checkIframeActionaxpi = $('#axpiframe').contents().find('#form1').attr('action');
        if ( (typeof checkIframeActionaxpi != "undefined" && checkIframeActionaxpi.indexOf("=NF_AG") != -1) || (typeof checkIframeActionaxpi != "undefined" && checkIframeActionaxpi.indexOf("=mntss") != -1 )|| $('#axpiframe').attr('src').indexOf("=NF_AG") != -1 || $('#axpiframe').attr('src').indexOf("=mntss") != -1 || $('#axpiframe').attr('src').indexOf("=ad__d") != -1 || $('#axpiframe').attr('src').indexOf("=ad_ge") != -1 || $('#axpiframe').attr('src').indexOf("=ad_md") != -1 || $('#axpiframe').attr('src').indexOf("=ad_fg") != -1 || $('#axpiframe').attr('src').indexOf("=ad_s") != -1 || $('#axpiframe').attr('src').indexOf("=ad__t") != -1) {
            $('.Bottomnavigationbar').css({ display: 'block' });
            $('.right-section .right-iviewmain#dvMiddle1').css({position:'relative'});
            $("#actbtn_iSave, #actbtn_iRemove").show();
            $("#actbtn_preclk, #actbtn_nextclk").hide();
        }
    });


    getMainSqlHintObj();
    $(document).on('click',".developer-menu ul li",function (){
        var popoverTemplate = ['<div class="dwbLeftMenuPopover popover">',
        '<div class="arrow"></div>',
        '<div class="popover-content">',
        '</div>',
        '</div>'].join('');
        $(this).popover({
            html: true,
            trigger: 'focus',
            container: 'body',
            template: popoverTemplate,
            delay: { hide: 200 },
            content: function () {
                return $(this).find('.popover-content').html();
            }
        }).popover('toggle');
    });
    
    $(document).on('click',".three-dot .colOptDropDown",function (event){
        var _this = this;

        var hideThis = false;
        $('.columnDropdonwMenuPopover').each(function () {
            try {
                $(this).data("bs.popover").$element.popover("hide");
                if($(this).data("bs.popover").$element.is($(_this))){
                    hideThis = true;
                }
            } catch (ex) {
                hideThis = true;
                $(this).remove();
            }
        });

        if(hideThis){
            hideThis = false;
            return true;
        }

        $(this).find('button').css({"display":"block"});
        var dropdownTemplate = ['<div class="columnDropdonwMenuPopover popover" onmouseleave="$(this).popover(\'hide\');" onclick="$(this).popover(\'hide\');">',
        '<div class="popover-content">',
        '</div>',
        '</div>'].join('');
        $(this).popover({
            html: true,
            trigger: 'manual',
            container: 'body',
            placement: 'bottom',
            template: dropdownTemplate,
            delay: { hide: 200 },
            content: function () {               
                return $(this).find('.popover-content').html();
            }
        })
        .on("show.bs.popover", (e) => {
            let colIndex = ivColDesignJSON[dwbiName].findIndex(col=>col.name==$(this).parents("th").data("columnName")) + 1;
            if(!hideColumn[colIndex] && colIndex != 1 && !hideColumn[colIndex - 1]){
                $(this).find('.popover-content .ddMergeColOpt').show();
            }else{
                $(this).find('.popover-content .ddMergeColOpt').hide();
            }

            $('[data-toggle="popover"]').each(function () {
                //the 'is' for buttons that trigger popups
                //the 'has' for icons within a button that triggers a popup
                if (!$(this).is(_this) && $(this).has(_this).length === 0 && $('.popover').has(_this).length === 0) {
                    $(this).popover('hide');
                }
            });
        })
        .popover('toggle');
    });


    try {
        AxAfterDWBCallBack();
    } catch (error) {}
});

function resetiviewHtml() {
    $(".leftSplitDivision, .topSplitDivision, .Bottomnavigationbar").hide();
    $(".panel-fisrt-partdwb").css({ height: "calc(100vh - 110px)" });
}

function setMiddle1Height() {
    //  $(".right-section").css({ "height": $(".left-section").outerHeight(true)});
    var rightSecHeight = 0;
    try {
        rightSecHeight = $(".left-section").outerHeight(true);
    } catch (ex) { }

    var brdcmHeight = 0;
    try {
        $(".developerbreadcrumb-panel").is(':visible') ? brdcmHeight = $(".developerbreadcrumb-panel").outerHeight(true) : "";
    } catch (ex) { }
    var toolBarHeight = 0;
    try {
        $(".developerWorkBenchToolbar").is(':visible') ? toolBarHeight = $(".developerWorkBenchToolbar").outerHeight(true) : "";
    } catch (ex) { }
    var hightOfMiddl1 = rightSecHeight - (brdcmHeight + toolBarHeight);
    $('#middle1').css({ "height": hightOfMiddl1 });
}

function getParamsTstURL() {
    var paramString = $("#middle1").contents().find("#hdnparamValues").val();
    var designTstName = '';
    typeof paramString == "string" && paramString.replace(/¿/g, '♣').split('♣').forEach((v, i) => {
        if (v) {
            var splitVal = v.split("~");

            if (CheckSpecialCharsInStr(splitVal[0]) == 'tstname') {
                designTstName = CheckSpecialCharsInStr(splitVal[1]);
            }
        }
    });
    var pURL = `tstruct.aspx?act=open&transid=${designTstName}&theMode=design&AxPop=true`;
    return pURL;
}
function getParamsValuefrmName(hdnParm) {
    var paramString = $("#middle1").contents().find("#hdnparamValues").val();
    var returnArray = '';
    typeof paramString == "string" && paramString.replace(/¿/g, '♣').split('♣').forEach((v, i) => {
        if (v) {
            var splitVal = v.split("~");

            if (CheckSpecialCharsInStr(splitVal[0]) == hdnParm)
            { returnArray = CheckSpecialCharsInStr(splitVal[1].toString()).replace(/&amp;/g, '&'); }
            //returnArray[CheckSpecialCharsInStr(splitVal[0])] = CheckSpecialCharsInStr(splitVal[1].toString()).replace(/&amp;grave;/g, '~');
        }
    });
    return returnArray;
}
function LoadTstFrmDesign() {
    var srcUrl = getParamsTstURL();
    var navigationType = '';
    var parFrm = $j("#axpiframe", parent.document);
    if ((navigationType == undefined || navigationType == "") && parFrm.hasClass("frameSplited"))
        navigationType = "split"

    try {
        srcUrl = loadTstUrlReWrite(srcUrl) || srcUrl;
    } catch (ex) { }

    if (navigationType === "split") {
        ShowDimmer(false);
        //OpenOnPropertyBase(srcUrl);
        callParentNew(`OpenOnPropertyBase(${srcUrl})`, 'function');

    }
    else if (navigationType === "popup") {
        LoadPopPage(srcUrl)
    }
    else if (navigationType === "default" || navigationType == "") {
        ReloadIframe(srcUrl);
    }
    else if (navigationType === "newpage") {
        popupFullPage(srcUrl)
    }


}
//Popup form design without Parent Devendra
function LoadPopPageDesign() {

    loadPop = createPopupdesign(getParamsTstURL()+"&appschema=true");

}

function createPopupdesign(iframeSource, isRefreshSelect, width, height) {
    iframeHtmlSrc = iframeSource
    htmlContent = '<div id="axpertPopupWrapper" style="width:90vw;height:80vh;top:100px;left:34px;" class="remodal" data-remodal-id="axpertPopupModal"><button data-remodal-action="close" class="remodal-close remodalCloseBtn icon-basic-remove" title="Close"></button><div style="height:100%;" id="iframeMarkUp"></div></div>';
    $("head").append(htmlContent);
    var options = { "closeOnOutsideClick": true, "hashTracking": false, "closeOnEscape": true };
    var inst = $('[data-remodal-id=axpertPopupModal]:not(.remodal-is-initialized):not(.remodal-is-closed):eq(0)').remodal(options);
    if (inst && inst.state != "opened")
        inst.open();

    return inst;

}

function createPopupdesignAddForm(iframeSource, calledFrom, title = "") {
    iframeHtmlSrc = iframeSource
    htmlContent = `<div id="axpertPopupWrapper" ${calledFrom == "addform" ? `style="top: 42px;height: calc(100% - 48px);"` : `style="width:90vw;height:80vh;top:100px;left:34px;"`} class="remodal" data-remodal-id="axpertPopupModal"><button data-remodal-action="close" class="remodal-close remodalCloseBtn icon-basic-remove ${calledFrom == "addform" ? "hide" : ""}" title="Close"></button>

        <div class="col-sm-4 col-lg-4 col-md-4 dwbLeftMenu ${calledFrom == "addform" ? "" : "hide"}" style="font-size: 24px;font-weight: 600;padding: 8px 10px;-ms-text-overflow: ellipsis;-o-text-overflow: ellipsis;text-overflow: ellipsis;overflow: hidden;text-align: left;">
            ${title || `Add New Forms`}
        </div>

        <div class="col-sm-8 col-lg-8 col-md-8 dwbRightMenu ${calledFrom == "addform" ? "" : "hide"}">
            <div class="developerWorkBenchToolbar">
                <ul class="dwbiconsUl" id="addFormAddForm" style="display: block;">
                    <!--<li><a href="javascript:void(0);" iid="ftbtn_iSave" title="Runtime New Form" class="" onclick="$(this).parents('.developerWorkBenchToolbar').next().find('iframe').attr('src', 'iview.aspx?ivname=runtform')"><i class="fa fa-plus" aria-hidden="true"></i>List</a></li>-->

                    <li class="d-none"><a href="javascript:void(0);" iid="ftbtn_iSave" title="Runtime New Form" class="" onclick="$(this).parents('#axpertPopupWrapper').find('iframe')?.[0]?.contentWindow?.formSave();"><i class="fa fa-save" aria-hidden="true"></i>Save</a></li>

                    <li class="d-none"><a href="javascript:void(0);" iid="ftbtn_iSave" title="Runtime New Form" class="" onclick="$(this).parents('#axpertPopupWrapper').find('.remodalCloseBtn').trigger('click'); LoadIframeDwb('iview.aspx?ivname=runtform');"><i class="fa fa-file-text-o" aria-hidden="true"></i>List</a></li>
                    
                    <li class="d-none"><a href="javascript:void(0);" iid="ftbtn_iSave" title="Runtime New Form" class="" onclick="$(this).parents('#axpertPopupWrapper').find('iframe')?.[0]?.contentWindow?.openFormProperties($(this));"><i class="fa fa-wpforms" aria-hidden="true"></i>Form Properties</a></li>

                    <!--<li class="d-none"><a href="javascript:void(0);" iid="ftbtn_iSave" title="Runtime New Form" class="" onclick="$(this).parents('.developerWorkBenchToolbar').next().find('iframe').contentWindow"><i class="fa fa-plus" aria-hidden="true"></i>List</a></li>-->
                </ul>
            </div>
        </div>
        <div style="${calledFrom == "addform" ? "height:calc(100% - 50px);" : "height:100%;"}" id="iframeMarkUp"></div>
    </div>`;
    $("head").append(htmlContent);
    var options = ((calledFrom == "addform") ? { "closeOnOutsideClick": false, "hashTracking": false, "closeOnEscape": false } : { "closeOnOutsideClick": true, "hashTracking": false, "closeOnEscape": true });
    var inst = $('[data-remodal-id=axpertPopupModal]:not(.remodal-is-initialized):not(.remodal-is-closed):eq(0)').remodal(options);
    if (inst && inst.state != "opened")
        inst.open();

    return inst;

}

//Main page on before unload- calling sgnout webservice to handle record lock
function BeforeWindowClose() {
    if (doPageUnload != "false") {
        try {
            var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
            sessionStorage.removeItem("homeJsonObj");
            sessionStorage.clear();
            var localSessionVal = parseInt(window.localStorage.getItem("axpertLocalsession-" + appUrl));
            if (!localSessionVal || localSessionVal == 0) {
                //localStorage.clear();
                clearLocalStorage(['projInfo-', 'versionInfo-', 'langInfo-', 'hybridGUID-', 'compressedMode-'], true);
                window.localStorage.removeItem("axpertLocalsession-" + appUrl);
                ASB.WebService.SignOut();
            } else
                window.localStorage.setItem("axpertLocalsession-" + appUrl, localSessionVal - 1);
        } catch (ex) { }
    } else
        doPageUnload = "true";
}

function createLocalSession() {
    var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    if (window.localStorage.getItem("axpertLocalsession-" + appUrl) == null)
        window.localStorage.setItem("axpertLocalsession-" + appUrl, 0);
    else {
        var localSessionVal = parseInt(window.localStorage.getItem("axpertLocalsession-" + appUrl));
        window.localStorage.setItem("axpertLocalsession-" + appUrl, localSessionVal + 1);
    }

}

clearLocalStorage = function (exceptions, contains) {
    contains = contains || false;
    var storage = localStorage
    var keys = [];
    var exceptions = [].concat(exceptions) //prevent undefined
    var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    //get storage keys
    $.each(localStorage, function (key, val) {
        if(key.indexOf("-"+appUrl)>-1)
            keys.push(key);
    });
   
    //loop through keys
    for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        var deleteItem = true
        //check if key excluded
        for (j = 0; j < exceptions.length; j++) {
            var exception = exceptions[j];
            if (key.indexOf(exception) > -1 && contains) { deleteItem = false; } else if (key == exception) { deleteItem = false; }
        }
        //delete key
        if (deleteItem) {
            localStorage.removeItem(key)
        }
    }
}

function LoadIframeDwb(src) {
    if (src.toLowerCase().indexOf("=ad_ip") > -1 || src.toLowerCase().indexOf("=ad_sc") > -1) {
        $(".panel-fisrt-partdwb").css({ width: '79%', float: 'right', position: 'relative', right: '0', 'box-shadow': 'none', 'margin-left': '0px', height: 'calc(100vh - 142px)' });
    }
    else {
        splitfullDwb();
    }
    isTstructSplited = false;
    try {
        AxOnLoadIframe()
    }
    catch (ex) { }
    if (src.indexOf("iviewInteractive") !== 1)
        src = src.replace("iviewInteractive", "iview");

    if (window.globalChange) {
        if (confirm(lcm[31])) {
            SetFormDirty(false);
        } else {
            return;
        }
    } else if ($("#middle1")[0].contentWindow.designChanged != undefined && $("#middle1")[0].contentWindow.designChanged == true) {

        if (!confirm(lcm[31]))
            return;
    }
    var el = "";
    let el2 = "";
    try {
        el2 = AxOnLoadMiddleIframe(src);
        if (el2 != undefined || el2 != "") {
            // el2.src = "";
            el2.src = '../../aspx/' + src;
        }
    }
    catch (ex) { }
    if (el2 === undefined || el2 === "") {
        el = document.getElementById('middle1');
        // el.src = "";
        el.src = src;
    }
    isTstructPopup = false;
    return false;
}

function splitfullDwb() {
    $(".panel-fisrt-partdwb").css({ width: '100%', float: 'left', position: 'relative' });
    $('.panel-second-partdwb').hide();
    if ($("#axpiframe").hasClass("frameSplited") && $("#middle1").attr("src").indexOf("iview.aspx") != -1 && findGetParameter("tstcaption", $("#middle1").attr("src")) != null) {
        isTstructSplited = true;
        $("#middle1").attr("src", $("#axpiframe").attr('src'));
    }
    $("#axpiframe").attr("src", "");
    $("#axpiframe").removeClass("frameSplited");

};

function assocateIframe(directSplit) {
    let splitAsIview = false;
    if ($("#middle1").contents().find("#Panel1").length <= 0) {
        return;
    }

    let srcmiddle1 = frames['middle1'].window.location.href;
    if (window.navigator.userAgent.indexOf('MSIE ') != -1 || window.navigator.userAgent.indexOf('Trident/') != -1)
        srcmiddle1 = middle1URL || $("#middle1").attr('src').toLowerCase();

    if ($("#axpiframe").hasClass("frameSplited") === false) {
        if (srcmiddle1 != undefined && srcmiddle1 != "") {
            let srcmiddle1new = "";

            if (srcmiddle1.indexOf("tstruct.aspx") != -1) {
                srcmiddle1new = srcmiddle1.replace("tstruct", "iview");
                srcmiddle1new = srcmiddle1new.replace("transid", "ivname");
                try {
                    srcmiddle1new += ("&tstcaption=" + $($("#middle1")[0].contentWindow.document).find("#breadcrumb-panel div.bcrumb span").text());
                } catch (ex) { }
            }
            else if (srcmiddle1.indexOf("listiview.aspx") != -1) {
                srcmiddle1new = srcmiddle1.replace("listiview", "tstruct");
                srcmiddle1new = srcmiddle1new.replace("tid", "transid");
            }
            else if (srcmiddle1.indexOf("iview.aspx") != -1 || srcmiddle1.indexOf("ivtoivload.aspx") != -1) {
                let key = $("#middle1").contents().find("#hdnKey").val();
                if (srcmiddle1.indexOf("ivtoivload.aspx") != -1 || srcmiddle1.indexOf("iview.aspx") != -1) {
                    var middleGridview = $("#middle1", parent.document).contents().find("#GridView1 a:first");
                    if (middleGridview != undefined && middleGridview.length > 0) {
                        if (middleGridview.data("url") != undefined)
                            srcmiddle1new = middleGridview.data("url");
                    }
                }

                //try {
                //    $.ajax({
                //        type: "POST",
                //        url: "../WebService.asmx/GetAssociatedTstruct",
                //        data: JSON.stringify({ key: key }),
                //        cache: false,
                //        async: false,
                //        contentType: "application/json;charset=utf-8",
                //        dataType: "json",
                //        success: function (data) {
                //            if (data.d != "")
                //                srcmiddle1new = "tstruct.aspx?transid=" + data.d;

                //            else if (srcmiddle1.indexOf("ivtoivload.aspx") != -1 || srcmiddle1.indexOf("iview.aspx") != -1) {
                //                var middleGridview = $("#middle1", parent.document).contents().find("#GridView1 a:first");
                //                if (middleGridview != undefined && middleGridview.length > 0) {
                //                    if (middleGridview.data("url") != undefined)
                //                        srcmiddle1new = middleGridview.data("url");
                //                    else {
                //                        var ivLink = ""; var isHref = false;
                //                        if (middleGridview.attr("onclick") != undefined)
                //                            ivlink = middleGridview.attr("onclick");
                //                        else if (middleGridview.attr("href") != undefined) {
                //                            ivlink = middleGridview.attr("href");
                //                            isHref = true;
                //                        }

                //                        let isIviewtoIview = ivlink.replace("javascript:", "").replace(new RegExp("'", 'g'), "").split(",");
                //                        if (isIviewtoIview != undefined && isIviewtoIview != "" && isIviewtoIview[0].indexOf("OpenIviewFromIv") != -1) {
                //                            frames[0].window.OpenIviewFromIv(isIviewtoIview[0].replace("OpenIviewFromIv(", ""), isIviewtoIview[1], isIviewtoIview[2], "split");
                //                            splitAsIview = true;
                //                        }
                //                        else if (isIviewtoIview[0].indexOf("OpenIviewFromIv") == -1 && isHref == true) {
                //                            try {
                //                                var url = isIviewtoIview[0].substr(0, isIviewtoIview[0].indexOf("?"));
                //                                var params = isIviewtoIview[0].substr(isIviewtoIview[0].indexOf("&"));;
                //                                var ivName = isIviewtoIview[0].substr(isIviewtoIview[0].indexOf("=") + 1, 5);
                //                                frames[0].window.LoadTstFrmIview(url, params, ivName, "split");
                //                            } catch (ex) { }
                //                            splitAsIview = true;
                //                        }
                //                    }
                //                }
                //            }
                //        },
                //    });

                //} catch (ex) { }

            }
            else if (srcmiddle1.indexOf("ivtstload.aspx") != -1) {
                srcmiddle1new = srcmiddle1.replace("ivtstload", "listiview");
                srcmiddle1new = srcmiddle1new.replace("tstname", "tid");
            }

            if (srcmiddle1new != undefined && srcmiddle1new != "") {
                if (srcmiddle1new.indexOf("listiview.aspx") != -1) {
                    srcmiddle1new = srcmiddle1new.replace("listiview.aspx", "iview.aspx");
                    srcmiddle1new = srcmiddle1new.replace("?tid", "?ivname");
                    try {
                        srcmiddle1new += ("&tstcaption=" + $($("#middle1")[0].contentWindow.document).find("#breadcrumb-panel div.bcrumb span").text());
                    } catch (ex) { }
                }
                $("#divaxpiframe").css("display", "block");
                $("#axpiframe").css("display", "block");
                $("#axpiframe").addClass("frameSplited");

                if (srcmiddle1.indexOf("tstruct.aspx") != -1) {
                    $("#axpiframe").attr('src', srcmiddle1 + "&AxSplit=true");
                    $("#middle1").attr('src', srcmiddle1new + "&AxSplit=true");
                }
                else {
                    $("#axpiframe").attr('src', srcmiddle1new + "&AxSplit=true");
                }

                if (directSplit) {
                    resetSplitter('vertical');
                }
            }
            else if (splitAsIview) {
                $("#divaxpiframe").css("display", "block");
                $("#axpiframe").css("display", "block");
                resetSplitter('vertical');
                return;
            }
            else {
                $("#axpiframe").attr('src', "");
            }

        } else {
            splitfullDwb();
            return;
        }
    }
}

function updateAppLinkObj(url, forceUnBlock = 0) {
    var isCustomURL = -1;
    try {
        isCustomURL = AxCustomLinks(url)
    }
    catch (ex) {

    }
    var tempSubDirectoryArray = window.location.pathname.toLowerCase().split("/");
    var tempSubDirectory = (tempSubDirectoryArray.slice(0, (tempSubDirectoryArray.indexOf("aspx") > -1 ? tempSubDirectoryArray.indexOf("aspx") : tempSubDirectoryArray.length)).reduce(function (joined, val) {
        if (val && joined == "")
            return joined + val;
        else
            return joined;
    }, "") || "");
    if (isCustomURL > -1)
        url = "../" + mainProject + url.substr(url.indexOf('/aspx/'));
    else if (url.toLowerCase().indexOf(tempCustomProjPath = (window.location.origin.toLowerCase() + "/" + tempSubDirectory + (tempSubDirectory && "/") + mainProject.toLowerCase() + "/aspx/")) > -1) {
        url = "../" + url.substr(url.toLowerCase().indexOf("/" + mainProject.toLowerCase() + "/aspx/") + 1);
    }
    else if (url.indexOf("/aspx/") > -1)
        url = url.substr(url.indexOf('/aspx/') + 6);
    var blockHistory = ["mainnew.aspx", "dwb.aspx", "ivtstload.aspx", "ivtoivload.aspx", "err.aspx"];
    if (!forceUnBlock && blockHistory.filter((val) => (url.indexOf('/aspx/') > -1 ? (url.substr(url.indexOf('/aspx/') + 6) == val) : (url.indexOf(val) > -1))).length > 0) {
        if (appLinkHistory.length > 1 && (typeof navigationshow=="undefined" || navigationshow=="true")) {
            // $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
        }
        histListFlag = false;
        return false;
    }

    // check the same url eg : page reload.
    if (appLinkHistory[appLinkHistory.length - 1] == url) {
        if (appLinkHistory.length > 1 && (typeof navigationshow=="undefined" || navigationshow=="true")) {
            // $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
        }
        if (appLinkHistory.length - 1 > curPageIndex) {
            curPageIndex++;
        }
        histListFlag = false;
        return false;
    }

    //if (findGetParameter("ivname", appLinkHistory[appLinkHistory.length - 1]) === (thisIvName = findGetParameter("ivname", url)) && thisIvName) {
    if (findGetParameter("ivname", appLinkHistory[curPageIndex]) === (thisIvName = findGetParameter("ivname", url)) && thisIvName) {
        if (appLinkHistory.length > 1 && (typeof navigationshow=="undefined" || navigationshow=="true")) {
            // $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
        }
        return false;
    }

    // check for history List 
    if (histListFlag) {
        prevClickFlag = nextClickFlag = histListFlag = false;
        return false;
    }
    // check for Navigation link
    if (prevClickFlag) {
        prevClickFlag = nextClickFlag = histListFlag = false;
        return false;
    }
    // check for Navigation link
    if (nextClickFlag) {
        nextClickFlag = prevClickFlag = histListFlag = false;
        return false;
    }
    if ($("#axpiframe").hasClass("frameSplited")) {
        return false;
    }
    if (url) {
        if (appLinkHistory.length == 0) {
            appLinkHistory.push(url);
            if (appLinkHistory.length > 1 && (typeof navigationshow=="undefined" || navigationshow=="true")) {
                // $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
            }
            if (menuLabel) {
                appLinkHistoryLabel.push(menuLabel);
            } else {
                if (isCustomURL === 1)
                    appLinkHistoryLabel.push(updateHisLabel(url.substr(url.indexOf('/aspx/') + 6)));
                else
                    appLinkHistoryLabel.push(updateHisLabel(url));
            }
            return false;
        }
        if (appLinkHistory.length - 1 == curPageIndex) {
            appLinkHistory.push(url);
            if (appLinkHistory.length > 1 && (typeof navigationshow=="undefined" || navigationshow=="true")) {
                // $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
            }
            curPageIndex = appLinkHistory.length - 1;
            $('.linkNext').addClass('linkGray');
            if (menuLabel) {
                appLinkHistoryLabel.push(menuLabel);
                menuLabel = "";
            } else {
                if (isCustomURL === 1)
                    appLinkHistoryLabel.push(updateHisLabel(url.substr(url.indexOf('/aspx/') + 6)));
                else
                    appLinkHistoryLabel.push(updateHisLabel(url));
            }
        } else {
            if (appLinkHistory[curPageIndex] === url) {
                return false;
            }
            curPageIndex = curPageIndex + 1;
            if (!(findGetParameter("ivname", appLinkHistory[curPageIndex]) === (thisIvName = findGetParameter("ivname", url))) || (thisIvName == null)) {
                appLinkHistory.splice(curPageIndex, 0, url);
            }
            if (appLinkHistory.length > 1 && (typeof navigationshow=="undefined" || navigationshow=="true")) {
                // $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
            }
            if (menuLabel) {
                appLinkHistoryLabel.splice(curPageIndex, 0, menuLabel);
            } else {
                if (appLinkHistory.length == curPageIndex) {
                    if (isCustomURL === 1)
                        appLinkHistoryLabel.push(updateHisLabel(url.substr(url.indexOf('/aspx/') + 6)));
                    else
                        appLinkHistoryLabel.push(updateHisLabel(url));
                } else {
                    if (isCustomURL === 1)
                        appLinkHistoryLabel.splice(curPageIndex, 0, updateHisLabel(url.substr(url.indexOf('/aspx/') + 6)));
                    else
                        appLinkHistoryLabel.splice(curPageIndex, 0, updateHisLabel(url));
                }

            }

            //appLinkHistory.push(url);
            //if(appLinkHistory.length > 1){
            //$(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
            //}
        }
    }
    // curPageIndex = appLinkHistory.length-1;
    if (curPageIndex <= 0) {
        $('.linkPrev').addClass('linkGray');
        $('.linkNext').addClass('linkGray');
    } else {
        $('.linkPrev').removeClass('linkGray');
        $('.linkPrev').data('index', curPageIndex - 1).data('url', appLinkHistory[curPageIndex - 1]);
    }
    updateHistList();
    menuLabel = "";
    return false;
}

    function updateHisLabel(url) {
        // iview.aspx?ivname=actptniv
        // tstruct.aspx?act=load&transid=wipad&recordid=1431110000848
        var str2 = "iview.aspx";
        var str3 = "tstruct.aspx";
        if (url.indexOf(str2) != -1 || url.toLowerCase().indexOf("ivtoivload.aspx") != -1) {
            // For Iview  

            var childPT = $('#middle1').contents().find('div#breadcrumb-panel').find('.bcrumb').find('.tstivCaption').text();
            if (findGetParameter("tstcaption", url) != null) {
                childPT += " - Listview";
            }
            childPT = (url.indexOf(str2) > 0) ? childPT + " - " + url.slice(0, url.indexOf(str2)) : childPT;
            return (childPT) ? childPT : 'Title Not Found';
        } else if (url.indexOf(str3) != -1) {
            // For Tstruct
            var iFrameContents = $('#middle1').contents();
            var childPV = iFrameContents.find('input[type=text],textarea,select').filter(':visible:first');
            if (childPV && $.trim(childPV.val()) != "") {
                childPT = " - " + childPV.val();
            } else {
                var getChildLabel1 = getChildLabel(url);
                if (getChildLabel1 != "") {
                    childPT = getChildLabel1;
                } else {
                    childPT = " - New";
                }
            }
            //var childPT = (childPV && $.trim(childPV.val()) != "") ? " - " +childPV.val(): " - New";
            return iFrameContents.find('div#breadcrumb-panel').find('.bcrumb').find('.tstivCaption').text() + childPT;
        } else if (url.indexOf('listIview.aspx') != -1) {
            var iFrameContents = $('#middle1').contents();
            return iFrameContents.find('div#breadcrumb-panel').find('.bcrumb').find('.tstivCaption').text() + ' - listview';
        } else {
            return url.slice(0, url.indexOf('.aspx'));
        }
    }

    //Add for autosplit
    function autoSplitWindow() {
        let srcmiddle1 = frames['middle1'].window.location.href;
        if (srcmiddle1 != undefined && srcmiddle1 != "") {
            let srcmiddle1new = "";

            if (srcmiddle1.indexOf("tstruct.aspx") != -1) {
                srcmiddle1new = srcmiddle1.replace("tstruct", "listiview");
                srcmiddle1new = srcmiddle1new.replace("transid", "tid"); 
            }
        }
    }
    //---------------------New Added from main.js-------------------
    function OpenOnPropertyBase(UrlToOpen) {
        if ($("#axpiframe").hasClass("frameSplited") === false)
            splitvertical();
        $("#divaxpiframe").css("display", "block");
        $("#axpiframe").css("display", "block");
        if (UrlToOpen.indexOf("&AxSplit") == -1)
            UrlToOpen += "&AxSplit=true";
        $("#axpiframe").attr('src', UrlToOpen);
    }

    function splitvertical() {
        if ($('.split-btn i').hasClass('fa-times')) {
            $('.split-btn i').removeClass('fa-times').addClass('fa-sort');
            splitfullDwb();
            return;
        }

    }

    function splithorizantal() {
        if ($('.split-btn-vertical i').hasClass('fa-times')) {
            $('.split-btn-vertical i').removeClass('fa-times').addClass('fa-sort');
            splitfullDwb();
            return;
        }
    }

    function initializeSplitter(calledsplitter) {
        $(".panel-fisrt-part").customResizable("destroy");
        if (calledsplitter == 'horizantal') {
            $(".panel-fisrt-part").customResizable({
                handleSelector: ".splitter-horizontal",
                resizeWidth: false

            });
        } else {
            $(".panel-fisrt-part").customResizable({
                handleSelector: ".splitter",
                resizeHeight: false
            });
        }

    }
    //--------------------------------------END																

    function resetSplitter(calledFrom) {
        $('.panel-fisrt-partdwb, .panel-second-partdwb').show();
        if (calledFrom == "horizantal") {
            $('.panel-fisrt-partdwb,.panel-second-partdwb').css({ height: '50%', width: '100%' });
        } else {
            $(".panel-fisrt-partdwb").css({ width: '250px', position: 'absolute', left: '0px' });
            $('.panel-second-partdwb').css({ position: 'absolute', left: '250px', width: 'calc(100vw - 370px)' });
        }
    }

    function getAppSessionKey() {
        var appSess = "";
        $.ajax({
            type: "POST",
            url: "../WebService.asmx/GetSession",
            cache: false,
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ key: 'appsessionkey' }),
            dataType: "json",
            success: function (data) {
                if (data.d != 'Session does not exist')
                    appSess = data.d;
            },
        });
        return appSess;
    }

    function updateSessionVar(key, val) {
        $.ajax({
            type: "POST",
            url: "../WebService.asmx/AddSessionPair",
            cache: false,
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ key: key, val: val }),
            dataType: "json",
            success: function (data) { },
        });
    }

    function getSessionValue(key) {
        var returnString = "";
        $.ajax({
            type: "POST",
            url: "../WebService.asmx/GetSessionValue",
            cache: false,
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ key }),
                    dataType: "json",
            success: function (data) {
                if (data && data.d) {
                    returnString = data.d;
                }
            },
        });
        return returnString;
    }

    function signout(path) {
        if (typeof axOktaSessionInit != "undefined" && typeof axOktaLogOut != "undefined") {
            try {
                axOktaLogOut();
            } catch (ex) { }
        }
        var glType = gllangType;
        var isRTL = false;
        if (glType == "ar")
            isRTL = true;
        else
            isRTL = false;
        var msg = lcm[155];
        var signoutCB = $.confirm({
            title: msg,
            onContentReady: function () {
                disableBackDrop('bind');
            },
            backgroundDismiss: 'false',
            rtl: isRTL,
            escapeKey: 'buttonaB',
            content: lcm[27],
            buttons: {
                buttonA: {
                    text: lcm[164],
                    btnClass: 'hotbtn',
                    action: function () {
                        signoutCB.close();
                        window.location.href = path;
                    }
                },
                buttonaB: {
                    text: lcm[192],
                    btnClass: 'coldbtn',
                    action: function () {
                        disableBackDrop('destroy');
                    }
                }
            }
        });
    }

    // to trigger dwb toolbar buttons //
    $(document).on("click", ".dwbBtn, .dwbIvTabBtn , .dwbIvBtnbtm", function (event) {
        var dwbbtnid = $(this).attr("id");
        var dwbbtntext = $(this).text();

        if(sqlRestCallInitiated==true)
        {
            beforeRestCallId=dwbbtnid;
            return false;
        }

        $('.dwbIvTabBtn').removeClass('active');
        $(this).addClass('active');
        if(dwbbtnid=="btn_iSDuplicate" || dwbbtnid=="btn_nxclkDuplicate")
            return false;

        if ($(this).is($("#actbtn_linksql,#actbtn_linkproperty, #actbtn_linksubtotal"))) {
            $(".leftSplitDivision, .topSplitDivision").hide();
            splitfullDwb();
        }
        var isPopupBtn = false;
        if (dwbbtnid != "")
            isPopupBtn = $("#" + dwbbtnid).hasClass("dwbIvBtnbtmPopup");

        if ($("#middle1").contents().find("#" + dwbbtnid).length != 0 && !isPopupBtn) {
            if ($('#middle1')[0].contentWindow["iName"] == "mainrepo" && dwbbtnid == "btn_deletetstdef") {
                deleteStructureConfirmations("deleteForm", dwbbtnid);
            }    
            else if (($('#middle1')[0].contentWindow["transid"] == "ad_iq" || $('#middle1')[0].contentWindow["transid"] == "ad_ip" || $('#middle1')[0].contentWindow["transid"] == "ad_ic" || $('#middle1')[0].contentWindow["transid"] == "ad_ia" || $('#middle1')[0].contentWindow["transid"] == "ad_sc" ) && dwbbtnid == "actbtn_deleteivdef") {
                deleteStructureConfirmations("deleteReport", dwbbtnid);
            }
            else if ($('#middle1')[0].contentWindow["iName"] == "mainrepo" && dwbbtnid == "btn_saveaststdef") {
                var dvHtml = "<div class=\"col-sm-12 col-md-12\"><div class=\"pull-left\"><label id=\"lbltext\" class=\"saveAsInfo\">Please provide Transid and caption. <br/> (Transid - maximum 5 characters/numbers, first value needs to be character, caption - 50 characters)</label> ";
                dvHtml+= "<label class=\"saveAsCaption\">Name (Transid)</label><br/>";
                dvHtml+= "<input type=\"text\" id=\"txtTransid\" pattern=\"^[a-zA-Z0-9 ]+$\" maxlength=\"5\" class=\"form-control\"/><br/>";
                dvHtml+= "<label class=\"saveAsCaption\">Caption</label><br/>";
                dvHtml+= "<input type=\"text\" id=\"txtCaption\" pattern=\"^[a-zA-Z0-9 ]+$\" class=\"form-control\"/><br/>";
                dvHtml+="</div><div class=\"pull-right\"><input type=\"button\" class=\"hotbtn btn\" value=\"Ok\" onclick=\"javascript:SaveAsPopup();\" /><input type=\"button\" class=\"coldbtn btn\" value=\"Cancel\" onclick=\"javascript:CloseSaveAsPopup();\" /></div></div>";
                displayBootstrapModalDialog("Save As", "", "265px", "", dvHtml,false);
            }
            else if (($('#middle1')[0].contentWindow["transid"] == "ad_iq" || $('#middle1')[0].contentWindow["transid"] == "ad_ip" || $('#middle1')[0].contentWindow["transid"] == "ad_ic" || $('#middle1')[0].contentWindow["transid"] == "ad_ia" || $('#middle1')[0].contentWindow["transid"] == "ad_sc" || $('#middle1')[0].contentWindow["transid"] == "ad_is") && dwbbtnid == "actbtn_saveasivdef") {
                var dvHtml = "<div class=\"col-sm-12 col-md-12\"><div class=\"\"> ";
                dvHtml+= "<label class=\"saveAsCaption\">IView Name</label><br/>";
                dvHtml+= "<input type=\"text\" id=\"txtivname\" pattern=\"^[a-zA-Z0-9 ]+$\" maxlength=\"8\" class=\"form-control\"/><br/>";
                dvHtml+= "<label class=\"saveAsCaption\">Caption</label><br/>";
                dvHtml+= "<input type=\"text\" id=\"txtivcaption\" pattern=\"^[a-zA-Z0-9 ]+$\" class=\"form-control\"/><br/>";
                dvHtml+="</div><div class=\"pull-right\"><input type=\"button\" class=\"hotbtn btn\" value=\"Ok\" onclick=\"javascript:SaveAsIvPopup();\" /><input type=\"button\" class=\"coldbtn btn\" value=\"Cancel\" onclick=\"javascript:CloseSaveAsPopup();\" /></div></div>";
               
                displayBootstrapModalDialog("Save As IView", "", "265px", "", dvHtml,false);
            }            
            else { 
                if((dwbbtnid=="ftbtn_iNew" || dwbbtnid=="btn_newfld") && AxConfigPage.startsWith("addfield~") && ($('#middle1')[0].contentWindow["transid"]=="ad_af" || $('#middle1')[0].contentWindow["iName"]=="ivad_af")){
                    let sourceDetails=AxConfigPage.split("~");
                    LoadIframeDwb('tstructnew.aspx?act=open&transid=ad_af&stransid='+sourceDetails[1]+'&formcaption='+sourceDetails[2]+(sourceDetails[1] ? ('('+sourceDetails[1]+')&disableform=T') : ""));
                }
                else
                    $($("#middle1").contents().find("#" + dwbbtnid)).trigger('click');
            }     
        }
        else if(dwbbtnid=="btnadafRemove" && $('#middle1')[0].contentWindow["transid"]=="ad_af" && $("#middle1").contents().find(".toolbarRightMenu a[title='Remove']").length!=0 )
        {
            deleteStructureConfirmations("deleteField", dwbbtnid);
        }
        else if(dwbbtnid == "btnadafuremove" && $('#middle1')[0].contentWindow["transid"] == "ad_af" && $("#middle1").contents().find(".toolbarRightMenu a[title='uremove']").length != 0 )
        {
            deleteStructureConfirmations("deleteField", dwbbtnid);
        }        
        else  if ($("#axpiframe").contents().find("#" + dwbbtnid).length != 0) {
            if(dwbbtnid=="actbtn_iRemove")
                deleteStructureConfirmations("deleteField", dwbbtnid);
            else
                $($("#axpiframe").contents().find("#" + dwbbtnid)).trigger('click');            
        }
        else if(dwbbtnid=="btnadafListView" && $('#middle1')[0].contentWindow["transid"]=="ad_af" && AxConfigPage.indexOf("~")>-1)
        {
            try{
                let soruceDetails=AxConfigPage.split("~");
                LoadIframeDwb('ivtoivload.aspx?ivname=ivad_af&pstransid='+(soruceDetails[1] || $('#middle1')[0].contentWindow?.GetFieldValue?.("stransid000F1")));
            }catch(ex){}
        }
        else if ($("#middle1").contents().find("#popupIframeRemodal").contents().find("li [id='" + dwbbtnid + "']").length != 0) {
            $($("#middle1").contents().find("#popupIframeRemodal").contents().find("li [id='" + dwbbtnid + "']")).trigger('click');
        }
        else if ($("#middle1").contents().find('li:not([style*="display: none"])').filter(function () {
            return /Save/i.test($(this).text());
        }).length != 0) {
            $($("#middle1").contents().find('li:not([style*="display: none"]):not([id*="btn_saveaststdef"])').filter(function () {
                return /Save/i.test($(this).text());
            })).trigger('click');
        }
        else if ($("#middle1").contents().find("#popupIframeRemodal").contents().find('li:not([style*="display: none"])').filter(function () {
            return /Save/i.test($(this).text());
        }).length != 0) {
            $($("#middle1").contents().find("#popupIframeRemodal").contents().find('li:not([style*="display: none"]) a').filter(function () {
                return /Save/i.test($(this).text());
            })).trigger('click');
        }        
    });

    function SaveAsPopup(){
        var newtransid=$("#txtTransid").val();
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        if (!regex.test(newtransid)) {
            alert("Invalid Name - Special characters not allowed.");
            return true;
        }

        var regex = new RegExp("^[0-9]+$");
        if (regex.test(newtransid.charAt(0))) {
            alert("Invalid Name - should not starts with number.");
            return true;
        }
        var newtstcaption=$("#txtCaption").val();
        if(newtstcaption=="")
        {
            alert("Enter Caption.");
            return true;
        }
        var hdnParam=$($("#middle1").contents().find("#hdnparamValues")).val();
        if(hdnParam.indexOf("newtstid~¿")>-1){
            hdnParam=hdnParam.replace("newtstid~¿","newtstid~"+newtransid+"¿");
            hdnParam=hdnParam.replace("newtstcaption~¿","newtstcaption~"+newtstcaption+"¿");
        }
        else{
            $.each(hdnParam.split("¿"),function(ind, el){
                if(el.startsWith("newtstid~"))
                    hdnParam=hdnParam.replace(el+"¿","newtstid~"+newtransid+"¿");
                else if( el.startsWith("newtstcaption~"))
                    hdnParam=hdnParam.replace(el+"¿","newtstcaption~"+newtstcaption+"¿");
            });
        }
        $($("#middle1").contents().find("#hdnparamValues")).val(hdnParam);
        $("#btnModalClose").click();
        $($("#middle1").contents().find("#btn_saveaststdef")).trigger('click');
    }

    function SaveAsIvPopup()
    {
        var newivname=$("#txtivname").val();
        if(newivname=="")
        {
            alert("Enter IView Name.");
            return true;
        }
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        if (!regex.test(newivname)) {
            alert("Special characters not allowed.");
            return true;
        }

        var regex = new RegExp("^[0-9]+$");
        if (regex.test(newivname.charAt(0))) {
            alert("Should not starts with number.");
            return true;
        }
        var newivcaption=$("#txtivcaption").val();
        if(newivcaption=="")
        {
            alert("Enter Caption.");
            return true;
        }

        $($("#middle1").contents().find("#newiname000F1")).val(newivname);
        document.getElementById("middle1").contentWindow.UpdateFieldArray("newiname000F1", "0", newivname, "parent", "");//SetFieldValue("newiname000F1",newivname);
        $($("#middle1").contents().find("#newicaption000F1")).val(newivcaption);
        document.getElementById("middle1").contentWindow.UpdateFieldArray("newicaption000F1", "0", newivcaption, "parent", "");

        $("#btnModalClose").click();
        $($("#middle1").contents().find("#actbtn_saveasivdef")).trigger('click');
    }

    function CloseSaveAsPopup(){
        $("#btnModalClose").click();
    }

    // appglobalvarsobject function //
    var appGlobalVarsObject = {};
    appGlobalVarsObject = new appGlobalObj();

    function appGlobalObj() {
        _this = this;
        this.lcm = lcm;
        this._CONSTANTS = new globalConstants();
        this.methods = {
            toggleCompressModeUI: function (element) {

                if (_this._CONSTANTS.compressedMode) {
                    element.addClass("compressedModeUI");
                    if (element.find('iframe').length > 0) {
                        $(element.find('iframe')).each(function (index, el) {
                            _this.methods.toggleCompressModeUI($(el.contentDocument.body));
                        });

                    }
                }
                else {
                    element.removeClass("compressedModeUI");
                    if (element.find('iframe').length > 0) {
                        $(element.find('iframe')).each(function (index, el) {
                            _this.methods.toggleCompressModeUI($(el.contentDocument.body));
                        });
                    }

                }
            }
        }
    }

    function globalConstants() {
        this.window = window;
        this.callerWindow = null;
        this.calledWindow = null;
        this.MALICIOUSNPUTDETECTED = "Invalid input detected, Please try again.";
        this.isHybrid = hybridGUID && hybridGUID != "" ? true : false;
        this.compressedMode = getCompressedMode();
        this.sessTimeOut = "SESSION_TIMEOUT";
    }

    function getCompressedMode() {
        var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
        if (window.localStorage.getItem("compressedMode-" + appUrl) != null && window.localStorage.getItem("compressedMode-" + appUrl) != undefined) {
            return JSON.parse(window.localStorage.getItem("compressedMode-" + appUrl));
        }
        else {
            return compressedMode;
        }
    }

    //Function to show the dimmer on the background.
    function ShowDimmer(status) {

        DimmerCalled = true;
        var dv = $j("#waitDiv");

        if (dv.length > 0 && dv != undefined) {
            if (status == true) {
                closeParentFrame();
                var currentfr = $j("#middle1", parent.document);
                if (currentfr) {
                    //  dv.height(currentfr.height());
                    dv.width(currentfr.width());
                }
                dv.show();
                document.onkeydown = function EatKeyPress() { return false; }
            }
            else {
                dv.hide();
                document.onkeydown = function EatKeyPress() { if (DimmerCalled == true) { return true; } }
            }
        }
        else {

            //TODO:Needs to be tested
            if (window.opener != undefined) {

                dv = $j("#waitDiv", window.opener.document);
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

    function SetFormDirty(status) {
        IsFormDirty = status;
        window.globalChange = status;
        if (typeof $("#middle1") != "undefined" && $("#middle1").attr("src").indexOf("tstruct.aspx") > -1 && tstAxpFileFlds == true) {
            tstAxpFileFlds = false;
            ASB.WebService.RemoveUnwantedAxpFiles();
        }
    }

    function loadFrame() {
        if (typeof $('#middle1')[0].contentWindow.ShowDimmer != "undefined") { $('#middle1')[0].contentWindow.ShowDimmer(false) };
        $.LoadingOverlay("show", { "fixedBackgroundSize": "135px", "zIndex": 99999999 });
    }

    function loadFrameOnline() {
        if (typeof $('#axpiframe')[0].contentWindow.ShowDimmer != "undefined") { $('#axpiframe')[0].contentWindow.ShowDimmer(false) };
        $.LoadingOverlay("show", { "fixedBackgroundSize": "135px", "zIndex": 99999999 });
    }

    function closeFrame() {
        $.LoadingOverlay("hide", true);
    }

    function loginToNodeAPI() {
        if (nodeApi) {
            //for getting nodeAccess token
            var settings = {
                "async": false,
                "crossDomain": true,
                "url": nodeApi + "login",
                "method": "POST",
                "headers": {
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "session_id": sid,
                    "utl": utl,
                    "username": mainUserName,
                    "appSKey": getAppSessionKey(),//appsessionKey,
                    "projName": mainProject,
                    "sPath": restdllPath
                }
            }

            $.ajax(settings).done(function (response) {
                if (response.status == true) {
                    const middle1Window = $('#middle1')[0].contentWindow;
                    if (middle1Window) {
                        const { isHomeLoadStatus } = middle1Window;
                        if (isHomeLoadStatus) {
                            resetLeftMenu();
                        }
                    }


                    nodeAccessToken = response.data.access_token || '';

                    //getAXUserPages(); //currently not showing user pages in dropdown @manikanta
                    //createPagesForUser({ calledFrom: "directLink" })
                    //debugger;
                    try {
                        $.ajax({
                            type: "POST",
                            url: "../WebService.asmx/SetNodeApineeds",
                            cache: false,
                            async: false,
                            contentType: "application/json;charset=utf-8",
                            data: JSON.stringify({ key: "nodeAccessToken", val: nodeAccessToken }),
                            dataType: "json",
                            success: function (data) {
                                '<%Session["nodeaccesstoken"] = "' + nodeAccessToken + '"; %>';
                            },
                        });
                    } catch (e) { }
            

                }
            
            }).fail(function (jqXHR, textStatus, errorThrown) {
                showAlertDialog("error", 1000, "client");
            });
        }
    }

    function ToggleShowLog(status) {
        var imgTrace = $("#imgTogTrace");
        var imgAlt = imgTrace.parent().find("input").is(":checked");
        if (!imgAlt) {
            imgTrace.attr("title", lcm[466]);
            status = "false";
        } else {
            status = "true";
            imgTrace.attr("title", lcm[465]);
        }
        try {
            ASB.WebService.UpdateTraceStatus(status, SuccessToggleTrace);
        } catch (exp) { }
    }

    function SuccessToggleTrace(result, eventArgs) {
        if (result != "done")
            showAlertDialog("error", result);
    }

    var traceWin;
    function OpenLogFile() {
        var na = "../aspx/OpenLogFile.aspx";
        traceWin = displayBootstrapModalDialog("Logged File", "", "", true, na, undefined, ()=>{
            /* Tempory Code changes for addform remodal */
            if(typeof AxConfigPage!="undefined" && AxConfigPage!="") {
                let sourceDetails = AxConfigPage.split("~");
                if(sourceDetails?.[0] == "addform") {
                    $("#divModalLoggedFile").css({"z-index" : "1000000"});
                }
            } 
        });
    }

    function ClosePopUps() {
        if (traceWin != null)
            traceWin.close();
        if (draftsWin != null && draftsWin != false)
            draftsWin.close();
        for (var k = 0; k < childWindowHandler.length; k++) {
            if (!childWindowHandler[k].closed) {
                childWindowHandler[k].close();
            }
        }
    }

    function showTraceFileDialog() {
        var modalExists = $('.modal').filter(".in").attr("data-confirm-leave") === "true";
        if (modalExists) {
            actionsClicked = "Trace File";
            iFrameId = $('.modal').filter(".in").attr("data-iframe-id");
            if (iFrameId != undefined)
                window.frames[iFrameId].contentWindow.ConfirmLeave();
        } else {
            OpenLogFile();
        }
        setTimeout(function () { removeUnclickableMenuCssClass() }, 100)
    }

    function getIvDefParamsNColumns(dwbIvDefName, transid, onColumnLoadRedirectUrl = "") {
        try {
            $.ajax({
                type: "POST",
                url: "dwb.aspx/getIvDefParamsNColumns",
                data: JSON.stringify({ dwbIvDefName, transid }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.d) {
                        if (data.d.transid == "ad_ic") {
                            var ivDatas = JSON.parse(data.d.result).sqlresultset.response.row;

                            if (typeof ivDatas.length == "undefined") {
                                ivDatas = [ivDatas];
                            }
                       
                            var rejson = callParentNew("ivColDesignJSON");
                            if (rejson) {
                                var olddata = rejson[dwbIvDefName];
                                if (olddata) {
                                    $.each(olddata, function (key, item) {
                                        let fromIndex = ivDatas.map(function (o) { return o.f_name; }).indexOf(olddata[key].name);

                                        if(fromIndex > -1){
                                            moveIndexArray("column", ivDatas, fromIndex, key, olddata[key].width, olddata[key].mergeid, olddata[key].mergename);
                                        }
                                    });
                                }
                            }

                            $("#leftSplitDivision").hide();

                            createIvDefColumnTable(ivDatas, dwbIvDefName);

                            if(onColumnLoadRedirectUrl){
                                if((tempRecordId = ivDatas?.[0]?.recordid) && findGetParameter("recordid", onColumnLoadRedirectUrl) == null){
                                    LoadIframeDwb(`tstruct.aspx?transid=${data.d.transid}&recordid=${tempRecordId}&captitle=${(findGetParameter("captitle", onColumnLoadRedirectUrl) || "")}`);
                                }else{
                                    LoadIframeDwb(onColumnLoadRedirectUrl);
                                }
                            }
                        }
                        else if (data.d.transid == "ad_ip") {
                            var paramData = JSON.parse(data.d.result).sqlresultset.response;

                            var ivDatas = [];

                            if(ivDatas = paramData?.row){
                                if (typeof ivDatas.length == "undefined") {
                                    ivDatas = [ivDatas];
                            }
                            }

                            ivParamsJSON = ivDatas;

                            if (ivParamsOrder && ivParamsOrder[dwbIvDefName]) {
                                var olddata = ivParamsOrder[dwbIvDefName];
                                if (olddata) {
                                    $.each(olddata, function (key, item) {
                                        let fromIndex = ivDatas.map(function (o) { return o.pname; }).indexOf(olddata[key].name);

                                        if(fromIndex > -1){
                                            moveIndexArray("param", ivDatas, fromIndex, key);
                                        }
                                    });
                                }
                            }

                            createIvDefParamTable(paramData, dwbIvDefName, data.d.transid);

                            if(onColumnLoadRedirectUrl){
                                if((tempRecordId = ivDatas?.[0]?.recordid) && findGetParameter("recordid", onColumnLoadRedirectUrl) == null){
                                    LoadIframeDwb(`tstruct.aspx?transid=${data.d.transid}&recordid=${tempRecordId}&captitle=${(findGetParameter("captitle", onColumnLoadRedirectUrl) || "")}`);
                                }else{
                                    LoadIframeDwb(onColumnLoadRedirectUrl);
                                }
                            }
                        }
                        else if (data.d.transid == "ad_sc") {
                            var paramData = JSON.parse(data.d.result).sqlresultset.response;

                            var ivDatas = [];

                            if(ivDatas = paramData?.row){
                                if (typeof ivDatas.length == "undefined") {
                                    ivDatas = [ivDatas];
                            }
                            }

                            createIvDefParamTable(paramData, dwbIvDefName, data.d.transid);

                            if(onColumnLoadRedirectUrl){
                                if((tempRecordId = ivDatas?.[0]?.recordid) && findGetParameter("recordid", onColumnLoadRedirectUrl) == null){
                                    LoadIframeDwb(`tstruct.aspx?transid=${data.d.transid}&recordid=${tempRecordId}&captitle=${(findGetParameter("captitle", onColumnLoadRedirectUrl) || "")}`);
                                }else{
                                    LoadIframeDwb(onColumnLoadRedirectUrl);
                                }
                            }
                        }

                        SetFormDirty(false);
                    }
                    else {
                        ShowDialog("error", data.d.result);
                        SetFormDirty(false);
                    }
                },
                error: function (error) {
                    ShowDialog("error", "Error");
                }
            });
        }
        catch (e) {
            ShowDialog("error", "Error");
        }
    }

        function moveIndexArray(tab, arr, fromIndex, toIndex, newWidth, newMergeId, newMergeName) {
            var element = arr[fromIndex];
            if (tab == "column") {
                element.column_width = newWidth;
                element.mergeid = newMergeId;
                element.mergename = newMergeName;
            }
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
        }

        function createIvDefParamTable(tabledata, dwbIvDefName, ivTabID) {
            // let ivTabID = $('#middle1')[0].contentWindow["transid"];
            $('#middle1')[0].contentWindow["transid"] = ivTabID;
            let ivTabName = ivTabID == "ad_ip" ? "Params" : "Script";
            $("#GridView2Wrapper").hide();
            $("#GridView1Wrapper").show();
            $("#GridView1Wrapper").empty();

            let ivTableHtml = "<a href=\"javascript:void(0)\" class=\"addParamBtn\" onclick=\"javascript:LoadIframeDwb('tstruct.aspx?act=open&amp;transid=" + ivTabID + "&amp;iname=" + dwbIvDefName + "')\"><span class=\"material-icons\">add</span></a><table class=\"table table-bordered ivTblParamScript " + ivTabName + "\"><thead><tr><th>";
            ivTableHtml += ivTabName + " Names</th></tr></thead><tbody></tbody></table>";
            $("#GridView1Wrapper").append(ivTableHtml);

            var tbody = $(".ivTblParamScript tbody").empty();
            if (tabledata != null && typeof tabledata.row != "undefined") {
                if (typeof tabledata.row.length == "undefined")
                    tabledata.row = [tabledata.row];
                $(tabledata.row).each(function (i, e) {
                    var dataRow = $(tbody[0].insertRow());
                    var cell = $("<td class = \"ui-draggable ui-draggable-handle\"></td>");
                    var cellHtml = "";
                    if (ivTabID == "ad_ip") {
                        cellHtml = "<span class=\"material-icons\">drag_indicator</span>";
                    }            
                    cellHtml += "<a class=\"ParamScriptCaption\" href=\"javascript:void(0)\" data-param-name=\"" + e.pname + "\"onclick=\"javascript:LoadIframeDwb('tstruct.aspx?transid=" + ivTabID + "&amp;recordid=" + e.recordid + "')\">" + e.pcaption + "</a>";
                    if (e.isqueryparam.toString().toLowerCase() == "f") {
                        cellHtml += `<button class="delParamBtn btn btn-secondary fa fa-trash" onclick="delNonQueryElem('${e.recordid}','${window.middle1.window.transid}','${dwbIvDefName}');return false;"></button>`
                    }
                    dataRow.append(cell.html(cellHtml));
                });
            }

            $(".ivTblParamScript.Params tbody").sortable({
                cursor: "move",
                update: function(event, ui) {
                    saveIvParamsOrder();
                }
            });
        }

        function createIvDefColumnTable(ivDatas, dwbIvDefName) {
            $("#GridView2Wrapper").show();
            $("#GridView1Wrapper").hide();

            if (typeof axDevIvDrawTable == "undefined") {
                loadAndCall({
                    files: {
                        css: [
                            "/ThirdParty/DataTables-1.10.13/media/css/jquery.dataTables.css",
                            "/ThirdParty/DataTables-1.10.13/extensions/Responsive/css/responsive.bootstrap.min.css",
                            "/ThirdParty/DataTables-1.10.13/extensions/FixedHeader/css/fixedHeader.dataTables.min.css"
                        ],
                        js: [
                            "/ThirdParty/lodash.min.js",
                            "/ThirdParty/DataTables-1.10.13/media/js/jquery.dataTables.js",
                            "/ThirdParty/DataTables-1.10.13/media/js/dataTables.bootstrap.js",
                            "/ThirdParty/DataTables-1.10.13/extensions/FixedHeader/js/dataTables.fixedHeader.js",
                            "/ThirdParty/DataTables-1.10.13/extensions/ColReorderWithResize/ColReorderWithResize.js",
                            "/ThirdParty/DataTables-1.10.13/extensions/Extras/moment.min.js",
                            "/ThirdParty/DataTables-1.10.13/extensions/Extras/datetime-moment.js",
                            "/Js/iviewColumnBuilder.min.js?v=14"
                        ]
                    },
                    callBack() {
                        axDevIvDrawTable(ivDatas, dwbIvDefName);
                    }
                });

            } else {
                axDevIvDrawTable(ivDatas, dwbIvDefName);
            }

        }

        function delNonQueryElem(recordid, transid, dwbIvDefName) {
            try {
                $.ajax({
                    type: "POST",
                    url: "dwb.aspx/delIvDefParamsNColumns",
                    data: JSON.stringify({ recordid, transid }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (data.d) {
                            recordid = data.d.recordid;
                            if (data.d.transid == "ad_ic") {
                                showAlertDialog("success", "Column deleted successfully");
                            }
                            else if (data.d.transid == "ad_ip") {
                                showAlertDialog("success", "Parameter deleted successfully");
                            }
                            else if (data.d.transid == "ad_sc") {
                                showAlertDialog("success", "Script deleted successfully");
                            }

                            getIvDefParamsNColumns(dwbIvDefName, data.d.transid, `tstruct.aspx?act=open&transid=${data.d.transid}&iname=${dwbIvDefName}`);
                    
                            SetFormDirty(false);
                        }
                        else {
                            ShowDialog("error", data.d);
                            SetFormDirty(false);
                        }
                    },
                    error: function (error) {
                        ShowDialog("error", error);
                    }
                });
            }
            catch (e) {
                ShowDialog("error", "Error");
            }
        }

        function ChangeDir(dir) {
            $("#form1").attr("dir", dir);
        }

        function DoUtilitiesEvent(type) {
            switch (type) {
                case "Download":
                    displayBootstrapModalDialog("Downloads", "lg", "300px", "1000px", "../aspx/DownloadAxpfastReport.aspx", !0);
                    break;
            }
        }

        function deleteStructureConfirmations(type, actionButtonId, hypData){
            let confirmTypeObj = {
                "deleteReport": {
                    content: "Do you want to delete the Report/Iview?",
                    confirm(){
                        $($("#middle1").contents().find("#" + actionButtonId)).trigger('click');
                        deleteStructureCB.close();
                    },
                    cancel(){
                        disableBackDrop('destroy');
                    }
                },
                "deleteField": {
                    content: "Do you want to delete the Field from the Form?",
                    confirm(){
                        if($("#middle1").contents().find(".toolbarRightMenu a[title='Remove']").length != 0 && actionButtonId=="btnadafRemove") {
                            $($("#middle1").contents().find(".toolbarRightMenu a[title='Remove']")).trigger('click');
                        }
                        else if($("#middle1").contents().find(".toolbarRightMenu a[title='uremove']").length != 0 && actionButtonId=="btnadafuremove") {
                            $($("#middle1").contents().find(".toolbarRightMenu a[title='uremove']")).trigger('click');
                            callParentNew("addedItemUpdated=", false);
                            callParentNew("addedItemRecordId=", "0");
                        }
                        else if ($("#middle1").contents().find("#" + actionButtonId).length != 0) { 
                            $($("#middle1").contents().find("#" + actionButtonId)).trigger('click');
                        }
                        else {
                            $($("#axpiframe").contents().find("#" + actionButtonId)).trigger('click');
                        }
                        deleteStructureCB.close();
                    },
                    cancel(){
                        disableBackDrop('destroy');
                    }
                },
                "deleteForm": {
                    //content: "Do you want to delete the Form/Tstruct?",
                    content:"These tables might be used by other transactions <br/>and deletion of tables may cause data loss.<br/>Do you want to delete tables?",
                    confirm(){
                        ////deleteStructureConfirmations("deleteDcs", actionButtonId);
                        //$($("#middle1").contents().find("#" + actionButtonId)).trigger('click');
                        //deleteStructureCB.close();
                        //LoadIframeDwb("ivtoivload.aspx?ivname=Formn");

                        deleteStructureConfirmations("deleteTables", actionButtonId);
                    },
                    cancel(){
                        disableBackDrop('destroy');
                    }
                },
                "deleteFormNew": {
                    //content: "Do you want to delete the Form/Tstruct?",
                    content:"These tables might be used by other transactions <br/>and deletion of tables may cause data loss.<br/>Do you want to delete tables?",
                    confirm(){
                        ////deleteStructureConfirmations("deleteDcs", actionButtonId);
                        //$($("#middle1").contents().find("#" + actionButtonId)).trigger('click');
                        //deleteStructureCB.close();
                        //LoadIframeDwb("ivtoivload.aspx?ivname=Formn");

                        deleteStructureConfirmations("deleteTablesNew", actionButtonId, hypData);
                    },
                    cancel(){
                        disableBackDrop('destroy');
                    }
                },
                "deleteTables":{
                    get content(){return GetDcTableInfo(type)},
                    confirm(){
                        if($j("input[class=fgHdrChk]:checked").length==0)
                        {
                            dwbTstDcTableDellst="";
                            $j("input[name=chkItem]:checkbox").each(function () {
                                if($j(this).is(":checked"))
                                    dwbTstDcTableDellst+= $j(this).attr("value")+",";
                            });
                            if(dwbTstDcTableDellst!="")
                                dwbTstDcTableDellst=dwbTstDcTableDellst.slice(0, -1);
                        }
                        $($("#middle1").contents().find("#" + actionButtonId)).trigger('click');
                        deleteStructureCB.close();
                        LoadIframeDwb("ivtoivload.aspx?ivname=Formn");
                    },
                    cancel(){
                        dwbTstDcTableDellst="";
                        disableBackDrop('destroy');
                    }
                },
                "deleteTablesNew":{
                    get content(){return GetDcTableInfo(type, hypData)},
                    confirm(){
                        if($j("input[class=fgHdrChk]:checked").length==0)
                        {
                            dwbTstDcTableDellst="";
                            $j("input[name=chkItem]:checkbox").each(function () {
                                if($j(this).is(":checked"))
                                    dwbTstDcTableDellst+= $j(this).attr("value")+",";
                            });
                            if(dwbTstDcTableDellst!="")
                                dwbTstDcTableDellst=dwbTstDcTableDellst.slice(0, -1);
                        }
                        // $($("#middle1").contents().find("#" + actionButtonId)).trigger('click');
                        $("#middle1")[0].contentWindow.callHLaction(actionButtonId, hypData?.rowno, "runtform");
                        deleteStructureCB.close();
                        // LoadIframeDwb("ivtoivload.aspx?ivname=Formn");
                        setTimeout(() => {
                            LoadIframeDwb('iview.aspx?ivname=runtform');
                        }, 0);
                    },
                    cancel(){
                        dwbTstDcTableDellst="";
                        disableBackDrop('destroy');
                    }
                }
            };

            var glType = gllangType;
            var isRTL = false;
            if (glType == "ar")
                isRTL = true;
            else
                isRTL = false;
            var deleteStructureCB = $.confirm({
                title:type==('deleteTables' || 'deleteTablesNew')?lcm[502]:lcm[155],
                onContentReady: function () {
                    disableBackDrop('bind');
                },
                backgroundDismiss: "false",
                rtl: isRTL,
                escapeKey: "cancel",
                content: confirmTypeObj[type].content,
                buttons: {
                    confirm: {
                        text: lcm[164],
                        btnClass: 'hotbtn',
                        action: confirmTypeObj[type].confirm
                    },
                    cancel: {
                        text: lcm[192],
                        btnClass: 'coldbtn',
                        action: confirmTypeObj[type].cancel
                    }
                }
            });
        }


        function GetDcTableInfo(type, hypData)
        {
            var htmlss="";
            if(type=="deleteTables" || type=="deleteTablesNew"){
                var stransId=(typeof $('#axpiframe')[0].contentWindow["stransid000F1"]=="undefined"?$("#axpiframe")[0].contentWindow.ntransid000F1?.value: $('#axpiframe')[0].contentWindow["stransid000F1"]?.value) || hypData?.ntransid || "";
                var tblList='';
                $.ajax({
                    type: "POST",
                    url: "../WebService.asmx/GetDcTableInfo",
                    cache: false,
                    async: false,
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ stransid: stransId }),
                    dataType: "json",
                    success: function (data) {
                        if (data.d != '')
                            tblList = data.d;
                    },
                });
                var tdList='';
                if(tblList!='')
                {
                    dwbTstDcTableDellst=tblList;
                    tblList.split(",").forEach(function(val){
                        tdList+="<tr><td><input type=\"checkbox\" checked=\"checked\" value=\""+val+"\" class=\"fgChk\" name=\"chkItem\" onclick=\"javascript:delTableHdrCheck(this);\"> "+val+"</td></tr>";
                    });            
                }
                else
                    dwbTstDcTableDellst="";
                htmlss="<div><div><table id=\"fldTable\" class=\"table\"><thead><tr><th><input type=\"checkbox\" checked=\"checked\" class=\"fgHdrChk\" onclick=\"javascript:delTableCheck(this);\"> Check Tablename to be deleted</th></tr></thead><tbody>"+tdList+"</tbody></table></div><div></div></div>";
            }
            return htmlss;
        }

        function delTableHdrCheck(obj, exprResult) {
            if ($j(".fgChk:visible").length == $j(".fgChk:checked").length)
                $j(".fgHdrChk").prop("checked", true);
            else
                $j(".fgHdrChk").prop("checked", false);
        }
        function delTableCheck(obj) {
            $j("input[name=chkItem]:checkbox").each(function () {
                $j(this).prop("checked", obj.checked);
            });
        }

        function updateAppSchema() {
            StructLoader("App Schema Update");
            try {
                ASB.WebService.UpdateAppSchema(SuccessAppSchema,OnAppSchemaException);
            } catch (exp) {
                HideStructLoader();
            }
        }

        function SuccessAppSchema(result, eventArgs) {
            if (result != "done")
                HideStructLoader();
        }
        function OnAppSchemaException(result) {
            HideStructLoader();
        }


        var interval=0;
        function StructLoader(strText) {
            $("#lbltext").text(strText);
            clearInterval(interval);
            $('#dynamic').css('width', '0%').attr('aria-valuenow', 0);
            $("#structLoaderblur").show();
            $('#axpiframe').contents().find('#myModal').removeClass("in");
            var current_progress = 0;        
            interval = setInterval(function() {
                current_progress += 5;
                $("#dynamic")
                .css("width", current_progress + "%")
                .attr("aria-valuenow", current_progress)
                .text(current_progress + "%");
                if (current_progress >= 100)
                    clearInterval(interval);
            }, 1000);
        }

        function HideStructLoader() {
            $("#structLoaderblur").hide();       
        }


        function saveIvParamsOrder() {
            var localIvParamsOrder = [];
            var ivpname = window.middle1.GetFieldValue("iname000F1");
            $.each($(".ivTblParamScript.Params tbody tr td a"), function (ind, ele) {
                var ParamOrd = {};
                ParamOrd["name"] = $(this).data("param-name");
                localIvParamsOrder.push(ParamOrd);
            });
            ivParamsOrder[ivpname] = localIvParamsOrder;
        }
