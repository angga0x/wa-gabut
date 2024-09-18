const { DisconnectReason, makeWASocket, useMultiFileAuthState, MessageType, MessageOptions, Mimetype } = require('@whiskeysockets/baileys')
const convertFunc = require('./Func/convert')
const reelsFunc = require('./Func/reels')

let sender

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to', lastDisconnect.error, ', reconnecting', shouldReconnect)
            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }
    })

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        
        if (!msg.key.fromMe && msg.message) {
            const messageType = Object.keys(msg.message)[0]
            console.log('Message Type:', messageType)

            sender = msg.key.remoteJid
            console.log('Sender:', sender)
            
            const senderNumber = sender.replace('@s.whatsapp.net', '')
            const pushName = msg.pushName
            const message = msg.message[messageType]

            if(sender.includes('@g.us') && messageType === 'extendedTextMessage' || sender.includes('@g.us') && messageType === 'conversation') {
                const messageText = message.text
                const urlRegex = /(https:\/\/vt\.tiktok\.com\/\S+|https:\/\/www\.tiktok\.com\/\S+)/

                if(urlRegex.test(messageText)) {
                    const urlMatch = messageText.match(urlRegex)
                    if(urlMatch && urlMatch[0]) {
                        const balas = await sock.sendMessage(sender, { text: 'Proses...' }, { quoted: msg })
                        await new Promise(r => setTimeout(r, 5000))
                        await sock.sendMessage(sender, { delete: balas.key})

                        const videoURL = await convertFunc(urlMatch[0])
                        await sock.sendMessage(sender, { video: { url: videoURL }})
                    }

                } else if(sender.includes('@g.us') && messageType === 'extendedTextMessage' || sender.includes('@g.us') && messageType === 'conversation') {
                    const reelsText = message.text
                    console.log('Reels URL :', messageText)
                    const reelsRegex = /https:\/\/www\.instagram\.com\/reel\/[\w-]+/

                    if(reelsRegex.test(reelsText)) {
                        const urlMatch = reelsText.match(reelsRegex)
                        if(urlMatch && urlMatch[0]) {
                            const balas = await sock.sendMessage(sender, { text: `Proses...` }, { quoted: msg })
                            await new Promise(r => setTimeout(r, 5000))
                            await sock.sendMessage(sender, { delete: balas.key})

                            const videoURL = await reelsFunc(urlMatch[0])
                            console.log('Video URL:', videoURL)
                            await sock.sendMessage(sender, { video: { url: videoURL }})
                        }
                    }
                } else {
                    console.log('Tidak ada URL')
                }
            }
        }
    })
}

connectToWhatsApp()