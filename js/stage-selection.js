let randomButtonDisabledUntil = Date.now(); // ランダムボタンの無効化管理
const randomButton = document.getElementById('random-button');
const stageDisplay = document.getElementById('stage-display');
const cooldownTime = 270000; // 5秒

// ページ読み込み時にセッションストレージからデータを表示
loadStages();
initializeState();
// ボタンのクールダウン
updateButtonCooldown();
randomButton.addEventListener('click', selectRandomStages);

// セッションストレージからステージ情報を読み込む
function loadStages() {
  const savedStages = sessionStorage.getItem('selectedStages');
  if (savedStages) {
    const parsedStages = JSON.parse(savedStages);
    stageDisplay.innerHTML = `
      <p>1試合目: ${parsedStages[0]}</p>
      <p>2試合目: ${parsedStages[1]}</p>
      <p>3試合目: ${parsedStages[2]}</p>
    `;
  }
}

// セッションストレージからステージ情報を読み込む
function initializeState() {
  // セッションストレージからデータを読み込む
  const savedRandomButtonDisabledUntil = sessionStorage.getItem('randomButtonDisabledUntil');

  if (savedRandomButtonDisabledUntil) {
    randomButtonDisabledUntil = parseInt(savedRandomButtonDisabledUntil, 10); // 整数に変換
  }
}

// ステージをランダム選択し、セッションストレージに保存
function selectRandomStages() {
  let selectedStages = [];
  while (selectedStages.length < 3) {
    const randomStage = stages[Math.floor(Math.random() * stages.length)];
    if (!selectedStages.includes(randomStage)) {
      selectedStages.push(randomStage);
    }
  }

  // 表示を更新
  stageDisplay.innerHTML = `
    <p>1試合目: ${selectedStages[0]}</p>
    <p>2試合目: ${selectedStages[1]}</p>
    <p>3試合目: ${selectedStages[2]}</p>
  `;

  // セッションストレージに保存
  sessionStorage.setItem('selectedStages', JSON.stringify(selectedStages));

  randomButtonDisabledUntil = Date.now() + cooldownTime;
  sessionStorage.setItem('randomButtonDisabledUntil', randomButtonDisabledUntil);

  // ボタンの状態を更新
  updateButtonCooldown();
}

// ボタンをクールダウン中に無効化
function updateButtonCooldown() {
  randomButton.disabled = true;

  const interval = setInterval(() => {
    let seconds = Math.ceil((randomButtonDisabledUntil - Date.now()) / 1000);
    if (seconds > 0) {
      randomButton.disabled = true;
      randomButton.textContent = `再選択可能まで ${seconds} 秒`;
    } else {
      clearInterval(interval);
      randomButton.disabled = false;
      randomButton.textContent = 'ランダムステージ選択';
    }
  }, 100);
}
