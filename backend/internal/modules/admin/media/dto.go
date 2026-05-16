package media

type UploadResponse struct {
	ID       string `json:"id"`
	URL      string `json:"url"`
	PublicID string `json:"public_id"`
	Type     string `json:"file_type"`
}

type MediaDTO struct {
	ID           string  `json:"id"`
	URL          string  `json:"url"`
	FileType     string  `json:"file_type"`
	AssociatedID *string `json:"associated_id,omitempty"`
}
