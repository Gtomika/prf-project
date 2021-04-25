package com.gaspar;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
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
public class JavaeeBackendApplication implements CommandLineRunner {
	
	/**
	 * Megmondja, hogy debug módban vagyunk-e.
	 */
	public static final boolean DEBUG = true;

	/**
	 * Ezzel az objektummal lehet kezelni a "purchases" tábla tartalmát.
	 */
	@Autowired
	private PurchaseRepository purchaseRepository;
	
	/**
	 * Az API hívásokat végzők adatait ellenőrzi.
	 */
	private Authenticator authenticator = new Authenticator();
	
	/**
	 * Meghívódik, amikor elindul az szerver.
	 */
	@Override
	public void run(String... args) throws Exception {
		
	}
	
	/**
	 * A root URL-re történő GET kérés estén hívódik.
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
	 * 		ezekért lásd {@link Purchase}. Kell lennie benne felhasználónévnek és jelszónak.
	 * @return Egy a státuszt tartalmazó JSON.
	 */
	@RequestMapping(value = "/api/purchase", method = RequestMethod.POST, 
			consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<?> purchaseEndpointPost(@RequestBody Map<String, Object> body) {
		//vannak-e azonosító adatok?
		if(body.containsKey(Purchase.USERNAME) && body.containsKey("password")) {
			var authRes = authenticator.authenticate(body.get("username").toString(), body.get("password").toString());
			if(authRes.valid) {
				//sikeres azonosítás, vannak-e benne vásárlási adatok?
				if(body.containsKey(Purchase.PRODUCT_NAME) && body.containsKey(Purchase.PRICE) && body.containsKey(Purchase.DATE_TIME)) {
					//vannak
					Purchase purchase = new Purchase();
					purchase.setUsername(body.get(Purchase.USERNAME).toString());
					purchase.setProductName(body.get(Purchase.PRODUCT_NAME).toString());
					Integer price; //ár beolvasása
					try {
						price = Purchase.parsePrice(body.get(Purchase.PRICE).toString());
					} catch(IllegalArgumentException e) {
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
					//nincsenek
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
			//nincsenek
			var json = new JSONObject();
			json.put("message", "Hiányos kérés: szükség van felhasználónévre és jeszóra!");
			return new ResponseEntity<>(json.toString(), HttpStatus.BAD_REQUEST);
		}
	}
	
	/**
	 * Kezeli a product endpointra érkező get kéréseket. 
	 * @param requestParams A kérés paraméterei. Kell közöttük jelszónak és felhasználónévnek lennie. 
	 * 		Csakis ennek a felhasználónak a vásárlásai lesznek lekérve.
	 * @return A felhasználó várárlásait tartalmazó JSON.
	 */
	@RequestMapping(value = "/api/purchase", method = RequestMethod.GET, 
			produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<?> pruchaseEndpointGet(@RequestParam Map<String, String> requestParams) {
		if(requestParams.containsKey("username") && requestParams.containsKey("password")) {
			//vannak adatok, de helyesek-e?
			String username = requestParams.get("username");
			var authRes = authenticator.authenticate(username, requestParams.get("password").toString());
			if(authRes.valid) {
				//helyes adatok
				var responseJson = new ArrayList<JSONObject>();
				//lekérés az adatbázisból
				List<Purchase> purchases = purchaseRepository.findAll();
				
				for(Purchase purchase: purchases) {
					//amelyik ehhez a felhasználóhóz tartozik azt küldjük vissza
					if(purchase.getUsername().equals(username)) {
						var purchaseJson = new JSONObject();
						purchaseJson.put(Purchase.PRODUCT_NAME, purchase.getProductName());
						purchaseJson.put(Purchase.PRICE, purchase.getPrice());
						purchaseJson.put(Purchase.DATE_TIME, purchase.getDateTime());
						purchaseJson.put(Purchase.USERNAME, purchase.getUsername());
						//hozzáadás a válaszhoz
						responseJson.add(purchaseJson);
					}
	 			}
				var responseJsonArray = new JSONArray(responseJson);
				return new ResponseEntity<>(responseJsonArray.toString(), HttpStatus.OK);
			} else {
				//helytelen adatok
				var json = new JSONObject();
				json.put("message", "Hibás felhasználónév vagy jelszó!");
				return new ResponseEntity<>(json.toString(), HttpStatus.UNAUTHORIZED);
			}
		} else {
			var json = new JSONObject();
			json.put("message", "Vásárlások lekéréséhez felhasználónév és jelszó kell!");
			return new ResponseEntity<>(json.toString(), HttpStatus.BAD_REQUEST);
		}
		
	}
	
	/**
	 * Kezeli a productTotal endpointra érkező GET kéréseket. Ezzel egy termékhez tartozó 
	 * összes vásárlást le lehet kérni. Csak admin hívhatja meg.
	 * @param requestParams Kérési paraméterek. Kell legyen benne felhasználónév és jelszó, és a termék neve.
	 * @return JSON tömb, amiben benne vannak a vásárlások.
	 */
	@RequestMapping(value = "/api/productTotal", method = RequestMethod.GET, 
			produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<?> productTotalEndpoint(@RequestParam Map<String, String> requestParams) {
		if(requestParams.containsKey("username") && requestParams.containsKey("password") && requestParams.containsKey("productName")) {
			String username = requestParams.get("username"), password = requestParams.get("password");
			//érvényes-e?
			var authRes = authenticator.authenticate(username, password);
			if(authRes.valid) {
				//érvényes, de admin-e?
				if(authRes.admin) {
					//admin, mehet a lekérés
					String productName = requestParams.get("productName");
					var responseJson = new ArrayList<JSONObject>();
					List<Purchase> purchases = purchaseRepository.findAll();
					//az adott terméknevű vásárlások keresése
					for(Purchase purchase: purchases) {
						if(purchase.getProductName().equals(productName)) {
							var purchaseJson = new JSONObject();
							purchaseJson.put(Purchase.PRODUCT_NAME, purchase.getProductName());
							purchaseJson.put(Purchase.PRICE, purchase.getPrice());
							purchaseJson.put(Purchase.DATE_TIME, purchase.getDateTime());
							purchaseJson.put(Purchase.USERNAME, purchase.getUsername());
							responseJson.add(purchaseJson);
						}
					}
					var responseJsonArray = new JSONArray(responseJson);
					return new ResponseEntity<>(responseJsonArray.toString(), HttpStatus.OK);
				} else {
					//nem admin
					var resp = new JSONObject();
					resp.put("message", "Csak admin hívhatja ezt az endpointot!");
					return new ResponseEntity<>(resp.toString(), HttpStatus.UNAUTHORIZED);
				}
			} else {
				//nem érvényes
				var resp = new JSONObject();
				resp.put("message", "Hibás felhasználónév vagy jelszó!");
				return new ResponseEntity<>(resp.toString(), HttpStatus.UNAUTHORIZED);
			}
		} else {
			//nincs benne azonosítás
			var resp = new JSONObject();
			resp.put("message", "Felhasználónév, jelszó és terméknév szükséges!");
			return new ResponseEntity<>(resp.toString(), HttpStatus.BAD_REQUEST);
		}
	}
	
	public static void main(String[] args) {
		SpringApplication.run(JavaeeBackendApplication.class, args);
	}
}
