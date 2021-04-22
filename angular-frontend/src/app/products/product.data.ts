//segéd osztály termékek tárolására

export class ProductData {

    private name: String;

    private description: String;

    private price: String;

    private imgPath: String;

    constructor(name: String, description: String, price: String, imgPath: String) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imgPath = imgPath;
    }

    getName(): String {
        return this.name;
    }

    getDescription(): String {
        return this.description;
    }

    getPrice(): String {
        return this.price;
    }

    getImgPath(): String {
        return this.imgPath;
    }
}