/**
 * CZC7T 系列充电机知识库
 * 数据来源：
 * 1. Elitra iON 7T Charger Troubleshooting Rev01 PPTX (英文排查指南)
 * 2. CZC7T 培训资料（何俊杰）PDF (中文培训手册)
 * 3. CZC7T故障排查及案例分享PPTX (英文故障案例)
 * 4. CZC7T系列产品简介PPTX (中英文产品介绍)
 * 图片来源：上述PPTX文件提取的60张图片
 */

const KNOWLEDGE_BASE_7T = {
  // ===== 产品信息 =====
  product: {
    company: "上海施能电器设备有限公司",
    companyEn: "Shanghai Shineng Electric Appliances Co., Ltd.",
    brand: "SHINENG 施能",
    since: 1984,
    series: "CZC7T / Elitra iON 7T 系列智能充电机",
    seriesEn: "CZC7T / Elitra iON 7T Series Intelligent Charger",
    version: "CZC7T_1.0.0",
    description: "CZC7T系列智能充电机采用高性能嵌入式充电控制单元控制充电电流，通过参数优化设计的主功率模块为锂电池提供连续可调的充电电流，满足各种充电工艺要求。充电控制器内置默认充电曲线及多种BMS充电通讯协议，也可按用户需求出厂定制充电曲线和通讯协议。配备4.3寸LCD彩色触摸屏人机界面，支持中、英、法、意、西、葡6种语言。具备完善的保护功能：开路、接反、过流、过压、过热、缺相保护等。支持预约充电、强制启动(0V)、记录仪功能等。",
    descriptionEn: "The CZC7T series intelligent charger uses a high-performance embedded charging control unit. The main power module designed by parameter optimization provides continuous adjustable charging current for lithium batteries. Built-in default charging curves and various BMS communication protocols, with customizable options. Features 4.3-inch LCD color touch screen, supports Chinese, English, French, Italian, Spanish, and Portuguese. Complete protection functions: open circuit, reverse, over-current, over-voltage, over-heating, phase loss protection. Supports scheduled charging, forced start (0V), and recorder functions.",
    models: [
      { code: "Li-EC1 7T24/50-220V", desc: "24V/50A 单相 (1P+N+Earth 220V)", power: "0.9kW", input: "1P 220V", eff: "90%", size: "518×272×405mm" },
      { code: "Li-EC1 7T24/100-220V", desc: "24V/100A 单相 (1P+N+Earth 220V)", power: "1.5kW", input: "1P 220V", eff: "90%", size: "518×272×405mm" },
      { code: "Li-EC1 7T24/150-220V", desc: "24V/150A 单相 (1P+N+Earth 220V)", power: "2.3kW", input: "1P 220V", eff: "90%", size: "610×307×541mm" },
      { code: "Li-EC3 7T24/150-380V", desc: "24V/150A 三相 (3P+Earth 380V)", power: "2.2kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T24/200-380V", desc: "24V/200A 三相 (3P+Earth 380V)", power: "2.9kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T24/250-380V", desc: "24V/250A 三相 (3P+Earth 380V)", power: "3.7kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T24/300-380V", desc: "24V/300A 三相 (3P+Earth 380V)", power: "4.4kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC1 7T36/50-220V", desc: "36V/50A 单相 (1P+N+Earth 220V)", power: "1.1kW", input: "1P 220V", eff: "90%", size: "518×272×405mm" },
      { code: "Li-EC3 7T36/100-380V", desc: "36V/100A 三相 (3P+Earth 380V)", power: "2.2kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T36/150-380V", desc: "36V/150A 三相 (3P+Earth 380V)", power: "3.2kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T36/200-380V", desc: "36V/200A 三相 (3P+Earth 380V)", power: "4.3kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T36/250-380V", desc: "36V/250A 三相 (3P+Earth 380V)", power: "5.4kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T36/300-380V", desc: "36V/300A 三相 (3P+Earth 380V)", power: "6.5kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC1 7T48/50-220V", desc: "48V/50A 单相 (1P+N+Earth 220V)", power: "1.5kW", input: "1P 220V", eff: "90%", size: "518×272×405mm" },
      { code: "Li-EC3 7T48/100-380V", desc: "48V/100A 三相 (3P+Earth 380V)", power: "2.9kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T48/150-380V", desc: "48V/150A 三相 (3P+Earth 380V)", power: "4.4kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T48/200-380V", desc: "48V/200A 三相 (3P+Earth 380V)", power: "5.9kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T48/250-380V", desc: "48V/250A 三相 (3P+Earth 380V)", power: "7.4kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T48/300-380V", desc: "48V/300A 三相 (3P+Earth 380V)", power: "8.8kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T72/100-380V", desc: "72V/100A 三相 (3P+Earth 380V)", power: "4.3kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T72/200-380V", desc: "72V/200A 三相 (3P+Earth 380V)", power: "8.6kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T72/300-380V", desc: "72V/300A 三相 (3P+Earth 380V)", power: "12.9kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T80/100-380V", desc: "80V/100A 三相 (3P+Earth 380V)", power: "4.9kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T80/200-380V", desc: "80V/200A 三相 (3P+Earth 380V)", power: "9.8kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" },
      { code: "Li-EC3 7T80/300-380V", desc: "80V/300A 三相 (3P+Earth 380V)", power: "14.7kW", input: "3P 380V", eff: "93%", size: "780×380×690mm" }
    ],
    features: [
      "保护功能：开路、接反检测、过流、过压、过热、缺相保护等",
      "4.3寸LCD彩色触摸屏人机界面，支持中/英/法/意/西/葡6种语言",
      "特殊功能：强制启动(0V)、自动关机、兼容铅酸和锂电池、IAP在线升级",
      "输入电源无相序要求，单相/三相均可",
      "记录仪功能：记录充电过程事件，EEPROM存储充电数据可分析，CAN总线协议数据显示",
      "预约充电：可设定定时充电，利用谷电节省电费",
      "模块化设计：多个高频开关电源模块并联运行，模块间不均流度≤5%，充电效率93%以上"
    ],
    featuresEn: [
      "Protection: open circuit, reverse detection, over-current, over-voltage, over-heating, phase loss protection",
      "4.3-inch LCD color touch screen HMI, supports 6 languages (CN/EN/FR/IT/ES/PT)",
      "Special functions: forced start (0V), auto shutdown, lead-acid & lithium compatible, IAP",
      "No phase sequence requirement for input power",
      "Recorder: records charging events, EEPROM data analysis, CAN protocol data display",
      "Scheduled charging: timed charging using valley electricity",
      "Modular design: multiple high-frequency power modules in parallel, ≤5% current imbalance, 93%+ efficiency"
    ],
    internalStructure: [
      { name: "LCD触摸屏 (HMI)", desc: "4.3寸彩色触摸屏，显示充电信息和参数设置" },
      { name: "控制器 (Controller)", desc: "充电机核心控制板，处理充电逻辑、通讯、保护" },
      { name: "电源模块 (Power Module)", desc: "高频开关电源模块，可多模块并联" },
      { name: "辅助电源 (Aux Power)", desc: "提供12V控制电路供电" },
      { name: "断路器 (Breaker)", desc: "电源开关，含过流保护和漏电保护" },
      { name: "直流接触器 (DC Contactor)", desc: "控制输出回路的通断" },
      { name: "输出保险丝 (Fuse)", desc: "输出端过流保护" },
      { name: "预充电阻 (Precharge Resistor)", desc: "限制电容充电浪涌电流，保护直流接触器" },
      { name: "接线排 (Connection Block)", desc: "连接多路电气线缆" },
      { name: "防尘网 (Dust Screen)", desc: "阻挡杂质，保护设备" }
    ],
    enclosures: [
      { name: "小型机箱 (Small)", size: "518×272×405mm", power: "≤3kW 单相", modules: "1" },
      { name: "中型机箱 (Medium)", size: "610×307×541mm", power: "≤6kW 单相/三相", modules: "1" },
      { name: "大型机箱 (Large)", size: "780×390×690mm", power: "≤40kW 三相", modules: "1-3" },
      { name: "双输出机箱 (Dual-output)", size: "1078×449×828mm", power: "≤40kW 三相双路", modules: "2" }
    ]
  },

  // ===== 图片资源库 =====
  images: {
    // 产品结构图
    smallEnclosure: { src: "images/7t/intro_03.png", title: "小型机箱内部结构 (Small Enclosure)", desc: "518×272×405mm，≤3kW单相机型" },
    mediumEnclosure: { src: "images/7t/intro_04.png", title: "中型机箱内部结构 (Medium Enclosure)", desc: "610×307×541mm，≤6kW单相/三相机型" },
    largeEnclosure: { src: "images/7t/intro_05.png", title: "大型机箱内部结构 (Large Enclosure)", desc: "780×390×690mm，≤40kW三相机型" },
    // 部件介绍
    partsDCContactor: { src: "images/7t/intro_06.png", title: "直流接触器 (DC Contactor)", desc: "控制输出回路的通断，高性能可靠" },
    partsFuse: { src: "images/7t/intro_07.png", title: "输出保险丝 (Fuse)", desc: "保护输出电路的安全装置" },
    partsConnBlock: { src: "images/7t/intro_08.png", title: "接线排 (Connection Block)", desc: "连接多路电气线缆" },
    partsAuxPower: { src: "images/7t/intro_09.png", title: "辅助电源 (Auxiliary Power)", desc: "为控制电路提供电源" },
    partsPowerModule: { src: "images/7t/intro_10.png", title: "电源模块 (Power Module)", desc: "功率变换，为电池充电" },
    partsTouchScreen: { src: "images/7t/intro_11.png", title: "触摸屏 (Touch Screen)", desc: "人机界面，显示充电信息和参数设置" },
    // 控制器板
    controllerBoard: { src: "images/7t/intro_13.png", title: "控制器板接口定义 (Controller Board)", desc: "J1/KF1/YE1-YE5/SWD2/SWD3等接口定义" },
    // 原理图
    schematic1: { src: "images/7t/intro_14.png", title: "CZC7T-E30/100C 原理图", desc: "单相机型电气原理图" },
    schematic2: { src: "images/7t/intro_15.png", title: "CZC7T-D100/300C 原理图", desc: "三相机型电气原理图" },
    // HMI界面
    hmiHome: { src: "images/7t/intro_16.png", title: "HMI主界面 (HOME)", desc: "充电信息、状态指示灯、功能菜单" },
    hmiBattery: { src: "images/7t/intro_17.png", title: "电池信息界面 (Battery Info)", desc: "BMS信息、CAN协议数据" },
    hmiModule: { src: "images/7t/intro_18.png", title: "模块信息界面 (Module Info)", desc: "各模块电压、电流、工作状态" },
    hmiEvent: { src: "images/7t/intro_19.png", title: "事件信息界面 (Event Info)", desc: "充电事件记录、导出、清空" },
    // 故障排查
    faultChargerList: { src: "images/7t/fault_01.png", title: "充电机故障列表 (Charger Fault List)", desc: "欠压/接反/缺相/过热/过压/过流/通讯故障等" },
    faultBMSList: { src: "images/7t/fault_02.png", title: "BMS故障列表 (BMS Fault List)", desc: "绝缘故障/连接器过温/BMS元件过温等" },
    faultModule1: { src: "images/7t/fault_03.png", title: "模块故障代码 Part1 (Module Fault Part1)", desc: "standby/work/fault/off-line/OUV/OOV等" },
    faultModule2: { src: "images/7t/fault_04.png", title: "模块故障代码 Part2 (Module Fault Part2)", desc: "current limit/OTP/OCP/secondary side fault等" },
    faultMessages: { src: "images/7t/fault_06.png", title: "充电机消息列表 (Charger Messages)", desc: "等待启动/电池脱落/预充/充电阶段I-IV等" },
    // 排查流程
    troubleshootInput: { src: "images/7t/fault_08.png", title: "输入电源检查 (Input Power Inspection)", desc: "万用表测量电网电压，检查缺相" },
    troubleshootAux: { src: "images/7t/fault_09.png", title: "辅助电源检查 (Auxiliary Power Inspection)", desc: "测量AC/DC输出电压，正常12V" },
    troubleshootCAN: { src: "images/7t/fault_10.png", title: "CAN总线电阻检查 (CANbus Resistance)", desc: "连接电池60Ω，断开120Ω" },
    troubleshootStart: { src: "images/7t/fault_11.png", title: "启动条件检查 (Start Conditions)", desc: "继电器压差/电压启动/BMS通讯启动/BMS通讯信号" },
    // 售后案例
    case1: { src: "images/7t/fault_13.png", title: "案例1: 显示屏不亮", desc: "12V辅助电源飞虫短路" },
    case2: { src: "images/7t/fault_14.png", title: "案例2: 输入欠压", desc: "输入电缆接线错误" },
    // 操作
    operationStartup: { src: "images/7t/intro_20.png", title: "充电启动步骤 (Charging Startup Steps)", desc: "连接电源→连接电池→开机→等待自动启动" },
    operationStop: { src: "images/7t/intro_21.png", title: "充电停止步骤 (Charging Stop Steps)", desc: "关机→断电池→断电源" },
    // 充电曲线
    curveLeadAcid: { src: "images/7t/intro_22.png", title: "铅酸电池充电曲线 (Lead-acid Curves)", desc: "IUIa/IU/Ua/IIa" },
    curveLithium: { src: "images/7t/intro_23.png", title: "锂电池充电曲线 (Lithium Curves)", desc: "IUa/multi-Ia" },
    // 公司
    companyProfile: { src: "images/7t/intro_01.png", title: "公司简介 (Company Profile)", desc: "上海施能电器设备有限公司，SINCE 1984" },
    // 排查指南
    troubleshootOverview: { src: "images/7t/troubleshoot_01.jpeg", title: "Elitra iON 7T 排查指南封面", desc: "2026年7月版" },
    troubleshootParts: { src: "images/7t/troubleshoot_14.png", title: "部件结构图 (Parts Layout)", desc: "机箱内部部件布局" },
    troubleshootHMI: { src: "images/7t/troubleshoot_16.png", title: "HMI界面详解", desc: "各功能区域说明" }
  },

  // ===== 故障代码列表 =====
  // CZC7T使用文字描述故障而非E-xx代码
  faultCodes: [
    {
      code: "欠压",
      codeEn: "Undervoltage",
      type: "充电机故障",
      typeEn: "Charger Fault",
      reason: "电池检测中，电池电压过低",
      reasonEn: "Battery detection, voltage too low",
      solution: "检查电池是否连接或接反",
      solutionEn: "Check whether the battery is connected or reversed",
      severity: "medium",
      steps: [
        "检查电池连接线是否牢固连接",
        "确认电池极性是否正确（正接正、负接负）",
        "进入HMI界面查看电池电压显示是否正常",
        "若电池电压确实过低，需先激活电池后再充电"
      ],
      stepsEn: [
        "Check battery connection cables are secure",
        "Confirm battery polarity is correct",
        "Check battery voltage display on HMI",
        "If battery voltage is indeed too low, activate battery before charging"
      ],
      images: []
    },
    {
      code: "接反",
      codeEn: "Reversed",
      type: "充电机故障",
      typeEn: "Charger Fault",
      reason: "电池正负极接反",
      reasonEn: "Battery reversed connection",
      solution: "检查接线的极性，确认正负极正确",
      solutionEn: "Check wiring polarity, ensure correct positive/negative",
      severity: "high",
      steps: [
        "立即断开充电机电源",
        "检查电池正负极连接，红色为正极(+)，黑色为负极(-)",
        "正确连接后重新上电",
        "确认HMI不再显示接反故障"
      ],
      stepsEn: [
        "Immediately disconnect charger power",
        "Check battery polarity: red=positive(+), black=negative(-)",
        "Reconnect correctly and power on",
        "Confirm HMI no longer shows reverse fault"
      ],
      images: []
    },
    {
      code: "缺相",
      codeEn: "Phase Failure",
      type: "充电机故障",
      typeEn: "Charger Fault",
      reason: "三相输入电源缺相",
      reasonEn: "Three-phase input power phase loss",
      solution: "检查输入电压是否缺相",
      solutionEn: "Check if input power is lack of phase",
      severity: "high",
      steps: [
        "使用万用表交流档测量三相线间电压（L1-L2, L2-L3, L1-L3）",
        "正常应为AC380V，若某相缺失则电压异常",
        "检查断路器、接线端子是否松动",
        "联系电工修复缺相问题后重新上电"
      ],
      stepsEn: [
        "Use multimeter AC mode to measure phase-to-phase voltage",
        "Normal: AC380V, missing phase shows abnormal voltage",
        "Check breaker and terminals for loose connections",
        "Contact electrician to fix phase loss, then re-power"
      ],
      images: ['troubleshootInput']
    },
    {
      code: "模块过热",
      codeEn: "Module OTP",
      type: "充电机故障",
      typeEn: "Charger Fault",
      reason: "充电模块过温保护",
      reasonEn: "Charging module over-temperature protection",
      solution: "检查模块风机是否运转正常，清理防尘网",
      solutionEn: "Check module fan operation, clean dust screen",
      severity: "medium",
      steps: [
        "断电等待10分钟以上让模块冷却",
        "检查充电机防尘网是否堵塞，清理灰尘",
        "检查模块风机是否正常运转",
        "进入HMI→Module界面查看模块工作代码",
        "若模块代码显示OTP，需更换风机或清理风道",
        "确认充电环境通风良好，温度不超过允许范围"
      ],
      stepsEn: [
        "Power off and wait 10+ minutes for cooling",
        "Check and clean dust screen",
        "Verify module fan is running normally",
        "Navigate to HMI→Module to check work code",
        "If code shows OTP, replace fan or clean air duct",
        "Ensure good ventilation, temp within allowable range"
      ],
      images: []
    },
    {
      code: "过压保护",
      codeEn: "OVP",
      type: "充电机故障",
      typeEn: "Charger Fault",
      reason: "输出电压超过保护值",
      reasonEn: "Output voltage exceeds protection value",
      solution: "检查电池电压是否过高，电源模块故障则更换",
      solutionEn: "Check if battery voltage is too high; replace power module if faulty",
      severity: "high",
      steps: [
        "进入HMI查看实时输出电压",
        "检查电池规格电压是否与充电机匹配",
        "确认OVP设定值（默认：规格电压+2V）是否正确",
        "若电池电压正常但报OVP，可能是电源模块故障",
        "更换对应规格的电源模块"
      ],
      stepsEn: [
        "Check real-time output voltage on HMI",
        "Verify battery voltage matches charger specification",
        "Confirm OVP setting (default: spec voltage +2V)",
        "If battery voltage normal but OVP persists, module may be faulty",
        "Replace with matching power module"
      ],
      images: []
    },
    {
      code: "过流保护",
      codeEn: "OCP",
      type: "充电机故障",
      typeEn: "Charger Fault",
      reason: "输出电流超过保护值",
      reasonEn: "Output current exceeds protection value",
      solution: "检查实际电流是否与屏幕显示一致，电源模块故障则更换",
      solutionEn: "Check if actual current matches screen reading; replace module if faulty",
      severity: "high",
      steps: [
        "进入HMI查看实时输出电流",
        "确认OCP设定值（默认：规格电流×120%）是否正确",
        "使用直流钳形表测量实际输出电流",
        "若实际电流与显示不一致，可能采样电路故障",
        "若实际电流确实过大，检查电池是否异常",
        "电源模块故障需更换"
      ],
      stepsEn: [
        "Check real-time output current on HMI",
        "Confirm OCP setting (default: spec current ×120%)",
        "Measure actual current with DC clamp-on ammeter",
        "If actual vs display mismatch, sampling circuit may be faulty",
        "If actual current is indeed too high, check battery",
        "Replace power module if faulty"
      ],
      images: []
    },
    {
      code: "通讯故障",
      codeEn: "Comm Failure",
      type: "充电机故障",
      typeEn: "Charger Fault",
      reason: "CAN通讯异常，BMS与充电机无法通讯",
      reasonEn: "CAN communication failure between BMS and charger",
      solution: "检查通讯线路，测量CANbus电阻（60Ω正常，120Ω异常）",
      solutionEn: "Check communication circuit, measure CANbus resistance (60Ω normal, 120Ω abnormal)",
      severity: "high",
      steps: [
        "确认充电插头是否主动拔出（正常场景）",
        "关机测量S+和S-之间电阻：连接电池应60Ω，断开应120Ω",
        "若为120Ω：检查CAN通讯线连接，确认无松动、氧化",
        "检查充电机通讯协议设置（charging curve，默认5=国标）",
        "进入HMI→Charger Status→Start Signals查看BMS通讯信号状态",
        "若通讯正常但BMS未发启动报文，检查通讯协议/波特率是否一致"
      ],
      stepsEn: [
        "Confirm charging plug wasn't actively unplugged (normal scenario)",
        "Power off, measure S+/S- resistance: 60Ω connected, 120Ω disconnected",
        "If 120Ω: check CAN cable connections, no loose/oxidation",
        "Verify charger protocol setting (charging curve, default 5=GB)",
        "Navigate to HMI→Charger Status→Start Signals to check BMS comm signal",
        "If comm is OK but BMS doesn't send start message, check protocol/baud rate"
      ],
      images: ['troubleshootCAN', 'troubleshootStart']
    },
    {
      code: "BMS故障",
      codeEn: "BMS Failure",
      type: "BMS故障",
      typeEn: "BMS Fault",
      reason: "BMS报告故障",
      reasonEn: "BMS reports fault",
      solution: "查看BMS信息，联系电池供应商",
      solutionEn: "Check BMS information, contact battery supplier",
      severity: "medium",
      steps: [
        "进入HMI→Battery界面查看BMS详细信息",
        "确认具体BMS故障类型（绝缘/过温/连接器等）",
        "所有BMS故障发生在电池端，充电机仅显示",
        "联系电池供应商获取更详细的原因和处理方案"
      ],
      stepsEn: [
        "Navigate to HMI→Battery to view BMS details",
        "Identify specific BMS fault type",
        "All BMS faults occur on battery side, charger only displays",
        "Contact battery supplier for detailed reasons and solutions"
      ],
      images: ['hmiBattery']
    },
    {
      code: "参数初始化失败",
      codeEn: "Param Init Fail",
      type: "充电机故障",
      typeEn: "Charger Fault",
      reason: "控制板参数初始化失败",
      reasonEn: "Control board parameter initialization failure",
      solution: "控制板故障，通常需要更换",
      solutionEn: "Control board error, normally needs replacement",
      severity: "critical",
      steps: [
        "尝试断电重启充电机",
        "若重启后仍报此故障，确认控制板程序是否损坏",
        "尝试通过SD卡重新烧写主控程序",
        "若软件升级后仍无法解决，需更换控制板",
        "联系上海施能电器设备有限公司技术支持"
      ],
      stepsEn: [
        "Try power cycling the charger",
        "If fault persists after restart, check if control board firmware is corrupted",
        "Try re-flashing main controller program via SD card",
        "If software update doesn't resolve, replace control board",
        "Contact Shineng technical support"
      ],
      images: []
    },
    {
      code: "输入过压",
      codeEn: "Input OVP",
      type: "充电机故障",
      typeEn: "Charger Fault",
      reason: "电网输入电压过高",
      reasonEn: "Grid input voltage too high",
      solution: "检查电网电压",
      solutionEn: "Check grid voltage",
      severity: "medium",
      steps: [
        "使用万用表测量输入端电压",
        "单相机型正常AC220V(230V±10%)，三相机型AC320-520V",
        "若电网电压确实过高，联系供电部门",
        "可加装稳压器或调整充电机输入电压设置"
      ],
      stepsEn: [
        "Measure input voltage with multimeter",
        "Single phase: AC220V(230V±10%), Three phase: AC320-520V",
        "If grid voltage is indeed too high, contact power supplier",
        "Consider voltage stabilizer or adjust charger input setting"
      ],
      images: []
    },
    {
      code: "输入欠压",
      codeEn: "Input UVP",
      type: "充电机故障",
      typeEn: "Charger Fault",
      reason: "电网输入电压过低",
      reasonEn: "Grid input voltage too low",
      solution: "检查电网电压",
      solutionEn: "Check grid voltage",
      severity: "medium",
      steps: [
        "使用万用表测量输入端电压",
        "单相机型正常AC220V(230V±10%)，三相机型AC320-520V",
        "检查输入电缆是否线径不足或接线错误",
        "若电网电压确实过低，联系供电部门"
      ],
      stepsEn: [
        "Measure input voltage with multimeter",
        "Single phase: AC220V(230V±10%), Three phase: AC320-520V",
        "Check if input cable gauge is sufficient or wiring is wrong",
        "If grid voltage is indeed too low, contact power supplier"
      ],
      images: []
    },
    {
      code: "充电枪过温",
      codeEn: "Gun OVT",
      type: "充电机故障",
      typeEn: "Charger Fault",
      reason: "充电枪/输出连接器过温保护",
      reasonEn: "Charging gun/output connector over-temperature",
      solution: "检查充电枪接触是否良好，输出电缆温度是否正常",
      solutionEn: "Check charging gun connection, output cable temperature",
      severity: "medium",
      steps: [
        "断电冷却后检查充电枪/连接器是否有氧化、烧蚀",
        "清洁接触面后重新连接",
        "检查输出电缆规格是否匹配充电电流",
        "确认Charging Plug OTP设定值（默认105°C）是否正确",
        "进入HMI→Charger Status→Charger Status2查看连接器温度"
      ],
      stepsEn: [
        "Power off, cool down, check gun/connector for oxidation/burn marks",
        "Clean contacts and reconnect",
        "Verify output cable gauge matches charging current",
        "Confirm Charging Plug OTP setting (default 105°C)",
        "Navigate to HMI→Charger Status2 to check connector temperature"
      ],
      images: []
    },
    {
      code: "绝缘故障",
      codeEn: "Insulation Fault",
      type: "BMS故障",
      typeEn: "BMS Fault",
      reason: "BMS检测到绝缘异常",
      reasonEn: "BMS detected insulation abnormality",
      solution: "检查输出电缆绝缘性（高压充电机常见）",
      solutionEn: "Check output cable insulation (common on high-voltage chargers)",
      severity: "high",
      steps: [
        "检查输出电缆绝缘层是否破损",
        "使用绝缘电阻测试仪测量绝缘电阻",
        "高压充电机（80V/72V）更容易出现此故障",
        "更换破损电缆后重新测试",
        "联系电池供应商确认BMS绝缘检测标准"
      ],
      stepsEn: [
        "Check output cable insulation for damage",
        "Use insulation resistance tester to measure",
        "High-voltage chargers (80V/72V) more prone to this fault",
        "Replace damaged cables and re-test",
        "Contact battery supplier for BMS insulation standards"
      ],
      images: []
    },
    {
      code: "连接器过温",
      codeEn: "Connector OVT",
      type: "BMS故障",
      typeEn: "BMS Fault",
      reason: "BMS检测到输出连接器过温",
      reasonEn: "BMS detected output connector over-temperature",
      solution: "检查充电电缆或电池充电插座",
      solutionEn: "Check charging cable or battery charging socket",
      severity: "medium",
      steps: [
        "检查充电连接器接触是否良好",
        "清洁连接器接触面",
        "检查充电电缆是否有发热现象",
        "联系电池供应商确认连接器温度传感器状态"
      ],
      stepsEn: [
        "Check charging connector contact quality",
        "Clean connector contact surfaces",
        "Check charging cable for heating",
        "Contact battery supplier about connector temp sensor status"
      ],
      images: []
    },
    {
      code: "电池组过温",
      codeEn: "Battery OVT",
      type: "BMS故障",
      typeEn: "BMS Fault",
      reason: "电池组温度过高",
      reasonEn: "Battery pack over-temperature",
      solution: "检查电池散热系统，确认环境通风",
      solutionEn: "Check battery cooling system, ensure ventilation",
      severity: "medium",
      steps: [
        "进入HMI→Battery界面查看最高/最低电池温度",
        "检查电池散热系统是否正常",
        "确认充电环境通风良好",
        "等待电池冷却后再充电",
        "联系电池供应商确认电池温度保护范围"
      ],
      stepsEn: [
        "Navigate to HMI→Battery to check max/min cell temp",
        "Verify battery cooling system is working",
        "Ensure charging environment has good ventilation",
        "Wait for battery to cool before charging",
        "Contact battery supplier for temp protection range"
      ],
      images: ['hmiBattery']
    },
    {
      code: "单体电压过高",
      codeEn: "Cell V High",
      type: "BMS故障",
      typeEn: "BMS Fault",
      reason: "单体电池电压过高警告",
      reasonEn: "High cell voltage warning",
      solution: "检查电池最高单体电压",
      solutionEn: "Check maximum cell voltage of battery",
      severity: "medium",
      steps: [
        "进入HMI→Battery界面查看Max cell voltage",
        "确认电池BMS单体均衡是否正常",
        "磷酸铁锂(LFP)单体最高3.65V，三元(NCM)最高4.2V",
        "联系电池供应商处理单体电压异常"
      ],
      stepsEn: [
        "Navigate to HMI→Battery, check Max cell voltage",
        "Verify battery BMS cell balancing is normal",
        "LFP max: 3.65V/cell, NCM max: 4.2V/cell",
        "Contact battery supplier for cell voltage issues"
      ],
      images: []
    },
    {
      code: "单体电压过低",
      codeEn: "Cell V Low",
      type: "BMS故障",
      typeEn: "BMS Fault",
      reason: "单体电池电压过低警告",
      reasonEn: "Low cell voltage warning",
      solution: "检查电池最低单体电压",
      solutionEn: "Check minimum cell voltage of battery",
      severity: "medium",
      steps: [
        "进入HMI→Battery界面查看Min cell voltage",
        "电池过放电可能导致单体电压过低",
        "可尝试使用强制充电功能（需管理员登录）",
        "联系电池供应商获取指导"
      ],
      stepsEn: [
        "Navigate to HMI→Battery, check Min cell voltage",
        "Over-discharge may cause low cell voltage",
        "Try forced charging (requires admin login)",
        "Contact battery supplier for guidance"
      ],
      images: []
    },
    {
      code: "高压继电器故障",
      codeEn: "HV Relay Fault",
      type: "BMS故障",
      typeEn: "BMS Fault",
      reason: "电池高压继电器故障",
      reasonEn: "Battery high-voltage relay fault",
      solution: "检查电池充电继电器",
      solutionEn: "Check battery charging relay",
      severity: "high",
      steps: [
        "检查电池端高压继电器是否正常吸合",
        "测量继电器线圈供电",
        "检查继电器触点是否烧蚀",
        "联系电池供应商更换继电器"
      ],
      stepsEn: [
        "Check if battery HV relay engages properly",
        "Measure relay coil supply voltage",
        "Check relay contacts for burning",
        "Contact battery supplier to replace relay"
      ],
      images: []
    }
  ],

  // ===== 模块工作代码 =====
  moduleCodes: [
    { code: 0, desc: "待机 (Standby)", descEn: "Standby mode", action: "模块未收到启动命令，等待中。检查启动条件是否满足。", actionEn: "Module has not received start command. Check if start conditions are met." },
    { code: 1, desc: "工作 (Work)", descEn: "Working mode", action: "模块正在正常工作。无需处理。", actionEn: "Module is working normally. No action needed." },
    { code: 2, desc: "故障 (Fault)", descEn: "General fault", action: "充电机故障（仅在无其他详细分类故障时显示）。查看具体故障信息。", actionEn: "Charger fault (only shown when no other specific fault). Check detailed fault info." },
    { code: 3, desc: "离线 (Off-line)", descEn: "Offline", action: "模块通讯线不可靠。检查模块CAN通讯线连接。", actionEn: "Module communication cable unreliable. Check CAN cable connection." },
    { code: 4, desc: "输出欠压 (OUV)", descEn: "Output under-voltage", action: "充电机输出异常。检查输出回路和电池连接。", actionEn: "Abnormal charger output. Check output circuit and battery connection." },
    { code: 5, desc: "输出过压 (OOV)", descEn: "Output over-voltage", action: "充电机输出异常或连接了较高电压的电池。检查电池电压和模块。", actionEn: "Abnormal output or connected to high-voltage battery. Check battery voltage and module." },
    { code: 6, desc: "输入欠压 (Input UVP)", descEn: "Input under-voltage", action: "电网电压过低或缺相。检查输入电源。", actionEn: "Grid voltage too low or phase loss. Check input power." },
    { code: 7, desc: "输入过压 (Input OVP)", descEn: "Input over-voltage", action: "电网电压过高。检查电网电压。", actionEn: "Grid voltage too high. Check grid voltage." },
    { code: 8, desc: "风机故障 (Fan Fault)", descEn: "Fan fault", action: "模块风机堵塞或损坏。清理风道，必要时更换风机。", actionEn: "Fan blocked or damaged. Clean air duct, replace fan if needed." },
    { code: 9, desc: "限流 (Current Limit)", descEn: "Current limit", action: "模块已限制输出电流。正常保护行为，无需处理。", actionEn: "Module has limited output current. Normal protection, no action needed." },
    { code: 10, desc: "过温保护 (OTP)", descEn: "Over-temperature", action: "模块过温保护。清理防尘网，检查风机，等待降温。", actionEn: "Module over-temp protection. Clean dust screen, check fan, wait for cooling." },
    { code: 11, desc: "过流保护 (OCP)", descEn: "Over-current", action: "模块过流保护。检查实际电流和电池状态。", actionEn: "Module over-current protection. Check actual current and battery status." },
    { code: 12, desc: "副边故障 (Secondary Side)", descEn: "Secondary side fault", action: "模块副边保护。需更换电源模块。", actionEn: "Module secondary side in protection. Replace power module." },
    { code: 13, desc: "PFC故障 (PFC Fault)", descEn: "PFC fault", action: "功率因数校正部分故障。需更换电源模块。", actionEn: "Power factor correction fault. Replace power module." },
    { code: 14, desc: "CAN故障 (CAN Fault)", descEn: "CAN fault", action: "模块CAN通讯故障。检查内部CAN通讯线。", actionEn: "Module CAN communication fault. Check internal CAN cable." },
    { code: 15, desc: "短路 (OSC)", descEn: "Output short-circuit", action: "输出短路故障。检查输出回路是否短路。", actionEn: "Output short-circuit fault. Check output circuit for short." },
    { code: 16, desc: "接反保护 (Reversed)", descEn: "Reversed connection", action: "模块触发接反保护。检查电池极性。", actionEn: "Module triggered reverse connection protection. Check battery polarity." },
    { code: 17, desc: "内部通讯故障 (Intercom)", descEn: "Internal comm failure", action: "模块内部通讯故障。检查模块间通讯线。", actionEn: "Internal communication fault. Check inter-module cables." },
    { code: 18, desc: "不均流 (Uneven Current)", descEn: "Uneven current", action: "模块间电流差异较大。检查模块匹配性。", actionEn: "Large current difference between modules. Check module compatibility." }
  ],

  // ===== 充电机消息 =====
  chargerMessages: [
    { msg: "等待启动充电...", msgEn: "Waiting to start charging...", desc: "充电机已准备就绪，等待启动条件满足" },
    { msg: "电池脱落", msgEn: "Battery falling off", desc: "电池连接断开（高频电源模块不适用）" },
    { msg: "未注册故障，请联系供应商！", msgEn: "Unregistered fault, please contact supplier!", desc: "出现未注册的故障类型" },
    { msg: "手动拔枪停止充电", msgEn: "Manually pull the gun to stop charging", desc: "通过国标枪连接断开停止" },
    { msg: "预充中...", msgEn: "Pre charging...", desc: "使输出接触器两侧电压平衡" },
    { msg: "充电阶段I", msgEn: "Charging stage I", desc: "第一阶段充电中" },
    { msg: "充电阶段II", msgEn: "Charging stage II", desc: "第二阶段充电中" },
    { msg: "充电阶段III", msgEn: "Charging stage III", desc: "第三阶段充电中" },
    { msg: "充电阶段IV", msgEn: "Charging stage IV", desc: "第四阶段充电中" },
    { msg: "总时间完成", msgEn: "Total time completed", desc: "充电时间达到设定总时间，显示充电完成" },
    { msg: "末段时间完成", msgEn: "Final stage time completed", desc: "最后充电阶段超过设定时间" },
    { msg: "最小电流完成", msgEn: "Minimum current completed", desc: "电流降至设定值后延迟几秒判定完成" },
    { msg: "BMS命令完成", msgEn: "BMS command completed", desc: "BMS通过CAN发送充电完成信号" }
  ],

  // ===== 排查向导步骤 =====
  // CZC7T排查向导使用不同的故障分类
  wizardSteps: {
    options: [
      { icon: '🔌', text: '连上电池后不充电', desc: '通讯灯不闪或显示故障', next: 'comm' },
      { icon: '📺', text: '触摸屏显示故障信息', desc: '屏幕报故障提示', next: 'code' },
      { icon: '🔥', text: '过温报警', desc: '设备或电池温度异常', next: 'temp' },
      { icon: '🔇', text: '开机无反应/屏幕不亮', desc: '上电后屏幕不显示', next: 'power' },
      { icon: '🔧', text: '模块故障/工作代码异常', desc: '模块报错或风机不转', next: 'module' },
      { icon: '❓', text: '其他问题', desc: '不确定具体故障类型', next: 'general' }
    ],
    optionsEn: [
      { icon: '🔌', text: 'Not charging after connecting battery', desc: 'Comm light not flashing or fault shown', next: 'comm' },
      { icon: '📺', text: 'Touch screen shows fault', desc: 'Screen displays fault message', next: 'code' },
      { icon: '🔥', text: 'Over-temperature alarm', desc: 'Device or battery temp abnormal', next: 'temp' },
      { icon: '🔇', text: 'No response / screen not lighting up', desc: 'Screen blank after power on', next: 'power' },
      { icon: '🔧', text: 'Module fault / abnormal work code', desc: 'Module error or fan not running', next: 'module' },
      { icon: '❓', text: 'Other issues', desc: 'Unsure of specific fault type', next: 'general' }
    ],
    results: {
      comm: {
        title: '通讯故障排查方案',
        titleEn: 'Communication Fault Troubleshooting',
        images: ['troubleshootCAN', 'troubleshootStart'],
        steps: [
          '【1】进入HMI→Setting→Charger Status3，查看Start Signals状态指示灯',
          '【2】检查4个启动条件：①继电器两端压差接近 ②电压启动信号置位 ③BMS通讯启动信号置位 ④BMS通讯信号检测到',
          '【3】关机测量S+~S-电阻：连接电池60Ω正常，120Ω异常（检查CAN线）',
          '【4】上电测量辅助电源输出：正常DC12V',
          '【5】检查充电机充电曲线(charging curve)设置：默认5=国标协议',
          '【6】进入Battery界面查看BMS是否发出充电请求',
          '【7】进入Module界面查看各模块状态是否正常',
          '【8】若通讯正常但BMS不发启动报文，检查协议/波特率是否一致',
          '【9】CAN卡读取报文分析（高级排查）'
        ],
        stepsEn: [
          '[1] Navigate to HMI→Setting→Charger Status3, check Start Signals indicators',
          '[2] Check 4 start conditions: ①Relay voltage close ②Voltage start signal ③BMS comm start signal ④BMS comm signal detected',
          '[3] Power off, measure S+/S- resistance: 60Ω normal connected, 120Ω abnormal',
          '[4] Power on, measure auxiliary power output: normal DC12V',
          '[5] Check charging curve setting: default 5=GB protocol',
          '[6] Navigate to Battery page to check if BMS sends charging request',
          '[7] Navigate to Module page to check module status',
          '[8] If comm OK but BMS doesn\'t send start, check protocol/baud rate',
          '[9] Use CAN analyzer for advanced troubleshooting'
        ]
      },
      code: {
        title: '故障信息排查指南',
        titleEn: 'Fault Message Troubleshooting',
        steps: [
          '【1】记录HMI屏幕显示的故障信息（文字描述，如"通讯故障"、"过压保护"等）',
          '【2】前往「故障代码」页面搜索故障关键词',
          '【3】或在AI问答中直接输入故障描述获取排查步骤',
          '【4】进入Battery界面查看电池详细信息辅助判断',
          '【5】进入Module界面查看各模块工作代码',
          '【6】进入Event界面查看历史事件记录',
          '【7】BMS故障请联系电池供应商'
        ],
        stepsEn: [
          '[1] Record fault message shown on HMI (text description)',
          '[2] Search fault keywords in the Fault Codes page',
          '[3] Or enter fault description in AI Chat for troubleshooting steps',
          '[4] Navigate to Battery page for battery details',
          '[5] Navigate to Module page for module work codes',
          '[6] Navigate to Event page for event history',
          '[7] Contact battery supplier for BMS faults'
        ]
      },
      temp: {
        title: '过温故障排查方案',
        titleEn: 'Over-Temperature Troubleshooting',
        steps: [
          '【1】断开充电，等待10分钟以上让设备冷却',
          '【2】进入Battery界面查看最高/最低电池温度',
          '【3】连接器过温：检查充电接口氧化、烧蚀，清洁后重连',
          '【4】电池组过温：检查电池散热系统，确认环境通风',
          '【5】模块过温(代码10)：清理充电机防尘网，检查风机运转',
          '【6】风机故障(代码8)：检查风机供电，清理风道，必要时更换风机',
          '【7】确认充电环境温度不超过设备允许范围',
          '【8】确认充电电流未超过额定值',
          '【9】检查Charging Plug OTP设定值（默认105°C）'
        ],
        stepsEn: [
          '[1] Disconnect charging, wait 10+ minutes for cooling',
          '[2] Check max/min battery temp in Battery page',
          '[3] Connector OVT: check for oxidation, clean and reconnect',
          '[4] Battery pack OVT: check cooling system, ensure ventilation',
          '[5] Module OTP (code 10): clean dust screen, check fan',
          '[6] Fan fault (code 8): check fan supply, clean duct, replace if needed',
          '[7] Ensure ambient temp within allowable range',
          '[8] Confirm charging current within rated value',
          '[9] Check Charging Plug OTP setting (default 105°C)'
        ]
      },
      power: {
        title: '开机无反应排查方案',
        titleEn: 'No Power / Screen Not Lighting Up',
        images: ['troubleshootInput', 'troubleshootAux'],
        steps: [
          '【1】测量输入端电压：三相机型测三相AC380V(L1-L2/L2-L3/L1-L3)，单相测AC220V',
          '【2】检查断路器是否跳闸，手动复位尝试',
          '【3】检查断路器输入端电压是否正常',
          '【4】检查辅助电源(AC/DC模块)输出：正常DC12V',
          '【5】若辅助电源无输出：检查是否有飞虫进入导致短路（案例1）',
          '【6】检查防尘网，确保无异物进入',
          '【7】若屏幕不亮但辅助电源正常：可能LCD触摸屏故障',
          '【8】检查内部接线是否有松动、脱落',
          '【9】若以上均正常但不工作，联系上海施能电器设备有限公司技术支持'
        ],
        stepsEn: [
          '[1] Measure input voltage: 3-phase AC380V, single-phase AC220V',
          '[2] Check if breaker has tripped, try manual reset',
          '[3] Check breaker input terminal voltage',
          '[4] Check auxiliary power (AC/DC module) output: normal DC12V',
          '[5] If aux power has no output: check for insects causing short circuit (Case 1)',
          '[6] Check dust screen for foreign objects',
          '[7] If screen blank but aux power OK: LCD touch screen may be faulty',
          '[8] Check internal wiring for loose/disconnected',
          '[9] If all above normal but not working, contact Shineng technical support'
        ]
      },
      module: {
        title: '模块故障排查方案',
        titleEn: 'Module Fault Troubleshooting',
        steps: [
          '【1】进入HMI→Module界面查看各模块状态',
          '【2】查看模块工作代码(Work Code)确定原因',
          '【3】代码0-待机 / 1-工作 / 2-故障 / 3-离线(通讯线不可靠)',
          '【4】代码4-输出欠压(OUV) / 5-输出过压(OOV)',
          '【5】代码6-输入欠压 / 7-输入过压 / 8-风机故障',
          '【6】代码9-限流 / 10-过温(OTP) / 11-过流(OCP)',
          '【7】代码12-副边故障 / 13-PFC故障 / 14-CAN故障 / 15-短路(OSC)',
          '【8】代码16-接反 / 17-内部通讯故障 / 18-不均流',
          '【9】模块更换步骤：取下防尘网→卸挡板→拔出模块→插入新模块→安装挡板和防尘网'
        ],
        stepsEn: [
          '[1] Navigate to HMI→Module page to check module status',
          '[2] Check Work Code to determine the cause',
          '[3] Code 0-Standby / 1-Work / 2-Fault / 3-Offline (comm cable)',
          '[4] Code 4-OUV / 5-OOV',
          '[5] Code 6-Input UVP / 7-Input OVP / 8-Fan fault',
          '[6] Code 9-Current limit / 10-OTP / 11-OCP',
          '[7] Code 12-Secondary side / 13-PFC / 14-CAN / 15-OSC',
          '[8] Code 16-Reversed / 17-Intercom failure / 18-Uneven current',
          '[9] Module replacement: remove dust screen → remove baffle → pull out module → insert new → reinstall'
        ]
      },
      general: {
        title: '通用排查流程',
        titleEn: 'General Troubleshooting',
        steps: [
          '【1】观察故障现象：HMI屏幕显示内容、指示灯状态、有无异响异味',
          '【2】记录故障信息：HMI屏幕显示的故障文字描述',
          '【3】进入Battery界面查看电池参数（电压/电流/SOC/温度/单体电压等）',
          '【4】进入Module界面查看各模块状态和工作代码',
          '【5】进入Event界面查看历史事件记录',
          '【6】测量输入供电：三相AC380V或单相AC220V正常',
          '【7】测量辅助电源：DC12V正常',
          '【8】测量CANbus电阻：连接电池60Ω，断开120Ω',
          '【9】若以上均正常但仍无法工作，联系上海施能电器设备有限公司技术支持'
        ],
        stepsEn: [
          '[1] Observe fault: HMI display, indicator lights, abnormal sounds/smells',
          '[2] Record fault info: text description on HMI screen',
          '[3] Navigate to Battery page (voltage/current/SOC/temp/cell voltage)',
          '[4] Navigate to Module page (module status and work codes)',
          '[5] Navigate to Event page (event history)',
          '[6] Measure input: 3-phase AC380V or single-phase AC220V normal',
          '[7] Measure auxiliary power: DC12V normal',
          '[8] Measure CANbus resistance: 60Ω connected, 120Ω disconnected',
          '[9] If all above normal but not working, contact Shineng technical support'
        ]
      }
    }
  },

  // ===== 售后案例 =====
  afterSalesCases: [
    {
      case: 1,
      phenomenon: "充电机断路器合上后，显示屏不亮。充电机无法正常工作。",
      phenomenonEn: "When the breaker is turned on, the display screen does not light up. The charger can't work normally.",
      reason: "12V辅助电源无输出。机内有飞虫进入，导致电源短路。电路板有明显飞弧现象。因充电机出风口孔径较大，飞虫可进入充电机内部。",
      reasonEn: "The 12V auxiliary power supply has no output. Flying insects entered, causing a short circuit. Obvious arcing on the circuit board. The air outlet aperture is relatively large.",
      solution: "更换辅助电源，加装防虫网。",
      solutionEn: "Replace auxiliary power supply, add insect screen."
    },
    {
      case: 2,
      phenomenon: "充电机主界面报故障，无法正常工作，提示输入欠压。",
      phenomenonEn: "The main interface reports a fault and cannot work normally, prompting input under-voltage.",
      reason: "输入电缆接线错误。",
      reasonEn: "The input cable is wrongly connected.",
      solution: "正确连接输入电缆。",
      solutionEn: "Correctly connect the input cable."
    },
    {
      case: 3,
      phenomenon: "充电过程中提示充电枪过温保护。",
      phenomenonEn: "During charging, it prompts that the charging gun is over-temperature protected.",
      reason: "温度采样系数被修改，导致温度采样偏差过大。",
      reasonEn: "The temperature sampling coefficient has been modified, resulting in excessive temperature sampling deviation.",
      solution: "恢复温度采样系数默认值。",
      solutionEn: "Restore temperature sampling coefficient to default value."
    },
    {
      case: 4,
      phenomenon: "充电机插上电池后不工作。",
      phenomenonEn: "After the charger is plugged into the battery, it does not work.",
      reason: "电池端通讯协议错误，导致无法与充电机通讯。",
      reasonEn: "The communication protocol at the battery end is wrong, resulting in inability to communicate.",
      solution: "修正电池端通讯协议设置。",
      solutionEn: "Correct battery end communication protocol settings."
    },
    {
      case: 5,
      phenomenon: "充电机插上电池后不工作。",
      phenomenonEn: "After the charger is plugged into the battery, it does not work.",
      reason: "直流接触器不吸合，压差大于8V。部分充电机压差处于临界值，统一将压差设定为10V。",
      reasonEn: "DC contactor does not pull in, voltage difference >8V. Voltage diff setting changed to 10V.",
      solution: "调整压差设定值至10V。",
      solutionEn: "Adjust voltage diff setting to 10V."
    },
    {
      case: 6,
      phenomenon: "充电机插上电池后不工作，无输出电压。技术人员测量SWD3连接器第5脚和第2脚之间电压时，充电机启动了。",
      phenomenonEn: "After plugging in battery, charger doesn't work. When measuring pin 5 and pin 2 of SWD3, the charger started.",
      reason: "SWD3连接器存在问题。",
      reasonEn: "The SWD3 connector has a problem.",
      solution: "更换或重新插紧SWD3连接器。",
      solutionEn: "Replace or re-secure the SWD3 connector."
    },
    {
      case: 7,
      phenomenon: "屏幕反复重启。",
      phenomenonEn: "The screen keeps restarting repeatedly.",
      reason: "HMI触摸屏供电不稳定或程序异常。",
      reasonEn: "HMI touch screen power supply unstable or program abnormality.",
      solution: "检查触摸屏供电，尝试USB重新烧写显示程序。",
      solutionEn: "Check touch screen power supply, try USB re-flashing display program."
    }
  ],

  // ===== 技术参数 =====
  technicalSpecs: {
    formula: {
      inputPower: "充电机输入电流计算公式 / Input Current Formula",
      singlePhase: "单相: 输入电流(A) = 输出电压 × 输出电流 / 转换系数 / 输入电压",
      singlePhaseEn: "1-Phase: Input Current(A) = Output V × Output I / Conversion Factor / Input V",
      threePhase: "三相: 输入电流(A) = 输出电压 × 输出电流 / 转换系数 / 输入电压 / √3",
      threePhaseEn: "3-Phase: Input Current(A) = Output V × Output I / Factor / Input V / 1.732",
      current: "CZC7T系列转换系数为0.9 (Conversion factor = 0.9)",
      example: "示例: CZC7T-D100/200 三相380V → 输入电流 = 100×200/0.9/380/1.732 = 33A",
      exampleEn: "Example: CZC7T-D100/200 3-Phase 380V → Input = 100×200/0.9/380/1.732 = 33A"
    },
    models: [
      { spec: "Li-EC1 7T24/50-220V", input: "1P 220V", power: "0.9kW", current: "7.6A", maxCurrent: "1.7A", maxVoltage: "50A", weight: "-", comm: "CAN", ip: "IP21", size: "518×262×405" },
      { spec: "Li-EC1 7T24/100-220V", input: "1P 220V", power: "1.5kW", current: "15.2A", maxCurrent: "3.3A", maxVoltage: "100A", weight: "-", comm: "CAN", ip: "IP21", size: "518×262×405" },
      { spec: "Li-EC3 7T48/200-380V", input: "3P 380V", power: "5.9kW", current: "19.6A", maxCurrent: "12.9A", maxVoltage: "200A", weight: "-", comm: "CAN", ip: "IP21", size: "780×380×690" },
      { spec: "Li-EC3 7T48/300-380V", input: "3P 380V", power: "8.8kW", current: "29.4A", maxCurrent: "19.4A", maxVoltage: "300A", weight: "-", comm: "CAN", ip: "IP21", size: "780×380×690" },
      { spec: "Li-EC3 7T72/100-380V", input: "3P 380V", power: "4.3kW", current: "14.3A", maxCurrent: "9.4A", maxVoltage: "100A", weight: "-", comm: "CAN", ip: "IP21", size: "780×380×690" },
      { spec: "Li-EC3 7T72/300-380V", input: "3P 380V", power: "12.9kW", current: "42.9A", maxCurrent: "28.3A", maxVoltage: "300A", weight: "-", comm: "CAN", ip: "IP21", size: "780×380×690" },
      { spec: "Li-EC3 7T80/100-380V", input: "3P 380V", power: "4.9kW", current: "16.3A", maxCurrent: "10.8A", maxVoltage: "100A", weight: "-", comm: "CAN", ip: "IP21", size: "780×380×690" },
      { spec: "Li-EC3 7T80/300-380V", input: "3P 380V", power: "14.7kW", current: "49.0A", maxCurrent: "32.3A", maxVoltage: "300A", weight: "-", comm: "CAN", ip: "IP21", size: "780×380×690" }
    ],
    efficiency: "单相90%，三相93%以上 / Single-phase: 90%, Three-phase: 93%+",
    acRange: "单相: 230V±10% (220V); 三相: 320-520V",
    languages: "中文/英语/法语/意大利语/西班牙语/葡萄牙语",
    languagesEn: "Chinese/English/French/Italian/Spanish/Portuguese",
    userPassword: "5678",
    adminPassword: "5656"
  },

  workingConditions: {
    conditions: [
      "工作温度: -10°C ~ +50°C / Operating Temp: -10°C ~ +50°C",
      "存储温度: -20°C ~ +60°C / Storage Temp: -20°C ~ +60°C",
      "相对湿度: 5% ~ 95% (无凝露) / Humidity: 5% ~ 95% (no condensation)",
      "海拔: ≤2000m / Altitude: ≤2000m",
      "防护等级: IP21 / Protection: IP21",
      "AC电压范围: 单相230V±10%, 三相320-520V"
    ]
  },

  // ===== 控制器板接口定义 =====
  controllerBoard: {
    desc: "控制器是充电机的大脑，处理多项任务完成电池充电。以下为控制器板主要接口定义：",
    descEn: "The controller is the brain of the charger, handling multiple tasks. Key interface definitions:",
    interfaces: [
      { id: "J1", name: "输入电源+辅助输出", desc: "Input power + Aux Output" },
      { id: "KF1", name: "直流接触器控制", desc: "DC contactor control" },
      { id: "YE1", name: "BMS CAN总线", desc: "BMS CAN bus" },
      { id: "YE3", name: "内部CAN总线", desc: "Internal CAN bus" },
      { id: "YE4", name: "Modbus RTU接口", desc: "Modbus RTU interface" },
      { id: "YE5", name: "HMI触摸屏", desc: "HMI Touch screen" },
      { id: "SWD2", name: "触摸屏(国产)", desc: "Touch screen (domestic)" },
      { id: "KF2", name: "12V@100mA辅助电源", desc: "12V@100mA Aux Power" },
      { id: "IO2", name: "连接检查", desc: "Connect check" },
      { id: "SWD3", name: "电压采样", desc: "Voltage sampling" },
      { id: "SD", name: "SD卡", desc: "SD card (software upgrade)" },
      { id: "P2", name: "温度传感器", desc: "Temperature sensors" },
      { id: "BEEP1", name: "工作指示灯", desc: "Work LED indicator" },
      { id: "P1", name: "启动/停止按钮+电子锁", desc: "Start/Stop button + E-lock" }
    ]
  },

  // ===== HMI界面说明 =====
  hmi: {
    home: {
      desc: "主界面显示充电信息、模块类型(P-x)、充电协议(C-x)、充电参数、系统时间、状态指示灯",
      descEn: "Home page shows charging info, module type (P-x), protocol (C-x), parameters, time, status indicators",
      items: [
        { name: "ON/OFF", desc: "停止和重启电池充电 / Stop and restart battery charge" },
        { name: "充电信息", desc: "显示充电参数 / Charger messages" },
        { name: "P-x", desc: "代表模块类型 / Module type" },
        { name: "C-x", desc: "代表充电协议类型 / Charging protocol type" },
        { name: "充电参数显示区", desc: "电压、电流、容量、时间 / Charging parameters" },
        { name: "系统时间日期", desc: "年月日时分秒 / System time and date" },
        { name: "状态指示灯", desc: "Complete-充满, Fault-故障, Comm-通讯闪烁, Work-充电中, Heating-加热模式 / Status indicators" },
        { name: "Battery", desc: "充电中电池详细信息 / Battery details during charging" },
        { name: "Module", desc: "模块详细状态和信息 / Module status and info" },
        { name: "Event", desc: "充电机事件记录 / Charger events" },
        { name: "Setting", desc: "设置 / Settings" }
      ]
    }
  },

  // ===== 启动条件 =====
  startConditions: {
    desc: "充电机正常启动需要满足以下4项条件：",
    descEn: "The charger requires the following 4 conditions to start:",
    conditions: [
      { name: "继电器两端压差接近", desc: "输出直流接触器两端电压差≤压差设定值(默认8V)", en: "Relay voltage close (voltage diff ≤ setting, default 8V)" },
      { name: "电压启动信号置位", desc: "电池电压超过启动电压设定值(默认2V)", en: "Voltage start signal (battery voltage > start setting, default 2V)" },
      { name: "BMS通讯启动信号置位", desc: "BMS允许充电机启动", en: "BMS communication start signal set" },
      { name: "检测到BMS通讯信号", desc: "CAN协议匹配，通讯正常", en: "BMS communication signal detected (CAN matched)" }
    ],
    troubleshooting: {
      condition1: {
        title: "继电器两端压差接近",
        titleEn: "Relay Voltage Close",
        normal: "输出接触器两端电压差≤压差设定值(默认8V)",
        abnormal: "电压差>设定值",
        steps: [
          "在Charger Status1界面查看电池电压和输出电压(模块端电压)",
          "若测量值与显示值不一致，修改电压采样系数校准: 实际电压/显示电压×当前系数=新系数",
          "检查SWD3插头第5脚和第3脚(电池电压)、第5脚和第2脚(输出电压)之间电压",
          "若无电压: 电池电压采样线接触不良",
          "若输出电压为0V: 预充回路接触不良或预充电阻/二极管损坏",
          "在Charging Parameters 3/7界面查看压差设定值(默认10V，原8V)"
        ]
      },
      condition2: {
        title: "电压启动信号置位",
        titleEn: "Voltage Start Signal",
        normal: "电池电压超过启动电压设定值(默认2V)",
        abnormal: "电池电压低于设定值",
        steps: [
          "在Charging Parameters 1/7界面查看启动电压(默认2V)",
          "测量SWD3第5脚和第3脚之间电压(电池电压)",
          "若无电压: 电池电压采样线接触不良或电池无输出",
          "若有电压: 启动电压设置偏高或电池电压异常"
        ]
      },
      condition3: {
        title: "BMS通讯启动信号置位",
        titleEn: "BMS Comm Start Signal",
        normal: "BMS允许充电机启动",
        abnormal: "BMS未发送启动报文",
        steps: [
          "检查通讯是否正常(参考CANbus电阻检查)",
          "若通讯正常但未启动: BMS未发启动报文",
          "检查通讯协议/波特率是否一致",
          "检查通讯接口是否接触良好"
        ]
      },
      condition4: {
        title: "BMS通讯信号检测到",
        titleEn: "BMS Comm Signal Detected",
        normal: "CAN协议匹配",
        abnormal: "通讯未建立",
        steps: [
          "测量CANbus终端电阻: 连接电池60Ω正常，120Ω异常",
          "检查通讯接口接触是否良好",
          "确认充电曲线(charging curve)设置正确(默认5=国标协议)"
        ]
      }
    }
  },

  // ===== 模块更换 =====
  moduleReplacement: {
    desc: "CZC7T充电机模块更换步骤：",
    descEn: "CZC7T module replacement steps:",
    steps: [
      "取下防尘网：逆时针旋拧螺丝，然后取下防尘网",
      "卸掉模块上方挡板的螺丝，顺时针打开模块上锁扣",
      "按出拉手，将模块抽出",
      "将新的模块插入原来的位置，确保模块插到位",
      "安装挡板，安装防尘网"
    ],
    stepsEn: [
      "Remove dust screen: turn screws counterclockwise, remove screen",
      "Remove baffle screws, turn lock clockwise to open",
      "Pull the handle, slide out the module",
      "Insert new module into position, ensure fully seated",
      "Install baffle and dust screen"
    ]
  },

  // ===== 软件升级 =====
  softwareUpgrade: {
    controller: {
      title: "主控程序升级 (SD卡)",
      titleEn: "Controller Program Upgrade (SD Card)",
      steps: [
        "准备一张SD卡，将卡锁位置设置在下方",
        "在SD卡根目录下新建update文件夹，将程序拷贝至该文件夹",
        "将SD卡插入卡槽，将短路帽从位置2插到位置1",
        "上电，等待十几秒后烧写完成",
        "断电，将短路帽复原，取下SD卡"
      ],
      stepsEn: [
        "Prepare SD card, set card lock to bottom position",
        "Create 'update' folder in SD card root, copy program file",
        "Insert SD card, move jumper from position 2 to position 1",
        "Power on, wait ~10 seconds for flashing to complete",
        "Power off, restore jumper, remove SD card"
      ]
    },
    hmi: {
      title: "显示程序升级 (U盘)",
      titleEn: "HMI Display Program Upgrade (USB)",
      steps: [
        "将tpcbackup.zip解压到U盘根目录",
        "将收到的压缩包解压到U盘的tpcbackup根目录下",
        "将U盘插入显示屏USB接口",
        "合上电源开关，上电后10秒左右显示U盘综合功能包界面，点击是",
        "语言包界面，选择安装包，点击用户工程下载",
        "语言包界面，选择安装包，点击开始下载",
        "下载完后关机重启"
      ],
      stepsEn: [
        "Extract tpcbackup.zip to USB drive root",
        "Extract received package to USB tpcbackup root",
        "Insert USB into HMI USB port",
        "Power on, wait ~10s for USB function pack interface, click Yes",
        "Language pack: select package, click User Project Download",
        "Language pack: select, click Start Download",
        "After download, restart"
      ]
    }
  },

  // ===== 充电参数设置 =====
  chargingParams: {
    page1: [
      { name: "恒定电压 (Constant U)", desc: "通常设为充电机规格电压 / Conventionally set to spec voltage" },
      { name: "恒定电流 (Constant I)", desc: "通常设为规格电流。现场配电不足时可减小此值限制功率 / Normally spec current; reduce if grid power insufficient" },
      { name: "启动电压 (Starting U)", desc: "默认2V。可设置最低启动电压 / Default 2V. Minimum start voltage" },
      { name: "浮充电压 (Floating U)", desc: "铅酸电池用，锂电池不用 / For lead-acid only" },
      { name: "关机电流 (Shutdown Current)", desc: "默认5A。输出电流低于此值延迟后停止 / Default 5A. Auto stop when below this" },
      { name: "充电时间 (Charging Time)", desc: "默认780分钟。超过此值自动关机 / Default 780min. Auto shutdown" }
    ],
    page2: [
      { name: "LCC", desc: "低恒流。用于加水铅酸IUIa曲线 / Low constant current for IUIa" },
      { name: "OVP (过压保护)", desc: "默认: 规格电压+2V / Default: spec V +2V" },
      { name: "OCP (过流保护)", desc: "默认: 规格电流×120% / Default: spec I ×120%" },
      { name: "充电曲线 (Charging Curve)", desc: "1:IUa 2:IUIa 3:IUUa 4:IIa 5:IUa-国标 6:IUa-EKITO 7:IUa-葡语 8:IUa-盲充" },
      { name: "语言 (Language)", desc: "中/英/法/意/西/葡 6种可选" }
    ],
    page3: [
      { name: "压差 (Voltage Diff)", desc: "默认10V(原8V)。输出接触器两侧电压差 / Default 10V (was 8V)" },
      { name: "充电枪过温 (Charging Plug OTP)", desc: "默认105°C。连接器温度传感器超过此值报故障 / Default 105°C" },
      { name: "通讯超时 (Comm Timeout)", desc: "默认50秒。通讯异常超过此值报超时故障 / Default 50s" }
    ],
    page4: [
      { name: "预约充电 (Alarm)", desc: "开启预约充电功能 / Enable scheduled charging" },
      { name: "时/分 (Hour/Minute)", desc: "设定预约充电时间 / Set scheduled time" },
      { name: "电子锁 (E-Lock)", desc: "在此界面可启用电子锁功能 / Enable electronic lock" }
    ],
    page5: [
      { name: "强制充电 (Manual Charging)", desc: "在无通讯情况下强制充锂电池（需管理员登录） / Force charge without BMS comm" }
    ]
  },

  // ===== 配电计算 =====
  powerCalculation: {
    inputCurrent: {
      title: "输入电流计算",
      titleEn: "Input Current Calculation",
      formula1: "单相: 输入电流(A) = 输出电压 × 输出电流 / 转换系数 / 输入电压",
      formula1En: "1-Phase: I = V_out × I_out / Factor / V_in",
      formula3: "三相: 输入电流(A) = 输出电压 × 输出电流 / 转换系数 / 输入电压 / √3",
      formula3En: "3-Phase: I = V_out × I_out / Factor / V_in / 1.732",
      factor: "CZC7T系列转换系数: 0.9",
      factorEn: "Conversion factor: 0.9",
      example1: "CZC7T-E30/100 单相220V: I = 30×100/0.9/220 = 15A",
      example1En: "CZC7T-E30/100 1-Phase 220V: I = 30×100/0.9/220 = 15A",
      example3: "CZC7T-D100/200 三相380V: I = 100×200/0.9/380/1.732 = 33A",
      example3En: "CZC7T-D100/200 3-Phase 380V: I = 100×200/0.9/380/1.732 = 33A"
    },
    breaker: {
      title: "断路器选型",
      titleEn: "AC Breaker Selection",
      rule: "最大输入电流 = 额定输入电流 × 1.15 × 1.2",
      ruleEn: "Max Input Current = Rated Input × 1.15 × 1.2",
      note1: "1.15 = 电网电压向下波动15%时输入电流增加15%",
      note1En: "1.15 = 15% grid voltage downward fluctuation",
      note2: "1.2 = 设计冗余",
      note2En: "1.2 = Design redundancy",
      note3: "剩余电流一般选择30mA（如需漏电保护）",
      note3En: "Residual current: 30mA (if leakage protection needed)"
    },
    cable: {
      title: "交流电缆选型",
      titleEn: "AC Cable Selection",
      note: "符合当地电缆使用规则，根据材质和敷设方式查表选择",
      noteEn: "Follow local cable regulations, select by material and installation method"
    }
  },

  // ===== 联系方式 =====
  contact: {
    company: "上海施能电器设备有限公司",
    companyEn: "Shanghai Shineng Electric Appliances Co., Ltd.",
    address: "上海市浦东新区杭头镇大麦湾工业区",
    addressEn: "Damaiwan Industrial Zone, Hangtou Town, Pudong New District, Shanghai",
    zipCode: "201323",
    sales: ["4008-883-026", "86-021-58221666"],
    fax: "86-021-58221666",
    technicalSupport: "86-13761852345",
    afterSales: "4008-883-026 (售后热线)",
    emergency: "+8613917175637",
    email: "zhoubin@shineng.com",
    website: "www.shineng.com"
  },

  repairTools: [
    "万用表 (Multi-meter)",
    "螺丝刀 (Screwdriver)",
    "直流钳形表 (DC clamp-on ammeter)",
    "绝缘电阻测试仪 (Insulation resistance tester)",
    "CAN分析仪 (CAN analyzer)"
  ],

  afterSales: {
    items: [
      { type: "保修期内", condition: "非人为损坏的设备故障", action: "免费维修/更换部件" },
      { type: "保修期外", condition: "设备超出保修期", action: "有偿维修，按实际情况报价" },
      { type: "配件供应", condition: "电源模块、控制板、风机、保险丝等", action: "联系售后采购" },
      { type: "技术支持", condition: "远程指导无法解决的问题", action: "可安排技术人员上门服务" }
    ],
    note: "所有BMS故障均发生在电池端，充电机仅显示。请联系电池供应商获取更详细的原因。"
  },

  // ===== 命名规则 =====
  namingConvention: {
    desc: "CZC7T-D100/200C 型号命名说明：",
    descEn: "CZC7T-D100/200C naming convention:",
    parts: [
      { part: "CZC7T", meaning: "CZC7T系列充电机 / CZC7T series charger" },
      { part: "D/E", meaning: "D=三相(3-phase), E=单相(1-phase)" },
      { part: "100", meaning: "电压规格(V) / Voltage specification" },
      { part: "200", meaning: "电流规格(A) / Current specification" },
      { part: "C/U/无", meaning: "C=CE认证, U=UL认证, 无=其他 / C=CE, U=UL, None=Other" }
    ],
    elitraDesc: "出口型号命名为 Li-EC1/Li-EC3 7T系列：EC1=单相, EC3=三相, 7T=高端系列, 24/36/48/72/80=电压规格, 50-300=电流规格",
    elitraDescEn: "Export models: Li-EC1/Li-EC3 7T series. EC1=single-phase, EC3=three-phase, 7T=premium, 24/36/48/72/80=voltage, 50-300=current"
  },

  // ===== 图文排查步骤 =====
  eiGuideSteps: [
    {
      step: 1,
      title: "输入电源检查",
      titleEn: "Input Power Inspection",
      desc: "测量电网电压，检查是否缺相",
      descEn: "Measure grid voltage, check for phase loss",
      keyPoints: [
        "使用万用表交流档测量三相线间电压(L1-L2, L2-L3, L1-L3)",
        "正常: AC380V，单相: AC220V",
        "检查断路器、接线端子是否松动",
        "检查输入电缆线径是否足够"
      ],
      keyPointsEn: [
        "Use multimeter AC mode to measure phase-to-phase voltage",
        "Normal: AC380V (3-phase), AC220V (1-phase)",
        "Check breaker and terminals for loose connections",
        "Verify input cable gauge is sufficient"
      ],
      images: ['troubleshootInput']
    },
    {
      step: 2,
      title: "辅助电源检查",
      titleEn: "Auxiliary Power Inspection",
      desc: "测量辅助电源输出，应为12V DC",
      descEn: "Measure auxiliary power output, should be 12V DC",
      keyPoints: [
        "使用万用表直流档测量辅助电源输出",
        "正常: DC12V",
        "若无输出: 检查是否有飞虫短路(案例1)",
        "检查防尘网是否有异物"
      ],
      keyPointsEn: [
        "Use multimeter DC mode to measure aux power output",
        "Normal: DC12V",
        "If no output: check for insect short circuit (Case 1)",
        "Check dust screen for foreign objects"
      ],
      images: ['troubleshootAux']
    },
    {
      step: 3,
      title: "CANbus电阻检查",
      titleEn: "CANbus Resistance Inspection",
      desc: "测量S+和S-之间的电阻值",
      descEn: "Measure resistance between S+ and S-",
      keyPoints: [
        "关机后测量",
        "连接电池时: 正常60Ω",
        "断开电池时: 正常120Ω",
        "若为120Ω且已连接电池: 通讯线异常"
      ],
      keyPointsEn: [
        "Measure after powering off",
        "Battery connected: 60Ω normal",
        "Battery disconnected: 120Ω normal",
        "If 120Ω with battery connected: comm cable abnormal"
      ],
      images: ['troubleshootCAN']
    },
    {
      step: 4,
      title: "启动条件检查",
      titleEn: "Start Conditions Check",
      desc: "检查4个启动条件指示灯是否全亮",
      descEn: "Check if all 4 start condition indicators are ON",
      keyPoints: [
        "进入HMI→Setting→Charger Status3",
        "条件1: 继电器两端压差接近(默认≤8V/10V)",
        "条件2: 电压启动信号(电池电压>2V)",
        "条件3: BMS通讯启动信号(BMS允许启动)",
        "条件4: BMS通讯信号(CAN协议匹配)"
      ],
      keyPointsEn: [
        "Navigate to HMI→Setting→Charger Status3",
        "Condition 1: Relay voltage close (≤8V/10V)",
        "Condition 2: Voltage start signal (battery V > 2V)",
        "Condition 3: BMS start signal (BMS allows start)",
        "Condition 4: BMS comm signal (CAN matched)"
      ],
      images: ['troubleshootStart']
    }
  ],

  // ===== 安装要求 =====
  installation: {
    site: {
      requirements: [
        "安装场所应通风良好，无腐蚀性气体",
        "安装场所应无导电尘埃和爆炸性气体",
        "避免阳光直射和雨淋",
        "安装面应平整，能承受充电机重量",
        "充电机周围应留有足够的散热空间（顶部≥200mm，侧面≥100mm）",
        "确保防尘网可方便拆卸清理"
      ],
      requirementsEn: [
        "Well-ventilated, no corrosive gases",
        "No conductive dust or explosive gases",
        "Avoid direct sunlight and rain",
        "Flat mounting surface, can bear charger weight",
        "Sufficient cooling space (top ≥200mm, sides ≥100mm)",
        "Dust screen must be easily removable for cleaning"
      ]
    },
    wiring: {
      requirements: [
        "使用符合规格的电源电缆，根据最大输入电流选择线径",
        "三相机型: 3P+E (3相+地线)，单相: 1P+N+Earth",
        "断路器额定电流应接近充电机最大输入电流",
        "输出电缆截面积需匹配充电电流",
        "CAN通讯线: S+/S-双绞屏蔽线，终端120Ω电阻",
        "所有接线必须牢固，无松动"
      ],
      requirementsEn: [
        "Use correctly rated power cables based on max input current",
        "3-phase: 3P+E, Single-phase: 1P+N+Earth",
        "Breaker rated current close to max input current",
        "Output cable gauge must match charging current",
        "CAN: S+/S- twisted shielded pair, 120Ω terminator",
        "All connections must be secure"
      ]
    }
  },

  // ===== QA条目（关键词匹配） =====
  qaEntries: [
    {
      question: "充电机连上电池后不充电，通讯灯不闪",
      questionEn: "Charger not charging after connecting battery, comm light not flashing",
      keywords: ["通讯", "不充电", "com", "不闪", "can", "通讯故障", "communication", "not charging", "comm"],
      answer: "这是通讯故障，BMS与充电机之间CAN通讯未建立。需要检查通讯线路和4个启动条件。",
      answerEn: "This is a communication fault. The CAN bus between BMS and charger is not established. Check communication circuit and 4 start conditions.",
      steps: [
        "进入HMI→Setting→Charger Status3，查看Start Signals状态指示灯",
        "关机测量S+~S-电阻：连接电池应60Ω，断开应120Ω",
        "若为120Ω（连接电池时异常）：检查CAN通讯线连接",
        "上电测量辅助电源：正常DC12V",
        "检查充电曲线(charging curve)设置：默认5=国标协议",
        "确认BMS通讯协议/波特率与充电机一致",
        "若通讯正常但BMS未发启动报文，检查协议匹配"
      ],
      stepsEn: [
        "Navigate to HMI→Setting→Charger Status3, check Start Signals",
        "Power off, measure S+/S- resistance: 60Ω connected, 120Ω disconnected",
        "If 120Ω with battery: check CAN cable connection",
        "Power on, measure aux power: normal DC12V",
        "Check charging curve setting: default 5=GB protocol",
        "Confirm BMS protocol/baud rate matches charger",
        "If comm OK but BMS doesn't start, check protocol match"
      ],
      relatedCodes: ["通讯故障"],
      images: ['troubleshootCAN', 'troubleshootStart']
    },
    {
      question: "开机屏幕不亮，无反应",
      questionEn: "Screen not lighting up, no response after power on",
      keywords: ["开机", "不亮", "屏幕", "无反应", "没反应", "screen", "not lighting", "no response", "power on"],
      answer: "可能是输入电源、断路器或辅助电源故障。按以下步骤排查。",
      answerEn: "Could be input power, breaker, or auxiliary power fault. Follow these steps.",
      steps: [
        "测量输入端电压：三相AC380V，单相AC220V",
        "检查断路器是否跳闸",
        "测量辅助电源(AC/DC模块)输出：正常DC12V",
        "若辅助电源无输出：检查是否有飞虫导致短路(案例1)",
        "检查防尘网是否有异物",
        "若辅助电源正常但屏幕不亮：可能LCD故障",
        "检查内部接线是否松动"
      ],
      stepsEn: [
        "Measure input: 3-phase AC380V, single AC220V",
        "Check if breaker has tripped",
        "Measure aux power output: normal DC12V",
        "If no output: check for insect short circuit (Case 1)",
        "Check dust screen for objects",
        "If aux OK but screen blank: LCD may be faulty",
        "Check internal wiring for loose connections"
      ],
      relatedCodes: ["输入欠压", "输入过压"],
      images: ['troubleshootInput', 'troubleshootAux']
    },
    {
      question: "模块过热或风机故障",
      questionEn: "Module over-heating or fan fault",
      keywords: ["过热", "过温", "风机", "风扇", "温度", "fan", "overheat", "temperature", "OTP"],
      answer: "模块过热保护或风机故障。需要清理防尘网、检查风机运转。",
      answerEn: "Module over-temperature or fan fault. Clean dust screen and check fan operation.",
      steps: [
        "断电等待10分钟以上让模块冷却",
        "检查并清理充电机防尘网",
        "检查模块风机是否正常运转",
        "进入HMI→Module界面查看模块工作代码",
        "若代码10(OTP): 清理散热风道",
        "若代码8(风机故障): 检查风机供电，更换风机",
        "确认充电环境通风良好，温度不超过允许范围"
      ],
      stepsEn: [
        "Power off, wait 10+ minutes for cooling",
        "Check and clean dust screen",
        "Verify module fan is running",
        "Navigate to HMI→Module to check work code",
        "If code 10 (OTP): clean air duct",
        "If code 8 (fan): check fan supply, replace fan",
        "Ensure good ventilation, temp within range"
      ],
      relatedCodes: ["模块过热"],
      images: []
    },
    {
      question: "如何设置预约充电",
      questionEn: "How to set scheduled charging",
      keywords: ["预约", "定时", "谷电", "schedule", "timed", "scheduled"],
      answer: "预约充电功能可在指定时间自动开始充电，利用谷电节省费用。",
      answerEn: "Scheduled charging auto-starts at a set time, using valley electricity to save costs.",
      steps: [
        "管理员登录: Setting→User Login→Admin→密码5656→Login",
        "设置时间: Setting→Time，确保时间A和时间B一致",
        "进入Charging Parameters 4/7，开启Alarm开关",
        "设置预约充电的时和分",
        "返回主界面，顶部显示闹钟图标表示已启用",
        "注意: 先设置预约充电，再连接电池",
        "注意: 使用预约充电时，充电机连接车辆后不要移动车辆"
      ],
      stepsEn: [
        "Admin login: Setting→User Login→Admin→password 5656",
        "Set time: Setting→Time, ensure time A matches time B",
        "Navigate to Charging Parameters 4/7, enable Alarm",
        "Set scheduled hour and minute",
        "Return to home, alarm icon indicates enabled",
        "Note: set scheduled charging before connecting battery",
        "Note: do not move vehicle after connecting"
      ],
      relatedCodes: [],
      images: []
    },
    {
      question: "如何使用强制充电功能",
      questionEn: "How to use forced charging",
      keywords: ["强制", "0V", "force", "forced", "manual charge"],
      answer: "强制充电功能可在无BMS通讯时强制充锂电池，也可用于过放电电池恢复。",
      answerEn: "Forced charging can charge lithium batteries without BMS communication, useful for over-discharged batteries.",
      steps: [
        "管理员登录: Setting→User Login→Admin→密码5656",
        "进入Charging Parameters，点击Next到page5",
        "设置Constant I(强制充电电流)和Constant U(强制充电电压)",
        "用途1: 检查充电模块和部件是否工作",
        "用途2: 电池过放电时强制充电（需电池供应商指导）"
      ],
      stepsEn: [
        "Admin login: Setting→User Login→Admin→password 5656",
        "Navigate to Charging Parameters, Next to page5",
        "Set Constant I (forced current) and Constant U (forced voltage)",
        "Use 1: verify modules and parts are working",
        "Use 2: force charge over-discharged battery (with supplier guidance)"
      ],
      relatedCodes: [],
      images: []
    },
    {
      question: "模块工作代码含义",
      questionEn: "Module work code meaning",
      keywords: ["模块", "代码", "工作代码", "module", "work code", "code"],
      answer: "进入HMI→Module界面可查看各模块工作代码。代码0-18含义如下：",
      answerEn: "Navigate to HMI→Module to check work codes. Codes 0-18 mean:",
      steps: [
        "0-待机 1-工作 2-故障 3-离线(通讯线不可靠)",
        "4-输出欠压(OUV) 5-输出过压(OOV)",
        "6-输入欠压 7-输入过压 8-风机故障",
        "9-限流 10-过温(OTP) 11-过流(OCP)",
        "12-副边故障 13-PFC故障 14-CAN故障 15-短路(OSC)",
        "16-接反 17-内部通讯故障 18-不均流",
        "查看方法: HMI→Module→查看Work Code列"
      ],
      stepsEn: [
        "0-Standby 1-Work 2-Fault 3-Offline",
        "4-OUV 5-OOV",
        "6-Input UVP 7-Input OVP 8-Fan fault",
        "9-Current limit 10-OTP 11-OCP",
        "12-Secondary 13-PFC 14-CAN 15-OSC",
        "16-Reversed 17-Intercom 18-Uneven current",
        "View: HMI→Module→check Work Code column"
      ],
      relatedCodes: [],
      images: ['faultModule1', 'faultModule2']
    },
    {
      question: "充电机型号命名规则",
      questionEn: "Charger model naming convention",
      keywords: ["型号", "命名", "model", "naming", "CZC7T", "Li-EC", "7T"],
      answer: "CZC7T系列充电机型号命名规则：CZC7T-D/E + 电压规格/电流规格 + 认证后缀。出口型号为Li-EC1/Li-EC3 7T系列。",
      answerEn: "CZC7T naming: CZC7T-D/E + Voltage/Current + Certification. Export: Li-EC1/Li-EC3 7T series.",
      steps: [
        "CZC7T: 系列名称",
        "D=三相(3-phase 380V), E=单相(1-phase 220V)",
        "数字1: 电压规格(V)，如100=100V",
        "数字2: 电流规格(A)，如200=200A",
        "后缀: C=CE认证, U=UL认证, 无=其他",
        "出口型号: Li-EC1(单相)/Li-EC3(三相) 7T + 电压/电流",
        "例: CZC7T-D100/200C = 三相380V/100V/200A/CE认证"
      ],
      stepsEn: [
        "CZC7T: Series name",
        "D=3-phase(380V), E=1-phase(220V)",
        "Number 1: Voltage spec (V), e.g., 100=100V",
        "Number 2: Current spec (A), e.g., 200=200A",
        "Suffix: C=CE, U=UL, None=Other",
        "Export: Li-EC1(1-phase)/Li-EC3(3-phase) 7T + V/I",
        "Example: CZC7T-D100/200C = 3-phase/100V/200A/CE"
      ],
      relatedCodes: [],
      images: []
    },
    {
      question: "软件升级方法",
      questionEn: "Software upgrade method",
      keywords: ["升级", "更新", "程序", "SD卡", "U盘", "upgrade", "update", "firmware", "SD card", "USB"],
      answer: "CZC7T充电机有两种软件升级方式：SD卡升级主控程序，U盘升级显示程序。",
      answerEn: "CZC7T has two upgrade methods: SD card for controller, USB for HMI display.",
      steps: [
        "【主控程序-SD卡】准备SD卡，卡锁设在下方",
        "在SD卡根目录新建update文件夹，拷入程序",
        "将SD卡插入卡槽，短路帽从位置2移到位置1",
        "上电等待约10秒烧写完成，断电复原短路帽",
        "【显示程序-U盘】将tpcbackup.zip解压到U盘根目录",
        "将升级包解压到tpcbackup目录",
        "插入U盘，上电10秒后显示U盘功能界面",
        "选择安装包，点击用户工程下载→开始下载",
        "下载完成后关机重启"
      ],
      stepsEn: [
        "[Controller-SD] Prepare SD card, lock at bottom",
        "Create 'update' folder in root, copy program",
        "Insert SD, move jumper from pos 2 to pos 1",
        "Power on, wait ~10s, power off, restore jumper",
        "[HMI-USB] Extract tpcbackup.zip to USB root",
        "Extract upgrade package to tpcbackup directory",
        "Insert USB, power on, wait ~10s for function menu",
        "Select package, click User Project Download→Start",
        "Restart after download completes"
      ],
      relatedCodes: [],
      images: []
    },
    {
      question: "模块更换步骤",
      questionEn: "Module replacement steps",
      keywords: ["更换", "模块", "换", "replace", "module", "swap"],
      answer: "CZC7T充电机电源模块更换步骤如下：",
      answerEn: "CZC7T power module replacement steps:",
      steps: [
        "取下防尘网：逆时针旋拧螺丝，取下防尘网",
        "卸掉模块上方挡板的螺丝",
        "顺时针打开模块上锁扣",
        "按出拉手，将模块抽出",
        "将新模块插入原位置，确保插到位",
        "安装挡板，安装防尘网"
      ],
      stepsEn: [
        "Remove dust screen: turn screws counterclockwise",
        "Remove baffle screws",
        "Turn lock clockwise to open",
        "Pull handle, slide out module",
        "Insert new module, ensure fully seated",
        "Install baffle and dust screen"
      ],
      relatedCodes: [],
      images: []
    },
    {
      question: "配件购买和保修政策",
      questionEn: "Parts purchase and warranty policy",
      keywords: ["配件", "购买", "保修", "售后", "parts", "warranty", "after-sales", "purchase"],
      answer: "上海施能电器设备有限公司提供配件供应和售后服务。联系售后热线4008-883-026。",
      answerEn: "Shanghai Shineng provides parts supply and after-sales service. Hotline: 4008-883-026.",
      steps: [
        "售后热线: 4008-883-026",
        "技术支持: 86-13761852345 (微信同号)",
        "邮箱: zhoubin@shineng.com",
        "网址: www.shineng.com",
        "可供应配件: 电源模块、控制板、风机、保险丝、辅助电源、触摸屏等",
        "保修期内非人为损坏免费维修/更换",
        "保修期外有偿维修，按实际情况报价",
        "可安排技术人员上门服务"
      ],
      stepsEn: [
        "After-sales hotline: 4008-883-026",
        "Technical support: 86-13761852345 (WeChat)",
        "Email: zhoubin@shineng.com",
        "Website: www.shineng.com",
        "Parts: power modules, control boards, fans, fuses, etc.",
        "In-warranty non-artificial damage: free repair",
        "Out of warranty: paid repair at actual cost",
        "On-site service available"
      ],
      relatedCodes: [],
      images: []
    }
  ],

  // ===== 默认回复 =====
  defaultReply: {
    title: "暂未匹配到相关问题",
    titleEn: "No matching result found",
    answer: "我可以帮您排查CZC7T/Elitra iON 7T系列充电机的故障。请描述故障现象（如：通讯故障、不充电、过温报警等），或直接输入故障代码/关键词。",
    answerEn: "I can help troubleshoot CZC7T/Elitra iON 7T series charger faults. Please describe the symptom (e.g., comm fault, not charging, over-temp alarm), or enter a fault code/keyword.",
    steps: [
      "您可以说：通讯故障不充电",
      "您可以说：开机屏幕不亮",
      "您可以说：模块过热/风机故障",
      "您可以说：如何设置预约充电",
      "您可以说：模块工作代码含义",
      "您可以说：模块更换步骤"
    ],
    stepsEn: [
      "You can say: communication fault not charging",
      "You can say: screen not lighting up",
      "You can say: module overheat/fan fault",
      "You can say: how to set scheduled charging",
      "You can say: module work code meaning",
      "You can say: module replacement steps"
    ]
  }
};
