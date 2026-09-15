// MediKiosk SIH 2026 Clinical Knowledge Base & Dataset

const MEDIKIOSK_DATA = {
  languages: [
    { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'te-IN', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'বাংলা (Bengali)', flag: '🇮🇳' }
  ],

  translations: {
    'en-IN': {
      appTitle: "MediKiosk AI",
      appSubtitle: "Multimodal Clinical History & ABDM Portal",
      patientKioskTab: "Patient Kiosk (Voice/Touch)",
      docDigitizeTab: "Document AI Scanner",
      doctorPortalTab: "Doctor OPD Dashboard",
      abhaVerified: "ABHA Linked",
      emergencyAlert: "PRIORITY EMERGENCY TRIAGE ALERT",
      startIntake: "Touch Here or Speak to Start Intake",
      speakBtn: "Speak Response",
      listening: "Listening... Speak clearly into the microphone",
      stopListening: "Stop Listening",
      nextQuestion: "Next Question",
      prevQuestion: "Previous Question",
      submitSummary: "Generate Doctor Summary",
      ayushModeLabel: "AYUSH OPD Mode (Ayurveda Dashavidha Pariksha)",
      redFlagTitle: "CRITICAL SYMPTOM ALERT DETECTED",
      redFlagDesc: "Immediate medical evaluation required. Triage priority updated to EMERGENCY.",
      demoCasesTitle: "SIH 2026 Demo Presets:",
      otherSymptomsTitle: "Other Symptoms & Additional Concerns",
      otherSymptomsSubtitle: "Type or select any additional symptoms you are experiencing",
      otherSymptomsLabel: "Other / Additional Symptoms Box:",
      otherSymptomsPlaceholder: "Type any other symptoms here (e.g., skin rash, dizziness, joint swelling, ear pain)..."
    },
    'hi-IN': {
      appTitle: "मेडीकियोस्क AI",
      appSubtitle: "मल्टीमॉडल क्लिनिकल इतिहास और एबीडीएम पोर्टल",
      patientKioskTab: "मरीज़ कियोस्क (आवाज़/स्पर्श)",
      docDigitizeTab: "दस्तावेज़ AI स्कैनर",
      doctorPortalTab: "डॉक्टर ओपीडी डैशबोर्ड",
      abhaVerified: "आभा सत्यापित",
      emergencyAlert: "आपातकालीन ट्राइएज चेतावनी",
      startIntake: "शुरू करने के लिए स्पर्श करें या बोलें",
      speakBtn: "उत्तर बोलें",
      listening: "सुन रहा हूँ... कृपया स्पष्ट बोलें",
      stopListening: "सुनना बंद करें",
      nextQuestion: "अगला प्रश्न",
      prevQuestion: "पिछला प्रश्न",
      submitSummary: "डॉक्टर सारांश बनाएं",
      ayushModeLabel: "आयुष ओपीडी मोड (आयुर्वेद दशविध परीक्षा)",
      redFlagTitle: "गंभीर लक्षण पाया गया",
      redFlagDesc: "तत्काल डॉक्टर मूल्यांकन आवश्यक। प्राथमिकता आपातकालीन में बदल दी गई है।",
      demoCasesTitle: "एसआईएच 2026 डेमो उदाहरण:",
      otherSymptomsTitle: "अन्य लक्षण और स्वास्थ्य समस्याएं",
      otherSymptomsSubtitle: "अपने अन्य लक्षणों को टाइप करें या चुनें",
      otherSymptomsLabel: "अन्य / अतिरिक्त लक्षण बॉक्स:",
      otherSymptomsPlaceholder: "यहाँ अन्य लक्षण लिखें (जैसे त्वचा पर चकत्ते, चक्कर आना, जोड़ों में सूजन)..."
    }
  },

  chiefComplaints: [
    {
      id: 'chest_pain',
      title: 'Chest Pain / Pressure',
      titleHi: 'छाती में दर्द / दबाव',
      icon: '🫀',
      category: 'Cardiovascular',
      redFlagTrigger: true,
      description: 'Pain, pressure, tightness, or burning in the chest region'
    },
    {
      id: 'fever_cough',
      title: 'Fever & Respiratory Symptoms',
      titleHi: 'बुखार और सांस की तकलीफ',
      icon: '🌡️',
      category: 'Respiratory / General',
      description: 'High temperature, cough, shortness of breath, body ache'
    },
    {
      id: 'abdominal_pain',
      title: 'Abdominal Pain & Digestive Issues',
      titleHi: 'पेट दर्द और पाचन संबंधी समस्या',
      icon: '🤢',
      category: 'Gastrointestinal',
      description: 'Stomach ache, nausea, vomiting, acidity, loss of appetite'
    },
    {
      id: 'joint_pain',
      title: 'Joint Pain & Stiffness',
      titleHi: 'जोड़ों का दर्द और अकड़न',
      icon: '🦴',
      category: 'Musculoskeletal',
      description: 'Knee pain, lower back ache, swollen joints, difficulty walking'
    },
    {
      id: 'diabetes_check',
      title: 'Diabetes / Blood Sugar Follow-up',
      titleHi: 'मधुमेह / ब्लड शुगर फॉलो-अप',
      icon: '🩸',
      category: 'Endocrinology',
      description: 'Frequent thirst, urination, numbness in feet, routine checkup'
    },
    {
      id: 'headache_dizziness',
      title: 'Headache & Neurological Symptoms',
      titleHi: 'सिरदर्द और चक्कर आना',
      icon: '🧠',
      category: 'Neurology',
      description: 'Throbbing headache, weakness, dizziness, blurred vision'
    },
    {
      id: 'other_medical_issue',
      title: 'Other Medical Issue (AI Doctor Allotment)',
      titleHi: 'अन्य चिकित्सा समस्या (AI डॉक्टर आवंटन)',
      icon: '🤖',
      category: 'AI Department Allotment',
      description: 'Describe your issue in detail; AI will analyze text & allot the specialized doctor'
    },
    {
      id: 'other_symptoms',
      title: 'Other Symptoms & Health Concerns',
      titleHi: 'अन्य लक्षण और स्वास्थ्य समस्याएं',
      icon: '🩺',
      category: 'General / Custom',
      description: 'Skin rash, dizziness, fatigue, ear/eye pain, or any other complaint'
    }
  ],

  adaptiveQuestions: {
    'other_medical_issue': [
      {
        id: 'omi_narrative',
        text: 'Descriptive Problem Detail for AI Doctor Allotment:',
        textHi: 'AI डॉक्टर आवंटन के लिए समस्या का विस्तृत वर्णन:',
        type: 'textarea',
        placeholder: 'Describe your illness in detail (e.g. Sharp pain in knee joint while walking, skin redness with itching on arms, blurred vision in right eye)...'
      },
      {
        id: 'omi_duration',
        text: 'How long have you been suffering from this issue?',
        textHi: 'आपको यह समस्या कितने समय से है?',
        type: 'choice',
        options: ['Less than 24 hours', '1-3 days', '1-2 weeks', '1-3 months', 'Chronic (> 6 months)']
      },
      {
        id: 'omi_severity',
        text: 'Overall Discomfort & Pain Level (1 to 10):',
        textHi: 'कुल परेशानी का स्तर (1 से 10):',
        type: 'scale',
        min: 1, max: 10,
        labels: { 1: 'Mild', 5: 'Moderate', 10: 'Severe' }
      }
    ],
    'other_symptoms': [
      {
        id: 'os_duration',
        text: 'How long have you had these other symptoms?',
        textHi: 'आपको ये अन्य लक्षण कितने समय से हैं?',
        type: 'choice',
        options: ['Started today', '2-3 days ago', '1-2 weeks', 'More than 2 weeks']
      },
      {
        id: 'os_severity',
        text: 'Rate the discomfort level on a scale of 1 to 10:',
        textHi: 'तकलीफ का स्तर 1 से 10 के पैमाने पर चुनें:',
        type: 'scale',
        min: 1, max: 10,
        labels: { 1: 'Mild', 5: 'Moderate', 10: 'Severe' }
      },
      {
        id: 'os_details',
        text: 'Please describe your specific symptoms in detail:',
        textHi: 'कृपया अपने विशिष्ट लक्षणों का विस्तार से वर्णन करें:',
        type: 'textarea',
        placeholder: 'Type details here...'
      }
    ],
    'chest_pain': [
      {
        id: 'cp_onset',
        text: 'When did the chest pain start?',
        textHi: 'छाती में दर्द कब शुरू हुआ?',
        type: 'choice',
        options: ['Less than 1 hour ago (Sudden)', '1-6 hours ago', 'Today morning', 'More than 24 hours ago']
      },
      {
        id: 'cp_severity',
        text: 'Rate the severity of pain on a scale of 1 to 10:',
        textHi: 'दर्द का स्तर 1 से 10 के पैमाने पर चुनें:',
        type: 'scale',
        min: 1, max: 10,
        labels: { 1: 'Mild', 5: 'Moderate', 10: 'Severe (Unbearable)' }
      },
      {
        id: 'cp_radiation',
        text: 'Does the pain spread anywhere else?',
        textHi: 'क्या यह दर्द कहीं और फैल रहा है?',
        type: 'multiselect',
        options: ['Left arm / shoulder', 'Jaw or neck', 'Back', 'Stomach / epigastrium', 'No radiation']
      },
      {
        id: 'cp_assoc',
        text: 'Select any associated symptoms you are experiencing right now:',
        textHi: 'क्या आपको इनमें से कोई अन्य समस्या भी हो रही है?',
        type: 'multiselect',
        options: ['Shortness of breath / Dyspnea', 'Profuse sweating (Diaphoresis)', 'Nausea / Vomiting', 'Palpitations', 'Dizziness']
      }
    ],
    'fever_cough': [
      {
        id: 'fc_duration',
        text: 'How many days have you had fever?',
        textHi: 'आपको कितने दिनों से बुखार है?',
        type: 'choice',
        options: ['1-2 days', '3-5 days', '1-2 weeks', 'More than 2 weeks']
      },
      {
        id: 'fc_temp',
        text: 'Highest recorded body temperature:',
        textHi: 'उच्चतम रिकॉर्ड किया गया तापमान:',
        type: 'choice',
        options: ['Below 100°F (Low grade)', '100°F - 102°F', 'Above 102°F (High grade)', 'Not measured']
      },
      {
        id: 'fc_cough',
        text: 'Type of cough:',
        textHi: 'खांसी का प्रकार:',
        type: 'choice',
        options: ['Dry cough', 'Wet cough with sputum', 'Coughing up blood (Hemoptysis)', 'No cough']
      },
      {
        id: 'fc_redflags',
        text: 'Do you have difficulty breathing or chest pain while taking a deep breath?',
        textHi: 'क्या आपको सांस लेने में कठिनाई या गहरी सांस लेने पर छाती में दर्द है?',
        type: 'choice',
        options: ['Yes, severe shortness of breath', 'Mild difficulty breathing', 'No difficulty']
      }
    ],
    'general_defaults': [
      {
        id: 'pmh_conditions',
        text: 'Past Medical History - Select existing diagnosed health conditions:',
        textHi: 'पूर्व चिकित्सा इतिहास - निदान की गई बीमारियाँ चुनें:',
        type: 'multiselect',
        options: ['Hypertension (High BP)', 'Type 2 Diabetes Mellitus', 'Asthma / COPD', 'Heart Disease / CABG / Stent', 'Thyroid Disorder', 'Kidney Disease', 'None']
      },
      {
        id: 'medications',
        text: 'Current Daily Medications:',
        textHi: 'वर्तमान में ली जाने वाली दवाएं:',
        type: 'multiselect',
        options: [
          'Metformin (Diabetes)',
          'Telmisartan / Amlodipine (High BP)',
          'Atorvastatin / Rosuvastatin (Cholesterol)',
          'Aspirin / Clopidogrel (Blood Thinner)',
          'Thyroxin / Eltroxin (Thyroid)',
          'Insulin Injection',
          'Pantoprazole / Omeprazole (Acidity)',
          'Paracetamol / Painkillers',
          'Inhaler (Asthma / COPD)',
          'Multivitamins / D3 / B12',
          'Ayurvedic / Herbal Formulations',
          'Other Medicine (Specify below)',
          'None'
        ]
      },
      {
        id: 'allergies',
        text: 'Known Drug or Food Allergies:',
        textHi: 'ज्ञात दवा या खाद्य एलर्जी:',
        type: 'multiselect',
        options: ['Penicillin / Amoxicillin', 'Sulfa Drugs', 'NSAIDs (Ibuprofen/Paracetamol)', 'Food / Dust Allergy', 'No Known Allergies (NKDA)']
      }
    ]
  },

  ayushQuestions: [
    {
      id: 'prakriti_body',
      text: 'Ayurveda Prakriti Analysis - Physical Structure & Body Frame:',
      textHi: 'प्रकृति विश्लेषण - शारीरिक बनावट:',
      type: 'choice',
      options: [
        'Vata: Thin, light frame, dry skin, quick movements',
        'Pitta: Medium build, warm skin, prone to redness/sweating',
        'Kapha: Broad, solid frame, smooth moist skin, steady pace'
      ]
    },
    {
      id: 'ahara_shakti',
      text: 'Ahara Shakti & Agni (Digestive Fire):',
      textHi: 'आहार शक्ति और अग्नि (पाचन अग्नि):',
      type: 'choice',
      options: [
        'Vishamagni (Irregular hunger/digestion - Vata)',
        'Tikshnamagni (Intense hunger, sharp acidity - Pitta)',
        'Mandagni (Slow digestion, heaviness after food - Kapha)',
        'Samagni (Balanced digestion)'
      ]
    },
    {
      id: 'sattva_mental',
      text: 'Sattva (Mental Temperament & Resilience):',
      textHi: 'सत्त्व (मानसिक सहनशक्ति):',
      type: 'choice',
      options: [
        'Pravara Sattva (High tolerance to pain & stress)',
        'Madhyama Sattva (Moderate emotional resilience)',
        'Avara Sattva (Sensitive, low pain threshold, anxiety-prone)'
      ]
    },
    {
      id: 'vyayama_shakti',
      text: 'Vyayama Shakti (Physical Endurance):',
      textHi: 'व्यायाम शक्ति (शारीरिक क्षमता):',
      type: 'choice',
      options: ['High endurance', 'Moderate endurance', 'Low physical stamina']
    }
  ],

  redFlagRules: [
    {
      condition: (answers) => {
        return answers.cp_radiation?.includes('Left arm / shoulder') &&
               answers.cp_assoc?.includes('Shortness of breath / Dyspnea') &&
               (answers.cp_severity >= 6 || answers.cp_onset === 'Less than 1 hour ago (Sudden)');
      },
      alertTitle: 'ACUTE CORONARY SYNDROME / CARDIAC RED-FLAG DETECTED',
      alertMessage: 'Patient presents with acute onset severe chest pain radiating to left arm with dyspnea. High risk of myocardial infarction. Immediate ECG and Emergency Resuscitation Room transfer required.',
      triageLevel: 'EMERGENCY (Level 1)'
    },
    {
      condition: (answers) => {
        return answers.fc_cough === 'Coughing up blood (Hemoptysis)' ||
               answers.fc_redflags === 'Yes, severe shortness of breath';
      },
      alertTitle: 'RESPIRATORY RED-FLAG / ACUTE DYSPNEA ALERT',
      alertMessage: 'Hemoptysis / acute dyspnea detected. Requires immediate oxygen saturation check (SpO2) and urgent chest physician evaluation.',
      triageLevel: 'PRIORITY URGENT (Level 2)'
    }
  ],

  sampleDocuments: [
    {
      id: 'doc_cbc_lab',
      title: 'Lab Report - Comprehensive Blood Count & HbA1c',
      date: '2026-09-10',
      facility: 'Thyrocare Diagnostics, New Delhi',
      extractedData: {
        documentType: 'Laboratory Test Report',
        patientName: 'Rajesh Kumar',
        age: 52,
        gender: 'Male',
        parameters: [
          { name: 'HbA1c (Glycated Hemoglobin)', value: '8.6 %', reference: '< 5.7 %', status: 'CRITICAL HIGH' },
          { name: 'Fasting Plasma Glucose', value: '184 mg/dL', reference: '70 - 99 mg/dL', status: 'HIGH' },
          { name: 'Hemoglobin (Hb)', value: '11.2 g/dL', reference: '13.0 - 17.0 g/dL', status: 'LOW' },
          { name: 'Serum Creatinine', value: '1.1 mg/dL', reference: '0.7 - 1.3 mg/dL', status: 'NORMAL' },
          { name: 'Total Cholesterol', value: '235 mg/dL', reference: '< 200 mg/dL', status: 'HIGH' }
        ],
        aiSummary: 'Uncontrolled Type 2 Diabetes Mellitus with mild normocytic anemia and hypercholesterolemia.',
        flags: ['High Blood Sugar Warning', 'Dyslipidemia Alert', 'Diabetic Nephropathy Monitoring Advised']
      }
    },
    {
      id: 'doc_prescription',
      title: 'Prior Prescription - Cardiology OPD',
      date: '2026-08-15',
      facility: 'AIIMS New Delhi - Cardiology Dept',
      extractedData: {
        documentType: 'Outpatient Clinical Prescription',
        patientName: 'Rajesh Kumar',
        doctor: 'Dr. V. K. Sharma (MD, DM Cardiology)',
        parameters: [
          { name: 'Diagnosis', value: 'Essential Hypertension, T2DM', reference: '-', status: 'DIAGNOSIS' },
          { name: 'Rx: Tab Telmisartan', value: '40 mg once daily (OD)', reference: 'Morning', status: 'ACTIVE MED' },
          { name: 'Rx: Tab Metformin ER', value: '1000 mg twice daily (BD)', reference: 'After Meals', status: 'ACTIVE MED' },
          { name: 'Rx: Tab Atorvastatin', value: '20 mg once daily (HS)', reference: 'Night', status: 'ACTIVE MED' },
          { name: 'Allergy Noted', value: 'Penicillin (Severe Rash)', reference: 'Alert', status: 'ALLERGY' }
        ],
        aiSummary: 'Active dual therapy for HTN + Diabetes. Penicillin allergy flagged.',
        flags: ['Penicillin Allergy Flag', 'Regular HbA1c Monitoring Required']
      }
    }
  ],

  demoCases: [
    {
      id: 'case_cardiac_emergency',
      name: 'Case 1: Cardiac Red-Flag Emergency (Immediate Triage)',
      badge: 'Red-Flag Emergency',
      color: '#ef4444',
      patient: {
        name: 'Suresh Patil',
        age: 58,
        gender: 'Male',
        abhaId: '91-4829-1092-3841',
        tokenNo: 'EM-01',
        complaint: 'chest_pain',
        answers: {
          cp_onset: 'Less than 1 hour ago (Sudden)',
          cp_severity: 9,
          cp_radiation: ['Left arm / shoulder', 'Jaw or neck'],
          cp_assoc: ['Shortness of breath / Dyspnea', 'Profuse sweating (Diaphoresis)'],
          pmh_conditions: ['Hypertension (High BP)', 'Heart Disease / CABG / Stent'],
          medications: ['Aspirin / Clopidogrel', 'Atorvastatin'],
          allergies: ['No Known Allergies (NKDA)']
        },
        docId: null
      }
    },
    {
      id: 'case_diabetes_ocr',
      name: 'Case 2: Diabetes & HTN Follow-Up with OCR Lab Digitization',
      badge: 'Document AI Active',
      color: '#2563eb',
      patient: {
        name: 'Rajesh Kumar',
        age: 52,
        gender: 'Male',
        abhaId: '14-8839-2041-9920',
        tokenNo: 'OPD-42',
        complaint: 'diabetes_check',
        answers: {
          pmh_conditions: ['Hypertension (High BP)', 'Type 2 Diabetes Mellitus'],
          medications: ['Metformin', 'Telmisartan / Amlodipine'],
          allergies: ['Penicillin / Amoxicillin']
        },
        docId: 'doc_cbc_lab'
      }
    },
    {
      id: 'case_ayush_opd',
      name: 'Case 3: AYUSH OPD Consultation & Prakriti Assessment',
      badge: 'AYUSH Mode',
      color: '#10b981',
      patient: {
        name: 'Ananya Deshmukh',
        age: 34,
        gender: 'Female',
        abhaId: '44-1029-4810-7732',
        tokenNo: 'AYU-12',
        complaint: 'abdominal_pain',
        answers: {
          pmh_conditions: ['None'],
          medications: ['None'],
          allergies: ['No Known Allergies (NKDA)'],
          prakriti_body: 'Pitta: Medium build, warm skin, prone to redness/sweating',
          ahara_shakti: 'Tikshnamagni (Intense hunger, sharp acidity - Pitta)',
          sattva_mental: 'Pravara Sattva (High tolerance to pain & stress)',
          vyayama_shakti: 'High endurance'
        },
        docId: null
      }
    },
    {
      id: 'case_ai_allotment',
      name: 'Case 4: Other Medical Issue with AI Doctor Allotment',
      badge: 'AI Allotted: Ortho',
      color: '#8b5cf6',
      patient: {
        name: 'Sunita Verma',
        age: 46,
        gender: 'Female',
        abhaId: '88-3920-1102-9941',
        tokenNo: 'AI-04',
        complaint: 'other_medical_issue',
        answers: {
          omi_narrative: 'Severe swelling and pain in right knee joint with difficulty walking since 3 days',
          omi_duration: '1-3 days',
          omi_severity: 8
        },
        docId: null
      }
    }
  ],

  aiDoctorRules: [
    {
      department: 'Orthopedics & Joint Care',
      specialist: 'Dr. R. K. Gupta (MS Ortho, Senior Specialist)',
      opdRoom: 'OPD Room 104 (Orthopedics Wing)',
      icon: '🦴',
      keywords: ['bone', 'joint', 'knee', 'back', 'spine', 'fracture', 'stiffness', 'arthritis', 'elbow', 'shoulder', 'walking', 'ankle', 'haddi', 'jod']
    },
    {
      department: 'Dermatology & Skin Science',
      specialist: 'Dr. Priya Sharma (MD Dermatology)',
      opdRoom: 'OPD Room 208 (Dermatology Clinic)',
      icon: '🧴',
      keywords: ['skin', 'rash', 'itching', 'redness', 'eczema', 'allergy', 'fungal', 'pimples', 'acne', 'spot', 'tvacha', 'khujli']
    },
    {
      department: 'Ophthalmology (Eye Care)',
      specialist: 'Dr. S. N. Roy (MS Ophthalmology)',
      opdRoom: 'OPD Room 302 (Eye Care Center)',
      icon: '👁️',
      keywords: ['eye', 'vision', 'blurred', 'tear', 'cornea', 'cataract', 'sight', 'glaucoma', 'aankh', 'drishti']
    },
    {
      department: 'ENT (Ear, Nose & Throat)',
      specialist: 'Dr. Meena Iyer (MS ENT Specialist)',
      opdRoom: 'OPD Room 112 (ENT Complex)',
      icon: '👂',
      keywords: ['ear', 'nose', 'throat', 'sinus', 'tonsil', 'hearing', 'vertigo', 'runny nose', 'kan', 'gala', 'naak']
    },
    {
      department: 'Gastroenterology',
      specialist: 'Dr. A. K. Verma (DM Gastroenterology)',
      opdRoom: 'OPD Room 205 (Digestive Health Wing)',
      icon: '🤢',
      keywords: ['stomach', 'abdomen', 'acidity', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'gastric', 'ulcer', 'digest', 'pet', 'kabz']
    },
    {
      department: 'Urology & Kidney Care',
      specialist: 'Dr. V. K. Nair (MCh Urology)',
      opdRoom: 'OPD Room 401 (Urology Center)',
      icon: '🩸',
      keywords: ['urine', 'urination', 'kidney', 'stone', 'bladder', 'prostate', 'burning urine', 'mutra', 'pathri']
    },
    {
      department: 'Cardiology & Vascular',
      specialist: 'Dr. V. K. Sharma (MD, DM Cardiology)',
      opdRoom: 'OPD Room 101 (Heart Care Unit)',
      icon: '🫀',
      keywords: ['chest', 'heart', 'palpitation', 'breath', 'cardiac', 'blood pressure', 'bp', 'dil', 'chhati']
    },
    {
      department: 'Psychiatry & Behavioral Health',
      specialist: 'Dr. Anjali Mehta (MD Psychiatry)',
      opdRoom: 'OPD Room 502 (Mind & Mental Health)',
      icon: '🧠',
      keywords: ['anxiety', 'depression', 'stress', 'sleep', 'insomnia', 'panic', 'mood', 'mental', 'tanav', 'neend']
    },
    {
      department: 'Pulmonology (Respiratory)',
      specialist: 'Dr. H. S. Bindra (MD Respiratory Medicine)',
      opdRoom: 'OPD Room 109 (Chest & Respiratory Clinic)',
      icon: '🫁',
      keywords: ['cough', 'asthma', 'wheezing', 'phlegm', 'sputum', 'breathless', 'lungs', 'khansi', 'saans']
    }
  ],
  defaultDoctor: {
    department: 'Internal Medicine / General OPD',
    specialist: 'Dr. Ramesh Singh (MD Medicine)',
    opdRoom: 'General OPD Room 10',
    icon: '🏥'
  }
};

if (typeof module !== 'undefined') {
  module.exports = MEDIKIOSK_DATA;
}
