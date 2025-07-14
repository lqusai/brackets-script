document.addEventListener('DOMContentLoaded', function() {
  
  // --- CONFIGURATION ---
  const roundRequirements = { '1': 16, '2': 8, '3': 4, '4': 2, '5': 1 };
  const bracketContainer = document.querySelector('.prediction-tabs');
  const nextRoundButton = document.getElementById('next-round-button');

  if (!bracketContainer || !nextRoundButton) {
    return;
  }

  // --- A simpler function to update the progress bar UI ---
  function updateProgressBarUI(currentSelections, requiredSelections) {
    const textElement = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    
    if (requiredSelections && textElement && progressBar) {
      textElement.textContent = currentSelections + '/' + requiredSelections;
      progressBar.style.width = (currentSelections / requiredWinners) * 100 + '%';
    }
  }

  // --- The main function to calculate progress ---
  function calculateAndUpdateProgress() {
    const tabMenu = bracketContainer.querySelector('.w-tab-menu');
    const currentTabLink = tabMenu.querySelector('.w--current');
    if (!currentTabLink) return;

    const allTabLinks = Array.from(tabMenu.querySelectorAll('.w-tab-link'));
    const currentIndex = allTabLinks.indexOf(currentTabLink);
    const currentRoundNumber = currentIndex + 1;
    
    const currentRoundPane = bracketContainer.querySelector('.w-tab-pane.w--tab-active');
    const requiredWinners = roundRequirements[currentRoundNumber];
    const selectedCount = currentRoundPane.querySelectorAll('.list-group-item.is-winner').length;
    
    // Call the simple UI function with the calculated numbers
    updateProgressBarUI(selectedCount, requiredWinners);
  }

  // --- SELECTION LOGIC ---
  bracketContainer.addEventListener('click', function(event) {
    const clickedItem = event.target.closest('.list-group-item');
    if (!clickedItem) return;

    const parentMatchup = clickedItem.closest('.list-group');
    const competitorsInMatchup = parentMatchup.querySelectorAll('.list-group-item');
    let alreadySelected = clickedItem.classList.contains('is-winner');
    
    competitorsInMatchup.forEach(comp => comp.classList.remove('is-winner'));
    if (!alreadySelected) {
      clickedItem.classList.add('is-winner');
    }

    if (parentMatchup.querySelector('.is-winner')) {
      parentMatchup.classList.add('has-selection');
    } else {
      parentMatchup.classList.remove('has-selection');
    }
    
    // A tiny delay to let Webflow catch up before we calculate progress
    setTimeout(calculateAndUpdateProgress, 50);
  });

  // --- 'NEXT ROUND' LOGIC ---
  nextRoundButton.addEventListener('click', function() {
    const currentRoundPane = bracketContainer.querySelector('.w-tab-pane.w--tab-active');
    const tabMenu = bracketContainer.querySelector('.w-tab-menu');
    const currentTabLink = tabMenu.querySelector('.w--current');
    const allTabLinks = Array.from(tabMenu.querySelectorAll('.w-tab-link'));
    
    const currentIndex = allTabLinks.indexOf(currentTabLink);
    const currentRoundNumber = currentIndex + 1;
    
    const requiredWinners = roundRequirements[currentRoundNumber];
    const actualWinners = currentRoundPane.querySelectorAll('.list-group-item.is-winner');
    
    if (actualWinners.length < requiredWinners) {
      alert('Please select a winner for every matchup in this round.');
      return;
    }

    const nextRoundPane = currentRoundPane.nextElementSibling;
    const nextRoundSlots = nextRoundPane.querySelectorAll('.list-group-item');
    
    actualWinners.forEach((winner, i) => {
      const slot = nextRoundSlots[i];
      const logoClass = Array.from(winner.classList).find(c => c.startsWith('game-'));
      
      if (slot && logoClass) {
        const oldLogoClass = Array.from(slot.classList).find(c => c.startsWith('game-'));
        if (oldLogoClass) slot.classList.remove(oldLogoClass);
        slot.classList.add(logoClass);
        slot.setAttribute('data-id', winner.getAttribute('data-id'));
      }
    });

    const nextTabLink = allTabLinks[currentIndex + 1];
    if (nextTabLink) {
      nextTabLink.click();
      
      // A delay to allow the tab transition to complete before updating the progress bar for the new round.
      setTimeout(calculateAndUpdateProgress, 150);

    } else {
      alert('Bracket Complete!');
    }
  });
  
  // Initialize progress bar for the first round on page load
  setTimeout(calculateAndUpdateProgress, 100); // Initial delay for safety
});
