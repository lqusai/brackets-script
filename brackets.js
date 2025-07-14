document.addEventListener('DOMContentLoaded', function() {
  
  const roundRequirements = { '1': 16, '2': 8, '3': 4, '4': 2, '5': 1 };
  const bracketContainer = document.querySelector('.prediction-tabs');
  if (!bracketContainer) {
    console.error("Error: Could not find '.prediction-tabs' container on page load.");
    return;
  }

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

  $('#next-round-button').on('click', function() {
    // This try...catch block will find any hidden errors for us.
    try {
      console.log("Next Round button clicked. Starting check...");

      var $bracketContainer = $('.prediction-tabs');
      var $currentRoundPane = $bracketContainer.find('.w-tab-pane.w--tab-active');
      if (!$currentRoundPane.length) {
          console.error("Check failed: Could not find active tab pane.");
          return;
      }

      var roundContainer = $currentRoundPane.closest('[data-round]');
      if (!roundContainer.length) {
          console.error("Check failed: Could not find parent with [data-round] attribute.");
          return;
      }

      var currentRoundNumber = roundContainer.attr('data-round');
      var requiredWinners = roundRequirements[currentRoundNumber];
      var actualWinners = $currentRoundPane.find('.list-group-item.is-winner');

      console.log(`Round ${currentRoundNumber}: Found ${actualWinners.length} selections. Need ${requiredWinners}.`);

      if (actualWinners.length < requiredWinners) {
        alert('Please select a winner for every matchup in this round.');
        console.log("Check complete: Validation failed, alert shown.");
        return;
      }

      console.log("Check complete: Validation passed. Advancing to next round.");

      var $nextRoundPane = $currentRoundPane.next('.w-tab-pane');
      var $tablinks = $bracketContainer.find('.w-tab-menu');
      var currentIndex = $tablinks.find('.w--current').index();
      var nextIndex = currentIndex + 1;
      
      if (nextIndex < $tablinks.children().length) {
        $tablinks.find('.w-tab-link').eq(nextIndex).trigger('click');
      } else {
        alert('Bracket Complete!');
      }
      
      updateProgress();

    } catch (error) {
      // If any part of the above code fails, this will catch it.
      console.error("CRITICAL SCRIPT ERROR: The 'Next Round' button script failed. Details below:");
      console.error(error);
      alert("A script error occurred. Please check the developer console for details.");
    }
  });

  function updateProgress() {
    try {
        var $bracketContainer = $('.prediction-tabs');
        var $currentRoundPane = $bracketContainer.find('.w-tab-pane.w--tab-active');
        var roundContainer = $currentRoundPane.closest('[data-round]');
        if (!roundContainer.length) return;
        var currentRoundNumber = roundContainer.attr('data-round');
        var requiredWinners = roundRequirements[currentRoundNumber];
        var selectedCount = $currentRoundPane.find('.list-group-item.is-winner').length;
        $bracketContainer.find('#progress-text').text(selectedCount + '/' + requiredWinners);
        $bracketContainer.find('#progress-bar').css('width', (selectedCount / requiredWinners) * 100 + '%');
    } catch (e) {
        // Silently fail progress bar update if something is wrong
    }
  }
  updateProgress();
});
