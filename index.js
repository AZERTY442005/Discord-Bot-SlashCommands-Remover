// ©2023 AZERTY. All rights Reserved | AZERTY#9999
const chalk = require("chalk")
const lolcatjs = require("lolcatjs")
var figlet = require("figlet")
const inquirer = require("inquirer")
const fetch = require('node-fetch')

const Discord = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")

// Display Welcome Title
function Banner() {
    // var banner = figlet.textSync("Réservateur Automatique - ARHSR", {
    var banner = figlet.textSync("SlashCommands Remover", {
        font: "Small",
        horizontalLayout: "default",
        width: 1000,
        whitespaceBreak: true,
    })
    lolcatjs.fromString(banner)
}

console.clear()
Banner()

inquirer.prompt([
    {
        type: "input",
        name: "BotToken",
        message: "Bot Token:\n",
    },
]).then(async answers => {
    const BotToken = answers.BotToken
    // console.log("\nConnecting...")
    console.log(chalk.yellow("\nConnecting..."))
        // console.log(BotToken)
    const bot = new Discord.Client({
        intents: [ // BITFIELDS
            Discord.GatewayIntentBits.Guilds, // 1
            Discord.GatewayIntentBits.GuildMembers, // 2
            Discord.GatewayIntentBits.GuildBans, // 4
            Discord.GatewayIntentBits.GuildEmojisAndStickers, // 8
            Discord.GatewayIntentBits.GuildIntegrations, // 16
            Discord.GatewayIntentBits.GuildWebhooks, // 32
            Discord.GatewayIntentBits.GuildInvites, // 64
            Discord.GatewayIntentBits.GuildVoiceStates, // 128
            Discord.GatewayIntentBits.GuildPresences, // 256
            Discord.GatewayIntentBits.GuildMessages, // 512
            Discord.GatewayIntentBits.GuildMessageReactions, // 1024
            Discord.GatewayIntentBits.GuildMessageTyping, // 2048
            Discord.GatewayIntentBits.DirectMessages, // 4096
            Discord.GatewayIntentBits.DirectMessageReactions, // 8192
            Discord.GatewayIntentBits.DirectMessageTyping, // 16384
            Discord.GatewayIntentBits.MessageContent, // 32768
            Discord.GatewayIntentBits.GuildScheduledEvents, // 65536
            Discord.GatewayIntentBits.AutoModerationConfiguration, // 1048576
            Discord.GatewayIntentBits.AutoModerationExecution, // 2097152
        ],
        // partials: ["MESSAGE", "CHANNEL", "REACTION", "EMOJI"]
        partials: [
            Discord.Partials.Message,
            Discord.Partials.Channel,
            Discord.Partials.Reaction,
        ]
    })
    bot.login(BotToken)
    .then(()=>{
        // console.log("Connected to Discord")
        console.log(chalk.greenBright("Connected to Discord"))
    }).catch(err => {
        // console.error(err.message)
        if(err.message=="An invalid token was provided.") {
            console.log(chalk.red("Invalid Token"))
        }
    })
    bot.on("ready", async () => {
        console.log(chalk.magentaBright("Bot Started"))
        
        // console.log(bot.guilds.cache.map(guild => (guild.name)))
        // console.log(bot.user.id)
        
        const rest = new REST({ version: "10" }).setToken(BotToken)
        
        console.log(chalk.cyanBright("\nRemoving Global Commands"))
        await rest.put(Routes.applicationCommands(bot.user.id), {
            body: [],
        }).then(() => {
            console.log(chalk.greenBright("Removed Global Commands"))
        })

        console.log(chalk.cyanBright("\nRemoving Guilds Commands"))
        bot.guilds.cache.forEach(async Guild => {
            await rest.put(Routes.applicationGuildCommands(bot.user.id, Guild.id), {
                body: [],
            })
        }
        // , () => {
        //     console.log(chalk.greenBright("Removed Guilds Commands"))
        // }
        )
        console.log(chalk.greenBright("Removed Guilds Commands"))

        console.log(chalk.greenBright("\nAll done !!!\n\n\n"))

        process.exit()
    })
})
