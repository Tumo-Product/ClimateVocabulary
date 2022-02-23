const audioManager = {
    myVoice : undefined,
    otherVoice: undefined,

    setup: () => {
        audioManager.myVoice = document.getElementById("myVoice");
        audioManager.otherVoice = document.getElementById("otherVoice");
    },

    getAudioStream: () => {
        return navigator.mediaDevices.getUserMedia({ audio: true });
    },

    setAudioSource: (type, source) => {
        let element = type === "my" ? audioManager.myVoice : audioManager.otherVoice;

        element.currentTime = 0;
        element.src = source;
    },

    play: (type) => {
        let element = type === "my" ? audioManager.myVoice : audioManager.otherVoice;
        element.play();
    },
    
    pause: (type) => {
        let element = type === "my" ? audioManager.myVoice : audioManager.otherVoice;
        element.pause();
    },

    playNewAudio: async (type, source) => {
        let element = type === "my" ? audioManager.myVoice : audioManager.otherVoice;
        element.src = source;
        element.currentTime = 0;
        let promise = element.play();
        return promise;
    }
}

const player = {
    progress: [],
    playingIndex: -1,
    playing : false,
    interval: undefined,
    pauseInterval: undefined,
    timePaused: 0,

    view : {
        resetProgress   : async (index) => {
            $(`#w_${index} .progress`).css("width", "0%");
            $(`#w_${index} .progress`).hide(); await timeout(200);
            $(`#w_${index} .progress`).show();
        },
        updateProgress  : (index, which, progress) => {
            $(`#w_${index} #pB${which} .progress`).css("width", `${progress}%`);
        },

        enable          : (index) => {
            $(".progressBars").css("opacity", 0);

            $(`#w_${index} .progressBars`).css("opacity", 1);
        }
    },

    setup: () => {
        for (let i = 0; i < shuffledVocab.length; i++) {
            player.progress[i] = -1;
        }
    },

    toggle: () => {
        if (player.playing) {
            player.pause();
        } else {
            player.resume();
        }

        player.playing = !player.playing;
    },

    play: (index) => {
        player.playingIndex = index;
        player.playing = true;
        player.view.enable(index);
        player.timePaused = 0;

        if (player.progress[index] !== -1) {
            player.view.updateProgress(index, player.progress[index], 100);
        }

        player.progress[index]++;
        if (player.progress[index] === recordings[shuffledVocab[index]].sources.length) {
            player.progress[index] = 0;
            player.view.resetProgress(index);
        }

        let source = recordings[shuffledVocab[index]].sources[player.progress[index]];
        let src = source.src;
        let duration = source.duration;
        audioManager.setAudioSource('other', src);
        let startTime = new Date().getTime();
        clearInterval(player.interval);

        document.getElementById("otherVoice").currentTime = 0.01;
        player.resume();
        player.interval = setInterval(() => {
            let currTime = new Date().getTime();
            let time = currTime - startTime - player.timePaused;
            let progress = time / duration * 100;
            player.view.updateProgress(index, player.progress[index], progress);
            
            if (time >= duration) {
                listenedTo();
                player.stop(index);
            }

            if (time < 0) time = 0;
        }, 100);
    },

    pause: () => {
        audioManager.pause('other');
        view.replaceButton("bigPlay", "#bigPlayIcon");
        player.pauseInterval = setInterval(() => {
            player.timePaused += 100;
        }, 100);
    },

    resume: () => {
        if (document.getElementById("otherVoice").currentTime === 0) {
            player.play(player.playingIndex);
            return;
        }
        audioManager.play("other");
        view.replaceButton("bigPlay", "#bigPauseIcon");
        clearInterval(player.pauseInterval);
    },

    stop: () => {
        player.playing = false;
        view.replaceButton("bigPlay", "#bigPlayIcon");
        audioManager.pause('other');
        document.getElementById('otherVoice').currentTime = 0;
        clearInterval(player.pauseInterval);
        clearInterval(player.interval);
    }
}