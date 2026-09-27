/**
 * Interactive Project Live Demos & Browser Simulations
 * Mohan Venkata Subba Rao Portfolio
 * Zero external dependencies, pure vanilla JS, lightweight, responsive
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Global Demo Modal State & Controls
  // --------------------------------------------------------------------------
  const demoModal = document.getElementById('demo-modal');
  const demoCloseBtn = document.getElementById('demo-modal-close-btn');
  const demoTabBtns = document.querySelectorAll('.demo-tab-btn');
  const demoPanels = document.querySelectorAll('.demo-panel');
  const openDemoBtns = document.querySelectorAll('.open-demo-btn');

  function openDemoModal(demoId) {
    if (!demoModal) return;
    demoModal.classList.add('active');
    demoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Switch to target demo tab
    if (demoId) {
      switchDemoTab(demoId);
    }
  }

  function closeDemoModal() {
    if (!demoModal) return;
    demoModal.classList.remove('active');
    demoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Stop active simulations to conserve CPU
    stopIrrigationSimulation();
    stopAirQualityInterval();
    stopPiezoWalking();
  }

  function switchDemoTab(demoId) {
    demoTabBtns.forEach(btn => {
      const match = btn.getAttribute('data-demo-target') === demoId;
      btn.classList.toggle('active', match);
    });

    demoPanels.forEach(panel => {
      const match = panel.id === `demo-panel-${demoId}`;
      panel.classList.toggle('active', match);
    });

    // Initialize specific canvas or charts if needed
    if (demoId === 'airquality') {
      initAirQualityChart();
    }
  }

  // Event Listeners for Opening / Closing
  openDemoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const demoTarget = btn.getAttribute('data-demo');
      openDemoModal(demoTarget || 'irrigation');
    });
  });

  if (demoCloseBtn) {
    demoCloseBtn.addEventListener('click', closeDemoModal);
  }

  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        closeDemoModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && demoModal && demoModal.classList.contains('active')) {
      closeDemoModal();
    }
  });

  demoTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-demo-target');
      switchDemoTab(target);
    });
  });

  // ==========================================================================
  // PROJECT 1: Smart Autonomous Irrigation System Simulation
  // ==========================================================================
  let isPumpRunning = false;
  let isSensorFailed = false;
  let irrigationWaterLevel = 0;
  let irrigationTimerSeconds = 15;
  let irrigationInterval = null;
  let timerCountdownInterval = null;

  const startPumpBtn = document.getElementById('irri-start-btn');
  const stopPumpBtn = document.getElementById('irri-stop-btn');
  const sensorFailBtn = document.getElementById('irri-sensor-fail-btn');
  const resetIrriBtn = document.getElementById('irri-reset-btn');

  const pumpStatusEl = document.getElementById('irri-pump-status');
  const valveStatusEl = document.getElementById('irri-valve-status');
  const waterLevelValEl = document.getElementById('irri-level-val');
  const waterLevelBarEl = document.getElementById('irri-level-bar');
  const timerCountdownEl = document.getElementById('irri-timer-val');
  const sensorStatusEl = document.getElementById('irri-sensor-status');
  const flowRateEl = document.getElementById('irri-flow-rate');
  const alertBoxEl = document.getElementById('irri-alert-box');
  const fieldSvgEl = document.getElementById('irri-field-svg');

  function updateIrrigationUI() {
    if (pumpStatusEl) {
      if (isPumpRunning) {
        pumpStatusEl.className = 'param-badge badge-running';
        pumpStatusEl.innerHTML = '<span class="status-pulse-dot"></span> RUNNING';
      } else {
        pumpStatusEl.className = 'param-badge badge-stopped';
        pumpStatusEl.textContent = 'STOPPED / OFF';
      }
    }

    if (valveStatusEl) {
      valveStatusEl.textContent = isPumpRunning ? 'OPEN (4-Bar Actuated)' : 'CLOSED';
      valveStatusEl.className = isPumpRunning ? 'param-badge badge-active' : 'param-badge';
    }

    if (waterLevelValEl && waterLevelBarEl) {
      const pct = Math.min(100, Math.max(0, Math.round(irrigationWaterLevel)));
      waterLevelValEl.textContent = `${pct}%`;
      waterLevelBarEl.style.width = `${pct}%`;
      if (pct >= 100) {
        waterLevelBarEl.style.background = 'var(--accent-emerald, #10b981)';
      } else {
        waterLevelBarEl.style.background = 'var(--primary, #3b82f6)';
      }
    }

    if (timerCountdownEl) {
      timerCountdownEl.textContent = `${irrigationTimerSeconds}s`;
      if (irrigationTimerSeconds <= 5 && isPumpRunning && isSensorFailed) {
        timerCountdownEl.style.color = '#ef4444';
      } else {
        timerCountdownEl.style.color = '';
      }
    }

    if (sensorStatusEl) {
      if (isSensorFailed) {
        sensorStatusEl.className = 'param-badge badge-danger';
        sensorStatusEl.textContent = 'FAULT / DISCONNECTED';
      } else {
        sensorStatusEl.className = 'param-badge badge-ok';
        sensorStatusEl.textContent = 'ONLINE (OK)';
      }
    }

    if (flowRateEl) {
      flowRateEl.textContent = isPumpRunning ? '42.5 L/min' : '0.0 L/min';
    }

    // Toggle CSS classes on field diagram
    if (fieldSvgEl) {
      fieldSvgEl.classList.toggle('pump-active', isPumpRunning);
      fieldSvgEl.classList.toggle('sensor-fault', isSensorFailed);
    }
  }

  function startIrrigationSimulation() {
    if (isPumpRunning) return;
    isPumpRunning = true;
    updateIrrigationUI();

    if (alertBoxEl) {
      alertBoxEl.className = 'demo-alert-box alert-info';
      alertBoxEl.innerHTML = '<i class="fa-solid fa-water"></i> <strong>PUMP RUNNING:</strong> Main pipeline pressurized. Four-bar linkage valves open. Irrigating crop rows...';
    }

    // Water level increase loop
    clearInterval(irrigationInterval);
    irrigationInterval = setInterval(() => {
      if (!isPumpRunning) return;

      irrigationWaterLevel += 2.5;

      if (!isSensorFailed && irrigationWaterLevel >= 100) {
        // Normal Mode: Sensor detects level reached!
        irrigationWaterLevel = 100;
        stopIrrigationSimulation();
        if (alertBoxEl) {
          alertBoxEl.className = 'demo-alert-box alert-success';
          alertBoxEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>LEVEL DETECTED — PUMP OFF:</strong> Required water level reached. Microcontroller auto-shut off the pump to save water.';
        }
      }

      updateIrrigationUI();
    }, 250);

    // Timer Fallback countdown
    clearInterval(timerCountdownInterval);
    timerCountdownInterval = setInterval(() => {
      if (!isPumpRunning) return;

      if (irrigationTimerSeconds > 0) {
        irrigationTimerSeconds--;
      }

      if (irrigationTimerSeconds <= 0) {
        // Timer Fallback triggered!
        stopIrrigationSimulation();
        if (alertBoxEl) {
          alertBoxEl.className = 'demo-alert-box alert-warning';
          alertBoxEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <strong>TIMER FALLBACK — PUMP OFF:</strong> Safety timer expired. Emergency pump shut-off triggered to prevent motor dry-run & overflow.';
        }
      }

      updateIrrigationUI();
    }, 1000);
  }

  function stopIrrigationSimulation() {
    isPumpRunning = false;
    clearInterval(irrigationInterval);
    clearInterval(timerCountdownInterval);
    updateIrrigationUI();
  }

  function resetIrrigationSimulation() {
    stopIrrigationSimulation();
    irrigationWaterLevel = 0;
    irrigationTimerSeconds = 15;
    isSensorFailed = false;
    updateIrrigationUI();

    if (alertBoxEl) {
      alertBoxEl.className = 'demo-alert-box alert-neutral';
      alertBoxEl.innerHTML = '<i class="fa-solid fa-info-circle"></i> <strong>System Ready:</strong> Click "START PUMP" to begin automated irrigation simulation.';
    }

    if (sensorFailBtn) {
      sensorFailBtn.classList.remove('active-failure');
      sensorFailBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Simulate Sensor Failure';
    }
  }

  if (startPumpBtn) {
    startPumpBtn.addEventListener('click', startIrrigationSimulation);
  }

  if (stopPumpBtn) {
    stopPumpBtn.addEventListener('click', () => {
      stopIrrigationSimulation();
      if (alertBoxEl) {
        alertBoxEl.className = 'demo-alert-box alert-info';
        alertBoxEl.innerHTML = '<i class="fa-solid fa-hand"></i> <strong>Manual Stop:</strong> Pump paused by user command.';
      }
    });
  }

  if (sensorFailBtn) {
    sensorFailBtn.addEventListener('click', () => {
      isSensorFailed = !isSensorFailed;
      sensorFailBtn.classList.toggle('active-failure', isSensorFailed);
      if (isSensorFailed) {
        sensorFailBtn.innerHTML = '<i class="fa-solid fa-plug-circle-xmark"></i> Sensor: DISCONNECTED (Fail Mode Active)';
        if (alertBoxEl) {
          alertBoxEl.className = 'demo-alert-box alert-warning';
          alertBoxEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <strong>Sensor Failure Injected:</strong> Level sensor bypassed. The system will now rely strictly on <strong>Timer Fallback</strong> for safety shutoff.';
        }
      } else {
        sensorFailBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Simulate Sensor Failure';
      }
      updateIrrigationUI();
    });
  }

  if (resetIrriBtn) {
    resetIrriBtn.addEventListener('click', resetIrrigationSimulation);
  }

  // ==========================================================================
  // PROJECT 2: IoT Air Quality Monitoring System Simulation
  // ==========================================================================
  let aqiHistory = [35, 38, 42, 40, 45, 43, 39, 41, 44, 42];
  let airQualityTimer = null;
  let currentAQI = 42;
  let currentTemp = 26.4;
  let currentHumidity = 52.0;
  let currentMQ2 = 38;
  let currentMQ7 = 8;
  let currentMQ135 = 44;

  const tempValEl = document.getElementById('aq-temp-val');
  const humidValEl = document.getElementById('aq-humid-val');
  const mq2ValEl = document.getElementById('aq-mq2-val');
  const mq7ValEl = document.getElementById('aq-mq7-val');
  const mq135ValEl = document.getElementById('aq-mq135-val');
  const aqiScoreEl = document.getElementById('aq-score-val');
  const aqiStatusBadgeEl = document.getElementById('aq-status-badge');
  const aqiLedEl = document.getElementById('aq-led-indicator');
  const aqiCanvas = document.getElementById('aqi-chart-canvas');

  const btnNormalAir = document.getElementById('aq-btn-normal');
  const btnModAir = document.getElementById('aq-btn-moderate');
  const btnHighAir = document.getElementById('aq-btn-high');
  const btnLiveAir = document.getElementById('aq-btn-live');
  const btnResetAir = document.getElementById('aq-btn-reset');

  function updateAirQualityDashboard() {
    if (tempValEl) tempValEl.textContent = `${currentTemp.toFixed(1)} °C`;
    if (humidValEl) humidValEl.textContent = `${Math.round(currentHumidity)} %`;
    if (mq2ValEl) mq2ValEl.textContent = `${Math.round(currentMQ2)} ppm`;
    if (mq7ValEl) mq7ValEl.textContent = `${Math.round(currentMQ7)} ppm`;
    if (mq135ValEl) mq135ValEl.textContent = `${Math.round(currentMQ135)} ppm`;
    if (aqiScoreEl) aqiScoreEl.textContent = Math.round(currentAQI);

    let statusText = 'Good';
    let statusClass = 'status-good';
    let ledColor = '#10b981';

    if (currentAQI <= 50) {
      statusText = 'Good (Safe Air)';
      statusClass = 'status-good';
      ledColor = '#10b981';
    } else if (currentAQI <= 100) {
      statusText = 'Moderate';
      statusClass = 'status-moderate';
      ledColor = '#f59e0b';
    } else if (currentAQI <= 200) {
      statusText = 'Poor (High Toxicity)';
      statusClass = 'status-poor';
      ledColor = '#f97316';
    } else {
      statusText = 'Very Poor / Hazardous';
      statusClass = 'status-hazardous';
      ledColor = '#ef4444';
    }

    if (aqiStatusBadgeEl) {
      aqiStatusBadgeEl.textContent = statusText;
      aqiStatusBadgeEl.className = `aq-status-pill ${statusClass}`;
    }

    if (aqiLedEl) {
      aqiLedEl.style.backgroundColor = ledColor;
      aqiLedEl.style.boxShadow = `0 0 16px ${ledColor}`;
    }

    drawAQIChart();
  }

  function drawAQIChart() {
    if (!aqiCanvas) return;
    const ctx = aqiCanvas.getContext('2d');
    if (!ctx) return;

    const width = aqiCanvas.width = aqiCanvas.parentElement.clientWidth || 360;
    const height = aqiCanvas.height = 160;

    ctx.clearRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 30; y < height; y += 35) {
      ctx.beginPath();
      ctx.moveTo(35, y);
      ctx.lineTo(width - 15, y);
      ctx.stroke();
    }

    // Map data points
    const maxVal = 300;
    const paddingLeft = 40;
    const paddingRight = 15;
    const paddingTop = 15;
    const paddingBottom = 25;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    if (aqiHistory.length < 2) return;

    const stepX = chartWidth / (aqiHistory.length - 1);

    // Gradient Area under curve
    const gradient = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
    if (currentAQI > 200) {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
    } else if (currentAQI > 100) {
      gradient.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
      gradient.addColorStop(1, 'rgba(249, 115, 22, 0.0)');
    } else if (currentAQI > 50) {
      gradient.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
      gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
    } else {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    }

    // Path
    ctx.beginPath();
    aqiHistory.forEach((val, i) => {
      const x = paddingLeft + i * stepX;
      const y = height - paddingBottom - (val / maxVal) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    // Fill
    ctx.lineTo(paddingLeft + (aqiHistory.length - 1) * stepX, height - paddingBottom);
    ctx.lineTo(paddingLeft, height - paddingBottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    aqiHistory.forEach((val, i) => {
      const x = paddingLeft + i * stepX;
      const y = height - paddingBottom - (val / maxVal) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = currentAQI > 200 ? '#ef4444' : currentAQI > 100 ? '#f97316' : currentAQI > 50 ? '#f59e0b' : '#10b981';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Data points & Latest Indicator
    aqiHistory.forEach((val, i) => {
      const x = paddingLeft + i * stepX;
      const y = height - paddingBottom - (val / maxVal) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, i === aqiHistory.length - 1 ? 5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = i === aqiHistory.length - 1 ? '#ffffff' : ctx.strokeStyle;
      ctx.fill();
    });

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('0', 15, height - paddingBottom);
    ctx.fillText('150', 10, height - paddingBottom - (150 / maxVal) * chartHeight);
    ctx.fillText('300', 10, height - paddingBottom - (300 / maxVal) * chartHeight);
  }

  function setAirQualityScenario(type) {
    stopAirQualityInterval();

    if (type === 'normal') {
      currentTemp = 25.2 + Math.random() * 1.5;
      currentHumidity = 50 + Math.random() * 5;
      currentMQ2 = 25 + Math.random() * 15;
      currentMQ7 = 4 + Math.random() * 4;
      currentMQ135 = 30 + Math.random() * 15;
      currentAQI = 35 + Math.random() * 12;
    } else if (type === 'moderate') {
      currentTemp = 28.5 + Math.random() * 2.0;
      currentHumidity = 62 + Math.random() * 6;
      currentMQ2 = 75 + Math.random() * 25;
      currentMQ7 = 18 + Math.random() * 8;
      currentMQ135 = 110 + Math.random() * 30;
      currentAQI = 78 + Math.random() * 18;
    } else if (type === 'high') {
      currentTemp = 32.1 + Math.random() * 2.5;
      currentHumidity = 74 + Math.random() * 8;
      currentMQ2 = 240 + Math.random() * 60;
      currentMQ7 = 65 + Math.random() * 20;
      currentMQ135 = 320 + Math.random() * 80;
      currentAQI = 230 + Math.random() * 50;
    }

    pushAQIData(currentAQI);
    updateAirQualityDashboard();
  }

  function pushAQIData(val) {
    aqiHistory.push(Math.round(val));
    if (aqiHistory.length > 14) {
      aqiHistory.shift();
    }
  }

  function startLiveTelemetry() {
    stopAirQualityInterval();
    airQualityTimer = setInterval(() => {
      // Add subtle random jitter
      currentTemp += (Math.random() - 0.48) * 0.4;
      currentHumidity += (Math.random() - 0.48) * 0.8;
      currentMQ2 += (Math.random() - 0.48) * 4;
      currentMQ7 += (Math.random() - 0.48) * 1.5;
      currentMQ135 += (Math.random() - 0.48) * 5;

      // Keep in reasonable bounds
      currentMQ2 = Math.max(10, currentMQ2);
      currentMQ7 = Math.max(1, currentMQ7);
      currentMQ135 = Math.max(15, currentMQ135);

      currentAQI = (currentMQ2 * 0.35 + currentMQ7 * 1.8 + currentMQ135 * 0.45);
      pushAQIData(currentAQI);
      updateAirQualityDashboard();
    }, 1200);
  }

  function stopAirQualityInterval() {
    if (airQualityTimer) {
      clearInterval(airQualityTimer);
      airQualityTimer = null;
    }
  }

  function initAirQualityChart() {
    setTimeout(() => {
      updateAirQualityDashboard();
    }, 100);
  }

  if (btnNormalAir) btnNormalAir.addEventListener('click', () => setAirQualityScenario('normal'));
  if (btnModAir) btnModAir.addEventListener('click', () => setAirQualityScenario('moderate'));
  if (btnHighAir) btnHighAir.addEventListener('click', () => setAirQualityScenario('high'));
  if (btnLiveAir) btnLiveAir.addEventListener('click', startLiveTelemetry);
  if (btnResetAir) btnResetAir.addEventListener('click', () => setAirQualityScenario('normal'));

  // ==========================================================================
  // PROJECT 3: Piezoelectric Footwear Power Generation Simulation
  // ==========================================================================
  let stepCount = 0;
  let instantaneousVoltage = 0.0;
  let cumulativeEnergy_mJ = 0.0;
  let capacitorVoltage = 0.0; // Max 5.0V
  let autoWalkTimer = null;

  const stepShoeBtn = document.getElementById('piezo-step-btn');
  const autoWalkBtn = document.getElementById('piezo-autowalk-btn');
  const resetPiezoBtn = document.getElementById('piezo-reset-btn');
  const dischargeBtn = document.getElementById('piezo-discharge-btn');

  const stepCountValEl = document.getElementById('piezo-step-val');
  const instVoltValEl = document.getElementById('piezo-volt-val');
  const energyValEl = document.getElementById('piezo-energy-val');
  const capVoltValEl = document.getElementById('piezo-cap-val');
  const capBarEl = document.getElementById('piezo-cap-bar');
  const lcdLine1El = document.getElementById('piezo-lcd-line1');
  const lcdLine2El = document.getElementById('piezo-lcd-line2');
  const shoeGraphicEl = document.getElementById('piezo-shoe-graphic');
  const loadLedEl = document.getElementById('piezo-load-led');

  function triggerPiezoStep() {
    stepCount++;

    // Generate random realistic footstep spike (3.2V - 5.8V peak)
    instantaneousVoltage = 3.2 + Math.random() * 2.6;

    // Energy per step E = 0.5 * C * V^2 (scaled realistically in mJ ~ 2.2mJ to 3.8mJ)
    const stepEnergy = 1.8 + Math.random() * 1.6;
    cumulativeEnergy_mJ += stepEnergy;

    // Capacitor accumulation (asymptotic approach to 5.0V max)
    if (capacitorVoltage < 5.0) {
      capacitorVoltage += (5.0 - capacitorVoltage) * 0.09;
    }

    // Spark & Disc Animation
    if (shoeGraphicEl) {
      shoeGraphicEl.classList.remove('step-active');
      void shoeGraphicEl.offsetWidth; // Reflow
      shoeGraphicEl.classList.add('step-active');
    }

    updatePiezoUI();
  }

  function updatePiezoUI() {
    if (stepCountValEl) stepCountValEl.textContent = stepCount;
    if (instVoltValEl) instVoltValEl.textContent = `${instantaneousVoltage.toFixed(2)} V`;
    if (energyValEl) energyValEl.textContent = `${cumulativeEnergy_mJ.toFixed(1)} mJ`;
    if (capVoltValEl) capVoltValEl.textContent = `${capacitorVoltage.toFixed(2)} V / 5.00 V`;

    if (capBarEl) {
      const pct = Math.min(100, Math.round((capacitorVoltage / 5.0) * 100));
      capBarEl.style.width = `${pct}%`;
    }

    // Simulated 16x2 LCD Matrix Screen Text
    if (lcdLine1El) {
      const stepStr = String(stepCount).padStart(3, '0');
      lcdLine1El.textContent = `STEP:${stepStr} | ${capacitorVoltage.toFixed(2)}V`;
    }
    if (lcdLine2El) {
      lcdLine2El.textContent = `NRG:${cumulativeEnergy_mJ.toFixed(1)}mJ RDY`;
    }

    // Output Load LED
    if (loadLedEl) {
      if (capacitorVoltage >= 3.0) {
        loadLedEl.className = 'load-led led-on';
        loadLedEl.title = 'Capacitor charged (>3.0V) - Ready to power emergency load';
      } else {
        loadLedEl.className = 'load-led led-off';
        loadLedEl.title = 'Charging... (Requires >3.0V)';
      }
    }
  }

  function toggleAutoWalking() {
    if (autoWalkTimer) {
      stopPiezoWalking();
    } else {
      if (autoWalkBtn) {
        autoWalkBtn.classList.add('active');
        autoWalkBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Walking';
      }
      autoWalkTimer = setInterval(() => {
        triggerPiezoStep();
      }, 550);
    }
  }

  function stopPiezoWalking() {
    if (autoWalkTimer) {
      clearInterval(autoWalkTimer);
      autoWalkTimer = null;
    }
    if (autoWalkBtn) {
      autoWalkBtn.classList.remove('active');
      autoWalkBtn.innerHTML = '<i class="fa-solid fa-person-walking"></i> Continuous Walking';
    }
  }

  function dischargeCapacitor() {
    if (capacitorVoltage > 0.5) {
      capacitorVoltage = 0.2;
      instantaneousVoltage = 0.0;
      updatePiezoUI();
    }
  }

  function resetPiezoSimulation() {
    stopPiezoWalking();
    stepCount = 0;
    instantaneousVoltage = 0.0;
    cumulativeEnergy_mJ = 0.0;
    capacitorVoltage = 0.0;
    updatePiezoUI();
  }

  if (stepShoeBtn) stepShoeBtn.addEventListener('click', triggerPiezoStep);
  if (autoWalkBtn) autoWalkBtn.addEventListener('click', toggleAutoWalking);
  if (resetPiezoBtn) resetPiezoBtn.addEventListener('click', resetPiezoSimulation);
  if (dischargeBtn) dischargeBtn.addEventListener('click', dischargeCapacitor);

  if (shoeGraphicEl) {
    shoeGraphicEl.addEventListener('click', triggerPiezoStep);
  }

  // Initial UI updates
  updateIrrigationUI();
  updateAirQualityDashboard();
  updatePiezoUI();

})();


