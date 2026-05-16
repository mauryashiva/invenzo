// internal/modules/admin/product/service.go
package product

import (
	"fmt"

	"github.com/mauryashiva/invenzo-backend/internal/domain"
	"github.com/mauryashiva/invenzo-backend/internal/modules/admin/media"
	"github.com/mauryashiva/invenzo-backend/internal/modules/admin/tax"
	"github.com/mauryashiva/invenzo-backend/pkg/utils"
	"gorm.io/gorm"
)

type Service struct {
	repo         *Repository
	taxService   *tax.Service
	mediaService *media.Service
	db           *gorm.DB // For transactions
}

func NewService(repo *Repository, mediaService *media.Service, db *gorm.DB) *Service {
	return &Service{
		repo:         repo,
		taxService:   tax.NewService(),
		mediaService: mediaService,
		db:           db,
	}
}

func (s *Service) Create(req CreateProductRequest) (*domain.Product, error) {
	var createdProduct *domain.Product

	// 🔒 DATABASE TRANSACTION
	err := s.db.Transaction(func(tx *gorm.DB) error {
		// 1. Resolve Representative Price for GST Slab calculation
		representativePrice := 0.0
		if len(req.Variants) > 0 {
			representativePrice = req.Variants[0].SellingPrice
		}

		// 2. BACKEND SOURCE OF TRUTH: Re-validate Tax & HSN
		taxReq := tax.TaxRequest{
			Department:   req.CategoryID,
			Type:         req.FashionType,
			Category:     req.Category,
			SubCategory:  req.Gender,
			SellingPrice: representativePrice,
		}
		autoSalesGST := s.taxService.CalculateSalesGST(taxReq)
		autoHSN := s.taxService.GenerateHSN(taxReq)

		// 3. Map Request to Domain Product
		product := &domain.Product{
			BrandID:          req.BrandID,
			Name:             req.Name,
			ModelNumber:      req.ModelNumber,
			StyleCode:        req.StyleCode,
			CategoryID:       req.CategoryID,
			FashionType:      req.FashionType,
			Gender:           req.Gender,
			Category:         req.Category,
			HSN:              autoHSN,
			PurchaseGST:      req.PurchaseGST,
			SalesGST:         autoSalesGST,
			Warranty:         req.Warranty,
			Occasion:         req.Occasion,
			Season:           req.Season,
			Fabric:           req.Fabric,
			CareInstructions: req.CareInstructions,
			Description:      req.Description,
			SelectedSizes:    req.SelectedSizes,
			SizeGuideData:    req.SizeGuideData,
			Features:         req.Features,
			IsActive:         true,
		}

		// 4. Map Tech Specs
		for _, spec := range req.Specs {
			product.Specs = append(product.Specs, domain.SpecEntry{
				Key:   spec.Key,
				Value: spec.Value,
			})
		}

		// 5. Map Variants & Generate SKUs
		for _, vd := range req.Variants {
			v := domain.Variant{
				Color:        vd.Color,
				ColorName:    vd.ColorName,
				BaseCost:     vd.BaseCost,
				SellingPrice: vd.SellingPrice,
				ReorderLevel: vd.ReorderLevel,
				Images:       vd.Images,
			}

			if vd.SKU != "" {
				v.SKU = vd.SKU
			} else {
				var skuAttrs []utils.AttributeDTO
				for _, a := range vd.Attributes {
					skuAttrs = append(skuAttrs, utils.AttributeDTO{Key: a.Key, Value: a.Value})
				}
				v.SKU = utils.GenerateSKU(req.BrandID, req.Name, vd.ColorName, skuAttrs)
			}

			for _, a := range vd.Attributes {
				v.Attributes = append(v.Attributes, domain.VariantAttribute{Key: a.Key, Value: a.Value})
			}
			product.Variants = append(product.Variants, v)
		}

		// 6. Create Product in DB within transaction
		if err := tx.Create(product).Error; err != nil {
			return err
		}

		// 7. Associate Product Media
		if len(req.MediaIDs) > 0 {
			if err := tx.Model(&domain.Media{}).
				Where("id IN ?", req.MediaIDs).
				Update("associated_id", product.ID).Error; err != nil {
				return fmt.Errorf("failed to associate product media: %w", err)
			}
		}

		// 8. Associate Variant Media
		for i, v := range product.Variants {
			if len(req.Variants[i].MediaIDs) > 0 {
				if err := tx.Model(&domain.Media{}).
					Where("id IN ?", req.Variants[i].MediaIDs).
					Update("associated_id", v.ID).Error; err != nil {
					return fmt.Errorf("failed to associate variant media: %w", err)
				}
			}
		}

		createdProduct = product
		return nil
	})

	if err != nil {
		return nil, err
	}

	return createdProduct, nil
}

func (s *Service) List(query ProductListQuery) ([]domain.Product, int64, error) {
	return s.repo.FindAll(query)
}

func (s *Service) GetByID(id string) (*domain.Product, error) {
	return s.repo.FindByID(id)
}

func (s *Service) Update(id string, req UpdateProductRequest) error {
	updates := map[string]interface{}{}
	if req.Name != nil {
		updates["name"] = *req.Name
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.IsActive != nil {
		updates["is_active"] = *req.IsActive
	}
	if req.PurchaseGST != nil {
		updates["purchase_gst"] = *req.PurchaseGST
	}
	if req.SalesGST != nil {
		updates["sales_gst"] = *req.SalesGST
	}

	// Handle Media Updates if provided
	if len(req.MediaIDs) > 0 {
		if err := s.db.Model(&domain.Media{}).
			Where("id IN ?", req.MediaIDs).
			Update("associated_id", id).Error; err != nil {
			return err
		}
	}

	return s.repo.Update(id, updates)
}

func (s *Service) Delete(id string) error {
	return s.repo.Delete(id)
}