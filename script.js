let currentSongIndex = 0
const playListButton = document.getElementById("play-list-button");
const playList = document.querySelector(".play-list");
const playListBar = document.querySelector(".play-list-bar");
const playListTitle = document.querySelector(".play-list-title");

const previousButton = document.getElementById("previous");
const playPauseButton = document.getElementById("play-pause");
const stopButton = document.getElementById("stop");
const nextButton = document.getElementById("next");
const progressBar = document.getElementById("progress");
const audio = document.getElementById("audio");
const playerSongTitle = document.getElementById("player-song-title");
const playerSongArtist = document.getElementById("player-song-artist");
const songAlbumArtElement = document.getElementById("song-album-art");
const shuffleButton = document.getElementById("shuffle");
const shuffleOff = document.getElementById("shuffle-off")
const shuffleOn = document.getElementById("shuffle-on")
const repeatButton = document.getElementById("repeat");
const repeatOff = document.getElementById("repeat-off");
const repeatOn = document.getElementById("repeat-on");
const plaulistContainer = document.querySelector(".play-list-container");
const playlistUl = document.getElementById("playlist");
const addSongBtn = document.getElementById("add-song-btn");
const removeSongBtn = document.getElementById("remove-song-btn");
const errorMessageElement = document.getElementById("error-message");
const songDurationElement = document.getElementById('player-song-duration');



let defaultPlaylist = [
    {
        id:0,
        title: "Yo Le Le",
        artist: "Youssou N'Dour",
        duration: "6:25",
        src: "./assets/songs/05-Yo Le Le.mp3", 
    },
    {
        id:1,
        title: "Without a smile",
        artist: "Youssou N'Dour",
        duration: "4:12",
        src: "./assets/songs/06-Without a smile.mp3",
    },
    {
        id:2,
        title: "Please wait",
        artist: "Youssou N'Dour",
        duration: "2:37",
        src: "./assets/songs/07-Please wait.mp3"
    }
]


playListButton.addEventListener('click', () =>{
    playList.classList.toggle('open');
    playListBar.classList.toggle('open');
    playListTitle.classList.toggle('open');
});
    
// Update song information when the song changes   



function updateSongInfo() {
  const currentSong = defaultPlaylist[currentSongIndex];
  playerSongTitle.textContent = currentSong.title;
  playerSongArtist.textContent = currentSong.artist;
  songAlbumArtElement.src = currentSong.albumArt || './assets/songs/NabulimeMix.webp';
}


previousButton.addEventListener('click', playPreviousSong);
nextButton.addEventListener('click', playNextSong);

// Play/pause function

audio.src = defaultPlaylist[0].src;
audio.load();
updateSongInfo(); 

playPauseButton.addEventListener('click', () => {
  if (!audio.src === '') {
  
  }
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});


stopButton.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
});


// Aids next song to play automatically 
audio.addEventListener('ended', playNextSong);


//  Update playNextSong and playPreviousSong

function playNextSong() {
  if (defaultPlaylist.length > 0) {
    currentSongIndex = (currentSongIndex + 1) % defaultPlaylist.length;
    audio.src = defaultPlaylist[currentSongIndex].src;
    audio.play();
    updateSongInfo();
  } else {
    console.error('No songs in the playlist');
  }
}



function playPreviousSong() {
  currentSongIndex = (currentSongIndex - 1 + defaultPlaylist.length) % defaultPlaylist.length;
  audio.src = defaultPlaylist[currentSongIndex].src;
  audio.play();
  updateSongInfo();
}


// Play Back progressive bar. Update progress bar on time update event


audio.addEventListener("timeupdate", ()=>{
  if (audio.duration && !isNaN(audio.duration)) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
  }

});

progressBar.addEventListener('click', (e) => {
  const clickedPosition = e.clientX - progressBar.offsetLeft;
  const progressBarWidth = progressBar.offsetWidth;
  const audioDuration = audio.duration;
  const newPlaybackPosition = (clickedPosition / progressBarWidth) * audioDuration;
  audio.currentTime = newPlaybackPosition;
});

progressBar.addEventListener('mousedown', (e) => {
  const progressBarWidth = progressBar.offsetWidth;
  const audioDuration = audio.duration;
  let mouseMoveHandler = (e) => {
    const mousePosition = e.clientX - progressBar.offsetLeft;
    const newPlaybackPosition = (mousePosition / progressBarWidth) * audioDuration;
    audio.currentTime = newPlaybackPosition;
  };
  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', mouseMoveHandler);
  });
});

// Song duration

audio.addEventListener('timeupdate', () => {
  const currentTime = audio.currentTime;
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);
  songDurationElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  // songDurationElement.style.color = '#f1be32'
});

// Error Handling

  
audio.addEventListener("error", (event) => {
  console.error("Error loading song:", event.target.error);
  displayErrorMessage("Error loading song. Please try again.");
});


// Function to display error massage

function displayErrorMessage(message){
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = "block";

    setTimeout(() =>{
        errorMessageElement.display = "none";
    }, 3000); 
    /*This will hide error msg after 3 seconds */
}



// Shuffle and repeat functions



let shuffleEnabled = false;

shuffleButton.addEventListener('click', () => {
  const shuffledPlaylist = [...defaultPlaylist];
  for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
  }
  shuffleEnabled = !shuffleEnabled; 
  if (shuffleEnabled) {
  shuffleOff.style.display = "none";
  shuffleOn.style.display = "block";
  shuffleOn.style.fill = "#f1be32";
  } else {
    shuffleOff.style.display = "block";
  shuffleOn.style.display = "none";
  }

  defaultPlaylist = shuffledPlaylist;
  currentSongIndex = 0;
  defaultPlaylist[currentSongIndex].src;
  audio.play();
  updateSongInfo();
});


// Repeat function
let repeatEnabled = false;

repeatButton.addEventListener('click', () => {
  repeatEnabled = !repeatEnabled;

  if (repeatEnabled) {
  repeatOff.style.display = "none"
   repeatOn.style.display = "block"
    repeatOn.style.fill = "#f1be32"
  } else {
     repeatOff.style.display = "block"
   repeatOn.style.display = "none"
  }
});

// Update the playNextSong function
function playNextSong() {
  if (repeatEnabled) {
    currentSongIndex = (currentSongIndex + 1) % defaultPlaylist.length;
  } else {
    if (currentSongIndex === defaultPlaylist.length - 1) {
      currentSongIndex = 0;
    } else {
      currentSongIndex++;
    }
  }
  if (defaultPlaylist.length > 0 && currentSongIndex >= 0 && currentSongIndex < defaultPlaylist.length) {
    audio.src = defaultPlaylist[currentSongIndex].src; // Assign src property to audio element
    audio.play();
    updateSongInfo();
  } else {
    console.error('Invalid song index or empty song list');
  }
}

let playlist = [];

// Function to generate song list
function generateSongList(){
  playlistUl.innerHTML = '',
  playlist.forEach((song, index) =>{
    const songLi = document.createElement('li');
    songLi.textContent = `${song.title} - ${song.artist} (${song.duration})`;
    playlistUl.appendChild(songLi);
  });
}

// Function to add song to playlist
function removeSongFromPlaylist(index) {
  if (index >= 0 && index < playlist.length) {
    playlist.splice(index, 1);
    if (index === currentSongIndex) {
      currentSongIndex--;
      if (currentSongIndex < 0) {
        currentSongIndex = 0;
      }
      audio.src = playlist[currentSongIndex].src;
      audio.play();
    }
    updateSongInfo(); // Added here
    generateSongList();
  } else {
    console.error('Invalid song index');
  }
}





function addSongToPlaylist(song) {
  playlist.push(song);
  generateSongList();
}

// Add event listeners
addSongBtn.addEventListener('click', () =>{
   // Prompt user to input song details
   const songTitle = prompt('Enter song title:');
   const songArtist = prompt('Enter song artist:');
   const songDuration = prompt('Enter song duration:');
   const song = { title: songTitle, artist: songArtist, duration: songDuration };
   addSongToPlaylist(song);
 
});

removeSongBtn.addEventListener('click', () => {
  // Prompt user to select song to remove
  const index = parseInt(prompt('Enter song index to remove:'));
  removeSongFromPlaylist(index);
});

const playlistSongsElement = document.getElementById('playlist-songs');

defaultPlaylist.forEach((song, index) => {
  const playlistSongElement = document.createElement('li');
  playlistSongElement.textContent = `${song.title} by ${song.artist} ${song.duration}`;
  playlistSongElement.draggable = true;
  playlistSongElement.dataset.index = index; // or playlistSongElement.setAttribute('data-index', index);
  playlistSongsElement.appendChild(playlistSongElement);
});



//Add event listeners for drag-and-drop
playlistUl.addEventListener('dragstart', (e) => {
  const li = e.target;
  li.classList.add('dragging');
  e.dataTransfer.setData('text', li.dataset.index);
});

playlistUl.addEventListener('dragend', (e) => {
  const li = e.target;
  li.classList.remove('dragging');
});

playlistUl.addEventListener('dragover', (e) => {
  e.preventDefault();
});

playlistUl.addEventListener('drop', (e) => {
  e.preventDefault();
  const li = e.target;
  const index = e.dataTransfer.getData('text');
  const song = playlist[index];
  const newIndex = Array.prototype.indexOf.call(playlistUl.children, li);
  playlist.splice(index, 1);
  playlist.splice(newIndex, 0, song);
  generateSongList();
});
