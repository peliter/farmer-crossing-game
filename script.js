document.addEventListener('DOMContentLoaded', () => {

    // --- DOM 元素 --- //
    const items = {
        farmer: document.getElementById('farmer'),
        tiger: document.getElementById('tiger'),
        sheep: document.getElementById('sheep'),
        snake: document.getElementById('snake'),
        chicken: document.getElementById('chicken'),
        apple: document.getElementById('apple'),
    };
    const leftBank = document.getElementById('left-bank');
    const rightBank = document.getElementById('right-bank');
    const boatElement = document.getElementById('boat');
    const crossRiverBtn = document.getElementById('cross-river-btn');
    const resetBtn = document.getElementById('reset-btn');
    const solveBtn = document.getElementById('solve-btn');
    const messageArea = document.querySelector('#message-area p');
    const historyList = document.getElementById('history-list');
    
    // 失敗提示視窗元素
    const failureModal = document.getElementById('failure-modal');
    const failureMessage = document.getElementById('failure-message');
    const restartBtn = document.getElementById('restart-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // --- 遊戲狀態管理 --- //
    const initialGameState = { farmer: 'left', tiger: 'left', sheep: 'left', snake: 'left', chicken: 'left', apple: 'left', boat: 'left' };
    let gameState = {};
    let gameEnded = false;
    let stepCounter = 0;
    let failedAttempts = 0; // 新增失敗次數計數器
    const konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
    let konamiCodePosition = 0;

    // --- 核心邏輯 --- //

    function getBankStatus(bankSide) {
        const itemsOnBank = Object.keys(items).filter(key => gameState[key] === bankSide);
        // 如果農夫在岸上，岸邊是安全的
        if (itemsOnBank.includes('farmer')) {
            return { isSafe: true, reason: '農夫在場，萬事平安。' };
        }
        if (itemsOnBank.length <= 1) {
            return { isSafe: true, reason: '物品少於兩個，沒有衝突風險。' };
        }

        const has = (item) => itemsOnBank.includes(item);

        // 獨立檢查所有衝突規則
        if (has('tiger') && has('sheep') && !has('chicken')) {
            return { isSafe: false, reason: '老虎會吃掉羊！' };
        }
        if (has('snake') && has('chicken') && !has('tiger')) {
            return { isSafe: false, reason: '蛇會吃掉雞！' };
        }
        if (has('sheep') && has('apple') && !has('snake')) {
            return { isSafe: false, reason: '羊會吃掉蘋果！' };
        }

        return { isSafe: true, reason: '物品組合安全，沒有衝突。' };
    }

    function checkWin() {
        // 檢查除了農夫之外的所有物品是否都在右岸
        return Object.keys(items).every(key => key === 'farmer' || gameState[key] === 'right');
    }

    function logStep(message) {
        stepCounter++;
        const li = document.createElement('li');
        li.innerHTML = `<b>步驟 ${stepCounter}:</b> ${message}`;
        historyList.prepend(li);
    }

    // --- 畫面更新 --- //
    function updateUI() {
        leftBank.innerHTML = '';
        rightBank.innerHTML = '';
        
        // 保留船的圖片，只移除物品
        const boatImage = boatElement.querySelector('#boat-image');
        boatElement.innerHTML = '';
        if (boatImage) {
            boatElement.appendChild(boatImage);
        }

        for (const [itemName, location] of Object.entries(gameState)) {
            if (itemName === 'boat') continue;
            const itemElement = items[itemName];
            
            // 根據位置增刪 .on-boat class
            if (location === 'boat') {
                itemElement.classList.add('on-boat');
            } else {
                itemElement.classList.remove('on-boat');
            }

            if (location === 'left') {
                leftBank.appendChild(itemElement);
            } else if (location === 'right') {
                rightBank.appendChild(itemElement);
            } else { // 'boat'
                boatElement.appendChild(itemElement);
            }
        }
        // 檢查是否為手機版布局
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 414;
        
        if (isMobile) {
            // 手機版：上下移動
            const riverElement = document.getElementById('river');
            const riverHeight = riverElement.offsetHeight;
            const boatHeight = boatElement.offsetHeight || 60;
            
            if (gameState.boat === 'left') {
                // 左岸對應上方位置
                const topPosition = riverHeight * 0.1;
                boatElement.style.top = `${topPosition}px`;
                boatElement.style.left = '50%';
                boatElement.style.transform = 'translateX(-50%)';
            } else {
                // 右岸對應下方位置
                const bottomMargin = riverHeight * 0.1;
                const bottomPosition = riverHeight - boatHeight - bottomMargin;
                boatElement.style.top = `${bottomPosition}px`;
                boatElement.style.left = '50%';
                boatElement.style.transform = 'translateX(-50%)';
            }
        } else {
            // PC版：左右移動
            const riverElement = document.getElementById('river');
            const riverWidth = riverElement.offsetWidth;
            const boatRect = boatElement.getBoundingClientRect();
            const boatWidth = boatRect.width || 100;
            
            if (gameState.boat === 'left') {
                // 左邊：距離左邊界的位置
                const leftPosition = riverWidth * 0.05;
                boatElement.style.transform = `translateX(${leftPosition}px)`;
                boatElement.style.top = '';
                boatElement.style.left = '';
            } else {
                // 右邊：距離右邊界的位置
                const rightMargin = riverWidth * 0.05;
                const rightPosition = riverWidth - boatWidth - rightMargin;
                boatElement.style.transform = `translateX(${rightPosition}px)`;
                boatElement.style.top = '';
                boatElement.style.left = '';
            }
        }
        
        // 確保船上的物品在手機版上正確顯示
        if (isMobile) {
            const itemsOnBoat = boatElement.querySelectorAll('.item.on-boat');
            itemsOnBoat.forEach((item, index) => {
                // 在小螢幕上，物品應該更緊密排列
                if (isSmallMobile) {
                    item.style.margin = '1px';
                } else {
                    item.style.margin = '2px';
                }
            });
        }
    }

    // --- 事件監聽 --- //

    function onItemClick(event) {
        if (gameEnded) return;
        const itemName = event.target.id;
        const itemLocation = gameState[itemName];
        const itemsOnBoat = Object.keys(gameState).filter(key => gameState[key] === 'boat');

        if (itemLocation === 'boat') { // 從船上到岸上
            gameState[itemName] = gameState.boat;
        } else { // 從岸上到船上
            if (itemLocation !== gameState.boat) {
                messageArea.textContent = '農夫和物品不在同一邊！';
                return;
            }
            if (itemsOnBoat.length >= 2) {
                messageArea.textContent = '船上已經有兩樣東西了！';
                return;
            }
            gameState[itemName] = 'boat';
        }
        messageArea.textContent = ' ';
        updateUI();
    }

    function onCrossRiver() {
        if (gameEnded) return;

        const itemsOnBoat = Object.keys(gameState).filter(key => gameState[key] === 'boat');
        if (!itemsOnBoat.includes('farmer')) {
            messageArea.textContent = '農夫必須在船上才能過河！';
            return;
        }

        const toBank = gameState.boat === 'left' ? 'right' : 'left';
        const toBankText = toBank === 'left' ? '左' : '右';
        
        let moveDescription;
        if (itemsOnBoat.length > 1) {
            const otherItem = itemsOnBoat.find(item => item !== 'farmer');
            moveDescription = `農夫帶著 ${items[otherItem].alt} 划船到${toBankText}岸。`;
        } else {
            moveDescription = `農夫獨自划船到${toBankText}岸。`;
        }

        gameState.boat = toBank;
        itemsOnBoat.forEach(item => {
            gameState[item] = toBank;
        });
        updateUI();

        const leftStatus = getBankStatus('left');
        const rightStatus = getBankStatus('right');

        console.log('Left Bank Status:', leftStatus);
        console.log('Right Bank Status:', rightStatus);

        const logMessage = `${moveDescription}<br> - 左岸: ${leftStatus.reason}<br> - 右岸: ${rightStatus.reason}`;
        logStep(logMessage);

        const unattendedBank = gameState.boat === 'left' ? 'right' : 'left';
        const unattendedBankStatus = unattendedBank === 'left' ? leftStatus : rightStatus;

        if (!unattendedBankStatus.isSafe) {
            gameEnded = true;
            crossRiverBtn.disabled = true;
            failedAttempts++; // 失敗次數增加
            
            // 顯示失敗模態框
            let failureText = unattendedBankStatus.reason;
            if (failedAttempts >= 3) {
                failureText += '\n\n💡 提示：遇到困難了嗎？試試上上下下左右左右BA！';
            }
            showFailureModal(failureText);
            return;
        }

        if (checkWin()) {
            messageArea.textContent = '恭喜你，成功將所有東西安全送到對岸！';
            gameEnded = true;
            crossRiverBtn.disabled = true;
        }
    }

    function showSolution() {
        resetGame();
        gameEnded = true; // 鎖定操作
        crossRiverBtn.disabled = true;
        solveBtn.disabled = true;
        messageArea.textContent = '正在演示最佳解法...';

        const solutionSteps = [
            // 步驟 1: 農夫帶著蘋果划船到右岸。
            () => { gameState.farmer = 'boat'; gameState.apple = 'boat'; },
            () => { gameState.boat = 'right'; gameState.farmer = 'right'; gameState.apple = 'right'; logStep('農夫帶著蘋果划船到右岸。'); },

            // 步驟 2: 農夫獨自划船到左岸。
            () => { gameState.farmer = 'boat'; },
            () => { gameState.boat = 'left'; gameState.farmer = 'left'; logStep('農夫獨自划船到左岸。'); },

            // 步驟 3: 農夫帶著蛇划船到右岸。
            () => { gameState.farmer = 'boat'; gameState.snake = 'boat'; },
            () => { gameState.boat = 'right'; gameState.farmer = 'right'; gameState.snake = 'right'; logStep('農夫帶著蛇划船到右岸。'); },

            // 步驟 4: 農夫獨自划船到左岸。
            () => { gameState.farmer = 'boat'; },
            () => { gameState.boat = 'left'; gameState.farmer = 'left'; logStep('農夫獨自划船到左岸。'); },

            // 步驟 5: 農夫帶著老虎划船到右岸。
            () => { gameState.farmer = 'boat'; gameState.tiger = 'boat'; },
            () => { gameState.boat = 'right'; gameState.farmer = 'right'; gameState.tiger = 'right'; logStep('農夫帶著老虎划船到右岸。'); },

            // 步驟 6: 農夫獨自划船到左岸。
            () => { gameState.farmer = 'boat'; },
            () => { gameState.boat = 'left'; gameState.farmer = 'left'; logStep('農夫獨自划船到左岸。'); },

            // 步驟 7: 農夫帶著雞划船到右岸。
            () => { gameState.farmer = 'boat'; gameState.chicken = 'boat'; },
            () => { gameState.boat = 'right'; gameState.farmer = 'right'; gameState.chicken = 'right'; logStep('農夫帶著雞划船到右岸。'); },

            // 步驟 8: 農夫獨自划船到左岸。
            () => { gameState.farmer = 'boat'; },
            () => { gameState.boat = 'left'; gameState.farmer = 'left'; logStep('農夫獨自划船到左岸。'); },

            // 步驟 9: 農夫帶著羊划船到右岸。
            () => { gameState.farmer = 'boat'; gameState.sheep = 'boat'; },
            () => { gameState.boat = 'right'; gameState.farmer = 'right'; gameState.sheep = 'right'; logStep('農夫帶著羊划船到右岸。'); },
        ];

        let stepIndex = 0;
        const interval = setInterval(() => {
            if (stepIndex < solutionSteps.length) {
                solutionSteps[stepIndex]();
                updateUI();
                stepIndex++;
            } else {
                clearInterval(interval);
                messageArea.textContent = '演示完畢！請檢查所有物品是否已安全抵達右岸。';
                solveBtn.disabled = false;
                if (checkWin()) {
                     messageArea.textContent = '恭喜你，成功將所有東西安全送到對岸！';
                }
            }
        }, 1500);
    }

    function showFailureModal(message) {
        failureMessage.textContent = message;
        failureModal.style.display = 'flex';
    }
    
    function hideFailureModal() {
        failureModal.style.display = 'none';
    }
    
    function resetGame() {
        gameState = { ...initialGameState };
        gameEnded = false;
        stepCounter = 0;
        
        konamiCodePosition = 0; // 重置 Konami Code 輸入進度
        messageArea.textContent = '請點擊農夫和一樣物品上船。';
        crossRiverBtn.disabled = false;
        historyList.innerHTML = '';
        solveBtn.style.display = 'none'; // 確保解答按鈕隱藏
        hideFailureModal(); // 隱藏失敗模態框

        updateUI();
    }

    // 初始化
    Object.values(items).forEach(item => item.addEventListener('click', onItemClick));
    crossRiverBtn.addEventListener('click', onCrossRiver);
    resetBtn.addEventListener('click', resetGame);
    solveBtn.addEventListener('click', showSolution);
    
    // 失敗模態框事件監聽器
    restartBtn.addEventListener('click', resetGame);
    closeModalBtn.addEventListener('click', hideFailureModal);
    
    // 點擊模態框背景關閉
    failureModal.addEventListener('click', (e) => {
        if (e.target === failureModal) {
            hideFailureModal();
        }
    });

    resetGame(); // 呼叫 resetGame 來設定初始畫面

    // 窗口大小變化監聽器 - 重新計算船的位置
    window.addEventListener('resize', () => {
        // 延遲執行以確保CSS已經應用
        setTimeout(() => {
            updateUI();
        }, 100);
    });

    // 頁面載入完成後再次更新UI，確保所有元素都已正確渲染
    window.addEventListener('load', () => {
        setTimeout(() => {
            updateUI();
        }, 200);
    });

    // Konami Code 監聽器
    document.addEventListener('keydown', (e) => {
        // 只有在遊戲結束且失敗次數不足3次時才不觸發彩蛋
        if (gameEnded && failedAttempts < 3) return;

        // 將按鍵轉換為小寫以匹配 konamiCode 陣列
        const key = e.key.toLowerCase();

        if (key === konamiCode[konamiCodePosition]) {
            konamiCodePosition++;
            if (konamiCodePosition === konamiCode.length) {
                // Konami Code 輸入成功
                messageArea.textContent = '彩蛋啟用！解答按鈕已出現。';
                solveBtn.style.display = 'inline-block'; // 顯示解答按鈕
                konamiCodePosition = 0; // 重置，防止重複觸發
            }
        } else {
            konamiCodePosition = 0; // 輸入錯誤，重置
        }
    });
});
