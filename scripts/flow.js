let set;
let vocabulary;
let shuffledVocab = [];
let recordings = {};
let newRecordings = [];
let skills = [];
let owners = [ "1" ];
let listened = 0;

let currBaseAudio;
let audioStream;
let recorder;

const onLoad = async () => {
    let data = await network.getVocabulary();
    vocabulary  = data.vocabulary;

    for (const key in vocabulary) {
        vocabulary[key] = await shuffle(vocabulary[key]);
        shuffledVocab = shuffledVocab.concat(vocabulary[key]);
    }
    
    let name = await network.getSetName();
    skills = name.split('_');
    set = data.sets[name];

    let found = await network.list();
    found = found.data.found;

    for (let i = 0; i < found.length; i++) {
        found[i].sources = await shuffle(found[i].sources);
        recordings[found[i].term] = { skill: found[i].skill, sources: found[i].sources };
    }

    audioManager.setup();
    player.setup();
    setupEvents();
    loader.hide();
}

const setupEvents = async () => {
    $("#startButton").click(onStart);
    $(".upButton").click(setupFinalView);
    $(".downButton").click(setupRecordingView);

    $("#bigPlay").click(player.toggle);
}

const listenedTo = () => {
    listened++;
    if (listened === 4) {
        view.enableButton("downButton");
    }
}

const onStart = async () => {
    $("#startButton").addClass("disabled");
    await view.onStart();
    let indices = getRandomIndices(4, 12);

    let activatedWords = [];
    for (let i = 0; i < set.starters.length; i++) {
        replaceWith(shuffledVocab, set.starters[i], indices[i]);
        activatedWords[i] = shuffledVocab[indices[i]];
    }
    
    addButtons(true, activatedWords);
}

const addButtons = async (animate, activatedWords) => {
    let rowCount = Math.ceil(Object.keys(recordings).length / 3);
    let itemCount = 0;

    for (let r = 0; r < rowCount; r++) {
        view.addRow(r, animate);

        for (let i = 0; i < 3; i++) {
            let key = shuffledVocab[itemCount];
            let disabled = false;

            if (Array.isArray(activatedWords)) {
                disabled = !activatedWords.includes(key);
            }

            let from = whichSkill(key);
            let progressBarCount = recordings[key].sources.length;
            let index = shuffledVocab.indexOf(key);
            let obj = view.addTerm(index, key, r, from, progressBarCount, disabled);
            obj.click(() => { player.play(index) });

            itemCount++;
            if (itemCount == Object.keys(recordings).length) {
                break;
            }
        }
    }
}

const replaceWith = (vocab, target, index) => {
    let start   = vocab.indexOf(target);
    let temp    = vocab[index];
    vocab[index] = target;
    vocab[start] = temp;
}

const setupRecordingView = async () => {
    audioStream = await audioManager.getAudioStream();
    recorder    = new Recorder(audioStream);

    view.move(-1);
    controller.setup();

    let indices = {};
    for (let i = 0; i < skills.length; i++) {
        indices[skills[i]] = getRandomIndices(2, vocabulary[skills[i]].length);
    }

    taskManager.setup(indices);
}

const setupFinalView = async () => {
    view.move(1);
    view.setupFinalView();
    addButtons(false);
}

const whichSkill = (word) => {
    for (const key in vocabulary) {
        if (vocabulary[key].includes(word)) {
            return key;
        }
    }
}

$(onLoad);


// DEBUG ----------------------
const intoJson = (string) => {
    let texts = string.split("\n");
    let finalText = "";

    for (let i = 0; i < texts.length; i++) {
        finalText += '"' + texts[i] + '"' + ",\n";
    }

    return finalText;
}

uploadAll = async (src) => {
    for (const key in vocabulary) {
        for (let i = 0; i < vocabulary[key].length; i++) {
            let word = vocabulary[key][i];
            console.log(await network.addRecording(word, owners, key, src, 550))
        }
    }
}