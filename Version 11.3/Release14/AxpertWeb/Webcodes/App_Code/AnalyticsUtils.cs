﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class AnalyticsUtils
{

    public string ARM_URL = string.Empty;
    public string ARMSessionId = string.Empty;
    public AnalyticsUtils()
    {
        ARM_URL = GetARM_URL();
        ARMSessionId = GetARMSessionId();
    }
    
    public string CallWebAPI(string url, string method = "GET", string contentType = "application/json", string body = "", string calledFrom = "")
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
                result = ex.Message;
            }
        }
        catch (Exception e)
        {
            result = e.Message;
        }

        AddToARMLog("Output Json: " + Environment.NewLine + result);
        return result;
    }
    private string RefreshSessionAndRecallAPI(string url, string method = "GET", string contentType = "application/json", string body = "", string calledFrom = "")
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
    private string MD5Hash(string text)
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
    public string GetARMSessionId()
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

    public Dictionary<string, string> GetGlobalParams()
    {
        Dictionary<string, string> globalParams = new Dictionary<string, string>();
        if (HttpContext.Current.Session["axGlobalVarsJson"] == null)
        {
            string xml = HttpContext.Current.Session["axGlobalVars"].ToString();

            XElement root = XElement.Parse(xml);
            globalParams = root.Elements().ToDictionary(e => e.Name.LocalName, e => e.Value);

            HttpContext.Current.Session["axGlobalVarsJson"] = JsonConvert.SerializeObject(globalParams);
        }
        else
        {
            string json = (string)HttpContext.Current.Session["axGlobalVarsJson"];
            globalParams = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
        }

        return globalParams;
    }


    public Dictionary<string, string> GetViewFilters(List<string> transIds = null)
    {
        Dictionary<string, string> viewFilters = new Dictionary<string, string>();
        if (HttpContext.Current.Session["ViewFiltersDictionary"] == null)
        {
            string xml = HttpContext.Current.Session["axGlobalVars"].ToString();

            XElement root = XElement.Parse(xml);
            Dictionary<string, string> globalVars = root.Elements().ToDictionary(e => e.Name.LocalName, e => e.Value);

            foreach (var kvp in globalVars)
            {
                if (kvp.Key.ToLower().EndsWith("_filter"))
                {
                    string sql = kvp.Value;

                    sql = ReplaceSqlParameters(sql, globalVars);
                    viewFilters.Add(kvp.Key.ToLower().Replace("_filter", ""), sql);
                }
            }
            HttpContext.Current.Session["ViewFiltersDictionary"] = JsonConvert.SerializeObject(viewFilters);
        }
        else
        {
            string json = (string)HttpContext.Current.Session["ViewFiltersDictionary"];
            viewFilters = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
        }

        Dictionary<string, string> result = new Dictionary<string, string>();
        if (transIds != null && viewFilters != null)
        {
            foreach (var transId in transIds)
            {
                if (viewFilters.ContainsKey(transId))
                {
                    result.Add(transId, viewFilters[transId]);
                }
            }
        }
        return result;
    }

    private string ReplaceSqlParameters(string sql, Dictionary<string, string> parameters)
    {
        Regex regex = new Regex(@"\:\w+");

        // Use StringBuilder for efficient string manipulation
        StringBuilder sb = new StringBuilder(sql);

        // Find all parameter matches in the SQL string
        MatchCollection matches = regex.Matches(sql);

        // Iterate over matches in reverse order to avoid index issues
        for (int i = matches.Count - 1; i >= 0; i--)
        {
            Match match = matches[i];
            string paramKey = match.Value.Substring(1); // Remove leading ':'

            // Check if the parameter key exists in the dictionary
            if (parameters.ContainsKey(paramKey))
            {
                // Replace the parameter in SQL with its corresponding value
                sb.Remove(match.Index, match.Length); // Remove original parameter
                sb.Insert(match.Index, "'" + parameters[paramKey] + "'"); // Insert replacement value
            }
        }

        return sb.ToString();
    }


    public string GetARM_URL()
    {
        string ARM_URL = string.Empty;
        if (HttpContext.Current.Session["ARM_URL"] != null)
            ARM_URL = HttpContext.Current.Session["ARM_URL"].ToString();
        return ARM_URL;
    }
    public void AddToARMLog(string text)
    {
        if (HttpContext.Current.Session["AxTrace"].ToString() == "true")
        {
            text = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss.fff") + " - " + text;
            LogFile.Log logobj = new LogFile.Log();
            string sessID = "";
            if (HttpContext.Current.Session != null)
                sessID = HttpContext.Current.Session.SessionID;
            logobj.CreateLog(text, sessID, "Analytics Page Logs", "");
        }
    }


}