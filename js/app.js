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

  const avatar = role === 'user' ? '<div class="message-avatar">我</div>' : '<div class="message-avatar">AI</div>';

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
      contentHtml += '<div class="related-codes"><span class="label">相关故障码：</span>';
      relatedCodes.forEach(code => {
        const fault = KNOWLEDGE_BASE.faultCodes.find(f => f.code === code);
        if (fault) {
          const typeClass = fault.type === '充电机故障' ? 'charger' : fault.type === 'BMS故障' ? 'bms' : 'battery';
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
    const fault = KNOWLEDGE_BASE.faultCodes.find(f => f.code === code);
    if (fault) {
      return {
        title: `${fault.code} - ${fault.reason}`,
        answer: fault.solution + '，具体排查步骤如下：',
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
    const module = KNOWLEDGE_BASE.moduleCodes.find(m => m.code === code);
    if (module) {
      return {
        title: `模块工作代码 ${code} - ${module.desc}`,
        answer: module.action,
        steps: [
          `模块工作代码 ${code} 表示：${module.desc}`,
          `处理方式：${module.action}`,
          '查询方法：长按信息键3秒进入查询界面，切换到【20】DC模块界面查看'
        ],
        relatedCodes: []
      };
    }
  }

  // 3. 关键词匹配 QA 条目
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE.qaEntries) {
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
    title: '暂未找到匹配的答案',
    answer: '抱歉，我暂时无法准确回答这个问题。您可以尝试：',
    steps: [
      '直接输入故障代码（如 E-05、F-01）查询具体故障信息',
      '描述故障现象，例如"通讯灯不闪"、"充不进电"、"过温报警"',
      '前往「故障代码」页面浏览所有故障代码',
      '使用「排查向导」按步骤排查问题',
      '如需人工技术支持，请联系上海施能电器设备有限公司'
    ],
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
  let codes = KNOWLEDGE_BASE.faultCodes;

  if (filter !== 'all') {
    const typeMap = { charger: '充电机故障', bms: 'BMS故障', battery: '电池故障' };
    codes = codes.filter(c => c.type === typeMap[filter]);
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
    grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--gray-400);">未找到匹配的故障代码</div>';
    return;
  }

  grid.innerHTML = codes.map(fault => {
    const typeClass = fault.type === '充电机故障' ? 'charger' : fault.type === 'BMS故障' ? 'bms' : 'battery';
    const sevClass = fault.severity === '高' ? 'severity-high' : fault.severity === '中' ? 'severity-medium' : 'severity-low';
    const sevText = fault.severity === '高' ? '紧急' : fault.severity === '中' ? '一般' : '轻微';
    return `
      <div class="fault-card" onclick="showFaultDetail('${fault.code}')">
        <div class="fault-card-header">
          <span class="fault-code">${fault.code}</span>
          <span class="fault-type-tag ${typeClass}">${fault.type}</span>
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
  const fault = KNOWLEDGE_BASE.faultCodes.find(f => f.code === code);
  if (!fault) return;

  const typeClass = fault.type === '充电机故障' ? 'charger' : fault.type === 'BMS故障' ? 'bms' : 'battery';
  const sevClass = fault.severity === '高' ? 'severity-high' : fault.severity === '中' ? 'severity-medium' : 'severity-low';
  const sevText = fault.severity === '高' ? '紧急' : fault.severity === '中' ? '一般' : '轻微';

  const overlay = document.createElement('div');
  overlay.className = 'fault-modal-overlay';
  overlay.innerHTML = `
    <div class="fault-modal">
      <div class="fault-modal-header">
        <h3>
          <span class="fault-code">${fault.code}</span>
          <span class="fault-type-tag ${typeClass}">${fault.type}</span>
        </h3>
        <button class="fault-modal-close" onclick="closeFaultModal()">&times;</button>
      </div>
      <div class="fault-modal-body">
        <div class="info-row">
          <span class="info-label">故障原因</span>
          <span class="info-value">${fault.reason}</span>
        </div>
        <div class="info-row">
          <span class="info-label">处理方法</span>
          <span class="info-value">${fault.solution}</span>
        </div>
        <div class="info-row">
          <span class="info-label">紧急程度</span>
          <span class="info-value"><span class="fault-severity ${sevClass}">${sevText}</span></span>
        </div>
        <div class="steps-title">📋 排查步骤</div>
        <ol>
          ${fault.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
        ${fault.images && fault.images.length ? `
          <div class="steps-title">🖼️ 参考图片</div>
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

  if (wizardStepIndex === 0) {
    const step = wizardSteps[0];
    container.innerHTML = `
      <div class="wizard-step-indicator">
        <div class="step-dot active">1</div>
        <div class="step-line"></div>
        <div class="step-dot">2</div>
      </div>
      <div class="wizard-card">
        <h2>${step.title}</h2>
        <p class="desc">${step.desc}</p>
        <div class="wizard-options">
          ${step.options.map((opt, i) => `
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
    const result = wizardResults[wizardSelection];
    container.innerHTML = `
      <div class="wizard-step-indicator">
        <div class="step-dot completed">1</div>
        <div class="step-line completed"></div>
        <div class="step-dot active">2</div>
      </div>
      <div class="wizard-result">
        <h2>✅ ${result.title}</h2>
        <p style="color:var(--gray-500);font-size:14px;margin-bottom:12px;">请按以下步骤逐一排查：</p>
        ${result.images && result.images.length ? renderImageGallery(result.images) : ''}
        <ol class="result-steps">
          ${result.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
        <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="askInChat('${result.title}')">在AI问答中继续提问</button>
          <button class="btn btn-secondary" onclick="resetWizard()">重新排查</button>
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

  // 渲染5步排查流程
  stepsContainer.innerHTML = KNOWLEDGE_BASE.eiGuideSteps.map(guide => `
    <div class="visual-step-card">
      <div class="visual-step-num">
        ${guide.step}
        <span>STEP</span>
      </div>
      <div class="visual-step-content">
        <h3>${guide.title}</h3>
        <p>${guide.desc}</p>
        <ul>
          ${guide.keyPoints.map(p => `<li>${p}</li>`).join('')}
        </ul>
        <div class="visual-step-images">
          ${guide.images.map(key => {
            const img = KNOWLEDGE_BASE.images[key];
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
  gridContainer.innerHTML = Object.entries(KNOWLEDGE_BASE.images).map(([key, img]) => `
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
  product: () => `
    <h2>产品概述</h2>
    <p class="kb-subtitle">${KNOWLEDGE_BASE.product.company} | ${KNOWLEDGE_BASE.product.series}</p>

    <div class="kb-section">
      <h3>🏢 公司信息</h3>
      <table class="info-table">
        <tr><td style="width:120px;font-weight:600;">公司名称</td><td>${KNOWLEDGE_BASE.product.company}</td></tr>
        <tr><td style="font-weight:600;">品牌</td><td>${KNOWLEDGE_BASE.product.brand}（SINCE ${KNOWLEDGE_BASE.product.since}）</td></tr>
        <tr><td style="font-weight:600;">产品系列</td><td>${KNOWLEDGE_BASE.product.series}</td></tr>
      </table>
    </div>

    <div class="kb-section">
      <h3>📋 产品型号</h3>
      <table class="info-table">
        <thead><tr><th>型号</th><th>说明</th><th>功率</th></tr></thead>
        <tbody>
          ${KNOWLEDGE_BASE.product.models.map(m => `
            <tr><td class="mono">${m.code}</td><td>${m.desc}</td><td>${m.power}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h3>✨ 功能特点</h3>
      <ul class="feature-list">
        ${KNOWLEDGE_BASE.product.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>

    <div class="kb-section">
      <h3>🔧 内部结构</h3>
      <table class="info-table">
        <thead><tr><th>部件名称</th><th>说明</th></tr></thead>
        <tbody>
          ${KNOWLEDGE_BASE.product.internalStructure.map(p => `
            <tr><td style="font-weight:600;">${p.name}</td><td>${p.desc}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `,

  specs: () => `
    <h2>主要技术参数</h2>
    <p class="kb-subtitle">CZC7EI系列智能充电机规格表（特殊规格可定制）</p>

    <div class="kb-section">
      <h3>📐 功率与电流计算公式</h3>
      <table class="info-table">
        <tr><td style="width:120px;font-weight:600;">输入功率</td><td>${KNOWLEDGE_BASE.technicalSpecs.formula.inputPower}</td></tr>
        <tr><td style="font-weight:600;">单相/两相</td><td>${KNOWLEDGE_BASE.technicalSpecs.formula.singlePhase}</td></tr>
        <tr><td style="font-weight:600;">三相</td><td>${KNOWLEDGE_BASE.technicalSpecs.formula.threePhase}</td></tr>
        <tr><td style="font-weight:600;">输入电流</td><td>${KNOWLEDGE_BASE.technicalSpecs.formula.current}</td></tr>
        <tr><td style="font-weight:600;">计算示例</td><td>${KNOWLEDGE_BASE.technicalSpecs.formula.example}</td></tr>
      </table>
      <div class="tp-note">💡 ${KNOWLEDGE_BASE.technicalSpecs.note}</div>
    </div>

    <div class="kb-section">
      <h3>📋 常规规格表</h3>
      <table class="info-table">
        <thead>
          <tr>
            <th>规格</th><th>额定输入</th><th>功率</th><th>输入电流</th>
            <th>最大输出电流</th><th>最大输出电压</th><th>净重</th><th>通讯</th><th>防护</th><th>外形尺寸</th>
          </tr>
        </thead>
        <tbody>
          ${KNOWLEDGE_BASE.technicalSpecs.models.map(m => `
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
      <h3>🌡️ 正常工作条件</h3>
      <ul class="feature-list">
        ${KNOWLEDGE_BASE.workingConditions.conditions.map(c => `<li>${c}</li>`).join('')}
      </ul>
      <div class="tp-note">⚠️ ${KNOWLEDGE_BASE.workingConditions.warning}</div>
    </div>
  `,

  installation: () => `
    <h2>安装要求</h2>
    <p class="kb-subtitle">CZC7EI充电机安装场所布置与接线要求</p>

    <div class="kb-section">
      <h3>🏠 充电场所布置要求</h3>
      ${renderImageGallery(['installationLayout'])}
      <ul class="feature-list" style="margin-top:16px;">
        ${KNOWLEDGE_BASE.installation.site.requirements.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>

    <div class="kb-section">
      <h3>🔌 输入/输出线连接要求</h3>
      <ul class="feature-list">
        ${KNOWLEDGE_BASE.installation.wiring.requirements.map(r => `<li>${r}</li>`).join('')}
      </ul>
      <div class="tp-note">⚠️ ${KNOWLEDGE_BASE.installation.warning}</div>
    </div>
  `,

  panel: () => `
    <h2>面板操作指南</h2>
    <p class="kb-subtitle">CZC7EI充电机面板按键、指示灯及显示界面说明</p>

    <div class="kb-section">
      <h3>⚡ 上电显示流程</h3>
      <div style="padding:16px;background:var(--gray-100);border-radius:12px;margin-bottom:12px;">
        <p style="font-weight:600;margin-bottom:12px;">${KNOWLEDGE_BASE.panelGuide.bootSequence.desc}</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
          ${KNOWLEDGE_BASE.panelGuide.bootSequence.steps.map((s, i) => `
            <span style="padding:6px 12px;background:#fff;border-radius:8px;font-size:14px;color:var(--gray-700);border:1px solid var(--gray-200);">
              ${i > 0 ? '→' : ''} ${s}
            </span>
          `).join('')}
        </div>
        <p style="font-size:13px;color:var(--gray-500);">${KNOWLEDGE_BASE.panelGuide.bootSequence.note}</p>
      </div>
    </div>

    <div class="kb-section">
      <h3>🔘 按键功能</h3>
      <table class="info-table">
        <thead><tr><th>按键</th><th>功能</th></tr></thead>
        <tbody>
          ${KNOWLEDGE_BASE.panelGuide.keys.map(k => `
            <tr><td style="font-weight:600;">${k.name}</td><td>${k.function}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h3>💡 指示灯说明</h3>
      <table class="info-table">
        <thead><tr><th>指示灯</th><th>含义</th></tr></thead>
        <tbody>
          ${KNOWLEDGE_BASE.panelGuide.indicators.map(ind => `
            <tr><td style="font-weight:600;">${ind.name}</td><td>${ind.meaning}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h3>📱 显示界面</h3>
      <table class="info-table">
        <thead><tr><th>界面标志</th><th>名称</th><th>显示内容</th></tr></thead>
        <tbody>
          ${KNOWLEDGE_BASE.panelGuide.interfaces.map(i => `
            <tr><td class="mono">${i.id}</td><td style="font-weight:600;">${i.name}</td><td>${i.desc}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="kb-section">
      <h3>⏰ 预约充电操作</h3>
      <ol style="padding-left:20px;">
        ${KNOWLEDGE_BASE.scheduledCharging.steps.map((s, i) => `<li style="margin-bottom:8px;font-size:14px;color:var(--gray-600);">${s}</li>`).join('')}
      </ol>
    </div>

    <div class="kb-section">
      <h3>🔍 信息查询方法</h3>
      <ol style="padding-left:20px;">
        <li style="margin-bottom:8px;font-size:14px;color:var(--gray-600);">长按"信息键"3秒以上（数码管显示读秒），释放后进入查询界面</li>
        <li style="margin-bottom:8px;font-size:14px;color:var(--gray-600);">通过单击"启/停键"轮询各显示界面，按"信息键"进入</li>
        <li style="margin-bottom:8px;font-size:14px;color:var(--gray-600);">各界面项目每过几秒自动显示下一项，单击信息键可加速查看</li>
      </ol>
    </div>
  `,

  detection: () => `
    <h2>故障检测流程</h2>
    <p class="kb-subtitle">充电机故障的标准检测步骤</p>

    <div class="kb-section">
      <h3>🔍 ${KNOWLEDGE_BASE.detectionSteps.phase1.title}</h3>
      <table class="info-table">
        <thead><tr><th style="width:40px;">#</th><th>操作</th><th>说明</th><th>查看位置</th></tr></thead>
        <tbody>
          ${KNOWLEDGE_BASE.detectionSteps.phase1.steps.map((s, i) => `
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
      <h3>⚡ ${KNOWLEDGE_BASE.detectionSteps.phase2.title}</h3>
      <table class="info-table">
        <thead><tr><th style="width:40px;">#</th><th>操作</th><th>说明</th><th>查看位置</th></tr></thead>
        <tbody>
          ${KNOWLEDGE_BASE.detectionSteps.phase2.steps.map((s, i) => `
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
  `,

  testpoints: () => `
    <h2>重点检测部位</h2>
    <p class="kb-subtitle">充电机关键测点的正常值与检测条件</p>

    ${KNOWLEDGE_BASE.keyTestPoints.map(tp => `
      <div class="kb-section">
        <h3>📍 ${tp.category}</h3>
        <p style="font-size:13px;color:var(--gray-500);margin-bottom:12px;">检测条件：${tp.condition}</p>
        <table class="info-table">
          <thead><tr><th>检测项目</th><th>检测位置</th><th>正常值</th><th>备注</th></tr></thead>
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
  `,

  modules: () => `
    <h2>模块工作代码</h2>
    <p class="kb-subtitle">DC模块工作状态代码含义及处理方法（在【20】界面查看）</p>

    <div class="kb-section">
      <h3>📊 模块状态标志说明</h3>
      <table class="info-table">
        <thead><tr><th>标志格式</th><th>含义</th></tr></thead>
        <tbody>
          <tr><td class="mono">X0</td><td>模块不在线（检查供电和通讯线）</td></tr>
          <tr><td class="mono">X1</td><td>模块在线且工作正常</td></tr>
          <tr><td class="mono">X2</td><td>模块在线但工作不正常（查看工作代码）</td></tr>
        </tbody>
      </table>
      <p style="font-size:13px;color:var(--gray-500);margin-top:8px;">注：X为模块地址编号，x为状态标志</p>
    </div>

    <div class="kb-section">
      <h3>📋 工作代码表</h3>
      <table class="info-table">
        <thead><tr><th style="width:80px;">代码</th><th>状态描述</th><th>处理方法</th></tr></thead>
        <tbody>
          ${KNOWLEDGE_BASE.moduleCodes.map(m => `
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
      <h3>🔧 查询方法</h3>
      <ol style="padding-left:20px;">
        <li style="margin-bottom:6px;font-size:14px;color:var(--gray-600);">充电机开机后，按住"信息键"3秒以上（数码管显示读秒）</li>
        <li style="margin-bottom:6px;font-size:14px;color:var(--gray-600);">释放后进入查询界面</li>
        <li style="margin-bottom:6px;font-size:14px;color:var(--gray-600);">单击"启/停键"轮询至界面标志【20】</li>
        <li style="margin-bottom:6px;font-size:14px;color:var(--gray-600);">按"信息键"进入DC模块界面</li>
        <li style="margin-bottom:6px;font-size:14px;color:var(--gray-600);">查看子模块标志和模块工作代码</li>
      </ol>
    </div>
  `,

  tools: () => `
    <h2>检修工具与售后</h2>
    <p class="kb-subtitle">检修所需工具、售后政策及联系方式</p>

    <div class="kb-section">
      <h3>🏢 售后联系信息</h3>
      <table class="info-table">
        <tr><td style="width:120px;font-weight:600;">公司名称</td><td>${KNOWLEDGE_BASE.contact.company}</td></tr>
        <tr><td style="font-weight:600;">地址</td><td>${KNOWLEDGE_BASE.contact.address}</td></tr>
        <tr><td style="font-weight:600;">邮编</td><td>${KNOWLEDGE_BASE.contact.zipCode}</td></tr>
        <tr><td style="font-weight:600;">销售</td><td>${KNOWLEDGE_BASE.contact.sales.join(' / ')}</td></tr>
        <tr><td style="font-weight:600;">传真</td><td>${KNOWLEDGE_BASE.contact.fax}</td></tr>
        <tr><td style="font-weight:600;">技术支持</td><td>${KNOWLEDGE_BASE.contact.technicalSupport}</td></tr>
        <tr><td style="font-weight:600;">售后服务</td><td>${KNOWLEDGE_BASE.contact.afterSales}</td></tr>
        <tr><td style="font-weight:600;">应急/投诉</td><td>${KNOWLEDGE_BASE.contact.emergency}</td></tr>
        <tr><td style="font-weight:600;">邮箱</td><td>${KNOWLEDGE_BASE.contact.email}</td></tr>
        <tr><td style="font-weight:600;">网址</td><td>${KNOWLEDGE_BASE.contact.website}</td></tr>
      </table>
    </div>

    <div class="kb-section">
      <h3>🖼️ 整机结构与关键部件</h3>
      ${renderImageGallery(['internalStructure', 'externalParts'])}
    </div>

    <div class="kb-section">
      <h3>🛠️ 检修常用工具</h3>
      <div style="display:flex;flex-wrap:wrap;gap:10px;">
        ${KNOWLEDGE_BASE.repairTools.map(t => `
          <span style="padding:8px 16px;background:var(--gray-100);border-radius:8px;font-size:14px;color:var(--gray-700);">${t}</span>
        `).join('')}
      </div>
    </div>

    <div class="kb-section">
      <h3>📦 ${KNOWLEDGE_BASE.afterSales.title}</h3>
      <table class="info-table">
        <thead><tr><th style="width:120px;">类型</th><th>适用条件</th><th>处理方式</th></tr></thead>
        <tbody>
          ${KNOWLEDGE_BASE.afterSales.items.map(item => `
            <tr>
              <td style="font-weight:600;color:var(--primary);">${item.type}</td>
              <td>${item.condition}</td>
              <td>${item.action}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="tp-note">📋 ${KNOWLEDGE_BASE.afterSales.requirement}</div>
    </div>

    <div class="kb-section">
      <h3>🔌 充电口定义</h3>
      <p style="font-size:14px;color:var(--gray-600);line-height:1.8;">
        CZC7EI充电机配备REMA（公/母）和国标直流充电枪接口，匹配杭叉国标锂电池。<br>
        充电口定义需根据具体机型和电池型号确认，安装时请参考设备铭牌和接口标识。
      </p>
    </div>
  `
};

function switchKbSection(section) {
  document.querySelectorAll('.kb-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.section === section);
  });
  const content = document.getElementById('kbContent');
  content.innerHTML = kbSections[section]();
  content.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== 图片展示工具 =====
function renderImageGallery(imageKeys, cssClass = 'image-gallery') {
  if (!imageKeys || imageKeys.length === 0) return '';
  const images = imageKeys.map(key => KNOWLEDGE_BASE.images[key]).filter(Boolean);
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
  const images = imageKeys.map(key => KNOWLEDGE_BASE.images[key]).filter(Boolean);
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
});
