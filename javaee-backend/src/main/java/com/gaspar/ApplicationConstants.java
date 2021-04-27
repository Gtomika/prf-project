package com.gaspar;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;

/**
 * Tárolja az alkalmazásnak kellő konstansokat, pl adatbázisok elérhetőségét. A konstansok 
 * tartalma más debug és release mód esetén ({@link JavaeeBackendApplication#DEBUG}-al állítható). 
 * Singleton osztály.
 * A gyakorlattal ellentétben ezt nem az application.properties-be raktam, mert függnek a 
 * {@link JavaeeBackendApplication#DEBUG} értékétől. Debug módban a constants.json-ból olvas be, 
 * nem debug módban pedig a secrets.json-ból (ez nincs verziózva).
 * @author Gáspár Tamás
 */
public class ApplicationConstants {

	/**
	 * Egyetlen példány.
	 */
	private static ApplicationConstants instance;
	
	/**
	 * Ha még nincsenek beolvasva a konstansok, akkor beolvassa őket. 
	 * @return Az osztálypéldány.
	 */
	public static ApplicationConstants instance() {
		if(instance == null) {
			//még nincsenek betöltve a konstansok.
			String constantsAsString;
			if(JavaeeBackendApplication.DEBUG) {
				//debug mód, constants.json olvasása
				constantsAsString = getResourceFileAsString("constants.json");
			} else {
				//release mód, secrets.json olvasása
				constantsAsString = getResourceFileAsString("secrets.json");
			}
			//átalakítás map-re
			JsonParser parser = JsonParserFactory.getJsonParser();
			var parsed = parser.parseMap(constantsAsString);
			instance = new ApplicationConstants(parsed);
		}
		return instance;
	}
	
	/**
	 * A konstansokat tartalmazó map.
	 */
	private final Map<String, String> constants;
	
	/**
	 * Létrehozza a példányt és átalakítja a beolvasott JSON fájlt string - string párokká (eredetileg string - object, 
	 * de az alkalmazásnak elég a string - string).
	 */
	private ApplicationConstants(Map<String, Object> parsed) {
		//minden átalakítása stringgé
		constants = new HashMap<String, String>();
		for(var pair: parsed.entrySet()) {
			constants.put(pair.getKey(), pair.getValue().toString());
		}
	}
	
	/**
	 * Kiolvassa egy konstans értékét.
	 * @param key Kulcs, a konstans neve. Ennek valamelyik itt definiált kulcsnak kell lennie, 
	 * pl {@link #POSTGRE_URL_KEY}.
	 * @return A konstans értéke.
	 */
	public String getConstant(String key) {
		return constants.get(key);
	}
	
	//Fájl beolvasó segéd metódusok ----------------------------------------------------------------------------
	
	@SuppressWarnings("resource")
	public static String getResourceFileAsString(String fileName) {
	    InputStream is = getResourceFileAsInputStream(fileName);
	    if (is != null) {
	        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
	        return (String)reader.lines().collect(Collectors.joining(System.lineSeparator()));
	    } else {
	        throw new RuntimeException("resource not found");
	    }
	}

	public static InputStream getResourceFileAsInputStream(String fileName) {
	    ClassLoader classLoader = ApplicationConstants.class.getClassLoader();
	    return classLoader.getResourceAsStream(fileName);
	}
	
	//Konstans azonosítók ----------------------------------------------------------------------------------
	
	/**
	 * Ezzel a kulccsal lehet elkérni az adatbázis URL-jét.
	 */
	public static final String POSTGRE_URL_KEY = "postgreURL";
	
	/**
	 * Ezzel a kulccsal lehet elkérni az adatbázisba bejelentkezéshez használt felhasználónevet.
	 */
	public static final String POSTGRE_USER_KEY = "postgreUser";
	
	/**
	 * Ezzel a kulccsal lehet elkérni az adatbázisba bejelentkezéshez használt jelszót.
	 */
	public static final String POSTGRE_PASSWORD_KEY = "postgrePassword";
	
	/**
	 * Ezzel a kulccsal lehet elkérni a NodeJS szerver URL-jét.
	 */
	public static final String NODE_JS_SERVER_URL_KEY = "nodeJsServerUrl";
	
}
