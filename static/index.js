// DaKeBox Client Reactive Logic Engine
document.addEventListener('DOMContentLoaded', () => {
  let activeTool = 'json';
  let systemEpoch = Math.floor(Date.now() / 1000);
  let ping = 12;

  // Initialize Ticking digital clock
  setInterval(() => {
    systemEpoch = Math.floor(Date.now() / 1000);
    const liveValSpan = document.getElementById('live-epoch-val');
    if (liveValSpan) {
      liveValSpan.textContent = systemEpoch;
    }
  }, 1000);

  // Initialize decorative latency metric
  setInterval(() => {
    ping = Math.floor(Math.random() * 8) + 8;
    const pingSpan = document.getElementById('ping-metric');
    if (pingSpan) {
      pingSpan.textContent = `核心延迟: ${ping}ms`;
    }
  }, 4000);

  // Core Tool Templates
  const TEMPLATES = {
    json: `
      <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 24px;">
        <header style="display: flex; flex-direction: column; gap: 4px;">
          <h3 style="font-family: var(--font-cyber); font-size: 1.4rem; color: #fff; letter-spacing: 0.05em;">JSON 格式化与校验</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">快速对原始 JSON 数据进行格式化、美化或压缩，支持智能语法检查与校验</p>
        </header>
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; padding: 16px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <label style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-cyber); letter-spacing: 0.05em;">缩进大小：</label>
            <select id="json-indent-select" style="width: auto; padding: 6px 12px; font-size: 0.85rem;">
              <option value="2">2 空格</option>
              <option value="4">4 空格</option>
              <option value="8">8 空格</option>
            </select>
          </div>
          <div style="display: flex; gap: 10px;">
            <button id="btn-json-sample" class="btn btn-secondary">加载示例</button>
            <button id="btn-json-format" class="btn">格式化</button>
            <button id="btn-json-minify" class="btn btn-secondary">压缩</button>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; min-height: 380px;">
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary); letter-spacing: 0.05em;">输入原始 JSON 数据</div>
            <textarea id="json-input" class="code-editor" style="flex: 1; min-height: 280px;" placeholder="在此处输入或粘贴您的原始 JSON 字符串..."></textarea>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary); letter-spacing: 0.05em;">
              <span>结构化输出结果</span>
              <button id="btn-json-copy" class="copy-btn" style="display: none;">复制结果</button>
            </div>
            <div id="json-error-container" style="display: none; flex: 1; background: rgba(239, 68, 68, 0.05); border: 1px solid var(--border-neon-red); border-radius: 6px; color: var(--border-neon-red); font-family: var(--font-mono); font-size: 0.85rem; padding: 16px; overflow-y: auto;"></div>
            <textarea id="json-output" class="code-editor" style="flex: 1; min-height: 280px;" readonly placeholder="格式化后的输出结果将在此处显示..."></textarea>
          </div>
        </div>
      </div>
    `,
    hash: `
      <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 24px;">
        <header style="display: flex; flex-direction: column; gap: 4px;">
          <h3 style="font-family: var(--font-cyber); font-size: 1.4rem; color: #fff; letter-spacing: 0.05em;">密码哈希与 Base64 编码/解码</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">安全地计算 MD5、SHA-256 哈希摘要，或对字符串进行 Base64 双向编码与解码</p>
        </header>
        <div style="display: grid; grid-template-columns: 1fr 200px 1fr; gap: 24px; align-items: stretch; min-height: 380px;">
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <label style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary); padding-left: 4px;">输入明文原始字符串</label>
            <textarea id="hash-input" class="code-editor" style="flex: 1; min-height: 280px;" placeholder="在此处输入或粘贴需要处理的文本内容..."></textarea>
          </div>
          <div style="display: flex; flex-direction: column; justify-content: center; gap: 20px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 20px 16px; align-self: center;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label style="font-family: var(--font-cyber); font-size: 0.75rem; color: var(--text-cyber);">选择转换算法：</label>
              <select id="hash-algo-select" style="width: 100%; padding: 8px; font-size: 0.85rem;">
                <option value="md5">MD5 哈希</option>
                <option value="sha256">SHA-256 哈希</option>
                <option value="base64_encode">Base64 编码</option>
                <option value="base64_decode">Base64 解码</option>
              </select>
            </div>
            <button id="btn-hash-run" class="btn" style="width: 100%;">执行转换</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary); padding-left: 4px;">转换后的输出结果</label>
              <button id="btn-hash-copy" class="copy-btn" style="display: none;">复制结果</button>
            </div>
            <div id="hash-error-container" style="display: none; background: rgba(239, 68, 68, 0.05); border: 1px solid var(--border-neon-red); border-radius: 6px; color: var(--border-neon-red); font-family: var(--font-mono); font-size: 0.85rem; padding: 16px;"></div>
            <textarea id="hash-output" class="code-editor" style="flex: 1; min-height: 280px;" readonly placeholder="转换后的哈希或 Base64 结果将在此处显示..."></textarea>
          </div>
        </div>
      </div>
    `,
    timestamp: `
      <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 24px;">
        <header style="display: flex; flex-direction: column; gap: 4px;">
          <h3 style="font-family: var(--font-cyber); font-size: 1.4rem; color: #fff; letter-spacing: 0.05em;">UNIX 时间戳转换</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">将 UNIX 纪元时间戳与人类易读的日期时间字符串进行双向快速互相转换</p>
        </header>
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <span style="font-family: var(--font-cyber); font-size: 0.75rem; color: var(--text-cyber); letter-spacing: 0.05em;">当前系统时间戳（秒）：</span>
            <span id="live-epoch-val" style="font-size: 2rem; fontFamily: var(--font-cyber); font-weight: 800; color: #fff; letter-spacing: 0.05em; text-shadow: 0 0 10px rgba(0, 255, 102, 0.3);">0</span>
          </div>
          <button id="btn-ts-sync" class="btn btn-secondary" style="height: fit-content; padding: 8px 16px; font-size: 0.8rem;">同步当前时间</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary);">输入待转换的值</label>
              <input type="text" id="ts-input" placeholder="例如：1780061947 或 2026-05-29 21:51:40" />
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary);">选择转换方向</label>
              <select id="ts-direction-select">
                <option value="auto">智能自动识别格式</option>
                <option value="ts_to_date">时间戳 ➔ 日期时间字符串</option>
                <option value="date_to_ts">日期时间字符串 ➔ 时间戳</option>
              </select>
            </div>
          </div>
          <button id="btn-ts-run" class="btn" style="align-self: flex-start;">执行转换</button>
          <div id="ts-error-container" style="display: none; background: rgba(239, 68, 68, 0.05); border: 1px solid var(--border-neon-red); border-radius: 6px; color: var(--border-neon-red); padding: 16px; font-size: 0.85rem; font-family: var(--font-mono);"></div>
          <div id="ts-result-container" style="display: none; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px; margin-top: 8px;">
            <h4 style="font-family: var(--font-cyber); font-size: 0.9rem; color: var(--border-neon-green); margin-bottom: 16px;">转换结果 // 计算完成</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: grid; grid-template-columns: 180px 1fr; align-items: center; gap: 16px;">
                <span style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary);">UNIX 时间戳（秒）：</span>
                <span id="ts-result-sec" style="font-family: var(--font-mono); padding: 8px 12px; background: rgba(0,0,0,0.3); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem; color: #fff;"></span>
              </div>
              <div style="display: grid; grid-template-columns: 180px 1fr; align-items: center; gap: 16px;">
                <span style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary);">日期时间格式（UTC）：</span>
                <span id="ts-result-str" style="font-family: var(--font-mono); padding: 8px 12px; background: rgba(0,0,0,0.3); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem; color: #fff;"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    regex: `
      <div class="animate-fade-in" style="display: flex; flex-direction: column; gap: 24px;">
        <header style="display: flex; flex-direction: column; gap: 4px;">
          <h3 style="font-family: var(--font-cyber); font-size: 1.4rem; color: #fff; letter-spacing: 0.05em;">正则表达式测试与分组解析</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">编写正则表达式，实时可视化查看文本高亮匹配细节和捕获组的提取分析</p>
        </header>
        <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; min-height: 450px;">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary);">正则表达式 (PATTERN)</label>
                <input type="text" id="regex-pattern-input" value="([a-zA-Z0-9._%-]+)@([a-zA-Z0-9.-]+)\\\\.([a-zA-Z]{2,6})" style="font-family: var(--font-mono); font-size: 0.95rem;" />
              </div>
              <div style="width: 120px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary);">修饰符 (FLAGS)</label>
                <input type="text" id="regex-flags-input" value="g" style="font-family: var(--font-mono); font-size: 0.95rem;" />
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary);">待测试的目标文本</label>
              <textarea id="regex-text-input" style="min-height: 100px; resize: vertical;" placeholder="输入或粘贴需要匹配解析的源文本...">请通过邮箱 darkguo1217@gmail.com 联系作者大可，本测试文本将用于正则匹配演示！</textarea>
            </div>
            <div id="regex-error-container" style="display: none; background: rgba(239, 68, 68, 0.05); border: 1px solid var(--border-neon-red); border-radius: 6px; color: var(--border-neon-red); padding: 12px; font-family: var(--font-mono); font-size: 0.85rem;"></div>
            <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
              <label style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary);">实时匹配项高亮预览</label>
              <div id="regex-highlight-view" style="flex: 1; background: rgba(0,0,0,0.4); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); padding: 16px; white-space: pre-wrap; word-break: break-all; font-size: 0.95rem; min-height: 120px; font-family: var(--font-mono); line-height: 1.5;"></div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="font-family: var(--font-cyber); font-size: 0.8rem; color: var(--text-secondary); padding-left: 4px;">
              <span>解析出的匹配项及分组 (<span id="regex-match-count">0</span>)</span>
            </div>
            <div id="regex-matches-list" style="display: flex; flex-direction: column; gap: 12px; flex: 1; overflow-y: auto; max-height: 480px; padding-right: 4px;"></div>
          </div>
        </div>
      </div>
    `
  };

  // Switch Active tool rendering
  function renderTool(toolId) {
    activeTool = toolId;
    const workspace = document.getElementById('workspace-container');
    const renderArea = document.getElementById('tool-render-area');
    
    // Clear and update workspace classes
    workspace.className = `cyber-workspace tool-${toolId}`;
    renderArea.innerHTML = TEMPLATES[toolId];

    // Load active setups
    if (toolId === 'json') {
      setupJSONFormatter();
    } else if (toolId === 'hash') {
      setupHashEncoder();
    } else if (toolId === 'timestamp') {
      setupTimestampConverter();
    } else if (toolId === 'regex') {
      setupRegexTester();
    }
  }

  // Bind Grid Card listeners
  document.querySelectorAll('.cyber-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.cyber-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const toolId = card.getAttribute('data-tool');
      renderTool(toolId);
    });
  });

  // ----------------- JSON Formatter Event Binds -----------------
  function setupJSONFormatter() {
    const inputArea = document.getElementById('json-input');
    const outputArea = document.getElementById('json-output');
    const indentSelect = document.getElementById('json-indent-select');
    const errBox = document.getElementById('json-error-container');
    const copyBtn = document.getElementById('btn-json-copy');

    document.getElementById('btn-json-sample').onclick = () => {
      inputArea.value = JSON.stringify({
        appName: "DaKeBox",
        version: "1.0.0",
        description: "快速且高颜值的高效开发者小工具箱",
        features: ["JSON 格式化", "MD5 & SHA 哈希加密", "时间戳双向转换", "正则表达式测试"],
        isActive: true,
        stats: { uptime: "99.9%", responseTimeMs: 12 }
      }, null, 2);
      inputArea.focus();
    };

    async function processJson(minify = false) {
      errBox.style.display = 'none';
      outputArea.style.display = 'block';
      outputArea.value = '';
      copyBtn.style.display = 'none';
      
      const content = inputArea.value.trim();
      if (!content) return;

      try {
        const response = await fetch('/api/formatters/json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            indent: parseInt(indentSelect.value),
            minify
          })
        });
        const data = await response.json();
        if (data.success) {
          outputArea.value = data.result;
          copyBtn.style.display = 'block';
          fetchHistoryFeed(); // Refresh persistent SQLite log feed
        } else {
          outputArea.style.display = 'none';
          errBox.style.display = 'block';
          errBox.textContent = data.error || '格式化失败';
        }
      } catch (err) {
        outputArea.style.display = 'none';
        errBox.style.display = 'block';
        errBox.textContent = '连接后端格式化服务失败。';
      }
    }

    document.getElementById('btn-json-format').onclick = () => processJson(false);
    document.getElementById('btn-json-minify').onclick = () => processJson(true);

    copyBtn.onclick = () => {
      if (!outputArea.value) return;
      navigator.clipboard.writeText(outputArea.value);
      copyBtn.textContent = '复制成功';
      setTimeout(() => {
        copyBtn.textContent = '复制结果';
      }, 2000);
    };
  }

  // ----------------- Hash Encoder Event Binds -----------------
  function setupHashEncoder() {
    const inputArea = document.getElementById('hash-input');
    const outputArea = document.getElementById('hash-output');
    const algoSelect = document.getElementById('hash-algo-select');
    const errBox = document.getElementById('hash-error-container');
    const copyBtn = document.getElementById('btn-hash-copy');

    document.getElementById('btn-hash-run').onclick = async () => {
      errBox.style.display = 'none';
      outputArea.style.display = 'block';
      outputArea.value = '';
      copyBtn.style.display = 'none';

      const content = inputArea.value;
      if (!content) return;

      try {
        const response = await fetch('/api/encoders/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            algorithm: algoSelect.value
          })
        });
        const data = await response.json();
        if (data.success) {
          outputArea.value = data.result;
          copyBtn.style.display = 'block';
          fetchHistoryFeed(); // Refresh persistent SQLite log feed
        } else {
          outputArea.style.display = 'none';
          errBox.style.display = 'block';
          errBox.textContent = data.error || '数据转换失败';
        }
      } catch (err) {
        outputArea.style.display = 'none';
        errBox.style.display = 'block';
        errBox.textContent = '连接哈希加密服务失败。';
      }
    };

    copyBtn.onclick = () => {
      if (!outputArea.value) return;
      navigator.clipboard.writeText(outputArea.value);
      copyBtn.textContent = '复制成功';
      setTimeout(() => {
        copyBtn.textContent = '复制结果';
      }, 2000);
    };
  }

  // ----------------- Timestamp Converter Event Binds -----------------
  function setupTimestampConverter() {
    const input = document.getElementById('ts-input');
    const directionSelect = document.getElementById('ts-direction-select');
    const errBox = document.getElementById('ts-error-container');
    const resultBox = document.getElementById('ts-result-container');
    const resultSec = document.getElementById('ts-result-sec');
    const resultStr = document.getElementById('ts-result-str');

    // Force ticking value load
    const liveValSpan = document.getElementById('live-epoch-val');
    if (liveValSpan) liveValSpan.textContent = systemEpoch;

    document.getElementById('btn-ts-sync').onclick = () => {
      input.value = systemEpoch;
      input.focus();
    };

    document.getElementById('btn-ts-run').onclick = async () => {
      errBox.style.display = 'none';
      resultBox.style.display = 'none';

      const value = input.value.trim();
      if (!value) return;

      try {
        const response = await fetch('/api/converters/timestamp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            value,
            direction: directionSelect.value
          })
        });
        const data = await response.json();
        if (data.success) {
          resultBox.style.display = 'block';
          resultSec.textContent = data.timestamp_seconds;
          resultStr.textContent = data.datetime_str;
          fetchHistoryFeed(); // Refresh persistent SQLite log feed
        } else {
          errBox.style.display = 'block';
          errBox.textContent = data.error || '时间戳转换失败';
        }
      } catch (err) {
        errBox.style.display = 'block';
        errBox.textContent = '连接时间戳转换服务失败。';
      }
    };
  }

  // ----------------- Regex Tester Event Binds -----------------
  function setupRegexTester() {
    const patternInput = document.getElementById('regex-pattern-input');
    const flagsInput = document.getElementById('regex-flags-input');
    const textInput = document.getElementById('regex-text-input');
    const errBox = document.getElementById('regex-error-container');
    const highlightView = document.getElementById('regex-highlight-view');
    const countSpan = document.getElementById('regex-match-count');
    const listContainer = document.getElementById('regex-matches-list');

    function executeRegex() {
      errBox.style.display = 'none';
      highlightView.innerHTML = '';
      countSpan.textContent = '0';
      listContainer.innerHTML = '';

      const regexStr = patternInput.value;
      const flags = flagsInput.value;
      const testText = textInput.value;

      if (!regexStr) {
        highlightView.textContent = testText;
        return;
      }

      try {
        const regex = new RegExp(regexStr, flags.includes('g') ? flags : flags + 'g');
        let matches = [];
        let match;
        let lastIndex = -1;

        while ((match = regex.exec(testText)) !== null) {
          if (regex.lastIndex === lastIndex) {
            regex.lastIndex++;
          }
          lastIndex = regex.lastIndex;

          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });

          if (!regex.global) break;
        }

        countSpan.textContent = matches.length;

        // Render visual highlighted view
        if (matches.length === 0) {
          highlightView.textContent = testText;
          listContainer.innerHTML = '<div class="empty-matches">未匹配到任何结果。</div>';
          return;
        }

        // Highlight HTML rendering
        let highlightedNodes = [];
        let currentIdx = 0;
        
        const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
        sortedMatches.forEach((m, idx) => {
          // Append raw preceding text
          highlightedNodes.push(document.createTextNode(testText.slice(currentIdx, m.index)));
          
          // Append neon highlighted segment span
          const span = document.createElement('span');
          span.style.backgroundColor = 'rgba(255, 0, 102, 0.25)';
          span.style.color = '#fff';
          span.style.borderRadius = '3px';
          span.style.padding = '1px 3px';
          span.style.borderBottom = '2px solid var(--border-neon-red)';
          span.textContent = m.text;
          highlightedNodes.push(span);
          
          currentIdx = m.index + m.text.length;
        });
        highlightedNodes.push(document.createTextNode(testText.slice(currentIdx)));
        
        highlightView.innerHTML = '';
        highlightedNodes.forEach(node => highlightView.appendChild(node));

        // Render card results list
        matches.forEach((m, idx) => {
          const card = document.createElement('div');
          card.className = 'match-card';
          
          let groupsHtml = '';
          if (m.groups.length > 0) {
            groupsHtml = `
              <div class="groups-container">
                <div class="groups-label">子表达式捕获分组：</div>
                ${m.groups.map((g, gIdx) => `
                  <div class="group-row">
                    <span class="group-index">捕获组 ${gIdx + 1}:</span>
                    <span class="group-val">${g || 'undefined'}</span>
                  </div>
                `).join('')}
              </div>
            `;
          }

          card.innerHTML = `
            <div class="match-meta">
              <span class="match-badge">匹配项 #${idx + 1}</span>
              <span class="match-index">起始位置 // ${m.index}</span>
            </div>
            <div class="match-text">${m.text}</div>
            ${groupsHtml}
          `;
          listContainer.appendChild(card);
        });

      } catch (err) {
        highlightView.textContent = testText;
        errBox.style.display = 'block';
        errBox.textContent = err.message;
      }
    }

    // Bind real-time input keypress matching
    patternInput.oninput = executeRegex;
    flagsInput.oninput = executeRegex;
    textInput.oninput = executeRegex;

    // Trigger initial execution
    executeRegex();
  }

  // ----------------- SQLite3 Execution Log Feed Fetcher -----------------
  async function fetchHistoryFeed() {
    const feedContainer = document.getElementById('history-feed-area');
    if (!feedContainer) return;

    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      
      if (data.length === 0) {
        feedContainer.innerHTML = '<div class="history-empty">暂无数据库运行流水记录。请在上方执行工具进行保存！</div>';
        return;
      }

      feedContainer.innerHTML = '';
      data.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'history-row';

        let badgeClass = 'badge-json';
        let toolName = 'JSON格式化';
        if (row.tool_type === 'hash') {
          badgeClass = 'badge-hash';
          toolName = '哈希加密';
        } else if (row.tool_type === 'timestamp') {
          badgeClass = 'badge-timestamp';
          toolName = '时间转换';
        } else if (row.tool_type === 'regex') {
          badgeClass = 'badge-regex';
          toolName = '正则解析';
        }

        // Format dates into readable micro text (YYYY-MM-DD HH:MM)
        const dateObj = new Date(row.created_at + "Z");
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hrs = String(dateObj.getHours()).padStart(2, '0');
        const mins = String(dateObj.getMinutes()).padStart(2, '0');
        const formattedTime = `${month}-${day} ${hrs}:${mins}`;

        // Sanitize string HTML
        const safeInput = row.input_preview.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeOutput = row.output_preview.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        rowDiv.innerHTML = `
          <span class="history-badge ${badgeClass}">${toolName}</span>
          <span class="history-preview">输入: <span>${safeInput}</span> | 输出: <span>${safeOutput}</span></span>
          <span class="history-time">${formattedTime}</span>
        `;
        feedContainer.appendChild(rowDiv);
      });

    } catch (err) {
      feedContainer.innerHTML = '<div class="history-empty">读取数据库流水记录失败。</div>';
    }
  }

  // Boot: Initial render and history feed pull
  renderTool('json');
  fetchHistoryFeed();
});
