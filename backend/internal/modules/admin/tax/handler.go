// internal/modules/admin/tax/handler.go
package tax

import (
	"github.com/gofiber/fiber/v2"
	"github.com/mauryashiva/invenzo-backend/common/response"
)

type Handler struct {
	svc *Service
}

func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

// CalculateTax handles the POST /api/v1/admin/tax/calculate request
func (h *Handler) CalculateTax(c *fiber.Ctx) error {
	var req CalculateTaxRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	// ⚡ This literal now matches the TaxRequest struct in service.go exactly
	taxReq := TaxRequest{
		Department:   req.Department,
		Type:         req.Type,
		Category:     req.Category,
		SubCategory:  req.SubCategory, // Fixed: unknown field error resolved
		SellingPrice: req.SellingPrice,
	}

	res := TaxResponse{
		SalesGST: h.svc.CalculateSalesGST(taxReq),
		HSN:      h.svc.GenerateHSN(taxReq),
	}

	return response.Success(c, "Tax calculated successfully", res)
}