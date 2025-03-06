package dev.kangoo.auth.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public abstract class HashUtils {

    private static final String ALGORITHM = "HmacSHA256";
    // TODO: Insert Secret here
    private static final SecretKeySpec secretKeySpec = new SecretKeySpec("MY_SECRET".getBytes(), ALGORITHM);
    private static final Mac H_MAC;

    static {
        try {
            H_MAC = Mac.getInstance(ALGORITHM);
            H_MAC.init(secretKeySpec);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException(e);
        }
    }

    public static String generateHash(String customerId){
        byte[] hashBytes = H_MAC.doFinal(customerId.getBytes());
        return Base64.getEncoder().encodeToString(hashBytes);
    }

}
