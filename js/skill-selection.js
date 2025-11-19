// 各ステップの名前とデータ
const steps = ["ブキ", "アタマ", "フク", "クツ"];
const skillDisplay = document.getElementById('selections-container');
let currentStepIndex = 0;
let userSelections = {};  // ユーザーの選択を保存
let previousSelection = null; // リセット前の選択を保存
let coolTime = 90000; // リセットボタンのクールタイム(ms)
let resetButtonDisabledUntil = Date.now() + coolTime; // リセットボタンの無効化管理

// スキル選択の初期化と実行
function initSkillSelection() {
  // 初期化
  loadPreviousSelections();
  initializeState();
  setInterval(updateResetButtonCountdown, 100);
  displayChoices();
}

// ページの読み込みが完了したら、ブキデータを取得してからスキル選択を開始
document.addEventListener('DOMContentLoaded', async () => {
  await fetchWeaponData();
  initSkillSelection();
});


// セッションストレージからステージ情報を読み込む
function initializeState() {
  // セッションストレージからデータを読み込む
  const savedSelections = sessionStorage.getItem('userSelections');
  const savedStepIndex = sessionStorage.getItem('currentStepIndex');
  const savedResetButtonDisabledUntil = sessionStorage.getItem('resetButtonDisabledUntil');

  if (savedSelections) {
    userSelections = JSON.parse(savedSelections);
  }

  if (savedStepIndex) {
    currentStepIndex = parseInt(savedStepIndex, 10); // 整数に変換
    currentStepIndex++;
  }

  if (savedResetButtonDisabledUntil) {
    resetButtonDisabledUntil = parseInt(savedResetButtonDisabledUntil, 10); // 整数に変換
  }

  updateSelectionsDisplay();

  // 全てのステップが選択されているか確認
  const allStepsCompleted = steps.every(step => userSelections[step]);
  if (allStepsCompleted) {
    // リセットボタンを有効化し、選択表示を隠す
    document.getElementById("reset-btn").style.display = 'block';
    document.getElementById("step").style.display = 'none';
    document.getElementById("choices").style.display = 'none';
  } else {
    // 現在のステップに応じて選択肢を表示
    displayChoices();
  }
}

function loadPreviousSelections() {
  const savedPreviousSelection = sessionStorage.getItem('previousSelection');
  if (savedPreviousSelection) {
    previousSelection = JSON.parse(savedPreviousSelection); // セッションストレージから取得
    updateSelectionsDisplay(); // リセット前の選択を表示
  }
}

// ランダムに3つの選択肢を生成
function getRandomChoices() {
  const currentStep = steps[currentStepIndex];
  const items = database[currentStep];

  // If the items are weapon objects, filter based on the name property
  if (currentStep === "ブキ") {
    const unselectedItems = items.filter(item => !Object.values(userSelections).includes(item.name));
    for (let i = unselectedItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unselectedItems[i], unselectedItems[j]] = [unselectedItems[j], unselectedItems[i]];
    }
    return unselectedItems.slice(0, 3);
  } else {
    // For other items (strings), filter directly
    const unselectedItems = items.filter(item => !Object.values(userSelections).includes(item));
    for (let i = unselectedItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unselectedItems[i], unselectedItems[j]] = [unselectedItems[j], unselectedItems[i]];
    }
    return unselectedItems.slice(0, 3);
  }
}

// 選択肢を表示
function displayChoices() {
  if (currentStepIndex < 4) {
    if (currentStepIndex < 0) {
      currentStepIndex = 0;
    }
    const currentStep = steps[currentStepIndex];
    document.getElementById("current-step").textContent = currentStep;

    let choices = [];
    // リロード時の復元
    const savedChoices = sessionStorage.getItem(`choices-${currentStep}`);
    if (savedChoices) {
      choices = JSON.parse(savedChoices);
    } else {
      // 新しい選択肢を生成
      choices = getRandomChoices();
      sessionStorage.setItem(`choices-${currentStep}`, JSON.stringify(choices));
    }

    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";  // リセット

    choices.forEach(choice => {
      const choiceDiv = document.createElement("div");
      choiceDiv.className = "choice-box bounce-in";

      if (currentStep === "ブキ") {
        choiceDiv.innerHTML = `
          <div class="weapon-name">${choice.name}</div>
          <div class="weapon-details">サブ: ${choice.sub}</div>
          <div class="weapon-details">スペシャル: ${choice.special}</div>
        `;
        choiceDiv.onclick = () => selectChoice(choiceDiv, choice.name);
      } else {
        choiceDiv.textContent = choice;
        choiceDiv.onclick = () => selectChoice(choiceDiv, choice);
      }

      choicesContainer.appendChild(choiceDiv);
      choicesContainer.querySelectorAll('.choice-box').forEach(box => {
        box.addEventListener('animationend', () => {
          box.classList.remove('bounce-in');
        });
      });
    });
  }
}

// 選択処理
function selectChoice(choiceDiv, choice) {
  const currentStep = steps[currentStepIndex];
  userSelections[currentStep] = choice;

  // セッションストレージに保存
  sessionStorage.setItem('userSelections', JSON.stringify(userSelections));
  sessionStorage.setItem('currentStepIndex', currentStepIndex);

  // 選択肢データを削除
  sessionStorage.removeItem(`choices-${currentStep}`);

  // 選択したスキルを表に追加
  updateSelectionsDisplay();

  document.querySelectorAll('.choice-box').forEach(box => {
    box.style.pointerEvents = "none";
  });

  // 選ばれていない選択肢にフェードアウトクラスを追加
  document.querySelectorAll('.choice-box').forEach(box => {
    if (box !== choiceDiv) {
      box.classList.add('fade-out');
    }
  });

  // 選ばれた選択肢にはスライドアウトアニメーションを適用
  choiceDiv.classList.add('slide-out');

  setTimeout(() => {
    choiceDiv.classList.remove('slide-out');


    // リセットボタンの無効化を管理
    if (currentStep === "クツ") {
      previousSelection = userSelections; // 現在の選択を保存
      resetButtonDisabledUntil = Date.now() + coolTime;
      sessionStorage.setItem('resetButtonDisabledUntil', resetButtonDisabledUntil);
      document.getElementById("reset-btn").disabled = true; // リセットボタンを無効化
      document.getElementById("reset-btn").style.display = 'block';
      document.getElementById("step").style.display = 'none';
      document.getElementById("choices").style.display = 'none';
      currentStepIndex++;
      setTimeout(() => {
        document.getElementById("reset-btn").disabled = false; // 120秒後にリセットボタンを有効化
      }, coolTime);
    }

    if (currentStepIndex < steps.length - 1) {
      currentStepIndex++;
      displayChoices();
    } else {
      alert("すべてのスキルを選択しました！\n" + JSON.stringify(userSelections, null, 2));
    }

    // フェードアウトした選択肢を非表示にする
    document.querySelectorAll('.choice-box.fade-out').forEach(box => {
      box.style.display = "none";
      box.classList.remove('fade-out'); // 次の選択に備えてクラスをリセット
    });

    // 選択肢がスライドアウトした後、すべてのchoice-boxを再度クリック可能にする
    document.querySelectorAll('.choice-box').forEach(box => {
      box.style.pointerEvents = "auto";
    });
  }, 250); // スライドアウトの時間に合わせて待機
}


// 選択したスキルを表示
function updateSelectionsDisplay() {
  const container = document.getElementById("selections-container");
  container.innerHTML = "";  // 以前の内容をクリア

  // 現在の選択スキルを表示
  let currentSection = document.createElement("div");
  currentSection.className = "section";
  currentSection.textContent = "現在の選択:";
  container.appendChild(currentSection);

  for (const step of steps) {
    const choice = userSelections[step] || "未選択";
    const skillDiv = document.createElement("div");
    skillDiv.className = "skill-display"; // 文字サイズを適用
    skillDiv.textContent = `${step}: ${choice}`;
    currentSection.appendChild(skillDiv);
  }

  // リセット前の選択スキルがあれば表示
  if (previousSelection) {
    let prevSection = document.createElement("div");
    prevSection.className = "section";
    prevSection.textContent = "リセット前の選択:";
    container.appendChild(prevSection);
    for (const step of steps) {
      const choice = previousSelection[step] || "未選択";
      const skillDiv = document.createElement("div");
      skillDiv.className = "skill-display"; // 文字サイズを適用
      skillDiv.textContent = `${step}: ${choice}`;
      prevSection.appendChild(skillDiv);
    }
  }
}

// リセット機能
document.getElementById("reset-btn").onclick = () => {
  const confirmReset = confirm("リセットしてもよろしいですか？選択内容がクリアされます。");
  if (confirmReset) {
    // 選択したスキルの表示を更新
    document.getElementById("reset-btn").disabled = true; // リセットボタンを無効化
    resetSelections();
    // メニューの表示状態をリセット
    const menu = document.querySelector('.nav-menu');
    menu.classList.remove('active');
  }
};

function updateResetButtonCountdown() {
  const remainingTime = Math.max(0, resetButtonDisabledUntil - Date.now());
  const resetButton = document.getElementById("reset-btn");
  if (remainingTime > coolTime) {
    resetButton.disabled = true;
    resetButton.textContent = `リセット`;
  } else if (remainingTime > 0) {
    resetButton.disabled = true;
    resetButton.textContent = `リセット (${Math.ceil(remainingTime / 1000)} 秒後に有効)`;
  } else {
    resetButton.disabled = false;
    resetButton.textContent = "リセット";
  }
}

function resetSelections() {
  // コンテナをスライドアウト
  const container = document.querySelector('.container');
  container.classList.add('slide-out');

  // スライドアウトが終わるまで待機
  setTimeout(() => {
    document.getElementById("reset-btn").style.display = 'none';
    currentStepIndex = -1;
    previousSelection = userSelections; // リセット時に前の選択を保持
    sessionStorage.setItem('previousSelection', JSON.stringify(previousSelection)); // セッションストレージに保存
    userSelections = {};  // ユーザーの選択をクリア
    // 現在の選択肢データをすべて削除
    steps.forEach(step => {
      sessionStorage.removeItem(`choices-${step}`);
    });
    // セッションストレージも更新
    sessionStorage.setItem('userSelections', JSON.stringify(userSelections));
    sessionStorage.setItem('currentStepIndex', currentStepIndex);
    displayChoices();
    document.getElementById("step").style.display = 'block';
    document.getElementById("choices").style.display = 'block';
    updateSelectionsDisplay();
    container.classList.add('bounce-in');
  }, 250); // スライドアウトの時間に合わせて待機

  container.classList.remove('slide-out');
  container.classList.remove('bounce-in');
}
