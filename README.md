# 🚣‍♂️ 農夫過河 - Farmer Crossing Game

一個經典的邏輯益智遊戲，使用現代化的網頁技術重新打造。幫助農夫將所有物品安全地運送到河的對岸！

## 🎮 線上遊玩

**[點擊這裡開始遊戲](https://peliter.github.io/farmer-crossing-game)**

## 📖 遊戲介紹

### 🎯 遊戲目標
幫助農夫將一隻老虎🐅、一隻羊🐑、一條蛇🐍、一隻雞🐔和一筐蘋果🍎從河的左岸安全運送到右岸。

### 🎮 操作方式
- **點擊物品**：將物品移上船或從船上移下來
- **點擊「過河」按鈕**：農夫划船到對岸
- **點擊「重置」按鈕**：重新開始遊戲

### 📋 遊戲規則
1. 🚤 農夫的船一次只能載農夫和一樣東西過河
2. 🐅 農夫不在時，老虎會吃羊（雞在場可阻止）
3. 🐍 農夫不在時，蛇會吃雞（老虎在場可阻止）
4. 🐑 農夫不在時，羊會吃蘋果（蛇在場可阻止）

### 🎊 特殊功能
- 📝 **操作記錄**：追蹤每一步的移動
- 💡 **解答提示**：輸入 Konami Code（↑↑↓↓←→←→BA）獲得解答
- 🎨 **現代化 UI**：響應式設計，支援各種裝置

## 🛠️ 技術特色

### 前端技術
- **HTML5**：語義化標籤，無障礙設計
- **CSS3**：
  - Flexbox 佈局
  - CSS Grid
  - 動畫效果（keyframes）
  - 響應式設計
  - 現代化漸層和陰影
- **JavaScript (ES6+)**：
  - 模組化程式設計
  - 事件驅動架構
  - 狀態管理
  - DOM 操作

### 設計特點
- 🎨 **現代化 UI**：玻璃擬態設計風格
- 📱 **響應式設計**：支援桌面、平板、手機
- ⚡ **流暢動畫**：CSS 動畫和過渡效果
- 🎯 **使用者體驗**：直觀的操作介面

## 📁 專案結構

```
farmer-crossing-game/
├── index.html          # 主頁面
├── style.css           # 樣式表
├── script.js           # 遊戲邏輯
├── INSTRUCTIONS.md     # 詳細操作說明
├── QA.md              # 測試文件
├── task.md            # 開發任務清單
└── README.md          # 專案說明
```

## 🚀 本地開發

### 環境需求
- 現代瀏覽器（Chrome, Firefox, Safari, Edge）
- 本地伺服器（可選，用於開發）

### 快速開始
1. **克隆專案**
   ```bash
   git clone https://github.com/peliter/farmer-crossing-game.git
   cd farmer-crossing-game
   ```

2. **開啟遊戲**
   - 直接開啟 `index.html`
   - 或使用本地伺服器：
     ```bash
     # 使用 Python
     python -m http.server 8000
     
     # 使用 Node.js
     npx serve .
     ```

3. **在瀏覽器中訪問**
   ```
   http://localhost:8000
   ```

## 🎮 遊戲攻略

### 💡 解題思路
這是一個經典的邏輯推理問題，關鍵在於：
1. 理解每個物品之間的制約關係
2. 善用「保護者」機制（雞保護羊、老虎保護雞、蛇保護蘋果）
3. 合理安排運送順序

### 🏆 最佳解法
遊戲內建 Konami Code 彩蛋，可以觀看最佳解法演示！

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

### 開發指南
1. Fork 這個專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 👨‍💻 作者

**Peliter Hsu**
- GitHub: [@peliter](https://github.com/peliter) w/ AI

## 🙏 致謝

- 感謝經典的「農夫過河」邏輯謎題提供靈感
- 使用了現代化的網頁技術打造全新體驗

---

⭐ 如果這個專案對您有幫助，請給個星星支持！
