const Command = require("../../typedefs/Command");


class BullsandCows extends Command{


    constructor(client){

        super("Bulls&Cows","minigames",client);

        this.cmd = async function(msg, args){

            if(this.client.Check_Playing(msg) === 0) return;
            let userlang = msg.author.lang;
        
            this.client.playing.set(msg.author.id,"Bulls&Cows");
        
            let game = new Guessnumber(msg.author.id);
            let correct = false;
            let history = this.client.language.commands.game[userlang].game_his;
        
            let bmsg = await msg.channel.send({embed : this.client.EmbedMaker(msg, history, 0x1DC9D6)});
            const filter = (m) => game.valid(m.content);
        
            /**
             * @type {discord.MessageCollector}
             */
        
            const anscollect = msg.channel.createMessageCollector(filter, { idle : 600 * 1000 });
        
            
            anscollect.on("collect", async (message) =>{
        
                if (message.content === "end" || message.content === "cn!minigames guessnumber"){
        
                    bmsg.edit(this.client.EmbedMaker(msg, this.client.language.commands.game[userlang].bs_lose + ` ${game.answer}`, 0x1DC9D6));
                    correct = true;
                    anscollect.stop();
                    return
        
                }
        
                let result = game.guess(message.content);
                let A = result[0], B = result[1];
        
                if(A === 4){
        
                    bmsg.edit(this.client.EmbedMaker(msg, this.client.language.commands.game[userlang].bs_win + ` ${game.answer}`, 0x1DC9D6));
                    correct = true;
                    anscollect.stop();
        
                }else{
        
                    history += `${message.content} : ${A}A ${B}B\n`;
                    bmsg.edit(this.client.EmbedMaker(msg,history,0x1DC9D6));
        
                }
        
            });
        
            anscollect.on("end",(collected,reason)=>{
        
                console.log("game end");
                if(reason === "idle"){
        
                    msg.channel.send("timeout");
        
                }
        
                this.client.playing.delete(msg.author.id);
                
                return
        
            })
        
        };

    }

}



class Guessnumber{

    constructor(playerid){

        this.arr = ["0","1","2","3","4","5","6","7","8","9"];
        this.answer = this.Gen_Ans();
        this.player = playerid;

    }

    Gen_Ans(){

        let ans = "";
        while(ans.length<4){

            var temp = this.arr[Math.floor(Math.random()*10)];
            if(!ans.includes(temp)){

                ans += temp;
            }
        }
        return ans;
    }

    guess(Guess_Number){

        var A=0,B=0;

        for(var i = 0; i < 4; i++){

            if(this.answer.includes(Guess_Number[i])){

                if(this.answer[i] === Guess_Number[i]){
                    A+=1;
                }else{
                    B+=1;
                }
            }
        }
        return [A,B];
    }

    valid(Guess_Number,authorid){

        if(Guess_Number == "end" || Guess_Number == "cn!minigames guessnumber") return true;
        if(Guess_Number.length!==4) return false;
        if(this.playerid !== authorid) return false;

        for(let i = 0; i < 4; i++){       
            if(!this.arr.includes(Guess_Number[i])) return false;
        }

        for(let i = 0; i < 3; i++){
            for(var j = i + 1; j < 4;j++){
                if(Guess_Number[i] === Guess_Number[j]) return false;
            }
        }
        return true;
    }
}

module.exports = BullsandCows;