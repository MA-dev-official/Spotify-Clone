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

function updateName(url) {
  let b = url.src
  let a = b.split("/").pop().replaceAll("%20", " ");
  let name = a.replace(".mp3", "");
  document.querySelector(".name").innerHTML = name;
}

function duration(currentSong) {
  let duration =  formatTime(currentSong.duration)
  let time = formatTime(currentSong.currentTime)
  document.querySelector(".duration").innerHTML = `${time}/${duration}`
  document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  document.querySelector(".seek").addEventListener("click", (e) => {
    let seekBar = e.currentTarget; // Seek bar element
    let clickPosition = e.offsetX; // Clicked position
    let seekBarWidth = seekBar.clientWidth; // Total width of seek bar
    let percentage = clickPosition / seekBarWidth; // Percentage of click
    let newTime = currentSong.duration * percentage; // New song time

    currentSong.currentTime = newTime; // Update song time
    document.querySelector(".circle").style.left = (percentage * 100) + "%"; // Move circle
});

// Update seek bar during playback
currentSong.addEventListener("timeupdate", () => {
    let percentage = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".circle").style.left = percentage + "%";
});

// Handle song end
currentSong.addEventListener("ended", () => {
    currentSong.pause(); // Pause the song
    currentSong.currentTime = 0; // Reset to start
    document.querySelector(".circle").style.left = "0%"; // Move circle to start
    document.querySelector(".playBtn").src = "/imgs/play.svg"; // Change play button
});
}


function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity) {
    return "00:00"; // Jab tak value load na ho, tab tak 00:00 return karein
  }

  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);

  // Agar minutes ya seconds single digit ho to leading zero add karein
  let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  let formattedSeconds = secs < 10 ? "0" + secs : secs;

  return `${formattedMinutes}:${formattedSeconds}`;
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
        document.querySelector(".playBtn").src = "/imgs/play.svg"
      } else {
        currentSong.play();
        card.querySelector(".play").src = "/imgs/pause.svg"
        document.querySelector(".playBtn").src = "/imgs/pause.svg"
      }
      return;
    } else {
      currentSong.pause();
      if (currentCard) {
        currentCard.querySelector(".play").src = "/imgs/play.svg"
        document.querySelector(".playBtn").src = "/imgs/play.svg"
      }
    }
  }

  currentSong = new Audio(song);
  currentSong.play();
        card.querySelector(".play").src = "/imgs/pause.svg"
        document.querySelector(".playBtn").src = "/imgs/pause.svg"
        currentCard = card 
        updateName(currentSong)
        currentSong.addEventListener("timeupdate", () => {
  duration(currentSong);
});
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
      document.querySelector(".playlist").style.backgroundColor = "#0c0c0c"
    })
  });
  document.querySelector(".playBtn").addEventListener("click",()=>{
    if (!currentSong.paused) {
      currentSong.pause()
      document.querySelector(".playBtn").src = "/imgs/play.svg"
    } else {
      currentSong.play()
      document.querySelector(".playBtn").src = "/imgs/pause.svg"
    }
  });
  
  //Previous Button 
  
  document.querySelector(".prevBtn").addEventListener("click", () => {
  if (songs.length === 0 || !currentSong) return; // Agar koi song available nahi hai to return kar do
  
  let currentIndex = songs.indexOf(currentSong.src); // Current song ka index le lo

  if (currentIndex > 0) {
    currentIndex--; // Peechli song pe jaane ke liye index kam karna hai
  } else {
    currentIndex = songs.length - 1; // Agar pehla song hai to last pe chala jaye
  }

  // Naya song play karo
  currentSong.pause();
  currentSong = new Audio(songs[currentIndex]);
  currentSong.play();
updateName(currentSong)
currentSong.addEventListener("timeupdate", () => {
  duration(currentSong);
});
  // Play button update karo
  document.querySelector(".playBtn").src = "/imgs/pause.svg";

  // Jo card play ho raha hai usko update karo
  if (currentCard) {
    currentCard.querySelector(".play").src = "/imgs/play.svg";
  }

  let allCards = document.querySelectorAll(".playlist .card");
  currentCard = allCards[currentIndex];
  currentCard.querySelector(".play").src = "/imgs/pause.svg";
});

document.querySelector(".nextBtn").addEventListener("click", () => {
  if (songs.length === 0 || !currentSong) return; // Agar koi song nahi hai to return kar do
  
  let currentIndex = songs.indexOf(currentSong.src); // Current song ka index le lo

  if (currentIndex < songs.length - 1) {
    currentIndex++; // Agle song pe jaane ke liye index badhao
  } else {
    currentIndex = 0; // Agar last song hai to pehla play karo
  }

  // Naya song play karo
  currentSong.pause();
  currentSong = new Audio(songs[currentIndex]);
  currentSong.play();
 updateName(currentSong)
 currentSong.addEventListener("timeupdate", () => {
  duration(currentSong);
});
  // Play button update karo
  document.querySelector(".playBtn").src = "/imgs/pause.svg";

  // Jo card play ho raha hai usko update karo
  if (currentCard) {
    currentCard.querySelector(".play").src = "/imgs/play.svg";
  }

  let allCards = document.querySelectorAll(".playlist .card");
  currentCard = allCards[currentIndex];
  currentCard.querySelector(".play").src = "/imgs/pause.svg";
});
  
}

main();