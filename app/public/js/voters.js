const votersModule = (() => {
    const BASE_URL = "http://localhost:3000/api/v1/voters"

    //ヘッダーの設定
    const headers = new Headers()
    headers.set("Content-Type", "application/json")

    const handleError = async (res) => {
        const resJson = await res.json()

        switch (res.status) {
            case 200:
                alert(resJson.message)
                window.location.href = "/"
            break;

            case 201:
                alert(resJson.message)
                window.location.href = "/"
            break;

            case 400:
                //リクエストのパラメータが違う場合。
                alert(resJson.error)
            break;

            case 404:
                //指定したリソースが見つからない場合。
                alert(resJson.error)
            break;

            case 500:
                //サーバーエラー
                alert(resJson.error)
            break;

            default:
                alert("原因不明のエラーが発生しました。")
            break;
        }
    }

    return {
        //メソッドを設定。
        fetchAllVoters: async () => {
            //fetchでurlをgetしてくる。この実行結果をawaitで待つ。
            const res = await fetch(BASE_URL);
            //json形式のresをパースし、オブジェクトにしてvotersという変数に入れる。
            const voters = await res.json();

            //配列であるvotersに繰り返し処理を実行する
            for (let i = 0; i < voters.length; i++) {
                const voter = voters[i];
                //バッククオーテーションで囲うと、その中にHTMLが書けるようになる。
                const body =    `<tr>
                                    <td>${voter.id}</td>
                                    <td>${voter.name}</td>
                                    <td>${voter.profile}</td>
                                    <td>${voter.date_of_birth}</td>
                                    <td>${voter.created_at}</td>
                                    <td>${voter.updated_at}</td>
                                    <td><a href="edit.html?uid=${voter.id}">編集</a></td>
                                </tr>`;
                document.getElementById("voters-list").insertAdjacentHTML('beforeend', body);
            };
        },
        
        createVoter: async () => {
            const name = document.getElementById("name").value
            const profile = document.getElementById("profile").value
            const dateOfBirth = document.getElementById("date-of-birth").value

            //リクエストのボディ
            const body = {
                name: name,
                profile: profile,
                date_of_birth: dateOfBirth ? dateOfBirth : null
            }

            const res = await fetch(BASE_URL, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            })
            
            return handleError(res)
        },

        setExistingValue: async (uid) => {
            const res = await fetch(BASE_URL + "/" + uid)
            const resJson = await res.json()

            //resJsonが配列であることに注意
            document.getElementById('name').value = resJson[0].name
            document.getElementById('profile').value = resJson[0].profile
            document.getElementById('date-of-birth').value = resJson[0].date_of_birth
        },

        saveVoter: async (uid) => {
            const name = document.getElementById("name").value
            const profile = document.getElementById("profile").value
            const dateOfBirth = document.getElementById("date-of-birth").value

            //リクエストのボディ
            const body = {
                name: name,
                profile: profile,
                date_of_birth: dateOfBirth,
            }

            const res = await fetch(BASE_URL + "/" + uid, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(body)
            })
            
            return handleError(res)
        },

        deleteVoter: async (uid) => {
            const ret = window.confirm("このユーザーを削除しますか？")

            if (!ret) {
                return false
            }

            const res = await fetch(BASE_URL + "/" + uid, {
                method: "DELETE",
                headers: headers
            })

            return handleError(res)
        }
    };
})();