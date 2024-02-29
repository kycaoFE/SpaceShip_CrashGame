export class Data{
    public static instance: Data = null;

    private _muL: number = 0;
    public get muL(){
        return this._muL;
    }
    public set muL(value: number){
        this._muL = value;
    }

    private _betValue: number = 100;
    public get betValue(){
        return Number(this._betValue.toFixed(1));
    }

    public set betValue(betValue: number){
        if(betValue <= 0 || betValue >= this.walletAmount) return;
        this._betValue = betValue;
    }


    private _ratioValue: number = 5.0;
    public get ratioValue(){
        return Number(this._ratioValue.toFixed(1));
    }

    public set ratioValue(ratioValue: number){
        if(ratioValue <=0 || ratioValue > 10) return;
        this._ratioValue = ratioValue;
    }


    private _eventData = null;
    set eventData(event: any){
        this._eventData = event;
    }

    get eventData(){
        return this._eventData;
    }

    public modeGame: string;

    public walletAmount: number;

}