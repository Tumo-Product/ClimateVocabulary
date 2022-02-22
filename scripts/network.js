axios.defaults.baseURL = "https://content-tools.tumo.world:4000";

const network = {
    getSetName: async () => {
        let href = document.location.href;
        let splitPath = href.split("/");
        let string = splitPath[splitPath.length - 2];
        return string;
    },
    getVocabulary: async () => {
        await $.get(`../vocabulary.json`, function (json) { data = json; });
        return data;
    }
}