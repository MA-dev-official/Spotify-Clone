document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0px"
})
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-150%"
})
let songs = [];

let currentSong = null;
let currentCard = null;
async function getFolder() {
  let folder = []
  let d = await fetch(`/songs/`)
  let data = await d.text()
  let div = document.createElement("div")
  div.innerHTML = data
  let as = div.getElementsByTagName("a")
  for (const a of as) {
    if (a.href !== location.origin + "/") {
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
    if (a.href.endsWith(".mp3") || a.href.endsWith(".wav") || a.href.endsWith(".flac") || a.href.endsWith(".aac") || a.href.endsWith(".ogg") || a.href.endsWith(".m4a")) {
    songs.push(a.href);
}
  }
  
  
  // Clear the playlist before adding new songs
  if (songs.length > 0) {
    document.querySelector(".playlist").innerHTML = "";
    songs.forEach(async (song) => {
      let a = song;
      let b = a.split("/").pop().replaceAll("%20", " ");
    let name = b.split(".").shift()
      let card = document.createElement("div");
      card.classList.add("card");
      card.classList.add("rounded");
      card.innerHTML = ` <div class = "df ai jc" >🎵</div>
                        <h2>${name}</h2>
                        <div><img src="/imgs/play.svg" alt="" class="invert play" width = "25" ></div>`;
      
      document.querySelector(".playlist").appendChild(card);
      card.querySelector(".play").addEventListener("click", () => {
  if(currentSong ) {
    if (currentSong.src.includes(song)) {
      if (!currentSong.paused) {
        currentSong.pause();
        card.querySelector(".play").src = "/imgs/play.svg"
      } else {
        currentSong.play();
        card.querySelector(".play").src = "/imgs/pause.svg"
      }
      return;
    } else {
      currentSong.pause();
      if (currentCard) {
        currentCard.querySelector(".play").src = "/imgs/play.svg"
      }
    }
  }

  currentSong = new Audio(song);
  currentSong.play();
        card.querySelector(".play").src = "/imgs/pause.svg"
        currentCard = card 
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
      
        if (a.href.endsWith(".jpg") ||
          a.href.endsWith(".jpeg") ||
          a.href.endsWith(".png") ||
          a.href.endsWith(".gif") ||
          a.href.endsWith(".bmp") ||
          a.href.endsWith(".svg") ||
          a.href.endsWith(".webp")) {
          card.querySelector(".img").style.backgroundImage = `url(${a.href})`
        }
      
    }
    
    document.querySelector(".cardContainer").appendChild(card);
    card.addEventListener("click", () => {
      playMusic(url)
      document.querySelector(".left").style.left = "0px"
    })
  });
}

main();