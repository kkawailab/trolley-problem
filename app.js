// ゲーム状態管理
const gameState = {
    currentScenarioIndex: 0,
    startTime: null,
    choices: [],
    decisionTimes: []
};

// 画面要素の取得
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen'),
    final: document.getElementById('final-screen')
};

// ボタン要素の取得
const buttons = {
    start: document.getElementById('start-btn'),
    leftChoice: document.getElementById('left-choice'),
    rightChoice: document.getElementById('right-choice'),
    next: document.getElementById('next-btn'),
    restart: document.getElementById('restart-btn')
};

// タイマー関連
let timerInterval = null;

// 画面切り替え関数
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

// タイマー開始
function startTimer() {
    gameState.startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = ((Date.now() - gameState.startTime) / 1000).toFixed(1);
        document.getElementById('timer').textContent = elapsed;
    }, 100);
}

// タイマー停止
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    const decisionTime = ((Date.now() - gameState.startTime) / 1000).toFixed(1);
    gameState.decisionTimes.push(parseFloat(decisionTime));
    return decisionTime;
}

// シナリオの表示
function displayScenario(scenarioIndex) {
    const scenario = scenarios[scenarioIndex];

    // シナリオ番号の更新
    document.getElementById('current-scenario').textContent = scenarioIndex + 1;

    // シナリオ内容の表示
    document.getElementById('scenario-title').textContent = scenario.title;
    document.getElementById('scenario-description').textContent = scenario.description;

    // 左の選択肢
    document.getElementById('left-title').textContent = scenario.leftChoice.title;
    document.getElementById('left-description').textContent = scenario.leftChoice.description;

    // 右の選択肢
    document.getElementById('right-title').textContent = scenario.rightChoice.title;
    document.getElementById('right-description').textContent = scenario.rightChoice.description;

    // タイマーリセット
    document.getElementById('timer').textContent = '0.0';

    // タイマー開始
    startTimer();
}

// 選択の処理
function makeChoice(choiceSide) {
    stopTimer();
    const scenario = scenarios[gameState.currentScenarioIndex];
    const choice = choiceSide === 'left' ? scenario.leftChoice : scenario.rightChoice;
    const decisionTime = gameState.decisionTimes[gameState.decisionTimes.length - 1];

    // 選択を記録
    gameState.choices.push({
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        choice: choiceSide,
        choiceTitle: choice.title,
        consequence: choice.consequence,
        decisionTime: decisionTime
    });

    // 結果画面の表示
    displayResult(scenario, choice, decisionTime);
    showScreen('result');
}

// 結果の表示
function displayResult(scenario, choice, decisionTime) {
    document.getElementById('result-choice').textContent = choice.title;
    document.getElementById('result-description').textContent = choice.consequence;
    document.getElementById('result-time').textContent = decisionTime;

    // 倫理的考察の表示
    document.getElementById('ethics-content').textContent = scenario.ethics;

    // 統計の表示
    const stats = scenario.leftChoice.stats;
    document.getElementById('stat-left-label').textContent = scenario.leftChoice.title;
    document.getElementById('stat-right-label').textContent = scenario.rightChoice.title;

    // アニメーション付きで統計バーを表示
    setTimeout(() => {
        document.getElementById('stat-left-bar').style.width = stats.left + '%';
        document.getElementById('stat-right-bar').style.width = stats.right + '%';
    }, 100);

    document.getElementById('stat-left-percent').textContent = stats.left + '%';
    document.getElementById('stat-right-percent').textContent = stats.right + '%';
}

// 次のシナリオへ
function nextScenario() {
    gameState.currentScenarioIndex++;

    if (gameState.currentScenarioIndex < scenarios.length) {
        // まだシナリオが残っている
        showScreen('game');
        displayScenario(gameState.currentScenarioIndex);
    } else {
        // 全シナリオ完了
        displayFinalResults();
        showScreen('final');
    }
}

// 最終結果の表示
function displayFinalResults() {
    // 平均決定時間の計算
    const avgTime = (gameState.decisionTimes.reduce((a, b) => a + b, 0) / gameState.decisionTimes.length).toFixed(1);
    document.getElementById('avg-time').textContent = avgTime;

    // 傾向分析
    const leftChoices = gameState.choices.filter(c => c.choice === 'left').length;
    const rightChoices = gameState.choices.filter(c => c.choice === 'right').length;

    let tendencyText = '';
    if (avgTime < 5) {
        tendencyText += '<p>あなたは非常に素早く決断を下しました。直感的な判断を重視するタイプかもしれません。</p>';
    } else if (avgTime < 10) {
        tendencyText += '<p>あなたは慎重に考えてから決断を下しました。バランスの取れた判断プロセスです。</p>';
    } else {
        tendencyText += '<p>あなたは深く熟考してから決断を下しました。倫理的な問題に真摯に向き合う姿勢が見られます。</p>';
    }

    // 選択パターンの分析
    const leftPercent = (leftChoices / scenarios.length * 100).toFixed(0);
    if (leftPercent > 70) {
        tendencyText += '<p>あなたの選択は一貫して左側に偏っています。特定の倫理的原則に従う傾向があるようです。</p>';
    } else if (leftPercent < 30) {
        tendencyText += '<p>あなたの選択は一貫して右側に偏っています。特定の倫理的原則に従う傾向があるようです。</p>';
    } else {
        tendencyText += '<p>あなたの選択は状況によって変化しています。文脈に応じて柔軟に判断するタイプのようです。</p>';
    }

    document.getElementById('tendency-analysis').innerHTML = tendencyText;

    // 全選択履歴の表示
    let historyHTML = '';
    gameState.choices.forEach((choice, index) => {
        historyHTML += `
            <div class="choice-history">
                <h4>シナリオ${index + 1}: ${choice.scenarioTitle}</h4>
                <p><strong>選択:</strong> ${choice.choiceTitle}</p>
                <p><strong>決定時間:</strong> ${choice.decisionTime}秒</p>
            </div>
        `;
    });
    document.getElementById('all-choices').innerHTML = historyHTML;
}

// ゲームのリセット
function resetGame() {
    gameState.currentScenarioIndex = 0;
    gameState.choices = [];
    gameState.decisionTimes = [];
    showScreen('start');
}

// ゲーム開始
function startGame() {
    showScreen('game');
    displayScenario(0);
}

// イベントリスナーの設定
buttons.start.addEventListener('click', startGame);
buttons.leftChoice.addEventListener('click', () => makeChoice('left'));
buttons.rightChoice.addEventListener('click', () => makeChoice('right'));
buttons.next.addEventListener('click', nextScenario);
buttons.restart.addEventListener('click', resetGame);

// キーボード操作のサポート
document.addEventListener('keydown', (e) => {
    if (screens.game.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            makeChoice('left');
        } else if (e.key === 'ArrowRight') {
            makeChoice('right');
        }
    }
});

// ページ読み込み時の初期化
window.addEventListener('load', () => {
    showScreen('start');
});
