class MusicQueue{

    constructor(){

        this.queue = [];

    }

    add(music){

        this.queue.push(music);

    }

    clear(){

        this.queue = [];

    }

    next(index = 0){

        this.queue.shift();
        return this.queue[0];

    }

    empty(){

        return this.queue.length == 0;

    }

    remove(index){

        if(index >= this.queue.length) {

            return "Not found";

        }

        let removed = this.queue[index];
        this.queue.splice(index,1);
        return removed;

    }

    shuffle() {

        let arr = this.queue;
        let i,j,temp;

        for (i = arr.length - 1; i > 1; i--) {

            j = Math.floor(Math.random() * i) + 1;

            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;

        }

        return arr;
    }

}

module.exports = MusicQueue;