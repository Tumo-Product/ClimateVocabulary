const audioManager = {
    getAudioStream: async() => {
        return navigator.mediaDevices.getUserMedia({ audio: true });
    },

    setAudioSource: async (source) => {
        document.getElementById("voice").currentTime = 0;
        document.getElementById("voice").src = source;
    },

    play: async (index) => {
        document.getElementById("voice").play();
    },
    
    pause: async (type) => {
        document.getElementById("voice").pause();
    },

    playNewAudio: async (source) => {
        document.getElementById("voice").src = source;
        document.getElementById("voice").currentTime = 0;
        let promise = document.getElementById("voice").play();

        return promise;
    },

    getRandomFile: async (directory) => {
        let file = await network.getRandomFile(data.taskDir, directory);
        file = "data:audio/wav;base64," + file;
        return file;
    },
}