const Command = require("../../typedefs/Command");
const disbut = require("discord-buttons");
const Discord = require("discord.js");


class maze extends Command{

    constructor(client){

        super("maze", "minigames", client)

        /**
         * 
         * @param {Discord.Message} msg 
         * @param {*} args 
         * @returns 
         */

        this.cmd = async function(msg, args){

            if(!msg.guild) return 0;
            
            if(this.client.Check_Playing(msg) === 0) return;
            this.client.playing.set(msg.author.id,"Maze");

            let mode = args[0]

            if(mode) {

                if(!["blind", "no_turning_back", "expert"].includes(mode)) return msg.channel.send(this.lang[msg.author.lang].invalid_arg);

            }

            let game;
            let menu = new disbut.MessageMenu();
            
            let labels = ["Small maze", "Medium maze", "Large maze", "Cancel"];
            let values = ["9", "11", "13", "0"];
            let descriptions = ["9x9", "11x11", "13x13", "Cancel the game."];

            for(let i = 0; i < 4; i++){

                let option = new disbut.MessageMenuOption()
                        .setLabel(labels[i])
                        .setValue(values[i])
                        .setDescription(descriptions[i]);

                menu.addOption(option);

            }

            menu.setPlaceholder("Choose a size!")
                .setID("324");

            let sent = await msg.channel.send(this.lang[msg.author.lang].choose, menu)

            /** @type {disbut.MenuCollector} */
            let collector = sent.createMenuCollector( (b) => b.clicker.id === msg.author.id , {time : 15000});

            collector.on("collect", async (menu) => {

                await menu.reply.defer();

                if (menu.values[0] === "0"){

                    msg.channel.send(this.lang[msg.author.lang].cancelled)
                    this.client.playing.delete(msg.author.id);

                }else{

                    let size = parseInt(menu.values[0]);
                    game = new Mazegame(msg.author.id, size, mode);

                }

                await menu.reply.delete();

            })

            collector.once("end", async (menu, reason) => {

                if(reason === "time") { 
                    sent.delete();
                    msg.channel.send("Timeout");
                    this.client.playing.delete(msg.author.id);
                    return;
                }

                if(this.client.playing.has(msg.author.id));

                let field = {name : "Object:", value : "Use the up, right, down and left button to move to the redblock!", inline : true};
                let embed = this.client.EmbedMaker(msg, game.stringify(), this.client.colors.red, [field]);

                let reactions = ["⬆️", "⬅️", "⬇️", "➡️", "🛑"];
                let directions = ["[0,-1]", "[-1,0]", "[0,1]", "[1,0]", "0"];
                
                let row = new disbut.MessageActionRow();

                for(let i = 0; i < 5; i++){

                    let button = new disbut.MessageButton()
                            .setStyle("blurple")
                            .setLabel(reactions[i])
                            .setID(directions[i]);

                    row.addComponent(button)

                }

                let game_message = await msg.channel.send(embed, row);
                /** @type {disbut.ButtonCollector} */
                let btn_Collector = game_message.createButtonCollector((b) => b.clicker.id === msg.author.id , {idle : 75 * 1000})

                btn_Collector.on("collect", async (button) => {

                    await button.reply.defer();

                    if(button.id === "0"){

                       msg.channel.send(this.lang[msg.author.lang].abrupted);
                       btn_Collector.stop();
                       return;

                    }

                    let direction = JSON.parse(button.id);
                    switch(game.move(direction[0], direction[1])){

                        case 0:
                            msg.channel.send(this.lang[msg.author.lang].hitwall).then( (sent) => {

                                setTimeout(() => sent.delete(), 3000)

                            });
                            break;

                        case 1:
                            embed.description = game.stringify();
                            game_message.edit(embed);
                            break;

                        case 2:
                            msg.channel.send(this.lang[msg.author.lang].win); 
                            embed.description = game.stringify();
                            game_message.edit(embed);
                            btn_Collector.stop()
                            break;

                        case 3:
                            msg.channel.send(this.lang[msg.author.lang].fail); 
                            embed.description = game.stringify();
                            game_message.edit(embed);
                            btn_Collector.stop()
                            break;



                    }

                })

                btn_Collector.once("end", async (button, reason) => {

                    if(reason === "time") msg.channel.send("timeout");
                    this.client.playing.delete(msg.author.id);

                })

            })

        };

        this.lang = {

            "zh_TW":
            {
                "choose" : "選擇迷宮大小:",
                "cancelled" : "取消遊戲",
                "abrupted" : "遊戲中止",
                "hitwall" : "好痛...撞到牆了...",
                "win" : "你贏了!",
                "fail" : "你掉到了無盡的深淵之中...",
                "invalid_arg" : "找不到的迷宮模式 "
            },
            "en_US":
            {
                "choose" : "Choose maze size:",
                "cancelled" : "Game cancelled.",
                "abrupted" : "Game abrupted.",
                "hitwall" : "Ouch! I hit a wall...",
                "win" : "You win!",
                "fail" : "You fell into the abyss...",
                "invalid_arg" : "Can not find mode "
            }

        }

    }

}

class Mazegame{

    constructor(id, size, mode){

        this.board = this.generate_Maze(size, size);
        this.x = 0;
        this.y = 0;
        this.size = size;
        this.mode = mode;
        this.id = id;

    }

    generate_Maze(col, row){

        let singlerow = [];
        let wallrow = [];
        let board = [];
        let stack = [];
        singlerow.push("🟥");

        for(let i = 0; i < col; i++){

            wallrow.push("⬛");

        }

        for(let i = 0; i < (col-1)/2; i++){

            singlerow.push("⬛");
            singlerow.push("🟥");

        }

        board.push(singlerow.slice());

        for(let i = 0; i < (row-1)/2; i++){

            board.push(wallrow.slice());
            board.push(singlerow.slice());

        }

        stack.push([0,0]);
        let current = [0,0];
        board[0][0] = "⬜";
        let longest = 0;
        let longest_chord = [0,0];
        let distance = 0;

        while(stack.length > 0){

            let available = [];

            //top
            if(current[0] - 2 > -1 && board[current[0] - 2][current[1]] === "🟥") {
                available.push([current[0] - 2, current[1]]);
            }

            //left
            if(current[1] - 2 > -1 && board[current[0]][current[1] - 2] === "🟥") {
                available.push([current[0], current[1] - 2]);
            }

            //down
            if(current[0] + 2 < row && board[current[0] + 2][current[1]] === "🟥") {
                available.push([current[0] + 2, current[1]]);
            }

            //right
            if(current[1] + 2 < col && board[current[0]][current[1] + 2] === "🟥") {
                available.push([current[0], current[1] + 2]);
            }

            if(available.length > 0){

                let last = [current[0], current[1]];
                let index = Math.floor(Math.random()*available.length);
                current = available[index];
                stack.push(current);
                board[(current[0] + last[0]) / 2][(current[1] + last[1]) / 2] = "⬜";
                board[current[0]][current[1]] = "⬜";
                distance++;

            }else{

                if(distance > longest) {longest_chord = current; longest = distance;}
                current = stack.pop();

            }

        }

        board[longest_chord[0]][longest_chord[1]] = "🟥"
        board[0][0] = "🟩"

        return board;

    }

    move(dx, dy){

        if(this.board[this.y + dy]){

            let next_block = this.board[this.y + dy][this.x + dx];
            if(!next_block) return 0;
            switch(next_block){

                case "⬜":
                    this.board[this.y][this.x] = ["no_turning_back","expert"].includes(this.mode) ? "❌" : "⬜";
                    this.board[this.y + dy][this.x + dx] = "🟩";
                    this.x += dx;
                    this.y += dy;
                    return 1;

                case "🟥":
                    this.board[this.y][this.x] = ["no_turning_back","expert"].includes(this.mode) ? "❌" : "⬜";
                    this.board[this.y + dy][this.x + dx] = "🟩";
                    return 2;

                case "❌":
                    this.board[this.y][this.x] = "⬜";
                    return 3;

            }

            return 0;

        }

        return 0;

    }

    dark(board){

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {

                if(Math.abs(i-this.y) + Math.abs(j-this.x) > 2){

                    board[i][j] = "⬛";

                }
                
            }
        }

        return board;

    }

    stringify(board = this.board){

        board = JSON.parse(JSON.stringify(board));
        if(["blind","expert"].includes(this.mode)) board = this.dark(board);

        let result = ""

        for(let rows of board){

            result += (rows.join("") + "\n")

        }

        return result

    }

}

module.exports = maze