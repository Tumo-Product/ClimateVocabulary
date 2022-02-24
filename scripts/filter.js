const filter = {
    activated: {},

    add: (skill) => {
        filter.activated[skill] = false;
        let obj = filterView.add(skill);

        obj.click(() => { filter.by(skill) });
    },

    by: async (skill) => {
        if (filter.getActivatedCount() === 0) {
            filterView.disableAll();
        }

        if (filter.activated[skill]) {
            filterView.disable(skill);
            filter.activated[skill] = false;
        } else {
            filterView.enable(skill);
            filter.activated[skill] = true;
        }

        await filterView.emptyContainer();

        let filteredVocab = [];
        for (const key in filter.activated) {
            if (filter.activated[key]) {
                for (let i = 0; i < vocabulary[key].length; i++) {
                    filteredVocab.push(vocabulary[key][i]);
                }
            }
        }
        
        filteredVocab = shuffle(filteredVocab);
        addButtons(filteredVocab, filteredVocab.length, false);
        filterView.makeTermsAppear();
    },

    getActivatedCount: () => {
        let count = 0;
        for (const key in filter.activated) {
            if (filter.activated[key]) {
                count++;
            }
        }

        return count;
    }
}

const filterView = {
    add: (skill) => {
        $("#filterButtons").append(`
        <div id="${skill}" class="circle filterButton">
            <img class="inactive" src="../icons/skills/${skill}Deactivated.svg">
            <img class="active" src="../icons/skills/${skill}.svg">
        </div>`);

        return $(`#${skill}`);
    },

    enable: (skill) => {
        $(`#${skill}`).removeClass("deactivated");
    },

    disable: (skill) => {
        $(`#${skill}`).addClass("deactivated");
    },

    disableAll: () => {
        $(".filterButton").addClass("deactivated");
    },

    emptyContainer: async () => {
        $("#container .term").addClass("disappear");
        await timeout(500);
        $("#container .term").remove();
        $(".row").remove();
    },

    makeTermsAppear: async () => {
        $("#container .term").addClass("appear");
    }
}