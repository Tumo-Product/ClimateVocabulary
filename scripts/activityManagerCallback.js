const initialize = async () => {
    window.parent.postMessage({
        application: "activity-manager",
        message: "init"
    }, '*');
    
    window.addEventListener("message", async (event) => {
        if (event.data.application !== "activity-manager") {
            return;
        }
    
        console.log(event.data);
    
        switch(event.data.message) {
            case 'init-response':
                const { data } = event.data;
                if (window.location.href.includes("viewer")) {
                    owners = [data.studentId];

                    if (data.collaboratorId !== undefined) {
                        owners.push(data.collaboratorId);
                    }
                }

                await onLoad();

                if (window.location.href.includes("examiner")) {
                    onExaminerLoad(data.answers[0]);
                }
            break;
        }
    });
    
    window.parent.postMessage({
        application: 'activity-manager',
        message: 'set-iframe-height',
        data: { iframeHeight: 650 }
    }, '*');
}

const setAnswers = (outcome) => {
    window.parent.postMessage({
        application: 'activity-manager',
        message: 'set-answers',
        data: { answers: [outcome] }
    }, '*');
}

const examine = (status) => {
    window.parent.postMessage({
        application: 'activity-manager',
        message: 'auto-examine',
        data: { status: status }
    }, '*');
}

$(initialize);