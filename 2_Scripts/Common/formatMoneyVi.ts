
export class FormatMoney {
    
    private moneySymbol = []

    public formatMoney(money: number){

        var shortKey = ["K", "M", "B","T"];
        let shortMoneyString;
        for (let i= shortKey.length; i >=0; i--){
            if(money/ Math.pow(10, i*3) >=1) {
                let fixed = (i == 0)? 0:1;
                shortMoneyString = ((money/ Math.pow(10, i*3))).toFixed(fixed) + shortKey[i]; 
                break;
            }
        }
        return shortMoneyString;  
    }
}

