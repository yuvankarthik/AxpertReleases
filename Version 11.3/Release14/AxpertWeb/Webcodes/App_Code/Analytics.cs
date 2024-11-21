using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class Analytics
{
    List<string> analyticsProperties = new List<string> { "xAxisFields", "yAxisFields" };
    string ARM_URL = string.Empty;
    string ARMSessionId = string.Empty;
    AnalyticsUtils _aUtils;

    public Analytics() {
        _aUtils = new AnalyticsUtils();
        ARM_URL = _aUtils.ARM_URL;
        ARMSessionId = _aUtils.ARMSessionId;
    }

    public string GetAnalyticsEntityData(string page = "", string transId = "")
    {        
        string apiUrl = ARM_URL + "/api/v1/GetAnalyticsEntityData";

        var inputJson = new
        {
            Page = page,
            ARMSessionId = ARMSessionId,
            AxSessionId = HttpContext.Current.Session.SessionID,
            TransId = transId,
            Trace = HttpContext.Current.Session["AxTrace"].ToString(),
            AppName = HttpContext.Current.Session["project"].ToString(),
            Roles = HttpContext.Current.Session["AxRole"].ToString(),
            UserName = HttpContext.Current.Session["username"].ToString(),
            PropertiesList = analyticsProperties
        };

        var analyticsData = _aUtils.CallWebAPI(apiUrl, "POST", "application/json", JsonConvert.SerializeObject(inputJson));
        return analyticsData;
    }

    public string SetAnalyticsData(string page, string transId, Dictionary<string, string> properties, bool allUsers)
    {       
        string apiUrl = ARM_URL + "/api/v1/SetAnalyticsData";

        var inputJson = new
        {
            Page = page,
            ARMSessionId = ARMSessionId,
            AxSessionId = HttpContext.Current.Session.SessionID,
            Trace = HttpContext.Current.Session["AxTrace"].ToString(),
            AppName = HttpContext.Current.Session["project"].ToString(),
            TransId = transId,
            Properties = properties,
            All = allUsers,
            Roles = HttpContext.Current.Session["AxRole"].ToString(),
            UserName = HttpContext.Current.Session["username"].ToString()
        };

        var result = _aUtils.CallWebAPI(apiUrl, "POST", "application/json", JsonConvert.SerializeObject(inputJson));
        return result;
    }

    public string GetAnalyticsData(string page, string transId, List<string> propertiesList)
    {        
        string apiUrl = ARM_URL + "/api/v1/GetAnalyticsData";

        var inputJson = new
        {
            Page = page,
            ARMSessionId = ARMSessionId,
            AxSessionId = HttpContext.Current.Session.SessionID,
            Trace = HttpContext.Current.Session["AxTrace"].ToString(),
            AppName = HttpContext.Current.Session["project"].ToString(),
            TransId = transId,
            PropertiesList = propertiesList,
            Roles = HttpContext.Current.Session["AxRole"].ToString(),
            UserName = HttpContext.Current.Session["username"].ToString()
        };

        var result = _aUtils.CallWebAPI(apiUrl, "POST", "application/json", JsonConvert.SerializeObject(inputJson));
        return result;
    }

    public string GetAnalyticsChartsData(string page, string transId, string aggField, string aggTransId, string groupField, string groupTransId, string aggFunc)
    {
        string apiUrl = ARM_URL + "/api/v1/GetAnalyticsChartsData";

        var inputJson = new
        {
            Page = page,
            ARMSessionId = ARMSessionId,
            AxSessionId = HttpContext.Current.Session.SessionID,
            Trace = HttpContext.Current.Session["AxTrace"].ToString(),
            AppName = HttpContext.Current.Session["project"].ToString(),
            TransId = transId,
            ChartMetaData = new List<object>
            { 
                new {
                    Aggfield = aggField,
                    Groupfield = groupField,
                    AggTransId = aggTransId,
                    Grouptransid = groupTransId,
                    AggFunc = aggFunc
                }
            },
            Roles = HttpContext.Current.Session["AxRole"].ToString(),
            UserName = HttpContext.Current.Session["username"].ToString()
        };

        var result = _aUtils.CallWebAPI(apiUrl, "POST", "application/json", JsonConvert.SerializeObject(inputJson));
        return result;
    }
    public string GetEntityList(string selectedEntites = "")
    {
        string tasksUrl = ARM_URL + "/api/v1/GetEntityList";

        var entityDetails = new
        {
            ARMSessionId = ARMSessionId,
            AxSessionId = HttpContext.Current.Session.SessionID,
            Trace = HttpContext.Current.Session["AxTrace"].ToString(),
            AppName = HttpContext.Current.Session["project"].ToString(),
            UserName = HttpContext.Current.Session["username"].ToString(),
            Roles = HttpContext.Current.Session["AxRole"].ToString(),
            EntityName = selectedEntites
        };

        var entities = _aUtils.CallWebAPI(tasksUrl, "POST", "application/json", JsonConvert.SerializeObject(entityDetails));
        return entities;

    }


}