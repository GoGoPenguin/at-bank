import bcrypt
from pydantic import validate_call


@validate_call
def hash_password(password: bytes) -> bytes:
    """
    Hashes a plaintext password using bcrypt.

      password (bytes): The plaintext password to be hashed.

      bytes: The hashed password as a byte string.
    """
    return bcrypt.hashpw(password, bcrypt.gensalt())


@validate_call
def check_password(password: bytes, hashed_password: bytes) -> bool:
    """
    Verifies if a given password matches a hashed password using bcrypt.

    Args:
      password (bytes): The plaintext password to verify.
      hashed_password (bytes): The bcrypt-hashed password to compare against.

    Returns:
      bool: True if the password matches the hashed password, False otherwise.
    """
    return bcrypt.checkpw(password, hashed_password)
