let set;
let vocabulary;
let shuffledVocab = [];
let recordings = {};
let newRecordings = [];
let skills = [];
let owners = [ "1" ];

let currBaseAudio;
let audioStream;
let recorder;

let answers = [];

const onLoad = async () => {
    let data    = await network.getVocabulary();
    vocabulary  = data.vocabulary;

    for (const key in vocabulary) {
        filter.add(key);
        vocabulary[key] = await shuffle(vocabulary[key]);
        shuffledVocab = shuffledVocab.concat(vocabulary[key]);
    }

    shuffledVocab = await shuffle(shuffledVocab);
    
    let name = await network.getSetName();
    skills = name.split('_');
    set = data.sets[name];

    let found = await network.list();
    found = found.data.found;

    for (let i = 0; i < found.length; i++) {
        if (!set.starters.includes(found[i].term)) {
            found[i].sources = await shuffle(found[i].sources);
        }
        recordings[found[i].term] = { skill: found[i].skill, sources: found[i].sources };
    }

    for (const word of set.starters) {
        wordsListenedTo[word] = false;
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

    $("#searchBtn").click(filter.search);
}

let wordsListenedTo = {};
const listenedTo = (word) => {
    wordsListenedTo[word] = true;
    
    for (const word in wordsListenedTo) {
        if (!wordsListenedTo[word]) return;
    }

    view.enableButton("downButton");
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
    
    addButtons(shuffledVocab, Object.keys(recordings).length, true, undefined, activatedWords);
}

const addButtons = async (vocab, length, animate, featuredWords, activatedWords) => {
    let rowCount = Math.ceil(length / 3);
    let itemCount = 0;

    for (let r = 0; r < rowCount; r++) {
        view.addRow(r, animate);

        for (let i = 0; i < 3; i++) {
            let key = vocab[itemCount];
            let disabled = false;
            let featured = false;

            if (Array.isArray(activatedWords)) {
                disabled = !activatedWords.includes(key);
            }
            if (Array.isArray(featuredWords)) {
                featured = featuredWords.includes(key);
            }

            let from = whichSkill(key);
            if (recordings[key] === undefined) {
                itemCount++;
                return;
            }
            let progressBarCount = recordings[key].sources.length;
            let index = shuffledVocab.indexOf(key);
            let obj = view.addTerm(index, key, r, from, progressBarCount, featured, disabled);
            obj.click(() => { player.play(index) });

            itemCount++;
            if (itemCount == length) {
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

    let indices = getRandomIndices(4, 9);

    let featuredWords = [];
    for (let i = 0; i < newRecordings.length; i++) {
        replaceWith(shuffledVocab, newRecordings[i], indices[i]);
        featuredWords[i] = shuffledVocab[indices[i]];
    }

    view.setupFinalView();
    filterView.show();
    addButtons(shuffledVocab, Object.keys(recordings).length, false, featuredWords);
}

const whichSkill = (word) => {
    for (const key in vocabulary) {
        if (vocabulary[key].includes(word)) {
            return key;
        }
    }
}

const params = new URL(document.location.href).searchParams;
let recording = params.get("recording");
let recordStarters = params.get("recordStarters");

if (recording) {
    $(".downButton").removeClass("deactivated disabled");
    $(onLoad);
}

// $(onLoad);

// TESTING TOOLS ----------------------
const intoJson = (string) => {
    let texts = string.split("\n");
    let finalText = "";

    for (let i = 0; i < texts.length; i++) {
        finalText += '"' + texts[i] + '"' + ",\n";
    }

    return finalText;
}

const uploadAll = async (src) => {
    for (const key in vocabulary) {
        for (let i = 0; i < vocabulary[key].length; i++) {
            let word = vocabulary[key][i];
            console.log(await network.addRecording(word, owners, key, src, 550))
        }
    }
}