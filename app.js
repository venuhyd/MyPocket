class MyPacketApp {
    constructor() {
        this.transactions = [];
        this.packetAmount = 10000;
        this.currentEditingId = null;
        this.recognition = null;
        this.currentLanguage = 'en';
        this.currentStep = 1;
        this.maxSteps = 5;
        this.autoLockTimer = null;
        this.lastActivityTime = Date.now();
        this.isLocked = false;
        this.passcodeAttempts = 0;
        this.maxPasscodeAttempts = 3;
        this.isSetupMode = false;
        this.tempPasscode = '';
        this.confirmCallback = null;
        
        // Load data first
        this.loadData();
        this.loadSecuritySettings();
        
        // Initialize
        this.init();
        this.initSpeechRecognition();
        this.bindEvents();
        this.setupLanguage();
        this.checkSecurityOnLoad();
        this.startActivityMonitoring();
    }

    init() {
        // Initialize with sample data if no existing data
        if (this.transactions.length === 0) {
            this.transactions = [
                {
                    id: 1,
                    description: "Tea and breakfast",
                    amount: 85,
                    paymentMethod: "PhonePe",
                    category: "Food & Dining",
                    date: "2025-09-24",
                    time: "09:30",
                    timestamp: "2025-09-24T09:30:00"
                },
                {
                    id: 2,
                    description: "Auto fare",
                    amount: 40,
                    paymentMethod: "Cash",
                    category: "Transportation",
                    date: "2025-09-24",
                    time: "10:15",
                    timestamp: "2025-09-24T10:15:00"
                }
            ];
            this.saveData();
        }

        this.updateDashboard();
        this.renderRecentTransactions();
        this.setCurrentDateTime();
        this.populateDropdowns();
    }

    // Language and Translation System
    getLanguageData() {
        const data = {
            "en": {
                "appTitle": "MyPacket",
                "packetAmount": "Packet Amount",
                "todayExpenses": "Today's Expenses", 
                "monthlyExpenses": "Monthly Expenses",
                "addTransaction": "Add Transaction",
                "manualEntry": "Manual Entry",
                "voiceEntry": "Voice Entry",
                "description": "Description",
                "amount": "Amount",
                "paymentMethod": "Payment Method",
                "category": "Category",
                "date": "Date",
                "time": "Time",
                "recentTransactions": "Recent Transactions",
                "settings": "Settings",
                "language": "Language",
                "security": "Security",
                "passcode": "Passcode",
                "enterPasscode": "Enter Passcode",
                "setPasscode": "Set Passcode",
                "changePasscode": "Change Passcode",
                "confirmPasscode": "Confirm Passcode",
                "autoLock": "Auto Lock",
                "transactionSecurity": "Transaction Security",
                "requirePasscodeForEdits": "Require passcode for edits",
                "currency": "₹",
                "voiceHint": "Speak your transaction...",
                "listening": "Listening...",
                "edit": "Edit",
                "delete": "Delete",
                "save": "Save",
                "cancel": "Cancel",
                "update": "Update",
                "manualEntryHint": "Enter transaction details manually",
                "editTransaction": "Edit Transaction",
                "deleteTransaction": "Delete Transaction",
                "confirmDelete": "Are you sure you want to delete this transaction?",
                "passcodeIncorrect": "Incorrect passcode. Please try again.",
                "passcodeSetSuccess": "Passcode set successfully",
                "autoLockOptions": ["Never", "Immediately", "1 Minute", "5 Minutes", "15 Minutes"],
                "securityEnabled": "Security Enabled",
                "unlockApp": "Unlock App",
                "transactionSaved": "Transaction saved successfully",
                "transactionUpdated": "Transaction updated successfully",
                "transactionDeleted": "Transaction deleted successfully",
                "fillAllFields": "Please fill all required fields",
                "invalidAmount": "Please enter a valid amount",
                "resetData": "Reset All Data",
                "confirmReset": "This will delete all your data. Are you sure?",
                "dataResetSuccess": "All data has been reset",
                "next": "Next",
                "previous": "Previous",
                "enablePasscode": "Enable Passcode"
            },
            "hi": {
                "appTitle": "मेरा पैकेट",
                "packetAmount": "पैकेट राशि",
                "todayExpenses": "आज का खर्च",
                "monthlyExpenses": "मासिक खर्च",
                "addTransaction": "लेन-देन जोड़ें",
                "manualEntry": "मैन्युअल एंट्री",
                "voiceEntry": "वॉइस एंट्री", 
                "description": "विवरण",
                "amount": "राशि",
                "paymentMethod": "भुगतान विधि",
                "category": "श्रेणी",
                "date": "दिनांक",
                "time": "समय",
                "recentTransactions": "हाल के लेन-देन",
                "settings": "सेटिंग्स",
                "language": "भाषा",
                "security": "सुरक्षा",
                "passcode": "पासकोड",
                "enterPasscode": "पासकोड डालें",
                "setPasscode": "पासकोड सेट करें",
                "changePasscode": "पासकोड बदलें",
                "confirmPasscode": "पासकोड की पुष्टि करें",
                "autoLock": "ऑटो लॉक",
                "transactionSecurity": "लेन-देन सुरक्षा",
                "requirePasscodeForEdits": "संपादन के लिए पासकोड आवश्यक",
                "currency": "₹",
                "voiceHint": "अपना लेन-देन बोलें...",
                "listening": "सुन रहा है...",
                "edit": "संपादित करें",
                "delete": "मिटाएं",
                "save": "सहेजें",
                "cancel": "रद्द करें",
                "update": "अपडेट करें",
                "manualEntryHint": "लेन-देन विवरण मैन्युअल रूप से दर्ज करें",
                "editTransaction": "लेन-देन संपादित करें",
                "deleteTransaction": "लेन-देन मिटाएं",
                "confirmDelete": "क्या आप वाकई इस लेन-देन को मिटाना चाहते हैं?",
                "passcodeIncorrect": "गलत पासकोड। कृपया फिर से कोशिश करें।",
                "passcodeSetSuccess": "पासकोड सफलतापूर्वक सेट किया गया",
                "autoLockOptions": ["कभी नहीं", "तुरंत", "1 मिनट", "5 मिनट", "15 मिनट"],
                "securityEnabled": "सुरक्षा सक्षम",
                "unlockApp": "ऐप अनलॉक करें",
                "transactionSaved": "लेन-देन सफलतापूर्वक सहेजा गया",
                "transactionUpdated": "लेन-देन सफलतापूर्वक अपडेट किया गया",
                "transactionDeleted": "लेन-देन सफलतापूर्वक मिटाया गया",
                "fillAllFields": "कृपया सभी आवश्यक फ़ील्ड भरें",
                "invalidAmount": "कृपया एक वैध राशि दर्ज करें",
                "resetData": "सभी डेटा रीसेट करें",
                "confirmReset": "यह आपका सभी डेटा मिटा देगा। क्या आप सुनिश्चित हैं?",
                "dataResetSuccess": "सभी डेटा रीसेट हो गया है",
                "next": "अगला",
                "previous": "पिछला",
                "enablePasscode": "पासकोड सक्षम करें"
            },
            "te": {
                "appTitle": "నా పాకెట్",
                "packetAmount": "పాకెట్ మొత్తం",
                "todayExpenses": "నేటి ఖర్చులు",
                "monthlyExpenses": "మాసిక ఖర్చులు",
                "addTransaction": "లావాదేవీ జోడించండి",
                "manualEntry": "మాన్యువల్ ఎంట్రీ",
                "voiceEntry": "వాయిస్ ఎంట్రీ",
                "description": "వివరణ",
                "amount": "మొత్తం",
                "paymentMethod": "చెల్లింపు విధానం",
                "category": "వర్గం",
                "date": "తేదీ",
                "time": "సమయం",
                "recentTransactions": "ఇటీవలి లావాదేవీలు",
                "settings": "సెట్టింగులు",
                "language": "భాష",
                "security": "భద్రత",
                "passcode": "పాస్‌కోడ్",
                "enterPasscode": "పాస్‌కోడ్ నమోదు చేయండి",
                "setPasscode": "పాస్‌కోడ్ సెట్ చేయండి",
                "changePasscode": "పాస్‌కోడ్ మార్చండి",
                "confirmPasscode": "పాస్‌కోడ్ నిర్ధారించండి",
                "autoLock": "ఆటో లాక్",
                "transactionSecurity": "లావాదేవీ భద్రత",
                "requirePasscodeForEdits": "సవరణల కోసం పాస్‌కోడ్ అవసరం",
                "currency": "₹",
                "voiceHint": "మీ లావాదేవీని చెప్పండి...",
                "listening": "వింటున్నాను...",
                "edit": "సవరించు",
                "delete": "తొలగించు",
                "save": "భద్రపరచు",
                "cancel": "రద్దు చేయి",
                "update": "అప్‌డేట్ చేయి",
                "manualEntryHint": "లావాదేవీ వివరాలను మాన్యువల్‌గా నమోదు చేయండి",
                "editTransaction": "లావాదేవీని సవరించండి",
                "deleteTransaction": "లావాదేవీని తొలగించండి",
                "confirmDelete": "మీరు ఖచ్చితంగా ఈ లావాదేవీని తొలగించాలనుకుంటున్నారా?",
                "passcodeIncorrect": "తప్పు పాస్‌కోడ్. దయచేసి మళ్లీ ప్రయత్నించండి.",
                "passcodeSetSuccess": "పాస్‌కోడ్ విజయవంతంగా సెట్ చేయబడింది",
                "autoLockOptions": ["ఎప్పుడూ లేదు", "వెంటనే", "1 నిమిషం", "5 నిమిషాలు", "15 నిమిషాలు"],
                "securityEnabled": "భద్రత ఎనేబుల్ చేయబడింది",
                "unlockApp": "యాప్‌ను అన్‌లాక్ చేయండి",
                "transactionSaved": "లావాదేవీ విజయవంతంగా భద్రపరచబడింది",
                "transactionUpdated": "లావాదేవీ విజయవంతంగా అప్‌డేట్ చేయబడింది",
                "transactionDeleted": "లావాదేవీ విజయవంతంగా తొలగించబడింది",
                "fillAllFields": "దయచేసి అన్ని అవసరమైన ఫీల్డ్‌లను పూరించండి",
                "invalidAmount": "దయచేసి చెల్లుబాటు అయ్యే మొత్తాన్ని నమోదు చేయండి",
                "resetData": "అన్ని డేటాను రీసెట్ చేయండి",
                "confirmReset": "ఇది మీ అన్ని డేటాను తొలగిస్తుంది. మీరు ఖచ్చితంగా అనుకుంటున్నారా?",
                "dataResetSuccess": "అన్ని డేటా రీసెట్ చేయబడింది",
                "next": "తదుపరి",
                "previous": "మునుపటి",
                "enablePasscode": "పాస్‌కోడ్ ఎనేబుల్ చేయండి"
            }
        };

        const paymentMethods = {
            "en": ["Cash", "PhonePe", "Google Pay", "PayTM", "UPI", "Debit Card", "Credit Card", "Net Banking"],
            "hi": ["नकद", "PhonePe", "Google Pay", "PayTM", "UPI", "डेबिट कार्ड", "क्रेडिट कार्ड", "नेट बैंकिंग"],
            "te": ["నగదు", "PhonePe", "Google Pay", "PayTM", "UPI", "డెబిట్ కార్డ్", "క్రెడిట్ కార్డ్", "నెట్ బ్యాంకింగ్"]
        };

        const categories = {
            "en": ["Food & Dining", "Transportation", "Shopping", "Bills & Utilities", "Entertainment", "Healthcare", "Education", "Others"],
            "hi": ["खाना और भोजन", "परिवहन", "खरीदारी", "बिल और उपयोगिताएं", "मनोरंजन", "स्वास्थ्य सेवा", "शिक्षा", "अन्य"],
            "te": ["ఆహారం & భోజనం", "రవాణా", "షాపింగ్", "బిల్లులు & యుటిలిటీస్", "వినోదం", "ఆరోగ్య సంరక్షణ", "విద్య", "ఇతరాలు"]
        };

        return { languages: data, paymentMethods, categories };
    }

    t(key) {
        const data = this.getLanguageData();
        return data.languages[this.currentLanguage][key] || key;
    }

    setupLanguage() {
        // Set up language selector
        document.getElementById('languageSelect').value = this.currentLanguage;
        this.updateLanguageInterface();
    }

    updateLanguageInterface() {
        // Update all text elements
        const elements = {
            'appTitle': 'appTitle',
            'packetAmountLabel': 'packetAmount',
            'todayExpensesLabel': 'todayExpenses',
            'monthlyExpensesLabel': 'monthlyExpenses',
            'voiceEntryLabel': 'voiceEntry',
            'manualEntryLabel': 'manualEntry',
            'voiceHintLabel': 'voiceHint',
            'manualHintLabel': 'manualEntryHint',
            'recentTransactionsLabel': 'recentTransactions',
            'settingsModalTitle': 'settings',
            'securityLabel': 'security',
            'enablePasscodeLabel': 'enablePasscode',
            'autoLockLabel': 'autoLock',
            'transactionSecurityLabel': 'requirePasscodeForEdits',
            'packetSettingsLabel': 'packetAmount',
            'dataManagementLabel': 'dataManagement',
            'descriptionLabel': 'description',
            'amountLabel': 'amount',
            'paymentMethodLabel': 'paymentMethod',
            'categoryLabel': 'category',
            'dateLabel': 'date',
            'timeLabel': 'time',
            'voiceModalTitle': 'voiceEntry',
            'manualModalTitle': 'manualEntry',
            'editModalTitle': 'editTransaction',
            'historyModalTitle': 'recentTransactions',
            'nextStepBtn': 'next',
            'prevStepBtn': 'previous',
            'updateBtn': 'update',
            'passcodeSubtitle': 'enterPasscode',
            'passcodeSetupTitle': 'setPasscode'
        };

        Object.entries(elements).forEach(([elementId, textKey]) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = this.t(textKey);
            }
        });

        // Update auto-lock options
        const autoLockSelect = document.getElementById('autoLockSelect');
        if (autoLockSelect) {
            const options = this.t('autoLockOptions');
            autoLockSelect.innerHTML = options.map((option, index) => {
                const values = [-1, 0, 60000, 300000, 900000];
                return `<option value="${values[index]}">${option}</option>`;
            }).join('');
            autoLockSelect.value = this.securitySettings.autoLockTimeout;
        }

        this.populateDropdowns();
    }

    populateDropdowns() {
        const data = this.getLanguageData();
        const paymentMethods = data.paymentMethods[this.currentLanguage];
        const categories = data.categories[this.currentLanguage];

        // Populate manual entry dropdowns
        const manualPaymentSelect = document.getElementById('manualPaymentMethod');
        const manualCategorySelect = document.getElementById('manualCategory');
        
        if (manualPaymentSelect) {
            manualPaymentSelect.innerHTML = '<option value="">Select payment method</option>' + 
                paymentMethods.map(method => `<option value="${method}">${method}</option>`).join('');
        }

        if (manualCategorySelect) {
            manualCategorySelect.innerHTML = '<option value="">Select category</option>' + 
                categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        }

        // Populate edit dropdowns
        const editPaymentSelect = document.getElementById('editPaymentMethod');
        const editCategorySelect = document.getElementById('editCategory');
        
        if (editPaymentSelect) {
            editPaymentSelect.innerHTML = paymentMethods.map(method => `<option value="${method}">${method}</option>`).join('');
        }

        if (editCategorySelect) {
            editCategorySelect.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        }

        // Populate filter dropdowns
        const filterPaymentSelect = document.getElementById('filterPayment');
        if (filterPaymentSelect) {
            filterPaymentSelect.innerHTML = '<option value="">All Payment Methods</option>' + 
                paymentMethods.map(method => `<option value="${method}">${method}</option>`).join('');
        }
    }

    // Security System
    loadSecuritySettings() {
        const saved = localStorage.getItem('mypacket_security');
        this.securitySettings = saved ? JSON.parse(saved) : {
            passcodeEnabled: false,
            autoLockEnabled: false,
            autoLockTimeout: 300000,
            transactionSecurityEnabled: false,
            passcodeHash: null
        };
    }

    saveSecuritySettings() {
        localStorage.setItem('mypacket_security', JSON.stringify(this.securitySettings));
    }

    checkSecurityOnLoad() {
        if (this.securitySettings.passcodeEnabled) {
            this.lockApp();
        } else {
            this.showMainApp();
        }
    }

    lockApp() {
        this.isLocked = true;
        document.getElementById('passcodeScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        document.getElementById('passcodeInput').value = '';
        this.updatePasscodeDots('');
        document.getElementById('passcodeError').textContent = '';
        this.clearAutoLockTimer();
    }

    showMainApp() {
        this.isLocked = false;
        document.getElementById('passcodeScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        this.passcodeAttempts = 0;
        this.resetAutoLockTimer();
        this.updateDashboard();
        this.renderRecentTransactions();
    }

    hashPasscode(passcode) {
        // Simple hash function - in production, use proper crypto
        let hash = 0;
        for (let i = 0; i < passcode.length; i++) {
            const char = passcode.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    verifyPasscode(passcode) {
        const hash = this.hashPasscode(passcode);
        return hash === this.securitySettings.passcodeHash;
    }

    setPasscode(passcode) {
        this.securitySettings.passcodeHash = this.hashPasscode(passcode);
        this.securitySettings.passcodeEnabled = true;
        this.saveSecuritySettings();
    }

    updatePasscodeDots(passcode) {
        const dots = document.querySelectorAll('#passcodeDots .dot, #setupPasscodeDots .dot');
        dots.forEach((dot, index) => {
            if (index < passcode.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    // Auto-lock functionality
    startActivityMonitoring() {
        ['click', 'keypress', 'touchstart', 'scroll'].forEach(event => {
            document.addEventListener(event, () => {
                this.lastActivityTime = Date.now();
                if (!this.isLocked && this.securitySettings.passcodeEnabled) {
                    this.resetAutoLockTimer();
                }
            });
        });
    }

    resetAutoLockTimer() {
        this.clearAutoLockTimer();
        if (this.securitySettings.autoLockTimeout > 0) {
            this.autoLockTimer = setTimeout(() => {
                this.lockApp();
            }, this.securitySettings.autoLockTimeout);
        }
    }

    clearAutoLockTimer() {
        if (this.autoLockTimer) {
            clearTimeout(this.autoLockTimer);
            this.autoLockTimer = null;
        }
    }

    // Speech Recognition
    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.currentLanguage === 'hi' ? 'hi-IN' : 
                                  this.currentLanguage === 'te' ? 'te-IN' : 'en-IN';
        }
    }

    startVoiceRecognition() {
        if (!this.recognition) {
            this.showToast('Voice recognition not supported in this browser', 'error');
            return;
        }

        const voiceBtn = document.getElementById('voiceBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        const voiceAnimation = document.getElementById('voiceAnimation');
        const voiceTranscript = document.getElementById('voiceTranscript');
        
        voiceBtn.classList.add('listening');
        voiceStatus.textContent = this.t('listening');
        voiceStatus.classList.add('listening');
        voiceAnimation.classList.remove('hidden');

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            voiceStatus.textContent = 'Processing...';
            voiceStatus.classList.remove('listening');
            voiceStatus.classList.add('processing');
            voiceTranscript.textContent = transcript;
            
            this.parseVoiceInput(transcript);
        };

        this.recognition.onerror = (event) => {
            voiceBtn.classList.remove('listening');
            voiceStatus.classList.remove('listening', 'processing');
            voiceAnimation.classList.add('hidden');
            voiceStatus.textContent = 'Voice recognition error. Please try again.';
        };

        this.recognition.onend = () => {
            voiceBtn.classList.remove('listening');
            voiceStatus.classList.remove('listening', 'processing');
            voiceAnimation.classList.add('hidden');
            
            setTimeout(() => {
                this.closeModal('voiceModal');
            }, 2000);
        };

        this.recognition.start();
    }

    parseVoiceInput(transcript) {
        // Extract amount using regex
        const amountRegex = /(\d+(?:\.\d{1,2})?)\s*(?:rupees?|rs\.?|₹)?/i;
        const amountMatch = transcript.match(amountRegex);
        
        let transaction = {
            description: transcript,
            amount: 0,
            paymentMethod: 'Cash',
            category: 'Others'
        };
        
        if (amountMatch) {
            transaction.amount = parseFloat(amountMatch[1]);
            transaction.description = transcript.replace(amountRegex, '').replace(/spent|paid|for|on/gi, '').trim();
        }

        // Auto-categorize based on keywords
        const foodKeywords = ['food', 'tea', 'coffee', 'breakfast', 'lunch', 'dinner', 'restaurant'];
        const transportKeywords = ['auto', 'bus', 'taxi', 'uber', 'ola', 'metro', 'train'];
        
        const lowerTranscript = transcript.toLowerCase();
        if (foodKeywords.some(keyword => lowerTranscript.includes(keyword))) {
            transaction.category = this.getLanguageData().categories[this.currentLanguage][0]; // Food & Dining
        } else if (transportKeywords.some(keyword => lowerTranscript.includes(keyword))) {
            transaction.category = this.getLanguageData().categories[this.currentLanguage][1]; // Transportation
        }

        this.saveVoiceTransaction(transaction);
    }

    saveVoiceTransaction(transactionData) {
        const now = new Date();
        const transaction = {
            id: Date.now(),
            description: transactionData.description || 'Voice transaction',
            amount: transactionData.amount,
            paymentMethod: transactionData.paymentMethod,
            category: transactionData.category,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().slice(0, 5),
            timestamp: now.toISOString()
        };

        this.transactions.push(transaction);
        this.saveData();
        this.updateDashboard();
        this.renderRecentTransactions();
        
        this.showToast(`${this.t('transactionSaved')}: ${this.t('currency')}${transaction.amount}`, 'success');
    }

    // Manual Entry Form
    showStep(step) {
        // Hide all steps
        for (let i = 1; i <= this.maxSteps; i++) {
            document.getElementById(`step${i}`).classList.remove('active');
        }
        
        // Show current step
        document.getElementById(`step${step}`).classList.add('active');
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const submitBtn = document.getElementById('submitManualBtn');
        
        prevBtn.classList.toggle('hidden', step === 1);
        nextBtn.classList.toggle('hidden', step === this.maxSteps);
        submitBtn.classList.toggle('hidden', step !== this.maxSteps);
        
        // Focus on the input field
        const currentStepElement = document.getElementById(`step${step}`);
        const input = currentStepElement.querySelector('input, select');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }

    nextStep() {
        if (this.currentStep < this.maxSteps) {
            // Validate current step
            const currentStepElement = document.getElementById(`step${this.currentStep}`);
            const input = currentStepElement.querySelector('input, select');
            
            if (input && input.hasAttribute('required') && !input.value.trim()) {
                this.showToast(this.t('fillAllFields'), 'error');
                return;
            }
            
            if (this.currentStep === 2) {
                const amount = parseFloat(input.value);
                if (isNaN(amount) || amount <= 0) {
                    this.showToast(this.t('invalidAmount'), 'error');
                    return;
                }
            }
            
            this.currentStep++;
            this.showStep(this.currentStep);
            this.showDescriptionSuggestions();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    showDescriptionSuggestions() {
        if (this.currentStep !== 1) return;
        
        const descriptionsUsed = [...new Set(this.transactions.map(t => t.description))];
        const suggestionsContainer = document.getElementById('descriptionSuggestions');
        
        if (descriptionsUsed.length > 0) {
            suggestionsContainer.innerHTML = descriptionsUsed.slice(0, 5).map(desc => 
                `<div class="suggestion-item" onclick="app.selectSuggestion('${desc}')">${desc}</div>`
            ).join('');
        }
    }

    selectSuggestion(suggestion) {
        document.getElementById('manualDescription').value = suggestion;
        document.getElementById('descriptionSuggestions').innerHTML = '';
    }

    // Event Handlers
    bindEvents() {
        // Language selector
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            localStorage.setItem('mypacket_language', this.currentLanguage);
            this.updateLanguageInterface();
        });

        // Entry buttons
        document.getElementById('voiceEntryBtn').addEventListener('click', () => this.openModal('voiceModal'));
        document.getElementById('manualEntryBtn').addEventListener('click', () => this.openManualEntryModal());
        
        // Voice controls
        document.getElementById('voiceBtn').addEventListener('click', () => this.startVoiceRecognition());
        
        // Manual entry form
        document.getElementById('nextStepBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('prevStepBtn').addEventListener('click', () => this.prevStep());
        document.getElementById('manualTransactionForm').addEventListener('submit', (e) => this.handleManualTransaction(e));
        
        // Passcode keypad
        document.querySelectorAll('.keypad-btn[data-digit]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleKeypadInput(e.target.dataset.digit));
        });
        
        document.querySelectorAll('.keypad-btn[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', () => this.handleKeypadDelete());
        });

        // Setup keypad
        document.querySelectorAll('.setup-keypad[data-digit]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSetupKeypadInput(e.target.dataset.digit));
        });
        
        document.querySelectorAll('.setup-delete').forEach(btn => {
            btn.addEventListener('click', () => this.handleSetupKeypadDelete());
        });

        // Lock app button
        document.getElementById('lockAppBtn').addEventListener('click', () => {
            if (this.securitySettings.passcodeEnabled) {
                this.lockApp();
            } else {
                this.showToast('Passcode is not enabled', 'error');
            }
        });

        // Security settings
        document.getElementById('enablePasscodeToggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.openPasscodeSetup();
            } else {
                this.disablePasscode();
            }
        });

        document.getElementById('changePasscodeBtn').addEventListener('click', () => this.openPasscodeSetup());
        
        document.getElementById('autoLockSelect').addEventListener('change', (e) => {
            this.securitySettings.autoLockTimeout = parseInt(e.target.value);
            this.saveSecuritySettings();
            this.resetAutoLockTimer();
        });

        document.getElementById('transactionSecurityToggle').addEventListener('change', (e) => {
            this.securitySettings.transactionSecurityEnabled = e.target.checked;
            this.saveSecuritySettings();
        });

        // Passcode setup
        document.getElementById('confirmPasscodeSetup').addEventListener('click', () => this.confirmPasscodeSetup());
        document.getElementById('cancelPasscodeSetup').addEventListener('click', () => this.cancelPasscodeSetup());
        
        // Other existing events
        document.getElementById('viewAllBtn').addEventListener('click', () => this.openHistoryModal());
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettingsModal());
        document.getElementById('editTransactionForm').addEventListener('submit', (e) => this.handleEditTransaction(e));
        document.getElementById('deleteTransactionBtn').addEventListener('click', () => this.confirmDeleteTransaction());
        document.getElementById('updatePacketBtn').addEventListener('click', () => this.updatePacketAmount());
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importDataBtn').addEventListener('click', () => document.getElementById('importDataInput').click());
        document.getElementById('importDataInput').addEventListener('change', (e) => this.importData(e));
        document.getElementById('resetDataBtn').addEventListener('click', () => this.confirmResetData());
        
        // Search and filter
        document.getElementById('searchInput').addEventListener('input', () => this.filterTransactions());
        document.getElementById('filterPayment').addEventListener('change', () => this.filterTransactions());
        
        // Close modals
        this.setupModalCloseEvents();
        
        // Confirmation modal
        document.getElementById('confirmActionBtn').addEventListener('click', () => this.executeConfirmAction());
        document.getElementById('confirmCancelBtn').addEventListener('click', () => this.closeModal('confirmModal'));
    }

    setupModalCloseEvents() {
        const modals = ['voiceModal', 'manualModal', 'editModal', 'historyModal', 'settingsModal', 'passcodeSetupModal'];
        
        modals.forEach(modalId => {
            const closeBtn = document.querySelector(`#${modalId} .close-btn`);
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal(modalId));
            }
        });
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    // Keypad Handlers
    handleKeypadInput(digit) {
        const input = document.getElementById('passcodeInput');
        if (input.value.length < 6) {
            input.value += digit;
            this.updatePasscodeDots(input.value);
            
            if (input.value.length >= 4) {
                setTimeout(() => this.verifyPasscodeInput(), 500);
            }
        }
    }

    handleKeypadDelete() {
        const input = document.getElementById('passcodeInput');
        input.value = input.value.slice(0, -1);
        this.updatePasscodeDots(input.value);
    }

    handleSetupKeypadInput(digit) {
        const input = document.getElementById('setupPasscodeInput');
        if (input.value.length < 6) {
            input.value += digit;
            this.updatePasscodeDots(input.value);
            
            const confirmBtn = document.getElementById('confirmPasscodeSetup');
            confirmBtn.disabled = input.value.length < 4;
        }
    }

    handleSetupKeypadDelete() {
        const input = document.getElementById('setupPasscodeInput');
        input.value = input.value.slice(0, -1);
        this.updatePasscodeDots(input.value);
        
        const confirmBtn = document.getElementById('confirmPasscodeSetup');
        confirmBtn.disabled = input.value.length < 4;
    }

    verifyPasscodeInput() {
        const passcode = document.getElementById('passcodeInput').value;
        
        if (this.verifyPasscode(passcode)) {
            this.showMainApp();
        } else {
            this.passcodeAttempts++;
            document.getElementById('passcodeError').textContent = this.t('passcodeIncorrect');
            document.getElementById('passcodeInput').value = '';
            this.updatePasscodeDots('');
            
            if (this.passcodeAttempts >= this.maxPasscodeAttempts) {
                // In a real app, you might want to implement additional security measures
                this.showToast('Too many failed attempts', 'error');
            }
        }
    }

    openPasscodeSetup() {
        this.isSetupMode = true;
        this.openModal('passcodeSetupModal');
        document.getElementById('setupPasscodeInput').value = '';
        this.updatePasscodeDots('');
        document.getElementById('confirmPasscodeSetup').disabled = true;
    }

    confirmPasscodeSetup() {
        const passcode = document.getElementById('setupPasscodeInput').value;
        
        if (!this.isSetupMode) {
            this.tempPasscode = passcode;
            this.isSetupMode = true;
            document.getElementById('passcodeSetupInstructions').textContent = 'Confirm your passcode';
            document.getElementById('setupPasscodeInput').value = '';
            this.updatePasscodeDots('');
            return;
        }

        if (this.tempPasscode && this.tempPasscode === passcode) {
            this.setPasscode(passcode);
            this.closeModal('passcodeSetupModal');
            this.updateSecurityUI();
            this.showToast(this.t('passcodeSetSuccess'), 'success');
        } else {
            this.showToast('Passcodes do not match', 'error');
            this.tempPasscode = '';
            this.isSetupMode = false;
            document.getElementById('passcodeSetupInstructions').textContent = 'Choose a 4-6 digit passcode';
            document.getElementById('setupPasscodeInput').value = '';
            this.updatePasscodeDots('');
        }
    }

    cancelPasscodeSetup() {
        this.closeModal('passcodeSetupModal');
        this.tempPasscode = '';
        this.isSetupMode = false;
        document.getElementById('enablePasscodeToggle').checked = this.securitySettings.passcodeEnabled;
    }

    disablePasscode() {
        this.securitySettings.passcodeEnabled = false;
        this.securitySettings.passcodeHash = null;
        this.saveSecuritySettings();
        this.updateSecurityUI();
        this.clearAutoLockTimer();
        this.showToast('Passcode disabled', 'success');
    }

    updateSecurityUI() {
        const toggle = document.getElementById('enablePasscodeToggle');
        const dependentElements = document.querySelectorAll('.passcode-dependent');
        
        toggle.checked = this.securitySettings.passcodeEnabled;
        
        dependentElements.forEach(el => {
            el.classList.toggle('hidden', !this.securitySettings.passcodeEnabled);
        });

        if (this.securitySettings.passcodeEnabled) {
            this.resetAutoLockTimer();
        }
    }

    openManualEntryModal() {
        this.currentStep = 1;
        this.openModal('manualModal');
        this.showStep(1);
        this.setCurrentDateTime('manual');
        this.showDescriptionSuggestions();
    }

    handleManualTransaction(e) {
        e.preventDefault();
        
        const transaction = {
            id: Date.now(),
            description: document.getElementById('manualDescription').value,
            amount: parseFloat(document.getElementById('manualAmount').value),
            paymentMethod: document.getElementById('manualPaymentMethod').value,
            category: document.getElementById('manualCategory').value,
            date: document.getElementById('manualDate').value,
            time: document.getElementById('manualTime').value,
            timestamp: `${document.getElementById('manualDate').value}T${document.getElementById('manualTime').value}:00`
        };

        this.transactions.push(transaction);
        this.saveData();
        this.updateDashboard();
        this.renderRecentTransactions();
        
        // Reset form
        e.target.reset();
        this.closeModal('manualModal');
        
        this.showToast(`${this.t('transactionSaved')}: ${this.t('currency')}${transaction.amount}`, 'success');
    }

    // Other methods remain the same...
    setCurrentDateTime(prefix = '') {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().slice(0, 5);
        
        document.getElementById(`${prefix}Date` || 'transactionDate').value = date;
        document.getElementById(`${prefix}Time` || 'transactionTime').value = time;
    }

    updateDashboard() {
        // Update packet amount display
        const totalExpenses = this.transactions.reduce((sum, t) => sum + t.amount, 0);
        const currentBalance = this.packetAmount - totalExpenses;
        
        document.getElementById('packetAmount').textContent = `${this.t('currency')}${currentBalance.toLocaleString('en-IN')}`;
        
        // Calculate today's and monthly expenses
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = today.substring(0, 7);
        
        const todayTransactions = this.transactions.filter(t => t.date === today);
        const monthlyTransactions = this.transactions.filter(t => t.date.startsWith(currentMonth));
        
        const todayExpenses = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
        const monthlyExpenses = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        document.getElementById('todayExpenses').textContent = `${this.t('currency')}${todayExpenses.toLocaleString('en-IN')}`;
        document.getElementById('monthlyExpenses').textContent = `${this.t('currency')}${monthlyExpenses.toLocaleString('en-IN')}`;
        
        // Update balance color
        const balanceElement = document.getElementById('packetAmount');
        balanceElement.style.color = currentBalance >= 0 ? 'var(--color-success)' : 'var(--color-error)';
    }

    renderRecentTransactions() {
        const container = document.getElementById('transactionsList');
        const recentTransactions = this.transactions
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);
        
        if (recentTransactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💰</div>
                    <p>No transactions yet. Add your first transaction!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recentTransactions.map(transaction => this.createTransactionHTML(transaction)).join('');
    }

    createTransactionHTML(transaction, showFullDetails = false) {
        const isDigitalPayment = !['Cash', 'नकद', 'నగదు'].includes(transaction.paymentMethod);
        const paymentClass = isDigitalPayment ? 'payment-digital' : 'payment-cash';
        
        const date = new Date(transaction.timestamp);
        const formattedDate = date.toLocaleDateString('en-IN');
        const formattedTime = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="transaction-item" onclick="app.openEditModal(${JSON.stringify(transaction).replace(/"/g, '&quot;')})" tabindex="0">
                <div class="transaction-header">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-amount">${this.t('currency')}${transaction.amount.toLocaleString('en-IN')}</div>
                </div>
                <div class="transaction-meta">
                    <div class="transaction-payment ${paymentClass}">
                        ${transaction.paymentMethod}
                    </div>
                    <div class="transaction-category">${transaction.category}</div>
                </div>
                <div class="transaction-datetime">
                    ${formattedDate} at ${formattedTime}
                </div>
            </div>
        `;
    }

    async openEditModal(transaction) {
        if (this.securitySettings.transactionSecurityEnabled) {
            const verified = await this.requirePasscodeVerification();
            if (!verified) return;
        }

        document.getElementById('editTransactionId').value = transaction.id;
        document.getElementById('editDescription').value = transaction.description;
        document.getElementById('editAmount').value = transaction.amount;
        document.getElementById('editPaymentMethod').value = transaction.paymentMethod;
        document.getElementById('editCategory').value = transaction.category;
        document.getElementById('editDate').value = transaction.date;
        document.getElementById('editTime').value = transaction.time;
        
        this.openModal('editModal');
    }

    requirePasscodeVerification() {
        return new Promise((resolve) => {
            // Simple implementation - in production, you'd want a more sophisticated approach
            const passcode = prompt(this.t('enterPasscode'));
            resolve(this.verifyPasscode(passcode));
        });
    }

    handleEditTransaction(e) {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('editTransactionId').value);
        const transactionIndex = this.transactions.findIndex(t => t.id === id);
        
        if (transactionIndex === -1) return;
        
        this.transactions[transactionIndex] = {
            ...this.transactions[transactionIndex],
            description: document.getElementById('editDescription').value,
            amount: parseFloat(document.getElementById('editAmount').value),
            paymentMethod: document.getElementById('editPaymentMethod').value,
            category: document.getElementById('editCategory').value,
            date: document.getElementById('editDate').value,
            time: document.getElementById('editTime').value,
            timestamp: `${document.getElementById('editDate').value}T${document.getElementById('editTime').value}:00`
        };

        this.saveData();
        this.updateDashboard();
        this.renderRecentTransactions();
        this.renderAllTransactions();
        this.closeModal('editModal');
        
        this.showToast(this.t('transactionUpdated'), 'success');
    }

    confirmDeleteTransaction() {
        this.showConfirmModal(
            this.t('confirmDelete'),
            () => this.deleteTransaction()
        );
    }

    deleteTransaction() {
        const id = parseInt(document.getElementById('editTransactionId').value);
        this.transactions = this.transactions.filter(t => t.id !== id);
        
        this.saveData();
        this.updateDashboard();
        this.renderRecentTransactions();
        this.renderAllTransactions();
        this.closeModal('editModal');
        
        this.showToast(this.t('transactionDeleted'), 'success');
    }

    showConfirmModal(message, callback) {
        document.getElementById('confirmModalMessage').textContent = message;
        this.confirmCallback = callback;
        this.openModal('confirmModal');
    }

    executeConfirmAction() {
        if (this.confirmCallback) {
            this.confirmCallback();
            this.confirmCallback = null;
        }
        this.closeModal('confirmModal');
    }

    openHistoryModal() {
        this.renderAllTransactions();
        this.openModal('historyModal');
    }

    renderAllTransactions() {
        const container = document.getElementById('allTransactions');
        const sorted = this.transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (sorted.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💰</div>
                    <p>No transactions found</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = sorted.map(transaction => this.createTransactionHTML(transaction, true)).join('');
    }

    filterTransactions() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const paymentFilter = document.getElementById('filterPayment').value;
        
        let filtered = this.transactions.filter(transaction => {
            const matchesSearch = transaction.description.toLowerCase().includes(searchTerm) ||
                                transaction.category.toLowerCase().includes(searchTerm);
            const matchesPayment = !paymentFilter || transaction.paymentMethod === paymentFilter;
            
            return matchesSearch && matchesPayment;
        });
        
        this.renderFilteredTransactions(filtered);
    }

    renderFilteredTransactions(transactions) {
        const container = document.getElementById('allTransactions');
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <p>No transactions found matching your criteria</p>
                </div>
            `;
            return;
        }
        
        const sorted = transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        container.innerHTML = sorted.map(transaction => this.createTransactionHTML(transaction, true)).join('');
    }

    openSettingsModal() {
        this.updateSecurityUI();
        document.getElementById('newPacketAmount').value = this.packetAmount;
        document.getElementById('autoLockSelect').value = this.securitySettings.autoLockTimeout;
        document.getElementById('transactionSecurityToggle').checked = this.securitySettings.transactionSecurityEnabled;
        this.openModal('settingsModal');
    }

    updatePacketAmount() {
        const newAmount = parseFloat(document.getElementById('newPacketAmount').value);
        if (newAmount >= 0) {
            this.packetAmount = newAmount;
            this.saveData();
            this.updateDashboard();
            this.showToast('Packet amount updated successfully', 'success');
        }
    }

    confirmResetData() {
        this.showConfirmModal(
            this.t('confirmReset'),
            () => this.resetAllData()
        );
    }

    resetAllData() {
        this.transactions = [];
        this.packetAmount = 10000;
        this.securitySettings = {
            passcodeEnabled: false,
            autoLockEnabled: false,
            autoLockTimeout: 300000,
            transactionSecurityEnabled: false,
            passcodeHash: null
        };
        
        this.saveData();
        this.saveSecuritySettings();
        this.updateDashboard();
        this.renderRecentTransactions();
        this.updateSecurityUI();
        
        this.showToast(this.t('dataResetSuccess'), 'success');
    }

    exportData() {
        const data = {
            transactions: this.transactions,
            packetAmount: this.packetAmount,
            language: this.currentLanguage,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mypacket_data_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Data exported successfully', 'success');
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (data.transactions && Array.isArray(data.transactions)) {
                    this.transactions = data.transactions;
                }
                if (data.packetAmount !== undefined) {
                    this.packetAmount = data.packetAmount;
                }
                if (data.language) {
                    this.currentLanguage = data.language;
                    document.getElementById('languageSelect').value = this.currentLanguage;
                    this.updateLanguageInterface();
                }
                
                this.saveData();
                this.updateDashboard();
                this.renderRecentTransactions();
                
                this.showToast('Data imported successfully', 'success');
            } catch (error) {
                this.showToast('Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
        
        e.target.value = '';
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        document.body.style.overflow = '';
        
        // Reset form states
        if (modalId === 'manualModal') {
            this.currentStep = 1;
            document.getElementById('manualTransactionForm').reset();
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const content = document.getElementById('toastContent');
        
        content.textContent = message;
        toast.className = `toast ${type}`;
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 3000);
    }

    saveData() {
        localStorage.setItem('mypacket_transactions', JSON.stringify(this.transactions));
        localStorage.setItem('mypacket_packet_amount', this.packetAmount.toString());
        localStorage.setItem('mypacket_language', this.currentLanguage);
    }

    loadData() {
        const savedTransactions = localStorage.getItem('mypacket_transactions');
        const savedPacketAmount = localStorage.getItem('mypacket_packet_amount');
        const savedLanguage = localStorage.getItem('mypacket_language');
        
        if (savedTransactions) {
            this.transactions = JSON.parse(savedTransactions);
        }
        
        if (savedPacketAmount) {
            this.packetAmount = parseFloat(savedPacketAmount);
        }
        
        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
        }
    }
}

// Initialize the app
const app = new MyPacketApp();