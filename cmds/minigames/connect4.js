const two_p_Game = require("../../typedefs/Game");
const Myclient = require("../../typedefs/client")



class connect4 extends two_p_Game{

    constructor(client){

        super("connect4","minigames",client)

        this.image = "https://cdn.discordapp.com/attachments/737224846878179360/851102547603357746/connect_demo.gif"

        this.cmd = async function(msg,args){

            /**
             * 
             * @param {*} msg 
             * @param {*} iuser 
             * @param {Myclient} client 
             */
  
            async function connect4(msg,iuser,client){

                let game = new c4(msg.author.id,iuser.id)
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
                    let pass = game.reactions.includes(reaction.emoji.name) && !user.bot && user.id === game.redid
                    return pass
                }
                const yfilter = (reaction,user) => {
                    let pass = game.reactions.includes(reaction.emoji.name) && !user.bot && user.id === game.yellowid
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
                            let current_player = iuser
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
                            let current_player = msg.author
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

            this.invitegame(msg,"Connect 4",connect4)

        }

    }

}

class c4{

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


}

module.exports = connect4