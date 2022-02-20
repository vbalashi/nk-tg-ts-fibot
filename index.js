const TelegramApi = require('node-telegram-bot-api')
const { options } = require('nodemon/lib/config')

const token = "1917307536:AAEhCsfHSVjl2FLKXtTmMEG_UwmVaUhCUkk"
const {gameOptions, againOptions} = require('./options')

const bot = new TelegramApi(token, {polling: true})

const chats = {}


bot.setMyCommands([
    {command: '/start', description: 'initial greeting'},
    {command: '/info', description: 'get user info'}, 
    {command: '/game', description: 'play the game'}

])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'I imagine the number from 0 to 9');
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'please guess the number', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        console.log(msg)
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://telegramchannels.me/storage/stickers/robertdowneys1ick3r/big_robertdowneys1ick3r_1.png')
            return bot.sendMessage(chatId, `welcome to my Bot, ${msg.chat.first_name}`) 
        }
        if(text === '/info') {
         return bot.sendMessage(chatId, `your nickname is ${msg.chat.username}`)
        }
        if(text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'can not understand you')
    })

    bot.on('callback_query', async msg => {
        console.log(msg)
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId);
        }
        if(data === chats[chatId]){
            return await bot.sendMessage(chatId, `you guessed number ${chats[chatId]} correctly. you won`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `you lost, your number ${chats[chatId]} is incorrect`, againOptions)
        }
    })
}

start()