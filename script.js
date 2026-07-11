/* ==========================================
   🏴‍☠️ JAVASCRIPT LOGIC (THE MECHANICS)
   ========================================== */

// 1. GAME STATE GLOBAL MEMORY

let gameState = {
    playerName: "Explorer",
    category: "Math",
    currentIsland: 1, 
    coins: 0,
    xp: 0,
    badges: 0
};

// 2. SESSION LEADERBOARD LIST
// Pre-filled with competitor bots to make the leaderboard look active instantly!
let liveLeaderboardMemory = [
    { name: "Captain Blackbeard", category: "Math", coins: 60 },
    { name: "Scurvy Sally", category: "Science", coins: 40 }
];

// 3. EDUCATIONAL QUESTION DATABASE BANK
const questionBank = {
    Math: [
        { q: "What is 7 multiplied by 8?", a: ["54", "56", "64", "48"], correct: 1 },
        { q: "Solve: 120 divided by 4.", a: ["25", "35", "30", "40"], correct: 2 },
        { q: "What is the square root of 81?", a: ["7", "8", "9", "10"], correct: 2 }
    ],
    Science: [
        { q: "Which planet is famously known as the Red Planet?", a: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
        { q: "What gas do humans need to breathe to stay alive?", a: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 0 },
        { q: "Water boils at what temperature Celsius?", a: ["50°C", "90°C", "100°C", "120°C"], correct: 2 }
    ],
    English: [
        { q: "Identify the noun in this phrase: 'The fast pirate ran.'", a: ["The", "fast", "pirate", "ran"], correct: 2 },
        { q: "What is an opposite word (antonym) for 'Huge'?", a: ["Giant", "Tiny", "Large", "Heavy"], correct: 1 },
        { q: "Complete the text: 'The birds ___ singing beautifully this morning.'", a: ["is", "was", "are", "am"], correct: 2 }
    ],
    GK: [
        { q: "How many oceans exist on planet Earth?", a: ["3", "4", "5", "6"], correct: 2 },
        { q: "Which animal is universally called the King of the Jungle?", a: ["Tiger", "Elephant", "Bear", "Lion"], correct: 3 },
        { q: "In which country can you visit the ancient Pyramids of Giza?", a: ["Egypt", "Italy", "Mexico", "China"], correct: 0 }
    ]
};

// 4. SCREEN SWAPPING ROUTER
// Hides all pages and only shows the page matching the pageId argument.
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    // Show the live score dashboard bar only during active quiz gameplay or victory screens
    if (pageId === 'gameplay-page' || pageId === 'victory-page') {
        document.getElementById('game-stats').style.display = 'flex';
    } else {
        document.getElementById('game-stats').style.display = 'none';
    }
}

// 5. ACTION TRIGGERED ON "SET SAIL!" BUTTON CLICK
function startAdventure() {
    const nameInput = document.getElementById('player-name-input').value.trim();
    if (!nameInput) {
        alert("Arrgh! State your pirate name before setting sail!");
        return;
    }
    
    gameState.playerName = nameInput;
    gameState.category = document.getElementById('game-category-input').value;
    gameState.currentIsland = 1;
    gameState.coins = 0;
    gameState.xp = 0;
    gameState.badges = 0;

    updateStatsDisplay();
    renderMapIslands();
    loadQuestion();
    showPage('gameplay-page');
}

// 6. SYNCHRONIZE STATS TO THE HUD DISPLAY BAR
function updateStatsDisplay() {
    document.getElementById('stat-name').innerText = gameState.playerName;
    document.getElementById('stat-coins').innerText = gameState.coins;
    document.getElementById('stat-xp').innerText = gameState.xp;
    document.getElementById('stat-badges').innerText = gameState.badges;
}

// 7. RENDER VISUAL PROGRESS ISLAND TRAIL NODES
function renderMapIslands() {
    for (let i = 1; i <= 3; i++) {
        const node = document.getElementById(`island-node-${i}`);
        node.className = "island-node";
        if (i < gameState.currentIsland) {
            node.classList.add('completed'); // Turns green
        } else if (i === gameState.currentIsland) {
            node.classList.add('active'); // Glows gold
        }
    }
    const chestNode = document.getElementById('island-node-chest');
    chestNode.className = "island-node";
    if (gameState.currentIsland > 3) {
        chestNode.classList.add('active');
    }
}

// 8. GENERATE DYNAMIC QUIZ QUESTIONS AND ANSWER BUTTONS
function loadQuestion() {
    document.getElementById('feedback-msg').innerText = "";
    const currentQuestions = questionBank[gameState.category];
    const activeIndex = gameState.currentIsland - 1;

    if (activeIndex >= currentQuestions.length) {
        handleVictoryTransition();
        return;
    }

    const currentData = currentQuestions[activeIndex];
    document.getElementById('question-title').innerText = `Island ${gameState.currentIsland} Trivia: ${currentData.q}`;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = "";

    currentData.a.forEach((optionText, choiceIndex) => {
        const button = document.createElement('button');
        button.className = "option-btn";
        button.innerText = optionText;
        button.onclick = () => evaluationAnswer(choiceIndex, currentData.correct);
        optionsContainer.appendChild(button);
    });
}

// 9. VALIDATE ANSWER AND MOVE THE PIRATE SHIP CLOSER
function evaluationAnswer(selectedIdx, correctIdx) {
    const feedback = document.getElementById('feedback-msg');
    
    if (selectedIdx === correctIdx) {
        gameState.coins += 20;
        gameState.xp += 50;
        gameState.badges += 1;
        gameState.currentIsland += 1;
        
        feedback.style.color = "green";
        feedback.innerText = "Splendid! Right answer. Sail onward!";
        
        updateStatsDisplay();
        renderMapIslands();

        // Short timeout pause so player can read feedback before moving on
        setTimeout(() => {
            if (gameState.currentIsland > 3) {
                handleVictoryTransition();
            } else {
                loadQuestion();
            }
        }, 1200);
    } else {
        feedback.style.color = "var(--pirate-red)";
        feedback.innerText = "Shiver me timbers! Incorrect choice. Try this island's challenge again.";
    }
}

// 10. VICTORY CERTIFICATE GENERATOR AND LEADERBOARD CONSTRUCTOR
function handleVictoryTransition() {
    showPage('victory-page');
    
    document.getElementById('cert-name').innerText = gameState.playerName;
    document.getElementById('cert-category').innerText = gameState.category;
    document.getElementById('cert-coins').innerText = gameState.coins;

    // Push your data securely directly to standard active memory
    liveLeaderboardMemory.push({
        name: gameState.playerName,
        category: gameState.category,
        coins: gameState.coins
    });
    
    // Sort scores from highest to lowest
    liveLeaderboardMemory.sort((x, y) => y.coins - x.coins);

    const boardBody = document.getElementById('leaderboard-body');
    boardBody.innerHTML = "";
    
    // Take top 5 entries and put them in the HTML table structure
    const topScores = liveLeaderboardMemory.slice(0, 5);
    topScores.forEach((row, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${row.name}</td>
            <td>${row.category}</td>
            <td>🪙 ${row.coins}</td>
        `;
        boardBody.appendChild(tr);
    });
}

// 11. RETURN HOME BACK TO PORT
function resetGame() {
    document.getElementById('player-name-input').value = "";
    showPage('home-page');
}
