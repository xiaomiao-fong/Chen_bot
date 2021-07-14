const Discord = require('discord.io');
const discord = require('discord.js');
const Myclient = require("../client")



dict = {

    "dice" : { 
        "command" : async function(msg,args){

                return msg.channel.send(`You rolled: ${Math.floor(Math.random()*6)+1}`)

            }, "help" : {"des" : "Randomly generates a number between 1~6",}    
    },

    "Bulls&Cows" : {
        
        /**
         * @param {Myclient} client - own custom client
         * @param {discord.Message} msg - message
         */

        "command" : async function(msg, client, args){

            if(client.check_playing(msg) === 0) return;

            client.playing.set(msg.author.id,"Bulls&Cows")

            game = new client.Group_classes["minigames"].guessnumber(msg.author.id)
            let correct = false;
            let history = "Game History:\n"
        
            bmsg = await msg.channel.send({embed : client.EmbedMaker(msg, history, 0x1DC9D6)})
            const filter = m => game.valid(m.content)

            /**
             * @type {discord.MessageCollector}
             */

            const anscollect = msg.channel.createMessageCollector(filter, { idle : 600 * 1000 })

            
            anscollect.on('collect', async message =>{

                if (message.content === "end" || message.content === "cn!minigames guessnumber"){

                    bmsg.edit(client.EmbedMaker(msg, `You didn't guess the correct answer. The answer is ${game.answer}`, 0x1DC9D6))
                    correct = true
                    anscollect.stop()
                    return

                }

                let result = game.guess(message.content)
                let A = result[0], B = result[1]

                if(A == 4){

                    bmsg.edit(client.EmbedMaker(msg, `You guessed the correct answer! The answer is ${game.answer}`, 0x1DC9D6))
                    correct = true
                    anscollect.stop()

                }else{

                    history += `${message.content} : ${A}A ${B}B\n`
                    bmsg.edit(client.EmbedMaker(msg,history,0x1DC9D6))

                }

            });

            anscollect.on("end",(collected,reason)=>{

                console.log("game end")
                if(reason === "idle"){

                    msg.channel.send("timeout")

                }

                client.playing.delete(msg.author.id)
                
                return

            })

        },"help": {"des" : "Bulls and Cows is a game that you guess for a 4-digit number, all digits are different.\nIf you want to know more about this game, check out this website!\nhttps://www.codingame.com/playgrounds/52463/bulls-and-cows\n\nPs:In this version A,B refers to Bulls and Cows"}
    },

    "connect4" : { 
        
        /**
         * @param {Myclient} client - own custom client
         */
        "command" : async function(msg, client, args){
  
            async function connect4(msg,accept,iuser){

                if(accept === 0) {msg.channel.send("timeout")}
                if(accept !== 2) return

                let game = new client.Group_classes["minigames"].connect4(msg.author.id,iuser.id)
                let end = false;
                let current_color = "red";
                

                let field1 = {name: "Now : ",value: `${msg.author.username}'s turn!` , inline: true}
                let rmsg = await msg.author.send(client.EmbedMaker(msg, game.stringify(), client.colors.red,[field1]))
                let ymsg = await iuser.send(client.EmbedMaker(msg, game.stringify(), client.colors.red,[field1]))

                for(var i = 0; i < 8; i++){
                    rmsg.react(game.reactions[i])
                    ymsg.react(game.reactions[i])
                }

                const rfilter = (reaction,user) => {
                    pass = game.reactions.includes(reaction.emoji.name) && !user.bot && user.id === game.redid
                    return pass
                }
                const yfilter = (reaction,user) => {
                    pass = game.reactions.includes(reaction.emoji.name) && !user.bot && user.id === game.yellowid
                    return pass
                }

                const redcollector = rmsg.createReactionCollector(rfilter,{ idle: 300*1000 })
                const yellowcollector = ymsg.createReactionCollector(yfilter,{ idle: 300*1000 })

                redcollector.on("collect", async (reaction,user) =>{
                
                    if(reaction.emoji.name === "🛑"){

                        rmsg.edit(client.EmbedMaker(msg,`Game abrupted by ${user.username}`, client.colors.black))
                        ymsg.edit(client.EmbedMaker(msg,`Game abrupted by ${user.username}`, client.colors.black))
                        end = true
                        redcollector.stop()
                        yellowcollector.stop()
                        return

                    }

                    console.log("r1")
                    if(user.id === game.redid && current_color !== "red") return
                    console.log("r2")

                    switch(game.place("1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣🛑".indexOf(reaction.emoji.name)/3,current_color)){

                        case 0:
                            msg.channel.send("This column is full")
                            break;

                        case 1:
                            current_color = "yellow"
                            current_player = iuser
                            let field1 = {name: "Now : ",value: `${current_player.username}'s turn!` , inline: true}
                            await rmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[current_color],[field1]))
                            await ymsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[current_color],[field1]))
                            /*ai calulation
                            let board = game.map.slice()
                            let stack = game.stack.slice()
                            let result = game.c4minimax(board,stack,4,true,0,0)
                            switch(game.place(result.move,current_color)){

                                case 1:
                                    current_color = "red"
                                    let field2 = {name: "Now : ",value: `${current_color}'s turn!` , inline: true}
                                    bmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[current_color],[field2]))
                                    break;

                                case 2:

                                    bmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[current_color]))
                                    msg.channel.send(current_color + " wins!")
                                    reactcollector.stop()
                                    end = true
                                    break;

                            }
                            */
                            break;
                        case 2:
                            await rmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[current_color]))
                            await ymsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[current_color]))
                            iuser.send(msg.author.username + " wins!")
                            msg.author.send(msg.author.username + " wins!")
                            redcollector.stop()
                            yellowcollector.stop()
                            break;

                        case 3:
                            await rmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors.white))
                            await ymsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors/white))
                            iuser.send("Draw!")
                            msg.author.send("Draw!")
                            redcollector.stop()
                            yellowcollector.stop()
                            break;
                        }

                })

                yellowcollector.on("collect", async (reaction,user) =>{
                
                    if(reaction.emoji.name === "🛑"){

                        rmsg.edit(client.EmbedMaker(msg,`Game abrupted by ${user.username}`, client.colors.black))
                        ymsg.edit(client.EmbedMaker(msg,`Game abrupted by ${user.username}`, client.colors.black))
                        end = true
                        redcollector.stop()
                        yellowcollector.stop()
                        return

                    }

                    console.log("y1")
                    if(user.id === game.yellowid && current_color !== "yellow") return
                    console.log("y2")

                    switch(game.place("1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣🛑".indexOf(reaction.emoji.name)/3,current_color)){

                        case 0:
                            msg.channel.send("This column is full")
                            break;

                        case 1:
                            current_color = "red"
                            current_player = msg.author
                            let field1 = {name: "Now : ",value: `${current_player.username}'s turn!` , inline: true}
                            await rmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[current_color],[field1]))
                            await ymsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[current_color],[field1]))
                            /*ai calulation
                            let board = game.map.slice()
                            let stack = game.stack.slice()
                            let result = game.c4minimax(board,stack,4,true,0,0)
                            switch(game.place(result.move,current_color)){

                                case 1:
                                    current_color = "red"
                                    let field2 = {name: "Now : ",value: `${current_color}'s turn!` , inline: true}
                                    bmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[current_color],[field2]))
                                    break;

                                case 2:

                                    bmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[current_color]))
                                    msg.channel.send(current_color + " wins!")
                                    reactcollector.stop()
                                    end = true
                                    break;

                            }
                            */
                            break;
                        case 2:
                            await rmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[current_color]))
                            await ymsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors[current_color]))
                            iuser.send(iuser.username + " wins!")
                            msg.author.send(iuser.username + " wins!")
                            end = true
                            redcollector.stop()
                            yellowcollector.stop()
                            break;

                        case 3:
                            await rmsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors.white))
                            await ymsg.edit(client.EmbedMaker(msg, game.stringify(), client.colors.white))
                            iuser.send("Draw!")
                            msg.author.send("Draw!")
                            redcollector.stop()
                            yellowcollector.stop()
                            break;

                        }
                })

                redcollector.on("end",()=>{
                    console.log("rend")
                    client.emit("game_end",msg.author,iuser)
                })

                yellowcollector.on("end",()=>{
                    console.log("yend")
                })
            
            }

            client.invitegame(msg,"Connect 4",connect4)
        


    },"help" : {"des":"Connect 4 is a two player game. The object is that you drop your chesses inside a 6x7 grid and try to connect 4 same colors in a row, it can be horizontal, diagonal or vertical.\n\nDo cn!minigame ``@username`` to invite someone to play w/ you!",
                "image":"https://cdn.discordapp.com/attachments/737224846878179360/851102547603357746/connect_demo.gif"}
    },

    "reversi" : { 
        
        /**
         * @param {Myclient} client - own custom client
         */
        "command" : async function(msg, client, args){


            async function reversi(msg,accept,iuser){
                
                if(accept === 0) {msg.channel.send("timeout")}
                if(accept !== 2) return

                let game = new client.Group_classes["minigames"].reversi(iuser.id,msg.author.id);
                game.availablecolor("white")
                let current_color = "black"

                let field1 = {name: "Now : ",value: `${msg.author.username}'s turn!` , inline: true}
                let field2 = {name: "Syntax :",value: "(row,column)\nEx: (3,7)", inline : true}
                let bmsg = await msg.author.send(client.EmbedMaker(msg,game.stringify(),client.colors.black,[field1,field2]));
                let wmsg = await iuser.send(client.EmbedMaker(msg,game.stringify(game.board),client.colors.white,[field1,field2]));
                
                await msg.author.send("Game start! If you want to Surrender just type surrender")
                await iuser.send("Game start! If you want to Surrender just type surrender")

                let bfilter = message => (current_color === "black" && message.author.id === game.blackid && !message.author.bot);
                let bcollector = bmsg.channel.createMessageCollector(bfilter,{idle : 300*1000});
                let wfilter = message => (current_color === "white" && message.author.id === game.whiteid && !message.author.bot);
                let wcollector = wmsg.channel.createMessageCollector(wfilter,{idle : 300*1000})
                s1 = new RegExp("\\([0-9],[0-9]\\)")
                s2 = new RegExp("[0-9],[0-9]")

                let gameresult = function(status = "Normal"){

                    let endfield = {name : "Winner : ", value : null, inline : true} 

                    if(status === "white"){

                        endfield.value = `${msg.author.username} (Black) wins!`;
                        msg.author.send("White surrendered")

                    }else if(status === "black"){

                        endfield.value = `${iuser.username} (White) wins!`
                        iuser.send("Black surrendered")

                    }else{

                        switch(game.endgame()){

                            case 0:
                                endfield.name = "Draw!"
                                endfield.value = "No one wins.";
                                break;

                            case 1:
                                endfield.value = `${msg.author.username} (Black) wins!`;
                                break;

                            case 2:
                                endfield.value = `${iuser.username} (White) wins!`

                        }

                        

                    }

                    bmsg.edit(client.EmbedMaker(msg,game.stringify(game.board),client.colors.black,[endfield]))
                    wmsg.edit(client.EmbedMaker(msg,game.stringify(game.board),client.colors.white,[endfield]))
                    client.emit('game_end',msg.author,iuser)


                }
                
                bcollector.on("collect",async (message)=>{

                    if(message.content === "surrender"){

                        client.stopgame(bcollector,wcollector)
                        gameresult("black")
                        return

                    }

                    if(message.content.match(s1) != undefined){

                        if(message.content.match(s1)[0] != undefined){

                            numarr = message.content.match(s2)[0].split(",")
                            console.log(Number(numarr[1])-1,Number(numarr[0])-1)
                            switch(game.place(Number(numarr[1])-1,Number(numarr[0])-1, current_color)){

                                case 0:
                                    tempmsg = await message.channel.send("That place is unplaceable(b)")
                                    setTimeout(() => tempmsg.delete(), 2000)
                                    break;

                                case 1:

                                    //console.log(game.board)
                                    let field2 = {name: "Syntax :",value: "(row,column)\nEx: (3,7)", inline : true}

                                    if(game.tempavailable.length > 0){

                                        let field1 = {name: "Now : ",value: `${iuser.username}'s turn!` , inline: true}
                                        await bmsg.edit(client.EmbedMaker(msg,game.stringify(game.board),client.colors.black,[field1,field2]))
                                        await wmsg.edit(client.EmbedMaker(msg,game.stringify(),client.colors.white,[field1,field2]))
                                        current_color = "white"

                                    }else{

                                        console.log("skiped")
                                        let field1 = {name: "Now : ",value: `${msg.author.username}'s turn!` , inline: true}
                                        game.availablecolor()
                                        if(game.tempavailable.length > 0){
                                            
                                            await bmsg.edit(client.EmbedMaker(msg,game.stringify(),client.colors.black,[field1,field2]))
                                            await wmsg.edit(client.EmbedMaker(msg,game.stringify(game.board),client.colors.white,[field1,field2]))
                                            current_color = "black"

                                        }else{

                                            client.stopgame(bcollector,wcollector)
                                            gameresult()
                                            
                                        }

                                    }

                                    break;

                            }

                        }
                    }

                })

                wcollector.on("collect",async (message)=>{

                    if(message.content === "surrender"){

                        client.stopgame(bcollector,wcollector)
                        gameresult("white")
                        return

                    }

                    if(message.content.match(s1) != undefined){

                        if(message.content.match(s1)[0] != undefined){

                            numarr = message.content.match(s2)[0].split(",")
                            console.log(Number(numarr[1])-1,Number(numarr[0])-1)
                            switch(game.place(Number(numarr[1])-1,Number(numarr[0])-1, current_color)){

                                case 0:
                                    tempmsg = await message.channel.send("That place is unplaceable(w)")
                                    setTimeout(() => tempmsg.delete(), 2000)
                                    break;

                                case 1:

                                    let field2 = {name: "Syntax :",value: "(row,column)\nEx: (3,7)", inline : true}

                                    if(game.tempavailable.length>0){

                                        let field1 = {name: "Now : ",value: `${msg.author.username}'s turn!` , inline: true}
                                        bmsg.edit(client.EmbedMaker(msg,game.stringify(),client.colors.black,[field1,field2]))
                                        wmsg.edit(client.EmbedMaker(msg,game.stringify(game.board),client.colors.white,[field1,field2]))
                                        current_color = "black"

                                    }else{

                                        console.log("skiped")
                                        let field1 = {name: "Now : ",value: `${iuser.username}'s turn!` , inline: true}
                                        game.availablecolor()
                                        if(game.tempavailable.length>0){

                                            bmsg.edit(client.EmbedMaker(msg,game.stringify(game.board),client.colors.black,[field1,field2]))
                                            wmsg.edit(client.EmbedMaker(msg,game.stringify(),client.colors.white,[field1,field2]))
                                            current_color = "white"

                                        }else{

                                            client.stopgame(bcollector,wcollector)
                                            gameresult()
                                            
                                        }

                                    }
                                    break;

                            }

                        }
                    }

                })

            }

            client.invitegame(msg,"Reversi",reversi)
            
        },
        "help" : {"des" : "Reversi is a two player game. The object is to flip all your opponent's color into your color",
                  "image" : "https://cdn.discordapp.com/attachments/736438309093638254/859389017660588092/reversi.gif"}
    }
}

class_dict = {

    "guessnumber" : class guessnumber{

        constructor(playerid){

            this.arr = ["0","1","2","3","4","5","6","7","8","9"]
            this.answer = this.gen_ans()
            this.player = playerid

        }

        gen_ans(){

            let ans = ""
            while(ans.length<4){

                var temp = this.arr[Math.floor(Math.random()*10)]
                if(!ans.includes(temp)){

                    ans += temp;
                }
            }
            return ans
        }

        guess(guess_number){

            var A=0,B=0;

            for(var i = 0; i < 4; i++){

                if(this.answer.includes(guess_number[i])){

                    if(this.answer[i] === guess_number[i]){
                        A+=1;
                    }else{
                        B+=1;
                    }
                }
            }
            return [A,B]
        }

        valid(guess_number,authorid){

            if(guess_number == "end" || guess_number == "cn!minigames guessnumber") return true
            if(guess_number.length!==4) return false
            if(this.playerid !== authorid) return false

            for(var i = 0; i < 4; i++){       
                if(!this.arr.includes(guess_number[i])) return false
            }

            for(var i = 0; i < 3; i++){
                for(var j = i + 1; j < 4;j++){
                    if(guess_number[i] === guess_number[j]) return false
                }
            }
            return true
        }
    },

    "connect4" : class c4{

        constructor(redid,yellowid){

            this.stack = [5,5,5,5,5,5,5]
            this.map = [["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
                        ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
                        ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
                        ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
                        ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
                        ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"]]
            this.redid = redid
            this.yellowid = yellowid
            this.reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣',"🛑"]

        }

        place(col_i, color){

            let x, y;

            if(this.stack[col_i] !== -1){
                
                x = col_i
                y = this.stack[col_i]
                if(color === "yellow"){
                    this.map[y][x] = "🟡"
                }else{
                    this.map[y][x] = "🔴"
                }
                this.stack[col_i] -= 1

            }else{

                return 0;

            }

            return this.check(x, y)

        }

        check(x, y, board = this.map){

            let color = board[y][x]
            if (color === "⚪") return 1;
            //horizontal
            if(this.search(x, y , color, 1, 0, 0) + this.search(x, y , color, -1, 0, 0) - 1 >= 4){
                return 2
            }
            //lt-rb diagonal
            if(this.search(x, y , color, 1, 1, 0) + this.search(x, y , color, -1, -1, 0) - 1 >= 4){
                return 2
            }
            //lt-rb diagonal
            if(this.search(x, y , color, -1, 1, 0) + this.search(x, y , color, 1, -1, 0) - 1 >= 4){
                return 2
            }
            //vertical
            if(this.search(x, y , color, 0, 1, 0) + this.search(x, y , color, 0, -1, 0) - 1 >= 4){
                return 2
            }

            let countstack = 0
            for(let i = 0; i < 7; i++){
                if(this.stack[i] === -1){
                    countstack++
                }
            }

            if(countstack === 7) return 3;

            return 1

        }

        

        search(x, y, color, dx, dy, count, board = this.map){

            if(x<0 || x>6 || y<0 || y>5) return count
            if(color !== board[y][x]) return count

            return this.search(x+dx, y+dy, color, dx, dy, count+1, board)

        }

        search2(x, y, color, dx, dy, count, board){

            if(x<0 || x>6 || y<0 || y>5) return {count : count, live : 0}
            if(board[y][x] !== color){
                if(board[y][x] === "⚪"){
                    return {count : count, live : 1}
                }
                return {count : count, live : 0}
            }

            let result = this.search2(x+dx, y+dy, color, dx, dy, count+1, board)

            return result

        }

        c4minimax(board, stack, depth, max, lx, ly){

            if(this.check(lx,ly,board) === 2 || depth === 0){

                let temp1 = this.board_evaluation(board,"🟡")
                let temp1score = temp1.two + temp1.three*5/3 + temp1.four*15
                let temp2 = this.board_evaluation(board,"🔴")
                let temp2score = temp2.two + temp2.three*5/3 + temp2.four*20
                if(temp1.four>0 || temp2.four>0) console.log(temp1score-temp2score)

                return {score : temp1score-temp2score, move : 0}
            }

            if(max){

                let best_score = -Infinity
                let best_move = 0

                stack.forEach( col => {

                    if(stack[col] > -1){

                        board[stack[col]][col] = "🟡"
                        stack[col] -= 1;
                        let {score,move} = this.c4minimax(board,stack,depth-1,false,col,stack[col]+1)
                        if(score > best_score){

                            best_score = score
                            best_move = col

                        }
                        stack[col] += 1;
                        board[stack[col]][col] = "⚪"

                    }
                    
                });

                return {score : best_score, move : best_move}

            }else{

                let cbest_score = Infinity
                let cbest_move = 0

                stack.forEach( col => {

                    if(stack[col] > -1){

                        board[stack[col]][col] = "🔴"
                        stack[col] -= 1;
                        let {score, move} = this.c4minimax(board,stack,depth-1,true,col,stack[col]+1)
                        if(score < cbest_score){

                            cbest_score = score
                            cbest_move = col

                        }
                        stack[col] += 1;
                        board[stack[col]][col] = "⚪"

                    }
                    
                });

                return {score : cbest_score, move : cbest_move}

            }



        }

        board_evaluation(board, color){

            let result = {two : 0, three : 0, four : 0}

            for(var i = 0; i < 6; i++){
                for(var j = 0; j < 7; j++){

                    if(board[i][j] === color){

                        let x = j;
                        let y = i;
                        let arr = 
                        [this.search2(x, y , color, 1, 0, 0,board),this.search2(x, y , color, -1, 0, 0,board),
                        this.search2(x, y , color, 1, 1, 0,board),this.search2(x, y , color, -1, -1, 0,board),
                        this.search2(x, y , color, -1, 1, 0,board),this.search2(x, y , color, 1, -1, 0,board),
                        this.search2(x, y , color, 0, 1, 0,board),this.search2(x, y , color, 0, -1, 0,board)]

                        for(var q = 0; q < 4; q++){

                            switch(arr[2*q].count+arr[2*q+1].count-1){

                                case 2:
                                    if(arr[2*q].live) result.two++;
                                    break;

                                case 3:
                                    if(arr[2*q].live + arr[2*q+1].live > 0) {
                                        result.three++
                                    }else if(arr[2*q].live + arr[2*q+1].live === 2){
                                        console.log(1)
                                        result.four++
                                    }
                                    break;

                                case 4:
                                    result.four++
                                    break;


                            }

                        }

                    }

                }
            }
            return result
        }

        stringify(board = this.map){

            var result = ""
            for(var i = 0; i < 6; i++){
                var sub = ""
                for(var j = 0; j < 7; j++){
                    sub += board[i][j];
                }
                result += (sub+'\n')
            }

            return result

        }


    },

    "reversi" : class reversi{

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
                          ["🟫","🟫","🟫","🟫","🟫","🟫","🟫","🟫"]]

            this.tempboard;
            this.tempavailable = []

            this.available = ["23","24","32","35","42","45","53","54"]

        }

        place(col, row, color, board = this.board){

            if(!this.check(col, row, color, board)) return 0
            //console.log(this.stringify(this.board))

            this.available.splice(this.available.indexOf(String(row)+String(col)),1)

            for(let i = -1; i < 2; i++){

                for(let j = -1; j < 2; j++){

                    if(board[row+i] === undefined) break;
                    if(board[row+i][col+j] === "🟫" && !this.available.includes(String(row+i)+String(col+j))){

                        this.available.push(String(row+i)+String(col+j))

                    }

                }

            }


            this.availablecolor(color)


            return 1

        }

        availablecolor(color){


            //color = color === "black" ? "⚫" : "⚪"
            this.tempboard = JSON.parse(JSON.stringify(this.board))
            this.tempavailable = []
            color = color === "black" ? "white" : "black"

            this.available.forEach( placeindex =>{

                let r = Number(placeindex[0])
                let c = Number(placeindex[1])

                if(this.check(c, r, color, this.board, false)){

                    this.tempboard[r][c] = "🟩"
                    console.log(placeindex)
                    this.tempavailable.push(placeindex)

                }

            })

           // this.tempavailable.forEach(placeindex => console.log(placeindex))
            
        }

        check(x, y, color, board = this.board, replace = true){

            let total = 0;
            color = color === "black" ? "⚫" : "⚪"
            //if(replace) console.log(board[y][x], color)
            if(board[y][x] === "⚫" || board[y][x] === "⚪") {return false}
            total += this.search(x+1, y, board, 1, 0, color, 0, replace)

            total += this.search(x+1, y+1, board, 1, 1, color, 0, replace)

            total += this.search(x, y+1, board, 0, 1, color, 0, replace)

            total += this.search(x-1, y+1, board, -1, 1, color, 0, replace)

            total += this.search(x-1, y, board, -1, 0, color, 0, replace)

            total += this.search(x-1, y-1, board, -1, -1, color, 0, replace)

            total += this.search(x, y-1, board, 0, -1, color, 0, replace)

            total += this.search(x+1, y-1, board, 1, -1, color, 0, replace)
            if(total === 0) return false
            if(replace) board[y][x] = color
            return true

        }

        search(x, y, board = this.board, dx, dy, color, count, replace){

            if(board[y] === undefined) return 0
            if(board[y][x] === undefined) return 0
            if(board[y][x] === "🟫" || board[y][x] === "🟩") return 0
            if(board[y][x] === color) return count

            let result = this.search(x+dx, y+dy, board, dx, dy, color, count+1, replace)
            if(result !== 0 && replace) {board[y][x] = color}
            return result

        }

        stringify(board = this.tempboard){

            let arr = ["⬛", '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', "8️⃣"]
            let result = ""
            for(let i = 0;i < 9; i++){
                result += arr[i]
            }
            result += '\n'

            for(let i = 0; i < 8; i++){
                let substring = arr[i+1]
                for(let j = 0; j < 8; j++){
                    substring += board[i][j]
                }
                result += (substring+'\n')
            }

            return result

        }

        endgame(){

            let white = 0, black = 0;

            for(let i = 0; i < 8; i++){
                for(let j = 0; j < 8; j++){
                    if(this.board[i][j] === "⚫") black++
                    if(this.board[i][j] === "⚪") white++
                }
            }

            if(black > white) return 1;
            if(white > black) return 2;
            if(black === white) return 0;


        }

    }
}

module.exports = {"mod" : dict, "modclass" : class_dict}