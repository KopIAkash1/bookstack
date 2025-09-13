// .github/scripts/bookstack.js

const { marked } = require('marked'); // Импортируем parse из marked
const fetch = require('node-fetch'); // Для отправки POST-запросов
const fs = require('fs');

// Пример: получаем данные из JSON-файла (можно заменить на payload из GitHub Actions)
const issueData = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf-8'));
const { title, body, action } = issueData.issue;

// Конвертируем Markdown в HTML
const htmlBody = marked.parse(body);

// Данные для API BookStack
const BOOKSTACK_API_URL = process.env.BOOKSTACK_API_URL;
const BOOKSTACK_API_TOKEN = process.env.BOOKSTACK_API_TOKEN;

if (!BOOKSTACK_API_URL || !BOOKSTACK_API_TOKEN) {
  console.error('ERROR: Не настроены BOOKSTACK_API_URL или BOOKSTACK_API_TOKEN');
  process.exit(1);
}

// Функция создания или обновления страницы
async function sendToBookStack() {
  try {
    // Настраиваем URL и метод в зависимости от события
    let url = `${BOOKSTACK_API_URL}/api/pages`;
    let method = 'POST';
    
    if (action === 'edited' || action === 'closed') {
      // Здесь можно реализовать поиск страницы по title и обновление
      method = 'PUT';
      url = `${BOOKSTACK_API_URL}/api/pages/slug/${encodeURIComponent(title)}`;
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${BOOKSTACK_API_TOKEN}`
      },
      body: JSON.stringify({
        name: title,
        html: htmlBody,
        // Можно добавить другие поля, например 'book_id' или 'chapter_id'
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ошибка BookStack API: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log('Страница успешно отправлена в BookStack:', data);
  } catch (err) {
    console.error('Ошибка при отправке в BookStack:', err);
    process.exit(1);
  }
}

// Запускаем
sendToBookStack();
