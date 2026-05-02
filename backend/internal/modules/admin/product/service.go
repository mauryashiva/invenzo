// internal/modules/admin/product/service.go
package product

import (
	"github.com/mauryashiva/invenzo-backend/internal/domain"
	"github.com/mauryashiva/invenzo-backend/pkg/utils"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Create(req CreateProductRequest) (*domain.Product, error) {
	product := &domain.Product{
		BrandID:          req.BrandID,
		Name:             req.Name,
		ModelNumber:      req.ModelNumber,
		StyleCode:        req.StyleCode,
		CategoryID:       req.CategoryID,
		FashionType:      req.FashionType,
		Gender:           req.Gender,
		Category:         req.Category,
		PurchaseGST:      req.PurchaseGST,
		SalesGST:         req.SalesGST,
		Warranty:         req.Warranty,
		Occasion:         req.Occasion,
		Season:           req.Season,
		Fabric:           req.Fabric,
		CareInstructions: req.CareInstructions,
		Description:      req.Description,
		SelectedSizes:    req.SelectedSizes,
		SizeGuideData:    req.SizeGuideData,
		Features:         req.Features,
	}

	// Map specs
	for _, s := range req.Specs {
		product.Specs = append(product.Specs, domain.SpecEntry{Key: s.Key, Value: s.Value})
	}

	// Map variants — auto-generate SKU if not provided
	for _, vd := range req.Variants {
		v := domain.Variant{
			Color:        vd.Color,
			ColorName:    vd.ColorName,
			BaseCost:     vd.BaseCost,
			SellingPrice: vd.SellingPrice,
			ReorderLevel: vd.ReorderLevel,
			Images:       vd.Images,
		}
		// SKU: use provided or auto-generate
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
	if req.SalesGST != nil {
		updates["sales_gst"] = *req.SalesGST
	}
	return s.repo.Update(id, updates)
}

func (s *Service) Delete(id string) error {
	return s.repo.Delete(id)
}
