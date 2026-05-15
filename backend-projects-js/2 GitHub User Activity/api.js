import https from "https";

function fetchActivity(username){
    const url = `https://api.github.com/users/${username}/events`;
    
    const options = {
        headers: {"User-Agent": "node"}
    };

    return new Promise((resolve, reject) => {
        https.get(url, options, (res) => {
            let data = "";

            if(res.statusCode === 404){
                reject(new Error("User not found."));
                return;
            }

            if(res.statusCode !== 200){
                reject(newError("Failed to fetch data"));
                return;

            }
             res.on("data", chunk => data+=chunk);
             res.on("end", ()=>{
                try {
                    resolve(JSON.parse(data));
                } catch {
                    reject(new Error("Invalid JSON."));
                }
             });
        }).on("error", ()=> reject(new Error("Network error.")))
    })
}
export { fetchActivity };