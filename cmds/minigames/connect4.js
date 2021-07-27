const Two_P_Game = require("../../typedefs/Game");
const Myclient = require("../../typedefs/client");

class connect4 extends Two_P_Game {

    constructor(client) {
        super(
            "connect4",
            "minigames",
            client
        );


        this.image =
            "https://cdn.discordapp.com/attachments/737224846878179360/851102547603357746/connect_demo.gif";

        this.cmd = async function (msg, args) {
            /**
             * Create a connect 4 game
             * @param {object} msg - Discord message object
             * @param {object} iuser - User being invited to the game
             * @param {Myclient} client - Client
             */

            async function connect4(msg, iuser, client, c4lang) {
                // create a new connect 4 game between author and an invited user
                let game = new C4(msg.author.id, iuser.id);
                let Currnet_Color = "red";

                let field1 = {
                    name: "Now : ",
                    value: msg.author.username + c4lang.ones_turn,
                    inline: true,
                };
                // message send to red player
                let rmsg = await msg.author.send(
                    client.EmbedMaker(
                        msg,
                        game.stringify(),
                        client.colors.red,
                        [field1]
                    )
                );
                // message send to yellow player
                let ymsg = await iuser.send(
                    client.EmbedMaker(
                        msg,
                        game.stringify(),
                        client.colors.red,
                        [field1]
                    )
                );

                // react with emojis in reactions array
                // using for...of loop
                for (let emoji of game.reactions) {
                    rmsg.react(emoji);
                    ymsg.react(emoji);
                }

                // since the bot is sending embed in DM, you don't need to check for user id
                const filter = (reaction, user) => {
                    let pass = game.reactions.includes(reaction.emoji.name) && !user.bot;
                    return pass;
                };

                const redcollector = rmsg.createReactionCollector(filter, {
                    idle: 300 * 1000,
                });
                const yellowcollector = ymsg.createReactionCollector(filter, {
                    idle: 300 * 1000,
                });

                // merge 2 collector if possible
                redcollector.on("collect", async (reaction, user) => {
                    if (reaction.emoji.name === "🛑") {
                        rmsg.edit(
                            client.EmbedMaker(
                                msg,
                                c4lang.abrupted.replace("{0}",user.username),
                                client.colors.black
                            )
                        );
                        ymsg.edit(
                            client.EmbedMaker(
                                msg,
                                c4lang.abrupted.replace("{0}",user.username),
                                client.colors.black
                            )
                        );
                        redcollector.stop();
                        yellowcollector.stop();
                        return;
                    }

                    if (user.id === game.redid && Currnet_Color !== "red"){
                        return;
                    }
                        

                    switch (
                        game.place(
                            "1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣🛑".indexOf(reaction.emoji.name) / 3,
                            Currnet_Color
                        )
                    ) {
                        case 0:
                            msg.channel.send(c4lang.col_full);
                            break;

                        case 1:
                            Currnet_Color = "yellow";
                            let Current_Player = iuser;
                            let field1 = {
                                name: "Now : ",
                                value: Current_Player.username + c4lang.ones_turn,
                                inline: true,
                            };
                            await rmsg.edit(
                                client.EmbedMaker(
                                    msg,
                                    game.stringify(),
                                    client.colors[Currnet_Color],
                                    [field1]
                                )
                            );
                            await ymsg.edit(
                                client.EmbedMaker(
                                    msg,
                                    game.stringify(),
                                    client.colors[Currnet_Color],
                                    [field1]
                                )
                            );

                            /* ai calulation
                            let board = game.map.slice()
                            let stack = game.stack.slice()
                            let result = game.c4minimax(board,stack,4,true,0,0)
                            switch(game.place(result.move,Currnet_Color)){

                                case 1:
                                    Currnet_Color = "red"
                                    let field2 = {name: "Now : ",value: `${Currnet_Color}'s turn!` , inline: true}
                                    bmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[Currnet_Color],[field2]))
                                    break;

                                case 2:

                                    bmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[Currnet_Color]))
                                    msg.channel.send(Currnet_Color + " wins!")
                                    reactcollector.stop()
                                    break;

                            }
                            */
                            break;
                        case 2:
                            await rmsg.edit(
                                client.EmbedMaker(
                                    msg,
                                    game.stringify(),
                                    client.colors[Currnet_Color]
                                )
                            );
                            await ymsg.edit(
                                client.EmbedMaker(
                                    msg,
                                    game.stringify(),
                                    client.colors[Currnet_Color]
                                )
                            );
                            iuser.send(msg.author.username + c4lang.wins);
                            msg.author.send(msg.author.username + c4lang.wins);
                            redcollector.stop();
                            yellowcollector.stop();
                            break;

                        case 3:
                            await rmsg.edit(
                                client.EmbedMaker(
                                    msg,
                                    game.stringify(),
                                    client.colors.white
                                )
                            );
                            await ymsg.edit(
                                client.EmbedMaker(
                                    msg,
                                    game.stringify(),
                                    // client.colors / white
                                    client.colors.white
                                )
                            );
                            iuser.send(c4lang.draw);
                            msg.author.send(c4lang.draw);
                            redcollector.stop();
                            yellowcollector.stop();
                            break;
                    }
                });

                yellowcollector.on("collect", async (reaction, user) => {
                    if (reaction.emoji.name === "🛑") {
                        rmsg.edit(
                            client.EmbedMaker(
                                msg,
                                c4lang.abrupted.replace("{0}",user.username),
                                client.colors.black
                            )
                        );
                        ymsg.edit(
                            client.EmbedMaker(
                                msg,
                                c4lang.abrupted.replace("{0}",user.username),
                                client.colors.black
                            )
                        );
                        redcollector.stop();
                        yellowcollector.stop();
                        return;
                    }

                    console.log("y1");
                    if (user.id === game.yellowid && Currnet_Color !== "yellow"){

                        return;
                        
                    }
                        
                    console.log("y2");

                    switch (
                        game.place(
                            "1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣🛑".indexOf(reaction.emoji.name) / 3,
                            Currnet_Color
                        )
                    ) {
                        case 0:
                            msg.channel.send(c4lang.col_full);
                            break;

                        case 1:
                            Currnet_Color = "red";
                            let Current_Player = msg.author;
                            let field1 = {
                                name: "Now : ",
                                value: Current_Player.username + c4lang.ones_turn,
                                inline: true,
                            };
                            await rmsg.edit(
                                client.EmbedMaker(
                                    msg,
                                    game.stringify(),
                                    client.colors[Currnet_Color],
                                    [field1]
                                )
                            );
                            await ymsg.edit(
                                client.EmbedMaker(
                                    msg,
                                    game.stringify(),
                                    client.colors[Currnet_Color],
                                    [field1]
                                )
                            );

                            /*ai calulation
                            let board = game.map.slice()
                            let stack = game.stack.slice()
                            let result = game.c4minimax(board,stack,4,true,0,0)
                            switch(game.place(result.move,Currnet_Color)){

                                case 1:
                                    Currnet_Color = "red"
                                    let field2 = {name: "Now : ",value: `${Currnet_Color}'s turn!` , inline: true}
                                    bmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[Currnet_Color],[field2]))
                                    break;

                                case 2:

                                    bmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[Currnet_Color]))
                                    msg.channel.send(Currnet_Color + " wins!")
                                    reactcollector.stop()
                                    break;

                            }
                            */
                            break;
                        case 2:
                            await rmsg.edit(
                                client.EmbedMaker(
                                    msg,
                                    game.stringify(),
                                    client.colors[Currnet_Color]
                                )
                            );
                            await ymsg.edit(
                                client.EmbedMaker(
                                    msg,
                                    game.stringify(),
                                    client.colors[Currnet_Color]
                                )
                            );
                            iuser.send(iuser.username + c4lang.wins);
                            msg.author.send(iuser.username + c4lang.wins);
                            redcollector.stop();
                            yellowcollector.stop();
                            break;

                        case 3:
                            await rmsg.edit(
                                client.EmbedMaker(
                                    msg,
                                    game.stringify(),
                                    client.colors.white
                                )
                            );
                            await ymsg.edit(
                                client.EmbedMaker(
                                    msg,
                                    game.stringify(),
                                    client.colors.white
                                )
                            );
                            iuser.send(c4lang.draw);
                            msg.author.send(c4lang.draw);
                            redcollector.stop();
                            yellowcollector.stop();
                            break;
                    }
                });

                redcollector.on("end", () => {
                    console.log("rend");
                    client.emit("game_end", msg.author, iuser);
                });

                yellowcollector.on("end", () => {
                    console.log("yend");
                });
            }

            this.invitegame(msg, "Connect 4", connect4);
        };

        this.lang = 
        {
            "zh_TW":
            {
                "ones_turn" : "的回合",
                "abrupted" : "遊戲被 {0} 終止了",
                "col_full" : "這行已經滿了喔",
                "wins" : "贏了!",
                "draw" : "平手!",
                "no1wins" : "沒有人贏",
                "unplaceable" : "這個位置不能放置"
            },
            "en_US":
            {
                "ones_turn" : "'s turn",
                "abrupted" : "Game abrupted by {0}",
                "col_full" : "This column is full.",
                "wins" : "wins!",
                "draw" : "Draw!",
                "no1wins" : "No one wins.",
                "unplaceable" : "This place is unplaceable"
            }

        }

    }

}

class C4 {
    constructor(redid, yellowid) {
        this.stack = [5, 5, 5, 5, 5, 5, 5];
        this.map = [
            ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
            ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
            ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
            ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
            ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
            ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
        ];
        this.redid = redid;
        this.yellowid = yellowid;
        this.reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "🛑"];
    }

    /**
     * Function to place a piece into the board
     * @param {number} Col_Index - x coordinate of the piece
     * @param {*} color - Colour of the piece
     * @returns check win condition - 0/1/2/3  
     * win condition: 0 - invalid move;
     *                1 - valid move;
     *                2 - player wins;
     *                3 - draw
     */
    place(Col_Index, color) {
        let x, y;

        if (this.stack[Col_Index] !== -1) {
            x = Col_Index;
            y = this.stack[Col_Index];
            if (color === "yellow") {
                this.map[y][x] = "🟡";
            } else {
                this.map[y][x] = "🔴";
            }
            this.stack[Col_Index] -= 1;
        } else {
            // invalid move - column is full
            return 0;
        }

        return this.check(x, y);
    }

    // check if anyone wins
    check(x, y, board = this.map) {
        let color = board[y][x];
        if (color === "⚪") return 1;
        //horizontal
        if (
            this.search(x, y, color, 1, 0, 0) +
            this.search(x, y, color, -1, 0, 0) - 1 >= 4
        ) {
            return 2;
        }
        //lt-rb diagonal
        if (
            this.search(x, y, color, 1, 1, 0) +
            this.search(x, y, color, -1, -1, 0) - 1 >= 4
        ) {
            return 2;
        }
        //lt-rb diagonal
        if (
            this.search(x, y, color, -1, 1, 0) +
            this.search(x, y, color, 1, -1, 0) - 1 >= 4
        ) {
            return 2;
        }
        //vertical
        if (
            this.search(x, y, color, 0, 1, 0) +
            this.search(x, y, color, 0, -1, 0) - 1 >= 4
        ) {
            return 2;
        }

        // check how many pieces in a column
        let countstack = 0;
        for (let i = 0; i < 7; i++) {
            if (this.stack[i] === -1) {
                countstack++;
            }
        }

        // a column is full
        if (countstack === 7) return 3;

        return 1;
    }

    // (not sure what this whole code does)
    search(x, y, color, dx, dy, count, board = this.map) {
        if (x < 0 || x > 6 || y < 0 || y > 5) return count;
        if (color !== board[y][x]) return count;

        return this.search(x + dx, y + dy, color, dx, dy, count + 1, board);
    }

    search2(x, y, color, dx, dy, count, board) {
        if (x < 0 || x > 6 || y < 0 || y > 5) return { count: count, live: 0 };
        if (board[y][x] !== color) {
            if (board[y][x] === "⚪") {
                return { count: count, live: 1 };
            }
            return { count: count, live: 0 };
        }

        let result = this.search2(
            x + dx,
            y + dy,
            color,
            dx,
            dy,
            count + 1,
            board
        );

        return result;
    }

    // calculate the best move
    c4minimax(board, stack, depth, max, lx, ly) {
        if (this.check(lx, ly, board) === 2 || depth === 0) {
            let temp1 = this.Board_Evaluation(board, "🟡");
            let temp1score =
                temp1.two + (temp1.three * 5) / 3 + temp1.four * 15;
            let temp2 = this.Board_Evaluation(board, "🔴");
            let temp2score =
                temp2.two + (temp2.three * 5) / 3 + temp2.four * 20;
            if (temp1.four > 0 || temp2.four > 0)
                console.log(temp1score - temp2score);

            return { score: temp1score - temp2score, move: 0 };
        }

        if (max) {
            let Best_Score = -Infinity;
            let Best_Move = 0;

            stack.forEach((col) => {
                if (stack[col] > -1) {
                    board[stack[col]][col] = "🟡";
                    stack[col] -= 1;
                    let { score, move } = this.c4minimax(
                        board,
                        stack,
                        depth - 1,
                        false,
                        col,
                        stack[col] + 1
                    );
                    if (score > Best_Score) {
                        Best_Score = score;
                        Best_Move = col;
                    }
                    stack[col] += 1;
                    board[stack[col]][col] = "⚪";
                }
            });

            return { score: Best_Score, move: Best_Move };
        } else {
            let Cbest_Score = Infinity;
            let Cbest_Move = 0;

            stack.forEach((col) => {
                if (stack[col] > -1) {
                    board[stack[col]][col] = "🔴";
                    stack[col] -= 1;
                    let { score, move } = this.c4minimax(
                        board,
                        stack,
                        depth - 1,
                        true,
                        col,
                        stack[col] + 1
                    );
                    if (score < Cbest_Score) {
                        Cbest_Score = score;
                        Cbest_Move = col;
                    }
                    stack[col] += 1;
                    board[stack[col]][col] = "⚪";
                }
            });

            return { score: Cbest_Score, move: Cbest_Move };
        }
    }

    // not sure what this does, but simplify it if possible
    Board_Evaluation(board, color) {
        let result = { two: 0, three: 0, four: 0 };

        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 7; j++) {
                if (board[i][j] === color) {
                    let x = j;
                    let y = i;
                    let arr = [
                        this.search2(x, y, color, 1, 0, 0, board),
                        this.search2(x, y, color, -1, 0, 0, board),
                        this.search2(x, y, color, 1, 1, 0, board),
                        this.search2(x, y, color, -1, -1, 0, board),
                        this.search2(x, y, color, -1, 1, 0, board),
                        this.search2(x, y, color, 1, -1, 0, board),
                        this.search2(x, y, color, 0, 1, 0, board),
                        this.search2(x, y, color, 0, -1, 0, board),
                    ];

                    for (var q = 0; q < 4; q++) {
                        switch (arr[2 * q].count + arr[2 * q + 1].count - 1) {
                            case 2:
                                if (arr[2 * q].live) result.two++;
                                break;

                            case 3:
                                if (arr[2 * q].live + arr[2 * q + 1].live > 0) {
                                    result.three++;
                                } else if (
                                    arr[2 * q].live + arr[2 * q + 1].live ===
                                    2
                                ) {
                                    console.log(1);
                                    result.four++;
                                }
                                break;

                            case 4:
                                result.four++;
                                break;
                        }
                    }
                }
            }
        }
        return result;
    }

    // stringify the board
    stringify(board = this.map) {
        var result = "";
        for (var i = 0; i < 6; i++) {
            var sub = "";
            for (var j = 0; j < 7; j++) {
                sub += board[i][j];
            }
            result += sub + "\n";
        }

        return result;
    }
}

module.exports = connect4;
