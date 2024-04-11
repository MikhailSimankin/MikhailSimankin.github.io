/* eslint-disable max-len */
// API ключ для доступа к API
const apiKey = 'a7c63168-d34b-4f27-950f-3b461dbd571b';

// URL для запроса данных
const apiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${apiKey}`;

//Функция для отображения уведомлений
function showNotification(message, type) {
    let notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.role = 'alert';
    notification.innerHTML = message;

    document.getElementById('notificationContainer').appendChild(notification);

    setTimeout(function () {
        notification.remove();
    }, 5000);
}

let selectedRouteName;
let selectedRoute;
let selectedRouteId;
let selectedGuideId;

function showMap(coords, route) {
    const mapContainer = document.getElementById('mapContainer');

    // Создаем кнопку заказа маршрута
    const orderButton = document.createElement('button');
    orderButton.innerText = 'Заказать маршрут';
    // orderButton.classList.add('btn', 'btn-primary');
    // orderButton.setAttribute('data-toggle', 'modal');
    // orderButton.setAttribute('data-target', '#orderModal');
    // orderButton.id = 'orderButton'; // Устанавливаем id для стилизации

    // Создаём блок информации о заказе
    const infoBlock = document.createElement('p');
    infoBlock.innerText = '';

    const mapHtml = `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.586862391753!2d37.61763571431823!3d55.75582639555992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDA2JzIyLjgiTiAzN8KwMjknMTQuMCJF!5e0!3m2!1sen!2sus!4v1638451664517!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>    `;

    mapContainer.innerHTML = mapHtml;
    //mapContainer.appendChild(infoBlock);
    // mapContainer.appendChild(orderButton);


    // Добавляем класс для отображения контейнера карты
    mapContainer.classList.add('map-container-visible');
}


// Генерация таблицы
function generateTable(routesData) {
    const tableBody = document.getElementById('routesTableBody');
    tableBody.innerHTML = '';

    routesData.forEach((route, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${route.name}</td>
            <td>${route.description}</td>
        `;
        tableBody.appendChild(row);
    });

    addRowClickHandlers(routesData);
}

// Генерация слайдера
function generateSlider(routesData) {
    const sliderContainer = document.getElementById('sliderContainer');
    sliderContainer.innerHTML = '';

    const pageCount = Math.ceil(routesData.length / 5);

    // Подсветка текущей страницы
    function highlightCurrentPage(pageNumber) {
        const buttons = sliderContainer.querySelectorAll('.slider-button');
        for (const button of buttons) {
            button.classList.remove('current-page');
        }
        buttons[pageNumber - 1].classList.add('current-page');
    }

    // // Получение текущей страницы
    // function getCurrentPage() {
    //     const currentButton = sliderContainer.querySelector('.current-page');
    //     return parseInt(currentButton.textContent);
    // }

    // Добавление кнопок с номерами страниц
    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('slider-button', 'page-button');
        pageButton.addEventListener('click', () => {
            const startIndex = (i - 1) * 5;
            const endIndex = startIndex + 5;
            const slicedData = routesData.slice(startIndex, endIndex);
            generateTable(slicedData);
            highlightCurrentPage(i);
        });
        sliderContainer.appendChild(pageButton);
    }
}


// Загрузка данных и генерация таблицы и слайдера
function loadAndGenerateData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const routesData = data.map(route => ({
                name: route.name,
                description: route.description,
                coords: route.coords,
                id: route.id
            }));


            // Генерировать таблицу только для первых 5 записей при первой загрузке
            const initialData = routesData.slice(0, 5);
            generateTable(initialData);
            
            generateSlider(routesData);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Загрузка и генерация данных при загрузке страницы
window.addEventListener('load', () => {
    loadAndGenerateData();
});


//pain
// Загрузка данных гидов и генерация таблицы
function loadAndGenerateGuides(routeId) {
    const guidesApiUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=${apiKey}`;
    selectedRouteId = routeId;

    fetch(guidesApiUrl)
        .then(response => response.json())
        .then(guidesData => {
            const guidesTableBody = document.getElementById('guidesTableBody');
            guidesTableBody.innerHTML = '';

            guidesData.forEach((guide, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${guide.name}</th>
                    <td>${guide.language}</td>
                    <td>
                    <button class="btn btn-primary" data-toggle="modal" data-target="#myModal${index + 1}">
                        Выбрать
                    </button>

                    <!-- Модальное окно -->
                    <div class="modal fade" id="myModal${index + 1}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h4 class="modal-title" id="myModalLabel">Заказать маршрут</h4>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <form id="eForm">
                                    <div class="modal-body">
                                        <p>Маршрут: <span id="selectedRoute">${selectedRouteName}</span></p>
                                        <p>Гид: <span id="guideName">${guide.name}</span></p>
                                        <label for="excursionDate">Дата экскурсии:</label>
                                        <input type="date" id="excursionDate" name="excursionDate">
                                        <br>
                                        <label for="excursionTime">Время начала экскурсии:</label>
                                        <input type="time" id="excursionTime" name="excursionTime" min="09:00" max="23:00" step="1800">
                                        <br>
                                        <label for="tourDuration">Длительность тура (в часах):</label>
                                        <select id="tourDuration" name="tourDuration">
                                            <option value="1">1 час</option>
                                            <option value="2">2 часа</option>
                                            <option value="3">3 часа</option>
                                        </select>
                                        <br>
                                        <label for="groupSize">Количество человек:</label>
                                        <input type="number" id="groupSize" name="groupSize" min="1" max="20">
                                        <br>
                                        <label for="optionone">Скидка для пенсионеров(цена ниже на 25%):</label>
                                        <input type="checkbox" id="quickDeparture" name="quickDeparture">
                                        <br>
                                        <label for="optiontwo">Сувениры:(+500 рублей для каждого посетителя)</label>
                                        <input type="checkbox" id="quickDeparture" name="quickDeparture">
                                    </div>
                                </form>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Отменить</button>
                                    <button type="button" class="btn btn-primary" onclick="sendOrder()">Отправить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </td>
                `;
                guidesTableBody.appendChild(row);
                selectedGuideId = guide.id;
            });
        });
}

// Добавление обработчиков событий для строк таблицы
function addRowClickHandlers(routesData) {
    const tableRows = document.querySelectorAll('#routesTableBody tr');

    tableRows.forEach((row, index) => {
        row.addEventListener('click', () => {
            const selectedRoute = routesData[index];
            selectedRouteId = selectedRoute.Id;
            selectedRouteName = selectedRoute.name;
            showMap(selectedRoute.coords);
            loadAndGenerateGuides(selectedRoute.id);
        });
    });
}
function sendOrder() {
    const dataInput = document.getElementById('excursionDate').value;
    const durationInput = document.getElementById('tourDuration').value;
    const timeInput = document.getElementById('excursionTime').value;
    const peopleInput = document.getElementById('groupSize').value;
    const fCheckbox = document.getElementById('optionone');
    const sCheckbox = document.getElementById('optiontwo');
    
    const orderData = {
        guide_id: selectedGuideId,   
        route_id: selectedRouteId,
        date: dataInput,
        time: timeInput,
        duration: parseInt(durationInput),
        persons: parseInt(peopleInput),
        price: 5000, 
        optionFirst: fCheckbox.checked,    
        optionSecond: sCheckbox.checked,      
    };

    let formEl = new FormData(document.getElementById("eForm"));
    // for (const key in orderData) {
    //     formEl.append(key, orderData[key]);
    // }
    // formData.append('guide_id', 'selectedGuideId');
    // formData.append('route_id', 'selectedRouteId');
    // formData.append('date', 'dataInput');
    // formData.append('time', 'timeInput');
    // formData.append('duration', 'parseInt(durationInput)');
    // formData.append('persons', 'parseInt(peopleInput)');
    // formData.append('price', '5000');
    // formData.append('optionFirst', 'fCheckbox.checked');
    // formData.append('optionSecond', 'sCheckbox.checked');

    console.log('Request Data:', orderData);
    console.log('Request Data:', formEl);

    // Отправка запроса http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=a7c63168-d34b-4f27-950f-3b461dbd571b
    fetch('http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=a7c63168-d34b-4f27-950f-3b461dbd571b', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        //body: JSON.stringify(orderData),
        body: new FormData(document.getElementById("eForm")),
    })
        .then(response => {
            console.log('Server response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Order successfully sent:', data);
        })
        .catch(error => {
            console.error('Error sending order:', error);
        });
}