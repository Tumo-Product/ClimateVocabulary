const taskManager = {
    tasks       : {},
    current     : { skill: 0, which: 0 },
    responses   : {},

    setup           : async (indices) => {
        for (const key in indices) {
            taskManager.tasks[key] = [];
    
            for (let i = 0; i < indices[key].length; i++) {
                let index = indices[key][i];
                taskManager.tasks[key][i] = vocabulary[key][index];
            }
        }

        for (let s = 0; s < 2; s++) {
            for (let t = 0; t < 2; t++) {
                let obj = $(`#s${s}t${t}`);
                obj.click(() => { taskManager.beginTask(s, t, obj) });
            }
        }

        if (taskManager.responses[skills[0]] === undefined) {
            taskManager.responses[skills[0]] = [];
        }
        if (taskManager.responses[skills[1]] === undefined) {
            taskManager.responses[skills[1]] = [];
        }

        taskView.setup();
    },

    findUncompleted : () => {
        for (const key in responses) {
            for (let i = 0; i < 2; i++) {
                if (responses[key][i] === undefined) {
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
        audioManager.setAudioSource(currBaseAudio);
    },
    
    handleAnswer    : async () => {
        let responses   = taskManager.responses;
        let current     = taskManager.current;

        responses[skills[current.skill]][current.which] = currBaseAudio;
        let length = responses[skills[0]].length + responses[skills[1]].length;
        taskView.complete(current.skill, current.which);
        taskManager.beginTask(taskManager.findUncompleted());
    
        if (length === 4) { // TODO: Enable up arrow.
            
            // TODO: add beta network calls to fill up recordings.
            return;
        }
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

        taskView.enable(0, 0);
    }
}