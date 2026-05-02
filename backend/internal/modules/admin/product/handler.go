// internal/modules/admin/product/handler.go
package product

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

// List  GET /api/v1/admin/products
func (h *Handler) List(c *fiber.Ctx) error {
	var q ProductListQuery
	if err := c.QueryParser(&q); err != nil {
		return response.BadRequest(c, "Invalid query params")
	}
	products, total, err := h.service.List(q)
	if err != nil {
		return response.InternalError(c, err)
	}
	return response.Success(c, "Products fetched", fiber.Map{
		"total":    total,
		"products": products,
	})
}

// GetByID  GET /api/v1/admin/products/:id
func (h *Handler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	product, err := h.service.GetByID(id)
	if err != nil {
		return response.NotFound(c, "Product not found")
	}
	return response.Success(c, "Product fetched", product)
}

// Create  POST /api/v1/admin/products
func (h *Handler) Create(c *fiber.Ctx) error {
	var req CreateProductRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}
	if err := h.validate.Struct(req); err != nil {
		return response.BadRequest(c, err.Error())
	}
	product, err := h.service.Create(req)
	if err != nil {
		return response.InternalError(c, err)
	}
	return response.Created(c, "Product created", product)
}

// Update  PUT /api/v1/admin/products/:id
func (h *Handler) Update(c *fiber.Ctx) error {
	id := c.Params("id")
	var req UpdateProductRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}
	if err := h.service.Update(id, req); err != nil {
		return response.InternalError(c, err)
	}
	return response.Success(c, "Product updated", nil)
}

// Delete  DELETE /api/v1/admin/products/:id
func (h *Handler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := h.service.Delete(id); err != nil {
		return response.InternalError(c, err)
	}
	return response.Success(c, "Product deleted", nil)
}
