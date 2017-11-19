const { Client } = require('discord.js')
const bot = new Client()
const { TOKEN, PREFIX } = require('./config.js')
const func = require('./helpfunc.js')

const queue = new Map()

bot.on('ready', () => {
    console.log("Maika is now online.")
});

bot.on('message', async msg => {
    if (msg.author.bot) return undefined
    if (!msg.content.startsWith(PREFIX)) return undefined

    const args = msg.content.split(" ")

    if (msg.content.startsWith(`${PREFIX}hi`)) {
        const respond = ["Quit barking, mongrel.", "Ugh, you again?"]
        let val = func.randomInt(0, (respond.length - 1))
        msg.channel.send(respond[val])
    } else if (msg.content.startsWith(`${PREFIX}gel`) || msg.content.startsWith(`${PREFIX}gelbooru`)) {
        let q = args[1] ? args.slice(1).join(" ").toLowerCase() : 'random'
        gelbooru_search(q, msg)
    } else if (msg.content.startsWith(`${PREFIX}loli`)) {
        let r = ['safe', 'questionable', 'explicit']
        let s = r[func.randomInt(0,2)]
        let q = args[1] ? args[1].toLowerCase() : s
        console.log(q)
        q = (q == 's') ? 'safe' : q
        q = (q == 'q') ? 'questionable' : q
        q = (q == 'e') ? 'explicit' : q
        q = "loli rating:" + q
        gelbooru_search(q, msg)
    }

});

bot.login(TOKEN)

function gelbooru_search (query, msg) {
    console.log(query)
    let unirest = require('unirest')
    let suffix = query
    unirest.post("http://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=30&tags=" + suffix)
      .headers({
        'Accept': 'application/xml',
        'User-Agent': 'Unirest Node.js'
      })
      .end((result) => {
            if (result.body.length < 1) {
                msg.reply(lang.image.notfound) // Correct me if it's wrong.
            } else {
                var xmlParser = require('xml2js')
                var output
                var xml = xmlParser.parseString(result.body, (err, re) => {
                    output = re
                })
                if (!output) return msg.reply('Looks like the server is down. Shame on you, huh?')
                if (!output.posts) return msg.reply('There\'s no such image as your filthy wishes desire.')
                if (!output.posts.post) return msg.reply('There\'s no such image as your filthy wishes desire.')
                var count = Math.floor((Math.random() * output.posts.post.length))
                var array = []
                if (suffix) {
                    array.push(`Huh, so there really is something related to ` + '**' + suffix + '** here...')
                } else {
                    array.push(`Aren't you pretty low to just search for something randomly?`)
                } // hehe no privacy if you do the nsfw commands now.
                //FurryArray.push("http:" +     output.posts.post[count].$.file_url)
                var colour 
                var rating = output.posts.post[count].$.rating
                if (rating == "e") {
                    colour = 0xFF0000
                } else if (rating == "q") {
                    colour = 0xFF6600
                } else {
                    colour = 0x00FF00
                }
                msg.channel.send(output.posts.post[count].$.file_url)
          }
        })

}