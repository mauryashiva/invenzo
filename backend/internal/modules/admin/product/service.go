// internal/modules/admin/product/service.go
package product

import (
	"github.com/mauryashiva/invenzo-backend/internal/domain"
	"github.com/mauryashiva/invenzo-backend/internal/modules/admin/tax"
	"github.com/mauryashiva/invenzo-backend/pkg/utils"
)

type Service struct {
	repo       *Repository
	taxService *tax.Service
}

func NewService(repo *Repository) *Service {
	return &Service{
		repo:       repo,
		taxService: tax.NewService(),
	}
}

func (s *Service) Create(req CreateProductRequest) (*domain.Product, error) {
	// 1. Resolve Representative Price for GST Slab calculation
	// Real-world logic: The tax slab (5% vs 12%) is often determined by the selling price.
	representativePrice := 0.0
	if len(req.Variants) > 0 {
		representativePrice = req.Variants[0].SellingPrice
	}

	// 2. Prepare Tax Request for automatic HSN and SalesGST generation
	taxReq := tax.TaxRequest{
		Department:   req.CategoryID,
		Type:         req.FashionType,
		Category:     req.Category,
		SubCategory:  req.Gender, // This maps to gender in your 3-tier system
		SellingPrice: representativePrice,
	}

	// 3. Centralized logic: Automatic generation of tax data
	autoSalesGST := s.taxService.CalculateSalesGST(taxReq)
	autoHSN := s.taxService.GenerateHSN(taxReq)

	// 4. Map Request to Domain Product
	product := &domain.Product{
		BrandID:          req.BrandID,
		Name:             req.Name,
		ModelNumber:      req.ModelNumber,
		StyleCode:        req.StyleCode,
		CategoryID:       req.CategoryID,
		FashionType:      req.FashionType,
		Gender:           req.Gender,
		Category:         req.Category,
		HSN:              autoHSN,         // System-generated
		PurchaseGST:      req.PurchaseGST, // Admin-editable (Input GST)
		SalesGST:         autoSalesGST,    // System-generated (Output GST)
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

	// 5. Map Tech Specs (for Electronics)
	for _, spec := range req.Specs {
		product.Specs = append(product.Specs, domain.SpecEntry{
			Key:   spec.Key,
			Value: spec.Value,
		})
	}

	// 6. Map Variants & Generate SKUs
	for _, vd := range req.Variants {
		v := domain.Variant{
			Color:        vd.Color,
			ColorName:    vd.ColorName,
			BaseCost:     vd.BaseCost,
			SellingPrice: vd.SellingPrice,
			ReorderLevel: vd.ReorderLevel,
			Images:       vd.Images,
		}

		// SKU logic: Use manual SKU if provided, else auto-generate using industry standard
		if vd.SKU != "" {
			v.SKU = vd.SKU
		} else {
			var skuAttrs []utils.AttributeDTO
			for _, a := range vd.Attributes {
				skuAttrs = append(skuAttrs, utils.AttributeDTO{
					Key:   a.Key,
					Value: a.Value,
				})
			}
			// One-line change SKU generation logic
			v.SKU = utils.GenerateSKU(req.BrandID, req.Name, vd.ColorName, skuAttrs)
		}

		// Map Variant Attributes (RAM/Storage or Size/Fit)
		for _, a := range vd.Attributes {
			v.Attributes = append(v.Attributes, domain.VariantAttribute{
				Key:   a.Key,
				Value: a.Value,
			})
		}
		product.Variants = append(product.Variants, v)
	}

	// 7. Persist to Database
	if err := s.repo.Create(product); err != nil {
		return nil, err
	}
	
	return product, nil
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
	// Note: SalesGST can be updated manually if there is a legal override
	if req.SalesGST != nil {
		updates["sales_gst"] = *req.SalesGST
	}
	return s.repo.Update(id, updates)
}

func (s *Service) Delete(id string) error {
	return s.repo.Delete(id)
}