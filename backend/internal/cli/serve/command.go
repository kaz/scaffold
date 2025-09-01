package serve

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"connectrpc.com/connect"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/kaz/scaffold/backend/internal/controller/interceptor"
	tradev1 "github.com/kaz/scaffold/backend/internal/controller/trade/v1"
	"github.com/kaz/scaffold/backend/internal/gen/buf/trade/v1/tradev1connect"
	"github.com/kaz/scaffold/backend/internal/infra/exchange"
	"github.com/kaz/scaffold/backend/internal/usecase"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

type (
	Command struct {
		Port int `kong:"env=PORT,default=50051"`

		ExchangeAPI exchange.APIConfig `kong:"embed,prefix=exchange-api-,envprefix=EXCHANGE_API_"`
	}
)

func (c *Command) Run() error {
	ctx := context.Background()

	exchangeAPI, err := exchange.NewAPI(ctx, c.ExchangeAPI)
	if err != nil {
		return fmt.Errorf("failed to create exchange api: %w", err)
	}

	r := chi.NewRouter()
	r.Use(
		middleware.RealIP,
		middleware.Logger,
		middleware.Recoverer,
	)

	r.Mount(
		tradev1connect.NewTradeServiceHandler(
			tradev1.NewTradeServiceHandler(usecase.NewTradeUsecase(exchangeAPI)),
			connect.WithInterceptors(
				interceptor.NewErrorHandleInterceptor(),
			),
		),
	)

	server := &http.Server{
		Addr:              fmt.Sprintf(":%d", c.Port),
		Handler:           h2c.NewHandler(r, &http2.Server{}),
		ReadHeaderTimeout: 10 * time.Second,
	}

	slog.InfoContext(ctx, "serving", slog.String("address", server.Addr))
	if err := server.ListenAndServe(); err != nil {
		return fmt.Errorf("failed to serve: %w", err)
	}
	return nil
}
