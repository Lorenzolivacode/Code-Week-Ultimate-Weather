import { API_KEY } from "./js/keys.js";
//import { europeanCapitals, northAmericaCapitals, southAmericaCapitals, asiaCapitals, africaCapitals, oceaniaCapitals } from "./js/data-capitals.js";
import { QS, CE, getCityLatLon, getCityWeather, renderCard, renderListCity } from "./js/function.js";
import { cityList } from "./js/data-capitals2.js";

const cityName = 'palermo';

const body = QS('body');
const hmaburger = QS('.ham-menu');
const navbar = QS('#side-bar');
const inputTxt = QS('#input-search');
const searchBtn = QS('#search-button');
const favouritesEl = QS('#favourites-li');
const favouritesTag = QS('#favourites');
const timeNow = QS('.time-now');

const sectionCityList = QS('.city-list');
const cardPalermo = renderCard(cityName);
//getCityWeatherList(cityName);

//const capitalsCard = renderListCity(europeanCapitals);
//console.log(`Palermo: ${await cardPalermo}`);
//console.log(await cardPalermo);

//sectionECapitals.append(await cardPalermo);

favouritesTag.textContent = `Preferiti (${cityList.favourites.length})`;
navbar.style.display = 'none';
//console.log(`Numero di capitali: ${europeanCapitals.length}`)

hmaburger.addEventListener('click', () => {
    console.log('HAMBURGER')
    //console.log(navbar.style.display)
    
    if (navbar.style.display === 'none'){
        navbar.style.display = 'block';
        sectionCityList.style.marginLeft = '25%';
    } else {
        navbar.style.display = 'none';
        sectionCityList.style.marginLeft = '0';
    }
})

navbar.addEventListener('click', (e) => {
    const sectionListId = e.target.id;

    if ((e.target.tagName === "LI" || sectionListId === "favourites") && sectionListId !== "favourites-li"){
        //console.log(sectionListId)
        //console.log(cityList[sectionListId])
        renderListCity(cityList[sectionListId])
    }
})

setInterval(() => {
    const date1 = new Date();
    timeNow.textContent = `${date1.getHours()} : ${date1.getMinutes()} : ${date1.getSeconds()}`
}, 1000);

//await getCity('yor')
//await renderCard('new york')

/* getCityWeatherList(cityName da input).forEach ((cityObj) => {
    renderListCity()}) */ //SBAGLIATO

/* renderListCity(getCityWeatherList(cityName da input)) */

/* inputTxt.addEventListener('input', async () => {
    const InputValue = inputTxt.value;
    if (InputValue != ''){
        setTimeout(async () => {
        const arrayCityName = await getCityWeatherList(InputValue);
        console.log('script - arrayCityName', arrayCityName);
        console.log('script - arrayCityName[0]', arrayCityName[0]);

        renderListCity(arrayCityName);
        }, 800)
    }
}) */

searchBtn.addEventListener('click', async() => {
    const InputValue = inputTxt.value;
    if (InputValue != ''){
        /* const arrayCityName = await getCityWeather(InputValue);
        console.log('script - arrayCityName', arrayCityName);
        console.log('script - arrayCityName[0]', arrayCityName[0]);

        renderListCity(arrayCityName); */
        /* setTimeout(async () => {
        }, 1500) */
        sectionCityList.innerHTML = '';
        renderCard(InputValue)
    }
        inputTxt.value = '';
})