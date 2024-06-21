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

async function openCity (cityCardEl, city){
    //const existingSecondaryCardContainer = cityCardEl.querySelector('.secondary-card-container');
    const secondaryCardContainer = CE('div');
    secondaryCardContainer.classList.add('second-c-container', 'width100', 'shape-br40-p15', 'box-s-inset-dx');

    const cityTime = QS('.city-time');

    if (Number.parseInt(cityCardEl.style.maxWidth) < 100 || cityCardEl.style.maxWidth === ''){
        //console.log(Number(Number.parseInt(cityCardEl.style.maxWidth)));
        cityCardEl.style.minWidth = '100%';
        cityCardEl.style.maxWidth = '100%';

        const cityData = await getCityWeather(city);
        //console.log(cityData);

    //CREAZIONE DELL'ORA LOCALE IN LIVE
        //const cityTimeContainer = CE('div');
        const cityTimeLocal = CE('span');
        cityTimeLocal.classList.add('city-time-local', 'time-style');

        cityTime.style.display = 'none';

        setInterval(() => {

            const date1 = new Date();
            const cityHours = (((date1.getHours())*3600)-7200+cityData.timezone)/3600;

            if (cityHours >= 24){
                cityTimeLocal.textContent = `${cityHours - 24} : ${date1.getMinutes()} : ${date1.getSeconds()}`;
            } else {
                cityTimeLocal.textContent = `${cityHours} : ${date1.getMinutes()} : ${date1.getSeconds()}`;
            }
        }, 1000);

    //CLOUDS
        const cloudsContainer = CE('div');
        cloudsContainer.classList.add('clouds-container', 'flex-row');
        const cloudsIcon = CE('img');
        cloudsIcon.src = './../img/icons8-nuovoloso-30.png';
        const cloudPercentage = CE('span');
        cloudPercentage.textContent = `Nuvolosità: ${cityData.clouds.all}%`;
        //console.log(cloudPercentage.textContent);
        cloudsContainer.append(cloudPercentage, cloudsIcon);

    //TEMP MAX-MIN
        const tempMaxMinContainer = CE('div');
        tempMaxMinContainer.classList.add('temp-mm-container', 'flex-row');
        const tempMaxMinIcon = CE('img');
        tempMaxMinIcon.src = './../img/icons8-temperatura-50(1).png';
        const dataTempCont = CE('div');
        dataTempCont.classList.add('data-temp-cont', 'flex-column');
        const tempMax = CE('span');
        tempMax.textContent = `Temperatura max: ${cityData.main.temp_max}°`;
        const tempMin = CE('span');
        tempMin.textContent = `Temperatura min: ${cityData.main.temp_min}°`;

        dataTempCont.append(tempMax, tempMin);
        tempMaxMinContainer.append(dataTempCont, tempMaxMinIcon);

    //RAIN
        const rainContainer = CE('div');
        rainContainer.classList.add('rain-container', 'flex-row');
        const rainIcon = CE('img');
        rainIcon.src = './../img/icons8-rain-24.png';
        const rainQuantity = CE('span');

        if (cityData.rain) {
            rainQuantity.textContent = `Pioggia in 1h: ${cityData.rain['1h']}mm`;
        } else {
            rainQuantity.textContent = `Pioggia in 1h: 0 mm`;
        }

        rainContainer.append(rainQuantity, rainIcon);

    //SNOW
        const snowContainer = CE('div');
        snowContainer.classList.add('snow-container', 'flex-row');
        const snowIcon = CE('img');
        snowIcon.src = './../img/icons8-neve-50.png';
        const snowQuantity = CE('span');

        if (cityData.snow) {
            snowQuantity.textContent = `Neve in 1h: ${cityData.snow['1h']}mm`;
        } else {
            snowQuantity.textContent = `Neve in 1h: 0 mm`;
        }

        snowContainer.append(snowQuantity, snowIcon);

    //WIND
        const windContainer = CE('div');
        windContainer.classList.add('wind-container', 'flex-row');
        const windIcon = CE('img');
        windIcon.src = './../img/icons8-vento-50.png';
        const windConverseCont = CE('div');
        windConverseCont.classList.add('wind-converse-cont', 'flex-column');
        const windMS = CE('span');
        windMS.textContent = `Velocità vento: ${(cityData.wind.speed).toFixed(1)} m/s`;
        const windKH = CE('span');
        windKH.textContent = `Velocità vento: ${(cityData.wind.speed * 3.6).toFixed(1)} km/h`;
        const windN = CE('span');
        windN.textContent = `Velocità vento: ${(cityData.wind.speed * 1.9438).toFixed(1)} nodi`;

        windConverseCont.append(windMS, windKH, windN);
        windContainer.append(windConverseCont, windIcon);

        //cityCardEl.classList.add('flex-row-around');


        secondaryCardContainer.append(
            cityTimeLocal,
            cloudsContainer,
            tempMaxMinContainer,
            rainContainer,
            snowContainer,
            windContainer
        );

        cityCardEl.append(secondaryCardContainer);
    } else {
        cityTime.style.display = 'block';
        console.log(cityTime.style.display);
        
        const secondaryCardContainer = QS('.second-c-container');
        //console.log(Number(Number.parseInt(cityCardEl.style.maxWidth)));
        cityCardEl.style.minWidth = '250px';
        cityCardEl.style.maxWidth = '20%';

        secondaryCardContainer.remove();
        //cityCardEl.classList.remove('flex-row-around');
    }
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

export async function getCityLatLon (city) {
    try {
        const CITY_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        const res = await fetch(CITY_URL);
        const data = await res.json();
        console.log('getCityLatLon:', data);

        if (data.length === 0){ throw 'Città non trovata'}

        return data //Torna un array di max 5 obj
    } catch {
        const sectionCityList = QS('.city-list');
        const titleError = CE('h2');
        titleError.classList.add('card', 'box-shadow', 'txt-center');

        titleError.textContent = 'Città non trovata ☹️';
        sectionCityList.append(titleError);
    }
}

//console.log(await getCityLatLon(cityName))

/* export async function getCityWeatherList (cityName){
    const resCity = await getCityLatLon(cityName);
    console.log('getCityWeatherList - resCity:', resCity);
    console.log('getCityWeatherList - resCity[0]:', resCity[0]);

    const arrayCityName = [];
    resCity.forEach(async (cityObjLatLon) => {
        console.log('cityObjLatLon:', cityObjLatLon);
        
        const cityLon = cityObjLatLon.lon;
        const cityLat = cityObjLatLon.lat;
        //console.log('cityLon', cityLon);

        const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${API_KEY}&units=metric`;
        const res = await fetch(WEATHER_URL);
        const dataComplete = await res.json();
        console.log('dataComplete:', dataComplete);

        arrayCityName.push(dataComplete)
        console.log('arrayCityName', arrayCityName);
        console.log('arrayCityName[0]', arrayCityName[0]);
                
        return arrayCityName
    });


}; */

export async function getCityWeather (city){
    const resCity = await getCityLatLon(city);
    const cityLat = resCity[0].lat;
    const cityLon = resCity[0].lon;
    
    //console.log(cityLat)
    //console.log(cityLon)
    
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${API_KEY}&units=metric`;
    const res = await fetch(WEATHER_URL);
    const data = await res.json();
    console.log('getCityWeather.json:', data);
    //console.log(resCity);
    //console.log(data.main.temp);
    return data
}

export async function renderCard (city, obj){ //obj = getCityWeather(city)
//DEFINISCO GLI ELEMENTI DELLA CARD
    const cityCardEl = CE('div');
    const mainCardContainer = CE('div');
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
    cityCardEl.classList.add('card', 'box-shadow', 'flex-row-around');
    mainCardContainer.classList.add('card__main-container', 'card', 'hover-scale', 'flex-column')
    countryFlag.classList.add('country-flag');
    name.classList.add('name', 'shape-br40-p15');
    country.classList.add('name', 'shape-br40-p15');
    weatherContainer.classList.add('weather', 'flex-row', 'shape-br40-p15')
    weatherIcon.classList.add('weather__icon', 'width60');
    weatherType.classList.add('weather__type');
    
    tempContainer.classList.add('main-temp', 'flex-row', 'shape-br40-p15', 'padding-side35');
    degContainer.classList.add('flex-column');
    degImg.classList.add('main-temp__img');
    cityTemp.classList.add('main-temp__temp');    
    humidityContainer.classList.add('flex-column');
    humidityImg.classList.add('main-temp__img');
    cityHumidity.classList.add('main-temp__humidity');
    cityTime.classList.add('city-time', 'time-style');

    starFavourite.classList.add('star-favourite', 'cursor-p', 'opacity07');

//ASSEGNO I CONTENUTI
    const  cityLatLon = await getCityLatLon(city);
    const  cityDataForName = cityLatLon[0];
    const cityData = await getCityWeather(city);
    //console.log('obj passato a renderCard:', await obj)
    //console.log('Boolean di obj passato a renderCard:', Boolean(obj))
    console.log('cityData', cityData);

    if (obj || cityDataForName.local_names){
        name.textContent = (obj) ? (obj.city) : (cityDataForName.local_names.it || cityDataForName.name);
    } else {name.textContent = cityDataForName.name}
    country.textContent = (obj) ? obj.country : cityData.sys.country;
    weatherIcon.src = `https://openweathermap.org/img/wn/${cityData.weather.at(0).icon}@2x.png`
    weatherType.textContent = cityData.weather.at(0).description;

//VARIABILI PER PRENDERE UN VALORE DALL'API
    const tempValue = Number.parseInt(cityData.main.temp);
    const timeZone = cityData.timezone;
    //console.log('Time zone di city:', timeZone)

//CONTENUTI DERIVANTI DAI DATI
    degImg.src = '../img/icons8-temperatura-50(1).png';
    cityTemp.textContent = `${tempValue}°`;
    humidityImg.src = '../img/icons8-umidità-50(1).png';
    cityHumidity.textContent = `${cityData.main.humidity}%`
    
//CREAZIONE DELL'ORA LOCALE IN LIVE
    setInterval(() => {
        const date1 = new Date();
        const cityHours = (((date1.getHours())*3600)-7200+timeZone)/3600;

        if (cityHours >= 24){
            cityTime.textContent = `${cityHours - 24} : ${date1.getMinutes()}`;
        } else {
            cityTime.textContent = `${cityHours} : ${date1.getMinutes()}`;
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
        mainCardContainer.classList.add('weather-very-cold');
    }
    if (tempValue > 5 && tempValue <= 15){
        mainCardContainer.classList.add('weather-cold');
    }
    if (tempValue > 15 && tempValue <= 25){
        mainCardContainer.classList.add('weather-normal');
    }
    if (tempValue > 25 && tempValue <= 30){
        mainCardContainer.classList.add('weather-hot');
    }
    if (tempValue > 30){
        mainCardContainer.classList.add('weather-very-hot');
    }

//APPENDO GLI ELEMENTI
    weatherContainer.append(weatherIcon, weatherType);
    degContainer.append(degImg, cityTemp);
    humidityContainer.append(humidityImg, cityHumidity);
    tempContainer.append(degContainer, humidityContainer);

    mainCardContainer.append(countryFlag, name, country, weatherContainer, tempContainer, cityTime, starFavourite);

    cityCardEl.append(mainCardContainer);

    sectionCityList.append(cityCardEl);
    //console.log(name.textContent)

//ASSEGNO GLI EVENTI
    starFavourite.onclick = (e) => {
        const favouritesTag = QS('#favourites');
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

    mainCardContainer.addEventListener('click', (e) => {
        const targetCalss = e.target.classList;
        console.log(targetCalss)
        console.log(!targetCalss.contains('star-favourite'))

        if (!targetCalss.contains('star-favourite')){
            console.log('pippo');
            openCity(cityCardEl, city);
        }
    });

    return cityCardEl
}

export async function renderListCity (dataList){
    const sectionCityList = QS('.city-list');
    sectionCityList.innerHTML = '';
    console.log('type of dataList', typeof dataList);
    console.log('Ingresso 1 a renderListCity', dataList);
    console.log('dataList[0] di renderListCity', dataList[0]);

    //const cityCard =     
    dataList.forEach((cityC) => {
        console.log('cityC', cityC);
        renderCard(((cityC.city) || (cityC.name)), cityC);
    })

    console.log('Parametro dataList di renderListCity', dataList);

    const filtername = QS('#filter-name');
    filtername.addEventListener('click', () => {
        console.log('Filter');
        const dataSortname = dataList.sort((a, b) => a.city.localeCompare(b.city));
        console.log('Sort:', dataSortname);
        renderListCity(dataSortname);
    })
}