const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '1878819751:AAHE5ntWS8OgYdqC0_DeOxiEaA1Jc4izd0o'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendSticker(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать;)`)
    chats[chatId] = Math.floor(Math.random() * 10);

    await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай число'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/1.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Максима Ходакова!`)
        }
        if (text === '/info') {
            return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, "я тебя не понимаю, попробуй еще раз!)")
    })
    bot.on('callback_query', async msg =>{
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again'){
            return startGame(chatId)
        }
        if (data === chats[chatId]){
            return  bot.sendMessage(chatId, `Поздравляю! Ты отгадал цифру ${chats[chatId]}!`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Жаль, но вы проиграли и не отгадали цифру ${chats[chatId]}(`, againOptions)
        }
    })
}
start()