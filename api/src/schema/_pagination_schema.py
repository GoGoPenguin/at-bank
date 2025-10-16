from typing import List

from pydantic import BaseModel, Field


class PaginationSchema(BaseModel):
    data: List = Field(description="List of items on the current page")
    total_items: int = Field(description="Total number of items", ge=0)
    total_pages: int = Field(description="Total number of pages", ge=0)
