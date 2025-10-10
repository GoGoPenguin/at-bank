import os
import sys

# in order to import python module correctly
sys.path.insert(0, os.getcwd())

import datetime

from mongoengine import NotUniqueError
from src.container import Container
from src.document import AthleticTrainer, Department
from src.utils.hasher import hash_password

container = Container()
container.init_resources()
container.wire(modules=[sys.modules[__name__]])

try:
    at = AthleticTrainer(
        account="at",
        password=hash_password(b"at"),
        chinese_name="測試用戶",
        english_name="Test User",
        phone="0912345678",
        birthday=datetime.datetime(1990, 1, 1),
        email="at@at-bank.com",
        id_number="A123456789",
        line_id="testlineid",
        post_office_account="12345678",
        permanent_address="123 Main St, City, Country",
        correspondence_address="123 Main St, City, Country",
    )
    at.save()

    dept = Department(
        account="dept",
        password=hash_password(b"dept"),
        name="Test Department",
        contact_person="John Doe",
        tax_id="12345678",
        city="Test City",
        district="Test District",
        address="456 Department St, City, Country",
        phone="0922333444",
        line_id="deptlineid",
    )
    dept.save()
except NotUniqueError as e:
    print(f"Error: {e}")
