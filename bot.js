require('dotenv').config();
const axios = require('axios');
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `
Welcome, ${ctx.message.from.first_name}!
Here you can get word COVID-19 statistics.
Just send me any country you want.
Type /help to get full list of countries.
`,
    Markup.keyboard([
      ['us', 'russia'],
      ['belarus', 'poland'],
    ])
      .resize()
      .extra()
  )
);
bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
  let data = {};
  const country = ctx.message.text;
  if (COUNTRIES_LIST.includes(country.toLowerCase())) {
    try {
      data = await api.getReportsByCountries(country);
      const formatData = `
  Country: ${data[0][0].country}
  Cases: ${data[0][0].cases}
  Deaths: ${data[0][0].deaths}
  Recovered: ${data[0][0].recovered}
  `;
      ctx.reply(formatData);
    } catch (e) {
      ctx.reply(`Error. Can't find info about ${country}!`);
    }
  } else {
    const params = {
      access_key: process.env.WEATHER_API_KEY,
      query: country,
    };
    axios
      .get('http://api.weatherstack.com/current', { params })
      .then((response) => {
        const weatherData = response.data;
        const formatData = `
Temperature: ${weatherData.current.temperature} °C
Feels like: ${weatherData.current.feelslike} °C
Description: ${weatherData.current.weather_descriptions}
Wind speed: ${weatherData.current.wind_speed} m/s
  `;
        ctx.reply(formatData);
        ctx.replyWithPhoto({ url: weatherData.current.weather_icons });
      })
      .catch((error) => {
        console.log(`Some err: ${error}`);
      });
  }
});

bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
console.log('Bot is started...');
