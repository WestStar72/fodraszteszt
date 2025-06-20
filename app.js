
const slotsContainer = document.getElementById("slots");
const form = document.getElementById("bookingForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const styleInput = document.getElementById("style");
const selectedTimeInput = document.getElementById("selectedTime");

let foglalasok = [];

// Időpontok generálása
function generateSlots() {
  for (let hour = 8; hour < 16; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const time = ("0" + hour).slice(-2) + ":" + ("0" + min).slice(-2);
      const div = document.createElement("div");
      div.className = "slot";
      div.innerHTML = `<span>${time}</span><button onclick="selectTime('${time}')">Foglalás</button>`;
      div.id = "slot-" + time.replace(":", "");
      slotsContainer.appendChild(div);
    }
  }
}

// Meglévő foglalások betöltése
async function loadFoglalasok() {
  try {
    const res = await fetch("foglalasok.json");
    foglalasok = await res.json();
    foglalasok.forEach(f => markAsBooked(f.slot));
  } catch (e) {
    console.log("Nincs foglalás adat fájl.", e);
  }
}

function markAsBooked(time) {
  const slotDiv = document.getElementById("slot-" + time.replace(":", ""));
  if (slotDiv) {
    slotDiv.classList.add("foglalt");
    slotDiv.innerHTML = `<span>${time} - FOGLALT</span>`;
  }
}

function selectTime(time) {
  if (foglalasok.find(f => f.slot === time)) return;
  selectedTimeInput.value = time;
  form.classList.remove("hidden");
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const foglalas = {
    name: nameInput.value,
    phone: phoneInput.value,
    style: styleInput.value,
    slot: selectedTimeInput.value
  };
  foglalasok.push(foglalas);
  markAsBooked(foglalas.slot);
  form.reset();
  form.classList.add("hidden");
  alert("Foglalás mentve (helyileg). Ha valós mentés kell, szólj!");
});

generateSlots();
loadFoglalasok();
