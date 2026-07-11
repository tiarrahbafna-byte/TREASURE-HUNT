// ==========================================
// 🏴‍☠️ PIRATE TREASURE QUEST - GAME LOGIC
// ==========================================

// 1. GAME STATE TRACKER
// This object remembers everything about the current player's journey.
let gameState = {
    playerName: "Explorer",
    category: "Math",
    currentIsland: 1, // Progresses from 1 to 3, then 4 is the Treasure Chest
    coins: 0,
    xp: 0,
    badges: 0
};

// 2. THE TRIVIA TREASURE BANK
// Contains custom pirate questions split into 4 separate educational categories.
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

// 3. SCREEN SWITCHER (NAVIGATION)
// Hides all pages and only displays the active screen ID.
function showPage(pageId) {
    // Hide every screen element
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    // Turn on the requested screen element
    document.getElementById(pageId).classList.add('active');
    
    // Show the top scoreboard HUD only during live quiz gameplay or victory screens
    if (pageId === 'gameplay-page' || pageId === 'victory-page') {
        document.getElementById('game-stats').style.display = 'flex';
    } else {
        document.getElementById('game-stats').style.display = 'none';
    }
}

// 4. SET SAIL (START GAME BUTTON ACTION)
// Grabs data from the home screen form, validates it, and sets up your journey.
function startAdventure() {
    const nameInput = document.getElementById('player-name-input').value.trim();
    
    // Error handling if input box is empty
    if (!nameInput) {
        alert("Arrgh! State your pirate name before setting sail!");
        return;
    }
    
    // Initialize/Reset game variables
    gameState.playerName = nameInput;
    gameState.category = document.getElementById('game-category-input').value;
    gameState.currentIsland = 1;
    gameState.coins = 0;
    gameState.xp = 0;
    gameState.badges = 0;

    // Refresh display visual modules
    updateStatsDisplay();
    renderMapIslands();
    loadQuestion();
    
    // Instantly transition to map screen
    showPage('gameplay-page');
}

// 5. UPDATE SCOREBOARD HUD
// Syncs JavaScript values over to your visual HTML elements.
function updateStatsDisplay() {
    document.getElementById('stat-name').innerText = gameState.playerName;
    document.getElementById('stat-coins').innerText = gameState.coins;
    document.getElementById('stat-xp').innerText = gameState.xp;
    document.getElementById('stat-badges').innerText = gameState.badges;
}

// 6. DRAW THE ISLAND PROGRESS MAP
// Updates colors and highlights islands to show how close the player is to the gold.
function renderMapIslands() {
    for (let i = 1; i <= 3; i++) {
        const node = document.getElementById(`island-node-${i}`);
        node.className = "island-node"; // reset classes
        
        if (i < gameState.currentIsland) {
            node.classList.add('completed'); // turns green
        } else if (i === gameState.currentIsland) {
            node.classList.add('active'); // glows gold
        }
    }
    
    // Handle final chest marker highlight state
    const chestNode = document.getElementById('island-node-chest');
    chestNode.className = "island-node";
    if (gameState.currentIsland > 3) {
        chestNode.classList.add('active');
    }
}

// 7. LOAD ISLAND QUESTIONS
// Pulls the correct question from the question array based on your island number.
function loadQuestion() {
    document.getElementById('feedback-msg').innerText = "";
    const currentQuestions = questionBank[gameState.category];
    const activeIndex = gameState.currentIsland - 1;

    // Safety fallback: if islands go out of bounds, finish game
    if (activeIndex >= currentQuestions.length) {
        handleVictoryTransition();
        return;
    }

    // Set question headline text
    const currentData = currentQuestions[activeIndex];
    document.getElementById('question-title').innerText = `Island ${gameState.currentIsland} Trivia: ${currentData.q}`;
    
    // Clear old choice buttons out of grid container
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = "";

    // Generate dynamic option buttons for each answer
    currentData.a.forEach((optionText, choiceIndex) => {
        const button = document.createElement('button');
        button.className = "option-btn";
        button.innerText = optionText;
        // Pass button click details over to check correctness
        button.onclick = () => evaluationAnswer(choiceIndex, currentData.correct);
        optionsContainer.appendChild(button);
    });
}

// 8. EVALUATE USER ANSWER
// Checks choices, gives loot rewards, or throws a text penalty!
function evaluationAnswer(selectedIdx, correctIdx) {
    const feedback = document.getElementById('feedback-msg');
    
    if (selectedIdx === correctIdx) {
        // Boost points state
        gameState.coins += 20;
        gameState.xp += 50;
        gameState.badges += 1;
        gameState.currentIsland += 1; // Move to next island node
        
        feedback.style.color = "green";
        feedback.innerText = "Splendid! Right answer. Sail onward!";
        
        // Save score and map progress
        updateStatsDisplay();
        renderMapIslands();

        // 1.2 Second delay so players see the success notification message
        setTimeout(() => {
            if (gameState.currentIsland > 3) {
                handleVictoryTransition();
            } else {
                loadQuestion();
            }
        }, 1200);
    } else {
        // Mistake feedback loop
        feedback.style.color = "var(--pirate-red)";
        feedback.innerText = "Shiver me timbers! Incorrect choice. Try this island's challenge again.";
    }
}

// 9. VICTORY HANDLER & LEADERBOARD SAVE
// Triggers local storage databases to record custom ranks and displays the certificate.
function handleVictoryTransition() {
    showPage('victory-page');
    
    // Apply final details to custom certificate plaque
    document.getElementById('cert-name').innerText = gameState.playerName;
    document.getElementById('cert-category').innerText = gameState.category;
    document.getElementById('cert-coins').innerText = gameState.coins;

    // Load old dashboard archive array from browser memory storage
    let scoreboard = JSON.parse(localStorage.getItem('pirateLeaderboard')) || [];
    
    // Push new user card inside history pile
    scoreboard.push({
        name: gameState.playerName,
        category: gameState.category,
        coins: gameState.coins
    });
    
    // Sort array elements from highest coins down to lowest coins
    scoreboard.sort((x, y) => y.coins - x.coins);
    
    // Save updated scoreboard list back to your browser storage
    localStorage.setItem('pirateLeaderboard', JSON.stringify(scoreboard));

    // Clear old table listings and build updated dynamic top 5 row records
    const boardBody = document.getElementById('leaderboard-body');
    boardBody.innerHTML = "";
    
    const topScores = scoreboard.slice(0, 5); // Slice out top 5 items
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

// 10. RESTART THE VOYAGE LOOP
// Clears input areas and sends your player back to the main homepage lobby.
function resetGame() {
    document.getElementById('player-name-input').value = "";
    showPage('home-page');
}
