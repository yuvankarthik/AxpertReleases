class HomePageCards {
    constructor() {
        this.html = {
            HomePageCards: `
			<div class="mt-3 widgetWrapper htmlDomWrapper col-lg-3 col-md-3 col-sm-12 col-xs-3" id="HP_cards_list" data-cardname="{{caption}}">
                    <div class="Home-cards-list" style="background:{{colorcode}}">
                        <div class="Hp-card-icon attendicon">
                            <img alt="" class="w-60px cardsIcons" src="../images/homepageicon/{{caption}}.png" onerror="this.onerror=null;this.src='../images/homepageicon/default.png';" onclick="navigateFromCard('{{caption}}', '{{stransid}}')">
                        </div>
                        <span id="attendancetittle" class="Hp-card-title text-truncate" style="cursor:pointer" title="{{caption}}" onclick="navigateFromCard('{{caption}}','{{stransid}}')">{{caption}}</span><p title="{{carddesc}}" class="min-h-45px mh-45px multiline-ellipsis">{{carddesc}}</p>
                        <a href="javascript:void(0)" class="Hp-more-btn d-none1{{isMoreOption}}" data-fetching="rowcount-{{rowCount}}" id="Hp-more-btnid"
                            data-kt-menu-trigger="{default:'click', lg: 'click'}" data-kt-menu-overflow="true"
                            data-kt-menu-placement="bottom-end" title="{{caption}}" onclick="objHomePageCards.moreOptionsPopover('{{rowCount}}')">
                            <span class="material-icons material-icons-style">more_vert</span>
                        </a>
                        <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-muted menu-active-bg menu-state-primary fw-bold py-4 fs-6 w-300px " id="rowcount-{{rowCount}}" data-cardname="{{caption}}" data-rowcount="{{id}}" 
                        data-kt-menu="true" data-icon="{{displayicon}}">
                        
                        </div>
                    </div>
            </div>
            `,
            ActiveList: `
            <div id="ProcessFlow_New" class="header-fixed header-tablet-and-mobile-fixed aside-fixed">
            <!--begin::Content-->
            <div class="content d-flex flex-column flex-column-fluid ">
                <!--begin::Container-->
                <div id="kt_content_container" class="">
                    <!--begin::Row-->
        
                    <div class="row " id="ProcessFlow_New-overalldiv">
                        <div class="Page-Title-Bar">
                            <div class="d-flex align-items-center flex-wrap d-grid gap-2 ">
                                <div class="Page-Title">
                                    My List
                                    <div class="Tkts-toolbar-Left">
                                        <button id="" type="submit" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm">
                                            <span class="material-icons material-icons-style material-icons-2">filter_alt</span>
                                        </button>
                                        <button type="submit" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm" id="">
                                            <span class="material-icons material-icons-style material-icons-2">checklist</span>
                                        </button>
                                        <button type="submit" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm" id="">
                                            <span class="material-icons material-icons-style material-icons-2">search</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="row" id="Process-stepper">
                                    <div class="col-md-12">
                                        <!-- Stepers Wrapper -->
                                        <ul class="stepper stepper-horizontal">                                 
                                        </ul>
                                        <!-- /.Stepers Wrapper -->
                                    </div>
                                </div>
                                <div class="Tkts-toolbar-Right">
                                    <button id="" type="submit" class="btn btn-sm btn-icon btn-primary btn-active-primary btn-custom-border-radius">
                                        <span class="material-icons material-icons-style material-icons-2">add_task</span>
                                    </button>
                                    <button type="submit" id="" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm tb-btn btn-sm">
                                        <span class="material-icons material-icons-style material-icons-2">refresh</span>
                                    </button>
        
        
                                    <button type="submit" id="" class="btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm  tb-btn btn-sm">
                                        <span class="material-icons material-icons-style material-icons-2">history_toggle_off</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!--begin:::Col-->
                        <div class="col-xl-3 col-md-3 d-flex flex-column flex-column-fluid vh-100 min-vh-100" id="ProcessFlow_New_Left">
                            <div class="card card-xl-stretch  flex-root h-1px  ">
        
        
                                <div class="card-header">
                                    <ul class="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6">
                                        <li class="nav-item">
                                            <a class="nav-link active" data-bs-toggle="tab" href="#Tickets_Pending"><span class="material-icons material-icons-style material-icons-2 text-warning">add_task</span> Pending</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link " data-bs-toggle="tab" href="#Tickets_Completed"><span class="material-icons material-icons-style material-icons-2 text-success">add_task</span> Completed</a>
                                        </li>
                                    </ul>
                                </div>
        
                                <!--begin::Body-->
                                <div class="card-body h-300px ">
                                    <div id="ProcessFlow_New-container">
        
                                        <div class="tab-content" id="ProcessFlow_Content">
                                            <div class="tab-pane fade active show" role="tabpanel" id="Tickets_Pending">
                                            </div>
                                            <div class="tab-pane fade" role="tabpanel" id="Tickets_Completed">
                                                <div class="ProcessFlow_New-List-Items">
                                                    <div class="d-flex align-items-center Ticket-Num ">
                                                        <div class="symbol symbol-30px me-5">
                                                            <span class="symbol-label">
                                                                <span class="material-icons material-icons-style text-success">add_task</span>
                                                            </span>
                                                        </div>
                                                        <div class=" d-flex flex-column">
                                                            <a href="javascript:void(0)" class="ProcessFlow_New-List-Title">#TKT00013</a>
                                                        </div>
                                                    </div>
                                                    <div class=" ms-14 Ticket-Description">Writing headlines for blog posts is as much an art as it is a science, and probably warrants its own post, but for now, all I�d advise is experimenting with what works for your audience, especially if it�s not resonating with your audience </div>
                                                    <div class="Ticket-Details ms-14 ">
                                                        <div class="Ticket-Value">
                                                            <span class="Assigned-By"><span class="material-icons material-icons-style material-icons-2">person</span>Mohankumar </span>
                                                        </div>
                                                        <div class="Ticket-Value">
                                                            <span class="Assigned-Date">
                                                                <span class="material-icons material-icons-style material-icons-2">today</span>
                                                                24/07/23
                                                            </span>
                                                            <span class="Assigned-Date">
                                                                <span class="material-icons material-icons-style material-icons-2">schedule</span>
                                                                11:30pm
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!--end::Body-->
                                </div>
        
                            </div>
                            <!--end::Table Widget 1-->
                        </div>
                        <!--end:::Col-->
                        <!--begin:::Col-->
                        <div id="ProcessFlow_New_Right" class="col-xl-7  col-md-7 d-flex flex-column flex-column-fluid vh-100 min-vh-100">
                            <div class="card card-xl-stretch  flex-root h-1px  ">
                                <!--begin::Body-->
                                <div class="card-body p-9 " id="Tickets_details_view">
        
                                    <!--end::Card body-->
                                </div>
                                <iframe data-ignore-history="true" class="d-none" style="height: calc(100% - 0px);width: calc(100% - 0px);" id="rightIframe" src="about:blank"></iframe>
        
                            </div>
                            <!--end:::Col-->
                        </div>
                        <div id="ProcessFlow_New_Right_Last" class="col-xl-2 col-md-2 d-flex flex-column flex-column-fluid vh-100 min-vh-100">
                            <div class="card card-xl-stretch  flex-root h-1px  ">
        
                                <!--begin::Body-->
                                <div class="card-body h-300px ">
                                    <div class="row">
                                        <div class="col-xl-12 col-md-4 d-flex flex-column flex-column-fluid KPI_Section  ">
                                            <div class="card ">
                                                <div class="card-header collapsible cursor-pointer " data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#KPI-1">
                                                    <h3 class="card-title">KPI Title</h3>
                                                    <div class="card-toolbar rotate-180">
                                                        <span class="material-icons material-icons-style material-icons-2">
                                                            expand_circle_down
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="collapse show" style="" id="KPI-1">
                                                    <div class="card-body">
                                                        <figure>
                                                            <img class="img-fluid" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAw1BMVEX////DIC8mMlL/PzTnLDX99fa/AAm/ABD24+WGi5kYJ0t7gJDr7/D/Oi3/LR7/09Hzo6bmGyfnJS/rYWbajZHBDSLr2Nfk1Nf/r6z/MiTtcnbnDx4AGUPR1tu1vMDa3d/Fys7g4+Sqsbf19/gAAAC/xcipsbaNkJbXhIn67e4KIEgVJUr/6ej/GwCdpqyOmaD2u73wj5LmAADsVlsAAjtyeIl1eH6Dh40mLz8WIjUAABwiLDxHTVdfY2w2PEkAACEEFyxohIB5AAAC50lEQVR4nO3dDU/TQByA8fMFUDgR8F28l3J0Q9ThCxbUbfr9P5XtTIS1S2+DHtdbnl8II8s/Wx+2NeFyG0IAAAAAAAAAAAAAAAAAAAAAAADAIxdCG2F0+ZOJfSxByCOhRZ7lQmth5f+rXSniUXWqbBPGmqowu/YgrlGhFkofiYE2prwAAAC4rY2T5w0n72MfVZc2Nl80bD6KfVRd2ti817BFYVIoTB+F6aMwffEKTSakFUJJ7+TtRCvMsoHULs/Lb2HvKFqh1IOssZoYQrRCa7QbKKvU4Oo6J2X3z9l4r0NZPjvl7CsszqXpozB9FArx+HS77nQn1uHewBKFH+7Xba9Z4TaF/UYhhf1HIYX9RyGF/Uchhf0XrdBpfTd7E6MV5tY2VoQjrZcGKrROGVvbIxxEvNehVcLkd7DPmzMNhf1HIYX9RyGF/df3wtcLfFzpFvpeuPum4dPTlW6h74VPHjTsUjiPQgpDo9CPQgpvYamdeykXqpGY7b5sXy9NuNCpXC6xXppwobJnUkvvLuiEC6tXoFTenexJFy6FQvH5bdOX6wPJF+4dHtTtP7s+kH7h/sO6AwoppLBTFFJIYYXCsCikkMIKhWFRSGHk/aVaZ1l5sa6Fwpp/66XZ1XU3WC/tb6FQxs32l7YvJyZcKAe5U9o5bVvHEi5cEoUUUlihMCwKKaSwQmFYFFJIYYXCsCikkMJK4ELP+4DTL/S9l3u3af49M3tfDxu+zRduNcx/rv7O+bu68+8dFl7tL62WS+teLjA3kL1aYG7CO2BUk1lwLPJGn5bL/3sCAABYI3rom7BFYdsn3EWRtU/kRaFWOKhOXU59nyY1OhLH7RM/rPnZPjEcyV+R/nmvKvSZZ2Q0nrQ/znLqvZuhXuLJEsbFdHzpGfE+hu539bdaq7JwOFrtyLpy7MTU8/QZTc7+tE9cjCeT9onhuPD9IgNx5RnC91l10nhfQdJzoilvwzcBAAAAAAAAAACAyP4CTKCchAxIOYAAAAAASUVORK5CYII=">
                                                        </figure>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="card ">
                                                <div class="card-header collapsible cursor-pointer" data-bs-toggle="collapse" aria-expanded="true" data-bs-target="#KPI-2">
                                                    <h3 class="card-title">KPI Title</h3>
                                                    <div class="card-toolbar rotate-180">
                                                        <span class="material-icons material-icons-style material-icons-2">
                                                            expand_circle_down
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="collapse show" style="" id="KPI-2">
                                                    <div class="card-body">
                                                        <figure>
                                                            <img class="img-fluid" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvyClOEGXUMdXM2DezoaC8GkYJ_Oo6BOSQAg&amp;usqp=CAU">
                                                        </figure>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--end::Container-->
                    </div>
        
        
                </div>
            </div>
        </div>`,
            dashboard: `<h1>Welcome To ActiveList</h1>
            <div>{{caption}}</div>`,
            calender: `<h1>Welcome To ActiveList</h1>
            <div>{{caption}}</div>`

        };
        this.arrMoreOptions = [];
        this.arrDsNames = [];
        this.dataSources = {};
    }
    init() {
        //this.generateHTMLForTab('homePage', homepageData);
        //this.generateHTMLForTab('ActiveList', activeListData);
        //this.generateHTMLForTab('dashboard', dashboard);
        //this.generateHTMLForTab('calender', calender);
        this.getHomePageCards();
    }

    getHomePageCards() {
        let _this = this;
        let url = "../aspx/AxPEG.aspx/AxGetHomePageCards";
        let data = {};
        this.callAPI(url, data, false, result => {
            if (result.success) {
                let json = JSON.parse(result.response);
                if (json.d == 'Error in Home Configuration.') {
                    showAlertDialog("error", 'Error in Home Configuration.');
                    return;
                }
                if (typeof json.d != "undefined" && json.d.indexOf("The given key 'ConnectionString' was not present in the dictionary.") > -1) {
                    showAlertDialog("error", 'Error in ARM connection.');
                    return;
                }
                let dataResult = _this.dataConvert(json, "ARM");
                if (dataResult.length > 0) {
                    dataResult = _this.JSON_Lower_keys(dataResult);
                    dataResult = dataResult.sort((a, b) => {
                        const nameA = a.grppageid || '';
                        const nameB = b.grppageid || '';
                        return nameA.localeCompare(nameB);
                    });
                    _this.constructCards(dataResult);
                }
                else {
                    if (dataResult.d == 'Error in ARM connection.') {
                        showAlertDialog("error", 'Error in ARM connection.');
                    }
                    else {
                        const tabContainer = document.querySelector(`.HomePageCards`);
                        tabContainer.innerHTML = '';
                        tabContainer.appendChild(`<h1>Home Page configuration is not available.</h1>`);
                    }
                }
            }
        });

    }

    JSON_Lower_keys(_thisJSON) {
        var _finalJson = [];
        _thisJSON.forEach(function (val) {
            var ret = {};
            $.map(val, function (value, key) {
                ret[key.toLowerCase()] = value;
            });
            _finalJson.push(ret);
        });
        return _finalJson;
    }

    constructCards(cardData) {
        let generatedHTML = '';
        let generatedHTMLGroup = '';
        let curgrppageid = '';
        cardData.forEach((rowData, index) => {
            const moreOption = rowData.moreoption;
            var stransid = rowData.stransid;
            const rowCount = index;
            rowData.rowCount = rowCount;

            if (this.inValid(moreOption)) {
                rowData.isMoreOption = '';
                this.arrMoreOptions.push('');
            } else {
                rowData.isMoreOption = 'T';
                const replacedMoreOption = moreOption.replace(/{{stransid}}/g, `"${stransid}"`);
                this.arrMoreOptions.push(replacedMoreOption);
            }
            this.arrDsNames.push(rowData.datasource);
            if (rowData.grppageid == '' || rowData.grppageid == null)
                generatedHTML += Handlebars.compile(this.html["HomePageCards"])(rowData);
            else {
                if (rowData.grppageid != curgrppageid) {
                    if (generatedHTMLGroup != '')
                        generatedHTMLGroup += `</div></div></div>`;
                    const divOpen = `<div class="card rounded-1 shadow-sm mt-3"><div class="card-header min-h-40px px-6"><div class="card-title"><h4 class="fw-bolder">` + rowData.groupfolder + `</h4></div></div><div class="card-body px-6 py-2 mb-3"><div class="row d-flex">`;
                    generatedHTMLGroup += divOpen + Handlebars.compile(this.html["HomePageCards"])(rowData);
                } else
                    generatedHTMLGroup += Handlebars.compile(this.html["HomePageCards"])(rowData);
                curgrppageid = rowData.grppageid;
            }
        });
        if (generatedHTMLGroup != '')
            generatedHTMLGroup += `</div></div></div>`;
        if (generatedHTML != '') {
            //const containerElement = document.createElement('div');
            //containerElement.classList.add('row', 'd-flex');
            //containerElement.innerHTML = generatedHTML + generatedHTMLGroup;


            let divOpen = `<div class="card rounded-1 shadow-sm mt-3"><div class="card-body px-6 py-2 mb-3"><div class="row d-flex">` + generatedHTML + `</div></div></div>`;
            divOpen += generatedHTMLGroup;
            const tabContainer = document.querySelector(`.HomePageCards`);
            tabContainer.innerHTML = divOpen;
            //tabContainer.appendChild(containerElement);
        } else {
            const tabContainer = document.querySelector(`.HomePageCards`);
            tabContainer.innerHTML = generatedHTMLGroup;
        }
        try {
            AxAfterConstructCards();
        }
        catch { }
    }


    generateHTMLForTab(tabName, tabData) {
        const tabParsedData = JSON.parse(tabData);
        const DataObj = tabParsedData.result.data;
        let generatedHTML = '';
        DataObj.forEach((rowdata, index) => {
            const moreOption = rowdata.moreoption;
            var stransid = rowdata.stransid;
            const rowCount = index;
            rowdata.rowCount = rowCount;

            if (moreOption !== null) {
                const replacedMoreOption = moreOption.replace(/{{stransid}}/g, `"${stransid}"`);
                this.arrMoreOptions.push(replacedMoreOption);
            } else {
                this.arrMoreOptions.push(moreOption);
            }

            generatedHTML += Handlebars.compile(this.html[tabName])(rowdata);
        });
        const containerElement = document.createElement('div');
        containerElement.classList.add('row', 'd-flex');
        containerElement.innerHTML = generatedHTML;

        const tabContainer = document.querySelector(`.${tabName}`);
        tabContainer.innerHTML = '';
        tabContainer.appendChild(containerElement);
    }

    moreOptionsPopover(count) {
        var popover = document.querySelector(`[data-fetching^="rowcount-${count}"]`);
        if (!popover.classList.contains("data-fetched")) {
            const attributeValue = popover.getAttribute("data-fetching");
            const indexCheck = "rowcount-";
            const dataIndexValue = attributeValue.substring(indexCheck.length);


            const createShowElement = document.createElement('div');
            const popoverShowing = document.querySelector(`[id^="rowcount-${count}"]`);
            const cardname = popoverShowing.getAttribute("data-cardname");
            var cardHeader = `<div class="card-header">
        <h3 class="card-title ">
            <img alt="" class="w-60px cardsIcons" src="../images/homepageicon/${cardname}.png" onerror="this.onerror=null;this.src='../images/homepageicon/default.png';">	${cardname}
        </h3>
    </div>`;

            if (this.arrDsNames[dataIndexValue] == null || this.arrDsNames[dataIndexValue] == "") {
                popover.classList.add("data-fetched");

                createShowElement.innerHTML = cardHeader;
                const popoverId = popoverShowing.getAttribute("id");
                const popoverContainer = document.getElementById(popoverId);
                if (popoverContainer) {
                    popoverContainer.appendChild(createShowElement);
                }
                var btnHtmlOutput = "";
                if (!this.inValid(this.arrMoreOptions[dataIndexValue])) {
                    var rowBtnTemplate = `<div class="Popover_Items Action_link ">
                                                <a href="javascript:void(0);" id="{{btnid}}" onclick="navigateFromCard('{{title}}','{{open}}')"> <div class="Action_link_name">{{title}}</div> </a>
                                                </div> `;


                    var rowJsBtnTemplate = `<div class="Popover_Items Action_link ">
                                                <a href="javascript:void(0);" id="{{btnid}}" onclick="{{exejs}}"> <div class="Action_link_name">{{title}}</div> </a>
                                                </div> `;


                    var btnStr = this.arrMoreOptions[dataIndexValue];
                    btnStr = btnStr.replace(/\}\s+\{/g, '}{');
                    var btnArr = this.getBtnArr(btnStr);
                    let _this = this;
                    btnArr.forEach(function (btnObj) {
                        if (!_this.inValid(btnObj.exejs)) {
                            btnHtmlOutput += Handlebars.compile(rowJsBtnTemplate)(btnObj);
                        }
                        else {
                            btnHtmlOutput += Handlebars.compile(rowBtnTemplate)(btnObj);
                        }
                    });
                }
                var htmlOutput = `<div class="card-body">
<div class="hover-scroll-overlay-y ">
<div class="d-flex flex-wrap" id="Popover_Details">${btnHtmlOutput}</div></div> </div>`;
                createShowElement.innerHTML = `<div class="card card-flush h-xl-100 Popover-Wrapper">` + cardHeader + htmlOutput + `</div>`;
                return;
            }

            var dsName = this.arrDsNames[dataIndexValue];
            var cardJson = [];
            if (this.inValid(this.dataSources[dsName])) {
                this.fetchData(dsName);
            }
            cardJson = this.dataSources[dsName];


            if (cardJson.result && cardJson.result[0] && cardJson.result[0].error) {
                var errorMsg = JSON.parse(cardJson.result[0].error.msg).error.msg;
                showAlertDialog("error", errorMsg);
                return;
            }

            var rowTemplateWithoutIcon = `<div class="Popover_Items ">
<a href="javascript:void(0);" onclick="navigateFromCard('{{caption}}','{{link}}')"> 
<span class="Pop_Item_label">{{caption}}</span>
<div class="Pop_items_value">{{text}}</div>
</a>
</div>`

            var htmlOutput = "";
            cardJson.forEach(function (card) {
                if (typeof card.cardname == "undefined" || card.cardname === cardname) {
                    htmlOutput += Handlebars.compile(rowTemplateWithoutIcon)(card);
                }
            });

           

            var btnHtmlOutput = "";
            if (!this.inValid(this.arrMoreOptions[dataIndexValue])) {
                var rowBtnTemplate = `<div class="Popover_Items Action_link ">
                                                <a href="javascript:void(0);" id="{{btnid}}" onclick="navigateFromCard('{{title}}','{{open}}')"> <div class="Action_link_name">{{title}}</div> </a>
                                                </div> `;


                var rowJsBtnTemplate = `<div class="Popover_Items Action_link ">
                                                <a href="javascript:void(0);" id="{{btnid}}" onclick="{{exejs}}"> <div class="Action_link_name">{{title}}</div> </a>
                                                </div> `;


                var btnStr = this.arrMoreOptions[dataIndexValue];
                btnStr = btnStr.replace(/\}\s+\{/g, '}{');
                var btnArr = this.getBtnArr(btnStr);
                let _this = this;
                btnArr.forEach(function (btnObj) {
                    if (!_this.inValid(btnObj.exejs)) {
                        btnHtmlOutput += Handlebars.compile(rowJsBtnTemplate)(btnObj);
                    }
                    else {
                        btnHtmlOutput += Handlebars.compile(rowBtnTemplate)(btnObj);
                    }
                });
            }

            htmlOutput = `<div class="card-body">
<div class="hover-scroll-overlay-y ">
<div class="d-flex flex-wrap" id="Popover_Details">${htmlOutput}${btnHtmlOutput}</div></div> </div>`;

            createShowElement.innerHTML = `<div class="card card-flush h-xl-100 Popover-Wrapper">` + cardHeader + htmlOutput + `</div>`;

            // Append createShowElement to popoverShowing element
            const popoverId = popoverShowing.getAttribute("id");
            const popoverContainer = document.getElementById(popoverId);
            if (popoverContainer) {
                popoverContainer.appendChild(createShowElement);
            }
        }
        popover.classList.add("data-fetched");
    }

    getBtnArr(str) {
        var btnObjArr = [];
        if (this.inValid(str))
            return btnObjArr;

        str = str.replace(/"(.*?)"/g, function (match, p1) {
            return match.replace(/ /g, '&nbsp;');
        });
        str = str.replaceAll("\"", "");

        str = str.slice(1, -1);

        var components = str.split('}{');
        var btnObjArr = [];
        function convertBtnStrToObj(component) {
            var obj = {};
            var parts = component.split(' ');

            // Extract btnid and type
            obj.btnid = parts[0];
            obj.type = parts[1];

            // Extract additional key-value pairs
            for (var i = 2; i < parts.length; i++) {
                obj[parts[i]] = parts[i + 1].replace(/&nbsp;/g, " ");
                i++;
            }
            btnObjArr.push(obj);
        }
        components.map(convertBtnStrToObj);
        return btnObjArr;

    }

    callAPI(url, data, async, callBack) {
        let _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, async);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        if (_this.isAxpertFlutter) {
            xhr.setRequestHeader('Authorization', `Bearer ${armToken}`);
            data["ARMSessionId"] = armSessionId;
        }

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    callBack({ success: true, response: this.responseText });
                }
                else {
                    try {
                        var message = JSON.parse(this.responseText)?.result?.message;
                        _this.catchError(message);
                    }
                    catch {
                        _this.catchError(this.responseText);

                    }
                    callBack({ success: false, response: this.responseText });
                }
            }
        }
        xhr.send(JSON.stringify(data));
    }

    catchError(error) {
        showAlertDialog("error", error);
    };

    showSuccess(message) {
        showAlertDialog("success", message);
    };

    isEmpty(elem) {
        return elem == "";
    };

    isNull(elem) {
        return elem == null;
    };

    isNullOrEmpty(elem) {
        return elem == null || elem == "";
    };

    isUndefined(elem) {
        return typeof elem == "undefined";
    };

    inValid(elem) {
        return elem == null || typeof elem == "undefined" || elem == "";
    };

    dataConvert(data, type) {
        if (type == "AXPERT") {
            try {
                data = JSON.parse(data.d);
                if (typeof data.result[0].result.row != "undefined") {
                    return data.result[0].result.row;
                }
            }
            catch (error) {
                this.catchError(error.message);
            };

            try {
                if (typeof data.result[0].result != "undefined") {
                    return data.result[0].result;
                }
            }
            catch (error) {
                this.catchError(error.message);
            };
        }
        else if (type == "ARM") {
            try {
                if (!this.isAxpertFlutter)
                    data = JSON.parse(data.d);
                if (data.result.success) {
                    if (!this.isUndefined(data.result.data)) {
                        try {
                            return JSON.parse(data.result.data);
                        } catch (e) {
                            return data.result.data;
                        }
                    }
                }
                else {
                    if (!this.isUndefined(data.result.message)) {
                        this.catchError(data.result.message);
                    }
                }
            }
            catch (error) {
                this.catchError(error.message);
            };
        }

        return data;
    }

    generateFldId() {
        return `fid${Date.now()}${Math.floor(Math.random() * 90000) + 10000}`;
    };

    fetchData(datasource) {
        let _this = this;
        var result = AxGetSqlData(datasource);
        result = _this.convertGetSQLDataJSON(result);
        result = result?.result[0]?.result?.row;
        _this.dataSources[datasource] = result;
    }

    convertGetSQLDataJSON(inputJson) {
        inputJson = JSON.parse(inputJson);
        const dynamicNodeName = Object.keys(inputJson)[0];
        const data = inputJson[dynamicNodeName].data;

        const outputJson = {
            result: [
                {
                    result: {
                        fields: inputJson[dynamicNodeName].sqlmetaData,
                        row: data.map(item => {
                            const rowObject = {};
                            inputJson[dynamicNodeName].sqlmetaData.forEach((metaData, index) => {
                                rowObject[metaData.name.toLowerCase()] = item[index];
                            });
                            return rowObject;
                        })
                    }
                }
            ]
        };

        return outputJson;
    }

}

function navigateFromCard(caption, id) {
    var form = id;
    document.querySelector('body').click();
    var customNavigate = false;
    try {
        customNavigate = AxCustomNavigateFromCard(caption, id);
    }
    catch (ex) { }

    if (customNavigate)
        return;

    if (form.startsWith('i')) {
        form = id.substring(1);
        LoadIframe(`iview.aspx?ivname=${form}`);
    } else if (form.startsWith('t')) {
        form = id.substring(1);
        LoadIframe(`tstruct.aspx?transid=${form}`);
    } else if (form.startsWith('HP')) {
        form = id.substring(2);
        LoadIframe(`htmlPages.aspx?load=${form}`);
    } else if (form.startsWith('c')) {
        form = id.substring(1);
        LoadIframe(`htmlPages.aspx?loadcaption=${form}`);
    }
}

var objHomePageCards = new HomePageCards();
