
export class ChangeMoney {
    public changeMoney(value: number){
        if(value < 1000 ){
            return value.toFixed() + 'K';
        }
        if(value >= 1000 && value < 100000 ){
            return (value/1000).toFixed(2) + 'M';
        }
    }
}

