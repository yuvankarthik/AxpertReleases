<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ViewHistory.aspx.vb" Inherits="ViewHistory" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <meta charset="utf-8" />
    <meta name="description" content="Axpert View history"/>
    <meta name="keywords" content="Agile Cloud, Axpert,HMS,BIZAPP,ERP" />
    <meta name="author" content="Agile Labs" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <title>View History</title>
    <link href="../Css/globalStyles.min.css?v=36" rel="stylesheet" />
     <asp:PlaceHolder runat="server">
        <%:Scripts.Render("~/UI/axpertUI/bundleJs") %>
    </asp:PlaceHolder>
    <script src="../ThirdParty/jquery-confirm-master/jquery-confirm.min.js?v=2"></script>
    <script src="../Js/noConflict.min.js"></script>
    <script>
        if(typeof localStorage != "undefined"){
            var projUrl =  top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
            var lsTimeStamp = localStorage["customGlobalStylesExist-" + projUrl]
            if(lsTimeStamp && lsTimeStamp != "false"){
                var appProjName = localStorage["projInfo-" + projUrl] || "";
                var customGS = "<link id=\"customGlobalStyles\" data-proj=\""+ appProjName +"\" href=\"../"+ appProjName +"/customGlobalStyles.css?v="+ lsTimeStamp +"\" rel=\"stylesheet\" />";
                document.write(customGS);
            }
        }
    </script>
    <script>
        try {
            if (typeof localStorage != "undefined") {
                var projUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
                var lsTimeStamp = localStorage["axGlobalThemeStyle-" + projUrl]
                if (lsTimeStamp && lsTimeStamp != "false") {
                    var axThemeFldr = localStorage["axThemeFldr-" + projUrl] || "";
                    var axCustomStyle = "<link id=\"axGlobalThemeStyle\" data-themfld=\"" + axThemeFldr + "\" href=\"../" + axThemeFldr + "/axGlobalThemeStyle.css?v=" + lsTimeStamp + "\" rel=\"stylesheet\" />";
                    document.write(axCustomStyle);
                }
            }
        } catch (ex) { }
    </script>
    <script>
        if (!('from' in Array)) {
            // IE 11: Load Browser Polyfill
            document.write('<script src="../Js/polyfill.min.js"><\/script>');
        }
    </script>
    <script type="text/javascript">
        var IsViewHist = true
        $j(document).ready(function () {
           parent.ShowDimmer(false);
        });
    </script>
    <script src="../Js/common.min.js?v=144" type="text/javascript"></script>
</head>
<body>
    <form id="form1" runat="server" dir="<%=direction%>">
        <div>
            <asp:Label ID="lblErrMsg" runat="server" CssClass="erred"></asp:Label></div>

        <%=htmlText %>
    </form>
</body>
</html>
