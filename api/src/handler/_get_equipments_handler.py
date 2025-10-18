from typing import List

from dependency_injector.wiring import Provide

from src.schema import EquipmentSchema
from src.service import EquipmentService


class GetEquipmentsHandler:
    equipment_service: EquipmentService = Provide["equipment_service"]

    async def handle(self) -> List[EquipmentSchema]:
        return [
            EquipmentSchema(**equipment.to_dict())
            for equipment in self.equipment_service.get_equipments()
        ]
