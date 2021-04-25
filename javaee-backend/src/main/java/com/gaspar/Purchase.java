package com.gaspar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Egy vásárlás adatait tartalmazó osztály.
 * @author Gáspár Tamás
 */
@Entity
@Table(name = "purchases")
public class Purchase {

	public static final String USERNAME = "username";
	
	public static final String PRODUCT_NAME = "productName";
	
	public static final String PRICE = "price";
	
	public static final String DATE_TIME = "dateTime";
	
	/**
	 * A vásárlás azonosítója. Kulcs.
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	/**
	 * A vásárlást végző felhasználó neve.
	 */
	@Column(name = "username")
	private String username;
	
	/**
	 * A termék neve, amit megvásárolt.
	 */
	@Column(name = "productname")
	private String productName;
	
	/**
	 * A vásárlás értéke forintban.
	 */
	@Column(name = "price")
	private Integer price;
	
	/**
	 * A vásárlás időpontja UNIX timestamp-ként.
	 */
	@Column(name = "datetime")
	private Long dateTime;
	
	@Override
	public String toString() {
		return "Purchase [id=" + id + ", username=" + username + ", productName=" + productName + ", price=" + price
				+ "]";
	}
	
	/**
	 * Átalakítja az PAI kérésekben érkező szöveges árat számra.
	 * @param priceString A szöveges ár. Pl: '1000 Ft'.
	 * @return Az ár számként.
	 * @throws IllegalArgumentException Ha a szöveges ár formátuma nem megfelelő.
	 */
	public static Integer parsePrice(String priceString) throws IllegalArgumentException {
		String[] split = priceString.split(" ");
		if(split.length != 2) throw new IllegalArgumentException();
		try {
			Integer price = Integer.parseInt(split[0]);
			return price;
		} catch(NumberFormatException e) {
			throw new IllegalArgumentException();
		}
	}
	
	// Getterek, setterek --------------------------------------------------------------

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public Integer getPrice() {
		return price;
	}

	public void setPrice(Integer price) {
		this.price = price;
	}

	public Long getDateTime() {
		return dateTime;
	}

	public void setDateTime(Long dateTime) {
		this.dateTime = dateTime;
	}
}
