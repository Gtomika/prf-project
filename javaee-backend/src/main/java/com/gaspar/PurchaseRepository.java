package com.gaspar;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Ez az osztály adja meg a műveleteket amiket a {@link Purchase} adattípussal lehet végezni.
 * @author Gáspár Tamás
 */
public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

}
