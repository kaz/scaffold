package v1

import (
	"context"
	"fmt"

	"connectrpc.com/connect"
	"github.com/kaz/scaffold/backend/internal/domain"
	tradev1 "github.com/kaz/scaffold/backend/internal/gen/buf/trade/v1"
	"github.com/kaz/scaffold/backend/internal/gen/buf/trade/v1/tradev1connect"
	"github.com/kaz/scaffold/backend/internal/usecase"
	"google.golang.org/protobuf/proto"
)

type (
	tradeServiceHandler struct {
		usecase usecase.TradeUsecase
	}
)

func NewTradeServiceHandler(usecase usecase.TradeUsecase) tradev1connect.TradeServiceHandler {
	return &tradeServiceHandler{
		usecase: usecase,
	}
}

func (h *tradeServiceHandler) GetSymbols(ctx context.Context, req *connect.Request[tradev1.GetSymbolsRequest]) (*connect.Response[tradev1.GetSymbolsResponse], error) {
	symbols, err := h.usecase.GetSymbols(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get symbols: %w", err)
	}

	symbolsStr := make([]string, 0, len(symbols))
	for _, symbol := range symbols {
		symbolsStr = append(symbolsStr, symbol.String())
	}

	return connect.NewResponse(&tradev1.GetSymbolsResponse{
		Symbols: symbolsStr,
	}), nil
}

func (h *tradeServiceHandler) GetPrice(ctx context.Context, req *connect.Request[tradev1.GetPriceRequest]) (*connect.Response[tradev1.GetPriceResponse], error) {
	price, err := h.usecase.GetPrice(ctx, domain.Symbol(req.Msg.GetSymbol()))
	if err != nil {
		return nil, fmt.Errorf("failed to get price: %w", err)
	}

	return connect.NewResponse(&tradev1.GetPriceResponse{
		Bid: proto.Float64(price.Bid),
		Ask: proto.Float64(price.Ask),
	}), nil
}
