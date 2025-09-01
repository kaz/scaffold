package exchange

import (
	"context"

	"github.com/kaz/scaffold/backend/internal/domain"
)

type (
	API interface {
		GetPrice(ctx context.Context, symbol string) (domain.Price, error)
	}
)
