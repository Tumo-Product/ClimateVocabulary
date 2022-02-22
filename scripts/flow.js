let set;
let vocabulary;
let allWords = [];
let recordings = [];
let skills = [];

let currBaseAudio;
let audioStream;
let recorder;

const onLoad = async () => {
    let data = await network.getVocabulary();
    vocabulary  = data.vocabulary;

    audioStream = await audioManager.getAudioStream();
    recorder    = new Recorder(audioStream);

    for (const key in vocabulary) {
        vocabulary[key] = await shuffle(vocabulary[key]);
        allWords = allWords.concat(vocabulary[key]);
    }
    
    let name = await network.getSetName();
    skills = name.split('_');
    set = data.sets[name];
    setupEvents();
    loader.hide();
}

const setupEvents = async () => {
    $("#startButton").click(onStart);
    $(".upButton").click(setupFinalView);
    $(".downButton").click(setupRecordingView);
}

const onStart = async () => {
    $("#startButton").addClass("disabled");
    await view.onStart();
    let indices = getRandomIndices(4, 12);

    let activatedWords = [];
    for (let i = 0; i < set.starters.length; i++) {
        replaceWith(allWords, set.starters[i], indices[i]);
        activatedWords[i] = allWords[indices[i]];
    }
    
    addButtons(0, 12, allWords, activatedWords); // Add the starting 12.
}

const addButtons = async (start, end, words, activatedWords) => {
    let rowCount    = Math.ceil((end - start) / 3);
    let itemCount   = 0;

    for (let r = 0; r < rowCount; r++) {
        view.addRow(r, true);

        for (let w = 0; w < 3; w++) {
            let word = words[itemCount];
            let from = whichSkill(word);

            let disabled = false;
            if (Array.isArray(activatedWords)) {
                disabled = !activatedWords.includes(word);
            }
            
            view.addTerm(itemCount, word, r, from, disabled);
            itemCount++;

            if (itemCount === end) {
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
}

const whichSkill = (word) => {
    for (const key in vocabulary) {
        if (vocabulary[key].includes(word)) {
            return key;
        }
    }
}

$(onLoad);