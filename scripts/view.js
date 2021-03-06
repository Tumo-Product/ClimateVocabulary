const view = {
    height  : 650,
    count   : 2,

    onStart     : async (question) => {
        $("#welcomeText").addClass("welcomeOver");
        $("#startButton").addClass("startUnder");
        await timeout(500);
        $("#container").css("overflow", "hidden");
        $("#container").addClass("openedContainer");
        $("#containerCopy").addClass("openedContainer");
        $(".downButton").first().removeClass("invisible ");
        $("#question p").html(question);
    },

    setupFinalView: async () => {
        $("#container").css("overflow", "scroll");
        $("#container").removeClass("openedContainer").addClass("finalContainer");
        $("#containerCopy").removeClass("openedContainer").addClass("finalContainer");
        $("#container").css("height", 431);
        $("#containerCopy").css("height", 431);

        $("#container").empty();
        $(".downButton").addClass("invisible disabled");
        $("#bigPlay").removeClass("invisible disabled");
    },

    enableButton: async (which) => {
        $(`.${which}`).removeClass("deactivated disabled");
    },

    replaceButton: async (which, button) => {
        $(`#${which} .current`).removeClass("current");
        await timeout(50);
        $(`#${which} ${button}`).addClass("current");
    },

    move        : async (direction) => {
        let top = parseFloat($("#views").css("top"));
        top += direction * view.height;
        if (top > 0 || top < -view.height * (view.count - 1)) return;
        $("#views").css({ "top": top });
    },
    
    addRow      : async (index, animate) => {
        $("#container").append(`<div id="r_${index}" class="row"></div>`);
        if (animate) {
            $(`#r_${index}`).css("margin-top", 600);
            await timeout(200);
            $(`#r_${index}`).css("margin-top", 0);
        }
    },

    disableButton: (obj) => {
        obj.addClass("deactivated disabled");
    },

    addTerm   : (index, word, row, from, progressBarCount, featured, disabled) => {
        $(`#r_${row}`).append(`<div id="w_${index}" class="button term ${from}"><p class="current ${from}Paragraph">${word}</p></div>`);
        let obj = $(`#w_${index}`);

        obj.append(`<div class="progressBars"></div>`);

        for (let i = 0; i < progressBarCount; i++) {
            obj.find(".progressBars").append(`<div class="progressBar" id="pB${i}"><div class="progress current"></div></div>`);
        }

        if (disabled) { view.disableButton(obj) }
        if (featured) { obj.addClass("featured"); }
        view.fitText(obj);
        return obj;
    },

    fitText : async (obj) => {
        let fontSize;
        let paragraph = obj.find("p");
        let width = obj.width() - 20;
        let height = obj.height() - 15;

        while (paragraph.prop("scrollWidth") > width || paragraph.prop("scrollHeight") > height) {
            fontSize = parseInt(paragraph.css("font-size"), 10);
            paragraph.css("font-size", fontSize - 2);
        }
    },

    fitRecordingTerms: async () => {
        $("#tasks .term").each(function (index) {
            let fontSize;
            let obj = $(this);
            let paragraph = obj.find("p");
            let width = paragraph.width();
            let height = paragraph.height();
            
            while (paragraph.prop("scrollWidth") > width || paragraph.prop("scrollHeight") > height) {
                fontSize = parseInt(paragraph.css("font-size"), 10);
                paragraph.css("font-size", fontSize - 2);
            }
        });
    }
}

const loader = {
	hide: () => {
		$("#loadingScreen").hide();
	},
	show: () => {
		$("#loadingScreen").show();
	}
}