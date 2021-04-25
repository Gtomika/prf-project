
export class PurchaseData {

    private username: String;

    private productName: String;

    private price: String;

    private dateTime: String;

    private timestamp: number;

    constructor(username: String, productName: String, priceAsNum: number, dateTimeAsNum: number) {
        this.productName = productName;
        this.username = username;
        //konvertálás stringgé
        this.price = priceAsNum + ' Ft';
        const date = new Date();
        date.setTime(dateTimeAsNum * 1000);
        this.dateTime = date.toUTCString();
        this.timestamp = dateTimeAsNum; //rendezéshez
    }

    getProductName() : String {
        return this.productName;
    }

    getPrice() : String {
        return this.price;
    }

    getDateTime() : String {
        return this.dateTime;
    }

    getTimestamp() : number {
        return this.timestamp;
    }

    getUsername() : String {
        return this.username;
    }

}