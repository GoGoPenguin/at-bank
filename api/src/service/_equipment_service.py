from typing import List, cast

from src.document import Equipment


class EquipmentService:
    def get_equipments(self) -> List[Equipment]:
        return cast(List[Equipment], Equipment.objects())
