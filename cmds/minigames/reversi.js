const Two_P_Game = require("../../typedefs/Game");
const Myclient = require("../../typedefs/client")


class Reversi extends Two_P_Game{

    constructor(client){

        super("reversi","minigames",client)
        
        this.image = "https://cdn.discordapp.com/attachments/736438309093638254/859389017660588092/reversi.gif"

        this.cmd = async function(msg, client, args){

            /**
             * 
             * @param {*} msg 
             * @param {*} iuser 
             * @param {Myclient} client 
             */

            async function reversi(msg,iuser,client){
                
                let game = new Reversi_Cls(iuser.id,msg.author.id);
                game.availablecolor("white");
                let Current_Color = "black";
                let userlang = msg.author.lang;
                let gamelang = client.language.commands.game[userlang];

                let field1 = {name: "Now : ",value: msg.author.username + gamelang.ones_turn , inline: true};
                let field2 = {name: gamelang.syntax ,value: gamelang.row_col, inline : true};
                let bmsg = await msg.author.send(client.EmbedMaker(msg,game.stringify(),client.colors.black,[field1,field2]));
                let wmsg = await iuser.send(client.EmbedMaker(msg,game.stringify(game.board),client.colors.white,[field1,field2]));
                
                await msg.author.send(gamelang.type_surr);
                await iuser.send(gamelang.type_surr);

                let bfilter = (message) => (Current_Color === "black" && message.author.id === game.blackid && !message.author.bot);
                let bcollector = bmsg.channel.createMessageCollector(bfilter,{idle : 300*1000});
                let wfilter = (message) => (Current_Color === "white" && message.author.id === game.whiteid && !message.author.bot);
                let wcollector = wmsg.channel.createMessageCollector(wfilter,{idle : 300*1000});
                let s1 = new RegExp("\\([0-9],[0-9]\\)");
                let s2 = new RegExp("[0-9],[0-9]");

                let gameresult = function(status = "Normal"){

                    let endfield = {name : "Winner : ", value : null, inline : true} ;

                    if(status === "white"){

                        endfield.value = `${msg.author.username} (Black) ` + gamelang.wins;
                        msg.author.send(gamelang.w_surr);

                    }else if(status === "black"){

                        endfield.value = `${iuser.username} (White) ` + gamelang.wins;
                        iuser.send(gamelang.b_surr);

                    }else{

                        switch(game.endgame()){

                            case 0:
                                endfield.name = gamelang.draw;
                                endfield.value = gamelang.no1wins;
                                break;

                            case 1:
                                endfield.value = `${msg.author.username} (Black) ` + gamelang.wins;
                                break;

                            case 2:
                                endfield.value = `${iuser.username} (White) ` + gamelang.wins;

                        }

                        

                    }

                    bmsg.edit(client.EmbedMaker(msg,game.stringify(game.board),client.colors.black,[endfield]));
                    wmsg.edit(client.EmbedMaker(msg,game.stringify(game.board),client.colors.white,[endfield]));
                    client.emit("game_end",msg.author,iuser);
                    
                }
                
                bcollector.on("collect",async (message)=>{

                    if(message.content === "surrender"){

                        client.stopgame(bcollector,wcollector);
                        gameresult("black");
                        return;

                    }

                    if(message.content.match(s1) != undefined){

                        if(message.content.match(s1)[0] != undefined){

                            let numarr = message.content.match(s2)[0].split(",");
                            console.log(Number(numarr[1])-1,Number(numarr[0])-1);
                            switch(game.place(Number(numarr[1])-1,Number(numarr[0])-1, Current_Color)){

                                case 0:
                                    let tempmsg = await message.channel.send(gamelang.unplaceable);
                                    setTimeout(() => tempmsg.delete(), 2000);
                                    break;

                                case 1:

                                    //console.log(game.board)
                                    let field2 = {name: gamelang.syntax ,value: gamelang.row_col, inline : true};

                                    if(game.tempavailable.length > 0){

                                        let field1 = {name: "Now : ",value: iuser.username + gamelang.ones_turn , inline: true};
                                        await bmsg.edit(client.EmbedMaker(msg,game.stringify(game.board),client.colors.black,[field1,field2]));
                                        await wmsg.edit(client.EmbedMaker(msg,game.stringify(),client.colors.white,[field1,field2]));
                                        Current_Color = "white";

                                    }else{

                                        console.log("skiped");
                                        let field1 = {name: "Now : ",value: msg.author.username + gamelang.ones_turn , inline: true};
                                        game.availablecolor();
                                        if(game.tempavailable.length > 0){
                                            
                                            await bmsg.edit(client.EmbedMaker(msg,game.stringify(),client.colors.black,[field1,field2]));
                                            await wmsg.edit(client.EmbedMaker(msg,game.stringify(game.board),client.colors.white,[field1,field2]));
                                            Current_Color = "black";

                                        }else{

                                            client.stopgame(bcollector,wcollector);
                                            gameresult();
                                            
                                        }

                                    }

                                    break;

                            }

                        }
                    }

                })

                wcollector.on("collect",async (message)=>{

                    if(message.content === "surrender"){

                        client.stopgame(bcollector,wcollector);
                        gameresult("white");
                        return;

                    }

                    if(message.content.match(s1) != undefined){

                        if(message.content.match(s1)[0] != undefined){

                            let numarr = message.content.match(s2)[0].split(",");
                            console.log(Number(numarr[1])-1,Number(numarr[0])-1);
                            switch(game.place(Number(numarr[1])-1,Number(numarr[0])-1, Current_Color)){

                                case 0:
                                    let tempmsg = await message.channel.send(gamelang.unplaceable);
                                    setTimeout(() => tempmsg.delete(), 2000);
                                    break;

                                case 1:

                                    let field2 = {name: gamelang.syntax ,value: gamelang.row_col, inline : true};

                                    if(game.tempavailable.length>0){

                                        let field1 = {name: "Now : ", value: msg.author.username + gamelang.ones_turn , inline: true};
                                        bmsg.edit(client.EmbedMaker(msg,game.stringify(),client.colors.black,[field1,field2]));
                                        wmsg.edit(client.EmbedMaker(msg,game.stringify(game.board),client.colors.white,[field1,field2]));
                                        Current_Color = "black";

                                    }else{

                                        console.log("skiped");
                                        let field1 = {name: "Now : ",value: iuser.username + gamelang.ones_turn , inline: true};
                                        game.availablecolor();
                                        if(game.tempavailable.length>0){

                                            bmsg.edit(client.EmbedMaker(msg,game.stringify(game.board),client.colors.black,[field1,field2]));
                                            wmsg.edit(client.EmbedMaker(msg,game.stringify(),client.colors.white,[field1,field2]));
                                            Current_Color = "white";

                                        }else{

                                            client.stopgame(bcollector,wcollector);
                                            gameresult();
                                            
                                        }

                                    }
                                    break;

                            }

                        }
                    }

                })

            }

            this.invitegame(msg,"Reversi",reversi);
            
        }

    }

}

class Reversi_Cls{

    constructor(whiteid,blackid){

        this.whiteid = whiteid;
        this.blackid = blackid; 

        this.board = [["🟫","🟫","🟫","🟫","🟫","🟫","🟫","🟫"],
                      ["🟫","🟫","🟫","🟫","🟫","🟫","🟫","🟫"],
                      ["🟫","🟫","🟫","🟫","🟫","🟫","🟫","🟫"],
                      ["🟫","🟫","🟫","⚪","⚫","🟫","🟫","🟫"],
                      ["🟫","🟫","🟫","⚫","⚪","🟫","🟫","🟫"],
                      ["🟫","🟫","🟫","🟫","🟫","🟫","🟫","🟫"],
                      ["🟫","🟫","🟫","🟫","🟫","🟫","🟫","🟫"],
                      ["🟫","🟫","🟫","🟫","🟫","🟫","🟫","🟫"]];

        this.tempboard;
        this.tempavailable = [];

        this.available = ["23","24","32","35","42","45","53","54"];

    }

    place(col, row, color, board = this.board){

        if(!this.check(col, row, color, board)) return 0;
        //console.log(this.stringify(this.board))

        this.available.splice(this.available.indexOf(String(row)+String(col)),1);

        for(let i = -1; i < 2; i++){

            for(let j = -1; j < 2; j++){

                if(board[row+i] === undefined) break;
                if(board[row+i][col+j] === "🟫" && !this.available.includes(String(row+i)+String(col+j))){

                    this.available.push(String(row+i)+String(col+j));

                }

            }

        }


        this.availablecolor(color);


        return 1;

    }

    availablecolor(color){


        //color = color === "black" ? "⚫" : "⚪"
        this.tempboard = JSON.parse(JSON.stringify(this.board));
        this.tempavailable = [];
        color = color === "black" ? "white" : "black";

        this.available.forEach( (placeindex) => {

            let r = Number(placeindex[0]);
            let c = Number(placeindex[1]);

            if(this.check(c, r, color, this.board, false)){

                this.tempboard[r][c] = "🟩";
                console.log(placeindex);
                this.tempavailable.push(placeindex);

            }

        })

       // this.tempavailable.forEach(placeindex => console.log(placeindex))
        
    }

    check(x, y, color, board = this.board, replace = true){

        let total = 0;
        color = color === "black" ? "⚫" : "⚪";
        //if(replace) console.log(board[y][x], color)
        if(board[y][x] === "⚫" || board[y][x] === "⚪") {return false};
        total += this.search(x+1, y, board, 1, 0, color, 0, replace);

        total += this.search(x+1, y+1, board, 1, 1, color, 0, replace);

        total += this.search(x, y+1, board, 0, 1, color, 0, replace);

        total += this.search(x-1, y+1, board, -1, 1, color, 0, replace);

        total += this.search(x-1, y, board, -1, 0, color, 0, replace);

        total += this.search(x-1, y-1, board, -1, -1, color, 0, replace);

        total += this.search(x, y-1, board, 0, -1, color, 0, replace);

        total += this.search(x+1, y-1, board, 1, -1, color, 0, replace);
        if(total === 0) return false;
        if(replace) board[y][x] = color;
        return true;

    }

    search(x, y, board = this.board, dx, dy, color, count, replace){

        if(board[y] === undefined) return 0;
        if(board[y][x] === undefined) return 0;
        if(board[y][x] === "🟫" || board[y][x] === "🟩") return 0;
        if(board[y][x] === color) return count;

        let result = this.search(x+dx, y+dy, board, dx, dy, color, count+1, replace);
        if(result !== 0 && replace) {board[y][x] = color};
        return result;

    }

    stringify(board = this.tempboard){

        let arr = ["⬛", '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', "8️⃣"];
        let result = "";
        for(let i = 0;i < 9; i++){
            result += arr[i];
        }
        result += '\n';

        for(let i = 0; i < 8; i++){
            let substring = arr[i+1];
            for(let j = 0; j < 8; j++){
                substring += board[i][j];
            }
            result += (substring+'\n');
        }

        return result;

    }

    endgame(){

        let white = 0, black = 0;

        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(this.board[i][j] === "⚫") black++;
                if(this.board[i][j] === "⚪") white++;
            }
        }

        if(black > white) return 1;
        if(white > black) return 2;
        if(black === white) return 0;


    }

}

module.exports = Reversi;