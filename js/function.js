import { API_KEY } from "./keys.js";
import { cityList } from "./data-capitals2.js";
//import { favourites } from "./data-capitals.js";


export function QS (tag){
    const QS = document.querySelector(tag);
    return QS;
}

export function CE (ele){
    const CE = document.createElement(ele);
    return CE;
};

const cityName = 'Palermo';
const sectionCityList = QS('.city-list');

//const CITY_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`;

function removeCityF(arrayList, cityNameArray){
    const index = arrayList.findIndex((element) => element.city === cityNameArray);

    if (index !== 1){
        console.log(index)
        console.log(arrayList)

        arrayList.splice(index,1);
    }
};

function openCity (cityCardEl){
    cityCardEl.style.minWidth = '100%';
    cityCardEl.style.maxWidth = '100%';
};

function modalFavouritesGen(name, star, txt){
    const modalNewF = CE('div');
    const titleNewF = CE('p');
    const starFavouriteNewF = CE('img');
    starFavouriteNewF.classList.add('star-favourite', 'cursor-p', 'opacity07');
    starFavouriteNewF.src = star;

    modalNewF.classList.add('card', 'box-shadow', 'modal-new-f');
    titleNewF.textContent = `${name.textContent} ${txt}`
    modalNewF.append(titleNewF, starFavouriteNewF);
    sectionCityList.append(modalNewF);

    setTimeout(() => {
        modalNewF.remove();
    }, 2000)
};

export async function getCity (city) {
    const CITY_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;
    const res = await fetch(CITY_URL);
    const data = await res.json();

    return data
}

console.log(await getCity(cityName))

export async function getWeather (city){
    const resCity = await getCity(city);
    const cityLat = resCity[0].lat;
    const cityLon = resCity[0].lon;
    
    //console.log(cityLat)
    //console.log(cityLon)
    
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${API_KEY}&units=metric`;
    const res = await fetch(WEATHER_URL);
    const data = await res.json();
    console.log(data);
    //console.log(data.main.temp);
    return data
}

export async function renderCard (city, obj){ //obj = getWeather(city)
//DEFINISCO GLI ELEMENTI DELLA CARD
    const cityCardEl = CE('div');
    const countryFlag = CE('div');
    const name = CE('h2');
    const country = CE('h3');
    const weatherContainer = CE('div');
    const weatherIcon = CE('img');
    const weatherType = CE('span');

    const tempContainer = CE('div');
    const degContainer = CE('div');
    const degImg = CE('img');
    const cityTemp = CE('span');
    const humidityContainer = CE('div');
    const humidityImg = CE('img');
    const cityHumidity = CE('span');
    const cityTime = CE('span');

    const starFavourite = CE('img');

//ATTRIBUISCO LE CLASS
    cityCardEl.classList.add('card', 'box-shadow');
    countryFlag.classList.add('country-flag');
    name.classList.add('name', 'shape-br40-p15');
    country.classList.add('name', 'shape-br40-p15');
    weatherContainer.classList.add('weather', 'flex-row', 'shape-br40-p15')
    weatherIcon.classList.add('weather__icon');
    weatherType.classList.add('weather__type');
    
    tempContainer.classList.add('main-temp', 'flex-row', 'shape-br40-p15', 'padding-side35');
    degContainer.classList.add('flex-column');
    degImg.classList.add('main-temp__img');
    cityTemp.classList.add('main-temp__temp');    
    humidityContainer.classList.add('flex-column');
    humidityImg.classList.add('main-temp__img');
    cityHumidity.classList.add('main-temp__humidity');
    cityTime.classList.add('time-style');

    starFavourite.classList.add('star-favourite', 'cursor-p', 'opacity07');

//ASSEGNO I CONTENUTI
    const cityData = await getWeather(city);
    console.log(await obj)
    console.log(Boolean(obj))

    name.textContent = (obj) ? (obj.city) : (cityData.name);
    country.textContent = (obj) ? obj.country : cityData.sys.country;
    weatherIcon.src = `https://openweathermap.org/img/wn/${cityData.weather.at(0).icon}@2x.png`
    weatherType.textContent = cityData.weather.at(0).description;

//VARIABILI PER PRENDERE UN VALORE DALL'API
    const tempValue = Number.parseInt(cityData.main.temp);
    const timeZone = cityData.timezone;
    console.log(timeZone)

//CONTENUTI DERIVANTI DAI DATI
    degImg.src = '../img/icons8-temperatura-50(1).png';
    cityTemp.textContent = `${tempValue}°`;
    humidityImg.src = '../img/icons8-umidità-50(1).png';
    cityHumidity.textContent = `${cityData.main.humidity}%`
    
//CREAZIONE DELL'ORA LOCALE IN LIVE
    setInterval(() => {
        const date1 = new Date();
        const cityHours = (((date1.getHours())*3600)-7200+timeZone)/3600;

        if (cityHours >=24){
            cityTime.textContent = `${cityHours - 24}:${date1.getMinutes()}`;
        } else {
            cityTime.textContent = `${cityHours}:${date1.getMinutes()}`;
        }
    }, 1000);

    //console.log(obj)

//CONTROLLO SE FA PARTE DEI PREFERITI PER ASSEGNARE LA STELLA
    if ((obj) && obj.favourites === `yes`){
        starFavourite.src = '../img/icons8-stella-30(orange).png';
    } else {
        starFavourite.src = '../img/icons8-stella-30(gray).png';
    }

    //console.log(tempValue)

//ASSEGNO EVENTUALI STILI
    countryFlag.style.background = (obj) ? obj.flag : '';

//ASSEGNO UN COLORE IN BASE ALLA TEMPERATURE
    if (tempValue <= 5){
        tempContainer.classList.add('weather-very-cold');
    }
    if (tempValue > 5 && tempValue <= 15){
        tempContainer.classList.add('weather-cold');
    }
    if (tempValue > 15 && tempValue <= 25){
        tempContainer.classList.add('weather-normal');
    }
    if (tempValue > 25 && tempValue <= 30){
        tempContainer.classList.add('weather-hot');
    }
    if (tempValue > 30){
        tempContainer.classList.add('weather-very-hot');
    }

//APPENDO GLI ELEMENTI
    weatherContainer.append(weatherIcon, weatherType);
    degContainer.append(degImg, cityTemp);
    humidityContainer.append(humidityImg, cityHumidity);
    tempContainer.append(degContainer, humidityContainer);

    cityCardEl.append(countryFlag, name, country, weatherContainer, tempContainer, cityTime, starFavourite);

    sectionCityList.append(cityCardEl);
    //console.log(name.textContent)

//ASSEGNO GLI EVENTI
    starFavourite.onclick = () => {
        const favouritesTag = QS('#favourites-tag');
        console.log(favouritesTag)

        if (starFavourite.src.includes('gray')){
            const newFavourite = {
                city: name.textContent,
                country: country.textContent,
                flag: countryFlag.style.background,
                id: cityData.sys.id,
                favourites: 'yes'
            }
            console.log(newFavourite)

            const starColor = '../img/icons8-stella-30(orange).png';
            const messageTxt = 'è stata aggiunta ai preferiti';
            modalFavouritesGen(name, starColor, messageTxt)

            cityList.favourites.push(newFavourite);
            console.log(cityData)

            favouritesTag.textContent = `Preferiti (${cityList.favourites.length})`;

            starFavourite.src = '../img/icons8-stella-30(orange).png';
        } else {
            console.log('F!')
            starFavourite.src = '../img/icons8-stella-30(gray).png';
            
            const starColor = '../img/icons8-stella-30(gray).png';
            const messageTxt = 'è stata rimossa dai preferiti';
            modalFavouritesGen(name, starColor, messageTxt)

            removeCityF(cityList.favourites, name.textContent);
            //renderListCity(cityList.favourites);
            
            favouritesTag.textContent = `Preferiti (${cityList.favourites.length})`;
        }
    }

    cityCardEl.addEventListener('click', () => {
        openCity(cityCardEl);
    });

    return cityCardEl
}

export async function renderListCity (dataList){
    const sectionCityList = QS('.city-list');
    sectionCityList.innerHTML = '';

    const cityCard = dataList.forEach((cityC) => {
        renderCard(cityC.city, cityC);
    })

    /* const body = QS('body');

    body.append(await cityCard) */

    return cityCard
}