document.addEventListener('DOMContentLoaded', function() {
  
  // --- CONFIGURATION (Unchanged) ---
  const roundRequirements = {
    '1': 16, '2': 8, '3': 4, '4': 2, '5': 1
  };

  const bracketContainer = document.querySelector('.prediction-tabs');
  if (!bracketContainer) return;

  // --- SELECTION LOGIC (Unchanged and working) ---
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
    updateProgress();
  });

  // --- 'NEXT ROUND' LOGIC (CORRECTED) ---
  $('#next-round-button').on('click', function() {
    var $bracketContainer = $('.prediction-tabs'); 
    var $currentRoundPane = $bracketContainer.find('.w-tab-pane.w--tab-active');
    
    // Step A: Get the current round number from the tab's index (0-based)
    var $tablinks = $bracketContainer.find('.w-tab-menu');
    var currentIndex = $tablinks.find('.w--current').index();
    var currentRoundNumber = currentIndex + 1; // Add 1 to make it 1-based (1, 2, 3...)
    
    // Step B: Get required winners from our configuration
    var requiredWinners = roundRequirements[currentRoundNumber];
    var actualWinners = $currentRoundPane.find('.list-group-item.is-winner');
    
    // Step C: Compare actual vs. required. This is the mandatory check.
    if (actualWinners.length < requiredWinners) {
      alert('Please select a winner for every matchup in this round.');
      return;
    }

    // Step D: Populate the next round
    var $nextRoundPane = $currentRoundPane.next('.w-tab-pane');
    var $nextRoundSlots = $nextRoundPane.find('.list-group-item');
    actualWinners.each(function(i) {
      var winner = $(this);
      var slot = $nextRoundSlots.eq(i);
      var logoClass = winner.attr('class').split(' ').find(c => c.startsWith('game-'));
      var oldLogoClass = slot.attr('class').split(' ').find(c => c.startsWith('game-'));
      if (oldLogoClass) slot.removeClass(oldLogoClass);
      slot.addClass(logoClass);
      slot.attr('data-id', winner.attr('data-id'));
    });

    // Step E: Switch to the next tab
    var nextIndex = currentIndex + 1;
    if (nextIndex < $tablinks.children().length) {
      $tablinks.find('.w-tab-link').eq(nextIndex).trigger('click');
    } else {
      alert('Bracket Complete!');
    }
    
    updateProgress();
  });

  // --- PROGRESS BAR FUNCTION (CORRECTED) ---
  function updateProgress() {
    var $bracketContainer = $('.prediction-tabs');
    var $tablinks = $bracketContainer.find('.w-tab-menu');
    var currentIndex = $tablinks.find('.w--current').index();
    var currentRoundNumber = currentIndex + 1;

    var $currentRoundPane = $bracketContainer.find('.w-tab-pane.w--tab-active');
    var requiredWinners = roundRequirements[currentRoundNumber];
    var selectedCount = $currentRoundPane.find('.list-group-item.is-winner').length;
    
    if (requiredWinners) {
        $bracketContainer.find('#progress-text').text(selectedCount + '/' + requiredWinners);
        $bracketContainer.find('#progress-bar').css('width', (selectedCount / requiredWinners) * 100 + '%');
    }
  }
  
  updateProgress();
});
