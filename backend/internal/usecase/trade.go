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
		GetSymbols(ctx context.Context) ([]domain.Symbol, error)
		GetPrice(ctx context.Context, symbol domain.Symbol) (domain.Price, error)
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

func (i *tradeInteractor) GetSymbols(ctx context.Context) ([]domain.Symbol, error) {
	symbols, err := i.exchangeAPI.GetSymbols(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get symbols: %w", err)
	}

	return symbols, nil
}

func (i *tradeInteractor) GetPrice(ctx context.Context, symbol domain.Symbol) (domain.Price, error) {
	price, err := i.exchangeAPI.GetPrice(ctx, symbol)
	if err != nil {
		if errors.Is(err, exchange.ErrNotFound) {
			return domain.Price{}, fmt.Errorf("%w: not found", ErrNotFound)
		}
		return domain.Price{}, fmt.Errorf("failed to get price: %w", err)
	}

	return price, nil
}
