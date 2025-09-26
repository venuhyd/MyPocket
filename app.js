class MyPacketApp {
    constructor() {
        this.transactions = [];
        this.packetAmount = 10000;
        this.currentEditingId = null;
        this.recognition = null;
        this.currentLanguage = 'en';
        this.currentSection = 'dashboard';
        this.touchStartY = 0;
        this.touchStartX = 0;
        
        // Language data from provided JSON
        this.languages = {
            "en": {
                "appTitle": "MyPacket",
                "packetAmount": "Packet Amount",
                "todayExpenses": "Today's Expenses",
                "monthlyExpenses": "Monthly Expenses",
                "addTransaction": "Add Transaction",
                "description": "Description",
                "amount": "Amount",
                "paymentMethod": "Payment Method",
                "category": "Category",
                "recentTransactions": "Recent Transactions",
                "monthFilter": "Filter by Month",
                "allMonths": "All Months",
                "settings": "Settings",
                "language": "Language",
                "currency": "₹",
                "voiceHint": "Speak your transaction...",
                "listening": "Listening...",
                "edit": "Edit Transaction",
                "delete": "Delete",
                "save": "Save",
                "cancel": "Cancel",
                "update": "Update",
                "dashboard": "Dashboard",
                "transactions": "Transactions",
                "voiceError": "Voice recognition error. Please try again.",
                "voiceNotSupported": "Voice recognition not supported in this browser",
                "dataManagement": "Data Management",
                "exportData": "Export Data",
                "importData": "Import Data",
                "addManually": "Add Manually",
                "processing": "Processing...",
                "date": "Date",
                "time": "Time"
            },
            "hi": {
                "appTitle": "मेरा पैकेट",
                "packetAmount": "पैकेट राशि",
                "todayExpenses": "आज का खर्च",
                "monthlyExpenses": "मासिक खर्च",
                "addTransaction": "लेन-देन जोड़ें",
                "description": "विवरण",
                "amount": "राशि",
                "paymentMethod": "भुगतान विधि",
                "category": "श्रेणी",
                "recentTransactions": "हाल के लेन-देन",
                "monthFilter": "महीने के अनुसार फ़िल्टर करें",
                "allMonths": "सभी महीने",
                "settings": "सेटिंग्स",
                "language": "भाषा",
                "currency": "₹",
                "voiceHint": "अपना लेन-देन बोलें...",
                "listening": "सुन रहा है...",
                "edit": "लेन-देन संपादित करें",
                "delete": "मिटाएं",
                "save": "सहेजें",
                "cancel": "रद्द करें",
                "update": "अपडेट करें",
                "dashboard": "डैशबोर्ड",
                "transactions": "लेन-देन",
                "voiceError": "आवाज़ पहचान में त्रुटि। कृपया फिर से कोशिश करें।",
                "voiceNotSupported": "इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है",
                "dataManagement": "डेटा प्रबंधन",
                "exportData": "डेटा निर्यात करें",
                "importData": "डेटा आयात करें",
                "addManually": "मैन्युअल रूप से जोड़ें",
                "processing": "प्रोसेसिंग...",
                "date": "दिनांक",
                "time": "समय"
            },
            "te": {
                "appTitle": "నా పాకెట్",
                "packetAmount": "పాకెట్ మొత్తం",
                "todayExpenses": "నేటి ఖర్చులు",
                "monthlyExpenses": "మాసిక ఖర్చులు",
                "addTransaction": "లావాదేవీ జోడించండి",
                "description": "వివరణ",
                "amount": "మొత్తం",
                "paymentMethod": "చెల్లింపు విధానం",
                "category": "వర్గం",
                "recentTransactions": "ఇటీవలి లావాదేవీలు",
                "monthFilter": "నెల వారీగా వడపోత",
                "allMonths": "అన్ని నెలలు",
                "settings": "సెట్టింగులు",
                "language": "భాష",
                "currency": "₹",
                "voiceHint": "మీ లావాదేవీని చెప్పండి...",
                "listening": "వింటున్నాను...",
                "edit": "లావాదేవీ సవరించండి",
                "delete": "తొలగించు",
                "save": "భద్రపరచు",
                "cancel": "రద్దు చేయి",
                "update": "నవీకరించు",
                "dashboard": "డ్యాష్‌బోర్డ్",
                "transactions": "లావాదేవీలు",
                "voiceError": "వాయిస్ గుర్తింపు లోపం. దయచేసి మళ్లీ ప్రయత్నించండి।",
                "voiceNotSupported": "ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు మద్దతు లేదు",
                "dataManagement": "డేటా నిర్వహణ",
                "exportData": "డేటా ఎగుమతి",
                "importData": "డేటా దిగుమతి",
                "addManually": "చేతితో జోడించండి",
                "processing": "ప్రాసెసింగ్...",
                "date": "తేదీ",
                "time": "సమయం"
            }
        };

        this.paymentMethods = {
            "en": ["Cash", "PhonePe", "Google Pay", "PayTM", "UPI", "Debit Card", "Credit Card", "Net Banking"],
            "hi": ["नकद", "PhonePe", "Google Pay", "PayTM", "UPI", "डेबिट कार्ड", "क्रेडिट कार्ड", "नेट बैंकिंग"],
            "te": ["నగదు", "PhonePe", "Google Pay", "PayTM", "UPI", "డెబిట్ కార్డ్", "క్రెడిట్ కార్డ్", "నెట్ బ్యాంకింగ్"]
        };

        this.categories = {
            "en": ["Food & Dining", "Transportation", "Shopping", "Bills & Utilities", "Entertainment", "Healthcare", "Education", "Others"],
            "hi": ["खाना और भोजन", "परिवहन", "खरीदारी", "बिल और उपयोगिताएं", "मनोरंजन", "स्वास्थ्य सेवा", "शिक्षा", "अन्य"],
            "te": ["ఆహారం & భోజనం", "రవాణా", "షాపింగ్", "బిల్లులు & యుటిలిటీస్", "వినోదం", "ఆరోగ్య సంరక్షణ", "విద్య", "ఇతరాలు"]
        };

        this.months = {
            "en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "hi": ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
            "te": ["జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్", "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్"]
        };
        
        this.init();
        this.initSpeechRecognition();
        this.bindEvents();
        this.loadData();
        this.updateLanguage();
        this.updateDashboard();
        this.renderTransactions();
        this.setCurrentDateTime();
        this.populateMonthFilter();
    }

    init() {
        // Load saved language
        const savedLanguage = localStorage.getItem('mypacket_language') || 'en';
        this.currentLanguage = savedLanguage;
        
        // Initialize with sample data if no existing data
        const savedTransactions = localStorage.getItem('mypacket_transactions');
        const savedPacketAmount = localStorage.getItem('mypacket_packet_amount');
        
        if (!savedTransactions) {
            this.transactions = [
                {
                    id: 1,
                    description: "Tea and snacks",
                    amount: 85,
                    paymentMethod: "PhonePe",
                    category: "Food & Dining",
                    date: "2025-01-24",
                    time: "09:30",
                    timestamp: "2025-01-24T09:30:00"
                },
                {
                    id: 2,
                    description: "Auto fare",
                    amount: 40,
                    paymentMethod: "Cash",
                    category: "Transportation",
                    date: "2025-01-24",
                    time: "10:15", 
                    timestamp: "2025-01-24T10:15:00"
                },
                {
                    id: 3,
                    description: "Grocery shopping",
                    amount: 750,
                    paymentMethod: "Google Pay",
                    category: "Shopping",
                    date: "2025-01-23",
                    time: "18:45",
                    timestamp: "2025-01-23T18:45:00"
                }
            ];
            this.saveData();
        }
        
        if (!savedPacketAmount) {
            this.packetAmount = 10000;
            localStorage.setItem('mypacket_packet_amount', this.packetAmount.toString());
        }
    }

    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.updateSpeechLanguage();
        }
    }

    updateSpeechLanguage() {
        if (!this.recognition) return;
        
        const langMap = {
            'en': 'en-IN',
            'hi': 'hi-IN',
            'te': 'te-IN'
        };
        
        this.recognition.lang = langMap[this.currentLanguage] || 'en-IN';
    }

    bindEvents() {
        // Voice button - always show manual form as fallback
        document.getElementById('voiceFab').addEventListener('click', () => this.handleVoiceClick());
        
        // Form submissions
        document.getElementById('transactionForm').addEventListener('submit', (e) => this.handleAddTransaction(e));
        document.getElementById('editTransactionForm').addEventListener('submit', (e) => this.handleEditTransaction(e));
        
        // Modal controls
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettingsModal());
        document.getElementById('closeEditModal').addEventListener('click', () => this.closeModal('editModal'));
        document.getElementById('closeSettingsModal').addEventListener('click', () => this.closeModal('settingsModal'));
        document.getElementById('closeQuickAdd').addEventListener('click', () => this.closeQuickAdd());
        
        // Settings
        document.getElementById('languageSelect').addEventListener('change', (e) => this.changeLanguage(e.target.value));
        document.getElementById('updatePacketBtn').addEventListener('click', () => this.updatePacketAmount());
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importDataBtn').addEventListener('click', () => document.getElementById('importDataInput').click());
        document.getElementById('importDataInput').addEventListener('change', (e) => this.importData(e));
        
        // Delete transaction
        document.getElementById('deleteTransactionBtn').addEventListener('click', () => this.deleteTransaction());
        
        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e.currentTarget));
        });
        
        // Month filter
        document.getElementById('monthFilter').addEventListener('change', () => this.renderTransactions());
        
        // Touch events for mobile interactions
        this.bindTouchEvents();
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Settings nav button
        document.getElementById('settingsNavBtn').addEventListener('click', () => this.openSettingsModal());
    }

    bindTouchEvents() {
        // Pull to refresh simulation
        let startY = 0;
        let pullDistance = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].pageY;
            this.touchStartY = startY;
            this.touchStartX = e.touches[0].pageX;
        });
        
        // Add haptic feedback for button interactions
        document.querySelectorAll('button, .transaction-item').forEach(element => {
            element.addEventListener('touchstart', () => {
                if ('vibrate' in navigator) {
                    navigator.vibrate(10); // Light haptic feedback
                }
                element.classList.add('touch-feedback');
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => element.classList.remove('touch-feedback'), 150);
            });
        });
    }

    handleVoiceClick() {
        // Always show the form first as fallback
        this.showQuickAdd();
        
        // Try voice recognition if supported
        if (this.recognition) {
            this.startVoiceRecognition();
        } else {
            const t = this.languages[this.currentLanguage];
            this.showToast(t.voiceNotSupported, 'error');
        }
    }

    startVoiceRecognition() {
        const voiceFab = document.getElementById('voiceFab');
        const voiceStatus = document.getElementById('voiceStatus');
        const t = this.languages[this.currentLanguage];
        
        voiceFab.classList.add('listening');
        voiceStatus.textContent = t.listening;
        voiceStatus.classList.add('listening');

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            voiceStatus.textContent = t.processing;
            voiceStatus.classList.remove('listening');
            voiceStatus.classList.add('processing');
            
            this.parseVoiceInput(transcript);
        };

        this.recognition.onerror = (event) => {
            voiceFab.classList.remove('listening');
            voiceStatus.classList.remove('listening', 'processing');
            voiceStatus.textContent = t.voiceError;
            // Form stays open for manual entry
        };

        this.recognition.onend = () => {
            voiceFab.classList.remove('listening');
            voiceStatus.classList.remove('listening', 'processing');
        };

        try {
            this.recognition.start();
        } catch (error) {
            const t = this.languages[this.currentLanguage];
            voiceFab.classList.remove('listening');
            voiceStatus.classList.remove('listening', 'processing');
            voiceStatus.textContent = t.voiceError;
        }
    }

    parseVoiceInput(transcript) {
        const voiceStatus = document.getElementById('voiceStatus');
        
        // Enhanced parsing for multiple languages and Indian patterns
        const patterns = {
            amount: [
                /(\d+(?:\.\d{1,2})?)\s*(?:rupees?|rs\.?|₹|रुपए|रुपये|రూపాయలు)/i,
                /(?:spent|खर्च|ఖర్చు|paid|दिया|ఇచ్చా)\s*(\d+(?:\.\d{1,2})?)/i,
                /(\d+(?:\.\d{1,2})?)\s*(?:for|के लिए|కోసం)/i
            ]
        };
        
        let amount = null;
        let cleanDescription = transcript;
        
        // Try to extract amount
        for (const pattern of patterns.amount) {
            const match = transcript.match(pattern);
            if (match) {
                amount = parseFloat(match[1]);
                cleanDescription = transcript.replace(pattern, '').trim();
                break;
            }
        }
        
        if (amount) {
            document.getElementById('amount').value = amount;
            // Clean up description
            cleanDescription = cleanDescription
                .replace(/spent|paid|bought|खर्च|दिया|खरीदा|ఖర్చు|ఇచ్చా|కొన్నా/gi, '')
                .replace(/for|on|के लिए|पर|కోసం|మీద/gi, '')
                .replace(/rupees?|rs\.?|₹|रुपए|रुपये|రూపాయలు/gi, '')
                .trim();
            
            document.getElementById('description').value = cleanDescription || transcript;
            voiceStatus.textContent = `Captured: ₹${amount} - ${cleanDescription || transcript}`;
        } else {
            document.getElementById('description').value = transcript;
            voiceStatus.textContent = `Captured: ${transcript}`;
        }
        
        // Clear status after 3 seconds
        setTimeout(() => {
            voiceStatus.textContent = '';
        }, 3000);
    }

    showQuickAdd() {
        document.getElementById('quickAddSection').style.display = 'block';
        document.getElementById('quickAddSection').scrollIntoView({ behavior: 'smooth' });
    }

    closeQuickAdd() {
        document.getElementById('quickAddSection').style.display = 'none';
        document.getElementById('transactionForm').reset();
        this.setCurrentDateTime();
        document.getElementById('voiceStatus').textContent = '';
    }

    changeLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('mypacket_language', language);
        this.updateLanguage();
        this.updateSpeechLanguage();
        this.populateDropdowns();
        this.renderTransactions();
        this.populateMonthFilter();
        this.showToast('Language changed successfully', 'success');
    }

    updateLanguage() {
        const t = this.languages[this.currentLanguage];
        
        // Update all text elements
        document.getElementById('appTitle').textContent = t.appTitle;
        document.getElementById('settingsText').textContent = t.settings;
        document.getElementById('packetAmountLabel').textContent = t.packetAmount;
        document.getElementById('todayExpensesLabel').textContent = t.todayExpenses;
        document.getElementById('monthlyExpensesLabel').textContent = t.monthlyExpenses;
        document.getElementById('voiceHint').textContent = t.voiceHint;
        document.getElementById('addTransactionTitle').textContent = t.addTransaction;
        document.getElementById('descriptionLabel').textContent = t.description;
        document.getElementById('amountLabel').textContent = t.amount;
        document.getElementById('categoryLabel').textContent = t.category;
        document.getElementById('paymentMethodLabel').textContent = t.paymentMethod;
        document.getElementById('dateLabel').textContent = t.date;
        document.getElementById('timeLabel').textContent = t.time;
        document.getElementById('saveBtn').textContent = t.save;
        document.getElementById('recentTransactionsTitle').textContent = t.recentTransactions;
        document.getElementById('dashboardNavText').textContent = t.dashboard;
        document.getElementById('transactionsNavText').textContent = t.transactions;
        document.getElementById('settingsNavText').textContent = t.settings;
        
        // Modal elements
        document.getElementById('editTransactionTitle').textContent = t.edit;
        document.getElementById('editDescriptionLabel').textContent = t.description;
        document.getElementById('editAmountLabel').textContent = t.amount;
        document.getElementById('editCategoryLabel').textContent = t.category;
        document.getElementById('editPaymentMethodLabel').textContent = t.paymentMethod;
        document.getElementById('editDateLabel').textContent = t.date;
        document.getElementById('editTimeLabel').textContent = t.time;
        document.getElementById('updateBtn').textContent = t.update;
        document.getElementById('deleteTransactionBtn').textContent = t.delete;
        
        // Settings modal
        document.getElementById('settingsTitle').textContent = t.settings;
        document.getElementById('languageSettingsTitle').textContent = t.language;
        document.getElementById('languageLabel').textContent = t.language;
        document.getElementById('packetSettingsTitle').textContent = t.packetAmount;
        document.getElementById('newPacketAmountLabel').textContent = t.packetAmount;
        document.getElementById('updatePacketBtn').textContent = t.update;
        document.getElementById('dataManagementTitle').textContent = t.dataManagement;
        document.getElementById('exportDataBtn').textContent = t.exportData;
        document.getElementById('importDataBtn').textContent = t.importData;
        
        // Set language select value
        document.getElementById('languageSelect').value = this.currentLanguage;
        
        this.populateDropdowns();
    }

    populateDropdowns() {
        const categorySelects = [document.getElementById('category'), document.getElementById('editCategory')];
        const paymentSelects = [document.getElementById('paymentMethod'), document.getElementById('editPaymentMethod')];
        const t = this.languages[this.currentLanguage];
        
        // Clear and populate categories
        categorySelects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = `<option value="">${t.category}</option>`;
            this.categories[this.currentLanguage].forEach((cat, index) => {
                const option = document.createElement('option');
                option.value = this.categories.en[index]; // Store English value
                option.textContent = cat;
                select.appendChild(option);
            });
            if (currentValue) select.value = currentValue;
        });
        
        // Clear and populate payment methods
        paymentSelects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = `<option value="">${t.paymentMethod}</option>`;
            this.paymentMethods[this.currentLanguage].forEach((method, index) => {
                const option = document.createElement('option');
                option.value = this.paymentMethods.en[index]; // Store English value
                option.textContent = method;
                select.appendChild(option);
            });
            if (currentValue) select.value = currentValue;
        });
    }

    populateMonthFilter() {
        const monthFilter = document.getElementById('monthFilter');
        const currentFilter = monthFilter.value;
        const t = this.languages[this.currentLanguage];
        
        monthFilter.innerHTML = `<option value="">${t.allMonths}</option>`;
        
        // Get unique months from transactions
        const transactionMonths = [...new Set(this.transactions.map(t => {
            const date = new Date(t.timestamp);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }))].sort().reverse();
        
        transactionMonths.forEach(monthStr => {
            const [year, month] = monthStr.split('-');
            const monthIndex = parseInt(month) - 1;
            const monthName = this.months[this.currentLanguage][monthIndex];
            
            const option = document.createElement('option');
            option.value = monthStr;
            option.textContent = `${monthName} ${year}`;
            monthFilter.appendChild(option);
        });
        
        if (currentFilter) monthFilter.value = currentFilter;
    }

    handleNavigation(navItem) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        
        // Add active class to clicked item
        navItem.classList.add('active');
        
        // Handle navigation logic
        const section = navItem.dataset.section;
        this.currentSection = section;
        
        if (section === 'settings') {
            this.openSettingsModal();
        }
        // Dashboard and transactions are on the same page, just different sections
    }

    setCurrentDateTime() {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().slice(0, 5);
        
        document.getElementById('transactionDate').value = date;
        document.getElementById('transactionTime').value = time;
    }

    handleAddTransaction(e) {
        e.preventDefault();
        
        const transaction = {
            id: Date.now(),
            description: document.getElementById('description').value,
            amount: parseFloat(document.getElementById('amount').value),
            paymentMethod: document.getElementById('paymentMethod').value,
            category: document.getElementById('category').value,
            date: document.getElementById('transactionDate').value,
            time: document.getElementById('transactionTime').value,
            timestamp: `${document.getElementById('transactionDate').value}T${document.getElementById('transactionTime').value}:00`
        };

        this.transactions.push(transaction);
        this.saveData();
        this.updateDashboard();
        this.renderTransactions();
        this.populateMonthFilter();
        
        // Reset form and close
        this.closeQuickAdd();
        
        this.showToast(`Transaction added: ₹${transaction.amount.toLocaleString('en-IN')}`, 'success');
        
        // Add haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
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
        this.renderTransactions();
        this.populateMonthFilter();
        this.closeModal('editModal');
        
        this.showToast('Transaction updated successfully', 'success');
    }

    deleteTransaction() {
        const id = parseInt(document.getElementById('editTransactionId').value);
        this.transactions = this.transactions.filter(t => t.id !== id);
        
        this.saveData();
        this.updateDashboard();
        this.renderTransactions();
        this.populateMonthFilter();
        this.closeModal('editModal');
        
        this.showToast('Transaction deleted successfully', 'success');
    }

    openEditModal(transaction) {
        document.getElementById('editTransactionId').value = transaction.id;
        document.getElementById('editDescription').value = transaction.description;
        document.getElementById('editAmount').value = transaction.amount;
        document.getElementById('editPaymentMethod').value = transaction.paymentMethod;
        document.getElementById('editCategory').value = transaction.category;
        document.getElementById('editDate').value = transaction.date;
        document.getElementById('editTime').value = transaction.time;
        
        this.openModal('editModal');
    }

    openSettingsModal() {
        document.getElementById('newPacketAmount').value = this.packetAmount;
        this.openModal('settingsModal');
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        document.body.style.overflow = '';
    }

    updatePacketAmount() {
        const newAmount = parseFloat(document.getElementById('newPacketAmount').value);
        if (newAmount >= 0) {
            this.packetAmount = newAmount;
            localStorage.setItem('mypacket_packet_amount', this.packetAmount.toString());
            this.updateDashboard();
            this.showToast('Packet amount updated successfully', 'success');
        }
    }

    updateDashboard() {
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        
        // Calculate today's expenses
        const todayTransactions = this.transactions.filter(t => t.date === today);
        const todayExpenses = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        // Calculate monthly expenses
        const monthlyTransactions = this.transactions.filter(t => t.timestamp.slice(0, 7) === currentMonth);
        const monthlyExpenses = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        // Calculate current balance
        const totalExpenses = this.transactions.reduce((sum, t) => sum + t.amount, 0);
        const currentBalance = this.packetAmount - totalExpenses;
        
        // Update display
        document.getElementById('packetAmount').textContent = `₹${currentBalance.toLocaleString('en-IN')}`;
        document.getElementById('todayExpenses').textContent = `₹${todayExpenses.toLocaleString('en-IN')}`;
        document.getElementById('monthlyExpenses').textContent = `₹${monthlyExpenses.toLocaleString('en-IN')}`;
        
        // Update balance color
        const balanceElement = document.getElementById('packetAmount');
        balanceElement.style.color = currentBalance >= 0 ? 'var(--color-success)' : 'var(--color-error)';
    }

    renderTransactions() {
        const container = document.getElementById('transactionsList');
        const monthFilter = document.getElementById('monthFilter').value;
        
        let filteredTransactions = [...this.transactions];
        
        // Apply month filter
        if (monthFilter) {
            filteredTransactions = filteredTransactions.filter(t => 
                t.timestamp.slice(0, 7) === monthFilter
            );
        }
        
        // Sort by most recent
        const sorted = filteredTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (sorted.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💰</div>
                    <p>No transactions found</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = sorted.map(transaction => this.createTransactionHTML(transaction)).join('');
    }

    createTransactionHTML(transaction) {
        const isDigitalPayment = !['Cash', 'नकद', 'నగదు'].some(cash => 
            transaction.paymentMethod.includes(cash)
        );
        const paymentClass = isDigitalPayment ? 'payment-digital' : 'payment-cash';
        
        const date = new Date(transaction.timestamp);
        const formattedDate = date.toLocaleDateString('en-IN');
        const formattedTime = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        
        // Get localized category and payment method names
        const categoryIndex = this.categories.en.indexOf(transaction.category);
        const paymentIndex = this.paymentMethods.en.indexOf(transaction.paymentMethod);
        
        const localizedCategory = categoryIndex >= 0 ? 
            this.categories[this.currentLanguage][categoryIndex] : transaction.category;
        const localizedPayment = paymentIndex >= 0 ? 
            this.paymentMethods[this.currentLanguage][paymentIndex] : transaction.paymentMethod;
        
        return `
            <div class="transaction-item" onclick="app.openEditModal(${JSON.stringify(transaction).replace(/"/g, '&quot;')})" tabindex="0">
                <div class="transaction-header">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-amount">₹${transaction.amount.toLocaleString('en-IN')}</div>
                </div>
                <div class="transaction-meta">
                    <div class="transaction-payment ${paymentClass}">
                        ${localizedPayment}
                    </div>
                    <div class="transaction-category">${localizedCategory}</div>
                </div>
                <div class="transaction-datetime">
                    ${formattedDate} at ${formattedTime}
                </div>
            </div>
        `;
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
                if (data.language && this.languages[data.language]) {
                    this.currentLanguage = data.language;
                    this.changeLanguage(data.language);
                }
                
                this.saveData();
                this.updateDashboard();
                this.renderTransactions();
                this.populateMonthFilter();
                
                this.showToast('Data imported successfully', 'success');
            } catch (error) {
                this.showToast('Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        e.target.value = '';
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
        
        if (savedLanguage && this.languages[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MyPacketApp();
});