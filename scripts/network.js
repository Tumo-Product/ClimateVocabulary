axios.defaults.baseURL = "https://content-tools.tumo.world:4000";

const config = {
    addRecording: '/climate_vocabulary/recordings/add',
    list        : '/climate_vocabulary/recordings/list'
}

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
    },

    addRecording: async (term, owners, skill, file, duration) => {
        if (!Array.isArray(owners)) {
            owners = [owners];
        }

        let req = { term: term, owners: JSON.stringify(owners), skill: skill, file: file, duration: duration };
        return await axios.post(config.addRecording, req);
    },

    list        : async (query) => {
        return await axios.post(config.list, { query: query === undefined ? "{}" : JSON.stringify(query) });
    }
}