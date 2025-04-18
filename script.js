function autoFormatDate(input) {
  let value = input.value.replace(/\D/g, '').slice(0, 8);

  if (value.length >= 2 && value.length < 4) {
    input.value = value.slice(0, 2) + ' ' + value.slice(2);
  } else if (value.length >= 4 && value.length < 6) {
    input.value = value.slice(0, 2) + ' ' + value.slice(2, 4) + ' ' + value.slice(4);
  } else if (value.length >= 6) {
    input.value = value.slice(0, 2) + ' ' + value.slice(2, 4) + ' ' + value.slice(4, 8);
  } else {
    input.value = value;
  }

  if (value.length === 8) {
    const dateParts = value.match(/(\d{2})(\d{2})(\d{4})/);
    if (dateParts) {
      input.dataset.originalValue = `${dateParts[3]}-${dateParts[2]}-${dateParts[1]}`;
    }

    const nextId = input.dataset.next;
    if (nextId) {
      const nextInput = document.getElementById(nextId);
      if (nextInput) nextInput.focus();
    }

    // Always calculate, no exception
    calculateAge();
  }
}

function formatDate(input) {
  const dateParts = input.value.match(/(\d{2})[ .\/-]?(\d{2})[ .\/-]?(\d{4})/);
  if (dateParts) {
    input.dataset.originalValue = `${dateParts[3]}-${dateParts[2]}-${dateParts[1]}`;
  }
}

function handleBackspace(e, input) {
  if (e.key !== "Backspace") return;

  const cursorPos = input.selectionStart;
  const value = input.value;
  const units = value.split(" ");
  const positions = [0, 3, 6]; // start positions for day, month, year

  // Jump to previous input if current is completely empty
  if (value.length === 0 && input.id !== "birthdate") {
    const currentGroup = input.closest(".input-group");
    const prevGroup = currentGroup?.previousElementSibling;
    const prevInput = prevGroup?.querySelector("input");

    if (prevInput) {
      prevInput.focus();
      prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
      e.preventDefault();
    }
    return;
  }

  let unitIndex = -1;
  for (let i = 0; i < positions.length; i++) {
    if (cursorPos > positions[i] && (i === positions.length - 1 || cursorPos <= positions[i + 1])) {
      unitIndex = i;
      break;
    }
  }

  if (unitIndex >= 0 && units[unitIndex]) {
    const offset = positions[unitIndex];
    if (cursorPos === offset || units[unitIndex].length === 0) {
      if (unitIndex > 0) {
        units[unitIndex - 1] = "";
        input.value = units.map((u, i) => (i === 2 ? u : u.padEnd(2, " "))).join(" ").trim();
        const pos = positions[unitIndex - 1];
        input.setSelectionRange(pos, pos);
        e.preventDefault();
      } else if (input.id !== "birthdate") {
        const currentGroup = input.closest(".input-group");
        const prevGroup = currentGroup?.previousElementSibling;
        const prevInput = prevGroup?.querySelector("input");

        if (prevInput) {
          prevInput.focus();
          prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
          e.preventDefault();
        }
      }
    } else {
      units[unitIndex] = "";
      input.value = units.map((u, i) => (i === 2 ? u : u.padEnd(2, " "))).join(" ").trim();
      const pos = positions[unitIndex];
      input.setSelectionRange(pos, pos);
      e.preventDefault();
    }
  }
}

function calculateAge() {
  const birthdate = new Date(document.getElementById("birthdate").dataset.originalValue);
  const viimane = new Date(document.getElementById("viimane").dataset.originalValue);
  const tev = new Date(document.getElementById("tev").dataset.originalValue);
  const esimene = new Date(document.getElementById("esimene").dataset.originalValue);

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (isNaN(birthdate)) {
    resultDiv.textContent = "Palun sisestage sünniaeg.";
    return;
  }

  if (viimane && !isNaN(viimane)) {
    resultDiv.innerHTML += `<p>Viimane karistus: ${getDifference(birthdate, viimane)}</p>`;
  }

  if (tev && !isNaN(tev)) {
    resultDiv.innerHTML += `<br><p>Tingimisi vabaks: ${getDifference(birthdate, tev)}</p>`;
  }

  if (esimene && !isNaN(esimene)) {
    resultDiv.innerHTML += `<br><p>Esimene kokkupuude: ${getDifference(birthdate, esimene)}</p>`;
  }
}

function getDifference(startDate, endDate) {
  const diffTime = endDate - startDate;
  if (diffTime < 0) return "kuupäev on enne sünniaega";

  const diffDate = new Date(diffTime);
  const years = diffDate.getUTCFullYear() - 1970;
  const months = diffDate.getUTCMonth();
  const days = diffDate.getUTCDate() - 1;

  return `<br>${years} aasta, ${months} kuu, ${days} päeva vanuselt`;
}
