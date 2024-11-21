﻿using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using StackExchange.Redis;

public partial class Config : System.Web.UI.Page
{
    public string appTitle = "Axpert Configuration";
    public static string jsonText = string.Empty;
    public static string jsonRedisText = string.Empty;
    public string existingJsonARM = string.Empty;
    public string existingJsonFile = string.Empty;
    public string selProj = string.Empty;
    public string direction = "ltr";
    public string langType = "en";
    Util.Util util = new Util.Util();
    public string isLicExist = "true";
    public string authPopup = "false";
    //[NonSerialized]
    public static ConfigurationOptions Rconfig;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            if (ConfigurationManager.AppSettings["EnableAxpertConfiguration"] == null || ConfigurationManager.AppSettings["EnableAxpertConfiguration"].ToString() == "false")
            {
                Response.Redirect("signin.aspx", true);
            }
            else if (ConfigurationManager.AppSettings["EnableAxpertConfiguration"] != null && ConfigurationManager.AppSettings["EnableAxpertConfiguration"].ToString() == "true" && Request.QueryString["auth"] == null)
            {
                PanelAuthenticate.Visible = true;
                panelewConnection.Visible = false;
                authPopup = "true";
                main_body.Attributes.CssStyle.Add("background", "url(./../AxpImages/login-img.png)");
                main_body.Attributes.CssStyle.Add("background-repeat", "no-repeat");
                main_body.Attributes.CssStyle.Add("background-attachment", "fixed");
                main_body.Attributes.CssStyle.Add("background-position", "bottom");
                main_body.Attributes.CssStyle.Add("background-size", "cover !important");
                return;
            }
            else if (ConfigurationManager.AppSettings["EnableAxpertConfiguration"] != null && ConfigurationManager.AppSettings["EnableAxpertConfiguration"].ToString() == "true" && Request.QueryString["auth"] != null)
            {
                main_body.Style.Remove("background");
                configbody.Attributes["class"] = "row-fluid";
                //configbody.Attributes["class"] = configbody.Attributes["class"].Replace("row-fluid m-autoss1", "row-fluid");

                string authInfo = util.encrtptDecryptAES(Request.QueryString["auth"], false);
                if (Session.SessionID != authInfo)
                {
                    PanelAuthenticate.Visible = true;
                    panelewConnection.Visible = false;

                    authPopup = "true";
                    return;
                }
            }
            string ScriptsPathARM = HttpContext.Current.Application["ScriptsPath"].ToString() + "armconfig.ini";
            string filePatharm = @" " + ScriptsPathARM + "";
            string directoryPath = Path.GetDirectoryName(filePatharm);
            FileInfo Filefi = new FileInfo(ScriptsPathARM);
            try
            {
                if (Filefi.Exists)
                {
                    existingJsonARM = File.ReadAllText(filePatharm);
                    existingJsonARM = JsonConvert.SerializeObject(existingJsonARM);
                }

            }
            catch (Exception ex) { }

            string ScriptsPathFile = HttpContext.Current.Application["ScriptsPath"].ToString() + "fileconfig.ini";
            string filePathconfigfile = @" " + ScriptsPathFile + "";
            string directoryPathfile = Path.GetDirectoryName(filePathconfigfile);
            FileInfo Filefifile = new FileInfo(ScriptsPathFile);
            try
            {
                if (Filefifile.Exists)
                {
                    existingJsonFile = File.ReadAllText(filePathconfigfile);
                    existingJsonFile = JsonConvert.SerializeObject(existingJsonFile);
                }
            }
            catch (Exception ex) { }
            jsonText = string.Empty;
            // SetAxpertLogo();
            if (Request.QueryString["proj"] != null)
            {
                hdnselecproj.Value = Request.QueryString["proj"].ToString();
                selProj = Request.QueryString["proj"].ToString();
            }
            List<string> lst = new List<string>();
            string ScriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString();
            FileInfo fi = new FileInfo(ScriptsPath + "\\axapps.xml");
            if (fi.Exists)
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(ScriptsPath + "\\axapps.xml");
                try
                {
                    XmlNodeList pNode = doc.SelectSingleNode("/connections").ChildNodes;
                    foreach (XmlNode nodename in pNode)
                    {
                        lst.Add(nodename.Name);
                    }
                }
                catch (Exception ex)
                { }
                jsonText = doc.OuterXml;
                jsonText = util.CheckSpecialChars(jsonText);
            }
            lstconnection.DataSource = lst;
            axSelectProj.DataSource = lst;
            armproj.DataSource = lst;
            fileproj.DataSource = lst;
            lstconnection.DataBind();
            axSelectProj.DataBind();
            armproj.DataBind();
            fileproj.DataBind();
            jsonRedisText = string.Empty;
            List<string> Rlst = new List<string>();
            FileInfo Rfi = new FileInfo(ScriptsPath + "\\redisconns.xml");
            if (Rfi.Exists)
            {
                XmlDocument rdoc = new XmlDocument();
                rdoc.Load(ScriptsPath + "\\redisconns.xml");
                try
                {
                    XmlNodeList pNode = rdoc.SelectSingleNode("/axp_rconn").ChildNodes;
                    foreach (XmlNode nodename in pNode)
                    {
                        Rlst.Add(nodename.Name);
                    }
                }
                catch (Exception ex)
                { }
                jsonRedisText = rdoc.OuterXml;
                jsonRedisText = util.CheckSpecialChars(jsonRedisText);
            }
            lstRconnection.DataSource = Rlst;
            lstRconnection.DataBind();

            IsLicExists();
        }
    }

    protected void IsLicExists()
    {
        try
        {
            string lic_redis = string.Empty;
            string lic_file = string.Empty;
            bool licExist = false;
            string redisLicDetails = GetServerLicDetails();
            if (redisLicDetails != string.Empty && !redisLicDetails.StartsWith("error:"))
            {
                lic_redis = redisLicDetails.Split('=')[1].ToString().Trim('\'');
                licExist = true;
            }
            else
            {
                string ScriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString();
                string[] files = System.IO.Directory.GetFiles(ScriptsPath, "*.lic");
                if (files.Count() > 0)
                {
                    lic_file = files[0].Split('\\').Last();
                    licExist = true;
                }
            }
            if (licExist == false)
                isLicExist = "false";
            else
            {
                string trace = ConfigurationManager.AppSettings["LoginTrace"].ToString();
                string inputJson = "{\"_parameters\":[{\"getlicenseinfo\":{\"trace\":\"" + trace + "\"},\"licdetails\":{\"lic_redis\":\"" + lic_redis + "\",\"lic_file\":\"" + lic_file + "\"}}]}";

                ASB.WebService objws = new ASB.WebService();
                string res = objws.CallGetLicenseInfoWS(inputJson);
                var details = JObject.Parse(res);
                string licno = details["result"][0]["result"]["licno"].ToString();
                string licExpiry = details["result"][0]["result"]["expiry"].ToString();
                if (licExpiry == "Perpetual")
                    lbllicExpiry.InnerText = licExpiry;
                else
                    lbllicExpiry.InnerText = "Expires on " + licExpiry;
                if (licno == "templic")
                {
                    lblerkey.Text = "Trial version";
                    txtlicappkey.Visible = false;
                }
                else
                    lblerkey.Text = "Registration key:";
                txtlicappkey.Text = licno;
                txtlicappkey.ReadOnly = true;
                txtlicofflinekey.Text = licno;
                txtlicofflinekey.ReadOnly = true;
            }
        }
        catch (Exception ex)
        {
            LogFile.Log logObj = new LogFile.Log();
            logObj.CreateLog("IsLicExists:" + ex.Message, Session.SessionID, "IsLicExists", "new", "true");
        }
    }

    protected void SetAxpertLogo()
    {
        main_body.Attributes.Add("Dir", direction);
        string folderPath = Server.MapPath("~/images/Custom");
        DirectoryInfo di = new DirectoryInfo(folderPath);
        FileInfo[] diFileinfo = di.GetFiles();
        var customlogoexist = "False";

        foreach (var drfile in diFileinfo)
        {
            if (drfile.Length > 0 && drfile.Name.Contains("homelogo"))
            {
                if (drfile.Name.Contains("mp4"))
                {
                    main_body.Attributes.CssStyle.Add("background", "");
                    customlogoexist = "True";
                    break;
                }
                else
                {
                    main_body.Attributes.CssStyle.Add("background", "url(./../images/Custom/" + drfile.Name + "?v=" + DateTime.Now.ToString("yyyyMMddHHmmss") + ") no-repeat center center fixed !important ");
                    main_body.Attributes.CssStyle.Add("background-size", "cover !important");
                    main_body.Attributes.CssStyle.Add("height", "100vh !important");
                    customlogoexist = "True";
                    break;
                }
            }
        }
        if (customlogoexist == "False")
        {
            main_body.Attributes.CssStyle.Add("background", "url(./../AxpImages/login-img.png)");
            main_body.Attributes.CssStyle.Add("background-repeat", "no-repeat");
            main_body.Attributes.CssStyle.Add("background-attachment", "fixed");
            main_body.Attributes.CssStyle.Add("background-position", "bottom");
            main_body.Attributes.CssStyle.Add("background-size", "cover !important");
        }
    }

    private static string GetServerLicDetails()
    {
        string licdetails = string.Empty;
        try
        {
            Util.Util objutil = new Util.Util();
            string redisIp = string.Empty;
            string redisPwd = string.Empty;
            //if (ConfigurationManager.AppSettings["axpLic_RedisIp"] != null)
            //    redisIp = ConfigurationManager.AppSettings["axpLic_RedisIp"].ToString();

            //if (ConfigurationManager.AppSettings["axpLic_RedisPass"] != null)
            //    redisPwd = ConfigurationManager.AppSettings["axpLic_RedisPass"].ToString();
            if (HttpContext.Current.Session != null && HttpContext.Current.Session["axpLic_RedisIP"] != null && HttpContext.Current.Session["axpLic_RedisIP"].ToString() != "")
            {
                redisIp = HttpContext.Current.Session["axpLic_RedisIP"].ToString();
                if (HttpContext.Current.Session["axpLic_RedisPwd"] != null && HttpContext.Current.Session["axpLic_RedisPwd"].ToString() != "")
                    redisPwd = HttpContext.Current.Session["axpLic_RedisPwd"].ToString();
            }
            else
            {
                string rcDetails = objutil.GetAxpLicRedisConnDetails();
                if (rcDetails != "")
                {
                    redisIp = rcDetails.Split('♣')[0];
                    redisPwd = rcDetails.Split('♣')[1];
                }
            }

            if (redisIp != string.Empty)
            {
                string rlicConn = objutil.GetServerLicDetails(redisIp, redisPwd);
                switch (rlicConn)
                {
                    case "notConnected":
                        licdetails = "error:Redis Connection details for Axpert license is not proper. Please contact your support person.";
                        break;
                    case "keyNotExists":
                        licdetails = "error:Server seems to be not licensed. Please contact your support person.";
                        break;
                    case "keyNotMatch":
                        licdetails = "error:Redis IP for Axpert license should be set as 127.0.0.1. Please contact your support person.";
                        break;
                    case "keyExists":
                        if (redisPwd != string.Empty)
                            redisPwd = objutil.EncryptPWD(redisPwd);
                        licdetails = "lic_redis='" + redisIp + "~" + redisPwd + "'";
                        break;
                }
            }
            else
                licdetails = string.Empty;
        }
        catch (Exception ex)
        {
        }
        return licdetails;
    }

    protected void btndelete_Click(object sender, EventArgs e)
    {
        int slIndx = lstconnection.SelectedIndex;
        if (slIndx != -1)
        {
            string selCon = lstconnection.Items[slIndx].Value;
            string ScriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString();
            FileInfo fi = new FileInfo(ScriptsPath + "\\axapps.xml");
            if (fi.Exists)
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(ScriptsPath + "\\axapps.xml");
                XmlNode node = doc.SelectSingleNode("/connections/" + selCon);
                node.ParentNode.RemoveChild(node);
                doc.Save(ScriptsPath + "\\axapps.xml");
                Response.Redirect("Config.aspx");
            }
        }
    }

    protected void btnok_Click(object sender, EventArgs e)
    {
        try
        {
            string connectionType = ddlIsNewConnection.SelectedValue;
            string NewConName = txtNewConName.Text;
            string dbtype = ddldbtype.Value;
            string dbverno = ddldbversion.Value;
            string driver = ddldriver.SelectedValue;
            string dbconName = txtccname.Text;
            string userName = txtusername.Text;
            string pwd = txtPassword.Text;
            txtPassword.Text = "";
            if (pwd == "")
                pwd = "log";
            pwd = util.EncryptPWD(pwd);
            string xml = "<" + NewConName + ">";
            xml += "<type>db</type>";
            xml += "<structurl/>";
            xml += "<db>" + dbtype + "</db>";
            xml += "<driver>" + driver + "</driver>";
            xml += "<version>" + dbverno + "</version>";
            xml += "<dbcon>" + dbconName + "</dbcon>";
            xml += "<dbuser>" + userName + "</dbuser>";
            xml += "<pwd>" + pwd + "</pwd>";
            xml += "<dataurl/>";
            xml += "</" + NewConName + ">";

            string ScriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString();
            FileInfo fi = new FileInfo(ScriptsPath + "\\axapps.xml");
            if (fi.Exists)
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(xml);
                XmlDocument docAxapp = new XmlDocument();
                docAxapp.Load(ScriptsPath + "\\axapps.xml");
                if (connectionType == "new")
                {
                    bool isConnExists = false;
                    XmlNodeList pNode = docAxapp.SelectNodes("/connections");
                    foreach (XmlNode nodeName in pNode)
                    {
                        foreach (XmlNode nodeN in nodeName.ChildNodes)
                        {
                            if (nodeN.Name.ToString().ToLower() == NewConName.ToLower())
                            {
                                isConnExists = true;
                                break;
                            }
                        }
                    }
                    if (isConnExists == false)
                    {
                        XmlNode newBook = docAxapp.ImportNode(doc.DocumentElement, true);
                        docAxapp.DocumentElement.AppendChild(newBook);
                        docAxapp.Save(ScriptsPath + "\\axapps.xml");

                        List<string> lst = new List<string>();
                        XmlDocument docList = new XmlDocument();
                        docList.Load(ScriptsPath + "\\axapps.xml");
                        try
                        {
                            XmlNodeList ConNode = docList.SelectSingleNode("/connections").ChildNodes;
                            foreach (XmlNode nodename in ConNode)
                            {
                                lst.Add(nodename.Name);
                            }
                        }
                        catch (Exception ex)
                        { }
                        jsonText = docAxapp.OuterXml;
                        jsonText = util.CheckSpecialChars(jsonText);

                        lstconnection.DataSource = lst;
                        lstconnection.DataBind();
                        selProj = NewConName;
                        ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:SuccApplyConnection('success','" + NewConName + "');", true);
                    }
                    else
                        ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:SuccApplyConnection('failed','" + NewConName + "');", true);
                }
                else
                {
                    XmlNode node = docAxapp.SelectSingleNode("/connections/" + NewConName);
                    node.ParentNode.RemoveChild(node);
                    //docAxapp.Save(ScriptsPath + "\\axapps.xml");

                    XmlNode newBook = docAxapp.ImportNode(doc.DocumentElement, true);
                    docAxapp.DocumentElement.AppendChild(newBook);
                    docAxapp.Save(ScriptsPath + "\\axapps.xml");

                    List<string> lst = new List<string>();
                    XmlDocument docList = new XmlDocument();
                    docList.Load(ScriptsPath + "\\axapps.xml");
                    try
                    {
                        XmlNodeList ConNode = docList.SelectSingleNode("/connections").ChildNodes;
                        foreach (XmlNode nodename in ConNode)
                        {
                            lst.Add(nodename.Name);
                        }
                    }
                    catch (Exception ex)
                    { }
                    jsonText = docAxapp.OuterXml;
                    jsonText = util.CheckSpecialChars(jsonText);

                    lstconnection.DataSource = lst;
                    lstconnection.DataBind();
                    selProj = NewConName;
                    ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:SuccApplyConnection('success','" + NewConName + "');", true);
                }
            }
            else
            {
                xml = "<connections>" + xml + "</connections>";
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(xml);
                doc.Save(ScriptsPath + "/axapps.xml");

                List<string> lst = new List<string>();
                XmlDocument docList = new XmlDocument();
                docList.Load(ScriptsPath + "\\axapps.xml");
                try
                {
                    XmlNodeList pNode = docList.SelectSingleNode("/connections").ChildNodes;
                    foreach (XmlNode nodename in pNode)
                    {
                        lst.Add(nodename.Name);
                    }
                }
                catch (Exception ex)
                { }
                jsonText = doc.OuterXml;
                jsonText = util.CheckSpecialChars(jsonText);

                lstconnection.DataSource = lst;
                lstconnection.DataBind();
                selProj = NewConName;
                ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:SuccApplyConnection('success','" + NewConName + "');", true);
            }
        }
        catch (Exception ex)
        {
            LogFile.Log logObj = new LogFile.Log();
            logObj.CreateLog("Apply Connect Ok button:" + ex.Message, HttpContext.Current.Session.SessionID, "applyconnectok", "new", "true");
        }
    }

    [WebMethod]
    public static string AppTestConnection(string ddldbtype, string ddldbversion, string ddldriver, string txtccname, string txtusername, string txtPassword)
    {
        string result = string.Empty;
        Util.Util objutil = new Util.Util();
        try
        {
            string dbtype = ddldbtype;
            string dbverno = ddldbversion;
            string driver = ddldriver;
            string dbconName = txtccname;
            string userName = txtusername;
            string pwd = txtPassword;
            if (pwd == "")
                pwd = "log";
            pwd = objutil.EncryptPWD(pwd);

            string jsonData = "{";
            jsonData += "\"type\":\"db\"";
            jsonData += ",\"db\":\"" + dbtype + "\"";
            jsonData += ",\"version\":\"" + dbverno + "\"";
            jsonData += ",\"driver\":\"" + driver + "\"";
            jsonData += ",\"dbcon\":\"" + dbconName + "\"";
            //jsonData += ",\"structurl\":\"\"";
            //jsonData += ",\"dataurl\":\"\"";
            jsonData += ",\"dbuser\":\"" + userName.Replace(@"\", "\\\\") + "\"";
            jsonData += ",\"pwd\":\"" + pwd + "\"";
            jsonData += "}";
            string axpapp = userName;
            if (axpapp.Contains("\\"))
                axpapp = axpapp.Split('\\')[0];
            // GetDbConnection axapp licdetails 

            string lic_redis = string.Empty;
            string lic_file = string.Empty;
            string redisLicDetails = GetServerLicDetails();
            if (redisLicDetails != string.Empty && !redisLicDetails.StartsWith("error:"))
                lic_redis = redisLicDetails.Split('=')[1].ToString().Trim('\'');
            else
            {
                string ScriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString();
                string[] files = System.IO.Directory.GetFiles(ScriptsPath, "*.lic");
                if (files.Count() > 0)
                {
                    lic_file = files[0].Split('\\').Last();
                }
            }
            string trace = ConfigurationManager.AppSettings["LoginTrace"].ToString();
            string inputJson = "{\"_parameters\":[{\"getdbconnection\":{\"axpapp\":\"" + axpapp + "\",\"trace\":\"" + trace + "\"},\"" + axpapp + "\":" + jsonData + ",\"licdetails\":{\"lic_redis\":\"" + lic_redis + "\",\"lic_file\":\"" + lic_file + "\"}}]}";

            ASB.WebService objws = new ASB.WebService();
            result = objws.CallGetDBConnectionWS(inputJson);
        }
        catch (Exception ex)
        {
            LogFile.Log logObj = new LogFile.Log();
            logObj.CreateLog("Test Connection:" + ex.Message, HttpContext.Current.Session.SessionID, "AppTestConnection", "new", "true");
        }
        return result;
    }

    protected void btnActivate_Click(object sender, EventArgs e)
    {
        try
        {
            string userName = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName()).HostName;
            if (userName.IndexOf(".") > -1)
                userName = userName.Split('.')[0];
            string licappkey = txtlicappkey.Text;
            string trace = ConfigurationManager.AppSettings["LoginTrace"].ToString();
            string inputXMl = "<root username=\"" + userName + "\" licno=\"" + licappkey + "\" offline=\"no\" trace=\"" + trace + "\"></root>";
            //LogFile.Log logObj = new LogFile.Log();
            //logObj.CreateLog("Activate Input:" + inputXMl, HttpContext.Current.Session.SessionID, "ActivateInput", "new", "true");
            ASB.WebService objws = new ASB.WebService();
            string result = objws.CallActivateLicenseWS(inputXMl);
            if (result != "")
            {
                XmlDocument docXMl = new XmlDocument();
                docXMl.LoadXml(result);
                string strText = docXMl.LastChild.InnerText;
                string strType = docXMl.LastChild.Name == "result" ? "success" : docXMl.LastChild.Name;
                ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:LicActivationSucc('" + strType + "','" + strText.TrimEnd() + "');", true);
            }
            else
                ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:LicActivationSucc('error','Something went wrong please try again later..');", true);
        }
        catch (Exception ex)
        {
            LogFile.Log logObj = new LogFile.Log();
            logObj.CreateLog("Activate button:" + ex.Message, HttpContext.Current.Session.SessionID, "ActivateLic", "new", "true");
        }
    }

    protected void btnRefresh_Click(object sender, EventArgs e)
    {
        try
        {
            string userName = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName()).HostName;
            if (userName.IndexOf(".") > -1)
                userName = userName.Split('.')[0];
            string licappkey = txtlicappkey.Text;
            string trace = ConfigurationManager.AppSettings["LoginTrace"].ToString();
            string inputXMl = "<root username=\"" + userName + "\" licno=\"" + licappkey + "\" lictype=\"F\" offline=\"no\" trace=\"" + trace + "\"></root>";
            ASB.WebService objws = new ASB.WebService();
            string result = objws.CallActivateLicenseWS(inputXMl);
            if (result != "")
            {
                XmlDocument docXMl = new XmlDocument();
                docXMl.LoadXml(result);
                string strText = docXMl.LastChild.InnerText;
                string strType = docXMl.LastChild.Name == "result" ? "success" : docXMl.LastChild.Name;
                ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:LicActivationSucc('" + strType + "','" + strText.TrimEnd() + "');", true);
            }
            else
                ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:LicActivationSucc('error','Something went wrong please try again later..');", true);
        }
        catch (Exception ex)
        {
            LogFile.Log logObj = new LogFile.Log();
            logObj.CreateLog("Refresh button:" + ex.Message, HttpContext.Current.Session.SessionID, "RefreshLic", "new", "true");
        }
    }

    protected void btnTrial_Click(object sender, EventArgs e)
    {
        try
        {
            string userName = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName()).HostName;
            if (userName.IndexOf(".") > -1)
                userName = userName.Split('.')[0];
            string licappkey = txtlicappkey.Text;
            string trace = ConfigurationManager.AppSettings["LoginTrace"].ToString();
            string inputXMl = "<root username=\"" + userName + "\" orgname=\"from web site\" licno=\"trial\" lictype=\"E\" offline=\"no\" trace=\"" + trace + "\"></root>";
            ASB.WebService objws = new ASB.WebService();
            string result = objws.CallActivateLicenseWS(inputXMl);
            if (result != "")
            {
                XmlDocument docXMl = new XmlDocument();
                docXMl.LoadXml(result);
                string strText = docXMl.LastChild.InnerText;
                string strType = docXMl.LastChild.Name == "result" ? "success" : docXMl.LastChild.Name;
                ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:LicActivationSucc('" + strType + "','" + strText.TrimEnd() + "');", true);
            }
            else
                ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:LicActivationSucc('error','Something went wrong please try again later..');", true);
        }
        catch (Exception ex)
        {
            LogFile.Log logObj = new LogFile.Log();
            logObj.CreateLog("Activate trial button:" + ex.Message, HttpContext.Current.Session.SessionID, "ActivateTrialLic", "new", "true");
        }
    }

    protected void btnDownload_Click(object sender, EventArgs e)
    {
        try
        {
            string userName = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName()).HostName;
            if (userName.IndexOf(".") > -1)
                userName = userName.Split('.')[0];
            string licappkey = txtlicofflinekey.Text;
            string trace = ConfigurationManager.AppSettings["LoginTrace"].ToString();
            string inputXMl = "<root username=\"" + userName + "\" licno=\"" + licappkey + "\" offline=\"yes\" trace=\"" + trace + "\"></root>";
            ASB.WebService objws = new ASB.WebService();
            string result = objws.CallActivateLicenseWS(inputXMl);
            if (result != "")
            {
                XmlDocument docXMl = new XmlDocument();
                docXMl.LoadXml(result);
                string strText = docXMl.LastChild.InnerText;
                string strType = docXMl.LastChild.Name == "result" ? "success" : docXMl.LastChild.Name;
                ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:LicDownloadSucc('" + strType + "','" + strText.TrimEnd() + "');", true);
            }
            else
                ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:LicDownloadSucc('error','Something went wrong please try again later..');", true);
        }
        catch (Exception ex)
        {
            LogFile.Log logObj = new LogFile.Log();
            logObj.CreateLog("DownLoad button:" + ex.Message, HttpContext.Current.Session.SessionID, "DownloadReg", "new", "true");
        }
    }

    protected void btndownloadfile_Click(object sender, EventArgs e)
    {
        string scriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString();
        string filePath = scriptsPath + "\\Axpert.reg";
        FileInfo file = new FileInfo(filePath);
        if (file.Exists)
        {
            HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment; filename=" + file.Name);
            HttpContext.Current.Response.AddHeader("Content-Length", file.Length.ToString());
            HttpContext.Current.Response.ContentType = "application/octet-stream";
            HttpContext.Current.Response.WriteFile(file.FullName);
            HttpContext.Current.Response.Flush();
            HttpContext.Current.Response.Close();
            HttpContext.Current.Response.End();
        }
    }

    protected void btnFileUpload_Click(object sender, EventArgs e)
    {
        try
        {
            string scriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString();
            HttpFileCollection httpAttFiles = Request.Files;
            for (int i = 0; i < httpAttFiles.Count; i++)
            {
                HttpPostedFile httpAttFile = httpAttFiles[i];
                if ((httpAttFile != null) && (httpAttFile.ContentLength > 0))
                {
                    string thisFileName = Path.GetFileName(httpAttFile.FileName);
                    httpAttFile.SaveAs(scriptsPath + thisFileName);
                    ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:LicActivationSucc('success','Lic file uploaded successfully.');", true);
                }
            }
        }
        catch (Exception ex)
        {
            LogFile.Log logObj = new LogFile.Log();
            logObj.CreateLog("Upload button:" + ex.Message, HttpContext.Current.Session.SessionID, "UploadLic", "new", "true");
        }
    }

    protected void btndbpwb_Click(object sender, EventArgs e)
    {
        string result = string.Empty;
        Util.Util objutil = new Util.Util();
        try
        {
            string dbtype = ddldbtype.Value;
            string dbverno = ddldbversion.Value;
            string driver = ddldriver.SelectedValue;
            string dbconName = txtccname.Text;
            string userName = txtusername.Text;
            string pwd = txtPassword.Text;
            string newpwd = txtNewPassword.Text;
            txtPassword.Text = "";
            txtNewPassword.Text = "";
            txtConfirmPassword.Text = "";
            if (pwd == "")
                pwd = "log";
            pwd = objutil.EncryptPWD(pwd);

            newpwd = objutil.EncryptPWD(newpwd);

            string jsonData = "{";
            jsonData += "\"type\":\"db\"";
            jsonData += ",\"db\":\"" + dbtype + "\"";
            jsonData += ",\"version\":\"" + dbverno + "\"";
            jsonData += ",\"driver\":\"" + driver + "\"";
            jsonData += ",\"dbcon\":\"" + dbconName + "\"";
            //jsonData += ",\"structurl\":\"\"";
            //jsonData += ",\"dataurl\":\"\"";
            jsonData += ",\"dbuser\":\"" + userName.Replace(@"\", "\\\\") + "\"";
            jsonData += ",\"pwd\":\"" + pwd + "\"";
            jsonData += "}";
            string axpapp = userName;
            if (axpapp.Contains("\\"))
                axpapp = axpapp.Split('\\')[0];
            // GetDbConnection axapp licdetails 

            string lic_redis = string.Empty;
            string lic_file = string.Empty;
            string redisLicDetails = GetServerLicDetails();
            if (redisLicDetails != string.Empty && !redisLicDetails.StartsWith("error:"))
                lic_redis = redisLicDetails.Split('=')[1].ToString().Trim('\'');
            else
            {
                string ScriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString();
                string[] files = System.IO.Directory.GetFiles(ScriptsPath, "*.lic");
                if (files.Count() > 0)
                {
                    lic_file = files[0].Split('\\').Last();
                }
            }
            string trace = ConfigurationManager.AppSettings["LoginTrace"].ToString();
            string inputJson = "{\"_parameters\":[{\"setdbpassword\":{\"axpapp\":\"" + axpapp + "\",\"newpwd\":\"" + newpwd + "\",\"trace\":\"" + trace + "\"},\"" + axpapp + "\":" + jsonData + ",\"licdetails\":{\"lic_redis\":\"" + lic_redis + "\",\"lic_file\":\"" + lic_file + "\"}}]}";

            ASB.WebService objws = new ASB.WebService();
            string succMsg = objws.CallSetDBPasswordWS(inputJson);
            if (succMsg != "")
            {
                var details = JObject.Parse(succMsg);
                string changed = details["result"][0]["result"].ToString();
                if (changed == "true")
                    succMsg = "Password changed successfully.";
            }
            ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:SuccPasswordChange('success','" + succMsg + "');", true);
        }
        catch (Exception ex)
        {
            LogFile.Log logObj = new LogFile.Log();
            logObj.CreateLog("change password button:" + ex.Message, HttpContext.Current.Session.SessionID, "ChangePasswordDb", "new", "true");
        }
    }

    [WebMethod]
    public static string UserAuthentication(string AuthUsername, string AuthPwd)
    {
        string result = string.Empty;
        try
        {
            if (AuthUsername != "" && AuthPwd != "")
            {
                Util.Util objutil = new Util.Util();
                string inifile = File.ReadAllText(HttpContext.Current.Server.MapPath("~/ConfigAuthentication.ini"));
                if (inifile != null && inifile != "")
                {
                    dynamic json = JsonConvert.DeserializeObject(inifile.Replace("\r\n", ""));
                    foreach (var chlAuthUser in json)
                    {
                        if (chlAuthUser.uname.Value == AuthUsername && chlAuthUser.pwd.Value == AuthPwd)
                        {
                            result = objutil.encrtptDecryptAES(HttpContext.Current.Session.SessionID);
                            break;
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            LogFile.Log logObj = new LogFile.Log();
            logObj.CreateLog("User Authentication:" + ex.Message, HttpContext.Current.Session.SessionID, "UserAuthentication", "new", "true");
        }
        return result;
    }


    protected void btnRedisOk_Click(object sender, EventArgs e)
    {
        try
        {
            string connectionType = ddlIsRedisNewConnection.SelectedValue;
            string RConName = txtRedisNewConn.Text;
            string rHostName = txtrhotname.Text;
            string rPort = txtrport.Text;
            string rPwd = txtrpwd.Text;
            if (rPwd != "")
                rPwd = util.EncryptPWD(rPwd);
            string xml = "<" + RConName + ">";
            xml += "<host>" + rHostName + "</host>";
            xml += "<port>" + rPort + "</port>";
            if (hdnRPwd.Value == "false")
                xml += "<pwd></pwd>";
            else
                xml += "<pwd>" + rPwd + "</pwd>";
            xml += "</" + RConName + ">";

            string ScriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString();
            FileInfo fi = new FileInfo(ScriptsPath + "\\redisconns.xml");
            if (fi.Exists)
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(xml);
                XmlDocument docAxapp = new XmlDocument();
                docAxapp.Load(ScriptsPath + "\\redisconns.xml");
                if (connectionType == "new")
                {
                    bool isConnExists = false;
                    XmlNodeList pNode = docAxapp.SelectNodes("/axp_rconn");
                    foreach (XmlNode nodeName in pNode)
                    {
                        foreach (XmlNode nodeN in nodeName.ChildNodes)
                        {
                            if (nodeN.Name.ToString().ToLower() == RConName.ToLower())
                            {
                                isConnExists = true;
                                break;
                            }
                        }
                    }
                    if (isConnExists == false)
                    {
                        XmlNode newBook = docAxapp.ImportNode(doc.DocumentElement, true);
                        docAxapp.DocumentElement.AppendChild(newBook);
                        docAxapp.Save(ScriptsPath + "\\redisconns.xml");

                        List<string> lst = new List<string>();
                        XmlDocument docList = new XmlDocument();
                        docList.Load(ScriptsPath + "\\redisconns.xml");
                        try
                        {
                            XmlNodeList ConNode = docList.SelectSingleNode("/axp_rconn").ChildNodes;
                            foreach (XmlNode nodename in ConNode)
                            {
                                lst.Add(nodename.Name);
                            }
                        }
                        catch (Exception ex)
                        { }
                        jsonRedisText = docAxapp.OuterXml;
                        jsonRedisText = util.CheckSpecialChars(jsonRedisText);

                        lstRconnection.DataSource = lst;
                        lstRconnection.DataBind();
                        ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:SuccRedisConnection('success','" + RConName + "');", true);
                    }
                    else
                        ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:SuccRedisConnection('failed','" + RConName + "');", true);
                }
                else
                {
                    XmlNode node = docAxapp.SelectSingleNode("/axp_rconn/" + RConName);
                    node.ParentNode.RemoveChild(node);
                    XmlNode newBook = docAxapp.ImportNode(doc.DocumentElement, true);
                    docAxapp.DocumentElement.AppendChild(newBook);
                    docAxapp.Save(ScriptsPath + "\\redisconns.xml");

                    List<string> lst = new List<string>();
                    XmlDocument docList = new XmlDocument();
                    docList.Load(ScriptsPath + "\\redisconns.xml");
                    try
                    {
                        XmlNodeList ConNode = docList.SelectSingleNode("/axp_rconn").ChildNodes;
                        foreach (XmlNode nodename in ConNode)
                        {
                            lst.Add(nodename.Name);
                        }
                    }
                    catch (Exception ex)
                    { }
                    jsonRedisText = docAxapp.OuterXml;
                    jsonRedisText = util.CheckSpecialChars(jsonRedisText);

                    lstRconnection.DataSource = lst;
                    lstRconnection.DataBind();
                    ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:SuccRedisConnection('success','" + RConName + "');", true);
                }
            }
            else
            {
                xml = "<axp_rconn>" + xml + "</axp_rconn>";
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(xml);
                doc.Save(ScriptsPath + "/redisconns.xml");

                List<string> lst = new List<string>();
                XmlDocument docList = new XmlDocument();
                docList.Load(ScriptsPath + "\\redisconns.xml");
                try
                {
                    XmlNodeList pNode = docList.SelectSingleNode("/axp_rconn").ChildNodes;
                    foreach (XmlNode nodename in pNode)
                    {
                        lst.Add(nodename.Name);
                    }
                }
                catch (Exception ex)
                { }
                jsonRedisText = doc.OuterXml;
                jsonRedisText = util.CheckSpecialChars(jsonRedisText);

                lstRconnection.DataSource = lst;
                lstRconnection.DataBind();
                ClientScript.RegisterStartupScript(this.GetType(), "Javascript", "javascript:SuccRedisConnection('success','" + RConName + "');", true);
            }
        }
        catch (Exception ex)
        {
            LogFile.Log logObj = new LogFile.Log();
            logObj.CreateLog("Apply Connect Ok button:" + ex.Message, HttpContext.Current.Session.SessionID, "applyconnectRedisok", "new", "true");
        }
    }

    protected void btnRedisdelete_Click(object sender, EventArgs e)
    {
        int slIndx = lstRconnection.SelectedIndex;
        if (slIndx != -1)
        {
            string selCon = lstRconnection.Items[slIndx].Value;
            string ScriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString();
            FileInfo fi = new FileInfo(ScriptsPath + "\\redisconns.xml");
            if (fi.Exists)
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(ScriptsPath + "\\redisconns.xml");
                XmlNode node = doc.SelectSingleNode("/axp_rconn/" + selCon);
                node.ParentNode.RemoveChild(node);
                doc.Save(ScriptsPath + "\\redisconns.xml");
                Response.Redirect("Config.aspx");
            }
        }
    }

    public static ConnectionMultiplexer RedisConnect(string rhost, string rport, string rpwd, bool GetServerInfo = false)
    {
        try
        {
            string redisIP = rhost + ":" + rport;
            if (Rconfig == null)
            {
                HashSet<string> redisCommands = new HashSet<string>
                {
                    "CLUSTER",
                    "PING", "ECHO", "CLIENT",
                    "SUBSCRIBE", "UNSUBSCRIBE", "NULL"
                };

                if (!GetServerInfo)
                {
                    redisCommands.Add("INFO");
                    redisCommands.Add("CONFIG");
                }
                Rconfig = new ConfigurationOptions
                {
                    SyncTimeout = 10,//int.MaxValue,
                    KeepAlive = 10,
                    Password = rpwd,
                    AbortOnConnectFail = false,
                    AllowAdmin = true,
                    CommandMap = CommandMap.Create(redisCommands, available: false)
                };
                if (redisIP != "")
                {
                    foreach (var rIP in redisIP.Split(','))
                    {
                        Rconfig.EndPoints.Add(rIP);
                    }
                }
            }
            if (redisIP != "")
            {
                ConnectionMultiplexer rredis = ConnectionMultiplexer.Connect(Rconfig);
                return rredis;
            }
        }
        catch (Exception ex)
        {
            //schemaNameKey = string.Empty;
            //logObj.CreateLog("Redis Server Constructor(RedisServer), Message:" + ex.Message, GetSessionId(), "RedisServer", "new"); return null;
        }
        return null;
    }

    [WebMethod]
    public static string RedisTestConnection(string rHost, string rPort, string rPwd)
    {
        string result = string.Empty;
        try
        {
            Rconfig = null;
            var rredis = RedisConnect(rHost, rPort, "");
            if (rredis != null && !rredis.IsConnected && rPwd != "")
            {
                RedisClose(rredis);
                Rconfig = null;
                var rredisnew = RedisConnect(rHost, rPort, rPwd);
                if (rredisnew != null && rredisnew.IsConnected)
                    result = "true:yes";
                else
                    result = "false";
            }
            else if (rredis != null && rredis.IsConnected)
            {
                result = "true:no";
            }
            else
                result = "false";
            RedisClose(rredis);
            Rconfig = null;
        }
        catch (Exception ex)
        {
            LogFile.Log logObj = new LogFile.Log();
            logObj.CreateLog("Test Redis Connect button:" + ex.Message, HttpContext.Current.Session.SessionID, "RedisTestConnection", "new", "true");
        }
        return result;
    }

    private static void RedisClose(ConnectionMultiplexer redis)
    {
        if (redis != null)
            redis.Close(false);
    }
    [WebMethod]
    public static string ARMConnection(string aKey, string aUrl, string aScriptsUrl, string aPeg, string proj)
    {
        string result = "";
        try
        {
            string ARM_PrivateKey = aKey;
            string ARM_URL = aUrl;
            string ARMScripts_URL = aScriptsUrl;
            string PEG = aPeg;
            string project = proj;
            var propertiesDict = new Dictionary<string, object>
            {
                { "ARM_PrivateKey", aKey },
                { "ARM_URL", aUrl },
                { "ARM_Scripts_URL", aScriptsUrl },
                { "PEG", aPeg }
            };
            // Create a dictionary for the main object with dynamic property name
            var mainDict = new Dictionary<string, object>
            {
                { project, propertiesDict }
            };
            string jsonString = JsonConvert.SerializeObject(mainDict);
            string ScriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString() + "armconfig.ini";
            string filePath = @" " + ScriptsPath + "";
            string directoryPath = Path.GetDirectoryName(filePath);
            FileInfo Filefi = new FileInfo(ScriptsPath);
            if (!Filefi.Exists)
            {
                File.WriteAllText(ScriptsPath, jsonString);

            }
            else
            // Read the existing JSON from the file
            {
                string existingJson = File.ReadAllText(filePath);

                // Parse the existing JSON
                if (existingJson != "")
                {
                    JObject json = JObject.Parse(existingJson);

                    // Parse the new JSON
                    JObject newData = JObject.Parse(jsonString);

                    // Merge the new JSON with the existing JSON
                    json.Merge(newData, new JsonMergeSettings
                    {
                        MergeArrayHandling = MergeArrayHandling.Union
                    });

                    // Write the updated JSON back to the file
                    File.WriteAllText(filePath, json.ToString());
                }
            }
        }
        catch (Exception ex)
        {
        }

        try
        {
            FDW fdwObj = FDW.Instance;
            fdwObj.DeleteAllKeys(proj + "-" + Constants.AXARM_CONN_KEY, proj);
        }
        catch (Exception ex) { }
        string ScriptsPathARM = HttpContext.Current.Application["ScriptsPath"].ToString() + "armconfig.ini";
        string filePatharm = @" " + ScriptsPathARM + "";
        string directoryPatharm = Path.GetDirectoryName(filePatharm);
        FileInfo Filefiarm = new FileInfo(ScriptsPathARM);
        try
        {
            if (Filefiarm.Exists)
            {
                string existingJsonARM = File.ReadAllText(filePatharm);
                existingJsonARM = JsonConvert.SerializeObject(existingJsonARM);
                result = existingJsonARM;
            }

        }
        catch (Exception ex) { }
        return result;
    }


    [WebMethod]
    public static string DelARMConnectionWs(string proj)
    {
        string result = "";
        try
        {
            string ScriptsPathARM = HttpContext.Current.Application["ScriptsPath"].ToString() + "armconfig.ini";
            string filePath = @" " + ScriptsPathARM + "";
            string directoryPath = Path.GetDirectoryName(filePath);
            if (Directory.Exists(directoryPath))
            {
                string existingJsonARM = File.ReadAllText(filePath);
                // existingJsonARM = JsonConvert.SerializeObject(existingJsonARM);
                JObject jsonARM = JObject.Parse(existingJsonARM);
                if (jsonARM.Properties().Any(p => p.Name == proj))
                {
                    // Remove the proj key from the JSON data
                    jsonARM.Remove(proj);

                    // Convert the JObject back to a JSON string
                    string modifiedJsonARM = jsonARM.ToString();

                    // Write the modified JSON data back to the file
                    File.WriteAllText(filePath, modifiedJsonARM);
                }
            }
        }
        catch (Exception ex)
        {

        }
        try
        {
            FDW fdwObj = FDW.Instance;
            fdwObj.DeleteAllKeys(proj + "-" + Constants.AXARM_CONN_KEY, proj);
        }
        catch (Exception ex) { }
        string ScriptsPathARMdel = HttpContext.Current.Application["ScriptsPath"].ToString() + "armconfig.ini";
        string filePatharmdel = @" " + ScriptsPathARMdel + "";
        string directoryPatharmdel = Path.GetDirectoryName(filePatharmdel);
        FileInfo Filefiarmdel = new FileInfo(ScriptsPathARMdel);
        try
        {
            if (Filefiarmdel.Exists)
            {
                string existingJsonARM = File.ReadAllText(filePatharmdel);
                existingJsonARM = JsonConvert.SerializeObject(existingJsonARM);
                result = existingJsonARM;
            }

        }
        catch (Exception ex) { }
        return result;
    }

    [WebMethod]
    public static string FileConnection(string fUpload, string fDownload, string proj, string fMapUsername, string fMapPwd)
    {
        string result = "";
        try
        {
            string fileUploadPath = fUpload;
            if (fileUploadPath != "" && !fileUploadPath.EndsWith("\\"))
                fileUploadPath += "\\";
            string fileDownloadPath = fDownload;
            if (fileDownloadPath != "" && !fileDownloadPath.EndsWith("\\"))
                fileDownloadPath += "\\";
            string project = proj;
            var propertiesDict = new Dictionary<string, object>
            {
                { "FileUploadPath", fileUploadPath },
                { "FileDownloadPath", fileDownloadPath },
                { "FileServerMapUsername", fMapUsername },
                { "FileServerMapPwd", fMapPwd }
            };
            // Create a dictionary for the main object with dynamic property name
            var mainDict = new Dictionary<string, object>
            {
                { project, propertiesDict }
            };
            string jsonString = JsonConvert.SerializeObject(mainDict);
            string ScriptsPath = HttpContext.Current.Application["ScriptsPath"].ToString() + "fileconfig.ini";
            string filePath = @" " + ScriptsPath + "";
            string directoryPath = Path.GetDirectoryName(filePath);
            FileInfo Filefi = new FileInfo(ScriptsPath);
            if (!Filefi.Exists)
            {
                File.WriteAllText(ScriptsPath, jsonString);

            }
            else
            // Read the existing JSON from the file
            {
                string existingJson = File.ReadAllText(filePath);
                // Parse the existing JSON
                if (existingJson != "")
                {
                    JObject json = JObject.Parse(existingJson);

                    // Parse the new JSON
                    JObject newData = JObject.Parse(jsonString);

                    // Merge the new JSON with the existing JSON
                    json.Merge(newData, new JsonMergeSettings
                    {
                        MergeArrayHandling = MergeArrayHandling.Union
                    });

                    // Write the updated JSON back to the file
                    File.WriteAllText(filePath, json.ToString());
                }
            }
        }
        catch (Exception ex)
        {

        }
        try
        {
            FDW fdwObj = FDW.Instance;
            fdwObj.DeleteAllKeys(proj + "-" + Constants.AXFileServer_CONN_KEY, proj);
        }
        catch (Exception ex) { }
        string ScriptsPathfile = HttpContext.Current.Application["ScriptsPath"].ToString() + "fileconfig.ini";
        string filePathfile = @" " + ScriptsPathfile + "";
        string directoryPatharm = Path.GetDirectoryName(filePathfile);
        FileInfo Filefifilee = new FileInfo(ScriptsPathfile);
        try
        {
            if (Filefifilee.Exists)
            {
                string existingJsonFile = File.ReadAllText(filePathfile);
                existingJsonFile = JsonConvert.SerializeObject(existingJsonFile);
                result = existingJsonFile;
            }

        }
        catch (Exception ex) { }
        return result;
    }

    [WebMethod]
    public static string DelFileConnectionWs(string proj)
    {
        string result = "";
        try
        {
            string ScriptsPathFile = HttpContext.Current.Application["ScriptsPath"].ToString() + "fileconfig.ini";
            string filePath = @" " + ScriptsPathFile + "";
            string directoryPath = Path.GetDirectoryName(filePath);
            if (Directory.Exists(directoryPath))
            {
                string existingJsonFilee = File.ReadAllText(filePath);
                // Parse JSON data into a JObject
                JObject jsonFile = JObject.Parse(existingJsonFilee);
                if (jsonFile.Properties().Any(p => p.Name == proj))
                {
                    // Remove the proj key from the JSON data
                    jsonFile.Remove(proj);

                    // Convert the JObject back to a JSON string
                    string modifiedJsonfile = jsonFile.ToString();

                    // Write the modified JSON data back to the file
                    File.WriteAllText(filePath, modifiedJsonfile);
                }

            }
        }
        catch (Exception ex)
        {

        }
        try
        {
            FDW fdwObj = FDW.Instance;
            fdwObj.DeleteAllKeys(proj + "-" + Constants.AXFileServer_CONN_KEY, proj);
        }
        catch (Exception ex) { }

        string ScriptsPathfiledel = HttpContext.Current.Application["ScriptsPath"].ToString() + "fileconfig.ini";
        string filePathfiledel = @" " + ScriptsPathfiledel + "";
        string directoryPatharmdel = Path.GetDirectoryName(filePathfiledel);
        FileInfo Filefifileedel = new FileInfo(ScriptsPathfiledel);
        try
        {
            if (Filefifileedel.Exists)
            {
                string existingJsonFile = File.ReadAllText(filePathfiledel);
                existingJsonFile = JsonConvert.SerializeObject(existingJsonFile);
                result = existingJsonFile;
            }

        }
        catch (Exception ex) { }
        return result;
    }
}
