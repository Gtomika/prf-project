package com.gaspar;

import javax.sql.DataSource;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


/**
 * Ez az osztály mondja meg, hogy hogyan kell elérni az adatbázist. Az adatok függnek a 
 * {@link JavaeeBackendApplication#DEBUG} értékétől. Erről részletesebben a {@link ApplicationConstants} 
 * osztályban.
 * @author Gáspár Tamás
 */
@Configuration
public class DataSourceConfig {
	
	/**
	 * PostgreSQL driver osztály neve. Ez mindig ugyanez, ezért nem az {@link ApplicationConstants}-ba raktam.
	 */
	private static final String POSTGRE_DRIVER_NAME = "org.postgresql.Driver";
	
	/**
	 * Létrehozza az adatbázis elérhetőségét. Ez más debug és release módban.
	 * @return A Spring használja fel.
	 */
	@Bean
	public DataSource datasource() {
		var constants = ApplicationConstants.instance();
		return DataSourceBuilder.create()
				.driverClassName(POSTGRE_DRIVER_NAME)
				.url(constants.getConstant(ApplicationConstants.POSTGRE_URL_KEY))
		        .username(constants.getConstant(ApplicationConstants.POSTGRE_USER_KEY))
		        .password(constants.getConstant(ApplicationConstants.POSTGRE_PASSWORD_KEY))
		        .build();	
	}
	
}
