class Recorder {
    constructor (stream) {
        this.stream = stream;
        this.chunks = [];
        this.recorder = new MediaRecorder(stream);
        this.recorder.ondataavailable = (e) => {
            this.chunks.push(e.data);
        };
    }

    getBlob () {
        return new Blob(this.chunks, { type: "audio/webm" });
    }

    async getBaseAudio() {
        let file = this.getBlob();
        let basedat = await getBase64(file);
        return basedat;
    }

    start () {
        this.chunks = [];
        this.recorder.start();
    }

    pause () {
        this.recorder.pause();
    }

    resume() {
        this.recorder.resume();
    }

    stop () {
        this.recorder.stop();
        return new Promise((resolve) => {
            this.recorder.onstop = resolve;
        });
    }
}