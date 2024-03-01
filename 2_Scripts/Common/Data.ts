export class Data{
    public static instance: Data = null;

    private _muL: number = 0;
    public get muL(){
        return this._muL;
    }
    public set muL(value: number){
        this._muL = value;
    }

    private _betValue: number = 1;
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
        if(ratioValue <=0 || ratioValue > this.maxRatioValue) return;
        this._ratioValue = ratioValue;
    }

    public minRatioValue: number = 0.1;
    public maxRatioValue: number = 100;

    public minRatioStep: number = 0.1;
    public maxRatioStep: number = 10;

    public ratioStepDefault: number = 0.1;

    public minBetValue: number = 1;
    public minBetStep: number = 1;
    public maxBetStep: number = 500;

    public betStepDefault: number = 1;




    private _betStep: number = this.minBetValue;
    public get betStep(){
        return this._betStep;
    }
    public set betStep(value: number){
        this._betStep = value;
        if(value >= this.maxBetStep) this._betStep = this.maxBetStep;
        if(value >= this.walletAmount - this.betValue) this._betStep = this.walletAmount - this.betValue - this.minBetValue;
        if(value <= this.minBetStep) this._betStep = this.minBetValue;
    }

    private _ratioStep: number = this.minRatioValue;
    public get ratioStep(){
        return this._ratioStep;
    }
    public set ratioStep(value: number){
        this._ratioStep = value;
        if(value >= this.maxRatioStep) this._ratioStep = this.maxRatioStep;
        if(value >= this.maxRatioValue - this.ratioValue) this._ratioStep = this.maxRatioValue - this.ratioValue - this.minRatioValue;
        if(value <= this.minRatioStep) this._ratioStep = this.minRatioValue;
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