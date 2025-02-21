let port = 3000
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0px"
})
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-150%"
})
let songs = [];
let currentSong ;

async function getFolder() {
    let folder = []
    let d = await fetch(`http://127.0.0.1:${port}/songs/`)
    let data = await d.text()
    let div = document.createElement("div")
    div.innerHTML = data
    let as = div.getElementsByTagName("a")
    for (const a of as) {
        if (!a.href.endsWith(`${port}/`)) {
            folder.push(a.href);
        }
    }
    return folder
}

async function playMusic(url) {
    songs = [];
    let d = await fetch(url);
    let data = await d.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.getElementsByTagName("a");
    for (const a of as) {
        if (a.href.endsWith(".mp3")) {
            songs.push(a.href);
        }
    }
    console.log(songs);

    // Clear the playlist before adding new songs
    if (songs.length > 0) {
        document.querySelector(".playlist").innerHTML = "";
    songs.forEach(async (song) => {
        let a = song;
        let name = a.split("/").pop().replace(".mp3", "").replaceAll("%20", " ");

        let card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("rounded");
        card.innerHTML = ` <div>🎵</div>
                        <h2>${name}</h2>
                        <div class="play"><img src="/imgs/play.svg" alt="" class="invert"></div>`;

       document.querySelector(".playlist").appendChild(card);
       card.querySelector(".play").addEventListener("click",()=>{
        
        currentSong = song;
        let audio = new Audio(currentSong);
        audio.play();
       })
    });
        
    }
}
async function main() {
    let data = await getFolder()
    
    data.forEach(async url => {
        
            let d = await fetch(url);
            if (!d.ok) throw new Error(`HTTP error! status: ${d.status}`);
            let data = await d.text();
            let div = document.createElement("div");
            div.innerHTML = data;
            let as = div.getElementsByTagName("a");

            let a = url.trim().split(`/songs/`).pop().replaceAll("%20", "_").split("/")
            let name = a[0]

            let card = document.createElement("div")
            card.classList.add("card")
            card.classList.add("bd")
            card.innerHTML = `<div class="img "></div>
                              <h2>${name}</h2>`

            for (const a of as) {
                if (!a.href.endsWith(`${port}/`)) {
                    if (a.href.endsWith(".jpg"||".jpeg"||".png"||".gif"||".bmp"||".svg"||".webp")) {
                        console.log(a.href);
                        card.querySelector(".img").style.backgroundImage = `url(${a.href})`
                    }
                }
            }
            
            document.querySelector(".cardContainer").appendChild(card);
       card.addEventListener("click",()=>{
        playMusic(url)
       })
    });
}

main();