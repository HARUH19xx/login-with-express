const indexModule = (() => {
    const path = window.location.pathname

    switch (path) {
        case "/" :
            document.getElementById("login-btn").addEventListener('click', () => {
                return loginModule.login();
            });

            break;

        case "/vote.html" :
            document.getElementById('search-btn').addEventListener('click', () => {
                return searchModule.searchVoters();
            });

            //returnして終わっているので、breakしなくていい。
            return votersModule.fetchAllVoters();
        
        case "/create.html" : 
            document.getElementById('save-btn').addEventListener('click', () => {
                return votersModule.createVoter();
            });

            document.getElementById('cancel-btn').addEventListener('click', () => {
                return window.location.href = '/';
            });

            break;

        case "/edit.html" :
            const uid = window.location.search.split("?uid=")[1]

            document.getElementById('save-btn').addEventListener('click', () => {
                return votersModule.saveVoter(uid);
            });

            document.getElementById('cancel-btn').addEventListener('click', () => {
                return window.location.href = '/';
            });

            document.getElementById('delete-btn').addEventListener('click', () => {
                return (() => {
                    votersModule.deleteVoter(uid);
                    window.location.href = "/";
                });
            });
            
            return votersModule.setExistingValue(uid);

        default:
            break;
        }

})();