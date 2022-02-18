const view = {
    onStart     : async () => {
        $("#welcomeText").addClass("welcomeOver");
        $("#startButton").addClass("startUnder");
        await timeout(500);
        $("#container").addClass("openedContainer");
    },
    
    addRow      : async (index, animate) => {
        $("#container").append(`<div id="r_${index}" class="row"></div>`);
        if (animate) {
            $(`#r_${index}`).css("margin-top", 500);
            await timeout(100);
            $(`#r_${index}`).css("margin-top", 0);
        }
    },

    addButton   : async (index, word, row, deactivated) => {
        $(`#r_${row}`).append(`<div id="w_${index}" class="button word"><p class="current">${word}</p></div>`);
        if (deactivated) {
            $(`#r_${row}`).addClass("deactivated");
        }
    }
}