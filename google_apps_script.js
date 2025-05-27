function doGet() {
  return HtmlService.createHtmlOutput("Сервис API для формы Самокат работает!");
}

// Функция для обработки предварительных запросов CORS
function doOptions() {
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Проверка наличия данных
    if (!e || !e.postData) {
      return ContentService
        .createTextOutput(JSON.stringify({
          'result': 'error',
          'message': 'Ошибка: данные не получены'
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader('Access-Control-Allow-Origin', '*');
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Добавляем дату и время
    var currentDate = new Date();
    var formattedDate = Utilities.formatDate(currentDate, "GMT+3", "dd.MM.yyyy HH:mm:ss");
    
    // Объединяем имя и фамилию в ФИО
    var fullName = data.firstname + " " + data.lastname;
    
    // Записываем данные в таблицу в нужном порядке
    sheet.appendRow([
      formattedDate,       // Дата заявки
      data.city,           // Город
      data.vacancy,        // Вакансия
      data.citizenship,    // Гражданство
      fullName,            // ФИО (имя + фамилия)
      data.age || "",      // Возраст (если есть)
      data.phone           // Телефон
    ]);
    
    // Возвращаем успешный ответ с CORS-заголовками
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Заявка успешно отправлена!'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } catch (error) {
    // Обработка ошибок
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'message': 'Произошла ошибка: ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}
