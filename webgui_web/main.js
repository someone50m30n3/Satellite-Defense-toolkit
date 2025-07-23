// main.js – Satellite Defense Toolkit Web UI Logic

document.addEventListener('DOMContentLoaded', () => {
  const moduleCards = document.querySelectorAll('.card');
  const filterButtons = document.querySelectorAll('.filter-bar button');
  const moduleContainer = document.getElementById('modules');
  const agentDropdown = document.getElementById('agent-select');
  const copilotInput = document.getElementById('copilot-input');
  const copilotSubmit = document.getElementById('copilot-submit');
  const auditLogContainer = document.getElementById('audit-logs');
  const ctx = document.getElementById('chart').getContext('2d');

  // WebSocket Log Stream
  const socket = new WebSocket(`ws://${location.host}/ws`);
  socket.onmessage = (event) => {
    const logDiv = document.getElementById('live-logs');
    const line = document.createElement('div');
    line.textContent = `[+] ${event.data}`;
    logDiv.appendChild(line);
    logDiv.scrollTop = logDiv.scrollHeight;
  };

  // Module Filtering by Tag
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      moduleCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Load Modules
  fetch('/api/modules')
    .then(res => res.json())
    .then(modules => {
      modules.forEach(module => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.category = module.category;

        const title = document.createElement('h3');
        title.textContent = module.name;

        const desc = document.createElement('p');
        desc.textContent = module.description;

        const tag = document.createElement('span');
        tag.className = 'module-tag';
        tag.textContent = module.category;

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(tag);

        card.addEventListener('click', () => runModule(module.name));

        moduleContainer.querySelector('.cards').appendChild(card);
      });
    });

  // Load Agents
  fetch('/api/agents')
    .then(res => res.json())
    .then(agents => {
      agents.forEach(agent => {
        const option = document.createElement('option');
        option.value = agent.id;
        option.textContent = `${agent.name} (${agent.ip})`;
        agentDropdown.appendChild(option);
      });
    });

  // Run Module
  function runModule(moduleName) {
    const agentId = agentDropdown.value;
    if (!agentId) return alert('Select an agent first.');

    fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module: moduleName, agent: agentId })
    })
    .then(res => res.json())
    .then(resp => {
      if (resp.success) {
        appendLog(`[✓] Module ${moduleName} launched on ${agentId}`);
      } else {
        appendLog(`[!] Failed: ${resp.error}`);
      }
    });
  }

  // Append log to live feed
  function appendLog(msg) {
    const logDiv = document.getElementById('live-logs');
    const line = document.createElement('div');
    line.textContent = msg;
    logDiv.appendChild(line);
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  // Copilot Submit
  copilotSubmit.addEventListener('click', () => {
    const input = copilotInput.value.trim();
    if (!input) return;

    fetch('/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input })
    })
    .then(res => res.json())
    .then(data => {
      appendLog(`[Copilot] ${data.response}`);
    });
  });

  // Load Audit Logs
  fetch('/api/audit')
    .then(res => res.json())
    .then(logs => {
      logs.forEach(entry => {
        const row = document.createElement('div');
        row.textContent = `${entry.timestamp} – ${entry.event}`;
        auditLogContainer.appendChild(row);
      });
    });

  // Render Chart.js Metrics (dummy data initially)
  const telemetryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['00:00', '00:05', '00:10', '00:15'],
      datasets: [{
        label: 'Telemetry',
        data: [5, 9, 3, 7],
        borderColor: '#0ff',
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true },
        y: { display: true }
      }
    }
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
