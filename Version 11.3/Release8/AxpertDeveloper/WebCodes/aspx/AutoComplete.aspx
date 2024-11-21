<%@ Page Language="C#" AutoEventWireup="true" CodeFile="AutoComplete.aspx.cs" Inherits="aspx_AutoComplete" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <meta charset="utf-8"/> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>    
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <script>
        if (!('from' in Array)) {
            // IE 11: Load Browser Polyfill
            document.write('<script src="../Js/polyfill.min.js"><\/script>');
        }
    </script>
    <script src="../Js/Jquery-2.2.2.min.js"></script>
    <script src="../AssetsNew/js/bootstrap.min.js" type="text/javascript"></script>
    <script>
        var $ = $j = jQuery.noConflict();
    </script>

    <%if (EnableOldTheme == "true")
        {%>
    <!-- <link href="../Css/genericOld.min.css" rel="stylesheet" type="text/css" id="generic" /> -->
    <%}
        else
        {%>
    <!-- <link href="../Css/generic.min.css?v=10" rel="stylesheet" type="text/css" id="Link1" /> -->
    <% }%>


    <!-- <link href="../Css/GridTable.min.css?v=1" rel="stylesheet" /> -->
    <script type="text/javascript" src="../Js/tstruct.min.js?v=392"></script>
    <script type="text/javascript" src="../Js/helper.min.js?v=115"></script>
    <script type="text/javascript" src="../Js/jsclient.min.js?v=38"></script>
    <script src="../Js/gen.min.js?v=13" type="text/javascript"></script>
    <link href="../AssetsNew/css/bootstrap.min.css" rel="stylesheet" />
    <!-- <link href="../Css/advSearch.min.css?v=7" rel="stylesheet" /> -->
    <link href="../Css/tstructNewUi.min.css?v=60" rel="stylesheet" />
    <link href="../App_Themes/Gray/Stylesheet.min.css?v=23" rel="stylesheet" />
    <link href="../ThirdParty/DataTables-1.10.13/media/css/jquery.dataTables.min.css" rel="stylesheet" />
    <link href="../ThirdParty/DataTables-1.10.13/media/css/dataTables.bootstrap.min.css" rel="stylesheet" />
    <%--<link id="themecss" type="text/css" href="" rel="stylesheet" />--%>
    <script src="../ThirdParty/DataTables-1.10.13/media/js/jquery.dataTables.min.js"></script>
    <script src="../ThirdParty/DataTables-1.10.13/media/js/dataTables.bootstrap.min.js"></script>

    <script src="../Js/advSearch.min.js?v=18" type="text/javascript"></script>
    <script src="../Js/common.min.js?v=88" type="text/javascript"></script>
    <script type="text/javascript">
        var IsFormDirty = false;
        var ChangedFields = new Array();
        var ChangedFieldValues = new Array();
        var DeletedDCRows = new Array();
        var fldNewNameArr = new Array();
        var fldNewDbRowNo = new Array();
        var fldNewValueArr = new Array();

        function loadParent(a) {
            var gov = document.getElementById("<%=searchlist.ClientID%>");
            var grviewpno = document.getElementById("<%=pgno.ClientID%>");
            var pno = parseInt(grviewpno.value)
            gov.selectedIndex = (pno * 10) + parseInt(a);
            var govlistval = "<%=searchlistval.ClientID%>";
            parent.isGrdEditDirty = true;
            SetSelectedValue(gov, govlistval);

        }
    </script>
</head>
<body dir="<%=direction%>" class="btextDir-<%=direction%>">
    <form id="form1" runat="server">
        <asp:HiddenField ID="fname" runat="server" />
        <span style="display: none">
            <asp:ListBox ID="searchlist" Visible="true" runat="server" Height="0px" Width="0px"
                AutoPostBack="True"></asp:ListBox>
            <asp:ListBox ID="searchlistval" Visible="true" runat="server" Height="0px" Width="0px"
                AutoPostBack="True"></asp:ListBox>
            <asp:ListBox ID="lstValues" Visible="true" runat="server" Height="0px" Width="0px"
                AutoPostBack="True"></asp:ListBox>

            <asp:TextBox ID="pgno" runat="server" Text="0" Visible="true" BorderStyle="None"
                ForeColor="white" Width="1" BackColor="white"></asp:TextBox>
        </span>

        <div id="main">
            <div class="col-sm-12">
                <div class="row titlerow" id="divTitle" runat="server"></div>
                <div class="row">
                    <div class="col-sm-12 col-md-12">
                        <div class="row feeddesgin">
                            <div class="col-sm-12">
                                <div class="row question">
                                    <div class="col-sm-12">
                                        <div class="btndrop">
                                            <div class="dropdown">
                                                <asp:DropDownList ID="ddlSearchFld" CssClass="btn btn-default dropdown-toggle search" runat="server" autofocus>
                                                </asp:DropDownList>
                                            </div>
                                        </div>

                                        <div class="btndrop" style="display: none;">
                                            <div class="dropdown">
                                                <asp:DropDownList ID="ddlDataType" CssClass="btn btn-default dropdown-toggle search" runat="server">
                                                </asp:DropDownList>
                                            </div>
                                        </div>

                                        <div class="condition">
                                            <div class="dropdown">
                                                <asp:DropDownList ID="ddlCondition" CssClass="btn btn-default dropdown-toggle search" runat="server">
                                                    <asp:ListItem Text="-- Select Condition --" Value=""></asp:ListItem>
                                                    <asp:ListItem Text="Equal To" Value="="></asp:ListItem>
                                                    <asp:ListItem Text="Not Equal To" Value="!="></asp:ListItem>
                                                    <asp:ListItem Text="Less Than" Value="<"></asp:ListItem>
                                                    <asp:ListItem Text="Less Than or Equal To" Value="<="></asp:ListItem>
                                                    <asp:ListItem Text="Greater Than" Value=">"></asp:ListItem>
                                                    <asp:ListItem Text="Greater Than or Equal To" Value=">="></asp:ListItem>
                                                    <%--<asp:ListItem Text="Between" Value="between"></asp:ListItem>--%>
                                                    <asp:ListItem Text="Starts With" Value="starts with"></asp:ListItem>
                                                    <asp:ListItem Text="Ends With" Value="ends with"></asp:ListItem>
                                                    <asp:ListItem Text="Contains" Value="contains"></asp:ListItem>
                                                </asp:DropDownList>
                                            </div>
                                        </div>

                                        <div class="condition">
                                            <div class="dropdown profile-pic">
                                                <asp:TextBox ID="txtfilter" runat="server" class="search form-control" placeholder="filter value" TabIndex=" 0"></asp:TextBox>
                                                <div class="edit">
                                                    <i class="glyphicon glyphicon-remove clearico" title="clear"></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="condition" id="txtfltbetween" style="display: none;">
                                            <div class="dropdown profile-pic">
                                                <asp:TextBox ID="txtfilter1" runat="server" class="search form-control" placeholder="filter value" TabIndex="0"></asp:TextBox>
                                                <div class="edit">
                                                    <i class="glyphicon glyphicon-remove clearico" title="clear"></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="btngoadv">
                                            <button type="button" runat="server" class="btn btn-default btn-sm filterico" title="filter" onclick="callserverbtn('btnsearch');" tabindex="0">
                                                <span class="glyphicon glyphicon-filter"></span>
                                            </button>

                                            <button type="button" class="btn btn-default btn-sm filterico" title="clear filter" onclick="callserverbtn('btnclear');" tabindex="0">
                                                <span class="glyphicon glyphicon-remove"></span>
                                            </button>


                                            <button type="button" runat="server" class="btn btn-default btn-sm filterico" id="btnPriv" title="previous" onclick="callserverbtn('btnprevi');" tabindex="0">
                                                <span class="glyphicon glyphicon-chevron-left glyphsetting" id="spanPriv" runat="server"></span>
                                            </button>
                                            <button type="button" runat="server" class="btn btn-default btn-sm filterico" id="btnNextclk" title="next" onclick="callserverbtn('btnnext');" tabindex="0">
                                                <span class="glyphicon glyphicon-chevron-right glyphsetting" id="spanNextclk" runat="server"></span>
                                            </button>

                                            <asp:Button runat="server" class="btn btn-default btn-sm filterico glyphicon glyphicon-filter" Style="display: none" ID="btnsearch" title="filter" OnClick="btnGo_Click" TabIndex="0"></asp:Button>
                                            <asp:Button runat="server" class="btn btn-default btn-sm filterico glyphicon glyphicon-filter" Style="display: none" ID="btnclear" title="filter" OnClick="btnClear_Click" TabIndex="0"></asp:Button>
                                            <asp:Button runat="server" class="btn btn-default btn-sm filterico glyphicon glyphicon-chevron-left glyphsetting" Style="display: none" ID="btnprevi" title="previous" OnClick="btnPriv_Click" TabIndex="0"></asp:Button>
                                            <asp:Button runat="server" class="btn btn-default btn-sm filterico glyphicon glyphicon-chevron-right glyphsetting" Style="display: none" ID="btnnext" title="next" OnClick="btnNext_Click" TabIndex="0"></asp:Button>

                                        </div>
                                    </div>
                                    <div class="col-sm-12">
                                        <div class="btnsearch">
                                            <div class="form-group profile-pic" id="dvSearch" runat="server">
                                                <asp:TextBox ID="txtSrchText" runat="server" class="search form-control" placeholder="search..."></asp:TextBox>
                                                <div class="nsearch">
                                                    <i class="glyphicon glyphicon-search" title="search"></i>
                                                </div>
                                                <div class="edit ">
                                                    <i class="glyphicon glyphicon-remove clearico" title="clear"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-sm-12">
                                        <asp:GridView ID="GridView1" runat="server" CellPadding="2" GridLines="Vertical" Style="margin-top: 10px;"
                                            Width="100%" AllowSorting="false" RowStyle-Wrap="false" AutoGenerateColumns="false"
                                            PageSize="50" CssClass="table table-striped table-bordered" OnRowDataBound="GridView1_RowDataBound">
                                            <HeaderStyle />
                                            <AlternatingRowStyle />
                                        </asp:GridView>
                                        <div id="dvFooter" runat="server">
                                            <p>
                                                <asp:Label ID="lblshow" runat="server" meta:resourcekey="lblshow">Showing</asp:Label>
                                                <asp:Label ID="lblstart" runat="server" Text=""></asp:Label>
                                                <asp:Label ID="lblto" runat="server" meta:resourcekey="lblto">to</asp:Label>
                                                <asp:Label ID="lblend" runat="server" Text=""></asp:Label>
                                                <asp:Label ID="lblof" runat="server" meta:resourcekey="lblof">of</asp:Label>
                                                <asp:Label ID="lbltotrec" runat="server" Text=""></asp:Label>
                                                <asp:Label ID="lblentries" runat="server" meta:resourcekey="lblentries">entries</asp:Label>
                                            </p>
                                        </div>

                                    </div>

                                    <div class="col-sm-12" id="progressArea" runat="server" visible="false">
                                        <div>
                                           <asp:Label ID="lblnodata" runat="server" meta:resourcekey="lblnodata"> No data found.</asp:Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</body>
</html>
