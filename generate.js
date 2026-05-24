const fs = require("fs");
const path = require("path");

const libraryPath = "./library";

let library = {};

const playlists = fs.readdirSync(libraryPath);

playlists.forEach((playlist) => {

    const playlistPath = path.join(libraryPath, playlist);

    if (fs.statSync(playlistPath).isDirectory()) {

        let files = fs.readdirSync(playlistPath);

        library[playlist] = files;
    }
});

fs.writeFileSync(
    "library.json",
    JSON.stringify(library, null, 2)
);

console.log("library.json generated!");