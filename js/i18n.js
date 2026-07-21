/**
 * CZC7EI 充电机智能排查平台 - 国际化翻译
 * 支持中文(zh)和英文(en)
 */

const I18N = {
  // ===== UI 界面文案 =====
  ui: {
    zh: {
      siteTitle: "CZC7EI 充电机智能排查平台",
      siteSub: "上海施能电器设备有限公司",
      navChat: "🤖 AI 问答",
      navVisual: "🖼️ 图文排查",
      navFault: "🔧 故障代码",
      navWizard: "📋 排查向导",
      navKb: "📚 知识库",
      langToggle: "EN",
      chatWelcomeTitle: "👋 您好，我是充电机智能助手",
      chatWelcomeDesc: "基于 CZC7EI 系列充电机培训资料，我可以帮您排查故障、查询代码、指导维修",
      chatPlaceholder: "输入故障代码（如 E-05）或描述故障现象，按回车发送...",
      chatSend: "发送 →",
      chatAvatarUser: "我",
      chatAvatarBot: "AI",
      chatRelatedCodes: "相关故障码：",
      chatDefaultTitle: "暂未找到匹配的答案",
      chatDefaultAnswer: "抱歉，我暂时无法准确回答这个问题。您可以尝试：",
      chatDefaultSteps: [
        "直接输入故障代码（如 E-05、F-01）查询具体故障信息",
        "描述故障现象，例如\"通讯灯不闪\"、\"充不进电\"、\"过温报警\"",
        "前往「故障代码」页面浏览所有故障代码",
        "使用「排查向导」按步骤排查问题",
        "如需人工技术支持，请联系上海施能电器设备有限公司"
      ],
      faultSearchPlaceholder: "搜索故障代码或关键词（如 E-05、过压、通讯）...",
      faultFilterAll: "全部",
      faultFilterCharger: "充电机故障 (E系列)",
      faultFilterBms: "BMS故障 (F系列)",
      faultFilterBattery: "电池故障 (C系列)",
      faultNoResult: "未找到匹配的故障代码",
      faultModalClose: "×",
      faultLabelReason: "故障原因",
      faultLabelSolution: "处理方法",
      faultLabelSeverity: "紧急程度",
      faultStepsTitle: "📋 排查步骤",
      faultImagesTitle: "🖼️ 参考图片",
      severityHigh: "紧急",
      severityMedium: "一般",
      severityLow: "轻微",
      wizardTitle: "请选择故障现象",
      wizardDesc: "选择最符合您遇到的情况，我将为您生成排查方案",
      wizardStepIndicator1: "1",
      wizardStepIndicator2: "2",
      wizardResultSubtitle: "请按以下步骤逐一排查：",
      wizardBtnChat: "在AI问答中继续提问",
      wizardBtnReset: "重新排查",
      visualHeroTitle: "🖼️ CZC7EI 图文排查指南",
      visualHeroDesc: "对照实拍图，一步步定位问题",
      visualGalleryTitle: "📷 全部参考图片",
      visualStepLabel: "STEP",
      faultTypeCharger: "充电机故障",
      faultTypeBms: "BMS故障",
      faultTypeBattery: "电池故障"
    },
    en: {
      siteTitle: "CZC7EI Charger Diagnostic Platform",
      siteSub: "Shanghai Shineng Electrical Equipment Co., Ltd.",
      navChat: "🤖 AI Assistant",
      navVisual: "🖼️ Visual Guide",
      navFault: "🔧 Fault Codes",
      navWizard: "📋 Troubleshooting Wizard",
      navKb: "📚 Knowledge Base",
      langToggle: "中文",
      chatWelcomeTitle: "👋 Hello, I'm your charger diagnostic assistant",
      chatWelcomeDesc: "Based on CZC7EI series charger training materials, I can help you diagnose faults, query codes, and guide repairs",
      chatPlaceholder: "Enter fault code (e.g. E-05) or describe the fault symptom, press Enter to send...",
      chatSend: "Send →",
      chatAvatarUser: "Me",
      chatAvatarBot: "AI",
      chatRelatedCodes: "Related fault codes:",
      chatDefaultTitle: "No matching answer found",
      chatDefaultAnswer: "Sorry, I cannot answer this question accurately at the moment. You can try:",
      chatDefaultSteps: [
        "Enter a fault code directly (e.g. E-05, F-01) to query specific fault information",
        "Describe the fault symptom, e.g. \"COM light not flashing\", \"cannot charge\", \"over-temperature alarm\"",
        "Go to the Fault Codes page to browse all fault codes",
        "Use the Troubleshooting Wizard to diagnose step by step",
        "For manual technical support, contact Shanghai Shineng Electrical Equipment Co., Ltd."
      ],
      faultSearchPlaceholder: "Search fault code or keyword (e.g. E-05, over-voltage, communication)...",
      faultFilterAll: "All",
      faultFilterCharger: "Charger Faults (E-series)",
      faultFilterBms: "BMS Faults (F-series)",
      faultFilterBattery: "Battery Faults (C-series)",
      faultNoResult: "No matching fault codes found",
      faultModalClose: "×",
      faultLabelReason: "Fault Reason",
      faultLabelSolution: "Solution",
      faultLabelSeverity: "Severity",
      faultStepsTitle: "📋 Troubleshooting Steps",
      faultImagesTitle: "🖼️ Reference Images",
      severityHigh: "Critical",
      severityMedium: "Moderate",
      severityLow: "Minor",
      wizardTitle: "Select the fault symptom",
      wizardDesc: "Choose the scenario that best matches your issue, and I will generate a troubleshooting plan",
      wizardStepIndicator1: "1",
      wizardStepIndicator2: "2",
      wizardResultSubtitle: "Follow these steps to diagnose:",
      wizardBtnChat: "Continue in AI Assistant",
      wizardBtnReset: "Restart Troubleshooting",
      visualHeroTitle: "🖼️ CZC7EI Visual Troubleshooting Guide",
      visualHeroDesc: "Follow the photos step by step to locate the problem",
      visualGalleryTitle: "📷 All Reference Images",
      visualStepLabel: "STEP",
      faultTypeCharger: "Charger Fault",
      faultTypeBms: "BMS Fault",
      faultTypeBattery: "Battery Fault"
    }
  },

  // ===== 知识库内容翻译 =====
  kb: {
    zh: {
      // 产品概述
      productTitle: "产品概述",
      productSubtitle: "上海施能电器设备有限公司 | CZC7EI 系列智能充电机",
      companyInfo: "🏢 公司信息",
      companyNameLabel: "公司名称",
      brandLabel: "品牌",
      seriesLabel: "产品系列",
      productModels: "📋 产品型号",
      modelLabel: "型号",
      modelDescLabel: "说明",
      modelPowerLabel: "功率",
      productFeatures: "✨ 功能特点",
      internalStructure: "🔧 内部结构",
      partNameLabel: "部件名称",
      partDescLabel: "说明",
      // 技术参数
      specsTitle: "主要技术参数",
      specsSubtitle: "CZC7EI系列智能充电机规格表（特殊规格可定制）",
      formulaTitle: "📐 功率与电流计算公式",
      inputPowerLabel: "输入功率",
      singlePhaseLabel: "单相/两相",
      threePhaseLabel: "三相",
      inputCurrentLabel: "输入电流",
      exampleLabel: "计算示例",
      specsNote: "💡 特殊规格可定制。未列入表内的充电机输入电参数可按上述公式计算。",
      specTableTitle: "📋 常规规格表",
      specLabel: "规格",
      inputLabel: "额定输入",
      powerLabel: "功率",
      currentLabel: "输入电流",
      maxCurrentLabel: "最大输出电流",
      maxVoltageLabel: "最大输出电压",
      weightLabel: "净重",
      commLabel: "通讯",
      ipLabel: "防护",
      sizeLabel: "外形尺寸",
      workingConditions: "🌡️ 正常工作条件",
      wcWarning: "⚠️ 不满足上述条件可能影响充电机性能、寿命或安全。",
      // 安装要求
      installationTitle: "安装要求",
      installationSubtitle: "CZC7EI充电机安装场所布置与接线要求",
      siteRequirements: "🏠 充电场所布置要求",
      wiringRequirements: "🔌 输入/输出线连接要求",
      installWarning: "⚠️ 本机应放置在通风干燥的地方，避开高温、灰尘及腐蚀性气体。",
      // 面板操作
      panelTitle: "面板操作指南",
      panelSubtitle: "CZC7EI充电机面板按键、指示灯及显示界面说明",
      bootSequence: "⚡ 上电显示流程",
      keyFunctions: "🔘 按键功能",
      keyLabel: "按键",
      keyFuncLabel: "功能",
      indicators: "💡 指示灯说明",
      indLabel: "指示灯",
      indMeaningLabel: "含义",
      interfaces: "📱 显示界面",
      ifaceIdLabel: "界面标志",
      ifaceNameLabel: "名称",
      ifaceDescLabel: "显示内容",
      scheduledCharging: "⏰ 预约充电操作",
      queryMethod: "🔍 信息查询方法",
      // 检测流程
      detectionTitle: "故障检测流程",
      detectionSubtitle: "充电机故障的标准检测步骤",
      detectionColAction: "操作",
      detectionColDesc: "说明",
      detectionColInterface: "查看位置",
      // 检测部位
      testpointsTitle: "重点检测部位",
      testpointsSubtitle: "充电机关键测点的正常值与检测条件",
      testpointColTest: "检测项目",
      testpointColLocation: "检测位置",
      testpointColNormal: "正常值",
      testpointColNote: "备注",
      conditionLabel: "检测条件：",
      // 模块代码
      modulesTitle: "模块工作代码",
      modulesSubtitle: "DC模块工作状态代码含义及处理方法（在【20】界面查看）",
      moduleStatusTitle: "📊 模块状态标志说明",
      moduleCodeTable: "📋 工作代码表",
      moduleCodeColCode: "代码",
      moduleCodeColDesc: "状态描述",
      moduleCodeColAction: "处理方法",
      moduleQueryMethod: "🔧 查询方法",
      // 工具与售后
      toolsTitle: "检修工具与售后",
      toolsSubtitle: "检修所需工具、售后政策及联系方式",
      contactInfo: "🏢 售后联系信息",
      contactCompanyLabel: "公司名称",
      contactAddressLabel: "地址",
      contactZipLabel: "邮编",
      contactSalesLabel: "销售",
      contactFaxLabel: "传真",
      contactTechLabel: "技术支持",
      contactAfterSalesLabel: "售后服务",
      contactEmergencyLabel: "应急/投诉",
      contactEmailLabel: "邮箱",
      contactWebLabel: "网址",
      structureImages: "🖼️ 整机结构与关键部件",
      repairToolsTitle: "🛠️ 检修常用工具",
      afterSalesTitle: "📦 配件购买、调换、维修及索赔",
      afterSalesTypeLabel: "类型",
      afterSalesCondLabel: "适用条件",
      afterSalesActionLabel: "处理方式",
      afterSalesNote: "📋 需要提供故障充电机铭牌、故障现象及使用环境，配件安装我司给予技术指导。",
      chargingPortTitle: "🔌 充电口定义",
      chargingPortDesc: "CZC7EI充电机配备REMA（公/母）和国标直流充电枪接口，匹配杭叉国标锂电池。<br>充电口定义需根据具体机型和电池型号确认，安装时请参考设备铭牌和接口标识。",
      // 知识库侧边栏
      kbNavProduct: "🏢 产品概述",
      kbNavSpecs: "📋 技术参数",
      kbNavInstallation: "📐 安装要求",
      kbNavPanel: "🔘 面板操作",
      kbNavDetection: "🔍 检测流程",
      kbNavTestpoints: "📍 检测部位",
      kbNavModules: "📊 模块代码",
      kbNavTools: "🛠️ 工具与售后"
    },
    en: {
      productTitle: "Product Overview",
      productSubtitle: "Shanghai Shineng Electrical Equipment Co., Ltd. | CZC7EI Series Smart Charger",
      companyInfo: "🏢 Company Information",
      companyNameLabel: "Company",
      brandLabel: "Brand",
      seriesLabel: "Product Series",
      productModels: "📋 Product Models",
      modelLabel: "Model",
      modelDescLabel: "Description",
      modelPowerLabel: "Power",
      productFeatures: "✨ Features",
      internalStructure: "🔧 Internal Structure",
      partNameLabel: "Component",
      partDescLabel: "Description",
      specsTitle: "Technical Specifications",
      specsSubtitle: "CZC7EI series smart charger specifications (custom specs available)",
      formulaTitle: "📐 Power & Current Calculation",
      inputPowerLabel: "Input Power",
      singlePhaseLabel: "Single/Two Phase",
      threePhaseLabel: "Three Phase",
      inputCurrentLabel: "Input Current",
      exampleLabel: "Calculation Example",
      specsNote: "💡 Custom specifications available. For unlisted models, calculate input parameters using the formulas above.",
      specTableTitle: "📋 Standard Specifications",
      specLabel: "Spec",
      inputLabel: "Rated Input",
      powerLabel: "Power",
      currentLabel: "Input Current",
      maxCurrentLabel: "Max Output Current",
      maxVoltageLabel: "Max Output Voltage",
      weightLabel: "Net Weight",
      commLabel: "Comm",
      ipLabel: "IP Rating",
      sizeLabel: "Dimensions",
      workingConditions: "🌡️ Normal Operating Conditions",
      wcWarning: "⚠️ Failure to meet these conditions may affect charger performance, lifespan, or safety.",
      installationTitle: "Installation Requirements",
      installationSubtitle: "CZC7EI charger site layout and wiring requirements",
      siteRequirements: "🏠 Charging Site Layout Requirements",
      wiringRequirements: "🔌 Input/Output Wiring Requirements",
      installWarning: "⚠️ Place the unit in a well-ventilated, dry location, away from high temperatures, dust, and corrosive gases.",
      panelTitle: "Panel Operation Guide",
      panelSubtitle: "CZC7EI charger panel buttons, indicators, and display interface instructions",
      bootSequence: "⚡ Power-on Display Sequence",
      keyFunctions: "🔘 Button Functions",
      keyLabel: "Button",
      keyFuncLabel: "Function",
      indicators: "💡 Indicator Lights",
      indLabel: "Indicator",
      indMeaningLabel: "Meaning",
      interfaces: "📱 Display Interfaces",
      ifaceIdLabel: "Interface ID",
      ifaceNameLabel: "Name",
      ifaceDescLabel: "Display Content",
      scheduledCharging: "⏰ Scheduled Charging",
      queryMethod: "🔍 Information Query Method",
      detectionTitle: "Fault Detection Procedure",
      detectionSubtitle: "Standard detection steps for charger faults",
      detectionColAction: "Action",
      detectionColDesc: "Description",
      detectionColInterface: "View At",
      testpointsTitle: "Key Test Points",
      testpointsSubtitle: "Normal values and test conditions for charger key measurement points",
      testpointColTest: "Test Item",
      testpointColLocation: "Test Location",
      testpointColNormal: "Normal Value",
      testpointColNote: "Note",
      conditionLabel: "Test Condition: ",
      modulesTitle: "Module Work Codes",
      modulesSubtitle: "DC module work status codes and troubleshooting (view at interface [20])",
      moduleStatusTitle: "📊 Module Status Flags",
      moduleCodeTable: "📋 Work Code Table",
      moduleCodeColCode: "Code",
      moduleCodeColDesc: "Status",
      moduleCodeColAction: "Action",
      moduleQueryMethod: "🔧 Query Method",
      toolsTitle: "Repair Tools & Service",
      toolsSubtitle: "Required repair tools, warranty policy, and contact information",
      contactInfo: "🏢 Service Contact Information",
      contactCompanyLabel: "Company",
      contactAddressLabel: "Address",
      contactZipLabel: "Zip Code",
      contactSalesLabel: "Sales",
      contactFaxLabel: "Fax",
      contactTechLabel: "Technical Support",
      contactAfterSalesLabel: "After-sales Service",
      contactEmergencyLabel: "Emergency/Complaints",
      contactEmailLabel: "Email",
      contactWebLabel: "Website",
      structureImages: "🖼️ Unit Structure & Key Components",
      repairToolsTitle: "🛠️ Common Repair Tools",
      afterSalesTitle: "📦 Parts Purchase, Exchange, Repair & Claims",
      afterSalesTypeLabel: "Type",
      afterSalesCondLabel: "Condition",
      afterSalesActionLabel: "Action",
      afterSalesNote: "📋 Provide the faulty charger nameplate, fault description, and operating environment. Installation technical guidance is provided.",
      chargingPortTitle: "🔌 Charging Port Definition",
      chargingPortDesc: "CZC7EI charger features REMA (male/female) and GB DC charging gun interfaces, compatible with Hangcha GB lithium batteries.<br>Port definitions vary by model and battery type. Refer to the equipment nameplate and port labels during installation.",
      kbNavProduct: "🏢 Product Overview",
      kbNavSpecs: "📋 Specifications",
      kbNavInstallation: "📐 Installation",
      kbNavPanel: "🔘 Panel Operation",
      kbNavDetection: "🔍 Detection Procedure",
      kbNavTestpoints: "📍 Test Points",
      kbNavModules: "📊 Module Codes",
      kbNavTools: "🛠️ Tools & Service"
    }
  },

  // ===== 知识库数据英文版 =====
  // 只翻译描述性文字，技术数据（电压、电流等）保持不变
  kbData: {
    en: {
      product: {
        company: "Shanghai Shineng Electrical Equipment Co., Ltd.",
        brand: "SHINENG (Since 1984)",
        series: "CZC7EI Series Smart Charger",
        description: "High-performance embedded charging control unit with optimized main circuit modules, providing continuously adjustable charging current for lead-acid and lithium batteries. Built-in default charging curve, customizable upon request.",
        models: [
          { code: "CZC7EI-D", desc: "Li-battery charger (10kW module/2 modules)", power: "10kW×2" },
          { code: "CZC7EI-D", desc: "Li-battery charger (10kW module/3 modules)", power: "10kW×3" },
          { code: "CZC7EI-E", desc: "Li-battery charger (3.3kW module)", power: "3.3kW" }
        ],
        features: [
          "Scheduled charging: Set timer to charge during off-peak hours to save on electricity costs",
          "Parameter memory protection: User settings are stored permanently, not lost during power outage",
          "LED display showing battery voltage, charging current, capacity, time, and charger status",
          "Battery disconnect detection: Charger auto-shuts down if connection cable is disconnected during charging",
          "Protection functions: Open circuit, reverse polarity, overcurrent, overvoltage, overtemperature, phase loss, etc.",
          "Communication interface: Interlock control with other devices"
        ],
        internalStructure: [
          { name: "Power Module", desc: "10kW or 3.3kW power module, parallelable" },
          { name: "Main Control Board", desc: "Core control unit with dip switch settings" },
          { name: "Auxiliary Power Board", desc: "Provides power to control circuits" },
          { name: "Switching Power Supply", desc: "Converts AC to DC control power" },
          { name: "DC Contactor", desc: "Controls charging circuit on/off" },
          { name: "Circuit Breaker + Trip Unit", desc: "Main circuit overcurrent protection" },
          { name: "Output Fuse", desc: "Output overcurrent protection" },
          { name: "Signal Terminal", desc: "CAN communication and control signal interface" }
        ]
      },
      images: {
        powerSupply: { title: "Main Power Supply Test Points", desc: "AC contactor 3-phase 380V and terminal voltage measurement locations" },
        panelCom: { title: "Panel COM/Err Indicator Location", desc: "COM light flashing = normal communication; Err light on = fault detected" },
        canSignal: { title: "CAN Signal / Aux Power / CC1 Test Terminals", desc: "S+/S-, A+/A-, CC1/PE terminals and normal values" },
        plugPins: { title: "Charging Plug Pin Definition", desc: "Pins 1-4 are communication and auxiliary power pins" },
        moduleStatus: { title: "Module Status LED & COM Light", desc: "Observe module LED color and fan operation" },
        dcTestPoints: { title: "DC Output 1/2/3 Point Measurement", desc: "Key test points to determine DC contactor or module fault" },
        internalStructure: { title: "Internal Structure Layout", desc: "Main control board, power board, switching supply, DC contactor locations" },
        externalParts: { title: "E-Stop / Power Module / Breaker", desc: "Emergency stop button, power module, and main power switch locations" },
        logo: { title: "Shanghai Shineng Electrical Equipment Co., Ltd.", desc: "SHINENG brand logo" },
        chargingCurve: { title: "Charging Curve Diagram", desc: "Tt = total charging time; T2 = constant voltage phase; I1 = constant current; U2 = constant voltage; I3 = shutdown current" },
        installationLayout: { title: "Charger Installation Layout Requirements", desc: "Space, distance, and ventilation requirements for charging site" }
      },
      eiGuideSteps: [
        {
          step: 1,
          title: "Screen Not Displaying — Check Main Power Supply",
          desc: "When the charger screen is blank, measure voltages at each point as shown. Focus on whether 3-phase 380V below the AC contactor has a missing phase, and whether the E-stop button is locked.",
          keyPoints: [
            "Measure 3-phase AC380V for missing phase",
            "Check if E-stop button is in released state",
            "Measure L~N for AC220V",
            "Measure aux power +V~-V for DC12V",
            "Measure control board 3 power groups: DC12V, 7.9V, 5V"
          ]
        },
        {
          step: 2,
          title: "COM Light Off — Check Communication Circuit",
          desc: "COM light off means charger and battery are not communicating. Check white terminals S+/S-, A+/A- and charging plug pins 1-4 for continuity.",
          keyPoints: [
            "Measure S+~S- resistance with charger off: ~120Ω without battery, ~60Ω with battery",
            "Measure A+~A- voltage with charger on: ~DC12V",
            "Check 4 wires from white terminal to 4 small pins on charging plug for breaks",
            "Verify CAN communication line connections are secure"
          ]
        },
        {
          step: 3,
          title: "E-14 Fault — Check Module Status",
          desc: "When E-14 appears (no controllable module), check if module LED is red, if fan is running, and if 3-phase 380V below AC contactor has a missing phase.",
          keyPoints: [
            "Observe module LED color (red = fault)",
            "Check if module fan is running",
            "Confirm 3-phase 380V below AC contactor is not missing a phase",
            "If all normal but module shows red LED, the module is damaged and needs replacement"
          ]
        },
        {
          step: 4,
          title: "Voltage But No Current — Diagnose Contactor/Module",
          desc: "When screen shows voltage but no current, and module green LED is on with fan running, check if DC contactor is engaged and measure points 1, 2, 3.",
          keyPoints: [
            "Point 1,3 voltage = charger screen output voltage",
            "Point 2,3 voltage = actual battery voltage",
            "If 1,3 shows output voltage and 2,3 shows battery voltage → DC contactor faulty",
            "If both 1,3 and 2,3 show battery voltage → Module has no current output, may be damaged"
          ]
        },
        {
          step: 5,
          title: "Fault Code Classification",
          desc: "E-prefix = charger fault, F-prefix = battery/BMS fault. See fault code table for specific codes.",
          keyPoints: [
            "E-series codes: Charger internal fault",
            "F-series codes: Battery BMS-side fault",
            "C-00: Battery voltage too low",
            "When Err light is on, the display window shows the specific fault code"
          ]
        }
      ],
      workingConditions: {
        title: "Normal Operating Conditions",
        conditions: [
          "Altitude not exceeding 1000 meters",
          "Ambient temperature not above +45°C and not below -10°C",
          "Relative humidity not exceeding 95% (at 20±5°C)",
          "No rain/snow, no conductive dust, no explosion hazard environment",
          "No corrosive gas or vapor that damages metal and insulation",
          "No severe vibration or shock",
          "Place in well-ventilated dry area, avoid high temperature, dust, and corrosive gases",
          "Maintain air circulation around the unit; regularly check if ventilation openings are blocked"
        ],
        warning: "Failure to meet these conditions may affect charger performance, lifespan, or safety."
      },
      technicalSpecs: {
        title: "Technical Specifications",
        formula: {
          inputPower: "Input Power Pin(KVA), Input Current Iin(A), Max Output Voltage Ue(V), Rated Output Current Ie(A)",
          singlePhase: "Single/Two Phase: Pin = Ie×Ue / 0.9 / 1000",
          threePhase: "Three Phase: Pin = Ie×Ue / 0.93 / 1000 (D60V/A specs use 0.87)",
          current: "Iin = Pin×1000 / Uin (single phase); Iin = Pin×1000 / (√3 × Uin) (three phase)",
          example: "Example: D100V/200A three-phase 380V: Ie=200A, Ue=100V, Uin=380V, Pin=200×100÷0.93÷1000=21.5kW, Iin=21.5×1000÷380÷√3=32.7A"
        },
        note: "Custom specifications available. For unlisted models, calculate using the formulas above.",
        models: [
          { spec: "E30V/100A", input: "Single Phase 220V", power: "3.3kVA", current: "15.2A", maxCurrent: "100A", maxVoltage: "30V", weight: "17kg", comm: "CAN", ip: "IP21", size: "485×271×310" },
          { spec: "D60V/100A", input: "Three Phase 380V", power: "6.9kVA", current: "10.5A", maxCurrent: "100A", maxVoltage: "60V", weight: "36kg", comm: "CAN", ip: "IP21", size: "625×371×394" },
          { spec: "D60V/200A", input: "Three Phase 380V", power: "13.8kVA", current: "21.0A", maxCurrent: "200A", maxVoltage: "60V", weight: "48kg", comm: "CAN", ip: "IP21", size: "625×371×394" },
          { spec: "D100V/100A", input: "Three Phase 380V", power: "10.8kVA", current: "16.3A", maxCurrent: "100A", maxVoltage: "100V", weight: "37kg", comm: "CAN", ip: "IP21", size: "625×371×394" },
          { spec: "D100V/200A", input: "Three Phase 380V", power: "21.5kVA", current: "32.7A", maxCurrent: "200A", maxVoltage: "100V", weight: "50kg", comm: "CAN", ip: "IP21", size: "625×371×394" },
          { spec: "D120V/250A", input: "Three Phase 380V", power: "32.3kVA", current: "49.0A", maxCurrent: "250A", maxVoltage: "120V", weight: "125kg", comm: "CAN", ip: "IP21", size: "809×500×1030" }
        ]
      },
      installation: {
        title: "Installation Requirements",
        site: {
          title: "Charging Site Layout Requirements",
          requirements: [
            "Ensure air circulation at the charging site for normal operation",
            "Maintain at least 0.3m clearance around the charger",
            "Regularly check charger ventilation openings for blockage",
            "Minimum 0.6m clearance around vehicles A and B",
            "Minimum 1m distance between battery and charger",
            "Minimum 2.5m distance from charger to flammable materials",
            "Minimum 5m distance from charger to explosive materials",
            "Charging room ceiling height must be at least 2m"
          ]
        },
        wiring: {
          title: "Input/Output Wiring Requirements",
          requirements: [
            "Verify grid voltage matches charger rated input voltage before wiring",
            "Confirm battery specifications match charger specifications before use",
            "Battery polarity must match charger output '+' and '-' polarity, with secure connections"
          ]
        },
        warning: "Place the unit in a well-ventilated, dry location, away from high temperatures, dust, and corrosive gases."
      },
      faultCodes: [
        { code: "E-03", type: "Charger Fault", reason: "Phase Loss Protection", solution: "Check input voltage for missing phase", steps: [
          "Use multimeter to measure 3-phase input voltage at charger input",
          "For 3-phase models: verify L1-L2, L2-L3, L1-L3 are all ~AC380V",
          "Check circuit breaker and contactor contacts for erosion or poor contact",
          "Check input power cables for breaks or loose connections",
          "Confirm grid supply is normal before re-powering"
        ], severity: "High" },
        { code: "E-05", type: "Charger Fault", reason: "Overvoltage Protection", solution: "Check main circuit module", steps: [
          "Disconnect charger power, wait 30 seconds, then re-power",
          "Enter interface [20] to check DC module info and work codes",
          "If module work code = 5 (output overvoltage), replace the power module",
          "Check output voltage protection setting in interface [30]"
        ], severity: "Medium" },
        { code: "E-06", type: "Charger Fault", reason: "Overcurrent Protection", solution: "Check power module", steps: [
          "Disconnect battery, re-power and observe if normal",
          "Enter interface [20] to check module status and work code (11 = overcurrent)",
          "Check output circuit for short circuit",
          "Check output fuse condition",
          "Confirm battery voltage is within charger specification range"
        ], severity: "Medium" },
        { code: "E-08", type: "Charger Fault", reason: "Communication Timeout", solution: "Check communication connector and circuit continuity", steps: [
          "Check CAN communication cable connection between charger and battery BMS",
          "Measure S+~S- resistance: ~60Ω normal (~120Ω without battery)",
          "Check CAN connector for oxidation or looseness",
          "Confirm BMS is working (observe COM light flashing)",
          "If still unable to communicate, use CAN card to read and analyze messages"
        ], severity: "High" },
        { code: "E-09", type: "Charger Fault", reason: "BMS Fault", solution: "Contact battery supplier", steps: [
          "This fault is reported by battery BMS, charger only displays it",
          "Enter interface [40] to view battery info (voltage setpoint, current setpoint, temperature)",
          "Record fault details and contact battery supplier",
          "Check battery pack connections"
        ], severity: "High" },
        { code: "E-14", type: "Charger Fault", reason: "No Controllable Module", solution: "Module protection or damage", steps: [
          "Enter interface [20] to check submodule status flags (Xx format)",
          "x=0: module offline, check module power and communication cable",
          "x=2: module abnormal, check work code for specific fault",
          "Observe module LED: red = fault, check fan operation",
          "Check 3-phase 380V below AC contactor for missing phase",
          "If module shows red LED with normal power, module is damaged and needs replacement"
        ], severity: "High" },
        { code: "E-12", type: "Charger Fault", reason: "Input Overvoltage Protection", solution: "Check grid voltage", steps: [
          "Use multimeter to measure charger input voltage",
          "3-phase: confirm 3-phase AC380V within rated range (typically ±10%)",
          "Single-phase: confirm AC220V within rated range",
          "If grid voltage persistently high, contact power supply department",
          "Re-power after grid voltage returns to normal"
        ], severity: "Medium" },
        { code: "E-13", type: "Charger Fault", reason: "Input Undervoltage Protection", solution: "Check grid voltage", steps: [
          "Use multimeter to measure charger input voltage",
          "3-phase: confirm AC380V within rated range",
          "Single-phase: confirm AC220V within rated range",
          "Check if supply cable is too long or undersized causing voltage drop",
          "Check breaker and contactor contacts for poor connection",
          "Re-power after grid voltage returns to normal"
        ], severity: "Medium" },
        { code: "E-88", type: "Charger Fault", reason: "Communication Fault", solution: "Check CAN communication line", steps: [
          "Check CAN communication wires S+/S- connections",
          "Measure S+~S- resistance (normal ~60Ω)",
          "Check COM communication indicator light for flashing",
          "Confirm battery BMS is powered on normally",
          "Check 4 wires from white terminal to 4 small pins on charging plug for breaks"
        ], severity: "High" },
        { code: "C-00", type: "Battery Fault", reason: "Battery Voltage Low", solution: "Check battery pack voltage and connections", steps: [
          "Use multimeter to measure total battery pack voltage",
          "Check battery series connections for reliability",
          "Confirm if battery voltage is below charger start voltage (check interface [30] for start voltage Sxxx)",
          "If battery voltage too low, pre-charge using other method first"
        ], severity: "Medium" },
        { code: "F-01", type: "BMS Fault", reason: "Insulation Fault", solution: "Contact battery supplier", steps: [
          "BMS internal insulation fault detection",
          "Check insulation between battery pack and vehicle frame",
          "Check charging cable insulation for damage",
          "Contact battery supplier for further diagnosis"
        ], severity: "High" },
        { code: "F-02", type: "BMS Fault", reason: "Output Connector Over-temperature", solution: "Check connector contact condition", steps: [
          "Disconnect charging connection, let connector cool down",
          "Check charging port for oxidation or burn marks",
          "Clean port and reconnect",
          "Replace connector if damaged"
        ], severity: "Medium" },
        { code: "F-03", type: "BMS Fault", reason: "BMS Component/Output Connector Over-temperature", solution: "Cool down and retry", steps: [
          "Disconnect charging, wait 10+ minutes for components to cool",
          "Check charging environment ventilation",
          "Check connector contact resistance (too high?)",
          "Contact battery supplier to check BMS cooling"
        ], severity: "Medium" },
        { code: "F-04", type: "BMS Fault", reason: "Charging Connector Fault", solution: "Check or replace connector", steps: [
          "Check if charging gun/REMA plug is fully inserted",
          "Check connector pins for bending or oxidation",
          "Measure CC1~PE resistance (normal ~400Ω)",
          "Replace connector if damaged"
        ], severity: "Medium" },
        { code: "F-05", type: "BMS Fault", reason: "Battery Pack Over-temperature", solution: "Cool down and retry", steps: [
          "Disconnect charging, let battery pack cool naturally",
          "Enter interface [40] to view battery temperature 1 and 2",
          "Check battery cooling system operation",
          "Confirm ambient temperature is not too high"
        ], severity: "High" },
        { code: "F-06", type: "BMS Fault", reason: "High Voltage Relay Fault", solution: "Contact battery supplier", steps: [
          "BMS internal high voltage relay fault",
          "Check relay control circuit",
          "Contact battery supplier for relay replacement or repair"
        ], severity: "High" },
        { code: "F-07", type: "BMS Fault", reason: "Test Point 2 Voltage Fault (CC2)", solution: "Check CC2 connection", steps: [
          "Check charging gun CC2 signal line connection",
          "Measure CC2 related voltage values",
          "Check if charging gun plug is fully inserted",
          "Contact battery supplier for further diagnosis"
        ], severity: "Medium" },
        { code: "F-08", type: "BMS Fault", reason: "Other Fault", solution: "Contact battery supplier", steps: [
          "Record complete fault info (voltage, current, time, etc.)",
          "Enter interface [40] to view detailed battery info",
          "Contact battery supplier and provide fault record"
        ], severity: "Medium" },
        { code: "F-09", type: "BMS Fault", reason: "Charging Current Too High", solution: "Check charging parameter settings", steps: [
          "Enter interface [30] to check charger constant current specification",
          "Confirm charging current setting matches battery specification",
          "Contact battery supplier to confirm BMS current limits",
          "Reduce charging current parameter if necessary"
        ], severity: "Medium" },
        { code: "F-10", type: "BMS Fault", reason: "Voltage Abnormal", solution: "Check voltage parameters", steps: [
          "Enter interface [40] to view voltage setpoint",
          "Measure actual battery voltage and compare with displayed value",
          "Check charger output voltage setting (interface [30])",
          "Contact battery supplier to confirm BMS voltage parameters"
        ], severity: "Medium" },
        { code: "F-11", type: "BMS Fault", reason: "Cell Voltage Too High", solution: "Contact battery supplier", steps: [
          "Enter interface [40] to view maximum cell voltage",
          "Battery pack has overcharged cells, needs BMS balancing",
          "Contact battery supplier for battery balancing",
          "Check charger constant voltage specification setting"
        ], severity: "High" },
        { code: "F-12", type: "BMS Fault", reason: "SOC Too High", solution: "Battery fully charged, normal condition", steps: [
          "This fault indicates battery SOC is near or at 100%",
          "Normal protection behavior, no repair needed",
          "Confirm charger stops normally after battery is fully charged"
        ], severity: "Low" }
      ],
      moduleCodes: [
        { code: 0, desc: "Standby", action: "Module in normal standby, no action needed" },
        { code: 1, desc: "Working", action: "Module operating normally" },
        { code: 2, desc: "Module Fault", action: "Check module work code or replace module" },
        { code: 3, desc: "Communication Fault", action: "Check module CAN communication connection, measure S+~S- resistance" },
        { code: 4, desc: "Output Undervoltage", action: "Check output circuit connections, confirm battery voltage" },
        { code: 5, desc: "Output Overvoltage", action: "Check overvoltage protection setting, may need module replacement" },
        { code: 6, desc: "Input Undervoltage", action: "Measure input voltage, confirm 3-phase 380V or single-phase 220V normal" },
        { code: 7, desc: "Input Overvoltage", action: "Measure if input voltage exceeds rated value, check grid" },
        { code: 8, desc: "Fan Fault", action: "Check fan operation, clean air duct, replace fan" },
        { code: 9, desc: "Module Current Limiting (Reserved)", action: "Module in current limiting state, check load condition" },
        { code: 10, desc: "Module Over-temperature", action: "Clean cooling air duct, check ambient temperature, wait for cooling" },
        { code: 11, desc: "Overcurrent Protection", action: "Check output circuit for short circuit, confirm normal load" }
      ],
      detectionSteps: {
        title: "Charger Fault Detection Procedure",
        phase1: {
          title: "1. Observe Fault Symptoms and Query Information",
          steps: [
            { action: "Observe communication light", desc: "COM light flashes during normal operation. If not flashing, communication is abnormal", interface: "Panel COM light" },
            { action: "Check charging voltage and current", desc: "V light on = voltage display, A light on = current display. No display means charger not working normally", interface: "Panel V/A indicator" },
            { action: "Query battery request info", desc: "Enter interface [40] to view voltage setpoint, current setpoint, cell voltage, battery temperature, SOC, grid voltage", interface: "[40] Battery Info Interface" },
            { action: "Query charger module info", desc: "Enter interface [20] to view submodule status (Xx format) and module work codes", interface: "[20] DC Module Interface" }
          ]
        },
        phase2: {
          title: "2. Measure Main Circuit and CAN Communication",
          steps: [
            { action: "Measure input voltage", desc: "Input 3-phase 380V or single-phase 220V, confirm normal power supply", interface: "Breaker input terminal" },
            { action: "Measure internal power supply", desc: "Check module power supply and auxiliary power supply", interface: "Internal terminals" },
            { action: "Measure control board power", desc: "Confirm control board DC12V/7.9V/5V three power groups", interface: "Control board power terminals" },
            { action: "Measure CAN signal", desc: "Check CAN resistance (S+~S- ~60Ω) and CAN transceiver signal", interface: "CAN communication terminals" },
            { action: "CC1 confirmation", desc: "With charging gun, measure CC1~PE resistance (~400Ω)", interface: "Charging gun CC1-PE" }
          ]
        }
      },
      keyTestPoints: [
        {
          category: "Main Power Supply Test",
          condition: "Charger powered on, battery connected",
          points: [
            { test: "3-phase AC380V", location: "Breaker input terminal", normal: "380V±10%", note: "3-phase balanced" },
            { test: "AC220V", location: "1~2 terminal", normal: "220V", note: "Single-phase power supply test" },
            { test: "AC380V", location: "1~3 terminal", normal: "380V", note: "3-phase power supply test" },
            { test: "AC220V", location: "L~N terminal", normal: "220V", note: "Auxiliary power input" },
            { test: "DC12V", location: "+V~-V terminal", normal: "DC12V", note: "Auxiliary power output" },
            { test: "3 DC groups", location: "Control board power terminal", normal: "DC12V/7.9V/5V", note: "Control board 3 power rails" }
          ],
          note: "If any step is abnormal, it indicates a fault at that point or the previous device. Check in sequence."
        },
        {
          category: "CAN Signal & CC1 Test",
          condition: "Measure voltage with charger on, resistance with charger off",
          points: [
            { test: "CAN terminal resistance", location: "S+~S-", normal: "~60Ω", note: "~120Ω without battery" },
            { test: "Auxiliary power voltage", location: "A+~A-", normal: "~DC12V", note: "Measure with power on" },
            { test: "CC1 confirmation resistance", location: "CC1~PE", normal: "~400Ω", note: "~800Ω without battery, only test with charging gun" }
          ],
          note: "If all above are normal but still cannot charge, use CAN card to read and analyze messages."
        }
      ],
      panelGuide: {
        bootSequence: {
          title: "Power-on Display Sequence",
          desc: "After powering on, the display window shows sequentially:",
          steps: ["Boot", "Version Info", "Customer Code (C001)", "Voltage Spec", "Current Spec", "Charging Curve", "----"],
          note: "After showing charging curve, if initialization is normal, enters wait stage showing '----'; if initialization has errors, enters fault interface."
        },
        keys: [
          { name: "Start/Stop Button", function: "Start or pause charger, and start scheduled charging. Double-click to enter scheduled charging settings." },
          { name: "Info Button", function: "Click to cycle through current display items; hold 3 seconds to enter charger query interface." }
        ],
        indicators: [
          { name: "A Light", meaning: "Display shows current value in Amps" },
          { name: "V Light", meaning: "Display shows voltage value in Volts" },
          { name: "H Light", meaning: "Display shows charging time in Hours" },
          { name: "Ah Light", meaning: "Display shows charged capacity in Ah" },
          { name: "SOC Light", meaning: "Display shows battery capacity percentage" },
          { name: "°C Light", meaning: "Display shows battery max/min temperature" },
          { name: "Err Light", meaning: "Fault indicator; when on, display window shows fault code" }
        ],
        interfaces: [
          { id: "Default", name: "Charging Interface", desc: "Displays: current voltage → current → charging time → capacity → SOC → charging stage → charging curve" },
          { id: "10", name: "Fault Interface", desc: "Displays: [10] → fault code → current voltage → current → time → capacity. F-xx = BMS fault, C-00 = battery voltage low, E-xx = charger fault" },
          { id: "20", name: "DC Module Interface", desc: "Displays: [20] → submodule flag (Xx) → module voltage → module current → module work code" },
          { id: "30", name: "Charger Parameter Interface", desc: "Displays: [30] → module count → voltage spec → current spec → input voltage → start voltage → constant voltage/current spec → shutdown current → total time → protocol → overvoltage/overcurrent protection" },
          { id: "40", name: "Battery Info Interface", desc: "Displays: [40] → voltage setpoint → current setpoint → max/min cell voltage → battery temp 1/2 → SOC → grid voltage" }
        ]
      },
      scheduledCharging: {
        title: "Scheduled Charging Operation Steps",
        steps: [
          "Connect charger input power, enter charging wait interface, display shows '----'",
          "Double-click Start/Stop button, display shows 'S.xx' (xx = scheduled time in hours)",
          "Click Start/Stop to increase time, click Info to decrease time",
          "After setting, scheduled time flashes for 30 seconds then enters countdown",
          "After countdown, charger automatically starts charging",
          "Charger automatically stops when battery is fully charged",
          "Connect battery to charger after setting the scheduled time"
        ]
      },
      repairTools: ["Screwdriver", "Wrench", "Socket Set", "Multimeter", "Clamp Meter", "CAN Card", "Computer"],
      contact: {
        company: "Shanghai Shineng Electrical Equipment Co., Ltd.",
        address: "No. 22 Hangming Road, Hangtou Town, Pudong New Area, Shanghai",
        zipCode: "201316",
        sales: ["021-58224888", "021-58222666"],
        fax: "021-58222888",
        technicalSupport: "021-58228080",
        emergency: "+8613917175637",
        afterSales: "021-58221666",
        email: "zhoubin@shineng.com",
        website: "www.shineng.com"
      },
      afterSales: {
        title: "Parts Purchase, Exchange, Repair & Claims",
        items: [
          { type: "Purchase", condition: "Confirmed charger parts fault, charger out of warranty, or user damage", action: "Purchase parts required" },
          { type: "Exchange/Repair", condition: "Confirmed charger parts fault, charger in warranty", action: "Free parts exchange and repair provided" },
          { type: "Claims", condition: "Confirmed missing parts or serious quality defect", action: "Parts claim processed" }
        ],
        requirement: "Provide faulty charger nameplate, fault description, and operating environment. Installation technical guidance is provided."
      }
    }
  },

  // ===== 排查向导英文版 =====
  wizard: {
    en: {
      options: [
        { icon: "🔌", text: "Charger not charging after battery connected", desc: "COM light not flashing or fault code displayed", next: "comm" },
        { icon: "⚡", text: "Charger shows fault code", desc: "Panel displays E-xx, F-xx or C-00", next: "code" },
        { icon: "🔥", text: "Over-temperature / thermal alarm", desc: "Device or battery temperature abnormal", next: "temp" },
        { icon: "🔇", text: "Charger no response on power-up", desc: "Display not lit or blank after powering on", next: "power" },
        { icon: "🔧", text: "Module fault / fan abnormal", desc: "Module error or fan not running", next: "module" },
        { icon: "❓", text: "Other issues", desc: "Not sure about the specific fault type", next: "general" }
      ],
      results: {
        comm: {
          title: "Communication Fault Troubleshooting",
          steps: [
            "[1] Observe panel COM communication indicator — should flash during normal operation. No flash means communication not established",
            "[2] Check CAN communication wires S+/S- connections — secure, no oxidation or looseness",
            "[3] Measure S+~S- resistance with charger off: normal ~60Ω; ~120Ω without battery",
            "[4] Measure A+~A- voltage with charger on: normal ~DC12V (auxiliary power supply)",
            "[5] Enter interface [40] to check battery request info, confirm BMS is sending charging request",
            "[6] Enter interface [20] to check all module statuses",
            "[7] With charging gun models: measure CC1~PE resistance, normal ~400Ω",
            "[8] If all normal but still cannot charge, use CAN card to read and analyze messages",
            "[9] Related fault codes: E-08 (communication timeout), E-88, F-08 (other fault)"
          ]
        },
        code: {
          title: "Fault Code Troubleshooting Guide",
          steps: [
            "[1] Record the fault code displayed on the panel (F-xx = BMS fault, E-xx = charger fault, C-00 = battery voltage low)",
            "[2] Go to Fault Codes page and enter the code to check specific reason and solution",
            "[3] Or enter the fault code directly in AI Assistant for troubleshooting steps",
            "[4] Enter interface [40] to view battery details for diagnosis",
            "[5] Enter interface [20] to view module status for diagnosis",
            "[6] Quick reference: E-05 overvoltage, E-06 overcurrent, E-08 communication timeout, E-14 no controllable module",
            "[7] F-series codes are mostly BMS-side faults, contact battery supplier"
          ]
        },
        temp: {
          title: "Over-temperature Fault Troubleshooting",
          steps: [
            "[1] Disconnect charging, wait 10+ minutes for equipment to cool",
            "[2] Enter interface [40] to view battery temperature 1 and 2",
            "[3] F-02/F-03 (connector over-temp): check charging port for oxidation or burn marks, clean and reconnect",
            "[4] F-05 (battery pack over-temp): check battery cooling system, confirm ambient ventilation",
            "[5] Module over-temp (code 10): clean charger cooling air ducts, check fan operation",
            "[6] Fan fault (code 8): check fan power supply, clean air duct, replace fan if necessary",
            "[7] Confirm charging environment temperature within device limits",
            "[8] Confirm charging current not exceeding rated value"
          ]
        },
        power: {
          title: "No Response on Power-up Troubleshooting",
          steps: [
            "[1] Measure input terminal voltage: 3-phase models check AC380V, single-phase check AC220V",
            "[2] Check if circuit breaker has tripped, manually reset and try",
            "[3] Check breaker input: 1~2 should show AC220V, 1~3 should show AC380V",
            "[4] Check auxiliary power: L~N should show AC220V, +V~-V should show DC12V",
            "[5] Check control board 3 power rails: DC12V, 7.9V, 5V all normal?",
            "[6] If display lights but shows fault: enter fault interface to check fault code",
            "[7] If power is normal but completely blank: possible main control board fault, contact service",
            "[8] Check internal wiring for loose or disconnected connections"
          ]
        },
        module: {
          title: "Module Fault Troubleshooting",
          steps: [
            "[1] Hold Info button 3 seconds to enter query interface, switch to [20] DC Module interface",
            "[2] View submodule flags (Xx format): x=0 offline, x=1 normal, x=2 abnormal",
            "[3] Module offline (x=0): check module power cable and CAN communication cable connections",
            "[4] Module abnormal (x=2): check module work code for specific cause",
            "[5] Codes: 0-standby / 1-working / 2-fault / 3-comm fault / 4-output undervoltage / 5-output overvoltage",
            "[6] Codes: 6-input undervoltage / 7-input overvoltage / 8-fan fault / 10-over-temp / 11-overcurrent",
            "[7] Fan fault (8): check fan operation, clean air duct, replace fan",
            "[8] Module over-temp (10): clean cooling air duct, check ambient temp, wait for cooling",
            "[9] Module damaged: replace with matching specification power module"
          ]
        },
        general: {
          title: "General Troubleshooting Procedure",
          steps: [
            "[1] Observe fault symptoms: COM light status, display content, unusual sounds or smells",
            "[2] Record fault code: when Err light is on, the code shown in display window",
            "[3] Query battery info: hold Info button 3 seconds, enter [40] interface to view battery parameters",
            "[4] Query module info: enter [20] interface to view module status and work codes",
            "[5] Measure input power supply: confirm 3-phase 380V or single-phase 220V normal",
            "[6] Measure internal power: control board DC12V/7.9V/5V three power groups",
            "[7] Measure CAN signal: S+~S- resistance ~60Ω, A+~A- voltage DC12V",
            "[8] With charging gun, measure CC1~PE resistance: ~400Ω",
            "[9] If all normal but still not working, contact Shanghai Shineng tech support"
          ]
        }
      }
    }
  },

  // ===== 快速提问英文版 =====
  quickQuestions: {
    en: [
      { icon: "🔌", text: "Communication fault, COM light not flashing after battery connected, not charging" },
      { icon: "🔇", text: "Charger not charging, no response on power-up" },
      { icon: "⚡", text: "E-05 Overvoltage protection — how to handle?" },
      { icon: "🔧", text: "Module fault E-14 — No controllable module" },
      { icon: "🔥", text: "Over-temperature / thermal alarm — what to do?" },
      { icon: "⏰", text: "How to set scheduled charging?" },
      { icon: "🔍", text: "How to query charger parameters?" },
      { icon: "🔋", text: "BMS fault F-01 — Insulation fault" },
      { icon: "📦", text: "Parts purchase and warranty policy" }
    ]
  },

  // ===== QA 问答条目英文关键词 =====
  qaKeywordsEn: {
    "screen_not_displaying": ["screen", "display", "not showing", "blank", "no display", "black screen", "no response", "e-stop", "locked", "power on", "led off"],
    "communication_fault": ["communication", "comm", "can", "com light", "not flash", "timeout", "e-08", "e-88", "f-08", "not charging after battery", "s+", "a+", "s+s-", "a+a-"],
    "overvoltage": ["overvoltage", "e-05", "over voltage", "output overvoltage", "voltage too high"],
    "overcurrent": ["overcurrent", "e-06", "over current", "current too high", "output overcurrent"],
    "module_fault": ["module", "not working", "no controllable module", "e-14", "module damaged", "power module", "over-temp module", "fan fault", "red led", "red light"],
    "not_charging": ["not charging", "cannot charge", "no output", "not working", "won't start", "no start", "won't charge"],
    "voltage_no_current": ["voltage no current", "no current", "only voltage", "dc contactor", "contactor", "not engaging"],
    "temperature": ["temperature", "over-temp", "overheat", "f-02", "f-03", "f-05", "hot", "thermal"],
    "bms_fault": ["bms", "battery fault", "f-01", "f-06", "f-07", "f-09", "f-10", "f-11", "f-12", "insulation", "relay", "cell voltage", "soc too high"],
    "scheduled_charging": ["schedule", "timer", "scheduled", "time", "delay charge", "peak off-peak"],
    "query_info": ["query", "info", "parameter", "how to check", "interface", "display", "led"],
    "fuse_breaker": ["fuse", "breaker", "circuit breaker", "trip", "tripped", "mcb"],
    "input_voltage": ["input voltage", "undervoltage", "grid", "power supply", "e-12", "e-13", "input low"],
    "parts_warranty": ["parts", "purchase", "warranty", "service", "repair", "claim", "in warranty", "out of warranty"],
    "internal_structure": ["structure", "composition", "construction", "inside", "disassembly", "hardware", "unit structure"],
    "model_spec": ["model", "spec", "specification", "power", "10kw", "3.3kw", "selection", "difference"],
    "charging_port": ["cc1", "cc2", "charging gun", "connector", "interface", "rema", "plug"],
    "installation": ["installation", "install", "requirement", "distance", "ventilation", "space", "layout", "flammable", "explosive"],
    "working_conditions": ["environment", "condition", "temperature", "humidity", "altitude", "operating environment"],
    "technical_specs": ["technical", "specification", "model", "power", "current", "voltage", "dimension", "weight"],
    "boot_sequence": ["power on", "startup", "boot", "display sequence", "version", "c001", "charging curve"],
    "contact": ["contact", "phone", "service phone", "address", "website", "fax", "customer service"],
    "charging_curve": ["curve", "constant current", "constant voltage", "i1", "u2", "i3", "tt", "t2"],
    "phase_loss": ["phase loss", "e-03", "3-phase", "missing phase"],
    "input_voltage_fault": ["input overvoltage", "input undervoltage", "e-12", "e-13", "grid voltage"],
    "e_stop": ["e-stop", "emergency stop", "locked", "reset"]
  }
};

// ===== 当前语言 =====
let currentLang = 'zh';

// ===== 翻译函数 =====
function t(key) {
  return I18N.ui[currentLang][key] || I18N.ui.zh[key] || key;
}

function tk(key) {
  return I18N.kb[currentLang][key] || I18N.kb.zh[key] || key;
}

// ===== 获取当前语言的知识库数据 =====
function getKB() {
  if (currentLang === 'en') {
    // Merge: use English translations overlaid on Chinese base
    const base = KNOWLEDGE_BASE;
    const en = I18N.kbData.en;
    return {
      ...base,
      product: { ...base.product, ...en.product },
      images: { ...base.images, ...en.images },
      eiGuideSteps: en.eiGuideSteps,
      workingConditions: en.workingConditions,
      technicalSpecs: { ...base.technicalSpecs, ...en.technicalSpecs },
      installation: en.installation,
      faultCodes: en.faultCodes,
      moduleCodes: en.moduleCodes,
      detectionSteps: en.detectionSteps,
      keyTestPoints: en.keyTestPoints,
      panelGuide: en.panelGuide,
      scheduledCharging: en.scheduledCharging,
      repairTools: en.repairTools,
      contact: en.contact,
      afterSales: en.afterSales
    };
  }
  return KNOWLEDGE_BASE;
}

// ===== 获取故障类型名 =====
function getFaultTypeName(type) {
  if (currentLang === 'en') {
    const map = { "充电机故障": "Charger Fault", "BMS故障": "BMS Fault", "电池故障": "Battery Fault" };
    return map[type] || type;
  }
  return type;
}

function getFaultTypeClass(type) {
  if (currentLang === 'en') {
    const map = { "Charger Fault": "charger", "BMS Fault": "bms", "Battery Fault": "battery" };
    return map[type] || 'charger';
  }
  return type === '充电机故障' ? 'charger' : type === 'BMS故障' ? 'bms' : 'battery';
}

function getSeverityText(severity) {
  if (currentLang === 'en') {
    const map = { "高": "Critical", "中": "Moderate", "低": "Minor", "High": "Critical", "Medium": "Moderate", "Low": "Minor" };
    return map[severity] || severity;
  }
  const map = { "高": "紧急", "中": "一般", "低": "轻微" };
  return map[severity] || severity;
}

function getSeverityClass(severity) {
  const map = { "高": "severity-high", "中": "severity-medium", "低": "severity-low", "High": "severity-high", "Medium": "severity-medium", "Low": "severity-low" };
  return map[severity] || 'severity-medium';
}

// ===== 语言切换 =====
function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('charger_lang', lang);

  // Update page title
  document.title = t('siteTitle') + ' | ' + t('siteSub');

  // Update navbar
  document.querySelector('.navbar-brand span:not(.sub)').textContent = t('siteTitle');
  document.querySelector('.navbar-brand .sub').textContent = t('siteSub');

  // Update nav tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    const page = tab.dataset.page;
    const keyMap = { chat: 'navChat', visual: 'navVisual', fault: 'navFault', wizard: 'navWizard', kb: 'navKb' };
    tab.textContent = t(keyMap[page]);
  });

  // Update language toggle button
  const langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.textContent = t('langToggle');

  // Update chat welcome
  const welcome = document.getElementById('chatWelcome');
  if (welcome && welcome.style.display !== 'none') {
    const titleEl = welcome.querySelector('h1');
    const descEl = welcome.querySelector('p');
    if (titleEl) titleEl.textContent = t('chatWelcomeTitle');
    if (descEl) descEl.textContent = t('chatWelcomeDesc');
    // Update quick questions
    renderQuickQuestions();
  }

  // Update chat placeholder
  const chatInput = document.getElementById('chatInput');
  if (chatInput) chatInput.placeholder = t('chatPlaceholder');
  const sendBtn = document.getElementById('chatSendBtn');
  if (sendBtn) sendBtn.textContent = t('chatSend');

  // Update fault page
  const faultSearch = document.getElementById('faultSearchInput');
  if (faultSearch) faultSearch.placeholder = t('faultSearchPlaceholder');
  // Update filter chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    const filter = chip.dataset.filter;
    const keyMap = { all: 'faultFilterAll', charger: 'faultFilterCharger', bms: 'faultFilterBms', battery: 'faultFilterBattery' };
    chip.textContent = t(keyMap[filter]);
  });
  renderFaultCodes();

  // Re-render wizard
  renderWizardStep();

  // Re-render visual page
  renderVisualPage();

  // Re-render current KB section
  const activeSection = document.querySelector('.kb-nav-item.active');
  if (activeSection) switchKbSection(activeSection.dataset.section);
  else switchKbSection('product');
}

// ===== 快速提问渲染 =====
function renderQuickQuestions() {
  const container = document.querySelector('.quick-questions');
  if (!container) return;

  const questions = currentLang === 'en' ? I18N.quickQuestions.en : [
    { icon: "🔌", text: "通讯故障，连上电池后com灯不闪不充电" },
    { icon: "🔇", text: "充电机不充电，开机没反应" },
    { icon: "⚡", text: "E-05 过压保护怎么处理？" },
    { icon: "🔧", text: "充电模块故障 E-14 没有可控模块" },
    { icon: "🔥", text: "温度过高/过温报警怎么办？" },
    { icon: "⏰", text: "如何设置预约充电？" },
    { icon: "🔍", text: "如何查询充电机参数信息？" },
    { icon: "🔋", text: "BMS故障 F-01 绝缘故障" },
    { icon: "📦", text: "配件购买和保修政策" }
  ];

  container.innerHTML = questions.map(q => `
    <div class="quick-question" onclick="quickAsk('${q.text.replace(/'/g, "\\'")}')">
      <span class="icon">${q.icon}</span>
      <span>${q.text}</span>
    </div>
  `).join('');
}

// ===== 初始化语言 =====
function initLanguage() {
  const saved = localStorage.getItem('charger_lang');
  if (saved) {
    currentLang = saved;
  } else {
    // Auto-detect from browser
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('en')) {
      currentLang = 'en';
    }
  }
  if (currentLang === 'en') {
    switchLanguage('en');
  }
}
