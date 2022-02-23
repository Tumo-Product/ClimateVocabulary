const controller = {
    recording:  false,
    playing:    false,
    paused:     false,
    time:       0,

    interval:   undefined,
    pauseInterval: undefined,
    timePaused: 0,

    setup: async () => {
        $("#centerBtn").click(controller.recordClickHandler);
        $("#leftBtn").click(controller.pauseClickHandler);
        document.getElementById("myVoice").addEventListener("ended", function() {
            view.replaceButton("centerBtn", "#play");
            controller.playing = false;
        });
    },

    recordClickHandler: async () => {
        controller.recording = !controller.recording;

        if (controller.recording) {
            controller.record();
        } else {
            controller.stopRecording();
        }
    },

    pauseClickHandler: async() => {
        controller.paused = !controller.paused;

        if (controller.paused) {
            controller.pause();
        } else {
            controller.resume();
        }
    },

    setupReview: async () => {
        $("#controller .button").unbind("click");

        $("#leftBtn").click(function () {
            controller.cancel();
            currBaseAudio = null;
            currFile = null;
        });

        $("#centerBtn").click(controller.togglePlay);
        $("#rightBtn").click(controller.complete);
    },

    cancel: async () => {
        $("#controller .button").unbind("click");
        $("#centerBtn").click(controller.recordClickHandler);
        $("#leftBtn").click(controller.pauseClickHandler);
        audioManager.pause("my");

        controllerView.cancel();
        controller.playing = false;
    },

    togglePlay: async() => {
        controller.playing = !controller.playing;
        
        if (controller.playing) {
            audioManager.play("my");
            view.replaceButton("centerBtn", "#pause");
        } else {
            audioManager.pause("my");
            view.replaceButton("centerBtn", "#play");
        }
    },

    complete: async () => {
        controller.cancel();
        taskManager.handleAnswer(controller.time);
    },

    record : async () => {
        controller.time = 0;
        recorder.start();
        controllerView.record();
        let startTime = new Date().getTime();

        controller.interval = setInterval(function () {
            let currTime = new Date().getTime();
            controller.time = currTime - startTime - controller.timePaused;
            let progress = controller.time / 30000 * 100;
            controllerView.updateProgress(progress);
            
            if (controller.time >= 5000) {
                $("#centerBtn").removeClass("deactivated disabled");
            }
            if (controller.time >= 30000) {
                controller.stopRecording();
            }

            if (controller.time < 0) time = 0;
        }, 100);
    },
    pause : async () => {
        recorder.pause();
        controllerView.pause();

        controller.pauseInterval = setInterval(function () {
            controller.timePaused += 100;
        }, 100);
    },
    resume: async () => {
        recorder.resume();
        controllerView.resume();
        clearInterval(controller.pauseInterval);
    },
    stopRecording: async () => {
        controllerView.updateProgress(0);
        controller.timePaused = 0;
        clearInterval(controller.interval);
        clearInterval(controller.pauseInterval);

        recorder.stop().then(() => {
            controllerView.stopRecording();
            taskManager.handleRecording();
            controller.setupReview();
        });
    }
}

const controllerView = {
    record: async () => {
        $("#centerBtn").addClass("recording deactivated disabled");
        $("#leftBtn").removeClass("deactivated disabled");
    },
    stopRecording: async () => {
        $("#centerBtn").removeClass("recording");
        view.replaceButton("leftBtn", "#cancel");
        view.replaceButton("centerBtn", "#play");
        $("#rightBtn").removeClass("invisible");
    },
    pause: async () => {
        view.replaceButton("leftBtn", "#record");
    },
    resume: async () => {
        view.replaceButton("leftBtn", "#pause");
    },
    cancel: async () => {
        $("#rightBtn").addClass("invisible");
        view.replaceButton("centerBtn", "#record");
        view.replaceButton("leftBtn", "#pause");
        $("#leftBtn").addClass("deactivated disabled");
    },
    moveRecorder    : async (obj) => {
        $("#recorder").addClass("disabled");
        $("#recorder").css("transform", "scale(1.06)");
        await timeout(250);
        
        let top = parseInt(obj.css("top")) + 12;
        $("#recorder").css("top", top);

        await timeout(300);
        $("#recorder").css("transform", "scale(1");
        $("#recorder").removeClass("disabled");
    },
    updateProgress    : async (progress) => {
        $("#progress").css("--value", progress);
    }
}