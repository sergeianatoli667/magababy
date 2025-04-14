const countdownElement = document.getElementById('countdown');

let timeRemaining = {
  years: 2,
  days: 23,
  hours: 10,
  minutes: 15,
  seconds: 43
};

function updateCountdown() {
  if (
    timeRemaining.seconds === 0 &&
    timeRemaining.minutes === 0 &&
    timeRemaining.hours === 0 &&
    timeRemaining.days === 0 &&
    timeRemaining.years === 0
  ) {
    clearInterval(countdownInterval);
  } else {
    if (timeRemaining.seconds > 0) {
      timeRemaining.seconds--;
    } else {
      timeRemaining.seconds = 59;
      if (timeRemaining.minutes > 0) {
        timeRemaining.minutes--;
      } else {
        timeRemaining.minutes = 59;
        if (timeRemaining.hours > 0) {
          timeRemaining.hours--;
        } else {
          timeRemaining.hours = 23;
          if (timeRemaining.days > 0) {
            timeRemaining.days--;
          } else {
            timeRemaining.days = 29;
            timeRemaining.years--;
          }
        }
      }
    }
  }

  countdownElement.innerHTML = `
    <div class="time-block"><div class="number">${timeRemaining.years}</div><div class="unit">Y</div></div>
    <div class="time-block"><div class="number">${timeRemaining.days}</div><div class="unit">D</div></div>
    <div class="time-block"><div class="number">${timeRemaining.hours}</div><div class="unit">H</div></div>
    <div class="time-block"><div class="number">${timeRemaining.minutes}</div><div class="unit">M</div></div>
    <div class="time-block"><div class="number">${timeRemaining.seconds}</div><div class="unit">S</div></div>
  `;
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();
