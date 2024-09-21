const axios = require('axios')

async function reelsConvert(url) {
    try {
        const startTime = Date.now(); // Mulai waktu

        const reelsPayload = { "url": url }
        const reelsConfig = {
            method: 'POST',
            url: 'https://app.publer.io/hooks/media',
            headers: {
                'Sec-Ch-Ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
                'Content-Type': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.120 Safari/537.36',
                'Sec-Ch-Ua-Platform': "Windows",
                'Accept': '*/*',
                'Origin': 'https://publer.io',
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://publer.io/',
                'Accept-Encoding': 'gzip, deflate, br',
                'Priority': 'u=1, i',
            },
            data: reelsPayload
        };

        const reelsResponse = await axios(reelsConfig)
        console.log(reelsResponse)
        const reelsData = reelsResponse.data
        console.log(reelsData)

        if (reelsResponse.status === 200) {
            const job_id = reelsData.job_id

            return new Promise(async (resolve, reject) => {
                const checkStatus = async () => {
                    try {
                        const reelsCheckConfig = {
                            method: 'GET',
                            url: `https://app.publer.io/api/v1/job_status/${job_id}`,
                            headers: {
                                'Sec-Ch-Ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
                                'Accept-Language': 'en-US,en;q=0.9',
                                'Sec-Ch-Ua-Mobile': '?0',
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.120 Safari/537.36',
                                'Sec-Ch-Ua-Platform': "Windows",
                                'Accept': '*/*',
                                'Origin': 'https://publer.io',
                                'Sec-Fetch-Site': 'same-site',
                                'Sec-Fetch-Mode': 'cors',
                                'Sec-Fetch-Dest': 'empty',
                                'Referer': 'https://publer.io/',
                                'Accept-Encoding': 'gzip, deflate, br',
                                'Priority': 'u=1, i',
                            }
                        };

                        const reelsCheckResponse = await axios(reelsCheckConfig)
                        const reelsCheckData = reelsCheckResponse.data

                        if (reelsCheckData.status === 'working') {
                            setTimeout(checkStatus, 5000)

                        } else if (reelsCheckData.payload) {
                            const endTime = Date.now()
                            const duration = (endTime - startTime) / 1000
                            console.log(`Durasi: ${duration} detik`)
                            resolve(reelsCheckData.payload[0].path)

                        } else {
                            reject('Error')
                        }

                    } catch (err) {
                        reject(err) // Gagal dalam pengecekan
                    }
                }
                // Mulai pengecekan status
                await checkStatus()
            })
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports = reelsConvert
