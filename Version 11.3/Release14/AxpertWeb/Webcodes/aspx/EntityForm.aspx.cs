using CacheMgr;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;
using System.Configuration;
using System.Xml;
using System.Collections;

public partial class aspx_EntityForm : System.Web.UI.Page
{
    #region Variable Declaration
    Util.Util util;
    public string proj = string.Empty;
    public string sid = string.Empty;
    public string language = string.Empty;
    public string trace = string.Empty;
    public string user = string.Empty;
    public string transId = string.Empty;
    public string AxRole = string.Empty;
    public string rid = string.Empty;
    public string schemaName = string.Empty;
    public string entityName = string.Empty;
    public string entityTransId = string.Empty;
    public string recordId = "0";
    public string keyValue = string.Empty;
    public string selectedRelatedDataFields = string.Empty;
    public string selectedDisplayFields = string.Empty;

    LogFile.Log logobj = new LogFile.Log();
    ASBExt.WebServiceExt objWebServiceExt = new ASBExt.WebServiceExt();
    public string structXml = string.Empty;
    public Custom customObj = null;
    string actstr = " act='load' ";
    string actstrType = "load";
    string loadResult = string.Empty;
    string strGlobalVar = string.Empty;
    string fileName = string.Empty;
    public string errorLog = string.Empty;
    string queryStr = string.Empty;
    public string tstCaption = string.Empty;
    public string menuBreadCrumb = string.Empty;
    public string tstName = string.Empty;
    ArrayList paramNames = new ArrayList();
    ArrayList paramValues = new ArrayList();
    #endregion

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.QueryString["tstid"] != null)
        {
            entityTransId = Request.QueryString["tstid"].ToString();
            entityName = Request.QueryString["ename"].ToString();
            if(Request.QueryString["recid"] != null)
                recordId = Request.QueryString["recid"].ToString();

            if (Request.QueryString["keyval"] != null)
                keyValue = Request.QueryString["keyval"].ToString() ?? "";
            util = new Util.Util();
            UpdateParamsFrmQueryStr();
            
            util.IsValidSession();
            //ResetSessionTime();
            if (Session["project"] == null)
            {
                SessionExpired();
                return;
            }
            else
            {
                SetGlobalVariables();
                string keyField = GetEntityKeyField(entityTransId);
                selectedRelatedDataFields = GetSelectedRelatedDataFields(entityTransId);
                selectedDisplayFields = GetSelectedDisplayFields(entityTransId);

                string entityFormMetaData = GetEntityFormMetaData(entityTransId);

                string entityFormData = GetEntityFormData();
                string subEntityMetaData = GetSubEntityMetaData(entityTransId);

                string scriptsUrlPath = Application["ScriptsurlPath"].ToString();
                hdnScriptsUrlpath.Value = scriptsUrlPath;

                string axDisallowCreate = "";
                if (HttpContext.Current.Session["AxDisallowCreate"] != null && HttpContext.Current.Session["AxDisallowCreate"].ToString() != "")
                    axDisallowCreate = HttpContext.Current.Session["AxDisallowCreate"].ToString();


                ScriptManager.RegisterStartupScript(this, this.GetType(), "SubEntityListData", "var entityFormMetaData = `" + entityFormMetaData + "`;var entityFormData = `" + entityFormData + "`;var subEntityMetaData = `" + subEntityMetaData + "`;  var relatedDataFields = `" + selectedRelatedDataFields + "`; var entityKeyField = `" + keyField + "`; var relatedDataDisplayFields = `" + selectedDisplayFields + "`; var axDisallowCreate =  `" + axDisallowCreate + "`;", true);
            }
        }
        else
        {
            ScriptManager.RegisterStartupScript(this, this.GetType(), "EntityMissing", "alert('Entity details name is missing.')", true);
        }
    }

    private string GetEntityFormData()
    {
        TStructDef strObj = null;
        CacheManager cacheMgr = GetCacheObject();
        strObj = GetStrObject(cacheMgr);
        if (strObj == null)
            return "";
        structXml = strObj.structRes;

        string visibleDCs = string.Empty;
        visibleDCs = strObj.GetVisibleDCs();

        return LoadStructure(strObj);
    }
    private string LoadStructure(TStructDef strObj)
    {
        string structRes = strObj.structRes;
        string loadXml = string.Empty;
        string loadRes = string.Empty;
        bool isDraft = false;
        string draftID = string.Empty;
        string draftLoadStr = string.Empty;
        string AxDisplayAutoGenVal = Session["AxDisplayAutoGenVal"].ToString();
        string isTstParamLoad = string.Empty;
        //UpdateParamsFrmQueryStr();
        string dvRefreshFromLoadModern = "false";
        bool wsPerfFormLoad = strObj.wsPerfFormLoadCall;

        string queryString = string.Empty;
        queryString = GetParamValues();
        string visibleDCs = string.Empty;
        visibleDCs = strObj.GetVisibleDCs();
        logobj.CreateLog("    Recordid = " + rid, sid, fileName, "");

        if (rid != "0")
        {
            //LoadRecidFromList();
            string ConfigDataAttr = string.Empty;
            string AxVarAttr = string.Empty;
            string dbmemvarsXML = string.Empty;
            dbmemvarsXML = util.GetDBMemVarsXML(transId);
            string cdVarsXML = util.GetConfigDataVarsXML(transId);
            if (cdVarsXML == string.Empty)
            {
                try
                {
                    if (HttpContext.Current.Session["configparam_transids"] != null && HttpContext.Current.Session["configparam_transids"].ToString() != "")
                    {
                        string[] dbVarformloadList = HttpContext.Current.Session["configparam_transids"].ToString().Split(',');
                        var isDbVarExist = dbVarformloadList.AsEnumerable().Where(x => x == transId).ToList();
                        if (isDbVarExist.Count > 0)
                        {
                            ConfigDataAttr = " configdata_cached='f' ";
                        }
                    }
                }
                catch (Exception ex)
                { }
            }
            else
            {
                //GetConfigDataFromCache(transId);
            }

            if (dbmemvarsXML == string.Empty)
            {
                try
                {
                    if (HttpContext.Current.Session["forms_transids"] != null && HttpContext.Current.Session["forms_transids"].ToString() != "")
                    {
                        string[] dbVarformloadList = HttpContext.Current.Session["forms_transids"].ToString().Split(',');
                        var isDbVarExist = dbVarformloadList.AsEnumerable().Where(x => x == transId).ToList();
                        if (isDbVarExist.Count > 0)
                        {
                            AxVarAttr = " axvars_cached='f' ";
                        }
                    }
                }
                catch (Exception ex) { }
            }
            else
            {
                dbmemvarsXML = dbmemvarsXML.Replace("<dbmemvars>", "").Replace("</dbmemvars>", "");
                ParseAxMemVarResult(dbmemvarsXML, transId, false);
            }


            string imagefromdb = "false";
            if (Session["AxpSaveImageDb"] != null)
                imagefromdb = Session["AxpSaveImageDb"].ToString();
            loadXml = loadXml + "<root" + actstr + AxVarAttr + ConfigDataAttr + " ispegedit='false' imagefromdb='" + imagefromdb + "' axpapp='" + proj + "' sessionid='" + sid + "' appsessionkey='" + Session["AppSessionKey"].ToString() + "' username='" + Session["username"].ToString() + "' transid='" + transId + "' recordid='" + rid + "' dcname='" + visibleDCs + "' trace='" + errorLog + "'>";
            logobj.CreateLog("    Loading Tstruct.", sid, fileName, "");
            loadXml += Session["axApps"].ToString() + Application["axProps"].ToString() + Session["axGlobalVars"].ToString() + dbmemvarsXML + cdVarsXML + Session["axUserVars"].ToString();
            loadXml += "</root>";
            //loadXml = util.ReplaceImagePath(loadXml);//AxpImagePath needs to be replaced with empty if the "save Image in DB" key exist in advance configuration. 
            loadRes = objWebServiceExt.CallLoadDataWS(transId, loadXml, structRes, rid, proj);
            loadRes = loadRes.Split('♠')[1];
        }
        else {
            isTstParamLoad = "true";
            loadXml = loadXml + "<root" + actstr  + " axpapp='" + proj + "' sessionid='" + sid + "' transid='" + transId + "' recordid='" + rid + "' dcname='" + visibleDCs + "' trace='" + errorLog + "' appsessionkey='" + Session["AppSessionKey"].ToString() + "' username='" + Session["username"].ToString() + "'>";
            logobj.CreateLog("    Opening Tstruct.", sid, fileName, "");
            loadXml += queryString;
            loadXml += Session["axApps"].ToString() + Application["axProps"].ToString() + Session["axGlobalVars"].ToString() + Session["axUserVars"].ToString();
            loadXml += "</root>";
            DateTime stTime11 = DateTime.Now;
            if (queryString != "" && actstrType.ToLower() == "open" && !strObj.wsPerfFormLoadCall)//Any parameter is select + sql, act is open and WSFLD is false then need to forcelly call the dofomrload to get back fill field values.
            {
                XmlDocument xmlDocParam = new XmlDocument();
                xmlDocParam.LoadXml("<root>" + queryString + "</root>");
                XmlNode listNode = xmlDocParam.SelectSingleNode("//root");
                foreach (XmlNode ndName in listNode.ChildNodes)
                {
                    int pIndx = strObj.GetFieldIndex(ndName.Name);
                    if (pIndx > -1)
                    {
                        TStructDef.FieldStruct pfld = (TStructDef.FieldStruct)strObj.flds[pIndx];
                        if (pfld.isFieldSql == "True" && pfld.moe == "Select")
                        {
                            isTstParamLoad = "true";
                            break;
                        }
                    }
                }
            }

            // Call service
            if (isTstParamLoad == "true")
            {
                AxDisplayAutoGenVal = "false";
                wsPerfFormLoad = true;
                loadRes = objWebServiceExt.CallDoFormLoadWS(transId, loadXml, structRes);
                //requestProcess_logtime += loadRes.Split('♠')[0];
                loadRes = loadRes.Split('♠')[1];
                //loadRes = GetConfigDataVars(strObj, loadRes, transId);
                //loadRes = GetAxMemVars(strObj, loadRes, transId);
                //HandleFormLoadErr(loadRes, queryString);
            }
        }
        loadRes = loadRes.Trim();
        loadRes = loadRes.Replace("\n", "");
        loadRes = loadRes.Replace("\\", ";bkslh");
        loadRes = loadRes.Replace("'", "&quot;");
        return loadRes;
    }

    private string GetParamValues()
    {
        StringBuilder paramXml = new StringBuilder();
        for (int qs = 0; qs <= paramNames.Count - 1; qs++)
        {
            paramValues[qs] = CheckSpecialChars(paramValues[qs].ToString());
            if (paramNames[qs].ToString().ToLower() != "transid" && paramNames[qs].ToString().ToLower() != "themode" && paramNames[qs].ToString().ToLower() != "hltype" && paramNames[qs].ToString().ToLower() != "torecid" && paramNames[qs].ToString().ToLower() != "layout" && paramNames[qs].ToString().ToLower() != "act" && paramNames[qs].ToString().ToLower() != "loadformdata" && paramNames[qs].ToString().ToLower() != "ename" && paramNames[qs].ToString().ToLower() != "tstid" && paramNames[qs].ToString().ToLower() != "recid")
            {
                paramXml.Append("<" + paramNames[qs].ToString() + ">" + paramValues[qs].ToString() + "</" + paramNames[qs].ToString() + ">");
            }
        }
        return paramXml.ToString();
    }

    private void UpdateParamsFrmQueryStr()
    {
        for (int qn = 1; qn <= Request.QueryString.Count - 1; qn++)
        {
            if (Request.QueryString.AllKeys[qn] == null)
                continue;           
            else
            {
                if (Request.QueryString.AllKeys[qn].ToLower() == "axfromhyperlink" || Request.QueryString.AllKeys[qn].ToLower() == "axpop" || Request.QueryString.AllKeys[qn].ToLower() == "axhyptstrefresh" || Request.QueryString.AllKeys[qn].ToLower() == "recpos" || Request.QueryString.AllKeys[qn].ToLower() == "pagetype" || Request.QueryString.AllKeys[qn].ToLower() == "curpage" || Request.QueryString.AllKeys[qn].ToLower() == "dynnavtst" || Request.QueryString.AllKeys[qn].ToLower() == "openeriv" || Request.QueryString.AllKeys[qn].ToLower() == "isduptab" || Request.QueryString.AllKeys[qn].ToLower() == "fromprocess" || Request.QueryString.AllKeys[qn].ToLower() == "ispegedit" || Request.QueryString.AllKeys[qn].ToLower() == "isiv" || Request.QueryString.AllKeys[qn].ToLower() == "axsplit" || Request.QueryString.AllKeys[qn].ToLower() == "hdnbelapstime" || Request.QueryString.AllKeys[qn].ToLower() == "reqproc_logtime" || Request.QueryString.AllKeys[qn].ToLower() == "hltype" || Request.QueryString.AllKeys[qn].ToLower() == "torecid" || Request.QueryString.AllKeys[qn].ToLower() == "act" || Request.QueryString.AllKeys[qn].ToLower() == "dummyload" || Request.QueryString.AllKeys[qn].ToLower() == "loadformdata" || Request.QueryString.AllKeys[qn].ToLower() == "ename" || Request.QueryString.AllKeys[qn].ToLower() == "tstid" || Request.QueryString.AllKeys[qn].ToLower() == "keyval" || Request.QueryString.AllKeys[qn].ToLower() == "recid")
                    continue;
                // eliminate Name from querystring            
                paramNames.Add(Request.QueryString.Keys[qn]);
                string val = string.Empty;
                val = Request.QueryString.Get(qn);
                val = val.Replace("--.--", "&");
                val = val.Replace("amp;", "&");

                //val = val.Replace("%2b", "+");
                val = util.CheckReverseUrlSpecialChars(val);
                val = util.ReverseCheckSpecialChars(val);
                paramValues.Add(val);
                if (val.Contains("'")) val = val.Replace("'", "%27");
                val = val.Replace(";bkslh", "%5C");
                val = val.Replace("\\", "%5C");
                
            }
        }
    }

    public void ParseAxMemVarResult(string memvarJson, string transId, bool isNotFromLoadData = true)
    {
        try
        {
            StringBuilder amParamlist = new StringBuilder();
            if (memvarJson != string.Empty)
            {
                if (isNotFromLoadData)
                {
                    string dbmemvars = "<dbmemvars>" + memvarJson + "</dbmemvars>";
                    //Session["dbmemvars_" + transId] = dbmemvars;
                    try
                    {
                        string schemaname = string.Empty;
                        if (HttpContext.Current.Session["dbuser"] != null)
                            schemaname = HttpContext.Current.Session["dbuser"].ToString();
                        string user = HttpContext.Current.Session["user"].ToString();
                        string fdKey = Constants.DBMEMVARSFORMLOAD;
                        FDW fdwObj = FDW.Instance;
                        bool iscahced = fdwObj.SaveInRedisServer(util.GetRedisServerkey(fdKey, transId, user), dbmemvars, Constants.DBMEMVARSFORMLOAD, schemaname);
                        if (!iscahced)
                            Session["dbmemvars_" + transId] = dbmemvars;
                    }
                    catch (Exception exc)
                    {
                        Session["dbmemvars_" + transId] = dbmemvars;
                    }
                }

                dynamic dynJson = JsonConvert.DeserializeObject(memvarJson);
                string varDataType = string.Empty;
                int paramCnt = 0;
                foreach (var item in dynJson[0])
                {
                    string nodeName = item.Name;
                    string nodeVal = item.First.Value == null ? "" : item.First.Value.ToString();
                    nodeVal = Regex.Replace(nodeVal, "\"", "&quot;");
                    nodeName = nodeName.Remove(nodeName.Length - 1, 1);
                    amParamlist.Append("AxMemParameters[" + paramCnt + "]=" + "\"" + nodeName + "~" + nodeVal + "\";");
                    paramCnt++;
                }
                string AxMem_Scripts = "<script language='javascript' type='text/javascript' >" + amParamlist.ToString() + "</script>";
                //tstScript.Append(AxMem_Scripts);
            }
        }
        catch (Exception ex)
        {
            logobj.CreateLog("ParseAxMemVarResult -" + ex.Message + "- JSON-" + memvarJson, HttpContext.Current.Session.SessionID, "ParseAxMemVarResult", "new");
        }
    }

    private void GetFormLoadAxMemVers(TStructDef strObj, string transId, string amQueryString)
    {
        try
        {
            LogFile.Log logobj = new LogFile.Log();
            string proj = HttpContext.Current.Session["project"].ToString();
            string sid = HttpContext.Current.Session["nsessionid"].ToString();
            string fileName = "FormLoadAxMemVers-" + transId;
            string errorLog = logobj.CreateLog("Get FormLoad AxMemVers.", sid, fileName, "new");
            //string loadXml = "<root axpapp='" + proj + "' sessionid='" + sid + "' axmemfunc='" + strObj.AxMemVarFunction + "' trace='" + errorLog + "' appsessionkey='" + HttpContext.Current.Session["AppSessionKey"].ToString() + "' username='" + HttpContext.Current.Session["username"].ToString() + "'>";
            string loadXml = "<root axpapp='" + proj + "' sessionid='" + sid + "' transid='" + transId + "' trace='" + errorLog + "' appsessionkey='" + HttpContext.Current.Session["AppSessionKey"].ToString() + "' username='" + HttpContext.Current.Session["username"].ToString() + "'>";
            loadXml += amQueryString;
            loadXml += HttpContext.Current.Session["axApps"].ToString() + HttpContext.Current.Application["axProps"].ToString() + HttpContext.Current.Session["axGlobalVars"].ToString() + HttpContext.Current.Session["axUserVars"].ToString();
            loadXml += "</root>";

            ASBExt.WebServiceExt objWebServiceExt = new ASBExt.WebServiceExt();
            string axMemRes = objWebServiceExt.CallAxMemVarAvailable(transId, loadXml);
            try
            {
                string[] orgResult = axMemRes.Split(new[] { "*#*" }, StringSplitOptions.None);
                axMemRes = orgResult[1];//0: Time,1: Memvar result

            }
            catch (Exception ex) { }
            ParseAxMemVarResult(axMemRes, transId);
        }
        catch (Exception ex)
        {
            LogFile.Log logobj = new LogFile.Log();
            logobj.CreateLog("GetFormLoadAxMemVers -" + ex.Message + "- QueryString-" + amQueryString, HttpContext.Current.Session.SessionID, "GetFormLoadAxMemVers", "new");
        }
    }


    private void SetGlobalVariables()
    {
        if (!IsPostBack)
        {

            proj = Session["project"].ToString();
            //ViewState["proj"] = proj;
            user = Session["user"].ToString();
            //ViewState["user"] = user;
            sid = Session["nsessionid"].ToString();
            //ViewState["sid"] = sid;
            AxRole = Session["AxRole"].ToString();
            //ViewState["AxRole"] = AxRole;
            language = Session["language"].ToString();
            //ViewState["language"] = language;
            transId = Request.QueryString["tstid"].ToString();
            if (!util.IsTransIdValid(transId))
                Response.Redirect(Constants.PARAMERR);
            Session.Add("transid", transId);
            //ViewState["tid"] = transId;
            fileName = "opentstruct-" + transId;
            errorLog = logobj.CreateLog("Loading Structure.", sid, fileName, "new");

            if ((!string.IsNullOrEmpty(Request.QueryString["recid"])))
            {
                rid = Request.QueryString["recid"];
                rid = CheckSpecialChars(rid);
                //ViewState["rid"] = rid;
            }
            else
            {
                rid = "0";
            }
            if (Request.QueryString.Count < 2 && (Session["lstRecordIds"] != null || Session["recordTransId"] != null || Session["navigationInfoTable"] != null) || Request.QueryString.ToString().Contains("axpdraftid"))
                util.ClearSession();


        }
        else
        {
            proj = Session["project"].ToString();
            sid = Session["nsessionid"].ToString();
            user = Session["user"].ToString();
            if (Request.QueryString["tstid"] != null && Request.QueryString["tstid"].ToString() != "")
                transId = Request.QueryString["tstid"].ToString();
            else
                transId = Session["transid"].ToString();
            AxRole = Session["AxRole"].ToString();
            language = Session["language"].ToString();
        }

        try
        {
            if (Request.QueryString["openerIV"] != null)
            {
                if (Request.QueryString["isIV"] != null && Request.QueryString["isIV"].ToString() == "true")
                    Session["openerIV"] = Request.QueryString["openerIV"].ToString() + "~IV";
                else if (Request.QueryString["isIV"] != null && Request.QueryString["isIV"].ToString() == "false")
                    Session["openerIV"] = Request.QueryString["openerIV"].ToString() + "~LV";
            }
            else
            {
                Session.Remove("openerIV");
            }
        }
        catch (Exception ex) { }

        try
        {
            if (Request.QueryString["isDupTab"] != null)
            {
                Session["isDupTab"] = Request.QueryString["isDupTab"].ToString();
            }
            else
            {
                Session["isDupTab"] = "false";
            }
        }
        catch (Exception ex) { }

        try
        {
            if (Request.QueryString["FromProcess"] != null)
            {
                Session["IsFromProcess"] = Request.QueryString["FromProcess"].ToString();
            }
            else
            {
                Session["IsFromProcess"] = "false";
            }
        }
        catch (Exception ex) { }


        if (HttpContext.Current.Session["dbuser"] != null)
            schemaName = HttpContext.Current.Session["dbuser"].ToString();
    }

    #region GetStrObject
    private TStructDef GetStrObject(CacheManager cacheMgr)
    {
        TStructDef strObj = null;
        // cachemanager and TStructDef objects throw exceptions
        try
        {
            string language = HttpContext.Current.Session["language"].ToString();
            strObj = cacheMgr.GetStructDef(proj, sid, user, transId, AxRole);
            //isTstCustomHtml = strObj.IsObjCustomHtml;
            //requestProcess_logtime += cacheMgr.requestProcess_log;
            //ClearDcHasDataRows(strObj);
        }
        catch (Exception ex)
        {
            if (ex.Message.IndexOf("♠") > -1)
            {
                //requestProcess_logtime += ex.Message.Split('♠')[0];
                //requestProcess_logtime += ObjExecTr.ResponseErrorMsg("Server - " + ex.Message.Split('♠')[1]);
                if (ex.Message.Split('♠')[1] == Constants.SESSIONEXPMSG)
                {
                    //Response.Redirect(util.ERRPATH + Constants.SESSIONEXPMSG + "*♠*" + requestProcess_logtime);
                    return null;
                }
                else
                {
                    //Response.Redirect(util.ERRPATH + ex.Message.Replace(Environment.NewLine, "").Split('♠')[1] + "*♠*" + requestProcess_logtime);
                }
            }
            else
            {
                if (ex.Message == Constants.SESSIONEXPMSG)
                {
                    Response.Redirect(util.ERRPATH + Constants.SESSIONEXPMSG);
                    return null;
                }
                else
                {
                    Response.Redirect(util.ERRPATH + ex.Message.Replace(Environment.NewLine, ""));
                }
            }
        }

        if (strObj == null)
        {
            //requestProcess_logtime += "Server - Server error. Please try again later ♦ ";
            Response.Redirect(util.ERRPATH + "Server error. Please try again later" + "*♠*" + " ");
        }

        return strObj;
    }

    #endregion

    public static string CheckSpecialChars(string str)
    {
        str = Regex.Replace(str, "&", "&amp;");
        str = Regex.Replace(str, "<", "&lt;");
        str = Regex.Replace(str, ">", "&gt;");
        str = Regex.Replace(str, "'", "&apos;");
        str = Regex.Replace(str, "\"", "&quot;");

        return str;
    }

    #region GetCacheObject
    private CacheManager GetCacheObject()
    {
        CacheManager cacheMgr = null;

        try
        {
            cacheMgr = new CacheManager(errorLog);
        }
        catch (Exception ex)
        {
            //requestProcess_logtime += "Server - " + ex.Message + " ♦ ";
            //Response.Redirect(util.ERRPATH + ex.Message + "*♠*" + requestProcess_logtime);
        }

        if (cacheMgr == null)
        {
            //requestProcess_logtime += "Server - Server error. Please try again later ♦ ";
            //Response.Redirect(util.ERRPATH + "Server error. Please try again later" + "*♠*" + requestProcess_logtime);
        }
        return cacheMgr;
    }
    #endregion

    private static string GetEntityFormMetaData(string transId)
    {
        string ARMSessionId = GetARMSessionId();
        string sessionId = HttpContext.Current.Session.SessionID;

        string ARM_URL = string.Empty;
        if (HttpContext.Current.Session["ARM_URL"] != null)
            ARM_URL = HttpContext.Current.Session["ARM_URL"].ToString();


        string tasksUrl = ARM_URL + "/api/v1/GetEntityFormMetaData";

        var entityDetails = new
        {
            ARMSessionId = ARMSessionId,
            AxSessionId = sessionId,
            Trace = HttpContext.Current.Session["AxTrace"].ToString(),
            AppName = HttpContext.Current.Session["project"].ToString(),
            UserName = HttpContext.Current.Session["username"].ToString(),
            TransId = transId
        };

        var entities = CallWebAPI(tasksUrl, "POST", "application/json", JsonConvert.SerializeObject(entityDetails));
        return entities;

    }

    private static string GetSubEntityMetaData(string transId)
    {
        string ARMSessionId = GetARMSessionId();
        string sessionId = HttpContext.Current.Session.SessionID;

        string ARM_URL = string.Empty;
        if (HttpContext.Current.Session["ARM_URL"] != null)
            ARM_URL = HttpContext.Current.Session["ARM_URL"].ToString();


        string tasksUrl = ARM_URL + "/api/v1/GetSubEntityMetaData";

        var entityDetails = new
        {
            ARMSessionId = ARMSessionId,
            AxSessionId = sessionId,
            Trace = HttpContext.Current.Session["AxTrace"].ToString(),
            AppName = HttpContext.Current.Session["project"].ToString(),
            TransId = transId,
            UserName = HttpContext.Current.Session["username"].ToString()
        };

        var entities = CallWebAPI(tasksUrl, "POST", "application/json", JsonConvert.SerializeObject(entityDetails));
        return entities;

    }

    private static string GetSubEntityFilter(string fieldsStr, string subEntites)
    {
        List<string> subEntityList = subEntites.Split(',').ToList();

        string schemaName = HttpContext.Current.Session["project"].ToString();
        FDR fObj = (FDR)HttpContext.Current.Session["FDR"];

        if (fObj != null)
        {
            foreach (string entity in subEntityList)
            {
                string entityFields = fObj.StringFromRedis("SelectedFields-" + entity, schemaName);
                if (!string.IsNullOrEmpty(entityFields))
                {
                    fieldsStr = fieldsStr.Replace(entity + "=All", entity + "=" + entityFields.Replace("=", "!~"));
                }
            }
        }
        return fieldsStr;
    }

    private static string GetSubEntityKeyFields(string subEntites)
    {
        Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();
        List<string> subEntityList = subEntites.Split(',').ToList();

        string schemaName = HttpContext.Current.Session["project"].ToString();
        FDR fObj = (FDR)HttpContext.Current.Session["FDR"];

        if (fObj != null)
        {
            foreach (string entity in subEntityList)
            {
                string keyFieldField = fObj.StringFromRedis("SelectedKeyField-" + entity, schemaName);
                keyValuePairs.Add(entity, keyFieldField);
            }
        }
        return JsonConvert.SerializeObject(keyValuePairs);
    }

    private static string GetSubEntityListData(string entityName, string transId, Int64 recordId, string fields, int pageNo, int pageSize, bool metaData, string subEntityList)
    {
        string ARMSessionId = GetARMSessionId();
        string sessionId = HttpContext.Current.Session.SessionID;

        string ARM_URL = string.Empty;
        if (HttpContext.Current.Session["ARM_URL"] != null)
            ARM_URL = HttpContext.Current.Session["ARM_URL"].ToString();


        string tasksUrl = ARM_URL + "/api/v1/GetSubEntityListData";
        string apiFlds = GetSubEntityFilter(fields, subEntityList);
        var entityDetails = new
        {
            ARMSessionId = ARMSessionId,
            AxSessionId = sessionId,
            Trace = HttpContext.Current.Session["AxTrace"].ToString(),
            AppName = HttpContext.Current.Session["project"].ToString(),
            EntityName = entityName,
            UserName = HttpContext.Current.Session["username"].ToString(),
            TransId = transId,
            RecordId = recordId,
            Fields = apiFlds,
            PageNo = pageNo,
            PageSize = pageSize,
            MetaData = metaData
        };

        var entities = CallWebAPI(tasksUrl, "POST", "application/json", JsonConvert.SerializeObject(entityDetails));
        return entities;

    }



    private static string GetSubEntityChartsData(string entityName, string transId, string condition, string criteria, Int64 recordId, string keyValue)
    {
        string ARMSessionId = GetARMSessionId();
        string sessionId = HttpContext.Current.Session.SessionID;

        string ARM_URL = string.Empty;
        if (HttpContext.Current.Session["ARM_URL"] != null)
            ARM_URL = HttpContext.Current.Session["ARM_URL"].ToString();


        string tasksUrl = ARM_URL + "/api/v1/GetSubEntityChartsData";

        var entityDetails = new
        {
            ARMSessionId = ARMSessionId,
            AxSessionId = sessionId,
            Trace = HttpContext.Current.Session["AxTrace"].ToString(),
            AppName = HttpContext.Current.Session["project"].ToString(),
            EntityName = entityName,
            TransId = transId,
            Condition = condition,
            Criteria = criteria,
            RecordId = recordId,
            KeyValue = keyValue,
            UserName = HttpContext.Current.Session["username"].ToString()
        };

        var entities = CallWebAPI(tasksUrl, "POST", "application/json", JsonConvert.SerializeObject(entityDetails));
        return entities;

    }


    private static string GetSubEntityChartsMetaData(string entityName, string transId)
    {
        string ARMSessionId = GetARMSessionId();
        string sessionId = HttpContext.Current.Session.SessionID;

        string ARM_URL = string.Empty;
        if (HttpContext.Current.Session["ARM_URL"] != null)
            ARM_URL = HttpContext.Current.Session["ARM_URL"].ToString();


        string tasksUrl = ARM_URL + "/api/v1/GetSubEntityChartsMetaData";

        var entityDetails = new
        {
            ARMSessionId = ARMSessionId,
            AxSessionId = sessionId,
            Trace = HttpContext.Current.Session["AxTrace"].ToString(),
            AppName = HttpContext.Current.Session["project"].ToString(),
            EntityName = entityName,
            TransId = transId,
            UserName = HttpContext.Current.Session["username"].ToString()
        };

        var entities = CallWebAPI(tasksUrl, "POST", "application/json", JsonConvert.SerializeObject(entityDetails));
        return entities;

    }


    [WebMethod]
    public static string GetSubEntityChartsDataWS(string entityName, string transId, string condition, string criteria, string recordId, string keyValue)
    {
        if (HttpContext.Current.Session["project"] == null || Convert.ToString(HttpContext.Current.Session["project"]) == string.Empty)
        {
            return Constants.SESSIONTIMEOUT;
        }
        return GetSubEntityChartsData(entityName, transId, condition, criteria, Convert.ToInt64(recordId), keyValue);
    }


    [WebMethod]
    public static string GetSubEntityKeyFieldsWS(string subEntityList)
    {
        if (HttpContext.Current.Session["project"] == null || Convert.ToString(HttpContext.Current.Session["project"]) == string.Empty)
        {
            return Constants.SESSIONTIMEOUT;
        }
        return GetSubEntityKeyFields(subEntityList);
    }

    [WebMethod]
    public static string GetSubEntityChartsMetaDataWS(string entityName, string transId)
    {
        if (HttpContext.Current.Session["project"] == null || Convert.ToString(HttpContext.Current.Session["project"]) == string.Empty)
        {
            return Constants.SESSIONTIMEOUT;
        }
        return GetSubEntityChartsMetaData(entityName, transId);
    }

    [WebMethod]
    public static string GetSubEntityListDataWS(string entityName, string transId, string recordId, string fields, int pageNo, int pageSize, bool metaData, string subEntityList)
    {
        if (HttpContext.Current.Session["project"] == null || Convert.ToString(HttpContext.Current.Session["project"]) == string.Empty)
        {
            return Constants.SESSIONTIMEOUT;
        }
        return GetSubEntityListData(entityName, transId, Convert.ToInt64(recordId), fields, pageNo, pageSize, metaData, subEntityList);
    }

    private static string GetSelectedSubEntityCharts(string transId)
    {
        string schemaName = HttpContext.Current.Session["project"].ToString();
        FDR fObj = (FDR)HttpContext.Current.Session["FDR"];
        if (fObj != null)
            return fObj.StringFromRedis("SelectedSubEntityCharts-" + transId, schemaName);
        else
            return "";
    }
    private static string SetSelectedSubEntityCharts(string transId, string charts)
    {
        string schemaName = HttpContext.Current.Session["project"].ToString();
        FDW fdwObj = FDW.Instance;
        fdwObj.SaveInRedisServer("SelectedSubEntityCharts-" + transId, charts, "", schemaName);
        return "Success";
    }


    [WebMethod]
    public static string GetSelectedSubEntityChartsWS(string transId)
    {
        if (HttpContext.Current.Session["project"] == null || Convert.ToString(HttpContext.Current.Session["project"]) == string.Empty)
        {
            return Constants.SESSIONTIMEOUT;
        }
        return GetSelectedSubEntityCharts(transId);
    }

    [WebMethod]
    public static string SetSelectedSubEntityChartsWS(string transId, string charts)
    {
        if (HttpContext.Current.Session["project"] == null || Convert.ToString(HttpContext.Current.Session["project"]) == string.Empty)
        {
            return Constants.SESSIONTIMEOUT;
        }
        return SetSelectedSubEntityCharts(transId, charts);
    }

    private static string GetEntityKeyField(string transId)
    {
        string schemaName = HttpContext.Current.Session["project"].ToString();
        FDR fObj = (FDR)HttpContext.Current.Session["FDR"];
        if (fObj != null)
            return fObj.StringFromRedis("SelectedKeyField-" + transId, schemaName);
        else
            return "";
    }

    private static string GetSelectedRelatedDataFields(string transId)
    {
        string schemaName = HttpContext.Current.Session["project"].ToString();
        FDR fObj = (FDR)HttpContext.Current.Session["FDR"];
        if (fObj != null)
            return fObj.StringFromRedis("SelectedRelatedDataFields-" + transId, schemaName);
        else
            return "";
    }

    private static string SetSelectedRelatedDataFields(string transId, string fields)
    {
        string schemaName = HttpContext.Current.Session["project"].ToString();
        FDW fdwObj = FDW.Instance;
        fdwObj.SaveInRedisServer("SelectedRelatedDataFields-" + transId, fields, "", schemaName);
        if (fields == "")
            fdwObj.ClearRedisServerDataByKey("SelectedDisplayFields-" + transId, "", false, schemaName);

        return "Success";
    }

    [WebMethod]
    public static string GetSelectedRelatedDataFieldsWS(string transId)
    {
        if (HttpContext.Current.Session["project"] == null || Convert.ToString(HttpContext.Current.Session["project"]) == string.Empty)
        {
            return Constants.SESSIONTIMEOUT;
        }
        return GetSelectedRelatedDataFields(transId);
    }

    [WebMethod]
    public static string SetSelectedRelatedDataFieldsWS(string transId, string fields)
    {
        if (HttpContext.Current.Session["project"] == null || Convert.ToString(HttpContext.Current.Session["project"]) == string.Empty)
        {
            return Constants.SESSIONTIMEOUT;
        }
        return SetSelectedRelatedDataFields(transId, fields);
    }


    private static string GetSelectedDisplayFields(string transId)
    {
        string dcFlds = String.Empty;
        string gridDcFlds = String.Empty;
        string schemaName = HttpContext.Current.Session["project"].ToString();
        FDR fObj = (FDR)HttpContext.Current.Session["FDR"];
        if (fObj != null)
        {
            dcFlds = fObj.StringFromRedis("SelectedDisplayFields-" + transId, schemaName);
            gridDcFlds = GetSelectedDisplayGridFields(transId);
        }
        if (!string.IsNullOrEmpty(gridDcFlds))
            dcFlds = dcFlds + "^" + gridDcFlds;

        return dcFlds;
    }

    private static string GetSelectedDisplayGridFields(string transId)
    {
        string schemaName = HttpContext.Current.Session["project"].ToString();
        FDR fObj = (FDR)HttpContext.Current.Session["FDR"];
        if (fObj != null)
            return fObj.StringFromRedis("SelectedDisplayGridFields-" + transId, schemaName);
        else
            return "";
    }

    private static string SetSelectedDisplayFields(string transId, string fields, string gridFields)
    {
        string schemaName = HttpContext.Current.Session["project"].ToString();
        FDW fdwObj = FDW.Instance;
        fdwObj.SaveInRedisServer("SelectedDisplayFields-" + transId, fields, "", schemaName);
        fdwObj.SaveInRedisServer("SelectedDisplayGridFields-" + transId, gridFields, "", schemaName);
        return "Success";
    }

    [WebMethod]
    public static string SetSelectedDisplayFieldsWS(string transId, string fields, string gridFields)
    {
        if (HttpContext.Current.Session["project"] == null || Convert.ToString(HttpContext.Current.Session["project"]) == string.Empty)
        {
            return Constants.SESSIONTIMEOUT;
        }
        return SetSelectedDisplayFields(transId, fields, gridFields);
    }





    public void SessionExpired()
    {
        string url = util.SESSEXPIRYPATH;
        Response.Write("<script language='javascript'>");
        Response.Write("parent.parent.location.href='" + url + "';");
        Response.Write("</script>");
    }

    private void ResetSessionTime()
    {
        if (Session["AxSessionExtend"] != null && Session["AxSessionExtend"].ToString() == "true")
        {
            HttpContext.Current.Session["LastUpdatedSess"] = DateTime.Now.ToString();
            ClientScript.RegisterStartupScript(this.GetType(), "SessionAlert", "eval(callParent('ResetSession()', 'function'));", true);
        }
    }

    private static string CallScripts(string transId, string script, string recordId)
    {
        string armScriptUrl = "http://localhost/AxpertWebScripts113/";// GetArmScriptURL();
        if (string.IsNullOrEmpty(armScriptUrl))
            return "Error. Script URL is not defined.";

        string url = armScriptUrl + "/ASBScriptRest.dll/datasnap/rest/TASBScriptRest/executescript";

        string userName = HttpContext.Current.Session["username"].ToString();
        AxpertRestAPIToken axpertToken = new AxpertRestAPIToken(userName);

        string json = @"{
            ""executescript"": {
                ""project"":  """ + HttpContext.Current.Session["project"].ToString() + @""",
                ""token"": """ + axpertToken.token + @""",
                ""seed"": """ + axpertToken.seed + @""",        
                ""userauthkey"": """ + axpertToken.userAuthKey + @""",
                ""script"": """ + script + @""",
                ""type"": ""form"",
                ""name"": """ + transId + @""",
                ""recordid"": """ + recordId + @""",
                ""trace"": """ + HttpContext.Current.Session["AxTrace"].ToString() + @"""
            }
        }";

        var scriptResult = CallWebAPI(url, "POST", "application/json", json);
        if (scriptResult.IndexOf("base64data") > -1)
            scriptResult = WriteFile(scriptResult);
        return scriptResult;
    }

    public static string WriteFile(string jsonString)
    {
        try
        {
            var outerJson = JObject.Parse(jsonString);
            string innerJsonString = outerJson["result"].ToString();
            JObject innerJson = JObject.Parse(innerJsonString);
            JToken commandObject = innerJson["command"][0];

            string fileName = (string)commandObject["cmdval"].ToString();
            string base64data = (string)commandObject["base64data"].ToString();
            byte[] fileBytes = Convert.FromBase64String(base64data);
            Util.Util utilObj = new Util.Util();
            string filePath = utilObj.ScriptsPath + "axpert\\" + HttpContext.Current.Session["nsessionid"].ToString() + "\\" + fileName;
            filePath = filePath.Replace("\\\\", "\\"); 
            string directoryPath = Path.GetDirectoryName(filePath);

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            File.WriteAllBytes(filePath, fileBytes);
        }
        catch (Exception ex)
        {
            return ex.Message;

        }
        return jsonString;
    }

    public static string GetArmScriptURL()
    {
        string ArmRestDllPath = string.Empty;
        try
        {
            if (HttpContext.Current.Session["ARM_Scripts_URL"] != null && HttpContext.Current.Session["ARM_Scripts_URL"].ToString() != "")
            {
                ArmRestDllPath = HttpContext.Current.Session["ARM_Scripts_URL"].ToString();
                if (ArmRestDllPath.Substring(ArmRestDllPath.Length - 1) != "/")
                    ArmRestDllPath += "/";
            }
            else if (ConfigurationManager.AppSettings["RestDllPath"] != null)
                ArmRestDllPath = ConfigurationManager.AppSettings["RestDllPath"].ToString();
        }
        catch (Exception ex)
        {
        }
        return ArmRestDllPath;

    }

    [WebMethod]
    public static string CallScriptsWS(string transId, string script, string recordId)
    {
        if (HttpContext.Current.Session["project"] == null || Convert.ToString(HttpContext.Current.Session["project"]) == string.Empty)
        {
            return Constants.SESSIONTIMEOUT;
        }
        return CallScripts(transId, script, recordId);
    }


    private static string CallWebAPI(string url, string method = "GET", string contentType = "application/json", string body = "", string calledFrom = "")
    {
        AddToARMLog("URL:" + url + Environment.NewLine + "Input Json: " + Environment.NewLine + body);
        string result = string.Empty;
        try
        {

            HttpWebRequest httpRequest = (HttpWebRequest)WebRequest.Create(url);
            httpRequest.Method = method;
            httpRequest.ContentType = contentType;
            if (HttpContext.Current.Session["ARM_Token"] != null && HttpContext.Current.Session["ARM_Token"].ToString() != string.Empty)
            {
                var token = HttpContext.Current.Session["ARM_Token"].ToString();
                httpRequest.Headers.Add("Authorization", "Bearer " + token);
            }

            using (var streamWriter = new StreamWriter(httpRequest.GetRequestStream()))
            {
                streamWriter.Write(body);
            }

            var httpResponse = (HttpWebResponse)httpRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                result = streamReader.ReadToEnd();
            }
        }
        catch (WebException e)
        {
            try
            {
                using (WebResponse response = e.Response)
                {
                    HttpWebResponse httpResponse = (HttpWebResponse)response;
                    //Console.WriteLine("Error code: {0}", httpResponse.StatusCode);

                    if (calledFrom == "" && httpResponse.StatusCode == HttpStatusCode.Unauthorized)
                    {
                        return RefreshSessionAndRecallAPI(url, method, contentType, body, calledFrom = "Error");
                    }

                    using (Stream data = response.GetResponseStream())
                    using (var reader = new StreamReader(data))
                    {
                        result = reader.ReadToEnd();
                    }

                    if (calledFrom == "" && result.IndexOf("SessionId is not valid") > -1)
                    {
                        return RefreshSessionAndRecallAPI(url, method, contentType, body, calledFrom = "Error");
                    }
                }
            }
            catch (Exception ex)
            {
                result = "Error: " + ex.Message;
            }
        }
        catch (Exception e)
        {
            result = "Error: " + e.Message;
        }
        AddToARMLog("Output Json: " + Environment.NewLine + result);
        return result;
    }

    private static string RefreshSessionAndRecallAPI(string url, string method = "GET", string contentType = "application/json", string body = "", string calledFrom = "")
    {
        HttpContext.Current.Session.Remove("ARM_SessionId");
        HttpContext.Current.Session.Remove("ARM_Token");
        var ARMSessionId = GetARMSessionId();
        try
        {
            var jsonBody = JObject.Parse(body);
            if (jsonBody["ARMSessionId"] != null)
            {
                jsonBody["ARMSessionId"] = ARMSessionId;
                body = JsonConvert.SerializeObject(jsonBody);
            }
        }
        catch { }
        return CallWebAPI(url, method, contentType, body, calledFrom = "Error");
    }

    private static string MD5Hash(string text)
    {
        MD5 md5 = new MD5CryptoServiceProvider();

        //compute hash from the bytes of text  
        md5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(text));

        //get hash result after compute it  
        byte[] result = md5.Hash;

        StringBuilder strBuilder = new StringBuilder();
        for (int i = 0; i < result.Length; i++)
        {
            //change it into 2 hexadecimal digits  
            //for each byte  
            strBuilder.Append(result[i].ToString("x2"));
        }

        return strBuilder.ToString();
    }

    private static string GetARMSessionId()
    {
        try
        {
            var ARMSessionId = "";
            string sessionId = HttpContext.Current.Session.SessionID;
            if (HttpContext.Current.Session["ARM_SessionId"] == null)
            {
                //string privateKey = ConfigurationManager.AppSettings["ARM_PrivateKey"].ToString();
                string privateKey = String.Empty;
                if (HttpContext.Current.Session["ARM_PrivateKey"] != null)
                    privateKey = HttpContext.Current.Session["ARM_PrivateKey"].ToString();
                else
                    return "Error in ARM connection.";

                string hashedKey = MD5Hash(privateKey + sessionId);
                var axpertDetails = new
                {
                    user = HttpContext.Current.Session["user"].ToString(),
                    key = hashedKey,
                    AxSessionId = sessionId,
                    Trace = HttpContext.Current.Session["AxTrace"].ToString(),
                    AppName = HttpContext.Current.Session["project"].ToString()
                };
                string ARM_URL = string.Empty;
                if (HttpContext.Current.Session["ARM_URL"] != null)
                    ARM_URL = HttpContext.Current.Session["ARM_URL"].ToString();
                else
                    return "Error in ARM connection.";
                string connectionUrl = ARM_URL + "/api/v1/ARMConnectFromAxpert";

                var connectionResult = CallWebAPI(connectionUrl, "POST", "application/json", JsonConvert.SerializeObject(axpertDetails));

                var jObj = Newtonsoft.Json.Linq.JObject.Parse(connectionResult);
                if (jObj != null && jObj["result"] != null)
                {
                    if (Convert.ToBoolean(jObj["result"]["success"]))
                    {
                        ARMSessionId = jObj["result"]["connectionid"].ToString();
                        var token = jObj["result"]["token"].ToString();
                        HttpContext.Current.Session["ARM_SessionId"] = ARMSessionId;
                        HttpContext.Current.Session["ARM_Token"] = token;
                    }
                    else
                    {
                        return "Error in ARM connection.";
                    }
                }
            }
            else
            {
                ARMSessionId = HttpContext.Current.Session["ARM_SessionId"].ToString();
            }
            return ARMSessionId;
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }

    //public static void AddToARMLog(string text)
    //{

    //    if (HttpContext.Current.Session["AxTrace"].ToString() == "true")
    //    {
    //        text = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss.fff") + " - " + text;
    //        var logList = new List<string>();

    //        if (HttpContext.Current.Session["ARMLogs"] == null)
    //        {
    //            logList.Add(text);
    //            HttpContext.Current.Session["ARMLogs"] = logList;
    //        }
    //        else
    //        {
    //            logList = (List<string>)HttpContext.Current.Session["ARMLogs"];
    //            while (logList.Count > 20)
    //            {
    //                logList.RemoveAt(0);
    //            }

    //            logList.Add(text);
    //            HttpContext.Current.Session["ARMLogs"] = logList;
    //        }
    //    }
    //}

    public static void AddToARMLog(string text)
    {
        if (HttpContext.Current.Session["AxTrace"].ToString() == "true")
        {
            text = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss.fff") + " - " + text;
            LogFile.Log logobj = new LogFile.Log();
            string sessID = "";
            if (HttpContext.Current.Session != null)
                sessID = HttpContext.Current.Session.SessionID;
            logobj.CreateLog(text, sessID, "Entity Form Page Logs", "");
        }
    }

}
