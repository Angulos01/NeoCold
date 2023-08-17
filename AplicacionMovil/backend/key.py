import os
# Genera una SECRET_KEY aleatoria
secret_key = os.urandom(24).hex()
print(secret_key)