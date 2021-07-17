

class MusicQueue{

    constructor(){

        this.queue = []

    }

    add(music){

        this.queue.push(music)

    }

    clear(){

        this.queue = []

    }

    next(index = 0){

        this.queue.shift()
        return this.queue[0]

    }

    empty(){

        return this.queue.length == 0;

    }

    remove(index){

        if(index >= this.queue.length) {

            return "Not found"

        }

        let removed = this.queue[index]
        this.queue.splice(index,1)
        return removed

    }

}

module.exports = MusicQueue