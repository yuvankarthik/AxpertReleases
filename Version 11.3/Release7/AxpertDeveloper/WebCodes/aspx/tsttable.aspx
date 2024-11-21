<%@ Page Language="C#" AutoEventWireup="true" CodeFile="tsttable.aspx.cs" Inherits="tsttable" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">

    <meta charset="utf-8" />
    <meta name="description" content="Table" />
    <meta name="keywords" content="Agile Cloud, Axpert,HMS,BIZAPP,ERP" />
    <meta name="author" content="Agile Labs" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Table</title>

    <%--<link href="../Css/generic.min.css?v=10" rel="stylesheet" type="text/css" id="generic" />--%>
    <link href="../Css/thirdparty/bootstrap/3.3.6/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="../ThirdParty/gridstack.js-0.3.0/dist/gridstack.css" rel="stylesheet" type="text/css" />
    <link href="../Css/thirdparty/jquery-ui/1.12.1/jquery-ui.min.css" rel="stylesheet" type="text/css" />
    <link href="../Css/thirdparty/jquery-ui/1.12.1/jquery-ui.structure.min.css" rel="stylesheet" type="text/css" />
    <link href="../Css/thirdparty/jquery-ui/1.12.1/jquery-ui.theme.min.css" rel="stylesheet" type="text/css" />
    <link href="../ThirdParty/jquery-confirm-master/jquery-confirm.min.css" rel="stylesheet" type="text/css" />
    <link href="../ThirdParty/DataTables-1.10.13/media/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="../Css/Icons/icon.css" rel="stylesheet" type="text/css" />
    <link href="../Css/thirdparty/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <link href="../ThirdParty/codemirror/codemirror.css" rel="stylesheet" type="text/css" />
    <link href="../Css/jquery-ui-timepicker-addon.min.css" rel="stylesheet" type="text/css" />
    <link href="../Js/jquery.timeentry.package/jquery.timeentry.css" rel="stylesheet" type="text/css" />
    <link href="../Css/globalStyles.min.css?v=35" rel="stylesheet" type="text/css" />
    <link href="../Css/wizardComp.min.css?v=17" rel="stylesheet" type="text/css" />
    <link href="../css/ExportNew.min.css?v=32" rel="stylesheet" type="text/css" />
    <link href="../Css/import.min.css?v=30" rel="stylesheet" type="text/css" />
    <link href="../Css/responsibilties.min.css?v=10" rel="stylesheet" type="text/css" />
    <link href="../Css/propSheet.min.css?v=3" rel="stylesheet" type="text/css" />
    <link href="../Css/msgBoxLight.css" rel="stylesheet" type="text/css" />
    <link href="../Css/tstructNewUi.min.css?v=60" rel="stylesheet" type="text/css" />
    <link href="../Css/animate.min.css" rel="stylesheet" type="text/css" />
    <link href="../ThirdParty/bootstrap-tokenfield/dist/css/bootstrap-tokenfield.min.css" rel="stylesheet" type="text/css" />
    <link href="../newPopups/Remodal/remodal-default-theme.min.css" rel="stylesheet" type="text/css" />
    <link href="../newPopups/Remodal/remodal.min.css" rel="stylesheet" type="text/css" />
    <link href="../Css/axpertPopup.min.css?v=22" rel="stylesheet" type="text/css" />
    <script>
        if (!('from' in Array)) {
            // IE 11: Load Browser Polyfill
            document.write('<script src="../Js/polyfill.min.js"><\/script>');
        }
    </script>
    <script type="text/javascript">
        var FetchPickListRows = 1000;
    </script>
    <script src="../Js/thirdparty/jquery/3.1.1/jquery.min.js"></script>
    <script src="../ThirdParty/DataTables-1.10.13/media/js/jquery.dataTables.min.js"></script>
    <script src="../ThirdParty/DataTables-1.10.13/media/js/dataTables.bootstrap.min.js"></script>
    <script src="../Js/jquery.browser.min.js"></script>
    <script src="../Js/printjs.min.js"></script>
    <script src="../ThirdParty/jquery-confirm-master/jquery-confirm.min.js"></script>
    <script src="../Js/noConflict.min.js"></script>
    <script type="text/javascript" src="../Js/iFrameHandler.min.js"></script>
    <script src="../Js/propSheet.min.js"></script>
    <script src="../Js/jquery.timeentry.package/jquery.timeentry.min.js"></script>
    <script src="../Js/alerts.min.js?v=30"></script>
    <script src="../Js/jQueryUi/jquery.tablesorter.min.js"></script>
    <script src="../ThirdParty/bootstrap-tokenfield/dist/bootstrap-tokenfield.min.js"></script>
    <script src="../Js/common.min.js?v=88"></script>
    <script src="../Js/ckeditor/ckeditor.js?v=1"></script>
    <script src="../Js/ckRtf.js"></script>
    <script src="../Js/JDate.min.js"></script>
    <script src="../Js/thirdparty/bootstrap/3.3.6/bootstrap.min.js"></script>
    <script src="../Js/thirdparty/jquery-ui/jquery-ui-autoCom/jquery-ui-autoCom.min.js"></script>
    <script src="../Js/jquery-ui-timepicker-addon.min.js"></script>
    <script src="../ThirdParty/lodash.min.js"></script>
    <script src="../ThirdParty/gridstack.js-0.3.0/dist/gridstack.js"></script>
    <script src="../ThirdParty/gridstack.js-0.3.0/dist/gridstack.jQueryUI.js"></script>
    <script src="../Js/jquery.msgBox.min.js"></script>
    <script src="../Js/jQueryUi/jquery.scrollabletab.min.js"></script>
    <script src="../Js/tstructvars.min.js?v=58"></script>
    <script src="../Js/md5.min.js"></script>
    <script src="../Js/adjustwindow.js"></script>
    <script src="../Js/wizardComp.js"></script>
    <script src="../Js/tstruct.min.js?v=391"></script>
    <script src="../Js/util.min.js"></script>
    <script src="../Js/tstruct-pdf.min.js"></script>
    <script src="../newPopups/Remodal/remodal.min.js"></script>
    <script src="../newPopups/axpertPopup.min.js?v=45"></script>
    <script src="../Js/handlebars.min.js?v=1"></script>
    <script src="../Js/tstTable.min.js?v=12"></script>
</head>
<body>
    <form id="form1" runat="server">
        <div id="divTable">
        </div>
        <asp:HiddenField ID="hdnfieldId" Value="" runat="server" />
    </form>
</body>
</html>
