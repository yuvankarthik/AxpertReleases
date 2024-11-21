--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Ubuntu 14.8-1.pgdg20.04+1)
-- Dumped by pg_dump version 14.5

-- Started on 2023-12-15 15:46:41

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 2434075)
-- Name: APIDefinitions; Type: TABLE; Schema: public; Owner: agileconnect
--

CREATE TABLE public."APIDefinitions" (
    "ID" uuid NOT NULL,
    "DataSourceID" text NOT NULL,
    "ARMDataSourceID" uuid,
    "AppName" text DEFAULT ''::text NOT NULL,
    "DataSyncAPIList" text,
    "selectedDataSyncDataSources" uuid[],
    "selectedUserGroups" uuid[],
    "RequestType" text,
    "DataSourceDesc" text,
    "DataSourceURL" text,
    "DataSourceFormat" text,
    "IsActive" boolean NOT NULL,
    "IsMasterData" boolean,
    "IsDataSyncActive" boolean DEFAULT false NOT NULL,
    "DataSyncInterval" integer,
    "LastSyncedOn" timestamp without time zone,
    "CreatedOn" timestamp without time zone,
    "UpdatedOn" timestamp without time zone,
    "DataSyncInitFormat" text,
    "AllowAnonymousAccess" boolean DEFAULT false NOT NULL,
    expiry integer,
    iscached boolean
);


ALTER TABLE public."APIDefinitions" OWNER TO agileconnect;

--
-- TOC entry 217 (class 1259 OID 381481)
-- Name: ARMApps; Type: TABLE; Schema: public; Owner: agileconnect
--

CREATE TABLE public."ARMApps" (
    "AppName" text NOT NULL,
    "AppTitle" text NOT NULL,
    "AppLogo" text,
    "AppColor" text,
    "AxpertWebUrl" text,
    "IsCitizenUsers" boolean,
    "IsGeoFencing" boolean,
    "ForceLoginDays" text,
    "IsGeoTagging" boolean,
    "EnableFingerPrint" boolean,
    "EnablefacialRecognition" boolean,
    "ForceLogin" boolean,
    "AxpertAppName" text,
    "ConnectionName" text,
    "DBVersion" text,
    "DataBase" text,
    "Password" text,
    "UserName" text,
    "PrivateKey" text,
    "RedisIP" text,
    "RedisPassword" text,
    "AxpertScriptsUrl" text DEFAULT ''::text NOT NULL,
    "AxpertScriptsPath" text,
    modifiedon timestamp without time zone
);


ALTER TABLE public."ARMApps" OWNER TO agileconnect;

--
-- TOC entry 209 (class 1259 OID 380843)
-- Name: ARMDataSources; Type: TABLE; Schema: public; Owner: agileconnect
--

CREATE TABLE public."ARMDataSources" (
    "ID" uuid NOT NULL,
    "DataSourceID" text NOT NULL,
    "Type" text,
    "SQLScript" text,
    "DataSourceDesc" text,
    "DataSourceURL" text,
    "DataSourceFormat" text,
    "IsActive" boolean NOT NULL,
    "IsMasterData" boolean,
    "IsDataSyncActive" boolean DEFAULT false NOT NULL,
    "DataSyncInterval" integer,
    "LastSyncedOn" timestamp without time zone,
    "CreatedOn" timestamp without time zone,
    "UpdatedOn" timestamp without time zone,
    "DataSyncInitFormat" text,
    "AllowAnonymousAccess" boolean DEFAULT false NOT NULL,
    "ARMDataSourceID" uuid,
    "AppName" text DEFAULT ''::text NOT NULL,
    "DataSyncAPIList" text,
    "selectedDataSyncDataSources" uuid[],
    "selectedUserGroups" uuid[],
    "RequestType" text
);


ALTER TABLE public."ARMDataSources" OWNER TO agileconnect;

--
-- TOC entry 210 (class 1259 OID 380851)
-- Name: ARMDefinations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ARMDefinations" (
    "ID" uuid NOT NULL,
    "DefinitionID" text NOT NULL,
    "DefinitionHTML" text NOT NULL,
    "DataSource" text,
    "CreatedOn" timestamp without time zone,
    "UpdatedOn" timestamp without time zone,
    "AllowAnonymousAccess" boolean DEFAULT false NOT NULL,
    "AppName" text DEFAULT ''::text NOT NULL,
    "DataSources" text[],
    "selectedUserGroups" uuid[],
    "Description" character varying,
    "Title" character varying
);


ALTER TABLE public."ARMDefinations" OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 380858)
-- Name: ARMSignInUsers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ARMSignInUsers" (
    "Id" uuid NOT NULL,
    "UserName" text NOT NULL,
    "Password" text NOT NULL
);


ALTER TABLE public."ARMSignInUsers" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 531956)
-- Name: ARMUserDevices; Type: TABLE; Schema: public; Owner: agileconnect
--

CREATE TABLE public."ARMUserDevices" (
    id uuid NOT NULL,
    deviceid text NOT NULL,
    appname text NOT NULL,
    username text NOT NULL
);


ALTER TABLE public."ARMUserDevices" OWNER TO agileconnect;

--
-- TOC entry 218 (class 1259 OID 381488)
-- Name: ARMUserGroups; Type: TABLE; Schema: public; Owner: agileconnect
--

CREATE TABLE public."ARMUserGroups" (
    "ID" uuid NOT NULL,
    "AppName" text NOT NULL,
    "Name" text NOT NULL,
    "IsActive" boolean NOT NULL,
    "Roles" text[],
    "GroupType" text,
    "InternalAuthMethod" text,
    "InternalAuthUrl" text,
    "InternalAuthRequest" text,
    "InternalAuthResponse" text
);


ALTER TABLE public."ARMUserGroups" OWNER TO agileconnect;

--
-- TOC entry 212 (class 1259 OID 380868)
-- Name: ARMUsers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ARMUsers" (
    "ID" uuid NOT NULL,
    "AppName" text NOT NULL,
    "UserName" text NOT NULL,
    "Password" text NOT NULL,
    "Email" text NOT NULL,
    "MobileNo" text,
    "UserGroupId" uuid NOT NULL,
    "UserGroup" text NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedOn" timestamp without time zone,
    "ActivatedOn" timestamp without time zone
);


ALTER TABLE public."ARMUsers" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 515078)
-- Name: AxInLineForm; Type: TABLE; Schema: public; Owner: agileconnect
--

CREATE TABLE public."AxInLineForm" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "formIcon" text NOT NULL,
    "StatusValue" text NOT NULL,
    "FormText" text NOT NULL,
    "AcessControl" text[],
    "HideInMyList" text[],
    "FormCreator" text,
    "FormCreatedOn" text,
    "AddQuickAccess" boolean NOT NULL,
    "EnableSend" boolean NOT NULL,
    "SelectedSendOnlyTo" text[],
    "AutoSend" text,
    "AutoSendCondition" text,
    "FormValidations" text,
    "Compuations" text,
    "ButtonCaption" text,
    "ButtonIcon" text,
    "ButtonScript" text,
    "QueueName" text,
    "Module" text,
    "SubModule" text,
    "appName" text,
    navigation boolean,
    "FormUpdatedBy" text,
    "FormUpdatedOn" text
);


ALTER TABLE public."AxInLineForm" OWNER TO agileconnect;

--
-- TOC entry 222 (class 1259 OID 515085)
-- Name: AxModulePages; Type: TABLE; Schema: public; Owner: agileconnect
--

CREATE TABLE public."AxModulePages" (
    "Id" uuid NOT NULL,
    "PageTitle" text NOT NULL,
    "PageName" text NOT NULL,
    "PageIcon" text NOT NULL,
    "Module" text,
    "SubModule" text,
    "PageDataTable" text NOT NULL,
    "PageOwner" text NOT NULL,
    "Forms" text[],
    "KeyField" text,
    "AcessControl" text[],
    "AddQuickAccess" boolean NOT NULL,
    "appName" text,
    navigation boolean,
    formdata character varying
);


ALTER TABLE public."AxModulePages" OWNER TO agileconnect;

--
-- TOC entry 219 (class 1259 OID 512758)
-- Name: AxModules; Type: TABLE; Schema: public; Owner: agileconnect
--

CREATE TABLE public."AxModules" (
    "Id" uuid NOT NULL,
    "ModuleName" text NOT NULL,
    "ModuleDescription" text NOT NULL,
    "appName" text
);


ALTER TABLE public."AxModules" OWNER TO agileconnect;

--
-- TOC entry 220 (class 1259 OID 514928)
-- Name: AxSubModules; Type: TABLE; Schema: public; Owner: agileconnect
--

CREATE TABLE public."AxSubModules" (
    "Id" uuid NOT NULL,
    "SubModuleName" text NOT NULL,
    "SubModuleDescription" text NOT NULL,
    "appName" text
);


ALTER TABLE public."AxSubModules" OWNER TO agileconnect;

--
-- TOC entry 213 (class 1259 OID 380873)
-- Name: AxpertUsers; Type: TABLE; Schema: public; Owner: agileconnect
--

CREATE TABLE public."AxpertUsers" (
    "ID" integer NOT NULL,
    "AppName" text NOT NULL,
    "UserName" text NOT NULL,
    "Password" text NOT NULL,
    "Email" text NOT NULL,
    "MobileNo" text,
    "IsActive" boolean NOT NULL
);


ALTER TABLE public."AxpertUsers" OWNER TO agileconnect;

--
-- TOC entry 214 (class 1259 OID 380878)
-- Name: NotificationTemplate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NotificationTemplate" (
    "Id" integer NOT NULL,
    "AppName" text NOT NULL,
    "TemplateId" text NOT NULL,
    "TemplateString" text NOT NULL
);


ALTER TABLE public."NotificationTemplate" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 380883)
-- Name: NotificationTemplate_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."NotificationTemplate" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."NotificationTemplate_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 2435733)
-- Name: SQLDataSource; Type: TABLE; Schema: public; Owner: agileconnect
--

CREATE TABLE public."SQLDataSource" (
    "ID" uuid NOT NULL,
    "DataSourceID" text NOT NULL,
    "ARMDataSourceID" uuid,
    "AppName" text DEFAULT ''::text NOT NULL,
    "DataSyncAPIList" text,
    "selectedDataSyncDataSources" uuid[],
    "selectedUserGroups" uuid[],
    "SQLScript" text,
    "DataSourceDesc" text,
    "IsActive" boolean NOT NULL,
    "IsMasterData" boolean,
    "IsDataSyncActive" boolean DEFAULT false NOT NULL,
    "DataSyncInterval" integer,
    "LastSyncedOn" timestamp without time zone,
    "CreatedOn" timestamp without time zone,
    "UpdatedOn" timestamp without time zone,
    "DataSyncInitFormat" text,
    expiry integer,
    iscached boolean
);


ALTER TABLE public."SQLDataSource" OWNER TO agileconnect;

--
-- TOC entry 216 (class 1259 OID 380884)
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 2225576)
-- Name: armlogs; Type: TABLE; Schema: public; Owner: agileconnect
--

CREATE TABLE public.armlogs (
    path character varying,
    module character varying,
    logdetails character varying,
    username character varying,
    logtime character varying,
    logtype character varying,
    "Id" uuid NOT NULL,
    instanceid character varying
);


ALTER TABLE public.armlogs OWNER TO agileconnect;

--
-- TOC entry 3389 (class 0 OID 0)
-- Dependencies: 215
-- Name: NotificationTemplate_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."NotificationTemplate_Id_seq"', 3, true);


--
-- TOC entry 3214 (class 2606 OID 381487)
-- Name: ARMApps PK_ARMApps; Type: CONSTRAINT; Schema: public; Owner: agileconnect
--

ALTER TABLE ONLY public."ARMApps"
    ADD CONSTRAINT "PK_ARMApps" PRIMARY KEY ("AppName");


--
-- TOC entry 3204 (class 2606 OID 380892)
-- Name: ARMDefinations PK_ARMDefinations; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ARMDefinations"
    ADD CONSTRAINT "PK_ARMDefinations" PRIMARY KEY ("ID");


--
-- TOC entry 3206 (class 2606 OID 380894)
-- Name: ARMSignInUsers PK_ARMSignInUsers; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ARMSignInUsers"
    ADD CONSTRAINT "PK_ARMSignInUsers" PRIMARY KEY ("Id");


--
-- TOC entry 3226 (class 2606 OID 531962)
-- Name: ARMUserDevices PK_ARMUserDevices; Type: CONSTRAINT; Schema: public; Owner: agileconnect
--

ALTER TABLE ONLY public."ARMUserDevices"
    ADD CONSTRAINT "PK_ARMUserDevices" PRIMARY KEY (id);


--
-- TOC entry 3216 (class 2606 OID 381494)
-- Name: ARMUserGroups PK_ARMUserGroups; Type: CONSTRAINT; Schema: public; Owner: agileconnect
--

ALTER TABLE ONLY public."ARMUserGroups"
    ADD CONSTRAINT "PK_ARMUserGroups" PRIMARY KEY ("ID");


--
-- TOC entry 3208 (class 2606 OID 380898)
-- Name: ARMUsers PK_ARMUsers; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ARMUsers"
    ADD CONSTRAINT "PK_ARMUsers" PRIMARY KEY ("ID");


--
-- TOC entry 3222 (class 2606 OID 515084)
-- Name: AxInLineForm PK_AxInLineForm; Type: CONSTRAINT; Schema: public; Owner: agileconnect
--

ALTER TABLE ONLY public."AxInLineForm"
    ADD CONSTRAINT "PK_AxInLineForm" PRIMARY KEY ("Id");


--
-- TOC entry 3224 (class 2606 OID 515091)
-- Name: AxModulePages PK_AxModulePages; Type: CONSTRAINT; Schema: public; Owner: agileconnect
--

ALTER TABLE ONLY public."AxModulePages"
    ADD CONSTRAINT "PK_AxModulePages" PRIMARY KEY ("Id");


--
-- TOC entry 3218 (class 2606 OID 512764)
-- Name: AxModules PK_AxModules; Type: CONSTRAINT; Schema: public; Owner: agileconnect
--

ALTER TABLE ONLY public."AxModules"
    ADD CONSTRAINT "PK_AxModules" PRIMARY KEY ("Id");


--
-- TOC entry 3220 (class 2606 OID 514934)
-- Name: AxSubModules PK_AxSubModule; Type: CONSTRAINT; Schema: public; Owner: agileconnect
--

ALTER TABLE ONLY public."AxSubModules"
    ADD CONSTRAINT "PK_AxSubModule" PRIMARY KEY ("Id");


--
-- TOC entry 3210 (class 2606 OID 380900)
-- Name: NotificationTemplate PK_NotificationTemplate; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotificationTemplate"
    ADD CONSTRAINT "PK_NotificationTemplate" PRIMARY KEY ("Id");


--
-- TOC entry 3212 (class 2606 OID 380902)
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


-- Completed on 2023-12-15 15:46:58

--
-- PostgreSQL database dump complete
--

