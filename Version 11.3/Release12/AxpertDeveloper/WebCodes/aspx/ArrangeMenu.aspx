<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ArrangeMenu.aspx.cs" Inherits="aspx_ArrangeMenu" %>
<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8"/>
    <meta name="description" content="IView"/>
    <meta name="keywords" content="Agile Cloud, Axpert,HMS,BIZAPP,ERP"/>
    <meta name="author" content="Agile Labs"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <title>ArrangeMenu</title>
     <asp:PlaceHolder runat="server">
        <%:Styles.Render("~/Css/ArrangeMenu") %>
    </asp:PlaceHolder>
    <% if (direction == "rtl")
        { %>
    <link rel="stylesheet" href="../ThirdParty/bootstrap_rtl.min.css" type="text/css" />
    <% } %>
    <script>
        if (!('from' in Array)) {
            // IE 11: Load Browser Polyfill
            document.write('<script src="../Js/polyfill.min.js"><\/script>');
        }
    </script>    
    <script>
        var menuData = '<%=menuData%>';
    </script>
</head>
<body class="btextDir-<%=direction%>" dir="<%=direction%>">
    <form id="form1" runat="server">
         <asp:PlaceHolder runat="server">
            <%:Scripts.Render("~/Js/ArrangeMenuJS") %>
         </asp:PlaceHolder>
         <div class="amSearchWrapper">
            <div class="col-lg-5 col-md-5 col-sm-5 amSearchInput">
                <input id="amSearch" name="search" class="form-control" placeholder="Search..." autocomplete="off"/>           
                <button id="amResetSearch">
                    <span class="material-icons">clear</span>
                </button>
            </div>
            <div class="clearfix"></div>
        </div>
        <div id="arrangeMenu">
        </div>
        <div id="triggerPopover"></div>
        <div id="arngmnuFooter" class="hide">
            <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
            <ajaxToolkit:AsyncFileUpload runat="server" ID="uploadIcon" ClientIDMode="AutoID" OnUploadedComplete="uploadIcon_Click" OnClientUploadStarted="validateFile" OnClientUploadComplete="SetNodeIcon" onclientuploaderror="uploadError"></ajaxToolkit:AsyncFileUpload>
            <button type="button" id="lnkChngIcon" title="Change Icon" class="btn btn-default coldbtn">Change Icon</button>
            <button type="button" id="btnAdd" title="Add Folder" class="btn btn-default coldbtn">Add Folder</button>
            <button type="button" id="btnDelete" title="Delete" class="btn btn-default coldbtn">Delete</button>
            <button type="button" id="btnSave" title="Save" class="btn btn-default coldbtn">Save</button>
            <asp:HiddenField runat="server" ID="hdnUserIconList" />
            <asp:HiddenField runat="server" ID="hdnIconPath" />
        </div>       
        <div id='waitDiv'>
            <div id='backgroundDiv'>
            </div>
        </div>
    </form>
</body>
</html>
