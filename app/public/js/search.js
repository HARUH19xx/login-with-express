const searchModule = (() => {
    const BASE_URL = "http://localhost:3000/api/v1/search";
    
    return {
        searchVoters: async () => {
            //検索窓への入力値を取得
            const query = document.getElementById('search').value;
            const res = await fetch(BASE_URL + '?q=' + query);
            const result = await res.json();

            let body = "";

            for (let i = 0; i < result.length; i++) {
                const voter = result[i];
                body += `<tr>
                            <td>${voter.id}</td>
                            <td>${voter.name}</td>
                            <td>${voter.profile}</td>
                            <td>${voter.date_of_birth}</td>
                            <td>${voter.created_at}</td>
                            <td>${voter.updated_at}</td>
                        </tr>`;
            };

            document.getElementById("voters-list").innerHTML = body;
        }
    };
})();