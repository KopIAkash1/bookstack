// Подключаем библиотеку для конвертации Markdown в HTML
const marked = require('marked');
const fetch = require('node-fetch');

// Получаем данные Issue из переменных окружения
const title = process.env.ISSUE_TITLE || 'Без названия';
const problem = process.env.ISSUE_PROBLEM || 'Описание проблемы отсутствует';
const cause = process.env.ISSUE_CAUSE || 'Причина не указана';
const solution = process.env.ISSUE_SOLUTION || 'Решение не указано';
const labels = process.env.ISSUE_LABELS || '';
const url = process.env.ISSUE_URL || '#';

// Конвертируем Markdown в HTML
const htmlProblem = marked.parse(problem);
const htmlCause = marked.parse(cause);
const htmlSolution = marked.parse(solution);

// Формируем полный HTML-контент страницы по методологии KCS
const fullHtml = `
<h1>${title}</h1>
<h2>Проблема</h2>
${htmlProblem}
<h2>Причина</h2>
${htmlCause}
<h2>Решение</h2>
${htmlSolution}
<h2>Ссылки</h2>
<p><strong>Связанная задача:</strong> <a href='${url}'>${url}</a></p>
<h2>Метки</h2>
<p>${labels}</p>
`;

// Создаём объект для запроса к API BookStack
const payload = {
  name: title,
  book_id: process.env.BOOKSTACK_BOOK_ID,
  html: fullHtml
};

// Отправляем POST-запрос к API BookStack для создания страницы
fetch(`${process.env.BOOKSTACK_URL}/api/pages`, {
  method: 'POST',
  headers: {
    'Authorization': `Token ${process.env.BOOKSTACK_API_ID}:${process.env.BOOKSTACK_API_SECRET}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
.then(res => {
  if (!res.ok) {
    console.error('Не удалось создать страницу:', res.status, res.statusText);
    return res.text().then(text => console.error(text));
  } else {
    console.log('Страница успешно создана');
  }
})
.catch(err => console.error('Ошибка запроса:', err));
