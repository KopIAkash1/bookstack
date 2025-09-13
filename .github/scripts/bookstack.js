const fs = require('fs');
const fetch = require('node-fetch');
const marked = require('marked');

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH));

const title = event.issue.title;
const body = event.issue.body;
const url = event.issue.html_url;
const labels = event.issue.labels.map(l => l.name).join(', ');

const htmlBody = marked(body);

const template = `
<h1>${title}</h1>
<h2>Проблема</h2>
<p>${htmlBody}</p>
<h2>Причина</h2><p></p>
<h2>Решение</h2><p></p>
<h2>Ссылки</h2><p><a href="${url}">Issue на GitHub</a></p>
<h2>Метки</h2><p>${labels}</p>
`;

async function createPage() {
  const response = await fetch(`${process.env.BOOKSTACK_API_URL}/api/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.BOOKSTACK_API_TOKEN}:${process.env.BOOKSTACK_API_SECRET}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: title,
      html: template,
      book_id: 2,
      chapter_id: null
    })
  });
  const data = await response.json();
  console.log(data);
}

createPage();
