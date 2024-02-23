
export class ChangeMoney {
    public changeMoney(value: number){
        if(value < 1000 ){
            return value.toFixed() + 'K';
        }
        if(value >= 1000 && value < 1000000 ){
            return (value/1000).toFixed(2) + 'M';
        }
        if(value >= 1000000&& value < 1000000000 ){
            return (value/1000000).toFixed(2) + 'B';
        }
        
    }
}

