<%@ Page Language="VB" AutoEventWireup="false" CodeFile="cpwd.aspx.vb" Inherits="cpwd" %>

<!DOCTYPE html>
<html>

<head runat="server">
    <meta charset="utf-8" />
    <meta name="description" content="Axpert Tstruct" />
    <meta name="keywords" content="Agile Cloud, Axpert,HMS,BIZAPP,ERP" />
    <meta name="author" content="Agile Labs" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title>Change Password</title>
    <script>
        if (!('from' in Array)) {
            // IE 11: Load Browser Polyfill
            document.write('<script src="../Js/polyfill.min.js"><\/script>');
        }
    </script>
    <script src="../Js/thirdparty/jquery/3.1.1/jquery.min.js" type="text/javascript"></script>
    <script src="../Js/noConflict.min.js?v=1" type="text/javascript"></script>
    <%--custom alerts start--%>
    <link href="../Css/animate.min.css" rel="stylesheet" />
    <script src="../Js/alerts.min.js?v=30" type="text/javascript"></script>
    <link href="../ThirdParty/jquery-confirm-master/jquery-confirm.min.css?v=1" rel="stylesheet" />
    <script src="../ThirdParty/jquery-confirm-master/jquery-confirm.min.js?v=2" type="text/javascript"></script>
    <%--custom alerts end--%>
    <script src="../Js/md5.min.js" type="text/javascript"></script>
    <script src="../Js/user.min.js?v=15" type="text/javascript"></script>
    <script src="../Js/adjustwindow.min.js?v=1" type="text/javascript"></script>
    <script src="../newPopups/axpertPopup.min.js?v=45"></script>
    <script src="../Js/gen.min.js?v=13" type="text/javascript"></script>
    <script src="../Js/helper.min.js?v=115" type="text/javascript"></script>
    <script src="../Js/messagebox.min.js?v=1" type="text/javascript"></script>
    <script src="../Js/cpwd.min.js?v=15" type="text/javascript"></script>
    <script src="../Js/common.min.js?v=88" type="text/javascript"></script>
    <script type="text/javascript" src="../Js/lang/content-<%=langType%>.js?v=43"></script>
    <%--<link href="../Css/messagebox.min.css" rel="stylesheet" type="text/css" />--%>

    <link href="../Css/thirdparty/bootstrap/3.3.6/bootstrap.min.css" rel="stylesheet" />
    <link href="../Css/thirdparty/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" />
    <link href="../Css/globalStyles.min.css?v=35" rel="stylesheet" />

    <link href="../Css/thirdparty/jquery-ui/1.12.1/jquery-ui.min.css" rel="stylesheet" />
    <link href="../Css/thirdparty/jquery-ui/1.12.1/jquery-ui.structure.min.css" rel="stylesheet" />
    <link href="../Css/thirdparty/jquery-ui/1.12.1/jquery-ui.theme.min.css" rel="stylesheet" />
    <%--<link href="../Css/jQuery/jquery.ui.theme.css" rel="stylesheet" type="text/css" />--%>
    <%--<link href="../Css/generic.min.css?v=10" rel="stylesheet" type="text/css" />--%>
    <%--<link href="../Css/button.min.css" rel="stylesheet" />--%>
    <link href="../Css/Icons/icon.min.css" rel="stylesheet" type="text/css" />
    <%--<link href="../Css/globalStyles.min.css?v=35" rel="stylesheet" />--%>
    <%--<link id="themecss" type="text/css" rel="Stylesheet" href="" /> --%>
    <link href="../Css/login.min.css?v=18" rel="stylesheet" />
    <script type="text/javascript">
        var cpwdRemark = "";
        var diFileInfo = '<%=strFileinfo%>';
        $(document).ready(function () {
            <%If (Request.QueryString("remark") <> Nothing) Then%>
            cpwdRemark = "<%=Request.QueryString("remark")%>";
            <%End If%>
            if (isMobileDevice()) {
                let custommoblogoexist = false;
                if (diFileInfo != "") {
                    $j("#main_body").removeAttr("style");
                    var imageUrl = "./../images/Custom/" + diFileInfo;
                    $j("#main_body").css({ "background-image": "url(" + imageUrl + ")", "background-size": "cover", "height": "100vh" });
                    custommoblogoexist = true;
                }
                if (custommoblogoexist == false) {
                    $j("#main_body").removeAttr("style");
                    var imageUrl = "./../AxpImages/login-img.png";
                    $j("#main_body").css({ "background-image": "url(" + imageUrl + ")", "background-size": "cover", "height": "100vh" });
                }
            }
        })
        var transid = 'pwda';
        var recordid = 0;
        var fldnameArr = new Array();
        var expr = new Array();
        var formcontrols = new Array();
        var patternName = new Array();
        var pattern = new Array();
        var AllowEmpty = new Array();
        var fNames = new Array();
        var gllangType = '<%=langType%>';
        fNames[0] = "uname";
        fNames[1] = "cepwd";
        fNames[2] = "epwd";
        fNames[3] = "pwd";
        fNames[4] = "cpwd";
        fNames[5] = "encpwd";
        var patterns = new Array();
        var isCloudApp = '<%=isCloudApp%>';
        <%If (remark <> "chpwd") Then %>
        var errorEnable = false;
        <%End If %>
    </script>
</head>
<%
    Dim xHtm As String
    Dim user As String
    Dim sid As String
    user = Session("user")


    sid = Session("nsessionid")
    xHtm = "<Script type='text/javascript'>"
    xHtm = xHtm & "function b() { a = '" & Session("project") & "';ba='" & user & "';c='pwda';d='" & sid & "';e = '" & Session("AxRole") & "'; f='" & Session("trace") & "';SetTstProps(a,ba,c,d,e,f);}"
    xHtm = xHtm & "</script>"
    Response.Write(xHtm)
%>
<body id="main_body" runat="server">
    <%If remark <> "chpwd" %>
    <video id="bgvid" runat="server" playsinline="" autoplay="" muted="" loop="">
        <source src="" type="video/mp4" id="bgvidsource" runat="server">
    </video>
    <%End If %>
    <%If remark <> "chpwd" %>
    <div class="login">
        <div class="login-main">
            <div class="center-view">
                <div class="content">
                    <%End If %>
                    <div class="Family btextDir-<%=direction%>" dir="<%=direction%>">
                        <div <% If (remark <> "chpwd") Then%> class="content vertical-align" <%End If%>>
                            <form id="form1" runat="server" class="Pagebody" dir="<%=direction%>">
                                <div>
                                    <asp:ScriptManager ID="ScriptManager1" runat="server">
                                        <Scripts>
                                            <asp:ScriptReference Path="../Js/gen.min.js?v=13" />
                                            <asp:ScriptReference Path="../Js/tstruct.min.js?v=391" />
                                        </Scripts>
                                        <Services>
                                            <asp:ServiceReference Path="../WebService.asmx" />
                                        </Services>
                                    </asp:ScriptManager>
                                </div>

                                <%If (remark = "chpwd") Then%>
                                <div id="dvMainPwd" runat="server">
                                    <div id="breadcrumb-panel">
                                        <div id='breadcrumb' class='icon-services left'>
                                            <div class='icon-services left bcrumb pd10'>
                                            </div>
                                        </div>
                                        <div id='icons' class="right" runat="server">
                                            <asp:ImageButton runat="server" AlternateText="Save" ID="btnSubmit" OnClientClick="javascript:return ValidatePassword(this);"
                                                ImageUrl="../AxpImages/save.png" />
                                            &nbsp;&nbsp;
                                        </div>
                                    </div>
                                </div>
                                <%End If%>
                                <div>
                                    <div>
                                        <%If remark <> "chpwd" %>
                                        <div class="login-wrapper">
                                            <div class="card login-inner">
                                                <%End If%>

                                                <%If (remark <> "chpwd") Then %>
                                                <h2 class="form-title">
                                                    <img src="../images/loginlogo.png">
                                                    <span id="spnCpwdHeading"></span>
                                                </h2>
                                                <div id="dvMgs">
                                                    <% If (remark = "1") Then%>
                                                    <asp:Label ID="lbllogging" runat="server" meta:resourcekey="lbllogging">
                            You are logging in for the first time. You need to change the password.
                                                    </asp:Label>
                                                    <%ElseIf (remark = "2") Then%>
                                                    <asp:Label ID="lblpwdexp" runat="server" meta:resourcekey="lblpwdexp">
                            Your password is expired. You need to change the password.
                                                    </asp:Label>
                                                    <%ElseIf (remark = "3") Then%>
                                                    <asp:Label ID="lblpwdreset" runat="server" meta:resourcekey="lblpwdreset">
                            Your password has been reset. You need to change your password.
                                                    </asp:Label>
                                                    <%End If%>
                                                </div>
                                                <%End If %>

                                                <div class="<%If (remark = "chpwd") %>chpwd-position <%Else %> firsttime-chpwd-position <%End If %> form-horizontal">
                                                    <div id="dvCp">
                                                        <div>
                                                            <input type="hidden" name="recordid000F0" value="0" />
                                                            <input type="hidden" name="html_transid000F0" value="pwda" /><input type="hidden"
                                                                name="rn000F0" value="<%=Session("user")%>" />
                                                        </div>
                                                        <div class="control-group" id="Epwddiv">
                                                            <%If (remark = "chpwd") Then %>
                                                            <asp:Label ID="lblexistingpwd" runat="server" meta:resourcekey="lblexistingpwd" class="control-label col-lg-5" for="email">Existing Password<span class="allowempty">* </span></asp:Label>
                                                            <%End If %>
                                                            <div class="<%If Not (remark = "chpwd") %> controls field-wrapper <%Else %> col-lg-7 <%End If %>">
                                                                <%If remark <> "chpwd" %>
                                                                <div class="input-icon left">
                                                                    <%End If %>
                                                                    <%--<%If not (remark = "chpwd") Then %>
                                    <span class="fa fa-lock fpwdlock"></span>
                                            <%End If %>--%>
                                                                    <input id="existingPwd" type="password" value="" name="swe000F0"
                                                                        onfocus="this.value=this.value;" class="tem Family form-control <%If Not (remark = "chpwd") %> border-left <%End If %>" onblur="document.getElementById('swee000F0').value=(this.value);" autofocus autocomplete="off">
                                                                    <input type="hidden" runat="server" name="swee000F0" id="swee000F0" value="" />
                                                                    <%If remark <> "chpwd" %>
                                                                <div class="field-placeholder">
                                                                    <asp:Label ID="Label1" runat="server" meta:resourcekey="lblexistingpwd" class="control-label col-lg-5" for="email">Existing Password<span class="allowempty">* </span></asp:Label>
                                                                    <%End If %>
                                                                    <%If remark <> "chpwd" %>
                                                                </div></div>
                                                                <%End If %>
                                                            </div>
                                                        </div>
                                                        <div class="control-group" id="Npwddiv">
                                                            <%If (remark = "chpwd") Then %>
                                                            <asp:Label ID="lblnewpwd" runat="server" meta:resourcekey="lblnewpwd" class="control-label col-lg-5" for="email">New Password<span class="allowempty">* </span></asp:Label>
                                                            <%End If %>
                                                            <div class="<%If Not (remark = "chpwd") %> controls field-wrapper <%Else %> col-lg-7 <%End If %>">
                                                                <%If remark <> "chpwd" %>
                                                                <div class="input-icon left">
                                                                    <%End If %>
                                                                    <%--<%If not (remark = "chpwd") Then %>
                                    <span class="fa fa-lock fpwdlock"></span>
                                        <%End If %>--%>
                                                                    <input id="newPwd" type="password" value="" name="swn" onfocus="this.value = this.value;"
                                                                        class="tem Family form-control <%If Not (remark = "chpwd") %> border-left <%End If %>" onblur="document.getElementById('sw000F0').value=md5authNew(this.value);" autocomplete="off" />
                                                                    <input runat="server" type="hidden" id="pwdlength" name="swlength" value="" />
                                                                    <input runat="server" type="hidden" id="sw000F0" name="sw000F0" value="" />
                                                                    <%If remark <> "chpwd" %>
                                                                <div class="field-placeholder">
                                                                    <asp:Label ID="Label2" runat="server" meta:resourcekey="lblnewpwd" class="control-label col-lg-5" for="email">New Password<span class="allowempty">* </span></asp:Label>
                                                                    <%End If %>
                                                                    <%If remark <> "chpwd" %>
                                                                </div></div>
                                                                <%End If %>
                                                            </div>
                                                        </div>
                                                        <div class="control-group" id="Region">
                                                            <%If (remark = "chpwd") Then %>
                                                            <asp:Label ID="lblconfirmpwd" runat="server" meta:resourcekey="lblconfirmpwd" class="control-label col-lg-5" for="email">Confirm Password<span class="allowempty">* </span></asp:Label>
                                                            <%End If %>
                                                            <div class="<%If Not (remark = "chpwd") %> controls field-wrapper <%Else %> col-lg-7 <%End If %>">
                                                                <%If remark <> "chpwd" %>
                                                                <div class="input-icon left">
                                                                    <%End If %>
                                                                    <%--<%If not (remark = "chpwd") Then %>
                                    <span class="fa fa-lock fpwdlock"></span>
                                    <%End If %>--%>
                                                                    <input id="confirmPwd" type="password" value="" name="swc" onblur="document.getElementById('swc000F0').value=md5authNew(this.value);" onfocus="this.value=this.value;"
                                                                        class="tem Family form-control <%If Not (remark = "chpwd") %> border-left <%End If %>" autocomplete="off">
                                                                    <input runat="server" type="hidden" name="swc000F0" id="swc000F0" value="" />
                                                                    <input runat="server" type="hidden" name="npwdHidden" id="npwdHidden" value="" />
                                                                    <%If remark <> "chpwd" %>
                                                                <div class="field-placeholder">
                                                                    <asp:Label ID="Label3" runat="server" meta:resourcekey="lblconfirmpwd" class="control-label col-lg-5" for="email">Confirm Password<span class="allowempty">* </span></asp:Label>
                                                                    <%End If %>
                                                                    <%If remark <> "chpwd" %>
                                                                </div></div>
                                                                <%End If %>
                                                            </div>
                                                        </div>
                                                        <div class="form-actions">
                                                            <asp:Button runat="server" ID="btnSumit" OnClientClick="javascript:return ValidatePassword(this);"
                                                                Text="" CssClass="hotbtn btn" OnClick="btnSubmit_Click" title="Save" />
                                                            <% If (remark = "chpwd") Then%>
                                                            <button type="button" class="coldbtn btn" onclick="parent.closeModalDialog()" id="btnClose" title="Cancel">Cancel</button>
                                                            <%End If %>
                                                        </div>
                                                        <% If (remark <> "chpwd") Then%>
                                                        <div class="copyrightlabs">
                                                        <div class="col-lg-12">
                                                            <span><span id="axpertVer" runat="server"></span></span>
                                                        </div>
                                                        <div class="clearfix"></div>
                                                            </div>
                                                        <%End If %>
                                                    </div>
                                                </div>
                                                <%If remark <> "chpwd" %>
                                            </div>
                                        </div>
                                        <%End If%>
                                    </div>
                                </div>
                                <div id="wBdr" class="wBdr">
                                    <div id="tabbody1" class="dcContent" runat="server">
                                        <div id="tab-body-new:1" class="dcContent">
                                            <div id="1">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--end-->
                                <%If Request.Browser.Browser = "Firefox" Then%>
                                <script type="text/javascript">        b();</script>
                                <%End If%>
                            </form>
                        </div>
                    </div>
                    <%If remark <> "chpwd" %>
                </div>
            </div>
        </div>
    </div>
    <%End If %>
</body>
</html>
