getData("Romania");

function search(element) {
  if (event.key == "Enter") {
    countryInput = element.value;
    element.value = "";
    getData(countryInput);
  }
}

function removeElementsByClass(className) {
  console.log("deleting");
  var elements = document.getElementsByTagName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function getData(name) {
  removeElementsByClass("a");
  theMap(name);
  findNeigh(name);
  fetch("https://covid-19-tracking.p.rapidapi.com/v1/" + name, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "covid-19-tracking.p.rapidapi.com",
      "x-rapidapi-key": "986015809amshb0f8ac98c944c7cp1ec486jsnf22fc72b0762",
    },
  })
    .then((response) => {
      response.json().then((body) => {
        const country = body["Country_text"];
        const newCases = body["New Cases_text"];
        const totalCases = body["Total Cases_text"];
        const totalDeaths = body["Total Deaths_text"];

        document.getElementById("country-name").textContent = country;
        document.getElementById("new-cases").textContent = newCases;
        document.getElementById("total-cases").textContent = totalCases;
        document.getElementById("total-deaths").textContent = totalDeaths;
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function findNeigh(name) {
  fetch("https://restcountries.eu/rest/v2/name/" + name, {
    method: "GET",
  })
    .then((response) => {
      response.json().then((body) => {
        const neighbours = body[0].borders;
        for (let i = 0; i < neighbours.length; i++) {
          theNeigh(neighbours[i]);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function theNeigh(name) {
  fetch("https://restcountries.eu/rest/v2/alpha/" + name, {
    method: "GET",
  })
    .then((response) => {
      response.json().then((body) => {
        const resultName = body.name;
        findStatsForNeigh(resultName);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function findStatsForNeigh(name) {
  fetch("https://covid-19-tracking.p.rapidapi.com/v1/" + name, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "covid-19-tracking.p.rapidapi.com",
      "x-rapidapi-key": "986015809amshb0f8ac98c944c7cp1ec486jsnf22fc72b0762",
    },
  })
    .then((response) => {
      response.json().then((body) => {
        const x = body["Country_text"];
        const y = body["Total Deaths_text"];
        calcNeigh(x, y);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function calcNeigh(country, deaths) {
  const br = document.createElement("break");
  const y = document.getElementById("related");
  const x = document.createElement("a");
  x.href = "#top";
  x.onclick = function () {
    getData(country);
  };
  const t = document.createTextNode(country + ": " + deaths + " deaths | ");
  x.appendChild(t);
  document.body.appendChild(x);
  br.appendChild(x);
  document.body.appendChild(br);
  y.appendChild(br);
  document.body.appendChild(y);
}

getPos();

function getPos() {
  fetch("https://restcountries.eu/rest/v2/name/romania", {
    method: "GET",
  })
    .then((response) => {
      response.json().then((body) => {
        const lat = body[0].latlng[0];
        const lng = body[0].latlng[1];
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function theMap(country) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoicnViaWM0IiwiYSI6ImNrY3Vla3R1ZjF0YnYyeXQ2c243eWVpeHEifQ.Hgj0BjhuuOAowR_pE97V_Q";
  var mapboxClient = mapboxSdk({
    accessToken: mapboxgl.accessToken,
  });
  mapboxClient.geocoding
    .forwardGeocode({
      query: country,
      autocomplete: false,
      limit: 1,
    })
    .send()
    .then(function (response) {
      if (
        response &&
        response.body &&
        response.body.features &&
        response.body.features.length
      ) {
        var feature = response.body.features[0];

        var map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/rubic4/ckcuiev3y3sz71iqh61ge8k4h",
          center: feature.center,
          zoom: 4,
        });
        new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
      }
    });
}
