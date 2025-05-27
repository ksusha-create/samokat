document.addEventListener('DOMContentLoaded', function() {
    // Функциональность селектора городов
    const cityInput = document.getElementById('cityInput');
    const dropdownToggle = document.getElementById('dropdownToggle');
    const citiesList = document.getElementById('citiesList');
    const cityOptions = document.querySelectorAll('.city-option');
    
    // Скрыть список городов при загрузке
    if (citiesList) {
        citiesList.style.display = 'none';
        
        // Показать/скрыть список при клике на стрелку
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function() {
                if (citiesList.style.display === 'none') {
                    citiesList.style.display = 'block';
                } else {
                    citiesList.style.display = 'none';
                }
            });
        }
        
        // Показать список городов при фокусе на поле ввода
        if (cityInput) {
            cityInput.addEventListener('focus', function() {
                citiesList.style.display = 'block';
            });
            
            // Фильтрация городов при вводе
            cityInput.addEventListener('input', function() {
                const filter = this.value.toLowerCase();
                cityOptions.forEach(function(option) {
                    const text = option.textContent.toLowerCase();
                    if (text.indexOf(filter) > -1) {
                        option.style.display = '';
                    } else {
                        option.style.display = 'none';
                    }
                });
                
                // Показать список при вводе
                citiesList.style.display = 'block';
            });
            
            // Выбор города при нажатии Enter
            cityInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    // Найти первый видимый город в списке
                    const visibleOption = [...cityOptions].find(option => option.style.display !== 'none');
                    if (visibleOption) {
                        cityInput.value = visibleOption.textContent;
                    }
                    citiesList.style.display = 'none';
                }
            });
        }
        
        // Выбор города из списка
        cityOptions.forEach(function(option) {
            option.addEventListener('click', function() {
                if (cityInput) {
                    cityInput.value = this.textContent;
                    citiesList.style.display = 'none';
                }
            });
        });
        
        // Закрыть список при клике вне списка
        document.addEventListener('click', function(e) {
            if (citiesList && cityInput && dropdownToggle &&
                !citiesList.contains(e.target) && 
                e.target !== cityInput && 
                e.target !== dropdownToggle && 
                !dropdownToggle.contains(e.target)) {
                citiesList.style.display = 'none';
            }
        });
    }
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Обработка отправки формы
    const form = document.getElementById('application-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // URL вашего Google Apps Script
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwX-tcuj80ghKW1w9diuxRIn7Nuf5gnd5Jq71ERRGcKb6Gv7YxzAEXwGOBeFctObMroRw/exec';
            
            // Получение данных формы
            const formData = {
                city: document.getElementById('cityInput').value, // Обновлено для нового селектора городов
                vacancy: document.getElementById('vacancy').value,
                citizenship: document.getElementById('citizenship').value,
                fullname: document.getElementById('fullname').value,
                age: document.getElementById('age').value,
                phone: document.getElementById('phone').value
            };
            
            // Проверка заполнения формы
            const requiredFields = ['fullname', 'phone'];
            const emptyFields = requiredFields.filter(field => !formData[field]);
            
            if (emptyFields.length > 0) {
                alert('Пожалуйста, заполните обязательные поля: ' + emptyFields.join(', '));
                return;
            }
            
            if (!formData.city) {
                alert('Пожалуйста, выберите город или введите свой');
                return;
            }
            
            // Показываем индикатор загрузки
            const submitButton = form.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Отправка...';
            submitButton.disabled = true;
            
            // Отображаем в консоли данные, которые будут отправлены
            console.log('Отправляемые данные:', formData);
            
            // Отправка данных в Google Sheets
            fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
                mode: 'cors' // Явно указываем режим CORS
            })
            .then(response => {
                console.log('Статус ответа:', response.status);
                console.log('Заголовки ответа:', response.headers);
                
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => {
                        throw new Error('Ошибка при отправке данных: ' + response.status + ' ' + text);
                    });
                }
            })
            .then(data => {
                // Успешная отправка
                console.log('Успех:', data);
                alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
                form.reset();
            })
            .catch(error => {
                // Ошибка при отправке
                console.error('Ошибка:', error);
                alert('Произошла ошибка при отправке заявки: ' + error.message);
            })
            .finally(() => {
                // Восстанавливаем кнопку
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
        });
    }

    // Интерактивные карточки вакансий
    const vacancyCards = document.querySelectorAll('.vacancy-card');
    vacancyCards.forEach(card => {
        card.addEventListener('click', function() {
            const vacancyTitle = this.querySelector('h3').textContent;
            const vacancySelect = document.getElementById('vacancy');
            
            // Скролл к форме заявки
            const formElement = document.getElementById('application-form');
            if (formElement) {
                window.scrollTo({
                    top: formElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            // Выбор соответствующей вакансии в выпадающем списке
            if (vacancySelect) {
                for (let i = 0; i < vacancySelect.options.length; i++) {
                    if (vacancySelect.options[i].text === vacancyTitle) {
                        vacancySelect.selectedIndex = i;
                        break;
                    }
                }
            }
        });
    });
});
