let selectedEmojis = [];
let currentPassword = '';
let passwordVisible = false;
let availableEmojis = Object.keys(emojiMap);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-btn').addEventListener('click', startApp);
    shuffleEmojis();
    renderEmojiGrid();
    updateLeaderboard();
});

function startApp() {
    document.getElementById('landing-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
}

function shuffleEmojis() {
    for (let i = availableEmojis.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableEmojis[i], availableEmojis[j]] = [availableEmojis[j], availableEmojis[i]];
    }
}

function renderEmojiGrid() {
    const grid = document.getElementById('emoji-grid');
    grid.innerHTML = '';
    
    
    const displayEmojis = availableEmojis.slice(0, 24);
    
    displayEmojis.forEach(emoji => {
        const button = document.createElement('button');
        button.className = 'emoji-btn';
        button.textContent = emoji;
        button.onclick = () => selectEmoji(emoji, button);
        grid.appendChild(button);
    });
}

function selectEmoji(emoji, button) {
    if (selectedEmojis.includes(emoji)) {
        
        selectedEmojis = selectedEmojis.filter(e => e !== emoji);
        button.classList.remove('selected');
    } else if (selectedEmojis.length < 6) {
       
        selectedEmojis.push(emoji);
        button.classList.add('selected');
    }
    
    updateSelectionCounter();
    generatePassword();
    updateStory();
}

function updateSelectionCounter() {
    document.getElementById('selection-count').textContent = selectedEmojis.length;
}

function generatePassword() {
    if (selectedEmojis.length === 0) {
        currentPassword = '';
        document.getElementById('password-display').textContent = 'Select emojis to generate password';
        document.getElementById('strength-meter').value = 0;
        document.getElementById('strength-text').textContent = 'None';
        return;
    }

    let password = '';
    selectedEmojis.forEach(emoji => {
        const char = emojiMap[emoji];
        const num = Math.floor(Math.random() * 10);
        const symbol = ['!', '@', '#', '$', '%', '&', '*'][Math.floor(Math.random() * 7)];
        password += char + num + symbol;
    });

    currentPassword = password;
    document.getElementById('password-display').textContent = passwordVisible ? password : '•'.repeat(password.length);
    
    
    const strength = updateStrengthMeter();
    if (Math.random() > 0.7) {
        showScenario(strength);
    }
}

function checkPasswordStrength(password) {
    if (!password) return 0;
    
    let strength = 0;
    
    
    strength += Math.min(password.length / 20 * 40, 40);
    
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    
    let varietyScore = 0;
    if (hasLower) varietyScore += 1;
    if (hasUpper) varietyScore += 1;
    if (hasNumber) varietyScore += 1;
    if (hasSpecial) varietyScore += 1;
    
    strength += (varietyScore / 4) * 30;
    
    
    const emojiCount = selectedEmojis.length;
    strength += (emojiCount / 6) * 30;
    
    return Math.min(Math.round(strength), 100);
}

function updateStrengthMeter() {
    const strength = checkPasswordStrength(currentPassword);
    const meter = document.getElementById('strength-meter');
    const strengthText = document.getElementById('strength-text');
    const pointsDisplay = document.getElementById('points-display');
    
    meter.value = strength;
    
    
    let strengthLevel, color;
    if (strength < 30) {
        strengthLevel = "Very Weak";
        color = "#ff4757";
    } else if (strength < 50) {
        strengthLevel = "Weak";
        color = "#ff6348";
    } else if (strength < 70) {
        strengthLevel = "Moderate";
        color = "#ffa502";
    } else if (strength < 85) {
        strengthLevel = "Strong";
        color = "#2ed573";
    } else {
        strengthLevel = "Very Strong";
        color = "#1dd1a1";
    }
    
    strengthText.textContent = strengthLevel;
    strengthText.style.color = color;
    meter.style.setProperty('--strength-color', color);
    
    
    const points = Math.floor(strength / 10);
    pointsDisplay.textContent = `Points: ${points}`;
    pointsDisplay.style.color = color;
    
  
    localStorage.setItem('passmatePoints', (parseInt(localStorage.getItem('passmatePoints') || 0) + points).toString());
    updateLeaderboard();
    
    return strength;
}


const scenarios = {
    weak: [
        {
            title: "Oh no! Your password was hacked!",
            text: "A hacker easily guessed your weak password and accessed your account. They changed your profile picture and sent spam to all your friends!",
            emoji: "😱"
        },
        {
            title: "Password Breach Alert!",
            text: "Your simple password was found in a data breach. Now cybercriminals are trying to use it on your other accounts!",
            emoji: "🔓"
        },
        {
            title: "Account Compromised!",
            text: "Your weak password took only 3 seconds to crack. The hacker now has access to all your personal information!",
            emoji: "💀"
        }
    ],
    moderate: [
        {
            title: "Close Call!",
            text: "A hacker tried to brute-force your password but gave up after a few attempts. Your password was strong enough to slow them down!",
            emoji: "😅"
        },
        {
            title: "Almost There!",
            text: "Your password provided basic protection, but could be stronger. It took a hacker about an hour to crack it!",
            emoji: "⚠️"
        }
    ],
    strong: [
        {
            title: "Security Win!",
            text: "Cybercriminals attempted to crack your password but failed miserably. Your strong password kept your data safe!",
            emoji: "🛡️"
        },
        {
            title: "Fort Knox Security!",
            text: "Your password is so strong that even the most advanced hacking tools couldn't break through. Well done!",
            emoji: "🏆"
        },
        {
            title: "Hacker-Proof!",
            text: "Your password would take approximately 3 million years to crack at 10 billion guesses per second!",
            emoji: "🔒"
        }
    ]
};

function showScenario(strength) {
  
    if (Math.random() > 0.5) return;
    
    let scenarioPool;
    if (strength < 40) {
        scenarioPool = scenarios.weak;
    } else if (strength < 70) {
        scenarioPool = scenarios.moderate;
    } else {
        scenarioPool = scenarios.strong;
    }
    
    const scenario = scenarioPool[Math.floor(Math.random() * scenarioPool.length)];
    
    const modal = document.createElement('div');
    modal.className = 'scenario-modal';
    modal.innerHTML = `
        <div class="scenario-content">
            <h2 class="scenario-title">${scenario.title}</h2>
            <div class="scenario-emoji">${scenario.emoji}</div>
            <p class="scenario-text">${scenario.text}</p>
            <button class="close-scenario">Got it!</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 100);
    
    modal.querySelector('.close-scenario').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
}


function updateLeaderboard() {
    const points = parseInt(localStorage.getItem('passmatePoints') || 0);
    const leaderboard = document.getElementById('leaderboard-points');
    if (leaderboard) {
        leaderboard.textContent =` Total Points: ${points}`;
    }
}

function updateStory() {
    const story = generateStory(selectedEmojis);
    document.getElementById('story').textContent = story;
}

function togglePassword() {
    passwordVisible = !passwordVisible;
    const display = document.getElementById('password-display');
    
    if (currentPassword) {
        display.textContent = passwordVisible ? currentPassword : '•'.repeat(currentPassword.length);
    }
}

function copyPassword() {
    if (currentPassword) {
        navigator.clipboard.writeText(currentPassword).then(() => {
            
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            btn.style.background = 'rgba(76, 175, 80, 0.5)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy password: ', err);
        });
    }
}

function generateNew() {
    selectedEmojis = [];
    currentPassword = '';
    passwordVisible = false;
    
   
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    shuffleEmojis();
    renderEmojiGrid();
    updateSelectionCounter();
    generatePassword();
    updateStory();
}