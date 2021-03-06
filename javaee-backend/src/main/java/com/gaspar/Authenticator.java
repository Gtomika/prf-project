package com.gaspar;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

import org.json.JSONObject;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

/**
 * Ez az osztály HTTP kérést tud küldeni a NodeJS szervernek (/authenticate endpoint), 
 * és megnézni, hogy egy felhasználónév és jelszó páros helyes-e.
 * @author Gáspár Tamás
 */
public class Authenticator {

	/**
	 * Az azonosítási kérések időkorlátja.
	 */
	private static final int TIMEOUT = 3000;
	
	/**
	 * NodeJs szever URL-je. Ide küldi a http kéréseket. Ez más debug és nem debug mód esetén
	 */
	private String nodeJsServerUrl;
	
	/**
	 * Konstruktor
	 */
	public Authenticator() {
		//szerver URL kérése a konstansok közül.
		nodeJsServerUrl = ApplicationConstants.instance()
				.getConstant(ApplicationConstants.NODE_JS_SERVER_URL_KEY);
	}
	
	/**
	 * Megmondja a felhasználói adatokból, hogy van-e ilyen felhasználó, és hogy admin-e.
	 * @param username A felhasználónév.
	 * @param password A jelszó.
	 * @return {@link AuthResult} ami tartalmazza az eredményt.
	 */
	public AuthResult authenticate(String username, String password) {
		//HTTP kliens készítése, ez kezeli az időkorlátot
		HttpClient httpClient = HttpClient.create()
				  .option(ChannelOption.CONNECT_TIMEOUT_MILLIS,TIMEOUT)
				  .responseTimeout(Duration.ofMillis(TIMEOUT))
				  .doOnConnected(conn -> 
				    	conn.addHandlerLast(new ReadTimeoutHandler(TIMEOUT, TimeUnit.MILLISECONDS))
				  .addHandlerLast(new WriteTimeoutHandler(TIMEOUT, TimeUnit.MILLISECONDS)));

		//webkliens készítése, ez küldi a kérést a NodeJS szervernek
		WebClient client = WebClient.builder().baseUrl(nodeJsServerUrl)
			.clientConnector(new ReactorClientHttpConnector(httpClient))
			.build();
		
		//kérés törzs megadása: a felhasználónév és jelszó kerül be
		var request = new JSONObject();
		request.put("username", username);
		request.put("password", password);
		
		//küldés és várakozás a válaszra
		String response = client.post()
				.uri("/api/authenticate")
				.contentType(MediaType.APPLICATION_JSON)
				.body(Mono.just(request.toString()), String.class)
				.accept(MediaType.APPLICATION_JSON)
				.retrieve()
				.bodyToMono(String.class)
				.block();
		
		//a válasz átalakítása map-é
		JsonParser parser = JsonParserFactory.getJsonParser();
		var responseJson = parser.parseMap(response);
		
		//a válasz értelmezése
		boolean valid = responseJson.get("message").toString().equals("valid");
		boolean admin = responseJson.get("isAdmin").toString().equals("true");
		return new AuthResult(valid, admin);
	}
	
	/**
	 * Authentikáció eredménye.
	 * @author Gáspár Tamás
	 */
	public static class AuthResult {
		
		/**
		 * Megmondja, hogy sikeres volt-e az authentikáció.
		 */
		public boolean valid;
		
		/**
		 * Megmondja, hogy a felhasználó admin-e.
		 */
		public boolean admin;
		
		public AuthResult(boolean v, boolean a) {
			valid = v;
			admin = a;
		}
	}
	
}
