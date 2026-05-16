package media

import (
	"github.com/gofiber/fiber/v2"
	"github.com/mauryashiva/invenzo-backend/common/response"
	"github.com/mauryashiva/invenzo-backend/pkg/utils"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// Upload  POST /api/v1/admin/media/upload
func (h *Handler) Upload(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return response.BadRequest(c, "No file provided")
	}

	// Optional path metadata from form
	department := c.FormValue("department", "general")
	prodType := c.FormValue("type", "misc")
	gender := c.FormValue("gender", "")
	category := c.FormValue("category", "unassigned")
	productName := c.FormValue("product_name", "temp")
	fileContext := c.FormValue("context", "") // e.g. "titanium-black"

	path := utils.GenerateStoragePath(department, prodType, gender, category, productName)

	res, err := h.service.Upload(c.Context(), file, path, fileContext)
	if err != nil {
		return response.InternalError(c, err)
	}

	return response.Created(c, "File uploaded successfully", res)
}

// Delete  DELETE /api/v1/admin/media/:id
func (h *Handler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := h.service.DeleteMediaRecord(c.Context(), id); err != nil {
		return response.InternalError(c, err)
	}
	return response.Success(c, "Media deleted successfully", nil)
}
