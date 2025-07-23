// main.js – Satellite Defense Toolkit Web UI Logic

document.addEventListener('DOMContentLoaded', () => {
  const modules = [
    {
      "name": "Firmware Memory Shield",
      "description": "Protects memory-mapped regions from OTA tampering",
      "category": "defense"
    },
    {
      "name": "Firewall Rule Generator",
      "description": "Generates hardened firewall rules from live traffic data",
      "category": "defense"
    },
    {
      "name": "GNSS Spoof Guard",
      "description": "Detects and mitigates GNSS spoofing attempts",
      "category": "defense"
    },
    {
      "name": "Firmware Integrity Watcher",
      "description": "Continuously checks firmware hash integrity",
      "category": "defense"
    },
    {
      "name": "Firmware Signature Validator",
      "description": "Validates digital signature of firmware images",
      "category": "defense"
    },
    {
      "name": "Firmware Rollback Protector",
      "description": "Prevents firmware downgrade attacks using signature chains",
      "category": "defense"
    },
    {
      "name": "Binary Integrity Watcher",
      "description": "Monitors and alerts on binary modification in space devices",
      "category": "defense"
    },
    {
      "name": "Passive Satellite Fingerprinter",
      "description": "Scans and fingerprints passive satellite RF activity",
      "category": "recon"
    },
    {
      "name": "SDR Burst Signal Detector",
      "description": "Detects burst RF emissions using SDR scan slices",
      "category": "recon"
    },
    {
      "name": "Satellite Telemetry Playback Tool",
      "description": "Plays back recorded telemetry datasets for forensics",
      "category": "forensics"
    },
    {
      "name": "Signal Artifact Timeline Builder",
      "description": "Generates a visual timeline of signal events",
      "category": "forensics"
    },
    {
      "name": "Firmware Anomaly Explainer",
      "description": "Classifies and explains firmware diffs using AI",
      "category": "forensics"
    },
    {
      "name": "Agent Commander",
      "description": "Send covert commands to agents via multiple channels",
      "category": "c2"
    },
    {
      "name": "Agent Receiver",
      "description": "Receives, decrypts and executes remote commands",
      "category": "c2"
    },
    {
      "name": "RF Stego Dropper",
      "description": "Push AES payloads via RF or audio steganography",
      "category": "c2"
    },
    {
      "name": "Dead-Drop Receiver",
      "description": "Polls NFC, QR, and passive drop zones for commands",
      "category": "c2"
    },
    {
      "name": "AIS Intrusion Monitor",
      "description": "Watches for suspicious changes in maritime AIS traffic",
      "category": "defense"
    },
    {
      "name": "GNSS Entropy Validator",
      "description": "Flags GNSS drift and noise inconsistency as anomalies",
      "category": "defense"
    },
    {
      "name": "Satellite Command Auth Layer",
      "description": "Adds cryptographic signing to satellite control channels",
      "category": "defense"
    },
    {
      "name": "Copilot Telemetry Anomaly Tagger",
      "description": "Uses LSTM and rules to classify telemetry anomalies",
      "category": "ai"
    },
    {
      "name": "RTCM Interceptor",
      "description": "Intercepts RTCM GNSS correction streams",
      "category": "recon"
    },
    {
      "name": "Fallback GNSS Beacon C2",
      "description": "Uses GNSS spoof frames as last-resort C2 beacon",
      "category": "c2"
    },
    {
      "name": "Timeline & Forensics Builder",
      "description": "Extracts and compiles forensic timelines from logs",
      "category": "forensics"
    },
    {
      "name": "Threat Intel & STIX Generator",
      "description": "Converts attack data into STIX 2.1 threat objects",
      "category": "intel"
    },
    {
      "name": "AI Anomaly Classifier",
      "description": "Labels incoming satellite telemetry with ML models",
      "category": "ai"
    }
  ];

  const moduleContainer = document.querySelector('#modules .cards');
  const filterButtons = document.querySelectorAll('.filter-bar button');

  function renderModules(category = 'all') {
    moduleContainer.innerHTML = ''; // Clear existing

    const filtered = category === 'all'
      ? modules
      : modules.filter(mod => mod.category === category);

    filtered.forEach(module => {
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

      moduleContainer.appendChild(card);
    });
  }

  // Initial render
  renderModules();

  // Filter logic
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const category = button.getAttribute('data-filter');
      renderModules(category);
    });
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
