↑押さないで！
# 3択ロースの皆さんのより良い選択を！
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>スキル選択</title>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: auto; padding: 20px; }
    .choice-box { margin: 10px 0; padding: 10px; border: 1px solid #ccc; cursor: pointer; }
    #reset-btn { margin-top: 20px; padding: 10px 20px; }
    table { margin-top: 20px; border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 10px; text-align: center; }
    th { background-color: #f2f2f2; }
    .section { margin-top: 20px; }
    .skill-display { font-size: 1.2em; } /* 文字サイズを大きく */
  </style>
</head>
<body>
  <div class="container">
    <h1>スキル選択</h1>
    <div id="step">現在のステップ：<span id="current-step">ブキ</span></div>
    <div id="choices"></div>
    <button id="reset-btn" disabled>リセット</button> <!-- 初期は無効化 -->

    <h2>選んだスキル</h2>
    <div id="selections-container"></div>
  </div>

  <script>
    // 各ステップの名前とデータ
    const steps = ["ブキ", "アタマ", "フク", "クツ"];
    let currentStepIndex = 0;
    let userSelections = {};  // ユーザーの選択を保存
    let previousSelection = null; // リセット前の選択を保存
    let resetButtonDisabledUntil = null; // リセットボタンの無効化管理
    let canReset = false; // リセットボタンが押せるかどうかを管理

    // ダミーデータ（データベースから取得したものと仮定）
    const database = {
      "ブキ": [
        "ボールドマーカー", "ボールドマーカーネオ", "わかばシューター", "もみじシューター", "シャープマーカー", "シャープマーカーネオ", 
        "プロモデラーMG", "プロモデラーRG", "スプラシューター", "スプラシューターコラボ", "52ガロン", "52ガロンデコ", "N-ZAP85", 
        "N-ZAP89", "プライムシューター", "プライムシューターコラボ", "96ガロン", "96ガロンデコ", "ジェットスイーパー", "ジェットスイーパーカスタム", 
        "スペースシューター", "スペースシューターコラボ", "L3リールガン", "L3リールガンD", "H3リールガン", "H3リールガンD", 
        "ボトルガイザー", "ボトルガイザーフォイル", "カーボンローラー", "カーボンローラーデコ", "スプラローラー", "スプラローラーコラボ", 
        "ダイナモローラー", "ダイナモローラーテスラ", "ヴァリアブルローラー", "ヴァリアブルローラーフォイル", "ワイドローラー", "ワイドローラーコラボ", 
        "スクイックリンα", "スクイックリンβ", "スプラチャージャー", "スプラチャージャーコラボ", "スプラスコープ", "スプラスコープコラボ", 
        "リッター4K", "リッター4Kカスタム", "4Kスコープ", "4Kスコープカスタム", "14式竹筒銃・甲", "14式竹筒銃・乙", "ソイチューバー", 
        "ソイチューバーカスタム", "R-PEN/5H", "R-PEN/5B", "バケットスロッシャー", "バケットスロッシャーデコ", "ヒッセン", "ヒッセン・ヒュー", 
        "スクリュースロッシャー", "スクリュースロッシャーネオ", "オーバーフロッシャー", "オーバーフロッシャーデコ", "エクスプロッシャー", 
        "エクスプロッシャーカスタム", "モップリン", "モップリンD", "スプラスピナー", "スプラスピナーコラボ", "バレルスピナー", 
        "バレルスピナーデコ", "ハイドラント", "ハイドラントカスタム", "クーゲルシュライバー", "クーゲルシュライバー・ヒュー", "ノーチラス47", 
        "ノーチラス79", "イグザミナー", "イグザミナー・ヒュー", "スパッタリー", "スパッタリー・ヒュー", "スプラマニューバー", 
        "スプラマニューバーコラボ", "ケルビン525", "ケルビン525デコ", "デュアルスイーパー", "デュアルスイーパーカスタム", 
        "クアッドホッパーブラック", "クアッドホッパーホワイト", "ガエンFF", "ガエンFFカスタム", "パラシェルター", "パラシェルターソレーラ", 
        "キャンピングシェルター", "キャンピングシェルターソレーラ", "スパイガジェット", "スパイガジェットソレーラ", "24式張替傘・甲", 
        "24式張替傘・乙", "ノヴァブラスター", "ノヴァブラスターネオ", "ホットブラスター", "ロングブラスター", "ロングブラスターカスタム", 
        "クラッシュブラスター", "クラッシュブラスターネオ", "ラピッドブラスター", "ラピッドブラスターデコ", "Rブラスターエリート", 
        "Rブラスターエリートデコ", "S-BLAST92", "S-BLAST91", "パブロ", "パブロ・ヒュー", "ホクサイ", "ホクサイ・ヒュー", 
        "フィンセント", "フィンセント・ヒュー", "トライストリンガー", "トライストリンガーコラボ", "オーダーストリンガー", "LACT-450", 
        "LACT-450デコ", "フルイドV", "フルイドVカスタム", "ジムワイパー", "ジムワイパー・ヒュー", "ドライブワイパー", 
        "ドライブワイパーデコ", "デンタルワイパーミント", "デンタルワイパースミ"
      ],
      "アタマ": [
        "インク効率アップ", "インク回復力アップ", "ヒト移動速度アップ", "イカダッシュ速度アップ", "スペシャル増加量アップ", 
        "スペシャル減少量ダウン", "スペシャル性能アップ", "復活時間短縮", "スーパージャンプ時間短縮", "サブ性能アップ", "相手インク影響軽減", 
        "サブ影響軽減", "アクション強化", "スタートダッシュ", "ラストスパート", "逆境強化", "カムバック"
      ],
      "フク": [
        "インク効率アップ", "インク回復力アップ", "ヒト移動速度アップ", "イカダッシュ速度アップ", "スペシャル増加量アップ", 
        "スペシャル減少量ダウン", "スペシャル性能アップ", "復活時間短縮", "スーパージャンプ時間短縮", "サブ性能アップ", "相手インク影響軽減", 
        "サブ影響軽減", "アクション強化", "イカニンジャ", "リベンジ", "サーマルインク", "復活ペナルティアップ"
      ],
      "クツ": [
        "インク効率アップ", "インク回復力アップ", "ヒト移動速度アップ", "イカダッシュ速度アップ", "スペシャル増加量アップ", 
        "スペシャル減少量ダウン", "スペシャル性能アップ", "復活時間短縮", "スーパージャンプ時間短縮", "サブ性能アップ", "相手インク影響軽減", 
        "サブ影響軽減", "アクション強化", "ステルスジャンプ", "対物攻撃力アップ", "受身術"
      ]
    };


    // ランダムに3つの選択肢を生成
    function getRandomChoices() {
      const currentStep = steps[currentStepIndex];
      const items = database[currentStep];
      return items.filter(item => !userSelections[currentStep]?.includes(item)) // 選ばれたものを除外
                   .sort(() => 0.5 - Math.random())
                   .slice(0, 3);
    }

    // 選択肢を表示
    function displayChoices() {
      const currentStep = steps[currentStepIndex];
      document.getElementById("current-step").textContent = currentStep;
      const choices = getRandomChoices();

      const choicesContainer = document.getElementById("choices");
      choicesContainer.innerHTML = "";  // リセット

      choices.forEach(choice => {
        const choiceDiv = document.createElement("div");
        choiceDiv.className = "choice-box";
        choiceDiv.textContent = choice;
        choiceDiv.onclick = () => selectChoice(choice);
        choicesContainer.appendChild(choiceDiv);
      });
    }

    // 選択処理
    function selectChoice(choice) {
      const currentStep = steps[currentStepIndex];
      userSelections[currentStep] = choice;

      // 選択したスキルを表に追加
      updateSelectionsDisplay();

      // リセットボタンの無効化を管理
      if (currentStep === "クツ") {
        previousSelection = userSelections; // 現在の選択を保存
        resetButtonDisabledUntil = Date.now() + 120000; // 120秒後
        canReset = true; // リセットボタンを押せるようにする
        document.getElementById("reset-btn").disabled = true; // リセットボタンを無効化
        setTimeout(() => {
          document.getElementById("reset-btn").disabled = false; // 120秒後にリセットボタンを有効化
        }, 120000);
      }

      if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        displayChoices();
      } else {
        alert("すべてのスキルを選択しました！\n" + JSON.stringify(userSelections, null, 2));
      }
    }

    // 選択したスキルを表示
    function updateSelectionsDisplay() {
      const container = document.getElementById("selections-container");
      container.innerHTML = "";  // 以前の内容をクリア

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
    }

    // リセット機能
    document.getElementById("reset-btn").onclick = () => {
      const confirmReset = confirm("リセットしてもよろしいですか？選択内容がクリアされます。");
      if (confirmReset) {
        currentStepIndex = 0;
        userSelections = {};  // ユーザーの選択をクリア
        displayChoices();
        // 選択したスキルの表示を更新
        updateSelectionsDisplay();
        previousSelection = previousSelection; // リセット時に前の選択を保持
        canReset = false; // リセットボタンが押せるかどうかを無効化
        document.getElementById("reset-btn").disabled = true; // リセットボタンを無効化
      }
    };

    // 初期化
    displayChoices();
  </script>
</body>
</html>
