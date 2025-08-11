
 const firebaseConfig = {
            apiKey: "AIzaSyBEOcSk1BnAOu707UHUDVYJKVSbMjR7-iE",
            authDomain: "igris-1a02c.firebaseapp.com",
            databaseURL: "https://igris-1a02c-default-rtdb.firebaseio.com",
            projectId: "igris-1a02c",
            storageBucket: "igris-1a02c.appspot.com",
            appId: "1:105728215656:web:974d56e39dd6d660e7c9dd"
        };

        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
        } catch (e) { console.error("Firebase error:", e); }
        const database = firebase.database();

        let currentVisibleSection = 'predictionSection';
        let h_historyData = []; const H_MAX_HISTORY = 150; const H_MAX_DISPLAY = 40;
        let h_lastFetchedPeriod = null; let h_streak = 0; let h_consecutiveLosses = 0;
        let h_activeLogicName = "🔥 DAMMM"; 
        let h_predictionUpdateInterval; 
        let predictionCount = 0;
        let currentLanguage = 'en';
        let userProfile = {};
        let isAutoPredictionRunning = false;
        let telegramInterval = null;
        let lastSentPeriod = null;
        const adminPassword = 'igris420'; // Change this to your desired password
        let isAdminLoggedIn = false;
        let hasPredictionPermission = false;

        
        const translations = {
            en: {
                'AI Prediction': 'AI Prediction',
                'Period:': 'Period:',
                'Analysis Dashboard': 'Analysis Dashboard',
                'Wins': 'Wins', 'Losses': 'Losses', 'Win Rate': 'Win Rate', 'AI Logic': 'AI Logic', 'Streak': 'Streak', 'Last 5': 'Last 5',
                'Prediction History': 'Prediction History', 'Download': 'Download', 'Clear': 'Clear',
                'Your Profile': 'Your Profile', 'User Information': 'User Information', 'Your Name': 'Your Name', 'Enter your name': 'Enter your name',
                'Your Bio': 'Your Bio', 'Write something about yourself...': 'Write something about yourself...', 'Save Profile': 'Save Profile',
                'Lifetime Statistics': 'Lifetime Statistics', 'Total Wins': 'Total Wins', 'Total Losses': 'Total Losses',
                'Current Streak': 'Current Streak', 'Settings & Support': 'Settings & Support',
                'Change Language': 'Change Language', 'About Us': 'About Us', 'World Leaderboard': 'World Leaderboard',
                'Search by name or ID...': 'Search by name or ID...', 'Loading top users...': 'Loading top users...',
                'Magic Control Panel': 'Magic Control Panel', 'Where dreams meet reality and predictions get spicy!': 'Where dreams meet reality and predictions get spicy!',
                'Prediction Speed Booster': 'Prediction Speed Booster', 'How fast should we fetch the crystal ball?': 'How fast should we fetch the crystal ball?',
                'Slow': 'Slow', 'Lightning': 'Lightning', 'Current: ': 'Current: ', 'Cosmic Theme Selector': 'Cosmic Theme Selector',
                'Change the vibe, change your luck!': 'Change the vibe, change your luck!', '🌌 Cosmic Blue': '🌌 Cosmic Blue',
                '💚 Lucky Green': '💚 Lucky Green', '🔮 Mystic Purple': '🔮 Mystic Purple', '✨ Golden Hour': '✨ Golden Hour',
                'Confirm Clear': 'Confirm Clear', 'Are you sure you want to clear all history?': 'Are you sure you want to clear all history?',
                'Yes, Clear': 'Yes, Clear', 'No, Cancel': 'No, Cancel', 'Platform Maintenance': 'Platform Maintenance',
                'We are currently performing scheduled maintenance.': 'We are currently performing scheduled maintenance.',
                'Close': 'Close', 'Swipe up for more options': 'Swipe up for more options',
                'Welcome, new user!': 'Welcome, new user!', 'Please enter your name to get started. You won\'t be able to change this later.': 'Please enter your name to get started. You won\'t be able to change this later.',
                'Save Name': 'Save Name',
                'About Our Platform': 'About Our Platform',
                'Welcome to our advanced prediction platform, a fusion of cutting-edge AI and a community of skilled analysts. We strive to provide accurate predictions based on complex algorithms and real-time data analysis. Our mission is to empower our users with the information they need to make informed decisions.': 'Welcome to our advanced prediction platform, a fusion of cutting-edge AI and a community of skilled analysts. We strive to provide accurate predictions based on complex algorithms and real-time data analysis. Our mission is to empower our users with the information they need to make informed decisions.',
                'This platform is the result of a collaborative effort between dedicated developers and community experts like <span class=\'about-highlight\'>DAMMNNN</span> and <span class=\'about-highlight\'>KAILASH</span>. We are continuously improving our models and features to ensure a seamless and rewarding experience for everyone.': 'This platform is the result of a collaborative effort between dedicated developers and community experts like <span class=\'about-highlight\'>DAMMNNN</span> and <span class=\'about-highlight\'>KAILASH</span>. We are continuously improving our models and features to ensure a seamless and rewarding experience for everyone.',
                'Home': 'Home', 'History': 'History', 'Admin': 'Admin', 'Profile': 'Profile', 'World': 'World', 'About': 'About', 'Settings': 'Magic Panel',
                'Admin Panel': 'Admin Panel',
                'Configure and control automatic Telegram predictions.': 'Configure and control automatic Telegram predictions.',
                'Telegram Bot Token': 'Telegram Bot Token',
                'Channel Chat ID': 'Channel Chat ID',
                'Start Auto Prediction': 'Start Auto Prediction',
                'Stop Auto Prediction': 'Stop Auto Prediction',
                'Auto prediction started successfully!': 'Auto prediction started successfully!',
                'Auto prediction stopped.': 'Auto prediction stopped.',
                'Please enter both Bot Token and Channel ID.': 'Please enter both Bot Token and Channel ID.',
                'Sending prediction to Telegram...': 'Sending prediction to Telegram...',
                'Failed to send message to Telegram.': 'Failed to send message to Telegram.',
                'Message sent to Telegram!': 'Message sent to Telegram!',
                'No Prediction Available': 'No Prediction Available',
                'You do not have permission to view predictions.': 'You do not have permission to view predictions.',
                'Admin Password': 'Admin Password',
                'Login': 'Login',
                'Device Access Control': 'Device Access Control',
                'Device ID': 'Device ID',
                'Validity (days)': 'Validity (days)',
                'User Role': 'User Role',
                'User': 'User',
                'Admin': 'Admin',
                'Grant Access': 'Grant Access',
                'Telegram Automation (Admin Only)': 'Telegram Automation (Admin Only)',
                'Access granted successfully!': 'Access granted successfully!',
                'Invalid password!': 'Invalid password!',
                'Access Denied': 'Access Denied',
                'Your access has expired or is not yet granted. Please contact support.': 'Your access has expired or is not yet granted. Please contact support.',
                'Fetching...': 'Fetching...',
                'On a winning streak of': 'On a winning streak of',
                'Keep it up!': 'Keep it up!',
                'Loss': 'Loss',
                'AI is adapting...': 'AI is adapting...',
                'Losses!': 'Losses!',
                'Caution is advised.': 'Caution is advised.',
                'Consider a strategic break.': 'Consider a strategic break.',
                'Current win streak:': 'Current win streak:',
                'AI is calculating the next move...': 'AI is calculating the next move...',
                'Period': 'Period',
                'AI Said': 'AI Said',
                'Result': 'Result',
            },
            hi: {
                'AI Prediction': 'एआई भविष्यवाणी',
                'Period:': 'अवधि:',
                'Analysis Dashboard': 'विश्लेषण डैशबोर्ड',
                'Wins': 'जीत', 'Losses': 'हार', 'Win Rate': 'जीत दर', 'AI Logic': 'एआई लॉजिक', 'Streak': 'लगातार जीत', 'Last 5': 'अंतिम 5',
                'Prediction History': 'भविष्यवाणी इतिहास', 'Download': 'डाउनलोड करें', 'Clear': 'साफ़ करें',
                'Your Profile': 'आपकी प्रोफ़ाइल', 'User Information': 'उपयोगकर्ता जानकारी', 'Your Name': 'आपका नाम', 'Enter your name': 'अपना नाम दर्ज करें',
                'Your Bio': 'आपकी बायो', 'Write something about yourself...': 'अपने बारे में कुछ लिखें...', 'Save Profile': 'प्रोफ़ाइल सहेजें',
                'Lifetime Statistics': 'जीवन भर के आँकड़े', 'Total Wins': 'कुल जीत', 'Total Losses': 'कुल हार',
                'Current Streak': 'वर्तमान स्ट्रीक', 'Settings & Support': 'सेटिंग्स और समर्थन',
                'Change Language': 'भाषा बदलें', 'About Us': 'हमारे बारे में', 'World Leaderboard': 'विश्व लीडरबोर्ड',
                'Search by name or ID...': 'नाम या आईडी द्वारा खोजें...', 'Loading top users...': 'शीर्ष उपयोगकर्ता लोड हो रहे हैं...',
                'Magic Control Panel': 'जादुई नियंत्रण पैनल', 'Where dreams meet reality and predictions get spicy!': 'जहां सपने हकीकत से मिलते हैं और भविष्यवाणियां मसालेदार हो जाती हैं!',
                'Prediction Speed Booster': 'भविष्यवाणी गति बूस्टर', 'How fast should we fetch the crystal ball?': 'हमें क्रिस्टल बॉल कितनी तेजी से लानी चाहिए?',
                'Slow': 'धीमा', 'Lightning': 'तेज', 'Current: ': 'वर्तमान: ', 'Cosmic Theme Selector': 'कॉस्मिक थीम चयनकर्ता',
                'Change the vibe, change your luck!': 'वाइब बदलें, अपनी किस्मत बदलें!', '🌌 Cosmic Blue': '🌌 कॉस्मिक नीला',
                '💚 Lucky Green': '💚 भाग्यशाली हरा', '🔮 Mystic Purple': '🔮 रहस्यमय बैंगनी', '✨ Golden Hour': '✨ सुनहरा घंटा',
                'Confirm Clear': 'पुष्टि करें साफ़ करें', 'Are you sure you want to clear all history?': 'क्या आप वाकई पूरा इतिहास साफ़ करना चाहते हैं?',
                'Yes, Clear': 'हाँ, साफ़ करें', 'No, Cancel': 'नहीं, रद्द करें', 'Platform Maintenance': 'प्लेटफ़ॉर्म रखरखाव',
                'We are currently performing scheduled maintenance.': 'हम वर्तमान में निर्धारित रखरखाव कर रहे हैं।',
                'Close': 'बंद करें', 'Swipe up for more options': 'अधिक विकल्पों के लिए ऊपर स्वाइप करें',
                'Welcome, new user!': 'स्वागत है, नए उपयोगकर्ता!', 'Please enter your name to get started. You won\'t be able to change this later.': 'शुरू करने के लिए कृपया अपना नाम दर्ज करें। आप इसे बाद में नहीं बदल पाएंगे।',
                'Save Name': 'नाम सहेजें',
                'About Our Platform': 'हमारे प्लेटफॉर्म के बारे में',
                'Welcome to our advanced prediction platform, a fusion of cutting-edge AI and a community of skilled analysts. We strive to provide accurate predictions based on complex algorithms and real-time data analysis. Our mission is to empower our users with the information they need to make informed decisions.': 'हमारे उन्नत भविष्यवाणी प्लेटफॉर्म में आपका स्वागत है, जो अत्याधुनिक AI और कुशल विश्लेषकों के समुदाय का एक संगम है। हम जटिल एल्गोरिदम और रीयल-टाइम डेटा विश्लेषण के आधार पर सटीक भविष्यवाणियां प्रदान करने का प्रयास करते हैं। हमारा मिशन हमारे उपयोगकर्ताओं को सूचित निर्णय लेने के लिए आवश्यक जानकारी के साथ सशक्त बनाना है।',
                'This platform is the result of a collaborative effort between dedicated developers and community experts like <span class=\'about-highlight\'>DAMMNNN</span> and <span class=\'about-highlight\'>KAILASH</span>. We are continuously improving our models and features to ensure a seamless and rewarding experience for everyone.': 'यह प्लेटफ़ॉर्म DAMMNNN और KAILASH जैसे समर्पित डेवलपर्स औरAI विशेषज्ञों के बीच एक सहयोगी प्रयास का परिणाम है। हम सभी के लिए एक सहज और पुरस्कृत अनुभव सुनिश्चित करने के लिए अपने मॉडल और सुविधाओं में लगातार सुधार कर रहे हैं।',
                'Home': 'होम', 'History': 'इतिहास', 'Admin': 'व्यवस्थापक', 'Profile': 'प्रोफ़ाइल', 'World': 'विश्व', 'About': 'बारे में', 'Settings': 'सेटिंग्स',
                'Admin Panel': 'व्यवस्थापक पैनल',
                'Configure and control automatic Telegram predictions.': 'स्वचालित टेलीग्राम भविष्यवाणियों को कॉन्फ़िगर और नियंत्रित करें।',
                'Telegram Bot Token': 'टेलीग्राम बॉट टोकन',
                'Channel Chat ID': 'चैनल चैट आईडी',
                'Start Auto Prediction': 'स्वचालित भविष्यवाणी शुरू करें',
                'Stop Auto Prediction': 'स्वचालित भविष्यवाणी रोकें',
                'Auto prediction started successfully!': 'स्वचालित भविष्यवाणी सफलतापूर्वक शुरू हुई!',
                'Auto prediction stopped.': 'स्वचालित भविष्यवाणी रोक दी गई।',
                'Please enter both Bot Token and Channel ID.': 'कृपया बॉट टोकन और चैनल आईडी दोनों दर्ज करें।',
                'Sending prediction to Telegram...': 'टेलीग्राम पर भविष्यवाणी भेजी जा रही है...',
                'Failed to send message to Telegram.': 'टेलीग्राम पर संदेश भेजने में विफल।',
                'Message sent to Telegram!': 'संदेश टेलीग्राम पर भेजा गया!',
                'No Prediction Available': 'कोई भविष्यवाणी उपलब्ध नहीं है',
                'You do not have permission to view predictions.': 'आपके पास भविष्यवाणियां देखने की अनुमति नहीं है।',
                'Admin Password': 'व्यवस्थापक पासवर्ड',
                'Login': 'लॉगिन करें',
                'Device Access Control': 'डिवाइस एक्सेस नियंत्रण',
                'Device ID': 'डिवाइस आईडी',
                'Validity (days)': 'वैधता (दिनों में)',
                'User Role': 'उपयोगकर्ता भूमिका',
                'User': 'उपयोगकर्ता',
                'Admin': 'व्यवस्थापक',
                'Grant Access': 'एक्सेस दें',
                'Telegram Automation (Admin Only)': 'टेलीग्राम ऑटोमेशन (केवल एडमिन)',
                'Access granted successfully!': 'एक्सेस सफलतापूर्वक दिया गया!',
                'Invalid password!': 'अमान्य पासवर्ड!',
                'Access Denied': 'पहुंच अस्वीकृत',
                'Your access has expired or is not yet granted. Please contact support.': 'आपकी पहुंच समाप्त हो गई है या अभी तक नहीं दी गई है। कृपया सहायता से संपर्क करें।',
                'Fetching...': 'ला रहा है...',
                'On a winning streak of': 'की जीत की लकीर पर',
                'Keep it up!': 'इसे जारी रखें!',
                'Loss': 'हार',
                'AI is adapting...': 'एआई अनुकूलन कर रहा है...',
                'Losses!': 'हार!',
                'Caution is advised.': 'सावधानी बरतने की सलाह दी जाती है।',
                'Consider a strategic break.': 'रणनीतिक ब्रेक पर विचार करें।',
                'Current win streak:': 'वर्तमान जीत की लकीर:',
                'AI is calculating the next move...': 'एआई अगली चाल की गणना कर रहा है...',
                'Period': 'अवधि',
                'AI Said': 'AI ने कहा',
                'Result': 'परिणाम',
            }
        };

        function setLanguage(lang) {
            currentLanguage = lang;
            document.querySelectorAll('[data-en]').forEach(el => {
                const translationKey = el.getAttribute('data-en');
                if (translations[lang] && translations[lang][translationKey]) {
                    el.innerHTML = translations[lang][translationKey];
                }
            });
            document.querySelectorAll('[data-en-placeholder]').forEach(el => {
                const translationKey = el.getAttribute('data-en-placeholder');
                if (translations[lang] && translations[lang][translationKey]) {
                    el.placeholder = translations[lang][translationKey];
                }
            });

            document.getElementById('langEnglish').classList.toggle('btn-main', lang === 'en');
            document.getElementById('langEnglish').classList.toggle('btn-outline', lang !== 'en');
            document.getElementById('langHindi').classList.toggle('btn-main', lang === 'hi');
            document.getElementById('langHindi').classList.toggle('btn-outline', lang !== 'hi');

            localStorage.setAttribute('language', lang);
        }
        
        function showPopup(id, msg = null, msgId = null) { if (msgId && msg) { const el = document.getElementById(msgId); if (el) el.textContent = msg; } const p = document.getElementById(id); if (p) p.classList.add('show'); }
        function hidePopup(id) { const p = document.getElementById(id); if (p) p.classList.remove('show'); }
        function showToast(msg, type = "success") {
            const t = document.getElementById('toast'), tm = document.getElementById('toastMessage');
            if (!t || !tm) return;
            tm.textContent = msg;
            t.className = 'toast';
            const nH = document.getElementById('predictionNavigation')?.classList.contains('hidden') ? 0 : 75;
            t.style.bottom = `${15 + nH}px`;
            if (type === "error") t.classList.add('error');
            else if (type === "info") t.classList.add('info');
            else if (type === "success") t.classList.add('success');
            t.style.display = 'block';
            t.style.animation = 'none';
            t.offsetHeight;
            t.style.animation = null;
            t.style.animation = 'toast-slide-in-out 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        }

        function showMainPageSection(pageSectionId) {
            document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
            const targetPageSection = document.getElementById(pageSectionId);
            if (targetPageSection) {
                targetPageSection.classList.add('active');
                currentVisibleSection = pageSectionId;
            }
            if (pageSectionId === 'worldSection') loadTopUsers();
        }
        function triggerWinAnimation() {
            const container = document.getElementById('win-animation');
            if (!container) return;
            container.innerHTML = '';
            container.classList.add('active');
            const starCount = 30;
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                const size = Math.random() * 10 + 5;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                const angle = Math.random() * 360;
                const distance = Math.random() * 200 + 100;
                star.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
                star.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
                container.appendChild(star);
            }
            const victoryText = document.createElement('div');
            victoryText.classList.add('result-text');
            victoryText.textContent = 'VICTORY!';
            container.appendChild(victoryText);
            setTimeout(() => { container.classList.remove('active'); container.innerHTML = ''; }, 2000);
        }

        function triggerLossAnimation() {
            const container = document.getElementById('loss-animation');
            const page = document.querySelector('body');
            if (!container || !page) return;
            container.innerHTML = '';
            container.classList.add('active'); 
            const lossText = document.createElement('div');
            lossText.classList.add('result-text');
            lossText.textContent = 'DEFEAT!';
            container.appendChild(lossText);
            setTimeout(() => { 
                container.classList.remove('active'); 
                container.innerHTML = ''; 
            }, 1500); 
        }

        async function saveGameResultToFirebase(period, status, actualNum, prediction) {
            const gameHistoryPath = "igrisAppGlobal/gameHistoryData";
            if (!database) { console.error("Database not ready for saving game result."); return; }
            const dataToSave = { timestamp: firebase.database.ServerValue.TIMESTAMP, periodNumber: String(period), resultStatus: status, actualNumber: actualNum, prediction: prediction, deviceId: getDeviceId() };
            try {
                const periodKey = String(period).replace(/[.#$[\]]/g, '_');
                await database.ref(gameHistoryPath + "/" + periodKey).set(dataToSave);
            } catch (error) { console.error(`Failed to save game result to ${gameHistoryPath}:`, error); }
        }

        // START: Prediction Logic - Name: F*CK SHIT 💗
        function getNewPrediction(currentPredictingPeriodString) {
            h_activeLogicName = "💗 F*CK SHIT"; 

            // Initial three predictions
            if (predictionCount < 3) {
                const predictions = ["BIG", "BIG", "SMALL"];
                const prediction = predictions[predictionCount];
                predictionCount++;
                return { prediction: prediction, colorClass: prediction.toLowerCase() };
            }

            const historyForLogic = h_historyData.filter(item => item.resultStatus === "WIN" || item.resultStatus === "LOSS");
            if (historyForLogic.length < 3) {
                return { prediction: "SMALL", colorClass: "small" };
            }

            const prevPeriodNumber = String(historyForLogic[0].period);
            if (prevPeriodNumber.length < 3) {
                 return { prediction: "SMALL", colorClass: "small" };
            }

            const p1 = parseInt(prevPeriodNumber.slice(-3, -2));
            const p2 = parseInt(prevPeriodNumber.slice(-2, -1));
            const p3 = parseInt(prevPeriodNumber.slice(-1));

            const r1 = historyForLogic[0].result;
            const r2 = historyForLogic[1].result;
            const r3 = historyForLogic[2].result;

            if (isNaN(p1) || isNaN(p2) || isNaN(p3) || isNaN(r1) || isNaN(r2) || isNaN(r3)) {
                return { prediction: "SMALL", colorClass: "small" };
            }

            const calc1 = Math.abs(p1 - r1);
            const calc2 = Math.abs(p2 - r2);
            const calc3 = Math.abs(p3 - r3);

            const sum = calc1 + calc2 + calc3;
            const lastDigit = sum % 10;
            
            const predictionOutcome = (lastDigit >= 0 && lastDigit <= 4) ? "SMALL" : "BIG";
            const predictionColorClass = predictionOutcome.toLowerCase();
            
            return { prediction: predictionOutcome, colorClass: predictionColorClass };
        }
        // END: Prediction Logic

        function setupHNavigation() {
            const navItems = document.querySelectorAll('#predictionNavigation ul li');
            const contentSections = document.querySelectorAll('.content-section');
            navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    navItems.forEach(li => li.classList.remove('active'));
                    item.classList.add('active');
                    const targetSectionId = item.querySelector('a').getAttribute('data-section');
                    contentSections.forEach(section => section.classList.remove('active'));
                    const targetSection = document.getElementById(targetSectionId);
                    if (targetSection) {
                         targetSection.classList.add('active');
                         currentVisibleSection = targetSectionId;
                    }
                    if (targetSectionId === 'worldSection') loadTopUsers();
                });
            });
        }

        async function h_updateLastStatusWithResult(actualNum, fullPrediction, period, telegramMessageId) {
            const predictedCategory = fullPrediction.toUpperCase();
            const actualCategory = actualNum >= 5 ? 'BIG' : 'SMALL';
            const isWin = predictedCategory === actualCategory;

            let cS = 'LOSS';
            if (predictedCategory === 'SKIP') { 
                h_streak = 0; 
                h_consecutiveLosses = 0; 
                cS = 'SKIP';
            } else if (isWin) {
                h_streak++;
                h_consecutiveLosses = 0;
                cS = 'WIN';
                triggerWinAnimation();
                if(telegramMessageId) {
                    await sendTelegramSticker(document.getElementById('telegramBotToken').value, document.getElementById('telegramChatId').value, "CAACAgIAAxkBAAEPH6JomYd5V7eldYC9yixOkT5OdtJjJAACUzIAAnx3KUrnb3BvKawEuTYE");
                }
            } else {
                h_streak = 0;
                h_consecutiveLosses++;
                cS = 'LOSS';
                triggerLossAnimation();
            }
            saveGameResultToFirebase(period, cS, actualNum, fullPrediction);
            return cS;
        }

        async function h_fetchGameResult() {
            const l = document.getElementById('apiLoader'), t = document.getElementById('serverStatusText');
            if (l) l.style.display = 'inline-block';
            if (t) t.textContent = translations[currentLanguage]['Fetching...'] || 'Fetching...';
            try {
                const timestamp = Date.now();
                const response = await fetch(`https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?ts=${timestamp}`);
                if (!response.ok) throw new Error(`API Error: ${response.status}`);
                const data = await response.json();
                if (t) t.textContent = 'Online';
                return data?.data?.list?.[0] || null;
            } catch (e) {
                if(t) t.textContent = 'API Error';
                console.error("API Fetch error:", e);
                return null;
            } finally {
                if(l) l.style.display = 'none';
            }
        }

        const GLOBAL_HISTORY_DB_PATH = "igrisAppGlobal/predictionHistory";

        async function h_syncHistory() {
            try {
                const s = await database.ref(GLOBAL_HISTORY_DB_PATH).orderByChild("timestamp").limitToLast(H_MAX_HISTORY).get();
                const d = s.val() || {};
                h_historyData = Object.values(d).sort((a, b) => b.timestamp - a.timestamp).map(i => ({ ...i, period: String(i.period), displayPeriod: String(i.period).slice(-4) }));
                h_updateHistoryUI();
                h_updateStats();
            } catch (e) {
                console.error("SYNC FAILED:", e);
            }
        }

        async function h_saveHistoryEntry(entry) { 
            try { 
                await database.ref(GLOBAL_HISTORY_DB_PATH + "/" + String(entry.period).replace(/[.#$[\]]/g, '_')).set({ ...entry, timestamp: firebase.database.ServerValue.TIMESTAMP }); 
            } catch (e) { 
                console.error("Save error:", e); 
            } 
        }
        
        async function sendTelegramSticker(token, chatId, stickerId) {
            const url = `https://api.telegram.org/bot${token}/sendSticker`;
            const params = {
                chat_id: chatId,
                sticker: stickerId
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Telegram API Error: ${errorData.description}`);
                }
            } catch (error) {
                console.error('Error sending Telegram sticker:', error);
                showToast(`Failed to send sticker: ${error.message}`, 'error');
            }
        }

        async function sendTelegramPrediction(token, chatId, predictionEntry) {
            const period = predictionEntry.period.slice(-4);
            const prediction = predictionEntry.prediction;
            const message = `⏱️ Period - ${period}\n💸 Prediction - ${prediction}\n💀 Actual Result - `;
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            const params = {
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params)
                });
                const data = await response.json();
                if (data.ok) {
                    showToast(translations[currentLanguage]['Message sent to Telegram!'], 'success');
                    return data.result.message_id;
                } else {
                    showToast(`${translations[currentLanguage]['Failed to send message to Telegram.']} Reason: ${data.description}`, 'error');
                }
            } catch (error) {
                console.error('Error sending Telegram message:', error);
                showToast(translations[currentLanguage]['Failed to send message to Telegram.'], 'error');
            }
            return null;
        }

        async function editTelegramMessage(token, chatId, messageId, predictionEntry) {
            const period = predictionEntry.period.slice(-4);
            const prediction = predictionEntry.prediction;
            const actualResult = predictionEntry.result;
            const status = predictionEntry.resultStatus;
            
            let statusText = '';
            if (status === 'WIN') statusText = '🟢 WIN';
            else if (status === 'LOSS') statusText = '🔴 LOSS';
            else statusText = '⚪ N/A';

            const message = `⏱️ Period - ${period}\n💸 Prediction - ${prediction}\n💀 Actual Result - ${actualResult} (${statusText})`;
            const url = `https://api.telegram.org/bot${token}/editMessageText`;
            const params = {
                chat_id: chatId,
                message_id: messageId,
                text: message,
                parse_mode: 'Markdown'
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Telegram API Error: ${errorData.description}`);
                }
            } catch (error) {
                console.error('Error editing Telegram message:', error);
                showToast(`Failed to edit message: ${error.message}`, 'error');
            }
        }


        async function h_updatePrediction() { 
             if (!hasPredictionPermission) {
                document.getElementById("currentPeriod").textContent = "----"; 
                document.getElementById("currentPrediction").textContent = translations[currentLanguage]['No Prediction Available']; 
                document.getElementById("currentPrediction").className = "font-semibold locked"; 
                document.getElementById("gameStatusMessage").textContent = translations[currentLanguage]['You do not have permission to view predictions.'];
                document.getElementById('currentAiLogic').textContent = '-'; 
                return;
            }

            if (currentVisibleSection !== 'predictionSection' && !document.getElementById('predictionSection').classList.contains('active') ) {
                return; 
            }
            
            let gR = await h_fetchGameResult(); 
            if (!gR || !gR.issueNumber) { 
                if (!gR && document.getElementById('serverStatusText')) document.getElementById('serverStatusText').textContent = 'API Error'; 
                return; 
            } 

            const currentPeriodFromAPI = String(gR.issueNumber); 
            
            const existingPendingEntryIndex = h_historyData.findIndex(e => e.period === currentPeriodFromAPI && e.resultStatus === "Pending"); 
            
            if (existingPendingEntryIndex !== -1) { 
                const actualNumber = Number(gR.number); 
                if (!isNaN(actualNumber)) { 
                    const status = await h_updateLastStatusWithResult(actualNumber, h_historyData[existingPendingEntryIndex].prediction, currentPeriodFromAPI, h_historyData[existingPendingEntryIndex].telegramMessageId);
                    h_historyData[existingPendingEntryIndex].resultStatus = status; 
                    h_historyData[existingPendingEntryIndex].result = actualNumber; 
                    h_historyData[existingPendingEntryIndex].resultType = actualNumber >= 5 ? "BIG" : "SMALL"; 
                    await h_saveHistoryEntry(h_historyData[existingPendingEntryIndex]); 
                    updateUserProfileStats(status);

                    // Edit Telegram message with final result
                    if(h_historyData[existingPendingEntryIndex].telegramMessageId) {
                        editTelegramMessage(document.getElementById('telegramBotToken').value, document.getElementById('telegramChatId').value, h_historyData[existingPendingEntryIndex].telegramMessageId, h_historyData[existingPendingEntryIndex]);
                    }
                } 
            } 
            
            const nextPeriodFullString = (BigInt(currentPeriodFromAPI) + 1n).toString(); 
            const nextDisplayPeriod = nextPeriodFullString.slice(-4); 
            
            const nextPeriodAlreadyPending = h_historyData.some(h => h.period === nextPeriodFullString && h.resultStatus === "Pending");
            
            if (!nextPeriodAlreadyPending) {
                const finalNextPrediction = getNewPrediction(nextPeriodFullString); 
                
                document.getElementById("currentPeriod").textContent = nextDisplayPeriod; 
                document.getElementById("currentPrediction").textContent = finalNextPrediction.prediction; 
                document.getElementById("currentPrediction").className = `font-semibold ${finalNextPrediction.colorClass}`; 
                document.getElementById('currentAiLogic').textContent = h_activeLogicName; 
                
                const newPredictionEntry = { 
                    period: nextPeriodFullString, 
                    displayPeriod: nextDisplayPeriod, 
                    prediction: finalNextPrediction.prediction, 
                    result: "-", 
                    resultStatus: "Pending", 
                    resultType: "-", 
                    timestamp: Date.now() 
                }; 
                
                h_historyData.unshift(newPredictionEntry); 
                if (h_historyData.length > H_MAX_HISTORY) h_historyData.pop(); 
                
                if (isAutoPredictionRunning && lastSentPeriod !== nextPeriodFullString) {
                    const token = document.getElementById('telegramBotToken').value;
                    const chatId = document.getElementById('telegramChatId').value;
                    if (token && chatId) {
                        const messageId = await sendTelegramPrediction(token, chatId, newPredictionEntry);
                        newPredictionEntry.telegramMessageId = messageId;
                        lastSentPeriod = nextPeriodFullString;
                    }
                }
                
                await h_saveHistoryEntry(newPredictionEntry);
            }

            h_updateHistoryUI(); 
            h_updateStats();
        }


        function h_updateHistoryUI() {
             const c = document.getElementById("historyContainer");
             if (!c) return;

             c.innerHTML = h_historyData.slice(0, H_MAX_DISPLAY).map((item) => {
                 let statusClass = item.resultStatus.toLowerCase();
                 let iconClass = 'fa-clock';
                 let resultColorClass = 'text-[var(--warning-color)]';
                 let predictionColorClass = 'text-[var(--primary-color)]';

                 if (item.prediction === 'BIG' || item.prediction === 'SMALL') {
                     predictionColorClass = item.prediction === 'BIG' ? 'text-purple-400' : 'text-blue-400';
                 } else {
                     predictionColorClass = 'text-[var(--tertiary-color)]';
                 }
                 
                 if (statusClass === 'win') {
                     iconClass = 'fa-check-circle';
                     resultColorClass = 'text-[var(--success-color)]';
                 } else if (statusClass === 'loss') {
                     iconClass = 'fa-times-circle';
                     resultColorClass = 'text-[var(--danger-color)]';
                 } else if (statusClass === 'skip') { 
                     iconClass = 'fa-minus-circle';
                     resultColorClass = 'text-[var(--tertiary-color)]';
                 }

                 return `<div class="history-item ${statusClass}" data-period="${item.period}">
                            <div class="history-item-content">
                                <div class="history-item-text"><p class="label" data-en="Period" data-hi="अवधि">Period</p><p class="value">${item.displayPeriod || '-'}</p></div>
                                <div class="history-item-text"><p class="label" data-en="AI Said" data-hi="AI ने कहा">AI Said</p><p class="value ${predictionColorClass}">${item.prediction || '-'}</p></div>
                            </div>
                            <div class="history-item-details">
                                <div class="history-item-text text-right">
                                    <p class="label" data-en="Result" data-hi="परिणाम">Result</p>
                                    <p class="value ${resultColorClass}">${item.resultStatus === 'Pending' ? '-' : `${item.result} (${item.resultType || 'N/A'})`}</p>
                                </div>
                                <div class="result-status-icon ${statusClass}"><i class="fas ${iconClass}"></i></div>
                            </div>
                        </div>`;
             }).join("");
            setLanguage(currentLanguage);
        }

        function h_updateStats() { 
            const w = h_historyData.filter(i => i.resultStatus === "WIN").length; 
            const l = h_historyData.filter(i => i.resultStatus === "LOSS").length; 
            const t = w + l; 
            const wr = t > 0 ? (w / t * 100) : 0; 
            const el = (id) => document.getElementById(id); 
            
            if(!el("wins")) return; 
            
            el("wins").textContent = w; 
            el("losses").textContent = l; 
            el("accuracy").textContent = `${wr.toFixed(1)}%`; 
            el("currentAiLogic").textContent = hasPredictionPermission ? h_activeLogicName : '-'; 
            el("currentStreak").textContent = h_streak; 

            const lastFiveCompleted = h_historyData.filter(h => h.resultStatus !== 'Pending').slice(0, 5);
            const lastFiveResultsEl = document.getElementById("lastFiveResults");
            if (lastFiveResultsEl) {
                if (lastFiveCompleted.length > 0) {
                    lastFiveResultsEl.innerHTML = lastFiveCompleted.map(item => {
                        let resultChar = '-';
                        let colorClass = 'text-[var(--tertiary-color)]';
                        if (item.resultStatus === 'WIN') {
                            resultChar = 'W';
                            colorClass = 'text-[var(--success-color)]';
                        } else if (item.resultStatus === 'LOSS') {
                            resultChar = 'L';
                            colorClass = 'text-[var(--danger-color)]';
                        } else if (item.resultStatus === 'SKIP') { 
                            resultChar = 'S';
                            colorClass = 'text-[var(--tertiary-color)]';
                        }
                        return `<span class="${colorClass}">${resultChar}</span>`;
                    }).join(' ');
                } else {
                    lastFiveResultsEl.textContent = "-";
                }
            }

            const gameStatusEl = document.getElementById('gameStatusMessage'); 
            if (gameStatusEl) { 
                if (!hasPredictionPermission) {
                    gameStatusEl.textContent = translations[currentLanguage]['You do not have permission to view predictions.'];
                } else if (h_streak > 2) gameStatusEl.innerHTML = `🔥 <span class="font-semibold">${translations[currentLanguage]['On a winning streak of']} ${h_streak}!</span> ${translations[currentLanguage]['Keep it up!']}`; 
                else if (h_consecutiveLosses === 1) gameStatusEl.innerHTML = `⚠️ <span class="font-semibold">1 ${translations[currentLanguage]['Loss']}.</span> ${translations[currentLanguage]['AI is adapting...']}`; 
                else if (h_consecutiveLosses === 2) gameStatusEl.innerHTML = `🚨 <span class="font-semibold">2 ${translations[currentLanguage]['Losses!']}</span> ${translations[currentLanguage]['Caution is advised.']}`; 
                else if (h_consecutiveLosses > 2) gameStatusEl.innerHTML = `🛑 <span class="font-semibold">${h_consecutiveLosses} ${translations[currentLanguage]['Losses!']}</span> ${translations[currentLanguage]['Consider a strategic break.']}`; 
                else if (h_streak > 0) gameStatusEl.innerHTML = `👍 ${translations[currentLanguage]['Current win streak:']} <span class="font-semibold">${h_streak}</span>.`; 
                else gameStatusEl.innerHTML = "🔮 AI is calculating the next move..."; 
            } 
        }

        async function h_clearHistory() { 
            h_historyData = []; h_streak = 0; h_consecutiveLosses=0; 
            try { 
                if(database) await database.ref(GLOBAL_HISTORY_DB_PATH).remove(); 
                showToast("History Cleared", "info"); 
            } catch (e) { 
                showToast("Error: Failed to clear history.", "error"); 
            } 
            h_updateHistoryUI(); 
            h_updateStats(); 
        }

        function downloadHistory() { 
            if (h_historyData.length === 0) { showToast("No history to download.", "info"); return; } 
            const headers = "Period,Prediction,Result,Result Type,Status,Timestamp\n"; 
            const csvContent = "data:text/csv;charset=utf-8," + headers + h_historyData.map(e => { 
                const timestamp = new Date(e.timestamp).toLocaleString(); 
                return `${e.period},"${e.prediction}",${e.result},${e.resultType},${e.resultStatus},"${timestamp}"`; 
            }).join("\n"); 
            const encodedUri = encodeURI(csvContent); 
            const link = document.createElement("a"); 
            link.setAttribute("href", encodedUri); 
            link.setAttribute("download", "prediction_history.csv"); 
            document.body.appendChild(link); 
            link.click(); 
            document.body.removeChild(link); 
            showToast("History download started.", "success"); 
        }

        function setupSwipeNavigation() { 
            const navigation = document.getElementById('predictionNavigation'); 
            const swipeIndicator = document.getElementById('swipe-indicator'); 
            let startY; 
            document.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; }, false); 
            document.addEventListener('touchmove', (e) => { 
                if (!startY) return; 
                let moveY = e.touches[0].clientY; 
                let diffY = startY - moveY; 
                if (diffY > 50) { navigation.classList.remove('hidden'); swipeIndicator.style.opacity = '0'; startY = null; } 
                else if (diffY < -50) { navigation.classList.add('hidden'); swipeIndicator.style.opacity = '0.6'; startY = null; } 
            }, false); 
        }

        function setupSettingsSystem() {
            const predictionSpeed = document.getElementById('predictionSpeed');
            const speedDisplay = document.getElementById('speedDisplay');
            if (predictionSpeed && speedDisplay) {
                predictionSpeed.addEventListener('input', (e) => {
                    const speed = parseInt(e.target.value);
                    const speedNames = ['Turtle', 'Slow', 'Casual', 'Normal', 'Fast', 'Quick', 'Rapid', 'Turbo', 'Lightning', 'Godspeed'];
                    speedDisplay.textContent = speedNames[speed - 1] || 'Normal';
                    localStorage.setItem('predictionSpeed', speed);
                    updatePredictionInterval(speed);
                });
                
                const savedSpeed = localStorage.getItem('predictionSpeed') || '5';
                predictionSpeed.value = savedSpeed;
                const speedNames = ['Turtle', 'Slow', 'Casual', 'Normal', 'Fast', 'Quick', 'Rapid', 'Turbo', 'Lightning', 'Godspeed'];
                speedDisplay.textContent = speedNames[parseInt(savedSpeed) - 1] || 'Normal';
            }

            const themeButtons = document.querySelectorAll('.theme-btn');
            themeButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const theme = e.target.dataset.theme;
                    applyTheme(theme);
                    localStorage.setItem('selectedTheme', theme);
                    showToast(`Theme changed to ${e.target.textContent}`, "success");
                });
            });
            const savedTheme = localStorage.getItem('selectedTheme') || 'default';
            applyTheme(savedTheme);
        }

        function updateAILogicBasedOnMood(mood) {
            h_activeLogicName = "💗 F*CK SHIT"; 
            const currentAiLogicElement = document.getElementById('currentAiLogic');
            if (currentAiLogicElement) {
                currentAiLogicElement.textContent = h_activeLogicName;
            }
        }

        function updatePredictionInterval(speed) {
            if (h_predictionUpdateInterval) {
                clearInterval(h_predictionUpdateInterval);
            }
            if (hasPredictionPermission) {
                const intervalMs = Math.max(1000, 11000 - (speed * 1000));
                h_predictionUpdateInterval = setInterval(h_updatePrediction, intervalMs);
            }
        }

        function applyTheme(theme) {
            const root = document.documentElement;
            const themes = {
                'default': {
                    '--primary-color': '#03A9F4',
                    '--secondary-color': '#F59E0B',
                    '--dark-blue-bg': '#1F2937',
                    '--border-color': '#374151',
                    '--gradient-primary': 'linear-gradient(135deg, #03A9F4 0%, #29B6F6 100%)',
                    '--gradient-secondary': 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)'
                },
                'green': {
                    '--primary-color': '#10B981',
                    '--secondary-color': '#34D399',
                    '--dark-blue-bg': '#14532D',
                    '--border-color': '#22C55E',
                    '--gradient-primary': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                    '--gradient-secondary': 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                },
                'purple': {
                    '--primary-color': '#8B5CF6',
                    '--secondary-color': '#A78BFA',
                    '--dark-blue-bg': '#312E81',
                    '--border-color': '#4C1D95',
                    '--gradient-primary': 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                    '--gradient-secondary': 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                },
                'gold': {
                    '--primary-color': '#F59E0B',
                    '--secondary-color': '#FCD34D',
                    '--dark-blue-bg': '#78350F',
                    '--border-color': '#B45309',
                    '--gradient-primary': 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)',
                    '--gradient-secondary': 'linear-gradient(135deg, #D97706 0%, #B45309 100%)'
                }
            };
            
            if (themes[theme]) {
                Object.keys(themes[theme]).forEach(property => {
                    root.style.setProperty(property, themes[theme][property]);
                });
            }
        }

        function setupProfile() {
            const userNameInput = document.getElementById('userName');
            const userBioInput = document.getElementById('userBio');
            const saveBtn = document.getElementById('saveProfileBtn');
            const deviceId = getDeviceId();
            
            document.getElementById('userDeviceId').textContent = deviceId;

            const profileRef = database.ref(`userProfiles/${deviceId}`);

            profileRef.on('value', (snapshot) => {
                const profile = snapshot.val() || { name: '', bio: '', wins: 0, losses: 0, deviceId: deviceId, hasPermission: false, role: 'user', validUntil: 0 };
                userNameInput.value = profile.name;
                userBioInput.value = profile.bio;
                updateProfileStatsUI(profile);
                userProfile = profile;
                
                const now = Date.now();
                hasPredictionPermission = profile.hasPermission && profile.validUntil > now;
                
                document.getElementById('userStatus').textContent = hasPredictionPermission ? 'Active' : 'Inactive';
                document.getElementById('userStatus').style.color = hasPredictionPermission ? 'var(--success-color)' : 'var(--danger-color)';
                document.getElementById('userRole').textContent = profile.role === 'admin' ? 'Admin' : 'User';
                
                if (hasPredictionPermission) {
                    const savedSpeed = localStorage.getItem('predictionSpeed') || '5';
                    updatePredictionInterval(parseInt(savedSpeed));
                } else {
                    clearInterval(h_predictionUpdateInterval);
                    document.getElementById("currentPrediction").textContent = translations[currentLanguage]['No Prediction Available'];
                    document.getElementById("currentPrediction").className = "font-semibold locked";
                    document.getElementById("gameStatusMessage").textContent = translations[currentLanguage]['Your access has expired or is not yet granted. Please contact support.'];
                }

                const adminNav = document.getElementById('adminNav');
                if (profile.role === 'admin') {
                    adminNav.style.display = 'block';
                } else {
                    adminNav.style.display = 'none';
                }

                setLanguage(currentLanguage);

            });

            saveBtn.addEventListener('click', () => {
                const name = userNameInput.value || `User-${deviceId}`;
                const bio = userBioInput.value || '';
                profileRef.update({ name, bio, deviceId })
                    .then(() => showToast('Profile saved successfully!', 'success'))
                    .catch(() => showToast('Failed to save profile.', 'error'));
            });

            document.getElementById('telegramLink1').addEventListener('click', (e) => createTelegramLink(e, 'DammnnSonn'));
            document.getElementById('telegramLink2').addEventListener('click', (e) => createTelegramLink(e, 'Kailash_modz_009'));
        }

        function updateProfileStatsUI(stats) {
            const wins = stats.wins || 0;
            const losses = stats.losses || 0;
            const total = wins + losses;
            const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
            document.getElementById('profileTotalWins').textContent = wins;
            document.getElementById('profileTotalLosses').textContent = losses;
            document.getElementById('profileWinRate').textContent = `${winRate}%`;
            document.getElementById('profileCurrentStreak').textContent = h_streak;
        }

        function updateUserProfileStats(status) {
            const deviceId = getDeviceId();
            if (!deviceId) return;

            const profileRef = database.ref(`userProfiles/${deviceId}`);
            profileRef.transaction(currentProfile => {
                const profile = currentProfile || { name: '', bio: '', wins: 0, losses: 0, highestStreak: 0, deviceId: deviceId };
                if (status === 'WIN') {
                    profile.wins = (profile.wins || 0) + 1;
                    if(profile.currentStreak) {
                        profile.currentStreak = (profile.currentStreak || 0) + 1;
                    } else {
                        profile.currentStreak = 1;
                    }
                    if(profile.currentStreak > (profile.highestStreak || 0)) {
                        profile.highestStreak = profile.currentStreak;
                    }
                } else if (status === 'LOSS') {
                    profile.losses = (profile.losses || 0) + 1;
                    profile.currentStreak = 0;
                }
                return profile;
            }, (error, committed, snapshot) => {
                if (error) {
                    console.error("Profile update failed: ", error);
                } else if (committed) {
                    updateProfileStatsUI(snapshot.val());
                }
            });
        }
        
        function createTelegramLink(e, username) {
            e.preventDefault();
            const deviceId = getDeviceId();
            const name = document.getElementById('userName').value || 'N/A';
            const bio = document.getElementById('userBio').value || 'N/A';
            const message = `Device ID: ${deviceId}\nName: ${name}\nBio: ${bio}`;
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://t.me/${username}?text=${encodedMessage}`, '_blank');
        }

        function loadTopUsers() {
            const topUsersList = document.getElementById('topUsersList');
            const usersRef = database.ref('userProfiles');
            usersRef.on('value', (snapshot) => {
                const users = snapshot.val() || {};
                const userList = Object.values(users);
                userList.sort((a, b) => {
                    const aWins = a.wins || 0;
                    const aLosses = a.losses || 0;
                    const aTotal = aWins + aLosses;
                    const aWinRate = aTotal > 0 ? (aWins / aTotal) : 0;
                    
                    const bWins = b.wins || 0;
                    const bLosses = b.losses || 0;
                    const bTotal = bWins + bLosses;
                    const bWinRate = bTotal > 0 ? (bWins / bTotal) : 0;

                    return bWinRate - aWinRate;
                });
                
                topUsersList.innerHTML = userList.slice(0, 3).map((user, index) => {
                    const wins = user.wins || 0;
                    const losses = user.losses || 0;
                    const total = wins + losses;
                    const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
                    let rankClass = '';
                    if (index === 0) rankClass = 'world-user-rank-1';
                    else if (index === 1) rankClass = 'world-user-rank-2';
                    else if (index === 2) rankClass = 'world-user-rank-3';

                    return `<div class="world-user-item" data-userid="${user.deviceId}">
                                <span class="world-user-rank ${rankClass}">${index + 1}.</span>
                                <div class="world-user-details">
                                    <h3>${user.name || 'Anonymous User'}</h3>
                                    <p>${user.bio || 'No bio.'}</p>
                                </div>
                                <span class="world-user-winrate">${winRate}%</span>
                            </div>`;
                }).join('');

                document.querySelectorAll('.world-user-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const userId = item.dataset.userid;
                        showUserProfilePopup(userId);
                    });
                });
            });
        }

        async function showUserProfilePopup(userId) {
            const userRef = database.ref(`userProfiles/${userId}`);
            const snapshot = await userRef.get();
            const user = snapshot.val();
            if (user) {
                const wins = user.wins || 0;
                const losses = user.losses || 0;
                const total = wins + losses;
                const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
                
                document.getElementById('userProfilePopupName').textContent = user.name || 'Anonymous User';
                document.getElementById('userProfilePopupBio').textContent = user.bio || 'No bio provided.';
                document.getElementById('popupTotalWins').textContent = wins;
                document.getElementById('popupTotalLosses').textContent = losses;
                document.getElementById('popupWinRate').textContent = `${winRate}%`;
                document.getElementById('popupHighestStreak').textContent = user.highestStreak || 0;
                
                showPopup('userProfilePopup');
            }
        }
        

        function searchUser() {
            const searchInput = document.getElementById('userSearchInput').value.trim();
            const searchResultEl = document.getElementById('userSearchResult');
            if (!searchInput) {
                searchResultEl.style.display = 'none';
                return;
            }

            const usersRef = database.ref('userProfiles');
            usersRef.once('value', (snapshot) => {
                const users = snapshot.val() || {};
                const foundUser = Object.values(users).find(user => 
                    (user.name && user.name.toLowerCase() === searchInput.toLowerCase()) || user.deviceId === searchInput
                );

                if (foundUser) {
                    const wins = foundUser.wins || 0;
                    const losses = foundUser.losses || 0;
                    const total = wins + losses;
                    const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
                    searchResultEl.innerHTML = `
                        <h3 class="font-bold text-lg">${foundUser.name || 'Anonymous User'}</h3>
                        <p class="text-sm opacity-70">${foundUser.bio || 'No bio provided.'}</p>
                        <div class="mt-2 text-sm">
                            <p>Wins: <span class="text-green-400">${wins}</span></p>
                            <p>Losses: <span class="text-red-400">${losses}</span></p>
                            <p>Win Rate: <span class="text-yellow-400">${winRate}%</span></p>
                        </div>
                    `;
                    searchResultEl.style.display = 'block';
                } else {
                    searchResultEl.innerHTML = `<p class="text-center opacity-70">User not found.</p>`;
                    searchResultEl.style.display = 'block';
                }
            });
        }
        
        function getDeviceId() {
            let id = localStorage.getItem('igrisDeviceId');
            if (!id || id.length !== 6) {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let result = '';
                for (let i = 0; i < 6; i++) { 
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                id = result;
                localStorage.setItem('igrisDeviceId', id);
            }
            return id;
        }

        function checkUserName() {
            const deviceId = getDeviceId();
            const profileRef = database.ref(`userProfiles/${deviceId}`);
            profileRef.once('value', (snapshot) => {
                const profile = snapshot.val();
                if (!profile || !profile.name) {
                    showPopup('userNamePopup');
                    document.getElementById('userNameInputFirstTime').focus();
                } else {
                    initializePredictionApp();
                }
            });
        }

        function handleSaveName() {
            const deviceId = getDeviceId();
            const nameInput = document.getElementById('userNameInputFirstTime');
            const name = nameInput.value.trim();
            if (name) {
                const profileRef = database.ref(`userProfiles/${deviceId}`);
                profileRef.set({ name: name, bio: '', wins: 0, losses: 0, deviceId: deviceId, hasPermission: false, role: 'user', validUntil: 0 })
                    .then(() => {
                        hidePopup('userNamePopup');
                        showToast('Welcome to the platform!', 'success');
                        initializePredictionApp();
                    })
                    .catch((error) => {
                        console.error("Firebase save error:", error);
                        showToast('Failed to save name. Please try again later.', 'error');
                    });
            } else {
                showToast('Please enter a valid name.', 'info');
            }
        }

        async function startAutoPrediction() {
            const token = document.getElementById('telegramBotToken').value;
            const chatId = document.getElementById('telegramChatId').value;
            if (!token || !chatId) {
                showToast(translations[currentLanguage]['Please enter both Bot Token and Channel ID.'], 'error');
                return;
            }
            isAutoPredictionRunning = true;
            document.getElementById('startAutoPredictionBtn').style.display = 'none';
            document.getElementById('stopAutoPredictionBtn').style.display = 'inline-flex';
            showToast(translations[currentLanguage]['Auto prediction started successfully!'], 'success');
            
            await sendTelegramSticker(token, chatId, "CAACAgUAAxkBAAEPH4lomYH0ejzfAy9lr2YQyV6kpY3ZGwACFQ8AAjuEAAFVPAKVzG-_rMU2BA");

            h_updatePrediction();
        }

        function stopAutoPrediction() {
            isAutoPredictionRunning = false;
            document.getElementById('startAutoPredictionBtn').style.display = 'inline-flex';
            document.getElementById('stopAutoPredictionBtn').style.display = 'none';
            showToast(translations[currentLanguage]['Auto prediction stopped.'], 'info');
            lastSentPeriod = null;
        }

        function setupAdminPanel() {
            document.getElementById('loginAdminBtn').addEventListener('click', () => {
                const password = document.getElementById('adminPassword').value;
                if (password === adminPassword) {
                    isAdminLoggedIn = true;
                    document.getElementById('adminLogin').style.display = 'none';
                    document.getElementById('adminControls').style.display = 'block';
                    showToast('Admin login successful!', 'success');
                } else {
                    showToast('Invalid password!', 'error');
                }
            });

            document.getElementById('grantAccessBtn').addEventListener('click', () => {
                if (!isAdminLoggedIn) return;
                const deviceId = document.getElementById('deviceIdInput').value.trim();
                const validityDays = parseInt(document.getElementById('validityInput').value);
                const role = document.getElementById('userRoleSelect').value;
                
                if (!deviceId) {
                    showToast('Please enter a Device ID.', 'error');
                    return;
                }
                
                const validUntil = Date.now() + (validityDays * 24 * 60 * 60 * 1000);
                const userRef = database.ref(`userProfiles/${deviceId}`);
                userRef.update({ 
                    hasPermission: true, 
                    validUntil: validUntil,
                    role: role 
                }).then(() => {
                    showToast('Access granted successfully!', 'success');
                }).catch(error => {
                    showToast('Failed to grant access.', 'error');
                });
            });
        }


        function initializePredictionApp() {
            setupHNavigation();
            setupSwipeNavigation();
            setupSettingsSystem();
            setupProfile();
            setupAdminPanel();

            document.getElementById('downloadHistoryBtn')?.addEventListener('click', downloadHistory);
            document.getElementById('clearHistoryBtn')?.addEventListener('click', () => showPopup('clearHistoryModal'));
            document.getElementById('confirmClear')?.addEventListener('click', () => { h_clearHistory(); hidePopup('clearHistoryModal'); });
            document.getElementById('cancelClear')?.addEventListener('click', () => hidePopup('clearHistoryModal'));
            document.getElementById('userSearchBtn')?.addEventListener('click', searchUser);
            document.getElementById('langEnglish')?.addEventListener('click', () => setLanguage('en'));
            document.getElementById('langHindi')?.addEventListener('click', () => setLanguage('hi'));
            document.getElementById('startAutoPredictionBtn')?.addEventListener('click', startAutoPrediction);
            document.getElementById('stopAutoPredictionBtn')?.addEventListener('click', stopAutoPrediction);


            const homeContentSection = document.getElementById('homeSection');
            if (homeContentSection) homeContentSection.classList.add('active');
            else console.error("#homeSection not found for initial activation.");

            document.getElementById("currentPrediction").textContent = "Loading..."; 
            document.getElementById("currentPrediction").className = "font-semibold"; 
            document.getElementById("currentPeriod").textContent = "----";
            updateAILogicBasedOnMood('damnn'); 
            document.getElementById('serverStatusText').textContent = "Connecting...";

            const savedLang = localStorage.getItem('language') || 'en';
            setLanguage(savedLang);

            if(database) {
                h_syncHistory(); 
                const savedSpeed = localStorage.getItem('predictionSpeed') || '5';
                updatePredictionInterval(parseInt(savedSpeed));
                h_updatePrediction(); 
            } else {
                showToast("Database connection error. Predictions unavailable.", "error");
                const statusTextEl = document.getElementById('serverStatusText');
                if (statusTextEl) statusTextEl.textContent = 'DB Error';
            }
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('saveNameBtn').addEventListener('click', handleSaveName);
            checkUserName();
        });