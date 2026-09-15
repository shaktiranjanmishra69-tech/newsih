// MediKiosk SIH 2026 - Main Application Controller

let state = {
  currentView: 'kiosk',
  currentStep: 1,
  currentLang: 'en-IN',
  isAyushMode: false,
  isListening: false,
  patientData: {
    name: 'Ramesh Singh',
    age: 48,
    gender: 'Male',
    abhaId: '14-9920-3341-8812',
    tokenNo: 'OPD-18',
    complaint: null,
    answers: {},
    otherSymptoms: '',
    selectedChips: [],
    customMedications: '',
    descriptiveNarrative: '',
    aiAllottedDoctor: null,
    docId: null
  },
  queue: [...MEDIKIOSK_DATA.demoCases.map(c => ({...c.patient, badge: c.badge, color: c.color}))],
  activeQueuePatientIndex: 0
};

// Web Speech API
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    const transcriptEl = document.getElementById('voice-transcript');
    if (transcriptEl) {
      transcriptEl.innerText = `"${transcript}"`;
    }
    if (event.results[0].isFinal) {
      handleVoiceAnswer(transcript);
      stopListening();
    }
  };

  recognition.onerror = () => {
    stopListening();
  };

  recognition.onend = () => {
    stopListening();
  };
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  if (typeof MEDIKIOSK_DATA !== 'undefined' && MEDIKIOSK_DATA.chiefComplaints) {
    const exists = MEDIKIOSK_DATA.chiefComplaints.some(c => c.id === 'other_medical_issue');
    if (!exists) {
      MEDIKIOSK_DATA.chiefComplaints.push({
        id: 'other_medical_issue',
        title: 'Other Medical Issue (AI Doctor Allotment)',
        titleHi: 'अन्य चिकित्सा समस्या (AI डॉक्टर आवंटन)',
        icon: '🤖',
        category: 'AI Specialist Allotment',
        description: 'Describe your illness in detail; AI will analyze text & allot the specialized doctor'
      });
    }
  }
  renderStep();
  renderQueue();
  selectQueuePatient(0);
});

// View Switching
function switchView(viewName) {
  state.currentView = viewName;
  document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-tab-btn').forEach(el => el.classList.remove('active'));

  document.getElementById(`view-${viewName}`).classList.add('active');
  document.getElementById(`tab-${viewName}`).classList.add('active');
}

// Language Switching
function changeLanguage(langCode) {
  state.currentLang = langCode;
  if (recognition) {
    recognition.lang = langCode;
  }
  const dict = MEDIKIOSK_DATA.translations[langCode] || MEDIKIOSK_DATA.translations['en-IN'];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerText = dict[key];
    }
  });

  renderStep();
}

// AYUSH Mode Toggle
function toggleAyushMode() {
  const checkbox = document.getElementById('ayush-checkbox');
  state.isAyushMode = checkbox.checked;
  renderStep();
}

// Speech Recognition Toggle
function toggleSpeech() {
  if (!recognition) {
    alert("Speech recognition is not supported in this browser environment. Using touch mode.");
    return;
  }

  if (state.isListening) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  if (!recognition) return;
  state.isListening = true;
  recognition.lang = state.currentLang;
  try {
    recognition.start();
  } catch (e) {
    console.log(e);
  }
  const micBtn = document.getElementById('mic-btn');
  const waveform = document.getElementById('waveform');
  if (micBtn) micBtn.classList.add('listening');
  if (waveform) waveform.style.display = 'flex';

  speakPrompt("I am listening. Please speak your answer.");
}

function stopListening() {
  state.isListening = false;
  if (recognition) {
    try { recognition.stop(); } catch(e){}
  }
  const micBtn = document.getElementById('mic-btn');
  const waveform = document.getElementById('waveform');
  if (micBtn) micBtn.classList.remove('listening');
  if (waveform) waveform.style.display = 'none';
}

function speakPrompt(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.currentLang;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
}

// Wizard Step Navigation
function renderStep() {
  const container = document.getElementById('kiosk-body');
  const stepTitle = document.getElementById('kiosk-step-title');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');

  // Update step dots
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) {
      dot.className = 'step-dot';
      if (i < state.currentStep) dot.classList.add('completed');
      if (i === state.currentStep) dot.classList.add('active');
    }
  }

  prevBtn.disabled = state.currentStep === 1;

  if (state.currentStep === 1) {
    // Step 1: Select Chief Complaint
    stepTitle.innerText = "Step 1: Patient Verification & Chief Complaint";
    let html = `
      <div class="question-card">
        <h2 class="question-title">What is your primary medical concern today?</h2>
        <p class="question-subtitle">Select your chief complaint below or tap the microphone to speak naturally.</p>
        
        <div class="voice-box">
          <button id="mic-btn" class="voice-mic-btn" onclick="toggleSpeech()">🎙️</button>
          <div id="waveform" class="waveform" style="display: none;">
            <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
          </div>
          <div id="voice-transcript" class="transcript-text">Tap mic to speak (e.g. "I have severe chest pain since morning")</div>
        </div>

        <div class="options-grid">
    `;

    MEDIKIOSK_DATA.chiefComplaints.forEach(item => {
      const isSelected = state.patientData.complaint === item.id;
      const title = state.currentLang.startsWith('hi') ? item.titleHi : item.title;
      const isAiCard = item.id === 'other_medical_issue';

      html += `
        <div class="option-card ${isSelected ? 'selected' : ''} ${isAiCard ? 'ai-special-card' : ''}" onclick="selectComplaint('${item.id}')">
          <div class="option-icon">${item.icon}</div>
          <div>
            <div style="${isAiCard ? 'color: #c4b5fd; font-weight: 700;' : ''}">${title}</div>
            <div style="font-size: 11px; color: var(--text-muted); font-weight: normal;">${item.description}</div>
          </div>
        </div>
      `;
    });

    html += `</div>`;

    // Render AI Doctor Allotment Section always available on Step 1
    const isHi = state.currentLang.startsWith('hi');
    const isAiSelected = state.patientData.complaint === 'other_medical_issue';
    const currentNarrative = state.patientData.descriptiveNarrative || '';
    const allottedDoc = state.patientData.aiAllottedDoctor || classifyDoctorByAI(currentNarrative);

    html += `
      <div class="other-symptoms-box" style="border: 1px solid ${isAiSelected ? '#8b5cf6' : 'rgba(139, 92, 246, 0.4)'}; background: ${isAiSelected ? 'rgba(139, 92, 246, 0.12)' : 'rgba(15, 23, 42, 0.85)'}; margin-top: 20px;">
        <div class="other-symptoms-header">
          <div class="other-symptoms-title" style="color: #a78bfa;">
            <span>🤖</span>
            <span>${isHi ? 'अन्य चिकित्सा समस्या - विस्तृत AI डॉक्टर आवंटन' : 'Other Medical Issue - Descriptive AI Doctor Allotment'}</span>
          </div>
          <span class="ai-allotment-badge">${isHi ? 'AI विश्लेषक सक्रिय' : 'AI Classifier Active'}</span>
        </div>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px; text-align: left;">
          ${isHi ? 'यदि आपकी बीमारी ऊपर सूचीबद्ध नहीं है, तो यहाँ विस्तृत विवरण दें। AI इसका विश्लेषण करके आपके लिए उपयुक्त विशेषज्ञ डॉक्टर आवंटित करेगा:' : 'If your medical issue is not listed above, describe your symptoms in detail here. AI will analyze your text and automatically allot a specialized doctor:'}
        </p>

        <textarea id="descriptive-narrative-input" class="other-symptoms-textarea" style="border-color: rgba(139, 92, 246, 0.5);" 
          placeholder="${isHi ? 'अपनी बीमारी का विस्तार से वर्णन करें (जैसे घुटने के जोड़ में तेज दर्द और चलने में कठिनाई, त्वचा पर लाल चकत्ते और खुजली, आंख में धुंधलापन)...' : 'Describe your illness in detail (e.g. Sharp pain in right knee joint while walking for 3 days, skin rash with itching, blurred vision in right eye)...'}" 
          oninput="state.patientData.complaint = 'other_medical_issue'; updateDescriptiveNarrative(this.value)">${currentNarrative}</textarea>

        <div id="ai-allotment-result" class="ai-allotment-box">
          <div class="ai-allotment-header">
            <strong style="color: #a78bfa; font-size: 14px;">🤖 ${isHi ? 'AI विशेषज्ञ डॉक्टर आवंटन परिणाम:' : 'AI Specialist Doctor Allotment Result:'}</strong>
            <span class="ai-allotment-badge">${allottedDoc.department}</span>
          </div>
          <div style="font-size: 14px; margin-top: 6px; text-align: left;">
            <div><strong>Assigned Specialist:</strong> ${allottedDoc.icon} <span style="color: #ffffff; font-weight: 700;">${allottedDoc.specialist}</span></div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">📍 Allotted Room: <strong>${allottedDoc.opdRoom}</strong></div>
          </div>
        </div>
      </div>
    `;

    // Render Other / Additional Symptoms Box Component
    const chipList = [
      { id: 'dizziness', label: isHi ? '💫 चक्कर आना' : '💫 Dizziness' },
      { id: 'nausea', label: isHi ? '🤮 उल्टी / मिचली' : '🤮 Nausea / Vomiting' },
      { id: 'fatigue', label: isHi ? '😴 थकान / कमजोरी' : '😴 Fatigue / Weakness' },
      { id: 'injury', label: '🩹 Injury / Trauma' },
      { id: 'chills', label: isHi ? '🤒 ठंड / कंपकंपी' : '🤒 Chills / Cold' },
      { id: 'throat', label: isHi ? '👄 गले में खराश' : '👄 Sore Throat' },
      { id: 'eye_ear', label: isHi ? '👁️ कान/आंख दर्द' : '👁️ Eye / Ear Pain' },
      { id: 'skin_rash', label: isHi ? '🧴 त्वचा चकत्ते' : '🧴 Skin Rash / Itching' },
      { id: 'stiffness', label: isHi ? '🦴 मांसपेशियों में जकड़न' : '🦴 Muscle Stiffness' }
    ];

    html += `
      <div class="other-symptoms-box">
        <div class="other-symptoms-header">
          <div class="other-symptoms-title">
            <span>✍️</span>
            <span>${isHi ? 'अन्य लक्षण और अतिरिक्त स्वास्थ्य नोट्स' : 'Other Symptoms & Additional Medical Notes'}</span>
          </div>
          <span style="font-size: 11px; color: var(--text-muted);">${isHi ? 'टैग चुनें या नीचे लिखें' : 'Select tag chips or type below'}</span>
        </div>

        <div class="symptom-chips-container">
          ${chipList.map(chip => {
            const isSel = (state.patientData.selectedChips || []).includes(chip.label);
            return `<button type="button" class="symptom-chip ${isSel ? 'selected' : ''}" onclick="toggleSymptomChip('${chip.label}')">${chip.label}</button>`;
          }).join('')}
        </div>

        <textarea id="other-symptoms-input" class="other-symptoms-textarea" 
          placeholder="${isHi ? 'यहाँ अन्य लक्षण लिखें (जैसे बाएं हाथ में दर्द, स्वाद न आना, सुबह अकड़न)...' : 'Type or describe any other symptoms or discomfort here (e.g., skin rash on left arm, loss of taste, joint stiffness in morning)...'}" 
          oninput="updateOtherSymptoms(this.value)">${state.patientData.otherSymptoms || ''}</textarea>
      </div>
    `;

    html += `</div>`;
    container.innerHTML = html;
  }
  else if (state.currentStep === 2) {
    // Step 2: Adaptive HPI Questions
    stepTitle.innerText = "Step 2: History of Present Illness (HPI)";
    const complaintId = state.patientData.complaint || 'chest_pain';
    const questions = MEDIKIOSK_DATA.adaptiveQuestions[complaintId] || MEDIKIOSK_DATA.adaptiveQuestions['chest_pain'];

    let html = `<div class="question-card">
      <div class="voice-box" style="margin-bottom: 16px;">
        <button id="mic-btn" class="voice-mic-btn" onclick="toggleSpeech()">🎙️</button>
        <div id="voice-transcript" class="transcript-text">Voice Dual Input Active</div>
      </div>
    `;

    questions.forEach(q => {
      const text = state.currentLang.startsWith('hi') ? q.textHi : q.text;
      html += `
        <div style="margin-bottom: 24px; text-align: left; background: rgba(30,41,59,0.5); padding: 16px; border-radius: 10px;">
          <h4 style="font-size: 16px; color: #fff; margin-bottom: 10px;">${text}</h4>
      `;

      if (q.type === 'choice' || q.type === 'multiselect') {
        html += `<div class="options-grid" style="margin-bottom: 0;">`;
        q.options.forEach(opt => {
          const isSel = Array.isArray(state.patientData.answers[q.id]) 
            ? state.patientData.answers[q.id].includes(opt)
            : state.patientData.answers[q.id] === opt;
          html += `
            <div class="option-card ${isSel ? 'selected' : ''}" style="padding: 12px 14px; font-size: 14px;" onclick="toggleAnswer('${q.id}', '${opt}', '${q.type}')">
              <span>${isSel ? '✓' : '⚪'}</span>
              <span>${opt}</span>
            </div>
          `;
        });
        html += `</div>`;
      } else if (q.type === 'scale') {
        const val = state.patientData.answers[q.id] || 5;
        html += `
          <div style="display: flex; align-items: center; gap: 16px;">
            <input type="range" min="${q.min}" max="${q.max}" value="${val}" style="flex: 1; accent-color: var(--primary);" oninput="updateScale('${q.id}', this.value)">
            <span style="font-size: 20px; font-weight: 700; color: var(--primary); min-width: 40px;">${val} / 10</span>
          </div>
        `;
      } else if (q.type === 'textarea') {
        const val = state.patientData.answers[q.id] || state.patientData.otherSymptoms || '';
        html += `
          <textarea class="other-symptoms-textarea" placeholder="${q.placeholder || 'Type details...'}" oninput="toggleAnswer('${q.id}', this.value, 'text'); updateOtherSymptoms(this.value)">${val}</textarea>
        `;
      }

      html += `</div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
  }
  else if (state.currentStep === 3) {
    // Step 3: Past History, Medications & AYUSH (if enabled)
    if (state.isAyushMode) {
      stepTitle.innerText = "Step 3: AYUSH Dashavidha Pariksha Intake";
      let html = `<div class="question-card"><h3 style="color: var(--accent-ayush); margin-bottom: 16px;">🌿 Ayurveda Clinical Intake</h3>`;
      MEDIKIOSK_DATA.ayushQuestions.forEach(q => {
        const text = state.currentLang.startsWith('hi') ? q.textHi : q.text;
        html += `
          <div style="margin-bottom: 20px; text-align: left; background: rgba(16,185,129,0.08); border: 1px solid var(--accent-ayush-glow); padding: 16px; border-radius: 10px;">
            <h4 style="font-size: 15px; color: var(--accent-ayush); margin-bottom: 10px;">${text}</h4>
            <div class="options-grid" style="margin-bottom: 0;">
        `;
        q.options.forEach(opt => {
          const isSel = state.patientData.answers[q.id] === opt;
          html += `
            <div class="option-card ${isSel ? 'selected' : ''}" style="padding: 10px 12px; font-size: 13px;" onclick="toggleAnswer('${q.id}', '${opt}', 'choice')">
              <span>${isSel ? '🌿' : '⚪'}</span>
              <span>${opt}</span>
            </div>
          `;
        });
        html += `</div></div>`;
      });
      html += `</div>`;
      container.innerHTML = html;
    } else {
      stepTitle.innerText = "Step 3: Past History & Current Medications";
      let html = `<div class="question-card">`;
      MEDIKIOSK_DATA.adaptiveQuestions['general_defaults'].forEach(q => {
        const text = state.currentLang.startsWith('hi') ? q.textHi : q.text;
        html += `
          <div style="margin-bottom: 24px; text-align: left; background: rgba(30,41,59,0.5); padding: 16px; border-radius: 10px;">
            <h4 style="font-size: 16px; color: #fff; margin-bottom: 10px;">${text}</h4>
            <div class="options-grid" style="margin-bottom: 0;">
        `;
        q.options.forEach(opt => {
          const isSel = Array.isArray(state.patientData.answers[q.id]) 
            ? state.patientData.answers[q.id].includes(opt)
            : state.patientData.answers[q.id] === opt;
          html += `
            <div class="option-card ${isSel ? 'selected' : ''}" style="padding: 12px 14px; font-size: 14px;" onclick="toggleAnswer('${q.id}', '${opt}', '${q.type}')">
              <span>${isSel ? '✓' : '⚪'}</span>
              <span>${opt}</span>
            </div>
          `;
        });
        html += `</div>`;

        if (q.id === 'medications') {
          const isHi = state.currentLang.startsWith('hi');
          html += `
            <div style="margin-top: 14px; background: rgba(15, 23, 42, 0.6); padding: 12px 16px; border-radius: 8px; border: 1px dashed var(--bg-card-border);">
              <label style="font-size: 13px; font-weight: 600; color: var(--primary); display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                <span>💊</span> <span>${isHi ? 'अन्य दवा का नाम व खुराक लिखें (वैकल्पिक):' : 'Add Other Medicine Name & Dosage (Optional):'}</span>
              </label>
              <input type="text" class="other-symptoms-textarea" style="min-height: 42px; height: 42px; padding: 8px 12px;" 
                placeholder="${isHi ? 'जैसे टैबलेट मोंटेयर-एलसी 10एमजी रात में, आई ड्रॉप्स, आयुर्वेदिक काढ़ा...' : 'e.g., Tab Montair-LC 10mg night, Eye drops, Ayurvedic Kashayam...'}" 
                value="${state.patientData.customMedications || ''}" 
                oninput="updateCustomMedications(this.value)" />
            </div>
          `;
        }

        html += `</div>`;
      });
      html += `</div>`;
      container.innerHTML = html;
    }
  }
  else if (state.currentStep === 4) {
    // Step 4: Summary & Doctor Dispatch
    stepTitle.innerText = "Step 4: Clinical History Ready";
    let html = `
      <div class="question-card">
        <div style="font-size: 50px; margin-bottom: 12px;">✅</div>
        <h2 class="question-title">Clinical History Record Completed</h2>
        <p class="question-subtitle">Your response has been structured, linked to ABHA ${state.patientData.abhaId}, and transmitted to the OPD Doctor Portal.</p>
        
        <div style="max-width: 500px; margin: 0 auto; background: rgba(30,41,59,0.8); padding: 20px; border-radius: 12px; text-align: left; border: 1px solid var(--bg-card-border);">
          <div style="font-weight: 700; color: var(--primary); margin-bottom: 8px;">Token Number: ${state.patientData.tokenNo}</div>
          <div><strong>Chief Complaint:</strong> ${state.patientData.complaint ? state.patientData.complaint.replace('_', ' ').toUpperCase() : 'General Checkup'}</div>
          <div><strong>ABHA Status:</strong> Verified & Linked</div>
          ${state.isAyushMode ? '<div style="color: var(--accent-ayush);"><strong>AYUSH Assessment:</strong> Prakriti Profile Included</div>' : ''}
        </div>

        <div style="margin-top: 24px;">
          <button class="btn btn-primary" style="margin: 0 auto;" onclick="submitToDoctorPortal()">Proceed to OPD Doctor View →</button>
        </div>
      </div>
    `;
    container.innerHTML = html;
  }
}

function selectComplaint(id) {
  state.patientData.complaint = id;
  checkRedFlags();
  renderStep();

  if (id === 'other_medical_issue') {
    setTimeout(() => {
      const inputEl = document.getElementById('descriptive-narrative-input');
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }
}

function toggleAnswer(qId, optionVal, type) {
  if (type === 'multiselect') {
    if (!Array.isArray(state.patientData.answers[qId])) {
      state.patientData.answers[qId] = [];
    }
    const idx = state.patientData.answers[qId].indexOf(optionVal);
    if (idx > -1) {
      state.patientData.answers[qId].splice(idx, 1);
    } else {
      state.patientData.answers[qId].push(optionVal);
    }
  } else {
    state.patientData.answers[qId] = optionVal;
  }
  checkRedFlags();
  renderStep();
}

function updateScale(qId, val) {
  state.patientData.answers[qId] = parseInt(val, 10);
  checkRedFlags();
  const labelEl = document.querySelector(`[oninput="updateScale('${qId}', this.value)"] + span`);
  if (labelEl) labelEl.innerText = `${val} / 10`;
}

function toggleSymptomChip(chipLabel) {
  if (!state.patientData.selectedChips) {
    state.patientData.selectedChips = [];
  }
  const idx = state.patientData.selectedChips.indexOf(chipLabel);
  if (idx > -1) {
    state.patientData.selectedChips.splice(idx, 1);
  } else {
    state.patientData.selectedChips.push(chipLabel);
  }
  renderStep();
}

function updateOtherSymptoms(val) {
  state.patientData.otherSymptoms = val;
}

function updateCustomMedications(val) {
  state.patientData.customMedications = val;
}

function classifyDoctorByAI(text) {
  if (!text || text.trim().length < 3) {
    return MEDIKIOSK_DATA.defaultDoctor || {
      department: 'Internal Medicine / General OPD',
      specialist: 'Dr. Ramesh Singh (MD Medicine)',
      opdRoom: 'General OPD Room 10',
      icon: '🏥'
    };
  }
  const lower = text.toLowerCase();
  
  let bestMatch = null;
  let maxScore = 0;

  const rules = MEDIKIOSK_DATA.aiDoctorRules || [];
  for (const rule of rules) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) {
        score += kw.length > 4 ? 2 : 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = rule;
    }
  }

  return bestMatch || MEDIKIOSK_DATA.defaultDoctor || {
    department: 'Internal Medicine / General OPD',
    specialist: 'Dr. Ramesh Singh (MD Medicine)',
    opdRoom: 'General OPD Room 10',
    icon: '🏥'
  };
}

function updateDescriptiveNarrative(val) {
  state.patientData.descriptiveNarrative = val;
  const allotted = classifyDoctorByAI(val);
  state.patientData.aiAllottedDoctor = allotted;

  const resultEl = document.getElementById('ai-allotment-result');
  if (resultEl) {
    resultEl.innerHTML = `
      <div class="ai-allotment-header">
        <strong style="color: #a78bfa; font-size: 14px;">🤖 AI Specialist Doctor Allotment Result:</strong>
        <span class="ai-allotment-badge">${allotted.department}</span>
      </div>
      <div style="font-size: 14px; margin-top: 6px;">
        <div><strong>Assigned Specialist:</strong> ${allotted.icon} <span style="color: #ffffff; font-weight: 700;">${allotted.specialist}</span></div>
        <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">📍 Allotted Room: <strong>${allotted.opdRoom}</strong></div>
      </div>
    `;
  }
}

function handleVoiceAnswer(text) {
  const lower = text.toLowerCase();
  if (lower.includes('chest') || lower.includes('pain') || lower.includes('heart')) {
    selectComplaint('chest_pain');
  } else if (lower.includes('fever') || lower.includes('cough') || lower.includes('cold')) {
    selectComplaint('fever_cough');
  } else if (lower.includes('sugar') || lower.includes('diabetes')) {
    selectComplaint('diabetes_check');
  } else if (lower.includes('stomach') || lower.includes('abdominal')) {
    selectComplaint('abdominal_pain');
  } else if (lower.includes('joint') || lower.includes('knee') || lower.includes('bone')) {
    selectComplaint('joint_pain');
  } else if (lower.includes('headache') || lower.includes('dizziness')) {
    selectComplaint('headache_dizziness');
  } else {
    selectComplaint('other_medical_issue');
    updateDescriptiveNarrative(text);
  }
}

function prevStep() {
  if (state.currentStep > 1) {
    state.currentStep--;
    renderStep();
  }
}

function nextStep() {
  if (state.currentStep < 4) {
    state.currentStep++;
    renderStep();
  }
}

// Red Flag Evaluation Engine
function checkRedFlags() {
  const answers = state.patientData.answers;
  for (const rule of MEDIKIOSK_DATA.redFlagRules) {
    if (rule.condition(answers)) {
      triggerRedFlagAlert(rule);
      return;
    }
  }
}

function triggerRedFlagAlert(rule) {
  document.getElementById('emergency-banner').style.display = 'flex';
  document.getElementById('emergency-banner-text').innerText = `${rule.alertTitle} - PATIENT TRIAGED TO EMERGENCY`;
  document.getElementById('red-flag-modal-msg').innerText = rule.alertMessage;
  document.getElementById('emergency-modal').classList.add('open');
  
  playSirenSound();
}

function closeEmergencyModal() {
  document.getElementById('emergency-modal').classList.remove('open');
}

function playSirenSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {
    console.log(e);
  }
}

// Module B: Document Scanner Intelligence
function triggerScan(docId) {
  const beam = document.getElementById('scanner-beam');
  const resultsContainer = document.getElementById('ocr-results');
  const placeholder = document.getElementById('ocr-placeholder');
  const content = document.getElementById('ocr-content');

  beam.classList.add('scanning');
  placeholder.innerText = "AI Document Scanner running OCR entity extraction...";

  setTimeout(() => {
    beam.classList.remove('scanning');
    placeholder.style.display = 'none';
    content.style.display = 'block';

    const doc = MEDIKIOSK_DATA.sampleDocuments.find(d => d.id === docId);
    if (!doc) return;

    state.patientData.docId = docId;

    let html = `
      <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Facility: ${doc.facility} | Date: ${doc.date}</div>
      <h4 style="font-size: 15px; color: #fff; margin-bottom: 12px;">Extracted: ${doc.title}</h4>
      
      <table class="param-table">
        <thead>
          <tr>
            <th>Parameter / Test</th>
            <th>Value</th>
            <th>Ref Range</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    doc.extractedData.parameters.forEach(p => {
      const badgeClass = p.status.includes('HIGH') || p.status.includes('CRITICAL') ? 'badge-high' : 'badge-normal';
      html += `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td>${p.value}</td>
          <td style="color: var(--text-muted);">${p.reference}</td>
          <td><span class="${badgeClass}">${p.status}</span></td>
        </tr>
      `;
    });

    html += `</tbody></table>
      <div style="margin-top: 16px; background: rgba(6, 182, 212, 0.1); border-left: 3px solid var(--primary); padding: 10px; border-radius: 4px; font-size: 13px;">
        <strong>AI Diagnostic Summary:</strong> ${doc.extractedData.aiSummary}
      </div>
    `;

    content.innerHTML = html;
  }, 1200);
}

// Module C: Doctor Portal & SOAP Note Engine
function submitToDoctorPortal() {
  const narrative = state.patientData.descriptiveNarrative || state.patientData.otherSymptoms || '';
  const allottedDoc = state.patientData.aiAllottedDoctor || classifyDoctorByAI(narrative);

  const currentPatientInQueue = {
    name: state.patientData.name,
    age: state.patientData.age,
    gender: state.patientData.gender,
    abhaId: state.patientData.abhaId,
    tokenNo: state.patientData.tokenNo,
    complaint: state.patientData.complaint,
    answers: state.patientData.answers,
    otherSymptoms: state.patientData.otherSymptoms,
    selectedChips: state.patientData.selectedChips,
    customMedications: state.patientData.customMedications,
    descriptiveNarrative: state.patientData.descriptiveNarrative,
    aiAllottedDoctor: allottedDoc,
    docId: state.patientData.docId,
    badge: state.patientData.complaint === 'other_medical_issue' ? `AI: ${allottedDoc.department.split(' ')[0]}` : 'Live Session',
    color: state.patientData.complaint === 'other_medical_issue' ? '#8b5cf6' : '#06b6d4'
  };

  state.queue.unshift(currentPatientInQueue);
  renderQueue();
  selectQueuePatient(0);
  switchView('doctor');
}

function renderQueue() {
  const container = document.getElementById('queue-list-container');
  const countBadge = document.getElementById('queue-count');
  if (!container) return;

  countBadge.innerText = `${state.queue.length} Patients`;

  let html = '';
  state.queue.forEach((p, idx) => {
    const isAct = idx === state.activeQueuePatientIndex;
    const isEmerg = p.badge && p.badge.includes('Emergency');
    html += `
      <div class="queue-item ${isAct ? 'active' : ''} ${isEmerg ? 'emergency' : ''}" onclick="selectQueuePatient(${idx})">
        <div>
          <div style="font-weight: 700; color: #fff; font-size: 14px;">${p.name} (${p.age}y / ${p.gender[0]})</div>
          <div style="font-size: 12px; color: var(--text-muted);">Token #${p.tokenNo} | ABHA: ${p.abhaId}</div>
        </div>
        <span style="font-size: 11px; background: ${p.color || '#3b82f6'}; color: #fff; padding: 2px 8px; border-radius: 10px; font-weight: 600;">${p.badge || 'OPD'}</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

function selectQueuePatient(idx) {
  state.activeQueuePatientIndex = idx;
  renderQueue();
  const p = state.queue[idx];
  if (!p) return;

  const card = document.getElementById('soap-card');
  if (!card) return;

  const isEmergency = p.badge && p.badge.includes('Emergency');

  let docText = 'No prior uploaded documents.';
  if (p.docId) {
    const d = MEDIKIOSK_DATA.sampleDocuments.find(doc => doc.id === p.docId);
    if (d) {
      docText = `Extracted from ${d.title} (${d.facility}): ${d.extractedData.aiSummary}`;
    }
  }

  const chipsText = (p.selectedChips && p.selectedChips.length > 0) ? p.selectedChips.join(', ') : '';
  const otherText = p.otherSymptoms || '';
  const combinedOther = [chipsText, otherText].filter(Boolean).join(' | ');
  const allottedDoc = p.aiAllottedDoctor || classifyDoctorByAI(p.descriptiveNarrative || p.otherSymptoms || p.answers?.omi_narrative || '');

  let html = `
    <div class="soap-header">
      <div>
        <h2>Physician SOAP Clinical Summary: ${p.name}</h2>
        <div style="color: #64748b; font-size: 13px;">Age: ${p.age} | Gender: ${p.gender} | ABHA ID: <strong>${p.abhaId}</strong> | Token: <strong>${p.tokenNo}</strong></div>
      </div>
      <div>
        <button class="btn btn-primary" style="padding: 6px 14px; font-size: 13px;" onclick="window.print()">🖨️ Print Summary</button>
      </div>
    </div>

    ${isEmergency ? '<div class="soap-badge-red">🚨 CRITICAL RED-FLAG ALERT: ACUTE CARDIAC SYMPTOMOLOGY DETECTED - IMMEDIATE ECG REQUIRED</div>' : ''}

    ${(p.complaint === 'other_medical_issue' || p.descriptiveNarrative || p.answers?.omi_narrative || p.aiAllottedDoctor) ? `
      <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(6, 182, 212, 0.12)); border: 1px solid #8b5cf6; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="background: #8b5cf6; color: #ffffff; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 700;">🤖 AI SPECIALIST DOCTOR ALLOTTED</span>
          <h4 style="font-size: 15px; color: #1e293b; margin: 4px 0 2px 0;">Allotted Department: ${allottedDoc.department}</h4>
          <div style="font-size: 13px; color: #475569;">Assigned Specialist: <strong>${allottedDoc.specialist}</strong> | 📍 ${allottedDoc.opdRoom}</div>
        </div>
        <div style="font-size: 32px;">${allottedDoc.icon}</div>
      </div>
    ` : ''}

    <div class="soap-section">
      <div class="soap-section-title">S - Subjective (Patient Clinical Intake)</div>
      <p><strong>Chief Complaint:</strong> ${p.complaint ? p.complaint.replace('_', ' ').toUpperCase() : 'General Health Evaluation'}</p>
      <ul style="margin-left: 20px; margin-top: 6px;">
  `;

  for (const [key, val] of Object.entries(p.answers || {})) {
    let formattedVal = Array.isArray(val) ? val.join(', ') : val;
    if (key === 'medications' && p.customMedications) {
      formattedVal += ` | Custom: ${p.customMedications}`;
    }
    html += `<li><strong>${key}:</strong> ${formattedVal}</li>`;
  }

  if (!p.answers?.medications && p.customMedications) {
    html += `<li><strong>medications:</strong> Custom: ${p.customMedications}</li>`;
  }

  html += `
      </ul>
      ${combinedOther ? `
        <div style="margin-top: 10px; padding: 10px 12px; background: rgba(6, 182, 212, 0.08); border-left: 4px solid #0284c7; border-radius: 4px; font-size: 13px;">
          <strong style="color: #0284c7;">Other Symptoms Reported:</strong> ${combinedOther}
        </div>
      ` : ''}
    </div>

    <div class="soap-section">
      <div class="soap-section-title">O - Objective & Document Intelligence (OCR)</div>
      <p style="background: #f1f5f9; padding: 10px; border-radius: 6px; border-left: 3px solid #0284c7;">${docText}</p>
    </div>

    <div class="soap-section">
      <div class="soap-section-title">A - Assessment & AI Risk Scoring</div>
      <p><strong>Diagnostic Probability:</strong> ${isEmergency ? 'High Risk for Acute Myocardial Infarction / Angina' : 'Hypertension & Type 2 Diabetes Follow-up'}</p>
      <p><strong>ABDM Record Status:</strong> Integrated & Linked to Ayushman Bharat Health Account.</p>
    </div>

    <div class="soap-section">
      <div class="soap-section-title">P - Plan & Physician Action</div>
      <ol style="margin-left: 20px;">
        <li>${isEmergency ? 'Immediate 12-lead ECG, Troponin I stat, Sublingual Nitroglycerin' : 'Order HbA1c & Lipid Profile follow-up'}</li>
        <li>Review current daily medications</li>
        <li>Transmit updated prescription back to ABDM PHR ecosystem</li>
      </ol>
    </div>
  `;

  card.innerHTML = html;
}

// SIH 2026 Demo Case Loader
function loadDemoCase(caseId) {
  const demo = MEDIKIOSK_DATA.demoCases.find(c => c.id === caseId);
  if (!demo) return;

  state.patientData = {
    name: demo.patient.name,
    age: demo.patient.age,
    gender: demo.patient.gender,
    abhaId: demo.patient.abhaId,
    tokenNo: demo.patient.tokenNo,
    complaint: demo.patient.complaint,
    answers: {...demo.patient.answers},
    docId: demo.patient.docId
  };

  if (demo.patient.answers.prakriti_body) {
    state.isAyushMode = true;
    const checkbox = document.getElementById('ayush-checkbox');
    if (checkbox) checkbox.checked = true;
  }

  if (demo.patient.answers.omi_narrative) {
    state.patientData.descriptiveNarrative = demo.patient.answers.omi_narrative;
    state.patientData.aiAllottedDoctor = classifyDoctorByAI(demo.patient.answers.omi_narrative);
  }

  checkRedFlags();
  submitToDoctorPortal();
}
