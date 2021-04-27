package com.gaspar;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * A szerver főosztálya, itt vannak definiálva az endpointok.
 * @author Gáspár Tamás
 */
@Controller
@SpringBootApplication
@CrossOrigin
public class JavaeeBackendApplication {
	
	/**
	 * Megmondja, hogy debug módban vagyunk-e. Ennek a változónak az értékétől függ, hogy 
	 * a debug ,vagy a valódi adatbázis és NodeJS szerver URL van használva.
	 */
	public static final boolean DEBUG = true;

	/**
	 * Ezzel az objektummal lehet kezelni a "purchases" tábla tartalmát. A gyakorlattal ellentétben 
	 * ezt nem csomagoltam be egy külön "service" osztályba.
	 */
	@Autowired
	private PurchaseRepository purchaseRepository;
	
	/**
	 * Az API hívásokat végzők adatait ellenőrzi, a NodeJS szerver /authenticate 
	 * endpointjának hívásával.
	 */
	private Authenticator authenticator = new Authenticator();
	
	/**
	 * A root URL-re történő GET kérés estén hívódik. A projekt szempontjából nincs jelentősége, 
	 * csak egy egyszerű JSON-t ad vissza.
	 * @return Egy egyszerű üzenetet tartalmazó JSON.
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET, produces=MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<?> home() {
		var json = new JSONObject();
		json.put("message", "PRF Projekt - Java EE Backend - Gáspár Tamás!");
		return new ResponseEntity<>(json.toString(), HttpStatus.OK);
	}
	
	
	/**
	 * Definiálja a /api/product endpointot POST-ra. Ide kell küldeni JSON formában a vásárlási 
	 * adatokat. Ezek bekerülnek az adatbázisba.
	 * @param body A kérés törzsét tartalmazza. Ebben lennie kell a vásárlást meghatározó adatoknak, 
	 * 		ezekért lásd {@link Purchase}. Kell lennie benne felhasználónévnek és jelszónak. A gyakorlattal 
	 * 		ellentétben én nem a {@link Purchase} osztályt használtam a paraméterek átvételére.
	 * @return Egy a státuszt tartalmazó JSON, ami megmondja, hogy sikeres volt-e a művelet.
	 */
	@RequestMapping(value = "/api/purchase", method = RequestMethod.POST, 
			consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<?> purchaseEndpointPost(@RequestBody Map<String, Object> body) {
		//vannak-e azonosító adatok?
		if(body.containsKey(Purchase.USERNAME) && body.containsKey("password")) {
			//azonosítás
			var authRes = authenticator.authenticate(body.get("username").toString(), body.get("password").toString());
			if(authRes.valid) {
				//sikeres azonosítás, vannak-e benne vásárlási adatok?
				if(body.containsKey(Purchase.PRODUCT_NAME) && body.containsKey(Purchase.PRICE) && body.containsKey(Purchase.DATE_TIME)) {
					//vannak, új Purchase objektum elkészítése
					Purchase purchase = new Purchase();
					purchase.setUsername(body.get(Purchase.USERNAME).toString());
					purchase.setProductName(body.get(Purchase.PRODUCT_NAME).toString());
					Integer price; //ár beolvasása
					try {
						price = Purchase.parsePrice(body.get(Purchase.PRICE).toString());
					} catch(IllegalArgumentException e) {
						//ha nem megfelelő formában küldék az árat
						var json = new JSONObject();
						json.put("message", "Nem megfelelő termék ár!");
						return new ResponseEntity<>(json.toString(), HttpStatus.BAD_REQUEST);
					}
					purchase.setPrice(price);
					//időpont beolvasása
					Long timestamp;
					try {
						timestamp = Long.parseLong(body.get(Purchase.DATE_TIME).toString());
					} catch(NumberFormatException e) {
						//ha nem megfelelő formában küldék az időpontot
						var json = new JSONObject();
						json.put("message", "Nem megfelelő vásárlási időpont!");
						return new ResponseEntity<>(json.toString(), HttpStatus.BAD_REQUEST);
					}
					purchase.setDateTime(timestamp);
					//elmentés
					purchaseRepository.save(purchase);
					//válasz
					var json = new JSONObject();
					json.put("message", "A vásárlás sikeresen elmentve!");
					return new ResponseEntity<>(json.toString(), HttpStatus.OK);
				} else {
					//nincsenek vásárlási adatok
					var json = new JSONObject();
					json.put("message", "Hiányos kérés: szükség van a vásárlási adatokra!");
					return new ResponseEntity<>(json.toString(), HttpStatus.BAD_REQUEST);
				}
			} else {
				//sikertelen azonosítás
				var json = new JSONObject();
				json.put("message", "Helytelen felhasználónév, vagy jelszó!");
				return new ResponseEntity<>(json.toString(), HttpStatus.UNAUTHORIZED);
			}
		} else {
			//nincsen jelszó vagy felhasználónév
			var json = new JSONObject();
			json.put("message", "Hiányos kérés: szükség van felhasználónévre és jeszóra!");
			return new ResponseEntity<>(json.toString(), HttpStatus.BAD_REQUEST);
		}
	}
	
	/**
	 * Kezeli a product endpointra érkező get kéréseket. Ezzel egy felhasználó vásárlásait 
	 * lehet lekérni.
	 * @param requestParams A kérés URL paraméterei. Kell közöttük jelszónak és felhasználónévnek lennie. 
	 * 		Csakis ennek a felhasználónak a vásárlásai lesznek lekérve.
	 * @return A felhasználó várárlásait tartalmazó JSON tömb.
	 */
	@RequestMapping(value = "/api/purchase", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<?> pruchaseEndpointGet(@RequestParam Map<String, String> requestParams) {
		//vannak-e azonosító adatok?
		if(requestParams.containsKey("username") && requestParams.containsKey("password")) {
			//vannak adatok, de helyesek-e?
			String username = requestParams.get("username");
			var authRes = authenticator.authenticate(username, requestParams.get("password").toString());
			if(authRes.valid) {
				//helyes adatok
				var responseJson = new ArrayList<JSONObject>();
				/*
				 * Lekérés az adatbázisból. Ezt valószínűleg lehetett volna elegánsabban 
				 * is, egy saját query-vel, ami felhasználónév alapján szelektál.
				 */
				List<Purchase> purchases = purchaseRepository.findAll();
				for(Purchase purchase: purchases) {
					//amelyik ehhez a felhasználóhóz tartozik azt küldjük vissza
					if(purchase.getUsername().equals(username)) {
						//ezt a vásárlást leíró JSON készítése
						var purchaseJson = new JSONObject();
						purchaseJson.put(Purchase.PRODUCT_NAME, purchase.getProductName());
						purchaseJson.put(Purchase.PRICE, purchase.getPrice());
						purchaseJson.put(Purchase.DATE_TIME, purchase.getDateTime());
						purchaseJson.put(Purchase.USERNAME, purchase.getUsername());
						//hozzáadás a válaszhoz
						responseJson.add(purchaseJson);
					}
	 			}
				//válasz JSON tömb küldése
				var responseJsonArray = new JSONArray(responseJson);
				return new ResponseEntity<>(responseJsonArray.toString(), HttpStatus.OK);
			} else {
				//helytelen adatok
				var json = new JSONObject();
				json.put("message", "Hibás felhasználónév vagy jelszó!");
				return new ResponseEntity<>(json.toString(), HttpStatus.UNAUTHORIZED);
			}
		} else {
			//nincsenek megadva adatok
			var json = new JSONObject();
			json.put("message", "Vásárlások lekéréséhez felhasználónév és jelszó kell!");
			return new ResponseEntity<>(json.toString(), HttpStatus.BAD_REQUEST);
		}
		
	}
	
	/**
	 * Kezeli a /productTotal endpointra érkező GET kéréseket. Ezzel egy termékhez tartozó 
	 * összes vásárlást le lehet kérni. Csak admin hívhatja meg.
	 * @param requestParams Kérés URL paraméterek. Kell legyen benne (admin) felhasználónév, jelszó, és a termék neve.
	 * @return JSON tömb, amiben benne vannak a vásárlások.
	 */
	@RequestMapping(value = "/api/productTotal", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<?> productTotalEndpoint(@RequestParam Map<String, String> requestParams) {
		//megvanak-e a szükséges paraméterek
		if(requestParams.containsKey("username") && requestParams.containsKey("password") && requestParams.containsKey("productName")) {
			String username = requestParams.get("username"), password = requestParams.get("password");
			//érvényes-e a megadott felhasználónév és jelszó?
			var authRes = authenticator.authenticate(username, password);
			if(authRes.valid) {
				//érvényes, de admin-e?
				if(authRes.admin) {
					//admin, mehet a lekérés
					String productName = requestParams.get("productName");
					var responseJson = new ArrayList<JSONObject>();
					/*
					 * Lekérés az adatbázisból. Ezt valószínűleg lehetett volna elegánsabban 
					 * is, egy saját query-vel, ami terméknév alapján szelektál.
					 */
					List<Purchase> purchases = purchaseRepository.findAll();
					//az adott terméknevű vásárlások keresése
					for(Purchase purchase: purchases) {
						if(purchase.getProductName().equals(productName)) {
							//ezt a vásárlást leíró JSON készítése
							var purchaseJson = new JSONObject();
							purchaseJson.put(Purchase.PRODUCT_NAME, purchase.getProductName());
							purchaseJson.put(Purchase.PRICE, purchase.getPrice());
							purchaseJson.put(Purchase.DATE_TIME, purchase.getDateTime());
							purchaseJson.put(Purchase.USERNAME, purchase.getUsername());
							//hozzáadás a válaszhoz
							responseJson.add(purchaseJson);
						}
					}
					//válasz JSON tömb küldése
					var responseJsonArray = new JSONArray(responseJson);
					return new ResponseEntity<>(responseJsonArray.toString(), HttpStatus.OK);
				} else {
					//nem admin felhasználó kérte
					var resp = new JSONObject();
					resp.put("message", "Csak admin hívhatja ezt az endpointot!");
					return new ResponseEntity<>(resp.toString(), HttpStatus.UNAUTHORIZED);
				}
			} else {
				//nem érvényes belépési adatok
				var resp = new JSONObject();
				resp.put("message", "Hibás felhasználónév vagy jelszó!");
				return new ResponseEntity<>(resp.toString(), HttpStatus.UNAUTHORIZED);
			}
		} else {
			//nincs benne valamilyen szükséges paraméter
			var resp = new JSONObject();
			resp.put("message", "Felhasználónév, jelszó és terméknév szükséges!");
			return new ResponseEntity<>(resp.toString(), HttpStatus.BAD_REQUEST);
		}
	}
	
	/**
	 * Belépési pont.
	 * @param args
	 */
	public static void main(String[] args) {
		SpringApplication.run(JavaeeBackendApplication.class, args);
	}
}
