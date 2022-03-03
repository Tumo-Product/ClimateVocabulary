let answersToExamine;

const onExaminerLoad = async (answers) => {
    await onStart();
    
    shuffledVocab = [];

    recordings = {};
    for (let i = 0; i < answers.length; i++) {
        shuffledVocab.push(answers[i].term);
        recordings[answers[i].term] = { skill: answers[i].skill, sources: [{ duration: answers[i].duration, owners: answers[i].owners, src: [answers[i].file] }] };
    }

    answersToExamine = answers;
    
    setupFinalView();
    $("#filter").remove();
    
    $("#rejectButton").click(reject);
    $("#awardButton").click(award);
}

const reject = async () => {
    let index = player.playingIndex;
    $(`#w_${index}`).remove();
}

const award = async () => {
    let index = player.playingIndex;
    let rec = answersToExamine[index];

    await network.addRecording(rec.term, rec.owners, rec.skill, rec.file, rec.duration);
    view.disableButton($(`#w_${index}`));
}