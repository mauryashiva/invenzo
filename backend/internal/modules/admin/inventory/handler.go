// internal/modules/admin/inventory/handler.go
package inventory

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/mauryashiva/invenzo-backend/common/response"
)

type Handler struct {
	service  *Service
	validate *validator.Validate
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service, validate: validator.New()}
}

// ListUnits  GET /api/v1/admin/inventory/units?variant_id=xxx
func (h *Handler) ListUnits(c *fiber.Ctx) error {
	var q StockListQuery
	if err := c.QueryParser(&q); err != nil {
		return response.BadRequest(c, "Invalid query params")
	}
	units, total, err := h.service.ListUnits(q)
	if err != nil {
		return response.InternalError(c, err)
	}
	return response.Success(c, "Stock units fetched", fiber.Map{
		"total": total,
		"units": units,
	})
}

// AddUnit  POST /api/v1/admin/inventory/units
func (h *Handler) AddUnit(c *fiber.Ctx) error {
	var req AddStockUnitRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, err.Error())
	}
	unit, err := h.service.AddUnit(req)
	if err != nil {
		return response.InternalError(c, err)
	}
	return response.Created(c, "Stock unit added", unit)
}

// BulkAdd  POST /api/v1/admin/inventory/units/bulk
func (h *Handler) BulkAdd(c *fiber.Ctx) error {
	var req BulkAddRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, err.Error())
	}
	units, err := h.service.BulkAdd(req)
	if err != nil {
		return response.InternalError(c, err)
	}
	return response.Created(c, "Bulk units added", fiber.Map{
		"count": len(units),
		"units": units,
	})
}

// UpdateUnit  PATCH /api/v1/admin/inventory/units/:id
func (h *Handler) UpdateUnit(c *fiber.Ctx) error {
	id := c.Params("id")
	var req UpdateStockUnitRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}
	if err := h.service.UpdateUnit(id, req); err != nil {
		return response.InternalError(c, err)
	}
	return response.Success(c, "Stock unit updated", nil)
}

// DeleteUnit  DELETE /api/v1/admin/inventory/units/:id
func (h *Handler) DeleteUnit(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := h.service.DeleteUnit(id); err != nil {
		return response.InternalError(c, err)
	}
	return response.Success(c, "Stock unit removed", nil)
}

// StockCount  GET /api/v1/admin/inventory/units/count?variant_id=xxx
func (h *Handler) StockCount(c *fiber.Ctx) error {
	variantID := c.Query("variant_id")
	if variantID == "" {
		return response.BadRequest(c, "variant_id is required")
	}
	count, err := h.service.GetStockCount(variantID)
	if err != nil {
		return response.InternalError(c, err)
	}
	return response.Success(c, "Stock count", fiber.Map{"count": count})
}
