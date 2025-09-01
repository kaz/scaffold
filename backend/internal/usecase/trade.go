package usecase

import (
	"context"
	"errors"
	"fmt"

	"github.com/kaz/scaffold/backend/internal/domain"
	"github.com/kaz/scaffold/backend/internal/domain/exchange"
)

type (
	TradeUsecase interface {
		GetPrice(ctx context.Context, symbol string) (domain.Price, error)
	}

	tradeInteractor struct {
		exchangeAPI exchange.API
	}
)

func NewTradeUsecase(exchangeAPI exchange.API) TradeUsecase {
	return &tradeInteractor{
		exchangeAPI: exchangeAPI,
	}
}

func (i *tradeInteractor) GetPrice(ctx context.Context, symbol string) (domain.Price, error) {
	price, err := i.exchangeAPI.GetPrice(ctx, symbol)
	if err != nil {
		if errors.Is(err, exchange.ErrNotFound) {
			return domain.Price{}, fmt.Errorf("%w: not found", ErrNotFound)
		}
		return domain.Price{}, fmt.Errorf("failed to get price: %w", err)
	}

	return price, nil
}
