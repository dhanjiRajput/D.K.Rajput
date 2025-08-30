// Uptime.betterstack  <--- Add your uptime monitoring code here


import Agenda from 'agenda';
import {JSDOM} from 'jsdom';
import fs from 'fs';

const mongoConnectionString = 'mongodb+srv://kidechadhanji_db_user:dkrajput@cluster0.y5nrg8v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'agendaJobs' } });

agenda.define('welcome', async () => {
  console.log('Welcome to the Agenda Jobs!');
});

agenda.define('scrape_hn', async () => {
  const response=await fetch('https://news.ycombinator.com/');
  const html=await response.text();
  const document=new JSDOM(html).window.document;
  const articleTitles=[...document.querySelectorAll('.athing')];
  const articleScores=articleTitles.map(article=>article.nextSibling);

  const link=articleTitles.map(article=>article.querySelector('.titleline > a'));
  const scores=articleScores.map(score=>score.querySelector('.score'));

  const articles=link.map((a,i)=>{
    let score=scores[i]?.textContent || 0;
    return {
      name:a.textContent,
      url:a.href,
      score : typeof score === 'string' ? parseFloat(score.split()[0]) : score
    };
  });

  articles.sort((a,b)=>b.score - a.score);

  fs.writeFileSync('top_articles.json', JSON.stringify(articles, null, '\t'));

});

await agenda.start();

await agenda.every('* * * * * *', 'scrape_hn');

// agenda.on('ready', async () => {
//   console.log('Agenda connected ✅');
//   await agenda.cancel({ name: 'welcome' });
//   await agenda.start();
//   await agenda.every('* * * * * *', 'welcome');
// });

// agenda.on('error', err => console.error('Agenda error ❌', err));

async function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  await agenda.stop();
  process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);