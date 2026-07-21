/**
 * CZC7EI 充电机智能排查平台 - 主应用逻辑
 */

// ===== 全局状态 =====
let currentPage = 'chat';
let chatHistory = [];

// ===== 页面切换 =====
function switchPage(page) {
  currentPage = page;
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.page === page));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.dataset.page === page));

  // 延迟滚动，确保DOM已更新
  setTimeout(() => {
    const input = document.querySelector(`.page[data-page="${page}"] .chat-input`);
    if (input && page === 'chat') input.focus();
  }, 100);
}

// ===== AI 问答模块 =====

function initChat() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // 自动调整输入框高度
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  sendBtn.addEventListener('click', sendMessage);
}

function sendMessage(text) {
  const input = document.getElementById('chatInput');
  const message = text || input.value.trim();
  if (!message) return;

  // 清空输入框
  input.value = '';
  input.style.height = 'auto';

  // 隐藏欢迎页
  const welcome = document.getElementById('chatWelcome');
  if (welcome) welcome.style.display = 'none';

  // 显示用户消息
  appendMessage('user', message);

  // 匹配知识库
  const result = matchKnowledge(message);

  // 模拟思考延迟
  setTimeout(() => {
    appendMessage('bot', result.answer, result.steps, result.relatedCodes, result.title, result.images);
  }, 500);
}

function appendMessage(role, text, steps, relatedCodes, title, imageKeys) {
  const messages = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = `message ${role}`;

  const avatar = role === 'user' ? `<div class="message-avatar">${t('chatAvatarUser')}</div>` : `<div class="message-avatar">${t('chatAvatarBot')}</div>`;

  let contentHtml = '';
  if (role === 'user') {
    contentHtml = `<div class="message-content">${escapeHtml(text)}</div>`;
  } else {
    contentHtml = '<div class="message-content">';
    if (title) contentHtml += `<div class="answer-title">${escapeHtml(title)}</div>`;
    contentHtml += `<div>${escapeHtml(text)}</div>`;
    if (steps && steps.length) {
      contentHtml += '<ol>';
      steps.forEach(s => { contentHtml += `<li>${escapeHtml(s)}</li>`; });
      contentHtml += '</ol>';
    }
    if (imageKeys && imageKeys.length) {
      contentHtml += renderImageGallery(imageKeys, 'image-gallery');
    }
    if (relatedCodes && relatedCodes.length) {
      contentHtml += `<div class="related-codes"><span class="label">${t('chatRelatedCodes')}</span>`;
      relatedCodes.forEach(code => {
        const fault = getKB().faultCodes.find(f => f.code === code);
        if (fault) {
          const typeClass = getFaultTypeClass(fault.type);
          contentHtml += `<span class="code-badge ${typeClass}" onclick="showFaultDetail('${code}')">${code}</span>`;
        }
      });
      contentHtml += '</div>';
    }
    contentHtml += '</div>';
  }

  msg.innerHTML = avatar + contentHtml;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function matchKnowledge(query) {
  const q = query.toLowerCase().trim();

  // 1. 先匹配故障代码（如 E-05, F-01, C-00）
  const codeMatch = query.match(/[ecfECF]-\d{2}/i);
  if (codeMatch) {
    const code = codeMatch[0].toUpperCase();
    const fault = getKB().faultCodes.find(f => f.code === code);
    if (fault) {
      const stepsPrefix = currentLang === 'en' ? ', specific troubleshooting steps:' : '，具体排查步骤如下：';
      return {
        title: `${fault.code} - ${fault.reason}`,
        answer: fault.solution + stepsPrefix,
        steps: fault.steps,
        relatedCodes: [fault.code],
        images: fault.images || []
      };
    }
  }

  // 2. 匹配模块工作代码（如 "模块代码5" "工作代码8"）
  const moduleCodeMatch = q.match(/(?:模块|工作)?代码\s*(\d+)/) || q.match(/code\s*(\d+)/i);
  if (moduleCodeMatch) {
    const code = parseInt(moduleCodeMatch[1]);
    const module = getKB().moduleCodes.find(m => m.code === code);
    if (module) {
      const moduleTitlePrefix = currentLang === 'en' ? 'Module Work Code' : '模块工作代码';
      const moduleDescPrefix = currentLang === 'en' ? 'Module work code' : '模块工作代码';
      const moduleMeansPrefix = currentLang === 'en' ? 'means:' : '表示：';
      const queryMethod = currentLang === 'en'
        ? 'Query method: hold Info button 3 seconds, switch to [20] DC Module interface'
        : '查询方法：长按信息键3秒进入查询界面，切换到【20】DC模块界面查看';
      return {
        title: `${moduleTitlePrefix} ${code} - ${module.desc}`,
        answer: module.action,
        steps: [
          `${moduleDescPrefix} ${code} ${moduleMeansPrefix} ${module.desc}`,
          `${currentLang === 'en' ? 'Action:' : '处理方式：'} ${module.action}`,
          queryMethod
        ],
        relatedCodes: []
      };
    }
  }

  // 3. 关键词匹配 QA 条目
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of getKB().qaEntries || KNOWLEDGE_BASE.qaEntries) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += kw.length; // 长关键词权重更高
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    return {
      title: bestMatch.question,
      answer: bestMatch.answer,
      steps: bestMatch.steps,
      relatedCodes: bestMatch.relatedCodes || [],
      images: bestMatch.images || []
    };
  }

  // 4. 默认回复
  return {
    title: t('chatDefaultTitle'),
    answer: t('chatDefaultAnswer'),
    steps: t('chatDefaultSteps'),
    relatedCodes: [],
    images: []
  };
}

// ===== 快速提问 =====
function quickAsk(question) {
  sendMessage(question);
}

// ===== 故障代码模块 =====

function renderFaultCodes(filter = 'all', search = '') {
  const grid = document.getElementById('faultGrid');
  let codes = getKB().faultCodes;

  if (filter !== 'all') {
    const typeMapZh = { charger: '充电机故障', bms: 'BMS故障', battery: '电池故障' };
    const typeMapEn = { charger: 'Charger Fault', bms: 'BMS Fault', battery: 'Battery Fault' };
    const typeMap = currentLang === 'en' ? typeMapEn : typeMapZh;
    codes = codes.filter(c => c.type === typeMap[filter] || (currentLang === 'en' && typeMapZh[filter] === c.type) || (currentLang === 'zh' && typeMapEn[filter] === c.type));
  }

  if (search) {
    const s = search.toLowerCase();
    codes = codes.filter(c =>
      c.code.toLowerCase().includes(s) ||
      c.reason.toLowerCase().includes(s) ||
      c.solution.toLowerCase().includes(s)
    );
  }

  if (codes.length === 0) {
    grid.innerHTML = `<div style="text-align:center;padding:40px;color:var(--gray-400);">${t('faultNoResult')}</div>`;
    return;
  }

  grid.innerHTML = codes.map(fault => {
    const typeClass = getFaultTypeClass(fault.type);
    const sevClass = getSeverityClass(fault.severity);
    const sevText = getSeverityText(fault.severity);
    const typeName = getFaultTypeName(fault.type);
    return `
      <div class="fault-card" onclick="showFaultDetail('${fault.code}')">
        <div class="fault-card-header">
          <span class="fault-code">${fault.code}</span>
          <span class="fault-type-tag ${typeClass}">${typeName}</span>
        </div>
        <div class="fault-card-body">
          <div class="fault-reason">${fault.reason}<span class="fault-severity ${sevClass}">${sevText}</span></div>
          <div class="fault-solution">${fault.solution}</div>
        </div>
      </div>
    `;
  }).join('');
}

function initFaultPage() {
  const searchInput = document.getElementById('faultSearchInput');
  const filterChips = document.querySelectorAll('.filter-chip');

  searchInput.addEventListener('input', () => {
    const filter = document.querySelector('.filter-chip.active').dataset.filter;
    renderFaultCodes(filter, searchInput.value);
  });

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderFaultCodes(chip.dataset.filter, searchInput.value);
    });
  });
}

function showFaultDetail(code) {
  const fault = getKB().faultCodes.find(f => f.code === code);
  if (!fault) return;

  const typeClass = getFaultTypeClass(fault.type);
  const sevClass = getSeverityClass(fault.severity);
  const sevText = getSeverityText(fault.severity);
  const typeName = getFaultTypeName(fault.type);

  const overlay = document.createElement('div');
  overlay.className = 'fault-modal-overlay';
  overlay.innerHTML = `
    <div class="fault-modal">
      <div class="fault-modal-header">
        <h3>
          <span class="fault-code">${fault.code}</span>
          <span class="fault-type-tag ${typeClass}">${typeName}</span>
        </h3>
        <button class="fault-modal-close" onclick="closeFaultModal()">${t('faultModalClose')}</button>
      </div>
      <div class="fault-modal-body">
        <div class="info-row">
          <span class="info-label">${t('faultLabelReason')}</span>
          <span class="info-value">${fault.reason}</span>
        </div>
        <div class="info-row">
          <span class="info-label">${t('faultLabelSolution')}</span>
          <span class="info-value">${fault.solution}</span>
        </div>
        <div class="info-row">
          <span class="info-label">${t('faultLabelSeverity')}</span>
          <span class="info-value"><span class="fault-severity ${sevClass}">${sevText}</span></span>
        </div>
        <div class="steps-title">${t('faultStepsTitle')}</div>
        <ol>
          ${fault.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
        ${fault.images && fault.images.length ? `
          <div class="steps-title">${t('faultImagesTitle')}</div>
          ${renderImageGallery(fault.images)}
        ` : ''}
      </div>
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) closeFaultModal(); });
  document.body.appendChild(overlay);
}

function closeFaultModal() {
  const overlay = document.querySelector('.fault-modal-overlay');
  if (overlay) overlay.remove();
}

// ===== 排查向导模块 =====

const wizardSteps = [
  {
    title: '请选择故障现象',
    desc: '选择最符合您遇到的情况，我将为您生成排查方案',
    options: [
      { icon: '🔌', text: '充电机连上电池后不充电', desc: '通讯灯不闪或显示故障代码', next: 'comm' },
      { icon: '⚡', text: '充电机报故障代码', desc: '面板显示 E-xx、F-xx 或 C-00', next: 'code' },
      { icon: '🔥', text: '温度过高/过温报警', desc: '设备或电池温度异常', next: 'temp' },
      { icon: '🔇', text: '充电机开机无反应', desc: '上电后数码管不亮或无显示', next: 'power' },
      { icon: '🔧', text: '模块故障/风机异常', desc: '模块报错或风机不转', next: 'module' },
      { icon: '❓', text: '其他问题', desc: '不确定具体故障类型', next: 'general' }
    ]
  }
];

const wizardResults = {
  comm: {
    title: '通讯故障排查方案',
    images: ['panelCom', 'canSignal', 'plugPins'],
    steps: [
      '【1】观察面板com通讯指示灯——正常工作时应闪烁，不闪说明通讯未建立',
      '【2】检查CAN通讯线S+/S-连接是否牢固，无氧化、松动',
      '【3】关机测量S+~S-电阻：正常约60欧姆；断开电池时约120欧姆',
      '【4】上电测量A+~A-电压：正常DC12V左右（辅助电源供电）',
      '【5】进入【40】界面查看电池请求信息，确认BMS是否发出充电请求',
      '【6】进入【20】界面查看各模块状态是否正常',
      '【7】带充电枪机型：测CC1~PE电阻，正常约400欧姆',
      '【8】若以上正常仍无法充电，需使用CAN卡读取报文分析',
      '【9】相关故障码：E-08（通讯超时）、E-88、F-08（其他故障）'
    ]
  },
  code: {
    title: '故障代码排查指南',
    steps: [
      '【1】记录面板显示的故障代码（F-xx为BMS故障，E-xx为充电机故障，C-00为电池电压低）',
      '【2】前往「故障代码」页面输入代码查询具体原因和处理方法',
      '【3】或在AI问答中直接输入故障代码获取排查步骤',
      '【4】进入【40】界面查看电池详细信息辅助判断',
      '【5】进入【20】界面查看模块状态辅助判断',
      '【6】常见代码速查：E-05过压、E-06过流、E-08通讯超时、E-14无可控模块',
      '【7】F系列代码多为BMS端故障，建议联系电池供应商'
    ]
  },
  temp: {
    title: '过温故障排查方案',
    steps: [
      '【1】断开充电，等待10分钟以上让设备冷却',
      '【2】进入【40】界面查看电池温度1和温度2',
      '【3】F-02/F-03（连接器过温）：检查充电接口氧化、烧蚀，清洁后重连',
      '【4】F-05（电池组过温）：检查电池散热系统，确认环境通风',
      '【5】模块过温（模块代码10）：清理充电机散热风道，检查风机运转',
      '【6】风机故障（模块代码8）：检查风机供电，清理风道，必要时更换风机',
      '【7】确认充电环境温度不超过设备允许范围',
      '【8】确认充电电流未超过额定值'
    ]
  },
  power: {
    title: '开机无反应排查方案',
    images: ['powerSupply', 'externalParts'],
    steps: [
      '【1】测量输入端电压：三相机型测三相AC380V，单相机型测AC220V',
      '【2】检查断路器是否跳闸，手动复位尝试',
      '【3】检查断路器输入端：1~2之间AC220V，1~3之间AC380V',
      '【4】检查辅助电源：L~N之间AC220V，+V~-V之间DC12V',
      '【5】检查控制板三路供电：DC12V、7.9V、5V是否正常',
      '【6】若数码管亮但显示故障：进入故障界面查看故障代码',
      '【7】若供电正常但完全不亮：可能主控板故障，需联系售后',
      '【8】检查内部接线是否有松动、脱落'
    ]
  },
  module: {
    title: '模块故障排查方案',
    images: ['moduleStatus', 'powerSupply'],
    steps: [
      '【1】长按信息键3秒进入查询界面，切换到【20】DC模块界面',
      '【2】查看子模块标志（Xx格式）：x=0不在线，x=1正常，x=2异常',
      '【3】模块不在线(x=0)：检查模块供电线和CAN通讯线连接',
      '【4】模块异常(x=2)：查看模块工作代码确定原因',
      '【5】代码0-待机/1-工作/2-故障/3-通讯故障/4-输出欠压/5-输出过压',
      '【6】代码6-输入欠压/7-输入过压/8-风机故障/10-过温/11-过流',
      '【7】风机故障(8)：检查风机是否运转，清理风道，更换风机',
      '【8】模块过温(10)：清理散热风道，检查环境温度，等待降温',
      '【9】模块损坏：更换对应规格功率模块'
    ]
  },
  general: {
    title: '通用排查流程',
    steps: [
      '【1】观察故障现象：通讯灯状态、数码管显示内容、有无异响异味',
      '【2】记录故障代码：面板Err灯亮时，信息窗显示的代码',
      '【3】查询电池信息：长按信息键3秒，进入【40】界面查看电池参数',
      '【4】查询模块信息：进入【20】界面查看各模块状态和工作代码',
      '【5】测量输入供电：确认三相380V或单相220V正常',
      '【6】测量内部供电：控制板DC12V/7.9V/5V三组供电',
      '【7】测量CAN信号：S+~S-电阻约60欧姆，A+~A-电压DC12V',
      '【8】带充电枪测CC1~PE电阻：约400欧姆',
      '【9】若以上均正常但仍无法工作，联系上海施能电器设备有限公司技术支持'
    ]
  }
};

let wizardStepIndex = 0;
let wizardSelection = null;

function renderWizardStep() {
  const container = document.getElementById('wizardContent');
  const wizardOpts = currentLang === 'en' ? I18N.wizard.en.options : wizardSteps[0].options;

  if (wizardStepIndex === 0) {
    container.innerHTML = `
      <div class="wizard-step-indicator">
        <div class="step-dot active">${t('wizardStepIndicator1')}</div>
        <div class="step-line"></div>
        <div class="step-dot">${t('wizardStepIndicator2')}</div>
      </div>
      <div class="wizard-card">
        <h2>${t('wizardTitle')}</h2>
        <p class="desc">${t('wizardDesc')}</p>
        <div class="wizard-options">
          ${wizardOpts.map((opt, i) => `
            <div class="wizard-option" onclick="selectWizardOption('${opt.next}', this)">
              <span class="option-icon">${opt.icon}</span>
              <div>
                <div class="option-text">${opt.text}</div>
                <div class="option-desc">${opt.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (wizardStepIndex === 1) {
    const results = currentLang === 'en' ? I18N.wizard.en.results : wizardResults;
    const result = results[wizardSelection];
    container.innerHTML = `
      <div class="wizard-step-indicator">
        <div class="step-dot completed">${t('wizardStepIndicator1')}</div>
        <div class="step-line completed"></div>
        <div class="step-dot active">${t('wizardStepIndicator2')}</div>
      </div>
      <div class="wizard-result">
        <h2>✅ ${result.title}</h2>
        <p style="color:var(--gray-500);font-size:14px;margin-bottom:12px;">${t('wizardResultSubtitle')}</p>
        ${result.images && result.images.length ? renderImageGallery(result.images) : ''}
        <ol class="result-steps">
          ${result.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
        <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="askInChat('${result.title}')">${t('wizardBtnChat')}</button>
          <button class="btn btn-secondary" onclick="resetWizard()">${t('wizardBtnReset')}</button>
        </div>
      </div>
    `;
  }
}

function selectWizardOption(next, el) {
  document.querySelectorAll('.wizard-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  wizardSelection = next;
  setTimeout(() => {
    wizardStepIndex = 1;
    renderWizardStep();
  }, 300);
}

function resetWizard() {
  wizardStepIndex = 0;
  wizardSelection = null;
  renderWizardStep();
}

// ===== 图文排查页面 =====
function renderVisualPage() {
  const stepsContainer = document.getElementById('visualSteps');
  const gridContainer = document.getElementById('visualGrid');
  if (!stepsContainer || !gridContainer) return;

  const guideSteps = getKB().eiGuideSteps;

  // 渲染排查流程
  stepsContainer.innerHTML = guideSteps.map(guide => `
    <div class="visual-step-card">
      <div class="visual-step-num">
        ${guide.step}
        <span>${t('visualStepLabel')}</span>
      </div>
      <div class="visual-step-content">
        <h3>${guide.title}</h3>
        <p>${guide.desc}</p>
        <ul>
          ${guide.keyPoints.map(p => `<li>${p}</li>`).join('')}
        </ul>
        <div class="visual-step-images">
          ${guide.images.map(key => {
            const img = getKB().images[key];
            return `
              <div class="image-card" onclick="openLightbox('${img.src}', '${escapeHtml(img.title)}', '${escapeHtml(img.desc)}')">
                <img src="${img.src}" alt="${escapeHtml(img.title)}" loading="lazy">
                <div class="image-caption">${escapeHtml(img.title)}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // 渲染全部图片
  const images = getKB().images;
  gridContainer.innerHTML = Object.entries(images).map(([key, img]) => `
    <div class="image-card" onclick="openLightbox('${img.src}', '${escapeHtml(img.title)}', '${escapeHtml(img.desc)}')">
      <img src="${img.src}" alt="${escapeHtml(img.title)}" loading="lazy">
      <div class="image-caption">${escapeHtml(img.title)}</div>
      <div class="image-desc">${escapeHtml(img.desc)}</div>
    </div>
  `).join('');
}

function askInChat(title) {
  switchPage('chat');
  setTimeout(() => sendMessage(title), 300);
}

// ===== 知识库模块 =====

const kbSections = {
  product: () => {
    const kb = getKB();
    return `
    <h2>${tk('productTitle')}</h2>
    <p class="kb-subtitle">${tk('productSubtitle')}</p>

    <div class="kb-section">
      <h3>${tk('companyInfo')}</h3>
      <table class="info-table">
        <tr><td style="width:120px;font-weight:600;">${tk('companyNameLabel')}</td><td>${kb.product.company}</td></tr>
        <tr><td style="font-weight:600;">${tk('brandLabel')}</td><td>${kb.product.brand}（SINCE ${kb.product.since}）</td></tr>
        <tr><td style="font-weight:600;">${tk('seriesLabel')}</td><td>${kb.product.series}</td></tr>
      </table>
    </div>

    <div class="kb-section">
      <h3>${tk('productModels')}</h3>
      <table class="info-table">
        <thead><tr><th>${tk('modelLabel')}</th><th>${tk('modelDescLabel')}</th><th>${tk('modelPowerLabel')}</th></tr></thead>
        <tbody>
          ${kb.product.models.map(m => `
            <tr><td class="mono">${m.code}</td><td>${m.desc}</td><td>${m.power}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h3>${tk('productFeatures')}</h3>
      <ul class="feature-list">
        ${kb.product.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>

    <div class="kb-section">
      <h3>${tk('internalStructure')}</h3>
      <table class="info-table">
        <thead><tr><th>${tk('partNameLabel')}</th><th>${tk('partDescLabel')}</th></tr></thead>
        <tbody>
          ${kb.product.internalStructure.map(p => `
            <tr><td style="font-weight:600;">${p.name}</td><td>${p.desc}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  },

  specs: () => {
    const kb = getKB();
    return `
    <h2>${tk('specsTitle')}</h2>
    <p class="kb-subtitle">${tk('specsSubtitle')}</p>

    <div class="kb-section">
      <h3>${tk('formulaTitle')}</h3>
      <table class="info-table">
        <tr><td style="width:120px;font-weight:600;">${tk('inputPowerLabel')}</td><td>${kb.technicalSpecs.formula.inputPower}</td></tr>
        <tr><td style="font-weight:600;">${tk('singlePhaseLabel')}</td><td>${kb.technicalSpecs.formula.singlePhase}</td></tr>
        <tr><td style="font-weight:600;">${tk('threePhaseLabel')}</td><td>${kb.technicalSpecs.formula.threePhase}</td></tr>
        <tr><td style="font-weight:600;">${tk('inputCurrentLabel')}</td><td>${kb.technicalSpecs.formula.current}</td></tr>
        <tr><td style="font-weight:600;">${tk('exampleLabel')}</td><td>${kb.technicalSpecs.formula.example}</td></tr>
      </table>
      <div class="tp-note">${tk('specsNote')}</div>
    </div>

    <div class="kb-section">
      <h3>${tk('specTableTitle')}</h3>
      <table class="info-table">
        <thead>
          <tr>
            <th>${tk('specLabel')}</th><th>${tk('inputLabel')}</th><th>${tk('powerLabel')}</th><th>${tk('currentLabel')}</th>
            <th>${tk('maxCurrentLabel')}</th><th>${tk('maxVoltageLabel')}</th><th>${tk('weightLabel')}</th><th>${tk('commLabel')}</th><th>${tk('ipLabel')}</th><th>${tk('sizeLabel')}</th>
          </tr>
        </thead>
        <tbody>
          ${kb.technicalSpecs.models.map(m => `
            <tr>
              <td style="font-weight:600;">${m.spec}</td>
              <td>${m.input}</td>
              <td>${m.power}</td>
              <td>${m.current}</td>
              <td>${m.maxCurrent}</td>
              <td>${m.maxVoltage}</td>
              <td>${m.weight}</td>
              <td>${m.comm}</td>
              <td>${m.ip}</td>
              <td class="mono">${m.size}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h3>${tk('workingConditions')}</h3>
      <ul class="feature-list">
        ${kb.workingConditions.conditions.map(c => `<li>${c}</li>`).join('')}
      </ul>
      <div class="tp-note">${tk('wcWarning')}</div>
    </div>
  `;
  },

  installation: () => {
    const kb = getKB();
    return `
    <h2>${tk('installationTitle')}</h2>
    <p class="kb-subtitle">${tk('installationSubtitle')}</p>

    <div class="kb-section">
      <h3>${tk('siteRequirements')}</h3>
      ${renderImageGallery(['installationLayout'])}
      <ul class="feature-list" style="margin-top:16px;">
        ${kb.installation.site.requirements.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>

    <div class="kb-section">
      <h3>${tk('wiringRequirements')}</h3>
      <ul class="feature-list">
        ${kb.installation.wiring.requirements.map(r => `<li>${r}</li>`).join('')}
      </ul>
      <div class="tp-note">${tk('installWarning')}</div>
    </div>
  `;
  },

  panel: () => {
    const kb = getKB();
    return `
    <h2>${tk('panelTitle')}</h2>
    <p class="kb-subtitle">${tk('panelSubtitle')}</p>

    <div class="kb-section">
      <h3>${tk('bootSequence')}</h3>
      <div style="padding:16px;background:var(--gray-100);border-radius:12px;margin-bottom:12px;">
        <p style="font-weight:600;margin-bottom:12px;">${kb.panelGuide.bootSequence.desc}</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
          ${kb.panelGuide.bootSequence.steps.map((s, i) => `
            <span style="padding:6px 12px;background:#fff;border-radius:8px;font-size:14px;color:var(--gray-700);border:1px solid var(--gray-200);">
              ${i > 0 ? '→' : ''} ${s}
            </span>
          `).join('')}
        </div>
        <p style="font-size:13px;color:var(--gray-500);">${kb.panelGuide.bootSequence.note}</p>
      </div>
    </div>

    <div class="kb-section">
      <h3>${tk('keyFunctions')}</h3>
      <table class="info-table">
        <thead><tr><th>${tk('keyLabel')}</th><th>${tk('keyFuncLabel')}</th></tr></thead>
        <tbody>
          ${kb.panelGuide.keys.map(k => `
            <tr><td style="font-weight:600;">${k.name}</td><td>${k.function}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h3>${tk('indicators')}</h3>
      <table class="info-table">
        <thead><tr><th>${tk('indLabel')}</th><th>${tk('indMeaningLabel')}</th></tr></thead>
        <tbody>
          ${kb.panelGuide.indicators.map(ind => `
            <tr><td style="font-weight:600;">${ind.name}</td><td>${ind.meaning}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h3>${tk('interfaces')}</h3>
      <table class="info-table">
        <thead><tr><th>${tk('ifaceIdLabel')}</th><th>${tk('ifaceNameLabel')}</th><th>${tk('ifaceDescLabel')}</th></tr></thead>
        <tbody>
          ${kb.panelGuide.interfaces.map(i => `
            <tr><td class="mono">${i.id}</td><td style="font-weight:600;">${i.name}</td><td>${i.desc}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h3>${tk('scheduledCharging')}</h3>
      <ol style="padding-left:20px;">
        ${kb.scheduledCharging.steps.map((s, i) => `<li style="margin-bottom:8px;font-size:14px;color:var(--gray-600);">${s}</li>`).join('')}
      </ol>
    </div>

    <div class="kb-section">
      <h3>${tk('queryMethod')}</h3>
      <ol style="padding-left:20px;">
        <li style="margin-bottom:8px;font-size:14px;color:var(--gray-600);">${currentLang === 'en' ? 'Hold "Info Button" for 3+ seconds (display shows countdown), release to enter query interface' : '长按"信息键"3秒以上（数码管显示读秒），释放后进入查询界面'}</li>
        <li style="margin-bottom:8px;font-size:14px;color:var(--gray-600);">${currentLang === 'en' ? 'Click "Start/Stop Button" to cycle through interfaces, press "Info Button" to enter' : '通过单击"启/停键"轮询各显示界面，按"信息键"进入'}</li>
        <li style="margin-bottom:8px;font-size:14px;color:var(--gray-600);">${currentLang === 'en' ? 'Items auto-rotate every few seconds; click Info Button to skip ahead' : '各界面项目每过几秒自动显示下一项，单击信息键可加速查看'}</li>
      </ol>
    </div>
  `;
  },

  detection: () => {
    const kb = getKB();
    return `
    <h2>${tk('detectionTitle')}</h2>
    <p class="kb-subtitle">${tk('detectionSubtitle')}</p>

    <div class="kb-section">
      <h3>🔍 ${kb.detectionSteps.phase1.title}</h3>
      <table class="info-table">
        <thead><tr><th style="width:40px;">#</th><th>${tk('detectionColAction')}</th><th>${tk('detectionColDesc')}</th><th>${tk('detectionColInterface')}</th></tr></thead>
        <tbody>
          ${kb.detectionSteps.phase1.steps.map((s, i) => `
            <tr>
              <td style="font-weight:600;text-align:center;">${i+1}</td>
              <td style="font-weight:600;">${s.action}</td>
              <td>${s.desc}</td>
              <td><span class="mono">${s.interface}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h3>⚡ ${kb.detectionSteps.phase2.title}</h3>
      <table class="info-table">
        <thead><tr><th style="width:40px;">#</th><th>${tk('detectionColAction')}</th><th>${tk('detectionColDesc')}</th><th>${tk('detectionColInterface')}</th></tr></thead>
        <tbody>
          ${kb.detectionSteps.phase2.steps.map((s, i) => `
            <tr>
              <td style="font-weight:600;text-align:center;">${i+1}</td>
              <td style="font-weight:600;">${s.action}</td>
              <td>${s.desc}</td>
              <td><span class="mono">${s.interface}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  },

  testpoints: () => {
    const kb = getKB();
    return `
    <h2>${tk('testpointsTitle')}</h2>
    <p class="kb-subtitle">${tk('testpointsSubtitle')}</p>

    ${kb.keyTestPoints.map(tp => `
      <div class="kb-section">
        <h3>📍 ${tp.category}</h3>
        <p style="font-size:13px;color:var(--gray-500);margin-bottom:12px;">${tk('conditionLabel')}${tp.condition}</p>
        <table class="info-table">
          <thead><tr><th>${tk('testpointColTest')}</th><th>${tk('testpointColLocation')}</th><th>${tk('testpointColNormal')}</th><th>${tk('testpointColNote')}</th></tr></thead>
          <tbody>
            ${tp.points.map(p => `
              <tr>
                <td style="font-weight:600;">${p.test}</td>
                <td class="mono">${p.location}</td>
                <td style="color:var(--success);font-weight:600;">${p.normal}</td>
                <td style="font-size:13px;color:var(--gray-500);">${p.note}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="tp-note">⚠️ ${tp.note}</div>
      </div>
    `).join('')}
  `;
  },

  modules: () => {
    const kb = getKB();
    return `
    <h2>${tk('modulesTitle')}</h2>
    <p class="kb-subtitle">${tk('modulesSubtitle')}</p>

    <div class="kb-section">
      <h3>${tk('moduleStatusTitle')}</h3>
      <table class="info-table">
        <thead><tr><th>${currentLang === 'en' ? 'Flag Format' : '标志格式'}</th><th>${currentLang === 'en' ? 'Meaning' : '含义'}</th></tr></thead>
        <tbody>
          <tr><td class="mono">X0</td><td>${currentLang === 'en' ? 'Module offline (check power and comm cables)' : '模块不在线（检查供电和通讯线）'}</td></tr>
          <tr><td class="mono">X1</td><td>${currentLang === 'en' ? 'Module online and working normally' : '模块在线且工作正常'}</td></tr>
          <tr><td class="mono">X2</td><td>${currentLang === 'en' ? 'Module online but abnormal (check work code)' : '模块在线但工作不正常（查看工作代码）'}</td></tr>
        </tbody>
      </table>
      <p style="font-size:13px;color:var(--gray-500);margin-top:8px;">${currentLang === 'en' ? 'Note: X = module address number, x = status flag' : '注：X为模块地址编号，x为状态标志'}</p>
    </div>

    <div class="kb-section">
      <h3>${tk('moduleCodeTable')}</h3>
      <table class="info-table">
        <thead><tr><th style="width:80px;">${tk('moduleCodeColCode')}</th><th>${tk('moduleCodeColDesc')}</th><th>${tk('moduleCodeColAction')}</th></tr></thead>
        <tbody>
          ${kb.moduleCodes.map(m => `
            <tr>
              <td class="mono" style="font-weight:700;font-size:16px;color:var(--primary);">${m.code}</td>
              <td style="font-weight:600;">${m.desc}</td>
              <td>${m.action}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h3>${tk('moduleQueryMethod')}</h3>
      <ol style="padding-left:20px;">
        <li style="margin-bottom:6px;font-size:14px;color:var(--gray-600);">${currentLang === 'en' ? 'After powering on, hold "Info Button" for 3+ seconds (display shows countdown)' : '充电机开机后，按住"信息键"3秒以上（数码管显示读秒）'}</li>
        <li style="margin-bottom:6px;font-size:14px;color:var(--gray-600);">${currentLang === 'en' ? 'Release to enter query interface' : '释放后进入查询界面'}</li>
        <li style="margin-bottom:6px;font-size:14px;color:var(--gray-600);">${currentLang === 'en' ? 'Click "Start/Stop Button" to cycle to interface [20]' : '单击"启/停键"轮询至界面标志【20】'}</li>
        <li style="margin-bottom:6px;font-size:14px;color:var(--gray-600);">${currentLang === 'en' ? 'Press "Info Button" to enter DC Module interface' : '按"信息键"进入DC模块界面'}</li>
        <li style="margin-bottom:6px;font-size:14px;color:var(--gray-600);">${currentLang === 'en' ? 'View submodule flags and module work codes' : '查看子模块标志和模块工作代码'}</li>
      </ol>
    </div>
  `;
  },

  tools: () => {
    const kb = getKB();
    return `
    <h2>${tk('toolsTitle')}</h2>
    <p class="kb-subtitle">${tk('toolsSubtitle')}</p>

    <div class="kb-section">
      <h3>${tk('contactInfo')}</h3>
      <table class="info-table">
        <tr><td style="width:120px;font-weight:600;">${tk('contactCompanyLabel')}</td><td>${kb.contact.company}</td></tr>
        <tr><td style="font-weight:600;">${tk('contactAddressLabel')}</td><td>${kb.contact.address}</td></tr>
        <tr><td style="font-weight:600;">${tk('contactZipLabel')}</td><td>${kb.contact.zipCode}</td></tr>
        <tr><td style="font-weight:600;">${tk('contactSalesLabel')}</td><td>${kb.contact.sales.join(' / ')}</td></tr>
        <tr><td style="font-weight:600;">${tk('contactFaxLabel')}</td><td>${kb.contact.fax}</td></tr>
        <tr><td style="font-weight:600;">${tk('contactTechLabel')}</td><td>${kb.contact.technicalSupport}</td></tr>
        <tr><td style="font-weight:600;">${tk('contactAfterSalesLabel')}</td><td>${kb.contact.afterSales}</td></tr>
        <tr><td style="font-weight:600;">${tk('contactEmergencyLabel')}</td><td>${kb.contact.emergency}</td></tr>
        <tr><td style="font-weight:600;">${tk('contactEmailLabel')}</td><td>${kb.contact.email}</td></tr>
        <tr><td style="font-weight:600;">${tk('contactWebLabel')}</td><td>${kb.contact.website}</td></tr>
      </table>
    </div>

    <div class="kb-section">
      <h3>${tk('structureImages')}</h3>
      ${renderImageGallery(['internalStructure', 'externalParts'])}
    </div>

    <div class="kb-section">
      <h3>${tk('repairToolsTitle')}</h3>
      <div style="display:flex;flex-wrap:wrap;gap:10px;">
        ${kb.repairTools.map(t => `
          <span style="padding:8px 16px;background:var(--gray-100);border-radius:8px;font-size:14px;color:var(--gray-700);">${t}</span>
        `).join('')}
      </div>
    </div>

    <div class="kb-section">
      <h3>${tk('afterSalesTitle')}</h3>
      <table class="info-table">
        <thead><tr><th style="width:120px;">${tk('afterSalesTypeLabel')}</th><th>${tk('afterSalesCondLabel')}</th><th>${tk('afterSalesActionLabel')}</th></tr></thead>
        <tbody>
          ${kb.afterSales.items.map(item => `
            <tr>
              <td style="font-weight:600;color:var(--primary);">${item.type}</td>
              <td>${item.condition}</td>
              <td>${item.action}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="tp-note">${tk('afterSalesNote')}</div>
    </div>

    <div class="kb-section">
      <h3>${tk('chargingPortTitle')}</h3>
      <p style="font-size:14px;color:var(--gray-600);line-height:1.8;">
        ${tk('chargingPortDesc')}
      </p>
    </div>
  `;
  },

  // ===== 新增：系统架构 =====
  systemArch: () => {
    const kb = getKB();
    const arch = kb.systemArchitecture;
    return `
    <h2>${tk('systemArchTitle')}</h2>
    <p class="kb-subtitle">${tk('systemArchSubtitle')}</p>

    <div class="kb-section">
      <p style="font-size:14px;color:var(--gray-600);line-height:1.8;">${arch.desc}</p>
      <table class="info-table">
        <thead><tr><th style="width:180px;">${tk('systemArchComponentLabel')}</th><th>${tk('systemArchDescLabel')}</th></tr></thead>
        <tbody>
          ${arch.components.map(c => `
            <tr><td style="font-weight:600;color:var(--primary);">${c.name}</td><td>${c.desc}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h3>🖼️ 系统框图</h3>
      ${renderImageGallery([arch.image])}
    </div>
  `;
  },

  // ===== 新增：电路设计原理 =====
  circuit: () => {
    const kb = getKB();
    const cd = kb.circuitDesign;
    return `
    <h2>${tk('circuitDesignTitle')}</h2>
    <p class="kb-subtitle">${tk('circuitDesignSubtitle')}</p>

    ${cd.sections.map(s => `
    <div class="kb-section">
      <h3>${s.name}</h3>
      <p style="font-size:14px;color:var(--gray-600);line-height:1.8;">${s.desc}</p>
      ${s.image ? renderImageGallery([s.image]) : ''}
    </div>
    `).join('')}
  `;
  },

  // ===== 新增：DIP拨码开关 =====
  dipSwitch: () => {
    const kb = getKB();
    const ds = kb.dipSwitchSettings;
    return `
    <h2>${tk('dipSwitchTitle')}</h2>
    <p class="kb-subtitle">${tk('dipSwitchSubtitle')}</p>

    <div class="kb-section">
      <p style="font-size:14px;color:var(--gray-600);line-height:1.8;">${ds.desc}</p>
      <div class="tp-note">${tk('dipSwitchNote')}</div>
    </div>
  `;
  },

  // ===== 新增：售后维修检测流程 =====
  maintenance: () => {
    const kb = getKB();
    const md = kb.maintenanceDetection;
    return `
    <h2>${tk('maintenanceDetectionTitle')}</h2>
    <p class="kb-subtitle">${tk('maintenanceDetectionSubtitle')}</p>

    <div class="kb-section">
      <p style="font-size:14px;color:var(--gray-600);line-height:1.8;">${md.desc}</p>
      ${md.steps.map(s => `
      <h4 style="margin-top:16px;color:var(--primary);">🔧 ${s.component}</h4>
      <table class="info-table">
        <thead><tr><th>${tk('maintenanceTestPointLabel')}</th><th>${tk('maintenanceNormalLabel')}</th><th>${tk('maintenanceNoteLabel')}</th></tr></thead>
        <tbody>
          ${s.testPoints.map(tp => `
            <tr><td>${tp.point}</td><td class="mono">${tp.normal}</td><td>${tp.note}</td></tr>
          `).join('')}
        </tbody>
      </table>
      `).join('')}
      <div class="tp-note">${tk('maintenanceNote')}</div>
    </div>

    <div class="kb-section">
      <h3>🖼️ 维修检测参考图</h3>
      ${renderImageGallery([md.image, 'detectionTerminal', 'electricDiagram'])}
    </div>
  `;
  },

  // ===== 新增：检测端子排线 =====
  terminal: () => {
    const kb = getKB();
    const dt = kb.detectionTerminals;
    return `
    <h2>${tk('detectionTerminalTitle')}</h2>
    <p class="kb-subtitle">${tk('detectionTerminalSubtitle')}</p>

    <div class="kb-section">
      <p style="font-size:14px;color:var(--gray-600);line-height:1.8;">${dt.desc}</p>
      <table class="info-table">
        <thead><tr><th style="width:180px;">${tk('terminalNameLabel')}</th><th>${tk('terminalIdLabel')}</th><th>${tk('terminalDescLabel')}</th></tr></thead>
        <tbody>
          ${dt.items.map(item => `
            <tr><td style="font-weight:600;color:var(--primary);">${item.name}</td><td class="mono">${item.terminals}</td><td>${item.desc}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h4 style="color:var(--primary);">📏 正常值参考</h4>
      <ul style="font-size:14px;line-height:2;">
        <li><strong>${dt.resistance.sPlusMinus}</strong></li>
        <li><strong>${dt.resistance.aPlusMinus}</strong></li>
        <li><strong>${dt.resistance.cc1PE}</strong></li>
      </ul>
    </div>

    <div class="kb-section">
      <h3>🖼️ 端子排线参考图</h3>
      ${renderImageGallery([dt.image, 'canSignal'])}
    </div>
  `;
  },

  // ===== 新增：急停开关 =====
  emergencyStop: () => {
    const kb = getKB();
    const es = kb.emergencyStop;
    return `
    <h2>${tk('emergencyStopTitle')}</h2>
    <p class="kb-subtitle">${tk('emergencyStopSubtitle')}</p>

    <div class="kb-section">
      <p style="font-size:14px;color:var(--gray-600);line-height:1.8;">${es.desc}</p>
      <ul style="font-size:14px;line-height:2;">
        ${es.operation.map(op => `<li>${op}</li>`).join('')}
      </ul>
    </div>

    <div class="kb-section">
      <h3>🖼️ 急停开关位置</h3>
      ${renderImageGallery(['externalParts'])}
    </div>
  `;
  }
};

function switchKbSection(section) {
  document.querySelectorAll('.kb-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.section === section);
  });
  const content = document.getElementById('kbContent');
  content.innerHTML = kbSections[section]();
  content.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Update KB sidebar labels =====
function updateKbSidebar() {
  const navItems = document.querySelectorAll('.kb-nav-item');
  const sectionKeys = ['kbNavProduct', 'kbNavSpecs', 'kbNavInstallation', 'kbNavPanel', 'kbNavDetection', 'kbNavTestpoints', 'kbNavModules', 'kbNavSystemArch', 'kbNavCircuit', 'kbNavDipSwitch', 'kbNavMaintenance', 'kbNavTerminal', 'kbNavEmergencyStop', 'kbNavTools'];
  navItems.forEach((item, i) => {
    if (sectionKeys[i]) item.textContent = tk(sectionKeys[i]);
  });
}

// ===== 图片展示工具 =====
function renderImageGallery(imageKeys, cssClass = 'image-gallery') {
  if (!imageKeys || imageKeys.length === 0) return '';
  const kb = getKB();
  const images = imageKeys.map(key => kb.images[key] || KNOWLEDGE_BASE.images[key]).filter(Boolean);
  if (images.length === 0) return '';

  return `
    <div class="${cssClass}">
      ${images.map(img => `
        <div class="image-card" onclick="openLightbox('${img.src}', '${escapeHtml(img.title)}', '${escapeHtml(img.desc)}')">
          <img src="${img.src}" alt="${escapeHtml(img.title)}" loading="lazy">
          <div class="image-caption">${escapeHtml(img.title)}</div>
          <div class="image-desc">${escapeHtml(img.desc)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderInlineImages(imageKeys) {
  if (!imageKeys || imageKeys.length === 0) return '';
  const kb = getKB();
  const images = imageKeys.map(key => kb.images[key] || KNOWLEDGE_BASE.images[key]).filter(Boolean);
  if (images.length === 0) return '';

  return `
    <div style="margin:12px 0;">
      ${images.map(img => `
        <img class="inline-image"
             src="${img.src}"
             alt="${escapeHtml(img.title)}"
             onclick="openLightbox('${img.src}', '${escapeHtml(img.title)}', '${escapeHtml(img.desc)}')"
             loading="lazy">
      `).join('')}
    </div>
  `;
}

function openLightbox(src, title, desc) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <img src="${src}" alt="${escapeHtml(title)}">
    <div class="lightbox-caption">${escapeHtml(title)}${desc ? ' · ' + escapeHtml(desc) : ''}</div>
    <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const overlay = document.querySelector('.lightbox-overlay');
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = '';
  }
}

// ===== 工具函数 =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  initChat();
  initFaultPage();
  renderFaultCodes();
  renderWizardStep();
  renderVisualPage();
  switchKbSection('product');
  initLanguage();
  if (typeof initVideoDiag === 'function') initVideoDiag();
});
