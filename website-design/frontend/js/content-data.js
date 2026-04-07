/**
 * 精密仪器公司官网 - 内容数据模块
 */

const ContentData = {
  company: {
    name: "精密仪器股份有限公司",
    nameEn: "Precision Instruments Co., Ltd.",
    founded: "1998年",
    headquarters: "北京市海淀区中关村科技园区",
    employees: "800+",
    slogan: "精密测量，智造未来",
    mission: "以精密测量技术推动工业智能化升级，为客户提供高精度、高可靠性的测量解决方案",
    vision: "成为全球领先的精密测量技术解决方案提供商",
    
    history: [
      { year: "1998", event: "公司成立，专注于光学精密测量仪器研发" },
      { year: "2003", event: "推出首款自主研发的三坐标测量机，打破国外垄断" },
      { year: "2008", event: "通过ISO9001质量管理体系认证，建立现代化生产基地" },
      { year: "2012", event: "成功研发纳米级高精度位移传感器，技术达到国际先进水平" },
      { year: "2016", event: "在深圳证券交易所主板上市" },
      { year: "2019", event: "收购德国精密测量技术公司，拓展海外市场" },
      { year: "2022", event: "入选国家专精特新小巨人企业" },
      { year: "2024", event: "发布新一代AI智能测量系统，引领行业数字化转型" }
    ],
    
    advantages: [
      { title: "技术领先", icon: "tech", description: "拥有200+项专利技术，研发团队占比35%，年均研发投入超过营收的12%" },
      { title: "品质卓越", icon: "quality", description: "通过ISO9001、ISO14001认证，产品精度达到纳米级，良品率99.8%" },
      { title: "服务完善", icon: "service", description: "全国30+服务网点，7×24小时技术支持，平均响应时间2小时" },
      { title: "定制能力", icon: "custom", description: "支持非标定制开发，最快15天交付，满足客户个性化需求" }
    ],
    
    certifications: [
      { name: "ISO9001质量管理体系认证", logo: "iso9001" },
      { name: "ISO14001环境管理体系认证", logo: "iso14001" },
      { name: "国家高新技术企业", logo: "high-tech" },
      { name: "国家专精特新小巨人企业", logo: "little-giant" },
      { name: "CNAS实验室认可", logo: "cnas" },
      { name: "CE欧盟认证", logo: "ce" },
      { name: "RoHS环保认证", logo: "rohs" },
      { name: "军工保密资质", logo: "military" }
    ],
    
    stats: { products: "500+", patents: "200+", customers: "3000+", countries: "50+", serviceCenters: "30+", rAndDRatio: "12%" }
  },

  products: [
    {
      id: "cmm-001", category: "cmm", name: "CMM-3000系列三坐标测量机", subtitle: "高精度桥式三坐标测量系统",
      description: "采用花岗岩工作台和空气轴承导轨技术，配备高精度光栅尺，测量精度可达0.5μm+L/500，适用于精密零部件的尺寸、形位公差检测。",
      priceRange: "¥28万 - ¥85万", image: "assets/images/products/cmm-3000.jpg", badge: "热销", badgeColor: "hot",
      specifications: [
        { label: "测量范围", value: "500×600×400mm ~ 2000×3000×1500mm" },
        { label: "测量精度", value: "0.5μm + L/500 (ISO 10360-2)" },
        { label: "重复精度", value: "0.3μm" },
        { label: "最大承重", value: "2000kg" },
        { label: "扫描速度", value: "500mm/s" },
        { label: "分辨率", value: "0.1μm" },
        { label: "工作温度", value: "20±2℃" },
        { label: "电源要求", value: "AC 220V ±10%, 50/60Hz" }
      ],
      features: [
        "采用天然花岗岩工作台，热稳定性优异，确保长期测量精度",
        "高精度空气轴承导轨系统，摩擦系数低，运动平稳无磨损",
        "德国Heidenhain光栅尺，分辨率0.1μm，精度保持性佳",
        "Renishaw测头系统，支持触发式和扫描式测量",
        "温度补偿系统，实时监测并补偿环境温度变化",
        "PC-DMIS专业测量软件，支持CAD数模导入和自动编程",
        "气动平衡Z轴设计，操作轻便，安全性高",
        "可选配旋转工作台，实现四轴联动测量"
      ],
      applications: ["航空航天零部件精密检测", "汽车发动机缸体、变速箱壳体测量", "精密模具型腔尺寸检测", "医疗器械植入物精度验证", "电子连接器、接插件检测", "精密轴承、齿轮测量"],
      downloads: [
        { name: "产品手册", size: "5.2MB", url: "downloads/cmm-3000-brochure.pdf" },
        { name: "技术规格书", size: "2.8MB", url: "downloads/cmm-3000-specs.pdf" }
      ]
    },
    {
      id: "cmm-002", category: "cmm", name: "CMM-5000龙门式测量机", subtitle: "大型工件精密测量解决方案",
      description: "专为大型工件设计的高精度龙门式测量系统，采用双驱同步控制技术，有效消除阿贝误差，适用于风电、船舶、重型机械等行业的大型零部件检测。",
      priceRange: "¥120万 - ¥380万", image: "assets/images/products/cmm-5000.jpg", badge: "新品", badgeColor: "new",
      specifications: [
        { label: "测量范围", value: "2000×3000×1500mm ~ 5000×10000×3000mm" },
        { label: "测量精度", value: "1.2μm + L/400 (ISO 10360-2)" },
        { label: "重复精度", value: "0.8μm" },
        { label: "最大承重", value: "15000kg" },
        { label: "扫描速度", value: "400mm/s" },
        { label: "分辨率", value: "0.1μm" },
        { label: "工作温度", value: "20±2℃" },
        { label: "电源要求", value: "AC 380V ±10%, 50/60Hz" }
      ],
      features: [
        "龙门式结构设计，刚性高，抗振性能优异",
        "双驱同步控制技术，消除偏摆误差",
        "高精度气浮导轨，运动平稳，定位精准",
        "激光干涉仪补偿系统，实时修正几何误差",
        "模块化设计，可根据客户需求定制测量范围",
        "集成温度补偿功能，适应车间环境",
        "支持大型工件吊装，操作便捷",
        "可选配齿轮测量、叶片测量等专用模块"
      ],
      applications: ["风电齿轮箱、主轴轴承检测", "航空发动机大型机匣测量", "船舶推进器、舵叶精度检测", "汽车车身、覆盖件尺寸检测", "大型注塑模具、压铸模具检测", "重型机械结构件焊接件测量"],
      downloads: [
        { name: "产品手册", size: "8.5MB", url: "downloads/cmm-5000-brochure.pdf" },
        { name: "技术规格书", size: "4.2MB", url: "downloads/cmm-5000-specs.pdf" }
      ]
    },
    {
      id: "vision-001", category: "vision", name: "VisionPro-800智能影像测量仪", subtitle: "全自动2.5D精密影像测量系统",
      description: "采用高分辨率CCD相机和远心镜头，配合自动变焦和程控光源，实现复杂工件的非接触式快速测量。支持自动对焦、自动寻边、自动测量，大幅提升检测效率。",
      priceRange: "¥15万 - ¥45万", image: "assets/images/products/vision-800.jpg", badge: "热销", badgeColor: "hot",
      specifications: [
        { label: "测量范围", value: "300×200×200mm ~ 600×500×300mm" },
        { label: "测量精度", value: "(2.5+L/200)μm" },
        { label: "重复精度", value: "2μm" },
        { label: "相机分辨率", value: "1200万像素" },
        { label: "光学放大倍率", value: "20×-180×连续可调" },
        { label: "测量速度", value: "≤3秒/元素" },
        { label: "光源系统", value: "LED环形光+同轴光+轮廓光" },
        { label: "工作台承重", value: "30kg" }
      ],
      features: [
        "1200万像素高分辨率CCD，图像清晰细腻",
        "双远心镜头设计，消除透视畸变，边缘检测精准",
        "自动变焦系统，无需更换物镜即可实现倍率切换",
        "八区程控LED环形光源，适应各种表面特性",
        "自动对焦算法，快速精准锁定最佳焦面",
        "支持CAD导入，自动匹配测量程序",
        "SPC统计分析功能，实时监控过程能力",
        "支持批量测量，一键输出检测报告"
      ],
      applications: ["手机零部件尺寸检测", "PCB板、FPC软板测量", "精密冲压件、钣金件检测", "医疗器械零部件测量", "钟表零件精密检测", "半导体封装尺寸验证"],
      downloads: [
        { name: "产品手册", size: "4.8MB", url: "downloads/vision-800-brochure.pdf" },
        { name: "技术规格书", size: "2.5MB", url: "downloads/vision-800-specs.pdf" }
      ]
    },
    {
      id: "vision-002", category: "vision", name: "VisionPro-1200一键闪测仪", subtitle: "批量工件快速测量专家",
      description: "专为批量生产设计的快速影像测量设备，采用大视野双远心镜头，一次拍摄即可测量工件上所有尺寸，测量速度比传统影像仪提升10倍以上。",
      priceRange: "¥35万 - ¥68万", image: "assets/images/products/vision-1200.jpg", badge: "推荐", badgeColor: "recommend",
      specifications: [
        { label: "测量范围", value: "300×200mm (视野范围)" },
        { label: "测量精度", value: "±5μm" },
        { label: "重复精度", value: "±3μm" },
        { label: "测量效率", value: "≤1秒/件 (100个尺寸)" },
        { label: "相机分辨率", value: "2000万像素" },
        { label: "最大工件高度", value: "100mm" },
        { label: "可同时测量", value: "99个工件" },
        { label: "工作台承重", value: "10kg" }
      ],
      features: [
        "大视野双远心镜头，视野内任意位置测量精度一致",
        "2000万像素高分辨率相机，细节清晰可见",
        "一键测量，放置工件后自动识别、自动测量",
        "支持99个工件同时测量，效率提升10倍",
        "自动模板匹配，换型无需重新编程",
        "测量数据自动统计，实时SPC分析",
        "支持MES系统对接，实现数据追溯",
        "紧凑设计，适合生产线旁快速检测"
      ],
      applications: ["手机金属件批量检测", "精密螺丝、螺母全检", "连接器端子尺寸检测", "精密陶瓷件快速测量", "小型冲压件在线检测", "医疗器械零部件批量检测"],
      downloads: [
        { name: "产品手册", size: "5.2MB", url: "downloads/vision-1200-brochure.pdf" },
        { name: "技术规格书", size: "2.8MB", url: "downloads/vision-1200-specs.pdf" }
      ]
    },
    {
      id: "roughness-001", category: "roughness", name: "SurfTest-500表面粗糙度仪", subtitle: "便携式表面粗糙度测量仪",
      description: "符合ISO 4287、ISO 13565等国际标准的高精度表面粗糙度测量仪器，采用金刚石触针和压电传感器，可测量Ra、Rz、Rq、Rt等多种粗糙度参数。",
      priceRange: "¥2.8万 - ¥6.5万", image: "assets/images/products/surftest-500.jpg", badge: "热销", badgeColor: "hot",
      specifications: [
        { label: "测量范围", value: "Ra 0.025μm ~ 12.5μm" },
        { label: "示值误差", value: "≤±5%" },
        { label: "重复性", value: "≤3%" },
        { label: "取样长度", value: "0.25mm / 0.8mm / 2.5mm" },
        { label: "评定长度", value: "1L~5L可选" },
        { label: "触针半径", value: "2μm / 5μm可选" },
        { label: "测量力", value: "0.75mN / 4mN可选" },
        { label: "显示方式", value: "3.5英寸彩色触摸屏" }
      ],
      features: [
        "符合ISO 4287、ISO 13565、DIN 4768等国际标准",
        "高精度金刚石触针，耐磨性好，测量稳定",
        "压电式传感器，灵敏度高，频率响应快",
        "内置锂电池，续航8小时，适合现场测量",
        "可存储1000组测量数据，支持USB导出",
        "实时显示粗糙度轮廓曲线，直观判断加工质量",
        "支持蓝牙打印，现场输出检测报告",
        "可选配多种传感器，适应不同测量需求"
      ],
      applications: ["机械加工表面质量检测", "汽车零部件粗糙度检验", "航空航天零件表面处理验证", "模具型腔表面抛光检测", "轴承滚道表面质量评估", "医疗器械表面粗糙度检测"],
      downloads: [
        { name: "产品手册", size: "3.2MB", url: "downloads/surftest-500-brochure.pdf" },
        { name: "技术规格书", size: "1.8MB", url: "downloads/surftest-500-specs.pdf" }
      ]
    },
    {
      id: "roughness-002", category: "roughness", name: "SurfTest-800台式粗糙度仪", subtitle: "高精度台式表面粗糙度测量系统",
      description: "采用高精度直线导轨和精密驱动系统，配备专业分析软件，可实现粗糙度、波纹度、轮廓度等多参数综合测量，适用于实验室精密检测。",
      priceRange: "¥12万 - ¥28万", image: "assets/images/products/surftest-800.jpg", badge: "推荐", badgeColor: "recommend",
      specifications: [
        { label: "测量范围", value: "Ra 0.005μm ~ 16μm" },
        { label: "X轴行程", value: "100mm / 200mm可选" },
        { label: "Z轴量程", value: "±6mm / ±12mm可选" },
        { label: "示值误差", value: "≤±3%" },
        { label: "重复性", value: "≤2%" },
        { label: "分辨率", value: "0.1nm" },
        { label: "直线度", value: "0.2μm/100mm" },
        { label: "软件功能", value: "粗糙度+轮廓+波纹度" }
      ],
      features: [
        "高精度气浮直线导轨，直线度0.2μm/100mm",
        "纳米级分辨率，可测量超精加工表面",
        "集成粗糙度、轮廓、波纹度测量功能",
        "专业分析软件，支持参数自定义和报告模板",
        "自动调平功能，简化操作步骤",
        "可选配圆柱度、直线度测量模块",
        "支持CAD比对，直观显示偏差分布",
        "可连接企业MES系统，实现数据管理"
      ],
      applications: ["精密轴承滚道粗糙度检测", "光学元件表面质量评估", "精密模具表面抛光验证", "液压元件密封面检测", "汽车零部件精密检测", "计量室标准器校准"],
      downloads: [
        { name: "产品手册", size: "4.5MB", url: "downloads/surftest-800-brochure.pdf" },
        { name: "技术规格书", size: "2.8MB", url: "downloads/surftest-800-specs.pdf" }
      ]
    },
    {
      id: "hardness-001", category: "hardness", name: "HardTest-600洛氏硬度计", subtitle: "全自动洛氏硬度测试系统",
      description: "符合ASTM E18和ISO 6508标准的全自动洛氏硬度计，采用闭环力控制技术和高精度位移传感器，测试过程全自动完成，结果准确可靠。",
      priceRange: "¥4.5万 - ¥9.8万", image: "assets/images/products/hardtest-600.jpg", badge: "热销", badgeColor: "hot",
      specifications: [
        { label: "测试标尺", value: "HRA / HRB / HRC / HRD / HRF等15种" },
        { label: "初试验力", value: "29.4N (3kgf)" },
        { label: "总试验力", value: "147N/294N/441N (15/30/45kgf)" },
        { label: "示值精度", value: "±0.5HRC" },
        { label: "重复性", value: "≤0.5HRC" },
        { label: "压头规格", value: "金刚石圆锥+硬质合金球" },
        { label: "样品最大高度", value: "260mm" },
        { label: "样品最大深度", value: "150mm" }
      ],
      features: [
        "全自动测试，加载-保荷-卸载一键完成",
        "闭环力控制系统，试验力精度±0.5%",
        "高精度位移传感器，分辨率0.1μm",
        "自动转塔，标尺切换无需更换压头",
        "自动升降丝杠，适应不同高度样品",
        "硬度换算功能，支持HV/HB/HS等标尺",
        "数据存储和统计，支持SPC分析",
        "可选配XY自动移动平台，实现自动打点"
      ],
      applications: ["金属材料热处理硬度检测", "汽车零部件硬度检验", "航空航天材料硬度测试", "模具钢材硬度验证", "轴承零件硬度检测", "高校材料实验室教学科研"],
      downloads: [
        { name: "产品手册", size: "3.8MB", url: "downloads/hardtest-600-brochure.pdf" },
        { name: "技术规格书", size: "2.2MB", url: "downloads/hardtest-600-specs.pdf" }
      ]
    },
    {
      id: "hardness-002", category: "hardness", name: "HardTest-900维氏硬度计", subtitle: "数显维氏/努氏硬度测试系统",
      description: "采用精密光学系统和自动转塔技术，支持维氏和努氏两种硬度测试方法，配备自动测量软件，压痕自动识别，读数快速准确。",
      priceRange: "¥8.5万 - ¥18万", image: "assets/images/products/hardtest-900.jpg", badge: "新品", badgeColor: "new",
      specifications: [
        { label: "测试方法", value: "HV维氏 / HK努氏" },
        { label: "试验力", value: "0.098N~294N (10gf~30kgf)" },
        { label: "力值精度", value: "±1.0%" },
        { label: "物镜倍率", value: "10× / 20× / 40× / 60×" },
        { label: "测量分辨率", value: "0.01μm" },
        { label: "样品最大高度", value: "200mm" },
        { label: "样品最大深度", value: "140mm" },
        { label: "光源", value: "LED可调光源" }
      ],
      features: [
        "自动转塔，物镜和压头自动切换",
        "高分辨率光学系统，压痕清晰可见",
        "自动测量软件，压痕对角线自动识别",
        "硬度值自动计算并显示",
        "支持硬化层深度测量和曲线绘制",
        "数据可导出Excel，便于统计分析",
        "符合ASTM E92、ISO 6507等国际标准",
        "可选配全景扫描和拼接功能"
      ],
      applications: ["金属薄板和镀层硬度测试", "表面硬化层深度测量", "焊接接头硬度分布检测", "陶瓷、玻璃等脆性材料测试", "微小零件和精密部件检测", "材料科学研究分析"],
      downloads: [
        { name: "产品手册", size: "4.2MB", url: "downloads/hardtest-900-brochure.pdf" },
        { name: "技术规格书", size: "2.5MB", url: "downloads/hardtest-900-specs.pdf" }
      ]
    }
  ],

  news: [
    {
      id: "news-001",
      title: "公司荣获2024年度国家科技进步二等奖",
      summary: "我公司参与完成的项目荣获国家科技进步二等奖，标志着公司在精密测量领域的技术实力获得国家级认可。",
      content: "2024年11月，国家科学技术奖励大会在北京隆重举行。我公司参与完成的精密测量关键技术项目荣获国家科技进步二等奖。该项目突破了亚纳米级测量关键技术，打破了国外技术垄断。",
      date: "2024-11-15",
      category: "公司新闻",
      image: "assets/images/news/award-2024.jpg",
      views: 3256,
      isHot: true
    },
    {
      id: "news-002",
      title: "新一代AI智能测量系统正式发布",
      summary: "公司发布融合人工智能技术的智能测量系统，实现测量程序自动生成、缺陷智能识别、数据智能分析。",
      content: "2024年9月，公司正式发布新一代AI智能测量系统。该系统深度融合机器视觉、深度学习技术，检测效率提升50%以上，误检率降低80%。",
      date: "2024-09-20",
      category: "产品发布",
      image: "assets/images/news/ai-system.jpg",
      views: 2890,
      isHot: true
    },
    {
      id: "news-003",
      title: "公司成功入选国家级专精特新小巨人企业",
      summary: "凭借在精密测量领域的持续创新和市场表现，公司成功入选工业和信息化部第四批专精特新小巨人企业名单。",
      content: "近日，工业和信息化部公布第四批专精特新小巨人企业名单，我公司成功入选。此次入选是对公司技术创新能力和市场竞争力的充分肯定。",
      date: "2024-08-10",
      category: "公司新闻",
      image: "assets/images/news/little-giant.jpg",
      views: 2156,
      isHot: false
    },
    {
      id: "news-004",
      title: "与某知名汽车集团签订战略合作协议",
      summary: "公司与国内某知名汽车集团签订战略合作协议，将为其提供全套精密测量解决方案。",
      content: "2024年7月，公司与国内某知名汽车集团正式签订战略合作协议，将为该集团提供包括三坐标测量机、影像测量仪在内的全套精密测量解决方案。",
      date: "2024-07-25",
      category: "合作签约",
      image: "assets/images/news/partnership.jpg",
      views: 1890,
      isHot: false
    },
    {
      id: "news-005",
      title: "公司参加德国Control展，拓展海外市场",
      summary: "公司携多款新产品亮相德国Control国际质量控制与测试测量设备展。",
      content: "2024年5月，公司携CMM-5000龙门式测量机、VisionPro-1200一键闪测仪等多款新产品亮相德国斯图加特Control展，与多家欧洲客户达成合作意向。",
      date: "2024-05-18",
      category: "展会活动",
      image: "assets/images/news/control-2024.jpg",
      views: 1654,
      isHot: false
    },
    {
      id: "news-006",
      title: "公司研发中心正式投入使用",
      summary: "投资2亿元建设的研发中心正式投入使用，将进一步提升公司的自主创新能力。",
      content: "2024年3月，公司投资2亿元建设的研发中心正式投入使用。研发中心占地15000平方米，配备国际一流的研发设备和测试平台。",
      date: "2024-03-12",
      category: "公司新闻",
      image: "assets/images/news/rd-center.jpg",
      views: 1423,
      isHot: false
    }
  ],

  cases: [
    {
      id: "case-001",
      title: "某航空发动机制造企业精密检测方案",
      industry: "航空航天",
      client: "某航空发动机制造有限公司",
      products: ["CMM-5000龙门式测量机", "CMM-3000三坐标测量机"],
      challenge: "航空发动机零部件尺寸大、精度要求高，传统测量设备无法满足大型机匣、叶盘等关键部件的精密检测需求。",
      solution: "为客户提供定制化的大型龙门式测量解决方案，配备专用叶片测量模块和齿轮测量模块，实现航空发动机关键零部件的全尺寸精密检测。",
      results: [
        "测量精度提升至1.2μm，满足航空级精度要求",
        "检测效率提升60%，单件检测时间从4小时缩短至1.5小时",
        "实现100%全检，产品合格率提升至99.95%",
        "年节省检测成本约300万元"
      ],
      image: "assets/images/cases/aerospace.jpg",
      testimonial: "精密仪器公司的测量设备性能稳定、精度可靠，完全满足我们航空发动机零部件的高精度检测需求。",
      testimonialAuthor: "张总工程师",
      testimonialTitle: "质量检测中心主任",
      date: "2024-06"
    },
    {
      id: "case-002",
      title: "某新能源汽车电池壳体检测项目",
      industry: "新能源汽车",
      client: "某新能源汽车股份有限公司",
      products: ["VisionPro-1200一键闪测仪", "VisionPro-800智能影像测量仪"],
      challenge: "新能源汽车电池壳体产量大、检测项目多，传统检测方式效率低、人工成本高，无法满足大规模生产需求。",
      solution: "部署一键闪测仪进行批量快速检测，配合智能影像测量仪进行关键尺寸精密测量，构建自动化检测产线。",
      results: [
        "单件检测时间从5分钟缩短至15秒，效率提升20倍",
        "实现99个工件同时测量，满足大批量生产需求",
        "检测数据自动上传MES系统，实现全程追溯",
        "年节省人工成本约500万元"
      ],
      image: "assets/images/cases/ev-battery.jpg",
      testimonial: "一键闪测仪大幅提升了我们的检测效率，与产线无缝对接，是新能源汽车零部件批量检测的理想选择。",
      testimonialAuthor: "李经理",
      testimonialTitle: "质量部经理",
      date: "2024-05"
    },
    {
      id: "case-003",
      title: "某医疗器械企业植入物检测方案",
      industry: "医疗器械",
      client: "某医疗器械科技有限公司",
      products: ["CMM-3000三坐标测量机", "SurfTest-800台式粗糙度仪"],
      challenge: "骨科植入物表面粗糙度和尺寸精度要求极高，直接关系到患者安全和手术成功率，需要达到微米级甚至亚微米级测量精度。",
      solution: "配置高精度三坐标测量机进行尺寸和形位公差检测，配合纳米级粗糙度测量仪进行表面质量评估，建立完整的植入物质量管理体系。",
      results: [
        "尺寸测量精度达到0.5μm，满足植入物严苛要求",
        "表面粗糙度测量分辨率0.1nm，可检测超精加工表面",
        "通过FDA认证审核，产品成功进入国际市场",
        "年产能提升40%，质量投诉率降低90%"
      ],
      image: "assets/images/cases/medical.jpg",
      testimonial: "精密仪器的测量设备精度高、稳定性好，帮助我们建立了完善的植入物质量管理体系，顺利通过国际认证。",
      testimonialAuthor: "王总监",
      testimonialTitle: "质量总监",
      date: "2024-04"
    },
    {
      id: "case-004",
      title: "某风电企业大型轴承检测项目",
      industry: "风电设备",
      client: "某风电设备制造有限公司",
      products: ["CMM-5000龙门式测量机"],
      challenge: "风电主轴轴承直径达数米，重量超过10吨，对测量设备的量程和承重能力提出极高要求，且需要高精度检测齿形、滚道等复杂曲面。",
      solution: "定制超大规格龙门式测量机，配备专用齿轮测量模块和大型工件装夹系统，实现风电轴承的全尺寸精密检测。",
      results: [
        "测量范围达到5000×8000×3000mm，满足大型轴承检测需求",
        "齿轮测量精度达到DIN 2级，满足风电齿轮箱要求",
        "单次装夹完成全部检测项目，效率提升3倍",
        "年检测能力从500套提升至2000套"
      ],
      image: "assets/images/cases/wind-power.jpg",
      testimonial: "龙门式测量机解决了我们大型风电轴承的检测难题，测量精度和效率都达到了预期目标。",
      testimonialAuthor: "刘主任",
      testimonialTitle: "检测中心主任",
      date: "2024-03"
    }
  ],

  partners: [
    { name: "中国航空工业集团", logo: "aviation", industry: "航空航天" },
    { name: "中国中车", logo: "crcc", industry: "轨道交通" },
    { name: "比亚迪", logo: "byd", industry: "新能源汽车" },
    { name: "华为技术", logo: "huawei", industry: "通信设备" },
    { name: "美的集团", logo: "midea", industry: "家电制造" },
    { name: "三一重工", logo: "sany", industry: "工程机械" },
    { name: "迈瑞医疗", logo: "mindray", industry: "医疗器械" },
    { name: "金风科技", logo: "goldwind", industry: "风电设备" },
    { name: "宁德时代", logo: "catl", industry: "动力电池" },
    { name: "立讯精密", logo: "luxshare", industry: "电子制造" },
    { name: "潍柴动力", logo: "weichai", industry: "汽车零部件" },
    { name: "中国船舶", logo: "cssc", industry: "船舶制造" }
  ],

  industries: [
    { name: "航空航天", icon: "aircraft", description: "为航空发动机、机身结构件、航天器零部件提供高精度测量解决方案", products: ["CMM-5000", "CMM-3000", "VisionPro-1200"] },
    { name: "汽车制造", icon: "car", description: "覆盖发动机、变速箱、底盘、车身等汽车零部件的全尺寸检测", products: ["CMM-3000", "VisionPro-800", "HardTest-600"] },
    { name: "新能源", icon: "battery", description: "动力电池、电机、电控等新能源汽车核心部件的精密检测", products: ["VisionPro-1200", "CMM-3000", "SurfTest-500"] },
    { name: "医疗器械", icon: "medical", description: "骨科植入物、手术器械、医疗耗材的高精度测量与表面质量检测", products: ["CMM-3000", "SurfTest-800", "VisionPro-800"] },
    { name: "电子制造", icon: "chip", description: "半导体封装、PCB板、精密连接器的尺寸和外观检测", products: ["VisionPro-800", "VisionPro-1200", "CMM-3000"] },
    { name: "模具制造", icon: "mold", description: "注塑模具、压铸模具、冲压模具的型腔检测和磨损评估", products: ["CMM-3000", "SurfTest-800", "HardTest-900"] }
  ]
};

// 导出数据模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentData;
}
