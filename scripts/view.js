const view = {
    height  : 650,
    count   : 2,

    onStart     : async (question) => {
        $("#welcomeText").addClass("welcomeOver");
        $("#startButton").addClass("startUnder");
        await timeout(500);
        $("#container").addClass("openedContainer");
        $(".downButton").first().removeClass("invisible deactivated disabled");  // TODO: Change when done with playback view.
        $("#question p").html(question);
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
            $(`#r_${index}`).css("margin-top", 500);
            await timeout(100);
            $(`#r_${index}`).css("margin-top", 0);
        }
    },

    addTerm   : async (index, word, row, from, disabled) => {
        $(`#r_${row}`).append(`<div id="w_${index}" class="button term ${from}"><p class="current ${from}Paragraph">${word}</p></div>`);
        if (disabled) {
            $(`#w_${index}`).addClass("deactivated disabled");
        }
    },
}

const loader = {
	hide: () => {
		$("#loadingScreen").hide();
	},
	show: () => {
		$("#loadingScreen").show();
	}
}