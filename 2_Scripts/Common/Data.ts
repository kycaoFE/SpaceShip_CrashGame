export class Data{
    public static instance: Data = null;

    private _betValue: number;
    public get betValue(){
        return Number(this._betValue.toFixed(2));
    }

    public set betValue(betValue: number){
        this._betValue = betValue;
    }


    private _ratioValue: number;
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