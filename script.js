// Stap 1-elementen
let kilometers;
const step1Form = document.getElementById('step1');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const pickupInput = document.getElementById('pickup');
const dropoffInput = document.getElementById('dropoff');
const distanceText = document.getElementById('distance');
const durationText = document.getElementById('duration');
const locationText = document.querySelector('.use-location');

// Stap 2-elementen
const step2Form = document.getElementById('step2');
const economyRadio = document.getElementById('economy');
const luxuryRadio = document.getElementById('luxury');
const vanRadio = document.getElementById('van');

const economyPrice = document.getElementById('economy-price');
const luxuryPrice = document.getElementById('luxury-price');
const vanPrice = document.getElementById('van-price');

// Prijs per kilometer voor elke auto
const economyPricePerKm = 1.60;
const luxuryPricePerKm = 2.60;
const vanPricePerKm = 4.50;


// Get references to the select buttons
// Get references to the select buttons
const selectButtons = document.querySelectorAll(".select-button");


let selectedButton = null;

// Voeg een klikgebeurtenisluisteraar toe aan elke knop
selectButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    // Controleer of een andere knop al is geselecteerd
    if (selectedButton) {
      // Verander de tekst van de vorige geselecteerde knop naar "Select"
      selectedButton.textContent = "Select";
    }
    
    // Verander de tekst van de huidige knop naar "Selected"
    button.textContent = "Selected";
    
    // Houd de geselecteerde knop bij
    selectedButton = button;
  });
});


// Add click event listeners to the select buttons
selectButtons.forEach(button => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const carType = button.parentNode.querySelector("span").textContent;
    selectCarType(carType);
  });
});

function selectCarType(carType) {
  // Remove the active class from all car types
  const carTypes = document.querySelectorAll(".car-type");
  carTypes.forEach(car => {
    car.classList.remove("active");
  });

  // Add the active class to the selected car type
  const selectedCar = Array.from(carTypes).find(car => car.querySelector("span").textContent === carType);
  if (selectedCar) {
    selectedCar.classList.add("active");

    // Update the selected car type in the UI or perform any other necessary actions
    // ...
  }
}

var input = document.querySelector("#phone");
var iti = window.intlTelInput(input, {
  initialCountry: "nl",
  separateDialCode: true,
});

// JavaScript
const dateInput = document.getElementById('date');
const returnDateInput = document.getElementById('return-date');

// Genereer de huidige datum
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

// Stel de huidige datum in als de standaardwaarde
dateInput.value = formattedDate;
returnDateInput.value = formattedDate;

// JavaScript
const timeInput = document.getElementById('time');
const returnTimeInput = document.getElementById('return-time');
// Genereer de huidige tijd
const currentTime = new Date();
const hours = String(currentTime.getHours()).padStart(2, '0');
const minutes = String(currentTime.getMinutes()).padStart(2, '0');
const formattedTime = `${hours}:${minutes}`;

// Stel de huidige tijd in als de standaardwaarde
timeInput.value = formattedTime;
returnTimeInput.value = formattedTime;





// Succesbericht-element
const successDiv = document.getElementById('success');

// Google Maps API autocomplete voor pickup en dropoff
const autocompleteOptions = {
  componentRestrictions: { country: 'nl' }
};
const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput, autocompleteOptions);
const dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffInput, autocompleteOptions);

// Eventlistener voor autocomplete-selectie
pickupAutocomplete.addListener('place_changed', updateDistanceAndDuration);
dropoffAutocomplete.addListener('place_changed', updateDistanceAndDuration);

function fillCurrentLocation(input) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geocoder = new google.maps.Geocoder();
          const latLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
  
          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results[0]) {
              input.value = results[0].formatted_address;
            }
          });
        },
        (error) => {
          console.error('Fout bij het ophalen van de locatie:', error);
        }
      );
    } else {
      console.error('Geolocatie wordt niet ondersteund in deze browser.');
    }
  }

  locationText.addEventListener('click', () => {
    fillCurrentLocation(pickupInput);
  });
  
// Afstand en duur bijwerken op basis van geselecteerde plaatsen
function updateDistanceAndDuration() {
  const directionsService = new google.maps.DirectionsService();

  const pickup = document.getElementById('pickup').value;
  const dropoff = document.getElementById('dropoff').value;

  if (pickup && dropoff) {
    const request = {
      origin: pickup,
      destination: dropoff,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status === 'OK') {
        const route = response.routes[0];
        kilometers = route.legs[0].distance.value;

        economyPrice.textContent = `€ ${(kilometers / 1000 * economyPricePerKm).toFixed(2)}`;
        luxuryPrice.textContent = `€ ${(kilometers / 1000 * luxuryPricePerKm).toFixed(2)}`;
        vanPrice.textContent = `€ ${(kilometers / 1000 * vanPricePerKm).toFixed(2)}`;
        
        const duration = route.legs[0].duration.text;

        distanceText.textContent = `${route.legs[0].distance.text}`;
        durationText.textContent = `${duration}`;
      } 
    });
  } else {
    distanceText.textContent = '';
    durationText.textContent = '';
    document.getElementById('price').classList.add('hidden');
  }
}

// Volgende stap tonen
function nextStep() {
  if (step1Form.checkValidity()) {
    step1Form.classList.add('hidden');
    step2Form.classList.remove('hidden');

    // Voeg een kleine vertraging toe om de overgang te laten zien
    setTimeout(() => {
      step1Form.classList.add('hidden');
      step2Form.classList.remove('hidden');
    }, 10);
  }
}

// Taxi boeken
function bookTaxi() {
  const distance = parseFloat(distanceText.textContent.split(' ')[1]);


    const confirmationMsg = `De taxi is succesvol geboekt! De prijs van de rit bedraagt `;

    step2Form.classList.add('hidden');
    successDiv.classList.remove('hidden');
    successDiv.textContent = confirmationMsg;
}

flatpickr(".date-picker", {
  enableTime: false, // Zet op true als je ook de tijd wilt selecteren
  dateFormat: "Y-m-d", // Pas het datumformaat aan aan je voorkeur
});

flatpickr(".time-picker", {
  enableTime: true,
  noCalendar: true, // Zet op false als je ook de datum wilt selecteren
  dateFormat: "H:i", // Pas het tijdformaat aan aan je voorkeur
});






// JavaScript
const retourCheckbox = document.getElementById('retour');


// Schakel de datum en tijd in/uit op basis van de retourcheckbox
retourCheckbox.addEventListener('change', function() {
  if (this.checked) {
    returnDateInput.disabled = false;
    returnTimeInput.disabled = false;
  } else {
    returnDateInput.disabled = true;
    returnTimeInput.disabled = true;
  }
});


const flightContainer = document.querySelector(".flight-container");

pickupInput.addEventListener("input", function () {
  console.log(this.value)
  if (this.value.toLowerCase().includes('schiphol')) {
    console.log('')
    flightContainer.classList.remove("flight-container");
  } else {
    flightContainer.classList.add("flight-container");
  }
});
