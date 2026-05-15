function getUsername(){
    const username = process.argv[2];
    if(!username){
        throw new Error("Please provide a github username");
    }
    return username;

}
export {getUsername};