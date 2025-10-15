import os
import sys

# in order to import python module correctly
sys.path.insert(0, os.getcwd())

import datetime

from mongoengine import Document, NotUniqueError

from src.container import Container
from src.document import AthleticTrainer, Department, Equipment
from src.utils.hasher import hash_password

container = Container()
container.init_resources()
container.wire(modules=[sys.modules[__name__]])


def seed(doc: Document):
    try:
        doc.save()
    except NotUniqueError:
        print(f"Document {doc.__class__.__name__} already exists, skipping...")


if __name__ == "__main__":
    Equipment.ensure_indexes()
    seed(
        AthleticTrainer(
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
    )
    seed(
        Department(
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
    )

    seed(Equipment(name="冰桶", price_per_day=200, notes="冰塊自備"))
    seed(Equipment(name="長背板", price_per_day=500))
    seed(Equipment(name="擔架", price_per_day=300))
    seed(Equipment(name="治療床", price_per_day=1000))

    print("Seeding completed.")
