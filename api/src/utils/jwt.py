from datetime import datetime, timedelta, timezone
from typing import Optional, cast
from uuid import uuid4

from jose import jwt
from src.document import User
from src.schema import JWTClaim


class JWT:
    def __init__(
        self,
        key: str,
        issuer: str,
        audience: str,
    ) -> None:
        self.key = key
        self.issuer = issuer
        self.audience = audience or None

    def encode(
        self,
        user: User,
        ttl: Optional[int],
        scope: str = "*",
    ) -> str:
        """Encodes a claims set and returns a JWT string.

        Args:
            user (User): a user object
            ttl (Optional[int]): time to live
            scope (str): scope value

        Returns:
            str: the string representation of the header, claims, and signature

        Raises:
            JWTError: If there is an error encoding the claims.
        """
        now = datetime.now(timezone.utc)
        return jwt.encode(
            claims=JWTClaim(
                iss=self.issuer,
                sub=str(user.id),
                aud=self.audience,
                exp=now + timedelta(minutes=ttl) if ttl else None,
                nbf=now,
                iat=now,
                jti=str(uuid4()),
                scope=scope,
                account=cast(str, user.account),
            ).model_dump(exclude_none=True),
            key=self.key,
        )

    def decode(self, token: str) -> JWTClaim:
        """Verifies a JWT string's signature and validates reserved claims.

        Args:
            token (str): a signed JWT to be verified.

        Returns:
            JWTClaim: JWT claims set

        Raises:
            JWTError: If the signature is invalid in any way.
            ExpiredSignatureError: If the signature has expired.
            JWTClaimsError: If any claim is invalid in any way.
            TokenRevokedError: If the token has been revoked.
        """
        return JWTClaim.model_validate(
            jwt.decode(
                token=token,
                key=self.key,
                audience=self.audience,
                issuer=self.issuer,
                options={"verify_aud": bool(self.audience)},
            )
        )
