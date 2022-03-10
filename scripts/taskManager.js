const taskManager = {
    tasks       : {},
    current     : { skill: 0, which: 0 },
    responses   : {},

    setup           : async (indices) => {
        if (recordStarters) {
            for (let s = 0; s < skills.length; s++) {
                taskManager.tasks[skills[s]] = [];
                taskManager.tasks[skills[s]][0] = set.starters[s == 0 ? 0 : 2];
                taskManager.tasks[skills[s]][1] = set.starters[s == 0 ? 1 : 3];
            }
        } else {
            for (const key in indices) {
                taskManager.tasks[key] = [];
        
                for (let i = 0; i < indices[key].length; i++) {
                    let index = indices[key][i];
                    taskManager.tasks[key][i] = vocabulary[key][index];
                }
            }
        }

        for (let s = 0; s < 2; s++) {
            for (let t = 0; t < 2; t++) {
                let obj = $(`#s${s}t${t}`);
                obj.click(() => { taskManager.beginTask(s, t, obj) });
            }
        }

        view.fitRecordingTerms();

        if (taskManager.responses[skills[0]] === undefined) {
            taskManager.responses[skills[0]] = [];
        }
        if (taskManager.responses[skills[1]] === undefined) {
            taskManager.responses[skills[1]] = [];
        }

        taskView.setup();
    },

    findUncompleted : () => {
        for (const key in taskManager.responses) {
            for (let i = 0; i < 2; i++) {
                if (taskManager.responses[key][i] === undefined) {
                    return { skill: skills.indexOf(key), which: i };
                }
            }
        }
    },

    beginTask       : async (s, t, obj) => {
        if (taskManager.current.skill === s && taskManager.current.which === t || controller.recording || controller.paused) {
            return;
        }
        
        taskManager.current.skill = s;
        taskManager.current.which = t;
        controllerView.moveRecorder(obj);
        taskView.enable(s, t);
    },
    
    handleRecording : async () => {
        currBaseAudio = await recorder.getBaseAudio();
        audioManager.setAudioSource("my", currBaseAudio);
    },
    
    handleAnswer    : async (duration) => {
        let responses   = taskManager.responses;
        let current     = taskManager.current;

        responses[skills[current.skill]][current.which] = currBaseAudio;
        taskView.complete(current.skill, current.which);

        let word = taskManager.tasks[skills[current.skill]][current.which];
        newRecordings.push(word);

        let source = {
            owners  : owners,
            src     : responses[skills[current.skill]][current.which],
            duration: duration
        }

        if (recordings[word] === undefined) {
            recordings[word] = {
                skill: skills[current.skill],
                sources: [source],
            }
        } else {
            recordings[word].sources.push(source);
        }

        answers.push({ term: word, owners: source.owners, skill: recordings[word].skill, file: source.src, duration: source.duration });
        // Add recordings on demand -----------------------------------------
        if (recording) {
            await network.addRecording(word, [ "master" ], recordings[word].skill, source.src, source.duration);
        } // ----------------------------------------------------------------

        if (newRecordings.length === 2) {
            view.enableButton("upButton");
        } else if (newRecordings.length === 4) {
            view.enableButton("upButton");
            $("#centerBtn").addClass("deactivated disabled");
            return;
        }

        let uncompleted = taskManager.findUncompleted();
        let s = uncompleted.skill;
        let t = uncompleted.which;
        taskManager.beginTask(s, t, $(`#s${s}t${t}`));
    }
}

const taskView = {
    enable : async (s, t) => {
        $("#tasks .term").each(function (index) {
            if (!$(this).hasClass("disabled")) {
                let key = skills[index > 1 ? 1 : 0];

                $(this).find("p").removeClass(`${key}Paragraph`);
                $(this).removeClass(key).addClass("deactivated");
            }
        });

        let obj = $(`#s${s}t${t}`);
        obj.removeClass("deactivated").css({ "box-shadow" : "5px 5px 5px 0 rgba(222,222,230,0.5), -3px -3px 5px 0 #FEFEFE" });
        obj.addClass(skills[s]).removeClass("deactivated");
        obj.find("p").addClass(`${skills[s]}Paragraph`);
    },

    complete : (s, t) => {
        let obj = $(`#s${s}t${t}`);
        obj.attr('style', '');
        obj.addClass(skills[s]);
        obj.find("p").addClass(`${skills[s]}Paragraph`);
        obj.addClass("disabled");
    },

    setup   : () => {
        for (let s = 0; s < 2; s++) {
            for (let t = 0; t < 2; t++) {
                let obj = $(`#s${s}t${t}`);
                obj.find('p').html(taskManager.tasks[skills[s]][t]);
                obj.find('.active').attr('src', `../icons/skills/${skills[s]}.svg`);
                obj.find('.inactive').attr('src', `../icons/skills/${skills[s]}Deactivated.svg`);
            }
        }

        view.fitRecordingTerms();
        taskView.enable(0, 0);
    }
}