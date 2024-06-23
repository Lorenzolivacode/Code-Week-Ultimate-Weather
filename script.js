import { API_KEY } from "./js/keys.js";
import { QS, CE, modalLoadGen, getCityWeather, renderCard, renderListCity } from "./js/function.js";
import { cityList } from "./js/data-capitals2.js";

const cityName = 'palermo';

const hamaburger = QS('.ham-menu');
const navbar = QS('#side-bar');
const inputTxt = QS('#input-search');
const searchBtn = QS('#search-button');
const favouritesTag = QS('#favourites');
const timeNow = QS('.time-now');

const sectionCityList = QS('.city-list');
const cardPalermo = renderCard(cityName);

favouritesTag.textContent = `Preferiti (${cityList.favourites.length})`;
navbar.style.display = 'none';
//console.log(`Numero di capitali: ${europeanCapitals.length}`)

//APRE LA SIDEBAR
hamaburger.addEventListener('click', () => {
    //console.log('HAMBURGER')
    //console.log(navbar.style.display)
    
    if (navbar.style.display === 'none'){
        navbar.style.display = 'block';
        sectionCityList.style.marginLeft = '25%';
    } else {
        navbar.style.display = 'none';
        sectionCityList.style.marginLeft = '0';
    }
})

//LEGGE LA PROPAGAZIONE DI EVENTI NELLA SIDEBAR
navbar.addEventListener('click', (e) => {
    const targetId = e.target.id;

    //IN CASO DI CLICK SU UNA LISTA, NE RENDERIZZA IL CONTENUTO
    if ((e.target.tagName === "LI" || targetId === "favourites") && targetId !== "favourites-li"){
        //console.log(targetId)
        //console.log(cityList[targetId])
        renderListCity(cityList[targetId])
    }

    //APRE E CHIUDE I FILTRI PER CONDIZIONI METEO
    if (targetId === 'filter-weather') {
        //console.log('BUTTON WEATHER');
        
        const selectWeather = QS('#select-weather');
        const filterWeatherBtn = QS('#filter-weather')
        //console.log('src:', filterWeatherBtn.src);

        if (filterWeatherBtn.src.includes('img/icons8-freccia-giu-48.png')){
            //console.log('BUTTON WEATHER GIU');
            filterWeatherBtn.src = 'img/icons8-scorri-su-48.png'
            selectWeather.style.display = 'block';
        } else {
            filterWeatherBtn.src = 'img/icons8-freccia-giu-48.png'
            selectWeather.style.display = 'none';            
        }
    }

    //LEGGE LA PROPAGAZIONE DI EVENTI E RENDERIZZA UNA LISTA DI CAPITALI CON LA CONDIZIONE METEO SELEZIONATA
    if (e.target.type){
        //console.log('Type:', Boolean(e.target.type));
        sectionCityList.innerHTML = '';
        //console.log('Filter');
        
        const cityListWhitoutF = Object.assign({}, cityList);
        delete cityListWhitoutF.favourites;
        //console.log('cityListWhitoutF', cityListWhitoutF);
        const cityListArray = Object.values(cityListWhitoutF);
        //console.log('cityListArray', cityListArray);
        const capitalsListComplete = cityListArray.flat(1);
        //console.log('capitalsListComplete', capitalsListComplete);

        //const cityClearSky = [];
        const typeWeather = e.target.value.replace('-', ' ');
        //console.log('typeWeather', typeWeather);

        if (sectionCityList.innerHTML === ''){
            modalLoadGen ();
        }

        capitalsListComplete.forEach(async (cityObj) => {
            const cityDataWeather = await getCityWeather(cityObj.city);
            //console.log('ICON', cityDataWeather.weather[0].icon);
            //console.log('TARGET', targetId);

            if (targetId.includes(cityDataWeather.weather[0].icon)) {
                renderCard(cityObj.city, cityObj)
                //console.log(cityObj);

                const modalLoad = QS('.modal-load');
                modalLoad.remove();
            };
        })

        //DESELEZIONO LA VOCE SPUNTATA
        setTimeout(() => {
            e.target.checked = false;
        },2000)

        //IN CASO DI MANCATA CORRISPONDENZA DI CONDIZIONI METEO, MANDO UN MESSAGGIO NEL DOM
            //ASPETTO 3 S PER DARE IL TEMPO DI CONTROLLARE TUTTI I DATI
        setTimeout(() => {
            if (sectionCityList.children.length === 1){
                //console.log('VUOTO');
                const modalLoad = QS('.modal-load');
                modalLoad.remove();

                const sectionCityList = QS('.city-list');
                const titleNotFound = CE('h2');
                titleNotFound.classList.add('card', 'box-shadow', 'txt-center');

                titleNotFound.textContent = `In nessuna capitale c'è ${typeWeather}`;
                sectionCityList.append(titleNotFound);
            }
        }, 3000)
    }
})

//CREAZIONE NELL'HEADER DELL'ORA LOCALE IN LIVE
setInterval(() => {
    const date1 = new Date();
    timeNow.textContent = `${date1.getHours()} : ${date1.getMinutes()} : ${date1.getSeconds()}`
}, 1000);

//TENTATIVI DI RENDERIZZARE UNA LISTA DI PIù CARD DI CITTà CON STESSO NOME DA INPUT
/* inputTxt.addEventListener('input', async () => {
    const InputValue = inputTxt.value;
    if (InputValue != ''){
        setTimeout(async () => {
        const arrayCityName = await getCityWeatherList(InputValue);
        //console.log('script - arrayCityName', arrayCityName);
        //console.log('script - arrayCityName[0]', arrayCityName[0]);

        renderListCity(arrayCityName);
        }, 800)
    }
}) */ //controllare getCityWeather index per lat e lon, il problema potrebbe essere la mancata iterazione su tutti gli elementi dell'array

//RICERCA DI SINGOLA CITTà NEL DB DELL'API
searchBtn.addEventListener('click', async() => {
    const InputValue = inputTxt.value;
    if (InputValue != ''){
        sectionCityList.innerHTML = '';
        renderCard(InputValue)
    }
    inputTxt.value = '';
})
