document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const NUM_PLAYERS_TO_INPUT = 10;

  // DOM References
  const playerInputsContainer = document.getElementById('player-inputs');
  const assignTeamsButton = document.getElementById('assignTeamsButton');
  const team1List = document.getElementById('team1-list');
  const team2List = document.getElementById('team2-list');
  const spectatorsList = document.getElementById('spectators-list');

  /**
   * Saves the current player names from input fields to session storage.
   */
  function saveNamesToSessionStorage() {
    if (!playerInputsContainer) {
      // This check might be redundant if createPlayerInputs ensures it exists
      // but good for safety if called from elsewhere.
      console.error('Error: Player inputs container not found for saving to session storage!');
      return;
    }
    const inputElements = playerInputsContainer.getElementsByTagName('input');
    const namesArray = [];
    for (let i = 0; i < inputElements.length; i++) {
      namesArray.push(inputElements[i].value); // Store even empty strings to preserve order and count
    }
    sessionStorage.setItem('teamAssignmentPlayerNames', JSON.stringify(namesArray));
  }

  /**
   * Creates and appends player input fields to the DOM.
   */
  function createPlayerInputs() {
    if (!playerInputsContainer) {
      console.error('Error: Player inputs container not found!');
      return;
    }
    for (let i = 0; i < NUM_PLAYERS_TO_INPUT; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `プレイヤー ${i + 1}`;
      input.id = `player-name-${i + 1}`; // Unique ID for each input
      input.style.display = 'block'; // Basic styling for separation
      input.style.marginBottom = '5px'; // Basic styling for separation
      
      // Add event listener to save names on input
      input.addEventListener('input', saveNamesToSessionStorage);
      
      playerInputsContainer.appendChild(input);
    }
    // After creating inputs, load any saved names
    loadNamesFromSessionStorage();
  }

  /**
   * Loads player names from session storage and populates the input fields.
   */
  function loadNamesFromSessionStorage() {
    const savedNamesString = sessionStorage.getItem('teamAssignmentPlayerNames');
    if (savedNamesString) {
      try {
        const savedNames = JSON.parse(savedNamesString);
        if (Array.isArray(savedNames) && playerInputsContainer) {
          const inputElements = playerInputsContainer.getElementsByTagName('input');
          for (let i = 0; i < inputElements.length; i++) {
            if (savedNames[i] !== undefined && savedNames[i] !== null) {
              inputElements[i].value = savedNames[i];
            }
          }
        }
      } catch (e) {
        console.error('Error parsing saved player names from session storage:', e);
      }
    }
  }

  /**
   * Shuffles an array in place using the Fisher-Yates algorithm.
   * @param {Array} array - The array to shuffle.
   */
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // ES6 destructuring swap
    }
  }

  /**
   * Handles the team assignment logic when the button is clicked.
   */
  function handleTeamAssignment() {
    if (!playerInputsContainer || !team1List || !team2List || !spectatorsList) {
      console.error('Error: One or more DOM elements for team assignment are missing!');
      return;
    }

    // Get Player Names
    const inputElements = playerInputsContainer.getElementsByTagName('input');
    const playerNames = [];
    for (let i = 0; i < inputElements.length; i++) {
      const name = inputElements[i].value.trim();
      if (name) { // Only add non-empty names
        playerNames.push(name);
      }
    }

    // Validate Player Count
    if (playerNames.length < 8) {
      alert('少なくとも8名のプレイヤー名を入力してください。\n(Please enter at least 8 player names.)');
      return;
    }
     if (playerNames.length > NUM_PLAYERS_TO_INPUT) {
      alert(`プレイヤー名の入力は最大${NUM_PLAYERS_TO_INPUT}名までです。\n(Maximum of ${NUM_PLAYERS_TO_INPUT} player names can be entered.)`);
      return;
    }


    // Shuffle Players
    shuffleArray(playerNames);

    // Assign to Teams and Spectators
    // Clear previous results
    team1List.innerHTML = '';
    team2List.innerHTML = '';
    spectatorsList.innerHTML = '';

    const team1Players = playerNames.slice(0, 4);
    const team2Players = playerNames.slice(4, 8);
    const spectatorPlayers = playerNames.slice(8);

    // Display Results
    team1Players.forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      team1List.appendChild(li);
    });

    team2Players.forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      team2List.appendChild(li);
    });

    if (spectatorPlayers.length > 0) {
      spectatorPlayers.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        spectatorsList.appendChild(li);
      });
    } else {
      // Optional: Indicate if there are no spectators
      const li = document.createElement('li');
      li.textContent = 'なし'; // "None"
      // Or, hide the "観戦" h3 if desired via CSS or JS
      spectatorsList.appendChild(li);
    }
  }

  // Event Listener for Assign Teams Button
  if (assignTeamsButton) {
    assignTeamsButton.addEventListener('click', handleTeamAssignment);
  } else {
    console.error('Error: Assign teams button not found!');
  }

  // Initial Call to generate input fields
  createPlayerInputs();
});
