package exchange

import (
	"context"

	"github.com/kaz/scaffold/backend/internal/domain"
)

type (
	API interface {
		GetSymbols(ctx context.Context) ([]domain.Symbol, error)
		GetPrice(ctx context.Context, symbol domain.Symbol) (domain.Price, error)
	}
)
