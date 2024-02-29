
export class FormatMoney {
    public formatMoney(value: number){
        if(value < 1000 ){
            return value.toFixed(this.formatDecimal(value, 1)) + 'K';
        }
        if(value >= 1000 && value < 1000000 ){
            const money = value/1000;
            return (money).toFixed(this.formatDecimal(money, 1)) + 'M';
        }
        if(value >= 1000000&& value < 1000000000 ){
            const money = value/1000000
            return (money).toFixed(this.formatDecimal(money, 1)) + 'B';
        }
        
    }

    private formatDecimal(value: number, defaultNumDecimal: number){
        if(value%10 == 0) return 0;
        return defaultNumDecimal;
    }

    
}

