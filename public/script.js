const ROW1_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8']
const ROW2_KEYS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i']
const ROW3_KEYS = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k']
const ROW4_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',']

const recordButton = document.querySelector('.record-button')
const playButton = document.querySelector('.play-button')
const saveButton = document.querySelector('.save-button')
const songLink = document.querySelector('.song-link')
const drums = document.querySelectorAll('.drum')
const row1 = document.querySelectorAll('.drum.r1')
const row2 = document.querySelectorAll('.drum.r2')
const row3 = document.querySelectorAll('.drum.r3')
const row4 = document.querySelectorAll('.drum.r4')

const drumMap = [...drums].reduce((map, drum) => {
    map[drum.dataset.note] = drum
    return map
}, {})

let recordingStartTime
let songNotes = currentSong && currentSong.notes

drums.forEach(drum => {
    drum.addEventListener('click', () => playDrum(drum))
})

if (recordButton) {
    recordButton.addEventListener('click', toggleRecording)
}
if (saveButton) {
    saveButton.addEventListener('click', saveSong)
}
playButton.addEventListener('click', playSong)

document.addEventListener('keydown', e => {
    if (e.repeat) return
    const key = e.key
    const row1index = ROW1_KEYS.indexOf(key)
    const row2index = ROW2_KEYS.indexOf(key)
    const row3index = ROW3_KEYS.indexOf(key)
    const row4index = ROW4_KEYS.indexOf(key)
  
    if (row1index > -1)  {
        playDrum(row1[row1index])
    } else if (row2index > -1) {
        playDrum(row2[row2index])
    } else if (row3index > -1) {
        playDrum(row3[row3index])
    } else if (row4index > -1) {
        playDrum(row4[row4index])
    }
})

function toggleRecording() {
    recordButton.classList.toggle('active')
    if (isRecording()) {
        startRecording()
    } else {
        stopRecording()
    }
}

function isRecording() {
    return recordButton != null && recordButton.classList.contains('active')
}

function startRecording() {
    recordingStartTime = Date.now()
    songNotes = []
    playButton.classList.remove('show')
    saveButton.classList.remove('show')
}

function stopRecording() {
    playSong()
    playButton.classList.add('show')
    saveButton.classList.add('show')
}

function playSong() {
    if (songNotes.length === 0) return
    songNotes.forEach(note => {
        setTimeout(() => {
            playDrum(drumMap[note.key])
        }, note.startTime)
    })
}

function playDrum(drum) {
    if (isRecording()) recordNote(drum.dataset.note)
    const noteAudio = document.getElementById(drum.dataset.note)
    noteAudio.currentTime = 0
    noteAudio.play()
    drum.classList.add('active')
    noteAudio.addEventListener('ended', () => {
        drum.classList.remove('active')
    })
}

function recordNote(note) {
    songNotes.push({
        key: note,
        startTime: Date.now() - recordingStartTime
    })
}

function saveSong() {
    axios.post('/songs', { songNotes: songNotes }).then(res => {
        songLink.classList.add('show')
        songLink.href = `/songs/${res.data._id}`
    })
}