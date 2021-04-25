package com.gaspar;

import javax.sql.DataSource;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


/**
 * Ez az osztály mondja meg, hogy hogyan kell elérni az adatbázist.
 * @author Gáspár Tamás
 */
@Configuration
public class DataSourceConfig {
	
	/**
	 * Postgre driver neve.
	 */
	private static final String POSTGRE_DRIVER_NAME = "org.postgresql.Driver";
	
	/**
	 * Létrehozza az adatbázis elérhetőségét. Ez más debug és release módban.
	 * @return Infó.
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
