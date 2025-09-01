package exchange

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"

	"github.com/kaz/scaffold/backend/internal/domain"
	"github.com/kaz/scaffold/backend/internal/domain/exchange"
	"github.com/kaz/scaffold/backend/internal/infra"
)

type (
	GmoCoinAPIConfig struct {
		BaseURL string `kong:"env=BASE_URL"`
	}
	gmoCoinAPI struct {
		baseURL *url.URL
	}

	tickerResponse struct {
		Data []struct {
			Bid string `json:"bid"`
			Ask string `json:"ask"`
		} `json:"data"`
	}
)

func (c GmoCoinAPIConfig) newFromConfig(_ context.Context) (exchange.API, error) {
	if c.BaseURL == "" {
		return nil, infra.ErrNotConfigured
	}

	baseURL, err := url.Parse(c.BaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse base URL: %w", err)
	}

	return &gmoCoinAPI{
		baseURL: baseURL,
	}, nil
}

func (a *gmoCoinAPI) GetPrice(ctx context.Context, symbol string) (domain.Price, error) {
	endpoint := a.baseURL.JoinPath("/public/v1/ticker")

	q := endpoint.Query()
	q.Set("symbol", symbol)
	endpoint.RawQuery = q.Encode()

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint.String(), nil)
	if err != nil {
		return domain.Price{}, fmt.Errorf("failed to create request: %w", err)
	}

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return domain.Price{}, fmt.Errorf("failed to get price: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		if response.StatusCode == http.StatusNotFound {
			return domain.Price{}, fmt.Errorf("%w: not found", exchange.ErrNotFound)
		}

		return domain.Price{}, fmt.Errorf("%w: failed to get price: %s", exchange.ErrInternal, response.Status)
	}

	var tickerResponse tickerResponse
	if err := json.NewDecoder(response.Body).Decode(&tickerResponse); err != nil {
		return domain.Price{}, fmt.Errorf("failed to decode response: %w", err)
	}

	if len(tickerResponse.Data) != 1 {
		return domain.Price{}, fmt.Errorf("%w: unexpected number of data: %d", exchange.ErrInternal, len(tickerResponse.Data))
	}

	bid, err := strconv.ParseFloat(tickerResponse.Data[0].Bid, 64)
	if err != nil {
		return domain.Price{}, fmt.Errorf("failed to parse bid: %w", err)
	}

	ask, err := strconv.ParseFloat(tickerResponse.Data[0].Ask, 64)
	if err != nil {
		return domain.Price{}, fmt.Errorf("failed to parse ask: %w", err)
	}

	return domain.Price{
		Bid: bid,
		Ask: ask,
	}, nil
}
