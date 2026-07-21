/**
 * CZC7EI 充电机智能排查平台 - 视频故障诊断模块
 * 纯浏览器端实现：视频帧提取 + LED颜色分析 + Tesseract.js OCR + 知识库匹配
 * v2.0 - 修复进度条不显示、帧标题不显示、seek超时、OCR加载检测等问题
 */

// ===== 视频诊断状态 =====
let videoDiagState = {
  videoFile: null,
  videoUrl: null,
  videoDuration: 0,
  frames: [],
  analysisResults: [],
  detectedCodes: [],
  ledStatus: 'unknown',
  isAnalyzing: false,
  progress: 0
};

// ===== 故障代码正则匹配 =====
const FAULT_CODE_REGEX = /[ECF]-\d{2}/gi;

// ===== 初始化视频诊断页面 =====
function initVideoDiag() {
  const dropZone = document.getElementById('videoDropZone');
  const fileInput = document.getElementById('videoFileInput');
  const analyzeBtn = document.getElementById('videoAnalyzeBtn');
  const resetBtn = document.getElementById('videoResetBtn');

  if (!dropZone) return;

  // 拖拽事件
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      handleVideoFile(file);
    } else {
      alert(currentLang === 'en' ? 'Please upload a video file' : '请上传视频文件');
    }
  });

  // 点击上传
  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) handleVideoFile(file);
  });

  // 分析按钮
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', startVideoAnalysis);
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', resetVideoDiag);
  }
}

// ===== 处理视频文件 =====
function handleVideoFile(file) {
  videoDiagState.videoFile = file;
  videoDiagState.videoUrl = URL.createObjectURL(file);

  const video = document.getElementById('videoPreview');
  video.src = videoDiagState.videoUrl;
  video.style.display = 'block';

  video.onloadedmetadata = () => {
    videoDiagState.videoDuration = video.duration;
    document.getElementById('videoAnalyzeBtn').disabled = false;
    const info = document.getElementById('videoInfo');
    info.style.display = 'block';
    info.innerHTML = `
      <div>${vdText('fileLabel')}: ${escapeHtml(file.name)}</div>
      <div>${vdText('durationLabel')}: ${video.duration.toFixed(1)}s</div>
      <div>${vdText('sizeLabel')}: ${(file.size / 1024 / 1024).toFixed(1)} MB</div>
    `;
  };

  // 视频加载失败处理
  video.onerror = () => {
    alert(currentLang === 'en'
      ? 'Failed to load video. The format may not be supported by your browser. Please try MP4 (H.264) or WebM format.'
      : '视频加载失败，可能是格式不被浏览器支持。请尝试 MP4 (H.264) 或 WebM 格式。');
    resetVideoDiag();
  };

  document.getElementById('videoDropZone').style.display = 'none';
  document.getElementById('videoControls').style.display = 'flex';
}

// ===== 开始视频分析 =====
async function startVideoAnalysis() {
  if (videoDiagState.isAnalyzing) return;
  videoDiagState.isAnalyzing = true;
  videoDiagState.frames = [];
  videoDiagState.analysisResults = [];
  videoDiagState.detectedCodes = [];
  videoDiagState.ledStatus = 'unknown';
  videoDiagState.progress = 0;

  const analyzeBtn = document.getElementById('videoAnalyzeBtn');
  const resetBtn = document.getElementById('videoResetBtn');
  const video = document.getElementById('videoPreview');
  const progressContainer = document.querySelector('.video-progress-container');
  const progressBar = document.getElementById('videoProgress');
  const progressText = document.getElementById('videoProgressText');
  const framesTitle = document.getElementById('videoFramesTitle');
  const framesContainer = document.getElementById('videoFrames');
  const resultsContainer = document.getElementById('videoResults');

  // 禁用按钮，显示分析中状态
  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = currentLang === 'en' ? '⏳ Analyzing...' : '⏳ 分析中...';
  resetBtn.disabled = true;

  // [BUG FIX] 显示进度条容器（之前只显示了内部元素，容器本身display:none未移除）
  if (progressContainer) progressContainer.style.display = 'block';
  progressBar.style.display = 'block';
  progressText.style.display = 'block';
  progressBar.value = 0;
  progressText.textContent = vdText('analyzingProgress') + ' 0%';

  // [BUG FIX] 显示帧标题
  if (framesTitle) framesTitle.style.display = 'block';
  framesContainer.innerHTML = '';
  resultsContainer.innerHTML = '';

  try {
    // 检查视频是否已加载
    if (!video.videoWidth || !video.videoHeight) {
      throw new Error(currentLang === 'en' ? 'Video not fully loaded yet, please wait and try again' : '视频尚未完全加载，请稍等后重试');
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 设置canvas尺寸（缩小以加速处理）
    const targetWidth = 640;
    const scale = targetWidth / video.videoWidth;
    canvas.width = targetWidth;
    canvas.height = Math.round(video.videoHeight * scale);

    // 每隔1秒提取一帧
    const interval = 1.0;
    const totalFrames = Math.max(1, Math.floor(videoDiagState.videoDuration / interval));

    for (let i = 0; i <= totalFrames; i++) {
      const time = Math.min(i * interval, Math.max(0, videoDiagState.videoDuration - 0.1));

      // 更新进度
      videoDiagState.progress = Math.round((i / totalFrames) * 80); // 帧提取占80%
      progressBar.value = videoDiagState.progress;
      progressText.textContent = vdText('analyzingProgress') + ` ${videoDiagState.progress}%`;

      // [BUG FIX] 跳转到指定时间（带超时机制，防止seeked事件不触发导致挂起）
      await seekToTime(video, time);

      // 提取帧到canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 分析LED颜色
      const ledResult = analyzeLEDColors(ctx, canvas.width, canvas.height);

      // 保存帧（每隔几帧保存一次缩略图以节省内存）
      let frameData = null;
      if (i % 2 === 0 || ledResult.redRatio > 0.01 || ledResult.greenRatio > 0.01) {
        frameData = canvas.toDataURL('image/jpeg', 0.6);
      }

      const frameInfo = {
        index: i,
        time: time,
        led: ledResult,
        imageData: frameData
      };
      videoDiagState.analysisResults.push(frameInfo);

      // 更新LED状态
      if (ledResult.redRatio > 0.02 && videoDiagState.ledStatus !== 'red') {
        videoDiagState.ledStatus = 'red';
      } else if (ledResult.greenRatio > 0.02 && videoDiagState.ledStatus === 'unknown') {
        videoDiagState.ledStatus = 'green';
      }

      // 显示帧缩略图
      if (frameData) {
        const frameDiv = document.createElement('div');
        frameDiv.className = 'video-frame-thumb';
        const ledColor = ledResult.redRatio > 0.02 ? 'red' : ledResult.greenRatio > 0.02 ? 'green' : 'none';
        const ledLabel = ledColor === 'red' ? (currentLang === 'en' ? 'Fault LED' : '故障灯') :
                         ledColor === 'green' ? (currentLang === 'en' ? 'Normal LED' : '正常灯') : '';
        frameDiv.innerHTML = `
          <img src="${frameData}" alt="Frame ${i}" loading="lazy">
          <div class="frame-info">
            <span class="frame-time">${time.toFixed(1)}s</span>
            ${ledLabel ? `<span class="frame-led led-${ledColor}">${ledLabel}</span>` : ''}
          </div>
        `;
        frameDiv.onclick = () => openLightbox(frameData, `Frame ${i} - ${time.toFixed(1)}s`, ledLabel);
        framesContainer.appendChild(frameDiv);
      }

      // 让UI有机会更新
      await sleep(10);
    }

    // 对关键帧进行OCR识别（选取红色LED最明显的帧）
    progressBar.value = 85;
    progressText.textContent = vdText('ocrProgress');

    const redFrames = videoDiagState.analysisResults
      .filter(f => f.led.redRatio > 0.01 && f.imageData)
      .sort((a, b) => b.led.redRatio - a.led.redRatio)
      .slice(0, 5);

    if (redFrames.length === 0) {
      // 没有红色LED帧，取中间几帧
      const mid = Math.floor(videoDiagState.analysisResults.length / 2);
      const sampleFrames = videoDiagState.analysisResults
        .filter(f => f.imageData)
        .slice(Math.max(0, mid - 2), mid + 3);
      for (const frame of sampleFrames) {
        await ocrFrame(frame);
        progressBar.value = Math.min(95, progressBar.value + 2);
      }
    } else {
      for (const frame of redFrames) {
        await ocrFrame(frame);
        progressBar.value = Math.min(95, progressBar.value + 2);
      }
    }

    // 生成诊断报告
    videoDiagState.progress = 100;
    progressBar.value = 100;
    progressText.textContent = vdText('analysisComplete');

    renderDiagnosisReport();

  } catch (err) {
    console.error('Video analysis error:', err);
    progressText.textContent = '';
    resultsContainer.innerHTML = `
      <div class="diag-alert diag-alert-danger">
        <div class="diag-alert-icon">⚠️</div>
        <div>
          <h3>${currentLang === 'en' ? 'Analysis Error' : '分析出错'}</h3>
          <p>${escapeHtml(err.message || String(err))}</p>
        </div>
      </div>
    `;
  } finally {
    videoDiagState.isAnalyzing = false;
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = currentLang === 'en' ? '🔍 Start Analysis' : '🔍 开始分析';
    resetBtn.disabled = false;
  }
}

// ===== 跳转到指定时间（带超时保护） =====
function seekToTime(video, time) {
  return new Promise((resolve) => {
    let resolved = false;

    const cleanup = () => {
      video.removeEventListener('seeked', onSeeked);
      clearTimeout(timeoutId);
    };

    const onSeeked = () => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve();
    };

    // [BUG FIX] 超时保护：如果3秒内seeked事件未触发，直接继续
    const timeoutId = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve();
    }, 3000);

    video.addEventListener('seeked', onSeeked);

    try {
      video.currentTime = time;
      // 如果时间已经是0且设置相同值，可能不会触发seeked
      if (time === 0 && Math.abs(video.currentTime - 0) < 0.01) {
        // 已经在0位置，直接resolve
        resolved = true;
        cleanup();
        resolve();
      }
    } catch (e) {
      resolved = true;
      cleanup();
      resolve();
    }
  });
}

// ===== sleep =====
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== LED颜色分析 =====
function analyzeLEDColors(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  let redPixels = 0;
  let greenPixels = 0;
  let yellowPixels = 0;
  let totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // 红色LED: R高, G低, B低
    if (r > 150 && g < 100 && b < 100) {
      redPixels++;
    }
    // 绿色LED: G高, R低, B低
    else if (g > 150 && r < 120 && b < 120) {
      greenPixels++;
    }
    // 黄色LED: R高, G高, B低
    else if (r > 200 && g > 180 && b < 100) {
      yellowPixels++;
    }
  }

  return {
    redRatio: redPixels / totalPixels,
    greenRatio: greenPixels / totalPixels,
    yellowRatio: yellowPixels / totalPixels,
    redPixels,
    greenPixels,
    yellowPixels,
    totalPixels
  };
}

// ===== OCR识别帧 =====
async function ocrFrame(frame) {
  if (!frame.imageData) return;

  // [BUG FIX] 检查Tesseract是否已加载
  if (typeof Tesseract === 'undefined') {
    console.warn('Tesseract.js not loaded, skipping OCR');
    return;
  }

  try {
    // 创建临时canvas进行预处理
    const img = new Image();
    img.src = frame.imageData;
    await new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
    if (!img.width) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 裁剪中间区域（数码管通常在中央偏上）
    const cropX = img.width * 0.2;
    const cropY = img.height * 0.15;
    const cropW = img.width * 0.6;
    const cropH = img.height * 0.5;

    canvas.width = cropW * 2; // 放大2倍以提高OCR精度
    canvas.height = cropH * 2;
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);

    // 灰度+对比度增强
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const gray = (d[i] * 0.299 + d[i+1] * 0.587 + d[i+2] * 0.114);
      const enhanced = gray < 128 ? Math.max(0, gray - 50) : Math.min(255, gray + 50);
      d[i] = d[i+1] = d[i+2] = enhanced;
    }
    ctx.putImageData(imgData, 0, 0);

    // Tesseract OCR
    const result = await Tesseract.recognize(canvas, 'eng', {
      logger: () => {}
    });

    const text = result.data.text.trim();
    const codes = text.match(FAULT_CODE_REGEX);

    if (codes) {
      for (const code of codes) {
        const normalized = code.toUpperCase();
        if (!videoDiagState.detectedCodes.includes(normalized)) {
          videoDiagState.detectedCodes.push(normalized);
        }
      }
    }

    frame.ocrText = text;
    frame.ocrCodes = codes ? codes.map(c => c.toUpperCase()) : [];

  } catch (e) {
    console.error('OCR error:', e);
  }
}

// ===== 渲染诊断报告 =====
function renderDiagnosisReport() {
  const container = document.getElementById('videoResults');
  const kb = getKB();

  // LED状态分析
  const ledStatus = videoDiagState.ledStatus;
  let ledStatusHtml = '';
  if (ledStatus === 'red') {
    ledStatusHtml = `
      <div class="diag-alert diag-alert-danger">
        <div class="diag-alert-icon">🔴</div>
        <div>
          <h3>${vdText('ledFaultTitle')}</h3>
          <p>${vdText('ledFaultDesc')}</p>
        </div>
      </div>
    `;
  } else if (ledStatus === 'green') {
    ledStatusHtml = `
      <div class="diag-alert diag-alert-success">
        <div class="diag-alert-icon">🟢</div>
        <div>
          <h3>${vdText('ledNormalTitle')}</h3>
          <p>${vdText('ledNormalDesc')}</p>
        </div>
      </div>
    `;
  } else {
    ledStatusHtml = `
      <div class="diag-alert diag-alert-warning">
        <div class="diag-alert-icon">🟡</div>
        <div>
          <h3>${vdText('ledUnknownTitle')}</h3>
          <p>${vdText('ledUnknownDesc')}</p>
        </div>
      </div>
    `;
  }

  // 故障代码匹配
  let faultCodeHtml = '';
  const matchedFaults = [];

  if (videoDiagState.detectedCodes.length > 0) {
    for (const code of videoDiagState.detectedCodes) {
      const fault = kb.faultCodes.find(f => f.code === code);
      if (fault) {
        matchedFaults.push(fault);
      }
    }
  }

  if (matchedFaults.length > 0) {
    faultCodeHtml = matchedFaults.map(fault => {
      const typeClass = getFaultTypeClass(fault.type);
      const sevClass = getSeverityClass(fault.severity);
      const sevText = getSeverityText(fault.severity);
      const typeName = getFaultTypeName(fault.type);
      return `
        <div class="diag-fault-card">
          <div class="diag-fault-header">
            <span class="fault-code diag-fault-code">${fault.code}</span>
            <span class="fault-type-tag ${typeClass}">${typeName}</span>
            <span class="fault-severity ${sevClass}">${sevText}</span>
          </div>
          <div class="diag-fault-reason">${vdText('faultReasonLabel')}: ${fault.reason}</div>
          <div class="diag-fault-solution">${vdText('faultSolutionLabel')}: ${fault.solution}</div>
          <div class="diag-fault-steps-title">${vdText('troubleshootStepsLabel')}</div>
          <ol class="diag-fault-steps">
            ${fault.steps.map(s => `<li>${s}</li>`).join('')}
          </ol>
          <button class="btn btn-primary diag-detail-btn" onclick="showFaultDetail('${fault.code}')">
            ${vdText('viewDetailBtn')}
          </button>
        </div>
      `;
    }).join('');
  } else {
    // OCR未识别到代码，提供手动选择
    faultCodeHtml = `
      <div class="diag-manual-select">
        <p>${vdText('manualSelectPrompt')}</p>
        <select id="manualCodeSelect" class="diag-select">
          <option value="">-- ${vdText('selectCodeOption')} --</option>
          ${kb.faultCodes.map(f => `<option value="${f.code}">${f.code} - ${f.reason}</option>`).join('')}
        </select>
        <button class="btn btn-primary" onclick="manualSelectCode()">${vdText('confirmBtn')}</button>
      </div>
    `;
  }

  // 统计信息
  const totalRed = videoDiagState.analysisResults.reduce((sum, f) => sum + (f.led.redRatio > 0.02 ? 1 : 0), 0);
  const totalGreen = videoDiagState.analysisResults.reduce((sum, f) => sum + (f.led.greenRatio > 0.02 ? 1 : 0), 0);
  const totalFrames = videoDiagState.analysisResults.length;

  let ocrResultsHtml = '';
  const ocrFrames = videoDiagState.analysisResults.filter(f => f.ocrText);
  if (ocrFrames.length > 0) {
    ocrResultsHtml = `
      <div class="diag-ocr-section">
        <h4>${vdText('ocrResultsTitle')}</h4>
        ${ocrFrames.slice(0, 5).map(f => `
          <div class="diag-ocr-item">
            <span class="diag-ocr-time">${f.time.toFixed(1)}s:</span>
            <span class="diag-ocr-text">${escapeHtml(f.ocrText || '')}</span>
            ${f.ocrCodes && f.ocrCodes.length ? `<span class="diag-ocr-code">${f.ocrCodes.join(', ')}</span>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  container.innerHTML = `
    <div class="diag-report">
      <h2>${vdText('reportTitle')}</h2>

      <div class="diag-summary">
        <div class="diag-summary-item">
          <span class="diag-summary-label">${vdText('totalFramesLabel')}</span>
          <span class="diag-summary-value">${totalFrames}</span>
        </div>
        <div class="diag-summary-item">
          <span class="diag-summary-label">${vdText('redLedFramesLabel')}</span>
          <span class="diag-summary-value ${totalRed > 0 ? 'text-danger' : ''}">${totalRed}</span>
        </div>
        <div class="diag-summary-item">
          <span class="diag-summary-label">${vdText('greenLedFramesLabel')}</span>
          <span class="diag-summary-value ${totalGreen > 0 ? 'text-success' : ''}">${totalGreen}</span>
        </div>
        <div class="diag-summary-item">
          <span class="diag-summary-label">${vdText('detectedCodesLabel')}</span>
          <span class="diag-summary-value">${videoDiagState.detectedCodes.length > 0 ? videoDiagState.detectedCodes.join(', ') : vdText('noneLabel')}</span>
        </div>
      </div>

      ${ledStatusHtml}

      <div class="diag-fault-section">
        ${faultCodeHtml}
      </div>

      ${ocrResultsHtml}

      <div class="diag-note">
        <p>${vdText('disclaimerText')}</p>
      </div>
    </div>
  `;

  // 滚动到结果区域
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== 手动选择故障代码 =====
function manualSelectCode() {
  const select = document.getElementById('manualCodeSelect');
  const code = select.value;
  if (code) {
    showFaultDetail(code);
  }
}

// ===== 重置视频诊断 =====
function resetVideoDiag() {
  if (videoDiagState.videoUrl) {
    URL.revokeObjectURL(videoDiagState.videoUrl);
  }
  videoDiagState = {
    videoFile: null,
    videoUrl: null,
    videoDuration: 0,
    frames: [],
    analysisResults: [],
    detectedCodes: [],
    ledStatus: 'unknown',
    isAnalyzing: false,
    progress: 0
  };

  const video = document.getElementById('videoPreview');
  video.src = '';
  video.style.display = 'none';

  const progressContainer = document.querySelector('.video-progress-container');
  const framesTitle = document.getElementById('videoFramesTitle');

  document.getElementById('videoDropZone').style.display = 'flex';
  document.getElementById('videoControls').style.display = 'none';
  document.getElementById('videoInfo').style.display = 'none';
  // [BUG FIX] 隐藏进度条容器
  if (progressContainer) progressContainer.style.display = 'none';
  document.getElementById('videoProgress').style.display = 'none';
  document.getElementById('videoProgressText').style.display = 'none';
  // [BUG FIX] 隐藏帧标题
  if (framesTitle) framesTitle.style.display = 'none';
  document.getElementById('videoFrames').innerHTML = '';
  document.getElementById('videoResults').innerHTML = '';
  document.getElementById('videoFileInput').value = '';
  document.getElementById('videoAnalyzeBtn').disabled = true;
  document.getElementById('videoAnalyzeBtn').innerHTML = currentLang === 'en' ? '🔍 Start Analysis' : '🔍 开始分析';
  document.getElementById('videoResetBtn').disabled = true;
}

// ===== 视频诊断翻译函数 =====
function vdText(key) {
  const zh = {
    fileLabel: '文件',
    durationLabel: '时长',
    sizeLabel: '大小',
    analyzingProgress: '分析中',
    ocrProgress: '正在识别数码管显示...',
    analysisComplete: '分析完成',
    ledFaultTitle: '检测到故障指示灯',
    ledFaultDesc: '红色Err故障灯亮起，充电机存在故障。请查看下方故障代码详情和排查步骤。',
    ledNormalTitle: '指示灯状态正常',
    ledNormalDesc: '未检测到明显的红色故障灯，充电机指示灯状态看起来正常。如仍有问题，请尝试其他排查方式。',
    ledUnknownTitle: '指示灯状态不确定',
    ledUnknownDesc: '未能明确判断LED指示灯颜色。可能是视频画质不够清晰，建议在光线充足环境下重新拍摄。',
    faultReasonLabel: '故障原因',
    faultSolutionLabel: '处理方法',
    troubleshootStepsLabel: '排查步骤',
    viewDetailBtn: '查看详情',
    manualSelectPrompt: '自动识别未能确定故障代码。您可以从下方列表中手动选择故障代码查看详情：',
    selectCodeOption: '选择故障代码',
    confirmBtn: '确认',
    ocrResultsTitle: 'OCR识别结果',
    reportTitle: '诊断报告',
    totalFramesLabel: '分析帧数',
    redLedFramesLabel: '红灯帧数',
    greenLedFramesLabel: '绿灯帧数',
    detectedCodesLabel: '识别代码',
    noneLabel: '无',
    disclaimerText: '注：本诊断结果基于视频帧分析自动生成，LED颜色检测和OCR识别可能存在误差。请结合实际设备状态综合判断，如需确认请联系上海施能电器设备有限公司技术支持。'
  };
  const en = {
    fileLabel: 'File',
    durationLabel: 'Duration',
    sizeLabel: 'Size',
    analyzingProgress: 'Analyzing',
    ocrProgress: 'Recognizing digital display...',
    analysisComplete: 'Analysis Complete',
    ledFaultTitle: 'Fault LED Detected',
    ledFaultDesc: 'Red Err fault indicator is on. The charger has a fault. Please check the fault code details and troubleshooting steps below.',
    ledNormalTitle: 'LED Status Normal',
    ledNormalDesc: 'No significant red fault LED detected. The charger indicator status appears normal. If issues persist, try other diagnostic methods.',
    ledUnknownTitle: 'LED Status Uncertain',
    ledUnknownDesc: 'Could not clearly determine LED indicator color. Video quality may be insufficient. Try recording in better lighting conditions.',
    faultReasonLabel: 'Fault Reason',
    faultSolutionLabel: 'Solution',
    troubleshootStepsLabel: 'Troubleshooting Steps',
    viewDetailBtn: 'View Details',
    manualSelectPrompt: 'Automatic recognition could not determine the fault code. You can manually select a fault code from the list below:',
    selectCodeOption: 'Select fault code',
    confirmBtn: 'Confirm',
    ocrResultsTitle: 'OCR Recognition Results',
    reportTitle: 'Diagnostic Report',
    totalFramesLabel: 'Frames Analyzed',
    redLedFramesLabel: 'Red LED Frames',
    greenLedFramesLabel: 'Green LED Frames',
    detectedCodesLabel: 'Detected Codes',
    noneLabel: 'None',
    disclaimerText: 'Note: This diagnosis is automatically generated from video frame analysis. LED color detection and OCR recognition may have errors. Please combine with actual device status for judgment. For confirmation, contact Shanghai Shineng technical support.'
  };
  return currentLang === 'en' ? (en[key] || zh[key] || key) : (zh[key] || key);
}
