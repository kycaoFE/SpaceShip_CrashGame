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
        return Number(this._betValue.toFixed(2));
    }

    public set betValue(betValue: number){
        this._betValue = betValue;
    }


    private _ratioValue: number = 10.0;
    public get ratioValue(){
        return Number(this._ratioValue.toFixed(2));
    }

    public set ratioValue(ratioValue: number){
        this._ratioValue = ratioValue;
    }


    private _eventData = null;
    set eventData(event: any){
        this._eventData = event;
    }

    get eventData(){
        return this._eventData;
    }

}