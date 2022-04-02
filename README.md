| ユーザーの行動                                                                        | 結果                                                                          | 必須（ :white_check_mark: ）or ストレッチ（ :full_moon: :last_quarter_moon: :new_moon: ） |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ユーザーは新規でアプリを起動すると                                                    | 新規登録画面が開く                                                            | :white_check_mark:                                                                        |
|                                                                                       | ログインと新規登録が選べる                                                    | :last_quarter_moon:                                                                       |
| 新規登録画面でメールアドレス、パスワード、ニックネーム、アイコンを入力し、Submit する | 診断画面に行く                                                                | :white_check_mark:                                                                        |
| 診断画面では、複数個の質問に対してはい/いいえで回答する                               | 回答が成功する                                                                | :white_check_mark:                                                                        |
|                                                                                       | 回答内容によって次の質問が変わることがある                                    | :white_check_mark:                                                                        |
|                                                                                       | 質問は全画面に出てきて、はい/いいえを選ぶとアニメーションで左右に飛ぶイメージ | :full_moon: ※詰まり過ぎたらスキップ                                                       |
| 診断が終わると、                                                                      | 推しメン決まりました画面に遷移する                                            | :white_check_mark:                                                                        |
| 推しメンは                                                                            | 実験用に 10 人弱のメンバー + 秋元康から決定される                             | :white_check_mark:                                                                        |
| 推しメン決まりました画面で、「チャットへ行く」といったボタンを押すと                  | チャット画面に遷移する                                                        | :white_check_mark:                                                                        |
| 推しメン決まりました画面で、「診断やり直す」といったボタンを押すと                    | 診断画面が再度開く                                                            | :white_check_mark:                                                                        |
| チャット画面に遷移すると                                                              | 過去のチャットのやり取りは見えない                                            | :white_check_mark:                                                                        |
| チャット画面に遷移すると                                                              | 同じ推しメンの人とのみやり取りができる（それ以外の人はいない）                | :white_check_mark:                                                                        |
| テキストの送信が                                                                      | できる                                                                        | :white_check_mark:                                                                        |
| 画像の送信が                                                                          | できる                                                                        | :white_check_mark:                                                                        |
| 送信した自分のチャットのアイコンをクリックすると                                      | 過去に送信したチャットの合計数が見れる                                        | :white_check_mark:                                                                        |
| 自分以外の同部屋のユーザーがチャットを送信すると                                      | 自分の端末にプッシュ通知が届く                                                | :white_check_mark:                                                                        |
| 画面内のどこかからメニューに移動でき、                                                | ニックネームとアイコンを変更できる                                            | :white_check_mark:                                                                        |
| ライブ日記投稿画面へ遷移するナビゲーションをクリックすると                            | 投稿画面に遷移できる                                                          | :full_moon:                                                                               |
|                                                                                       | ライブ日記が投稿成功する                                                      | :full_moon:                                                                               |
| ライブ日記一覧画面へ遷移すると                                                        | 自分を含む全ユーザーのライブ日記を新しい順に見ることができる(タイムライン)    | :full_moon:                                                                               |
|                                                                                       | ライブ日記に推しメンのタグ付ができたり、フリーワード検索機能が使える          | :last_quarter_moon:                                                                       |
| レベルが上がる                                                                        | ライブ日記の投稿回数に応じてレベルが上がる                                    | :new_moon:                                                                                |
|                                                                                       | 友人の招待が成功した回数に応じてレベルが上がる                                | :new_moon:                                                                                |
|                                                                                       | チャットの送信数に応じてレベルが上がる                                        | :new_moon:                                                                                |
| 推しメンを複数人登録する                                                              | 成功する                                                                      | :new_moon:                                                                                |

**プルリクエスト提出時のルール**
feat: A new feature
fix: A bug fix
docs: Documentation only changes
style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
refactor: A code change that neither fixes a bug nor adds a feature
perf: A code change that improves performance
test: Adding missing or correcting existing tests
chore: Changes to the build process or auxiliary tools and libraries such as documentation generation
