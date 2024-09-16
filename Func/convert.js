const axios = require('axios')

async function covertURL(url) {
    try {

        const convertConfig = {
            method: 'post',
            url: 'https://lovetik.com/api/ajax/search',
            headers: {
                'Host': 'lovetik.com',
                'Cookie': 'cf_clearance=k9WMu8zWvOW7AJcj55Ff7E18dKiejC3.fm3IYHuClFU-1726404481-1.2.1.1-Dntqv1o9DHI7chXs1JAEiXu8bTqUNHtKjWdI4QQhY4SWX2vycQt22999w9sYaqAATO9cj..GvTlX9S0_0_UyL1jO.94KilhGLmtHdm2GOs5N_kp6cLRi9dR5CpCvV9KVMG4Hov6KEWJShLA3rwEFOdf1ej_jcbFDuiUIFH_Zv9ecDXAVMRAlJc7m5ddzGZJuemHKINLD9wrx7qcWK7ZxMD3.fbZVMyKFnkAuYxOpSYBaciJfqonH1emDxtAn71gqUOc1WV3pNmUgqynIAcxMWWWcdKzBN7FmzSiJfUBhJTKGJ1yYR9Wgj_EfNqMSVoC.3YSGHpjRL.KOU3div2g_FYeHoG8R2etsZ6ErX2x1f30_1KiLq8Xw_pSy7pQNgf4XF5rqcwj0C0cQZU184DYMC5yKDZbalVrDtln6FYaI4nUrJB2VPTw_QSEkru2c_6or; _ga_30X9VRGZQ4=GS1.1.1726404486.1.0.1726404486.0.0.0; _ga=GA1.1.185153074.1726404486',
                'Content-Length': Buffer.byteLength(`query=${url}`),
                'Sec-Ch-Ua': '"Chromium";v="127", "Not)A;Brand";v="99"',
                'Accept-Language': 'en-US',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.100 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest',
                'Sec-Ch-Ua-Platform': "Windows",
                'Origin': 'https://lovetik.com',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://lovetik.com/id/tiktok-mp3',
                'Accept-Encoding': 'gzip, deflate, br',
                'Priority': 'u=1, i',
            },
            data: `query=${url}`
        }


        const convertResponse = await axios(convertConfig)
        const convertData = convertResponse.data

        if(convertData.status == 'ok') {
            const video720p = convertData.links.find(link => link.s.includes('720p'))
            if (video720p) {
                console.log(video720p.a)
                return video720p.a
            }
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = covertURL