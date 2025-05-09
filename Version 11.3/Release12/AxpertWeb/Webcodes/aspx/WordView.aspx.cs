﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Data;
using System.Collections;
using System.Configuration;
using System.Text;
using Word.Api.Interfaces;
using Word.W2004;
using Word.W2004.Elements;
using Word.W2004.Elements.TableElements;
using Word.W2004.Style;
using WFont = Word.W2004.Style.Font;
using WImage = Word.W2004.Elements.Image;
using System.Drawing;
using System.Xml;
using HtmlAgilityPack;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Xml.Linq;

public partial class aspx_WordView : System.Web.UI.Page
{
    IviewData objIview = new IviewData();
    Util.Util objUtil = new Util.Util();
    ArrayList colHide = new ArrayList();
    ArrayList colHead = new ArrayList();
    ArrayList htmlColumns = new ArrayList();
    ArrayList arrColType = new ArrayList();
    ArrayList colType = new ArrayList();
    ArrayList arrSubhead = new ArrayList();
    Util.Util util = new Util.Util();

    ArrayList hdrFont = new ArrayList();
    ArrayList hdrAlign = new ArrayList();

    ArrayList hdrFooterName = new ArrayList();
    ArrayList hdrFooterAlign = new ArrayList();
    ArrayList hdrFooterFont = new ArrayList();
    bool hideProjeName = false;
    string headerText = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        util.IsValidSession();
        ResetSessionTime();
        if (Session["project"] == null)
        {
            SessExpires();
        }
        else
        {

            if (Session["AxShowAppTitle"] != null && Session["AxShowAppTitle"].ToString().ToLower() == "true")
            {
                if (Session["AxAppTitle"] != null && Session["AxAppTitle"] != string.Empty)
                    headerText = Session["AxAppTitle"].ToString();
                else if (Session["projTitle"] != null)
                    headerText = Session["projTitle"].ToString();
            }
            ExportToWord();
        }
    }
    private void ResetSessionTime()
    {
        if (Session["AxSessionExtend"] != null && Session["AxSessionExtend"].ToString() == "true")
        {
            HttpContext.Current.Session["LastUpdatedSess"] = DateTime.Now.ToString();
            ClientScript.RegisterStartupScript(this.GetType(), "SessionAlert", "parent.ResetSession();", true);
        }
    }

    protected void CreateDocumentWithSubHead(List<DataTable> tables)
    {
        IDocument doc = new Document2004();

        Properties property = new Properties
        {
            LastSaved = DateTime.Now,
            Created = DateTime.Now
        };
        doc.Head.Properties = property;
        doc.SetPageOrientationLandscape();

        if (!hideProjeName)
            doc.Header.AddEle(Heading1.With(headerText).WithStyle().Align(Align.CENTER).Create());

        if (objIview.ReportHdrs.Count > 0)
        {
            for (int i = 0; i < objIview.ReportHdrs.Count; i++)
            {
                doc.Header.AddEle(Heading2.With(StringReplaceSpecialChar(objIview.ReportHdrs[i].ToString())).WithStyle().Align(Align.CENTER).Create());
            }
        }


        //if (!string.IsNullOrEmpty(objIview.FilterText))
        //    doc.Header.AddEle(Heading3.With(StringReplaceSpecialChar(objIview.FilterText)).WithStyle().Align(Align.CENTER).Create());

        doc.AddEle(BreakLine.SetTimes(1).Create());
        Word.W2004.Elements.Table tbl = new Word.W2004.Elements.Table();
        tbl.SetRepeatTableHeaderOnEveryPage();

        for (int tblCount = 0; tblCount < tables.Count; tblCount++)
        {
            using (DataTable table = tables[tblCount])
            {

                ArrayList pivotMergeHeaders = new ArrayList(objIview.PivotMergeHeaders);
                if (objIview.iviewParams.ParamsExist)
                {
                    ArrayList paramname = new ArrayList(objIview.iviewParams.ParamNames);
                    ArrayList paramVal = new ArrayList(objIview.iviewParams.ParamChangedVals);
                    if (pivotMergeHeaders.Count > 0 && paramname.Count > 0)
                    {
                        for (int j = 0; j < pivotMergeHeaders.Count; j++)
                        {
                            string pivotHeaderText = pivotMergeHeaders[j].ToString();
                            if (pivotHeaderText != "")
                            {
                                for (int i = 0; i < paramname.Count; i++)
                                {
                                    string strparamnames = paramname[i].ToString();
                                    string strparamval = paramVal[i].ToString();
                                    if (pivotHeaderText.Contains(strparamnames))
                                    {
                                        pivotHeaderText = pivotHeaderText.Replace("{" + strparamnames + "}", strparamval);
                                        pivotMergeHeaders[j] = pivotHeaderText;
                                    }
                                }
                            }
                        }
                    }
                }

                StringBuilder tableSB = new StringBuilder();
                TableStrings ts = new TableStrings(12);
                CellString cs = new CellString(12);
                tableSB.Append(ts.GetTableStartString());
                if (pivotMergeHeaders.Count > 0)
                {
                    //get indexes of the value positions to merge
                    List<int> indexOfMergeHeaders = new List<int>();
                    List<int> noOfColMerge = new List<int>();
                    bool isMergeColumn = false;
                    for (int i = 0; i < pivotMergeHeaders.Count; i++)
                        if (!string.IsNullOrEmpty(pivotMergeHeaders[i].ToString()))
                        {
                            isMergeColumn = true;
                            indexOfMergeHeaders.Add(i);
                            noOfColMerge.Add(int.Parse(objIview.PivotEndCol[i].ToString()) - int.Parse(objIview.PivotStartCol[i].ToString()));
                        }
                    int add = 0;
                    if (isMergeColumn)
                    {
                        add = (table.Rows[0].Table.Columns.Count - pivotMergeHeaders.Count) + 1;
                        tableSB.Append(ts.GetHeaderRowStartString());
                        ts.isPivotIview = true;
                    }

                    for (int i = 0; i < pivotMergeHeaders.Count; i++)
                    {
                        if (indexOfMergeHeaders.Count > 0 && i == indexOfMergeHeaders[0])
                        {
                            tableSB.Append(ts.GetMergeHeaderString(StringReplaceSpecialChar(pivotMergeHeaders[i].ToString()), !string.IsNullOrEmpty(pivotMergeHeaders[i].ToString()), string.IsNullOrEmpty(pivotMergeHeaders[i].ToString()), noOfColMerge[0]));
                            indexOfMergeHeaders.Remove(indexOfMergeHeaders[0]);
                            noOfColMerge.Remove(noOfColMerge[0]);
                        }
                        else if (isMergeColumn)
                            tableSB.Append(ts.GetMergeHeaderString(StringReplaceSpecialChar(pivotMergeHeaders[i].ToString()), !string.IsNullOrEmpty(pivotMergeHeaders[i].ToString()), string.IsNullOrEmpty(pivotMergeHeaders[i].ToString()), add));
                    }
                    if (isMergeColumn)
                    {
                        tableSB.Append(ts.GetHeaderRowEndString());
                    }
                    for (int i = 0; i < add; i++)
                        pivotMergeHeaders.Add("");
                }

                tableSB.Append(ts.GetHeaderRowStartString());
                int srNoIndex = -1;

                // Remove "rowdata_Id" if Sr. No. is not availabale in object Iview
                string srColName = "Sr. No.";
                int srindx = -1;
                srindx = colHead.IndexOf(srColName);
                if (srindx == -1)
                {
                    if (table.Rows[0].Table.Columns.Contains("rowdata_Id"))
                        table.Columns.Remove("rowdata_Id");
                    if (table.Rows[0].Table.Columns.Contains("axrowtype"))
                        table.Columns.Remove("axrowtype");
                }

                for (int i = 0; i < table.Rows[0].Table.Columns.Count; i++)
                {
                    string colName = colHead[i].ToString();
                    if (colName == "Sr. No.")
                        srNoIndex = 1;
                    GetDataTypeOfAColumn(colName);
                    if (ts.isPivotIview && pivotMergeHeaders.Count > 0)
                    {
                        tableSB.Append(ts.GetHeaderString(StringReplaceSpecialChar(colName), !string.IsNullOrEmpty(pivotMergeHeaders[i].ToString())));
                    }
                    else
                    {
                        tableSB.Append(ts.GetHeaderString(StringReplaceSpecialChar(colName), true));
                    }

                }
                tableSB.Append(ts.GetHeaderRowEndString());
                int cellIndex = -1;
                for (int i = 0; i < table.Rows.Count; i++)
                {
                    bool isGTRow = false;
                    bool addGrandTotal = false;
                    DataRow dr = table.Rows[i];
                    string rowString = string.Empty;
                    tableSB.Append(cs.GetCellRowStartString());
                    int isFirstCol = 0;
                    for (int c = 0; c < table.Rows[i].Table.Columns.Count; c++)
                    {
                        //cs.Align = arrColType[c].ToString();
                        string colValue = StringReplaceSpecialChar(dr[table.Rows[i].Table.Columns[c]].ToString().Trim());
                        if (dr[table.Rows[0].Table.Columns[0]].ToString().Trim() == "")
                        {

                            if (cellIndex == -1)
                                for (int a = 0; a < table.Rows[i].Table.Columns.Count; a++)
                                    if (dr[table.Rows[i].Table.Columns[a]].ToString() == "")
                                        continue;
                                    else
                                    {
                                        cellIndex = a;
                                        break;
                                    }

                            tableSB.Append(cs.GetSubHeadCellValue(StringReplaceSpecialChar(dr[table.Rows[i].Table.Columns[cellIndex]].ToString()), table.Rows[i].Table.Columns.Count));
                            //arrSubhead.Remove(arrSubhead[c]);
                            break;
                        }
                        else
                        {
                            bool isBoldComplete = false;

                            if (colValue == "Grand Total" && srNoIndex != -1)
                            {
                                addGrandTotal = true;
                                colValue = "";
                                isGTRow = true;
                            }
                            if ((addGrandTotal) && (colValue == "") && (isFirstCol != 0) && (srNoIndex != -1))
                            {
                                colValue = "Grand Total";
                                addGrandTotal = false;
                                isBoldComplete = true;
                                tableSB.Append(cs.GetBoldOnlyString(!string.IsNullOrEmpty(colValue) ? colValue : "&#45;"));
                            }
                            if (!isBoldComplete)
                            {
                                if (isGTRow)
                                    tableSB.Append(cs.GetBoldForGT(!string.IsNullOrEmpty(colValue) ? colValue : "&#45;"));
                                else
                                    tableSB.Append(cs.GetCellValue(!string.IsNullOrEmpty(colValue) ? colValue : "&#45;"));
                            }


                        }
                        isFirstCol = isFirstCol + 1;
                    }
                    tableSB.Append(cs.GetCellRowEndString());
                }
                tableSB.Append(ts.GetTableEndString());
                if (tblCount != 0)
                {
                    doc.AddEle(Paragraph.With(" ").Create());
                    doc.AddEle(PageBreak.Create());
                    doc.AddEle(Paragraph.With(" ").Create());
                }
                doc.Body.AddEle(tableSB.ToString());
            }
        }
        doc.Footer.ShowPageNumber();
        if (!string.IsNullOrEmpty(objIview.IviewFooter))
        {
            objIview.IsWordWithHtml = false; // Change it to non html iview to by pass unwanted parsing.
            doc.AddEle(Paragraph.With(" ").Create());
            string[] footerText = objIview.IviewFooter.Split('|');
            if (footerText.Length > 0)
                for (int i = 0; i < footerText.Length; i++)
                    doc.AddEle(Paragraph.With(StringReplaceSpecialChar(footerText[i])).Create());
        }

        string fileName = objIview.IviewCaption.Replace(",", "");
        fileName = fileName.Replace(" ", "_");

        Response.Clear();
        Response.Buffer = true;
        Response.AddHeader("content-disposition", "attachment;filename=" + fileName + ".doc");
        Response.Charset = "";
        Response.ContentType = "application/vnd.ms-word";
        Response.Output.Write(doc.ToString());
        Response.Flush();
        Response.End();
        //doc.Save(@"d:\" + fileName + ".doc");
    }

    protected void CreateDocument(DataTable dt)
    {
        IDocument doc = new Document2004();

        Properties property = new Properties
        {
            LastSaved = DateTime.Now,
            Created = DateTime.Now
        };
        doc.Head.Properties = property;
        doc.SetPageOrientationLandscape();

        if (!hideProjeName)
            doc.Header.AddEle(Heading1.With(headerText).WithStyle().Align(Align.CENTER).Create());

        if (objIview.ReportHdrs.Count > 0)
        {
            for (int i = 0; i < objIview.ReportHdrs.Count; i++)
            {
                string _alignment = hdrAlign[i].ToString();
                string _font = hdrFont[i].ToString();

                if (_alignment == "" || _alignment == "@center")
                    doc.Header.AddEle(Heading2.With(StringReplaceSpecialChar(objIview.ReportHdrs[i].ToString())).WithStyle().Align(Align.CENTER).Create());
                else if (_alignment == "@left")
                    doc.Header.AddEle(Heading2.With(StringReplaceSpecialChar(objIview.ReportHdrs[i].ToString())).WithStyle().Align(Align.LEFT).Create());
                else if (_alignment == "@right")
                    doc.Header.AddEle(Heading2.With(StringReplaceSpecialChar(objIview.ReportHdrs[i].ToString())).WithStyle().Align(Align.RIGHT).Create());
            }
        }
        else
        {
            doc.Header.AddEle(Heading1.With(objIview.IviewCaption).WithStyle().Align(Align.CENTER).Create());
        }
        string iName = string.Empty;
        if (Session["ivname"] != null)
            iName = Session["ivname"].ToString();
        else if (Request.QueryString["ivname"] != null)
            iName = Request.QueryString["ivname"].ToString();
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

        foreach (string pval in _paramList)
        {
            doc.AddEle(Paragraph.With(pval).WithStyle().Align(Align.LEFT).Create());
        }

        doc.AddEle(BreakLine.SetTimes(1).Create());
        Word.W2004.Elements.Table tbl = new Word.W2004.Elements.Table();
        tbl.SetRepeatTableHeaderOnEveryPage();
        StringBuilder tableSB = new StringBuilder();
        using (DataTable table = dt)
        {
            TableStrings ts = new TableStrings(12);
            CellString cs = new CellString(12);
            tableSB.Append(ts.GetTableStartString());

            tableSB.Append(ts.GetHeaderRowStartString());
            int srNoIndex = -1;

            if (table.Rows[0].Table.Columns.Contains("rowdata_Id"))
                table.Columns.Remove("rowdata_Id");
            if (table.Rows[0].Table.Columns.Contains("axrowtype"))
                table.Columns.Remove("axrowtype");
            if (table.Rows[0].Table.Columns.Contains("axp__font"))
                table.Columns.Remove("axp__font");

            for (int i = 0; i < table.Rows[0].Table.Columns.Count; i++)
            {
                if (table.Rows[0].Table.Columns[i].ToString() != colHead[i].ToString() && colHide[i].ToString() == "true")
                    continue;
                else if (table.Rows[0].Table.Columns[i].ToString() == colHead[i].ToString() && colHide[i].ToString() == "true")
                    continue;
                string colName = colHead[i].ToString();
                if (colName == "Sr. No.")
                    colName = "Sr. No.";
                GetDataTypeOfAColumn(colName);

                tableSB.Append(ts.GetHeaderString(StringReplaceSpecialChar(colName), true));

            }
            tableSB.Append(ts.GetHeaderRowEndString());

            int cellIndex = -1;
            for (int i = 0; i < table.Rows.Count; i++)
            {
                bool isGTRow = false;
                bool addGrandTotal = false;
                DataRow dr = table.Rows[i];
                string rowString = string.Empty;
                tableSB.Append(cs.GetCellRowStartString());
                int isFirstCol = 0;
                for (int c = 0; c < table.Rows[i].Table.Columns.Count; c++)
                {
                    if (table.Rows[0].Table.Columns[c].ToString() != colHead[c].ToString() && colHide[c].ToString() == "true")
                        continue;
                    else if (table.Rows[0].Table.Columns[c].ToString() == colHead[c].ToString() && colHide[c].ToString() == "true")
                        continue;
                    //cs.Align = arrColType[c].ToString();
                    string colValue = StringReplaceSpecialChar(dr[table.Rows[i].Table.Columns[c]].ToString());
                    if (arrSubhead.Count > 0 && int.Parse(arrSubhead[0].ToString()) == i)
                    {

                        if (cellIndex == -1)
                            for (int a = 0; a < table.Rows[i].Table.Columns.Count; a++)
                                if (dr[table.Rows[i].Table.Columns[a]].ToString() == "")
                                    continue;
                                else
                                {
                                    cellIndex = a;
                                    break;
                                }

                        tableSB.Append(cs.GetSubHeadCellValue(StringReplaceSpecialChar(dr[table.Rows[i].Table.Columns[cellIndex]].ToString()), table.Rows[i].Table.Columns.Count));
                        arrSubhead.Remove(arrSubhead[c]);
                        break;
                    }
                    else
                    {
                        bool isBoldComplete = false;
                        if (colValue == "Grand Total" && srNoIndex != -1)
                        {
                            addGrandTotal = true;
                            colValue = "";
                            isGTRow = true;
                        }
                        if ((addGrandTotal) && (colValue == "") && (isFirstCol != 0) && (srNoIndex != -1))
                        {
                            colValue = "Grand Total";
                            addGrandTotal = false;
                            isBoldComplete = true;
                            tableSB.Append(cs.GetBoldOnlyString(!string.IsNullOrEmpty(colValue) ? colValue : "&#45;"));
                        }
                        if (!isBoldComplete)
                        {
                            if (isGTRow)
                                tableSB.Append(cs.GetBoldForGT(!string.IsNullOrEmpty(colValue) ? colValue : "&#45;"));
                            else
                                tableSB.Append(cs.GetCellValue(!string.IsNullOrEmpty(colValue) ? colValue : "&#45;"));
                        }

                    }
                    isFirstCol = isFirstCol + 1;
                }
                tableSB.Append(cs.GetCellRowEndString());
            }
            tableSB.Append(ts.GetTableEndString());
        }
        doc.Body.AddEle(tableSB.ToString());
        if (hdrFooterName.Count > 0)
        {
            for (int i = 0; i < hdrFooterName.Count; i++)
            {
                string _alignment = hdrFooterAlign[i].ToString();
                string _font = hdrFooterFont[i].ToString();

                if (_alignment == "" || _alignment == "@center")
                    doc.Footer.AddEle(Heading2.With(StringReplaceSpecialChar(hdrFooterName[i].ToString())).WithStyle().Align(Align.CENTER).Create());
                else if (_alignment == "@left")
                    doc.Footer.AddEle(Heading2.With(StringReplaceSpecialChar(hdrFooterName[i].ToString())).WithStyle().Align(Align.LEFT).Create());
                else if (_alignment == "@right")
                    doc.Footer.AddEle(Heading2.With(StringReplaceSpecialChar(hdrFooterName[i].ToString())).WithStyle().Align(Align.RIGHT).Create());
            }
        }
        doc.Footer.ShowPageNumber();
        if (!string.IsNullOrEmpty(objIview.IviewFooter))
        {
            objIview.IsWordWithHtml = false; // Change it to non html iview to by pass unwanted parsing.
            doc.AddEle(Paragraph.With(" ").Create());
            string[] footerText = objIview.IviewFooter.Split('|');
            if (footerText.Length > 0)
                for (int i = 0; i < footerText.Length; i++)
                    doc.AddEle(Paragraph.With(StringReplaceSpecialChar(footerText[i])).Create());
        }

        string fileName = objIview.IviewCaption.Replace(",", "");
        fileName = fileName.Replace(" ", "_");

        Response.Clear();
        Response.Buffer = true;
        Response.AddHeader("content-disposition", "attachment;filename=" + fileName + ".doc");
        Response.Charset = "";
        Response.ContentType = "application/vnd.ms-word";
        Response.Output.Write(doc.ToString());
        Response.Flush();
        Response.End();
        //doc.Save(@"d:\" + fileName + ".doc");
    }

    protected string StringReplaceSpecialChar(string value)
    {
        if (objIview.IsWordWithHtml == true)
        {
            value = parseHTML(value); ;
            if (value.Contains("<!--[if gte mso 9]>"))
            {
                value = value.Replace("<!--[if gte mso 9]>", "ô");
                int totalCount = value.Count(x => x == 'ô');
                for (int i = 0; i < totalCount; i++)
                {
                    int startIndex = value.IndexOf("ô");
                    int endIndex = value.IndexOf("<![endif]-->", startIndex);
                    value = value.Remove(startIndex, (endIndex - startIndex) + 12);
                }
            }

            if (value.Contains("<!--[if gte mso 10]>"))
            {
                value = value.Replace("<!--[if gte mso 10]>", "├");
                int totalCount = value.Count(x => x == '├');
                for (int i = 0; i < totalCount; i++)
                {
                    int startIndex = value.IndexOf("├");
                    int endIndex = value.IndexOf("<![endif]-->", startIndex);
                    value = value.Remove(startIndex, (endIndex - startIndex) + 12);
                }
            }

            if (value.Contains("<style>"))
            {
                value = value.Replace("<style>", "☻");
                int totalCount = value.Count(x => x == '☻');
                for (int i = 0; i < totalCount; i++)
                {
                    int startIndex = value.IndexOf("☻");
                    int endIndex = value.IndexOf("</style>", startIndex);
                    value = value.Remove(startIndex, (endIndex - startIndex) + 8);
                }
            }
            value = value.Replace("<o:p>", "");
            value = value.Replace("</o:p>", "");

            value = value.Replace("<![endif]-->", " ");
            value = value.Replace("<!--[if !supportLists]-->", " ");

            value = value.Replace("<span>", " ");
            value = value.Replace("</span>", " ");

            value = value.Replace("<strong>", "╩");
            value = value.Replace("</strong>", "┌");

            value = value.Replace("<b>", "╩");
            value = value.Replace("</b>", "┌");

            value = value.Replace("<p>", "╕");
            value = value.Replace("</p>", "╘");

            value = value.Replace("<ul>", "►");
            value = value.Replace("</ul>", "ô");

            value = value.Replace("<li>", " ");
            value = value.Replace("</li>", "µ");

            value = value.Replace("<ol>", "►");
            value = value.Replace("</ol>", "ô");


            //value = value.Replace("'", "&quot;");
            value = value.Replace("<", "");
            value = value.Replace(">", "");
            value = value.Replace("paraLine", "<w:br/>");
            value = value.Replace("\n", "");
            value = value.Replace("&nbsp;", " ");
            value = value.Replace("&zwj;", "");
            value = value.Replace("&#39;", "'");
            value = value.Replace("&rsquo;", "'");
            value = value.Replace("&rdquo;", "\"");
            value = value.Replace("&ldquo;", "\"");
            value = value.Replace("&ndash", "-");
            value = value.Replace("&ndash;", "-");
            value = value.Replace("&", "&amp;");

            value = value.Replace("!--[endif]--", "");
            value = value.Replace("br/", "<w:br/>");
            value = value.Replace("<br/>", "<w:br/>");
            return value;
        }
        else
        {

            value = value.Replace("<strong>", "");
            value = value.Replace("</strong>", "");
            value = value.Replace("<p>", "");
            value = value.Replace("</p>", "paraLine");
            //value = value.Replace("'", "&quot;");
            value = value.Replace("<", "");
            value = value.Replace(">", "");
            value = value.Replace("paraLine", "<w:br/>");
            value = value.Replace("\n", "<w:br/>");
            value = value.Replace("&nbsp;", " ");
            value = value.Replace("&zwj;", "");
            value = value.Replace("&#39;", "'");
            value = value.Replace("&rsquo;", "'");
            value = value.Replace("&rdquo;", "\"");
            value = value.Replace("&ldquo;", "\"");
            value = value.Replace("&", "&amp;");
            return value;
        }
    }

    private string parseHTML(string html)
    {
        HtmlDocument doc = new HtmlDocument();
        doc.LoadHtml(html);
        HtmlNodeCollection htmlNodes = doc.DocumentNode.SelectNodes("//div | //ul | //p | //table | //ol | //span | //strong | //b");
        using (StringWriter sw = new StringWriter())
        {
            if (htmlNodes != null && htmlNodes.Count > 0)
                foreach (var node in htmlNodes)
                    if (node.HasAttributes)
                        node.Attributes.RemoveAll();

            doc.Save(sw);
            return sw.ToString();
        }
    }

    public void SessExpires()
    {
        Util.Util utilObj = new Util.Util();
        string url = utilObj.SESSEXPIRYPATH;
        Response.Write("<script>" + Constants.vbCrLf);
        Response.Write("parent.parent.location.href='" + url + "';");
        Response.Write(Constants.vbCrLf + "</script>");
    }

    public void GetDataTypeOfAColumn(string value)
    {
        if (colType[colHead.IndexOf(value)].ToString() == "c")
            arrColType.Add("<w:jc w:val=\"left\"/>");
        else if (colType[colHead.IndexOf(value)].ToString() == "n")
            arrColType.Add("<w:jc w:val=\"right\"/>");
        else if (colType[colHead.IndexOf(value)].ToString() == "d")
            arrColType.Add("<w:jc w:val=\"center\"/>");
    }

    public void ExportToWord()
    {
        string Ikey = string.Empty;
        if (Session["ivKey"] != null)
            Ikey = Session["ivKey"].ToString();
        else if (Request.QueryString["ivKey"] != null)
            Ikey = Request.QueryString["ivKey"].ToString();
        objIview = (IviewData)Session[Ikey];
        objIview.ShowHiddengridCols = new ArrayList();
        objIview.ReportHdrs = new ArrayList();

        string sid = HttpContext.Current.Session["nsessionid"].ToString();

        DataTable dt = new DataTable();
        //dt = objIview.DtCurrentdata.Clone();

        if (objIview.IsIviewStagLoad)
        {

            for (int rCnt = 0; rCnt < objIview.DtCurrentdata.Rows.Count; rCnt++)
            {
                dt.ImportRow(objIview.DtCurrentdata.Rows[rCnt]);
            }
            //colHide = (ArrayList)objIview.ColHide.Clone();
        }
        else
        {
            dt = GetFullData();
        }

        int dtcount = dt.Columns.Count;
        if (dt != null && dt.Rows.Count > 0)
        {
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                if (dt.Columns[j].ColumnName.Contains("html_"))
                {
                    colHide[j] = "false";
                    string oldColName = dt.Columns[j].ColumnName.Replace("html_", "");

                    // to hide the columns if column is hidden and column with prefix as html_
                    if (objIview.ShowHideCols != null)
                    {
                        if (objIview.ShowHideCols.IndexOf(oldColName) > -1)
                            colHide[j] = "true";
                    }
                }
            }

            int count = 0;
            foreach (DataRow item in dt.Rows)
            {
                foreach (var cell in item.ItemArray)
                {
                    if (cell.ToString().ToLower() == "subhead")
                        arrSubhead.Add(count);
                }
                count++;
            }
            if (dt.Columns.Count < colHide.Count)
            {
                colHide.RemoveAt(1);
                colHide.RemoveAt(1);

                colHead.RemoveAt(1);
                colHead.RemoveAt(1);

                colType.RemoveAt(1);
                colType.RemoveAt(1);
            }

            if (dt.Columns.Count == colHide.Count)
            {
                for (int i = colHide.Count - 1; i >= 0; i--)
                    if (colHide[i].ToString() == "true" || dt.Columns[i].ColumnName == "axrowtype" || dt.Columns[i].ColumnName == "rowno" || dt.Columns[i].ColumnName == "axp__font")
                        //if hidden column are used in hide column 
                        if (objIview.ShowHiddengridCols != null)
                            if (objIview.ShowHiddengridCols.IndexOf(dt.Columns[i].ColumnName) > -1)
                            {
                                // To remove the normal column if column cantains html_column and is visible
                                int indx = -1;
                                string removeColumn = string.Empty;
                                if (dt.Columns[i].ColumnName.Contains("html_"))
                                {
                                    //do nothing
                                }
                                else
                                {
                                    removeColumn = "html_" + dt.Columns[i].ColumnName;
                                }
                            }
                            else
                            {
                                dt.Columns.RemoveAt(i);
                                colHead.RemoveAt(i);
                                colHide.RemoveAt(i);
                                colType.RemoveAt(i);
                            }
                        else
                        {
                            dt.Columns.RemoveAt(i);
                            colHead.RemoveAt(i);
                            colHide.RemoveAt(i);
                            colType.RemoveAt(i);
                        }
            }


            for (int hIdx = dt.Columns.Count - 1; hIdx >= 0; hIdx--)
            {
                int cIdx = -1, sHIdx = -1;
                cIdx = colHide.IndexOf(dt.Columns[hIdx].ColumnName);

                //condition for removeing hide columns which are checked in gridview 
                if (objIview.ShowHideCols != null)
                    sHIdx = objIview.ShowHideCols.IndexOf(dt.Columns[hIdx].ColumnName);

                if ((cIdx != -1) || (sHIdx != -1))
                {
                    dt.Columns.RemoveAt(hIdx);
                    colHead.RemoveAt(hIdx);
                }
            }
            CreateDocument(dt);
        }
    }

    public DataTable GetFullData()
    {
        DataTable dtData = new DataTable();
        string paramvalues = string.Empty;
        string pXml = string.Empty;
        try
        {
            DataSet ds = CallWebService();

            dtData = ds.Tables["row"].Copy();
        }
        catch (Exception Ex) { }
        return dtData;
    }
    public string GetParameterXML(string paramvalues)
    {

        string str = string.Empty;
        string nXml = string.Empty;

        str = paramvalues;
        string[] strp = objUtil.AxSplit1(str, "~");
        int indx = 0;

        for (indx = 0; indx <= strp.Length - 1; indx++)
        {
            if (!string.IsNullOrEmpty(strp[indx]))
            {
                string[] arrparam = strp[indx].ToString().Split(',');
                string pName = objUtil.CheckSpecialChars(arrparam[0].ToString());
                string pValue = objUtil.CheckSpecialChars(arrparam[1].ToString());

                if (pValue.Contains("`") == true)
                {
                    pValue = pValue.Replace("`", ",");
                }
                nXml = nXml + "<" + pName + ">";
                nXml = nXml + pValue;
                nXml = nXml + "</" + pName + ">";
            }
        }
        return nXml;
    }
    private DataSet CallWebService()
    {
        string iName = string.Empty;
        string sortCol = string.Empty;
        string sortOrd = string.Empty;
        string filterCol = string.Empty;
        string filterColVal = string.Empty;
        string filterValue1 = string.Empty;
        string filterOpr = string.Empty;
        string filename = string.Empty;
        string sid = string.Empty;
        string nXml = string.Empty;
        string errorLog = string.Empty;
        LogFile.Log logobj = new LogFile.Log();

        if (Session["ivname"] != null)
            iName = Session["ivname"].ToString();
        else if (Request.QueryString["ivname"] != null)
            iName = Request.QueryString["ivname"].ToString();
        if (Session["sOrder"] != null)
            sortOrd = Session["sOrder"].ToString();
        if (Session["sColumn"] != null)
            sortCol = Session["sColumn"].ToString();
        if (Session["fcolopr"] != null)
            filterOpr = Session["fcolopr"].ToString();
        if (Session["fCol"] != null)
            filterCol = Session["fCol"].ToString();
        if (Session["fColVal"] != null)
            filterColVal = Session["fColVal"].ToString();
        if (Session["fColVal2"] != null)
            filterColVal = Session["fColVal2"].ToString();
        string typeIvOrLv = "";
        if (Request.QueryString["typeIvOrLv"] != null)
            typeIvOrLv = Request.QueryString["typeIvOrLv"].ToString();

        string ivParams = string.Empty;
        if (Session["AxIvExportParams-" + iName] != null)
            ivParams = Session["AxIvExportParams-" + iName].ToString();

        filename = "GetLView-" + iName;
        sid = Session["nsessionid"].ToString();

        string curRecord = "";
        if (Request.QueryString["curRecord"] != null)
        {
            curRecord = Request.QueryString["curRecord"].ToString();
        }

        if (ivParams != string.Empty)
        {
            StringBuilder sbPVal = new StringBuilder();
            string[] pairs = ivParams.Split('~');
            foreach (var pair in pairs)
            {
                string[] keyValue = pair.Split('♠');
                string kyval = keyValue[1];
                kyval = kyval.Replace("&grave;", "~");
                XElement element = new XElement(keyValue[0], kyval);
                sbPVal.Append(element.ToString());
            }
            ivParams = sbPVal.ToString();
        }

        errorLog = logobj.CreateLog("Getting Iview Data.", sid, filename, "new");
        string _thisList = string.Empty;
        if (typeIvOrLv == "true")
            _thisList = " purpose=\"list\" ";
        if (curRecord == "")
            nXml = "<root " + _thisList + " headercached='false' name ='" + iName + "' axpapp ='" + Session["project"].ToString() + "' sessionid = '" + sid + "' appsessionkey='" + HttpContext.Current.Session["AppSessionKey"].ToString() + "' username='" + HttpContext.Current.Session["username"].ToString() + "' trace = '" + errorLog + "' pageno='0' firsttime='yes' sorder='" + sortOrd + "' scol='" + sortCol + "' fcolopr='" + filterOpr + "' fcolnm='" + filterCol + "' fcolval1='" + filterColVal + "' fcolval2='" + filterValue1 + "'><params> ";
        else
            nXml = "<root " + _thisList + " headercached='false' name ='" + iName + "' axpapp ='" + Session["project"].ToString() + "' sessionid = '" + sid + "' appsessionkey='" + HttpContext.Current.Session["AppSessionKey"].ToString() + "' username='" + HttpContext.Current.Session["username"].ToString() + "' trace = '" + errorLog + "' pageno='1' pagesize='" + curRecord + "' firsttime='yes' sqlpagination='true' getrowcount='false' gettotalrows='false' smartview='true'><params> ";
        nXml = nXml + ivParams;// objIview.iviewParams.IviewParamString;
        nXml = nXml + "</params>";
        nXml = nXml + Session["axApps"].ToString() + Application["axProps"].ToString() + HttpContext.Current.Session["axGlobalVars"].ToString() + HttpContext.Current.Session["axUserVars"].ToString() + "</root>";

        string ires = string.Empty;
        ASBExt.WebServiceExt objWebServiceExt = new ASBExt.WebServiceExt();
        try
        {
            objIview.requestJSON = true;
            ires = objWebServiceExt.CallGetIViewWS(iName, nXml, "", objIview);
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
        //DataSet ds1 = SetIviewComponents(ires);
        SetHeaderFooters(ires);
        dynamic jsonObject = JsonConvert.DeserializeObject(ires);
        DataSet ds1 = ConvertToDataSet(jsonObject);
        return ds1;

    }

    public DataSet ConvertToDataSet(dynamic jsonObject)
    {
        DataSet dataSet = new DataSet();
        JObject jsonObjectNew = jsonObject.data.headrow;
        foreach (var property in jsonObjectNew.Properties())
        {
            string propertyName = property.Name;
            JToken hideToken = property.Value.SelectToken("@hide");
            JToken typeToken = property.Value.SelectToken("@type");
            JToken textToken = property.Value.SelectToken("#text");
            string hideValue = hideToken != null ? hideToken.ToString() : null;
            string typeValue = typeToken != null ? typeToken.ToString() : null;
            string textValue = textToken != null ? textToken.ToString() : null;
            if (propertyName == "rowno")
            {
                colHide.Add(hideValue);
                colHead.Add("Sr. No.");
                colType.Add("c");
            }
            else if (propertyName != "pivotghead")
            {
                colHide.Add(hideValue);
                colHead.Add(textValue);
                colType.Add(typeValue);
            }
        }


        // Convert rows to DataTable
        DataTable rowsTable = new DataTable("row");

        // Add columns dynamically
        foreach (var row in jsonObject.data.row)
        {
            foreach (JProperty property in row)
            {
                if (!rowsTable.Columns.Contains(property.Name))
                {
                    rowsTable.Columns.Add(new DataColumn(property.Name, typeof(string)));
                }
            }
        }

        // Add rows dynamically
        foreach (var row in jsonObject.data.row)
        {
            DataRow dataRow = rowsTable.NewRow();
            foreach (JProperty property in row)
            {
                dataRow[property.Name] = property.Value.ToString();
            }
            rowsTable.Rows.Add(dataRow);
        }
        dataSet.Tables.Add(rowsTable);

        return dataSet;
    }

    public void SetHeaderFooters(string sJson)
    {
        JObject jsonObject = JObject.Parse(sJson);
        JObject reporthf = (JObject)jsonObject["data"]["reporthf"];

        try
        {
            string hideprojname = reporthf["hideprojname"].ToString();
            if (hideprojname != null && hideprojname.ToString() == "@t")
            {
                hideProjeName = true;
            }
        }
        catch (Exception ex) { }

        JObject header = (JObject)reporthf["header"];
        JObject footer = (JObject)reporthf["footer"];
        if (header != null)
        {
            foreach (var item in header)
            {
                objIview.ReportHdrs.Add((string)item.Value["text"]);
                hdrFont.Add((string)item.Value["font"]);
                if (item.Value["header_aline"] != null)
                {
                    hdrAlign.Add((string)item.Value["header_aline"]);
                }
                else if (hdrAlign.Count > 0 && hdrAlign[0] != null)
                {
                    hdrAlign.Add(hdrAlign[0]);
                }
                else
                {
                    hdrAlign.Add("@center");
                }
            }
        }
        if (footer != null)
        {
            foreach (var item in footer)
            {
                hdrFooterName.Add((string)item.Value["text"]);
                hdrFooterFont.Add((string)item.Value["font"]);
                if (item.Value["footer_aline"] != null)
                {
                    hdrFooterAlign.Add((string)item.Value["footer_aline"]);
                }
                else if (hdrFooterAlign.Count > 0 && hdrFooterAlign[0] != null)
                {
                    hdrFooterAlign.Add(hdrFooterAlign[0]);
                }
                else
                {
                    hdrFooterAlign.Add("@center");
                }
            }
        }
    }
    public DataSet SetIviewComponents(string sXml)
    {
        XmlDocument xmlDoc = new XmlDocument();
        XmlNodeList xmlNList;
        XmlNodeList cbaseDataNodes;
        XmlNodeList baseDataNodes;
        XmlNodeList baseChildList;
        DataSet ds = new DataSet();
        StringWriter sw = new StringWriter();

        xmlDoc.LoadXml(sXml);
        baseDataNodes = xmlDoc.SelectNodes("//headrow");

        foreach (XmlNode baseDataNode in baseDataNodes)
        {
            baseChildList = baseDataNode.ChildNodes;
            foreach (XmlNode baseChildNode in baseChildList)
            {
                //if (baseChildNode.Attributes["hide"] != null)
                //{
                if (baseChildNode.Name != "pivotghead")
                {
                }
                //if (baseChildNode.Name == "axrowtype" || baseChildNode.Name == "axp__font")
                //{
                //    continue;
                //}
                if (baseChildNode.Name == "rowno")
                {
                    colHide.Add(baseChildNode.Attributes["hide"].Value);
                    colHead.Add("Sr. No.");
                    colType.Add("c");
                }
                else
                {
                    if (baseChildNode.Name != "pivotghead")
                    {

                        colHide.Add(baseChildNode.Attributes["hide"].Value);
                        colHead.Add(baseChildNode.InnerText);
                        colType.Add(baseChildNode.Attributes["type"].Value);
                    }
                }
                //}

            }
        }

        xmlNList = xmlDoc.SelectNodes("//data/comps");
        objIview.ReportHdrs.Clear();

        try
        {
            foreach (XmlNode compNode in xmlNList)
            {
                cbaseDataNodes = compNode.ChildNodes;
                foreach (XmlNode cbaseDataNode in cbaseDataNodes)
                {
                    string sNodeName = cbaseDataNode.Name;

                    if (sNodeName.Equals("x__head"))
                        objIview.IviewCaption = cbaseDataNode.Attributes["caption"].Value;
                    else
                    {
                        if (sNodeName.Equals("header"))
                        {
                            if (cbaseDataNode.HasChildNodes)
                            {
                                for (int i = 0; i < cbaseDataNode.ChildNodes.Count; i++)
                                {
                                    objIview.ReportHdrs.Add(cbaseDataNode.ChildNodes[i].InnerText);
                                }
                            }
                        }
                    }
                }

            }

            XmlTextWriter xSw = new XmlTextWriter(sw);
            xmlDoc.WriteTo(xSw);
            string nXML = sw.ToString();
            StringReader sr = new StringReader(nXML);
            ds.ReadXml(sr);
        }
        catch (Exception Ex) { }
        return ds;
    }

    public override void VerifyRenderingInServerForm(Control control)
    {
        /* Confirms that an HtmlForm control is rendered for the specified ASP.NET
           server control at run time. */
    }

    private string GetReportHeaders(IviewData objIview)
    {
        StringBuilder strHeaders = new StringBuilder();
        for (int i = 1; i < objIview.ReportHdrs.Count; i++)
        {
            strHeaders.Append("<div> <h3 align=center><span >");
            strHeaders.Append("<font style='color:black;font-size:13px'>");
            strHeaders.Append(objIview.ReportHdrs[i].ToString() + "</font></span> </h3></div>");
        }
        return strHeaders.ToString();
    }

    private string GetSubHeadings(ArrayList subHeads)
    {
        StringBuilder strSubHeads = new StringBuilder();
        for (int i = 0; i < subHeads.Count; i++)
        {
            strSubHeads.Append("<div> <h3 align=center><span style=");
            strSubHeads.Append(HtmlTextWriter.DoubleQuoteChar);
            strSubHeads.Append("font-weight:bold; font-size:8px; font-family:'Segoe UI'; color: #81040a;");
            strSubHeads.Append(HtmlTextWriter.DoubleQuoteChar);
            strSubHeads.Append(">" + subHeads[i].ToString() + "</span> </h3></div>");
        }
        return strSubHeads.ToString();
    }

}



