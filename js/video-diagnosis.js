/**
 * CZC7EI 充电机智能排查平台 - 视频故障诊断模块 v3.0
 * 
 * v3.0 核心升级：用7段数码管识别算法替代Tesseract.js
 *  - 7段数码管段式检测：精确识别LED数字显示
 *  - 手动框选显示区域：用户拖拽选择数码管位置
 *  - 自动显示区域检测：辅助定位
 *  - 可视化调试面板：展示识别过程
 *  - Tesseract作为备份方案
 *
 * 纯浏览器端实现，无需服务器
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
  progress: 0,
  cropRegion: null,      // {x, y, w, h} 用户框选的显示区域
  cropFrameIndex: 0,     // 框选基于的帧索引
  recognizedText: '',    // 识别到的完整文本
  debugInfo: []          // 调试信息
};

// ===== 故障代码正则匹配 =====
const FAULT_CODE_REGEX = /[ECF]-\d{2}/gi;

// ===== 7段数码管字符映射表 =====
// 每个字符对应亮起的段: a(上), b(右上), c(右下), d(下), e(左下), f(左上), g(中)
const SEGMENT_PATTERNS = {
  '0': ['a','b','c','d','e','f'],
  '1': ['b','c'],
  '2': ['a','b','d','e','g'],
  '3': ['a','b','c','d','g'],
  '4': ['b','c','f','g'],
  '5': ['a','c','d','f','g'],
  '6': ['a','c','d','e','f','g'],
  '7': ['a','b','c'],
  '8': ['a','b','c','d','e','f','g'],
  '9': ['a','b','c','d','f','g'],
  'E': ['a','d','e','f','g'],
  'C': ['a','d','e','f'],
  'F': ['a','e','f','g'],
  'P': ['a','b','e','f','g'],
  'U': ['b','c','d','e','f'],
  'H': ['b','c','e','f','g'],
  'L': ['d','e','f'],
  'n': ['c','e','g'],
  'r': ['e','g'],
  't': ['d','e','f','g'],
  '-': ['g'],
  ' ': [],
};

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

  // 框选相关按钮
  const cropConfirmBtn = document.getElementById('cropConfirmBtn');
  const cropResetBtn = document.getElementById('cropResetBtn');
  const cropAutoBtn = document.getElementById('cropAutoBtn');
  const cropSkipBtn = document.getElementById('cropSkipBtn');

  if (cropConfirmBtn) cropConfirmBtn.addEventListener('click', () => confirmCropAndRecognize());
  if (cropResetBtn) cropResetBtn.addEventListener('click', () => resetCropSelection());
  if (cropAutoBtn) cropAutoBtn.addEventListener('click', () => autoDetectDisplayRegion());
  if (cropSkipBtn) cropSkipBtn.addEventListener('click', () => skipCropAndShowManual());
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

  video.onerror = () => {
    alert(currentLang === 'en'
      ? 'Failed to load video. The format may not be supported. Please try MP4 (H.264) or WebM.'
      : '视频加载失败，可能是格式不被浏览器支持。请尝试 MP4 (H.264) 或 WebM 格式。');
    resetVideoDiag();
  };

  document.getElementById('videoDropZone').style.display = 'none';
  document.getElementById('videoControls').style.display = 'flex';
  
  // 显示步骤提示
  const stepGuide = document.getElementById('videoStepGuide');
  if (stepGuide) stepGuide.style.display = 'flex';
  updateStepIndicator(1);
}

// ===== 步骤指示器 =====
function updateStepIndicator(step) {
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById('step' + i);
    if (el) {
      if (i === step) el.classList.add('active');
      else if (i < step) { el.classList.remove('active'); el.classList.add('done'); }
      else { el.classList.remove('active', 'done'); }
    }
  }
}

// ===== 开始视频分析（第一阶段：帧提取+LED分析） =====
async function startVideoAnalysis() {
  if (videoDiagState.isAnalyzing) return;
  videoDiagState.isAnalyzing = true;
  videoDiagState.frames = [];
  videoDiagState.analysisResults = [];
  videoDiagState.detectedCodes = [];
  videoDiagState.ledStatus = 'unknown';
  videoDiagState.progress = 0;
  videoDiagState.debugInfo = [];

  const analyzeBtn = document.getElementById('videoAnalyzeBtn');
  const resetBtn = document.getElementById('videoResetBtn');
  const video = document.getElementById('videoPreview');
  const progressContainer = document.querySelector('.video-progress-container');
  const progressBar = document.getElementById('videoProgress');
  const progressText = document.getElementById('videoProgressText');
  const framesTitle = document.getElementById('videoFramesTitle');
  const framesContainer = document.getElementById('videoFrames');
  const resultsContainer = document.getElementById('videoResults');

  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = currentLang === 'en' ? '⏳ Analyzing...' : '⏳ 分析中...';
  resetBtn.disabled = true;

  if (progressContainer) progressContainer.style.display = 'block';
  progressBar.style.display = 'block';
  progressText.style.display = 'block';
  progressBar.value = 0;
  progressText.textContent = vdText('analyzingProgress') + ' 0%';

  if (framesTitle) framesTitle.style.display = 'block';
  framesContainer.innerHTML = '';
  resultsContainer.innerHTML = '';

  // 隐藏框选区域（分析期间）
  document.getElementById('cropSection').style.display = 'none';

  try {
    if (!video.videoWidth || !video.videoHeight) {
      throw new Error(currentLang === 'en' ? 'Video not fully loaded, please wait and retry' : '视频尚未完全加载，请稍等重试');
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const targetWidth = 640;
    const scale = targetWidth / video.videoWidth;
    canvas.width = targetWidth;
    canvas.height = Math.round(video.videoHeight * scale);

    const interval = 1.0;
    const totalFrames = Math.max(1, Math.floor(videoDiagState.videoDuration / interval));

    for (let i = 0; i <= totalFrames; i++) {
      const time = Math.min(i * interval, Math.max(0, videoDiagState.videoDuration - 0.1));

      videoDiagState.progress = Math.round((i / totalFrames) * 50);
      progressBar.value = videoDiagState.progress;
      progressText.textContent = vdText('analyzingProgress') + ` ${videoDiagState.progress}%`;

      await seekToTime(video, time);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const ledResult = analyzeLEDColors(ctx, canvas.width, canvas.height);

      // 保存帧数据
      let frameData = null;
      if (i % 2 === 0 || ledResult.redRatio > 0.005 || ledResult.greenRatio > 0.005) {
        frameData = canvas.toDataURL('image/jpeg', 0.7);
      }

      const frameInfo = {
        index: i,
        time: time,
        led: ledResult,
        imageData: frameData,
        canvasData: ctx.getImageData(0, 0, canvas.width, canvas.height) // 保存原始像素数据
      };
      videoDiagState.analysisResults.push(frameInfo);

      if (ledResult.redRatio > 0.005 && videoDiagState.ledStatus !== 'red') {
        videoDiagState.ledStatus = 'red';
      } else if (ledResult.greenRatio > 0.005 && videoDiagState.ledStatus === 'unknown') {
        videoDiagState.ledStatus = 'green';
      }

      // 显示帧缩略图
      if (frameData) {
        const frameDiv = document.createElement('div');
        frameDiv.className = 'video-frame-thumb';
        const ledColor = ledResult.redRatio > 0.005 ? 'red' : ledResult.greenRatio > 0.005 ? 'green' : 'none';
        const ledLabel = ledColor === 'red' ? (currentLang === 'en' ? 'Fault' : '故障') :
                         ledColor === 'green' ? (currentLang === 'en' ? 'Normal' : '正常') : '';
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

      await sleep(10);
    }

    // 分析完成，进入第二阶段：框选显示区域
    progressBar.value = 50;
    progressText.textContent = vdText('extractComplete');

    updateStepIndicator(2);

    // 显示框选区域
    showCropSection();

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

// ===== 显示框选区域 =====
function showCropSection() {
  const cropSection = document.getElementById('cropSection');
  const cropCanvas = document.getElementById('cropCanvas');
  const ctx = cropCanvas.getContext('2d');

  // 选择一个关键帧用于框选（优先选红色LED最明显的帧，否则选中间帧）
  const redFrames = videoDiagState.analysisResults
    .filter(f => f.led.redRatio > 0.005 && f.imageData)
    .sort((a, b) => b.led.redRatio - a.led.redRatio);

  let frame;
  if (redFrames.length > 0) {
    frame = redFrames[0];
  } else {
    const mid = Math.floor(videoDiagState.analysisResults.length / 2);
    frame = videoDiagState.analysisResults[mid];
  }

  if (!frame || !frame.imageData) {
    // 没有可用帧，跳过框选
    skipCropAndShowManual();
    return;
  }

  videoDiagState.cropFrameIndex = frame.index;

  const img = new Image();
  img.onload = () => {
    const maxWidth = 640;
    const scale = Math.min(1, maxWidth / img.width);
    cropCanvas.width = img.width * scale;
    cropCanvas.height = img.height * scale;
    ctx.drawImage(img, 0, 0, cropCanvas.width, cropCanvas.height);

    // 在画面上标注LED状态
    const ledColor = frame.led.redRatio > 0.005 ? 'red' : frame.led.greenRatio > 0.005 ? 'green' : 'none';
    if (ledColor !== 'none') {
      ctx.fillStyle = ledColor === 'red' ? 'rgba(255,0,0,0.7)' : 'rgba(0,255,0,0.7)';
      ctx.fillRect(10, 10, 12, 12);
      ctx.fillStyle = '#fff';
      ctx.font = '12px sans-serif';
      ctx.fillText(ledColor === 'red' ? 'Fault LED' : 'Normal LED', 28, 20);
    }

    cropSection.style.display = 'block';

    // 自动尝试检测显示区域
    setTimeout(() => autoDetectDisplayRegion(), 500);

    // 滚动到框选区域
    cropSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  img.src = frame.imageData;

  // 设置框选交互
  setupCropInteraction(cropCanvas);
}

// ===== 框选交互 =====
function setupCropInteraction(canvas) {
  const overlay = document.getElementById('cropOverlay');
  const wrapper = document.getElementById('cropCanvasWrapper');
  const confirmBtn = document.getElementById('cropConfirmBtn');

  let isDrawing = false;
  let startX = 0, startY = 0;

  // 清除旧事件
  const newOverlay = overlay.cloneNode(true);
  overlay.parentNode.replaceChild(newOverlay, overlay);

  newOverlay.style.width = canvas.width + 'px';
  newOverlay.style.height = canvas.height + 'px';

  function getPos(e) {
    const rect = newOverlay.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.max(0, Math.min(canvas.width, clientX - rect.left)),
      y: Math.max(0, Math.min(canvas.height, clientY - rect.top))
    };
  }

  function onStart(e) {
    e.preventDefault();
    isDrawing = true;
    const pos = getPos(e);
    startX = pos.x;
    startY = pos.y;
    newOverlay.innerHTML = '';
  }

  function onMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    const x = Math.min(startX, pos.x);
    const y = Math.min(startY, pos.y);
    const w = Math.abs(pos.x - startX);
    const h = Math.abs(pos.y - startY);

    newOverlay.innerHTML = `<div class="crop-rect" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;"></div>`;
    newOverlay.querySelector('.crop-rect').innerHTML = `<span class="crop-size">${Math.round(w)}×${Math.round(h)}</span>`;
  }

  function onEnd(e) {
    if (!isDrawing) return;
    isDrawing = false;
    const pos = getPos(e.changedTouches ? { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY } : e);
    const x = Math.min(startX, pos.x);
    const y = Math.min(startY, pos.y);
    const w = Math.abs(pos.x - startX);
    const h = Math.abs(pos.y - startY);

    if (w > 20 && h > 10) {
      videoDiagState.cropRegion = { x, y, w, h };
      confirmBtn.disabled = false;
    } else {
      videoDiagState.cropRegion = null;
      confirmBtn.disabled = true;
      newOverlay.innerHTML = '';
    }
  }

  newOverlay.addEventListener('mousedown', onStart);
  newOverlay.addEventListener('mousemove', onMove);
  newOverlay.addEventListener('mouseup', onEnd);
  newOverlay.addEventListener('touchstart', onStart, { passive: false });
  newOverlay.addEventListener('touchmove', onMove, { passive: false });
  newOverlay.addEventListener('touchend', onEnd);
}

// ===== 重新框选 =====
function resetCropSelection() {
  videoDiagState.cropRegion = null;
  document.getElementById('cropOverlay').innerHTML = '';
  document.getElementById('cropConfirmBtn').disabled = true;
}

// ===== 自动检测显示区域 =====
function autoDetectDisplayRegion() {
  const canvas = document.getElementById('cropCanvas');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('cropOverlay');
  const confirmBtn = document.getElementById('cropConfirmBtn');

  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // 寻找最亮的区域（数码管通常是最亮的）
  // 将图像分成网格，计算每个网格的平均亮度
  const gridSize = 20;
  const gridW = Math.floor(w / gridSize);
  const gridH = Math.floor(h / gridSize);
  const brightness = [];

  for (let gy = 0; gy < gridH; gy++) {
    brightness[gy] = [];
    for (let gx = 0; gx < gridW; gx++) {
      let sum = 0, count = 0;
      for (let dy = 0; dy < gridSize; dy++) {
        for (let dx = 0; dx < gridSize; dx++) {
          const idx = ((gy * gridSize + dy) * w + (gx * gridSize + dx)) * 4;
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          sum += (r + g + b) / 3;
          count++;
        }
      }
      brightness[gy][gx] = sum / count;
    }
  }

  // 找到亮度 > 阈值的连通区域
  const threshold = 120;
  let bestRegion = null;
  let bestArea = 0;

  // 滑动窗口寻找最亮的矩形区域
  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      if (brightness[gy][gx] < threshold) continue;
      
      // 向右下方扩展
      let maxGx = gx;
      let maxGy = gy;
      
      for (let ex = gx; ex < gridW; ex++) {
        if (brightness[gy][ex] < threshold) break;
        maxGx = ex;
      }
      for (let ey = gy; ey < gridH; ey++) {
        if (brightness[ey][gx] < threshold) break;
        maxGy = ey;
      }

      const area = (maxGx - gx + 1) * (maxGy - gy + 1);
      if (area > bestArea && area < gridW * gridH * 0.5) {
        bestArea = area;
        bestRegion = {
          x: gx * gridSize,
          y: gy * gridSize,
          w: (maxGx - gx + 1) * gridSize,
          h: (maxGy - gy + 1) * gridSize
        };
      }
    }
  }

  if (bestRegion && bestRegion.w > 30 && bestRegion.h > 15) {
    videoDiagState.cropRegion = bestRegion;
    overlay.innerHTML = `<div class="crop-rect auto-detected" style="left:${bestRegion.x}px;top:${bestRegion.y}px;width:${bestRegion.w}px;height:${bestRegion.h}px;">
      <span class="crop-size auto-label">🤖 ${Math.round(bestRegion.w)}×${Math.round(bestRegion.h)}</span>
    </div>`;
    confirmBtn.disabled = false;
    
    // 显示提示
    const hint = document.querySelector('.crop-hint');
    if (hint) {
      hint.innerHTML = currentLang === 'en' 
        ? 'Auto-detected display region (blue box). Adjust by dragging if needed, or click "Confirm" to recognize.'
        : '已自动检测到显示区域（蓝色框）。如需调整可重新拖拽框选，或直接点击"确认区域并识别"。';
    }
  }
}

// ===== 跳过框选，直接显示手动选择 =====
function skipCropAndShowManual() {
  document.getElementById('cropSection').style.display = 'none';
  updateStepIndicator(3);
  
  // 直接生成报告（无识别代码，提供手动选择）
  videoDiagState.detectedCodes = [];
  videoDiagState.recognizedText = '';
  
  const progressBar = document.getElementById('videoProgress');
  const progressText = document.getElementById('videoProgressText');
  progressBar.value = 100;
  progressText.textContent = vdText('analysisComplete');
  
  renderDiagnosisReport();
}

// ===== 确认框选并开始识别 =====
async function confirmCropAndRecognize() {
  if (!videoDiagState.cropRegion) return;

  const cropSection = document.getElementById('cropSection');
  const progressBar = document.getElementById('videoProgress');
  const progressText = document.getElementById('videoProgressText');
  const confirmBtn = document.getElementById('cropConfirmBtn');
  const debugPanel = document.getElementById('debugPanel');

  cropSection.style.display = 'none';
  updateStepIndicator(3);

  confirmBtn.disabled = true;
  confirmBtn.innerHTML = currentLang === 'en' ? '⏳ Recognizing...' : '⏳ 识别中...';

  progressBar.value = 60;
  progressText.textContent = vdText('recognizingDisplay');
  progressText.style.display = 'block';

  // 显示调试面板
  if (debugPanel) {
    debugPanel.style.display = 'block';
    document.getElementById('debugContent').innerHTML = '';
  }

  videoDiagState.debugInfo = [];
  videoDiagState.detectedCodes = [];
  videoDiagState.recognizedText = '';

  try {
    const { x, y, w, h } = videoDiagState.cropRegion;

    // 在多个帧上尝试识别（取5个LED最明显的帧）
    const candidateFrames = videoDiagState.analysisResults
      .filter(f => f.imageData)
      .sort((a, b) => b.led.redRatio - a.led.redRatio)
      .slice(0, 5);

    if (candidateFrames.length === 0) {
      throw new Error('No frames available for recognition');
    }

    const allResults = [];

    for (let i = 0; i < candidateFrames.length; i++) {
      const frame = candidateFrames[i];
      progressBar.value = 60 + Math.round((i / candidateFrames.length) * 30);
      progressText.textContent = vdText('recognizingFrame') + ` ${i + 1}/${candidateFrames.length}...`;

      // 加载帧图像
      const img = new Image();
      img.src = frame.imageData;
      await new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
      if (!img.width) continue;

      // 计算缩放比例（帧图像可能被缩小过）
      const frameScale = img.width / 640; // 原始提取时宽度为640

      // 裁剪显示区域
      const cropCanvas = document.createElement('canvas');
      const cropCtx = cropCanvas.getContext('2d');
      const cropX = x * frameScale;
      const cropY = y * frameScale;
      const cropW = w * frameScale;
      const cropH = h * frameScale;

      // 放大2倍以提高识别精度
      cropCanvas.width = cropW * 2;
      cropCanvas.height = cropH * 2;
      cropCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropCanvas.width, cropCanvas.height);

      // 7段数码管识别
      const segResult = recognizeSevenSegment(cropCtx, cropCanvas.width, cropCanvas.height, frame.time);
      
      addDebugInfo(`Frame ${frame.index} (t=${frame.time.toFixed(1)}s): 7-seg result = "${segResult.text}" (confidence: ${segResult.confidence.toFixed(2)})`);

      if (segResult.text && segResult.confidence > 0.3) {
        allResults.push(segResult);
      }

      // 也尝试Tesseract作为备份
      if (segResult.confidence < 0.5 && typeof Tesseract !== 'undefined') {
        const tessResult = await tesseractBackup(cropCtx, cropCanvas.width, cropCanvas.height);
        if (tessResult) {
          addDebugInfo(`Frame ${frame.index}: Tesseract backup = "${tessResult.text}"`);
          if (tessResult.codes.length > 0) {
            allResults.push({ text: tessResult.text, codes: tessResult.codes, confidence: 0.6, method: 'tesseract' });
          }
        }
      }

      await sleep(10);
    }

    // 汇总结果：选取出现频率最高的代码
    const codeVotes = {};
    let bestText = '';

    for (const result of allResults) {
      // 从识别文本中提取故障代码
      const codes = result.text.match(FAULT_CODE_REGEX);
      if (codes) {
        for (const code of codes) {
          const normalized = code.toUpperCase();
          codeVotes[normalized] = (codeVotes[normalized] || 0) + 1;
        }
      }
      // 也检查result.codes
      if (result.codes) {
        for (const code of result.codes) {
          const normalized = code.toUpperCase();
          codeVotes[normalized] = (codeVotes[normalized] || 0) + 1;
        }
      }
      if (result.confidence > 0.5 && (!bestText || result.confidence > 0.6)) {
        bestText = result.text;
      }
    }

    // 选取投票最多的代码
    let bestCode = null;
    let maxVotes = 0;
    for (const [code, votes] of Object.entries(codeVotes)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        bestCode = code;
      }
    }

    if (bestCode) {
      videoDiagState.detectedCodes = [bestCode];
    }
    videoDiagState.recognizedText = bestText || (allResults.length > 0 ? allResults[0].text : '');

    addDebugInfo(`\n=== Final Result ===`);
    addDebugInfo(`Recognized text: "${videoDiagState.recognizedText}"`);
    addDebugInfo(`Code votes: ${JSON.stringify(codeVotes)}`);
    addDebugInfo(`Best code: ${bestCode || 'none'}`);

    progressBar.value = 100;
    progressText.textContent = vdText('analysisComplete');

    renderDebugPanel();
    renderDiagnosisReport();

  } catch (err) {
    console.error('Recognition error:', err);
    addDebugInfo(`ERROR: ${err.message}`);
    renderDebugPanel();
    
    progressText.textContent = '';
    renderDiagnosisReport();
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = currentLang === 'en' ? '✅ Confirm & Recognize' : '✅ 确认区域并识别';
  }
}

// ===== 7段数码管识别算法 =====
function recognizeSevenSegment(ctx, width, height, frameTime) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // 1. 转为灰度+二值化
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    gray[i] = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
  }

  // 自适应阈值：计算平均亮度
  let avgBrightness = 0;
  for (let i = 0; i < gray.length; i++) avgBrightness += gray[i];
  avgBrightness /= gray.length;

  // 数码管的亮段通常比背景亮很多
  const threshold = Math.min(180, Math.max(80, avgBrightness + 50));
  
  const binary = new Uint8Array(width * height);
  for (let i = 0; i < gray.length; i++) {
    binary[i] = gray[i] > threshold ? 1 : 0;
  }

  // 2. 水平投影（列方向亮像素数）- 找字符边界
  const colSums = new Array(width).fill(0);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (binary[y * width + x]) colSums[x]++;
    }
  }

  // 3. 找到亮区的垂直范围（行方向）
  const rowSums = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (binary[y * width + x]) rowSums[y]++;
    }
  }

  let displayTop = 0, displayBottom = height;
  for (let y = 0; y < height; y++) {
    if (rowSums[y] > 2) { displayTop = y; break; }
  }
  for (let y = height - 1; y >= 0; y--) {
    if (rowSums[y] > 2) { displayBottom = y; break; }
  }

  const displayH = displayBottom - displayTop + 1;
  if (displayH < 8) {
    return { text: '', confidence: 0, method: '7-seg' };
  }

  // 4. 找字符单元（水平方向亮像素的连通区域）
  const charCells = [];
  let inChar = false;
  let charStart = 0;
  const colThreshold = Math.max(2, displayH * 0.05); // 列亮像素阈值

  for (let x = 0; x < width; x++) {
    if (colSums[x] > colThreshold) {
      if (!inChar) {
        charStart = x;
        inChar = true;
      }
    } else {
      if (inChar) {
        const charW = x - charStart;
        if (charW >= 3) { // 过滤太窄的噪声
          charCells.push({ x1: charStart, x2: x - 1, w: charW });
        }
        inChar = false;
      }
    }
  }
  if (inChar) {
    const charW = width - charStart;
    if (charW >= 3) {
      charCells.push({ x1: charStart, x2: width - 1, w: charW });
    }
  }

  if (charCells.length === 0) {
    return { text: '', confidence: 0, method: '7-seg' };
  }

  // 5. 对每个字符单元检测7段
  let result = '';
  let totalConfidence = 0;
  const segmentDebug = [];

  for (const cell of charCells) {
    const seg = detectSegments(binary, cell.x1, cell.x2, displayTop, displayBottom, width);
    const charResult = segmentsToChar(seg);
    result += charResult.char;
    totalConfidence += charResult.confidence;
    
    segmentDebug.push({
      char: charResult.char,
      confidence: charResult.confidence,
      segments: seg,
      cell: cell
    });
  }

  const avgConfidence = charCells.length > 0 ? totalConfidence / charCells.length : 0;

  // 添加调试信息
  addDebugInfo(`7-seg @ t=${frameTime?.toFixed(1)}s: ${charCells.length} cells found, result="${result}", avgConf=${avgConfidence.toFixed(2)}`);
  for (const sd of segmentDebug) {
    const segStr = Object.entries(sd.segments).filter(([k, v]) => v).map(([k]) => k).join('');
    addDebugInfo(`  cell [${sd.cell.x1}-${sd.cell.x2}] → "${sd.char}" (conf=${sd.confidence.toFixed(2)}, segments: ${segStr || 'none'})`);
  }

  return { text: result, confidence: avgConfidence, method: '7-seg' };
}

// ===== 检测7段中哪些段亮起 =====
function detectSegments(binary, x1, x2, y1, y2, totalW) {
  const w = x2 - x1 + 1;
  const h = y2 - y1 + 1;

  function countLit(xStart, xEnd, yStart, yEnd) {
    let count = 0, total = 0;
    for (let y = Math.floor(yStart); y < Math.ceil(yEnd) && y < y2 + 1; y++) {
      for (let x = Math.floor(xStart); x < Math.ceil(xEnd) && x < x2 + 1; x++) {
        total++;
        if (x >= 0 && y >= 0 && x < totalW && binary[y * totalW + x]) count++;
      }
    }
    return total > 0 ? count / total : 0;
  }

  // 7段区域定义（相对于字符单元）
  //   aaa
  //  f   b
  //  f   b
  //   ggg
  //  e   c
  //  e   c
  //   ddd

  const segThreshold = 0.12; // 12%像素亮起则认为该段亮

  return {
    a: countLit(x1 + w * 0.25, x2 - w * 0.25, y1, y1 + h * 0.2) > segThreshold,
    b: countLit(x2 - w * 0.35, x2 - w * 0.05, y1 + h * 0.1, y1 + h * 0.45) > segThreshold,
    c: countLit(x2 - w * 0.35, x2 - w * 0.05, y1 + h * 0.55, y1 + h * 0.9) > segThreshold,
    d: countLit(x1 + w * 0.25, x2 - w * 0.25, y2 - h * 0.2, y2) > segThreshold,
    e: countLit(x1 + w * 0.05, x1 + w * 0.35, y1 + h * 0.55, y1 + h * 0.9) > segThreshold,
    f: countLit(x1 + w * 0.05, x1 + w * 0.35, y1 + h * 0.1, y1 + h * 0.45) > segThreshold,
    g: countLit(x1 + w * 0.25, x2 - w * 0.25, y1 + h * 0.4, y1 + h * 0.6) > segThreshold
  };
}

// ===== 将段模式映射到字符 =====
function segmentsToChar(seg) {
  const litSegs = Object.keys(seg).filter(s => seg[s]).sort();
  const litSet = new Set(litSegs);

  let bestMatch = '?';
  let bestScore = 0;

  for (const [ch, pattern] of Object.entries(SEGMENT_PATTERNS)) {
    const expected = new Set(pattern);
    
    // 计算匹配分数：正确亮起的段 - 错误亮起的段
    let correct = 0, wrong = 0;
    for (const s of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
      if (expected.has(s) && litSet.has(s)) correct++;
      else if (!expected.has(s) && litSet.has(s)) wrong++;
      else if (expected.has(s) && !litSet.has(s)) wrong++;
    }
    
    const score = correct / 7 - wrong * 0.15;
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = ch;
    }
  }

  return { char: bestMatch, confidence: Math.max(0, bestScore) };
}

// ===== Tesseract备份识别 =====
async function tesseractBackup(ctx, width, height) {
  if (typeof Tesseract === 'undefined') return null;

  try {
    // 预处理：增强对比度
    const imgData = ctx.getImageData(0, 0, width, height);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const gray = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
      const enhanced = gray < 128 ? Math.max(0, gray - 60) : Math.min(255, gray + 60);
      d[i] = d[i + 1] = d[i + 2] = enhanced;
    }
    ctx.putImageData(imgData, 0, 0);

    const result = await Tesseract.recognize(ctx.canvas, 'eng', {
      logger: () => {},
      tessedit_char_whitelist: 'ECF0123456789- ',
      tessedit_pageseg_mode: '7' // 单行文本
    });

    const text = result.data.text.trim();
    const codes = text.match(FAULT_CODE_REGEX);
    return { text, codes: codes ? codes.map(c => c.toUpperCase()) : [] };
  } catch (e) {
    console.error('Tesseract backup error:', e);
    return null;
  }
}

// ===== 添加调试信息 =====
function addDebugInfo(msg) {
  videoDiagState.debugInfo.push(msg);
}

// ===== 渲染调试面板 =====
function renderDebugPanel() {
  const content = document.getElementById('debugContent');
  if (!content) return;

  content.innerHTML = `
    <pre class="debug-pre">${escapeHtml(videoDiagState.debugInfo.join('\n'))}</pre>
  `;
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

    const timeoutId = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve();
    }, 3000);

    video.addEventListener('seeked', onSeeked);

    try {
      video.currentTime = time;
      if (time === 0 && Math.abs(video.currentTime - 0) < 0.01) {
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

    if (r > 150 && g < 100 && b < 100) {
      redPixels++;
    } else if (g > 150 && r < 120 && b < 120) {
      greenPixels++;
    } else if (r > 200 && g > 180 && b < 100) {
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

  // 识别结果显示
  let recognitionHtml = '';
  if (videoDiagState.recognizedText) {
    recognitionHtml = `
      <div class="diag-recognition-box">
        <h4>🔢 ${vdText('recognizedDisplayLabel')}</h4>
        <div class="diag-recognized-code">${escapeHtml(videoDiagState.recognizedText)}</div>
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
  const totalRed = videoDiagState.analysisResults.reduce((sum, f) => sum + (f.led.redRatio > 0.005 ? 1 : 0), 0);
  const totalGreen = videoDiagState.analysisResults.reduce((sum, f) => sum + (f.led.greenRatio > 0.005 ? 1 : 0), 0);
  const totalFrames = videoDiagState.analysisResults.length;

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

      ${recognitionHtml}

      <div class="diag-fault-section">
        ${faultCodeHtml}
      </div>

      <div class="diag-note">
        <p>${vdText('disclaimerText')}</p>
      </div>
    </div>
  `;

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
    progress: 0,
    cropRegion: null,
    cropFrameIndex: 0,
    recognizedText: '',
    debugInfo: []
  };

  const video = document.getElementById('videoPreview');
  video.src = '';
  video.style.display = 'none';

  const progressContainer = document.querySelector('.video-progress-container');
  const framesTitle = document.getElementById('videoFramesTitle');
  const stepGuide = document.getElementById('videoStepGuide');
  const cropSection = document.getElementById('cropSection');
  const debugPanel = document.getElementById('debugPanel');

  document.getElementById('videoDropZone').style.display = 'flex';
  document.getElementById('videoControls').style.display = 'none';
  document.getElementById('videoInfo').style.display = 'none';
  if (progressContainer) progressContainer.style.display = 'none';
  document.getElementById('videoProgress').style.display = 'none';
  document.getElementById('videoProgressText').style.display = 'none';
  if (framesTitle) framesTitle.style.display = 'none';
  if (stepGuide) stepGuide.style.display = 'none';
  if (cropSection) cropSection.style.display = 'none';
  if (debugPanel) debugPanel.style.display = 'none';
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
    extractComplete: '帧提取完成，请框选数码管区域',
    recognizingDisplay: '正在识别数码管显示...',
    recognizingFrame: '识别帧',
    analysisComplete: '分析完成',
    ledFaultTitle: '检测到故障指示灯',
    ledFaultDesc: '红色Err故障灯亮起，充电机存在故障。请查看下方故障代码详情和排查步骤。',
    ledNormalTitle: '指示灯状态正常',
    ledNormalDesc: '未检测到明显的红色故障灯，充电机指示灯状态看起来正常。',
    ledUnknownTitle: '指示灯状态不确定',
    ledUnknownDesc: '未能明确判断LED指示灯颜色。可能是视频画质不够清晰，建议在光线充足环境下重新拍摄。',
    faultReasonLabel: '故障原因',
    faultSolutionLabel: '处理方法',
    troubleshootStepsLabel: '排查步骤',
    viewDetailBtn: '查看详情',
    manualSelectPrompt: '自动识别未能确定故障代码。您可以从下方列表中手动选择故障代码查看详情：',
    selectCodeOption: '选择故障代码',
    confirmBtn: '确认',
    reportTitle: '诊断报告',
    totalFramesLabel: '分析帧数',
    redLedFramesLabel: '红灯帧数',
    greenLedFramesLabel: '绿灯帧数',
    detectedCodesLabel: '识别代码',
    noneLabel: '无',
    recognizedDisplayLabel: '数码管识别结果',
    disclaimerText: '注：本诊断结果基于视频帧分析和7段数码管识别算法自动生成。如识别结果有误，可手动选择故障代码。如需确认请联系上海施能电器设备有限公司技术支持：+8613917175637 / zhoubin@shineng.com'
  };
  const en = {
    fileLabel: 'File',
    durationLabel: 'Duration',
    sizeLabel: 'Size',
    analyzingProgress: 'Analyzing',
    extractComplete: 'Frame extraction complete. Please crop the display area.',
    recognizingDisplay: 'Recognizing digital display...',
    recognizingFrame: 'Recognizing frame',
    analysisComplete: 'Analysis Complete',
    ledFaultTitle: 'Fault LED Detected',
    ledFaultDesc: 'Red Err fault indicator is on. The charger has a fault. Check the fault code details below.',
    ledNormalTitle: 'LED Status Normal',
    ledNormalDesc: 'No significant red fault LED detected. The charger indicator status appears normal.',
    ledUnknownTitle: 'LED Status Uncertain',
    ledUnknownDesc: 'Could not clearly determine LED color. Video quality may be insufficient.',
    faultReasonLabel: 'Fault Reason',
    faultSolutionLabel: 'Solution',
    troubleshootStepsLabel: 'Troubleshooting Steps',
    viewDetailBtn: 'View Details',
    manualSelectPrompt: 'Auto-recognition could not determine the fault code. Select a fault code manually:',
    selectCodeOption: 'Select fault code',
    confirmBtn: 'Confirm',
    reportTitle: 'Diagnostic Report',
    totalFramesLabel: 'Frames Analyzed',
    redLedFramesLabel: 'Red LED Frames',
    greenLedFramesLabel: 'Green LED Frames',
    detectedCodesLabel: 'Detected Codes',
    noneLabel: 'None',
    recognizedDisplayLabel: 'Digital Display Recognition',
    disclaimerText: 'Note: This diagnosis is auto-generated from video frame analysis and 7-segment display recognition. If the result is incorrect, you can manually select the fault code. For confirmation, contact Shanghai Shineng technical support: +8613917175637 / zhoubin@shineng.com'
  };
  return currentLang === 'en' ? (en[key] || zh[key] || key) : (zh[key] || key);
}
