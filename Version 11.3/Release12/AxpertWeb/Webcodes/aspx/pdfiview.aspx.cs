using iTextSharp.text.pdf;
using iTextSharp.text;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Saml;
using System.Xml.Linq;
using Word.W2004.Style;
using Microsoft.VisualBasic;

public partial class pdfiview : System.Web.UI.Page
{
    private string _xmlString = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
    private LogFile.Log logobj = new LogFile.Log();
    private Util.Util util = new Util.Util();
    private ArrayList colHide = new ArrayList();
    private ArrayList colFld = new ArrayList();
    private ArrayList colWidth = new ArrayList();
    private ArrayList colHead = new ArrayList();
    private ArrayList ivhead = new ArrayList();
    private ArrayList arrLstParams = new ArrayList();
    private ArrayList arrLstParamVal = new ArrayList();
    private string iname;
    private string user;
    private string sid;
    private string ivtype;
    private string proj;
    private string paramVal;
    private string iViewCap;
    private string paramXml = "";
    private string typeIvOrLv = string.Empty;
    private string curRecord = string.Empty;
    private bool hideProjeName = false;
    private ArrayList pivotGroupHeaderNames = new ArrayList();
    private ArrayList pivotStartCol = new ArrayList();
    private ArrayList pivotEndCol = new ArrayList();
    private ArrayList htmlColumns = new ArrayList();
    IviewData objIview = new IviewData();
    public StringBuilder sb = new StringBuilder();

    ArrayList hdrFont = new ArrayList();
    ArrayList hdrAlign = new ArrayList();

    ArrayList hdrFooterName = new ArrayList();
    ArrayList hdrFooterAlign = new ArrayList();
    ArrayList hdrFooterFont = new ArrayList();
    protected void Page_Load(object sender, System.EventArgs e)
    {
        if (Session["project"].ToString() == "")
            sess_expires();
        else
        {
            if (Request.UrlReferrer != null)
            {
            }
            string Ikey = string.Empty;
            if (Request.QueryString["ivKey"] != null)
                Ikey = Request.QueryString["ivKey"];
            if (!IsPostBack)
            {
                iname = Request.QueryString["ivname"];

                if (iname != null)
                {
                    if (!util.IsValidIvName(iname))
                        Response.Redirect(Constants.PARAMERR);
                }
                user = Session["user"].ToString();
                sid = Session["nsessionid"].ToString();
                ivtype = Request.QueryString["ivtype"];

                if (ivtype != null)
                {
                    if (ivtype == null & !util.IsChar(ivtype))
                        Response.Redirect(Constants.PARAMERR);
                }

                if (Request.QueryString["axpCache"] != null)
                {
                    paramVal = Session["AxIvExportParams-" + iname].ToString();
                    Session["AxIvExportParams-" + iname] = "";
                }
                else
                    paramVal = Request.QueryString["params"].ToString();

                if (iname == null & Session["ivname"] != null/* TODO Change to default(_) if this is not a reference type */ )
                    iname = Session["ivname"].ToString();
                if (paramVal == null & Session["params"] != null/* TODO Change to default(_) if this is not a reference type */ )
                    paramVal = Session["params"].ToString();
                if (ivtype == null & Session["ivtype"] != null/* TODO Change to default(_) if this is not a reference type */ )
                    ivtype = Session["ivtype"].ToString();

                objIview = (IviewData)Session[Ikey];
                objIview.ReportHdrs = new ArrayList();
                ViewState["ivtype"] = ivtype;
                ViewState["params"] = paramVal;
                proj = Session["project"].ToString();
                ViewState["iname"] = iname;
                ViewState["ivtype"] = ivtype;
                ViewState["proj"] = proj;
                ViewState["user"] = user;
                ViewState["sid"] = sid;

                if (Request.QueryString["typeIvOrLv"] != null)
                    typeIvOrLv = Request.QueryString["typeIvOrLv"].ToString();
                ViewState["typeIvOrLv"] = typeIvOrLv;

                if (Request.QueryString["curRecord"] != null)
                    curRecord = Request.QueryString["curRecord"].ToString();
                ViewState["curRecord"] = curRecord;
            }
            else
            {
                user = ViewState["user"].ToString();
                iname = ViewState["iname"].ToString();
                ivtype = ViewState["ivtype"].ToString();
                proj = ViewState["proj"].ToString();
                sid = ViewState["sid"].ToString();
                paramVal = ViewState["params"].ToString();
                ivtype = ViewState["ivtype"].ToString();
                typeIvOrLv = ViewState["typeIvOrLv"].ToString();
                curRecord = ViewState["curRecord"].ToString();
            }
            string str = GetPDF();
            Response.Buffer = true;
            Response.Clear();
            Response.ClearContent();
            Response.ClearHeaders();
            System.IO.FileInfo files = new System.IO.FileInfo(str);
            Response.AddHeader("Content-disposition", "attachment;filename=" + files.Name);
            Response.ContentType = "application/pdf";
            Response.WriteFile(files.FullName);
            Response.End();
        }
    }

    private Cell AlignCell(Cell cellAttr, string AlignStr)
    {
        if (AlignStr == "" | AlignStr == "Left")
            cellAttr.HorizontalAlignment = Element.ALIGN_LEFT;
        else if (AlignStr == "Right")
            cellAttr.HorizontalAlignment = Element.ALIGN_RIGHT;
        else if (AlignStr == "Center")
            cellAttr.HorizontalAlignment = Element.ALIGN_CENTER;

        return cellAttr;
    }

    private void GetParam(string param)
    {
        int k;
        string tem1 = string.Empty;
        string[] arrParams;
        string[] arrNoOfParams;
        string @params = string.Empty;

        if (paramVal != null)
        {
            if (paramVal.Contains("~"))
            {
                arrNoOfParams = paramVal.Split('~');
                int i;
                for (i = 0; i <= arrNoOfParams.Length - 1; i++)
                {
                    arrParams = arrNoOfParams[i].Split('♠');
                    arrLstParams.Insert(i, arrParams[0]);
                    if (arrParams[1].Contains("`") == true)
                        arrParams[1] = arrParams[1].Replace("`", "~");

                    arrLstParamVal.Insert(i, arrParams[1]);
                }
            }
            else
            {
                arrParams = paramVal.Split('♠');
                for (k = 0; k <= arrParams.Length - 1; k++)
                {
                    if (arrParams.Length > k + 1)
                    {
                        arrLstParams.Insert(k, arrParams[0]);
                        if (arrParams[1].Contains("`") == true)
                            arrParams[1] = arrParams[1].Replace("`", ",");

                        arrLstParamVal.Insert(k, arrParams[1]);
                    }
                }
            }
        }

        int j;
        for (j = 0; j <= arrLstParams.Count - 1; j++)
        {
            if (arrLstParams.Count > 0)
            {
                tem1 = arrLstParams[j].ToString();
                if (arrLstParams.Count > 0)
                {
                    paramVal = arrLstParamVal[j].ToString().Replace("&grave;", "~");
                    paramVal = arrLstParamVal[j].ToString().Replace("&amp;", "&");
                }
                else
                    paramVal = "";
            }

            if (param != "")
            {
                paramXml = paramXml + "<" + tem1.ToString() + ">";
                paramXml = paramXml + util.CheckSpecialCharsSaveAs(util.ReplaceUrlSpecialChars(paramVal));
                paramXml = paramXml + "</" + tem1 + ">";

                @params = @params + "&" + tem1 + "=";
                @params = @params + paramVal;
            }
            else
                paramXml = "<params>";
        }
    }

    public void sess_expires()
    {
        string url = util.SESSEXPIRYPATH;
        Response.Write("<script language=\"javascript\">" + Constants.vbCrLf);
        Response.Write("parent.parent.location.href='" + url + "';");
        Response.Write(Constants.vbCrLf + "</script>");
    }
    public string ConvertDatatableToXML(System.Data.DataTable dt)
    {
        MemoryStream str = new MemoryStream();
        dt.TableName = "row";
        dt.WriteXml(str, true);
        str.Seek(0, SeekOrigin.Begin);
        StreamReader sr = new StreamReader(str);
        string xmlstr;
        xmlstr = sr.ReadToEnd().Replace("DocumentElement", "data");
        return (xmlstr);
    }

    private string GetPDF()
    {
        string isList;
        if (ivtype == "listview" | ivtype == "lview")
            isList = "true";
        else
            isList = "false";

        GetParam(paramVal);

        string sortCol = string.Empty;
        string sortOrd = string.Empty;
        string filterCol = string.Empty;
        string filterColVal = string.Empty;
        string filterValue1 = string.Empty;
        string filterOpr = string.Empty;

        if (Session["sOrder"] != null/* TODO Change to default(_) if this is not a reference type */ )
        {
            if (Session["sOrder"].ToString() != "")
                sortOrd = Session["sOrder"].ToString();
        }

        if (Session["sColumn"] != null/* TODO Change to default(_) if this is not a reference type */ )
        {
            if (Session["sColumn"].ToString() != "")
                sortCol = Session["sColumn"].ToString();
        }

        if (Session["fcolopr"] != null/* TODO Change to default(_) if this is not a reference type */ )
        {
            if (Session["fcolopr"].ToString() != "")
                filterOpr = Session["fcolopr"].ToString();
        }

        if (Session["fCol"] != null/* TODO Change to default(_) if this is not a reference type */ )
        {
            if (Session["fCol"].ToString() != "")
                filterCol = Session["fCol"].ToString();
        }

        if (Session["fColVal"] != null/* TODO Change to default(_) if this is not a reference type */ )
        {
            if (Session["fColVal"].ToString() != "")
                filterColVal = Session["fColVal"].ToString();
        }

        if (Session["fColVal2"] != null/* TODO Change to default(_) if this is not a reference type */ )
        {
            if (Session["fColVal2"].ToString() != "")
                filterValue1 = Session["fColVal2"].ToString();
        }

        string fileName = "GetLView" + iname;
        string errorLog = logobj.CreateLog("GetLView.", sid, fileName, "new");
        string custXML = string.Empty;
        string iXml;
        string _thisList = string.Empty;
        if (typeIvOrLv == "true")
            _thisList = " purpose=\"list\" ";
        if (curRecord == "")
            iXml = "<root " + _thisList + " headercached='false' name ='" + iname + "' axpapp ='" + Session["project"].ToString() + "' sessionid = '" + sid + "' appsessionkey='" + HttpContext.Current.Session["AppSessionKey"].ToString() + "' username='" + HttpContext.Current.Session["username"].ToString() + "' trace = '" + errorLog + "' pageno='0' firsttime='yes' sorder='" + sortOrd + "' scol='" + sortCol + "' fcolopr='" + filterOpr + "' fcolnm='" + filterCol + "' fcolval1='" + filterColVal + "' fcolval2='" + filterValue1 + "'><params> ";
        else
            iXml = "<root " + _thisList + " headercached='false' name ='" + iname + "' axpapp ='" + Session["project"].ToString() + "' sessionid = '" + sid + "' appsessionkey='" + HttpContext.Current.Session["AppSessionKey"].ToString() + "' username='" + HttpContext.Current.Session["username"].ToString() + "' trace = '" + errorLog + "' pageno='1' pagesize='" + curRecord + "' firsttime='yes' sqlpagination='true' getrowcount='false' gettotalrows='false' smartview='true'><params> ";
        iXml = iXml + paramXml;
        iXml = iXml + "</params>";
        iXml = iXml + Session["axApps"].ToString() + Application["axProps"].ToString() + HttpContext.Current.Session["axGlobalVars"].ToString() + HttpContext.Current.Session["axUserVars"].ToString() + "</root>";

        string ires = string.Empty;
        ASBExt.WebServiceExt objWebServiceExt = new ASBExt.WebServiceExt();
        try
        {
            objIview.requestJSON = true;
            ires = objWebServiceExt.CallGetIViewWS(iname, iXml, "", objIview);
            if (ires != null)
            {
                ires = ires.Split('♠')[1];

                if (ires.StartsWith("<"))
                    ires = util.ReplaceFirstOccurrence(ires, "#$#", "#$♥#");
                string[] resultSplitter = ires.Split(new[] { "#$♥#" }, StringSplitOptions.None);
                ires = resultSplitter[0];
            }
        }
        catch (Exception Ex)
        {
        }

        string strErrMsg = string.Empty;
        strErrMsg = util.ParseXmlErrorNode(ires);

        if (strErrMsg != string.Empty)
        {
            strErrMsg = strErrMsg.Replace("\r", "").Replace("\n", "");
            if (strErrMsg == Constants.SESSIONERROR)
            {
                Session.RemoveAll();
                Session.Abandon();
                string url1;
                url1 = util.SESSEXPIRYPATH;
                Response.Write("<script>" + Constants.vbCrLf);
                Response.Write("parent.parent.location.href='" + url1 + "';");
                Response.Write(Constants.vbCrLf + "</script>");
            }
            else
                Response.Redirect(util.ERRPATH + strErrMsg);
        }
        else
        {
            if (ires != string.Empty)
            {
                JObject jsonObject = JObject.Parse(ires);
                JObject data = (JObject)jsonObject["data"];
                XDocument xmlDocument = new XDocument();
                XElement root = new XElement("data");
                XElement dataElement = JsonConvert.DeserializeXNode(data.ToString(), "data").Root;
                root.Add(dataElement.Elements());
                xmlDocument.Add(root);
                ires = xmlDocument.ToString();

                XmlDocument xmlDocNew = new XmlDocument();
                xmlDocNew.LoadXml(ires);
                string datarows = "";
                string totalrows = "";
                string reccount = "";
                XmlNodeList nodesToRemove = xmlDocNew.SelectNodes("//reccount | //totalrows | //datarows");
                foreach (XmlNode node in nodesToRemove)
                {
                    if (node.Name == "datarows")
                        datarows = node.InnerText;
                    if (node.Name == "totalrows")
                        totalrows = node.InnerText;
                    if (node.Name == "reccount")
                        reccount = node.InnerText;

                    node.ParentNode.RemoveChild(node);
                }
                XmlNode metadataNode = xmlDocNew.SelectSingleNode("//metadata");
                if (metadataNode != null)
                {
                    XmlElement newElement = xmlDocNew.CreateElement("headrow");
                    foreach (XmlAttribute attribute in metadataNode.Attributes)
                    {
                        newElement.Attributes.Append((XmlAttribute)attribute.CloneNode(true));
                    }
                    foreach (XmlNode childNode in metadataNode.ChildNodes)
                    {
                        newElement.AppendChild(childNode.CloneNode(true));
                    }
                    metadataNode.ParentNode.ReplaceChild(newElement, metadataNode);
                }

                ires = xmlDocNew.OuterXml;
                XDocument doc = XDocument.Parse(@ires);
                doc.Descendants("axrowtype").Remove();
                doc.Descendants("axp__font").Remove();
                ires = doc.ToString();
            }

            ires = _xmlString + ires;
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(ires);

            pivotGroupHeaderNames.Clear();
            pivotStartCol.Clear();
            pivotEndCol.Clear();

            XmlNodeList productNodes;
            XmlNodeList baseDataNodes;
            productNodes = xmlDoc.SelectNodes("//headrow");
            int hcolNos;
            hcolNos = 0;

            foreach (XmlNode productNode in productNodes)
            {
                baseDataNodes = productNode.ChildNodes;
                int iCount = -1;
                foreach (XmlNode baseDataNode in baseDataNodes)
                {
                    iCount += 1;
                    colFld.Add(baseDataNode.Name);
                    colHead.Add(baseDataNode.InnerText);
                    if (baseDataNode.Attributes["width"] != null)
                        colWidth.Add(baseDataNode.Attributes["width"].Value);
                    else
                        colWidth.Add("0");

                    if (baseDataNode.Name == "rowno")
                    {
                        if (ivtype == "listview" | ivtype == "lview")
                            colHide.Add("false");
                        else
                            colHide.Add("true");
                    }
                    else
                    {
                        if (baseDataNode.Name.StartsWith("html_"))
                            htmlColumns.Add(baseDataNode.Name);

                        if (baseDataNode.Attributes["hide"] != null)
                        {
                            if (baseDataNode.Name.StartsWith("hide_"))
                                colHide.Add("true");
                            else
                                colHide.Add(baseDataNode.Attributes["hide"].Value);
                        }
                        if (baseDataNode.Name == "pivotghead")
                        {
                            XmlNodeList finalNodelist;
                            foreach (XmlNode base2node in baseDataNode)
                            {
                                finalNodelist = base2node.ChildNodes;
                                foreach (XmlNode finalNode in finalNodelist)
                                {
                                    if (finalNode.Name == "sn")
                                        pivotStartCol.Add(finalNode.InnerText);
                                    else if (finalNode.Name == "ghead")
                                        pivotGroupHeaderNames.Add(finalNode.InnerText);
                                    else if (finalNode.Name == "en")
                                        pivotEndCol.Add(finalNode.InnerText);
                                }
                            }
                            colHide.Add("true");
                        }

                        hcolNos = hcolNos + 1;
                    }
                }
            }

            var htIdx = 0;
            var cIdx = 0;
            for (htIdx = 0; htIdx <= htmlColumns.Count - 1; htIdx++)
            {
                for (cIdx = 0; cIdx <= colFld.Count - 1; cIdx++)
                {
                    string htmlColName = htmlColumns[htIdx].ToString();
                    if (colFld[cIdx] == htmlColName)
                        colHide[cIdx] = "false";
                    else if (colFld[cIdx] == htmlColName.Replace("html_", ""))
                        colHide[cIdx] = "true";
                }
            }

            // to remove attributes from headrow
            XmlNodeList productNodes2;
            XmlNodeList baseDataNodes2;
            productNodes2 = xmlDoc.SelectNodes("//headrow");

            foreach (XmlNode productNode2 in productNodes2)
            {
                baseDataNodes2 = productNode2.ChildNodes;
                foreach (XmlNode baseDataNode2 in baseDataNodes2)
                    baseDataNode2.Attributes.RemoveAll();
            }

            XmlNodeList compNodes;
            XmlNodeList cbaseDataNodes;
            compNodes = xmlDoc.SelectNodes("//data/reporthf");
            foreach (XmlNode compNode in compNodes)
            {
                cbaseDataNodes = compNode.ChildNodes;
                foreach (XmlNode cbaseDataNode in cbaseDataNodes)
                {
                    if (cbaseDataNode.Name == "hideprojname")
                    {
                        string hideprojname = cbaseDataNode.InnerText;
                        if (hideprojname != "" && hideprojname == "@t")
                        {
                            hideProjeName = true;
                        }
                    }
                    else if (Strings.Mid(cbaseDataNode.Name, 1, 7) == "x__head")
                    {
                        iViewCap = cbaseDataNode.Attributes["caption"].Value;
                    }
                    else if (Strings.Mid(cbaseDataNode.Name, 1, 3) == "lbl")
                    {
                        iViewCap = cbaseDataNode.Attributes["caption"].Value;
                    }
                    else if (cbaseDataNode.Name == "header")
                    {
                        foreach (XmlNode childHeaders in cbaseDataNode)
                        {
                            string xmlContent = childHeaders.OuterXml;
                            XmlDocument _xmlDoc = new XmlDocument();
                            _xmlDoc.LoadXml(xmlContent);
                            XmlNode textNode = _xmlDoc.SelectSingleNode("//text");
                            XmlNode textNodefont = _xmlDoc.SelectSingleNode("//font");
                            if (textNodefont != null)
                                hdrFont.Add(textNodefont.InnerText);
                            else
                                hdrFont.Add("");
                            XmlNode textNodeheader_aline = _xmlDoc.SelectSingleNode("//header_aline");
                            if (textNodeheader_aline != null)
                                hdrAlign.Add(textNodeheader_aline.InnerText);
                            else
                                hdrAlign.Add("");
                            objIview.ReportHdrs.Add(textNode.InnerText.Trim());
                        }
                    }
                    if (cbaseDataNode.Name == "footer")
                    {
                        foreach (XmlNode childFooters in cbaseDataNode)
                        {
                            string xmlContent = childFooters.OuterXml;
                            XmlDocument _xmlDoc = new XmlDocument();
                            _xmlDoc.LoadXml(xmlContent);
                            XmlNode textNode = _xmlDoc.SelectSingleNode("//text");
                            hdrFooterName.Add(textNode.InnerText);
                            XmlNode textNodefont = _xmlDoc.SelectSingleNode("//font");
                            if (textNodefont != null)
                                hdrFooterFont.Add(textNodefont.InnerText);
                            else
                                hdrFooterFont.Add("");
                            XmlNode textNodeheader_aline = _xmlDoc.SelectSingleNode("//footer_aline");
                            if (textNodeheader_aline != null)
                                hdrFooterAlign.Add(textNodeheader_aline.InnerText);
                            else
                                hdrFooterAlign.Add(hdrFooterAlign[0]);
                        }
                    }
                }
            }


            // Remove Comps
            XmlNode cNode;
            cNode = xmlDoc.SelectSingleNode("//comps");
            if (cNode != null)
                cNode.ParentNode.RemoveChild(cNode);

            // remove hidden fields in headrow
            int hrep;
            // change  later try new code to remove this for
            for (hrep = 1; hrep <= hcolNos; hrep++)
            {
                XmlNodeList productNodes3;
                XmlNodeList baseDataNodes3;
                productNodes3 = xmlDoc.SelectNodes("//headrow");

                int hidx;

                foreach (XmlNode productNode3 in productNodes3)
                {
                    baseDataNodes3 = productNode3.ChildNodes;
                    foreach (XmlNode baseDataNode3 in baseDataNodes3)
                    {
                        // Response.Write(baseDataNode1.Name & "<br>")
                        for (hidx = 0; hidx <= colFld.Count - 1; hidx++)
                        {
                            if (colFld[hidx] == baseDataNode3.Name)
                            {
                                try
                                {
                                    if (colHide[hidx].ToString() == "true")
                                        baseDataNode3.ParentNode.RemoveChild(baseDataNode3);
                                }
                                catch (Exception ex)
                                {
                                }
                            }
                        }
                    }
                }
            }

            // remove hidden fields
            int rep;
            // change  later try new code to remove this for
            for (rep = 1; rep <= hcolNos; rep++)
            {
                XmlNodeList productNodes1;
                XmlNodeList baseDataNodes1;
                productNodes1 = xmlDoc.SelectNodes("//row");

                int idx;
                foreach (XmlNode productNode1 in productNodes1)
                {
                    baseDataNodes1 = productNode1.ChildNodes;
                    foreach (XmlNode baseDataNode1 in baseDataNodes1)
                    {
                        // Response.Write(baseDataNode1.Name & "<br>")
                        for (idx = 0; idx <= colFld.Count - 1; idx++)
                        {
                            try
                            {
                                if (colFld[idx].ToString().ToLower() == baseDataNode1.Name.ToLower())
                                {
                                    if (colHide[idx].ToString() == "true")
                                        baseDataNode1.ParentNode.RemoveChild(baseDataNode1);
                                }
                            }
                            catch (Exception ex)
                            {
                            }
                        }
                    }
                }
            }

            // PDF creation starts
            // find no of visible columns

            int viscols;
            viscols = 0;
            int g;
            if (ivtype == "listview" | ivtype == "lview" | ivtype.ToLower() == "iview")
            {
                for (g = 0; g <= colHide.Count - 1; g++)
                {
                    if (colHide[g].ToString() == "false")
                        viscols = viscols + 1;
                }
            }
            else
                for (g = 1; g <= colHide.Count - 1; g++)
                {
                    if (colHide[g].ToString() == "false")
                        viscols = viscols + 1;
                }

            int[] widthscell = new int[viscols - 1 + 1];
            int clcont = 0;
            if (ivtype == "listview" | ivtype == "lview" | ivtype.ToLower() == "iview")
            {
                for (g = 0; g <= colHide.Count - 1; g++)
                {
                    if (colHide[g].ToString() == "false")
                    {
                        if (colFld.Count > 0)
                        {
                            if (colFld[g].ToString() == "rowno")
                            {
                                widthscell[clcont] = 50;
                                clcont = clcont + 1;
                            }
                            else
                            {
                                // widthscell(clcont) = objIview.ColWidth(g)
                                if (colWidth != null)
                                    widthscell[clcont] = int.Parse(colWidth[colFld.IndexOf(colFld[g])].ToString());
                                else
                                    widthscell[clcont] = int.Parse(colWidth[g].ToString());
                                clcont = clcont + 1;
                            }
                        }
                        else if (colWidth.Count > 0)
                        {
                            if (colFld[g].ToString() == "rowno")
                            {
                                widthscell[clcont] = 50;
                                clcont = clcont + 1;
                            }
                            else
                            {
                                widthscell[clcont] = int.Parse(colWidth[g].ToString());
                                clcont = clcont + 1;
                            }
                        }
                    }
                }
            }
            else
                for (g = 1; g <= colHide.Count - 1; g++)
                {
                    if (colHide[g].ToString() == "false")
                    {
                        if (colWidth != null)
                            widthscell[clcont] = int.Parse(colWidth[colFld.IndexOf(colFld[g])].ToString());
                        else
                            widthscell[clcont] = int.Parse(colWidth[g].ToString());
                        clcont = clcont + 1;
                    }
                }

            iTextSharp.text.Table htab;
            if (viscols == 0)
                viscols = 1;
            htab = new iTextSharp.text.Table(viscols);
            htab.WidthPercentage = 100;
            htab.Border = 1;
            htab.Cellspacing = 1;
            htab.Cellpadding = 1;
            htab.SetWidths(widthscell);

            int inc;
            int colSpan;
            int totColSpan = 0;
            for (inc = 0; inc <= pivotGroupHeaderNames.Count - 1; inc++)
            {
                string hn;
                colSpan = System.Convert.ToInt32(pivotEndCol[inc].ToString()) - System.Convert.ToInt32(pivotStartCol[inc].ToString());
                hn = pivotGroupHeaderNames[inc].ToString();
                Cell cellAttribute = new Cell(new Phrase(hn, FontFactory.GetFont(FontFactory.TIMES_ROMAN, 10, iTextSharp.text.Font.BOLD, new GrayColor(0.1F))));
                cellAttribute.Colspan = colSpan;
                cellAttribute.HorizontalAlignment = Element.ALIGN_CENTER;
                htab.AddCell(cellAttribute);
                totColSpan += colSpan;
            }
            //for (inc = 1; inc <= (htab.Columns) - totColSpan; inc++)
            //{
            //    Cell cellAttributes = new Cell(new Phrase("", FontFactory.GetFont(FontFactory.TIMES_ROMAN, 10, iTextSharp.text.Font.BOLD, new GrayColor(0.1F))));
            //    htab.AddCell(cellAttributes);
            //}

            XmlNodeList hproductNodes;
            XmlNodeList hbaseDataNodes;
            int tmpColCount = 0;
            hproductNodes = xmlDoc.SelectNodes("/data/headrow");
            foreach (XmlNode hproductNode in hproductNodes)
            {
                hbaseDataNodes = hproductNode.ChildNodes;
                tmpColCount = hbaseDataNodes.Count;
                Response.Write(hbaseDataNodes.Count);
                foreach (XmlNode hbaseDataNode in hbaseDataNodes)
                {
                    string hn;
                    if (hbaseDataNode.Name == "rowno")
                    {
                        if (ivtype == "listview" | ivtype == "lview")
                        {
                            hn = "Sr. No.";
                            Cell cellAttribute = new Cell(new Phrase(hn, FontFactory.GetFont(FontFactory.TIMES_ROMAN, 8, iTextSharp.text.Font.BOLD, new GrayColor(0.1F))));
                            cellAttribute.HorizontalAlignment = Element.ALIGN_CENTER;
                            htab.AddCell(cellAttribute);
                        }
                    }
                    else
                    {
                        hn = hbaseDataNode.InnerText;
                        if (hn == "axp_slno")
                            hn = "Sr. No.";
                        if ((hn.IndexOf("~") != -1))
                            hn = hn.Replace("~", "\n");
                        Cell cellAttribute = new Cell(new Phrase(hn, FontFactory.GetFont(FontFactory.TIMES_ROMAN, 8, iTextSharp.text.Font.BOLD, new GrayColor(0.1F))));
                        cellAttribute.HorizontalAlignment = Element.ALIGN_CENTER;
                        if (htab != null)
                            htab.AddCell(cellAttribute);
                    }
                }
            }

            // Get Data
            XmlNodeList dproductNodes;
            XmlNodeList dbaseDataNodes;
            string AlignStr = string.Empty;
            dproductNodes = xmlDoc.SelectNodes("/data/row");
            foreach (XmlNode dproductNode in dproductNodes)
            {
                dbaseDataNodes = dproductNode.ChildNodes;
                int i = 1;

                foreach (XmlNode dbaseDataNode in dbaseDataNodes)
                {
                    //if (colFld != null)
                    //{
                    //    var indx = colFld.IndexOf(dbaseDataNode.Name);
                    //    if (indx > -1)
                    //        AlignStr = ColAlign[indx].ToString();
                    //}
                    string strCellText = string.Empty;
                    if (dbaseDataNode.Name == "rowno")
                    {
                        if (ivtype == "listview" | ivtype == "lview")
                        {
                            strCellText = dbaseDataNode.InnerText.ToString();
                            strCellText = util.ReplaceTextAreaChars(strCellText, "pdf");
                            Cell cellAttribute = new iTextSharp.text.Cell(new Paragraph(strCellText, FontFactory.GetFont(FontFactory.TIMES_ROMAN, 8, iTextSharp.text.Font.NORMAL, new GrayColor(0.1F))));
                            cellAttribute.HorizontalAlignment = Element.ALIGN_CENTER;
                            if (htab != null)
                                htab.AddCell(cellAttribute);
                        }
                        else
                            continue;
                    }
                    else
                    {
                        strCellText = dbaseDataNode.InnerText.ToString();
                        strCellText = util.ReplaceTextAreaChars(strCellText, "pdf");
                        Cell cellAttribute = new iTextSharp.text.Cell(new Paragraph(strCellText, FontFactory.GetFont(FontFactory.TIMES_ROMAN, 8, iTextSharp.text.Font.NORMAL, new GrayColor(0.1F))));
                        AlignCell(cellAttribute, AlignStr);
                        if (htab != null)
                            htab.AddCell(cellAttribute);
                    }
                    i = i + 1;
                }
                for (i = i; i <= tmpColCount; i++)
                {
                    if (htab != null)
                        htab.AddCell(new iTextSharp.text.Cell(new Paragraph("", FontFactory.GetFont(FontFactory.TIMES_ROMAN, 8, iTextSharp.text.Font.NORMAL, new GrayColor(0.1F)))));
                }
            }

            //ArrayList arrParamCaption = new ArrayList();
            //ArrayList arrParamIsHidden = new ArrayList();
            //if (Session["paramDetails"] != null/* TODO Change to default(_) if this is not a reference type */ )
            //{
            //    var strParamdetails = Session["paramDetails"].ToString();
            //    string[] arrParamDet;
            //    arrParamDet = strParamdetails.Split('~');
            //    string[] arrTemp;
            //    int i;
            //    for (i = 0; i <= arrParamDet.Length - 1; i++)
            //    {
            //        if (arrParamDet[i].ToString() != string.Empty)
            //        {
            //            arrTemp = arrParamDet[i].ToString().Split(',');
            //            arrParamCaption.Insert(i, arrTemp[0].ToString());
            //            arrParamIsHidden.Insert(i, arrTemp[1].ToString());
            //        }
            //        else if (arrParamDet[i].ToString() == string.Empty)
            //        {
            //            arrParamCaption.Insert(i, "");
            //            arrParamIsHidden.Insert(i, "");
            //        }
            //    }
            //}

            string ivParams = string.Empty;
            if (Request.QueryString["ivParamCaption"] != null)
                ivParams = Request.QueryString["ivParamCaption"].ToString();
            ArrayList _paramList = new ArrayList();
            if (ivParams != string.Empty)
            {
                StringBuilder sbPVal = new StringBuilder();
                string[] pairs = ivParams.Split('♥');
                foreach (var pair in pairs)
                {
                    if (pair != "")
                    {
                        string[] keyValue = pair.Split(':');
                        string kyval = keyValue[1];
                        kyval = kyval.Replace("&grave;", "~");
                        _paramList.Add(keyValue[0] + ": " + kyval);
                    }
                }
            }
            // for adding the header in the PDF
            iTextSharp.text.Table Hdrtab;
            Hdrtab = new iTextSharp.text.Table(1);
            Hdrtab.WidthPercentage = 100;
            Hdrtab.TableFitsPage = true;
            Hdrtab.Border = 0;
            Hdrtab.Cellspacing = 1;
            Hdrtab.Cellpadding = 1;

            if (Session["AxShowAppTitle"] != null && Session["AxShowAppTitle"].ToString().ToLower() == "true")
            {
                string headerText = "";
                if (Session["AxAppTitle"] != null && Session["AxAppTitle"] != string.Empty)
                    headerText = Session["AxAppTitle"].ToString();
                else if (Session["projTitle"] != null)
                    headerText = Session["projTitle"].ToString();

                if (!hideProjeName && headerText != string.Empty)
                {
                    Cell cellCapAttribute = new Cell(new Paragraph(headerText, FontFactory.GetFont(FontFactory.TIMES_ROMAN, 10, iTextSharp.text.Font.BOLD, new GrayColor(0.1F))));
                    cellCapAttribute.HorizontalAlignment = Element.ALIGN_CENTER;
                    Hdrtab.AddCell(cellCapAttribute);
                }
            }

            if (objIview.ReportHdrs.Count > 0)
            {
                int iv;
                for (iv = 0; iv <= objIview.ReportHdrs.Count - 1; iv += 1)
                {
                    string _alignment = hdrAlign[iv].ToString();
                    string _font = hdrFont[iv].ToString();

                    Cell cellAttribute = new Cell(new Phrase(objIview.ReportHdrs[iv].ToString(), FontFactory.GetFont(FontFactory.TIMES_ROMAN, 10, iTextSharp.text.Font.BOLD, new GrayColor(0.1F))));
                    if (_alignment == "" || _alignment == "@center")
                        cellAttribute.HorizontalAlignment = Element.ALIGN_CENTER;
                    else if (_alignment == "@left")
                        cellAttribute.HorizontalAlignment = Element.ALIGN_LEFT;
                    else if (_alignment == "@right")
                        cellAttribute.HorizontalAlignment = Element.ALIGN_RIGHT;
                    Hdrtab.AddCell(cellAttribute);
                }
            }
            else if (iViewCap != null & iViewCap != string.Empty)
            {
                Cell cellCapAttribute = new Cell(new Paragraph(iViewCap, FontFactory.GetFont(FontFactory.TIMES_ROMAN, 10, iTextSharp.text.Font.BOLD, new GrayColor(0.1F))));
                cellCapAttribute.HorizontalAlignment = Element.ALIGN_CENTER;
                Hdrtab.AddCell(cellCapAttribute);
            }

            foreach (string pval in _paramList)
            {
                Cell cellAttribute = new Cell(new Paragraph(pval, FontFactory.GetFont(FontFactory.TIMES_ROMAN, 8, iTextSharp.text.Font.BOLD, new GrayColor(0.1F))));
                cellAttribute.HorizontalAlignment = Element.ALIGN_LEFT;
                Hdrtab.AddCell(cellAttribute);
            }
            if (htab != null)
                Hdrtab.InsertTable(htab);
            if (hdrFooterName.Count > 0)
            {
                int iv;
                for (iv = 0; iv <= hdrFooterName.Count - 1; iv += 1)
                {
                    string _alignment = hdrFooterAlign[iv].ToString();
                    string _font = hdrFooterFont[iv].ToString();

                    Cell cellAttribute = new Cell(new Phrase(hdrFooterName[iv].ToString(), FontFactory.GetFont(FontFactory.TIMES_ROMAN, 10, iTextSharp.text.Font.BOLD, new GrayColor(0.1F))));
                    if (_alignment == "" || _alignment == "@center")
                        cellAttribute.HorizontalAlignment = Element.ALIGN_CENTER;
                    else if (_alignment == "@left")
                        cellAttribute.HorizontalAlignment = Element.ALIGN_LEFT;
                    else if (_alignment == "@right")
                        cellAttribute.HorizontalAlignment = Element.ALIGN_RIGHT;
                    Hdrtab.AddCell(cellAttribute);
                }
            }

            string ScriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString();
            ScriptsPath += @"Axpert\";
            DirectoryInfo di = new DirectoryInfo(ScriptsPath + sid);
            if (di.Exists)
            {
            }
            else
                di.Create();

            string strPath;
            iTextSharp.text.Document mydocument;
            mydocument = new iTextSharp.text.Document();
            strPath = HttpContext.Current.Application["ScriptsPath"].ToString();
            if (iViewCap != null && iViewCap != "")
                strPath = strPath + @"Axpert\" + sid + @"\" + iViewCap + ".pdf";
            else
                strPath = strPath + @"Axpert\" + sid + @"\view.pdf";
            PdfWriter.GetInstance(mydocument, new FileStream(strPath, FileMode.Create));
            mydocument.Open();
            mydocument.Add(Hdrtab);
            mydocument.Close();
            return strPath;
        }
        return "";
    }
}