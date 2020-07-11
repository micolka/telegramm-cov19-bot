require('dotenv').config();
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
    ctx.reply(`Error. Country ${country} isn't exists!`);
  }
});

bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
