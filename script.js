console.log("js running")
document.querySelector(".burger").addEventListener("click", () => {
    document.getElementsByClassName("leftside")[0].style.left = "0";
})
document.querySelector(".close").addEventListener("click", () => {
    document.getElementsByClassName("leftside")[0].style.left = "-300px";
})
// let covers = [];
let capLib = [];
async function getLibrary() {
    let a = await fetch("./library.json");
    let data = await a.json();

    let library = Object.keys(data);

    capLib = [];

    library.forEach(plName => {

        let capName = plName.replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });

        capLib.push(capName);
    });

    return library;
}
async function getSongs(playlist) {
    let a = await fetch("./library.json");
    let data = await a.json();

    return data[playlist];

}

    let library = [];
let currCard=null;
let audio=new Audio();
audio.addEventListener("timeupdate",()=>{
        document.querySelectorAll(".currTime").forEach(element => {
            element.innerHTML=formatTime(audio.currentTime);

        });
        document.querySelectorAll(".seekbarFill").forEach(element => {
            element.style.width=audio.currentTime/audio.duration*100+'%';
        });
        document.querySelectorAll(".thumb").forEach(element => {
            element.style.left=audio.currentTime/audio.duration*100-1.5+'%';
            element.style.visibility="visible";
        });
        // console.log(formatTime(audio.currentTime))
    })
audio.addEventListener("loadedmetadata",()=>{
        document.querySelectorAll(".duration").forEach(element => {
            let duration = audio.duration;

    if (isNaN(duration)) {
        duration = 0;
    }
            element.innerHTML=formatTime(duration);
            // console.log(audio.duration)
        });
        // console.log(formatTime(audio.currentTime))
    })
document.querySelectorAll(".seekbar").forEach(element => {
    element.addEventListener("click",(e)=>{
        // console.log(element.style.width)
        // if(audio.src)
        audio.currentTime=audio.duration*Math.floor(e.offsetX/element.offsetWidth*100)/100;
    })
});

// if(audio.paused){
//     document.querySelectorAll(".thumb").forEach(element => {
//             element.style.opacity=0;
//         });
// }
// else{
//     document.querySelectorAll(".thumb").forEach(element => {
//             element.style.opacity=1;
//         });
// }
function formatTime(seconds) {
    seconds = Math.floor(seconds);

    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;

    if (secs < 10) {
        secs = "0" + secs;
    }

    return mins + ":" + secs;
}
let isChangingSong=false;
async function playSong(playlist,song,element){
    // const audio=new Audio(`library/${playlist}/${song}`)
    // if(!audio.paused){
    if(isChangingSong) return;
    isChangingSong=true;
    audio.pause();
    let songName=song;
    let songs=await getSongs(element.dataset.pl);
    if (songName.substring(songName.length - 4).toLowerCase() == ".jpg" || songName.substring(songName.length - 4).toLowerCase() == ".png" || songName.substring(songName.length - 4).toLowerCase() == ".svg" || songName.substring(songName.length - 4) == ".gif" || songName.substring(songName.length - 5).toLowerCase() == ".jepg" || songName.substring(songName.length - 5).toLowerCase() == ".webp" || songName.substring(songName.length - 4).toLowerCase() == ".avif"){
        song=songs[Number(element.dataset.sindex)+1];
    }
    audio.src=`library/${playlist}/${song}`; 
    await audio.play();
    audio.volume=0.5;
    if(currCard){
        currCard.style.backgroundColor="";
    }
    currCard=element;
    currCard.style.backgroundColor="#1f1f1f";
    document.querySelector(".plapau").src="assets/play.svg";
    // let library = await getLibrary()
    let caplibind=0;
    for (let index = 0; index < library.length; index++) {
        const element = library[index];
        if (element==playlist){
            caplibind=index;
            break;
        }
    }
    isChangingSong=false;
    audio.onended=async ()=>{
        
        // playSong(playlist,songs[element.dataset.sIndex+1],document.querySelectorAll(".songCard")[element.dataset.sIndex+1])
        playSong(playlist,songs[Number(element.dataset.sindex)+1],document.querySelectorAll(".songCard")[Number(element.dataset.sindex)+1]);
        displayCurrSong(playlist,songs[Number(element.dataset.sindex)+1],caplibind)
    }
    
    // }
    // else{
    //     audio.src=`library/${playlist}/${song}`;
    // audio.play();
    // }
}

document.querySelector(".prev").addEventListener("click",async ()=>{
    let playlist=currCard.dataset.pl;
    let songs=await getSongs(currCard.dataset.pl)
    if(Array.from(document.querySelectorAll(".songCard")).indexOf(currCard)>0){
        let prevEle=Array.from(document.querySelectorAll(".songCard"))[Array.from(document.querySelectorAll(".songCard")).indexOf(currCard)-1];
        playSong(playlist,songs[Number(prevEle.dataset.sindex)],prevEle);
        displayCurrSong(playlist,songs[Number(prevEle.dataset.sindex)],library.indexOf(playlist))
    }
    else{
        audio.currentTime=0;
    }
    // console.log(songs)
    // console.log(document.querySelectorAll(".songCard"))
    //     if(Number(currCard.dataset.sindex)>0){
    //         let tempsong=songs[Number(currCard.dataset.sindex)-1];
    //         if(tempsong.substring(tempsong.length - 4).toLowerCase() == ".mp3" || tempsong.substring(tempsong.length - 4).toLowerCase() == ".mp4"){
    //             playSong(playlist,songs[Number(currCard.dataset.sindex)-1],document.querySelectorAll(".songCard")[Number(currCard.dataset.sindex)-1]);
    //             displayCurrSong(playlist,songs[Number(currCard.dataset.sindex)-1],library.indexOf(playlist))
    //             console.log(playlist,songs[Number(currCard.dataset.sindex)-1],library.indexOf(playlist))
    //         }
    //         else{
    //             playSong(playlist,songs[Number(currCard.dataset.sindex)-2],document.querySelectorAll(".songCard")[Number(currCard.dataset.sindex)-2]);
    //             displayCurrSong(playlist,songs[Number(currCard.dataset.sindex)-2],library.indexOf(playlist))
    //             console.log(playlist,songs[Number(currCard.dataset.sindex)-2],library.indexOf(playlist))
    //         }
    // }


    })
    document.querySelector(".next").addEventListener("click",async ()=>{
    let playlist=currCard.dataset.pl;
    let songs=await getSongs(currCard.dataset.pl)
    if(Array.from(document.querySelectorAll(".songCard")).indexOf(currCard)<Array.from(document.querySelectorAll(".songCard")).length-2){
        let prevEle=Array.from(document.querySelectorAll(".songCard"))[Array.from(document.querySelectorAll(".songCard")).indexOf(currCard)+1];
        playSong(playlist,songs[Number(prevEle.dataset.sindex)],prevEle);
        displayCurrSong(playlist,songs[Number(prevEle.dataset.sindex)],library.indexOf(playlist))
    }

    })
let plapau=document.querySelector(".plapau");
document.querySelector(".playbg").addEventListener("click",async ()=>{
    if (plapau.src.includes("assets/play.svg")){
        plapau.src="assets/pause.svg";
        audio.pause();
    }
    else{
        if(audio.src){
            plapau.src="assets/play.svg";
            audio.play();
            console.log("fsdfsdf")
        }
        else{
            let songs=await getSongs(library[0]);
            console.log("csfsfs")
            playSong(library[0],songs[0],document.querySelectorAll(".songCard")[0])
        }
    }
})
document.querySelector(".volrange").addEventListener("input",()=>{
    if(!audio.paused){
        audio.volume=document.querySelector(".volrange").value/100;
    }
})
let audioCurrVol=.5;
document.querySelector(".mute").value=50;
document.querySelector(".mute").addEventListener("click",()=>{
    if(document.querySelector(".mute").src.includes("volume.svg")){
        document.querySelector(".mute").src="assets/mute.svg";
        audioCurrVol=audio.volume;
        audio.volume=0;
        document.querySelector(".volrange").value=0;
        document.querySelector(".volrange").style.accentColor="white";
    }
    else{
        document.querySelector(".mute").src="assets/volume.svg";
        audio.volume=audioCurrVol;
        document.querySelector(".volrange").value=audioCurrVol*100;
        document.querySelector(".volrange").style.accentColor="#1db954";
    }
})
async function displayCurrSong(playlist,song,indexForCapLib){
    let songs=await getSongs(playlist);
    let songName=song;
    if (songName.substring(songName.length - 4).toLowerCase() == ".jpg" || songName.substring(songName.length - 4).toLowerCase() == ".png" || songName.substring(songName.length - 4).toLowerCase() == ".svg" || songName.substring(songName.length - 4) == ".gif" || songName.substring(songName.length - 5).toLowerCase() == ".jepg" || songName.substring(songName.length - 5).toLowerCase() == ".webp" || songName.substring(songName.length - 4).toLowerCase() == ".avif"){
        song=songs[songs.indexOf(song)+1];
    }
    let hasCover=false;
    

    songs.forEach(songName => {
        if (songName.substring(songName.length - 4).toLowerCase() == ".jpg" || songName.substring(songName.length - 4).toLowerCase() == ".png" || songName.substring(songName.length - 4).toLowerCase() == ".svg" || songName.substring(songName.length - 4) == ".gif" || songName.substring(songName.length - 5).toLowerCase() == ".jepg" || songName.substring(songName.length - 5).toLowerCase() == ".webp" || songName.substring(songName.length - 4).toLowerCase() == ".avif"){
            hasCover=true;
            document.querySelector(".currSong").innerHTML = `<div class="songCard">
                        <img src="library/${playlist}/${songName}" alt="">
                            <div class="info">
                         <div class="songName">${song.slice(0, song.lastIndexOf("."))}</div>
                                  <div class="songPL">${capLib[indexForCapLib]}</div>
                       </div>
                          </div>`;
        }
    });
    if(!hasCover){
        document.querySelector(".currSong").innerHTML = `<div class="songCard">
                        <div class="randBack2">
                        <img src="assets/music_note_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="">
                            </div>
                            <div class="info">
                         <div class="songName">${song.slice(0, song.lastIndexOf("."))}</div>
                                  <div class="songPL">${capLib[indexForCapLib]}</div>
                       </div>
                          </div>`;
                        document.querySelectorAll(".randBack2")[document.querySelectorAll(".randBack2").length - 1].style.background = Array.from(document.querySelectorAll(".playlistCard"))[indexForCapLib].querySelector(".randBack").style.background;
    }
}
async function main() {
    // console.log(library);
    library = await getLibrary()
    // let songs=await getSongs(library[0]);
    let song;
    for (let index = 0; index < library.length; index++) {
        const element = library[index];
        let songs = await getSongs(element);
        // let plCard=document.createElement("div");
        // plCard.innerHTML=;
        let hasCover = false;
        for (let indextemp = 0; indextemp < songs.length; indextemp++) {
            const songName = songs[indextemp];
            
        // }
        // songs.forEach(songName => {
            if (songName.substring(songName.length - 4).toLowerCase() == ".jpg" || songName.substring(songName.length - 4).toLowerCase() == ".png" || songName.substring(songName.length - 4).toLowerCase() == ".svg" || songName.substring(songName.length - 4) == ".gif" || songName.substring(songName.length - 5).toLowerCase() == ".jepg" || songName.substring(songName.length - 5).toLowerCase() == ".webp" || songName.substring(songName.length - 4).toLowerCase() == ".avif") {
                hasCover = true;
                document.querySelector(".library").innerHTML += `<div class="playlistCard"><img  src="library/${library[index]}/${songName}" alt="" class="cover">
                <div class="plName">${capLib[index]}</div>
                </div>`;
                
                if (index == 0) {
                    let sIndex=0;
                    document.querySelector(".playll").innerHTML = capLib[0];
                    let currSongImageRendered = false;
                    songs.forEach(element => {
                        
                        if (element.substring(element.length - 4).toLowerCase() == ".mp3" || element.substring(element.length - 4).toLowerCase() == ".mp4"){
                            document.querySelector(".songs").innerHTML += `<div class="songCard" data-sIndex="${sIndex}"
                            data-pl="${library[index]}">
                            <img src="library/${library[index]}/${songName}" alt="">
                            <div class="info">
                            <div class="songName">${element.slice(0, element.lastIndexOf("."))}
                            </div>
                            <div class="songPL">${capLib[0]}</div>
                            </div>
                            </div>`;
                            if(sIndex==0){audio.src=`library/${library[0]}/${element}`}
                        }
                            // console.log(document.querySelector(".songCard").dataset.pl)
                            sIndex++;
                        if (!currSongImageRendered) {
                            document.querySelector(".currSong").innerHTML = `<div class="songCard">
                        <img src="library/${library[index]}/${songName}" alt="">
                            <div class="info">
                         <div class="songName">${element.slice(0, element.lastIndexOf("."))}</div>
                                  <div class="songPL">${capLib[index]}</div>
                       </div>
                          </div>`;
                            currSongImageRendered = true;
                        }

                    });
                }
                break;
            }

        // });
        }
        if (!hasCover) {
            let prim1, prim2, prim3;
            let sec1 = 0, sec2 = 0, sec3 = 0;
            let diffColor = 192;
            let rand1 = Math.floor(Math.random() * 3) + 1;
            if (rand1 == 1) {
                prim1 = 0;
                let rand2 = Math.floor(Math.random() * 2) + 1;
                if (rand2 == 1) {
                    prim2 = 255;
                    sec2 = 255 - diffColor;
                    prim3 = Math.floor(Math.random() * 256);
                    if (prim3 > 128) sec3 = prim3 - diffColor;
                }
                else {
                    prim3 = 255;
                    sec3 = 255 - diffColor;
                    prim2 = Math.floor(Math.random() * 256);
                    if (prim2 > 128) sec2 = prim2 - diffColor;
                }
            }
            else if (rand1 == 2) {
                prim2 = 0;
                let rand2 = Math.floor(Math.random() * 2) + 1;
                if (rand2 == 1) {
                    prim1 = 255;
                    sec1 = 255 - diffColor;
                    prim3 = Math.floor(Math.random() * 256);
                    if (prim3 > 128) sec3 = prim3 - diffColor;
                }
                else {
                    prim3 = 255;
                    sec3 = 255 - diffColor;
                    prim1 = Math.floor(Math.random() * 256);
                    if (prim1 > 128) sec1 = prim1 - diffColor;
                }
            }
            else {
                prim3 = 0;
                let rand2 = Math.floor(Math.random() * 2) + 1;
                if (rand2 == 1) {
                    prim2 = 255;
                    sec2 = 255 - diffColor;
                    prim1 = Math.floor(Math.random() * 256);
                    if (prim1 > 128) sec1 = prim1 - diffColor;
                }
                else {
                    prim1 = 255;
                    sec1 = 255 - diffColor;
                    prim2 = Math.floor(Math.random() * 256);
                    if (prim2 > 128) sec2 = prim2 - diffColor;
                }
            }
            document.querySelector(".library").innerHTML += `<div class="playlistCard"><div class="randBack"><img src="assets/music_note_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="" class="cover"></div>
                    <div class="plName">${capLib[index]}</div>
                </div>`;
            document.querySelectorAll(".randBack")[document.querySelectorAll(".randBack").length - 1].style.background = `linear-gradient(135deg,rgb(${prim1},${prim2},${prim3}),rgb(${sec1},${sec2},${sec3}))`;
            if (index == 0) {
                let sIndex=0;
                document.querySelector(".playll").innerHTML = capLib[0];
                let currSongImageRendered = false;
                songs.forEach(element => {
                    if (element.substring(element.length - 4).toLowerCase() == ".mp3" || element.substring(element.length - 4).toLowerCase() == ".mp4"){
                        document.querySelector(".songs").innerHTML += `<div class="songCard"  data-pl="${library[index]}" data-sIndex="${sIndex}"><div class="back2 randBack">
                            <img src="assets/music_note_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"  alt="">
                            </div>
                            <div class="info">
                            <div class="songName">${element.slice(0, element.lastIndexOf("."))}
                            </div>
                            <div class="songPL">${capLib[0]}</div>
                            </div>
                            </div>`;
                            
                            // console.log(document.querySelector(".songCard").dataset.pl)
                    document.querySelectorAll(".back2")[document.querySelectorAll(".back2").length - 1].style.background = `linear-gradient(135deg,rgb(${prim1},${prim2},${prim3}),rgb(${sec1},${sec2},${sec3}))`;
                    if (!currSongImageRendered) {
                        // document.querySelector(".randBack2").style.
                        document.querySelector(".currSong").innerHTML = `<div class="songCard">
                        <div class="randBack2">
                        <img src="assets/music_note_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="">
                            </div>
                            <div class="info">
                         <div class="songName">${element.slice(0, element.lastIndexOf("."))}</div>
                                  <div class="songPL">${capLib[0]}</div>
                       </div>
                          </div>`;
                        document.querySelectorAll(".randBack2")[document.querySelectorAll(".randBack2").length - 1].style.background = `linear-gradient(135deg,rgb(${prim1},${prim2},${prim3}),rgb(${sec1},${sec2},${sec3}))`;
                        // document.querySelector(".currSong").getElementsByTagName("img")[0].src = `assets/music_note_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg`;
                        // // console.log(element)
                        // document.querySelector(".currSong").querySelector(".songName").innerHTML = `${element.slice(0, element.lastIndexOf("."))}`;
                        // document.querySelector(".currSong").querySelector(".songPL").innerHTML = `${capLib[0]}`;
                        currSongImageRendered = true;
                    }
                }
                sIndex++;
                });
            }
    //         for (let indexOfSong = 0; indexOfSong < document.querySelectorAll(".songCard").length; indexOfSong++) {
    //             let songs=await getSongs(library[0]);
    //             const element = document.querySelectorAll(".songCard")[indexOfSong];
    //             element.addEventListener("click",()=>{
    //                 if((songs[indexOfSong].substring(songs[indexOfSong].length - 4).toLowerCase() == ".mp3" || songs[indexOfSong].substring(songs[indexOfSong].length - 4).toLowerCase() == ".mp4")){
    //                     // console.log(songs[indexOfSong])
    //             playSong(library[0],songs[indexOfSong])
    //         }
    //         else{
    //             playSong(library[0],songs[indexOfSong+1])
    //         }
    //     })       
    // }
        }

    }
    // let i=0;
    for (let indexOfSong = 0; indexOfSong < document.querySelectorAll(".songCard").length; indexOfSong++) {
                const element = document.querySelectorAll(".songCard")[indexOfSong];
                // i++;
                let songs=await getSongs(library[0]);
                element.addEventListener("click",async ()=>{
                    playSong(library[0],songs[Number(element.dataset.sindex)],element)
                    // console.log(library[0],songs[indexOfSong],element,indexOfSong);
                    displayCurrSong(library[0],songs[Number(element.dataset.sindex)],0);
                            })       
    }
                    // if((songs[indexOfSong].substring(songs[indexOfSong].length - 4).toLowerCase() == ".mp3" || songs[indexOfSong].substring(songs[indexOfSong].length - 4).toLowerCase() == ".mp4")){
                        // console.log(songs[indexOfSong])
            // }
            // else{
                
            //     playSong(library[0],songs[indexOfSong+1],element)
            //     console.log(library[0],songs[indexOfSong+1],element,indexOfSong+1);
            //     displayCurrSong(library[0],songs[indexOfSong+1],0);
            //     indexOfSong++;
            // }
            // audio.addEventListener("timeupdate",()=>{
            //     element.style.backgroundColor="#1f1f1f";
            // })
            // audio.addEventListener("ended",()=>{
            //     element.style.backgroundColor="#a05050";
            // })

    for (let index = 0; index < Array.from(document.querySelectorAll(".playlistCard")).length; index++) {
        const element = Array.from(document.querySelectorAll(".playlistCard"))[index];
        element.addEventListener("click", async () => {
            // for (let index = 0; index < library.length; index++) {
            const element = library[index];
                
            document.querySelector(".songs").innerHTML="";
            document.querySelector(".playll").innerHTML = capLib[index];
            let songs = await getSongs(element);
                // let plCard=document.createElement("div");
                // plCard.innerHTML=;
            let hasCover = false;
            for (let indextemp = 0; indextemp < songs.length; indextemp++) {
            const songName = songs[indextemp];
            // songs.forEach(songName => {
                
                if (songName.substring(songName.length - 4).toLowerCase() == ".jpg" || songName.substring(songName.length - 4).toLowerCase() == ".png" || songName.substring(songName.length - 4).toLowerCase() == ".svg" || songName.substring(songName.length - 4) == ".gif" || songName.substring(songName.length - 5).toLowerCase() == ".jepg" || songName.substring(songName.length - 5).toLowerCase() == ".webp" || songName.substring(songName.length - 4).toLowerCase() == ".avif") {
                    hasCover = true;
                    let currSongImageRendered = false;
                    let sIndex=0;
                    songs.forEach(element => {
                    if (element.substring(element.length - 4).toLowerCase() == ".mp3" || element.substring(element.length - 4).toLowerCase() == ".mp4"){
                        document.querySelector(".songs").insertAdjacentHTML("beforeend",`<div class="songCard" data-sIndex="${sIndex}" data-pl="${library[index]}">
                        <img src="library/${library[index]}/${songName}" alt="">
                        <div class="info">
                        <div class="songName">${element.slice(0, element.lastIndexOf("."))}
                        </div>
                        <div class="songPL">${capLib[index]}</div>
                        </div>
                        </div>`);
                        
                        // document.querySelectorAll(".songCard")[document.querySelectorAll(".songCard").length-1].addEventListener("click",()=>{
                        //     playSong(library[index],element)
                        //     console.log(element)
                        // })
                        // document.querySelectorAll(".songCard")[document.querySelectorAll(".songCard").length-1].addEventListener("click",()=>{
                        //     console.log("yo i was clicked")
                        // })
    //                     document.querySelectorAll(".songCard").forEach(e=>{
    // e.style.border = "2px solid red"
// })
                        // Array.from(document.getElementsByClassName("songCard")).forEach(e => {
                        //     let i=1;
                        //     i++;
                        //     e.addEventListener("click", ()=>{
                        //         playSong(library[index],songs[i])
                        //         console.log(songs[i]);
                        // });
                        // }); 
                    }
                    sIndex++;
                        // console.log(document.querySelector(".songCard").dataset.pl)
                        if (!currSongImageRendered) {
                            // document.querySelector(".currSong").getElementsByTagName("img")[0].src = `library/${library[index]}/${songName}`;
                            // // console.log(element)
                            // document.querySelector(".currSong").querySelector(".songName").innerHTML = `${element.slice(0, element.lastIndexOf("."))}`;
                            // document.querySelector(".currSong").querySelector(".songPL").innerHTML = `${capLib[index]}`;
                            document.querySelector(".currSong").innerHTML = `<div class="songCard">
                        <img src="library/${library[index]}/${songName}" alt="">
                            <div class="info">
                         <div class="songName">${element.slice(0, element.lastIndexOf("."))}</div>
                                  <div class="songPL">${capLib[index]}</div>
                       </div>
                          </div>`;
                            currSongImageRendered = true;
                        }
                    });
                    break;
                }
            // });
            }
            for (let indexOfSong = 0; indexOfSong < document.querySelectorAll(".songCard").length; indexOfSong++) {
                const element = document.querySelectorAll(".songCard")[indexOfSong];
                element.addEventListener("click",async ()=>{
                    playSong(element.dataset.pl,songs[Number(element.dataset.sindex)],element)
                    console.log(element.dataset.pl,songs[Number(element.dataset.sindex)],element,Number(element.dataset.sindex));
                    displayCurrSong(element.dataset.pl,songs[Number(element.dataset.sindex)],library.indexOf(element.dataset.pl));
                            })    
    }
            
            if (!hasCover){
                // console.log("hghgh");
                // if (index == 0) {
                // document.querySelector(".playll").innerHTML = capLib[index];
                let currSongImageRendered = false;
                let sIndex=0;
                songs.forEach(element => {
                    if (element.substring(element.length - 4).toLowerCase() == ".mp3" || element.substring(element.length - 4).toLowerCase() == ".mp4")
                        document.querySelector(".songs").innerHTML += `<div class="songCard" data-sIndex="${sIndex}" data-pl="${library[index]}"><div class="back2 randBack">
                            <img src="assets/music_note_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"  alt="">
                            </div>
                            <div class="info">
                            <div class="songName">${element.slice(0, element.lastIndexOf("."))}
                            </div>
                            <div class="songPL">${capLib[index]}</div>
                            </div>
                            </div>`;
                            sIndex++;
                    // console.log(document.querySelector(".songCard").dataset.pl)
                    document.querySelectorAll(".back2")[document.querySelectorAll(".back2").length - 1].style.background = Array.from(document.querySelectorAll(".playlistCard"))[index].querySelector(".randBack").style.background;
                    if (!currSongImageRendered) {
                        // document.querySelector(".randBack2").style.
                        document.querySelector(".currSong").innerHTML = `<div class="songCard">
                        <div class="randBack2">
                        <img src="assets/music_note_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="">
                            </div>
                            <div class="info">
                         <div class="songName">${element.slice(0, element.lastIndexOf("."))}</div>
                                  <div class="songPL">${capLib[index]}</div>
                       </div>
                          </div>`;
                        document.querySelectorAll(".randBack2")[document.querySelectorAll(".randBack2").length - 1].style.background = Array.from(document.querySelectorAll(".playlistCard"))[index].querySelector(".randBack").style.background;
                        // document.querySelector(".currSong").getElementsByTagName("img")[0].src = `assets/music_note_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg`;
                        // // console.log(element)
                        // document.querySelector(".currSong").querySelector(".songName").innerHTML = `${element.slice(0, element.lastIndexOf("."))}`;
                        // document.querySelector(".currSong").querySelector(".songPL").innerHTML = `${capLib[0]}`;
                        currSongImageRendered = true;
                    }
                });
                for (let indexOfSong = 0; indexOfSong < document.querySelectorAll(".songCard").length; indexOfSong++) {
                const element = document.querySelectorAll(".songCard")[indexOfSong];
                element.addEventListener("click",async ()=>{
                    playSong(element.dataset.pl,songs[Number(element.dataset.sindex)],element)
                    // console.log(element.dataset.pl,songs[indexOfSong],element,indexOfSong);
                    displayCurrSong(element.dataset.pl,songs[Number(element.dataset.sindex)],library.indexOf(element.dataset.pl));
                            })       
    }
            // }
            }
            displayCurrSong(library[index],songs[0],index);
            setTimeout(() => {
                playSong(library[index],songs[0],document.querySelector(".songCard"))
            }, 200);
        });
        
    }
    // for (let songIndex = 0; songIndex < Array.from(document.getElementsByClassName("songCard")).length; songIndex++) {
    //     const element = Array.from(document.getElementsByClassName("songCard"))[songIndex];
    //     element.addEventListener("click",async ()=>{
    //         // let clickedSong=element.
    //         let songs=await getSongs(document.getElementsByClassName("songCard")[0].dataset.pl);

    //         if((songs[songIndex].substring(songs[songIndex].length - 4).toLowerCase() == ".mp3" || songs[songIndex].substring(songs[songIndex].length - 4).toLowerCase() == ".mp4")){
    //             playSong(document.getElementsByClassName("songCard")[0].dataset.pl,songs[songIndex]);
    //         console.log(document.getElementsByClassName("songCard")[0].dataset.pl,songs[songIndex])
    //         }
    //         else{
    //             playSong(document.getElementsByClassName("songCard")[0].dataset.pl,songs[songIndex+1]);
    //             console.log(document.getElementsByClassName("songCard")[0].dataset.pl,songs[songIndex+1])
    //         }
    //     })
    // }
            //   console.log(document.querySelector(".songCard").dataset.pl);  
}
main();
            // if(element.getElementsByTagName("img").src!="assets/music_note_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"){
            // let songs= await getSongs(library[index]);
            // let currSongImageRendered=false;
            // songs.array.forEach(imageName => {
            //     if(imageName)
            // });

            //             songs.forEach(element => {
            //                     if (element.substring(element.length - 4).toLowerCase() == ".mp3" || element.substring(element.length - 4) == ".mp4")
            //                         document.querySelector(".songs").innerHTML += `<div class="songCard">
            //                         <img src="library/${library[index]}/${element}" alt="">
            //                         <div class="info">
            //                         <div class="songName">${element.slice(0, element.lastIndexOf("."))}
            //                         </div>
            //                         <div class="songPL">${capLib[0]}</div>
            //                         </div>
            //                         </div>`;

            //                     if (!currSongImageRendered) {
            //                         document.querySelector(".currSong").getElementsByTagName("img")[0].src = `library/${library[index]}/${element}`;
            //                         // console.log(element)
            //                         document.querySelector(".currSong").querySelector(".songName").innerHTML = `${element.slice(0, element.lastIndexOf("."))}`;
            //                         document.querySelector(".currSong").querySelector(".songPL").innerHTML = `${capLib[0]}`;
            //                         currSongImageRendered = true;
            //                     }

            //                 });
            //         }
            //     })
            // }
            // Array.from(document.querySelectorAll(".playlistCard")).forEach(element => {
            //     element.addEventListener("click",()=>{
            //         if(element.getElementsByTagName("img").src=="assets/music_note_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"){
            //             let songs=getSongs()
            //         }
            //     })
            // }); 
            // if(library.length>0){
            //     getSongs(library[0]).forEach(element => {
            //         document.querySelector(".songs").innerHTML+=`<div class="songCard">
            //                 <img src="library/non copyright sounds/cover.jpg" alt="">
            //                 <div class="info">
            //                     <div class="songName">Daftar Ki Girl _ Yo Yo Honey Singh _ Desi Kalakaar, Honey Singh New Songs
            //                         2014</div>
            //                     <div class="songPL">Yo Yo Honey Singh</div>
            //                 </div>
            //             </div>`;
            //     });
            // }
            // console.log(covers);
