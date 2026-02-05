
//read username
import { getUsername } from "./utils.js";
import { fetchActivity } from "./api.js";
import { displayActivity } from "./formatter.js";


async function main(){
    try {
    const username = getUsername();
    const events = await fetchActivity(username);
    displayActivity(events);
    } catch (error) {
        console.log(error.message);
    }
    
}
main()
// Build API URl
// Send Request

// collect Response

// Parse JSON

// loop through events

// prints readble items