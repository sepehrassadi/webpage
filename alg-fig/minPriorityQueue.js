class minPriorityQueue {
    constructor() {
      this.collection = [];
    }

    // i.e pq.enqueue(['Quincy Larson', 3]);
    enqueue(element){
        if (this.isEmpty()){ 
          this.collection.push(element);
        } else {
          let added = false;
          for (let i = 0; i < this.collection.length; i++){
            if (element[1] < this.collection[i][1]){ 
              this.collection.splice(i, 0, element);
              added = true;
              break;
            }
          }
          if (!added){
              this.collection.push(element);
          }
        }
      }


      dequeue() {
        let value = this.collection.shift();
        return value;
      }

      isEmpty() {
        return (this.collection.length === 0) 
      }

     front(){
        return this.collection[0];
    }
    printQueue(){
      // print it positive
        return this.collection;
    }
    
    printPositiveQueue(){
      //Math.abs(2.56)
      let sol = this.collection;
      
      for (let i = 0; i < sol.length; i++){
        sol[i][1] = Math.abs(sol[i][1]);
      }
      return sol;
    }
    
    }




