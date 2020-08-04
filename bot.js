require('dotenv').config();
const axios = require('axios');
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');
const {getWeatherData, getCovidData} = require('./data-func')

const bot = new Telegraf(process.env.BOT_TOKEN);


bot.start((ctx) =>
  ctx.reply(
    `
Welcome, ${ctx.message.from.first_name}!
Whanna some stats? Choose your destiny!
`,
    Markup.keyboard([
      ['Covid', 'weather'],
      ['Belarus', '/help'],
    ])
      .resize()
      .extra()
  )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
  let data = {};
  const ctxText = ctx.message.text;

  if (ctxText === 'weather') {
    ctx.reply(`Choose the city`, 
    Markup.keyboard([
      ['Orsha', 'Minsk'],
      ['/back', '/list'],
    ])
      .resize()
      .extra() );
  } 

  else if (ctxText === 'Covid') {
    ctx.reply(`Choose the country`, 
    Markup.keyboard([
      ['Russia', 'Belarus'],
      ['/back', '/list'],
    ])
      .resize()
      .extra() );
  }
  
  else if (COUNTRIES_LIST.includes(ctxText.toLowerCase())) {
    try {
      data = await api.getReportsByCountries(ctxText);
      ctx.reply(getCovidData(data));
    } catch (e) {
      ctx.reply(`Error. Can't find info about ${ctxText}!`);
    }
  } 
  
  else {
    const params = {
      access_key: process.env.WEATHER_API_KEY,
      query: ctxText,
    };
    axios
      .get('http://api.weatherstack.com/current', { params })
      .then((response) => {
        const formatData = getWeatherData(response.data);
        ctx.reply(formatData);
        ctx.replyWithPhoto({ url: response.data.current.weather_icons });
      })
      .catch((error) => {
        console.log(`Some err: ${error}`);
      });
  }
});

bot.launch();
console.log('Bot is started...');
