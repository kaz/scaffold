package exchange

import (
	"context"
	"errors"

	"github.com/kaz/scaffold/backend/internal/domain/exchange"
	"github.com/kaz/scaffold/backend/internal/infra"
)

type (
	APIConfig struct {
		GmoCoin GmoCoinAPIConfig `kong:"embed,prefix=gmo-coin-,envprefix=GMO_COIN_"`
	}
)

func NewAPI(ctx context.Context, config APIConfig) (exchange.API, error) {
	if service, err := config.GmoCoin.newFromConfig(ctx); !errors.Is(err, infra.ErrNotConfigured) {
		return service, err
	}
	return nil, infra.ErrNotConfigured
}
