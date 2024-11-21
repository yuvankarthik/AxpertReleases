<%@ Page Language="C#" AutoEventWireup="true" CodeFile="tstructhtml.aspx.cs" Inherits="tstructhtml" EnableEventValidation="false" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <meta charset="utf-8" />
    <meta name="description" content="File Upload" />
    <meta name="keywords" content="Agile Cloud, Axpert,HMS,BIZAPP,ERP" />
    <meta name="author" content="Agile Labs" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title>Custom HTML</title>
    <asp:PlaceHolder runat="server">
        <%:Styles.Render(direction == "ltr" ? "~/UI/axpertUI/ltrBundleCss" : "~/UI/axpertUI/rtlBundleCss") %>
    </asp:PlaceHolder>
    <link href="../ThirdParty/jquery-confirm-master/jquery-confirm.min.css?v=1" rel="stylesheet" />
    <script>
        if (typeof localStorage != "undefined") {
            var projUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
            var lsTimeStamp = localStorage["customGlobalStylesExist-" + projUrl]
            if (lsTimeStamp && lsTimeStamp != "false") {
                var appProjName = localStorage["projInfo-" + projUrl] || "";
                var customGS = "<link id=\"customGlobalStyles\" data-proj=\"" + appProjName + "\" href=\"../" + appProjName + "/customGlobalStyles.css?v=" + lsTimeStamp + "\" rel=\"stylesheet\" />";
                document.write(customGS);
            }
        }
        if (!('from' in Array)) {
            // IE 11: Load Browser Polyfill
            document.write('<script src="../Js/polyfill.min.js"><\/script>');
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
</head>
<body dir='<%=direction%>'>
    <form id="form1" runat="server" enctype="multipart/form-data">
        <asp:PlaceHolder runat="server">
            <%:Scripts.Render("~/UI/axpertUI/bundleJs") %>
        </asp:PlaceHolder>
        <div class="bodytsthtml d-flex mb-3">
            <div class="col-sm-12 col-md-6 px-2">
                <label class="form-label">HTML</label>
                <textarea name="currenttstHtml" id="currenttstHtml" runat="server" class="form-control resize-none mh-100 h-md-450px" readonly></textarea>
            </div>
            <div class="col-sm-12 col-md-6 px-2">
                <label class="form-label">Custom HTML</label>
                <textarea name="customHtml" id="customHtml" runat="server" class="form-control resize-none mh-100 h-md-450px"></textarea>
            </div>
        </div>
        <div class="d-flex mb-3">
            <div class="footertsthtml ms-auto">
                <input class="btn btn-sm btn-primary me-2" type="button" id="btnSaveHtml" title="Ok" name="Ok" value="Ok" onclick="saveTsthtml();" />
                <input name="close" type="button" id="close" value="Close" title="Close" class="btn btn-sm btn-white btn-active-light-primary shadow-sm me-2" onclick="closeUploadDialog();" />
            </div>
        </div>

        <script type="text/javascript" src="../Js/thirdparty/jquery-ui/jquery-ui.min.js"></script>
        <script type="text/javascript" src="../Js/noConflict.min.js?v=1"></script>
        <script type="text/javascript" src="../ThirdParty/jquery-confirm-master/jquery-confirm.min.js?v=2"></script>
        <script type="text/javascript" src="../Js/alerts.min.js?v=32"></script>
        <script type="text/javascript" src="../Js/common.min.js?v=145"></script>
        <script type="text/javascript">
            $(document).ready(function () {
                try {
                    var CustHTML = callParentNew("tstructCustomHTML");
                    $("#currenttstHtml").val(CustHTML);
                    callParentNew("ShowDimmer(false)", "function")
                } catch (error) {
                    showAlertDialog("warning", error.message);
                    callParentNew("ShowDimmer(false)", "function")
                }
            });
            function closeUploadDialog() {
                (callParentNew("tstCustomHtml", "id")).dispatchEvent(new CustomEvent("close"));
            }
            function saveTsthtml() {
                let customHtml = $("#customHtml").val();
                let ttransId = callParentNew("transid");
                let tstCaption = callParentNew("tstructCaption");
                if (customHtml != "") {
                    $.ajax({
                        url: 'tstructhtml.aspx/TstructSaveHtml',
                        type: 'POST',
                        cache: false,
                        async: true,
                        data: JSON.stringify({
                            transId: ttransId, tstCaption: tstCaption, strInput: customHtml
                        }),
                        dataType: 'json',
                        contentType: "application/json",
                        success: function (data) {
                            if (data.d != "") {
                                let saveMsg = data.d.split("*$*");
                                if (JSON.parse(saveMsg[1]).result == "error") {
                                    showAlertDialog("error", JSON.parse(saveMsg[0]).message);
                                }
                                else if (JSON.parse(saveMsg[2]).result[0].save == "success") {
                                    showAlertDialog("success", "Custom HTML saved successfully");
                                }
                                else
                                    showAlertDialog("warning", "Custom HTML not saved successfully!");
                            }
                        }, error: function (error) {
                            showAlertDialog("error", error);
                        }
                    })
                }
                else
                    showAlertDialog("error", "Custom HTML should not allow empty value!");
            }
        </script>
    </form>
</body>
</html>
