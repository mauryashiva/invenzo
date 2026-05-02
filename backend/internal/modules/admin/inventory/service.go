// internal/modules/admin/inventory/service.go
package inventory

import (
	"fmt"
	"time"

	"github.com/mauryashiva/invenzo-backend/internal/domain"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) AddUnit(req AddStockUnitRequest) (*domain.StockUnit, error) {
	unit := &domain.StockUnit{
		VariantID:    req.VariantID,
		SerialNumber: req.SerialNumber,
		IMEI1:        req.IMEI1,
		IMEI2:        req.IMEI2,
		Condition:    req.Condition,
		Status:       "In stock",
	}
	if err := s.repo.CreateUnit(unit); err != nil {
		return nil, err
	}
	return unit, nil
}

// BulkAdd — processes the paste from the frontend bulk input.
// SerialNumbers = barcodes (or serials), SecondaryIDs = IMEIs or Style Codes.
func (s *Service) BulkAdd(req BulkAddRequest) ([]domain.StockUnit, error) {
	units := make([]domain.StockUnit, 0, len(req.SerialNumbers))
	ts := time.Now().UnixMilli()

	for i, serial := range req.SerialNumbers {
		unit := domain.StockUnit{
			VariantID:    req.VariantID,
			SerialNumber: serial,
			Condition:    req.Condition,
			Status:       "In stock",
		}
		if i < len(req.SecondaryIDs) {
			unit.IMEI1 = req.SecondaryIDs[i]
		}
		unit.ID = fmt.Sprintf("unit-%d-%d", ts, i) // Will be overridden by BeforeCreate UUID
		units = append(units, unit)
	}

	if err := s.repo.BulkCreateUnits(units); err != nil {
		return nil, err
	}
	return units, nil
}

func (s *Service) ListUnits(query StockListQuery) ([]domain.StockUnit, int64, error) {
	return s.repo.FindUnits(query)
}

func (s *Service) UpdateUnit(id string, req UpdateStockUnitRequest) error {
	updates := map[string]interface{}{}
	if req.Condition != nil {
		updates["condition"] = *req.Condition
	}
	if req.Status != nil {
		updates["status"] = *req.Status
	}
	return s.repo.UpdateUnit(id, updates)
}

func (s *Service) DeleteUnit(id string) error {
	return s.repo.DeleteUnit(id)
}

func (s *Service) GetStockCount(variantID string) (int64, error) {
	return s.repo.CountByVariant(variantID)
}
