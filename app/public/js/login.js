const loginModule = (() => {
    const BASE_URL = "http://localhost:3000/api/v1/login"

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

    const name = document.getElementById("name").value

    return {
        //メソッドを設定。
        login: async () => {
            //fetchでurlをgetしてくる。この実行結果をawaitで待つ。
            const res = await fetch(BASE_URL + "/" + name);
            //json形式のresをパースし、オブジェクトにしてusersという変数に入れる。
            const users = await res.json();

            //配列であるusersに繰り返し処理を実行する
            for (let i = 0; i < voters.length; i++) {
                const user = users[i];
                if (name === user.name) {
                    window.location.href = "/voters"
                } else {
                    window.alert('ユーザー名がありません。')
                }
            };
            return handleError(res);
        },

        loginCheck: async () => {
            //fetchでurlをgetしてくる。この実行結果をawaitで待つ。
            const res = await fetch(BASE_URL + "/" + name);
            //json形式のresをパースし、オブジェクトにしてusersという変数に入れる。
            const users = await res.json();

            //配列であるusersに繰り返し処理を実行する
            for (let i = 0; i < voters.length; i++) {
                const user = users[i];
                if (name === user.name) {
                    window.location.href = "/voters"
                } else {
                    window.alert('もう一度ログインしてください。')
                }
            };
        }
    }
})();