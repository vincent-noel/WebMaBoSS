from .settings import *
from random import choice
from string import ascii_lowercase

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(TMP_ROOT, ''.join(choice(ascii_lowercase) for _ in range(10)))

FIXTURE_DIRS = (os.path.join(BASE_DIR, 'api/tests/fixtures'),)

