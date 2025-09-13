const marked = require('marked');

// Данные Issue (можно менять или брать из env)
const title = process.env.ISSUE_TITLE || 'Без названия';
const problem = process.env.ISSUE_BODY || 'Описание проблемы отсутствует';
const cause = process.env.ISSUE_CAUSE || 'Причина не указана';
const solution = process.env.ISSUE_SOLUTION || 'Решение не указано';
const labels = process.env.ISSUE_LABELS || '';
const url = process.env.ISSUE_URL || '#';

const bookstackUrl = process.env.BOOKSTACK_URL || 'http://localhost:8080';
const bookId = process.env.BOOKSTACK_BOOK_ID || '1';
const apiId = process.env.BOOKSTACK_API_ID || 'your_api_id';
const apiSecret = process.env.BOOKSTACK_API_SECRET || 'your_api_secret';

// Конвертируем Markdown в HTML
const htmlProblem = marked.parse(problem);
const htmlCause = marked.parse(cause);
const htmlSolution = marked.parse(solution);

// Формируем полный HTML-контент
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

// Создаем JSON payload
const payload = {
  name: title,
  book_id: bookId,
  html: fullHtml
};

// Генерируем команду curl
const curlCommand = `curl -X POST "${bookstackUrl}/api/pages" \\
-H "Authorization: Token ${apiId}:${apiSecret}" \\
-H "Content-Type: application/json" \\
-d '${JSON.stringify(payload)}'`;

console.log('Скопируйте и выполните команду curl:');
console.log(curlCommand);
