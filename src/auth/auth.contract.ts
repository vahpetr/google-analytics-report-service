
export interface AuthDto {
    accessToken: any;
    expires_in: number;
}

export interface AuthUser {
    identity: string;
}

export type SignedUser = AuthUser & {
    /**
     * The issuer of the token
     */
    iss?: string;
    /**
     * The subject of the token
     */
    sub?: string;
    /**
     * The audience of the token
     */
    aud?: string;
    /**
     * This will probably be the registered claim most often used.
     * This will define the expiration in NumericDate value.
     * The expiration MUST be after the current date/time
     */
    exp: number;
    /**
     * Defines the time before which the JWT MUST NOT be accepted for processing
     */
    nbf?: number;
    /**
     * The time the JWT was issued.
     * Can be used to determine the age of the JWT
     */
    iat: number;
    /**
     * Unique identifier for the JWT.
     * Can be used to prevent the JWT from being replayed.
     * This is helpful for a one time use token
     */
    jti?: string;
};

export interface UserEntity {
    login: string;
    pass: string;
}
