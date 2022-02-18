const onLoad = async () => {
    $("#startButton").click(onStart);
}

const onStart = async () => {
    await view.onStart();
    let arr = ["test1", "test1", "test1", "test1", "test1", "test1", "test1", "test1", "test1","test1", "test1", "test1",];
    addButtons(0, arr.length, arr);
}

const addButtons = async (start, end, words) => {
    let rowCount    = Math.ceil((end - start) / 3);
    let itemCount   = 0;

    for (let r = 0; r < rowCount; r++) {
        view.addRow(r, true);

        for (let w = 0; w < 3; w++) {
            view.addButton(itemCount, words[itemCount], r, Math.round(Math.random()) === 0 ? true : false);
            itemCount++;

            if (itemCount === end) {
                break;
            }
        }
    }
}

$(onLoad);